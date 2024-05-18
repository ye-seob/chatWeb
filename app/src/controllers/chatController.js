const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModels");

const createChatRoom = async (req, res) => {
  const { friendId, friendName } = req.body;
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ student_id: userId });

    const friend = await User.findOne({ student_id: friendId });
    if (!user || !friend) {
      return res.status(404).json({ error: "User not found" });
    }
    // 기존 채팅방이 있는지 확인
    const existingChatRoom = await ChatRoom.findOne({
      participants: { $all: [user._id, friend._id] },
    });

    if (existingChatRoom) {
      return res.status(200).json({ message: "Chat room already exists" });
    }

    const chatRoom = new ChatRoom({
      roomName: `${user.name}와(과) ${friendName}의 채팅방`,
      participants: [user._id, friend._id],
      messages: [],
    });

    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getChatRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId)
      .populate("participants", "name")
      .populate("messages");
    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

function getChatInfo(req, res) {
  const student_id = req.session.student_id;

  if (!student_id) {
    return res.status(401).json({ error: "Unauthorized" }); // 세션에 student_id가 없을 경우
  }

  User.findOne({ student_id: student_id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 사용자가 참여하고 있는 채팅방 찾기
      ChatRoom.find({ participants: user._id })
        .then((chatRooms) => {
          res.json({
            username: user.name,
            chatRooms: chatRooms,
          });
        })
        .catch((err) => {
          return res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: "Internal server error" });
    });
}
module.exports = {
  createChatRoom,
  getChatRoom,
  getChatInfo,
};
