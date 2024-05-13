// /src/routes/user.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const friendController = require("../controllers/friendController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.post("/addFriend", friendController.addFriend);
router.post("/deleteFriend", friendController.deleteFriend);

router.get("/getUserInfo", userController.getUserInfo);

module.exports = router;
