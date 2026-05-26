/**
 * Builds all objects for the first level.
 */
class Level {
    levelEndX = 2880;

    /** Creates all objects for level one. */
    constructor() {
        this.backgrounds = this.createBackgrounds();
        this.enemies = this.createEnemies();
        this.coins = this.createCoins();
        this.bottles = this.createBottles();
        this.endboss = new Endboss();
    }

    /**
     * Creates all background sections.
     * @returns {DrawableObject[]}
     */
    createBackgrounds() {
        return [0, 720, 1440, 2160, 2880].flatMap((x, index) => {
            return this.createBackgroundSection(x, (index % 2) + 1);
        });
    }

    /**
     * Creates one layered background section.
     * @param {number} x Horizontal world position.
     * @param {number} imageNumber Background variant number.
     * @returns {DrawableObject[]}
     */
    createBackgroundSection(x, imageNumber) {
        const layerBasePath = 'img/5_background/layers';
        return [
            new BackgroundObject(`${layerBasePath}/air.png`, x),
            new Cloud(`${layerBasePath}/4_clouds/${imageNumber}.png`, x),
            new BackgroundObject(`${layerBasePath}/3_third_layer/${imageNumber}.png`, x),
            new BackgroundObject(`${layerBasePath}/2_second_layer/${imageNumber}.png`, x),
            new BackgroundObject(`${layerBasePath}/1_first_layer/${imageNumber}.png`, x),
        ];
    }

    /**
     * Creates all regular enemies.
     * @returns {Chicken[]}
     */
    createEnemies() {
        return [
            new Chicken(650),
            new Chicken(980, 'small'),
            new Chicken(1320),
            new Chicken(1680, 'small'),
            new Chicken(2070),
        ];
    }

    /**
     * Creates all collectable coins.
     * @returns {CollectableObject[]}
     */
    createCoins() {
        return [
            new CollectableObject('coin', 420, 190),
            new CollectableObject('coin', 720, 120),
            new CollectableObject('coin', 1050, 210),
            new CollectableObject('coin', 1500, 140),
            new CollectableObject('coin', 1960, 180),
        ];
    }

    /**
     * Creates all collectable bottles.
     * @returns {CollectableObject[]}
     */
    createBottles() {
        return [
            new CollectableObject('bottle', 540, 345),
            new CollectableObject('bottle', 870, 345),
            new CollectableObject('bottle', 1220, 345),
            new CollectableObject('bottle', 1760, 345),
            new CollectableObject('bottle', 2240, 345),
        ];
    }
}

/**
 * Creates a fresh level for every game start.
 * @returns {Level}
 */
function createLevel() {
    return new Level();
}
