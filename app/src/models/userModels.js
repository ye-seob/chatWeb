// /src/models/userModels.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friendCount: {
    type: Number,
    default: 0,
  },
  friendList: [
    {
      friendId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

const collection = new mongoose.model("users", userSchema);

module.exports = collection;
