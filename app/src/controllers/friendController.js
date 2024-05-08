const User = require("../models/userModels");

async function addFriend(req, res) {
  try {
    if (!req.session) {
      return res.status(401).send("로그인이 필요합니다.");
    }
    const userId = req.session.student_id;
    const friendStudentId = req.body.friend_id;

    if (!userId || !friendStudentId) {
      return res.status(400).send("필요한 정보가 누락되었습니다.");
    }

    const friend = await User.findOne({ student_id: friendStudentId });
    if (!friend) {
      return res.status(404).send("친구를 찾을 수 없습니다.");
    }

    const user = await User.findOne({ student_id: userId });
    if (userId == friendStudentId) {
      return res.status(404).send("본인 입력하지마라");
    }

    if (user.friendList.find((f) => f.friendId === friend.student_id)) {
      return res.status(409).send("이미 친구입니다.");
    }

    user.friendList.push({ friendId: friend.student_id, name: friend.name });
    user.friendCount += 1;
    await user.save();

    friend.friendList.push({ friendId: user.student_id, name: user.name });
    friend.friendCount += 1;
    await friend.save();

    res.send("친구가 추가되었습니다.");
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
}

async function deleteFriend(req, res) {}

module.exports = {
  addFriend,
  deleteFriend,
};
