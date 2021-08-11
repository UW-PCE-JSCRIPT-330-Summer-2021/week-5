const User = require('../models/user');

module.exports = {};

module.exports.getUser = async (email) => {
  return await User.findOne({ email: email }).lean();
}

module.exports.updateUserPassword = async (userId, password) => {
  return  await User.updateOne({ _id: userId }, {$set: {'password': password}});
}

module.exports.createUser = async (userObject) => {
  return await User.create(userObject);
}

module.exports.getUserById = async (userId) => {
    return await User.findOne({_id: userId}).lean();
  }

  module.exports.updateRoles = async (email, role) => {
    return await User.updateOne({ email: email }, { $set: { roles: role} });
  }




