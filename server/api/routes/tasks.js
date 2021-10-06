const express = require('express');
const router = express.Router();

// GET method
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks'
    });
});

router.get('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks/name'
    });
});

router.get('/:description', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks/descripton'
    });
});


// POST method
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST requests to /tasks'
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

router.patch('/:description', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks'
    });
});

// DELETE methods
router.delete('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted task name!'
    });
});

router.delete('/:description', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted task description!'
    });
});

module.exports = router;