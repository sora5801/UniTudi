const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controllers");

router.post("/signup", usersController.addUsers);

router.post("/login", usersController.login);
router.patch("/update", usersController.updateUser);

module.exports = router;
