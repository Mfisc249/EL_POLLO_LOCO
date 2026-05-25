class BackgroundObject extends DrawableObject {
    /**
     * Creates a static background layer.
     * @param {string} imagePath Background image path.
     * @param {number} x Horizontal world position.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}

class Cloud extends BackgroundObject {
    speed = 0.2;

    /**
     * Moves the cloud layer slowly from right to left.
     * @param {number} levelEndX Last world x-position.
     */
    update(levelEndX) {
        this.x -= this.speed;
        if (this.x <= -this.width) this.x = levelEndX + this.width;
    }
}
