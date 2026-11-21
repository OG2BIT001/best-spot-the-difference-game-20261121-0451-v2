// shots.js — canned poses for screenshots: ?shot=<name> opens the game on a
// posed mid-hunt state (a fixed scene, some differences already found, a hint
// pulsing) so a screenshot shows a real game in progress, not a menu.

export const SHOT_POSES = {
  cover: { scene: 'harbour', found: ['sail', 'lamp', 'gull', 'crates'], hint: 'sun', misses: [{ x: 268, y: 150 }] },
  forest: { scene: 'forest', found: ['moon', 'mushroom-cap', 'owl', 'frog', 'berries'], hint: 'lantern', misses: [] },
  alpine: { scene: 'alpine', found: ['window', 'smoke', 'tree-star'], hint: 'sled', misses: [{ x: 388, y: 180 }] },
  reef: { scene: 'reef', found: ['turtle', 'fish', 'starfish', 'coral'], hint: 'chest', misses: [] },
  menu: { scene: 'harbour', found: [], hint: null, misses: [], screen: 'menu' },
};

export function shotPose() {
  const name = new URLSearchParams(location.search).get('shot');
  if (!name) return null;
  return SHOT_POSES[name] ? { name, ...SHOT_POSES[name] } : null;
}
