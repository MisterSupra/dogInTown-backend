var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const os = require('os');  // Utilisation de os.tmpdir() pour récupérer le répertoire temporaire

// Utiliser le répertoire temporaire /tmp qui est accessible en écriture sur Vercel
const tempDir = os.tmpdir();  // Utilisation du répertoire temporaire disponible



// Connexion ************
router.post('/connection', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username });
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
        avatar: req.body.avatar,
        postCode: req.body.postCode,
        dogs: [],
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, username: newDoc.username });
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

    // Utilisez le répertoire temporaire de Vercel pour les fichiers temporaires
    const tempFilePath = path.join(os.tmpdir(), 'photo.jpg');

    // Déplacer le fichier temporaire dans ce répertoire
    await pictureUpload.mv(tempFilePath);
    // on upload sur cloudinary
    const resultCloudinary = await cloudinary.uploader.upload(tempFilePath);
    
    // Supprimer le fichier temporaire après l'upload
    fs.unlinkSync(tempFilePath);

    res.json({ result: true, url: resultCloudinary.secure_url });
  } catch (err) {
      res.json({ result: false, error: err.message });
  }
});


// Screen infos perso ***********
// Route Get :/users/ :token
router.get('/:token', (req, res) => {
  // Regex to find places regardless of nickname case
  User.find({ token: req.params.token }).then(data => {
      res.json({ result: true, profilUser: data });
  });
});
// Route Put : /users/ :token
// Modification des infos personnelles du user via son token.
router.put('/:token', (req, res) => {
  const { username, email, password } = req.body; // on recupère les éléments de la requête
    User.findByIdAndUpdate(req.params.token, {username, email, password }, { new: true }) //via le token qu'on reccupère, on change les valeurs suivantes/ new true = Cela permet de garantir que le document retourné contient les nouvelles valeurs après l'update.
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

router.put('/dog/:token', (req, res) => {
  const token = req.params.token;

  const dogName = req.body.dogName;
  const race = req.body.race;
  const size = req.body.size;
  const newName = req.body.name;  

  User.findOne({ token })
    .then((user) => {
      if (!user) {
        console.log('User not found');
      }

      const dog = user.dogs.find((e) => e.name === dogName);
      if (!dog) {
        console.log('dog not found');
      }
      
      if (newName) {
        dog.name = newName;
      }
      if (race) {
        dog.race = race;
      }
      if (size) {
        dog.size = size;
      }

      return user.save();
    }).then((updatedUser) => {
      console.log(updatedUser)
      res.json({ result: true, user: updatedUser })
    });
});


// Route Get : /users/dog
// Affiche les informations du sous-document chien.

router.get('/dog/:token', (req, res) => {
  console.log(`received ${req.params.token}`)
  User.findOne({ token: req.params.token })
    .then(data => {
      if (data) {
      console.log(data)
      res.json({ result: true, dogs: data.dogs });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
  }
);

// Route Delete : /users/dog
// Supprime les infos du chien


module.exports = router;
