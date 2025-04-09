import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
  new Route("/", "Accueil", "/pages/accueil/accueil.html", []),
  new Route(
    "/covoiturage",
    "Covoiturage",
    "/pages/accueil/covoiturage.html",
    []
  ),
  new Route(
    "/vueDetaillee",
    "Vue detaillee",
    "/pages/accueil/vueDetaillee.html",
    []
  ),
  new Route(
    "/inscription",
    "Inscription",
    "/pages/auth/inscription.html",
    [],
    "/js/auth/inscription.js"
  ),
  new Route(
    "/connexion",
    "Connexion",
    "/pages/auth/connexion.html",
    [],
    "/js/auth/connexion.js"
  ),
  new Route(
    "/espaceUtilisateur",
    "Espace Utilisateur",
    "/pages/profilUtilisateur/espaceUtilisateur.html",
    ["admin", "employe", "passager", "chauffeur", "chauffeur_passager"],
    "/js/profilUtiliateur/espaceUtilisateur.js"
  ),
  new Route(
    "/modifProfil",
    "Modif Profil",
    "/pages/profilUtilisateur/modifProfil.html",
    ["admin", "employe", "passager", "chauffeur", "chauffeur_passager"],
    "/js/profilUtiliateur/modifProfil.js"
  ),
  new Route(
    "/historiqueUtilisateur",
    "Historique Utilisateur",
    "/pages/profilUtilisateur/historiqueUtilisateur.html",
    ["admin", "employe", "passager", "chauffeur", "chauffeur_passager"],
    "/js/profilUtiliateur/historiqueUtilisateur.js"
  ),
  new Route(
    "/espaceEmployee",
    "Espace Employee",
    "/pages/employeeGestion/espaceEmployee.html",
    ["employee"],
    "/js/employeeGestion/espaceEmployee.js"
  ),
  new Route(
    "/espaceProblemesRemonter",
    "Espace Problemes Remonter",
    "/pages/employeeGestion/espaceProblemesRemonter.html",
    ["employee"],
    "/js/employeeGestion/espaceProblemesRemonter.js"
  ),
  new Route(
    "/espaceAdmin",
    "Espace Admin",
    "/pages/admin/espaceAdmin.html",
    ["admin"],
    "/js/admin/espaceAdmin.js"
  ),
  new Route(
    "/gestionEmployee",
    "Gestion Employee",
    "/pages/admin/gestionAdminEmployee.html",
    ["admin"],
    "/js/admin/gestionAdminEmployee.js"
  ),
  new Route(
    "/gestionUtilisateur",
    "Gestion Utilisateur",
    "/pages/admin/gestionAdminUtilisateur.html",
    ["admin"],
    "/js/admin/gestionAdminUtilisateur.js"
  ),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";
