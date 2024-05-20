const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/createChatRoom", chatController.createChatRoom);
router.get("/chatRoom/:roomId", chatController.getChatRoom);
router.get("/getChatInfo", chatController.getChatInfo);
router.post("/sendMessage", chatController.sendMessage);
router.get("/chatRoom/:roomId/messages", chatController.getMessages);
router.get("/getUserId", chatController.getUserId);
router.get("/getRoomName", chatController.getRoomName);

module.exports = router;
