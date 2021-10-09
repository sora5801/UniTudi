// Ensure that only the right data makes it into the database
const { validationResult } = require('express-validator'); // Ensure that only the right data makes it into the database

// This is used for password encryption
const bcrypt = require('bcrypt');
const Users = require('../../models/users');

const addUsers = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const addedUser = new Users({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });

      const doAdd = async (req, res, next) => {
        console.log(addedUser);
        try {
          await addedUser.save();
        } catch(err) {
          console.log("Failed");
          return next(err);
        }
      };

      doAdd();

      res.status(201).json({user: addedUser.toObject({ getters: true })});
    }
  })
}

exports.addUsers = addUsers;