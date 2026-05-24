class Level {
    levelEndX = 2880;

    constructor() {
        this.backgrounds = this.createBackgrounds();
        this.enemies = this.createEnemies();
        this.coins = this.createCoins();
        this.bottles = this.createBottles();
        this.endboss = new Endboss();
    }

    createBackgrounds() {
        return [0, 720, 1440, 2160, 2880].map((x) => {
            return new BackgroundObject('img/5_background/complete_background.png', x);
        });
    }

    createEnemies() {
        return [
            new Chicken(650),
            new Chicken(980, 'small'),
            new Chicken(1320),
            new Chicken(1680, 'small'),
            new Chicken(2070),
        ];
    }

    createCoins() {
        return [
            new CollectableObject('coin', 420, 190),
            new CollectableObject('coin', 720, 120),
            new CollectableObject('coin', 1050, 210),
            new CollectableObject('coin', 1500, 140),
            new CollectableObject('coin', 1960, 180),
        ];
    }

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
