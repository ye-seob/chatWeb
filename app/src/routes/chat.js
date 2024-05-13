// /src/routes/chat.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/rooms", chatController.getRooms);
router.post("/room", chatController.createRoom);
router.get("/rooms/:roomId/messages", chatController.getMessages);
router.post("/message", chatController.sendMessage);

module.exports = router;
