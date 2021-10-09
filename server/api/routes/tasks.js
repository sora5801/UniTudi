const express = require('express');
const router = express.Router();

const tasksControllers = require('../controllers/tasks-controllers');

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
/*
router.post('/', (req, res, next) => {
    const task = {
        name: req.body.name,
        description: req.body.description
    };
    res.status(201).json({
        message: 'Handling POST requests to /tasks',
        createdTask: task
    });
});
*/


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


router.delete('/:tid', tasksControllers.deleteTask) 
router.post("/", tasksControllers.createTask)

module.exports = router;