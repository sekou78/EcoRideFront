const contactSupportForm = document.getElementById("support-form");
const fileInput = document.getElementById("file");
const btnSendContact = document.getElementById("btn-send-contact");
const responseModal = new bootstrap.Modal(
  document.getElementById("responseModal")
);
const responseModalBody = document.getElementById("responseModalBody");

btnSendContact.addEventListener("click", sendMessageSupport);

function sendMessageSupport() {
  let dataForm = new FormData(contactSupportForm);

  const myHeaders = new Headers();

  const formdata = new FormData();
  formdata.append("name", dataForm.get("name"));
  formdata.append("email", dataForm.get("email"));
  formdata.append("subject", dataForm.get("subject"));
  formdata.append("message", dataForm.get("message"));
  formdata.append("file", fileInput.files[0]);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  fetch(apiUrl + "supportMessage/send", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        responseModalBody.innerHTML = `<div class="text-success">Votre message a bien été envoyé. Merci !</div>`;
        contactSupportForm.reset();

        // Fermeture de la modal et redirection vers l'accueil
        const onModalHidden = () => {
          window.location.href = "/";
          // Après redirection on évite les doublons
          document
            .getElementById("responseModal")
            .removeEventListener("hidden.bs.modal", onModalHidden);
        };
        document
          .getElementById("responseModal")
          .addEventListener("hidden.bs.modal", onModalHidden);
      } else if (result.error) {
        responseModalBody.innerHTML = `<div class="text-danger">${result.error}</div>`;
      } else {
        responseModalBody.innerHTML = `<div class="text-warning">Réponse inattendue du serveur.</div>`;
      }
      responseModal.show();
    })
    .catch((error) => {
      console.error("Erreur:", error);
      responseModalBody.innerHTML = `<div class="text-danger">Une erreur est survenue lors de l'envoi du message.</div>`;
      responseModal.show();
    });
}
