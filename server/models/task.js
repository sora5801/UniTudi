const mongoose = require('mongoose');

const Schema = mongoose.Schema 

const tasksSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('task', tasksSchema)