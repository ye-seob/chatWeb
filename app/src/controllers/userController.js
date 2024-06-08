const collection = require("../models/userModels");
const bcrypt = require("bcrypt");

function getUserData(body) {
  const { student_id, username, password } = body;

  if (student_id.length <= 3 || student_id.length > 20) {
    throw new Error("아이디는 3글자 이상이고 20글자 미만이어야 합니다.");
  }
  if (password.length < 6) {
    throw new Error("비밀번호는 6글자 이상이어야 합니다.");
  }

  return { student_id: student_id.trim(), username, password: password.trim() };
}

async function signup(req, res) {
  try {
    const { student_id, username, password } = getUserData(req.body);

    const existingUser = await collection.findOne({ student_id });

    if (existingUser) {
      return res.send("이미 가입된 학번입니다.");
    }

    const hashingPassword = await bcrypt.hash(password, 5);

    await collection.create({
      student_id,
      name: username,
      password: hashingPassword,
      friends: [],
    });
    res.json({ redirect: "/" });
  } catch (error) {
    res.status(500).json({ error: "서버 문제 발생" });
  }
}

async function login(req, res) {
  try {
    const { student_id, password } = getUserData(req.body);

    const user = await collection.findOne({ student_id });
    if (!user) return res.status(404).send("등록되지 않은 학번입니다.");

    const passwordMatching = await bcrypt.compare(password, user.password);

    if (passwordMatching) {
      req.session._id = user._id;
      req.session.student_id = student_id;
      res.json({ redirect: "/home" });
    } else {
      res.status(401).send("비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    res.status(500).json({ error: "서버 문제 발생" });
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
}

module.exports = {
  signup,
  login,
  logout,
};
