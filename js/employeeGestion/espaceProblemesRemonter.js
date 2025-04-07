const accordionContainer = document.getElementById("accordionFlushExample");

let problemes = [];

try {
  const saved = JSON.parse(localStorage.getItem("problemesRemonter"));
  if (Array.isArray(saved)) {
    problemes = saved;
  } else if (saved) {
    problemes = [saved];
  }
} catch (e) {
  console.warn("Erreur de parsing des problèmes :", e);
}

// Générer chaque bloc accordéon
problemes.forEach((probleme, index) => {
  const uniqueId = `flush-collapse-${index}`;
  const headerId = `flush-header-${index}`;

  const item = document.createElement("div");
  item.className = "accordion-item";
  item.innerHTML = `
    <h2 class="accordion-header" id="${headerId}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#${uniqueId}" aria-expanded="false" aria-controls="${uniqueId}">
        <span>${probleme.id}</span>
      </button>
    </h2>
    <div id="${uniqueId}" class="accordion-collapse collapse" aria-labelledby="${headerId}"
      data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">
        <p><strong>Pseudo du passager:</strong> ${
          probleme.participant1?.pseudo || "Inconnu"
        }</p>
        <p><strong>Email du passager:</strong> ${
          probleme.participant1?.email || "Inconnu"
        }</p>
        <p><strong>Pseudo du chauffeur:</strong> ${
          probleme.participant2?.pseudo || "Inconnu"
        }</p>
        <p><strong>Email du chauffeur:</strong> ${
          probleme.participant2?.email || "Inconnu"
        }</p>
        <p><strong>Date du départ:</strong> ${
          probleme.depart || "Non précisée"
        }</p>
        <p><strong>Date d'arrivée:</strong> ${
          probleme.arrivee || "Non précisée"
        }</p>
        <p><strong>Départ:</strong> ${
          probleme.lieuDepart || "Adresse inconnue"
        }</p>
        <p><strong>Arrivée:</strong> ${
          probleme.lieuArrivee || "Adresse inconnue"
        }</p>
        <p><strong>Description du problème:</strong> ${
          probleme.commentaire || "Aucun commentaire"
        }</p>
      </div>
      <div class="text-center pb-3">
        <button type="button" class="btn bg-success border-dark text-primary" onclick="marquerProblemeResolue('${
          probleme.id
        }', this)">
          Problème résolu
        </button>
      </div>
    </div>
  `;
  accordionContainer.appendChild(item);
});

// Fonction pour retirer un problème du localStorage
function marquerProblemeResolue(id, buttonElement) {
  if (confirm(`Confirmer la résolution du problème ${id} ?`)) {
    let updatedProblemes = problemes.filter((p) => p.id !== id);
    localStorage.setItem("problemesRemonter", JSON.stringify(updatedProblemes));
    const accordionItem = buttonElement.closest(".accordion-item");
    if (accordionItem) accordionItem.remove();
  }
}
