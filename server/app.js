const express = require('express');
const bodyParser = require('body-parser');
//const cors = require("cors");
const app = express();
const mongoose = require('mongoose');
//app.use(cors());
app.use(bodyParser.json());

const HttpError = require("./models/http-error");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });
  

const taskRoutes = require('./api/routes/tasks');
const userRoutes = require('./api/routes/user');


app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);



app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});



app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});


mongoose.connect('mongodb+srv://mainDbUser:dw1SN5SPRhwk7yhZ@cluster0.rjaow.mongodb.net/uniduti?retryWrites=true&w=majority').then(() => {
    app.listen(5000);
}).catch(err => {
    console.log(err);
});