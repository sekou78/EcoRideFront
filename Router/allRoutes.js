import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
  new Route("/", "Accueil", "/pages/accueil.html"),
  new Route("/covoiturage", "Covoiturage", "/pages/covoiturage.html"),
  new Route("/vueDetaillee", "Vue detaillee", "/pages/vueDetaillee.html"),
  new Route(
    "/inscription",
    "Inscription",
    "/pages/auth/inscription.html",
    "/js/auth/inscription.js"
  ),
  new Route(
    "/connexion",
    "Connexion",
    "/pages/auth/connexion.html",
    "/js/auth/connexion.js"
  ),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";
