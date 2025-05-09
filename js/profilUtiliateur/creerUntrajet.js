const creerVoyage = document.getElementById("voyage-form");
const depart = document.getElementById("depart");
const arrivee = document.getElementById("arrivee");
const date = document.getElementById("date-voyage");
const heure = document.getElementById("heure-voyage");
const peage = document.getElementById("peage");
const duree = document.getElementById("duree-voyage");
const prix = document.getElementById("prix");
const placesDisponibles = document.getElementById("places_disponibles");
const electrique = document.getElementById("electrique");
const btnValidationVoyage = document.getElementById("btn-ajouter-voyage");

depart.addEventListener("keyup", validInputVoyage);
arrivee.addEventListener("keyup", validInputVoyage);
date.addEventListener("keyup", validInputVoyage);
heure.addEventListener("keyup", validInputVoyage);
prix.addEventListener("keyup", validInputVoyage);
placesDisponibles.addEventListener("keyup", validInputVoyage);

btnValidationVoyage.disabled = true;

btnValidationVoyage.addEventListener("click", validateVoyageForm);

function validInputVoyage() {
  const departOk = validateVoyageRequired(depart);
  const arriveeOk = validateVoyageRequired(arrivee);
  const dateOk = validDate(date);
  const heureOk = validateVoyageRequired(heure);
  const prixOk = validateVoyageRequired(prix);
  const placesDisponiblesOk = validateVoyageRequired(placesDisponibles);

  if (
    departOk &&
    arriveeOk &&
    dateOk &&
    heureOk &&
    prixOk &&
    placesDisponiblesOk
  ) {
    btnValidationVoyage.disabled = false;
  } else {
    btnValidationVoyage.disabled = true;
  }
}

function validateVoyageForm() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", "••••••");

  const raw = JSON.stringify({
    adresseDepart: "45 rue de la ville XXXXXX La Ville",
    adresseArrivee: "Parking de la ville XXXXXX La Ville",
    dateDepart: "2025-04-14T08:00:00",
    dateArrivee: "2025-04-14T09:00:00",
    prix: "12.5",
    estEcologique: true,
    nombrePlacesDisponible: 3,
    statut: "EN_ATTENTE",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8000/api/trajet", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  const departValue = depart.value;
  const arriveeValue = arrivee.value;
  const dateValue = date.value;
  const heureValue = heure.value;
  const peageValue = peage.checked ? "Oui" : "Non";
  const dureeValue = duree.value;
  const prixValue = prix.value;

  // Sauvegarder les données dans localStorage
  localStorage.setItem("depart", departValue);
  localStorage.setItem("arrivee", arriveeValue);
  localStorage.setItem("date", dateValue);
  localStorage.setItem("heure", heureValue);
  localStorage.setItem("peage", peageValue);
  localStorage.setItem("duree", dureeValue);
  localStorage.setItem("prix", prixValue);

  // Rediriger vers la page du profil utilisateur (ou mettre à jour la page)
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

function validDate(input) {
  //Regex pour valider les dates au format jj/mm/aaaa
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const dateUser = input.value.trim();

  if (dateRegex.test(dateUser)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}
