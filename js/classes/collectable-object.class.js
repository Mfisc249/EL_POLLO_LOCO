const COIN_IMAGES = [
    'img/8_coin/coin_1.png',
    'img/8_coin/coin_2.png',
];

class CollectableObject extends MovableObject {
    /**
     * Creates a collectable coin or bottle.
     * @param {string} type Collectable type.
     * @param {number} x Horizontal world position.
     * @param {number} y Vertical world position.
     */
    constructor(type, x, y) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.setCollectableSize();
        this.loadCollectableImages();
    }

    /**
     * Animates collectable objects where frames exist.
     * @param {number} frame Current world frame.
     */
    update(frame) {
        if (this.type === 'coin') this.playAnimation(COIN_IMAGES, frame, 14);
    }

    /** Sets size and collision offset for this collectable. */
    setCollectableSize() {
        const coin = this.type === 'coin';
        this.width = coin ? 70 : 65;
        this.height = coin ? 70 : 75;
        this.offset = { top: 12, right: 12, bottom: 12, left: 12 };
    }

    /** Loads the matching collectable image set. */
    loadCollectableImages() {
        if (this.type === 'coin') return this.loadCoinImages();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    }

    /** Loads all coin animation images. */
    loadCoinImages() {
        this.loadImage(COIN_IMAGES[0]);
        this.loadImages(COIN_IMAGES);
    }
}
