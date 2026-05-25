let canvas;
let keyboard;
let world;
let soundManager;
let resultAnimationInterval;

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

function addClick(id, handler) {
    document.getElementById(id).addEventListener('click', handler);
}

function startGame() {
    stopWorld();
    keyboard.reset();
    hideOverlays();
    world = new World(canvas, keyboard, soundManager, showEndScreen);
    world.start();
    soundManager.startMusic();
    document.body.classList.add('is-playing');
}

function stopWorld() {
    if (world) world.stop();
    soundManager.stopMusic();
}

function hideOverlays() {
    stopResultAnimation();
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
}

function showEndScreen(result) {
    soundManager.stopMusic();
    startResultAnimation(result);
    document.getElementById('endScreen').classList.remove('hidden');
}

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

function showResultFrame(images, index, result) {
    const image = document.getElementById('resultImage');
    image.src = images[index];
    image.alt = result === 'won' ? 'You won' : 'Game over';
}

function stopResultAnimation() {
    clearInterval(resultAnimationInterval);
    resultAnimationInterval = null;
}

function showHomeScreen() {
    stopWorld();
    stopResultAnimation();
    document.body.classList.remove('is-playing');
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('endScreen').classList.add('hidden');
}

function openHelpDialog() {
    const dialog = document.getElementById('helpDialog');
    dialog.showModal ? dialog.showModal() : dialog.setAttribute('open', '');
}

function closeHelpDialog() {
    const dialog = document.getElementById('helpDialog');
    dialog.close ? dialog.close() : dialog.removeAttribute('open');
}

function closeDialogOnBackdrop(event) {
    if (event.target.id === 'helpDialog') closeHelpDialog();
}

function toggleFullscreen() {
    const shell = document.getElementById('gameShell');
    const action = document.fullscreenElement ? document.exitFullscreen() : shell.requestFullscreen();
    if (action) action.catch(() => {});
}

function toggleMute() {
    soundManager.toggleMute();
    updateMuteButton();
    if (!soundManager.muted && document.body.classList.contains('is-playing')) {
        soundManager.startMusic();
    }
}

function updateMuteButton() {
    const button = document.getElementById('muteButton');
    const label = button.querySelector('.button-label') || button;
    label.textContent = soundManager.muted ? 'Ton aus' : 'Ton an';
    button.setAttribute('aria-pressed', String(soundManager.muted));
}
