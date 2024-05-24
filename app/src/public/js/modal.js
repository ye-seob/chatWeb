var addModal = $("#myModal")[0]; // jQuery 객체를 DOM 객체로 변환
var deleteModal = $("#myDeleteModal")[0];
var friendIdInput = $("#friendIdInput")[0];
var deleteChatRoomModal = $("#deleteChatRoomModal")[0];
var makeGroupChatModal = $("#makeGroupChatModal")[0]; // 추가된 부분

window.addEventListener("click", function (event) {
  if (event.target == addModal) {
    closeModal();
  } else if (event.target == deleteModal) {
    closeDeleteModal();
  } else if (event.target == deleteChatRoomModal) {
    closeDeleteChatRoomModal();
  } else if (event.target == makeGroupChatModal) {
    closeMakeGroupChatModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (deleteModal.style.display === "block" && e.key === "Enter") {
    e.preventDefault();
    deleteFriend();
  } else if (
    deleteChatRoomModal.style.display === "block" &&
    e.key === "Enter"
  ) {
    e.preventDefault();
    deleteChatRoom();
  } else if (
    makeGroupChatModal.style.display === "block" &&
    e.key === "Enter"
  ) {
    e.preventDefault();
    makeGroupChatModal();
  }
});

$(document).ready(function () {
  $(".submit-btn").on("click", function (e) {
    e.preventDefault();
    if (deleteModal.style.display === "block") {
      deleteFriend();
    } else if (deleteChatRoomModal.style.display === "block") {
      deleteChatRoom();
    } else if (makeGroupChatModal.style.display === "block") {
      makeGroupChatModal();
    }
  });
});

document
  .getElementById("friend_id")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addFriend();
    }
  });

function openModal() {
  addModal.style.display = "block";
}

function closeModal() {
  addModal.style.display = "none";
}

function openDeleteModal(friendId) {
  deleteModal.style.display = "block";
  friendIdInput.value = friendId;
}

function closeDeleteModal() {
  deleteModal.style.display = "none";
}

function openDeleteChatRoomModal() {
  deleteChatRoomModal.style.display = "block";
}

function closeDeleteChatRoomModal() {
  deleteChatRoomModal.style.display = "none";
}

function openMakeGroupChatModal() {
  makeGroupChatModal.style.display = "block";
  loadFriend();
}

function closeMakeGroupChatModal() {
  makeGroupChatModal.style.display = "none";
}
function loadFriend() {
  $.ajax({
    url: "/getUserInfo",
    type: "GET",
    dataType: "json",
    success: function (response) {
      var friendsListContainer = $("#friendsListContainer");
      friendsListContainer.empty();
      response.friendList.forEach(function (friend) {
        var friendHTML = `
          <div class="friend" data-friend-id="${friend.friendId}">
            <div class="friend-profile">
              <div class="friend-img"></div>
              <div class="friendName"><p>${friend.name}</p></div>
              <input type="checkbox" class="friend-checkbox" data-friend-id="${friend.friendId}">
            </div>
          </div>`;
        friendsListContainer.append(friendHTML);
      });
    },
    error: function (request, status, error) {
      console.error("Error loading friends:", status, error);
    },
  });
}
// 선택된 친구들로 그룹 채팅방을 생성하는 함수
function createGroupChatRoom() {
  var selectedFriendIds = [];
  $(".friend-checkbox:checked").each(function () {
    selectedFriendIds.push($(this).data("friend-id"));
  });

  if (selectedFriendIds.length < 2) {
    alert("그룹 채팅방을 생성하려면 최소 2명의 친구를 선택해야 합니다.");
    return;
  }

  $.ajax({
    url: "/createGroupChatRoom",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ friendIds: selectedFriendIds }),
    success: function (response) {
      alert("그룹 채팅방이 생성되었습니다!");
      // 필요한 경우, 생성된 채팅방으로 리다이렉트 등 추가 작업
    },
    error: function (request, status, error) {
      console.error("Error creating group chat room:", status, error);
    },
  });
}

// 문서가 준비되면 친구 목록을 불러오고, 그룹 채팅방 생성 버튼을 설정합니다
$(document).ready(function () {
  loadFriend();

  // 그룹 채팅방 생성 버튼 클릭 이벤트
  $("#createGroupChatButton").click(function () {
    createGroupChatRoom();
  });
});
