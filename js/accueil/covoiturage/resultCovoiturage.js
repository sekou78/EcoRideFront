// Sélecteurs filtres
const filtreEcologique = document.getElementById("trajet-ecologique");
const filtrePrix = document.getElementById("filtrePrixVoyage");
const filtreDuree = document.getElementById("filtreDureeVoyage");
const filtreNotes = document.getElementById("filtreNoteMin");
const btnAppliquerFiltre = document.getElementById("btnValidFilter");

// Conteneurs résultat et pagination
const container = document.getElementById("result-container");
const paginationContainer = document.getElementById("pagination-container");

// Objet pour garder les filtres actuels
let currentFilters = {
  estEcologique: false,
  prixMax: "",
  dureeMax: "",
  noteMin: "",
};

// Initialisation sans filtre : charger page 1
fetchPage(1);

// Au clic sur "Appliquer filtre"
btnAppliquerFiltre.addEventListener("click", () => {
  currentFilters.estEcologique = filtreEcologique.checked;
  currentFilters.prixMax = filtrePrix.value;
  currentFilters.dureeMax = filtreDuree.value;
  currentFilters.noteMin = filtreNotes.value.trim();

  // Toujours repartir à la première page
  fetchPage(1);
});

// Récupère des trajets selon les filtres et page
function fetchPage(pageNumber) {
  const baseUrl = apiUrl + "trajet/api/trajetsFiltres";

  const params = new URLSearchParams();
  if (currentFilters.estEcologique) params.append("estEcologique", "true");
  if (currentFilters.prixMax) params.append("prix", currentFilters.prixMax);
  if (currentFilters.dureeMax)
    params.append("dureeVoyage", currentFilters.dureeMax);
  // toujours demander la première page complète
  params.append("page", 1);
  // récupérer un grand nombre pour paginer localement
  params.append("limit", 1000);

  const token = getCookie(tokenCookieName);
  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  fetch(`${baseUrl}?${params.toString()}`, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  })
    .then((response) => {
      if (!response.ok) {
        // Conversion de la réponse en JSON pour lire les messages d'erreur
        return response.json().then((errorData) => {
          // redirection si suspendu
          compteSuspendu(errorData);
          throw new Error(
            "Impossible de charger les informations de l'utilisateur."
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.items)) {
        container.innerHTML =
          "<p class='text-center mt-3'>Aucun trajet trouvé.</p>";
        paginationContainer.innerHTML = "";
        return;
      }

      // Filtrage local sur la note minimale
      let filteredItems = data.items;
      const noteMinNum = parseFloat(currentFilters.noteMin);
      if (!isNaN(noteMinNum)) {
        filteredItems = filteredItems.filter(
          (trajet) =>
            trajet.moyenneNoteChauffeur !== null &&
            parseFloat(trajet.moyenneNoteChauffeur) >= noteMinNum
        );
      }

      // Pagination locale sur filtre d'Items
      const itemsPerPage = 5;
      const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
      const currentPage = Math.min(Math.max(pageNumber, 1), totalPages || 1);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const itemsPage = filteredItems.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      // Si aucun trajet filtré ne reste
      if (filteredItems.length === 0) {
        container.innerHTML =
          "<p class='text-center mt-3'>Aucun trajet trouvé avec vos filtres.</p>";
        paginationContainer.innerHTML = "";
        return;
      }

      // Affichage des trajets
      renderPage({ items: itemsPage });

      // Affichage pagination locale seulement si plus d'une page
      if (totalPages > 1) {
        renderPagination(currentPage, totalPages);
      } else {
        paginationContainer.innerHTML = "";
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des trajets :", error);
      container.innerHTML =
        "<p class='text-danger text-center mt-3'>Erreur serveur.</p>";
      paginationContainer.innerHTML = "";
    });
}

// Fonction d'affichage des trajets
function renderPage(pageData) {
  container.innerHTML = "";

  if (
    !pageData ||
    !Array.isArray(pageData.items) ||
    pageData.items.length === 0
  ) {
    container.innerHTML =
      "<p class='text-center mt-3'>Aucun trajet trouvé.</p>";
    // cacher la pagination si pas de données
    paginationContainer.innerHTML = "";
    return;
  }

  // Filtrage des trajets par statut "EN_ATTENTE" et/ou "EN_COURS"
  let trajetsFiltres = pageData.items.filter((trajet) => {
    const statut = trajet.statut.trim().toUpperCase();
    return statut === "EN_ATTENTE" || statut === "EN_COURS";
  });

  if (trajetsFiltres.length === 0) {
    container.innerHTML =
      "<p class='text-center mt-3'>Aucun trajet en attente ou en cours.</p>";
    // cacher la pagination si pas de données
    paginationContainer.innerHTML = "";
    return;
  }

  // Trier pour que les statuts "EN_COURS" soient en premier
  const ordreStatut = ["EN_COURS", "EN_ATTENTE"];
  trajetsFiltres.sort((a, b) => {
    const statutA = a.statut.trim().toUpperCase();
    const statutB = b.statut.trim().toUpperCase();
    return ordreStatut.indexOf(statutA) - ordreStatut.indexOf(statutB);
  });

  // Fonction notation (étoiles)
  function notations(rating) {
    const maxStars = 5;
    let stars = "";
    for (let i = 1; i <= maxStars; i++) {
      stars += i <= rating ? "⭐️" : "☆";
    }
    return stars;
  }

  trajetsFiltres.forEach((trajet, index) => {
    const card = document.createElement("div");
    card.className = "card mb-4 shadow-lg";

    const imageUrl = trajet.image
      ? `${urlImg}${trajet.image}`
      : "/images/avatar.png";

    card.innerHTML = `
      <div class="card-header bg-dark text-primary text-center">
        <h2>Résultat ${index + 1}</h2>
      </div>
      <div class="row g-0 p-3">
        <div class="col-md-4">
          <img src="${imageUrl}" class="img-fluid rounded-start" alt="photo d'identité" />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title text-center">
              ${trajet.chauffeur || "N/A"}
              <span class="notation-stars">${notations(
                trajet.moyenneNoteChauffeur || 0
              )}</span>
            </h5>
            <p><strong>Statut du trajet :</strong> ${trajet.statut}</p>
            <p><strong>🪑 Places disponibles :</strong> ${
              trajet.placesDisponibles
            }</p>
            <p><strong>💰 Prix :</strong> ${trajet.prix} Crédits</p>
            <p><strong>📅 Date départ :</strong> ${trajet.dateDepart}</p>
            <p><strong>⏰ Heure départ :</strong> ${trajet.heureDepart}</p>
            <p><strong>📅 Date arrivée :</strong> ${trajet.dateArrivee}</p>
            <p><strong>🕒 Durée (estimée) :</strong> ${trajet.dureeVoyage}</p>
            <p><strong>🛣️ Péage :</strong> ${
              trajet.peage === "oui" ? "✅ Oui" : "❌ Non"
            }</p>
            <p><strong>🌱 Écologique :</strong> ${
              trajet.estEcologique === "oui" ? "✅ Oui" : "❌ Non"
            }</p>
          </div>
        </div>
      </div>
    `;

    const footer = document.createElement("div");
    footer.classList.add("card-footer", "text-center");

    const btnDetail = document.createElement("a");
    btnDetail.href = `/vueDetaillee?id=${trajet.id}`;
    btnDetail.className = "btn bg-success text-primary me-2 detail-btn";
    btnDetail.textContent = "Détails";

    btnDetail.addEventListener("click", () => {
      localStorage.setItem("trajetInfos", JSON.stringify(trajet));
      window.location.href = `/vueDetaillee?id=${trajet.id}`;
    });

    footer.appendChild(btnDetail);
    card.appendChild(footer);
    container.appendChild(card);
  });
}

// Fonction pour afficher la pagination
function renderPagination(current, total) {
  paginationContainer.innerHTML = "";

  if (total <= 1) return;

  const nav = document.createElement("nav");
  const ul = document.createElement("ul");
  ul.className = "pagination";

  function createPageBtn(label, page, disabled = false, active = false) {
    const li = document.createElement("li");
    li.className =
      "page-item" + (disabled ? " disabled" : "") + (active ? " active" : "");
    const a = document.createElement("a");
    a.className = "page-link bg-dark text-primary";
    a.href = "#";
    a.textContent = label;

    if (active) {
      a.style.borderColor = "red";
    }

    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (!disabled && !active) fetchPage(page);
    });

    li.appendChild(a);
    return li;
  }

  ul.appendChild(createPageBtn("«", current - 1, current === 1));
  for (let i = 1; i <= total; i++) {
    ul.appendChild(createPageBtn(i, i, false, i === current));
  }
  ul.appendChild(createPageBtn("»", current + 1, current === total));

  nav.appendChild(ul);
  paginationContainer.appendChild(nav);
}
