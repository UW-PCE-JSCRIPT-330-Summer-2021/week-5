const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {};

module.exports.getUser = async (userEmail) => {
  const user = await User.findOne({ email: userEmail }).lean();
  return user;
}

module.exports.createUser = async (userObj) => {
  try {
    userObj.roles = ['user'];
    const createdUser = await User.create(userObj);
    return createdUser;
  } catch (e) {
    throw e;
  }
}

module.exports.updatePassword = async (userId, password) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return false;
  }
  try {
    await User.updateOne({ _id: userId }, { $set: { password: password } });
    return true;
  } catch (e) {
    throw e;
  }
}
