const mongoose = require('mongoose')
const url = "mongodb+srv://anil:zoy2WQRxHgzAbqvH@cluster0.tylcs.mongodb.net/cinema";

mongoose
    .connect(url, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db