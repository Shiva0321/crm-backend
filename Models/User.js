const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Password will be stored as plain text
});

// Create a Mongoose model for the User schema
const User = mongoose.model('User', UserSchema);
module.exports = User;
