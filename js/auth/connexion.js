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
const formConnexion = document.getElementById("formulaireConnexion");

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
  let dataForm = new FormData(formConnexion);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    username: dataForm.get("email"),
    password: dataForm.get("mdp"),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl + "login", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        inputConnexionEmail.classList.add("is-invalid");
        inputConnexionPassword.classList.add("is-invalid");
      }
    })
    .then((result) => {
      const token = result.apiToken;
      setToken(token);

      setCookie(RoleCookieName, result.roles[0], 7);
      window.location.replace("/");
    })
    .catch((error) => console.error(error));
}
