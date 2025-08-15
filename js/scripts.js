const tokenCookieName = "accesstoken";
const disconnect = document.getElementById("btn-deconnexion");
const RoleCookieName = "role";
const apiUrl = "http://localhost:8000/api/";
const urlImg = "http://localhost:8000";
const urlSendReset = "http://localhost:8000/";

disconnect.addEventListener("click", dIsconnect);

function getRole() {
  return getCookie(RoleCookieName);
}

function filtrerRoles(roles) {
  if (!roles || roles.length === 0) {
    return ["ROLE_USER"]; // par défaut si aucun rôle
  }

  // On filtre ROLE_USER sauf s'il est le seul
  const rolesSansUser = roles.filter((r) => r !== "ROLE_USER");

  // Si après filtrage on a au moins un rôle, on le garde
  if (rolesSansUser.length > 0) {
    return rolesSansUser;
  }

  // Sinon on garde ROLE_USER (car c'est le seul rôle)
  return ["ROLE_USER"];
}

function setRole(role) {
  let rolesArray = Array.isArray(role) ? role : role.split(",");
  const filteredRoles = filtrerRoles(rolesArray);
  setCookie(RoleCookieName, filteredRoles.join(","), 7);
}

function setRole(role) {
  let rolesArray = Array.isArray(role) ? role : role.split(",");
  const filteredRoles = filtrerRoles(rolesArray);
  setCookie(RoleCookieName, filteredRoles.join(","), 7);
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
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

//Fonction de connexion en mettant place le token
function isConnected() {
  if (getToken() == null || getToken == undefined) {
    return false;
  } else {
    return true;
  }
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

function showAndHideElementsForRoles() {
  const userConnected = isConnected();
  // const role = getRole();
  const userRoles = getRole()?.split(",") || [];

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((element) => {
    const rolesToShow = element.dataset.show.split(" "); // Séparer les rôles par espace
    const isVisible =
      (rolesToShow.includes("disconnected") && !userConnected) ||
      (rolesToShow.includes("connected") && userConnected) ||
      // (rolesToShow.includes(role) && userConnected);
      (userConnected && userRoles.some((role) => rolesToShow.includes(role)));

    // Ajouter ou retirer la classe `d-none` en fonction de la visibilité
    if (isVisible) {
      element.classList.remove("d-none");
    } else {
      element.classList.add("d-none");
    }
  });
}

function getUserRoles() {
  const roleCookie = getRole();
  return roleCookie ? roleCookie.split(",") : [];
}

function hasAccessToRoute(allowedRoles = []) {
  const userRoles = getUserRoles();
  return allowedRoles.some((role) => userRoles.includes(role));
}

async function loadMonCompte() {
  const token = getCookie(tokenCookieName);

  const response = await fetch(apiUrl + "account/me", {
    headers: { "X-AUTH-TOKEN": token },
  });

  // si l'utilisateur n'est pas connecté
  if (response.status === 401) {
    eraseCookie(tokenCookieName);
    eraseCookie(RoleCookieName);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/connexion";
    return; // on stoppe la suite
  }

  if (!response.ok) {
    alert("Erreur serveur");
    return;
  }
}

// Fonction pour rediriger si le compte est suspendu
function compteSuspendu(response) {
  if (response?.error?.includes("Compte suspendu")) {
    window.location.href = "/pageSuspensionCompte";
    return false;
  }
  return true;
}
