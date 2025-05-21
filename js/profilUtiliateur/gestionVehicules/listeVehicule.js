async function chargerVehiculesUtilisateur() {
  const token = getCookie(tokenCookieName);
  if (!token) {
    console.error("Token d'authentification manquant.");
    return;
  }

  const headers = new Headers();
  headers.append("X-AUTH-TOKEN", token);

  try {
    const response = await fetch(apiUrl + "profilConducteur/", {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) throw new Error("Erreur lors de l'appel à l'API");

    const vehicules = await response.json();
    genererModalsVehicules(vehicules);
  } catch (error) {
    console.error("Erreur de récupération des véhicules :", error);
  }
}

function genererModalsVehicules(vehicules) {
  const container = document.getElementById("vehiculeButtonsContainer");
  container.innerHTML = "";

  vehicules.forEach((vehicule, index) => {
    const modalId = `vehiculeModal-${index}`;

    // Bouton d'ouverture de modal
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn bg-dark border-dark text-primary m-2";
    btn.dataset.bsToggle = "modal";
    btn.dataset.bsTarget = `#${modalId}`;
    btn.textContent = vehicule.plaqueImmatriculation;

    // Modal container
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = modalId;
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", `label-${modalId}`);
    modal.setAttribute("aria-hidden", "true");

    function formatDateFR(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const formattedDate = formatDateFR(vehicule.dateImmatriculation);

    // Contenu HTML du modal
    modal.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="label-${modalId}">
          ${vehicule.plaqueImmatriculation}
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
      </div>
      <div class="modal-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>Immatriculation :</strong> ${
            vehicule.plaqueImmatriculation
          }</li>
          <li class="list-group-item"><strong>Date d'immatriculation :</strong> ${formattedDate}</li>
          <li class="list-group-item"><strong>Marque :</strong> ${
            vehicule.marque
          }</li>
          <li class="list-group-item"><strong>Modèle :</strong> ${
            vehicule.modele
          }</li>
          <li class="list-group-item"><strong>Couleur :</strong> ${
            vehicule.couleur
          }</li>
          <li class="list-group-item"><strong>Nombre de places :</strong> ${
            vehicule.nombrePlaces
          }</li>
          <li class="list-group-item"><strong>Électrique :</strong> ${
            vehicule.electrique ? "Oui" : "Non"
          }</li>
        </ul>
      </div>
    </div>
  </div>
`;

    // Création du footer dynamiquement pour y injecter les boutons
    const footer = document.createElement("div");
    footer.className =
      "modal-footer d-flex justify-content-center text-primary";

    // Bouton Éditer
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-secondary";
    editBtn.textContent = "Éditer";
    editBtn.addEventListener("click", () => {
      sauvegarderVehicule(vehicule);
      window.location.href = "/editerVehicule";
    });

    // Bouton Supprimer
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-red";
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener("click", () => {
      supprimerderVehicule(vehicule);
    });

    // Ajout des boutons dans le footer
    footer.appendChild(editBtn);
    footer.appendChild(deleteBtn);

    // Insertion du footer dans le modal
    modal.querySelector(".modal-content").appendChild(footer);

    // Ajout au DOM
    container.appendChild(btn);
    container.appendChild(modal);
  });
}

function sauvegarderVehicule(vehicule) {
  localStorage.setItem("vehicule_a_editer", JSON.stringify(vehicule));
}

async function supprimerderVehicule(vehicule) {
  // 1. Enregistrer le véhicule dans localStorage
  localStorage.setItem("vehicule_a_editer", JSON.stringify(vehicule));

  const token = getCookie(tokenCookieName);
  const vehiculeId = vehicule?.id;

  // 2. Vérification de l'ID
  if (!vehiculeId) {
    alert("Impossible de trouver l'ID du véhicule.");
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
      `${apiUrl}profilConducteur/${vehiculeId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du véhicule");
    }

    // 5. Nettoyage et redirection
    localStorage.removeItem("vehicule_a_editer");
    document.location.href = "/listeVehicule";
  } catch (error) {
    console.error("Erreur :", error);
    alert("Véhicule non supprimé.");
  }
}

// Lancer après chargement DOM
window.addEventListener("DOMContentLoaded", chargerVehiculesUtilisateur());
