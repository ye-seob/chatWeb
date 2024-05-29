const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModels");
const Message = require("../models/chatModels");

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

module.exports = {
  laodMessages,
  sendMessage,
};
