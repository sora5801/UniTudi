const { validationResult } = require("express-validator");
const HttpError = require("../../models/http-error");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const Users = require("../../models/user");

const addUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password, major, graduationDate } = req.body;


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
    major,
    graduationDate,
    projects: [],
  });

  try {
    await addedUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

    let token;
    try{
    token = jwt.sign(
      { userId: addedUser.id, email: addedUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ userId: addedUser.id, email: addedUser.email, token: token});
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

  let token;
    try{
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

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password, major, graduationDate, availableHours } =
    req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await Users.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  user.name = name;
  user.email = email;
  if (password === "") {
    user.password = user.password;
  } else {
    user.password = await bcrypt.hash(password, 12);
  }
  user.major = major;
  user.graduationDate = graduationDate;
  user.availableHours = availableHours;

  try {
    user.markModified("name");
    user.markModified("email");
    user.markModified("major");
    user.markModified("password");
    user.markModified("graduationDate");
    user.markModified("availableHours");
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

/**
 * Get user info
 * @param {*} req userID
 * @returns users object containing the userID
 */
const getUserInfo = async (req, res, next) => {
  let userInfo;
  try {
    userInfo = await Users.findOne({ _id: req.params.uid });
  } catch (err) {
    const error = new HttpError(
      `Failed fetching the user with id ${req.params.uid}!`,
      500
    );
    return next(error);
  }

  res.status(201).json({ user: userInfo });
};

exports.addUsers = addUsers;
exports.login = login;
exports.updateUser = updateUser;
exports.getUserInfo = getUserInfo;