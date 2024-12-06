const mongoose = require('mongoose');

const dogSchema = mongoose.Schema({
    name: String,
    size: String,
    photo: String,
    race: String
})

const userSchema = mongoose.Schema({
    username : String,
    email: String,
    password: String,
    avatar: String,
    token: String,
    postCode: String,
    dogs: dogSchema,
})

const User = mongoose.model("users", userSchema)

module.exports = User