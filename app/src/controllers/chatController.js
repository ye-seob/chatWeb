const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModels");
const Message = require("../models/chatModels");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const sendMessage = async (req, res) => {
  const { roomId, message } = req.body;
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "세션이 만료 됐습니다" });
  }

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ error: "채팅 방을 찾을 수 없습니다" });
    }

    const user = await User.findOne({ student_id: userId });
    if (!user) {
      return res.status(404).json({ error: "등록되지 않은 유저입니다" });
    }
    const newMessage = new Message({
      senderId: user._id,
      senderName: user.name,
      text: message,
      timestamp: new Date(),
    });

    await newMessage.save();
    chatRoom.messages.push(newMessage);
    await chatRoom.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "서버 통신 에러 발생" });
  }
};

const laodMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId).populate("messages");
    if (!chatRoom) {
      return res.status(404).json({ error: "채팅 방을 찾을 수 없습니다" });
    }
    res.json(chatRoom.messages);
  } catch (error) {
    res.status(500).json({ error: "서버  에러 발생" });
  }
};
const sendImg = async (req, res) => {
  const roomId = req.body.roomId;
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "세션이 만료 됐습니다" });
  }
  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ error: "채팅 방을 찾을 수 없습니다" });
    }

    const user = await User.findOne({ student_id: userId });
    if (!user) {
      return res.status(404).json({ error: "등록되지 않은 유저입니다" });
    }

    let imgFilePath = "";
    if (req.file) {
      const outputFilePath = `images/resized_${Date.now()}${path.extname(
        req.file.originalname
      )}`;
      await sharp(req.file.path)
        .resize({ width: 300, height: 300, fit: "contain" }) // 비율 유지, 크기 조정
        .toFile(outputFilePath);
      imgFilePath = `/${outputFilePath}`;
    }

    const newMessage = new Message({
      senderId: user._id,
      senderName: user.name,
      imgFile: imgFilePath,
      timestamp: new Date(),
    });

    await newMessage.save();

    chatRoom.messages.push(newMessage);

    await chatRoom.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error); // 에러 로그 추가
    res.status(500).json({ error: "서버 통신 에러 발생" });
  }
};

module.exports = {
  laodMessages,
  sendMessage,
  sendImg,
};
