// session/session.js

const session = require("express-session");

const sessionConfig = session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
});

module.exports = sessionConfig;
