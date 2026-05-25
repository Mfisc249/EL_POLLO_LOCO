const BOTTLE_ROTATION_IMAGES = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
];

const BOTTLE_SPLASH_IMAGES = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
];

class ThrowableObject extends MovableObject {
    speed = 12;
    acceleration = 0.7;
    splashed = false;
    splashStartedAt = 0;

    /**
     * Creates a flying bottle.
     * @param {number} x Horizontal world position.
     * @param {number} y Vertical world position.
     * @param {number} direction Flight direction.
     */
    constructor(x, y, direction) {
        super();
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.setBottleSize();
        this.loadBottleImages();
    }

    /**
     * Updates bottle movement and animation.
     * @param {number} frame Current world frame.
     */
    update(frame) {
        if (this.splashed) return this.playAnimation(BOTTLE_SPLASH_IMAGES, frame, 4);
        this.fly();
        this.playAnimation(BOTTLE_ROTATION_IMAGES, frame, 4);
    }

    /** Starts the splash animation. */
    splash() {
        if (this.splashed) return;
        this.splashed = true;
        this.splashStartedAt = Date.now();
        this.currentImage = 0;
    }

    /**
     * Checks whether this bottle can be removed.
     * @param {number} levelEndX Last world x-position.
     * @returns {boolean}
     */
    isFinished(levelEndX) {
        return this.y > 480
            || this.x < -100
            || this.x > levelEndX + 200
            || this.splashAnimationEnded();
    }

    /** Sets bottle size, force and collision offset. */
    setBottleSize() {
        this.width = 70;
        this.height = 70;
        this.speedY = 12;
        this.offset = { top: 12, right: 12, bottom: 12, left: 12 };
    }

    /** Loads bottle rotation and splash frames. */
    loadBottleImages() {
        this.loadImage(BOTTLE_ROTATION_IMAGES[0]);
        this.loadImages(BOTTLE_ROTATION_IMAGES);
        this.loadImages(BOTTLE_SPLASH_IMAGES);
    }

    /** Moves the bottle along its throw arc. */
    fly() {
        this.x += this.speed * this.direction;
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
    }

    /**
     * Checks whether the splash animation has ended.
     * @returns {boolean}
     */
    splashAnimationEnded() {
        return this.splashed && Date.now() - this.splashStartedAt > 260;
    }
}
