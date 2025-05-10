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
    pseudoDisplay.textContent = user.pseudo;
    totalCredits.textContent = user.credits;
    emailCurrentUserDisplay.textContent = user.email;
    roleDisplay.textContent = user.roles;
    telephoneDisplay.textContent = user.telephone;

    const imageUrl = apiUrl + `image/users/${user.id}/image`;

    // 2eme appel API :charger l'image de l'utilisateur
    return fetch(imageUrl, {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
      },
    });
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Impossible de charger l'image de l'utilisateur.");
    }
    return response.blob();
  })
  .then((blob) => {
    avatarDisplay.src = URL.createObjectURL(blob);
  })
  .catch((error) => {
    console.error("Erreur : ", error);
    alert(
      error.message ||
        "Impossible de charger les données utilisateur ou l'avatar."
    );
    avatarDisplay.src = "path/to/default-avatar.jpg";
  });

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
