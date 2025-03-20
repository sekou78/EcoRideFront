// // Sélection des éléments
// const role = document.getElementById("role");
// const changeRole = document.getElementById("role-display");

// // Écouteur d'événements sur le changement de rôle
// role.addEventListener("change", updateRole);

// // Fonction pour mettre à jour le rôle dynamiquement
// function updateRole() {
//   const selectedRole = role.value;
//   changeRole.innerText = selectedRole;
// }

// // Initialiser le rôle au chargement de la page
// window.onload = updateRole;

// Exécuter le script après le chargement complet de la page
document.addEventListener("DOMContentLoaded", function () {
  // Sélection des éléments
  const role = document.getElementById("role");
  const changeRole = document.getElementById("role-display");

  // Fonction pour mettre à jour le rôle
  function updateRole() {
    changeRole.textContent = role.value;
  }

  // Écouteur sur le changement de rôle
  role.addEventListener("change", updateRole);

  // Mettre à jour le rôle au chargement initial
  updateRole();
});
