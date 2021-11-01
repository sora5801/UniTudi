const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasks-controllers');

// GET all tasks function
router.get('/', tasksController.tasks_getall);

// Get a task by task num
router.get('/:num', tasksController.tasks_findById);



// POST method
router.post('/', tasksController.tasks_createNew);


// PATCH methods
router.patch('/', tasksController.tasks_updateTask );

// DELETE method
router.delete('/:name', tasksController.tasks_deleteTask);


module.exports = router;