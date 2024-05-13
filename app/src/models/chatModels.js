const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 채팅 스키마 정의
const ChatSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
