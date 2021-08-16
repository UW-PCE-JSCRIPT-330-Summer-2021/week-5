const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
  userObj.roles = ['user'];
  return await User.create(userObj)
}

module.exports.getUser = async (userEmail) => {
  return await User.findOne({ email: userEmail }).lean()
}

module.exports.updateUserPassword = async (userId, password) => {
  return await User.updateOne({ _id: userId }, { $set: { password: password } })
}
