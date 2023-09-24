const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    //pictures
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    //followers and following are arrays
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    //user is not admin by default
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true } //whenever you create user, automatically update timestamps
);

module.exports = mongoose.model("User", UserSchema);
