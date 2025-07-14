const inputInscriptionPseudo = document.getElementById("pseudoInsciptionInput");
const inputInscriptionEmail = document.getElementById("emailInsciptionInput");
const inputInscriptionPassword = document.getElementById(
  "PasswordInsciptionInput"
);
const checkboxInscriptionPassword = document.getElementById(
  "checkInscriptionPassword"
);
const btnValidationInscription = document.getElementById(
  "btn-validation-inscription"
);
const formInscription = document.getElementById("formulaireInscription");

inputInscriptionPseudo.addEventListener("keyup", validateInsciptionForm);
inputInscriptionEmail.addEventListener("keyup", validateInsciptionForm);
inputInscriptionPassword.addEventListener("keyup", validateInsciptionForm);
checkboxInscriptionPassword.addEventListener("click", showInscriptionPassword);
btnValidationInscription.addEventListener("click", validInscription);
btnValidationInscription.disabled = true;

function validateInsciptionForm() {
  const pseudoOK = validateInscriptionRequired(inputInscriptionPseudo);
  const emailOK = validateInscriptionRequired(inputInscriptionEmail);
  const EmailOK = validateMailInscription(inputInscriptionEmail);
  const passwordOK = validateInscriptionRequired(inputInscriptionPassword);
  const PasswordOK = validatePasswordInscription(inputInscriptionPassword);

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
  if (inputInscriptionPassword.type === "password") {
    inputInscriptionPassword.type = "text";
  } else {
    inputInscriptionPassword.type = "password";
  }
}

// Fonction principale : Enregistrer l'inscription
function validInscription() {
  let dataForm = new FormData(formInscription);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email: dataForm.get("email"),
    password: dataForm.get("mdp"),
    pseudo: dataForm.get("pseudo"),
    roles: ["ROLE_USER"],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl + "registration", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        afficherErreurModalBodyInscription("Erreur lors de l'inscription");
      }
    })
    .then((result) => {
      afficherErreurModalBodyInscription(
        "Bravo ! " +
          dataForm.get("pseudo") +
          " Vous pouvez maintenant vous connecter."
      );
      document.location.href = "/connexion";
    })
    .catch((error) => {
      console.error(error);
      afficherErreurModalBodyInscription(
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      );
    });
}

function afficherErreurModalBodyInscription(message) {
  const errorModalBody = document.getElementById("errorModalBodyInscription");
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}
