(() => {
  const form = document.getElementById("support-form");
  form.addEventListener(
    "submit",
    (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Tu peux ici envoyer le formulaire avec fetch/AJAX
        alert("Message envoyé avec succès !");
        window.location.reload();
        event.preventDefault();
      }

      form.classList.add("was-validated");
    },
    false
  );
})();
