const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  password:  { type: String, required: true},
  email: { type: String, unique: true, index:true, required: true},
  roles: { type: [String], required: true }
});

userSchema.index({ email: 'text' });

module.exports = mongoose.model("users", userSchema);