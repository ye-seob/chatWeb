const User = require("../models/userModels");

async function addFriend(req, res) {
  try {
    //세션 확인
    if (!req.session) {
      return res.status(401).send("로그인이 필요합니다.");
    }
    //세션에서 나의 아이디를 저장
    const userId = req.session.student_id;
    //클라이언드단에서 받은 친구의 아이디를 저장
    const friendStudentId = req.body.friend_id;

    if (!userId || !friendStudentId) {
      return res.status(400).send("입력되지 않은 정보가 존재합니다");
    }
    //User에서 친구 아이디를 검색
    const friend = await User.findOne({ student_id: friendStudentId });
    if (!friend) {
      return res.status(404).send("친구를 찾을 수 없습니다.");
    }
    //입력된 값이 본인인지 확인
    if (userId == friendStudentId) {
      return res.status(404).send("본인은 추가할 수 없습니다");
    }

    const user = await User.findOne({ student_id: userId });

    if (user.friendList.find((f) => f.friendId === friend.student_id)) {
      return res.status(409).send("이미 친구입니다.");
    }

    //나의 친구리스트에 친구의 아이디 ,이름을 추가,친구 수 추가 후 저장
    user.friendList.push({ friendId: friend.student_id, name: friend.name });
    user.friendCount += 1;
    await user.save();

    //친굽의 친구리스트에 나의 아이디 ,이름을 추가,친구 수 추가 후 저장
    friend.friendList.push({ friendId: user.student_id, name: user.name });
    friend.friendCount += 1;
    await friend.save();

    res.send("친구가 추가되었습니다.");
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
}

async function deleteFriend(req, res) {
  try {
    //세션 확인
    if (!req.session) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    //세션에서 나의 아이디를 저장
    //클라이언드단에서 받은 친구의 아이디를 저장
    const userId = req.session.student_id;
    const friendStudentId = req.body.friend_id;

    if (!userId || !friendStudentId) {
      return res.status(400).send("입력되지 않은 정보가 존재합니다");
    }

    const user = await User.findOne({ student_id: userId });
    const friend = await User.findOne({ student_id: friendStudentId });

    if (!friend) {
      return res.status(404).send("친구를 찾을 수 없습니다.");
    }

    // 나의 친구리스트에서 친구 삭제, 친구 수 1 감소
    user.friendList = user.friendList.filter(
      (f) => f.friendId !== friendStudentId
    );
    user.friendCount -= 1;
    await user.save();

    // 친구의 친구리스트에서 나 삭제, 친구 수 1 감소
    friend.friendList = friend.friendList.filter((f) => f.friendId !== userId);
    friend.friendCount -= 1;
    await friend.save();

    // 친구 삭제 후
    const updatedUser = await User.findOne({ student_id: userId });
    const updatedFriendList = updatedUser.friendList.map((friend) => ({
      friendId: friend.friendId,
      name: friend.name,
    }));

    // 수정된 친구 목록을 클라이언트로 전송
    res.send("친구가 삭제되었습니다");
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
}
module.exports = {
  addFriend,
  deleteFriend,
};
