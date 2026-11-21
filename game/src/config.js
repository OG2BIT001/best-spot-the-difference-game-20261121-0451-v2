// config.js — the numbers every other module agrees on: panel geometry,
// difficulty presets, timing and scoring for Twin Vistas.

export const PANEL_W = 600; // one picture, logical pixels
export const PANEL_H = 450;

export const DIFFICULTIES = {
  relaxed: { id: 'relaxed', label: 'Relaxed', seconds: 360, lives: 5, hints: 5, hintCost: 0, scoreMul: 1 },
  classic: { id: 'classic', label: 'Classic', seconds: 240, lives: 3, hints: 3, hintCost: 5, scoreMul: 2 },
  expert: { id: 'expert', label: 'Expert', seconds: 150, lives: 3, hints: 2, hintCost: 10, scoreMul: 3 },
};

export const DEFAULT_DIFFICULTY = 'classic';

export const SCORE = {
  find: 100,          // points per difference found
  mistakePenalty: 25, // points lost per wrong click
  timeBonusPerSecond: 2, // leftover seconds paid out on a clear
  starThree: 0.9,     // fraction of the par score needed for 3 stars
  starTwo: 0.6,
};

// Par score for a scene: every find plus a modest time bonus, no mistakes.
export function parScore(diffCount, difficulty) {
  const d = DIFFICULTIES[difficulty];
  return (SCORE.find * diffCount + SCORE.timeBonusPerSecond * Math.floor(d.seconds / 3)) * d.scoreMul;
}
