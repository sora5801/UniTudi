const { validationResult } = require('express-validator');

const Users = require('../../models/users');

const addUsers = async (req, res, next) => {
  const { name, email, password } = req.body;

    const addedUser = new Users({
        name, 
        email, 
        password,
    });
    console.log(addedUser);
    try {
        await addedUser.save();
      } catch (err) {
        console.log("Failed");
        return next(err);
      }

    res.status(201).json({user: addedUser.toObject({ getters: true })});
}

exports.addUsers = addUsers;