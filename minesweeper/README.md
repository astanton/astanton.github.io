# Minesweeper UI Instructions

Given a backend for the classic computer game Minesweeper, build the UI.

## Background

If you're unfamiliar with how Minesweeper works, ask questions and/or play with http://minesweeper.github.io/ for a few minutes.

##  Backend

A Minesweeper backend should be running at https://mysterious-fortress-3493.herokuapp.com. It serves the following two endpoints:

### Start new game

    POST /init

Arguments:

  * `height`: the number of rows.
  * `width`: the number of columns.
  * `count`: the number of bombs.

Response format:

    {"status": "ok"} // or error message

### Reveal a cell

    POST /reveal

Arguments:

* `x`: the x-coordinate of the cell to be revealed.
* `y`: the y-coordinate of the cell to be revealed.

Response format:

    {"status": "ok", cells: array} // or error message

The `array` will be be an array of the cells that should be revealed in the UI, each containing `x` and `y` coordinates and a `count` of adjacent bombs. If `count` is `-1`, it's a bomb.

## Local server

To serve the contents of this directory for local development, run

    python -m SimpleHTTPServer 4000

Visit http://127.0.0.1:4000/ (not localhost).
