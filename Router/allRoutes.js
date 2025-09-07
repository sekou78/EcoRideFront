import Route from "./Route.js";

export const allRoutes = [
  new Route(
    "/",
    "Accueil",
    "/pages/accueil/public/accueil.html",
    [],
    "/js/accueil/public/accueil.js"
  ),
  new Route(
    "/avis",
    "Avis",
    "/pages/accueil/public/avis.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/accueil/public/avis.js"
  ),
  new Route(
    "/covoiturage",
    "Covoiturage",
    "/pages/accueil/covoiturage/covoiturage.html",
    [],
    "/js/accueil/covoiturage/covoiturage.js"
  ),
  new Route(
    "/resultCovoiturage",
    "Resultat covoiturage",
    "/pages/accueil/covoiturage/resultCovoiturage.html",
    [],
    "/js/accueil/covoiturage/resultCovoiturage.js"
  ),
  new Route(
    "/vueDetaillee",
    "Vue detaillee",
    "/pages/accueil/covoiturage/vueDetaillee.html",
    [],
    "/js/accueil/covoiturage/vueDetaillee.js"
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
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/auth/changeMdp.js"
  ),
  new Route(
    "/espaceUtilisateur",
    "Espace Utilisateur",
    "/pages/profilUtilisateur/comptes/espaceUtilisateur.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/comptes/espaceUtilisateur.js"
  ),
  new Route(
    "/reservation",
    "Reservation",
    "/pages/profilUtilisateur/reservation/reservation.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/reservation/reservation.js"
  ),
  new Route(
    "/vueReservation",
    "Uue de la Reservation",
    "/pages/profilUtilisateur/reservation/vueReservation.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/reservation/vueReservation.js"
  ),
  new Route(
    "/statutReservation",
    "Modification du statut de la Reservation",
    "/pages/profilUtilisateur/reservation/statutReservation.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/reservation/statutReservation.js"
  ),
  new Route(
    "/modifAvatar",
    "Modification Avatar",
    "/pages/profilUtilisateur/comptes/modifAvatar.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/comptes/modifAvatar.js"
  ),
  new Route(
    "/modifProfil",
    "Modification Profil",
    "/pages/profilUtilisateur/comptes/modifProfil.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/comptes/modifProfil.js"
  ),
  new Route(
    "/modifProfilConducteur",
    "Modification Profil conducteur",
    "/pages/profilUtilisateur/gestionVehicules/modifProfilConducteur.html",
    ["ROLE_ADMIN", "ROLE_EMPLOYE", "ROLE_CHAUFFEUR", "ROLE_PASSAGER_CHAUFFEUR"],
    "/js/profilUtiliateur/gestionVehicules/modifProfilConducteur.js"
  ),
  new Route(
    "/listeVehicule",
    "La liste des vehicules",
    "/pages/profilUtilisateur/gestionVehicules/listeVehicule.html",
    ["ROLE_ADMIN", "ROLE_EMPLOYE", "ROLE_CHAUFFEUR", "ROLE_PASSAGER_CHAUFFEUR"],
    "/js/profilUtiliateur/gestionVehicules/listeVehicule.js"
  ),
  new Route(
    "/editerVehicule",
    "Modification d'un vehicule",
    "/pages/profilUtilisateur/gestionVehicules/editerVehicules.html",
    ["ROLE_ADMIN", "ROLE_EMPLOYE", "ROLE_CHAUFFEUR", "ROLE_PASSAGER_CHAUFFEUR"],
    "/js/profilUtiliateur/gestionVehicules/editerVehicules.js"
  ),
  new Route(
    "/creerUntrajet",
    "Creation d'un trajet",
    "/pages/profilUtilisateur/trajet/creerUntrajet.html",
    ["ROLE_ADMIN", "ROLE_CHAUFFEUR", "ROLE_PASSAGER_CHAUFFEUR"],
    "/js/profilUtiliateur/trajet/creerUntrajet.js"
  ),
  new Route(
    "/modifTrajet",
    "Modifier un trajet",
    "/pages/profilUtilisateur/trajet/modifTrajet.html",
    ["ROLE_ADMIN", "ROLE_CHAUFFEUR", "ROLE_PASSAGER_CHAUFFEUR"],
    "/js/profilUtiliateur/trajet/modifTrajet.js"
  ),
  new Route(
    "/historiqueUtilisateur",
    "Historique Utilisateur",
    "/pages/profilUtilisateur/comptes/historiqueUtilisateur.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/comptes/historiqueUtilisateur.js"
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
    ["ROLE_EMPLOYE", "ROLE_USER"],
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
    "/archivesDesTrajets",
    "Archives des trajets",
    "/pages/admin/archivesDesTrajets.html",
    ["ROLE_ADMIN"],
    "/js/admin/archivesDesTrajets.js"
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
  new Route(
    "/commentairesSurChauffeur",
    "Commentaires sur le chauffeur",
    "/pages/accueil/public/commentairesSurChauffeur.html",
    [],
    "/js/accueil/public/commentairesSurChauffeur.js"
  ),
  new Route(
    "/listesPassagers",
    "Listes des passagers du trajets",
    "/pages/profilUtilisateur/trajet/listesPassagers.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/profilUtiliateur/trajet/listesPassagers.js"
  ),
  new Route(
    "/supprimerMonCompte",
    "Suppression du compte utilisateur",
    "/pages/auth/supprimerMonCompte.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/auth/supprimerMonCompte.js"
  ),
  new Route(
    "/pageSuspensionCompte",
    "Suspension du compte utilisateur",
    "/pages/profilUtilisateur/comptes/pageSuspensionCompte.html",
    []
  ),
  new Route(
    "/contactSupport",
    "Contacter le support",
    "/pages/accueil/contactSupport/formulaireContactSupport.html",
    [],
    "/js/accueil/contactSupport/formulaireContactSupport.js"
  ),
  new Route(
    "/gestionContact",
    "Gestion du contact support",
    "/pages/accueil/contactSupport/gestionContact.html",
    ["ROLE_ADMIN", "ROLE_EMPLOYE"],
    "/js/accueil/contactSupport/gestionContact.js"
  ),
  new Route(
    "/mentionsLegales",
    "Les mentions legales",
    "/pages/accueil/mentionsLegales/mentionsLegales.html",
    []
  ),
  new Route(
    "/envoiMailResetMdp",
    "Envoi mail pour réinitialiser le mot de passe",
    "/pages/auth/motDePasseOublié/envoiMailResetMdp.html",
    [],
    "/js/auth/motDePasseOublié/envoiMailResetMdp.js"
  ),
  new Route(
    "/changeResetMdp",
    "Changement mdp pour réinitialiser le mot de passe",
    "/pages/auth/motDePasseOublié/changeResetMdp.html",
    [],
    "/js/auth/motDePasseOublié/changeResetMdp.js"
  ),
  new Route(
    "/reponseNotif",
    "Reponse de notification",
    "/pages/accueil/contactSupport/reponseNotif.html",
    [
      "ROLE_ADMIN",
      "ROLE_EMPLOYE",
      "ROLE_PASSAGER",
      "ROLE_CHAUFFEUR",
      "ROLE_PASSAGER_CHAUFFEUR",
      "ROLE_USER",
    ],
    "/js/accueil/contactSupport/reponseNotif.js"
  ),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";
