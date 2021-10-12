// Ensure that only the right data makes it into the database
const { validationResult } = require('express-validator');

// Handles http error
const HttpError = require('../../models/http-error');

// This is used for password encryption
const bcrypt = require('bcrypt');

const Users = require('../../models/user');

/* Signup method */
const addUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let existingUser;
  try {
    existingUser = await Users.findOne({ email : req.body.email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.", 
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "You already have an account, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again", 
      500
    );
    return next(error);
  }

  const addedUser = new Users({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword, 
    tasks: [],
  });

  try {
    await addedUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({user: addedUser.toObject({ getters: true })});
};

/* Login method */
const userLogin = async (req, res, next) => {
  // Check if the user exits
  let exitingEmail;
  try {
    exitingEmail = await Users.findOne({ email: req.body.email });
  } catch(err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!exitingEmail) {
    const error = new HttpError(
      "Invalid emial or password, please try iy again.",
      401
    );
    return next(error);
  }

  // Check if the password is valid
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(req.body.password, exitingEmail.password);
  } catch(err) {
    const error = new HttpError(
      "Failed logging you in, please try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid emial or password, please try iy again.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

/* Update user's email method */
const updateUser = async (req, res, next) => {
  let updatedName = false, updatedEmail = false;
  try {
    if (req.body.name != undefined) {
      updatedName = true;
      await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: { name: req.body.name } });
    }
    if (req.body.email != undefined) {
      updatedEmail = true;
      await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: { email: req.body.email } });
    }
  } catch(err) {
    const error = new HttpError(
      "Failed updating the username.",
      500
    );
    return next(error);
  }

  if (updatedName && updatedEmail) {
    res.json({ message: "Username and email updated!" });
  } else if (updatedName) {
    res.json({ message: "Username updated!" });
  } else if (updatedEmail) {
    res.json({ message: "Email updated!" });
  } else {
    res.json({ message: "No information provided, so no updates were performed." });
  }
};

/* Delete accounts method */
const deleteUsers = async (req, res, next) => {
  let existingUserId;
  try {
    existingUserId = await Users.findByIdAndRemove({ _id: req.params.userId });
  } catch(err) {
    const error = new HttpError(
      "Failed deleting the user",
      500
    );
    return next(error);
  }

  res.json({ message: "User deleted." });
};


exports.addUsers = addUsers;
exports.userLogin = userLogin;
exports.updateUser = updateUser;
exports.deleteUsers = deleteUsers;