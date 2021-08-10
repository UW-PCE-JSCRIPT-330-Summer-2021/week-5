const User = require('../models/user');

const bcrypt = require('bcrypt');

module.exports = {};

module.exports.signUp = async (email, password) => {
    let user = await User.findOne({
        email: email
    });
    if (user) {
        return false;
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        //allows for a new user to signup
        try {
            const newUser = await User.create({
                email: email,
                password: hashedPassword,
                roles: ['user']
            });
            return newUser;
        } catch (e) {
            throw e;
        }
    }
};

module.exports.login = async (userData) => {
    const user = await User.findOne({
        email: userData
    }).lean();
    if (!user) {
        return false;
    } else {
        return user;
    }
};

module.exports.changePassword = async (email, password) => {
    const user = await User.findOne({
        email: email
    });
    if (!user) {
        return false;
    } else {
        const updatedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.updateOne(
            { email: email },
            { password: updatedPassword }
        );
        return updatedUser;
    }
};

module.exports.removePassword = async (email) => {
    let user = await User.findOne(
        { email: email },
        { password: 0 }
    );
    if (!user) {
        return false;
    } else {
        return user;
    }
};