const THROW_COOLDOWN = 850;
const BOTTLE_REFILL_DELAY = 2500;
const BOTTLE_REFILL_DISTANCE = 220;

/**
 * Coordinates one playable game session.
 */
class World {
    character = new Character();
    cameraX = 0;
    frame = 0;
    animationFrame = null;
    throwableObjects = [];
    lastThrowAt = 0;
    throwInputWasPressed = false;
    state = 'playing';
    endResult = '';
    endStartedAt = 0;
    endDelay = 1900;
    lastBottleRefillAt = 0;

    /**
     * Creates a game world for one play session.
     * @param {HTMLCanvasElement} canvas Game canvas.
     * @param {Keyboard} keyboard Current keyboard state.
     * @param {SoundManager} soundManager Sound manager instance.
     * @param {Function} onFinish Callback after the game ends.
     */
    constructor(canvas, keyboard, soundManager = null, onFinish = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.level = createLevel();
        this.onFinish = onFinish;
        this.createStatusBars();
    }

    /**
     * Starts the world loop.
     */
    start() {
        this.draw();
        this.run();
    }

    /**
     * Stops the world loop.
     */
    stop() {
        cancelAnimationFrame(this.animationFrame);
    }

    /** Runs the main animation loop. */
    run() {
        if (this.state === 'ended') return;
        this.frame++;
        this.state === 'playing' ? this.update() : this.updateEnding();
        this.draw();
        if (this.shouldCompleteGame()) return this.completeGame();
        this.animationFrame = requestAnimationFrame(() => this.run());
    }

    /** Updates one active gameplay frame. */
    update() {
        this.playJumpSound();
        this.character.update(this.keyboard, this.level.levelEndX, this.frame);
        this.updateLevelObjects();
        this.handleBottleThrow();
        this.checkCollisions();
        this.refillBottleIfNeeded();
        this.updateStatusBars();
        this.setCamera();
    }

    /** Updates all active world objects. */
    updateLevelObjects() {
        this.updateBackgrounds();
        this.level.enemies.forEach((enemy) => enemy.update(this.frame));
        this.level.coins.forEach((coin) => coin.update(this.frame));
        this.level.bottles.forEach((bottle) => bottle.update(this.frame));
        this.level.endboss.update(this.frame, this.character.x);
        this.updateThrowableObjects();
    }

    /** Updates moving background layers. */
    updateBackgrounds() {
        this.level.backgrounds.forEach((background) => {
            if (background.update) background.update(this.level.levelEndX);
        });
    }

    /** Updates and removes throwable objects. */
    updateThrowableObjects() {
        this.throwableObjects.forEach((bottle) => bottle.update(this.frame));
        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            return !bottle.isFinished(this.level.levelEndX);
        });
    }

    /** Updates the world while the final animation is playing. */
    updateEnding() {
        this.updateBackgrounds();
        this.level.enemies.forEach((enemy) => enemy.update(this.frame));
        this.character.updateFrozen(this.frame);
        this.level.endboss.update(this.frame, this.character.x);
        this.updateThrowableObjects();
        this.updateStatusBars();
    }

    /** Sets the camera position around Pepe. */
    setCamera() {
        const maxCamera = this.level.levelEndX - this.canvas.width;
        const targetX = Math.min(Math.max(this.character.x - 100, 0), maxCamera);
        this.cameraX = -Math.round(targetX);
    }

    /** Draws the full game frame. */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawLevel();
        this.drawObjects(Object.values(this.statusBars));
        if (this.state === 'ended') this.drawEndMessage();
    }

    /** Draws all world-space objects with camera translation. */
    drawLevel() {
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawObjects(this.level.backgrounds);
        this.drawObjects(this.level.coins);
        this.drawObjects(this.level.bottles);
        this.drawObjects(this.throwableObjects);
        this.drawObjects(this.level.enemies);
        this.level.endboss.draw(this.ctx);
        this.character.draw(this.ctx);
        this.ctx.restore();
    }

    /**
     * Draws a list of drawable objects.
     * @param {DrawableObject[]} objects Drawable object list.
     */
    drawObjects(objects) {
        objects.forEach((object) => object.draw(this.ctx));
    }

    /** Creates all fixed status bars. */
    createStatusBars() {
        this.statusBars = {
            health: new StatusBar('health', 10, 5, 100),
            coin: new StatusBar('coin', 10, 45, 0),
            bottle: new StatusBar('bottle', 10, 85, 0),
            endboss: new StatusBar('endboss', 515, 5, 100),
        };
    }

    /** Updates all fixed status bar values. */
    updateStatusBars() {
        this.statusBars.health.setPercentage(this.character.energy);
        this.statusBars.coin.setPercentage(this.character.coins);
        this.statusBars.bottle.setPercentage(this.character.bottles);
        this.statusBars.endboss.setPercentage(this.level.endboss.energy);
    }

    /** Handles bottle throw input. */
    handleBottleThrow() {
        if (!this.keyboard.THROW) {
            this.throwInputWasPressed = false;
            return;
        }
        if (this.throwInputWasPressed) return;
        this.throwInputWasPressed = true;
        if (!this.canThrowBottle()) return;
        this.throwBottle();
    }

    /**
     * Checks whether Pepe can throw a bottle now.
     * @returns {boolean}
     */
    canThrowBottle() {
        return this.character.canThrow()
            && Date.now() - this.lastThrowAt > THROW_COOLDOWN;
    }

    /** Creates a new thrown bottle. */
    throwBottle() {
        const direction = this.character.otherDirection ? -1 : 1;
        const x = this.character.x + (direction === 1 ? 85 : -25);
        this.throwableObjects.push(new ThrowableObject(x, this.character.y + 110, direction));
        this.character.useBottle();
        this.lastThrowAt = Date.now();
        this.playSound('playThrow');
    }

    /** Checks all collision groups. */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCollectableCollisions();
        this.checkBottleCollisions();
    }

    /** Checks collisions between Pepe and enemies. */
    checkEnemyCollisions() {
        [...this.level.enemies, this.level.endboss].forEach((enemy) => {
            this.handleEnemyCollision(enemy);
        });
    }

    /**
     * Handles one enemy collision.
     * @param {MovableObject} enemy Enemy object.
     */
    handleEnemyCollision(enemy) {
        if (enemy.isDead() || !this.character.isColliding(enemy)) return;
        this.canStomp(enemy) ? this.stompEnemy(enemy) : this.hitCharacter(enemy.damage);
    }

    /**
     * Checks whether Pepe lands on top of an enemy.
     * @param {MovableObject} enemy Enemy object.
     * @returns {boolean}
     */
    canStomp(enemy) {
        return this.character.isFalling()
            && this.character.collisionBottom() <= enemy.y + enemy.height * 0.45;
    }

    /**
     * Defeats a stompable enemy.
     * @param {MovableObject} enemy Enemy object.
     */
    stompEnemy(enemy) {
        if (enemy instanceof Endboss) return this.hitCharacter(enemy.damage);
        enemy.kill();
        this.character.bounce();
        this.playSound('playStompChicken');
    }

    /**
     * Applies damage to Pepe.
     * @param {number} damage Damage amount.
     */
    hitCharacter(damage) {
        const wasHurt = this.character.isHurt();
        this.character.hit(damage);
        if (!wasHurt) this.playSound('playHurt');
        if (this.character.isDead()) this.finishGame('lost');
    }

    /** Checks collisions with collectable objects. */
    checkCollectableCollisions() {
        this.level.coins = this.keepUncollected(this.level.coins, 'coin');
        this.level.bottles = this.keepUncollected(this.level.bottles, 'bottle');
    }

    /**
     * Keeps only collectables that were not collected.
     * @param {CollectableObject[]} items Collectable list.
     * @param {string} type Collectable type.
     * @returns {CollectableObject[]}
     */
    keepUncollected(items, type) {
        return items.filter((item) => {
            return this.collectItem(item, type);
        });
    }

    /**
     * Collects one item if Pepe collides with it.
     * @param {CollectableObject} item Collectable object.
     * @param {string} type Collectable type.
     * @returns {boolean}
     */
    collectItem(item, type) {
        if (!this.character.isColliding(item)) return true;
        type === 'coin' ? this.character.collectCoin() : this.character.collectBottle();
        type === 'coin' ? this.playSound('playCoin') : this.playSound('playBottle');
        return false;
    }

    /** Checks bottle collisions with enemies. */
    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle) => this.hitBottleTarget(bottle));
    }

    /**
     * Applies bottle damage to its first target.
     * @param {ThrowableObject} bottle Thrown bottle.
     */
    hitBottleTarget(bottle) {
        if (bottle.splashed) return;
        const target = this.findBottleTarget(bottle);
        if (!target) return;
        this.damageBottleTarget(target);
        bottle.splash();
    }

    /**
     * Finds the first enemy hit by a bottle.
     * @param {ThrowableObject} bottle Thrown bottle.
     * @returns {MovableObject}
     */
    findBottleTarget(bottle) {
        return [...this.level.enemies, this.level.endboss].find((enemy) => {
            return !enemy.isDead() && bottle.isColliding(enemy);
        });
    }

    /**
     * Damages a bottle target.
     * @param {MovableObject} target Enemy target.
     */
    damageBottleTarget(target) {
        target instanceof Endboss ? target.hit(25) : target.kill();
        target instanceof Endboss ? this.playSound('playBoss') : this.playSound('playEnemyHit');
        if (this.level.endboss.isDead()) this.finishGame('won');
    }

    /** Adds a backup bottle if the boss fight can no longer be won. */
    refillBottleIfNeeded() {
        if (!this.shouldRefillBottle()) return;
        this.level.bottles.push(this.createRefillBottle());
        this.lastBottleRefillAt = Date.now();
    }

    /**
     * Checks whether no usable bottle is left while the endboss is alive.
     * @returns {boolean}
     */
    shouldRefillBottle() {
        return !this.level.endboss.isDead()
            && this.character.bottles === 0
            && this.level.bottles.length === 0
            && this.throwableObjects.length === 0
            && Date.now() - this.lastBottleRefillAt > BOTTLE_REFILL_DELAY;
    }

    /**
     * Creates a new bottle close to Pepe, but inside the level.
     * @returns {CollectableObject}
     */
    createRefillBottle() {
        const x = Math.min(this.character.x + BOTTLE_REFILL_DISTANCE, this.level.levelEndX - 180);
        return new CollectableObject('bottle', Math.max(160, x), 345);
    }

    /**
     * Starts the final game sequence.
     * @param {string} result Final result key.
     */
    finishGame(result) {
        if (this.state !== 'playing') return;
        this.state = 'ending';
        this.endResult = result;
        this.endStartedAt = Date.now();
        this.playEndSound(result);
    }

    /** Draws the in-canvas ending message. */
    drawEndMessage() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff4b8';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.endText(), this.canvas.width / 2, 235);
    }

    /**
     * Returns the ending text.
     * @returns {string}
     */
    endText() {
        return this.endResult === 'won' ? 'You won!' : 'Game over';
    }

    /** Plays a jump sound when a jump starts. */
    playJumpSound() {
        if (this.keyboard.UP && !this.character.isAboveGround()) {
            this.playSound('playJump');
        }
    }

    /**
     * Plays the final result sound.
     * @param {string} result Final result key.
     */
    playEndSound(result) {
        result === 'won' ? this.playSound('playWin') : this.playSound('playLose');
    }

    /**
     * Plays a sound through the sound manager.
     * @param {string} methodName Sound manager method name.
     */
    playSound(methodName) {
        if (this.soundManager) this.soundManager[methodName]();
    }

    /**
     * Checks whether the final in-game animation is done.
     * @returns {boolean}
     */
    shouldCompleteGame() {
        return this.state === 'ending' && Date.now() - this.endStartedAt > this.endDelay;
    }

    /** Completes the game and opens the final screen. */
    completeGame() {
        this.state = 'ended';
        this.draw();
        if (this.onFinish) this.onFinish(this.endResult);
    }
}
