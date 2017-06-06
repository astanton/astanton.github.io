$(document).ready(function() {

	var CROPAREA_MIN_POSITION = 0;
	var BORDER_WIDTH = 2;

	var TOP = 'top';
	var RIGHT = 'right';
	var BOTTOM = 'bottom';
	var LEFT = 'left';

	var $document, $cropArea, $cropButton, $neResizer, $swResizer, $canvas, $container;
	var cropAreaDragEvent, neResizerDragEvent, swResizerDragEvent;
	var cropAreaStartTop, cropAreaStartRight, cropAreaStartBottom, cropAreaStartLeft;
	var canvasContext, canvasImage, canvasImageDiffX, canvasImageDiffY;
	var currentCropAreaTop, currentCropAreaRight, currentCropAreaBottom, currentCropAreaLeft, currentCropAreaHeight, currentCropAreaWidth;
	var cropAreaDragging = false, neResizerDragging = false, swResizerDragging = false;
	
	initControls();
	initControlPositions();
	initControlHandlers();
	initCanvas();

	function initControls() {
		$document = $(document);
		$container = $('.container');
		$cropArea = $('#croparea');
		$cropButton = $('#docrop');
		$neResizer = $('#ne-resizer');
		$swResizer = $('#sw-resizer');
		$canvas = $('#cropimg');
	};

	function initControlPositions() {
		var props = {};
		props[TOP] = '0';
		props[RIGHT] = '0';
		props[BOTTOM] = '0';
		props[LEFT] = '0';
		$cropArea.css(props);

		props = {};
		props[TOP] = '-20';
		props[RIGHT] = '-20';
		$neResizer.css(props);

		props = {};
		props[BOTTOM] = '-20';
		props[LEFT] = '-20';
		$swResizer.css(props);
	};

	function initControlHandlers() {
		$document.on('mouseup', onDocumentMouseUp);
		$cropArea.on('mousedown', onCropAreaMouseDown);
		$neResizer.on('mousedown', onNeResizerMouseDown);
		$swResizer.on('mousedown', onSwResizerMouseDown);
		$cropButton.on('click', onCropButtonClicked);
	};

	function initCropAreaStartPositions() {
		cropAreaStartTop = parseInt($cropArea.css(TOP));
		cropAreaStartRight = parseInt($cropArea.css(RIGHT));
		cropAreaStartBottom = parseInt($cropArea.css(BOTTOM));
		cropAreaStartLeft = parseInt($cropArea.css(LEFT));
	};

	function initCurrentCropAreaValues() {
		currentCropAreaTop = parseInt($cropArea.css(TOP));
		currentCropAreaRight = parseInt($cropArea.css(RIGHT));
		currentCropAreaBottom = parseInt($cropArea.css(BOTTOM));
		currentCropAreaLeft = parseInt($cropArea.css(LEFT));
		currentCropAreaHeight = $cropArea.height();
		currentCropAreaWidth = $cropArea.width();
	};

	function initCanvas() {
		canvasContext = $canvas[0].getContext('2d');
		canvasImage = new Image;
		canvasImage.onload = function() {
			canvasImageDiffX = canvasImage.width - $container.width();
			canvasImageDiffY = canvasImage.height - $container.height();
			updateCanvas();
		};
		canvasImage.src = $container.css('background-image').slice(5, -2);
	};

	function updateCanvas() {
		var scale = getCanvasScale();
		var top = parseInt($cropArea.css(TOP)) + BORDER_WIDTH;   // +2 for border
		var left = parseInt($cropArea.css(LEFT)) + BORDER_WIDTH; // +2 for border
		
		var translateX = canvasImageDiffX/2;
		var translateY = canvasImageDiffY/2;
		var width = $cropArea.width() + translateX;
		var height = $cropArea.height() + translateY;

		canvasContext.clearRect(0, 0, width, height);
		canvasContext.scale(scale, scale);
		canvasContext.translate(-translateX, -translateY);
		canvasContext.drawImage(canvasImage, left, top, width, height, 0, 0, width, height);
		canvasContext.translate(translateX, translateY);
		canvasContext.scale(1/scale, 1/scale);
	}

	function getCanvasScale() {
		var width = $cropArea.width();
		var height = $cropArea.height();
		var scale = 100 / ( width > height ? width : height );
		return scale;
	};

	function onDocumentMouseMove(event) {

		event.originalEvent.preventDefault(); // fixes a bug that occurs sometimes while dragging quickly in chrome
		
		if (neResizerDragging) {
			handleNeResizerDragging(event);
		}
		else if (swResizerDragging) {
			handleSwResizerDraggin(event);
		}
		else if (cropAreaDragging) {
			handleCropAreaDragging(event);
		}
	};

	function onDocumentMouseUp(event) {
		cropAreaDragging = false;
		neResizerDragging = false;
		swResizerDragging = false;
		$document.off('mousemove', onDocumentMouseMove);
	};

	function onCropAreaMouseDown(event) {
		cropAreaDragging = true;
		cropAreaDragEvent = event;
		$document.on('mousemove', onDocumentMouseMove);
		initCropAreaStartPositions();
	};

	function onNeResizerMouseDown(event) {
		neResizerDragging = true;
		neResizerDragEvent = event;
		$document.on('mousemove', onDocumentMouseMove);
		initCropAreaStartPositions();
		event.stopPropagation();
	};

	function onSwResizerMouseDown(event) {
		swResizerDragging = true;
		swResizerDragEvent = event;
		$document.on('mousemove', onDocumentMouseMove);
		initCropAreaStartPositions();
		event.stopPropagation();
	};

	function onCropButtonClicked(event) {
		var topLeft = {
			x: parseInt($cropArea.css(LEFT)) + BORDER_WIDTH, // +2 for border
			y: parseInt($cropArea.css(TOP)) + BORDER_WIDTH   // +2 for border
		};
		var bottomRight = {
			x: topLeft.x + $cropArea.width(),
			y: topLeft.y + $cropArea.height()
		};
		var str = ('top left point is (' + topLeft.x + ', ' + topLeft.y + ') and bottom right point is (' + bottomRight.x + ', ' + bottomRight.y + ')');
		alert(str);
	};

	function handleCropAreaDragging(mouseMoveEvent) {
		var xdiff = mouseMoveEvent.pageX - cropAreaDragEvent.pageX;
		var ydiff = mouseMoveEvent.pageY - cropAreaDragEvent.pageY;

		var cropAreaTop = cropAreaStartTop + ydiff;
		var cropAreaRight = cropAreaStartRight - xdiff;
		var cropAreaBottom = cropAreaStartBottom - ydiff;
		var cropAreaLeft = cropAreaStartLeft + xdiff;

		var top = cropAreaTop > CROPAREA_MIN_POSITION ? cropAreaTop : CROPAREA_MIN_POSITION;
		var right = cropAreaRight > CROPAREA_MIN_POSITION ? cropAreaRight : CROPAREA_MIN_POSITION;
		var bottom = cropAreaBottom > CROPAREA_MIN_POSITION ? cropAreaBottom : CROPAREA_MIN_POSITION;
		var left = cropAreaLeft > CROPAREA_MIN_POSITION ? cropAreaLeft : CROPAREA_MIN_POSITION;

		if (cropAreaBottom < CROPAREA_MIN_POSITION) {
			top += cropAreaBottom;
		}
		if (cropAreaTop < CROPAREA_MIN_POSITION) {
			bottom += cropAreaTop;
		}
		if (cropAreaRight < CROPAREA_MIN_POSITION) {
			left += cropAreaRight;
		}
		if (cropAreaLeft < CROPAREA_MIN_POSITION) {
			right += cropAreaLeft;
		}

		var props = {};
		props[TOP] = top;
		props[RIGHT] = right;
		props[BOTTOM] = bottom;
		props[LEFT] = left;
		$cropArea.css(props);

		updateCanvas();
	};

	function handleNeResizerDragging(mouseMoveEvent) {
		handleResizerDragging(mouseMoveEvent, neResizerDragEvent, 
								cropAreaStartRight, -1, RIGHT,
								cropAreaStartTop, 1, TOP);
	};

	function handleSwResizerDraggin(mouseMoveEvent) {
		handleResizerDragging(mouseMoveEvent, swResizerDragEvent, 
								cropAreaStartLeft, 1, LEFT,
								cropAreaStartBottom, -1, BOTTOM);
	};

	function handleResizerDragging(mouseMoveEvent, resizerDragEvent, 
									cropAreaStartHoriz, horizMultiplier, horizString, 
									cropAreaStartVert, vertMultiplier, vertString) {

		var xdiff = mouseMoveEvent.pageX - resizerDragEvent.pageX;
		var ydiff = mouseMoveEvent.pageY - resizerDragEvent.pageY;

		var cropAreaHoriz = cropAreaStartHoriz + (xdiff * horizMultiplier);
		var cropAreaVert = cropAreaStartVert + (ydiff * vertMultiplier);

		var horiz = cropAreaHoriz > CROPAREA_MIN_POSITION ? cropAreaHoriz : CROPAREA_MIN_POSITION;
		var vert = cropAreaVert > CROPAREA_MIN_POSITION ? cropAreaVert : CROPAREA_MIN_POSITION;

		initCurrentCropAreaValues();

		var currentCropAreaHoriz = horizString === RIGHT ? currentCropAreaRight : currentCropAreaLeft;
		var currentCropAreaVert = vertString === TOP ? currentCropAreaTop : currentCropAreaBottom;

		var widthDiff = currentCropAreaWidth - (horiz - currentCropAreaHoriz);
		var heightDiff = currentCropAreaHeight - (vert - currentCropAreaVert);

		if (widthDiff < 100) {
			horiz -= 100 - widthDiff;
		}

		if(heightDiff < 100) {
			vert -= 100 - heightDiff;
		}

		var cssProps = {};
		cssProps[horizString] = horiz;
		cssProps[vertString] = vert;
		$cropArea.css(cssProps);

		updateCanvas();
	}

});