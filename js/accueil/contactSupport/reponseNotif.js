const cardTitle = document.getElementById("notif-title");
const cardBody = document.getElementById("notif-message");
const token = getCookie(tokenCookieName);

// Récupération de l'ID dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const notifId = urlParams.get("id");

// Appel API pour récupérer le détail
fetch(apiUrl + "notification/" + notifId, {
  headers: { "X-AUTH-TOKEN": token },
})
  .then((response) => response.json())
  .then((data) => {
    cardTitle.textContent = "Réponse à la notification";

    if (data.comments.length === 0) {
      cardBody.textContent = "Aucune réponse pour cette demande.";
      return;
    }

    let html = '<ul class="list-group">';
    data.comments.forEach((comment) => {
      html += `
        <li class="list-group-item">
        <strong>${comment.author}</strong> <br/>
        <small class="text-muted">(${comment.createdAt})</small>
        <p class="mb-0">${comment.content}</p>
        </li>`;
    });
    html += "</ul>";

    cardBody.innerHTML = html;
  })
  .catch(() => {
    cardTitle.textContent = "Erreur";
    cardBody.textContent = "Impossible de charger la notification.";
  });
