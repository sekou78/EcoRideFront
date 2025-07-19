const formchangeMdp = document.getElementById("ChangementMdp-form");
const inputActualPassword = document.getElementById("PasswordActualInput");
const checkInputActualPassword = document.getElementById("checkActualPassword");
const inputValidationNewPassword = document.getElementById(
  "ValidateNewPasswordInput"
);
const inputConfirmNewPassword = document.getElementById(
  "ConfirmNewPasswordInput"
);
const checkInputConfirmNewPassword = document.getElementById(
  "checkNewConfirmNewPassword"
);
const btnValidationSignup = document.getElementById("btn-validation-changeMdp");

btnValidationSignup.disabled = true;

inputActualPassword.addEventListener("keyup", validateChangeMdpForm);
checkInputActualPassword.addEventListener("click", showPassword);
inputValidationNewPassword.addEventListener("keyup", validateChangeMdpForm);
inputConfirmNewPassword.addEventListener("keyup", validateChangeMdpForm);
checkInputConfirmNewPassword.addEventListener("click", showConfirmNewPassword);

btnValidationSignup.addEventListener("click", ChangementMdp);

function validateChangeMdpForm() {
  const passwordOk = validatemdpRequired(inputActualPassword);
  const validatePasswordOk = validatemdpRequired(inputValidationNewPassword);
  const confirmPasswordOk = validatemdpRequired(inputConfirmNewPassword);
  const PasswordOk = validatePassword(inputActualPassword);
  const newPasswordValid = validatePassword(inputValidationNewPassword);
  const passwordConfirmOk = validateConfirmationPassword(
    inputValidationNewPassword,
    inputConfirmNewPassword
  );

  const passwordsAreDifferent =
    inputActualPassword.value !== inputValidationNewPassword.value;

  if (
    passwordOk &&
    validatePasswordOk &&
    confirmPasswordOk &&
    PasswordOk &&
    newPasswordValid &&
    passwordConfirmOk &&
    passwordsAreDifferent
  ) {
    btnValidationSignup.disabled = false;
    inputValidationNewPassword.classList.remove("is-invalid");
  } else {
    btnValidationSignup.disabled = true;

    if (!passwordsAreDifferent && inputValidationNewPassword.value !== "") {
      inputValidationNewPassword.classList.add("is-invalid");
    }
  }
}

//Demande de remplissage du champs requis
function validatemdpRequired(input) {
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

//Demande de remplissage du champs au bon format password
//(minimum 8 caractères composées des lettres, des chiffres et
//des symboles dont une lettre en majuscule) requis
function validatePassword(input) {
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

//Confirmation de la validation de mot de passe
function validateConfirmationPassword(inputPwd, inputConfirmPwd) {
  if (
    inputConfirmPwd.value === inputPwd.value &&
    inputConfirmPwd.value !== ""
  ) {
    inputConfirmPwd.classList.add("is-valid");
    inputConfirmPwd.classList.remove("is-invalid");
    return true;
  } else {
    inputConfirmPwd.classList.add("is-invalid");
    inputConfirmPwd.classList.remove("is-valid");
    return false;
  }
}

//show Password
function showPassword() {
  if (inputActualPassword.type === "password") {
    inputActualPassword.type = "text";
  } else {
    inputActualPassword.type = "password";
  }
}

//show ValidatePassword
function showConfirmNewPassword() {
  const type =
    inputValidationNewPassword.type === "password" ? "text" : "password";
  inputValidationNewPassword.type = type;
  inputConfirmNewPassword.type = type;
}

//Fonction Inscription en BDD avec le click sur le boutton inscription
function ChangementMdp() {
  const token = getToken(tokenCookieName);
  let dataForm = new FormData(formchangeMdp);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const raw = JSON.stringify({
    oldPassword: dataForm.get("mdpActual"),
    newPassword: dataForm.get("mdpNew"),
  });

  fetch(apiUrl + "changePassword", {
    method: "POST",
    headers: myHeaders,
    body: raw,
  })
    .then((response) => {
      if (!response.ok) {
        // D'abord convertir la réponse en JSON pour lire les messages d'erreur
        return response.json().then((errorData) => {
          compteSuspendu(errorData); // redirige si suspendu
          throw new Error(
            "Impossible de charger les informations de l'utilisateur."
          );
        });
      }
      return response.json();
    })
    .then((result) => {
      const modal = new bootstrap.Modal(
        document.getElementById("passwordChangeModal")
      );
      const modalBody = document.getElementById("passwordChangeModalBody");
      const modalBtn = document.getElementById("passwordChangeModalBtn");

      if (result.error) {
        // ERREUR : afficher le message
        modalBody.innerText = result.error;
        modalBtn.onclick = () => {
          // Juste fermer la modale
        };
        modal.show();
      } else {
        // SUCCÈS : afficher, puis déconnecter/rediriger après fermeture
        modalBody.innerText = result.message;
        modalBtn.onclick = () => {
          dIsconnect();
          window.location.href = "/connexion";
        };
        modal.show();
      }
    })
    .catch((error) => {
      console.error(error);
      const modal = new bootstrap.Modal(
        document.getElementById("passwordChangeModal")
      );
      const modalBody = document.getElementById("passwordChangeModalBody");
      modalBody.innerText = "Une erreur technique est survenue.";
      modal.show();
    });
}
