let currentEditMessageId = null;
let currentDeleteCommentId = null;
let currentDeleteMessageId = null;
let currentUser = null;

const commentModalEl = document.getElementById("commentModal");
const commentModal = new bootstrap.Modal(commentModalEl);
const commentForm = document.getElementById("commentForm");
const commentTextarea = document.getElementById("commentTextarea");

const confirmDeleteModalEl = document.getElementById("confirmDeleteModal");
const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// Récupérer l'utilisateur connecté au chargement puis lister les messages
function init() {
  fetchCurrentUser().then(() => {
    listsMessages();
  });
}
init();

function listsMessages() {
  const token = getCookie(tokenCookieName);
  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(apiUrl + "support/showMessagesFilter", requestOptions)
    .then((response) => {
      if (!response.ok) throw new Error("Erreur de chargement");
      return response.json();
    })
    .then((result) => {
      const container = document.getElementById("cardView");
      container.innerHTML = "";

      if (result.length === 0) {
        container.innerHTML =
          '<div class="text-center text-muted">Aucun message trouvé.</div>';
        return;
      }

      const bgClasses = [
        "bg-success-subtle",
        "bg-warning-subtle",
        "bg-info-subtle",
        "bg-secondary-subtle",
      ];

      result.forEach((msg, index) => {
        const statusOptions = ["new", "read", "resolved"];

        const statusSelect = `
          <select
            class="form-select form-select-sm custom-select-compact mt-2 text-center status-select"
            data-msg-id="${msg.id}">
            ${statusOptions
              .map(
                (option) =>
                  `<option value="${option}" ${
                    option === msg.status ? "selected" : ""
                  }>${option}</option>`
              )
              .join("")}
          </select>
        `;

        const fileLink = msg.filename
          ? `<a href="/uploads/support/${msg.filename}" target="_blank" class="btn btn-sm btn-outline-dark mt-2 text-primary">📎 Télécharger la pièce jointe</a>`
          : "";

        const bgClass = bgClasses[index % bgClasses.length];

        const card = `
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card border-0 shadow-sm h-100 ${bgClass}">
              <div class="card-body d-flex flex-column text-center">
                <h5 class="card-title mb-2">📝 ${msg.subject}</h5>

                <div class="mb-2 d-flex flex-column align-items-center">${statusSelect}</div>

                <div class="mb-2">
                  <p class="mb-1"><strong>👤 Nom :</strong> ${msg.name}</p>
                  <p class="mb-1"><strong>✉️ Email :</strong> ${msg.email}</p>
                </div>

                <p class="card-text flex-grow-1 mt-2">💬 ${msg.message}</p>

                <div class="mt-3">
                  <p class="mb-1"><small class="text-muted">📅 Reçu le ${msg.createdAt}</small></p>
                  ${fileLink}
                </div>

                <!-- Zone des commentaires -->
                <div class="mt-3 text-start">
                  <h6>💬 Commentaires internes :</h6>
                  <div id="comments-${msg.id}" class="mb-2">
                    <p class="text-muted small">Chargement...</p>
                  </div>
                </div>

                <!-- Zone ajout commentaire -->
                <div class="mt-3">
                  <textarea id="comment-${msg.id}" class="form-control form-control-sm" placeholder="Ajouter un commentaire interne..."></textarea>
                  <button class="btn bg-success text-primary btn-sm mt-2 btn-add-comment" data-msg-id="${msg.id}">💬 Ajouter</button>
                </div>
              </div>
            </div>
          </div>
        `;

        container.innerHTML += card;

        // Charger les commentaires pour ce message
        fetchAndDisplayComments(msg.id);
      });

      // Bouton ajouter commentaire
      document.querySelectorAll(".btn-add-comment").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.getAttribute("data-msg-id");
          addInternalComment(id);
        });
      });

      // Select changement statut
      document.querySelectorAll(".status-select").forEach((select) => {
        select.addEventListener("change", () => {
          const id = select.getAttribute("data-msg-id");
          const newStatus = select.value;
          updateStatus(id, newStatus);
        });
      });
    })
    .catch((error) => {
      console.error(error);
      const container = document.getElementById("cardView");
      container.innerHTML =
        '<div class="text-center text-danger">❌ Erreur de chargement des messages.</div>';
    });
}

// Récupérer l'utilisateur connecté au chargement
function fetchCurrentUser() {
  const token = getCookie(tokenCookieName);
  return fetch(apiUrl + "account/me", {
    headers: { "X-AUTH-TOKEN": token },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Utilisateur non connecté");
      return response.json();
    })
    .then((data) => {
      currentUser = data.user; // stocke l'objet utilisateur
    })
    .catch(() => {
      currentUser = null; // pas connecté
    });
}

// Charger et afficher les commentaires
function fetchAndDisplayComments(messageId) {
  const token = getCookie(tokenCookieName);

  fetch(apiUrl + `supportComment/list/${messageId}`, {
    method: "GET",
    headers: { "X-AUTH-TOKEN": token },
  })
    .then((response) => response.json())
    .then((comments) => {
      const commentContainer = document.getElementById(`comments-${messageId}`);
      commentContainer.innerHTML = "";

      if (comments.length === 0) {
        commentContainer.innerHTML =
          '<p class="text-muted small">Aucun commentaire.</p>';
        return;
      }

      comments.forEach((comment) => {
        // Vérifie si l'utilisateur connecté est l'auteur
        const isAuthor =
          currentUser && comment.authorName === currentUser.email;

        // Afficher les boutons seulement si auteur
        const buttonsHtml = isAuthor
          ? `
        <div class="d-flex justify-content-between mt-3">
          <button
            class="btn bg-success btn-sm rounded-circle btn-edit-comment text-primary"
            style="width: 36px; height: 36px; padding: 0;"
            data-id="${comment.id}" data-message-id="${messageId}"
            title="Modifier">
            ✏
          </button>
          <button
            class="btn bg-danger btn-sm rounded-circle btn-delete-comment text-primary"
            style="width: 36px; height: 36px; padding: 0;"
            data-id="${comment.id}" data-message-id="${messageId}"
            title="Supprimer">
            🗑
          </button>
        </div>
      `
          : "";

        const commentHtml = `
        <div class="border rounded p-3 mb-3 bg-light text-start position-relative">
          <div><strong>👤 Auteur :</strong> ${comment.authorName}</div>
          <div class="mt-2"><strong>💬 Commentaire :</strong><br>${comment.content}</div>
          <div class="text-muted mt-2"><small>📅 ${comment.createdAt}</small></div>
          ${buttonsHtml}
        </div>
      `;

        commentContainer.innerHTML += commentHtml;
      });

      // Lier boutons modifier / supprimer
      commentContainer.querySelectorAll(".btn-edit-comment").forEach((btn) => {
        btn.addEventListener("click", () =>
          editComment(btn.dataset.id, btn.dataset.messageId)
        );
      });
      commentContainer
        .querySelectorAll(".btn-delete-comment")
        .forEach((btn) => {
          btn.addEventListener("click", () =>
            deleteComment(btn.dataset.id, btn.dataset.messageId)
          );
        });
    })
    .catch((error) => console.error("Erreur chargement commentaires:", error));
}

// Ajouter un commentaire interne
function addInternalComment(id) {
  const token = getCookie(tokenCookieName);
  const textarea = document.querySelector(`#comment-${id}`);

  if (!textarea || !textarea.value.trim()) {
    showModal("Erreur", "⚠️ Veuillez entrer un commentaire avant d'envoyer.");
    return;
  }

  fetch(apiUrl + `supportComment/add/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": token,
    },
    body: JSON.stringify({ comment: textarea.value.trim() }),
  })
    .then((response) =>
      response.json().then((data) => ({ ok: response.ok, data }))
    )
    .then(({ ok, data }) => {
      if (!ok) {
        showModal("Erreur", `❌ ${data.error || "Erreur d'enregistrement"}`);
        throw new Error(data.error || "Erreur d'enregistrement");
      }
      showModal("Succès", "✅ Commentaire enregistré !");
      textarea.value = "";
      fetchAndDisplayComments(id);
    })
    .catch((error) => {
      showModal("Erreur", `❌ ${error.message}`);
    });
}

// Ouvrir modal édition avec contenu actuel
function editComment(commentId, messageId) {
  // Récupérer contenu actuel du commentaire affiché
  const commentElement = document
    .querySelector(`.btn-edit-comment[data-id="${commentId}"]`)
    .closest(".border");
  // Ou utiliser la source de données pour récupérer le texte exact
  // Ici on extrait directement depuis le DOM :
  const contentElem = commentElement.querySelector(
    "div.mt-2 strong + br + div, div.mt-2"
  );
  const currentContent = contentElem
    ? contentElem.textContent || contentElem.innerText
    : "";

  currentEditCommentId = commentId;
  currentEditMessageId = messageId;
  commentTextarea.value = currentContent.trim();
  commentModal.show();
}

// Gestion formulaire édition
commentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newContent = commentTextarea.value.trim();
  if (!newContent) {
    showModal("Erreur", "⚠️ Le commentaire ne peut pas être vide.");
    return;
  }
  editCommentConfirm(currentEditCommentId, currentEditMessageId, newContent);
  commentModal.hide();
});

function editCommentConfirm(commentId, messageId, newContent) {
  const token = getCookie(tokenCookieName);

  fetch(apiUrl + `supportComment/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": token,
    },
    body: JSON.stringify({ content: newContent }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        showModal("Erreur", `❌ ${data.error}`);
      } else {
        showModal("Succès", "✅ Commentaire modifié");
        fetchAndDisplayComments(messageId);
      }
    })
    .catch((error) => console.error("Erreur modification commentaire:", error));
}

// Ouvrir modal confirmation suppression
function deleteComment(commentId, messageId) {
  currentDeleteCommentId = commentId;
  currentDeleteMessageId = messageId;
  confirmDeleteModal.show();
}

// Bouton confirmer suppression
confirmDeleteBtn.addEventListener("click", function () {
  deleteCommentConfirm(currentDeleteCommentId, currentDeleteMessageId);
  confirmDeleteModal.hide();
});

function deleteCommentConfirm(commentId, messageId) {
  const token = getCookie(tokenCookieName);

  fetch(apiUrl + `supportComment/${commentId}`, {
    method: "DELETE",
    headers: { "X-AUTH-TOKEN": token },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        showModal("Erreur", `❌ ${data.error}`);
      } else {
        showModal("Succès", "✅ Commentaire supprimé");
        fetchAndDisplayComments(messageId);
      }
    })
    .catch((error) => console.error("Erreur suppression commentaire:", error));
}

// Modifier statut
function updateStatus(id, newStatus) {
  const token = getCookie(tokenCookieName);
  fetch(apiUrl + `support/contact/status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": token,
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((response) =>
      response.json().then((data) => ({ ok: response.ok, data }))
    )
    .then(({ ok, data }) => {
      if (!ok) {
        showModal("Erreur", `❌ ${data.error || "Erreur de mise à jour"}`);
        throw new Error(data.error || "Erreur de mise à jour");
      }
      showModal("Succès", "✅ Statut mis à jour avec succès");
      listsMessages();
    })
    .catch((error) => {
      showModal("Erreur", `❌ ${error.message}`);
    });
}

// Modal Bootstrap
function showModal(title, message) {
  document.getElementById("feedbackModalLabel").textContent = title;
  document.getElementById("feedbackModalBody").innerHTML = message;
  const modal = new bootstrap.Modal(document.getElementById("feedbackModal"));
  modal.show();
}
