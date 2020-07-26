$(document).ready(function () {
  // Check for click events on the navbar burger icon

  $(document).on("click", ".navbar-burger", function (e) {
    e.stopImmediatePropagation();
    if (this.className.includes("is-active")) {
      $(".navbar-burger").removeClass("is-active");
      $(".navbar-menu").removeClass("is-active");
    } else {
      $(".navbar-burger").addClass("is-active");
      $(".navbar-menu").addClass("is-active");
    }
  });
});
