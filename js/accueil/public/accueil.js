const itineraireAccueilForm = document.getElementById("itineraire-accueil");
const adresseDepartAccueil = document.getElementById("departInput");
const btnSwicthAdresseAccueil = document.getElementById("btn-switch-accueil");
const adresseArriveeAccueil = document.getElementById("arriveeInput");
const dateDepartAccueil = document.getElementById("accueilDateInput");
const btnTrouverItineraireAccueil = document.getElementById(
  "btn-trouver-itineraire-accueil"
);

btnTrouverItineraireAccueil.disabled = true;

btnSwicthAdresseAccueil.addEventListener("click", switchAdresseAccueil);

adresseDepartAccueil.addEventListener("keyup", validInputAccueil);
adresseArriveeAccueil.addEventListener("keyup", validInputAccueil);
dateDepartAccueil.addEventListener("keyup", validInputAccueil);

btnTrouverItineraireAccueil.addEventListener("click", trouverItineraireAccueil);

function validInputAccueil() {
  const adresseDepartAccueilOk =
    validateAccueilInputRequired(adresseDepartAccueil);
  const adresseArriveeAccueilOk = validateAccueilInputRequired(
    adresseArriveeAccueil
  );
  const dateDepartAccueilOk = validAcceuilDate(dateDepartAccueil);

  if (
    adresseDepartAccueilOk &&
    adresseArriveeAccueilOk &&
    dateDepartAccueilOk
  ) {
    btnTrouverItineraireAccueil.disabled = false;
  } else {
    btnTrouverItineraireAccueil.disabled = true;
  }
}

function trouverItineraireAccueil() {
  const dataForm = new FormData(itineraireAccueilForm);

  const adresseDepart = dataForm.get("depart_accueil").trim();
  const adresseArrivee = dataForm.get("arrivee_accueil").trim();
  const date = dataForm.get("date_accueil").trim();

  // Validation de la date
  if (!isValidAcceuilDateFR(date)) {
    afficherErreurModalBodyAccueil(
      "Veuillez entrer une date valide au format jj/mm/aaaa."
    );
    return; // Stopper la fonction si la date est invalide
  }

  // Convertir la date jj/mm/aaaa => aaaa-mm-jj
  const [day, month, year] = date.split("/");
  const dateFormatted = `${year}-${month}-${day}`;

  // Construire dynamiquement l'URL avec les paramètres
  const url = new URL(apiUrl + "trajet/api/listeTrajets");
  url.searchParams.append("adresseDepart", adresseDepart);
  url.searchParams.append("adresseArrivee", adresseArrivee);
  url.searchParams.append("dateDepart", dateFormatted);

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur serveur : " + response.status);
      }
      return response.json();
    })
    .then((result) => {
      localStorage.setItem("resultTrajets", JSON.stringify(result));
      window.location.href = "/resultCovoiturage";
    })
    .catch((error) => {
      // console.error("Erreur API :", error);
      afficherErreurModalBodyAccueil("Impossible de récupérer les trajets.");
    });
}

function switchAdresseAccueil() {
  const adresseDepart = adresseDepartAccueil.value;
  const adresseArrivee = adresseArriveeAccueil.value;
  adresseDepartAccueil.value = adresseArrivee;
  adresseArriveeAccueil.value = adresseDepart;
}

function isValidAcceuilDateFR(dateStr) {
  const [d, m, y] = dateStr.split("/");
  if (!d || !m || !y) return false;
  const date = new Date(`${y}-${m}-${d}`);
  return (
    date instanceof Date &&
    !isNaN(date) &&
    date.getDate() === parseInt(d, 10) &&
    date.getMonth() + 1 === parseInt(m, 10) &&
    date.getFullYear() === parseInt(y, 10)
  );
}

//Demande de remplissage du champs requis
function validateAccueilInputRequired(input) {
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

function validAcceuilDate(input) {
  // Regex pour valider le format jj/mm/aaaa
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const dateUser = input.value.trim();

  if (!dateRegex.test(dateUser)) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }

  // Extraire jour, mois, année
  const [day, month, year] = dateUser.split("/");
  const date = new Date(`${year}-${month}-${day}`);

  if (isNaN(date.getTime())) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }

  // Date du jour (à minuit)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Vérification uniquement que la date n’est pas dans le passé
  if (date < today) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }

  // Tout est ok
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
  return true;
}

function afficherErreurModalBodyAccueil(message) {
  const errorModalBody = document.getElementById("errorModalBodyAccueil");
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}
