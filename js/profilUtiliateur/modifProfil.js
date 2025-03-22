const modifProfil = document.getElementById("profil-form");
const avatar = document.getElementById("avatar");
const role = document.getElementById("role");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const email = document.getElementById("email");
const telephone = document.getElementById("telephone");
const dateNaissance = document.getElementById("date_naissance");
const pseudo = document.getElementById("pseudo");
const immatriculation = document.getElementById("immatriculation");
const dateImmatriculation = document.getElementById("date_immatriculation");
const vehiculeInfo = document.getElementById("vehicule_info");
const placesDisponibles = document.getElementById("places_disponibles");
const fumeur = document.getElementById("fumeur");
const animal = document.getElementById("animal");
const preferencesAutres = document.getElementById("preferences_autres");
const btnValidationModifProfil = document.getElementById("btn-modif");

avatar.addEventListener("change", avatarUrl);
btnValidationModifProfil.addEventListener("click", validateModifProfilForm);

function validateModifProfilForm() {
  const avatarValue = localStorage.getItem("avatar");
  const roleValue = role.value;
  const nomValue = nom.value;
  const prenomValue = prenom.value;
  const emailValue = email.value;
  const telephoneValue = telephone.value;
  const dateNaissanceValue = dateNaissance.value;
  const pseudoValue = pseudo.value;
  const immatriculationValue = immatriculation.value;
  const dateImmatriculationValue = dateImmatriculation.value;
  const vehiculeInfoValue = vehiculeInfo.value;
  const placesDisponiblesValue = placesDisponibles.value;
  const fumeurValue = fumeur.checked ? "Oui" : "Non";
  const animalValue = animal.checked ? "Oui" : "Non";
  const preferencesAutresValue = preferencesAutres.value;

  // Sauvegarder les données dans localStorage
  localStorage.setItem("role", roleValue);
  localStorage.setItem("nom", nomValue);
  localStorage.setItem("prenom", prenomValue);
  localStorage.setItem("email", emailValue);
  localStorage.setItem("telephone", telephoneValue);
  localStorage.setItem("dateNaissance", dateNaissanceValue);
  localStorage.setItem("pseudo", pseudoValue);
  localStorage.setItem("immatriculation", immatriculationValue);
  localStorage.setItem("dateImmatriculation", dateImmatriculationValue);
  localStorage.setItem("vehiculeInfo", vehiculeInfoValue);
  localStorage.setItem("placesDisponibles", placesDisponiblesValue);
  localStorage.setItem("fumeur", fumeurValue);
  localStorage.setItem("animal", animalValue);
  localStorage.setItem("preferencesAutres", preferencesAutresValue);

  // Rediriger vers la page du profil utilisateur (ou mettre à jour la page)
  window.location.href = "/espaceUtilisateur";
}

function avatarUrl(event) {
  // Récupérer le fichier sélectionné
  const file = event.target.files[0];

  if (file) {
    // Créer un FileReader pour lire l'image
    const reader = new FileReader();

    reader.onloadend = function () {
      // Une fois la lecture terminée, récupérer l'URL de l'image
      const avatarDataUrl = reader.result;

      // Sauvegarder l'URL dans localStorage (en base64)
      localStorage.setItem("avatar", avatarDataUrl);
    };

    // Lire l'image comme une URL de données (base64)
    reader.readAsDataURL(file);
  }
}
