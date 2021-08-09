const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, 
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, 'User email required']
  },
  password: { type: String, 
    required: [true, 'Password is required'], 
    index: true, 
    minlength: 8//,
    // maxlength: 16,
    // trim: true 
  },
    roles: { type: [String], required: true }
});

userSchema.index({ email: 1}, { unique: true});


module.exports = mongoose.model("users", userSchema);