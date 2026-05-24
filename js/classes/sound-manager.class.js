class SoundManager {
    muted = false;
    context = null;
    musicTimer = null;
    noteIndex = 0;
    musicNotes = [196, 246, 293, 246, 220, 196, 164];

    constructor() {
        this.muted = localStorage.getItem('polloMuted') === 'true';
    }

    /**
     * Toggles all game sounds and stores the choice.
     */
    toggleMute() {
        this.setMuted(!this.muted);
    }

    /**
     * Starts a tiny looping background melody.
     */
    startMusic() {
        if (this.muted) return;
        this.stopMusic();
        this.musicTimer = setInterval(() => this.playMusicNote(), 460);
    }

    /**
     * Stops the background melody.
     */
    stopMusic() {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
    }

    playJump() {
        this.playTone(420, 0.12, 'triangle', 0.035);
    }

    playCoin() {
        this.playTone(760, 0.09, 'sine', 0.045);
    }

    playBottle() {
        this.playTone(520, 0.11, 'square', 0.025);
    }

    playThrow() {
        this.playTone(240, 0.13, 'sawtooth', 0.03);
    }

    playHit() {
        this.playTone(120, 0.18, 'square', 0.04);
    }

    playChicken() {
        this.playTone(630, 0.12, 'square', 0.03);
    }

    playWin() {
        [523, 659, 784].forEach((note, index) => this.playTone(note, 0.2, 'triangle', 0.04, index * 0.14));
    }

    playLose() {
        [220, 174, 130].forEach((note, index) => this.playTone(note, 0.22, 'sawtooth', 0.035, index * 0.16));
    }

    setMuted(muted) {
        this.muted = muted;
        localStorage.setItem('polloMuted', String(muted));
        if (muted) this.stopMusic();
    }

    playMusicNote() {
        const note = this.musicNotes[this.noteIndex % this.musicNotes.length];
        this.playTone(note, 0.18, 'triangle', 0.018);
        this.noteIndex++;
    }

    playTone(frequency, duration, type, volume, delay = 0) {
        if (this.muted || !this.prepareContext()) return;
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        this.configureTone(oscillator, gain, frequency, type, volume);
        this.scheduleTone(oscillator, gain, duration, delay);
    }

    prepareContext() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return false;
        if (!this.context) this.context = new AudioContextClass();
        if (this.context.state === 'suspended') this.context.resume();
        return true;
    }

    configureTone(oscillator, gain, frequency, type, volume) {
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gain.gain.value = volume;
        oscillator.connect(gain);
        gain.connect(this.context.destination);
    }

    scheduleTone(oscillator, gain, duration, delay) {
        const startAt = this.context.currentTime + delay;
        gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
        oscillator.start(startAt);
        oscillator.stop(startAt + duration);
    }
}
