var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const tempDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}


// Connexion ************
router.post('/connection', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username, id: data._id });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
})

// Inscription ***************
// Enregistrement dans la base de données des infos users : pseudo, email, mot de passe, token, photo de profil et code postal.
router.post('/inscription', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        avatar: "",
        postCode: req.body.postCode,
        dogs: [{}],
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, username: newDoc.username, id: newDoc._id });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

// Route POST pour envoyer l'information à Claudinary
router.post('/upload', async (req, res) => {
  try {
    const pictureUpload = req.files?.photoFromFront;

    if (!pictureUpload) {
      return res.json({ result: false, error: "No picture" });
    };

    const resultCloudinary = await cloudinary.uploader.upload(pictureUpload.tempFilePath);
      // to upload to a specific folder VVVV
      // await cloudinary.uploader.upload(pictureUpload.tempFilePath), { folder: 'userPictures/${req.body.token} 
      // });

      res.json({ result: true, url: resultCloudinary.secure_url });
  } catch (err) {
      res.json({ result: false, error: err.message });
  }
});

// router.post('/upload', async (req, res) => {
//   const photoPath = `./tmp/photo.jpg`;
//   const resultMove = await req.files.photoFromFront.mv(photoPath);

//   if (!resultMove) {
//     // téléchargement vers Cloudinary
//     const resultCloudinary = await cloudinary.uploader.upload(photoPath);
//     res.json({ result: true, url: resultCloudinary.secure_url });
//   } else {
//     res.json({ result: false, error: resultMove });
//   }
//   // supression du fichier temporaire
//   fs.unlinkSync(photoPath);
// });


// Screen infos perso ***********


// Route Put : /users/ :id 
// Modification des infos personnelles du user via son ID.
router.put('/:id', (req, res) => {
  const { username, email } = req.body; // on recupère les éléments de la requête
    User.findByIdAndUpdate(req.params.id, {username, email }, { new: true }) //via l'id qu'on reccupère, on change les valeurs suivantes/ new true = Cela permet de garantir que le document retourné contient les nouvelles valeurs après l'update.
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
      // Réponse avec l'utilisateur mis à jour
      return res.status(200).json(updatedUser);
    })
    .catch(err => {
      // En cas d'erreur
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    });
});

// Route Delete : /users/delete/ :id 
// Permet de supprimer son compte. Entraine une suppression des données du user (ses infos personnelles sont supprimées. Ses commentaires sont gardés mais ses infos passent en utilisateur inconnu). Entraine une déconnexion.

// Screen Dog signup ******************
router.post('/dog', async(req, res) => {
  const user = await User.findOne({ token: req.body.userToken });
  const dog = {
    name: req.body.name,
    size: req.body.size,
    photo: req.body.photo,
    race: req.body.race,
  }
  if (!user) {
    res.json({ result: false, error: "Utilisateur non trouvé" });
    return;
  } else {
    user.dogs.push(dog);
    await user.save();
    res.json({ message: 'Chien ajouté avec succès', dogs: user.dogs });
  }
})
// Enregistrement dans la base de données des infos du sous-document chien : nom, taille, race, photo.

// Screen Dog info **************************
// Route Put : /users/dog
// Modification des informations du sous-document chien.

// Route Get : /users/dog
// Affiche les informations du sous-document chien.

// Route Delete : /users/dog
// Supprime les infos du chien


module.exports = router;
