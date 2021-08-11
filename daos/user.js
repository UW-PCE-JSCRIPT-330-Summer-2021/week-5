const User = require('../models/user');
module.exports = {};

module.exports.createUser = async (userObj) => {
  try {
    userObj.roles = ['user'];
    const newUser = await User.create(userObj);
    return newUser;
  } catch (e) {
    throw (e);
  }
}

module.exports.getUser = async (email) => {
  const user = await User.findOne({ email: email }).lean();
  return user;
}

module.exports.updateUserPassword = async (userId, password) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { password: password }});
    return true;
  } catch (e) {
    throw (e);
  }
}