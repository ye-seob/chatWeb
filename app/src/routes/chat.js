const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/createChatRoom", chatController.createChatRoom);
router.get("/chatRoom/:roomId", chatController.getChatRoom);
router.get("/getChatInfo", chatController.getChatInfo);

module.exports = router;
