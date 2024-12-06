const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    name: String,
    type: String,
    adress: String,
    feedback: Number,
    sizeAccepted: String,
    comments: {type: mongoose.Schema.Types.ObjectId, ref: 'comments'},
})

const Place = mongoose.model("places", placeSchema);

module.exports = Place;