// src/routes/index.js

const express = require("express");
const router = express.Router();
const ctrl = require("./ctrl");

router.get("/", ctrl.login);
router.get("/signup", ctrl.signup);
router.get("/home", ctrl.home);
router.get("/chat", ctrl.chat);

module.exports = router;
