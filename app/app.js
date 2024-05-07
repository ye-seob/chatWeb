const express = require("express");
const app = express();
const home = require("./src/routes/index");
const connectToDatabase = require("./config/db");
const userRoutes = require("./src/routes/user");
const createSessionStore = require("./session/session");

// DB 연결
connectToDatabase();

const mongoUrl = "mongodb://localhost:27017/chat";
const sessionMiddleware = createSessionStore(mongoUrl);

//데이터를 Jason 형식으로 변환
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));
app.use(sessionMiddleware);
app.use("/", home);
app.use("/", userRoutes);

module.exports = app;
