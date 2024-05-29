const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const roomController = require("../controllers/roomController");

//roomController
router.post("/createChatRoom", roomController.createChatRoom);
router.delete("/deleteChatRoom/:roomId", roomController.deleteChatRoom);
router.get("/loadChatRoom", roomController.loadChatRoom);

//chatController
router.post("/sendMessage", chatController.sendMessage);
router.get("/load/:roomId/messages", chatController.laodMessages);

module.exports = router;
