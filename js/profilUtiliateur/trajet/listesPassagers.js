const token = getCookie(tokenCookieName);

const urlParams = new URLSearchParams(window.location.search);
const trajetId = urlParams.get("id");

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

if (trajetId) {
  fetch(apiUrl + `trajet/passagers/${trajetId}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        // Affichage d'un message utilisateur si 404
        const ul = document.getElementById("liste-passagers");
        ul.innerHTML = `<li>Impossible de charger la liste des passagers (erreur ${response.status})</li>`;
        throw new Error("Erreur HTTP : " + response.status);
      }
      return response.json();
    })
    .then((passagers) => {
      console.log(passagers);

      const ul = document.getElementById("liste-passagers");
      ul.innerHTML = "";

      if (!Array.isArray(passagers) || passagers.length === 0) {
        ul.innerHTML = `<li>Aucun passager pour ce trajet</li>`;
        return;
      }

      passagers.forEach((passagers) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
          <div>
            <strong>👤 ${passagers.prenom}</strong><br>
            <small>📱 ${passagers.telephone}</small>
          </div>
          <span class="badge bg-dark rounded-pill">🚗 Passager</span>
        `;

        ul.appendChild(li);
      });
    })
    .catch((error) => {
      // Le message utilisateur est déjà affiché si 404, ici on log juste l'erreur
      console.error("Erreur lors du chargement des passagers :", error);
    });
}
