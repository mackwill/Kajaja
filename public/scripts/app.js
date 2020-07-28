$(document).ready(() => {
  $(document).on("click", "#respond-to-conversation", function (e) {
    const splitURL = window.location.href.split("/");
    const messageThread = splitURL[splitURL.length - 1];
    console.log("messageThread", messageThread);
    e.preventDefault();
    e.stopImmediatePropagation();
    const formData = $(this).parent().serialize();
    console.log("formData: ", formData);
    $.post(`/api/messages/${messageThread}`, formData).then(() => {
      $("section").load("#message-thread");
      // });
    });
  });
});

// //   });
// //   //   $.ajax({
// //   //     method: "GET",
// //   //     url: "/api/users",
// //   //   }).done((users) => {
// //   //     for (user of users) {
// //   //       $("<div>").text(user.name).appendTo($("body"));
// //   //     }
// //   //   });

// //   // $.ajax({
// //   //   method: "GET",
// //   //   url: "/api/widgets/listings",
// //   // }).done((data) => {
// //   //   console.log("data:", data);
// //   //   listings.forEach((listing) => {
// //   //     $("#all-listings").prepend(createSingleListing(listing));
// //   //   //   });
// //   //   // });
