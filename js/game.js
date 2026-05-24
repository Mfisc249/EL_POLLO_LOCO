let canvas;
let keyboard;
let world;
let soundManager;

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
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
}

function showEndScreen(result) {
    soundManager.stopMusic();
    setResultImage(result);
    document.getElementById('endScreen').classList.remove('hidden');
}

function setResultImage(result) {
    const image = document.getElementById('resultImage');
    image.src = result === 'won' ? 'img/You won, you lost/You Won B.png' : 'img/You won, you lost/Game Over.png';
    image.alt = result === 'won' ? 'You won' : 'Game over';
}

function showHomeScreen() {
    stopWorld();
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
    button.textContent = soundManager.muted ? 'Ton aus' : 'Ton an';
    button.setAttribute('aria-pressed', String(soundManager.muted));
}
