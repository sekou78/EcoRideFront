//Infos conducteur
const avatarReserverDisplay = document.getElementById(
  "avatar-reserver-display"
);
const pseudoReserverDisplay = document.getElementById(
  "pseudo-reserver-display"
);
//Infos du Trajet
const adresseDepartReserverDisplay = document.getElementById(
  "adresse-depart-reserver-display"
);
const adresseArriveeReserverDisplay = document.getElementById(
  "adresse-arrivee-reserver-display"
);
const statutReserverDisplay = document.getElementById(
  "statut-reserver-display"
);
const placesDisponiblesReserverDisplay = document.getElementById(
  "places-disponibles-reserver-display"
);
const prixReserverDisplay = document.getElementById("prix-reserver-display");
const dateDepartReserverDisplay = document.getElementById(
  "date-depart-reserver-display"
);
const dateArriveeReserverDisplay = document.getElementById(
  "date-arrivee-reserver-display"
);
const heureDepartReserverDisplay = document.getElementById(
  "heure-depart-reserver-display"
);
const dureeReserverDisplay = document.getElementById(
  "duree-trajet-reserver-display"
);
const peageReserverDisplay = document.getElementById("peage-reserver-display");
const trajetEcologiqueReserverDisplay = document.getElementById(
  "trajet-ecologique-reserver-display"
);
//Infos du modal
const prixReservationReserverModalDisplay = document.getElementById(
  "prix-reserver-reservation-voyage-modal"
);
const statutReservationSelect = document.getElementById("choix-trajet");
const btnReservationTrajet = document.getElementById(
  "btn-validation-participation"
);

btnReservationTrajet.addEventListener("click", confirmerReservation);

//Appel de la fonction
vueReserverTrajetInfos();
async function vueReserverTrajetInfos() {
  // Récupérer les infos de l'ID du trajet selectionné depuis le localStorage
  const trajetIdInfos = JSON.parse(localStorage.getItem("trajetInfos"));

  const trajetInfosId = trajetIdInfos?.id;

  if (!trajetInfosId) {
    afficherErreurModalReservation("Impossible de trouver l'ID du trajet.");
    return;
  }
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      apiUrl + `trajet/${trajetInfosId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du trajet.");
    }

    const result = await response.json();

    function formatDateFR(dateString) {
      if (!dateString) return "—";
      const date = new Date(dateString);
      if (isNaN(date)) return "—";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    function formatHeure(dateTimeString) {
      if (!dateTimeString) return "—";
      const date = new Date(dateTimeString);
      if (isNaN(date)) return "—";
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    // Remplir les champs DOM avec les infos du trajet
    pseudoReserverDisplay.textContent = result.chauffeur.pseudo || "—";
    avatarReserverDisplay.src = result.chauffeur.image?.filePath
      ? urlImg + result.chauffeur.image.filePath
      : "/images/avatar.png";

    adresseDepartReserverDisplay.textContent = result.adresseDepart || "—";
    adresseArriveeReserverDisplay.textContent = result.adresseArrivee || "—";
    statutReserverDisplay.textContent = result.statut || "—";
    placesDisponiblesReserverDisplay.textContent =
      result.nombrePlacesDisponible || "—";
    prixReserverDisplay.textContent = result.prix || "—";
    dateDepartReserverDisplay.textContent = formatDateFR(result.dateDepart);
    dateArriveeReserverDisplay.textContent = formatDateFR(result.dateArrivee);
    heureDepartReserverDisplay.textContent =
      formatHeure(result.heureDepart) || "—";
    dureeReserverDisplay.textContent = formatHeure(result.dureeVoyage) || "—";
    peageReserverDisplay.textContent = result.peage ? "Oui" : "Non";
    trajetEcologiqueReserverDisplay.textContent = result.estEcologique
      ? "Oui"
      : "Non";

    //Prix de la reservation
    prixReservationReserverModalDisplay.textContent = result.prix;
  } catch (error) {
    console.error("Erreur :", error);
    afficherErreurModalReservation(
      "Impossible d'afficher les détails du trajet."
    );
  }
}

function confirmerReservation() {
  const trajetInfos = JSON.parse(localStorage.getItem("trajetInfos"));
  const trajetId = trajetInfos?.id;

  if (!trajetId) {
    afficherErreurModalReservation("Impossible de trouver l'ID du trajet.");
    return;
  }

  const statut = statutReservationSelect.value;
  if (!statut) {
    afficherErreurModalReservation("Veuillez sélectionner un statut.");
    return;
  }

  const token = getCookie(tokenCookieName);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  //Charger les réservations de l'utilisateur depuis l'API
  fetch(apiUrl + "reservation/", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Stocker dans localStorage
      localStorage.setItem("reservations", JSON.stringify(data));

      const reservations = data;
      const reservationExistante = reservations.find(
        (r) => r.trajet?.id === trajetId
      );
      const reservationId = reservationExistante?.id;

      //Annulation
      if (statut === "ANNULEE") {
        if (!reservationId) {
          afficherErreurModalReservation("Aucune réservation à annuler.");
          return;
        }

        if (confirm("Voulez-vous vraiment annuler cette réservation ?")) {
          fetch(apiUrl + `reservation/${reservationId}`, {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow",
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then((data) => {
                  const message =
                    data.error || data.message || "Réservation impossible.";
                  throw new Error(message);
                });
              }
              return response.json();
            })
            .then(() => {
              const nouvellesReservations = reservations.filter(
                (r) => r.id !== reservationId
              );
              localStorage.setItem(
                "reservations",
                JSON.stringify(nouvellesReservations)
              );

              afficherErreurModalReservation("Réservation annulée.");
              window.location.href = "/espaceUtilisateur";
            })
            .catch((error) => {
              console.error(error);
              afficherErreurModalReservation(error.message);
            });
        }
        return;
      }

      // Corps pour PUT ou POST
      const raw = JSON.stringify({
        statut: statut,
        trajet: trajetId,
      });

      if (reservationId) {
        //Modification
        fetch(apiUrl + `reservation/${reservationId}`, {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => {
                const message =
                  data.error || data.message || "Réservation impossible.";
                throw new Error(message);
              });
            }
            return response.json();
          })
          .then((result) => {
            const updatedReservations = reservations.map((r) =>
              r.id === reservationId ? result : r
            );
            localStorage.setItem(
              "reservations",
              JSON.stringify(updatedReservations)
            );

            afficherErreurModalReservation("Réservation mise à jour.");
            window.location.href = "/espaceUtilisateur";
          })
          .catch((error) => {
            console.error(error);
            afficherErreurModalReservation(error.message);
          });
      } else {
        //Création
        fetch(apiUrl + "reservation", {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => {
                const message =
                  data.error || data.message || "Réservation impossible.";
                throw new Error(message);
              });
            }
            return response.json();
          })
          .then((result) => {
            const nouvellesReservations = [...reservations, result];
            localStorage.setItem(
              "reservations",
              JSON.stringify(nouvellesReservations)
            );

            afficherErreurModalReservation(
              `Réservation ${result.statut.toLowerCase()}.`
            );
            window.location.href = "/espaceUtilisateur";
          })
          .catch((error) => {
            afficherErreurModalReservation(error.message);
          });
      }
    })
    .catch((error) => {
      console.error(
        "Erreur lors du chargement des réservations utilisateur :",
        error
      );
      afficherErreurModalReservation("Impossible de charger vos réservations.");
    });
}

function afficherErreurModalReservation(message) {
  const errorModalBody = document.getElementById("errorModalBodyReservation");
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
