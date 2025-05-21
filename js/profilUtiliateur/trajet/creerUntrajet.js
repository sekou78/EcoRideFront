const creerVoyage = document.getElementById("trajet-form");
const departAdresse = document.getElementById("depart-trajet-adresse");
const arriveeAdresse = document.getElementById("arrivee-trajet-adresse");
const dateDepart = document.getElementById("date-depart");
const dateArrivee = document.getElementById("date-arrivee");
const heureDepart = document.getElementById("heure-depart");
const duree = document.getElementById("duree-voyage");
const peage = document.getElementById("peage-trajet");
const prix = document.getElementById("prix-trajet");
const trajetEcologique = document.getElementById("trajet-ecologique");
const placesDisponibles = document.getElementById("places-disponibles");
const statutVoyage = document.getElementById("etat-voyage");
const btnValidationVoyage = document.getElementById("btn-ajouter-voyage");

btnValidationVoyage.disabled = true;

departAdresse.addEventListener("input", validInputVoyage);
arriveeAdresse.addEventListener("input", validInputVoyage);
dateDepart.addEventListener("input", validInputVoyage);
dateArrivee.addEventListener("input", validInputVoyage);
heureDepart.addEventListener("input", validInputVoyage);
duree.addEventListener("input", validInputVoyage);
prix.addEventListener("input", validInputVoyage);
placesDisponibles.addEventListener("input", validInputVoyage);
statutVoyage.addEventListener("change", validInputVoyage);

btnValidationVoyage.addEventListener("click", validateVoyageForm);

function validInputVoyage() {
  const departAdresseOk = validateVoyageRequired(departAdresse);
  const arriveeAdresseOk = validateVoyageRequired(arriveeAdresse);
  const dateDepartOk = validDate(dateDepart);
  const dateArriveeOk = validDate(dateArrivee);
  const heureDepartOk = validHour(heureDepart);
  const dureeOk = validHour(duree);
  const prixOk = validateVoyageRequired(prix);
  const placesDisponiblesOk = validnbresPlaces(placesDisponibles);
  const statutOk = validateVoyageRequired(statutVoyage);

  if (
    departAdresseOk &&
    arriveeAdresseOk &&
    dateDepartOk &&
    dateArriveeOk &&
    heureDepartOk &&
    dureeOk &&
    prixOk &&
    placesDisponiblesOk &&
    statutOk
  ) {
    btnValidationVoyage.disabled = false;
  } else {
    btnValidationVoyage.disabled = true;
  }
}

function validateVoyageForm() {
  let dataForm = new FormData(creerVoyage);
  const token = getCookie(tokenCookieName);

  // Récupérer le statut selectionné
  const statutMap = {
    1: "EN_ATTENTE",
    2: "EN_COURS",
    3: "TERMINEE",
  };

  const selectedStatut = statutMap[statutVoyage.value];

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const raw = JSON.stringify({
    adresseDepart: dataForm.get("depart_trajet_adresse"),
    adresseArrivee: dataForm.get("arrivee_trajet_adresse"),
    dateDepart: dataForm.get("date_depart"),
    dateArrivee: dataForm.get("date_arrivee"),
    heureDepart: dataForm.get("heure_depart"),
    dureeVoyage: dataForm.get("duree_voyage"),
    peage: dataForm.get("peage_trajet") !== null,
    prix: dataForm.get("prix_trajet"),
    estEcologique: dataForm.get("trajet_ecologique") !== null,
    nombrePlacesDisponible: parseInt(dataForm.get("places_disponibles"), 10),
    statut: selectedStatut,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl + "trajet", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("Une erreur est survenue");
      }
    })
    .then((result) => {
      alert("Trajet créer.");
    })
    .catch((error) => {
      console.error(error);
      alert("Trajet non créer.");
    });
  // Rediriger vers la page du profil utilisateur
  window.location.href = "/espaceUtilisateur";
}

//Demande de remplissage du champs requis
function validateVoyageRequired(input) {
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

//Regex pour valider les dates au format jj/mm/aaaa
function validDate(input) {
  const dateUser = input.value.trim();
  const dateRegexFR = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const dateRegexISO = /^\d{4}-\d{2}-\d{2}$/;

  const isValid = dateRegexFR.test(dateUser) || dateRegexISO.test(dateUser);

  input.classList.toggle("is-valid", isValid);
  input.classList.toggle("is-invalid", !isValid);

  return isValid;
}

function validHour(input) {
  //Regex pour valider les heures au format hh:mm
  const hourRegex = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
  const hourUser = input.value.trim();

  if (hourRegex.test(hourUser)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

function validnbresPlaces(input) {
  //Regex pour valider les nombres de places
  const nbresPlacesRegex = /^\d+$/;
  const nbresPlacesUser = input.value.trim();

  if (nbresPlacesRegex.test(nbresPlacesUser)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}
