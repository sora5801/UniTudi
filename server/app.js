const express = require('express')
const app = express();

const taskRoutes = require('./api/routes/tasks');
const userRoutes = require('./api/routes/user');

app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);

module.exports = app;