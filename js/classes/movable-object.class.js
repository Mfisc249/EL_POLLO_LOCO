class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 1.2;
    energy = 100;
    lastHit = 0;
    groundY = 170;
    isKilled = false;
    lastAnimationKey = '';

    /**
     * Moves this object to the right.
     * @param {number} limit Right movement limit.
     */
    moveRight(limit = Infinity) {
        this.x = Math.min(this.x + this.speed, limit);
    }

    /**
     * Moves this object to the left.
     * @param {number} limit Left movement limit.
     */
    moveLeft(limit = -Infinity) {
        this.x = Math.max(this.x - this.speed, limit);
    }

    /**
     * Applies jump gravity until the object reaches the ground.
     */
    applyGravity() {
        if (!this.isAboveGround() && this.speedY <= 0) return;
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.landOnGround();
    }

    /**
     * Checks if this object overlaps another object.
     * @param {DrawableObject} object Other drawable object.
     * @returns {boolean}
     */
    isColliding(object) {
        return this.rightEdge() > object.leftEdge()
            && this.bottomEdge() > object.topEdge()
            && this.leftEdge() < object.rightEdge()
            && this.topEdge() < object.bottomEdge();
    }

    /**
     * Plays an animation at a fixed frame speed.
     * @param {string[]} images Animation image paths.
     * @param {number} frame Current world frame.
     * @param {number} speed Animation speed in frames.
     */
    playAnimation(images, frame, speed = 8, key = images[0]) {
        this.startAnimation(images, key);
        if (frame % speed !== 0) return;
        const index = this.currentImage % images.length;
        this.img = this.imageCache[images[index]];
        this.currentImage++;
    }

    /**
     * Plays an animation once and keeps the last frame visible.
     * @param {string[]} images Animation image paths.
     * @param {number} frame Current world frame.
     * @param {number} speed Animation speed in frames.
     * @param {string} key Animation state key.
     * @returns {boolean}
     */
    playAnimationOnce(images, frame, speed = 8, key = images[0]) {
        this.startAnimation(images, key);
        if (frame % speed !== 0) return this.animationEnded(images);
        const index = Math.min(this.currentImage, images.length - 1);
        this.img = this.imageCache[images[index]];
        if (this.currentImage < images.length) this.currentImage++;
        return this.animationEnded(images);
    }

    /**
     * Reduces energy and stores the hit time.
     * @param {number} damage Damage amount.
     */
    hit(damage) {
        if (this.isHurt() || this.isDead()) return;
        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
    }

    isAboveGround() {
        return this.y < this.groundY;
    }

    isFalling() {
        return this.speedY < 0;
    }

    jump(force = 23) {
        if (!this.isAboveGround()) this.speedY = force;
    }

    bounce() {
        this.speedY = 15;
    }

    isHurt() {
        return Date.now() - this.lastHit < 850;
    }

    isDead() {
        return this.energy <= 0 || this.isKilled;
    }

    leftEdge() {
        return this.x + this.offset.left;
    }

    rightEdge() {
        return this.x + this.width - this.offset.right;
    }

    topEdge() {
        return this.y + this.offset.top;
    }

    bottomEdge() {
        return this.y + this.height - this.offset.bottom;
    }

    landOnGround() {
        if (this.y <= this.groundY) return;
        this.y = this.groundY;
        this.speedY = 0;
    }

    startAnimation(images, key) {
        if (this.lastAnimationKey === key) return;
        this.lastAnimationKey = key;
        this.currentImage = 0;
        this.img = this.imageCache[images[0]];
    }

    animationEnded(images) {
        return this.currentImage > images.length - 1;
    }
}
