const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/chat");
    console.log("DB 연결 성공");
  } catch (error) {
    console.error("DB 연결 실패:", error);
  }
}

module.exports = connectToDatabase;
