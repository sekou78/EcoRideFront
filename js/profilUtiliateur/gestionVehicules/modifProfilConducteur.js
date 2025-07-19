const chauffeurInfo = document.getElementById("chauffeur-form");
const immatriculation = document.getElementById("immatriculation");
const dateImmatriculation = document.getElementById("date_immatriculation");
const marqueVehiculeInfo = document.getElementById("marque_vehicule");
const modeleVehiculeInfo = document.getElementById("modele_vehicule");
const couleurVehiculeInfo = document.getElementById("couleur_vehicule");
const placesDisponibles = document.getElementById("places_disponibles");
const electrique = document.getElementById("electrique");
const btnValidationChargerProfilConducteur = document.getElementById(
  "btn-enregistrer-vehicule"
);

btnValidationChargerProfilConducteur.disabled = true;

immatriculation.addEventListener("input", validModifProfilInput);
dateImmatriculation.addEventListener("input", validModifProfilInput);
marqueVehiculeInfo.addEventListener("input", validModifProfilInput);
modeleVehiculeInfo.addEventListener("input", validModifProfilInput);
couleurVehiculeInfo.addEventListener("input", validModifProfilInput);
placesDisponibles.addEventListener("input", validModifProfilInput);
electrique.addEventListener("input", validModifProfilInput);

btnValidationChargerProfilConducteur.addEventListener(
  "click",
  validateEnregistrerVehicule
);

function validModifProfilInput() {
  const immatriculationOk = validImmatriculation(immatriculation);
  const dateImmatriculationOk = validDate(dateImmatriculation);
  const marqueVehiculeInfoOk =
    validateModifProfilInfosRequired(marqueVehiculeInfo);
  const modeleVehiculeInfoOk =
    validateModifProfilInfosRequired(modeleVehiculeInfo);
  const couleurVehiculeInfoOk =
    validateModifProfilInfosRequired(couleurVehiculeInfo);

  if (
    immatriculationOk &&
    dateImmatriculationOk &&
    marqueVehiculeInfoOk &&
    modeleVehiculeInfoOk &&
    couleurVehiculeInfoOk
  ) {
    btnValidationChargerProfilConducteur.disabled = false;
  } else {
    btnValidationChargerProfilConducteur.disabled = true;
  }
}

async function validateEnregistrerVehicule() {
  //Récuperer le profil du conducteur
  let dataForm = new FormData(chauffeurInfo);

  const token = getCookie(tokenCookieName);

  function convertToISO(dateStr) {
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) return null;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const raw = JSON.stringify({
    plaqueImmatriculation: dataForm.get("immatriculation"),
    dateImmatriculation: convertToISO(dataForm.get("date_immatriculation")),
    marque: dataForm.get("marque-vehicule"),
    modele: dataForm.get("modele-vehicule"),
    couleur: dataForm.get("couleur-vehicule"),
    nombrePlaces: parseInt(dataForm.get("places-disponibles")),
    electrique: dataForm.get("electrique") !== null,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(apiUrl + "profilConducteur", requestOptions);
    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi du profil conducteur");
    }

    const result = await response.json();
    document.location.href = "/espaceUtilisateur";
  } catch (error) {
    console.error(error);
    afficherErreurModalBodyModifProfilConducteur(
      "Vehicule non enregistré. Veuillez vérifier les informations saisies."
    );
  }
}

//Demande de remplissage du champs requis
function validateModifProfilInfosRequired(input) {
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

function afficherErreurModalBodyModifProfilConducteur(message) {
  const errorModalBody = document.getElementById(
    "errorModalBodyModifProfilConducteur"
  );
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
