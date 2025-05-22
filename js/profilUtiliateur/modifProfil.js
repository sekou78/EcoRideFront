const modifProfil = document.getElementById("profil-form");
const chauffeurPreferences = document.getElementById("preferences-form");
const role = document.getElementById("role");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const telephone = document.getElementById("telephone");
const adressePerso = document.getElementById("adresse-perso");
const dateNaissance = document.getElementById("date_naissance");
const btnValidationModifProfil = document.getElementById("btn-modif");
const fumeur = document.getElementById("fumeur");
const animal = document.getElementById("animal");
const preferencesAutres = document.getElementById("preferences_autres");
const btnValidationPreferencesChauffeur = document.getElementById(
  "btn-preferences-chauffeur"
);

btnValidationModifProfil.disabled = true;

telephone.addEventListener("input", validModifProfilInput);
adressePerso.addEventListener("input", validModifProfilInput);
nom.addEventListener("input", validModifProfilInput);
prenom.addEventListener("input", validModifProfilInput);
dateNaissance.addEventListener("input", validModifProfilInput);

btnValidationModifProfil.addEventListener("click", validateModifProfilForm);
btnValidationPreferencesChauffeur.addEventListener(
  "click",
  preferencesChauffeur
);

function validModifProfilInput() {
  const telephoneOk = validTelephone(telephone);
  const adressePersoOk = validateModifProfilInfosRequired(adressePerso);
  const nomOk = validateModifProfilInfosRequired(nom);
  const prenomOk = validateModifProfilInfosRequired(prenom);
  const dateNaissanceOk = validDate(dateNaissance);

  if (telephoneOk && adressePersoOk && nomOk && prenomOk && dateNaissanceOk) {
    btnValidationModifProfil.disabled = false;
  } else {
    btnValidationModifProfil.disabled = true;
  }
}

function validateModifProfilForm() {
  //appel de la fonction pour la modification du compte
  editCompte();
}

function editCompte() {
  let dataForm = new FormData(modifProfil);
  const token = getCookie(tokenCookieName);

  // Récupérer le rôle sélectionné
  const selectedRole = role.value;
  let selectedRoles = [];
  if (selectedRole === "passager") {
    selectedRoles = ["ROLE_PASSAGER"];
  } else if (selectedRole === "chauffeur") {
    selectedRoles = ["ROLE_CHAUFFEUR"];
  } else if (selectedRole === "passager_chauffeur") {
    selectedRoles = ["ROLE_PASSAGER_CHAUFFEUR"];
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
    roles: selectedRoles,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  // Modifier le profil de l'utilisateur
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

async function preferencesChauffeur() {
  let dataForm = new FormData(chauffeurPreferences);
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const raw = JSON.stringify({
    accepteFumeur: dataForm.get("fumeur") !== null,
    accepteAnimaux: dataForm.get("animal") !== null,
    autresPreferences: dataForm.get("preferences_autres"),
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  // Modifier le profil de l'utilisateur
  fetch(apiUrl + "account/edit", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("Une erreur est survenue");
      }
    })
    .then((result) => {
      document.location.href = "/espaceUtilisateur";
    })
    .catch((error) => {
      console.error(error);
      alert("Preferences chauffeur non modifié.");
    });
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
