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

    $(document).on('click', '.delete_listing', function(e){
      e.preventDefault()
      e.stopImmediatePropagation()
      const listingId = $(this).attr('id')
      $.ajax({
        url:`/api/widgets/listings/${listingId}`,
        type:'DELETE',
        success: function(result){
          console.log('item deleted', success)
        }
      })
    })

  $(document).on("click", ".favourite-link", function (e) {
    const listingId = $(this).attr('id')
    e.preventDefault();
    e.stopImmediatePropagation();
    $.ajax({
      url:`/api/widgets/favourites/${listingId}`,
      type:'POST',
      success: function(result){
        console.log('it faved', result)
      }
    })
  });
});
