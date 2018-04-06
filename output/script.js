let maxImagesPerHour = 120; //every 30 seconds for worst case scenario of 3600 images

$(document).ready(function() {

	//setup basic accordion functionality
	setupAccordionMultiOpen();

	//setup dynamic image loading
	$('.hour').click(function() {
		let $hourWrapper = $(this).parent();
		if (!hasLoadedImages($hourWrapper)) {
			loadImages($hourWrapper);
		}
	});

	//expand and scroll to the most recent day
	$('#newestDay').click();
	$('html, body').animate({
		scrollTop: $('#newestDay').offset().top
	}, 2000);

	//show modal when image is clicked
	$('.imageWrapper').click(handleImageClick);

	//map key events to modal button clicks
	$(document).keyup(function(e) {
		if (e.keyCode === 27) { // esc
			$('#modalClose').click();
		} else if (e.keyCode === 37) { // left
			$('#modalLeft').click();
		} else if (e.keyCode === 39) { // right
			$('#modalRight').click();
		};
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

function handleImageClick() {
	let $imageWrapper = $(this);
	showModalForImage($imageWrapper);

}

function showModalForImage($imageWrapper) {
	$('#modal').remove();
	let $modal = $('<div id="modal">');

	//add buttons
	//https://fontawesome.com/icons?d=gallery
	$modal.append('<i class="fas fa-minus-circle" id="modalClose"></i>');
	$modal.append('<i class="far fa-arrow-alt-circle-left" id="modalLeft"></i>');
	$modal.append('<i class="far fa-arrow-alt-circle-right" id="modalRight"></i>');
	$modal.appendTo('body');

	//add the images
	$modal.append($imageWrapper.clone());

	setupModalEventHandlers();

	//keep track of which modal is visible
	$imageWrapper.attr('id', 'focused');
}

function setupModalEventHandlers() {
	//button clicks
	$('#modalClose').click(function() {
		$('#modal').remove();
	});
	$('#modalLeft').click(function() {
		$activeImageWrapper = $('#focused');
		$prevImageWrapper = $activeImageWrapper.prev();
		if ($prevImageWrapper.length > 0) {
			$activeImageWrapper.removeAttr('id');
			showModalForImage($prevImageWrapper);
		}
	});
	$('#modalRight').click(function() {
		$activeImageWrapper = $('#focused');
		$nextImageWrapper = $activeImageWrapper.next();
		if ($nextImageWrapper.length > 0) {
			$activeImageWrapper.removeAttr('id');
			showModalForImage($nextImageWrapper);
		}
	});

}
