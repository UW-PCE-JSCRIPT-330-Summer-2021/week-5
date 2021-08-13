const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    try {
        userObj.roles = ['user'];
        return await User.create(userObj);
    } catch (e) {
        throw e
    }
};

module.exports.getUser = async (email) => {
    try {
        return await User.findOne({ email: email }).lean();
    } catch (e) {
        throw e
    }
};

module.exports.updatePassword = async (userId, password) => {
    try {
        return await User.updateOne({ _id: userId }, { $set: { password: password }} );
    } catch (e) {
        throw e
    }
};