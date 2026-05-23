class World {
    character = new Character();
    cameraX = 0;
    frame = 0;
    animationFrame = null;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = createLevel();
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
        this.frame++;
        this.update();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.run());
    }

    update() {
        this.character.update(this.keyboard, this.level.levelEndX, this.frame);
        this.level.enemies.forEach((enemy) => enemy.update(this.frame));
        this.setCamera();
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
        this.drawObjects(this.level.enemies);
        this.character.draw(this.ctx);
        this.ctx.restore();
    }

    drawObjects(objects) {
        objects.forEach((object) => object.draw(this.ctx));
    }
}
