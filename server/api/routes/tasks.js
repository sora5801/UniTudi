const express = require('express');
const router = express.Router();

// GET method
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks'
    });
});

router.get('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks/name'
    });
});

router.get('/:description', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks/descripton'
    });
});


// POST method
router.post('/', (req, res, next) => {
    // return 201 and upload data
    const { MongoClient } = require('mongodb');
    const uri = "mongodb+srv://mainDbUser:dw1SN5SPRhwk7yhZ@cluster0.rjaow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    MongoClient.connect(uri, function(err, db){
        if (err) throw err;
        var db_client = db.db("uniduti");
        var myobj = { user_name: "3xuser", task_name: "go to dentist" };
        db_client.collection("tasks").insertOne(myobj, function(err, res){
            if (err) throw err;
            console.log("task insert successful");
            db.close();
        })
    }) 

    const task = {
        name: req.body.name,
        description: req.body.description
    };
    res.status(201).json({
        message: 'Handling POST requests to /tasks',
        createdTask: task
    });
});


// PATCH methods
router.patch('/', (req, res, next) => {
    res.status(200).json({
        message: 'Updated!'
    });
});

router.patch('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Updated name!'
    });
});

router.patch('/:description', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks'
    });
});

// DELETE methods
router.delete('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted task name!'
    });
});

router.delete('/:description', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted task description!'
    });
});

module.exports = router;