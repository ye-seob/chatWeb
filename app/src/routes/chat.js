const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const roomController = require("../controllers/roomController");
const upload = require("../../config/multer");

//roomController
router.post("/createChatRoom", roomController.createChatRoom);
router.delete("/deleteChatRoom/:roomId", roomController.deleteChatRoom);
router.get("/loadChatRoom", roomController.loadChatRoom);

//chatController
router.post("/sendMessage", chatController.sendMessage);
router.post("/sendImg", upload.single("image"), chatController.sendImg);
router.get("/load/:roomId/messages", chatController.laodMessages);

module.exports = router;
