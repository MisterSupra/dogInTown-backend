var express = require('express');
var router = express.Router();

const Place = require('../models/places');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// FAVORIS *************
// Route Get : /places/displayFavoris
// Affiche la liste des lieux en favoris

// Route Delete : /places/deleteFavoris/ :id 
// On supprime un lieu des favoris via son ID

// Screen Map **********
// Route Get : /places
// Affichage des lieux (sous forme de tableau) présents en base de données en fonction du nombre de référencements (affiché si supérieur à 10). 


// POP UP LIEU --- AJOUTER *************
// Route Post : /places/addPlace 
// Un lieu est rajouté dans la base de données s’il n’existe pas encore.
router.post('/addPlace', (req, res) => {
  Place.findOne({ name: { $regex: new RegExp(req.body.name, 'i') } }).then(dbData => {
		if (dbData === null) {
      fetch(`https://api${req.body.name}&appid=${API_KEY}`)
				.then(response => response.json())
				.then(apiData => {
					// Creates new document with place data
					const newPlace = new Place({
						name: req.body.name,
						type: req.body.type,
						adress: req.body.adress,
						feedback: 1,
						sizeAccepted: req.body.sizeAccepted,
            comments: [],
					});

					// Finally save in database
					newPlace.save().then(newDoc => {
						res.json({ result: true, place: newDoc });
					});
				});
		} else {
			// Place already exists in database
			res.json({ result: false, error: 'Place already saved' });
		}
	});
})

// POP UP LIEU *************
// Route Get : /places/ :id 
// Affiche le lieu sous forme de pop up grâce à son ID. Insertion d’un populate pour affichage des commentaires liés au lieu avec pseudo et photo de profil de l’utilisateur qui l’a écrit.

// Route Put : /places/ addFeedback/ :id
// Modifie le nombre de feedback et la taille du chien.

// Route Put : /places/favoris/ :id 
// Grâce à l’ID du lieu on le rajoute aux favoris


module.exports = router;




