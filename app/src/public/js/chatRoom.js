$(document).ready(function () {
  loadChatRoom();
  AutoLoading();
});

function AutoLoading() {
  setInterval(() => {
    loadChatRoom();
    loadMessages();
  }, 3000);
}

let isDeleting = false;

function loadChatRoom() {
  sendAjax("/loadChatRoom", "GET")
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

function selectRoom(roomId) {
  sendAjax("/getRoomName", "GET", { roomId: roomId })
    .then((response) => {
      const roomName = $("#roomName");
      roomName.empty();
      var nameHTML = `<p>${response.roomName}</p>`;
      roomName.append(nameHTML);
      loadMessages(roomId);
    })
    .catch((error) => console.error("Error loading chat rooms:", error));
  localStorage.setItem("currentRoomId", roomId);
}

function deleteChatRoom() {
  if (isDeleting) return;

  var roomId = localStorage.getItem("currentRoomId");

  if (roomId) {
    isDeleting = true;
    sendAjax(`/deleteChatRoom/${roomId}`, "DELETE")
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
