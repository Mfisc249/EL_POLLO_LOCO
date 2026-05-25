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

    /**
     * Checks whether the object is above ground.
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Checks whether the object is falling.
     * @returns {boolean}
     */
    isFalling() {
        return this.speedY < 0;
    }

    /**
     * Starts a jump if the object is on the ground.
     * @param {number} force Jump force.
     */
    jump(force = 23) {
        if (!this.isAboveGround()) this.speedY = force;
    }

    /** Bounces the object upward after stomping an enemy. */
    bounce() {
        this.speedY = 15;
    }

    /**
     * Checks whether the object is currently hurt.
     * @returns {boolean}
     */
    isHurt() {
        return Date.now() - this.lastHit < 850;
    }

    /**
     * Checks whether the object is dead or killed.
     * @returns {boolean}
     */
    isDead() {
        return this.energy <= 0 || this.isKilled;
    }

    /**
     * Returns the left collision edge.
     * @returns {number}
     */
    leftEdge() {
        return this.x + this.offset.left;
    }

    /**
     * Returns the right collision edge.
     * @returns {number}
     */
    rightEdge() {
        return this.x + this.width - this.offset.right;
    }

    /**
     * Returns the top collision edge.
     * @returns {number}
     */
    topEdge() {
        return this.y + this.offset.top;
    }

    /**
     * Returns the bottom collision edge.
     * @returns {number}
     */
    bottomEdge() {
        return this.y + this.height - this.offset.bottom;
    }

    /** Places the object back on the ground after falling. */
    landOnGround() {
        if (this.y <= this.groundY) return;
        this.y = this.groundY;
        this.speedY = 0;
    }

    /**
     * Resets image index when the animation state changes.
     * @param {string[]} images Animation image paths.
     * @param {string} key Animation state key.
     */
    startAnimation(images, key) {
        if (this.lastAnimationKey === key) return;
        this.lastAnimationKey = key;
        this.currentImage = 0;
        this.img = this.imageCache[images[0]];
    }

    /**
     * Checks if a one-shot animation reached its final frame.
     * @param {string[]} images Animation image paths.
     * @returns {boolean}
     */
    animationEnded(images) {
        return this.currentImage > images.length - 1;
    }
}
