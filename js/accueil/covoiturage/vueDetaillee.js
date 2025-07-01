//Infos conducteur
const avatarDetailleeDisplay = document.getElementById(
  "avatar-detaille-display"
);
const pseudoDetailleeDisplay = document.getElementById(
  "pseudo-detaille-display"
);
//Infos du Trajet
const adresseDepartDetailleeDisplay = document.getElementById(
  "adresse-depart-detaille-display"
);
const adresseArriveeDetailleeDisplay = document.getElementById(
  "adresse-arrivee-detaille-display"
);
const statutDetailleeDisplay = document.getElementById(
  "statut-detaille-display"
);
const placesDisponiblesDetailleeDisplay = document.getElementById(
  "places-disponibles-detaille-display"
);
const prixDetailleeDisplay = document.getElementById("prix-detaille-display");
const dateDepartDetailleeDisplay = document.getElementById(
  "date-depart-detaille-display"
);
const dateArriveeDetailleeDisplay = document.getElementById(
  "date-arrivee-detaille-display"
);
const heureDepartDetailleeDisplay = document.getElementById(
  "heure-depart-detaille-display"
);
const dureeDetailleeDisplay = document.getElementById(
  "duree-trajet-detaille-display"
);
const peageDetailleeDisplay = document.getElementById("peage-detaille-display");
const trajetEcologiqueDetailleeDisplay = document.getElementById(
  "trajet-ecologique-detaille-display"
);
//Avis sur le conducteur
const noteDetailleeDisplay = document.getElementById("note-detaille-display");
const autresAvisDetailleeDisplay = document.getElementById(
  "autres-avis-detaille-display"
);
//Informations sur le Véhicule
const immatriculationDetailleeDisplay = document.getElementById(
  "immatriculation-detaille-display"
);
const marqueDetailleeDisplay = document.getElementById(
  "marque-detaille-display"
);
const modeleDetailleeDisplay = document.getElementById(
  "modele-detaille-display"
);
const couleurDetailleeDisplay = document.getElementById(
  "couleur-detaille-display"
);
const electriqueDetailleeDisplay = document.getElementById(
  "electrique-detaille-display"
);
//Préférences du Conducteur
const fumeurDetailleeDisplay = document.getElementById(
  "fumeur-detaille-display"
);
const animalDetailleeDisplay = document.getElementById(
  "animal-detaille-display"
);
const autresPreferencesDetailleeDisplay = document.getElementById(
  "autres-preferences-display"
);

//Appel de la fonction
vueDetailleeTrajetInfos();
async function vueDetailleeTrajetInfos() {
  // Récupérer les infos de l'ID du trajet selectionné depuis le localStorage
  const trajetIdInfos = JSON.parse(localStorage.getItem("trajetInfos"));

  const trajetInfosId = trajetIdInfos?.id;

  if (!trajetInfosId) {
    alert("Impossible de trouver l'ID du trajet.");
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
    pseudoDetailleeDisplay.textContent = result.chauffeur.pseudo || "—";
    avatarDetailleeDisplay.src = result.chauffeur.image?.filePath
      ? urlImg + result.chauffeur.image.filePath
      : "/images/avatar.png";

    adresseDepartDetailleeDisplay.textContent = result.adresseDepart || "—";
    adresseArriveeDetailleeDisplay.textContent = result.adresseArrivee || "—";
    statutDetailleeDisplay.textContent = result.statut || "—";
    placesDisponiblesDetailleeDisplay.textContent =
      result.nombrePlacesDisponible || "—";
    prixDetailleeDisplay.textContent = result.prix || "—";
    dateDepartDetailleeDisplay.textContent = formatDateFR(result.dateDepart);
    dateArriveeDetailleeDisplay.textContent = formatDateFR(result.dateArrivee);
    heureDepartDetailleeDisplay.textContent =
      formatHeure(result.heureDepart) || "—";
    dureeDetailleeDisplay.textContent = formatHeure(result.dureeVoyage) || "—";
    peageDetailleeDisplay.textContent = result.peage ? "Oui" : "Non";
    trajetEcologiqueDetailleeDisplay.textContent = result.estEcologique
      ? "Oui"
      : "Non";

    const lienAvisChauffeur = document.getElementById("lienAvisChauffeur");

    if (lienAvisChauffeur && result.chauffeur?.pseudo && result.id) {
      lienAvisChauffeur.href = `/commentairesSurChauffeur?pseudo=${encodeURIComponent(
        result.chauffeur.pseudo
      )}&trajetId=${encodeURIComponent(result.id)}`;
    }

    //Avis sur le conducteur
    // Appel de la fonction
    vueAvis();
    function vueAvis() {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(apiUrl + "avis/avisVisible", requestOptions)
        .then((response) => response.json())
        .then((avisList) => {
          const chauffeurPseudo = trajetIdInfos?.chauffeur;

          if (!chauffeurPseudo) {
            console.warn("Impossible de récupérer le pseudo du chauffeur.");
            return;
          }

          const avisChauffeur = avisList.filter(
            (avis) => avis.reservation?.chauffeur === result.chauffeur.pseudo
          );

          const container = document.getElementById("avisVueDetaillee");
          container.innerHTML = "";

          if (avisChauffeur.length === 0) {
            container.innerHTML = `
            <li class="list-group-item text-body-secondary">Aucun avis pour ce conducteur.</li>`;
            return;
          }

          // 💡 Calcul de la moyenne des notes
          const totalNotes = avisChauffeur.reduce((sum, avis) => {
            const note = parseInt(avis.note);
            return sum + (isNaN(note) ? 0 : note);
          }, 0);

          const moyenne = totalNotes / avisChauffeur.length;
          const noteArrondie = Math.round(moyenne); // arrondi à l'entier le plus proche

          // 💡 Affichage des étoiles de la moyenne
          const etoilesMoyenne =
            "⭐️".repeat(noteArrondie) + "☆".repeat(5 - noteArrondie);
          const moyenneHtml = `
          <li class="list-group-item">
          ${etoilesMoyenne} (${moyenne.toFixed(1)} / 5 )
          </li>
        `;

          container.insertAdjacentHTML("beforeend", moyenneHtml);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des avis visibles :",
            error
          );
        });
    }

    //Informations sur le Véhicule
    immatriculationDetailleeDisplay.textContent =
      result.vehicule.plaqueImmatriculation || "—";
    marqueDetailleeDisplay.textContent = result.vehicule.marque || "—";
    modeleDetailleeDisplay.textContent = result.vehicule.modele || "—";
    couleurDetailleeDisplay.textContent = result.vehicule.couleur || "—";
    electriqueDetailleeDisplay.textContent = result.vehicule.electrique
      ? "Oui"
      : "Non";

    //Préférences du Conducteur
    fumeurDetailleeDisplay.textContent = result.chauffeur.accepteFumeur
      ? "Oui"
      : "Non";
    animalDetailleeDisplay.textContent = result.chauffeur.accepteAnimaux
      ? "Oui"
      : "Non";
    autresPreferencesDetailleeDisplay.textContent =
      result.chauffeur.autresPreferences || "—";
  } catch (error) {
    console.error("Erreur :", error);
    alert("Impossible d'afficher les détails du trajet.");
  }
}
