// Variables globales
let employes = [];
let deleteIndexPending = null;
let currentPage =
  parseInt(new URL(window.location).searchParams.get("page")) || 1;
let totalPages = 1;

const tbody = document.getElementById("listesEmployees");
const pager = document.getElementById("pager");

const deleteModalEl = document.getElementById("confirmDeleteModal");
const deleteModal = new bootstrap.Modal(deleteModalEl);
const deleteConfirmBtn = document.getElementById("modal-confirm-btn");

// Appel initial
chargerEmployes(currentPage);

// Fonction principale pour charger les employes d’une page
async function chargerEmployes(page = 1) {
  const token = getCookie(tokenCookieName);

  try {
    const response = await fetch(`${apiUrl}gestion/employes?page=${page}`, {
      headers: { "X-AUTH-TOKEN": token },
    });

    if (!response.ok) {
      afficherErreurModalBodyGestionAdminEmployee("Erreur de chargement");
      return;
    }

    const savedY = sessionStorage.getItem("scrollY");
    if (savedY !== null) {
      window.scrollTo(0, parseInt(savedY));
      sessionStorage.removeItem("scrollY");
    }

    const data = await response.json();
    employes = data.items;

    // ⚠️ Si la page est vide, on retourne à la page précédente
    if (employes.length === 0 && page > 1) {
      return chargerEmployes(page - 1);
    }

    currentPage = data.page || page;
    updateUrlPageParam(currentPage);
    totalPages = data.totalPages || 1;

    afficherEmployes();
    construirePager(totalPages);
  } catch (error) {
    console.error(error);
    afficherErreurModalBodyGestionAdminEmployee(
      (tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Erreur lors du chargement</td></tr>`)
    );
  }
}

// Fonction d’affichage (ton code existant légèrement adapté)
function afficherEmployes() {
  tbody.innerHTML = "";

  if (!employes || employes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">Aucun employe trouvé.</td></tr>`;
    return;
  }

  employes.forEach((employe, index) => {
    const { compteSuspendu } = employe;

    const btnLabel = compteSuspendu ? "☀️ Réactiver" : "🌙 Suspendre";
    const btnClass = compteSuspendu ? "reactiver-btn" : "suspendre-btn";
    const btnStyle = compteSuspendu
      ? "background-color:#cce5ff; color:#004085;"
      : "background-color:#ffecb3; color:#6b4c00;";

    const row = document.createElement("tr");
    const borderColor = employe.compteSuspendu ? "#d9534f" : "#5cb85c";

    row.innerHTML = `
      <td colspan="4">
        <div class="d-flex justify-content-center">
          <div class="card mb-3 shadow-sm" style="background-color:#f0f9f0;border-left:6px solid ${borderColor}; max-width:800px;width:100%;">
            <div class="row align-items-center p-3">
              <div class="col-md-4 text-center text-md-start">
                <p class="mb-1">👤 <strong>${
                  employe.pseudo || "Nom inconnu"
                }</strong></p>
                <p class="mb-1">📧 ${employe.email || "Email non fourni"}</p>
              </div>
              <div class="col-md-3 text-center">
                <p class="mb-1">🎖️ <strong>${
                  (employe.roles && employe.roles[0]) || "Rôle inconnu"
                }</strong></p>
              </div>
              <div class="col-md-5 text-center text-md-end">
                <button class="btn btn-sm me-2 ${btnClass}" style="${btnStyle} font-size:0.8rem;" data-index="${index}">
                  ${btnLabel}
                </button>
                <button class="btn btn-sm supprimer-btn" style="background-color:#ffd6d6; color:#9b1c1c; font-size:0.8rem;" data-index="${index}">
                  ❌ Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Ajout des événements aux boutons

  tbody.querySelectorAll(".suspendre-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = +btn.dataset.index;
      suspendre(index).then(() => switchToReactiver(btn, index));
    });
  });

  tbody.querySelectorAll(".reactiver-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = +btn.dataset.index;
      reactiver(index).then(() => switchToSuspendre(btn, index));
    });
  });

  tbody.querySelectorAll(".supprimer-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteIndexPending = +btn.dataset.index;
      document.getElementById("modal-emp-name").textContent =
        employes[deleteIndexPending].pseudo || "cet employe";
      deleteModal.show();
    });
  });
}

// Fonction qui construit le pager sous la liste
function construirePager(totalPages) {
  pager.innerHTML = "";

  // Précédent
  const prev = document.createElement("button");
  prev.textContent = "«";
  prev.disabled = currentPage === 1;
  prev.className = "btn btn-sm bg-dark text-black";
  prev.addEventListener("click", () => {
    if (currentPage > 1) chargerEmployes(currentPage - 1);
  });
  pager.appendChild(prev);

  // Boutons page
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;
    btn.className = "btn btn-sm bg-dark text-black m-1";
    btn.addEventListener("click", () => {
      if (i !== currentPage) chargerEmployes(i);
    });
    pager.appendChild(btn);
  }

  // Suivant
  const next = document.createElement("button");
  next.textContent = "»";
  next.disabled = currentPage === totalPages;
  next.className = "btn btn-sm bg-dark text-black";
  next.addEventListener("click", () => {
    if (currentPage < totalPages) chargerEmployes(currentPage + 1);
  });
  pager.appendChild(next);
}

// Fonction pour suspendre un employe
async function suspendre(index) {
  const token = getCookie(tokenCookieName);
  const id = employes[index].id;

  try {
    const response = await fetch(
      apiUrl + `admin/droitSuspensionComptes/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token,
        },
      }
    );
    if (!response.ok) throw new Error("Erreur suspension");

    employes[index].compteSuspendu = true;
    window.location.reload();
  } catch (error) {
    console.error(error);
    afficherErreurModalBodyGestionAdminEmployee(
      "La suspension du compte a échoué."
    );
  }
}

// Fonction pour réactiver un employe
async function reactiver(index) {
  const token = getCookie(tokenCookieName);
  const id = employes[index].id;

  try {
    const response = await fetch(apiUrl + `droitsReactiverComptes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token,
      },
    });

    if (!response.ok) throw new Error("Erreur réactivation");

    employes[index].compteSuspendu = false;
    window.location.reload();
  } catch (error) {
    console.error(error);
    afficherErreurModalBodyGestionAdminEmployee(
      "La réactivation du compte a échoué."
    );
  }
}

// Fonction pour supprimer un employe (appelée par la modale)
async function supprimer(index) {
  const token = getCookie(tokenCookieName);
  const id = employes[index].id;

  const response = await fetch(apiUrl + `deleteAccount/${id}`, {
    method: "DELETE",
    headers: { "X-AUTH-TOKEN": token },
  });

  if (!response.ok) {
    afficherErreurModalBodyGestionAdminEmployee(
      "Erreur lors de la suppression."
    );
    return;
  }

  afficherErreurModalBodyGestionAdminEmployee(
    "Employés supprimé avec succès !"
  );
  window.location.reload(); // recharge la page
  afficherEmployes(); // recharge la liste
}

// Bouton de confirmation (depuis modale)
deleteConfirmBtn.addEventListener("click", async () => {
  if (deleteIndexPending === null) return;
  deleteConfirmBtn.disabled = true;
  await supprimer(deleteIndexPending);
  deleteConfirmBtn.disabled = false;
  deleteModal.hide();
  deleteIndexPending = null;
});

// Fonction pour changer un bouton en "Réactiver"
function switchToReactiver(button, index) {
  button.classList.remove("suspendre-btn");
  button.classList.add("reactiver-btn");
  button.style.backgroundColor = "#cce5ff";
  button.style.color = "#004085";
  button.textContent = "☀️ Réactiver";

  const newBtn = button.cloneNode(true);
  button.replaceWith(newBtn);
  newBtn.addEventListener("click", () => {
    reactiver(index).then(() => switchToSuspendre(newBtn, index));
  });
}

// Fonction pour changer un bouton en "Suspendre"
function switchToSuspendre(button, index) {
  button.classList.remove("reactiver-btn");
  button.classList.add("suspendre-btn");
  button.style.backgroundColor = "#ffecb3";
  button.style.color = "#6b4c00";
  button.textContent = "🌙 Suspendre";

  const newBtn = button.cloneNode(true);
  button.replaceWith(newBtn);
  newBtn.addEventListener("click", () => {
    suspendre(index).then(() => switchToReactiver(newBtn, index));
  });
}

function updateUrlPageParam(page) {
  const url = new URL(window.location);
  url.searchParams.set("page", page);
  window.history.replaceState({}, "", url);
}

function afficherErreurModalBodyGestionAdminEmployee(message) {
  const errorModalBody = document.getElementById(
    "errorModalBodyGestionAdminEmployee"
  );
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}
