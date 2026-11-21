// Twin Vistas — Spot the Difference: the hand-in program.
//
// The game itself is the static site in game/ (game/index.html and the ES
// modules under game/src/, no build step, no network). This program copies
// game/ and screenshots/ into the output directory and writes dossier.json
// there with buildDossier from the vendored make.fun library, so the dossier
// is exactly the one the scorer rebuilds. Node 22, standard library only.
//
// In the grader the output directory is /output; anywhere else set
// MAKEFUN_OUTPUT_DIR to stand in for it:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's own limits, checked here first so a bad hand-in fails loudly at
// build time instead of quietly at the scorer: at most 4 screenshots of at
// most 256 KiB, and game/ within its file-count and byte caps.
function refuse(message) {
  throw new Error(`Twin Vistas hand-in refused: ${message}`);
}

function checkScreenshots(dir) {
  if (!existsSync(dir)) refuse('screenshots/ is missing');
  const shots = readdirSync(dir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > 4) refuse(`screenshots/ holds ${shots.length} images, needs 3 or 4`);
  for (const name of shots) {
    const bytes = statSync(join(dir, name)).size;
    if (bytes > 262144) refuse(`screenshots/${name} is ${bytes} bytes, over the 256 KiB cap`);
  }
  return shots.length;
}

function checkGameTree(dir) {
  let files = 0;
  let bytes = 0;
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else { files += 1; bytes += st.size; }
    }
  };
  walk(dir);
  if (files > 993) refuse(`game/ holds ${files} files, over the 993 cap`);
  if (bytes > 50331648) refuse(`game/ is ${bytes} bytes, over the 48 MiB cap`);
  if (!existsSync(join(dir, 'index.html'))) refuse('game/index.html is missing');
  return { files, bytes };
}

const shotCount = checkScreenshots(join(root, 'screenshots'));
const gameStats = checkGameTree(join(root, 'game'));

mkdirSync(outDir, { recursive: true });
cpSync(join(root, 'game'), join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
cpSync(join(root, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

console.log(`Twin Vistas handed in: ${gameStats.files} game files (${gameStats.bytes} bytes), ${shotCount} screenshots, dossier.json written to ${outDir}`);
