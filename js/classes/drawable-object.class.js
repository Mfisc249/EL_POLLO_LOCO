class DrawableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;
    otherDirection = false;
    offset = { top: 0, right: 0, bottom: 0, left: 0 };

    /**
     * Loads one image path into this object.
     * @param {string} path Image file path.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Caches all animation images.
     * @param {string[]} paths Animation image paths.
     */
    loadImages(paths) {
        paths.forEach((path) => this.cacheImage(path));
    }

    /**
     * Draws the current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     */
    draw(ctx) {
        if (!this.img || !this.img.complete) return;
        this.otherDirection ? this.drawMirrored(ctx) : this.drawNormal(ctx);
    }

    /**
     * Returns the bottom edge used for collisions.
     * @returns {number}
     */
    collisionBottom() {
        return this.y + this.height - this.offset.bottom;
    }

    cacheImage(path) {
        const image = new Image();
        image.src = path;
        this.imageCache[path] = image;
    }

    drawNormal(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawMirrored(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
    }
}
