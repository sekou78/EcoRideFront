const pseudoHistorique = document.getElementById("pseudo-historique");
const creditsHistorique = document.getElementById("credits-historique");
const placesDisponiblesHistorique = document.getElementById(
  "places-disponibles-historique"
);

const covoiturage1 = document.getElementById("covoiturage-1");
const covoiturage2 = document.getElementById("covoiturage-2");

const btnAnnulationCovoiturage1 = document.getElementById("btn-covoiturage-1");
const btnAnnulationCovoiturage2 = document.getElementById("btn-covoiturage-2");

// Récupérer l'email de l'utilisateur connecté
const currentUserEmail = localStorage.getItem("currentUserEmail");

if (currentUserEmail) {
  // Charger les informations de l'utilisateur
  const userData = JSON.parse(localStorage.getItem(currentUserEmail));

  if (userData) {
    pseudoHistorique.textContent = userData.pseudo;
    creditsHistorique.textContent = userData.credits;
    placesDisponiblesHistorique.textContent = userData.placesDisponibles;
  } else {
    alert("Données utilisateur introuvables.");
  }
} else {
  alert("Aucun utilisateur connecté.");
}

//Ajouter des écouteurs pour annuler un covoiturage
btnAnnulationCovoiturage1.addEventListener("click", () =>
  annulCovoiturage(covoiturage1, 5, 1)
);
btnAnnulationCovoiturage2.addEventListener("click", () =>
  annulCovoiturage(covoiturage2, 3, 1)
);

// Fonction d'annulation d'un covoiturage
function annulCovoiturage(covoiturage, creditGagne, placeAjoutee) {
  // Masquer le covoiturage annulé
  covoiturage.style.display = "none";

  // Mise à jour des crédits et des places disponibles
  let currentCredits = parseInt(creditsHistorique.textContent) || 0;
  let currentPlaces = parseInt(placesDisponiblesHistorique.textContent) || 0;

  const newCredits = currentCredits + creditGagne;
  const newPlaces = currentPlaces + placeAjoutee;

  creditsHistorique.textContent = newCredits;
  placesDisponiblesHistorique.textContent = newPlaces;

  // Mettre à jour les données dans le localStorage
  if (currentUserEmail) {
    const updatedUserData = {
      pseudo: pseudoHistorique.textContent,
      credits: newCredits,
      placesDisponibles: newPlaces,
    };
    localStorage.setItem(currentUserEmail, JSON.stringify(updatedUserData));
  }

  // Simuler l'envoi d'un mail (par alert ici)
  alert("Covoiturage annulé ! Un mail a été envoyé aux participants.");
}
