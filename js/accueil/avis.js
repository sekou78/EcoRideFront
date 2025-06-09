const avisPassagerForm = document.getElementById("avis-passager-form");

const inputPseudoAvis = document.getElementById("floatingInput");
const noteChauffeurAvis = document.getElementById("noteChauffeurAvis");
const textareaAvis = document.getElementById("floatingTextarea");
const btnEnvoyerCommentaire = document.getElementById(
  "btn-envoyer-commentaire"
);
const btnRemonterProblemes = document.getElementById("btn-remonter-problemes");

btnEnvoyerCommentaire.disabled = true;
btnRemonterProblemes.disabled = true;

btnEnvoyerCommentaire.addEventListener("click", envoyerCommentaire);
btnRemonterProblemes.addEventListener("click", remonterUnProbleme);

inputPseudoAvis.addEventListener("input", validInputAvis);
noteChauffeurAvis.addEventListener("input", validInputAvis);

function validInputAvis() {
  const pseudoOk = validateAvisRequired(inputPseudoAvis);
  const noteChauffeurAvisOk = validNote(noteChauffeurAvis);

  if (!pseudoOk || !noteChauffeurAvisOk) {
    btnEnvoyerCommentaire.disabled = true;
    btnRemonterProblemes.disabled = true;
    return;
  }

  const note = parseInt(noteChauffeurAvis.value.trim(), 10);

  if (note >= 3 && note <= 5) {
    btnEnvoyerCommentaire.disabled = false;
    btnRemonterProblemes.disabled = true;
  } else if (note >= 0 && note <= 2) {
    btnEnvoyerCommentaire.disabled = true;
    btnRemonterProblemes.disabled = false;
  } else {
    // au cas où la note n'est pas valide
    btnEnvoyerCommentaire.disabled = true;
    btnRemonterProblemes.disabled = true;
  }
}

// fonction pour envoyer un avis
function envoyerCommentaire() {
  const reservationTermine = JSON.parse(
    localStorage.getItem("reservationTerminee")
  );
  if (!reservationTermine || !reservationTermine.id) {
    console.error("Impossible d’envoyer l’avis : réservation introuvable.");
    return;
  }

  const reservationId = reservationTermine.id;
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const dataForm = new FormData(avisPassagerForm);
  const raw = JSON.stringify({
    note: parseInt(dataForm.get("note_chauffeur_avis")),
    commentaire: dataForm.get("commentaire_avis"),
    reservation: reservationId,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8000/api/avis", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Réponse du serveur :", result);
      // Supprimer la réservation du localStorage
      localStorage.removeItem("reservationTerminee");

      // Récupérer les anciens avis (ou tableau vide si aucun encore)
      const anciensAvis =
        JSON.parse(localStorage.getItem("commentairesAvis")) || [];

      // Ajouter le nouvel avis au tableau
      anciensAvis.push(result);

      // Sauvegarder le tableau mis à jour dans le localStorage
      localStorage.setItem("commentairesAvis", JSON.stringify(anciensAvis));

      window.location.href = "/espaceUtilisateur";
    })
    .catch((error) => console.error("Erreur lors de l’envoi :", error));
}

//fonction pour remonter un probleme
function remonterUnProbleme() {
  const reservationTermine = JSON.parse(
    localStorage.getItem("reservationTerminee")
  );
  if (!reservationTermine || !reservationTermine.id) {
    console.error("Impossible d’envoyer l’avis : réservation introuvable.");
    return;
  }

  const reservationId = reservationTermine.id;
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const dataForm = new FormData(avisPassagerForm);
  const raw = JSON.stringify({
    note: parseInt(dataForm.get("note_chauffeur_avis")),
    commentaire: dataForm.get("commentaire_avis"),
    reservation: reservationId,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8000/api/avis", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Réponse du serveur :", result);
      // Supprimer la réservation du localStorage
      localStorage.removeItem("reservationTerminee");

      // Générer un identifiant unique style #CV123456
      const uniqueId = "#CV" + Math.floor(100000 + Math.random() * 900000);

      // Ajouter l'identifiant au résultat (ajout d'une propriété locale)
      result.codeProbleme = uniqueId;

      // Récupérer les anciens problèmes ou tableau vide
      const anciensProblemes =
        JSON.parse(localStorage.getItem("problemesTrajet")) || [];

      // Ajouter le nouveau problème avec code
      anciensProblemes.push(result);

      // Sauvegarder le tout
      localStorage.setItem("problemesTrajet", JSON.stringify(anciensProblemes));

      window.location.href = "/espaceUtilisateur";
    })
    .catch((error) => console.error("Erreur lors de l’envoi :", error));
}

const reservationTermine = JSON.parse(
  localStorage.getItem("reservationTerminee")
);

if (
  !reservationTermine ||
  !reservationTermine.trajet ||
  !reservationTermine.trajet.chauffeur
) {
  console.error("Aucune réservation valide trouvée.");
} else {
  inputPseudoAvis.value = reservationTermine.trajet.chauffeur.pseudo || "";
}

//Demande de remplissage du champs requis
function validateAvisRequired(input) {
  if (input.value.trim() != "") {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

//Demande de remplissage du champs requis
function validNote(input) {
  // Regex pour autoriser uniquement les entiers entre 0 et 5
  const noteRegex = /^[0-5]$/;
  const noteValue = input.value.trim();

  if (noteRegex.test(noteValue)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}
