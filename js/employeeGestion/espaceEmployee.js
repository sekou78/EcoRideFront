const avisContainer = document.getElementById("avis-container");
const covoituragesContainer = document.getElementById(
  "covoiturages-problemes-container"
);

// Ajouter les événements sur les boutons dynamiquement
avisContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-valid")) {
    validerAvis(event);
  } else if (event.target.classList.contains("btn-refuse")) {
    refuserAvis(event);
  }
});

//Récupération depuis localStorage des avis
let avisPassagers = [];

try {
  const avisFromStorage = JSON.parse(localStorage.getItem("commentaires"));
  if (Array.isArray(avisFromStorage)) {
    avisPassagers = avisFromStorage;
  } else if (avisFromStorage) {
    avisPassagers = [avisFromStorage];
  }
} catch (e) {
  console.warn("Erreur de parsing JSON des avis :", e);
}

avisPassagers.forEach((avis) => {
  const avisDiv = document.createElement("div");
  avisDiv.className = "mb-3";
  avisDiv.innerHTML = `
    <p><strong>Pseudo :</strong> <span class="pseudo">${avis.pseudo}</span></p>
    <p><strong>Avis :</strong> <span class="commentaire">${avis.commentaire}</span></p>
    <div class="d-flex justify-content-center gap-2">
      <button type="button" class="btn btn-success text-primary btn-valid">Valider</button>
      <button type="button" class="btn btn-red text-primary btn-refuse">Refuser</button>
    </div>
    <hr />
  `;
  avisContainer.appendChild(avisDiv);
});

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

//Récupération depuis localStorage des covoiturages problématiques
let problemesCovoiturages = [];

try {
  const problemesFromStorage = JSON.parse(
    localStorage.getItem("problemesRemonter")
  );
  if (Array.isArray(problemesFromStorage)) {
    problemesCovoiturages = problemesFromStorage;
  } else if (problemesFromStorage) {
    problemesCovoiturages = [problemesFromStorage];
  }
} catch (e) {
  console.warn("Erreur de parsing JSON des covoiturages :", e);
}

problemesCovoiturages.forEach((covoit) => {
  const div = document.createElement("div");
  div.className = "border rounded p-3 mb-3 bg-white shadow-sm";
  div.innerHTML = `
    <p><strong>Numéro du covoiturage :</strong> <a class="text-danger" href="#">${covoit.id}</a></p>
  `;
  covoituragesContainer.appendChild(div);
});
