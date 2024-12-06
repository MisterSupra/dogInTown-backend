var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// Connexion **************
// Route Post : /users/connection
// Connexion si mail et mot de passe dans base de données correspondent.

// Inscription ***************
// Route Post : /users/inscription
// Enregistrement dans la base de données des infos users : pseudo, email, mot de passe, token, photo de profil et code postal.

// Screen infos perso ***********
// Route Put : /users/ :id 
// Modification des infos personnelles du user via son ID.

// Route Delete : /users/delete/ :id 
// Permet de supprimer son compte. Entraine une suppression des données du user (ses infos personnelles sont supprimées. Ses commentaires sont gardés mais ses infos passent en utilisateur inconnu). Entraine une déconnexion.

// Screen Dog signup ******************
// Route Post : /users/dog
// Enregistrement dans la base de données des infos du sous-document chien : nom, taille, race, photo.

// Screen Dog info **************************
// Route Put : /users/dog
// Modification des informations du sous-document chien.

// Route Get : /users/dog
// Affiche les informations du sous-document chien.

// Route Delete : /users/dog
// Supprime les infos du chien


module.exports = router;
