const KEY_BINDINGS = {
    ArrowRight: 'RIGHT',
    KeyD: 'RIGHT',
    ArrowLeft: 'LEFT',
    KeyA: 'LEFT',
    ArrowUp: 'UP',
    KeyW: 'UP',
    Space: 'UP',
    KeyF: 'THROW',
};

class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    THROW = false;

    constructor() {
        this.bindKeyboard();
    }

    /**
     * Updates key states from keyboard events.
     */
    bindKeyboard() {
        window.addEventListener('keydown', (event) => this.setKey(event, true));
        window.addEventListener('keyup', (event) => this.setKey(event, false));
    }

    /**
     * Updates key states from touch buttons.
     */
    bindTouchControls() {
        document.querySelectorAll('[data-key]').forEach((button) => {
            this.bindTouchButton(button);
        });
    }

    bindTouchButton(button) {
        const key = button.dataset.key;
        button.addEventListener('pointerdown', (event) => this.setTouch(event, key, true));
        button.addEventListener('pointerup', (event) => this.setTouch(event, key, false));
        button.addEventListener('pointerleave', (event) => this.setTouch(event, key, false));
        button.addEventListener('pointercancel', (event) => this.setTouch(event, key, false));
        button.addEventListener('contextmenu', (event) => event.preventDefault());
    }

    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.THROW = false;
    }

    setTouch(event, key, pressed) {
        event.preventDefault();
        this[key] = pressed;
    }

    setKey(event, pressed) {
        const key = KEY_BINDINGS[event.code];
        if (!key) return;
        event.preventDefault();
        this[key] = pressed;
    }
}
