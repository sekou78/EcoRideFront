// Données simulées pour test
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

if (!localStorage.getItem("comptes")) {
  localStorage.setItem(
    "comptes",
    JSON.stringify([
      { pseudo: "Alice", role: "employe", actif: true },
      { pseudo: "Bob", role: "utilisateur", actif: true },
    ])
  );
}

// Récupérer les données
const covoiturages = JSON.parse(localStorage.getItem("covoiturages")) || [];
const comptes = JSON.parse(localStorage.getItem("comptes")) || [];

// ----------- Comptes employés ------------
const comptesContainer = document.getElementById("comptes-container");
comptes.forEach((compte, index) => {
  const div = document.createElement("div");
  div.innerHTML = `
        <span class="${compte.actif ? "" : "suspended"}">${compte.pseudo} (${
    compte.role
  })</span>
        <button onclick="suspendreCompte(${index})">
          ${compte.actif ? "Suspendre" : "Réactiver"}
        </button>
      `;
  comptesContainer.appendChild(div);
});

// ----------- Covoiturages & Crédits par jour ------------
const statsParJour = {};

covoiturages.forEach((covoit) => {
  if (!statsParJour[covoit.date]) {
    statsParJour[covoit.date] = { nb: 0, credits: 0 };
  }
  statsParJour[covoit.date].nb++;
  statsParJour[covoit.date].credits += covoit.credits;
});

let totalCredits = 0;
const covoiturageChart = document.getElementById("covoiturage-chart");
const creditChart = document.getElementById("credit-chart");

for (const date in statsParJour) {
  const nb = statsParJour[date].nb;
  const credits = statsParJour[date].credits;
  totalCredits += credits;

  // Covoiturage bar
  const barCovoit = document.createElement("div");
  barCovoit.className = "bar";
  barCovoit.style.width = `${nb * 30}px`;
  barCovoit.textContent = `${date}: ${nb}`;
  covoiturageChart.appendChild(barCovoit);

  // Credit bar
  const barCredit = document.createElement("div");
  barCredit.className = "bar bar-credit";
  barCredit.style.width = `${credits * 5}px`;
  barCredit.textContent = `${date}: ${credits} crédits`;
  creditChart.appendChild(barCredit);
}

document.getElementById("total-credits").textContent = totalCredits;

// ----------- Suspension ----------------
function suspendreCompte(index) {
  comptes[index].actif = !comptes[index].actif;
  localStorage.setItem("comptes", JSON.stringify(comptes));
  location.reload();
}
