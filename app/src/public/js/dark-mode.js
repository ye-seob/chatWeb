$(document).ready(function () {
  // 로컬 스토리지에서 다크 모드 상태를 불러오기
  if (localStorage.getItem("dark-mode") === "enabled") {
    $("body").addClass("dark-mode");
    $(".dark-mode-toggle").prop("checked", true);
  }

  // 다크 모드 토글 버튼 클릭 이벤트
  $(".dark-mode-toggle").on("change", function () {
    $("body").toggleClass("dark-mode");
    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
    } else {
      localStorage.removeItem("dark-mode");
    }
  });
});
