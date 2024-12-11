var express = require('express');
var router = express.Router();

const Comment = require('../models/comments');
const User = require('../models/users');
const uid2 = require('uid2');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Rajoute un commentaire dans la base de données (contenu, pseudo et photo de profil utilisateur)
router.post('/', async (req, res) => {
  const user = await User.findOne({ token: req.body.token })
  const newComment = new Comment({
    content: req.body.content,
    date: new Date(),
    user: user._id,
    token: uid2(32),
  })
  await newComment.save()
  res.json({ message: 'Commentaire ajouté avec succès', comment: newComment });
})

// Route Delete : /comments/ :id
// Suppression d’un commentaire via son ID

// Route Put : /comments/ :id
// Modification d’un commentaire via son ID

module.exports = router;

