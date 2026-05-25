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

class Endboss extends MovableObject {
    speed = 1.6;
    damage = 25;

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

    setEndbossSize() {
        this.x = 2550;
        this.y = 130;
        this.width = 240;
        this.height = 290;
        this.offset = { top: 45, right: 35, bottom: 10, left: 45 };
    }

    loadEndbossImages() {
        this.loadImage(ENDBOSS_IMAGES_WALKING[0]);
        this.loadImages(ENDBOSS_IMAGES_WALKING);
        this.loadImages(ENDBOSS_IMAGES_ALERT);
        this.loadImages(ENDBOSS_IMAGES_HURT);
        this.loadImages(ENDBOSS_IMAGES_ATTACK);
        this.loadImages(ENDBOSS_IMAGES_DEAD);
    }

    moveWhenClose(characterX) {
        if (this.x - characterX < 520 && this.x > 2100) this.moveLeft(2100);
    }

    activeImages(characterX) {
        if (this.isAttacking(characterX)) return ENDBOSS_IMAGES_ATTACK;
        return this.x - characterX < 650 ? ENDBOSS_IMAGES_ALERT : ENDBOSS_IMAGES_WALKING;
    }

    animationKey(characterX) {
        if (this.isAttacking(characterX)) return 'endboss-attack';
        return this.x - characterX < 650 ? 'endboss-alert' : 'endboss-walk';
    }

    animationSpeed(characterX) {
        return this.isAttacking(characterX) ? 6 : 9;
    }

    isAttacking(characterX) {
        return this.x - characterX < 360;
    }
}
