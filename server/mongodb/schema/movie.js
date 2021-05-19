const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Movie = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        upVote: { type: Number, required: true },
        downVote: { type: Number, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('movies', Movie)