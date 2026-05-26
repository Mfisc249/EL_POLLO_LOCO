const CHICKEN_IMAGES = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
];

const SMALL_CHICKEN_IMAGES = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
];

/**
 * Represents a normal or small chicken enemy.
 */
class Chicken extends MovableObject {
    /**
     * Creates a normal or small chicken enemy.
     * @param {number} x Horizontal world position.
     * @param {string} type Chicken type.
     */
    constructor(x, type = 'normal') {
        super();
        this.type = type;
        this.setSize();
        this.x = x;
        this.speed = 0.35 + Math.random() * 0.45;
        this.damage = type === 'small' ? 10 : 15;
        this.loadChickenImages();
    }

    /**
     * Moves and animates this enemy.
     * @param {number} frame Current world frame.
     */
    update(frame) {
        if (this.isDead()) return this.showDeadImage();
        this.moveLeft();
        this.playAnimation(this.animationImages(), frame, 10);
    }

    /** Marks this chicken as defeated. */
    kill() {
        this.isKilled = true;
        this.showDeadImage();
    }

    /** Sets size and collision offset for this chicken type. */
    setSize() {
        const small = this.type === 'small';
        this.width = small ? 60 : 75;
        this.height = small ? 55 : 75;
        this.y = small ? 365 : 345;
        this.offset = { top: 8, right: 8, bottom: 4, left: 8 };
    }

    /** Loads all images for this chicken type. */
    loadChickenImages() {
        this.loadImage(this.animationImages()[0]);
        this.loadImages(this.animationImages());
        this.loadImages([this.deadImagePath()]);
    }

    /**
     * Returns the animation paths for this chicken type.
     * @returns {string[]}
     */
    animationImages() {
        return this.type === 'small' ? SMALL_CHICKEN_IMAGES : CHICKEN_IMAGES;
    }

    /** Shows the defeated chicken image. */
    showDeadImage() {
        this.img = this.imageCache[this.deadImagePath()];
    }

    /**
     * Returns the dead image path for this chicken type.
     * @returns {string}
     */
    deadImagePath() {
        const folder = this.type === 'small' ? 'chicken_small' : 'chicken_normal';
        return `img/3_enemies_chicken/${folder}/2_dead/dead.png`;
    }
}
