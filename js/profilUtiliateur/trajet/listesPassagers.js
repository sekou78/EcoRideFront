let actionEnCours = null;
let selectedPassagerId = null;

const token = getCookie(tokenCookieName);

const urlParams = new URLSearchParams(window.location.search);
const trajetId = urlParams.get("id");

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

if (trajetId) {
  fetch(apiUrl + `trajet/passagersFilter/${trajetId}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        // Affichage d'un message utilisateur si 404
        const ul = document.getElementById("liste-passagers");
        ul.innerHTML = `<li>Impossible de charger la liste des passagers (erreur ${response.status})</li>`;
        throw new Error("Erreur HTTP : " + response.status);
      }
      return response.json();
    })
    .then((passagers) => {
      const ul = document.getElementById("liste-passagers");
      ul.innerHTML = "";

      if (!Array.isArray(passagers) || passagers.length === 0) {
        ul.innerHTML = `<li>Aucun passager pour ce trajet</li>`;
        return;
      }

      passagers.forEach((passager) => {
        const li = document.createElement("li");
        li.className = "list-group-item px-2";

        const imageUrl = passager.image;

        //Affichage du role sans le prefixe "ROLE_"
        const roleAffiche = passager.roles[0].replace("ROLE_", "");

        li.innerHTML = `
          <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap">
            <div class="d-flex align-items-center gap-3">
              <img
                class="rounded-circle border imgListesPassagers"
                  src="${imageUrl || "/images/default-avatar.png"}"
                  alt="Avatar de ${passager.prenom}"
              >

              <div>
                <div class="fw-semibold fs-6 mb-1">${passager.prenom}</div>
                <div class="text-muted small">📱 ${passager.telephone}</div>
              </div>
            </div>

            <div class="d-flex align-items-center justify-content-between w-100 flex-wrap">
              <span class="badge bg-dark rounded-pill px-3 py-2">🚗 ${roleAffiche}</span>

              <div class="d-flex gap-2">
                <button class="btn bg-success btn-sm rounded-circle d-flex align-items-center justify-content-center buttonListesPassagers"
                        title="Accepter"
                        data-action="accepter"
                        data-id="${passager.id}">
                  <i class="bi bi-check-lg text-white"></i>
                </button>

                <button class="btn bg-danger btn-sm rounded-circle d-flex align-items-center justify-content-center buttonListesPassagers"
                        title="Refuser"
                        data-action="refuser"
                        data-id="${passager.id}">
                  <i class="bi bi-x-lg text-white"></i>
                </button>
              </div>
            </div>
          </div>
        `;

        ul.appendChild(li);

        //Écouteurs ajoutés pour CHAQUE passager
        const btnAccepter = li.querySelector('button[data-action="accepter"]');
        const btnRefuser = li.querySelector('button[data-action="refuser"]');

        btnAccepter.addEventListener("click", () => {
          const id = btnAccepter.getAttribute("data-id");
          ouvrirConfirmationModal("accepter", id);
        });

        btnRefuser.addEventListener("click", () => {
          const id = btnRefuser.getAttribute("data-id");
          ouvrirConfirmationModal("refuser", id);
        });
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des passagers :", error);
    });
}

function accepterPassager(trajetId, passagerId) {
  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  fetch(`${apiUrl}trajet/accepter/${trajetId}/passagers/${passagerId}`, {
    method: "POST",
    headers: myHeaders,
  })
    .then((response) => response.json())
    .then((result) => {
      document.querySelector(
        `button[data-id="${passagerId}"][data-action="accepter"]`
      ).disabled = true;
      document.querySelector(
        `button[data-id="${passagerId}"][data-action="refuser"]`
      ).disabled = true;

      showFeedbackModal(result.message || "Passager accepté avec succès.");
    })
    .catch((error) => {
      console.error(error);
      showFeedbackModal("Une erreur est survenue.", false);
    });
}

function refuserPassager(trajetId, passagerId) {
  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  fetch(`${apiUrl}trajet/refuser/${trajetId}/passagers/${passagerId}`, {
    method: "POST",
    headers: myHeaders,
  })
    .then((response) => response.json())
    .then((result) => {
      const btn = document.querySelector(
        `button[data-id="${passagerId}"][data-action="refuser"]`
      );
      const li = btn.closest("li");
      if (li) li.remove();

      const ul = document.getElementById("liste-passagers");
      if (ul.children.length === 0) {
        ul.innerHTML = `<li>Aucun passager pour ce trajet</li>`;
      }

      showFeedbackModal(result.message || "Passager refusé avec succès.");
    })
    .catch((error) => {
      console.error(error);
      showFeedbackModal("Erreur lors du refus du passager.", false);
    });
}

//Fonction pour ouvrir la modal
function ouvrirConfirmationModal(action, passagerId) {
  selectedPassagerId = passagerId;
  actionEnCours = action;

  const modalText =
    action === "accepter"
      ? "Voulez-vous vraiment <strong>accepter</strong> ce passager ?"
      : "Voulez-vous vraiment <strong>refuser</strong> ce passager ?";

  document.getElementById("modalBody").innerHTML = modalText;
  const modal = new bootstrap.Modal(
    document.getElementById("confirmationModal")
  );
  modal.show();

  const confirmBtn = document.getElementById("confirmModalBtn");
  confirmBtn.className = `btn bg-${
    action === "accepter" ? "success" : "danger"
  }`;
  confirmBtn.addEventListener(
    "click",
    () => {
      if (actionEnCours === "accepter") {
        accepterPassager(trajetId, selectedPassagerId);
      } else {
        refuserPassager(trajetId, selectedPassagerId);
      }
      modal.hide();
    },
    { once: true }
  );
}

function showFeedbackModal(message, isSuccess = true) {
  const modalElement = document.getElementById("feedbackModal");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const modalHeader = modalElement.querySelector(".modal-header");

  // Couleur selon succès ou erreur
  modalHeader.classList.toggle("bg-success", isSuccess);
  modalHeader.classList.toggle("bg-danger", !isSuccess);

  feedbackMessage.innerText = message;

  // Afficher la modal avec Bootstrap
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
