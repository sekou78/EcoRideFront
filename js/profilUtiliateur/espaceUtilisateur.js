const modifProfil = document.getElementById("profil-form");
const avatarDisplay = document.getElementById("avatar-display");
const pseudoDisplay = document.getElementById("pseudo-display");
const totalCredits = document.getElementById("total-credits");
const emailCurrentUserDisplay = document.getElementById("email-display");
const telephoneDisplay = document.getElementById("telephone-display");
const roleDisplay = document.getElementById("role-display");
const listeTrajetsContainer = document.getElementById("listeTrajets");
const immatriculationDisplay = document.getElementById(
  "immatriculation-display"
);
const dateImmatriculationDisplay = document.getElementById(
  "date-immatriculation-display"
);
const marqueVehiculeDisplay = document.getElementById(
  "marque-vehicule-display"
);
const modeleVehiculeDisplay = document.getElementById(
  "modele-vehicule-display"
);
const couleurVehiculeDisplay = document.getElementById(
  "couleur-vehicule-display"
);
const placesDisponiblesDisplay = document.getElementById(
  "places-disponibles-display"
);
const electriqueDisplay = document.getElementById("electrique-display");
const fumeurDisplay = document.getElementById("fumeur-display");
const animalDisplay = document.getElementById("animal-display");
const preferencesAutresDisplay = document.getElementById(
  "preferences-autres-display"
);
const btnDemarrer = document.getElementById("btn-demarrer");
const btnArrivee = document.getElementById("btn-arrivee");
const inputPseudoAvis = document.getElementById("floatingInput");
const textareaAvis = document.getElementById("floatingTextarea");
const btnEnvoyerCommentaire = document.getElementById(
  "btn-envoyer-commentaire"
);
const btnRemonterProblemes = document.getElementById("btn-remonter-problemes");
const btnConfirmerSuppression = document.getElementById(
  "btnConfirmerSuppression"
);

inputPseudoAvis.addEventListener("keyup", validInputAvis);
textareaAvis.addEventListener("keyup", validInputAvis);

btnDemarrer.addEventListener("click", gestionDemarrer);
btnArrivee.addEventListener("click", gestionArrivee);
btnEnvoyerCommentaire.disabled = true;
btnEnvoyerCommentaire.addEventListener("click", gestionEnvoyerCommentaire);
btnRemonterProblemes.disabled = true;
btnRemonterProblemes.addEventListener("click", gestionRemonterProblemes);
btnConfirmerSuppression.addEventListener("click", suppressionModal);

function validInputAvis() {
  const pseudoOk = validateAvisRequired(inputPseudoAvis);
  const commentaireOk = validateAvisRequired(textareaAvis);

  if (pseudoOk && commentaireOk) {
    btnEnvoyerCommentaire.disabled = false;
    btnRemonterProblemes.disabled = false;
  } else {
    btnEnvoyerCommentaire.disabled = true;
    btnRemonterProblemes.disabled = true;
  }
}

const token = getCookie(tokenCookieName);

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

// 1er appel API : récupérer les infos de l'utilisateur connecté
fetch(apiUrl + "account/me", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        "Impossible de charger les informations de l'utilisateur."
      );
    }
    return response.json();
  })
  .then((user) => {
    console.log(user);

    const roles = user.user.roles;
    setRole(roles.join(","));

    // Affichage des infos utilisateur
    pseudoDisplay.textContent = user.user.pseudo;
    totalCredits.textContent = user.user.credits;
    emailCurrentUserDisplay.textContent = user.user.email;
    roleDisplay.textContent = roles.join(", ");
    telephoneDisplay.textContent = user.user.telephone;
    avatarDisplay.src = urlImg + user.user.image.filePath;

    //  Preferences utilisateur chauffeur
    fumeurDisplay.textContent = user.user.accepteFumeur ? "Oui" : "Non";
    animalDisplay.textContent = user.user.accepteAnimaux ? "Oui" : "Non";
    preferencesAutresDisplay.textContent = user.user.autresPreferences;

    // Afficher les trajets en cours
    const trajets = user.trajet;

    // Filtrer tous les trajets EN_COURS et EN_ATTENTE
    const trajetsAFiltrer = trajets.filter(
      (t) => t.statut === "EN_COURS" || t.statut === "EN_ATTENTE"
    );

    if (trajetsAFiltrer.length > 0) {
      trajetsAFiltrer.forEach((trajetEnCours, index) => {
        // Définir dynamiquement les styles du badge selon le statut
        const badgeStyles = {
          EN_COURS: { bg: "dark", text: "primary" },
          EN_ATTENTE: { bg: "warning", text: "primary" },
        };

        const { bg, text } = badgeStyles[trajetEnCours.statut] || {
          bg: "secondary",
          text: "white",
        };

        // Création du conteneur principal de la carte Bootstrap
        const trajetCard = document.createElement("div");
        trajetCard.classList.add("card", "mb-4", "shadow");

        // Construction du contenu de la carte avec Bootstrap
        trajetCard.innerHTML = `
      <!-- En-tête de la carte -->
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">🚗 Trajet #${index + 1}</h5>
        <span class="badge bg-${bg} text-${text} fw-bold px-3 py-1 rounded-pill text-uppercase">
          ${trajetEnCours.statut.replace("_", " ")}
        </span>
      </div>

      <!-- Corps de la carte avec les détails du trajet -->
      <div class="card-body">
        <p class="mb-1"><strong>Départ :</strong> ${
          trajetEnCours.adresseDepart
        }</p>
        <p class="mb-1"><strong>Arrivée :</strong> ${
          trajetEnCours.adresseArrivee
        }</p>
        <p class="mb-1"><strong>Date départ :</strong> ${formatDateFR(
          trajetEnCours.dateDepart
        )}</p>
        <p class="mb-1"><strong>Date arrivée :</strong> ${formatDateFR(
          trajetEnCours.dateArrivee
        )}</p>
        <p class="mb-1"><strong>Heure départ :</strong> ${formatHeure(
          trajetEnCours.heureDepart
        )}</p>
        <p class="mb-1"><strong>Durée (estimée) :</strong> ${formatHeure(
          trajetEnCours.dureeVoyage
        )}</p>
        <p class="mb-1"><strong>Péage :</strong> ${
          trajetEnCours.peage ? "Oui" : "Non"
        }</p>
        <p class="mb-1"><strong>Prix :</strong> ${trajetEnCours.prix} Crédit</p>
        <p class="mb-1"><strong>Écologique :</strong> ${
          trajetEnCours.estEcologique ? "Oui" : "Non"
        }</p>
        <p class="mb-1"><strong>Places disponibles :</strong> ${
          trajetEnCours.nombrePlacesDisponible
        }</p>
        <p class="mb-1"><strong>Véhicule :</strong> ${
          trajetEnCours.vehicule.plaqueImmatriculation
        }</p>

        <!-- Zone boutons avec Bootstrap -->
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-dark btn-sm btn-modifier text-primary" data-id="${
            trajetEnCours.id
          }">✏️ Modifier</button>
          <button class="btn btn-danger btn-sm btn-supprimer text-light" style="background-color: #dc3545; border-color: #dc3545;">🗑 Supprimer</button>
        </div>
      </div>
    `;

        // Sélection des boutons créés dynamiquement
        const btnModifier = trajetCard.querySelector(".btn-modifier");
        const btnSupprimer = trajetCard.querySelector(".btn-supprimer");

        // Ajout de l'événement pour modifier un trajet
        btnModifier.addEventListener("click", () => {
          editionTrajet(trajetEnCours);
          window.location.href = "/modifTrajet";
        });

        btnSupprimer.addEventListener("click", () => {
          // Stocker temporairement le trajet à supprimer
          window.trajetASupprimer = trajetEnCours;

          // Ouvrir la modal
          const modal = new bootstrap.Modal(
            document.getElementById("confirmModal")
          );
          modal.show();
        });

        // Ajout de la carte au conteneur principal
        listeTrajetsContainer.appendChild(trajetCard);
      });
    } else {
      // Message affiché s’il n’y a aucun trajet
      listeTrajetsContainer.innerHTML = `
    <div class="alert alert-info text-center">
      Aucun trajet en cours.
    </div>`;
    }
  });

//Fonction modifier trajet
function editionTrajet(trajet) {
  localStorage.setItem("trajet", JSON.stringify(trajet));
}

function suppressionModal() {
  if (window.trajetASupprimer) {
    supprimerTrajet(window.trajetASupprimer);
    window.trajetASupprimer = null;
  }
}

async function supprimerTrajet(trajetEnCours) {
  // 1. Enregistrer le véhicule dans localStorage
  localStorage.setItem("trajet_en_cours", JSON.stringify(trajetEnCours));

  const token = getCookie(tokenCookieName);
  const trajetEnCoursId = trajetEnCours?.id;

  // 2. Vérification de l'ID
  if (!trajetEnCoursId) {
    alert("Impossible de trouver l'ID du trajet.");
    return;
  }

  // 3. Préparation de la requête
  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  // 4. Appel API
  try {
    const response = await fetch(
      `${apiUrl}trajet/${trajetEnCoursId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du trajet.");
    }

    // 5. Nettoyage et redirection
    localStorage.removeItem("trajet_en_cours");
    document.location.href = "/espaceUtilisateur";
  } catch (error) {
    console.error("Erreur :", error);
    alert("trajet non supprimé.");
  }
}

function afficherInfosVehicule(vehicule) {
  immatriculationDisplay.textContent = vehicule.plaqueImmatriculation;
  dateImmatriculationDisplay.textContent = formatDateFR(
    vehicule.dateImmatriculation
  );
  marqueVehiculeDisplay.textContent = vehicule.marque;
  modeleVehiculeDisplay.textContent = vehicule.modele;
  couleurVehiculeDisplay.textContent = vehicule.couleur;
  placesDisponiblesDisplay.textContent = vehicule.nombrePlaces;
  electriqueDisplay.textContent = vehicule.electrique ? "Oui" : "Non";
}

//Appel de la fonction d'affichage des reservations
afficherReservations();
// Les reservations du passager
function afficherReservations() {
  let reservationIdASupprimer = null;
  const modal = new bootstrap.Modal(document.getElementById("modalAnnulation"));
  const confirmerBtn = document.getElementById("confirmerAnnulationBtn");

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(apiUrl + "reservation/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      const listeReservationsContainer = document.getElementById(
        "reservations-container"
      );
      listeReservationsContainer.innerHTML = "";

      if (result && result.length > 0) {
        result.forEach((result, index) => {
          const reservationCard = document.createElement("div");
          reservationCard.className = `card shadow rounded-4 border-2 border-${
            result.statut === "CONFIRMEE" ? "success" : "warning"
          } p-3 my-4`;

          reservationCard.innerHTML = `
            <h4 class="fw-bold text-${
              result.statut === "CONFIRMEE" ? "success" : "warning"
            }">
              Réservation ${result.statut.toLowerCase()} #${index + 1}
              ${
                result.statut === "CONFIRMEE"
                  ? '<i class="bi bi-check-circle-fill ms-2"></i>'
                  : '<i class="bi bi-hourglass-split ms-2"></i>'
              }
            </h4>
            <p><strong>Départ :</strong> ${result.trajet.adresseArrivee}</p>
            <p><strong>Arrivée :</strong> ${result.trajet.adresseDepart}</p>
            <p><strong>Date :</strong> ${formatDateFR(
              result.trajet.dateDepart
            )} à ${formatHeure(result.trajet.heureDepart)}</p>
            <p><strong>Prix :</strong> ${result.trajet.prix} Crédits</p>
            <p><strong>Conducteur :</strong> ${
              result.trajet.chauffeur.pseudo
            }</p>
            <p><strong>Véhicule :</strong> ${
              result.trajet.vehicule.plaqueImmatriculation
            }</p>
            <p><strong>Durée estimée :</strong> ${formatHeure(
              result.trajet.dureeVoyage
            )} heures</p>
            <p><strong>Statut du trajet :</strong> <span class="badge bg-${
              result.trajet.statut === "CONFIRMEE" ? "success" : "warning"
            }">${result.trajet.statut}</span></p>
          `;

          const btnContainer = document.createElement("div");
          btnContainer.className = "text-center mt-3";

          const btnDetails = document.createElement("button");
          btnDetails.className = `btn text-primary btn-${
            result.statut === "CONFIRMEE" ? "success" : "warning"
          } btn-sm mx-2`;
          btnDetails.textContent = "Voir les détails";
          btnDetails.addEventListener("click", () =>
            voirDetails(result.trajet)
          );

          const btnAnnuler = document.createElement("button");
          btnAnnuler.className = "btn text-primary btn-red btn-sm mx-2";
          btnAnnuler.textContent = "Annuler";
          btnAnnuler.addEventListener("click", () => {
            reservationIdASupprimer = result.id;
            modal.show();
          });

          btnContainer.appendChild(btnDetails);
          btnContainer.appendChild(btnAnnuler);
          reservationCard.appendChild(btnContainer);
          listeReservationsContainer.appendChild(reservationCard);
        });
      } else {
        listeReservationsContainer.innerHTML = `<p class="text-muted">Aucune réservation pour le moment.</p>`;
      }
    })
    .catch((error) => console.error(error));

  // Confirmation depuis la modale
  confirmerBtn.addEventListener("click", () => {
    if (reservationIdASupprimer) {
      annulerReservation(reservationIdASupprimer);
      reservationIdASupprimer = null;
      modal.hide();
    }
  });
}

// Suppression de la reservation
function annulerReservation(id) {
  if (confirm("Voulez-vous vraiment annuler cette réservation ?")) {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", token);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(apiUrl + `reservation/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Erreur lors de l'annulation.");
      });
  }
}

// Fonction pour convertir la date en format ISO (dd-mm-yyyy)
function formatDateFR(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Fonction pour convertir l'heure en format ISO (hh:mm)
function formatHeure(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Fonction de gestion du bouton "Démarrer"
function gestionDemarrer() {
  alert("Voyage démarré !");
  btnDemarrer.classList.add("d-none");
  btnArrivee.classList.remove("d-none");
}

// Fonction de gestion du bouton "Arrivée"
function gestionArrivee() {
  alert("Arrivée à destination, trajet terminé !");

  btnArrivee.classList.add("d-none");
}

// Fonction de gestion de l'affichage
function gestionAffichage() {
  // Au départ : Démarrer visible, Arrivée cachée
  btnDemarrer.classList.remove("d-none");
  btnArrivee.classList.add("d-none");

  // Quand on clique sur Démarrer → Masquer Démarrer et Afficher Arrivée
  btnDemarrer.addEventListener("click", function () {
    btnDemarrer.classList.add("d-none");
    btnArrivee.classList.remove("d-none");
  });

  // Quand on clique sur Arrivée → Tout cacher
  btnArrivee.addEventListener("click", function () {
    btnArrivee.classList.add("d-none");

    // Simuler une validation des participants
    setTimeout(() => {
      const validationParticipants = confirm(
        "Tous les passagers ont confirmé que le trajet s'est bien passé ?"
      );

      if (validationParticipants) {
        mettreAJourCredits();
      } else {
        alert("Un problème a été signalé. Un employé va intervenir");
      }
    }, 1000);

    envoyerEmailParticipants();
  });
}

// Fonction de mise à jour des crédits du chauffeur
function mettreAJourCredits() {
  const currentUserEmail = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("userAppli")) || [];

  const userIndex = users.findIndex((u) => u.email === currentUserEmail);

  if (userIndex === -1) {
    alert("Utilisateur introuvable pour la mise à jour des crédits.");
    return;
  }

  const userData = users[userIndex];

  let credits = userData.credits || 0;
  const prix = parseInt(prixDisplay.textContent);

  credits += prix;
  userData.credits = credits;

  users[userIndex] = userData;
  localStorage.setItem("userAppli", JSON.stringify(users));

  totalCredits.textContent = credits;
  alert("Crédits mis à jour !");
}

// Fonction pour simuler l'envoi d'un email aux passagers
function envoyerEmailParticipants(message) {
  alert("Envoi d'un email aux participants :", message);
}

// Appel de la fonction d'affichage
gestionAffichage();
//Demande de remplissage du champs requis
function validateAvisRequired(input) {
  if (input.value != "") {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Envoie de commentaire pour être validé par un employé
function gestionEnvoyerCommentaire() {
  // Récupérer les anciens commentaires s’ils existent
  let commentaires = [];
  try {
    const saved = JSON.parse(localStorage.getItem("commentaires"));
    if (Array.isArray(saved)) {
      commentaires = saved;
    } else if (saved) {
      commentaires = [saved];
    }
  } catch (e) {
    console.warn("Erreur lors du parsing de commentaires :", e);
  }

  const newComment = {
    pseudo: inputPseudoAvis.value.trim(),
    commentaire: textareaAvis.value.trim(),
  };

  // Ajouter le nouveau commentaire au tableau
  commentaires.push(newComment);

  // Sauvegarder le tableau mis à jour
  localStorage.setItem("commentaires", JSON.stringify(commentaires));

  alert("Commentaire envoyé !");
  window.location.reload();
}

function gestionRemonterProblemes() {
  // Récupérer les anciens commentaires s’ils existent
  let problemesRemonter = [];
  try {
    const saved = JSON.parse(localStorage.getItem("problemesRemonter"));
    if (Array.isArray(saved)) {
      problemesRemonter = saved;
    } else if (saved) {
      problemesRemonter = [saved];
    }
  } catch (e) {
    console.warn("Erreur lors du parsing de problemesRemonter :", e);
  }

  // Générer un identifiant unique style #CV123456
  const uniqueId = "#CV" + Math.floor(100000 + Math.random() * 900000);

  // Créer le nouveau commentaire
  const newProblemesRemonter = {
    id: uniqueId,
    pseudo: inputPseudoAvis.value.trim(),
    commentaire: textareaAvis.value.trim(),
    date: new Date().toISOString(), // facultatif mais pratique
  };

  // Ajouter à la liste existante
  problemesRemonter.push(newProblemesRemonter);

  // Sauvegarder à nouveau
  localStorage.setItem("problemesRemonter", JSON.stringify(problemesRemonter));

  alert("Probleme remonter");
  window.location.reload();
}
