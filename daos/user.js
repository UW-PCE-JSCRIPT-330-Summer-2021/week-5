const User = require('../models/user');

module.exports = {};

module.exports.getUser = async (email) => {
    try {
        const foundUser = await User.findOne({ email: email }).lean();
        return foundUser;
    } catch (e) {
        next(e);
    }
};

module.exports.updateUserPassword = async (userId, password) => {
    try {
        const updatedUser = User.updateOne({ _id: userId }, { $set: { password: password } }).lean();
        return updatedUser;
    } catch (e) {
        next(e);
    }
};

module.exports.createUser = async (user) => {
    try {
        user.roles = ['user'];
        const createUser = await User.create(user);
        return createUser;
    } catch (e) {
        next(e);
    }
};
