const User = require('../models/user');
module.exports = {};

module.exports.createUser = async (userObj) => {
  const newUser = await User.create(userObj);
  return newUser;
}

module.exports.getUser = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
}

module.exports.updateUserPassword = async (email, password) => {
  const updatedPassword = await User.updateOne({ _id: email }, { $set: { password: password }});
  return updatedPassword;
}