const pseudoEmployeDisplay = document.getElementById("employee-pseudo-display");

const token = getCookie(tokenCookieName);

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

// 1er appel API : récupérer les infos de l'utilisateur connecté
fetch(apiUrl + "account/me", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        "Impossible de charger les informations de l'utilisateur."
      );
    }
    return response.json();
  })
  .then((user) => {
    console.log(user);

    // Affichage des infos utilisateur
    pseudoEmployeDisplay.textContent = user.user.pseudo;
  });

// Conteneurs HTML
const avisContainer = document.getElementById("avis-container");
const covoituragesContainer = document.getElementById(
  "covoiturages-problemes-container"
);

// 2e Appel API : récupération des avis
fetch(apiUrl + "avis/", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log("Avis reçus depuis l’API :", result);

    // Stockage en local storage
    localStorage.setItem("commentairesAvis", JSON.stringify(result));

    result
      .filter((avis) => avis.isVisible === false && avis.isRefused === false)
      .forEach((avis) => {
        const note = parseInt(avis.note);
        let container = null;

        if (note >= 0 && note <= 2) {
          container = covoituragesContainer;

          const uniqueId = "CV" + Math.floor(100000 + Math.random() * 900000);
          avis.codeProbleme = uniqueId;

          // Enregistrer directement l'objet avis avec l'ID dans le localStorage
          const problemes =
            JSON.parse(localStorage.getItem("problemesRemonter")) || [];
          problemes.push(avis); // Pas besoin de créer un objet à part
          localStorage.setItem("problemesRemonter", JSON.stringify(problemes));
        } else if (note >= 3 && note <= 5) {
          container = avisContainer;
        }

        if (!container) return;

        const avisDiv = document.createElement("div");
        avisDiv.className = "mb-3";

        // Récupérer le pseudo du chauffeur
        const pseudoChauffeur =
          avis.reservation?.trajet?.chauffeur?.pseudo || "Inconnu";

        // Récupérer le pseudo du passager qui emet l'avis
        const pseudoPassager = avis.user?.pseudo || "Inconnu";

        avisDiv.innerHTML = `
        <p><strong>👤 Pseudo passager :</strong> <span class="pseudo">${
          pseudoPassager || "Inconnu"
        }</span></p>
        <p><strong>👤 Pseudo chauffeur :</strong> <span class="pseudo">${
          pseudoChauffeur || "Inconnu"
        }</span></p>
        <p><strong>⭐ Note :</strong> ${note}</p>
        <p><strong>💬 Avis :</strong> <span class="commentaire">${
          avis.commentaire
        }</span></p>
        ${
          avis.codeProbleme
            ? `<p><strong>🆔 Identifiant problème :</strong> <span class="text-danger">
              <a href="/espaceProblemesRemonter#${avis.codeProbleme}" 
                class="text-danger lien-probleme" 
                data-probleme-id="${avis.codeProbleme}">
                ${avis.codeProbleme}
              </a></span></p>`
            : ""
        }
        ${
          note >= 3 && note <= 5
            ? `<div class="d-flex justify-content-center gap-2">
                <button type="button" class="btn btn-success text-primary btn-valid" data-id="${avis.id}">Valider</button>
                <button type="button" class="btn bg-danger text-primary btn-refuse" data-id="${avis.id}">Refuser</button>
              </div>`
            : ""
        }
        <hr />
      `;

        container.appendChild(avisDiv);
      });
  })
  .catch((error) => console.error("Erreur API avis :", error));

// Gestion des boutons et du lien "codeProbleme"
function handleAvisActions(event) {
  const target = event.target;

  // Boutons de validation/refus
  if (target.classList.contains("btn-valid")) {
    validerAvis(target);
  } else if (target.classList.contains("btn-refuse")) {
    refuserAvis(target);
  }

  // Lien vers le problème
  if (target.classList.contains("lien-probleme")) {
    event.preventDefault();

    const code = target.dataset.problemeId;

    // On récupère tous les problèmes existants
    const problemes =
      JSON.parse(localStorage.getItem("problemesRemonter")) || [];

    // On cherche celui qui correspond à l'identifiant cliqué
    const probleme = problemes.find(
      (p) => p.codeProbleme === code || p.id === code
    );

    if (probleme) {
      // Sauvegarde du problème sélectionné dans un nouveau localStorage
      localStorage.setItem("problemeSelectionne", JSON.stringify(probleme));
    }

    // Redirection vers la page avec le hash
    window.location.href = `/espaceProblemesRemonter#${code}`;
  }
}

// Gestion des boutons dynamiques
avisContainer.addEventListener("click", handleAvisActions);
covoituragesContainer.addEventListener("click", handleAvisActions);

function validerAvis(button) {
  const avisBlock = button.closest(".mb-3");
  if (!avisBlock) return;

  const avisId = button.getAttribute("data-id");
  console.log("ID de l'avis validé :", avisId);

  const token = getCookie(tokenCookieName);
  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(apiUrl + `avis/employee/validate-avis/${avisId}`, requestOptions)
    .then((response) => {
      if (!response.ok) throw new Error("Erreur lors de la validation");
      return response.json();
    })
    .then((result) => {
      console.log("Avis validé avec succès :", result);
      avisBlock.remove();
    })
    .catch((error) => console.error("Erreur validation :", error));
}

function refuserAvis(button) {
  const avisBlock = button.closest(".mb-3");
  if (!avisBlock) return;

  const avisId = button.getAttribute("data-id");
  console.log("ID de l'avis refusé :", avisId);

  const token = getCookie(tokenCookieName);
  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(apiUrl + `avis/employee/refuse-avis/${avisId}`, requestOptions)
    .then((response) => {
      if (!response.ok) throw new Error("Erreur lors du refus");
      return response.json();
    })
    .then((result) => {
      console.log("Avis refusé avec succès :", result);
      avisBlock.remove();
    })
    .catch((error) => console.error("Erreur refus :", error));
}
