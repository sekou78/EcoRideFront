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
  // Récupérer les infos de l'ID du trajet selectionné depuis le localStorage
  const reservationDetails = JSON.parse(
    localStorage.getItem("reservationDetails")
  );
  console.log(reservationDetails);

  const reservationId = reservationDetails?.id;

  if (!reservationId) {
    alert("Impossible de trouver l'ID de la reservation.");
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
  // Remplir les champs DOM avec les infos du trajet
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
  // //Informations sur le Véhicule
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
    alert("Erreur : les informations de la réservation sont introuvables.");
    return;
  }

  // Redirection vers la page de statut avec l'ID de la réservation
  window.location.href = `/statutReservation?id=${reservationDetails.id}`;
}
