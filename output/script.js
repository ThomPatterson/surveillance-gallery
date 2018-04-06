let maxImagesPerHour = 120; //every 30 seconds for worst case scenario of 3600 images

$(document).ready(() => {

  $('.hour h2').click(function() {

    //get a reference to the wrapper for this hour
    let $hour = $(this).parent();

    //load images if they haven't already been
    if (!hasLoadedImages($hour)) loadImages($hour);

    //toggle visibility for this hour
    $(this).siblings('.imageWrapper.loaded').toggle();
  });



});

function hasLoadedImages($hour) {
  return $hour.children('.loaded').length > 0;
}

function loadImages($hour) {
  let $unloadedImages = $hour.children('.notLoaded');
  let numUnloadedImages = $unloadedImages.length;
  if (numUnloadedImages > maxImagesPerHour) {
    let everyNthImage = Math.round(numUnloadedImages / maxImagesPerHour);
    for (let i = 0; i <= numUnloadedImages; i += everyNthImage) {
      loadImage($unloadedImages.eq(i));
    }
    updateMessage($hour, $hour.children('.loaded').length, numUnloadedImages, everyNthImage);
  } else {
    $unloadedImages.each(function() {
      loadImage($(this));
    });
  }

}

function loadImage($imageWrapper) {
  var url = $imageWrapper.data('url');
  $imageWrapper.children('img').attr('src', url);
  $imageWrapper.removeClass('notLoaded');
  $imageWrapper.addClass('loaded');
}

function updateMessage($hour, numLoaded, total, everyNth) {
  $hour.find('.imageCount').html('(' + numLoaded + ' of ' + total + ' loaded, every ' + ordinalSuffixOf(everyNth) + ' image)');
}

function ordinalSuffixOf(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "<sup>st</sup>";
    }
    if (j == 2 && k != 12) {
        return i + "<sup>nd</sup>";
    }
    if (j == 3 && k != 13) {
        return i + "<sup>rd</sup>";
    }
    return i + "<sup>th</sup>";
}
