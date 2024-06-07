$(document).ready(function () {
  loadFriends();
});

function loadFriends() {
  $.ajax({
    url: "/getUserInfo",
    type: "GET",
    dataType: "json",
    success: function (response) {
      var friendsList = $(".friends");
      friendsList.empty();
      $("#username").text(response.username + "님");
      $("#friend-count").text("친구 " + response.friendList.length);
      var friendsHTML = "";
      response.friendList.forEach(function (friend) {
        friendsHTML += `
        <div class="friend" data-friend-id="${friend.friendId}">
            <div class="friend-profile">
                <div class="friend-img"></div>
                <div class="friendName"><p>${friend.name}</p></div>
            </div>
            <button class="delete-btn" onclick="openDeleteModal('${friend.friendId}')">&minus;</button>
          </div>`;
      });
      friendsList.append(friendsHTML);
    },
    error: function (status, error) {
      console.error("친구 불러오기 오류", status, error);
    },
  });
}

function addFriend() {
  var friendId = $("#friend_id").val().trim();
  if (friendId !== "") {
    $.ajax({
      url: "/addFriend",
      type: "POST",
      data: { friend_id: friendId },
      success: function (response) {
        alert("친구가 추가되었습니다.");
        closeModal();
        loadFriends();
      },
      error: function (xhr, status, error) {
        alert("친구 추가에 실패했습니다: " + error);
      },
    });
  } else {
    alert("학번을 입력해주세요.");
  }
}
function deleteFriend() {
  var friendId = $("#friendIdInput").val();
  $.ajax({
    url: "/deleteFriend",
    type: "POST",
    data: { friend_id: friendId },
    success: function (response) {
      alert("친구가 삭제되었습니다.");
      closeDeleteModal();
      loadFriends();
    },
    error: function (status, error) {
      alert("친구 삭제에 실패했습니다: " + error);
    },
  });
}

function MovePage(page) {
  $.ajax({
    url: `/${page}`,
    type: "GET",
    success: function (data) {
      $(".switch").html(data);
    },
    error: function (status, error) {
      console.error("페이지를 불러오는 중 오류가 발생했습니다:", status, error);
    },
  });
}
function createChatRoom(friendId, friendName) {
  $.ajax({
    url: "/createChatRoom",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ friendIds: friendId, friendName: friendName }),
    success: function (response) {
      MovePage("chat");
    },
    error: function (status, error) {
      alert("채팅방 생성에 실패했습니다: " + error);
    },
  });
}

var isChatRoomCreating = false;

$(document).on("dblclick", ".friend", function () {
  if (isChatRoomCreating) return;

  isChatRoomCreating = true;

  const friendId = $(this).data("friend-id");
  const friendName = $(this).find(".friendName p").text();

  createChatRoom([friendId], friendName);

  setTimeout(() => {
    isChatRoomCreating = false;
  }, 1000);
});
