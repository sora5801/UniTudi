const express = require('express')
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const taskRoutes = require('./api/routes/tasks');
const userRoutes = require('./api/routes/users');

// Connect to DB
mongoose.connect('mongodb+srv://mainDbUser:dw1SN5SPRhwk7yhZ@cluster0.rjaow.mongodb.net/uniduti?retryWrites=true&w=majority', 
{
    useMongoClient: true
});

// Parse data from the frontend and convert it to json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Prevent CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("'Access-Control-Allow-Headers", 
                "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 
        'POT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;