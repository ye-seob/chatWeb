const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/chat");

//스키마
const chatSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});

const collection = new mongoose.model("chat", chatSchema);

module.exports = collection;
