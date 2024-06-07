$(document).ready(function () {
  var darkMode = localStorage.getItem("dark-mode");
  if (darkMode === "enabled") {
    $("body").addClass("dark-mode");
    $(".dark-mode-btn").prop("checked", true);
  }

  $(".dark-mode-btn").change(function () {
    $("body").toggleClass("dark-mode");
    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
    } else {
      localStorage.removeItem("dark-mode");
    }
  });
});
