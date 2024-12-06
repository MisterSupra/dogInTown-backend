var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Route Post : /comments
// Rajoute un commentaire dans la base de données (contenu, pseudo et photo de profil utilisateur)

// Route Delete : /comments/ :id
// Suppression d’un commentaire via son ID

// Route Put : /comments/ :id
// Modification d’un commentaire via son ID

module.exports = router;

