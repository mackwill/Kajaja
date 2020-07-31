$('#placeholder').click(function() {
  $('#img-upload').trigger('click');
});

function previewFile() {
  let preview = document.querySelector('img');
  let file    = document.querySelector('input[type=file]').files[0];
  let reader  = new FileReader();

  reader.addEventListener("load", function() {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}
