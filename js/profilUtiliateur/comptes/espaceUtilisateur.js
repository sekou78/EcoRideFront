const avisPassagerForm = document.getElementById("avis-passager-form");
const modifProfil = document.getElementById("profil-form");

//Informations sur l'utilisateur
const avatarDisplay = document.getElementById("avatar-display");
const pseudoDisplay = document.getElementById("pseudo-display");
const totalCredits = document.getElementById("total-credits");
const emailCurrentUserDisplay = document.getElementById("email-display");
const telephoneDisplay = document.getElementById("telephone-display");
const roleDisplay = document.getElementById("role-display");

//Informations sur le Trajet du chauffeur
const listeTrajetsContainer = document.getElementById("listeTrajets");

//Informations sur le Véhicule
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
const btnConfirmerSuppression = document.getElementById(
  "btnConfirmerSuppression"
);

btnConfirmerSuppression.addEventListener("click", suppressionModal);

const token = getCookie(tokenCookieName);

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

function filtrerRolesSansRoleUser(rolesArray) {
  // Nettoie les espaces
  const roles = rolesArray.map((r) => r.trim()).filter(Boolean);

  if (roles.length === 0) return ["ROLE_USER"]; // aucun rôle → ROLE_USER
  if (roles.length > 1 && roles.includes("ROLE_USER"))
    return roles.filter((r) => r !== "ROLE_USER"); // retire ROLE_USER

  return roles; // sinon inchangé
}

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

    // filtrage
    const rolesFiltrees = filtrerRolesSansRoleUser(roles);

    setRole(roles.join(","));

    // Affichage des infos utilisateur
    pseudoDisplay.textContent = user.user.pseudo;
    totalCredits.textContent = user.user.credits;
    emailCurrentUserDisplay.textContent = user.user.email;
    roleDisplay.textContent = rolesFiltrees.join(", ");
    telephoneDisplay.textContent = user.user.telephone;
    avatarDisplay.src = urlImg + user.user.image.filePath;

    //  Preferences utilisateur chauffeur
    fumeurDisplay.textContent = user.user.accepteFumeur ? "Oui" : "Non";
    animalDisplay.textContent = user.user.accepteAnimaux ? "Oui" : "Non";
    preferencesAutresDisplay.textContent = user.user.autresPreferences;

    // TRAJETS POUR LES CHAUFFEURS
    // Afficher les trajets
    const trajets = user.trajet;

    // Filtre pour n'afficher que les trajets créés par l'utilisateur connecté
    const userId = user.user.id;

    let trajetsFiltres = trajets;

    // Si l'utilisateur est uniquement passager, il ne voit rien ici
    if (
      roles.includes("PASSAGER") &&
      !roles.includes("CHAUFFEUR") &&
      !roles.includes("PASSAGER_CHAUFFEUR")
    ) {
      trajetsFiltres = [];
    } else {
      // Pour CHAUFFEUR ou PASSAGER_CHAUFFEUR, on filtre sur le créateur
      trajetsFiltres = trajets.filter(
        (trajet) => trajet.chauffeur && trajet.chauffeur.id === userId
      );
    }

    // Utilisez trajetsFiltres à la place de trajets pour l'affichage
    const ordreStatuts = {
      EN_COURS: 1,
      EN_ATTENTE: 2,
      FINI: 3,
    };

    // Filtrer tous les trajets EN_COURS, EN_ATTENTE et FINI
    let trajetsAFiltrer = trajetsFiltres
      .filter((t) => ["EN_COURS", "EN_ATTENTE", "FINI"].includes(t.statut))
      .sort((a, b) => ordreStatuts[a.statut] - ordreStatuts[b.statut]);

    // Lire les trajets masqués depuis localStorage
    const trajetsMasques = JSON.parse(
      localStorage.getItem("trajetsMasques") || "[]"
    );

    // Filtrer ceux à afficher (non masqués)
    const trajetsVisibles = trajetsAFiltrer.filter(
      (t) => !trajetsMasques.includes(t.id)
    );

    if (trajetsVisibles.length > 0) {
      trajetsVisibles.forEach((trajetEnCours, index) => {
        const badgeStyles = {
          EN_COURS: { bg: "dark", text: "primary" },
          EN_ATTENTE: { bg: "warning", text: "primary" },
          FINI: { bg: "black", text: "primary" },
        };
        const { bg, text } = badgeStyles[trajetEnCours.statut] || {
          bg: "secondary",
          text: "white",
        };

        const trajetCard = document.createElement("div");
        trajetCard.classList.add("card", "mb-4", "shadow");
        trajetCard.innerHTML = `
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">🚗 Trajet #${index + 1}</h5>
        <span class="badge bg-${bg} text-${text} fw-bold px-3 py-1 rounded-pill text-uppercase">
          ${trajetEnCours.statut.replace("_", " ")}
        </span>
      </div>
      <div class="card-body">
        <p><strong>📍 Départ :</strong> ${trajetEnCours.adresseDepart}</p>
        <p><strong>🎯 Arrivée :</strong> ${trajetEnCours.adresseArrivee}</p>
        <p><strong>📅 Date départ :</strong> ${formatDateFR(
          trajetEnCours.dateDepart
        )}</p>
        <p><strong>📅 Date arrivée :</strong> ${formatDateFR(
          trajetEnCours.dateArrivee
        )}</p>
        <p><strong>⏰ Heure départ :</strong> ${formatHeure(
          trajetEnCours.heureDepart
        )}</p>
        <p><strong>🕒 Durée (estimée) :</strong> ${formatHeure(
          trajetEnCours.dureeVoyage
        )}</p>
        <p><strong>🛣️ Péage :</strong> ${
          trajetEnCours.peage ? "Oui" : "Non"
        }</p>
        <p><strong>💰 Prix :</strong> ${trajetEnCours.prix} Crédit</p>
        <p><strong>🌱 Écologique :</strong> ${
          trajetEnCours.estEcologique ? "Oui" : "Non"
        }</p>
        <p><strong>🪑 Places disponibles :</strong> ${
          trajetEnCours.nombrePlacesDisponible
        }</p>
        <p><strong>🚗 Véhicule :</strong> ${
          trajetEnCours.vehicule.plaqueImmatriculation
        }</p>

        <p>
          <strong>👥 </strong>
          <a href="/listesPassagers?id=${trajetEnCours.id}" class="text-black">
            Liste des passagers
          </a>
        </p>
      </div>
    `;

        // Fonctions pour prendre heure et date en compte
        function appliquerHeureSurDate(date, heureStr) {
          const [heures, minutes] = heureStr.split(":").map(Number);
          const dateAvecHeure = new Date(date);
          dateAvecHeure.setHours(heures);
          dateAvecHeure.setMinutes(minutes);
          dateAvecHeure.setSeconds(0);
          dateAvecHeure.setMilliseconds(0);
          return dateAvecHeure;
        }

        // Vérifie si le trajet est déjà passé (date + durée < maintenant)
        function estPassee(date, dureeVoyage) {
          const [heures, minutes] = dureeVoyage.split(":").map(Number);
          const finTrajet = new Date(date);
          finTrajet.setHours(finTrajet.getHours() + heures);
          finTrajet.setMinutes(finTrajet.getMinutes() + minutes);

          const maintenant = new Date();
          return finTrajet < maintenant;
        }

        // Vérifie si le trajet est en cours (maintenant entre date et date + durée)
        function estEnCours(date, dureeVoyage) {
          const [heures, minutes] = dureeVoyage.split(":").map(Number);
          const debut = new Date(date);
          const fin = new Date(date);
          fin.setHours(fin.getHours() + heures);
          fin.setMinutes(fin.getMinutes() + minutes);

          const maintenant = new Date();
          return maintenant >= debut && maintenant <= fin;
        }

        const dateDepartBrute = new Date(trajetEnCours.dateDepart);
        const heureDepart = formatHeure(trajetEnCours.heureDepart); // ex: "14:30"
        const dateDepart = appliquerHeureSurDate(dateDepartBrute, heureDepart);
        const dureeVoyage = formatHeure(trajetEnCours.dureeVoyage); // ex: "01:45"

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add(
          "d-flex",
          "justify-content-end",
          "gap-2",
          "mt-3"
        );

        const trajetEnCoursId = trajetEnCours?.id;
        if (!trajetEnCoursId) {
          console.error("Impossible de trouver l'ID du trajet.");
          return;
        }

        // 🔴 1. Si le trajet est terminé (passé)
        if (estPassee(dateDepart, dureeVoyage)) {
          // Met à jour le statut automatiquement dans la BDD
          const headers = new Headers();
          headers.append("Content-Type", "application/json");
          headers.append("X-AUTH-TOKEN", token);

          const body = JSON.stringify({ statut: "FINI" });

          fetch(apiUrl + `trajet/${trajetEnCoursId}`, {
            method: "PUT",
            headers,
            body,
          })
            .then((response) => {
              if (!response.ok)
                throw new Error("Échec de la mise à jour automatique");
              return response.json();
            })
            .then((result) => {
              console.log("Trajet marqué comme FINI :", result);

              // Bouton "Fin de trajet"
              const btnFin = document.createElement("button");
              btnFin.classList.add(
                "btn",
                "bg-warning",
                "text-primary",
                "btn-sm"
              );
              btnFin.textContent = "🏁 Fin de trajet";

              btnFin.addEventListener("click", () => {
                // ⚠️ Met à jour le statut à TERMINEE en BDD
                fetch(apiUrl + `trajet/${trajetEnCoursId}`, {
                  method: "PUT",
                  headers,
                  body: JSON.stringify({ statut: "TERMINEE" }),
                })
                  .then((response) => {
                    if (!response.ok)
                      throw new Error("Erreur lors de la terminaison");
                    return response.json();
                  })
                  .then(() => {
                    console.log("Trajet terminé avec succès");

                    // ➕ Appel pour envoyer 2 crédits à l'admin
                    envoyerCreditAdmin(trajetEnCoursId);

                    envoyerEmailParticipants(trajetEnCours); // Optionnel

                    // Stocker en local
                    let trajetsFinis = JSON.parse(
                      localStorage.getItem("trajetsFinis") || "[]"
                    );
                    trajetEnCours.statut = "TERMINEE";
                    trajetsFinis.push(trajetEnCours);
                    localStorage.setItem(
                      "trajetsFinis",
                      JSON.stringify(trajetsFinis)
                    );

                    // Masquer la carte
                    trajetCard.remove();

                    // Mémoriser comme masqué
                    let trajetsMasques = JSON.parse(
                      localStorage.getItem("trajetsMasques") || "[]"
                    );
                    trajetsMasques.push(trajetEnCours.id);
                    localStorage.setItem(
                      "trajetsMasques",
                      JSON.stringify(trajetsMasques)
                    );

                    window.location.reload();
                  })
                  .catch(console.error);
              });

              buttonsContainer.appendChild(btnFin);
            })
            .catch(console.error);
        }

        // 2. Si la date et l'heure du départ sont atteintes, mais statut encore non EN_COURS
        else if (estEnCours(dateDepart, dureeVoyage)) {
          // 👀 Vérifie si le statut est déjà passé à "EN_COURS" dans la BDD
          if (trajetEnCours.statut === "EN_COURS") {
            // ✅ Déjà démarré → on affiche "En cours" directement
            const btnEnCours = document.createElement("button");
            btnEnCours.classList.add(
              "btn",
              "btn-info",
              "text-primary",
              "btn-sm"
            );
            btnEnCours.textContent = "▶️ En cours";
            btnEnCours.disabled = true;
            buttonsContainer.appendChild(btnEnCours);
          } else {
            // 🔘 Pas encore démarré → afficher "Démarrer"
            const btnDemarrer = document.createElement("button");
            btnDemarrer.classList.add(
              "btn",
              "btn-success",
              "text-primary",
              "btn-sm"
            );
            btnDemarrer.textContent = "🟢 Démarrer";

            btnDemarrer.addEventListener("click", () => {
              const headers = new Headers();
              headers.append("Content-Type", "application/json");
              headers.append("X-AUTH-TOKEN", token);

              fetch(apiUrl + `trajet/${trajetEnCoursId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ statut: "EN_COURS" }),
              })
                .then((response) => {
                  if (!response.ok)
                    throw new Error("Erreur API lors du changement de statut");
                  return response.json();
                })
                .then(() => {
                  console.log("🚀 Statut changé en EN_COURS");

                  // 👁‍🗨 Mise à jour visuelle immédiate
                  btnDemarrer.classList.remove("btn-success");
                  btnDemarrer.classList.add("btn-info");
                  btnDemarrer.textContent = "▶️ En cours";
                  btnDemarrer.disabled = true;

                  envoyerEmailParticipants(trajetEnCours);

                  // Optionnel : recharger la page pour forcer l'affichage du nouveau statut
                  window.location.reload();

                  // Ou : mettre à jour localement
                  // trajetEnCours.statut = "EN_COURS";
                })
                .catch((error) => {
                  console.error(
                    "❌ Erreur lors de la mise à jour EN_COURS :",
                    error
                  );
                });
            });

            buttonsContainer.appendChild(btnDemarrer);
          }
        }

        // 3. Si le statut est déjà EN_COURS (stocké en BDD ou local)
        else if (trajetEnCours.statut === "EN_COURS") {
          const btnEnCours = document.createElement("button");
          btnEnCours.classList.add("btn", "btn-info", "text-primary", "btn-sm");
          btnEnCours.textContent = "▶️ En cours";
          btnEnCours.disabled = true;
          buttonsContainer.appendChild(btnEnCours);
        }

        // 4. Avant l'heure prévue : affiche Modifier / Supprimer
        else {
          // Bouton modifier
          const btnModifier = document.createElement("button");
          btnModifier.classList.add(
            "btn",
            "btn-dark",
            "btn-sm",
            "text-primary"
          );
          btnModifier.textContent = "✏️ Modifier";
          btnModifier.addEventListener("click", () => {
            editionTrajet(trajetEnCours);
            window.location.href = "/modifTrajet";
          });

          // Bouton supprimer
          const btnSupprimer = document.createElement("button");
          btnSupprimer.classList.add(
            "btn",
            "btn-red",
            "btn-sm",
            "text-primary"
          );
          btnSupprimer.textContent = "🗑 Supprimer";
          btnSupprimer.addEventListener("click", () => {
            window.trajetASupprimer = trajetEnCours;
            const modal = new bootstrap.Modal(
              document.getElementById("confirmModal")
            );
            modal.show();
          });

          buttonsContainer.appendChild(btnModifier);
          buttonsContainer.appendChild(btnSupprimer);
        }

        // ✅ Ajouter les boutons à la carte
        trajetCard.querySelector(".card-body").appendChild(buttonsContainer);
        listeTrajetsContainer.appendChild(trajetCard);
      });
    } else {
      listeTrajetsContainer.innerHTML = `
    <div class="alert alert-info text-center">
      Aucun trajet en cours.
    </div>`;
      // Masquer le container si aucun trajet
      listeTrajetsContainer.style.display = "none";
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

// RESERVATIONS POUR LES PASSAGERS
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
          // Ignorer les réservations annulées, mais les stocker dans le localStorage
          if (result.statut === "ANNULEE") {
            let annulees =
              JSON.parse(localStorage.getItem("reservationsAnnulees")) || [];
            annulees.push(result);
            localStorage.setItem(
              "reservationsAnnulees",
              JSON.stringify(annulees)
            );
            return; // Ne pas afficher
          }

          // Vérifie si la réservation est dans moins de 24h
          function estDansMoinsDe24h(dateDepart) {
            const maintenant = new Date();
            const diffEnMs = dateDepart - maintenant;
            const diffEnHeures = diffEnMs / (1000 * 60 * 60);
            return diffEnHeures > 0 && diffEnHeures <= 24;
          }

          function estDansMoinsDe12h(dateDepart) {
            const maintenant = new Date();
            const diffEnMs = dateDepart - maintenant;
            const diffEnHeures = diffEnMs / (1000 * 60 * 60);
            return diffEnHeures > 0 && diffEnHeures <= 12;
          }

          function annulerReservationAutomatique(idReservation) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("X-AUTH-TOKEN", token);

            fetch(apiUrl + `reservation/${idReservation}`, {
              method: "DELETE",
              headers: myHeaders,
            })
              .then((response) => {
                if (!response.ok)
                  throw new Error("Échec de l'annulation automatique");
                console.log(
                  `Réservation ${idReservation} annulée automatiquement.`
                );
              })
              .catch((error) => console.error(error));
          }

          // Fonctions pour prendre heure et date en compte
          function appliquerHeureSurDateReservation(date, heureStr) {
            const [heures, minutes] = heureStr.split(":").map(Number);
            const dateAvecHeure = new Date(date);
            dateAvecHeure.setHours(heures);
            dateAvecHeure.setMinutes(minutes);
            dateAvecHeure.setSeconds(0);
            dateAvecHeure.setMilliseconds(0);
            return dateAvecHeure;
          }

          // Vérifie si le trajet est déjà passé (date + durée < maintenant)
          function estPasseeReservation(date, dureeVoyage) {
            const [heures, minutes] = dureeVoyage.split(":").map(Number);
            const finTrajet = new Date(date);
            finTrajet.setHours(finTrajet.getHours() + heures);
            finTrajet.setMinutes(finTrajet.getMinutes() + minutes);

            const maintenant = new Date();
            return finTrajet < maintenant;
          }

          // Vérifie si le trajet est en cours (maintenant entre date et date + durée)
          function estEnCoursReservation(date, dureeVoyage) {
            const [heures, minutes] = dureeVoyage.split(":").map(Number);
            const debut = new Date(date);
            const fin = new Date(date);
            fin.setHours(fin.getHours() + heures);
            fin.setMinutes(fin.getMinutes() + minutes);

            const maintenantReservation = new Date();
            return (
              maintenantReservation >= debut && maintenantReservation <= fin
            );
          }

          //ex:Wed Jun 25 2025 00:00:00 GMT+0200 (heure d’été d’Europe centrale)
          const dateDepartReservationBrute = new Date(result.trajet.dateDepart);

          // ex: "14:30"
          const heureDepartReservation = formatHeure(result.trajet.heureDepart);

          //ex:Wed Jun 25 2025 08:30:00 GMT+0200 (heure d’été d’Europe centrale)
          const dateDepartReservation = appliquerHeureSurDateReservation(
            dateDepartReservationBrute,
            heureDepartReservation
          );

          // ex: "01:45"
          const dureeVoyage = formatHeure(result.trajet.dureeVoyage);

          if (result.statut === "EN_ATTENTE") {
            if (estDansMoinsDe12h(dateDepartReservation)) {
              console.log(
                "Annulation dans moins de 12h — remboursement partiel côté backend"
              );
            }

            if (estDansMoinsDe24h(dateDepartReservation)) {
              // Annulation automatique comme avant
              annulerReservationAutomatique(result.id);
              return; // ne pas afficher la réservation annulée
            }
          }

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
            <p><strong>📍 Départ :</strong> ${result.trajet.adresseDepart}</p>
            <p><strong>🎯 Arrivée :</strong> ${result.trajet.adresseArrivee}</p>
            <p><strong>📅 Date départ :</strong> ${formatDateFR(
              result.trajet.dateDepart
            )} à ${formatHeure(result.trajet.heureDepart)}</p>
            <p><strong>🪑 Places disponibles :</strong> ${
              result.trajet.nombrePlacesDisponible
            } Places</p>
            <p><strong>💰 Prix :</strong> ${result.trajet.prix} Crédits</p>
            <p><strong>👤 Conducteur :</strong> ${
              result.trajet.chauffeur.pseudo
            }</p>
            <p><strong>🚗 Véhicule :</strong> ${
              result.trajet.vehicule.plaqueImmatriculation
            }</p>
            <p><strong>🕒 Durée (estimée) :</strong> ${formatHeure(
              result.trajet.dureeVoyage
            )} heures</p>
            <p><strong>ℹ️ Statut du trajet :</strong> <span class="badge bg-${
              result.trajet.statut === "CONFIRMEE" ? "success" : "warning"
            }">${result.trajet.statut}</span></p>
            <p><strong>📱 Chauffeur:</strong> ${
              result.trajet.chauffeur.telephone
            }
            </p>
          `;

          const btnContainer = document.createElement("div");
          btnContainer.className = "text-center mt-3";

          const btnDetails = document.createElement("button");
          btnDetails.className = `btn text-primary btn-${
            result.statut === "CONFIRMEE" ? "success" : "warning"
          } btn-sm mx-2`;
          btnDetails.textContent = "Voir les détails";
          btnDetails.addEventListener("click", () => voirDetails(result));
          btnContainer.appendChild(btnDetails);

          if (estEnCoursReservation(dateDepartReservation, dureeVoyage)) {
            // Bouton "En cours"
            const btnEnCours = document.createElement("button");
            btnEnCours.className = "btn bg-warning text-primary btn-sm mx-2";
            btnEnCours.textContent = "En cours";
            btnEnCours.disabled = true;
            btnContainer.appendChild(btnEnCours);
          } else if (
            !estPasseeReservation(dateDepartReservation, dureeVoyage)
          ) {
            // Bouton "Annuler"
            const btnAnnuler = document.createElement("button");
            btnAnnuler.className = "btn text-primary btn-red btn-sm mx-2";
            btnAnnuler.textContent = "Annuler";
            btnAnnuler.addEventListener("click", () => {
              reservationIdASupprimer = result.id;
              modal.show();
            });
            btnContainer.appendChild(btnAnnuler);
          } else {
            // Bouton "Fin du trajet"
            const btnTermine = document.createElement("button");
            btnTermine.className = "btn bg-secondary btn-sm mx-2";
            btnTermine.textContent = "Fin du trajet";
            btnTermine.addEventListener("click", () =>
              voirTrajetTermine(result)
            );
            btnContainer.appendChild(btnTermine);
          }

          reservationCard.appendChild(btnContainer);
          listeReservationsContainer.appendChild(reservationCard);
        });
      } else {
        listeReservationsContainer.innerHTML = `<p class="text-muted">Aucune réservation pour le moment.</p>`;
        // Masquer le container si aucune réservation
        listeReservationsContainer.style.display = "none";
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

// button voir details
function voirDetails(reservation) {
  localStorage.setItem("reservationDetails", JSON.stringify(reservation));
  window.location.href = `/vueReservation?id=${reservation.id}`;
}

// Fonction pour trajet terminer
function voirTrajetTermine(reservation) {
  localStorage.setItem("reservationTerminee", JSON.stringify(reservation));
  window.location.href = `/avis?id=${reservation.id}`;
}

// Suppression de la reservation
function annulerReservation(id) {
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
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
      alert("Erreur lors de l'annulation.");
    });
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

// Fonction pour simuler l'envoi d'un email aux passagers
function envoyerEmailParticipants(message) {
  alert("Envoi d'un email aux participants :", message);
}

// Appel de la fonction d'affichage
// gestionAffichage();
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

// fin de trajet et envoi de credit a l'admin
function envoyerCreditAdmin(trajetId) {
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({}),
    redirect: "follow",
  };

  fetch(apiUrl + `trajet/terminee/${trajetId}`, requestOptions)
    .then((response) => {
      if (!response.ok) throw new Error("Erreur transfert crédits");
      return response.json();
    })
    .then((result) => {
      console.log("Crédits transférés :", result);
    })
    .catch((error) => console.error(error));
}

loadMonCompte();
