const modifProfil = document.getElementById("profil-form");
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
const dateImmatriculationDisplay = document.getElementById(
  "date-immatriculation-display"
);
const marqueVehiculeDisplay = document.getElementById(
  "marque-vehicule-display"
);
const modeleVehiculeDisplay = document.getElementById(
  "modele-vehicule-display"
);
const couleurVehiculeDisplay = document.getElementById(
  "couleur-vehicule-display"
);
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
const inputPseudoAvis = document.getElementById("floatingInput");
const textareaAvis = document.getElementById("floatingTextarea");
const btnEnvoyerCommentaire = document.getElementById(
  "btn-envoyer-commentaire"
);
const btnRemonterProblemes = document.getElementById("btn-remonter-problemes");

inputPseudoAvis.addEventListener("keyup", validInputAvis);
textareaAvis.addEventListener("keyup", validInputAvis);

btnDemarrer.addEventListener("click", gestionDemarrer);
btnArrivee.addEventListener("click", gestionArrivee);
btnEnvoyerCommentaire.disabled = true;
btnEnvoyerCommentaire.addEventListener("click", gestionEnvoyerCommentaire);
btnRemonterProblemes.disabled = true;
btnRemonterProblemes.addEventListener("click", gestionRemonterProblemes);

function validInputAvis() {
  const pseudoOk = validateAvisRequired(inputPseudoAvis);
  const commentaireOk = validateAvisRequired(textareaAvis);

  if (pseudoOk && commentaireOk) {
    btnEnvoyerCommentaire.disabled = false;
    btnRemonterProblemes.disabled = false;
  } else {
    btnEnvoyerCommentaire.disabled = true;
    btnRemonterProblemes.disabled = true;
  }
}

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
    pseudoDisplay.textContent = user.user.pseudo;
    totalCredits.textContent = user.user.credits;
    emailCurrentUserDisplay.textContent = user.user.email;
    roleDisplay.textContent = user.user.roles;
    telephoneDisplay.textContent = user.user.telephone;
    avatarDisplay.src = urlImg + user.user.image.filePath;
    fumeurDisplay.textContent = user.user.accepteFumeur ? "Oui" : "Non";
    animalDisplay.textContent = user.user.accepteAnimaux ? "Oui" : "Non";
    preferencesAutresDisplay.textContent = user.user.autresPreferences;

    // Afficher les infos du vehicule conducteur
    function formatDateFR(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    immatriculationDisplay.textContent =
      user.profilConducteur.plaqueImmatriculation;
    dateImmatriculationDisplay.textContent = formatDateFR(
      user.profilConducteur.dateImmatriculation
    );
    marqueVehiculeDisplay.textContent = user.profilConducteur.marque;
    modeleVehiculeDisplay.textContent = user.profilConducteur.modele;
    couleurVehiculeDisplay.textContent = user.profilConducteur.couleur;
    placesDisponiblesDisplay.textContent = user.profilConducteur.nombrePlaces;
    electriqueDisplay.textContent = user.profilConducteur.electrique
      ? "Oui"
      : "Non";
  });

// Fonction de chargement des véhicules de l'utilisateur
async function chargerVehiculesUtilisateur() {
  const dropdownMenu = document.getElementById("vehiculeDropdownMenu");
  const token = getCookie(tokenCookieName);

  if (!token) {
    console.error("Token d'authentification introuvable.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  try {
    const response = await fetch(apiUrl + "profilConducteur/", {
      method: "GET",
      headers: myHeaders,
    });

    if (!response.ok) throw new Error("Erreur API");

    const vehicules = await response.json();

    // Vide la liste
    dropdownMenu.innerHTML = "";

    // Génère les liens de chaque véhicule
    vehicules.forEach((vehicule) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "dropdown-item text-primary";
      link.textContent = vehicule.plaqueImmatriculation;
      link.addEventListener("click", () => afficherInfosVehicule(vehicule));
      item.appendChild(link);
      dropdownMenu.appendChild(item);
    });

    // Ajoute le lien "Ajouter un véhicule" à la fin
    const itemAjout = document.createElement("li");
    itemAjout.innerHTML = `
      <a class="dropdown-item text-primary" href="/modifProfilConducteur">
        Ajouter un véhicule
      </a>`;
    dropdownMenu.appendChild(itemAjout);
  } catch (error) {
    console.error("Erreur lors du chargement des véhicules :", error);
  }
}

function afficherInfosVehicule(vehicule) {
  function formatDateFR(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  immatriculationDisplay.textContent = vehicule.plaqueImmatriculation;
  dateImmatriculationDisplay.textContent = formatDateFR(
    vehicule.dateImmatriculation
  );
  marqueVehiculeDisplay.textContent = vehicule.marque;
  modeleVehiculeDisplay.textContent = vehicule.modele;
  couleurVehiculeDisplay.textContent = vehicule.couleur;
  placesDisponiblesDisplay.textContent = vehicule.nombrePlaces;
  electriqueDisplay.textContent = vehicule.electrique ? "Oui" : "Non";
}

window.addEventListener("DOMContentLoaded", chargerVehiculesUtilisateur());

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
  const currentUserEmail = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("userAppli")) || [];

  const userIndex = users.findIndex((u) => u.email === currentUserEmail);

  if (userIndex === -1) {
    alert("Utilisateur introuvable pour la mise à jour des crédits.");
    return;
  }

  const userData = users[userIndex];

  let credits = userData.credits || 0;
  const prix = parseInt(prixDisplay.textContent);

  credits += prix;
  userData.credits = credits;

  users[userIndex] = userData;
  localStorage.setItem("userAppli", JSON.stringify(users));

  totalCredits.textContent = credits;
  alert("Crédits mis à jour !");
}

// Fonction pour simuler l'envoi d'un email aux passagers
function envoyerEmailParticipants(message) {
  alert("Envoi d'un email aux participants :", message);
}

// Appel de la fonction d'affichage
gestionAffichage();
//Demande de remplissage du champs requis
function validateAvisRequired(input) {
  if (input.value != "") {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Envoie de commentaire pour être validé par un employé
function gestionEnvoyerCommentaire() {
  // Récupérer les anciens commentaires s’ils existent
  let commentaires = [];
  try {
    const saved = JSON.parse(localStorage.getItem("commentaires"));
    if (Array.isArray(saved)) {
      commentaires = saved;
    } else if (saved) {
      commentaires = [saved];
    }
  } catch (e) {
    console.warn("Erreur lors du parsing de commentaires :", e);
  }

  const newComment = {
    pseudo: inputPseudoAvis.value.trim(),
    commentaire: textareaAvis.value.trim(),
  };

  // Ajouter le nouveau commentaire au tableau
  commentaires.push(newComment);

  // Sauvegarder le tableau mis à jour
  localStorage.setItem("commentaires", JSON.stringify(commentaires));

  alert("Commentaire envoyé !");
  window.location.reload();
}

function gestionRemonterProblemes() {
  // Récupérer les anciens commentaires s’ils existent
  let problemesRemonter = [];
  try {
    const saved = JSON.parse(localStorage.getItem("problemesRemonter"));
    if (Array.isArray(saved)) {
      problemesRemonter = saved;
    } else if (saved) {
      problemesRemonter = [saved];
    }
  } catch (e) {
    console.warn("Erreur lors du parsing de problemesRemonter :", e);
  }

  // Générer un identifiant unique style #CV123456
  const uniqueId = "#CV" + Math.floor(100000 + Math.random() * 900000);

  // Créer le nouveau commentaire
  const newProblemesRemonter = {
    id: uniqueId,
    pseudo: inputPseudoAvis.value.trim(),
    commentaire: textareaAvis.value.trim(),
    date: new Date().toISOString(), // facultatif mais pratique
  };

  // Ajouter à la liste existante
  problemesRemonter.push(newProblemesRemonter);

  // Sauvegarder à nouveau
  localStorage.setItem("problemesRemonter", JSON.stringify(problemesRemonter));

  alert("Probleme remonter");
  window.location.reload();
}
