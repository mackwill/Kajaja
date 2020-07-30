$(document).ready(() => {
  $(document).on("click", "#respond-to-conversation", function (e) {
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

  $(document).on("click", ".delete_listing", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const listingId = $(this).attr("id");
    $.ajax({
      url: `/api/widgets/listings/${listingId}`,
      type: "DELETE",
      success: function (result) {
        $(listingId).append(result.message)
        console.log("item deleted", success);
      },
    });
  });

  $(document).on("click", ".favourite-link", function (e) {
    const listingId = $(this).attr('id')
    const listingBtn = $(this)

    e.preventDefault();
    e.stopImmediatePropagation();
    $.ajax({
      url:`/api/widgets/favourites/${listingId}`,
      type:'POST',
      success: function(result){
        $(listingBtn).append(result.message)
      }
    })
  });

  $('#search_query').focus(function (e) {
    $('#search div').show()
  })


  $(document).on("click", "#submit-message", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const formData = $("#contact-seller-form").serialize();
    $.post(`/api/messages`, formData).then(() => {
      $("#contact-seller-form").hide();
      $("#message-sent-alert").show();
    })
  })
});
