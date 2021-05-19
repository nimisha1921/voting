const express = require('express')
const path = require("path");
const cookieParser = require('cookie-parser');
const movieRouter = require('./routes/movie');
const utility = require('./utility');

const db = require('./mongodb/db');

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();


app.use(cookieParser());

const rootDirectory = path.resolve(__dirname, "../build/");
app.use(express.static(rootDirectory));

app.use(express.json());



app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (!req.cookies || !req.cookies.user) {
        const newUser = utility.generateString(12);
        //for one hour user is stored in cookie
        res.cookie('user', newUser, { maxAge: 3600000 });
    }
    next();
})

app.use('/api', movieRouter);


const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})