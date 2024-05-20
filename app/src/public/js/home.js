$(document).ready(function () {
  loadFriends();
});

var addModal = $("#myModal")[0]; // jQuery 객체를 DOM 객체로 변환
var deleteModal = $("#myDeleteModal")[0];
var friendIdInput = $("#friendIdInput")[0];

function openModal() {
  addModal.style.display = "block";
  window.onclick = function (event) {
    if (event.target == addModal) {
      closeModal();
    }
  };
}

function closeModal() {
  addModal.style.display = "none";
}

function openDeleteModal(friendId) {
  deleteModal.style.display = "block";
  friendIdInput.value = friendId;
  window.onclick = function (event) {
    if (event.target == deleteModal) {
      closeDeleteModal();
    }
  };
  $(document).ready(function () {
    $(".submit-btn").on("click", function (e) {
      e.preventDefault();
      deleteFriend();
    });

    $(document).on("keydown", function (e) {
      if (deleteModal.style.display === "block" && e.key === "Enter") {
        e.preventDefault();
        deleteFriend();
      }
    });
  });
}
function closeDeleteModal() {
  deleteModal.style.display = "none";
}

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
      response.friendList.forEach(function (friend) {
        var friendHTML = `
        <div class="friend" data-friend-id="${friend.friendId}">
            <div class="friend-profile">
                <div class="friend-img"></div>
                <div class="friendName"><p>${friend.name}</p></div>
            </div>
            <button class="delete-btn" onclick="openDeleteModal('${friend.friendId}')">&minus;</button>
          </div>`;
        friendsList.append(friendHTML);
      });
    },
    error: function (request, status, error) {
      console.error("Error loading friends:", status, error);
    },
  });
}
document
  .getElementById("friend_id")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addFriend();
    }
  });

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
    error: function (xhr, status, error) {
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
    error: function (xhr, status, error) {
      console.error("페이지를 불러오는 중 오류가 발생했습니다:", status, error);
    },
  });
}
function createChatRoom(friendId, friendName) {
  $.ajax({
    url: "/createChatRoom",
    type: "POST",
    data: { friendId: friendId, friendName: friendName },
    success: function (response) {
      MovePage("chat");
    },
    error: function (xhr, status, error) {
      alert("채팅방 생성에 실패했습니다: " + error);
    },
  });
}
var isChatRoomCreating = false;

$(document).on("dblclick", ".friend", function () {
  if (isChatRoomCreating) return; // 채팅방 생성 중이면 중복 생성 방지

  isChatRoomCreating = true; // 플래그 설정
  const friendId = $(this).data("friend-id");
  const friendName = $(this).find(".friendName p").text();

  createChatRoom(friendId, friendName);

  setTimeout(() => {
    isChatRoomCreating = false; // 일정 시간 후 플래그 해제
  }, 1000); // 1초 후 플래그 해제
});
