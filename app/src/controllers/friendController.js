const User = require("../models/userModels");

async function addFriend(req, res) {
  const userId = req.session.student_id;
  const friendStudentId = req.body.friend_id;

  try {
    if (!userId) {
      return res.status(401).send("세션이 만료 됐습니다");
    }

    if (!friendStudentId) {
      return res.status(400).send("친구의 학번 공백 오류");
    }

    const friend = await User.findOne({ student_id: friendStudentId });
    const user = await User.findOne({ student_id: userId });

    if (!friend) {
      return res.status(404).send("친구를 찾을 수 없습니다");
    }

    if (userId == friendStudentId) {
      return res.status(404).send("자신은 추가할 수 없습니다");
    }

    if (user.friendList.find((f) => f.friendId === friend.student_id)) {
      return res.status(409).send("이미 친구입니다");
    }

    user.friendList.push({ friendId: friend.student_id, name: friend.name });
    await user.save();

    friend.friendList.push({ friendId: user.student_id, name: user.name });
    await friend.save();

    res.send({ message: "친구가 추가되었습니다." });
  } catch (error) {
    res.status(500).send("서버 오류");
  }
}

async function deleteFriend(req, res) {
  const userId = req.session.student_id;
  const friendStudentId = req.body.friend_id;

  try {
    if (!userId) {
      return res.status(401).send("세션이 만료 됐습니다");
    }

    const user = await User.findOne({ student_id: userId });
    const friend = await User.findOne({ student_id: friendStudentId });

    if (!friend) {
      return res.status(404).send("친구를 찾을 수 없습니다.");
    }

    user.friendList = user.friendList.filter(
      (f) => f.friendId !== friendStudentId
    );
    await user.save();

    friend.friendList = friend.friendList.filter((f) => f.friendId !== userId);
    await friend.save();

    res.send({ message: "친구가 삭제되었습니다" });
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 문제 발생");
  }
}
module.exports = {
  addFriend,
  deleteFriend,
};
