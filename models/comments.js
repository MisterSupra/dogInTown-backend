const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: String,
    date: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    token: String,
})

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;