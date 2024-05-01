const express = require("express");
const app = express();
const home = require("./src/routes/index");
const connectToDatabase = require("./config/db");
const userRoutes = require("./src/routes/user");

// DB 연결
connectToDatabase();

//데이터를 Jason 형식으로 변환
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public/css`));
app.use("/", home);
app.use("/", userRoutes);

module.exports = app;
