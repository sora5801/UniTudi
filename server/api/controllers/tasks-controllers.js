const moment = require('moment');
const { validationResult } = require('express-validator');
const HttpError = require("../../models/http-error");

const Task = require('../../models/task');
const User = require('../../models/user')
const mongoose  = require("mongoose");

const getTaskById = async (req, res, next) => {
  const taskId = req.params.tid;

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a task.',
      500
    );
    return next(error);
  }

  if (!task) {
    const error = new HttpError(
      'Could not find task for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ task: task.toObject({ getters: true }) });
};

const getTasksByUserId = async (req, res, next) => {
  const userId = req.params.uid;

 
  let userWithTasks;
  try{
    userWithTasks= await User.findById(userId).populate('tasks');
  } catch (err) {
    const error = new HttpError('Fetching tasks failed, please try again later', 500);
    return next(error);
  }

  if (!userWithTasks || userWithTasks.tasks.length === 0) {
    return next(
      new HttpError("Could not find tasks for the provided User id.", 404)
      
    );
  }

  /*
  console.log(projectWithTasks);

try {
  await projectWithTasks.tasks.forEach(task => {
    if (moment(task.date).isAfter(moment(), 'day')){
      task.project = "UPCOMING";
    } else if (moment(task.date).isSame(moment(), 'day')){
      task.project = "TODAY";
    } else {
      project = "OVERDUE";
    }
  });
} catch (err) {
  const error = new HttpError(
    'Something went wrong, could not update task.',
    500
  );
  return next(error);
}
*/


  res.json({ tasks: userWithTasks.tasks.map(task => task.toObject({getters: true})) });
};



const createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
    const {name, description, date, creator} = req.body; 

    
/*
    let project1; 

    if(moment(date).isAfter(moment(), 'day')){
      project1 = "UPCOMING";
    } else if(moment(date).isSame(moment(), 'day')){
      project1 = "TODAY";
    }
    
*/
    const createdTask = new Task({
        name, 
        description,
        date,
        creator
    })
    

    let user;

    try {
      user = await User.findById(creator);
      } catch (err) {
        const error = new HttpError('Creating task failed, please try again', 500);
        return next(error);
      }
    
      if(!user) {
        const error = new HttpError('Could not find project for provided task', 404);
        return next(error);
      }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTask.save({session: sess});
        user.tasks.push(createdTask);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch(err){
        const error = new HttpError("Created task failed.", 500);
        return next(error);
    }

    res.status(201).json({task: createdTask});
};

const deleteTask = async (req, res, next) => {
    const taskId = req.params.tid;
    let task; 
    try{
        task = await Task.findById(taskId).populate('creator');
      }catch (err){
        const error = new HttpError('Something went wrong, could not delete task.', 500);
        return next(error);
      }
      if(!task) {
        const error = new HttpError('Could not find task for this id.', 404);
        return next(error);
      }
      try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await task.remove({session: sess});
        task.creator.tasks.pull(task);
        await task.creator.save({session: sess});
        await sess.commitTransaction();
      }catch (err){
        const error = new HttpError('Something went wrong, could not delete task.', 500);
        return next(error);
      }
      res.status(200).json({ message: "Deleted task." });
};

const updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, description, date } = req.body;
  const taskId = req.params.tid;

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update task.',
      500
    );
    return next(error);
  }

  task.name = name;
  task.description = description;
  task.date = date;

  try {
    await task.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update task.',
      500
    );
    return next(error);
  }

  res.status(200).json({ task: task.toObject({ getters: true }) });
}

exports.createTask = createTask; 
exports.deleteTask = deleteTask;
exports.updateTask = updateTask;
exports.getTasksByUserId = getTasksByUserId;
exports.getTaskById = getTaskById;