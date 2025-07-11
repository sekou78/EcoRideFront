const pseudoHistorique = document.getElementById("pseudo-historique");
const creditsHistorique = document.getElementById("credits-historique");
const placesDisponiblesHistorique = document.getElementById(
  "places-disponibles-historique"
);
const mesCovoiturages = document.getElementById("mes-covoiturages");

// Appel de l'API pour récupérer les trajets
function appliquerHeureSurDateReservation(dateStr, heureStr) {
  const dateParts = dateStr.split("-");
  const [heures, minutes] = heureStr.split(":").map(Number);
  const dateIso = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${heures
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  return new Date(dateIso);
}

function estPasseeReservation(dateStr, heureStr, dureeVoyage) {
  const debut = appliquerHeureSurDateReservation(dateStr, heureStr);
  const [heures, minutes] = dureeVoyage.split(":").map(Number);
  const finTrajet = new Date(debut);
  finTrajet.setHours(finTrajet.getHours() + heures);
  finTrajet.setMinutes(finTrajet.getMinutes() + minutes);
  return finTrajet < new Date();
}

function estEnCoursReservation(dateStr, heureStr, dureeVoyage) {
  const debut = appliquerHeureSurDateReservation(dateStr, heureStr);
  const [heures, minutes] = dureeVoyage.split(":").map(Number);
  const fin = new Date(debut);
  fin.setHours(fin.getHours() + heures);
  fin.setMinutes(fin.getMinutes() + minutes);
  const maintenant = new Date();
  return maintenant >= debut && maintenant <= fin;
}

function isFutur(dateStr) {
  const dateParts = dateStr.split("-");
  const dateTrajet = new Date(
    `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00`
  );
  return dateTrajet >= new Date();
}

const token = getCookie(tokenCookieName);

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch(apiUrl + "historique/", requestOptions)
  .then((response) => response.json())
  .then((data) => {
    const trajets = data.items;
    console.log("Historique des trajets :", trajets);

    trajets.forEach((trajet, index) => {
      const covoiturageDiv = document.createElement("div");
      covoiturageDiv.className = "history-item text-center mb-4";
      covoiturageDiv.id = `covoiturage-${index}`;

      const futur = isFutur(trajet.dateDepart);

      let boutonHTML = "";
      if (futur && trajet.statutReservation !== "ANNULEE") {
        boutonHTML = `
          <button type="button" class="btn btn-red text-primary" id="btn-covoiturage-${index}">
            Annuler ce covoiturage
          </button>
        `;
      }

      covoiturageDiv.innerHTML = `
        <h5 class="text-primary"><strong>Covoiturage ${index + 1}</strong></h5>
        <p><strong>Départ :</strong> ${trajet.adresseDepart}</p>
        <p><strong>Arrivée :</strong> ${trajet.adresseArrivee}</p>
        <p><strong>Date :</strong> ${trajet.dateDepart}</p>
        <p><strong>Rôle :</strong> ${
          trajet.estChauffeur ? "Chauffeur" : "Passager"
        }</p>
        <p><strong>Statut du trajet :</strong> <span class="text-danger">${
          trajet.statut
        }</span></p>
        <p><strong>Statut de la réservation :</strong> <span class="text-danger">${
          trajet.statutReservation
        }</span></p>
        ${boutonHTML}
      `;

      mesCovoiturages.appendChild(covoiturageDiv);

      // Écouteur seulement si bouton créé (date future et réservation non annulée)
      if (futur && trajet.statutReservation !== "ANNULEE") {
        document
          .getElementById(`btn-covoiturage-${index}`)
          .addEventListener("click", () => {
            annulCovoiturage(trajet.id);
          });
      }
    });
  })
  .catch((error) => console.error("Erreur fetch historique:", error));

// Fonction d'annulation d'un covoiturage
function annulCovoiturage() {
  window.location.href = "/espaceUtilisateur";
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
