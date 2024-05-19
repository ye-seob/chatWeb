// src/controllers/userController.js

const { Collection } = require("mongoose");
const collection = require("../models/userModels");
const bcrypt = require("bcrypt");

function extractUserData(body) {
  //body에는 학번,이름,비밀번호가 담겨온다
  const { student_id, username, password } = body;
  if (!student_id || !password) {
    throw new Error("아이디 또는 비밀번호가 입력되지 않았습니다.");
  }
  return { student_id: student_id.trim(), username, password: password.trim() };
}

// 회원가입 데이터 유효성 검사 함수
function validateData(student_id, password) {
  if (student_id.length <= 3 || student_id.length > 20) {
    throw new Error("아이디는 3글자 이상이고 20글자 미만이어야 합니다.");
  }
  if (password.length < 6) {
    throw new Error("비밀번호는 6글자 이상이어야 합니다.");
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
    //req.body에는 학번,이름,비밀번호가 담겨온다
    const { student_id, username, password } = extractUserData(req.body);

    validateData(student_id, password);

    //콜렉션에 입력된 학번을 검색한다
    const existingUser = await collection.findOne({ student_id });

    if (existingUser) {
      return res.send("이미 가입된 학번입니다.");
    }

    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 5);

    //회원가입
    await collection.create({
      student_id,
      name: username,
      password: hashedPassword,
      friends: [],
    });
    res.redirect("/");
  } catch (error) {
    handleServerError(res, "회원가입 중 오류가 발생했습니다.", error);
  }
}

// 로그인 처리 함수
async function login(req, res) {
  try {
    //req.body에는 학번,비밀번호가 담겨온다
    const { student_id, password } = extractUserData(req.body);

    validateData(student_id, password);

    //콜렉션에 입력된 학번을 검색한다
    const user = await collection.findOne({ student_id });
    if (!user) return res.status(404).send("등록되지 않은 학번입니다.");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      //세션 저장
      req.session._id = user._id;
      req.session.student_id = student_id;
      req.session.username = user.name;
      req.session.friendList = user.friendList;
      res.redirect("/home");
    } else {
      res.status(401).send("비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    handleServerError(res, "로그인 중 오류가 발생했습니다.", error);
  }
}

//로그아웃 , 세션 삭제
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
}
function getUserInfo(req, res) {
  const student_id = req.session.student_id; // 세션에서 사용자 ID 가져오기

  if (!student_id) {
    return res.status(401).json({ error: "Unauthorized" }); // 세션에 student_id가 없을 경우
  }

  collection
    .findOne({ student_id: student_id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        username: user.name,
        friendList: user.friendList,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: "Internal server error" });
    });
}

module.exports = {
  signup,
  login,
  logout,
  getUserInfo,
};
