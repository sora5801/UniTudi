// Ensure that only the right data makes it into the database
const { validationResult } = require('express-validator');

// Handles http error
const HttpError = require('../../models/http-error');

// This is used for password encryption
const bcrypt = require('bcrypt');

// Used for web token auth
const jwt = require('jsonwebtoken');

// Used for database access
const mongoose = require('mongoose');

const Users = require('../../models/user');
const Tasks = require('../../models/task');
const Project = require('../../models/project');

/**
 * User signup method
 */
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
      "User exists already, please login instead.",
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
    projects: [],
  });

  try {
    await addedUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: addedUser.id, email: addedUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ userId: addedUser.id, email: addedUser.email, token: token });
};

/**
 * User login method
 */
const userLogin = async (req, res, next) => {
  // Check if the user exists
  let existingEmail;
  try {
    existingEmail = await Users.findOne({ email: req.body.email });
  } catch(err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingEmail) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  // Check if the password is valid
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(req.body.password, existingEmail.password);
  } catch(err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid email or password, please try again.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id, 
    email: existingUser.email,
    token: token
  });
};

/**
 * Add tasks asscoiated with the user
 * @param {*} req task name and descreprion
 */
const addUserTasks = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let existingUserId = req.params.userId;
  const addedTask = new Tasks ({
    name: req.body.name,
    description: req.body.description,
    creator: existingUserId
  });

  try {
    await addedTask.save();
    await Users.findOneAndUpdate({ _id: existingUserId }, { $push: { tasks: addedTask._id } });
  } catch (err) {
    const error = new HttpError("Failed creating a task!", 500);
    return next(error);
  }

  res.status(201).json({ message: "Task created."});
};

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

/**
 * Get tasks asscoated with the user
 * @param {*} req userID
 * @returns array of tasks objects containing the userID
 */
const getUserTasks = async (req, res, next) => {
  let existingUserId = req.params.userId;
  let tasks = {};
  try {
    tasks = await Tasks.find({ creator: existingUserId });
  } catch(err) {
    const error = new HttpError(
      "Failed fetching tasks with the userID!",
      500
    );
    return next(error);
  }
  
  res.status(200).json(tasks);
};

/**
 * Update user info
 */
const updateUser = async (req, res, next) => {
  let output = "Updated ";
  try {
    if (req.body.name != undefined) {
      output += "name, ";
      await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: { name: req.body.name } });
    }
    if (req.body.email != undefined) {
      output += "email, ";
      await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: { email: req.body.email } });
    }
    if (req.body.password != undefined) {
      output += "password, ";
      encrypted_password = await bcrypt.hash(req.body.password, 12);
      await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: { password: encrypted_password } })
    }
    if (req.body.major != undefined) {
      output += "major, ";
      await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: { major: req.body.major } });
    }
    if (req.body.graduationDate != undefined) {
      output += "graduation date, ";
      await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: { graduationDate: req.body.graduationDate } });
    }
    if (req.body.availableHours != undefined) {
      output += "available hours, ";
      await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: { availableHours: req.body.availableHours } });
    }
  } catch(err) {
    const error = new HttpError(
      "Failed updating the username.",
      500
    );
    return next(error);
  }

  output = output.substr(0, output.length - 2);
  output += '!';
  res.json({
    _id: req.params.userId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    major: req.body.major,
    graduationDate: req.body.graduationDate,
    availableHours: req.body.availableHours
  });
};

/**
 * Delete users
 * @param {*} req userID
 */
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

  res.status(201).json({ user: userInfo });
};

// /**
//  * Delete tasks associated with the user
//  * @param {*} req userID
//  */
// const deleteUserTasks = async (req, res, next) => {
//   let existingUserId = req.params.userId; 
//   let taskId = req.body._id;
//   let task;

//   try {
//     task = await Users.findOne({ _id: existingUserId, task: taskId });
//   } catch(err) {
//     const error = new HttpError(
//       "Invalid",
//       500
//     );
//     return next(error);
//   }

//   if (!task) {
//     const error = new HttpError(
//       "taskId does not exist!",
//       500
//     );
//     return next(error);
//   }

//   res.json({ message: "Task deleted!"});
// };

exports.getUserInfo = getUserInfo;
exports.getUserTasks = getUserTasks;
exports.addUsers = addUsers;
exports.userLogin = userLogin;
exports.addUserTasks = addUserTasks;
exports.updateUser = updateUser;
exports.deleteUsers = deleteUsers;
