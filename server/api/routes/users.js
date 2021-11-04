const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users-controllers');

// GET method
router.get(
    '/:userId',
    usersController.getUserInfo
);

router.get(
    '/:userId/tasks',
    usersController.getUserTasks
);

// POST methods
router.post(
    '/signup',
    usersController.addUsers
);

router.post(
    '/login',
    usersController.userLogin
);

router.post(
    '/:userId/tasks',
    usersController.addUserTasks
);
  
// PATCH methods
router.patch(
    '/:userId',
    usersController.updateUser
);


// DELETE methods
router.delete(
    '/:userId', 
    usersController.deleteUsers
);

module.exports = router;