const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')

const cors = require('cors')

const {
    notFoundHandler,
    errorHandler
} = require('./middleware')
const boardHandler = require('./api/boardHandler')
const listHandler = require('./api/listHandler')
const cardHandler = require('./api/cardHandler')
const userHandler = require('./api/userHandler')
const activityHandler = require('./api/activityHandler')

require('dotenv').config()

const app = express()
app.use(cors()) 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

try {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    console.log("Connected to MongoDB...");
} catch (error) {
    console.log("Connection failed", error);
}

app.use(morgan('tiny'))
app.use(helmet())

app.use(express.json())
app.use('/api/user/', userHandler)
app.use('/api/boards/', boardHandler)
app.use('/api/lists/', listHandler)
app.use('/api/cards/', cardHandler)
app.use('/api/activities/', activityHandler)
app.use(errorHandler)

app.use(notFoundHandler)

module.exports = app