class Level {
    levelEndX = 2880;

    constructor() {
        this.backgrounds = this.createBackgrounds();
        this.enemies = this.createEnemies();
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
}

/**
 * Creates a fresh level for every game start.
 * @returns {Level}
 */
function createLevel() {
    return new Level();
}
