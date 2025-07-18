const urlParams = new URLSearchParams(window.location.search);
const pseudo = urlParams.get("pseudo");
const chauffeurPseudoDisplay = document.getElementById("chauffeurPseudo");
const listeAvis = document.getElementById("listeAvisChauffeur");
const trajetId = urlParams.get("trajetId");
const reservationId = urlParams.get("reservationId");

const boutonRetour = document.getElementById("btnRetourDetaillee");

if (trajetId) {
  boutonRetour.href = `/vueDetaillee?id=${encodeURIComponent(trajetId)}`;
} else if (reservationId) {
  boutonRetour.href = `/vueReservation?id=${encodeURIComponent(reservationId)}`;
} else {
  boutonRetour.href = "/";
}

if (!pseudo) {
  if (chauffeurPseudoDisplay) chauffeurPseudoDisplay.textContent = "inconnu";
  if (listeAvis) {
    listeAvis.innerHTML = `<li class="list-group-item text-danger">Pseudo non spécifié dans l'URL.</li>`;
  }
} else {
  if (chauffeurPseudoDisplay) chauffeurPseudoDisplay.textContent = pseudo;

  fetch(apiUrl + "avis/avisVisible")
    .then((response) => response.json())
    .then((avisList) => {
      const avisChauffeur = avisList.filter(
        (avis) => avis.reservation?.chauffeur === pseudo
      );

      if (listeAvis) {
        listeAvis.innerHTML = "";

        if (avisChauffeur.length === 0) {
          listeAvis.innerHTML = `<li class="list-group-item">Aucun avis trouvé pour ce chauffeur.</li>`;
          return;
        }

        avisChauffeur.forEach((avis) => {
          const note = parseInt(avis.note) || 0;
          const etoiles = "⭐️".repeat(note) + "☆".repeat(5 - note);

          const avisItem = `
              <li class="list-group-item">
                <strong>Note :</strong> ${etoiles}<br />
                <strong>Commentaire :</strong> ${avis.commentaire || "—"}
              </li>
            `;
          listeAvis.insertAdjacentHTML("beforeend", avisItem);
        });
      }
    })
    .catch((error) => {
      // console.error("Erreur lors du chargement des avis :", error);
      afficherErreurModalBodyCommentairesSruChauffeur(
        "Erreur lors du chargement des avis."
      );
      if (listeAvis) {
        listeAvis.innerHTML = `<li class="list-group-item text-danger">Erreur de chargement des avis.</li>`;
      }
    });
}

function afficherErreurModalBodyCommentairesSruChauffeur(message) {
  const errorModalBody = document.getElementById(
    "errorModalBodyCommentairesSruChauffeur"
  );
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}
