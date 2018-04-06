let maxImagesPerHour = 120; //every 30 seconds for worst case scenario of 3600 images

$(document).ready(function() {

  //setup basic accordion functionality
  setupAccordionMultiOpen();

  //setup dynamic image loading
  $('.hour').click(function() {
    let $hourWrapper = $(this).parent();
    if (!hasLoadedImages($hourWrapper)) {
      console.log('No images loading, starting the process');
      loadImages($hourWrapper);
    }
  });

});

function setupAccordionOneOpen() {
  //https://codepen.io/brenden/pen/Kwbpyj
  $('.toggle').click(function(e) {
    e.preventDefault();

    var $this = $(this);

    if ($this.next().hasClass('show')) {
      $this.next().removeClass('show');
      $this.next().slideUp(350);
    } else {
      $this.parent().parent().find('li .inner').removeClass('show');
      $this.parent().parent().find('li .inner').slideUp(350);
      $this.next().toggleClass('show');
      $this.next().slideToggle(350);
    }
  });
}

function setupAccordionMultiOpen() {
  $('.toggle').click(function(e) {
    var $this = $(this);
    $this.next().toggleClass('show');
    $this.next().slideToggle(350);
  });
}

function hasLoadedImages($hourWrapper) {
  return $hourWrapper.find('.loaded').length > 0;
}

function loadImages($hourWrapper) {
  let $unloadedImages = $hourWrapper.find('.notLoaded');
  let numUnloadedImages = $unloadedImages.length;
  if (numUnloadedImages > maxImagesPerHour) {
    let everyNthImage = Math.round(numUnloadedImages / maxImagesPerHour);
    for (let i = 0; i <= numUnloadedImages; i += everyNthImage) {
      loadImage($unloadedImages.eq(i));
    }
    updateMessage($hourWrapper, $hourWrapper.find('.loaded').length, numUnloadedImages, everyNthImage);
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
