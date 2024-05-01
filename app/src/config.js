const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/chat");

connect
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch(() => {
    console.log("DB 연결 실패");
  });

//스키마
const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  id: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const collection = new mongoose.model("users", loginSchema);

module.exports = collection;
