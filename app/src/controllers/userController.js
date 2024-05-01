const collection = require("../models/userMoels");
const bcrypt = require("bcrypt");

async function signup(req, res) {
  const data = {
    id: req.body.id,
    name: req.body.username,
    password: req.body.password,
  };

  // 아이디와 비밀번호가 요청에 없는 경우
  if (!req.body.id || !req.body.password) {
    return res.sendStatus(400);
  }

  // 아이디 공백 제거 및 길이 검증
  const userId = req.body.id.trim();
  if (userId.length <= 3 || userId.length > 20) {
    return res
      .status(400)
      .json({ message: "아이디는 3글자 이상이고 20글자 미만이어야 합니다." });
  }

  const userPassword = req.body.password.trim();
  if (userPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "비밀번호는는 6글자 이상어야 합니다." });
  }

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
    res.redirect("/");
  }
}

async function validateLogin(req, res, collection) {
  try {
    // 아이디와 비밀번호가 요청에 없는 경우
    if (!req.body.id || !req.body.password) {
      return res.sendStatus(400);
    }

    // 아이디 공백 제거 및 길이 검증
    const userId = req.body.id.trim();
    if (userId.length <= 3 || userId.length > 20) {
      return res
        .status(400)
        .json({ message: "아이디는 3글자 이상이고 20글자 미만이어야 합니다." });
    }

    // 등록된 학번인지 확인
    const user = await collection.findOne({ id: userId });
    if (!user) {
      return res.status(404).send("등록되지 않은 학번입니다.");
    }

    // 비밀번호 일치 여부 확인
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordMatch) {
      res.render("home");
    } else {
      res.status(401).send("비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    console.error("로그인 검증 중 오류 발생:", error);
    res.status(500).send("로그인 중 오류가 발생했습니다.");
  }
}
async function login(req, res) {
  await validateLogin(req, res, collection);
}

// 모듈로 내보내기
module.exports = {
  signup,
  login,
};
