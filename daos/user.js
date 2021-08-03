const User = require('../models/user');

const bcrypt = require('bcrypt');

module.exports = {};

module.exports.createUser = async (user) => {
    try {

        user.roles = [];
        user.roles[0] = 'user';
        user.password = await bcrypt.hash(user.password,10);
        return await User.create(user);

    } catch(e) {
        throw new Error('Could not create user');
    }
}

module.exports.getUserByEmail = async (userEmail) => {
    try {
        const user = await User.findOne({ email: userEmail }).lean();
        return user;
    } catch(e) {
        throw new Error('User not found');
    }
}

module.exports.getUserById = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId }).lean();
        return user;
    } catch(e) {
        throw new Error('User not found');
    }
}

module.exports.updateUserById = async (userId, password) => {
    try {
        const hashPWD = await bcrypt.hash(password, 10);

        const user = await User.updateOne(
            { _id: userId },
            { $set: {password: hashPWD}}
        ).lean();
        
        return user;
    } catch (e) {
        throw new Error('Unable to update user');
    }
}