const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
app.use(cors());
const mongoose = require('mongoose');
app.use(bodyParser.json());

const taskRoutes = require('./api/routes/tasks');
const userRoutes = require('./api/routes/users');
const projectRoutes = require('./api/routes/projects');

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
//app.use('/project', projectRoutes);


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

