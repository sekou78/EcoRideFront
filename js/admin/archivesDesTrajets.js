const filterButton = document.getElementById("filterButton");
const resetButton = document.getElementById("resetButton");

// Attacher l'événement au bouton "Filtrer"
filterButton.addEventListener("click", function () {
  fetchArchives(1);
});

// Attacher l'événement au bouton "Réinitialiser"
resetButton.addEventListener("click", resetFilters);

// Fonction de réinitialisation des filtres
function resetFilters() {
  // Réinitialiser les valeurs des champs de filtre
  document.getElementById("filterDepart").value = "";
  document.getElementById("filterArrivee").value = "";
  document.getElementById("filterDateDepart").value = "";
  document.getElementById("filterPrixMin").value = "";
  document.getElementById("filterPrixMax").value = "";

  // Appeler fetchArchives avec la première page après réinitialisation
  fetchArchives(1);
}

let currentPage = 1;
let limit = 5;
let totalPages = 1;

// Fonction pour récupérer les archives
async function fetchArchives(page = 1) {
  const token = getCookie(tokenCookieName);

  // Récupérer les valeurs des filtres
  const departFilter = document.getElementById("filterDepart").value.trim();
  const arriveeFilter = document.getElementById("filterArrivee").value.trim();
  const dateDepartFilter = document
    .getElementById("filterDateDepart")
    .value.trim();
  const prixMinFilter = document.getElementById("filterPrixMin").value.trim();
  const prixMaxFilter = document.getElementById("filterPrixMax").value.trim();

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // Convertir la date en format dd/mm/yyyy si elle existe
  const formattedDateDepart = dateDepartFilter
    ? convertDateForBackend(dateDepartFilter)
    : "";

  let url = `${apiUrl}archives/?page=${page}&limit=${limit}`;

  if (departFilter) url += `&depart=${encodeURIComponent(departFilter)}`;
  if (arriveeFilter) url += `&arrivee=${encodeURIComponent(arriveeFilter)}`;
  if (formattedDateDepart)
    url += `&dateDepart=${encodeURIComponent(formattedDateDepart)}`;
  if (prixMinFilter) url += `&prixMin=${encodeURIComponent(prixMinFilter)}`;
  if (prixMaxFilter) url += `&prixMax=${encodeURIComponent(prixMaxFilter)}`;

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) throw new Error("Erreur API: " + response.status);
    const data = await response.json();

    const tbodyDesktop = document.getElementById("archivesTableDesktop");
    const cardsContainer = document.getElementById("archivesCards");

    // Réinitialisation de l'affichage
    tbodyDesktop.innerHTML = "";
    cardsContainer.innerHTML = "";

    if (data.archives.length === 0) {
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent =
        "Aucune archive trouvée pour les filtres sélectionnés.";
      cardsContainer.appendChild(noDataMessage);
      return;
    }

    data.archives.forEach((archive) => {
      // Table row desktop
      const row = document.createElement("tr");
      row.dataset.archiveId = archive.id;
      row.innerHTML = `
    <td>${archive.id}</td>
    <td>${archive.trajetId}</td>
    <td>${archive.snapshot.adresseDepart}</td>
    <td>${archive.snapshot.adresseArrivee}</td>
    <td>${archive.snapshot.dateDepart ?? ""}</td>
    <td>${archive.snapshot.dateArrivee ?? ""}</td>
    <td>${archive.snapshot.prix}</td>
    <td>${archive.snapshot.statut}</td>
    <td>${archive.archivedAt}</td>
  `;
      tbodyDesktop.appendChild(row);

      // Écouteur d'événements pour ouvrir la modal lors du clic sur une ligne du tableau
      row.addEventListener("click", async (e) => {
        const archiveId = e.currentTarget.dataset.archiveId;
        openModal(archiveId); // Ouvre la modal avec l'ID de l'archive
      });

      // Mobile card
      const card = document.createElement("div");
      card.className = "card mb-3 mt-3 shadow-sm";
      card.dataset.archiveId = archive.id;
      card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">Trajet #${archive.trajetId}</h5>
      <p class="card-text mb-1"><strong>Départ:</strong> ${
        archive.snapshot.adresseDepart
      }</p>
      <p class="card-text mb-1"><strong>Arrivée:</strong> ${
        archive.snapshot.adresseArrivee
      }</p>
      <p class="card-text mb-1"><strong>Date départ:</strong> ${
        archive.snapshot.dateDepart ?? ""
      }</p>
      <p class="card-text mb-1"><strong>Date arrivée:</strong> ${
        archive.snapshot.dateArrivee ?? ""
      }</p>
      <p class="card-text mb-1"><strong>Prix:</strong> ${
        archive.snapshot.prix
      }</p>
      <p class="card-text mb-1"><strong>Statut:</strong> ${
        archive.snapshot.statut
      }</p>
      <p class="card-text mb-1"><strong>Archivé le:</strong> ${
        archive.archivedAt
      }</p>
    </div>
  `;
      cardsContainer.appendChild(card);

      // Écouteur d'événements pour ouvrir la modal lors du clic sur une carte mobile
      card.addEventListener("click", async (e) => {
        const archiveId = e.currentTarget.dataset.archiveId;
        openModal(archiveId); // Ouvre la modal avec l'ID de l'archive
      });
    });

    // Pagination
    totalPages = Math.ceil(data.totalCount / limit);
    renderPagination(page);
  } catch (error) {
    console.error("Erreur lors de la récupération des archives:", error);
  }
}

// Ouvrir le modal avec les détails de l'archive
async function openModal(archiveId) {
  const token = getCookie(tokenCookieName);

  try {
    const response = await fetch(`${apiUrl}archives/${archiveId}`, {
      method: "GET",
      headers: { "X-AUTH-TOKEN": token },
    });

    if (!response.ok) throw new Error("Erreur API: " + response.status);
    const dataDetail = await response.json();

    const modalBody = document.getElementById("archiveModalBody");
    modalBody.innerHTML = ` 
      <p><strong>ID:</strong> ${dataDetail.id}</p>
      <p><strong>Trajet ID:</strong> ${dataDetail.trajetId}</p>
      <p><strong>Adresse départ:</strong> ${
        dataDetail.snapshot.adresseDepart
      }</p>
      <p><strong>Adresse arrivée:</strong> ${
        dataDetail.snapshot.adresseArrivee
      }</p>
      <p><strong>Date départ:</strong> ${
        dataDetail.snapshot.dateDepart ?? ""
      }</p>
      <p><strong>Date arrivée:</strong> ${
        dataDetail.snapshot.dateArrivee ?? ""
      }</p>
      <p><strong>Prix:</strong> ${dataDetail.snapshot.prix}</p>
      <p><strong>Statut:</strong> ${dataDetail.snapshot.statut}</p>
      <p><strong>Archivé le:</strong> ${dataDetail.archivedAt}</p>
    `;

    // Ouvrir la modal Bootstrap
    const modal = new bootstrap.Modal(document.getElementById("archiveModal"));
    modal.show();
  } catch (error) {
    console.error("Erreur lors de l'ouverture du modal:", error);
  }
}

function convertDateForBackend(dateString) {
  // Tenter de créer une date depuis le format DD/MM/YYYY
  let date = null;

  // Si la date est au format d/m/yyyy (utilisé par l'utilisateur)
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const parts = dateString.split("/");
    date = new Date(parts[2], parts[1] - 1, parts[0]); // Mois commence à 0 en JavaScript
  }

  // Si la date est au format YYYY-MM-DD (format ISO)
  else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    date = new Date(dateString); // ISO format
  }

  // Si la date est au format MM/DD/YYYY (format US)
  else if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const parts = dateString.split("/");
    date = new Date(parts[2], parts[0] - 1, parts[1]);
  }

  // Si la date est au format d-M-yyyy (ex: 2-Mar-2025)
  else if (dateString.match(/^\d{1,2}-[A-Za-z]{3}-\d{4}$/)) {
    date = new Date(dateString); // Format peut être traité par le constructeur Date
  }

  // Si la date est au format classique de l'utilisateur
  else {
    date = new Date(dateString);
  }

  // Si la conversion a échoué
  if (isNaN(date)) {
    console.error("Invalid date format.");
    return null;
  }

  // Retourner la date au format "dd/mm/yyyy"
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // mois commence à 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Pagination
function renderPagination(currentPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  if (currentPage > 1) {
    const prevBtn = document.createElement("li");
    prevBtn.className = "page-item";
    prevBtn.innerHTML = `<a class="page-link" href="#" onclick="fetchArchives(${prevPage})">Précédent</a>`;
    pagination.appendChild(prevBtn);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
    pageItem.innerHTML = `<a class="page-link" href="#" onclick="fetchArchives(${i})">${i}</a>`;
    pagination.appendChild(pageItem);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("li");
    nextBtn.className = "page-item";
    nextBtn.innerHTML = `<a class="page-link" href="#" onclick="fetchArchives(${nextPage})">Suivant</a>`;
    pagination.appendChild(nextBtn);
  }
}

// Appeler fetchArchives au chargement initial de la page
fetchArchives(currentPage);
