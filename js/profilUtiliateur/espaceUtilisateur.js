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

// Récupérer les données du localStorage et ou des cookies
const avatar = localStorage.getItem("avatar");
const pseudo = localStorage.getItem("pseudo");
const credits = getCookie("credits");
const telephone = localStorage.getItem("telephone");
const roleFromLocalStorage = localStorage.getItem("role");
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

const currentUserEmail = localStorage.getItem("currentUser");
// Récupérer les informations de l'utilisateur
if (currentUserEmail) {
  const userData = JSON.parse(localStorage.getItem(currentUserEmail));

  if (userData) {
    pseudoDisplay.textContent = userData.pseudo;
    totalCredits.textContent = userData.credits;
    emailCurrentUserDisplay.textContent = userData.email;
    placesDisponiblesDisplay.textContent = userData.placesDisponibles;

    // Vérifier si le rôle du localStorage est défini
    if (roleFromLocalStorage) {
      const roleFromCookie = getCookie("role");

      // Si le rôle en cookie est différent de localStorage, on met à jour le cookie
      if (roleFromCookie !== roleFromLocalStorage) {
        setCookie("role", roleFromLocalStorage, 7);
        location.reload();
      }
    } else {
      console.warn("Aucun rôle trouvé dans localStorage.");
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
roleDisplay.textContent = roleFromLocalStorage;
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
