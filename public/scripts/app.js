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

  $(document).on("click", ".listing-footer", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log("hjere");
  });
});
