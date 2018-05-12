let app;
let photoList;
$(function() {
  $.ajax({
    type: "GET",
    url: "/title",
    dataType: "text"
  }).done(function(response) {
    $("head title").text(response)
    $("h1").text(response);
  });

  let next_url = $("#next_link").attr("href");
  $.ajax({
    type: "GET",
    url: next_url,
    dataType: "json"
  }).done(function(response) {
    photoList = response.photos;
    app = new Vue({
      el: "#content",
      data: {
        photoList: photoList
      }
    });
    if (response.next) {
      $("#next_link").attr("href", response.next);
    } else {
      $("#next_link").remove();
    }
  });

  $("body").on("click", "#next_link", function(event) {
    event.preventDefault();
    event.stopPropagation();
    let next_url = $("#next_link").attr("href");
    $.ajax({
      type: "GET",
      url: next_url,
      dataType: "json"
    }).done(function(response) {
      if (response.photos) {
        response.photos.forEach(function(v) { photoList.push(v); });
      }
      if (response.next) {
        $("#next_link").attr("href", response.next);
      } else {
        $("#next_link").remove();
      }
    });
  });

  $("#upload_button").on("click", function(event) {
    let ext = $("#upload_form input[name=file]").val().split(".").pop().toLowerCase();
    if ($.inArray(ext, ["jpg", "jpeg", "png", "gif"]) == -1) {
      alert("Unsupported format!\nSupport only jpg, png, gif.");
      $("input[name=file]").val("");
      $("input[name=key]").val("");
    } else {
      let fd = new FormData($("#upload_form").get(0));
      $.ajax({
        url: "/upload",
        type: "POST",
        data: fd,
        contentType: false,
        processData: false,
        dataType: "json"
      }).done(function(response) {
        $("input[name=file]").val("");
        $("input[name=key]").val("");
        photoList.unshift(response.photo);
      });
    }
  });
});
