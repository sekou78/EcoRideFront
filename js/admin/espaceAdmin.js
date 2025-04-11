const inputInscriptionEmployeeNom = document.getElementById(
  "nomInscriptionEmployeeInput"
);
const inputInscriptionEmployeePrenom = document.getElementById(
  "prenomInscriptionEmployeeInput"
);
const inputInscriptionEmployeeDateNaissance = document.getElementById(
  "dateNaissanceInscriptionEmployeeInput"
);
const inputInscriptionEmployeePseudo = document.getElementById(
  "pseudoInscriptionEmployeeInput"
);
const inputInscriptionEmployeeRole = document.getElementById(
  "roleInscriptionEmployeeInput"
);
const inputInscriptionEmployeeEmail = document.getElementById(
  "emailInscriptionEmployeeInput"
);
const inputInscriptionEmployeePassword = document.getElementById(
  "PasswordInscriptionEmployeeInput"
);
const btnValidationInscriptionEmployee = document.getElementById(
  "btn-creation-employe"
);

inputInscriptionEmployeeNom.addEventListener(
  "keyup",
  validateInscriptionEmployeeForm
);
inputInscriptionEmployeePrenom.addEventListener(
  "keyup",
  validateInscriptionEmployeeForm
);
inputInscriptionEmployeeDateNaissance.addEventListener("change", validDate);
inputInscriptionEmployeePseudo.addEventListener(
  "keyup",
  validateInscriptionEmployeeForm
);
inputInscriptionEmployeeRole.addEventListener(
  "keyup",
  validateInscriptionEmployeeForm
);
inputInscriptionEmployeeEmail.addEventListener(
  "keyup",
  validateInscriptionEmployeeForm
);
inputInscriptionEmployeePassword.addEventListener(
  "keyup",
  validateInscriptionEmployeeForm
);
btnValidationInscriptionEmployee.addEventListener(
  "click",
  validateInscriptionEmployee
);
btnValidationInscriptionEmployee.disabled = true;

function validateInscriptionEmployeeForm() {
  const nomEmployeeOk = validateInscriptionEmployeeRequired(
    inputInscriptionEmployeeNom
  );
  const prenomEmployeeOk = validateInscriptionEmployeeRequired(
    inputInscriptionEmployeePrenom
  );
  const dateNaissanceEmployeeOk = validDate(
    inputInscriptionEmployeeDateNaissance
  );
  const pseudoEmployeeOk = validateInscriptionEmployeeRequired(
    inputInscriptionEmployeePseudo
  );
  const roleEmployeeOk = validateInscriptionEmployeeRequired(
    inputInscriptionEmployeeRole
  );
  const emailEmployeeOk = validateMailInscriptionEmployee(
    inputInscriptionEmployeeEmail
  );
  const passwordEmployeeOk = validatePasswordInscriptionEmployee(
    inputInscriptionEmployeePassword
  );
  if (
    nomEmployeeOk &&
    prenomEmployeeOk &&
    dateNaissanceEmployeeOk &&
    pseudoEmployeeOk &&
    roleEmployeeOk &&
    emailEmployeeOk &&
    passwordEmployeeOk
  ) {
    btnValidationInscriptionEmployee.disabled = false;
  } else {
    btnValidationInscriptionEmployee.disabled = true;
  }
}

//Demande de remplissage du champs requis
function validateInscriptionEmployeeRequired(input) {
  if (input.value.trim() != "") {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

//Demande de remplissage du champs au bon format email requis
function validateMailInscriptionEmployee(input) {
  //definir le regex du champs mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mailUser = input.value;
  if (mailUser.match(emailRegex)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

//Demande de remplissage du champs au bon format password
//(minimum 8 caractères composées des lettres, des chiffres et
//des symboles dont une lettre en majuscule) requis
function validatePasswordInscriptionEmployee(input) {
  //definir le regex du champs password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  const passwordUser = input.value;
  if (passwordUser.match(passwordRegex)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

//Validation de la date de naissance de l'employé
function validDate(input) {
  //Regex pour valider les dates au format jj/mm/aaaa
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const dateUser = input.value.trim();

  if (dateRegex.test(dateUser)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Fonction principale : Enregistrer l'inscription
function validateInscriptionEmployee() {
  //Ici, il faudra appeler l'Api pour verifier l'authentification en BDD
  const newEmployee = {
    nomEmployee: inputInscriptionEmployeeNom.value,
    prenomEmployee: inputInscriptionEmployeePrenom.value,
    dateNaissanceEmployee: inputInscriptionEmployeeDateNaissance.value,
    pseudoEmployee: inputInscriptionEmployeePseudo.value,
    roleEmployee: inputInscriptionEmployeeRole.value,
    emailEmployee: inputInscriptionEmployeeEmail.value,
    passwordEmployee: inputInscriptionEmployeePassword.value,
  };

  // Récupère la liste actuelle des employés
  const allEmployees = JSON.parse(localStorage.getItem("employes")) || [];

  // Vérifie si l'email est déjà utilisé
  const emailExists = allEmployees.some(
    (employee) => employee.emailEmployee === newEmployee.emailEmployee
  );
  if (emailExists) {
    alert("Cet email est déjà utilisé pour un autre employé.");
    return;
  }

  // Ajoute le nouvel employé au tableau
  allEmployees.push(newEmployee);

  // Réenregistre le tableau complet dans le localStorage
  localStorage.setItem("employes", JSON.stringify(allEmployees));

  alert("Inscription réussie d'un employée.");
  window.location.reload();
}

//Simulation des données (remplace-les avec ton vrai localStorage si nécessaire)
if (!localStorage.getItem("covoiturages")) {
  localStorage.setItem(
    "covoiturages",
    JSON.stringify([
      { date: "2025-04-03", credits: 10 },
      { date: "2025-04-03", credits: 15 },
      { date: "2025-04-04", credits: 20 },
      { date: "2025-04-05", credits: 5 },
    ])
  );
}

const covoiturages = JSON.parse(localStorage.getItem("covoiturages")) || [];

// Regrouper les données par jour
const statsParJour = {};
covoiturages.forEach((covoit) => {
  if (!statsParJour[covoit.date]) {
    statsParJour[covoit.date] = { nb: 0, credits: 0 };
  }
  statsParJour[covoit.date].nb++;
  statsParJour[covoit.date].credits += covoit.credits;
});

const dates = Object.keys(statsParJour);
const nbCovoits = dates.map((date) => statsParJour[date].nb);
const credits = dates.map((date) => statsParJour[date].credits);

// Fonction générique pour dessiner un bar graph
function drawBarGraph(ctx, labels, data, barColor = "#0d6efd") {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const maxVal = Math.max(...data);
  const padding = 40;
  const barWidth = (width - padding * 2) / data.length - 10;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";

  data.forEach((val, i) => {
    const x = padding + i * (barWidth + 10);
    const barHeight = (val / maxVal) * (height - padding * 2);
    const y = height - padding - barHeight;

    ctx.fillStyle = barColor;
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#000";
    ctx.fillText(labels[i], x + barWidth / 2, height - 10);
    ctx.fillText(val, x + barWidth / 2, y - 5);
  });
}

const ctxCovoit = document.getElementById("graphCovoiturages").getContext("2d");
const ctxCredits = document.getElementById("graphCredits").getContext("2d");

drawBarGraph(ctxCovoit, dates, nbCovoits, "#0d6efd");
drawBarGraph(ctxCredits, dates, credits, "#198754");
