const express = require("express");
const app = express();
const connectToDatabase = require("./config/db");
const home = require("./src/routes/index");
const userRoutes = require("./src/routes/user");
const chatRoutes = require("./src/routes/chat");
const infoRoutes = require("./src/routes/info");
const createSessionStore = require("./config/session");

connectToDatabase();

const mongoUrl = "mongodb://localhost:27017/chat";
const sessionMiddleware = createSessionStore(mongoUrl);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/src/public`));
app.use(sessionMiddleware);

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use("/", home);
app.use("/", userRoutes);
app.use("/", chatRoutes);
app.use("/", infoRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(` ${PORT}포트 서버 실행중`);
});

module.exports = app;
