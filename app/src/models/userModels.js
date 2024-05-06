// /src/models/userModels.js
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/chat");

const loginSchema = new mongoose.Schema({
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
  friends: {
    type: Number,
    default: 0,
  },
});

const collection = new mongoose.model("users", loginSchema);

module.exports = collection;
