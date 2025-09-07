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

      const modalElement = document.getElementById("employeeSuccessModal");
      modalElement.addEventListener("hidden.bs.modal", () => {
        window.location.reload();
      });
    })
    .catch((error) => {
      console.error(error);
      afficherErreurModalBodyEspaceAdmin(
        "Une erreur est survenue lors de la création de l'employé. Veuillez réessayer."
      );
    });
}

//Afficher le nombre de crédits de l'admin
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
  .catch((error) => {
    console.error(error);
    afficherErreurModalBodyEspaceAdmin(
      "Une erreur est survenue lors de la récupération des crédits. Veuillez réessayer."
    );
  });

// récupération et pré‑calcul
async function fetchTrajetStats() {
  const token = getCookie(tokenCookieName);
  const response = await fetch(apiUrl + "trajet/admin/trajets", {
    headers: { "X-AUTH-TOKEN": token },
  });

  if (!response.ok) throw new Error("API trajets");

  const data = await response.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // dates passées
  const past = {};
  // today + J+1 + J+2
  const present = {};
  // >= J+3
  const future = {};

  data.items.forEach((t) => {
    const [d, m, y] = t.dateDepart.split("-");
    const dateObj = new Date(+y, m - 1, +d);
    const dateStr = t.dateDepart;
    // Chaque trajet terminé rapporte 2 crédits à la plateforme
    const cred = 2;

    // écart en jours
    const diffJ = Math.floor((dateObj - today) / 86400000);

    const bucket = diffJ < 0 ? past : diffJ <= 2 ? present : future;

    bucket[dateStr] = bucket[dateStr] || { nb: 0, cred: 0 };
    bucket[dateStr].nb += 1;
    bucket[dateStr].cred += cred;
  });

  const makeArrays = (bucket) => {
    const ordered = Object.keys(bucket).sort((a, b) => {
      const [da, ma, ya] = a.split("-"),
        [db, mb, yb] = b.split("-");
      return new Date(+ya, ma - 1, +da) - new Date(+yb, mb - 1, +db);
    });
    return {
      labels: ordered,
      nb: ordered.map((d) => bucket[d].nb),
      cred: ordered.map((d) => bucket[d].cred),
    };
  };

  return [makeArrays(past), makeArrays(present), makeArrays(future)];
}

// navigation / affichage
// recevra les 3 blocs
let ranges = [];
// 0=past 1=present 2=future
let idxRange = 1;

const ctxT = document.getElementById("graphCovoiturages").getContext("2d");
const ctxC = document.getElementById("graphCredits").getContext("2d");
const lbl = document.getElementById("rangeLabel");

function renderCurrentGraphs() {
  const bloc = ranges[idxRange];
  const titres = ["Trajets passés", "Aujourd’hui + 2 jours", "Trajets futurs"];
  lbl.textContent = titres[idxRange];

  drawBarGraph(ctxT, bloc.labels, bloc.nb, "#0d6efd");
  drawBarGraph(ctxC, bloc.labels, bloc.cred, "#198754");
}

document.getElementById("prevRange").addEventListener("click", () => {
  idxRange = (idxRange + 2) % 3;
  renderCurrentGraphs();
});

document.getElementById("nextRange").addEventListener("click", () => {
  idxRange = (idxRange + 1) % 3;
  renderCurrentGraphs();
});

//initialisation des graphiques
fetchTrajetStats()
  .then((result) => {
    ranges = result;
    renderCurrentGraphs();
  })
  .catch(console.error);

function drawBarGraph(ctx, labels, data, barColor = "#0d6efd") {
  const w = ctx.canvas.width,
    h = ctx.canvas.height,
    pad = 40;
  const maxVal = Math.max(...data, 1);
  const barW = (w - pad * 2) / data.length - 10;

  ctx.clearRect(0, 0, w, h);
  ctx.font = "12px Arial";
  ctx.textAlign = "center";

  data.forEach((val, i) => {
    const x = pad + i * (barW + 10);
    const barH = (val / maxVal) * (h - pad * 2);
    const y = h - pad - barH;

    ctx.fillStyle = barColor;
    ctx.fillRect(x, y, barW, barH);

    ctx.fillStyle = "#000";
    ctx.fillText(labels[i], x + barW / 2, h - 10);
    ctx.fillText(val, x + barW / 2, y - 5);
  });
}

function afficherErreurModalBodyEspaceAdmin(message) {
  const errorModalBody = document.getElementById("errorModalBodyEspaceAdmin");
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}
