// src/controllers/userController.js

const collection = require("../models/userModels");
const bcrypt = require("bcrypt");

function extractUserData(body) {
  const { student_id, username, password } = body;

  if (!student_id || !password) {
    throw new Error("아이디 또는 비밀번호가 입력되지 않았습니다.");
  }
  return { student_id: student_id.trim(), username, password: password.trim() };
}

function validateData(student_id, password) {
  if (student_id.length <= 3 || student_id.length > 20) {
    throw new Error("아이디는 3글자 이상이고 20글자 미만이어야 합니다.");
  }
  if (password.length < 6) {
    throw new Error("비밀번호는 6글자 이상이어야 합니다.");
  }
}

function handleServerError(res, message, error) {
  console.error(`${message}\n${error}`);
  res.status(500).send(message);
}

async function signup(req, res) {
  try {
    const { student_id, username, password } = extractUserData(req.body);
    validateData(student_id, password);

    const existingUser = await collection.findOne({ student_id });

    if (existingUser) {
      return res.send("이미 가입된 학번입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await collection.create({
      student_id,
      name: username,
      password: hashedPassword,
      friends: [],
    });
    res.json({ redirect: "/" });
  } catch (error) {
    handleServerError(res, "회원가입 중 오류가 발생했습니다.", error);
  }
}

async function login(req, res) {
  try {
    const { student_id, password } = extractUserData(req.body);

    validateData(student_id, password);

    const user = await collection.findOne({ student_id });
    if (!user) return res.status(404).send("등록되지 않은 학번입니다.");

    const passwordMatching = await bcrypt.compare(password, user.password);
    if (passwordMatching) {
      //세션 저장
      req.session._id = user._id;
      req.session.student_id = student_id;
      req.session.username = user.name;
      req.session.friendList = user.friendList;
      res.json({ redirect: "/home" });
    } else {
      res.status(401).send("비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    handleServerError(res, "로그인 중 오류가 발생했습니다.", error);
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
}
function getUserInfo(req, res) {
  const userId = req.session.student_id;

  if (!userId) {
    return res.status(401).json({ error: "세션이 만료 됐습니다" });
  }

  collection
    .findOne({ student_id: userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "등록되지 않은 유저입니다" });
      }
      res.json({
        username: user.name,
        friendList: user.friendList,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: "서버 에러 발생" });
    });
}

module.exports = {
  signup,
  login,
  logout,
  getUserInfo,
};
