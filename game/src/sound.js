// sound.js — every sound is synthesised with WebAudio: no audio files, no
// network. A tiny envelope-and-oscillator kit plays the find chime, the miss
// thud, the hint shimmer, the tick of the last ten seconds and the win/lose
// jingles. Muting is remembered by main.js, not here.

export class SoundKit {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, t0, dur, type = 'sine', gain = 0.16, slideTo = null) {
    if (this.muted || !this.ensure()) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const start = ctx.currentTime + t0;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  click() { this.tone(660, 0, 0.07, 'triangle', 0.08); }

  find() {
    this.tone(784, 0, 0.12, 'sine', 0.16);
    this.tone(988, 0.07, 0.14, 'sine', 0.16);
    this.tone(1319, 0.14, 0.22, 'sine', 0.14);
  }

  miss() { this.tone(196, 0, 0.16, 'sawtooth', 0.07, 130); }

  hint() {
    this.tone(1568, 0, 0.18, 'sine', 0.07);
    this.tone(2093, 0.09, 0.24, 'sine', 0.06);
  }

  tick() { this.tone(1180, 0, 0.05, 'square', 0.045); }

  win() {
    const notes = [523, 659, 784, 1047, 784, 1047];
    notes.forEach((n, i) => this.tone(n, i * 0.11, 0.24, 'triangle', 0.15));
  }

  lose() {
    const notes = [392, 370, 349, 311];
    notes.forEach((n, i) => this.tone(n, i * 0.16, 0.3, 'triangle', 0.12));
  }
}
