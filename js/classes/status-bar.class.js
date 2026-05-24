const STATUS_VALUES = [0, 20, 40, 60, 80, 100];

class StatusBar extends DrawableObject {
    constructor(type, x, y, percentage = 100) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 190;
        this.height = 50;
        this.loadStatusImages();
        this.setPercentage(percentage);
    }

    /**
     * Updates the statusbar image.
     * @param {number} percentage Current percentage.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.img = this.imageCache[this.resolveImagePath()];
    }

    loadStatusImages() {
        this.loadImages(STATUS_VALUES.map((value) => this.getPath(value)));
    }

    resolveImagePath() {
        const value = STATUS_VALUES.find((step) => this.percentage <= step);
        return this.getPath(value || 0);
    }

    getPath(value) {
        if (this.type === 'endboss') return this.getEndbossPath(value);
        return this.getStatusPath(value);
    }

    getEndbossPath(value) {
        return `img/7_statusbars/2_statusbar_endboss/orange/orange${value}.png`;
    }

    getStatusPath(value) {
        const folders = {
            health: '2_statusbar_health',
            coin: '1_statusbar_coin',
            bottle: '3_statusbar_bottle',
        };
        return `img/7_statusbars/1_statusbar/${folders[this.type]}/orange/${value}.png`;
    }
}
