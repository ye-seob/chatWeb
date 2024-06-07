$(document).ready(function () {
  $(".send-img-btn").on("click", function () {
    $("#imgFileInput").click();
  });

  $("#imgFileInput").on("change", function () {
    var image = this.files[0];
    if (image) {
      sendImg(image);
    }
    $(this).val("");
    function sendImg(image) {
      const formData = new FormData();
      const roomId = localStorage.getItem("currentRoomId");

      formData.append("image", image);
      formData.append("roomId", roomId);

      $.ajax({
        url: "/sendImg",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          console.log("성공");
        },
        error: function (status, error) {
          console.log("에러 발생", error);
        },
      });
    }
  });
});

let isSending = false;

function sendMessage() {
  if (isSending) return;

  var messageInput = document.getElementById("message-input");
  var message = messageInput.value.trim();
  var roomId = localStorage.getItem("currentRoomId");

  if (message !== "") {
    isSending = true;
    sendAjax("/sendMessage", "POST", { roomId: roomId, message: message })
      .then((response) => {
        addMessage(response);
        messageInput.value = "";
      })
      .catch((error) => console.error("Error sending message:", error))
      .finally(() => (isSending = false));
  }
}

function loadMessages() {
  var roomId = localStorage.getItem("currentRoomId");
  if (roomId) {
    sendAjax(`/load/${roomId}/messages`, "GET")
      .then((messages) => {
        const chatView = $("#chat-view");
        const fixView =
          chatView.scrollTop() + chatView.innerHeight() >=
          chatView[0].scrollHeight;

        chatView.empty();
        messages.forEach((message) => addMessage(message));

        if (fixView) {
          chatView.scrollTop(chatView[0].scrollHeight);
        }
      })
      .catch((error) => console.error("메세지 로드 오류:", error));
  }
}

async function addMessage(message) {
  var chatView = document.getElementById("chat-view");
  var messageElement = document.createElement("div");

  const currentUser = await getCurrentUserId();
  if (message.senderId === currentUser) {
    messageElement.classList.add("message", "sent");
  } else {
    messageElement.classList.add("message", "received");
    var senderName = document.createElement("div");
    senderName.classList.add("sender-name");
    senderName.textContent = message.senderName;
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
  messageTime.textContent = new Date(message.timestamp).toLocaleTimeString();
  messageElement.appendChild(messageTime);

  chatView.appendChild(messageElement);
  chatView.scrollTop = chatView.scrollHeight;
}

async function getCurrentUserId() {
  try {
    const response = await sendAjax("/getUserId", "GET");
    return response.userId;
  } catch (error) {
    console.error("통신에러 ", error.status, error);
  }
}

async function sendAjax(url, type, data = {}) {
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
