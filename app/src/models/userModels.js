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
      _id: false, //  _id 생성 방지
    },
  ],
});

const collection = mongoose.model("users", userSchema);

module.exports = collection;
