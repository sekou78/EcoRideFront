const inputInsciptionPseudo = document.getElementById("pseudoInsciptionInput");
const inputInsciptionEmail = document.getElementById("emailInsciptionInput");
const inputInsciptionPassword = document.getElementById(
  "PasswordInsciptionInput"
);
const checkboxInscriptionPassword = document.getElementById(
  "checkInscriptionPassword"
);
const btnValidationInscription = document.getElementById(
  "btn-validation-inscription"
);

inputInsciptionPseudo.addEventListener("keyup", validateInsciptionForm);
inputInsciptionEmail.addEventListener("keyup", validateInsciptionForm);
inputInsciptionPassword.addEventListener("keyup", validateInsciptionForm);
checkboxInscriptionPassword.addEventListener("click", showInscriptionPassword);
btnValidationInscription.addEventListener("click", inscriptionCredentials);
btnValidationInscription.disabled = true;

function validateInsciptionForm() {
  const pseudoOK = validateInscriptionRequired(inputInsciptionPseudo);
  const emailOK = validateInscriptionRequired(inputInsciptionEmail);
  const EmailOK = validateMailInscription(inputInsciptionEmail);
  const passwordOK = validateInscriptionRequired(inputInsciptionPassword);
  const PasswordOK = validatePasswordInscription(inputInsciptionPassword);

  if (pseudoOK && emailOK && EmailOK && passwordOK && PasswordOK) {
    btnValidationInscription.disabled = false;
  } else {
    btnValidationInscription.disabled = true;
  }
}

//Demande de remplissage du champs requis
function validateInscriptionRequired(input) {
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

//Demande de remplissage du champs au bon format email requis
function validateMailInscription(input) {
  //definir le regex du champs mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mailUser = input.value;
  if (mailUser.match(emailRegex)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

//Demande de remplissage du champs au bon format password
//(minimum 8 caractères composées des lettres, des chiffres et
//des symboles dont une lettre en majuscule) requis
function validatePasswordInscription(input) {
  //definir le regex du champs password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  const passwordUser = input.value;
  if (passwordUser.match(passwordRegex)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

//Montrer le mot de passe ou masquer le mot de passe inscription
function showInscriptionPassword() {
  if (inputInsciptionPassword.type === "password") {
    inputInsciptionPassword.type = "text";
  } else {
    inputInsciptionPassword.type = "password";
  }
}

// Fonction principale : Enregistrer l'inscription
function inscriptionCredentials() {
  const pseudoUser = inputInsciptionPseudo.value.trim();
  const emailUser = inputInsciptionEmail.value.trim();
  const passwordUser = inputInsciptionPassword.value;

  // Vérifier si l'email est déjà utilisé
  if (localStorage.getItem(emailUser)) {
    alert("Cet email est déjà utilisé !");
    return;
  }

  // Vider le localStorage avant d'enregistrer un nouvel utilisateur
  localStorage.clear();

  // Création de l'objet utilisateur avec 20 crédits
  const nouvelUtilisateur = {
    pseudo: pseudoUser,
    email: emailUser,
    password: passwordUser,
    credits: 20,
  };

  // Stocker l'utilisateur dans localStorage
  localStorage.setItem(emailUser, JSON.stringify(nouvelUtilisateur));
  localStorage.setItem("currentUser", emailUser);

  alert(
    `Inscription réussie ! Bienvenue ${pseudoUser}, vous avez reçu 20 crédits.`
  );

  // Rediriger vers l'espace utilisateur
  window.location.href = "/connexion";
}
