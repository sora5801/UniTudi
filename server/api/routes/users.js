const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users-controllers');

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

// POST methods
router.post(
    '/signup',
    usersController.addUsers
);

router.post(
    '/login',
    usersController.userLogin
);
  

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
router.delete(
    '/:userId', 
    usersController.deleteUsers
);

module.exports = router;