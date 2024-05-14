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
                    <div class="friendName"><p>${friend.name}</p></div>
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

function addFriend() {
  var friendId = $("#friend_id").val().trim(); // 입력된 학번 가져오기
  if (friendId !== "") {
    $.ajax({
      url: "/addFriend", // 요청 보낼 서버의 경로
      type: "POST", // 데이터 전송 방식
      data: { friend_id: friendId }, // 서버로 보낼 데이터
      success: function (response) {
        // 요청 성공 시 실행될 함수
        alert("친구가 추가되었습니다.");
        closeModal(); // 모달 창 닫기
        loadFriends(); // 친구 목록 새로고침
      },
      error: function (xhr, status, error) {
        // 요청 실패 시 실행될 함수
        alert("친구 추가에 실패했습니다: " + error);
      },
    });
  } else {
    alert("학번을 입력해주세요.");
  }
}
function deleteFriend() {
  var friendId = $("#friendIdInput").val(); // 삭제할 친구의 ID 가져오기
  $.ajax({
    url: "/deleteFriend", // 요청 보낼 서버의 경로
    type: "POST", // 데이터 전송 방식
    data: { friend_id: friendId }, // 서버로 보낼 데이터
    success: function (response) {
      alert("친구가 삭제되었습니다.");
      closeDeleteModal(); // 모달 창 닫기
      loadFriends(); // 친구 목록 새로고침
    },
    error: function (xhr, status, error) {
      alert("친구 삭제에 실패했습니다: " + error);
    },
  });
}

// 삭제 버튼에 deleteFriend 함수 연결
function openDeleteModal(friendId) {
  deleteModal.style.display = "block";
  friendIdInput.value = friendId;
  window.onclick = function (event) {
    if (event.target == deleteModal) {
      closeDeleteModal();
    }
  };
  // '확인' 버튼 클릭 이벤트에 deleteFriend 함수 바인딩
  $(document).ready(function () {
    // 삭제 모달의 '확인' 버튼에 대한 이벤트 리스너 설정
    $(".submit-btn").on("click", function (e) {
      e.preventDefault(); // 폼 제출 기본 동작 방지
      deleteFriend(); // 친구 삭제 함수 호출
    });
  });
}
