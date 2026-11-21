// input.js — pointer and keyboard translation: a click on either canvas
// becomes panel coordinates, and keys become game verbs for main.js.

import { PANEL_W, PANEL_H } from './config.js';

// Map a pointer event on a panel canvas to logical panel coordinates.
export function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
  return { x, y };
}

export function bindPointer(canvas, onPoint) {
  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    onPoint(panelPoint(canvas, event));
  });
}

// Key map: returns a verb string or null. Scene jumps are 'scene:0' style.
export function keyVerb(event) {
  if (event.repeat) return null;
  const k = event.key.toLowerCase();
  if (k === 'h') return 'hint';
  if (k === 'p' || k === ' ') return 'pause';
  if (k === 'm') return 'mute';
  if (k === 'r') return 'restart';
  if (k === 'n') return 'next';
  if (k === 'escape') return 'menu';
  if (/^[1-6]$/.test(k)) return `scene:${Number(k) - 1}`;
  return null;
}
