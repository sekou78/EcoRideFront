export default class Route {
  constructor(url, title, pathHtml, authorize, pathJS = "") {
    this.url = url;
    this.title = title;
    this.pathHtml = pathHtml;
    this.pathJS = pathJS;
    this.authorize = authorize;
  }
}

/*
[] -> Tout le monde peut y accéder
["disconnected"] -> Réserver aux utilisateurs déconnecté 
["employe"] -> Réserver aux utilisateurs avec le rôle employe 
["passager"] -> Réserver aux utilisateurs avec le rôle passager 
["chauffeur"] -> Réserver aux utilisateurs avec le rôle chauffeur 
["chauffeur_passager"] -> Réserver aux utilisateurs avec le rôle chauffeur_passager
["admin"] -> Réserver aux utilisateurs avec le rôle admin 
["admin", "employe", "passager", "chauffeur", "chauffeur_passager"] -> Réserver aux utilisateurs avec le rôle employe OU admin OU passager OU chauffeur OU chauffeur_passager
*/
