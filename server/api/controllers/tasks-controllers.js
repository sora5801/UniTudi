const User = require('../../models/user');
const HttpError = require("../../models/http-error");

const Task = require('../../models/task');
const mongoose  = require("mongoose");

const createTask = async (req, res, next) => {
    const {name, description, creator} = req.body; 

    const createdTask = new Task({
        name, 
        description,
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
        const error = new HttpError('Could not find user for provided id', 404);
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

exports.createTask = createTask; 
exports.deleteTask = deleteTask;