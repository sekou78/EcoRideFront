const container = document.getElementById("result-container");
const paginationContainer = document.getElementById("pagination-container");

function fetchPage(pageNumber) {
  const baseUrl = apiUrl + "trajet/api/listeTrajets";
  const params = new URLSearchParams(
    JSON.parse(localStorage.getItem("searchParams") || "{}")
  );
  params.set("page", pageNumber);

  fetch(`${baseUrl}?${params.toString()}`)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("resultTrajets", JSON.stringify(data));
      renderPage(data);
      renderPagination(data.currentPage, data.totalPages);
    })
    .catch((err) => {
      console.error("Erreur pagination :", err);
      container.innerHTML =
        "<p class='text-danger'>Erreur lors du chargement des trajets.</p>";
    });
}

const data = JSON.parse(localStorage.getItem("resultTrajets"));
console.log(data);

if (data && Array.isArray(data.items)) {
  renderPage(data);
  renderPagination(data.currentPage, data.totalPages);
} else {
  container.innerHTML = "<p class='text-center mt-3'>Aucun trajet trouvé.</p>";
}

function renderPage(pageData) {
  container.innerHTML = "";

  if (!pageData || !Array.isArray(pageData.items)) {
    container.innerHTML =
      "<p class='text-center mt-3'>Aucun trajet trouvé.</p>";
    return;
  }

  // Filtrer les trajets par statut "EN_COURS" ou "EN_ATTENTE"
  let trajetsFiltres = pageData.items.filter((trajet) => {
    const statut = trajet.statut.trim().toUpperCase();
    return statut === "EN_COURS" || statut === "EN_ATTENTE";
  });

  if (trajetsFiltres.length === 0) {
    container.innerHTML =
      "<p class='text-center mt-3'>Aucun trajet en attente ou en cours.</p>";
    return;
  }

  // Trier pour que les "EN_COURS" soient en premier
  const ordreStatut = ["EN_COURS", "EN_ATTENTE"];

  trajetsFiltres.sort((a, b) => {
    const statutA = a.statut.trim().toUpperCase();
    const statutB = b.statut.trim().toUpperCase();
    return ordreStatut.indexOf(statutA) - ordreStatut.indexOf(statutB);
  });

  // Fonction de notation
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
              <span class="notation-stars">${notations(trajet.note || 0)}</span>
            </h5>
            <p><strong>Statut du trajet :</strong> ${trajet.statut}</p>
            <p><strong>Places restantes :</strong> ${
              trajet.placesDisponibles
            }</p>
            <p><strong>Prix :</strong> ${trajet.prix} Crédits</p>
            <p><strong>Date départ :</strong> ${trajet.dateDepart}</p>
            <p><strong>Heure départ :</strong> ${trajet.heureDepart}</p>
            <p><strong>Date arrivée :</strong> ${trajet.dateArrivee}</p>
            <p><strong>Durée du trajet (estimée) :</strong> ${
              trajet.dureeVoyage
            }</p>
            <p><strong>Péage :</strong> ${
              trajet.peage === "oui" ? "✅ Oui" : "❌ Non"
            }</p>
            <p><strong>Écologique :</strong> ${
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
    btnDetail.className = "btn btn-success me-2 detail-btn";
    btnDetail.textContent = "Détails";

    btnDetail.addEventListener("click", () => {
      detailsTrajetSelected(trajet);
    });

    footer.appendChild(btnDetail);
    card.appendChild(footer);
    container.appendChild(card);
  });

  function detailsTrajetSelected(trajetInfos) {
    localStorage.setItem("trajetInfos", JSON.stringify(trajetInfos));
    window.location.href = `/vueDetaillee?id=${trajetInfos.id}`;
  }
}

function renderPagination(current, total) {
  paginationContainer.innerHTML = "";

  // Pas de pagination à afficher
  if (total <= 1) return;

  const nav = document.createElement("nav");
  const ul = document.createElement("ul");
  ul.className = "pagination";

  function createPageBtn(label, page, disabled = false, active = false) {
    const li = document.createElement("li");
    li.className =
      "page-item" + (disabled ? " disabled" : "") + (active ? " active" : "");
    const a = document.createElement("a");
    //couleur de la pagination
    a.className = "page-link bg-dark text-primary";
    a.href = "#";
    a.textContent = label;

    // Appliquer un style spécial si c’est le bouton actif
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
