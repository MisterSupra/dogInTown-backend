const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: String,
    date: String,
    photos: Array,
    username: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
})

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;