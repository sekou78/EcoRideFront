//Infos conducteur
const avatarDetailleeDisplay = document.getElementById(
  "avatar-vue-reservation-display"
);
const pseudoDetailleeDisplay = document.getElementById(
  "pseudo-vue-reservation-display"
);

//Infos du Trajet
const adresseDepartDetailleeDisplay = document.getElementById(
  "adresse-depart-vue-reservation-display"
);
const adresseArriveeDetailleeDisplay = document.getElementById(
  "adresse-arrivee-vue-reservation-display"
);
const statutDetailleeDisplay = document.getElementById(
  "statut-vue-reservation-display"
);
const placesDisponiblesDetailleeDisplay = document.getElementById(
  "places-disponibles-vue-reservation-display"
);
const prixDetailleeDisplay = document.getElementById(
  "prix-vue-reservation-display"
);
const dateDepartDetailleeDisplay = document.getElementById(
  "date-depart-vue-reservation-display"
);
const dateArriveeDetailleeDisplay = document.getElementById(
  "date-arrivee-vue-reservation-display"
);
const heureDepartDetailleeDisplay = document.getElementById(
  "heure-depart-vue-reservation-display"
);
const dureeDetailleeDisplay = document.getElementById(
  "duree-trajet-vue-reservation-display"
);
const peageDetailleeDisplay = document.getElementById(
  "peage-vue-reservation-display"
);
const trajetEcologiqueDetailleeDisplay = document.getElementById(
  "trajet-ecologique-vue-reservation-display"
);

//Avis sur le conducteur
const noteDetailleeDisplay = document.getElementById(
  "note-vue-reservation-display"
);
const autresAvisDetailleeDisplay = document.getElementById(
  "autres-avis-vue-reservation-display"
);

//Informations sur le Véhicule
const immatriculationDetailleeDisplay = document.getElementById(
  "immatriculation-vue-reservation-display"
);
const marqueDetailleeDisplay = document.getElementById(
  "marque-vue-reservation-display"
);
const modeleDetailleeDisplay = document.getElementById(
  "modele-vue-reservation-display"
);
const couleurDetailleeDisplay = document.getElementById(
  "couleur-vue-reservation-display"
);
const electriqueDetailleeDisplay = document.getElementById(
  "electrique-vue-reservation-display"
);

//Préférences du Conducteur
const fumeurDetailleeDisplay = document.getElementById(
  "fumeur-vue-reservation-display"
);
const animalDetailleeDisplay = document.getElementById(
  "animal-vue-reservation-display"
);
const autresPreferencesDetailleeDisplay = document.getElementById(
  "autres-preferences-display"
);

const btnReserver = document.getElementById("btn-reserver-trajet");
btnReserver.addEventListener("click", reserverTrajet);

//Appel de la fonction
vueReservations();

async function vueReservations() {
  // Récupérer les infos de l'ID de la réservation sélectionnée depuis le localStorage
  const reservationDetails = JSON.parse(
    localStorage.getItem("reservationDetails")
  );
  console.log(reservationDetails);

  const reservationId = reservationDetails?.id;

  if (!reservationId) {
    afficherErreurModalVueReservation(
      "Impossible de trouver l'ID de la réservation."
    );
    return;
  }

  function formatDateFR(dateString) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return "—";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatHeure(dateTimeString) {
    if (!dateTimeString) return "—";
    const date = new Date(dateTimeString);
    if (isNaN(date)) return "—";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Remplir les champs avec les infos du trajet
  pseudoDetailleeDisplay.textContent =
    reservationDetails.trajet.chauffeur.pseudo || "—";
  avatarDetailleeDisplay.src = reservationDetails.trajet.chauffeur.image
    ?.filePath
    ? urlImg + reservationDetails.trajet.chauffeur.image.filePath
    : "/images/avatar.png";
  adresseDepartDetailleeDisplay.textContent =
    reservationDetails.trajet.adresseDepart || "—";
  adresseArriveeDetailleeDisplay.textContent =
    reservationDetails.trajet.adresseArrivee || "—";
  statutDetailleeDisplay.textContent = reservationDetails.trajet.statut || "—";
  placesDisponiblesDetailleeDisplay.textContent =
    reservationDetails.trajet.nombrePlacesDisponible || "—";
  prixDetailleeDisplay.textContent = reservationDetails.trajet.prix || "—";
  dateDepartDetailleeDisplay.textContent = formatDateFR(
    reservationDetails.trajet.dateDepart
  );
  dateArriveeDetailleeDisplay.textContent = formatDateFR(
    reservationDetails.trajet.dateArrivee
  );
  heureDepartDetailleeDisplay.textContent =
    formatHeure(reservationDetails.trajet.heureDepart) || "—";
  dureeDetailleeDisplay.textContent =
    formatHeure(reservationDetails.trajet.dureeVoyage) || "—";
  peageDetailleeDisplay.textContent = reservationDetails.trajet.peage
    ? "Oui"
    : "Non";
  trajetEcologiqueDetailleeDisplay.textContent = reservationDetails.trajet
    .estEcologique
    ? "Oui"
    : "Non";

  const lienAvisChauffeur = document.getElementById("lienAvisChauffeur");
  const pseudoChauffeur = reservationDetails?.trajet?.chauffeur?.pseudo;

  if (pseudoChauffeur && lienAvisChauffeur) {
    const reservationId = reservationDetails?.id;
    lienAvisChauffeur.href = `/commentairesSurChauffeur?pseudo=${encodeURIComponent(
      pseudoChauffeur
    )}&reservationId=${encodeURIComponent(reservationId)}`;
  }

  //Avis sur le conducteur
  vueAvis();
  function vueAvis() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(apiUrl + "avis/avisVisible", requestOptions)
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
      .then((avisList) => {
        const chauffeurPseudo = reservationDetails?.trajet?.chauffeur?.pseudo;

        if (!chauffeurPseudo) {
          console.warn("Impossible de récupérer le pseudo du chauffeur.");
          return;
        }

        const avisChauffeur = avisList.filter(
          (avis) => avis.reservation?.chauffeur === chauffeurPseudo
        );

        const container = document.getElementById("avisVueReservee");
        container.innerHTML = "";

        if (avisChauffeur.length === 0) {
          container.innerHTML = `
            <li class="list-group-item text-body-secondary">Aucun avis pour ce conducteur.</li>`;
          return;
        }

        //Calcul de la moyenne des notes
        const totalNotes = avisChauffeur.reduce((sum, avis) => {
          const note = parseInt(avis.note);
          return sum + (isNaN(note) ? 0 : note);
        }, 0);

        const moyenne = totalNotes / avisChauffeur.length;
        // arrondi à l'entier le plus proche
        const noteArrondie = Math.round(moyenne);

        //Affichage des étoiles de la moyenne
        const etoilesMoyenne =
          "⭐️".repeat(noteArrondie) + "☆".repeat(5 - noteArrondie);
        const moyenneHtml = `
          <li class="list-group-item">
          ${etoilesMoyenne} (${moyenne.toFixed(1)} / 5 )
          </li>
        `;

        container.insertAdjacentHTML("beforeend", moyenneHtml);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des avis visibles :",
          error
        );
      });
  }

  //Informations sur le Véhicule
  immatriculationDetailleeDisplay.textContent =
    reservationDetails.trajet.vehicule.plaqueImmatriculation || "—";
  marqueDetailleeDisplay.textContent =
    reservationDetails.trajet.vehicule.marque || "—";
  modeleDetailleeDisplay.textContent =
    reservationDetails.trajet.vehicule.modele || "—";
  couleurDetailleeDisplay.textContent =
    reservationDetails.trajet.vehicule.couleur || "—";
  electriqueDetailleeDisplay.textContent = reservationDetails.trajet.vehicule
    .electrique
    ? "Oui"
    : "Non";

  //Préférences du Conducteur
  fumeurDetailleeDisplay.textContent = reservationDetails.trajet.chauffeur
    .accepteFumeur
    ? "Oui"
    : "Non";
  animalDetailleeDisplay.textContent = reservationDetails.trajet.chauffeur
    .accepteAnimaux
    ? "Oui"
    : "Non";
  autresPreferencesDetailleeDisplay.textContent =
    reservationDetails.trajet.chauffeur.autresPreferences || "—";
}

function reserverTrajet() {
  const reservationDetails = JSON.parse(
    localStorage.getItem("reservationDetails")
  );

  if (!reservationDetails || !reservationDetails.id) {
    afficherErreurModalVueReservation(
      "Erreur : les informations de la réservation sont introuvables."
    );
    return;
  }

  // Redirection vers la page de statut avec l'ID de la réservation
  window.location.href = `/statutReservation?id=${reservationDetails.id}`;
}

function afficherErreurModalVueReservation(message) {
  const errorModalBody = document.getElementById(
    "errorModalBodyVueReservation"
  );
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
