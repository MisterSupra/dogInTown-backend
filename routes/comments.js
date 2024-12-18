var express = require('express');
var router = express.Router();

const Comment = require('../models/comments');
const User = require('../models/users');
const Place = require('../models/places');
const uid2 = require('uid2');


//trouver les informations utilisateurs depuis un commentaire
router.get('/user/:commentToken', async(req, res) => {
  const user = await Comment.findOne({token : req.params.commentToken}).populate('user');
  if(user === null || user.user === null){
    res.json({erreur: 'utilisateur non trouvé'});
    return
  }
  const userDataToShow = {
    username : user.user.username,
    avatar: user.user.avatar,
    dogs: user.user.dogs
  }
  res.json({message: 'utilisateur trouvé', user: userDataToShow});
})


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


//Ajouter un commentaire sur un lieu déjà existant

router.put('/add/:placeName', async(req, res) => {
  const place = await Place.findOne({name : req.params.placeName})
  const user = await User.findOne({ token : req.body.token })
  const newComment = new Comment({
    content : req.body.content,
    date: new Date(),
    user: user._id,
    token: uid2(32),
  })

  if(req.body.size === 'moyen'){
    place.sizeAccepted = 'moyen';
  }else if(req.body.size === 'grand'){
    place.sizeAccepted = 'grand';
  }

  await newComment.save()
  place.comments.push(newComment._id);
  if(!place.feedback.includes(req.body.token)){ //Si le tableau de feedback n'a pas le token de l'utilsateur compris dans ses valeurs
    place.feedback.push(req.body.token)
  }
  await place.save()
  res.json({message: 'Commentaire ajouté avec succès.', comment: newComment})
})


// Route Delete : /comments/ :id
// Suppression d’un commentaire via son ID

// Route Put : /comments/ :id
// Modification d’un commentaire via son ID

module.exports = router;

