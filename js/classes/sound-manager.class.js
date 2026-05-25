const SOUND_CONFIG = {
    jump: ['audio/jump.wav', 0.34],
    coin: ['audio/coin_collect.wav', 0.42],
    bottle: ['audio/bottle_collect.wav', 0.42],
    throw: ['audio/throw_bottle.wav', 0.36],
    hurt: ['audio/hurt.wav', 0.42],
    enemyHit: ['audio/enemy_hit.wav', 0.44],
    boss: ['audio/boss_rooster.wav', 0.42],
    stomp: ['audio/stomp_chicken.wav', 0.42],
    win: ['audio/game_win.wav', 0.5],
    lose: ['audio/game_lose.wav', 0.5],
};

const CHICKEN_CLUCKS = [
    ['audio/chicken_cluck_1.wav', 0.34],
    ['audio/chicken_cluck_2.wav', 0.34],
    ['audio/chicken_cluck_3.wav', 0.34],
];

class SoundManager {
    muted = false;
    sounds = {};
    chickenSounds = [];

    constructor() {
        this.muted = localStorage.getItem('polloMuted') === 'true';
        this.music = this.createAudio('audio/background_desert_loop.wav', 0.24, true);
        this.loadSounds();
    }

    /**
     * Toggles all game sounds and stores the choice.
     */
    toggleMute() {
        this.setMuted(!this.muted);
    }

    /**
     * Starts the background music loop.
     */
    startMusic() {
        if (this.muted) return;
        this.resetAudio(this.music);
        this.playAudio(this.music, true);
    }

    /**
     * Stops the background music loop.
     */
    stopMusic() {
        this.music.pause();
        this.resetAudio(this.music);
    }

    playJump() {
        this.playSound('jump');
    }

    playCoin() {
        this.playSound('coin');
    }

    playBottle() {
        this.playSound('bottle');
    }

    playThrow() {
        this.playSound('throw');
    }

    playHurt() {
        this.playSound('hurt');
    }

    playEnemyHit() {
        this.playSound('enemyHit');
        this.playRandomChicken();
    }

    playBoss() {
        this.playSound('boss');
    }

    playStompChicken() {
        this.playSound('stomp');
        this.playRandomChicken();
    }

    playWin() {
        this.playSound('win');
    }

    playLose() {
        this.playSound('lose');
    }

    setMuted(muted) {
        this.muted = muted;
        localStorage.setItem('polloMuted', String(muted));
        this.updateMutedState();
        if (muted) this.stopMusic();
    }

    loadSounds() {
        Object.entries(SOUND_CONFIG).forEach(([name, config]) => {
            this.sounds[name] = this.createAudio(config[0], config[1]);
        });
        this.chickenSounds = CHICKEN_CLUCKS.map((config) => this.createAudio(config[0], config[1]));
    }

    createAudio(path, volume, loop = false) {
        const audio = new Audio(path);
        audio.loop = loop;
        audio.muted = this.muted;
        audio.preload = 'auto';
        audio.volume = volume;
        return audio;
    }

    playSound(name) {
        this.playAudio(this.sounds[name]);
    }

    playAudio(audio, reuse = false) {
        if (this.muted || !audio) return;
        const sound = reuse ? audio : audio.cloneNode(true);
        sound.volume = audio.volume;
        sound.muted = this.muted;
        const promise = sound.play();
        if (promise) promise.catch(() => {});
    }

    playRandomChicken() {
        const index = Math.floor(Math.random() * this.chickenSounds.length);
        this.playAudio(this.chickenSounds[index]);
    }

    updateMutedState() {
        this.music.muted = this.muted;
        Object.values(this.sounds).forEach((audio) => audio.muted = this.muted);
        this.chickenSounds.forEach((audio) => audio.muted = this.muted);
    }

    resetAudio(audio) {
        try {
            audio.currentTime = 0;
        } catch {
            return;
        }
    }
}
