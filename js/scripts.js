const tokenCookieName = "accesstoken";
const disconnect = document.getElementById("btn-deconnexion");
const RoleCookieName = "role";

disconnect.addEventListener("click", dIsconnect);

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
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

//Fonction de connexion en mettant place le token
function isConnected() {
  const token = getToken();
  return token !== null && token !== undefined;
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
  window.location.href = "/connexion";
}
