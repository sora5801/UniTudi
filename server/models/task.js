const mongoose = require('mongoose');

const Schema = mongoose.Schema 

const taskSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: String, required: true},
    //project: {type: mongoose.Types.ObjectId, required: true, ref: 'project'}
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('task', taskSchema)