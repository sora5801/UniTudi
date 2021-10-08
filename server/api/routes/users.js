const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
// GET method
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /users'
    });
});

router.get('/name', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /users/name'
    });
});

// POST methods
router.post('/', (req, res, next) => {
    const user = new User({
        id: new mongoose.Types.ObjectId(),
        name: req.body.user_name,
        email: req.body.email,
        password: req.body.password_hash
    });
    user
    .save()
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST requests to /users',
        user: user
    });
});


// PATCH methods
router.patch('/', (req, res, next) => {
    res.status(200).json({
        message: 'Updated!'
    });
});

router.patch('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Updated name!'
    });
});

router.patch('/:password', (req, res, next) => {
    res.status(200).json({
        message: 'Updated password!'
    });
});

// DELETE methods
router.delete('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted user name!'
    });
});

router.delete('/:password', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted user password!'
    });
});

module.exports = router;