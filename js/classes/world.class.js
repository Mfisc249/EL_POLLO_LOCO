class World {
    character = new Character();
    cameraX = 0;
    frame = 0;
    animationFrame = null;
    throwableObjects = [];
    lastThrowAt = 0;
    state = 'playing';
    endResult = '';

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

    run() {
        if (this.state !== 'playing') return;
        this.frame++;
        this.update();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.run());
    }

    update() {
        this.playJumpSound();
        this.character.update(this.keyboard, this.level.levelEndX, this.frame);
        this.updateLevelObjects();
        this.handleBottleThrow();
        this.checkCollisions();
        this.updateStatusBars();
        this.setCamera();
    }

    updateLevelObjects() {
        this.updateBackgrounds();
        this.level.enemies.forEach((enemy) => enemy.update(this.frame));
        this.level.coins.forEach((coin) => coin.update(this.frame));
        this.level.bottles.forEach((bottle) => bottle.update(this.frame));
        this.level.endboss.update(this.frame, this.character.x);
        this.updateThrowableObjects();
    }

    updateBackgrounds() {
        this.level.backgrounds.forEach((background) => {
            if (background.update) background.update(this.level.levelEndX);
        });
    }

    updateThrowableObjects() {
        this.throwableObjects.forEach((bottle) => bottle.update(this.frame));
        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            return !bottle.isFinished(this.level.levelEndX);
        });
    }

    setCamera() {
        const maxCamera = this.level.levelEndX - this.canvas.width;
        this.cameraX = -Math.min(Math.max(this.character.x - 100, 0), maxCamera);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
        this.drawObjects(Object.values(this.statusBars));
        if (this.state === 'ended') this.drawEndMessage();
    }

    drawObjects(objects) {
        objects.forEach((object) => object.draw(this.ctx));
    }

    createStatusBars() {
        this.statusBars = {
            health: new StatusBar('health', 10, 5, 100),
            coin: new StatusBar('coin', 10, 45, 0),
            bottle: new StatusBar('bottle', 10, 85, 0),
            endboss: new StatusBar('endboss', 515, 5, 100),
        };
    }

    updateStatusBars() {
        this.statusBars.health.setPercentage(this.character.energy);
        this.statusBars.coin.setPercentage(this.character.coins);
        this.statusBars.bottle.setPercentage(this.character.bottles);
        this.statusBars.endboss.setPercentage(this.level.endboss.energy);
    }

    handleBottleThrow() {
        if (!this.canThrowBottle()) return;
        this.throwBottle();
    }

    canThrowBottle() {
        return this.keyboard.THROW
            && this.character.canThrow()
            && Date.now() - this.lastThrowAt > 500;
    }

    throwBottle() {
        const direction = this.character.otherDirection ? -1 : 1;
        const x = this.character.x + (direction === 1 ? 85 : -25);
        this.throwableObjects.push(new ThrowableObject(x, this.character.y + 110, direction));
        this.character.useBottle();
        this.lastThrowAt = Date.now();
        this.playSound('playThrow');
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCollectableCollisions();
        this.checkBottleCollisions();
    }

    checkEnemyCollisions() {
        [...this.level.enemies, this.level.endboss].forEach((enemy) => {
            this.handleEnemyCollision(enemy);
        });
    }

    handleEnemyCollision(enemy) {
        if (enemy.isDead() || !this.character.isColliding(enemy)) return;
        this.canStomp(enemy) ? this.stompEnemy(enemy) : this.hitCharacter(enemy.damage);
    }

    canStomp(enemy) {
        return this.character.isFalling()
            && this.character.collisionBottom() <= enemy.y + enemy.height * 0.45;
    }

    stompEnemy(enemy) {
        if (enemy instanceof Endboss) return this.hitCharacter(enemy.damage);
        enemy.kill();
        this.character.bounce();
        this.playSound('playStompChicken');
    }

    hitCharacter(damage) {
        const wasHurt = this.character.isHurt();
        this.character.hit(damage);
        if (!wasHurt) this.playSound('playHurt');
        if (this.character.isDead()) this.finishGame('lost');
    }

    checkCollectableCollisions() {
        this.level.coins = this.keepUncollected(this.level.coins, 'coin');
        this.level.bottles = this.keepUncollected(this.level.bottles, 'bottle');
    }

    keepUncollected(items, type) {
        return items.filter((item) => {
            return this.collectItem(item, type);
        });
    }

    collectItem(item, type) {
        if (!this.character.isColliding(item)) return true;
        type === 'coin' ? this.character.collectCoin() : this.character.collectBottle();
        type === 'coin' ? this.playSound('playCoin') : this.playSound('playBottle');
        return false;
    }

    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle) => this.hitBottleTarget(bottle));
    }

    hitBottleTarget(bottle) {
        if (bottle.splashed) return;
        const target = this.findBottleTarget(bottle);
        if (!target) return;
        this.damageBottleTarget(target);
        bottle.splash();
    }

    findBottleTarget(bottle) {
        return [...this.level.enemies, this.level.endboss].find((enemy) => {
            return !enemy.isDead() && bottle.isColliding(enemy);
        });
    }

    damageBottleTarget(target) {
        target instanceof Endboss ? target.hit(20) : target.kill();
        target instanceof Endboss ? this.playSound('playBoss') : this.playSound('playEnemyHit');
        if (this.level.endboss.isDead()) this.finishGame('won');
    }

    finishGame(result) {
        if (this.state === 'ended') return;
        this.state = 'ended';
        this.endResult = result;
        this.playEndSound(result);
        this.draw();
        if (this.onFinish) setTimeout(() => this.onFinish(result), 700);
    }

    drawEndMessage() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff4b8';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.endText(), this.canvas.width / 2, 235);
    }

    endText() {
        return this.endResult === 'won' ? 'You won!' : 'Game over';
    }

    playJumpSound() {
        if (this.keyboard.UP && !this.character.isAboveGround()) {
            this.playSound('playJump');
        }
    }

    playEndSound(result) {
        result === 'won' ? this.playSound('playWin') : this.playSound('playLose');
    }

    playSound(methodName) {
        if (this.soundManager) this.soundManager[methodName]();
    }
}
