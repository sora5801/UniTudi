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

// POST method
/*
router.post('/', (req, res, next) => {
    const user = {
        id: req.body.id,
        name: req.body.user_name,
        email: req.body.email,
        password: req.body.password_hash
    };
    res.status(201).json({
        message: 'Handling POST requests to /user',
        user: user
    });
});
*/

router.post(
    '/signup',
    usersController.addUsers
  );

  router.post("/login", usersController.login);
  

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