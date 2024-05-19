$(document).ready(function () {
  loadChatRoom();
  setInterval(loadChatRoom, 3000);
  //setInterval(loadMessages, 3000); //3초
});

// 메시지 보내기 함수
function sendMessage() {
  var messageInput = document.getElementById("message-input");
  var message = messageInput.value.trim();
  var roomId = getCurrentRoomId();

  if (message !== "") {
    $.ajax({
      url: "/sendMessage",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ roomId: roomId, message: message }),
      success: function (response) {
        addMessageToView(response);
        messageInput.value = "";
      },
      error: function (request, status, error) {
        console.error("Error sending message:", status, error);
      },
    });
  }
}

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function loadChatRoom() {
  $.ajax({
    url: "/getChatInfo",
    type: "GET",
    dataType: "json",
    success: function (response) {
      const chatRoom = $(".chatRoom");
      chatRoom.empty();
      $("#chat-count").text("개설된 채팅방 " + response.chatRooms.length);
      response.chatRooms.forEach(function (room) {
        const roomHTML = `
        <div class="room" onclick="selectRoom('${room._id}')">
          <div class="roomName"><p>${room.roomName}</p></div>
        </div>`;
        chatRoom.append(roomHTML);
      });
    },
    error: function (request, status, error) {
      console.error("Error loading chat rooms:", status, error);
    },
  });
}

function loadMessages() {
  var roomId = getCurrentRoomId();
  if (roomId) {
    $.ajax({
      url: `/chatRoom/${roomId}/messages`,
      type: "GET",
      dataType: "json",
      success: function (messages) {
        const chatView = $("#chat-view");
        chatView.empty(); // 메세지들 일단 다 없애고
        messages.forEach(function (message) {
          //받아온  메세지 출력
          addMessageToView(message);
        });
      },
      error: function (request, status, error) {
        console.error("Error loading messages:", status, error);
      },
    });
  }
}

async function addMessageToView(message) {
  var chatView = document.getElementById("chat-view");
  var messageElement = document.createElement("div");

  const currentUser = await getCurrentUserId();
  console.log(message.senderId);
  console.log(currentUser);
  if (message.senderId === currentUser) {
    //현재 로그인한 유저와 보낸 유저가 같으면 , 즉 자기가 보낸 메세지이면
    messageElement.classList.add("message", "sent");
    //내가 보낸걸로 추가
  } else {
    //아니면, 즉 다른 사람이 보낸 메세지이면
    messageElement.classList.add("message", "received");
    //내가 받은 메세지로 추가
    var senderName = document.createElement("div");
    senderName.classList.add("sender-name");
    senderName.textContent = message.senderName; // 메시지 보낸 사람의 이름
    messageElement.appendChild(senderName);
  }

  var messageText = document.createElement("div");
  messageText.textContent = message.text;
  messageElement.appendChild(messageText);

  var messageTime = document.createElement("div");
  messageTime.classList.add("message-time");
  messageTime.textContent = new Date(message.timestamp).toLocaleTimeString(); // 메시지 보낸 시간 표시
  messageElement.appendChild(messageTime);

  chatView.appendChild(messageElement);
  chatView.scrollTop = chatView.scrollHeight;
}

function selectRoom(roomId) {
  localStorage.setItem("currentRoomId", roomId); //currentRoomID에 roomId가 담긴다
  loadMessages(); //그리고 메세지 로드
}

function getCurrentRoomId() {
  return localStorage.getItem("currentRoomId");
}
async function getCurrentUserId() {
  try {
    const response = await $.ajax({
      url: "/getUserId",
      type: "GET",
      dataType: "json",
    });
    return response.userId;
  } catch (error) {
    console.error("통신에러 ", error.status, error);
  }
}
