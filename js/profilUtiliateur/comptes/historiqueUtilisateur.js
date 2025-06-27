const pseudoHistorique = document.getElementById("pseudo-historique");
const creditsHistorique = document.getElementById("credits-historique");
const placesDisponiblesHistorique = document.getElementById(
  "places-disponibles-historique"
);
const mesCovoiturages = document.getElementById("mes-covoiturages");

const token = getCookie(tokenCookieName);

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

// Appel de l'API pour récupérer les trajets
fetch(apiUrl + "historique/", requestOptions)
  .then((response) => response.json())
  .then((data) => {
    const trajets = data.items;

    trajets.forEach((trajet, index) => {
      const covoiturageDiv = document.createElement("div");
      covoiturageDiv.className = "history-item text-center mb-4";
      covoiturageDiv.id = `covoiturage-${index}`;

      const dateParts = trajet.dateDepart.split("-"); // Format: "dd-mm-yyyy"
      const dateTrajet = new Date(
        `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00`
      );
      const dateNow = new Date();

      const isFutur = dateTrajet >= dateNow;

      let boutonHTML = "";
      if (isFutur) {
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
        ${boutonHTML}
      `;

      mesCovoiturages.appendChild(covoiturageDiv);

      // Ajouter l'écouteur d'annulation **seulement si date future**
      if (isFutur) {
        document
          .getElementById(`btn-covoiturage-${index}`)
          .addEventListener("click", () => {
            annulCovoiturage();
          });
      }
    });
  })
  .catch((error) => console.error("Erreur API :", error));

// Fonction d'annulation d'un covoiturage
function annulCovoiturage() {
  window.location.href = "/espaceUtilisateur";
}
