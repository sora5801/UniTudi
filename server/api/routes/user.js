const express = require('express');
const router = express.Router();

// GET method
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /user'
    });
});

router.get('/name', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /user/name'
    });
});

// POST method
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST requests to /user'
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