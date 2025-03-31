const avatarDisplay = document.getElementById("avatar-display");
const pseudoDisplay = document.getElementById("pseudo-display");
const totalCredits = document.getElementById("total-credits");
const emailCurrentUserDisplay = document.getElementById("email-display");
const telephoneDisplay = document.getElementById("telephone-display");
const roleDisplay = document.getElementById("role-display");
const departDisplay = document.getElementById("depart-display");
const arriveeDisplay = document.getElementById("arrivee-display");
const dateDisplay = document.getElementById("date-voyage-display");
const heureDisplay = document.getElementById("heure-voyage-display");
const peageDisplay = document.getElementById("peage-display");
const dureeDisplay = document.getElementById("duree-voyage-display");
const prixDisplay = document.getElementById("prix-display");
const immatriculationDisplay = document.getElementById(
  "immatriculation-display"
);
const vehiculeInfoDisplay = document.getElementById("vehicule-info-display");
const placesDisponiblesDisplay = document.getElementById(
  "places-disponibles-display"
);
const electriqueDisplay = document.getElementById("electrique-display");
const fumeurDisplay = document.getElementById("fumeur-display");
const animalDisplay = document.getElementById("animal-display");
const preferencesAutresDisplay = document.getElementById(
  "preferences-autres-display"
);
const btnDemarrer = document.getElementById("btn-demarrer");
const btnArrivee = document.getElementById("btn-arrivee");

btnDemarrer.addEventListener("click", gestionDemarrer);
btnArrivee.addEventListener("click", gestionArrivee);

// Récupérer les données du localStorage et ou des cookies
const avatar = localStorage.getItem("avatar");
const pseudo = localStorage.getItem("pseudo");
const credits = getCookie("credits");
const currentUserEmail = localStorage.getItem("currentUser");
const telephone = localStorage.getItem("telephone");
const role = getCookie("role");
const depart = localStorage.getItem("depart");
const arrivee = localStorage.getItem("arrivee");
const date = localStorage.getItem("date");
const heure = localStorage.getItem("heure");
const peage = localStorage.getItem("peage");
const duree = localStorage.getItem("duree");
const prix = localStorage.getItem("prix");
const immatriculation = localStorage.getItem("immatriculation");
const vehiculeInfo = localStorage.getItem("vehiculeInfo");
const placesDisponibles = localStorage.getItem("placesDisponibles");
const electrique = localStorage.getItem("electrique");
const fumeur = localStorage.getItem("fumeur");
const animal = localStorage.getItem("animal");
const preferencesAutres = localStorage.getItem("preferencesAutres");

// Récupérer les informations de l'utilisateur

if (currentUserEmail) {
  const userData = JSON.parse(localStorage.getItem(currentUserEmail));

  if (userData) {
    pseudoDisplay.textContent = userData.pseudo;
    totalCredits.textContent = userData.credits;
    emailCurrentUserDisplay.textContent = userData.email;
    placesDisponiblesDisplay.textContent = userData.placesDisponibles;

    // Met à jour le rôle et l'affiche
    if (userData.role) {
      localStorage.setItem("role", userData.role);
    }
  } else {
    alert("Aucun utilisateur trouvé.");
  }
} else {
  alert("Aucun utilisateur connecté.");
}

// Vérifier si un avatar est déjà stocké dans le localStorage et l'afficher
avatarDisplay.src = avatar;

// Afficher les informations dans les éléments HTML
telephoneDisplay.textContent = telephone;
roleDisplay.textContent = role;
departDisplay.textContent = depart;
arriveeDisplay.textContent = arrivee;
dateDisplay.textContent = date;
heureDisplay.textContent = heure;
peageDisplay.textContent = peage;
dureeDisplay.textContent = duree;
prixDisplay.textContent = prix;
immatriculationDisplay.textContent = immatriculation;
vehiculeInfoDisplay.textContent = vehiculeInfo;
placesDisponiblesDisplay.textContent = placesDisponibles;
electriqueDisplay.textContent = electrique;
fumeurDisplay.textContent = fumeur;
animalDisplay.textContent = animal;
preferencesAutresDisplay.textContent = preferencesAutres;

// Fonction de gestion du bouton "Démarrer"
function gestionDemarrer() {
  alert("Voyage démarré !");
  btnDemarrer.classList.add("d-none");
  btnArrivee.classList.remove("d-none");
}

// Fonction de gestion du bouton "Arrivée"
function gestionArrivee() {
  alert("Arrivée à destination, trajet terminé !");

  btnArrivee.classList.add("d-none");
}

// Fonction de gestion de l'affichage
function gestionAffichage() {
  if (role !== "chauffeur") {
    alert("Seuls les chauffeurs peuvent démarrer un covoiturage.");
    return;
  }
  // Au départ : Démarrer visible, Arrivée cachée
  btnDemarrer.classList.remove("d-none");
  btnArrivee.classList.add("d-none");

  // Quand on clique sur Démarrer → Masquer Démarrer et Afficher Arrivée
  btnDemarrer.addEventListener("click", function () {
    btnDemarrer.classList.add("d-none");
    btnArrivee.classList.remove("d-none");
  });

  // Quand on clique sur Arrivée → Tout cacher
  btnArrivee.addEventListener("click", function () {
    btnArrivee.classList.add("d-none");

    // Simuler une validation des participants
    setTimeout(() => {
      const validationParticipants = confirm(
        "Tous les passagers ont confirmé que le trajet s'est bien passé ?"
      );

      if (validationParticipants) {
        mettreAJourCredits();
      } else {
        alert("Un problème a été signalé. Un employé va intervenir");
      }
    }, 1000);

    envoyerEmailParticipants();
  });
}

// Fonction de mise à jour des crédits du chauffeur
function mettreAJourCredits() {
  const userData = JSON.parse(localStorage.getItem(currentUserEmail));

  let credits = userData.credits;
  const prix = parseInt(prixDisplay.textContent);

  credits += prix;
  userData.credits = credits;
  localStorage.setItem(currentUserEmail, JSON.stringify(userData));
  totalCredits.textContent = credits;
  alert("Crédits mis à jour !");
}

// Fonction pour simuler l'envoi d'un email aux passagers
function envoyerEmailParticipants(message) {
  console.log("Envoi d'un email aux participants :", message);
  alert("Envoi d'un email aux participants :", message);
}

// Appel de la fonction d'affichage
gestionAffichage();
