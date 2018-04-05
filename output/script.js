$(document).ready(() => {

  $('.hour h2').click(function() {
    checkForUnloadedImages($(this).parent());
    $(this).siblings('.imageWrapper.loaded').toggle();
  });



});

function checkForUnloadedImages($hour) {
  let $unloadedImages = $hour.children('.notLoaded');
  if ($unloadedImages.length > 100) {
    $unloadedImages.slice(0, 100).each(function() {
      loadImages($(this));
    });
  } else {
    $unloadedImages.each(function() {
      loadImages($(this));
    })
  }

}

function loadImages($imageWrapper) {
  var url = $imageWrapper.data('url');
  console.log(url);
  $imageWrapper.children('img').attr('src', url);
  $imageWrapper.removeClass('notLoaded');
  $imageWrapper.addClass('loaded');
}
