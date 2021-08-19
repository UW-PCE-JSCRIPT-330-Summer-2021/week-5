const User = require('../models/user');

module.exports = {};

module.exports.createUser = (userObj) => {
    if (!userObj.roles) {
        userObj.roles = ["user"];
    }
    return User.create(userObj);
}

module.exports.getUser = (email) => {
    return User.findOne({ email: email }).lean();
}

module.exports.updateUserPassword = (userId, password) => {
    return User.updateOne({ _id: userId }, { $set: { 'password': password } });
}
