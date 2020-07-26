$(document).ready(function () {
  // Check for click events on the navbar burger icon

  $(document).on("click", ".dropdown", function (e) {
    e.stopImmediatePropagation();

    if (this.className.includes("is-active")) {
      $(".dropdown").removeClass("is-active");
    } else {
      $(".dropdown").addClass("is-active");
    }
  });

  $(document).on("click", function (e) {
    e.stopImmediatePropagation();
    if ($("#category-dropdown").attr("class").includes("is-active")) {
      $(".dropdown").removeClass("is-active");
    }
  });
});
