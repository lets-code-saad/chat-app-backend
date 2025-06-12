const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String },
    gender: { type: String, enum: ["male", "female"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", signupSchema);
