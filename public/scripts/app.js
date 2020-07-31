$(document).ready(() => {
  // Post request to allow user to respond to a message thread,
  // and the message thread updates without the page refreshing
  $(document).on("click", "#respond-to-conversation", function(e) {
    const splitURL = window.location.href.split("/");
    const messageThread = splitURL[splitURL.length - 1];
    e.preventDefault();
    e.stopImmediatePropagation();
    const formData = $(this).parent().serialize();
    $.post(`/api/messages/${messageThread}`, formData)
      .then(() => {
        $("#message-thread").load(
          `/api/messages/${messageThread} #message-thread`
        );
        $("#message-respond").val("");
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  });

  // Post request to delete a listing when a user
  // is logged into their account
  $(document).on("click", ".delete_listing", function(e) {
    const splitURL = window.location.href.split("/");
    const user = splitURL[splitURL.length - 1];
    e.preventDefault();
    e.stopImmediatePropagation();
    const listingId = $(this).attr("id");
    $.ajax({
      url: `/api/listings/${listingId}`,
      type: "DELETE",
    }).then(() => {
      $("#all-listings").load(`/api/users/${user} #all-listings`);
    });
  });

  // GET request to allow the user to favourite a listing
  // and add it to their favourites page
  $(document).on("click", ".favourite-link", function(e) {
    const $this = $(this);
    const listingId = $(this).attr("id");
    const listingBtn = $(this);

    e.preventDefault();
    e.stopImmediatePropagation();
    $.ajax({
      url: `/api/favourites/${listingId}`,
      type: "POST",
      success: function(result) {
        // $(listingBtn).append(result.message);
        $(`#favourite-alert`).find(".modal-body").html(result.message);
        $(`#favourite-alert`).modal("show");
      },
    });
  });

  $("#search_query").focus(function(e) {
    $("#search div").show();
  });

  // POST request to allow the user to respond to
  // a listing and start a new message thread
  $(document).on("click", "#submit-message", function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const formData = $("#contact-seller-form").serialize();
    $.post(`/api/messages`, formData).then(() => {
      $("#contact-seller-form").hide();
      $("#message-sent-alert").show();
    });
  });
});
