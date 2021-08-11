const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {};

//Create: user
module.exports.createUser = async (userObj) => {
    userObj.roles = ["user"];
    //create a user object
    const created = await User.create(userObj);
    return created;
};

//Get: user
module.exports.getUser = async (email) => {
    //find one user based on their email
    return await User.findOne ({ email: email });
};

//Update: user password
module.exports.updateUserPassword = async (userId, password) => {
    //update the user password based on their userId and passowrd
    await User.updateOne ({ _id: userId }, { $set: { password: password } });
    return true;
};