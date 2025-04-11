afficherUtilisateur();

function afficherUtilisateur() {
  const tbody = document.getElementById("listesUtilisateurs");
  tbody.innerHTML = ""; // Réinitialiser le contenu de la table

  const utilisateurs = JSON.parse(localStorage.getItem("userAppli")) || [];

  if (utilisateurs.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3" class="text-center">Aucun utilisateur trouvé.</td>`;
    tbody.appendChild(row);
    return;
  }

  utilisateurs.forEach((utilisateur, index) => {
    // Vérifier si "suspendu" est défini, sinon définir à false
    if (typeof utilisateur.suspendu === "undefined") {
      utilisateur.suspendu = false;
    }

    // Créer une nouvelle ligne pour chaque utilisateur
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${utilisateur.pseudo || "N/A"}</td>
        <td>${utilisateur.email || "N/A"}</td>
        <td class="text-center row row-cols-lg-1">
          <button class="btn btn-sm text-primary mb-2 ${
            utilisateur.suspendu
              ? "bg-success border-success"
              : "bg-warning border-warning"
          }" style="font-size: 0.70rem;" onclick="toggleSuspendre(${index})">
            ${utilisateur.suspendu ? "Activer" : "Suspendre"}
          </button>
          <button class="btn btn-sm text-primary bg-danger border-danger" style="font-size: 0.70rem;" onclick="supprimerUtilisateur(${index})">
            Supprimer
          </button>
        </td>
      `;

    tbody.appendChild(row);
  });
}

// Fonction pour suspendre / activer un utilisateur
function toggleSuspendre(index) {
  const utilisateurs = JSON.parse(localStorage.getItem("userAppli")) || [];
  utilisateurs[index].suspendu = !utilisateurs[index].suspendu;
  localStorage.setItem("userAppli", JSON.stringify(utilisateurs));
  afficherUtilisateur(); // Recharger l'affichage après modification
}

// Fonction pour supprimer un utilisateur
function supprimerUtilisateur(index) {
  if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
    const utilisateurs = JSON.parse(localStorage.getItem("userAppli")) || [];
    utilisateurs.splice(index, 1);
    localStorage.setItem("userAppli", JSON.stringify(utilisateurs));
    afficherUtilisateur(); // Recharger l'affichage après suppression
  }
}
