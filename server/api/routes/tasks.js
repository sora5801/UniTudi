const express = require('express');
const router = express.Router();

const tasksControllers = require('../controllers/tasks-controllers');


router.delete('/:tid', tasksControllers.deleteTask) 
router.post("/", tasksControllers.createTask)

module.exports = router;