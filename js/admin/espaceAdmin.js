const formCreationEmployee = document.getElementById("form-creation-employe");
const inputInscriptionEmployeeNom = document.getElementById(
  "nomInscriptionEmployeeInput"
);
const inputInscriptionEmployeePrenom = document.getElementById(
  "prenomInscriptionEmployeeInput"
);
const inputInscriptionEmployeeAdresse = document.getElementById(
  "adresseInscriptionEmployeeInput"
);
const inputInscriptionEmployeeTelephone = document.getElementById(
  "telephoneInscriptionEmployeeInput"
);
const inputInscriptionEmployeeDateNaissance = document.getElementById(
  "dateNaissanceInscriptionEmployeeInput"
);
const inputInscriptionEmployeePseudo = document.getElementById(
  "pseudoInscriptionEmployeeInput"
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
const checkBoxAdminValidPasswordEmployee = document.getElementById(
  "checkAdminValidEmployeePassword"
);
const creditAdminTotal = document.getElementById("totalAdminCredits");

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
checkBoxAdminValidPasswordEmployee.addEventListener(
  "click",
  showPasswordAdminValidEmployee
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
  const adresseEmployeeOk = validateInscriptionEmployeeRequired(
    inputInscriptionEmployeeAdresse
  );
  const telephoneEmployeeOk = validInscriptionTelephone(
    inputInscriptionEmployeeTelephone
  );
  const dateNaissanceEmployeeOk = validDate(
    inputInscriptionEmployeeDateNaissance
  );
  const pseudoEmployeeOk = validateInscriptionEmployeeRequired(
    inputInscriptionEmployeePseudo
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
    adresseEmployeeOk &&
    telephoneEmployeeOk &&
    dateNaissanceEmployeeOk &&
    pseudoEmployeeOk &&
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

//Montrer le mot de passe ou masquer le mot de passe
function showPasswordAdminValidEmployee() {
  if (inputInscriptionEmployeePassword.type === "password") {
    inputInscriptionEmployeePassword.type = "text";
  } else {
    inputInscriptionEmployeePassword.type = "password";
  }
}

//Validation de la date de naissance de l'employé
function validDate(inputOrEvent) {
  //Regex pour valider les dates au format jj/mm/aaaa
  const input = inputOrEvent?.target ?? inputOrEvent;

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

//Demande de remplissage du champs au bon format requis
function validInscriptionTelephone(input) {
  // Regex pour les numéros français (06XXXXXXXX ou +33 6XXXXXXXX)
  const telephoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;

  // Supprime les espaces et récupère le numéro brut
  let telephoneUser = input.value.replace(/\s+/g, "");

  // Vérification du format
  if (telephoneRegex.test(telephoneUser)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");

    // Ajoute automatiquement les espaces tous les 2 chiffres
    input.value = telephoneUser
      .replace(
        /^(\+33|0)([1-9])(\d{2})(\d{2})(\d{2})(\d{2})$/,
        "$1 $2 $3 $4 $5 $6"
      )
      .trim();

    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Fonction principale : Enregistrer l'inscription
function validateInscriptionEmployee() {
  const token = getCookie(tokenCookieName);

  const dataForm = new FormData(formCreationEmployee);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-AUTH-TOKEN", token);

  const raw = JSON.stringify({
    email: dataForm.get("email_inscription_employee_input"),
    password: dataForm.get("pwd_inscription_employee_input"),
    nom: dataForm.get("nom_inscription_employee_input"),
    prenom: dataForm.get("prenom_inscription_employee_input"),
    telephone: dataForm.get("telephone_inscription_employee_input"),
    adresse: dataForm.get("adresse_inscription_employee_input"),
    dateNaissance: dataForm.get("date_naissance_inscription_employee_input"),
    pseudo: dataForm.get("pseudo_inscription_employee_input"),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl + "admin/create-user", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // Affiche la modal Bootstrap
      const modal = new bootstrap.Modal(
        document.getElementById("employeeSuccessModal")
      );
      modal.show();

      // Optionnel : recharge après fermeture
      const modalElement = document.getElementById("employeeSuccessModal");
      modalElement.addEventListener("hidden.bs.modal", () => {
        window.location.reload();
      });
    })
    .catch((error) => console.error(error));
}

const token = getCookie(tokenCookieName);

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch(apiUrl + "account/me", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    creditAdminTotal.textContent = result.user.credits;
  })
  .catch((error) => console.error(error));

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
