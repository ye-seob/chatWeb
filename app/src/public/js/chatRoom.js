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
async function loadChatRoom() {
  try {
    const response = await sendAjax("/loadChatRoom", "GET");
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
  } catch (error) {
    console.error("채팅방 로드 오류", error);
  }
}

async function selectRoom(roomId) {
  try {
    const response = await sendAjax("/getRoomName", "GET", { roomId: roomId });
    const roomName = $("#roomName");

    roomName.empty();

    var nameHTML = `<p>${response.roomName}</p>`;

    roomName.append(nameHTML);
    await loadMessages(roomId);
  } catch (error) {
    console.error("채팅방 로드 오류", error);
  }

  localStorage.setItem("currentRoomId", roomId);
}

let isDeleting = false;

async function deleteChatRoom() {
  if (isDeleting) return;

  var roomId = localStorage.getItem("currentRoomId");

  if (roomId) {
    isDeleting = true;
    try {
      await sendAjax(`/deleteChatRoom/${roomId}`, "DELETE");
      alert("채팅방이 삭제되었습니다.");
      closeDeleteChatRoomModal();
      await loadChatRoom();
    } catch (error) {
      console.error("채팅방 삭제 실패:", error);
      alert("채팅방 삭제에 실패했습니다.");
    } finally {
      isDeleting = false;
    }
  }
}
