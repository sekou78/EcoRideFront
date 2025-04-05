const employeePseudo = document.getElementById("employee-pseudo-display");
const employeeValidAvisPassagerPseudo1 = document.getElementById(
  "employee-valid-avis-passager-pseudo-display1"
);
const employeeValidAvisPassagerPseudo2 = document.getElementById(
  "employee-valid-avis-passager-pseudo-display2"
);
const employeeValidAvis1 = document.getElementById(
  "employee-valid-avis-passager1"
);
const employeeValidAvis2 = document.getElementById(
  "employee-valid-avis-passager2"
);
const btnEmployeeValidAvis1 = document.getElementById("btn-employee-valid1");
const btnEmployeeRefuseAvis1 = document.getElementById("btn-employee-refuse1");
const btnEmployeeValidAvis2 = document.getElementById("btn-employee-valid2");
const btnEmployeeRefuseAvis2 = document.getElementById("btn-employee-refuse2");

btnEmployeeValidAvis1.addEventListener("click", validerAvis);
btnEmployeeRefuseAvis1.addEventListener("click", refuserAvis);

// Récupérer les données du localStorage
const avisPassager = localStorage.getItem("commentaires");

// Afficher les informations dans les éléments HTML
if (avisPassager) {
  const avisPassagerJson = JSON.parse(avisPassager);

  if (avisPassagerJson) {
    employeeValidAvisPassagerPseudo1.textContent = avisPassagerJson.pseudo;

    employeeValidAvis1.textContent = avisPassagerJson.commentaire;
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
