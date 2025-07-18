const itineraireCovoiturageForm = document.getElementById(
  "itineraire-covoiturage"
);
const adresseDepartCovoiturage = document.getElementById(
  "covoiturageDepartInput"
);
const btnSwicthAdresseCovoiturage =
  document.getElementById("btn-switch-adresse");
const adresseArriveeCovoiturage = document.getElementById(
  "covoiturageArriveeInput"
);
const dateDepartCovoiturage = document.getElementById(
  "covoiturageDateTrajetInput"
);
const btnTrouverItineraireCovoiturage = document.getElementById(
  "btn-trouver-itineraire"
);
const filtreCovoiturageDepart = document.getElementById("filtreAdresseDepart");
const filtreCovoiturageArrivee = document.getElementById(
  "filtreAdresseArrivee"
);
const filtreCovoiturageDate = document.getElementById("filtreDateDepart");
const btnValidationCovoiturageFilter =
  document.getElementById("btnValidFilter");

btnTrouverItineraireCovoiturage.disabled = true;

adresseDepartCovoiturage.addEventListener("keyup", validInputChercheItineraire);
adresseArriveeCovoiturage.addEventListener(
  "keyup",
  validInputChercheItineraire
);
dateDepartCovoiturage.addEventListener("keyup", validInputChercheItineraire);

btnTrouverItineraireCovoiturage.addEventListener(
  "click",
  trouverItineraireCovoiturage
);
btnSwicthAdresseCovoiturage.addEventListener("click", switchAdresseCovoiturage);

function validInputChercheItineraire() {
  const adresseDepartCovoiturageOk = validateCovoiturageInputRequired(
    adresseDepartCovoiturage
  );
  const adresseArriveeCovoiturageOk = validateCovoiturageInputRequired(
    adresseArriveeCovoiturage
  );
  const dateDepartCovoiturageOk = validDate(dateDepartCovoiturage);

  if (
    adresseDepartCovoiturageOk &&
    adresseArriveeCovoiturageOk &&
    dateDepartCovoiturageOk
  ) {
    btnTrouverItineraireCovoiturage.disabled = false;
  } else {
    btnTrouverItineraireCovoiturage.disabled = true;
  }
}

function trouverItineraireCovoiturage() {
  const dataForm = new FormData(itineraireCovoiturageForm);

  const adresseDepart = dataForm.get("covoiturage_depart").trim();
  const adresseArrivee = dataForm.get("covoiturage_arrivee").trim();
  const date = dataForm.get("covoiturage_date_trajet").trim();

  // Validation de la date
  if (!isValidDateFR(date)) {
    afficherErreurModalBodyCovoiturage(
      "Veuillez entrer une date valide au format jj/mm/aaaa."
    );
    return;
  }

  // Convertir la date jj/mm/aaaa => aaaa-mm-jj
  const [day, month, year] = date.split("/");
  const dateFormatted = `${year}-${month}-${day}`;

  // Construire dynamiquement l'URL avec les paramètres
  const url = new URL(apiUrl + "trajet/api/listeTrajets");
  url.searchParams.append("adresseDepart", adresseDepart);
  url.searchParams.append("adresseArrivee", adresseArrivee);
  url.searchParams.append("dateDepart", dateFormatted);

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur serveur : " + response.status);
      }
      return response.json();
    })
    .then((result) => {
      localStorage.setItem("resultTrajets", JSON.stringify(result));
      window.location.href = "/resultCovoiturage";
    })
    .catch((error) => {
      console.error("Erreur API :", error);
      afficherErreurModalBodyCovoiturage(
        "Impossible de récupérer les trajets."
      );
    });
}

function switchAdresseCovoiturage() {
  const adresseDepart = adresseDepartCovoiturage.value;
  const adresseArrivee = adresseArriveeCovoiturage.value;
  adresseDepartCovoiturage.value = adresseArrivee;
  adresseArriveeCovoiturage.value = adresseDepart;
}

function isValidDateFR(dateStr) {
  const [d, m, y] = dateStr.split("/");
  if (!d || !m || !y) return false;
  const date = new Date(`${y}-${m}-${d}`);
  return (
    date instanceof Date &&
    !isNaN(date) &&
    date.getDate() === parseInt(d, 10) &&
    date.getMonth() + 1 === parseInt(m, 10) &&
    date.getFullYear() === parseInt(y, 10)
  );
}

//Demande de remplissage du champs requis
function validateCovoiturageInputRequired(input) {
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

function validDate(input) {
  // Regex pour valider le format jj/mm/aaaa
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const dateUser = input.value.trim();

  if (!dateRegex.test(dateUser)) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }

  // Extraire jour, mois, année
  const [day, month, year] = dateUser.split("/");
  const date = new Date(`${year}-${month}-${day}`);

  if (isNaN(date.getTime())) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }

  // Date du jour (à minuit)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Date max = aujourd’hui + 30 jours
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  if (date < today || date > maxDate) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }

  // Tout est ok
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
  return true;
}

function afficherErreurModalBodyCovoiturage(message) {
  const errorModalBody = document.getElementById("errorModalBodyCovoiturage");
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}
