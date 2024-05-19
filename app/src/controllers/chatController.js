const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModels");
const Message = require("../models/chatModels");

async function createChatRoom(req, res) {
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
}

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

const getChatInfo = (req, res) => {
  const student_id = req.session.student_id;

  if (!student_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  User.findOne({ student_id: student_id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      ChatRoom.find({ participants: user._id })
        .then((chatRooms) => {
          res.json({
            username: user.name,
            chatRooms: chatRooms,
          });
        })
        .catch((err) => {
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal server error" });
    });
};
const sendMessage = async (req, res) => {
  const { roomId, message } = req.body;
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const user = await User.findOne({ student_id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);
    console.log(message);
    const newMessage = new Message({
      senderId: user._id,
      text: message,
      timestamp: new Date(),
    });

    await newMessage.save();
    chatRoom.messages.push(newMessage);
    await chatRoom.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId).populate("messages");
    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }
    res.json(chatRoom.messages); //메세지들 리턴해줌!
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

async function getUserId(req, res) {
  if (req.session) {
    res.json({ userId: req.session._id });
  } else {
    res.status(401).send("No session data");
  }
}

module.exports = {
  createChatRoom,
  getChatRoom,
  getChatInfo,
  sendMessage,
  getMessages,
  getUserId,
};
