const modifProfil = document.getElementById("profil-form");
const avatar = document.getElementById("avatar");
const role = document.getElementById("role");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const telephone = document.getElementById("telephone");
const adressePerso = document.getElementById("adresse-perso");
const dateNaissance = document.getElementById("date_naissance");
const immatriculation = document.getElementById("immatriculation");
const dateImmatriculation = document.getElementById("date_immatriculation");
const vehiculeInfo = document.getElementById("vehicule_info");
const fumeur = document.getElementById("fumeur");
const animal = document.getElementById("animal");
const preferencesAutres = document.getElementById("preferences_autres");
const btnValidationModifProfil = document.getElementById("btn-modif");

btnValidationModifProfil.disabled = true;

telephone.addEventListener("input", validModifProfilInput);
adressePerso.addEventListener("input", validModifProfilInput);
nom.addEventListener("input", validModifProfilInput);
prenom.addEventListener("input", validModifProfilInput);
dateNaissance.addEventListener("input", validModifProfilInput);
immatriculation.addEventListener("input", validModifProfilInput);
dateImmatriculation.addEventListener("input", validModifProfilInput);
vehiculeInfo.addEventListener("input", validModifProfilInput);

avatar.addEventListener("change", avatarUrl);
btnValidationModifProfil.addEventListener("click", validateModifProfilForm);

function validModifProfilInput() {
  const telephoneOk = validTelephone(telephone);
  const adressePersoOk = validateModifProfilInfosRequired(adressePerso);
  const nomOk = validateModifProfilInfosRequired(nom);
  const prenomOk = validateModifProfilInfosRequired(prenom);
  const dateNaissanceOk = validDate(dateNaissance);
  const immatriculationOk = validImmatriculation(immatriculation);
  const dateImmatriculationOk = validDate(dateImmatriculation);
  const vehiculeInfoOk = validateModifProfilInfosRequired(vehiculeInfo);

  if (
    telephoneOk &&
    adressePersoOk &&
    nomOk &&
    prenomOk &&
    dateNaissanceOk &&
    immatriculationOk &&
    dateImmatriculationOk &&
    vehiculeInfoOk
  ) {
    btnValidationModifProfil.disabled = false;
  } else {
    btnValidationModifProfil.disabled = true;
  }
}

function validateModifProfilForm() {
  let dataForm = new FormData(modifProfil);
  const token = getCookie(tokenCookieName);

  // Récupérer le rôle sélectionné
  const selectedRole = role.value;
  let selectedRoles = [];

  if (selectedRole === "passager") {
    selectedRoles = ["ROLE_PASSAGER"];
  } else if (selectedRole === "chauffeur") {
    selectedRoles = ["ROLE_CHAUFFEUR"];
  } else if (selectedRole === "chauffeur_passager") {
    selectedRoles = ["ROLE_CHAUFFEUR", "ROLE_PASSAGER"];
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const raw = JSON.stringify({
    nom: dataForm.get("nom"),
    prenom: dataForm.get("prenom"),
    telephone: dataForm.get("telephone"),
    adresse: dataForm.get("adresse-perso"),
    dateNaissance: dataForm.get("date_naissance"),
    image: 0,
    roles: selectedRoles,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl + "account/edit", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("Une erreur est survenue");
      }
    })
    .then((result) => {
      alert("Compte modifié.");

      document.location.href = "/espaceUtilisateur";
    })
    .catch((error) => {
      console.error(error);
      alert("Compte non modifié.");
    });
}

function avatarUrl(event) {
  const avatar = event.target.files[0];
  if (!avatar) return;

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", "••••••");

  const formdata = new FormData();
  formdata.append("image", avatar);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  fetch("http://localhost:8000/api/image", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("Une erreur est survenue");
      }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  // // Récupérer le fichier sélectionné
  // const file = event.target.files[0];

  // if (file) {
  //   // Créer un FileReader pour lire l'image
  //   const reader = new FileReader();

  //   reader.onloadend = function () {
  //     // Une fois la lecture terminée, récupérer l'URL de l'image
  //     const avatarDataUrl = reader.result;

  //     // Sauvegarder l'URL dans localStorage (en base64)
  //     localStorage.setItem("avatar", avatarDataUrl);
  //   };

  //   // Lire l'image comme une URL de données (base64)
  //   reader.readAsDataURL(file);
  // }
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
