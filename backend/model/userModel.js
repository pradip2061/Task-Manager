const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  name: String,
  email: { type: String, unique: true },
  profilepic: String,
});

module.exports = mongoose.model("User", userSchema);