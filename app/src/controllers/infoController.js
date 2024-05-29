const ChatRoom = require("../models/chatRoomModel");
const collection = require("../models/userModels");

function getUserInfo(req, res) {
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "세션이 만료 됐습니다" });
  }

  collection
    .findOne({ student_id: userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "등록되지 않은 유저입니다" });
      }
      res.json({
        username: user.name,
        friendList: user.friendList,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: "서버 에러 발생" });
    });
}

async function getRoomName(req, res) {
  const chatRoom = await ChatRoom.findById(req.query.roomId);

  if (!chatRoom) {
    return res.status(404).json({ error: "채팅 방을 찾을 수 없습니다" });
  }
  res.json({ roomName: chatRoom.roomName });
}

async function getUserId(req, res) {
  if (req.session) {
    res.json({ userId: req.session._id });
  } else {
    res.status(401).send("세션이 만료 됐습니다");
  }
}

module.exports = {
  getUserInfo,
  getRoomName,
  getUserId,
};
