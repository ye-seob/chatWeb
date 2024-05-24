const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModels");
const Message = require("../models/chatModels");

async function createChatRoom(req, res) {
  const { friendId, friendName } = req.body;
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "세션이 만료 됐습니다" });
  }

  try {
    const user = await User.findOne({ student_id: userId });
    const friend = await User.findOne({ student_id: friendId });
    if (!user || !friend) {
      return res.status(404).json({ error: "등록되지 않은 유저입니다" });
    }

    const existingChatRoom = await ChatRoom.findOne({
      participants: { $all: [user._id, friend._id] },
    });

    if (existingChatRoom) {
      return res.status(200).json({ message: "채팅 방이 이미 존재합니다" });
    }

    const chatRoom = new ChatRoom({
      roomName: `${user.name}와(과) ${friendName}의 채팅방`,
      participants: [user._id, friend._id],
      messages: [],
    });

    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: "서버 통신 에러 발생" });
  }
}
const createGroupChatRoom = async (req, res) => {
  const { friendIds } = req.body; // 여러 친구 ID를 받아옵니다
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "세션이 만료 됐습니다" });
  }

  if (!Array.isArray(friendIds) || friendIds.length < 2) {
    return res
      .status(400)
      .json({ error: "단체 채팅방은 최소 2명 이상의 친구 필요" });
  }

  try {
    const user = await User.findOne({ student_id: userId });
    if (!user) {
      return res.status(404).json({ error: "등록되지 않은 유저입니다" });
    }

    const friends = await User.find({ student_id: { $in: friendIds } });
    if (friends.length !== friendIds.length) {
      return res.status(404).json({ error: "일부 친구를 찾을 수 없습니다" });
    }

    const allParticipants = [user, ...friends];
    const participantIds = allParticipants.map(
      (participant) => participant._id
    );

    const existingChatRoom = await ChatRoom.findOne({
      participants: { $all: participantIds },
    });

    if (existingChatRoom) {
      return res.status(200).json({ message: "채팅 방이 이미 존재합니다" });
    }

    let roomName;
    if (friends.length <= 2) {
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
    res.status(500).json({ error: "서버 통신 에러 발생" });
  }
};

const getChatRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId)
      .populate("participants", "name")
      .populate("messages");
    if (!chatRoom) {
      return res.status(404).json({ error: "채팅 방을 찾을 수 없습니다" });
    }
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: "서버 통신 에러 발생" });
  }
};

const getChatInfo = (req, res) => {
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
          res.status(500).json({ error: "서버 통신 에러 발생" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "서버 통신 에러 발생" });
    });
};
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

const getMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId).populate("messages");
    if (!chatRoom) {
      return res.status(404).json({ error: "채팅 방을 찾을 수 없습니다" });
    }
    res.json(chatRoom.messages); //메세지들 리턴해줌!
  } catch (error) {
    res.status(500).json({ error: "서버 통신 에러 발생" });
  }
};

async function getUserId(req, res) {
  if (req.session) {
    res.json({ userId: req.session._id });
  } else {
    res.status(401).send("No session data");
  }
}
async function getRoomName(req, res) {
  const chatRoom = await ChatRoom.findById(req.query.roomId);
  if (!chatRoom) {
    return res.status(404).json({ error: "채팅 방을 찾을 수 없습니다" });
  }
  if (chatRoom) {
    res.json({ roomName: chatRoom.roomName });
  } else {
    res.status(401).send("채팅 방을 찾을 수 없습니다");
  }
}

async function deleteChatRoom(req, res) {
  const { roomId } = req.params;
  const userId = req.session.student_id;
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
    res.status(500).json({ error: "서버 통신 에러 발생" });
  }
}

module.exports = {
  createChatRoom,
  createGroupChatRoom,
  getChatRoom,
  getChatInfo,
  sendMessage,
  getMessages,
  getUserId,
  getRoomName,
  deleteChatRoom,
};
