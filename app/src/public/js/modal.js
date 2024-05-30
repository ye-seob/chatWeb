$(document).ready(function () {
  // 모달 요소들 초기화
  var addModal = $("#myModal");
  var deleteModal = $("#myDeleteModal");
  var friendIdInput = $("#friendIdInput");
  var deleteChatRoomModal = $("#deleteChatRoomModal");
  var makeGroupChatModal = $("#makeGroupChatModal");

  // 모달 닫기 함수
  function closeModal(modal) {
    modal.hide();
  }

  // 모달 열기 함수
  function openModal(modal) {
    modal.show();
  }

  // 친구 목록 불러오기
  function loadFriend() {
    $.ajax({
      url: "/getUserInfo",
      type: "GET",
      dataType: "json",
      success: function (response) {
        var friendsListContainer = $("#friendsListContainer");
        friendsListContainer.empty();
        response.friendList.forEach(function (friend) {
          var friendHTML = `
            <div class="friend" data-friend-id="${friend.friendId}">
              <div class="friend-profile">
                <div class="friend-img"></div>
                <div class="friendName"><p>${friend.name}</p></div>
                <input type="checkbox" class="friend-checkbox" data-friend-id="${friend.friendId}">
              </div>
            </div>`;
          friendsListContainer.append(friendHTML);
        });
      },
      error: function (request, status, error) {
        console.error("Error loading friends:", status, error);
      },
    });
  }

  // 그룹 채팅방 생성
  function createGroupChatRoom() {
    var selectedFriendIds = $(".friend-checkbox:checked")
      .map(function () {
        return $(this).data("friend-id");
      })
      .get();

    if (selectedFriendIds.length < 2) {
      alert("그룹 채팅방을 생성하려면 최소 2명의 친구를 선택해야 합니다.");
      return;
    }

    $.ajax({
      url: "/createChatRoom",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ friendIds: selectedFriendIds }),
      success: function (response) {
        alert("그룹 채팅방이 생성되었습니다!");
        closeModal(makeGroupChatModal);
      },
      error: function (request, status, error) {
        alert("그룹 채팅방 생성 실패");
      },
    });
  }

  // 이벤트 리스너 설정
  $(window).click(function (event) {
    if (event.target === addModal[0]) closeModal(addModal);
    else if (event.target === deleteModal[0]) closeModal(deleteModal);
    else if (event.target === deleteChatRoomModal[0])
      closeModal(deleteChatRoomModal);
    else if (event.target === makeGroupChatModal[0])
      closeModal(makeGroupChatModal);
  });

  $(document).keydown(function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (deleteModal.is(":visible")) deleteFriend();
      else if (addModal.is(":visible")) addFriend();
      else if (deleteChatRoomModal.is(":visible")) deleteChatRoom();
      else if (makeGroupChatModal.is(":visible")) createGroupChatRoom();
      else sendMessage();
    }
  });

  $("#friend_id").keypress(function (event) {
    if (event.key === "Enter") addFriend();
  });

  // 모달 열기/닫기 함수들
  window.openModal = function () {
    openModal(addModal);
  };
  window.closeModal = function () {
    closeModal(addModal);
  };
  window.openDeleteModal = function (friendId) {
    deleteModal.show();
    friendIdInput.val(friendId);
  };
  window.closeDeleteModal = function () {
    closeModal(deleteModal);
  };
  window.openDeleteChatRoomModal = function () {
    openModal(deleteChatRoomModal);
  };
  window.closeDeleteChatRoomModal = function () {
    closeModal(deleteChatRoomModal);
  };
  window.openMakeGroupChatModal = function () {
    openModal(makeGroupChatModal);
    loadFriend();
  };
  window.closeMakeGroupChatModal = function () {
    closeModal(makeGroupChatModal);
  };

  // 초기 친구 목록 로드 및 그룹 채팅방 생성 버튼 설정
  loadFriend();
  $("#createGroupChatButton").click(createGroupChatRoom);
});
