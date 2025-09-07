const formchangeMdpReset = document.getElementById("ChangeResetMdp-form");
const inputValidationNewPasswordReset = document.getElementById(
  "NewPasswordResetInput"
);
const inputConfirmNewPasswordReset = document.getElementById(
  "ConfirmNewPasswordInputReset"
);
const checkInputConfirmNewPasswordReset = document.getElementById(
  "checkNewConfirmNewPasswordReset"
);
const btnValidationSignupReset = document.getElementById(
  "btn-validation-changeMdpReset"
);

btnValidationSignupReset.disabled = true;

inputValidationNewPasswordReset.addEventListener(
  "keyup",
  validateChangeMdpForm
);
inputConfirmNewPasswordReset.addEventListener("keyup", validateChangeMdpForm);
checkInputConfirmNewPasswordReset.addEventListener(
  "click",
  showConfirmNewPassword
);

btnValidationSignupReset.addEventListener("click", ResetMdp);

function validateChangeMdpForm() {
  const validatePasswordOk = validatemdpRequired(
    inputValidationNewPasswordReset
  );
  const newPasswordValid = validatePassword(inputValidationNewPasswordReset);
  const confirmPasswordOk = validatemdpRequired(inputConfirmNewPasswordReset);
  const passwordConfirmOk = validateConfirmationPassword(
    inputValidationNewPasswordReset,
    inputConfirmNewPasswordReset
  );

  if (
    validatePasswordOk &&
    confirmPasswordOk &&
    newPasswordValid &&
    passwordConfirmOk
  ) {
    btnValidationSignupReset.disabled = false;
    inputValidationNewPasswordReset.classList.remove("is-invalid");
  } else {
    btnValidationSignupReset.disabled = true;

    if (
      inputValidationNewPasswordReset.value ===
        inputConfirmNewPasswordReset.value &&
      inputValidationNewPasswordReset.value !== ""
    ) {
      inputValidationNewPasswordReset.classList.add("is-invalid");
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
    inputValidationNewPasswordReset.type === "password" ? "text" : "password";
  inputValidationNewPasswordReset.type = type;
  inputConfirmNewPasswordReset.type = type;
}

//Fonction reset mot de passe
function ResetMdp() {
  let dataForm = new FormData(formchangeMdpReset);

  // Récupération du token depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const tokenReset = urlParams.get("token");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    token: tokenReset,
    plainPassword: dataForm.get("mdpResetNew"),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(urlSendReset + "reset-password/reset", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      document.getElementById("passwordChangeModalBody").textContent =
        result.message;

      // Création et affichage du modal
      const modalEl = document.getElementById("passwordChangeResetModal");
      const modal = new bootstrap.Modal(modalEl);

      // Si succès, redirection après fermeture du modal
      if (result.success) {
        modalEl.addEventListener(
          "hidden.bs.modal",
          () => {
            window.location.href = "/connexion";
          },
          { once: true }
        );
      }

      modal.show();
    })
    .catch((error) => {
      console.error(error);

      document.getElementById("passwordChangeModalBody").textContent =
        "Erreur de connexion au serveur.";
      const modal = new bootstrap.Modal(
        document.getElementById("passwordChangeResetModal")
      );
      modal.show();
    });
}
