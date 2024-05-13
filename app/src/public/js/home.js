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
}

// 모달 관련 변수
var addModal = document.getElementById("myModal");
var deleteModal = document.getElementById("myDeleteModal");
var friendIdInput = document.getElementById("friendIdInput");

// 모달 열기
function openModal() {
  addModal.style.display = "block";
  window.onclick = function (event) {
    if (event.target == addModal) {
      closeModal();
    }
  };
}

// 모달 닫기
function closeModal() {
  addModal.style.display = "none";
}

// 삭제 모달 열기
function openDeleteModal(friendId) {
  deleteModal.style.display = "block";
  friendIdInput.value = friendId;
  window.onclick = function (event) {
    if (event.target == deleteModal) {
      closeDeleteModal();
    }
  };
}

// 삭제 모달 닫기
function closeDeleteModal() {
  deleteModal.style.display = "none";
}

// 친구 목록 불러오기
function loadFriends() {
  $.ajax({
    url: "/getUserInfo",
    type: "GET",
    dataType: "json",
    success: function (response) {
      var friendsList = $(".friends");
      friendsList.empty();
      $("#username").text(response.username + "님");
      $("#friend-count").text("친구 " + response.friendCount);

      response.friendList.forEach(function (friend) {
        var friendHTML = `<div class="friend">
          <div class="friend-img"></div>
          <div class="friendName">${friend.name}</div>
          <button class="delete-btn" onclick="openDeleteModal('${friend.friendId}')">&minus;</button>
        </div>`;
        friendsList.append(friendHTML);
        $("#friends").append(friendHTML); // 중복되는 친구 목록 추가를 제거합니다.
      });
    },
    error: function (request, status, error) {
      console.error("Error loading friends:", status, error);
    },
  });
}

// 문서 준비가 완료되면 실행되는 함수
$(document).ready(function () {
  loadFriends();
});
