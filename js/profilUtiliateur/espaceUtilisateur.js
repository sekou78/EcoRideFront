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

// Récupérer les données du localStorage
const avatar = localStorage.getItem("avatar");
const pseudo = localStorage.getItem("pseudo");
const credits = localStorage.getItem("credits");
const currentUserEmail = localStorage.getItem("currentUser");
const telephone = localStorage.getItem("telephone");
let role = localStorage.getItem("role");
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
    totalCredits.textContent = userData.credits || "0";
    emailCurrentUserDisplay.textContent = userData.email;
    placesDisponiblesDisplay.textContent = userData.placesDisponibles;

    // Met à jour le rôle et l'affiche
    if (userData.role) {
      role = userData.role; // Met à jour la variable role
      localStorage.setItem("role", role); // Met à jour dans le localStorage
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
roleDisplay.textContent = role; // Met à jour après récupération des données utilisateur
departDisplay.textContent = depart;
arriveeDisplay.textContent = arrivee;
dateDisplay.textContent = date;
heureDisplay.textContent = heure;
peageDisplay.textContent = peage;
dureeDisplay.textContent = duree;
prixDisplay.textContent = prix;
immatriculationDisplay.textContent = immatriculation;
vehiculeInfoDisplay.textContent = vehiculeInfo;
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

  let credits = parseInt(localStorage.getItem("credits"));
  const prix = parseInt(prixDisplay.textContent);

  credits += prix;
  localStorage.setItem("credits", credits);
  totalCredits.textContent = credits;

  btnArrivee.classList.add("d-none");
}
console.log("Rôle récupéré:", role);

// Fonction de gestion de l'affichage
function gestionAffichage() {
  if (role.valueOf() === "chauffeur") {
    btnDemarrer.classList.remove("d-none");
  } else {
    btnDemarrer.classList.add("d-none");
  }
}
console.log(role);
