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
      $("#message-thread").load(
        `/api/messages/${messageThread} #message-thread`
      );
      $("#message-respond").val("");
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
<<<<<<< HEAD
=======
// });
// $(() => {
//   $(document).on('click', '#notificationSwitch', function(e){

//     console.log($('#notificationSwitch').val())
//   })
// })
>>>>>>> 6c514ae1e3cfb799663472c4c040945c976d535d
