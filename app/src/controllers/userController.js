// src/controllers/userController.js

const collection = require("../models/userModels");
const bcrypt = require("bcrypt");
const session = require("express-session");

// 사용자 데이터 추출 함수
function extractUserData(body) {
  const { id, username, password } = body;
  if (!id || !password) {
    throw new Error("아이디 또는 비밀번호가 입력되지 않았습니다.");
  }
  return { id: id.trim(), username, password: password.trim() };
}

// 회원가입 데이터 유효성 검사 함수
function validateSignupData(id, password) {
  if (id.length <= 3 || id.length > 20) {
    throw new Error("아이디는 3글자 이상이고 20글자 미만이어야 합니다.");
  }
  if (password.length < 6) {
    throw new Error("비밀번호는 6글자 이상이어야 합니다.");
  }
}

// 로그인 데이터 유효성 검사 함수
function validateLoginData(id, password) {
  if (id.length <= 3 || id.length > 20) {
    throw new Error("아이디는 3글자 이상이고 20글자 미만이어야 합니다.");
  }
  if (!password) {
    throw new Error("비밀번호가 입력되지 않았습니다.");
  }
}

// 서버 에러 처리 함수
function handleServerError(res, message, error) {
  console.error(`${message}\n${error}`);
  res.status(500).send(message);
}

// 회원가입 처리 함수
async function signup(req, res) {
  try {
    const { id, username, password } = extractUserData(req.body);

    validateSignupData(id, password);

    const existingUser = await collection.findOne({ id });
    if (existingUser) {
      return res.send("이미 가입된 학번입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await collection.create({
      id,
      name: username,
      password: hashedPassword,
      friends: 0,
    });

    res.redirect("/");
  } catch (error) {
    handleServerError(res, "회원가입 중 오류가 발생했습니다.", error);
  }
}

// 로그인 처리 함수
async function login(req, res) {
  try {
    const { id, password } = extractUserData(req.body);

    validateLoginData(id, password);

    const user = await collection.findOne({ id });
    if (!user) return res.status(404).send("등록되지 않은 학번입니다.");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      req.session.username = user.name;
      req.session.friendCount = user.friends; // 친구 수 정보 저장
      res.render("home", {
        username: req.session.username,
        friendCount: req.session.friendCount,
      });
    } else {
      res.status(401).send("비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    handleServerError(res, "로그인 중 오류가 발생했습니다.", error);
  }
}

module.exports = {
  signup,
  login,
};
