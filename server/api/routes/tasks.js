const express = require('express');
const router = express.Router();

const tasksControllers = require('../controllers/tasks-controllers');

router.get("/user/:uid", tasksControllers.getTasksByUserId);
//router.get("/user/:uid/:pid", tasksControllers.getTasksByUserIdAndProjectId);
router.get('/:tid', tasksControllers.getTaskById);

router.delete('/:tid', tasksControllers.deleteTask); 
router.post("/", tasksControllers.createTask);
router.patch('/:tid', tasksControllers.updateTask);

module.exports = router;