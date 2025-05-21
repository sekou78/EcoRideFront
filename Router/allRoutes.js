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
    "/changeMdp",
    "Changer de Mot de passe",
    "/pages/auth/changeMdp.html",
    [],
    "/js/auth/changeMdp.js"
  ),
  new Route(
    "/espaceUtilisateur",
    "Espace Utilisateur",
    "/pages/profilUtilisateur/espaceUtilisateur.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_CHAUFFEUR_PASSAGER",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/espaceUtilisateur.js"
  ),
  new Route(
    "/modifAvatar",
    "Modification Avatar",
    "/pages/profilUtilisateur/modifAvatar.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_CHAUFFEUR_PASSAGER",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/modifAvatar.js"
  ),
  new Route(
    "/modifProfil",
    "Modification Profil",
    "/pages/profilUtilisateur/modifProfil.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_CHAUFFEUR_PASSAGER",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/modifProfil.js"
  ),
  new Route(
    "/modifProfilConducteur",
    "Modification Profil conducteur",
    "/pages/profilUtilisateur/gestionVehicules/modifProfilConducteur.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_CHAUFFEUR",
      "ROLE_CHAUFFEUR_PASSAGER",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/gestionVehicules/modifProfilConducteur.js"
  ),
  new Route(
    "/listeVehicule",
    "La liste des vehicules",
    "/pages/profilUtilisateur/gestionVehicules/listeVehicule.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_CHAUFFEUR",
      "ROLE_CHAUFFEUR_PASSAGER",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/gestionVehicules/listeVehicule.js"
  ),
  new Route(
    "/editerVehicule",
    "Modification d'un vehicule",
    "/pages/profilUtilisateur/gestionVehicules/editerVehicules.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_CHAUFFEUR",
      "ROLE_CHAUFFEUR_PASSAGER",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/gestionVehicules/editerVehicules.js"
  ),
  new Route(
    "/creerUntrajet",
    "Creation d'un trajet",
    "/pages/profilUtilisateur/trajet/creerUntrajet.html",
    ["ROLE_ADMIN", "ROLE_CHAUFFEUR", "ROLE_CHAUFFEUR_PASSAGER", "ROLE_USER"],
    "/js/profilUtiliateur/trajet/creerUntrajet.js"
  ),
  new Route(
    "/modifTrajet",
    "Modifier un trajet",
    "/pages/profilUtilisateur/trajet/modifTrajet.html",
    ["ROLE_ADMIN", "ROLE_CHAUFFEUR", "ROLE_CHAUFFEUR_PASSAGER", "ROLE_USER"],
    "/js/profilUtiliateur/trajet/modifTrajet.js"
  ),
  new Route(
    "/historiqueUtilisateur",
    "Historique Utilisateur",
    "/pages/profilUtilisateur/historiqueUtilisateur.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_CHAUFFEUR_PASSAGER",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/historiqueUtilisateur.js"
  ),
  new Route(
    "/espaceEmployee",
    "Espace Employee",
    "/pages/employeeGestion/espaceEmployee.html",
    ["ROLE_EMPLOYE"],
    "/js/employeeGestion/espaceEmployee.js"
  ),
  new Route(
    "/espaceProblemesRemonter",
    "Espace Problemes Remonter",
    "/pages/employeeGestion/espaceProblemesRemonter.html",
    ["ROLE_EMPLOYE"],
    "/js/employeeGestion/espaceProblemesRemonter.js"
  ),
  new Route(
    "/espaceAdmin",
    "Espace Admin",
    "/pages/admin/espaceAdmin.html",
    ["ROLE_ADMIN"],
    "/js/admin/espaceAdmin.js"
  ),
  new Route(
    "/gestionEmployee",
    "Gestion Employee",
    "/pages/admin/gestionAdminEmployee.html",
    ["ROLE_ADMIN"],
    "/js/admin/gestionAdminEmployee.js"
  ),
  new Route(
    "/gestionUtilisateur",
    "Gestion Utilisateur",
    "/pages/admin/gestionAdminUtilisateur.html",
    ["ROLE_ADMIN"],
    "/js/admin/gestionAdminUtlisateur.js"
  ),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";
