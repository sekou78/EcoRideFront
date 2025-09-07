//Statut de la reservation
const statutReservationDisplay = document.getElementById(
  "edit-statut-reservation-display"
);
const editStatutReservation = document.getElementById(
  "edit-statut-reservation"
);
//Infos conducteur
const pseudoStatutDisplay = document.getElementById(
  "pseudo-statut-reservation-display"
);
//Infos du Trajet
const adresseDepartStatutDisplay = document.getElementById(
  "adresse-depart-statut-reservation-display"
);
const adresseArriveeStatutDisplay = document.getElementById(
  "adresse-arrivee-statut-reservation-display"
);
const statutStatutDisplay = document.getElementById(
  "statut-statut-reservation-display"
);
const placesDisponiblesStatutDisplay = document.getElementById(
  "places-disponibles-statut-reservation-display"
);
const prixStatutDisplay = document.getElementById(
  "prix-statut-reservation-display"
);
const dateDepartStatutDisplay = document.getElementById(
  "date-depart-statut-reservation-display"
);
const dateArriveeStatutDisplay = document.getElementById(
  "date-arrivee-statut-reservation-display"
);
const heureDepartStatutDisplay = document.getElementById(
  "heure-depart-statut-reservation-display"
);
const dureeStatutDisplay = document.getElementById(
  "duree-trajet-statut-reservation-display"
);
const peageStatutDisplay = document.getElementById(
  "peage-statut-reservation-display"
);
const trajetEcologiqueStatutDisplay = document.getElementById(
  "trajet-ecologique-statut-reservation-display"
);
//Préférences du Conducteur
const fumeurStatutDisplay = document.getElementById(
  "fumeur-statut-reservation-display"
);
const animalStatutDisplay = document.getElementById(
  "animal-statut-reservation-display"
);
const autresPreferencesStatutDisplay = document.getElementById(
  "autres-preferences-display"
);
const btnStatutValider = document.getElementById("btn-validation-statut");

btnStatutValider.addEventListener("click", ValidStatutReservation);

// Affichage des infos de la reservation depuis le localStorage
const reservationDetails = JSON.parse(
  localStorage.getItem("reservationDetails")
);
console.log(reservationDetails);

if (reservationDetails) {
  statutReservationDisplay.textContent = reservationDetails.statut;
  pseudoStatutDisplay.textContent = reservationDetails.trajet.chauffeur.pseudo;
  adresseDepartStatutDisplay.textContent =
    reservationDetails.trajet.adresseDepart;
  adresseArriveeStatutDisplay.textContent =
    reservationDetails.trajet.adresseArrivee;
  statutStatutDisplay.textContent = reservationDetails.statut;
  placesDisponiblesStatutDisplay.textContent =
    reservationDetails.trajet.nombrePlacesDisponible;
  prixStatutDisplay.textContent = reservationDetails.trajet.prix;
  dateDepartStatutDisplay.textContent = formatDateFR(
    reservationDetails.trajet.dateDepart
  );
  dateArriveeStatutDisplay.textContent = formatDateFR(
    reservationDetails.trajet.dateArrivee
  );
  heureDepartStatutDisplay.textContent = formatHeure(
    reservationDetails.trajet.heureDepart
  );
  dureeStatutDisplay.textContent = formatHeure(
    reservationDetails.trajet.dureeVoyage
  );
  peageStatutDisplay.textContent = reservationDetails.trajet.peage
    ? "Oui"
    : "Non";
  trajetEcologiqueStatutDisplay.textContent = reservationDetails.trajet
    .estEcologique
    ? "Oui"
    : "Non";
  fumeurStatutDisplay.textContent = reservationDetails.trajet.chauffeur.fumeur
    ? "Oui"
    : "Non";
  animalStatutDisplay.textContent = reservationDetails.trajet.chauffeur.animal
    ? "Oui"
    : "Non";
  autresPreferencesStatutDisplay.textContent =
    reservationDetails.trajet.chauffeur.autresPreferences;
} else {
  afficherErreurModalStatutReservation(
    "Impossible de trouver l'ID de la reservation."
  );
}

function ValidStatutReservation() {
  const reservation = JSON.parse(localStorage.getItem("reservationDetails"));
  const reservationId = reservation?.id;
  console.log(reservationId);

  if (!reservationId) {
    afficherErreurModalStatutReservation(
      "Impossible de trouver l'ID de la reservation."
    );
    return;
  }

  const statut = editStatutReservation.value;
  if (!statut) {
    afficherErreurModalStatutReservation("Veuillez sélectionner un statut.");
    return;
  }

  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const raw = JSON.stringify({
    statut: statut,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl + `reservation/${reservationId}`, requestOptions)
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
    .then((result) => {
      window.location.href = "/espaceUtilisateur";
    })
    .catch((error) => {
      console.error(error);
      afficherErreurModalStatutReservation(
        "Erreur lors de la mise à jour du statut."
      );
    });
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

function afficherErreurModalStatutReservation(message) {
  const errorModalBody = document.getElementById(
    "errorModalBodyStatutReservation"
  );
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
