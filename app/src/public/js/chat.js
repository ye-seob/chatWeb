$(document).ready(function () {
  loadChatRoom();
  AutoRefresh();
});

function AutoRefresh() {
  setInterval(() => {
    loadChatRoom();
    loadMessages();
  }, 3000); // 5초마다 실행
}

let isSending = false;

// 메시지 보내는 함수
function sendMessage() {
  if (isSending) return;
  var messageInput = document.getElementById("message-input");
  var message = messageInput.value.trim();
  var roomId = getCurrentRoomId();

  if (message !== "") {
    isSending = true; // 메시지 전송 중으로 설정
    ajaxRequest("/sendMessage", "POST", { roomId: roomId, message: message }) //룸 아이디와 메세지를 서버로 전송 해서 저장
      .then((response) => {
        addMessageToView(response); //메세지 추가
        messageInput.value = ""; //인풋 태그 초기화
      })
      .catch((error) => console.error("Error sending message:", error))
      .finally(() => (isSending = false)); // 메시지 전송 완료 후 해제
  }
}

function loadChatRoom() {
  ajaxRequest("/loadChatRoom", "GET")
    .then((response) => {
      const chatRoom = $(".chatRoom");
      chatRoom.empty();
      $("#chat-count").html(
        `<span class="room-span">개설된 채팅방 ${response.chatRooms.length} 개</span>
   <button  class="plus-btn" onclick="openMakeGroupChatModal()">
     &plus;
   </button>`
      );

      response.chatRooms.forEach((room) => {
        const roomHTML = `
        <div class="room" onclick="selectRoom('${room._id}')">
          <div class="roomName"><p>${room.roomName}</p></div>
          <button class="delete-btn" onclick="openDeleteChatRoomModal()">&minus;</button>
        </div>`;
        chatRoom.append(roomHTML);
      });
    })
    .catch((error) => console.error("Error loading chat rooms:", error));
}
function loadMessages() {
  var roomId = getCurrentRoomId();
  if (roomId) {
    ajaxRequest(`/load/${roomId}/messages`, "GET")
      .then((messages) => {
        const chatView = $("#chat-view");
        const wasAtBottom =
          chatView.scrollTop() + chatView.innerHeight() >=
          chatView[0].scrollHeight;

        chatView.empty(); // 메세지들 일단 다 없애고
        messages.forEach((message) => addMessageToView(message));

        if (wasAtBottom) {
          chatView.scrollTop(chatView[0].scrollHeight);
        }
      })
      .catch((error) => console.error("Error loading messages:", error));
  }
}

async function addMessageToView(message) {
  var chatView = document.getElementById("chat-view");
  var messageElement = document.createElement("div");

  const currentUser = await getCurrentUserId();
  if (message.senderId === currentUser) {
    messageElement.classList.add("message", "sent");
  } else {
    messageElement.classList.add("message", "received");
    var senderName = document.createElement("div");
    senderName.classList.add("sender-name");
    senderName.textContent = message.senderName; // 메시지 보낸 사람의 이름
    messageElement.appendChild(senderName);
  }

  if (message.text) {
    var messageText = document.createElement("div");
    messageText.textContent = message.text;
    messageElement.appendChild(messageText);
  }

  if (message.imgFile) {
    var messageImage = document.createElement("img");
    messageImage.src = message.imgFile;
    messageImage.alt = "Image";
    messageElement.appendChild(messageImage);
  }

  var messageTime = document.createElement("div");
  messageTime.classList.add("message-time");
  messageTime.textContent = new Date(message.timestamp).toLocaleTimeString(); // 메시지 보낸 시간 표시
  messageElement.appendChild(messageTime);

  chatView.appendChild(messageElement);

  // 항상 아래로 스크롤
  chatView.scrollTop = chatView.scrollHeight;
}

function selectRoom(roomId) {
  ajaxRequest("/getRoomName", "GET", { roomId: roomId })
    .then((response) => {
      const roomName = $("#roomName");
      roomName.empty();
      var nameHTML = `<p>${response.roomName}</p>`;
      roomName.append(nameHTML);
      loadMessages(roomId);
    })
    .catch((error) => console.error("Error loading chat rooms:", error));
  localStorage.setItem("currentRoomId", roomId); //currentRoomID에 roomId가 담긴다
}

function getCurrentRoomId() {
  return localStorage.getItem("currentRoomId");
}

async function getCurrentUserId() {
  try {
    const response = await ajaxRequest("/getUserId", "GET");
    return response.userId;
  } catch (error) {
    console.error("통신에러 ", error.status, error);
  }
}
let isDeleting = false;

function deleteChatRoom() {
  if (isDeleting) return;

  var roomId = getCurrentRoomId();
  if (roomId) {
    isDeleting = true;
    ajaxRequest(`/deleteChatRoom/${roomId}`, "DELETE")
      .then((response) => {
        alert("채팅방이 삭제되었습니다.");
        closeDeleteChatRoomModal();
        loadChatRoom();
      })
      .catch((error) => {
        console.error("채팅방 삭제 실패:", error);
        alert("채팅방 삭제에 실패했습니다.");
      })
      .finally(() => {
        isDeleting = false;
      });
  }
}

async function ajaxRequest(url, type, data = {}) {
  try {
    const response = await $.ajax({
      url: url,
      type: type,
      contentType: "application/json",
      data: type === "GET" ? data : JSON.stringify(data),
      dataType: "json",
    });
    return response;
  } catch (error) {
    throw { status: error.status, error: error.error };
  }
}

$(document).ready(function () {
  $(".send-img-btn").on("click", function () {
    $("#imgFileInput").click();
  });

  $("#imgFileInput").on("change", function () {
    var image = this.files[0];
    if (image) {
      sendImg(image);
    }

    function sendImg(image) {
      const formData = new FormData();
      const roomId = getCurrentRoomId();

      formData.append("image", image);
      formData.append("roomId", roomId);

      $.ajax({
        url: "/sendImg",
        type: "POST",
        data: formData,
        contentType: false, // 중요: jQuery가 contentType을 설정하지 않도록 합니다.
        processData: false, // 중요: jQuery가 data를 문자열로 처리하지 않도록 합니다.
        success: function (response) {
          console.log("성공");
        },
        error: function (xhr, status, error) {
          console.log("에러 발생", error);
        },
      });
    }
  });
});
