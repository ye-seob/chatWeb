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
        console.log(room);
        const roomHTML = `
        <div class="room">
                <div class="roomName"><p>${room.roomName}</p></div>
          </div>`;
        chatRoom.append(roomHTML);
      });
    },
    error: function (request, status, error) {
      console.error("Error loading friends:", status, error);
    },
  });
}
