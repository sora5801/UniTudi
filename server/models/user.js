const { Int32, Double } = require('bson');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true} ,
    email: { type: String, required: true}, 
    password: { type: String, required: true},
    major: { type: String, required: false},
    graduationDate: { type: String, required: false},
    avaliableHours: { type: Number, required: false},
    tasks: [{type: mongoose.Types.ObjectId, required: true, ref: 'task'}]
});

module.exports = mongoose.model('User', userSchema);