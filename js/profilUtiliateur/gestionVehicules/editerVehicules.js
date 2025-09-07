const editionVehiculeForm = document.getElementById("edit-vehicule-form");
const editionVehiculeImmatriculation = document.getElementById(
  "immatriculation-edit"
);
const editionVehiculeDateImmatriculation = document.getElementById(
  "date_immatriculation-edit"
);
const editionVehiculeMarqueVehiculeInfo = document.getElementById(
  "marque_vehicule-edit"
);
const editionVehiculeModeleVehiculeInfo = document.getElementById(
  "modele_vehicule-edit"
);
const editionVehiculeCouleurVehiculeInfo = document.getElementById(
  "couleur_vehicule-edit"
);
const editionVehiculePlacesDisponibles = document.getElementById(
  "places_disponibles-edit"
);
const editionVehiculeElectrique = document.getElementById("electrique-edit");
const btnModifVehicule = document.getElementById("btn-modifier-vehicule");

btnModifVehicule.addEventListener("click", modificationVehicule);

async function modificationVehicule() {
  const dataForm = new FormData(editionVehiculeForm);
  const token = getCookie(tokenCookieName);

  // Fonction pour convertir la date en format ISO (yyyy-mm-dd)
  function convertToISO(dateStr) {
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) return null;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  // Récupération de l'ID du véhicule depuis le localStorage
  const vehicule = JSON.parse(localStorage.getItem("vehicule_a_editer"));
  const vehiculeId = vehicule?.id;

  if (!vehiculeId) {
    afficherErreurModalEditerVehicule(
      "Impossible de trouver l'ID du véhicule."
    );
    return;
  }

  const raw = JSON.stringify({
    plaqueImmatriculation: dataForm.get("immatriculation_edit"),
    dateImmatriculation: convertToISO(
      dataForm.get("date_immatriculation_edit")
    ),
    marque: dataForm.get("marque_vehicule_edit"),
    modele: dataForm.get("modele_vehicule_edit"),
    couleur: dataForm.get("couleur_vehicule_edit"),
    nombrePlaces: parseInt(dataForm.get("places_disponibles_edit")),
    electrique: dataForm.get("electrique_edit") !== null,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${apiUrl}profilConducteur/${vehiculeId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'édition du véhicule");
    }

    const result = await response.json();
    document.location.href = "/listeVehicule";

    // Supprimer le véhicule modifié du localStorage
    localStorage.removeItem("vehicule_a_editer");
  } catch (error) {
    console.error("Erreur :", error);
    afficherErreurModalEditerVehicule(
      "Données manquantes, véhicule non modifié."
    );
  }
}

//Afficher les infos du vehicule depuis le localstorage
function formatDateFR(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const vehicule = JSON.parse(localStorage.getItem("vehicule_a_editer"));

editionVehiculeImmatriculation.value = vehicule.plaqueImmatriculation || "";
editionVehiculeDateImmatriculation.value =
  formatDateFR(vehicule.dateImmatriculation) || "";
editionVehiculeMarqueVehiculeInfo.value = vehicule.marque || "";
editionVehiculeModeleVehiculeInfo.value = vehicule.modele || "";
editionVehiculeCouleurVehiculeInfo.value = vehicule.couleur || "";
editionVehiculePlacesDisponibles.value = vehicule.nombrePlaces || "";
editionVehiculeElectrique.checked = vehicule.electrique === true;

function afficherErreurModalEditerVehicule(message) {
  const errorModalBody = document.getElementById(
    "errorModalBodyEditerVehicule"
  );
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
