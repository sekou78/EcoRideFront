const creerVoyage = document.getElementById("trajet-form");
const departAdresse = document.getElementById("depart-trajet-adresse");
const arriveeAdresse = document.getElementById("arrivee-trajet-adresse");
const dateDepart = document.getElementById("date-depart");
const dateArrivee = document.getElementById("date-arrivee");
const heureDepart = document.getElementById("heure-depart");
const duree = document.getElementById("duree-voyage");
const peage = document.getElementById("peage-trajet");
const prix = document.getElementById("prix-trajet");
const trajetEcologique = document.getElementById("trajet-ecologique");
const placesDisponibles = document.getElementById("places-disponibles");

const creeTrajetChoixImmatriculation = document.getElementById("choixVehicule");
const btnValidationVoyage = document.getElementById("btn-ajouter-voyage");

btnValidationVoyage.disabled = true;

departAdresse.addEventListener("input", validInputVoyage);
arriveeAdresse.addEventListener("input", validInputVoyage);
dateDepart.addEventListener("input", validInputVoyage);
dateArrivee.addEventListener("input", validInputVoyage);
heureDepart.addEventListener("input", validInputVoyage);
duree.addEventListener("input", validInputVoyage);
prix.addEventListener("input", validInputVoyage);
placesDisponibles.addEventListener("input", validInputVoyage);

btnValidationVoyage.addEventListener("click", validateVoyageForm);

function dateInFuture(input) {
  const value = input.value.trim();
  if (!value) return false;

  let picked;

  //format dd‑mm‑aaaa
  const fr = /^(\d{2})-(\d{2})-(\d{4})$/;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;

  if (fr.test(value)) {
    const [, d, m, y] = value.match(fr);
    picked = new Date(`${y}-${m}-${d}T00:00:00`);
  } else if (iso.test(value)) {
    picked = new Date(`${value}T00:00:00`);
  } else {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ok = picked >= today;
  input.classList.toggle("is-valid", ok);
  input.classList.toggle("is-invalid", !ok);

  return ok;
}

function parseDDMMYYYY(str) {
  const m = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  const [, d, mth, y] = m;
  return new Date(`${y}-${mth}-${d}T00:00:00`);
}

function parseDateInput(str) {
  return parseDDMMYYYY(str) || new Date(`${str}T00:00:00`);
}

function dateAfter(dateBInput, dateAInput) {
  const a = parseDateInput(dateAInput.value.trim());
  const b = parseDateInput(dateBInput.value.trim());
  if (isNaN(a) || isNaN(b)) return false;

  const ok = b >= a;
  dateBInput.classList.toggle("is-valid", ok);
  dateBInput.classList.toggle("is-invalid", !ok);
  return ok;
}

function validInputVoyage() {
  const departAdresseOk = validateVoyageRequired(departAdresse);
  const arriveeAdresseOk = validateVoyageRequired(arriveeAdresse);

  const dateDepartFormatOk = validDate(dateDepart);
  const dateArriveeFormatOk = validDate(dateArrivee);

  const dateDepartFutureOk = dateInFuture(dateDepart);
  const dateArriveeAfterOk = dateAfter(dateArrivee, dateDepart);

  const heureDepartOk = validHour(heureDepart);
  const dureeOk = validHour(duree);
  const prixOk = validateVoyageRequired(prix);
  const placesDisponiblesOk = validnbresPlaces(placesDisponibles);
  const vehiculeOk = vehiculeSelectionneId !== null;

  btnValidationVoyage.disabled = !(
    departAdresseOk &&
    arriveeAdresseOk &&
    dateDepartFormatOk &&
    dateArriveeFormatOk &&
    dateDepartFutureOk &&
    dateArriveeAfterOk &&
    heureDepartOk &&
    dureeOk &&
    prixOk &&
    placesDisponiblesOk &&
    vehiculeOk
  );
}

function validateVoyageForm() {
  let dataForm = new FormData(creerVoyage);
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const raw = JSON.stringify({
    adresseDepart: dataForm.get("depart_trajet_adresse"),
    adresseArrivee: dataForm.get("arrivee_trajet_adresse"),
    dateDepart: dataForm.get("date_depart"),
    dateArrivee: dataForm.get("date_arrivee"),
    heureDepart: dataForm.get("heure_depart"),
    dureeVoyage: dataForm.get("duree_voyage"),
    peage: dataForm.get("peage_trajet") !== null,
    prix: dataForm.get("prix_trajet"),
    estEcologique: dataForm.get("trajet_ecologique") !== null,
    nombrePlacesDisponible: parseInt(dataForm.get("places_disponibles"), 10),
    vehiculeId: vehiculeSelectionneId,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const modalErreurEl = document.getElementById("modalErreurTrajet");
  const modalErreur = new bootstrap.Modal(modalErreurEl);
  const modalErreurMsg = document.getElementById("modalErreurMsg");

  fetch(apiUrl + "trajet", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          let message = "Une erreur est survenue.";

          if (error.error) {
            message = error.error;
          } else if (Array.isArray(error.errors)) {
            message = error.errors.join("\n");
          }

          // Affiche dans le modal bootstrap
          modalErreurMsg.textContent = message;
          modalErreur.show();

          throw new Error(message);
        });
      }
    })
    .then((result) => {
      window.location.href = "/espaceUtilisateur";
    })
    .catch((error) => {
      console.error("Erreur lors de la création du trajet :", error.message);
    });
}

//appel de la fonction de chargement des véhicules de l'utilisateur
creeTrajetChargerVehiculesUtilisateur();

// Fonction de chargement de véhicule selectionner
async function creeTrajetChargerVehiculesUtilisateur() {
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

    // Génère les liens de chaque véhicule
    vehicules.forEach((vehicule) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "dropdown-item text-primary";
      link.textContent = vehicule.plaqueImmatriculation;
      link.addEventListener("click", () =>
        creeTrajetAfficherInfosVehicule(vehicule)
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

let vehiculeSelectionneId = null;

function creeTrajetAfficherInfosVehicule(vehicule) {
  creeTrajetChoixImmatriculation.textContent = vehicule.plaqueImmatriculation;
  vehiculeSelectionneId = vehicule.id;
  validInputVoyage();
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
