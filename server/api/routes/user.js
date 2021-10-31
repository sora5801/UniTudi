const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controllers");

router.post("/signup", usersController.addUsers);

router.post("/login", usersController.login);
router.patch('/:uid', usersController.updateUser);
router.get('/:uid',usersController.getUserInfo);

module.exports = router;
