// /src/publc/js/home.js

function sendMessage() {
  var messageInput = document.getElementById("message-input");
  var message = messageInput.value.trim();

  if (message !== "") {
    var chatView = document.getElementById("chat-view");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message"); // 새로운 클래스 추가
    messageElement.textContent = message;
    chatView.appendChild(messageElement);
    chatView.scrollTop = chatView.scrollHeight;
    messageInput.value = "";
  }
}

document
  .getElementById("message-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
