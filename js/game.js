let canvas;
let keyboard;
let world;

/**
 * Initializes canvas, controls and the first playable world.
 */
function init() {
    canvas = document.getElementById('gameCanvas');
    keyboard = new Keyboard();
    world = new World(canvas, keyboard);
    world.start();
}
