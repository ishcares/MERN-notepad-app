const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    securityQuestion: {
      type: String,
      required: true,
    },
    securityAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false } // removes "__v"
);

module.exports = mongoose.model("User", userSchema);
