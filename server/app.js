const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
app.use(cors());
const mongoose = require('mongoose');
app.use(bodyParser.json());

const taskRoutes = require('./api/routes/tasks');
const userRoutes = require('./api/routes/users');

app.use('/task', taskRoutes);
app.use('/user', userRoutes);

mongoose.connect('mongodb+srv://mainDbUser:dw1SN5SPRhwk7yhZ@cluster0.rjaow.mongodb.net/uniduti?retryWrites=true&w=majority').then(() => {
    app.listen(5000);
}).catch(err => {
    console.log(err);
});

