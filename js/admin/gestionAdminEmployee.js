// Appel de la fonction pour afficher les employés
afficherEmployes();

// Fonction pour afficher la liste des employés
function afficherEmployes() {
  const tbody = document.getElementById("listesEmployees");
  tbody.innerHTML = ""; // On vide la table

  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(apiUrl + "gestion/employes", requestOptions)
    .then((response) => {
      if (!response.ok)
        throw new Error("Erreur lors du chargement des employés.");
      return response.json();
    })
    .then((data) => {
      employes = Object.values(data); // on garde la liste en mémoire globale
      console.log("Employés chargés :", employes);

      if (!employes || employes.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="4" class="text-center">Aucun employé trouvé.</td>`;
        tbody.appendChild(row);
        return;
      }

      // Afficher les lignes
      employes.forEach((employe, index) => {
        const { compteSuspendu } = employe;

        const btnLabel = compteSuspendu ? "☀️ Réactiver" : "🌙 Suspendre";
        const btnClass = compteSuspendu ? "reactiver-btn" : "suspendre-btn";
        const btnStyle = compteSuspendu
          ? "background-color:#cce5ff; color:#004085;" // bleu clair
          : "background-color:#ffecb3; color:#6b4c00;"; // jaune

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
                    <p class="mb-1">📧 ${
                      employe.email || "Email non fourni"
                    }</p>
                  </div>
                  <div class="col-md-3 text-center">
                    <p class="mb-1">🎖️ <strong>${
                      (employe.roles && employe.roles[0]) || "Rôle inconnu"
                    }</strong></p>
                  </div>
                  <div class="col-md-5 text-center text-md-end">
                    <button class="btn btn-sm me-2 ${btnClass}" style="${btnStyle} font-size:0.8rem;"data-index="${index}">
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

      // Boutons suspendre
      tbody.querySelectorAll(".suspendre-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = +btn.dataset.index;
          suspendre(index).then(() => switchToReactiver(btn, index));
        });
      });

      // Boutons réactiver
      tbody.querySelectorAll(".reactiver-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = +btn.dataset.index;
          reactiver(index).then(() => switchToSuspendre(btn, index));
        });
      });

      // Boutons supprimer
      tbody.querySelectorAll(".supprimer-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          deleteIndexPending = +btn.dataset.index; // stocke l’index
          document.getElementById("modal-emp-name").textContent =
            employes[deleteIndexPending].pseudo || "cet employé";
          deleteModal.show(); // ouvre la modale
        });
      });
    })
    .catch((error) => {
      console.error(error);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="4" class="text-center text-danger">
          Erreur lors du chargement
        </td>
      `;
      tbody.appendChild(row);
    });
}

// Fonction pour suspendre un employé
async function suspendre(index) {
  const token = getCookie(tokenCookieName);
  const id = employes[index].id;

  const response = await fetch(apiUrl + `admin/droitSuspensionComptes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": token,
    },
  });
  if (!response.ok) throw new Error("Erreur suspension");

  employes[index].compteSuspendu = true;
  window.location.reload();
}

// Fonction pour réactiver un employé
async function reactiver(index) {
  const token = getCookie(tokenCookieName);
  const id = employes[index].id;

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
}

// Variables globales
let employes = [];
let deleteIndexPending = null;
const deleteModalEl = document.getElementById("confirmDeleteModal");
const deleteModal = new bootstrap.Modal(deleteModalEl);
const deleteConfirmBtn = document.getElementById("modal-confirm-btn");

// Fonction pour supprimer un employé (appelée par la modale)
async function supprimer(index) {
  const token = getCookie(tokenCookieName);
  const id = employes[index].id;

  const response = await fetch(apiUrl + `gestion/employes/${id}`, {
    method: "DELETE",
    headers: { "X-AUTH-TOKEN": token },
  });

  if (!response.ok) {
    alert("Erreur lors de la suppression.");
    return;
  }

  alert("Employé supprimé avec succès !");
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
