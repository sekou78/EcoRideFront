const inputConnexionEmail = document.getElementById("emailConnexionInput");
const inputConnexionPassword = document.getElementById(
  "PasswordConnexionInput"
);
const checkboxConnexionPassword = document.getElementById(
  "checkConnexionPassword"
);
const btnValidationConnexion = document.getElementById(
  "btn-validation-connexion"
);

inputConnexionEmail.addEventListener("keyup", validateConnexionForm);
inputConnexionPassword.addEventListener("keyup", validateConnexionForm);
checkboxConnexionPassword.addEventListener("click", showConnexionPassword);
btnValidationConnexion.disabled = true;
btnValidationConnexion.addEventListener("click", validConnexion);

function validateConnexionForm() {
  const emailOK = validateConnexionRequired(inputConnexionEmail);
  const EmailOK = validateMailConnexion(inputConnexionEmail);
  const passwordOK = validateConnexionRequired(inputConnexionPassword);
  const PasswordOK = validatePasswordConnexion(inputConnexionPassword);

  if (emailOK && EmailOK && passwordOK && PasswordOK) {
    btnValidationConnexion.disabled = false;
  } else {
    btnValidationConnexion.disabled = true;
  }
}

//Demande de remplissage du champs requis
function validateConnexionRequired(input) {
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

//Demande de remplissage du champs au bon format email requis
function validateMailConnexion(input) {
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
function validatePasswordConnexion(input) {
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

//Montrer le mot de passe ou masquer le mot de passe connexion
function showConnexionPassword() {
  if (inputConnexionPassword.type === "password") {
    inputConnexionPassword.type = "text";
  } else {
    inputConnexionPassword.type = "password";
  }
}

function validConnexion() {
  //Ici, il faudra appeler l'Api pour verifier l'authentification en BDD
  // if (
  //   inputConnexionEmail.value == "folo223@mail.com" &&
  //   inputConnexionPassword.value == "Azerty$123"
  // ) {
  //   alert("Vous êtes connecté");

  //   //il faudra remplacer ce token par le vrai token de connexion
  //   const token = "jeDevraiEtreLeVraiTokenDeConnexion";
  //   setToken(token);

  //   //Placer ce token en cookie
  //   // setCookie(RoleCookieName, "chauffeur", 7);
  //   // setCookie(RoleCookieName, "passager", 7);
  //   // setCookie(RoleCookieName, "chauffeur & passager", 7);
  //   // setCookie(RoleCookieName, "employee", 7);
  //   setCookie(RoleCookieName, "admin", 7);
  //   // setCookie(RoleCookieName, "visiteur", 7);

  //   window.location.replace("/espaceUtilisateur");
  // }

  // Récupérer l'utilisateur dans localStorage
  const userStokageLocal = localStorage.getItem(inputConnexionEmail.value);

  if (!userStokageLocal) {
    alert("Aucun compte trouvé avec cet email.");
    return;
  }

  // Convertir les données JSON en objet JavaScript
  const user = JSON.parse(userStokageLocal);

  // Vérifier si le mot de passe est correct
  if (user.password !== inputConnexionPassword.value) {
    alert("Mot de passe incorrect.");
    return;
  }

  //il faudra remplacer ce token par le vrai token de connexion
  const token = "jeDevraiEtreLeVraiTokenDeConnexion";
  setToken(token);

  //Placer ce token en cookie
  //setCookie(RoleCookieName, "chauffeur", 7);
  // setCookie(RoleCookieName, "passager", 7);
  // setCookie(RoleCookieName, "chauffeur & passager", 7);
  // setCookie(RoleCookieName, "employee", 7);
  setCookie(RoleCookieName, "admin", 7);
  // setCookie(RoleCookieName, "visiteur", 7);

  window.location.replace("/espaceUtilisateur");
}
