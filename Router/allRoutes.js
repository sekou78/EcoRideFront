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
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";
