// 메시지 보내기 함수
function sendMessage() {
  var messageInput = document.getElementById("message-input");
  var message = messageInput.value.trim();

  if (message !== "") {
    var chatView = document.getElementById("chat-view");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.textContent = message;
    chatView.appendChild(messageElement);
    chatView.scrollTop = chatView.scrollHeight;
    messageInput.value = "";
  }
} // 문서 준비가 완료되면 실행되는 함수
$(document).ready(function () {
  loadFriends();
});

var addModal = document.getElementById("myModal");
var deleteModal = document.getElementById("myDeleteModal");
var friendIdInput = document.getElementById("friendIdInput");

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
        <div class="friend">
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

function MovePage(url) {
  var ajaxOption = {
    url: url,
    async: true,
    type: "GET",
    dataType: "html",
    cache: false,
  };
  $.ajax(ajaxOption).done(function (data) {
    $(".switch").html(data);
  });
}
