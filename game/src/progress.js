// progress.js — the player's shelf of stars: best stars and best score per
// scene and difficulty, kept in localStorage so the menu can show what has
// been earned. Falls back to memory when storage is unavailable.

const KEY = 'twin-vistas-progress-v1';

class Progress {
  constructor() {
    this.data = {};
    try {
      this.data = JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch {
      this.data = {};
    }
  }

  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      // Private mode etc.: the shelf just lasts for the visit.
    }
  }

  record(sceneId, difficultyId, stars, score) {
    const k = `${sceneId}:${difficultyId}`;
    const prev = this.data[k] || { stars: 0, score: 0 };
    this.data[k] = {
      stars: Math.max(prev.stars, stars),
      score: Math.max(prev.score, score),
    };
    this.save();
  }

  best(sceneId, difficultyId) {
    return this.data[`${sceneId}:${difficultyId}`] || { stars: 0, score: 0 };
  }

  totalStars() {
    return Object.values(this.data).reduce((sum, v) => sum + v.stars, 0);
  }
}

export const progress = new Progress();
