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

/**
 * Stores keyboard and touch input states.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    THROW = false;

    /** Creates keyboard state and binds desktop controls. */
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

    /**
     * Connects one touch button with a key state.
     * @param {HTMLElement} button Touch control button.
     */
    bindTouchButton(button) {
        const key = button.dataset.key;
        button.addEventListener('pointerdown', (event) => this.setTouch(event, key, true));
        button.addEventListener('pointerup', (event) => this.setTouch(event, key, false));
        button.addEventListener('pointerleave', (event) => this.setTouch(event, key, false));
        button.addEventListener('pointercancel', (event) => this.setTouch(event, key, false));
        button.addEventListener('contextmenu', (event) => event.preventDefault());
    }

    /** Resets all input states. */
    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.THROW = false;
    }

    /**
     * Updates one touch key state.
     * @param {PointerEvent} event Pointer event.
     * @param {string} key Keyboard property name.
     * @param {boolean} pressed Whether the key is pressed.
     */
    setTouch(event, key, pressed) {
        event.preventDefault();
        this[key] = pressed;
    }

    /**
     * Updates one keyboard key state.
     * @param {KeyboardEvent} event Keyboard event.
     * @param {boolean} pressed Whether the key is pressed.
     */
    setKey(event, pressed) {
        const key = KEY_BINDINGS[event.code];
        if (!key) return;
        event.preventDefault();
        this[key] = pressed;
    }
}
