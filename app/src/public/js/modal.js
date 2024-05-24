var addModal = $("#myModal")[0]; // jQuery 객체를 DOM 객체로 변환
var deleteModal = $("#myDeleteModal")[0];
var friendIdInput = $("#friendIdInput")[0];
var deleteChatRoomModal = $("#deleteChatRoomModal")[0];

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

function openDeleteChatRoomModal() {
  deleteChatRoomModal.style.display = "block";
  window.onclick = function (event) {
    if (event.target == deleteChatRoomModal) {
      closeDeleteChatRoomModal();
    }
  };
  $(document).ready(function () {
    $(".submit-btn").on("click", function (e) {
      e.preventDefault();
      deleteChatRoom();
    });

    $(document).on("keydown", function (e) {
      if (deleteChatRoomModal.style.display === "block" && e.key === "Enter") {
        e.preventDefault();
        deleteChatRoom();
      }
    });
  });
}
function closeDeleteChatRoomModal() {
  deleteChatRoomModal.style.display = "none";
}
