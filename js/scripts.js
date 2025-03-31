const tokenCookieName = "accesstoken";
const disconnect = document.getElementById("btn-deconnexion");
const RoleCookieName = "role";

disconnect.addEventListener("click", dIsconnect);

function getRole() {
  return getCookie(RoleCookieName);
}

function setToken(token) {
  setCookie(tokenCookieName, token, 7);
}

function getToken() {
  return getCookie(tokenCookieName);
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (const element of ca) {
    let c = element;
    while (c.startsWith(" ")) c = c.substring(1, c.length);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

//Fonction de connexion en mettant place le token
function isConnected() {
  if (getToken() == null || getToken == undefined) {
    return false;
  } else {
    return true;
  }
}

if (isConnected()) {
  alert("Je suis connecte");
} else {
  alert("Je suis pas connecte");
}

//Deconnexion en supprimant les cookies
function dIsconnect() {
  // Effacer les cookies liés au token et au rôle
  eraseCookie(tokenCookieName);
  eraseCookie(RoleCookieName);

  // Vider complètement le localStorage et le sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Rediriger ou recharger la page pour appliquer les changements
  window.location.href = "connexion";
}

function showAndHideElementsForRoles() {
  const userConnected = isConnected();
  const role = getRole();

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((element) => {
    const rolesToShow = element.dataset.show.split(" "); // Séparer les rôles par espace
    const isVisible =
      (rolesToShow.includes("disconnected") && !userConnected) ||
      (rolesToShow.includes("connected") && userConnected) ||
      (rolesToShow.includes(role) && userConnected);

    // Ajouter ou retirer la classe `d-none` en fonction de la visibilité
    if (isVisible) {
      element.classList.remove("d-none");
    } else {
      element.classList.add("d-none");
    }
  });
}
