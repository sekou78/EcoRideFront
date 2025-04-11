afficherEmployes();

function afficherEmployes() {
  const tbody = document.getElementById("listesEmployees");
  tbody.innerHTML = ""; // On vide la table

  const employes = JSON.parse(localStorage.getItem("employes")) || [];

  // S'assurer que chaque employé a une propriété "suspendu"
  employes.forEach((employe) => {
    if (typeof employe.suspendu === "undefined") {
      employe.suspendu = false;
    }
  });

  // Réenregistrer les employés avec la propriété "suspendu"
  localStorage.setItem("employes", JSON.stringify(employes));

  if (employes.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4" class="text-center">Aucun employé trouvé.</td>`;
    tbody.appendChild(row);
    return;
  }

  employes.forEach((employe, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${employe.pseudoEmployee}</td>
      <td>${employe.emailEmployee}</td>
      <td>${employe.roleEmployee || "Non spécifié"}</td>
      <td class="text-center row row-cols-lg-1">
        <button class="btn btn-sm text-primary mb-2 ${
          employe.suspendu
            ? "bg-success border-success"
            : "bg-warning border-warning"
        }" style="font-size: 0.70rem;" onclick="toggleSuspendre(${index})">
          ${employe.suspendu ? "Activer" : "Suspendre"}
        </button>
        <button class="btn btn-sm text-primary bg-danger border-danger"     style="font-size: 0.70rem;" onclick="supprimerEmploye(${index})">
          Supprimer
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Fonction pour suspendre / activer un employé
function toggleSuspendre(index) {
  const employes = JSON.parse(localStorage.getItem("employes")) || [];
  employes[index].suspendu = !employes[index].suspendu;
  localStorage.setItem("employes", JSON.stringify(employes));
  afficherEmployes(); // Recharger l'affichage
}

// Fonction pour supprimer un employé
function supprimerEmploye(index) {
  if (confirm("Voulez-vous vraiment supprimer cet employé ?")) {
    const employes = JSON.parse(localStorage.getItem("employes")) || [];
    employes.splice(index, 1);
    localStorage.setItem("employes", JSON.stringify(employes));
    afficherEmployes(); // Recharger l'affichage
  }
}
