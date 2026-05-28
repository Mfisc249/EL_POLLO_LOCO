let canvas;
let keyboard;
let world;
let soundManager;
let resultAnimationInterval;
let startDelayTimeout;

const START_SCREEN_DELAY = 1000;

const RESULT_IMAGES = {
    won: [
        'img/You won, you lost/You Win A.png',
        'img/You won, you lost/Game over A.png',
    ],
    lost: [
        'img/You won, you lost/You lost.png',
        'img/You won, you lost/Game Over.png',
    ],
};

/**
 * Initializes canvas, controls and page actions.
 */
function init() {
    canvas = document.getElementById('gameCanvas');
    keyboard = new Keyboard();
    keyboard.bindTouchControls();
    soundManager = new SoundManager();
    bindPageActions();
    updateMuteButton();
}

/** Binds all page button actions. */
function bindPageActions() {
    addClick('startButton', startGame);
    addClick('restartButton', startGame);
    addClick('homeButton', showHomeScreen);
    addClick('helpButton', openHelpDialog);
    addClick('closeHelpButton', closeHelpDialog);
    addClick('fullscreenButton', toggleFullscreen);
    addClick('muteButton', toggleMute);
    document.getElementById('helpDialog').addEventListener('click', closeDialogOnBackdrop);
}

/**
 * Adds a click handler to one element.
 * @param {string} id Element id.
 * @param {Function} handler Click handler.
 */
function addClick(id, handler) {
    document.getElementById(id).addEventListener('click', handler);
}

/** Starts a new game session. */
function startGame() {
    clearStartDelay();
    stopWorld();
    keyboard.reset();
    showStartScreen();
    startDelayTimeout = setTimeout(runGame, START_SCREEN_DELAY);
}

/** Shows the canvas and intro screen before the world starts. */
function showStartScreen() {
    stopResultAnimation();
    document.body.classList.remove('is-playing');
    document.body.classList.add('is-starting');
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('endScreen').classList.add('hidden');
}

/** Starts the actual playable world after the intro screen. */
function runGame() {
    clearStartDelay();
    hideOverlays();
    world = new World(canvas, keyboard, soundManager, showEndScreen);
    world.start();
    soundManager.startMusic();
    document.body.classList.remove('is-starting');
    document.body.classList.add('is-playing');
}

/** Stops the active game world and music. */
function stopWorld() {
    if (world) world.stop();
    soundManager.stopMusic();
}

/** Clears a pending delayed game start. */
function clearStartDelay() {
    clearTimeout(startDelayTimeout);
    startDelayTimeout = null;
}

/** Hides all overlay screens. */
function hideOverlays() {
    stopResultAnimation();
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
}

/**
 * Shows the final end screen.
 * @param {string} result Final result key.
 */
function showEndScreen(result) {
    soundManager.stopMusic();
    startResultAnimation(result);
    document.getElementById('endScreen').classList.remove('hidden');
}

/**
 * Starts the final image sequence.
 * @param {string} result Final result key.
 */
function startResultAnimation(result) {
    stopResultAnimation();
    const images = RESULT_IMAGES[result];
    let index = 0;
    showResultFrame(images, index, result);
    resultAnimationInterval = setInterval(() => {
        index++;
        showResultFrame(images, index, result);
        if (index === images.length - 1) stopResultAnimation();
    }, 850);
}

/**
 * Shows one final result image.
 * @param {string[]} images Result image paths.
 * @param {number} index Image index.
 * @param {string} result Final result key.
 */
function showResultFrame(images, index, result) {
    const image = document.getElementById('resultImage');
    image.src = images[index];
    image.alt = result === 'won' ? 'You won' : 'Game over';
}

/** Stops the final image sequence. */
function stopResultAnimation() {
    clearInterval(resultAnimationInterval);
    resultAnimationInterval = null;
}

/** Returns from the game to the home screen. */
function showHomeScreen() {
    clearStartDelay();
    stopWorld();
    stopResultAnimation();
    document.body.classList.remove('is-playing', 'is-starting');
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('endScreen').classList.add('hidden');
}

/** Opens the help dialog. */
function openHelpDialog() {
    const dialog = document.getElementById('helpDialog');
    dialog.showModal ? dialog.showModal() : dialog.setAttribute('open', '');
}

/** Closes the help dialog. */
function closeHelpDialog() {
    const dialog = document.getElementById('helpDialog');
    dialog.close ? dialog.close() : dialog.removeAttribute('open');
}

/**
 * Closes the dialog when the backdrop is clicked.
 * @param {MouseEvent} event Click event.
 */
function closeDialogOnBackdrop(event) {
    if (event.target.id === 'helpDialog') closeHelpDialog();
}

/** Toggles fullscreen mode for the game shell. */
function toggleFullscreen() {
    const shell = document.getElementById('gameShell');
    const target = document.body.classList.contains('is-playing') ? shell : document.documentElement;
    const action = document.fullscreenElement ? document.exitFullscreen() : target.requestFullscreen();
    if (action) action.catch(() => {});
}

/** Toggles global sound mute. */
function toggleMute() {
    soundManager.toggleMute();
    updateMuteButton();
    if (!soundManager.muted && document.body.classList.contains('is-playing')) {
        soundManager.startMusic();
    }
}

/** Updates the mute button label. */
function updateMuteButton() {
    const button = document.getElementById('muteButton');
    const label = button.querySelector('.button-label') || button;
    label.textContent = soundManager.muted ? 'Ton aus' : 'Ton an';
    button.setAttribute('aria-pressed', String(soundManager.muted));
}
