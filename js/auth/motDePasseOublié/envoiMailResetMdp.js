const formFrogot = document.getElementById("forgotForm");
const inputEmailSendReset = document.getElementById("emailSendResetInput");
const btnSendResetLink = document.getElementById("sendResetLink");

btnSendResetLink.disabled = true;

btnSendResetLink.addEventListener("click", resetLinkSend);

inputEmailSendReset.addEventListener("keyup", validateEmailForm);

function validateEmailForm() {
  const emailOK = validateEmailRequired(inputEmailSendReset);
  const EmailOK = validateEmailFormat(inputEmailSendReset);

  if (emailOK && EmailOK) {
    btnSendResetLink.disabled = false;
  } else {
    btnSendResetLink.disabled = true;
  }
}

function resetLinkSend() {
  let dataForm = new FormData(formFrogot);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email: dataForm.get("email_send_reset_input"),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(urlSendReset + "reset-password", requestOptions)
    .then((response) => {
      return response.text().then((text) => {
        try {
          return JSON.parse(text);
        } catch (error) {
          throw new Error("Réponse du serveur invalide : " + text);
        }
      });
    })
    .then((result) => {
      const modalMessage = document.getElementById("modalMessageContent");
      modalMessage.textContent = result.message || "Pas de message reçu.";

      const messageModalEl = document.getElementById("messageModal");
      const messageModal = new bootstrap.Modal(messageModalEl);

      messageModalEl.addEventListener(
        "hidden.bs.modal",
        () => {
          window.location.reload();
        },
        { once: true }
      );

      messageModal.show();
    })
    .catch((error) => {
      console.error(error);
      const modalMessage = document.getElementById("modalMessageContent");
      modalMessage.textContent = "Erreur lors de la requête : " + error.message;

      const messageModalEl = document.getElementById("messageModal");
      const messageModal = new bootstrap.Modal(messageModalEl);

      messageModalEl.addEventListener(
        "hidden.bs.modal",
        () => {
          window.location.reload();
        },
        { once: true }
      );

      messageModal.show();
    });
}

//Demande de remplissage du champs requis
function validateEmailRequired(input) {
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
function validateEmailFormat(input) {
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
