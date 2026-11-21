// state.js — one hunt's state: what has been found, the clock, the lives,
// the hints and the score. Pure bookkeeping; main.js owns the DOM and the
// canvases, markers.js owns the ink.

import { DIFFICULTIES, SCORE, parScore } from './config.js';

export class Hunt {
  constructor(scene, difficultyId) {
    this.scene = scene;
    this.difficulty = DIFFICULTIES[difficultyId];
    this.found = new Set();
    this.misses = [];        // {x, y, panel, t} fading red crosses
    this.rings = [];         // {diff, t} pop animations on a fresh find
    this.particles = [];     // {x, y, vx, vy, t, colour} sparkle bursts
    this.hintId = null;      // difference the hint is pulsing on
    this.hintT = 0;
    this.timeLeft = this.difficulty.seconds;
    this.lives = this.difficulty.lives;
    this.hintsLeft = this.difficulty.hints;
    this.score = 0;
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.status = 'playing'; // playing | won | lost
    this.elapsed = 0;
  }

  get total() { return this.scene.diffs.length; }
  get remaining() { return this.total - this.found.size; }
  get over() { return this.status !== 'playing'; }

  // A click in panel coordinates. Returns 'found' | 'already' | 'miss'.
  click(x, y) {
    if (this.over) return 'already';
    for (const d of this.scene.diffs) {
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        if (this.found.has(d.id)) return 'already';
        this.found.add(d.id);
        this.score += SCORE.find * this.difficulty.scoreMul;
        this.rings.push({ diff: d, t: 0 });
        this.burst(d.x, d.y);
        if (this.hintId === d.id) this.hintId = null;
        if (this.remaining === 0) this.win();
        return 'found';
      }
    }
    this.mistakes += 1;
    this.lives -= 1;
    this.score = Math.max(0, this.score - SCORE.mistakePenalty * this.difficulty.scoreMul);
    this.misses.push({ x, y, t: 0 });
    if (this.lives <= 0) this.status = 'lost';
    return 'miss';
  }

  burst(x, y) {
    const colours = ['#ffd94a', '#7be495', '#ffffff', '#ff9ec6'];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + Math.random() * 0.4;
      const sp = 40 + Math.random() * 90;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 30,
        t: 0,
        life: 0.55 + Math.random() * 0.3,
        colour: colours[i % colours.length],
      });
    }
  }

  useHint() {
    if (this.over || this.hintsLeft <= 0) return null;
    const open = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (open.length === 0) return null;
    this.hintsLeft -= 1;
    this.hintsUsed += 1;
    this.score = Math.max(0, this.score - this.difficulty.hintCost * this.difficulty.scoreMul);
    this.hintId = open[Math.floor(Math.random() * open.length)].id;
    this.hintT = 0;
    return this.hintId;
  }

  win() {
    this.status = 'won';
    this.score += Math.floor(this.timeLeft) * SCORE.timeBonusPerSecond * this.difficulty.scoreMul;
  }

  stars() {
    if (this.status !== 'won') return 0;
    const par = parScore(this.total, this.difficulty.id);
    const ratio = this.score / par;
    if (ratio >= SCORE.starThree) return 3;
    if (ratio >= SCORE.starTwo) return 2;
    return 1;
  }

  // Advance the clock and every animation. dt in seconds.
  tick(dt) {
    this.elapsed += dt;
    if (!this.over) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.status = 'lost';
      }
    }
    for (const m of this.misses) m.t += dt;
    this.misses = this.misses.filter((m) => m.t < 0.9);
    for (const r of this.rings) r.t += dt;
    this.rings = this.rings.filter((r) => r.t < 0.6);
    for (const p of this.particles) {
      p.t += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
    }
    this.particles = this.particles.filter((p) => p.t < p.life);
    if (this.hintId) this.hintT += dt;
  }
}
