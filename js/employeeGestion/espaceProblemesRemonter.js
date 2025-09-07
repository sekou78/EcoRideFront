const pseudoEmployeEspaceProblemesRemonterDisplay = document.getElementById(
  "employee-espace-probles-remonter-pseudo-display"
);

const token = getCookie(tokenCookieName);

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

// Récupération des infos de l'utilisateur connecté
fetch(apiUrl + "account/me", requestOptions)
  .then((response) => {
    if (!response.ok) {
      return response.json().then((errorData) => {
        // redirige si suspendu
        compteSuspendu(errorData);
        throw new Error(
          "Impossible de charger les informations de l'utilisateur."
        );
      });
    }
    return response.json();
  })
  .then((user) => {
    // Affichage des infos utilisateur
    pseudoEmployeEspaceProblemesRemonterDisplay.textContent = user.user.pseudo;
  });

// Appel de la fonction d'affichage
initEspaceProblemesRemonter();

function initEspaceProblemesRemonter() {
  const accordionContainer = document.getElementById("accordionFlushExample");
  if (!accordionContainer) {
    console.warn("Accordéon non trouvé");
    return;
  }

  let problemes = [];
  try {
    const saved = JSON.parse(localStorage.getItem("problemeSelectionne"));

    if (saved) {
      problemes = [saved];
    }
  } catch (error) {
    console.error("Erreur JSON parse:", error);
    afficherErreurModalEspaceProblemesRemonter(
      "Erreur lors de la récupération des problèmes. Veuillez réessayer plus tard."
    );
  }

  // Lire l'id (ex: #CV123456)
  const hash = window.location.hash.replace("#", "");

  // Si l'id est présent, on filtre sur le champ codeProbleme
  if (hash) {
    problemes = problemes.filter((p) => p.codeProbleme === hash);
  }

  // Filtrer sur les critères de visibilité et refus
  problemes = problemes.filter(
    (p) => p.isVisible === false && p.isRefused === false
  );

  // Si aucun problème trouvé
  if (!Array.isArray(problemes) || problemes.length === 0) {
    accordionContainer.innerHTML = `
      <div class="alert alert-warning text-center mt-3">
        Aucun problème trouvé pour cet identifiant.
      </div>`;
    return;
  }

  // Affichage
  accordionContainer.innerHTML = "";

  problemes.forEach((probleme) => {
    const collapseId = `flush-${probleme.codeProbleme}`;
    const headerId = `header-${probleme.codeProbleme}`;
    const isOpen = hash && hash === probleme.codeProbleme ? "show" : "";

    const item = document.createElement("div");
    item.className = "accordion-item mb-4";

    item.innerHTML = `
      <h2 class="accordion-header" id="${headerId}">
        <button class="accordion-button" type="button" data-bs-toggle="collapse"
          data-bs-target="#${collapseId}" aria-expanded="true" aria-controls="${collapseId}">
          🚨 ${probleme.codeProbleme}
        </button>
      </h2>
      <div id="${collapseId}" class="accordion-collapse collapse ${isOpen}" aria-labelledby="${headerId}"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body">
          <p><strong>👤 Passager :</strong> ${probleme.user?.pseudo || "?"}</p>
          <p><strong>📧 Email passager :</strong> ${
            probleme.user?.email || "?"
          }</p>
          <p><strong>👤 Chauffeur :</strong> ${
            probleme.reservation?.trajet?.chauffeur?.pseudo || "?"
          }</p>
          <p><strong>📧 Email chauffeur :</strong> ${
            probleme.reservation?.trajet?.chauffeur?.email || "?"
          }</p>
          <p><strong>📆 Départ :</strong> ${
            formatDateFR(probleme.reservation?.trajet?.dateDepart) || "?"
          }</p>
          <p><strong>📆 Arrivée :</strong> ${
            formatDateFR(probleme.reservation?.trajet?.dateArrivee) || "?"
          }</p>
          <p><strong>📍 Lieu de départ :</strong> ${
            probleme.reservation?.trajet?.adresseDepart || "?"
          }</p>
          <p><strong>📍 Lieu d’arrivée :</strong> ${
            probleme.reservation?.trajet?.adresseArrivee || "?"
          }</p>
          <p><strong>⏰ Heure départ :</strong> ${
            formatHeure(probleme.reservation?.trajet?.heureDepart) || "?"
          }</p>
          <p><strong>🕒 Durée (estimée) :</strong> ${
            formatHeure(probleme.reservation?.trajet?.dureeVoyage) || "?"
          }</p>
          <p><strong>💬 Description :</strong> ${
            probleme.commentaire || "?"
          }</p>
          <div class="d-flex justify-content-center gap-2 mt-4">
            <button type="button" class="btn btn-success text-primary mb-3 btn-valid" data-id="${
              probleme.id
            }">Valider</button>
            <button type="button" class="btn btn-red text-primary mb-3 btn-refuse" data-id="${
              probleme.id
            }">Refuser</button>
          </div>
        </div>
      </div>
    `;

    accordionContainer.appendChild(item);
  });

  // Gestion des boutons "Valider" / "Refuser"
  accordionContainer.addEventListener("click", function (event) {
    const button = event.target;
    if (button.classList.contains("btn-valid")) {
      validerAvis(button);
    } else if (button.classList.contains("btn-refuse")) {
      refuserAvis(button);
    }
  });
}

function validerAvis(button) {
  const container = button.closest(".accordion-item");
  if (container) {
    const problemeId = button.getAttribute("data-id");
    afficherErreurModalEspaceProblemesRemonter("Avis validé avec succès.");

    const token = getCookie(tokenCookieName);
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", token);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(apiUrl + `avis/employee/validate-avis/${problemeId}`, requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de la validation");
        return response.json();
      })
      .then((result) => {
        afficherErreurModalEspaceProblemesRemonter("Avis validé avec succès.");
        container.remove();
        window.location.href = "/espaceEmployee";
      })
      .catch((error) => {
        console.error("Erreur validation :", error);
        afficherErreurModalEspaceProblemesRemonter(
          "Une erreur est survenue lors de la validation de l'avis. Veuillez réessayer plus tard."
        );
      });
  }
}

function refuserAvis(button) {
  const container = button.closest(".accordion-item");
  if (container) {
    const problemeId = button.getAttribute("data-id");
    afficherErreurModalEspaceProblemesRemonter("Avis refusé avec succès.");

    const token = getCookie(tokenCookieName);
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", token);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(apiUrl + `avis/employee/refuse-avis/${problemeId}`, requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de la validation");
        return response.json();
      })
      .then((result) => {
        afficherErreurModalEspaceProblemesRemonter("Avis refusé avec succès.");
        container.remove();
        window.location.href = "/espaceEmployee";
      })
      .catch((error) => {
        console.error("Erreur validation :", error);
        afficherErreurModalEspaceProblemesRemonter(
          "Une erreur est survenue lors du refus de l'avis. Veuillez réessayer plus tard."
        );
      });
  }
}

// Fonction pour convertir la date en format ISO (dd-mm-yyyy)
function formatDateFR(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Fonction pour convertir l'heure en format ISO (hh:mm)
function formatHeure(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function afficherErreurModalEspaceProblemesRemonter(message) {
  const errorModalBody = document.getElementById(
    "errorModalBodyEspaceProblemesRemonter"
  );
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
