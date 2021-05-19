const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        user: { type: String, required: true },
        movieId: { type: String, required: true },
        upVote: { type: Number, required: true },
        downVote: { type: Number, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('users', User)