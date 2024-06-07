const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModels");
const Message = require("../models/chatModels");

async function createChatRoom(req, res) {
  const { friendIds, friendName } = req.body;
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "세션이 만료 됐습니다" });
  }

  try {
    const user = await User.findOne({ student_id: userId });

    if (!user) {
      return res.status(404).json({ error: "등록되지 않은 유저" });
    }

    let friends = [];

    for (const friendId of friendIds) {
      const friend = await User.findOne({ student_id: friendId });

      if (!friend) {
        return res.status(404).json({ error: "등록되지 않은 유저입니다" });
      }

      friends.push(friend);
    }

    const allParticipants = [user, ...friends];

    const participantIds = allParticipants.map(
      (participant) => participant._id
    );

    const existingChatRoom = await ChatRoom.findOne({
      participants: { $all: participantIds },
      $expr: { $eq: [{ $size: "$participants" }, participantIds.length] },
    });

    if (existingChatRoom) {
      return res.status(400).json({ message: "채팅 방이 이미 존재합니다" });
    }

    if (friends.length === 1) {
      roomName = `${user.name}와(과) ${friendName}의 채팅방`;
    } else if (friends.length <= 2) {
      const friendNames = friends.map((friend) => friend.name).join(", ");
      roomName = `${user.name}, ${friendNames}`;
    } else {
      const friendNames = friends
        .slice(0, 2)
        .map((friend) => friend.name)
        .join(", ");
      const otherFriendsCount = friends.length - 2;
      roomName = `${user.name}, ${friendNames} 외 ${otherFriendsCount}명`;
    }

    const chatRoom = new ChatRoom({
      roomName: roomName,
      participants: participantIds,
      messages: [],
    });

    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: "서버 문제 발생" });
  }
}

async function deleteChatRoom(req, res) {
  const { roomId } = req.params;
  try {
    const chatRoom = await ChatRoom.findById(roomId);

    if (!chatRoom) {
      return res.status(404).json({ error: "채팅 방을 찾을 수 없습니다" });
    }

    await Message.deleteMany({ _id: { $in: chatRoom.messages } });
    await ChatRoom.findByIdAndDelete(roomId);
    res
      .status(200)
      .json({ message: "채팅방과 해당 메시지들이 삭제되었습니다" });
  } catch (error) {
    res.status(500).json({ error: "서버 문제 발생" });
  }
}

function loadChatRoom(req, res) {
  const student_id = req.session.student_id;

  if (!student_id) {
    return res.status(401).json({ error: "세션이 만료 됐습니다" });
  }

  User.findOne({ student_id: student_id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "등록되지 않은 유저입니다" });
      }

      ChatRoom.find({ participants: user._id })
        .then((chatRooms) => {
          res.json({
            username: user.name,
            chatRooms: chatRooms,
          });
        })
        .catch((err) => {
          res.status(500).json({ error: "서버 문제 발생" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "서버  문제 발생" });
    });
}
module.exports = {
  createChatRoom,
  deleteChatRoom,
  loadChatRoom,
};
