var express = require('express');
var router = express.Router();

const Place = require('../models/places');
const Comment = require('../models/comments');

/* GET users listing. */
router.get('/', function (req, res, next) {
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
// Un lieu est rajouté dans la base de données s’il n’existe pas encore.
router.post('/addPlace', async (req, res) => {
	const place = await Place.findOne({ name: req.body.name })
	const comment = await Comment.findOne({ token: req.body.token })
	if (place) { //si le lieu est déjà enregistré dans la bdd
		res.json({ result: false, error: "Lieu déjà enregistré" });
		return;
	} else if (comment) { // si l'utilisateur laisse un premier avis
		const newPlace = new Place({
			name: req.body.name,
			type: req.body.type,
			adress: req.body.adress,
			feedback: 1,
			sizeAccepted: req.body.size,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			comments: [comment._id]
		})
		const result = await newPlace.save()
		res.json({ message: 'Lieu ajouté avec succès', place: result });
	} else { // si jamais l'utilisateur ne laisse pas de premier avis
		const newPlace = new Place({
			name: req.body.name,
			type: req.body.type,
			adress: req.body.adress,
			feedback: 1,
			sizeAccepted: req.body.size,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
		})
		const result = await newPlace.save()
		res.json({ message: 'Lieu ajouté avec succès', place: result });
	}
})

// POP UP LIEU *************
// Route Get : /places/ :id 
// Affiche le lieu sous forme de pop up grâce à son ID. Insertion d’un populate pour affichage des commentaires liés au lieu avec pseudo et photo de profil de l’utilisateur qui l’a écrit.

// Route Put : /places/ addFeedback/ :id
// Modifie le nombre de feedback et la taille du chien.

// Route Put : /places/favoris/ :id 
// Grâce à l’ID du lieu on le rajoute aux favoris


module.exports = router;




