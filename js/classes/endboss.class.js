const ENDBOSS_IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
];

const ENDBOSS_IMAGES_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
];

const ENDBOSS_IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
];

const ENDBOSS_IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
];

const ENDBOSS_IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
];

const ENDBOSS_CHASE_DISTANCE = 620;
const ENDBOSS_STOP_OFFSET = -60;
const ENDBOSS_LEFT_LIMIT = 0;

/**
 * Represents the final boss enemy.
 */
class Endboss extends MovableObject {
    speed = 1.9;
    damage = 25;
    hasSeenCharacter = false;

    /** Creates the endboss and preloads its animations. */
    constructor() {
        super();
        this.setEndbossSize();
        this.loadEndbossImages();
    }

    /**
     * Updates endboss state and animation.
     * @param {number} frame Current world frame.
     * @param {number} characterX Character x-position.
     */
    update(frame, characterX) {
        if (this.isDead()) return this.playAnimationOnce(ENDBOSS_IMAGES_DEAD, frame, 10, 'endboss-dead');
        if (this.isHurt()) return this.playAnimation(ENDBOSS_IMAGES_HURT, frame, 6, 'endboss-hurt');
        this.moveWhenClose(characterX);
        this.playAnimation(this.activeImages(characterX), frame, this.animationSpeed(characterX), this.animationKey(characterX));
    }

    /**
     * Applies bottle damage without normal hit cooldown.
     * @param {number} damage Damage amount.
     */
    hit(damage) {
        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
    }

    /** Sets endboss size and collision offset. */
    setEndbossSize() {
        this.x = 2550;
        this.y = 130;
        this.width = 240;
        this.height = 290;
        this.offset = { top: 45, right: 35, bottom: 10, left: 45 };
    }

    /** Loads all endboss animation frames. */
    loadEndbossImages() {
        this.loadImage(ENDBOSS_IMAGES_WALKING[0]);
        this.loadImages(ENDBOSS_IMAGES_WALKING);
        this.loadImages(ENDBOSS_IMAGES_ALERT);
        this.loadImages(ENDBOSS_IMAGES_HURT);
        this.loadImages(ENDBOSS_IMAGES_ATTACK);
        this.loadImages(ENDBOSS_IMAGES_DEAD);
    }

    /**
     * Moves the endboss toward Pepe when he is close.
     * @param {number} characterX Pepe's x-position.
     */
    moveWhenClose(characterX) {
        if (this.x - characterX < ENDBOSS_CHASE_DISTANCE) this.hasSeenCharacter = true;
        if (!this.hasSeenCharacter) return;
        const stopX = Math.max(ENDBOSS_LEFT_LIMIT, characterX + ENDBOSS_STOP_OFFSET);
        if (this.x > stopX) {
            this.moveLeft(stopX);
        }
    }

    /**
     * Returns the active endboss animation image set.
     * @param {number} characterX Pepe's x-position.
     * @returns {string[]}
     */
    activeImages(characterX) {
        if (this.isAttacking(characterX)) return ENDBOSS_IMAGES_ATTACK;
        return this.x - characterX < 650 ? ENDBOSS_IMAGES_ALERT : ENDBOSS_IMAGES_WALKING;
    }

    /**
     * Returns the current animation state key.
     * @param {number} characterX Pepe's x-position.
     * @returns {string}
     */
    animationKey(characterX) {
        if (this.isAttacking(characterX)) return 'endboss-attack';
        return this.x - characterX < 650 ? 'endboss-alert' : 'endboss-walk';
    }

    /**
     * Returns the current animation speed.
     * @param {number} characterX Pepe's x-position.
     * @returns {number}
     */
    animationSpeed(characterX) {
        return this.isAttacking(characterX) ? 6 : 9;
    }

    /**
     * Checks if Pepe is within attack range.
     * @param {number} characterX Pepe's x-position.
     * @returns {boolean}
     */
    isAttacking(characterX) {
        return this.x - characterX < 360;
    }
}
