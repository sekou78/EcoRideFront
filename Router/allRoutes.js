import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
  new Route("/", "Accueil", "/pages/accueil.html"),
  new Route("/covoiturage", "Covoiturage", "/pages/covoiturage.html"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";
