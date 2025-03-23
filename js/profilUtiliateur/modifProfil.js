const modifProfil = document.getElementById("profil-form");
const creerVoyage = document.getElementById("voyage-form");
const avatar = document.getElementById("avatar");
const role = document.getElementById("role");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const telephone = document.getElementById("telephone");
const dateNaissance = document.getElementById("date_naissance");
const depart = document.getElementById("depart");
const arrivee = document.getElementById("arrivee");
const date = document.getElementById("date-voyage");
const heure = document.getElementById("heure-voyage");
const peage = document.getElementById("peage");
const duree = document.getElementById("duree-voyage");
const prix = document.getElementById("prix");
const immatriculation = document.getElementById("immatriculation");
const dateImmatriculation = document.getElementById("date_immatriculation");
const vehiculeInfo = document.getElementById("vehicule_info");
const placesDisponibles = document.getElementById("places_disponibles");
const electrique = document.getElementById("electrique");
const fumeur = document.getElementById("fumeur");
const animal = document.getElementById("animal");
const preferencesAutres = document.getElementById("preferences_autres");
const btnValidationModifProfil = document.getElementById("btn-modif");
const btnValidationVoyage = document.getElementById("btn-ajouter-voyage");

avatar.addEventListener("change", avatarUrl);
btnValidationModifProfil.addEventListener("click", validateModifProfilForm);
btnValidationVoyage.addEventListener("click", validateVoyageForm);

function validateModifProfilForm() {
  const avatarValue = localStorage.getItem("avatar");
  const roleValue = role.value;
  const nomValue = nom.value;
  const prenomValue = prenom.value;
  const telephoneValue = telephone.value;
  const dateNaissanceValue = dateNaissance.value;
  const immatriculationValue = immatriculation.value;
  const dateImmatriculationValue = dateImmatriculation.value;
  const vehiculeInfoValue = vehiculeInfo.value;
  const placesDisponiblesValue = placesDisponibles.value;
  const electriqueValue = electrique.checked ? "Oui" : "Non";
  const fumeurValue = fumeur.checked ? "Oui" : "Non";
  const animalValue = animal.checked ? "Oui" : "Non";
  const preferencesAutresValue = preferencesAutres.value;

  // Sauvegarder les données dans localStorage
  localStorage.setItem("role", roleValue);
  localStorage.setItem("nom", nomValue);
  localStorage.setItem("prenom", prenomValue);
  localStorage.setItem("telephone", telephoneValue);
  localStorage.setItem("dateNaissance", dateNaissanceValue);
  localStorage.setItem("immatriculation", immatriculationValue);
  localStorage.setItem("dateImmatriculation", dateImmatriculationValue);
  localStorage.setItem("vehiculeInfo", vehiculeInfoValue);
  localStorage.setItem("placesDisponibles", placesDisponiblesValue);
  localStorage.setItem("electrique", electriqueValue);
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

function validateVoyageForm() {
  const departValue = depart.value;
  const arriveeValue = arrivee.value;
  const dateValue = date.value;
  const heureValue = heure.value;
  const peageValue = peage.checked ? "Oui" : "Non";
  const dureeValue = duree.value;
  const prixValue = prix.value;

  // Sauvegarder les données dans localStorage
  localStorage.setItem("depart", departValue);
  localStorage.setItem("arrivee", arriveeValue);
  localStorage.setItem("date", dateValue);
  localStorage.setItem("heure", heureValue);
  localStorage.setItem("peage", peageValue);
  localStorage.setItem("duree", dureeValue);
  localStorage.setItem("prix", prixValue);
}
