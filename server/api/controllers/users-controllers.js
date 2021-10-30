const { validationResult } = require("express-validator");
const HttpError = require("../../models/http-error");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const Users = require("../../models/user");

const addUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await Users.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }

  
  const addedUser = new Users({
    name,
    email,
    password: hashedPassword, 
    projects: [],
  });



  try {
    await addedUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: addedUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await Users.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again .",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }


  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true })
  });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await Users.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }

  user.name = name;
  user.email = email;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
}

/**
 * Get user info
 * @param {*} req userID
 * @returns users object containing the userID
 */
 const getUserInfo = async (req, res, next) => {
  let userInfo;
  try {
    userInfo = await Users.findOne({_id : req.params.userId });
  } catch(err) {
    const error = new HttpError(
      `Failed fetching the user with id ${req.params.userId}!`,
      500
    );
    return next(error);
  }

  res.status(201).json({user: userInfo})
}

exports.addUsers = addUsers;
exports.login = login;
exports.updateUser = updateUser;
exports.getUserInfo = getUserInfo;