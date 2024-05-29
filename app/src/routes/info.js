const express = require("express");
const router = express.Router();
const infoController = require("../controllers/infoController");

router.get("/getUserId", infoController.getUserId);
router.get("/getRoomName", infoController.getRoomName);
router.get("/getUserInfo", infoController.getUserInfo);

module.exports = router;
