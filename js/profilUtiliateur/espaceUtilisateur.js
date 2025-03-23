const avatarDisplay = document.getElementById("avatar-display");
const pseudoDisplay = document.getElementById("pseudo-display");
const totalCredits = document.getElementById("total-credits");
const emailDisplay = document.getElementById("email-display");
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

// Récupérer les données du localStorage (avec des valeurs par défaut si absentes)
const avatar = localStorage.getItem("avatar") || "/images/avatar.png";
const pseudo = localStorage.getItem("pseudo") || "Nom d'utilisateur";
const credits = localStorage.getItem("credits") || "0";
const email = localStorage.getItem("email") || "email@example.com";
const telephone = localStorage.getItem("telephone") || "+XX X XX XX XX XX";
const role = localStorage.getItem("role") || "Utilisateur";
const depart = localStorage.getItem("depart") || "Depart";
const arrivee = localStorage.getItem("arrivee") || "Arrivee";
const date = localStorage.getItem("date") || "Date";
const heure = localStorage.getItem("heure") || "Heure";
const peage = localStorage.getItem("peage") || "Non";
const duree = localStorage.getItem("duree") || "Duree";
const prix = localStorage.getItem("prix") || "Prix";
const immatriculation =
  localStorage.getItem("immatriculation") || "Non renseigné";
const vehiculeInfo = localStorage.getItem("vehiculeInfo") || "Non renseigné";
const placesDisponibles = localStorage.getItem("placesDisponibles") || "0";
const electrique = localStorage.getItem("electrique") || "Non";
const fumeur = localStorage.getItem("fumeur") || "Non";
const animal = localStorage.getItem("animal") || "Non";
const preferencesAutres = localStorage.getItem("preferencesAutres") || "Aucune";

// Vérifier si un avatar est déjà stocké dans le localStorage et l'afficher
const avatarUrl = localStorage.getItem("avatar");
if (avatarUrl) {
  avatarDisplay.src = avatarUrl; // Mettre à jour l'image si elle est trouvée dans localStorage
} else {
  avatarDisplay.src = "/images/avatar.png"; // Image par défaut
}

// Afficher les informations dans les éléments HTML
avatarDisplay.src = avatar;
pseudoDisplay.textContent = pseudo;
totalCredits.textContent = credits;
emailDisplay.textContent = email;
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
