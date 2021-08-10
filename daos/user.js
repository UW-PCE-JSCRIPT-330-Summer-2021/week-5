const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
  if (!userObj.roles) {
    userObj.roles = ['user'];
  } else if (!userObj.roles.includes('user')) {
    userObj.roles.push('user');
  }
  return await User.create(userObj);
}

module.exports.getUser  = async (email) => {
  return await User.findOne({ email: email }).lean();
}

module.exports.updatePassword = async (userId, password) => {
  try {
    await User.updateOne( { _id: userId }, { $set: { password } });
    return true
  } catch (e) {
    res.sendStatus(401);
  }
}