const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./src/config");
const home = require("./src/routes/index");

//데이터를 Jason 형식으로 변환
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));
app.use("/", home);

//유저 등록
app.post("/signup", async (req, res) => {
  const data = {
    id: req.body.id,
    name: req.body.username,
    password: req.body.password,
  };

  //유저 중복 검사

  const existingUser = await collection.findOne({ id: data.id });

  if (existingUser) {
    res.send("이미 가입된 학번입니다");
  } else {
    //비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; //비밀번호에 암호화된 비밀번호 저장

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});

//로그인
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ id: req.body.id });
    if (!check) {
      res.send("등록되지 않은 학번입니다");
    }

    //DB의 해쉬된 비밀번호와 입력된 비밀번호 비교
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("home");
    } else {
      res.send("비밀번호가 일치하지 않습니다");
    }
  } catch {
    res.send("정보가 일치하지 않습니다");
  }
});

module.exports = app;
