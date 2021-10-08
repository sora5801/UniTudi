const Users = require('../models/users');

const addUsers = async (req, res, next) => {
    const addedUser = new Users({
        name, 
        email, 
        password,
    })
    await addedUser.save();

    res.status(201).json({place: addedUser})
}