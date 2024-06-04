$(document).ready(function () {
  if (localStorage.getItem("dark-mode") === "enabled") {
    $("body").addClass("dark-mode");
    $(".dark-mode-toggle").prop("checked", true);
  }

  $(".dark-mode-toggle").on("change", function () {
    $("body").toggleClass("dark-mode");
    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
    } else {
      localStorage.removeItem("dark-mode");
    }
  });
});
