const CHARACTER_IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
];

const CHARACTER_IMAGES_SLEEP = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
];

const CHARACTER_IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
];

const CHARACTER_IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
];

const CHARACTER_IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
];

const CHARACTER_IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
];

class Character extends MovableObject {
    speed = 5.5;
    coins = 0;
    bottles = 0;
    lastActionAt = Date.now();

    /** Creates Pepe and preloads all character animations. */
    constructor() {
        super();
        this.setCharacterSize();
        this.loadImage(CHARACTER_IMAGES_IDLE[0]);
        this.loadCharacterImages();
    }

    /**
     * Updates physics, movement and animation.
     * @param {Keyboard} keyboard Current keyboard state.
     * @param {number} levelEndX Last world x-position.
     * @param {number} frame Current world frame.
     */
    update(keyboard, levelEndX, frame) {
        if (!this.isDead()) this.handleMovement(keyboard, levelEndX);
        this.applyGravity();
        this.animate(keyboard, frame);
    }

    /**
     * Adds one coin up to the visible statusbar limit.
     */
    collectCoin() {
        this.coins = Math.min(100, this.coins + 20);
    }

    /**
     * Adds one bottle up to the visible statusbar limit.
     */
    collectBottle() {
        this.bottles = Math.min(100, this.bottles + 20);
    }

    /** Uses one collected bottle. */
    useBottle() {
        this.bottles = Math.max(0, this.bottles - 20);
        this.lastActionAt = Date.now();
    }

    /**
     * Checks whether Pepe can throw a bottle.
     * @returns {boolean}
     */
    canThrow() {
        return this.bottles > 0 && !this.isDead();
    }

    /** Sets Pepe's drawing size and collision offset. */
    setCharacterSize() {
        this.x = 90;
        this.y = 170;
        this.width = 125;
        this.height = 250;
        this.groundY = 170;
        this.offset = { top: 95, right: 35, bottom: 10, left: 35 };
    }

    /** Loads all Pepe animation frames. */
    loadCharacterImages() {
        this.loadImages(CHARACTER_IMAGES_IDLE);
        this.loadImages(CHARACTER_IMAGES_SLEEP);
        this.loadImages(CHARACTER_IMAGES_WALKING);
        this.loadImages(CHARACTER_IMAGES_JUMPING);
        this.loadImages(CHARACTER_IMAGES_HURT);
        this.loadImages(CHARACTER_IMAGES_DEAD);
    }

    /**
     * Handles horizontal movement and jumping.
     * @param {Keyboard} keyboard Current keyboard state.
     * @param {number} levelEndX Last world x-position.
     */
    handleMovement(keyboard, levelEndX) {
        this.handleHorizontalMovement(keyboard, levelEndX);
        this.handleJump(keyboard);
    }

    /**
     * Handles left and right movement.
     * @param {Keyboard} keyboard Current keyboard state.
     * @param {number} levelEndX Last world x-position.
     */
    handleHorizontalMovement(keyboard, levelEndX) {
        if (keyboard.RIGHT && this.x < levelEndX) this.walkRight();
        if (keyboard.LEFT && this.x > 0) this.walkLeft();
    }

    /**
     * Handles jump input.
     * @param {Keyboard} keyboard Current keyboard state.
     */
    handleJump(keyboard) {
        if (!keyboard.UP || this.isAboveGround()) return;
        this.jump();
        this.lastActionAt = Date.now();
    }

    /** Moves Pepe to the right. */
    walkRight() {
        this.moveRight();
        this.otherDirection = false;
        this.lastActionAt = Date.now();
    }

    /** Moves Pepe to the left. */
    walkLeft() {
        this.moveLeft(0);
        this.otherDirection = true;
        this.lastActionAt = Date.now();
    }

    /**
     * Chooses the correct Pepe animation.
     * @param {Keyboard} keyboard Current keyboard state.
     * @param {number} frame Current world frame.
     */
    animate(keyboard, frame) {
        if (this.isDead()) return this.playAnimationOnce(CHARACTER_IMAGES_DEAD, frame, 8, 'character-dead');
        if (this.isHurt()) return this.playAnimation(CHARACTER_IMAGES_HURT, frame, 6, 'character-hurt');
        if (this.isAboveGround()) return this.playJumpAnimation(frame);
        if (keyboard.RIGHT || keyboard.LEFT) return this.playAnimation(CHARACTER_IMAGES_WALKING, frame, 5, 'character-walk');
        this.animateIdle(frame);
    }

    /**
     * Chooses a jump frame based on vertical speed.
     * @param {number} frame Current world frame.
     */
    playJumpAnimation(frame) {
        this.lastAnimationKey = 'character-jump';
        const progress = this.speedY > 7 ? 0 : this.speedY > 0 ? 2 : this.speedY > -8 ? 5 : 7;
        this.img = this.imageCache[CHARACTER_IMAGES_JUMPING[progress]];
        if (frame % 9 === 0) this.currentImage = progress;
    }

    /**
     * Plays idle or sleep animation.
     * @param {number} frame Current world frame.
     */
    animateIdle(frame) {
        if (Date.now() - this.lastActionAt > 15000) {
            return this.playAnimation(CHARACTER_IMAGES_SLEEP, frame, 12, 'character-sleep');
        }
        this.playAnimation(CHARACTER_IMAGES_IDLE, frame, 12, 'character-idle');
    }
}
