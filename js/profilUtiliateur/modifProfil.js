const modifProfil = document.getElementById("profil-form");
const creerVoyage = document.getElementById("voyage-form");
const avatar = document.getElementById("avatar");
const role = document.getElementById("role");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const telephone = document.getElementById("telephone");
const dateNaissance = document.getElementById("date_naissance");
const depart = document.getElementById("depart");
const arrivee = document.getElementById("arrivee");
const date = document.getElementById("date-voyage");
const heure = document.getElementById("heure-voyage");
const peage = document.getElementById("peage");
const duree = document.getElementById("duree-voyage");
const prix = document.getElementById("prix");
const immatriculation = document.getElementById("immatriculation");
const dateImmatriculation = document.getElementById("date_immatriculation");
const vehiculeInfo = document.getElementById("vehicule_info");
const placesDisponibles = document.getElementById("places_disponibles");
const electrique = document.getElementById("electrique");
const fumeur = document.getElementById("fumeur");
const animal = document.getElementById("animal");
const preferencesAutres = document.getElementById("preferences_autres");
const btnValidationModifProfil = document.getElementById("btn-modif");
const btnValidationVoyage = document.getElementById("btn-ajouter-voyage");

btnValidationModifProfil.disabled = true;

telephone.addEventListener("keyup", validModifProfilInput);
nom.addEventListener("keyup", validModifProfilInput);
prenom.addEventListener("keyup", validModifProfilInput);
dateNaissance.addEventListener("keyup", validModifProfilInput);
immatriculation.addEventListener("keyup", validModifProfilInput);
dateImmatriculation.addEventListener("keyup", validModifProfilInput);
vehiculeInfo.addEventListener("keyup", validModifProfilInput);
placesDisponibles.addEventListener("keyup", validModifProfilInput);

depart.addEventListener("keyup", validInputVoyage);
arrivee.addEventListener("keyup", validInputVoyage);
date.addEventListener("keyup", validInputVoyage);
heure.addEventListener("keyup", validInputVoyage);
prix.addEventListener("keyup", validInputVoyage);

btnValidationVoyage.disabled = true;

avatar.addEventListener("change", avatarUrl);
btnValidationModifProfil.addEventListener("click", validateModifProfilForm);
btnValidationVoyage.addEventListener("click", validateVoyageForm);

function validModifProfilInput() {
  const telephoneOk = validTelephone(telephone);
  const nomOk = validateVoyageRequired(nom);
  const prenomOk = validateVoyageRequired(prenom);
  const dateNaissanceOk = validDate(dateNaissance);
  const immatriculationOk = validImmatriculation(immatriculation);
  const dateImmatriculationOk = validDate(dateImmatriculation);
  const vehiculeInfoOk = validateVoyageRequired(vehiculeInfo);
  const placesDisponiblesOk = validateVoyageRequired(placesDisponibles);

  if (
    telephoneOk &&
    nomOk &&
    prenomOk &&
    dateNaissanceOk &&
    immatriculationOk &&
    dateImmatriculationOk &&
    vehiculeInfoOk &&
    placesDisponiblesOk
  ) {
    btnValidationModifProfil.disabled = false;
  } else {
    btnValidationModifProfil.disabled = true;
  }
}

function validInputVoyage() {
  const departOk = validateVoyageRequired(depart);
  const arriveeOk = validateVoyageRequired(arrivee);
  const dateOk = validDate(date);
  const heureOk = validateVoyageRequired(heure);
  const prixOk = validateVoyageRequired(prix);

  if (departOk && arriveeOk && dateOk && heureOk && prixOk) {
    btnValidationVoyage.disabled = false;
  } else {
    btnValidationVoyage.disabled = true;
  }
}

function validateModifProfilForm() {
  const avatarValue = localStorage.getItem("avatar");
  const roleValue = role.value;
  const nomValue = nom.value;
  const prenomValue = prenom.value;
  const telephoneValue = telephone.value;
  const dateNaissanceValue = dateNaissance.value;
  const immatriculationValue = immatriculation.value;
  const dateImmatriculationValue = dateImmatriculation.value;
  const vehiculeInfoValue = vehiculeInfo.value;
  const placesDisponiblesValue = placesDisponibles.value;
  const electriqueValue = electrique.checked ? "Oui" : "Non";
  const fumeurValue = fumeur.checked ? "Oui" : "Non";
  const animalValue = animal.checked ? "Oui" : "Non";
  const preferencesAutresValue = preferencesAutres.value;

  // Sauvegarder les données dans localStorage
  localStorage.setItem("role", roleValue);
  localStorage.setItem("nom", nomValue);
  localStorage.setItem("prenom", prenomValue);
  localStorage.setItem("telephone", telephoneValue);
  localStorage.setItem("dateNaissance", dateNaissanceValue);
  localStorage.setItem("immatriculation", immatriculationValue);
  localStorage.setItem("dateImmatriculation", dateImmatriculationValue);
  localStorage.setItem("vehiculeInfo", vehiculeInfoValue);
  localStorage.setItem("placesDisponibles", placesDisponiblesValue);
  localStorage.setItem("electrique", electriqueValue);
  localStorage.setItem("fumeur", fumeurValue);
  localStorage.setItem("animal", animalValue);
  localStorage.setItem("preferencesAutres", preferencesAutresValue);

  // Rediriger vers la page du profil utilisateur (ou mettre à jour la page)
  window.location.href = "/espaceUtilisateur";
}

function avatarUrl(event) {
  // Récupérer le fichier sélectionné
  const file = event.target.files[0];

  if (file) {
    // Créer un FileReader pour lire l'image
    const reader = new FileReader();

    reader.onloadend = function () {
      // Une fois la lecture terminée, récupérer l'URL de l'image
      const avatarDataUrl = reader.result;

      // Sauvegarder l'URL dans localStorage (en base64)
      localStorage.setItem("avatar", avatarDataUrl);
    };

    // Lire l'image comme une URL de données (base64)
    reader.readAsDataURL(file);
  }
}

function validateVoyageForm() {
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

//Demande de remplissage du champs au bon format requis
function validTelephone(input) {
  // Regex pour les numéros français (06XXXXXXXX ou +33 6XXXXXXXX)
  const telephoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;

  // Supprime les espaces et récupère le numéro brut
  let telephoneUser = input.value.replace(/\s+/g, "");

  // Vérification du format
  if (telephoneRegex.test(telephoneUser)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");

    // Ajoute automatiquement les espaces tous les 2 chiffres
    input.value = telephoneUser
      .replace(
        /^(\+33|0)([1-9])(\d{2})(\d{2})(\d{2})(\d{2})$/,
        "$1 $2 $3 $4 $5 $6"
      )
      .trim();

    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
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

//Demande de remplissage du champs immatriculation au bon format requis
function validImmatriculation(input) {
  // Regex pour une plaque française (AA-123-AA ou 123-AB-45)
  const immatriculationRegex =
    /^[A-Z]{2}-\d{3}-[A-Z]{2}$|^\d{3}-[A-Z]{2}-\d{2}$/;

  // Nettoie et met en majuscules
  const valeur = input.value.trim().toUpperCase();

  if (immatriculationRegex.test(valeur)) {
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
