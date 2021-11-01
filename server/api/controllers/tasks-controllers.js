
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const HttpError = require('../../models/http-error');
const bcrypt = require('bcrypt');

const Users = require('../../models/user');
const Tasks = require('../../models/task');

//get all tasks function
exports.tasks_getall = (req,res,next) =>{
    Tasks.find()
    .select('name')
    .populate('creator')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            tasks: docs.map(doc => {
                return {
                    name: doc.name,
                    description: doc.description,
                    creator: doc.creator,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/tasks/' + doc._id
                    }
                }
            }),
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

//get task by task name
exports.tasks_findById =  (req,res,next) =>{
    Tasks.findById(req.params.num)
    .populate('user')
    .exec()
    .then(task => {
        if (!task){
            return res.status(404).json({
                message: "Task not found"
            })
        }
        res.status(200).json({
            task: task,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/task/id'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

}


exports.tasks_createNew = (req,res,next) =>{
    Users.findById(req.body.tasks)
        .then(user =>{
            if (!user){
                return res.status(404).json({
                    message: "User not found"
                });
            }
            const task = new task({
                creator : mongoose.Types.ObjectId(),
                name: req.body.quantity,
                description: req.body.productId
            });
            return task
            .save()  
        })
    
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.tasks_updateTask = (req, res, next) => {
    const id = req.params.creator;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Tasks.update({creator: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Task updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/task' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
    
}

exports.tasks_deleteTask = (req, res, next) => {
    const id = req.params.creator;
    Tasks.remove({creator: id}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Task deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/task',
                body: {name: 'String', description: 'String'}

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

}


