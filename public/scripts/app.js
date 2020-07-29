$(document).ready(() => {
  $(document).on("click", "#respond-to-conversation", function (e) {
    const splitURL = window.location.href.split("/");
    const messageThread = splitURL[splitURL.length - 1];
    e.preventDefault();
    e.stopImmediatePropagation();
    const formData = $(this).parent().serialize();
    $.post(`/api/messages/${messageThread}`, formData)
      .then((x) => {
        $("#message-thread").load(
          `/api/messages/${messageThread} #message-thread`
        );
        $("#message-respond").val("");
      })
      .catch((err) => {
        console.error("Error: ", err);
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
// });
// $(() => {
//   $(document).on('click', '#notificationSwitch', function(e){

//     console.log($('#notificationSwitch').val())
//   })
// })
