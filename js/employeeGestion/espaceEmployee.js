const employeePseudo = document.getElementById("employee-pseudo-display");
const employeeValidAvisPassagerPseudo = document.getElementById(
  "employee-valid-avis-passager-pseudo-display"
);
const employeeValidAvis = document.getElementById(
  "employee-valid-avis-passager"
);
const btnEmployeeValidAvis = document.getElementById("btn-employee-valid");
const btnEmployeeRefuseAvis = document.getElementById("btn-employee-refuse");

btnEmployeeValidAvis.addEventListener("click", validerAvis);
btnEmployeeRefuseAvis.addEventListener("click", refuserAvis);

// Récupérer les données du localStorage
const avisPassager = localStorage.getItem("commentaires");

// Afficher les informations dans les éléments HTML
if (avisPassager) {
  const avisPassagerJson = JSON.parse(avisPassager);

  if (avisPassagerJson) {
    employeeValidAvisPassagerPseudo.textContent = avisPassagerJson.pseudo;

    employeeValidAvis.textContent = avisPassagerJson.commentaire;
  }
}

function validerAvis(event) {
  const button = event.target;
  const container = button.closest(".mb-3");
  if (container) {
    container.remove();
    alert("Avis validé !");
  }
}

function refuserAvis(event) {
  const button = event.target;
  const container = button.closest(".mb-3");
  if (container) {
    container.remove();
    alert("Avis refusé !");
  }
}
