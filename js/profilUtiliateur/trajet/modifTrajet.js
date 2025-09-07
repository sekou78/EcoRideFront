const editVoyage = document.getElementById("edit-trajet-form");
const departAdresse = document.getElementById("edit-depart-trajet-adresse");
const arriveeAdresse = document.getElementById("edit-arrivee-trajet-adresse");
const dateDepart = document.getElementById("edit-date-depart");
const dateArrivee = document.getElementById("edit-date-arrivee");
const heureDepart = document.getElementById("edit-heure-depart");
const duree = document.getElementById("edit-duree-voyage");
const peage = document.getElementById("edit-peage-trajet");
const prix = document.getElementById("edit-prix-trajet");
const trajetEcologique = document.getElementById("edit-trajet-ecologique");
const placesDisponibles = document.getElementById("edit-places-disponibles");
const statutVoyage = document.getElementById("edit-etat-voyage");
const afficheModifTrajetChoixImmatriculation =
  document.getElementById("choixVehiculeModif");
const btnValidationVoyage = document.getElementById("btn-edit-voyage");

btnValidationVoyage.disabled = true;

departAdresse.addEventListener("input", validInputVoyage);
arriveeAdresse.addEventListener("input", validInputVoyage);
dateDepart.addEventListener("input", validInputVoyage);
dateArrivee.addEventListener("input", validInputVoyage);
heureDepart.addEventListener("input", validInputVoyage);
duree.addEventListener("input", validInputVoyage);
prix.addEventListener("input", validInputVoyage);
placesDisponibles.addEventListener("input", validInputVoyage);
statutVoyage.addEventListener("change", validInputVoyage);

btnValidationVoyage.addEventListener("click", validateModifTrajetForm);

function parseDateMulti(str) {
  if (!str) return null;

  // ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  // FR
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [d, m, y] = str.split("/").map(Number);
    return new Date(y, m - 1, d);
  }
  return null;
}

function dateInFuture(str) {
  const d = parseDateMulti(str);
  if (!d) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // 00:00:00
  return d >= today;
}

function validInputVoyage() {
  const departAdresseOk = validateVoyageRequired(departAdresse);
  const arriveeAdresseOk = validateVoyageRequired(arriveeAdresse);

  const dateDepartOk = validDate(dateDepart) && dateInFuture(dateDepart.value);
  const dateArriveeOk =
    validDate(dateArrivee) && dateInFuture(dateArrivee.value);

  const heureDepartOk = validHour(heureDepart);
  const dureeOk = validHour(duree);
  const prixOk = validateVoyageRequired(prix);
  const placesDisponiblesOk = validnbresPlaces(placesDisponibles);
  const statutOk = validateVoyageRequired(statutVoyage);

  btnValidationVoyage.disabled = !(
    departAdresseOk &&
    arriveeAdresseOk &&
    dateDepartOk &&
    dateArriveeOk &&
    heureDepartOk &&
    dureeOk &&
    prixOk &&
    placesDisponiblesOk &&
    statutOk
  );
}

async function validateModifTrajetForm() {
  const dateDepartOk = validDate(dateDepart) && dateInFuture(dateDepart.value);
  const dateArriveeOk =
    validDate(dateArrivee) && dateInFuture(dateArrivee.value);

  if (!dateDepartOk) {
    showErrorModal("La date de départ doit être aujourd’hui ou dans le futur.");
    return;
  }

  if (!dateArriveeOk) {
    showErrorModal("La date d’arrivée doit être aujourd’hui ou dans le futur.");
    return;
  }

  let dataForm = new FormData(editVoyage);
  const token = getCookie(tokenCookieName);

  // Récupérer le statut selectionné
  const statutMap = {
    1: "EN_ATTENTE",
    2: "EN_COURS",
    3: "TERMINEE",
  };

  const statutValue = statutVoyage.value;
  const selectedStatut = statutMap[statutValue];

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  // Récupérer l'ID du trajet depuis le localStorage
  const trajet = JSON.parse(localStorage.getItem("trajet"));
  const trajetId = trajet?.id;

  if (!trajetId) {
    alert("Impossible de trouver l'ID du trajet.");
    return;
  }

  const raw = JSON.stringify({
    adresseDepart: dataForm.get("edit_depart_trajet_adresse"),
    adresseArrivee: dataForm.get("edit_arrivee_trajet_adresse"),
    dateDepart: dataForm.get("edit_date_depart"),
    dateArrivee: dataForm.get("edit_date_arrivee"),
    heureDepart: dataForm.get("edit_heure_depart"),
    dureeVoyage: dataForm.get("edit_duree_voyage"),
    peage: editVoyage.elements["edit_peage_trajet"].checked,
    prix: dataForm.get("edit_prix_trajet"),
    estEcologique: editVoyage.elements["edit_trajet_ecologique"].checked,
    nombrePlacesDisponible: parseInt(
      dataForm.get("edit_places_disponibles"),
      10
    ),
    statut: selectedStatut,
    vehiculeId: vehiculeSelectionneId,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(apiUrl + `trajet/${trajetId}`, requestOptions);
    const result = await response.json();

    if (!response.ok) {
      if (result.error) {
        showErrorModal(result.error);
      } else if (result.errors && Array.isArray(result.errors)) {
        showErrorModal(result.errors.join("<br>"));
      } else {
        showErrorModal("Erreur inconnue lors de l'édition du trajet.");
      }
      return;
    }

    //Redirection et nettoyage localStorage
    localStorage.removeItem("trajet");
    document.location.href = "/espaceUtilisateur";
  } catch (error) {
    console.error("Erreur :", error);
    showErrorModal("Une erreur réseau est survenue. Veuillez réessayer.");
  }
}
// Fonction pour afficher le modal avec le message d'erreur
function showErrorModal(message) {
  const modalBody = document.getElementById("errorModalBody");
  modalBody.innerHTML = message;

  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

//appel de la fonction de chargement des véhicules de l'utilisateur
modifTrajetChargerVehiculesUtilisateur();

// Fonction de chargement de véhicule selectionner
async function modifTrajetChargerVehiculesUtilisateur() {
  const dropdownMenu = document.getElementById("vehiculeDropdownMenu");
  const token = getCookie(tokenCookieName);

  if (!token) {
    console.error("Token d'authentification introuvable.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  try {
    const response = await fetch(apiUrl + "profilConducteur/", {
      method: "GET",
      headers: myHeaders,
    });

    if (!response.ok) throw new Error("Erreur API");

    const vehicules = await response.json();

    dropdownMenu.innerHTML = "";

    // Génèrer les liens de chaque véhicule
    vehicules.forEach((vehicule) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "dropdown-item text-primary";
      link.textContent = vehicule.plaqueImmatriculation;
      link.addEventListener("click", () =>
        modifTrajetSelectionnerVehicule(vehicule)
      );
      item.appendChild(link);
      dropdownMenu.appendChild(item);
    });

    // Ajoute le lien "Ajouter un véhicule" à la fin
    const itemAjout = document.createElement("li");
    itemAjout.innerHTML = `
      <a class="dropdown-item text-primary" href="/modifProfilConducteur">
        Ajouter un véhicule
      </a>`;
    dropdownMenu.appendChild(itemAjout);
  } catch (error) {
    console.error("Erreur lors du chargement des véhicules :", error);
  }
}

//Afficher les infos du trajet depuis le localstorage
function formatDateFR(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function extraireHeureMinutes(dateString) {
  const date = new Date(dateString);
  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${heures}:${minutes}`;
}

let vehiculeSelectionneId = null;

const trajet = JSON.parse(localStorage.getItem("trajet"));
if (!trajet) {
  console.warn("Aucun trajet trouvé dans le localStorage.");
} else {
  departAdresse.value = trajet.adresseDepart || "";
  arriveeAdresse.value = trajet.adresseArrivee || "";
  dateDepart.value = trajet.dateDepart.split("T")[0];
  dateArrivee.value = trajet.dateArrivee.split("T")[0];
  heureDepart.value = extraireHeureMinutes(trajet.heureDepart);
  duree.value = extraireHeureMinutes(trajet.dureeVoyage);
  peage.checked = !!trajet.peage;
  prix.value = trajet.prix || "";
  trajetEcologique.checked = !!trajet.estEcologique;
  placesDisponibles.value = trajet.nombrePlacesDisponible || "";
  statutVoyage.value = trajet.statut || "";

  if (trajet.vehicule) {
    afficheModifTrajetChoixImmatriculation.textContent =
      trajet.vehicule.plaqueImmatriculation;
    vehiculeSelectionneId = trajet.vehicule.id;
  }
}

function modifTrajetSelectionnerVehicule(vehicule) {
  const choixVehicule = document.getElementById("choixVehiculeModif");
  choixVehicule.textContent = vehicule.plaqueImmatriculation;
  vehiculeSelectionneId = vehicule.id;
}

//Demande de remplissage du champs requis
function validateVoyageRequired(input) {
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

//Regex pour valider les dates au format jj/mm/aaaa
function validDate(input) {
  const dateUser = input.value.trim();
  const dateRegexFR = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const dateRegexISO = /^\d{4}-\d{2}-\d{2}$/;

  const isValid = dateRegexFR.test(dateUser) || dateRegexISO.test(dateUser);

  input.classList.toggle("is-valid", isValid);
  input.classList.toggle("is-invalid", !isValid);

  return isValid;
}

function validHour(input) {
  //Regex pour valider les heures au format hh:mm
  const hourRegex = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
  const hourUser = input.value.trim();

  if (hourRegex.test(hourUser)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

function validnbresPlaces(input) {
  //Regex pour valider les nombres de places
  const nbresPlacesRegex = /^\d+$/;
  const nbresPlacesUser = input.value.trim();

  if (nbresPlacesRegex.test(nbresPlacesUser)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
