const User = require('../models/user');

module.exports = {};

module.exports.getAll = () => {
    return User.find().lean()
}

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
module.exports.removeById = (userId) => {
    return User.findOneAndDelete({ _id: userId })
}