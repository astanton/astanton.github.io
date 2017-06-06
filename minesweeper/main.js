// CORS support

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  options.crossDomain = {crossDomain: true};
  options.xhrFields = {withCredentials: true};
});

MineSweeper = (function($) {

	var HEIGHT = 10;
	var WIDTH = 10;
	var COUNT = 10;

	var sessionPromise;

	var init = function() {
		initBoard();
		initSession();
	};

	var initBoard = function() {
		var $board = $('.board');

		for (var a = 0; a < WIDTH; a++) {
			var $row = $('<div class="row">');

			for (var b = 0; b < HEIGHT; b++) {
				var $cell = $('<div class="cell" data-x="' + a + '" data-y="' + b + '">');
				$cell.on('click', cellClicked);
				$row.append($cell);
			}

			$board.append($row);
		}
	}

	var initSession = function() {
		sessionPromise = $.Deferred();
		var data = {
			height: HEIGHT,
			width: WIDTH,
			count: COUNT
		}

		$.ajax({
			url: "https://mysterious-fortress-3493.herokuapp.com/init",
			type: "POST",
			data: data
		}).done(function(response) {
			console.log('response succeeded %o', response);
			sessionPromise.resolve();
		}).fail(function(response) {
			console.log('response failed %o', response);
			sessionPromise.reject();
		})
	}

	var cellClicked = function(e) {
		var x = $(e.target).attr('data-x');
		var y = $(e.target).attr('data-y');
		console.log('cell clicked x=%o, y=%o', x, y);

		if (!sessionPromise || sessionPromise.state() !== "resolved") {
			console.error('session was not initialized try later');
			return;
		}

		$.ajax({
			url: "https://mysterious-fortress-3493.herokuapp.com/reveal",
			type: "POST",
			data: {
				x: x,
				y: y
			}
		}).done(function(response) {
			console.log('response succeeded %o', response);
			handleRevealResponse(response.cells);

		}).fail(function(response) {
			console.log('response failed %o', response);
		})
	}

	var handleRevealResponse = function(cells) {
		for (var a = 0; a < cells.length; a++) {
			var cell = cells[a];
			var $cell = $('.board [data-x="' + cell.x + '"][data-y="' + cell.y + '"]');
			var $wrapper = $('<div class="text-wrapper">');
			$wrapper.text(cell.count);
			$cell.append($wrapper);
		}
	}

	return {
		init: init
	}
})(jQuery);

$(document).ready(MineSweeper.init);