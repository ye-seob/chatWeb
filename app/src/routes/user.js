const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const friendController = require("../controllers/friendController");

//userController
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

//friendController
router.post("/addFriend", friendController.addFriend);
router.post("/deleteFriend", friendController.deleteFriend);

module.exports = router;
