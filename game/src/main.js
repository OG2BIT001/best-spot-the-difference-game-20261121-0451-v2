// main.js — the conductor: builds the menu, runs hunts, keeps the HUD
// honest and moves between scenes. The two pictures of a hunt are painted
// once onto offscreen canvases; each frame only the markers, pulses and
// particles are redrawn on top, so the game stays smooth.

import { PANEL_W, PANEL_H, DIFFICULTIES, DEFAULT_DIFFICULTY } from './config.js';
import { SCENES, sceneById } from './scenes.js';
import { Hunt } from './state.js';
import { drawOverlay } from './markers.js';
import { SoundKit } from './sound.js';
import { bindPointer, keyVerb } from './input.js';
import { progress } from './progress.js';
import { shotPose } from './shots.js';

const $ = (id) => document.getElementById(id);
const els = {
  menu: $('screen-menu'),
  game: $('screen-game'),
  grid: $('scene-grid'),
  starTotal: $('star-total'),
  scene: $('hud-scene'),
  place: $('hud-place'),
  counter: $('hud-counter'),
  time: $('hud-time'),
  timerFill: $('timer-fill'),
  hearts: $('hud-hearts'),
  score: $('hud-score'),
  hint: $('btn-hint'),
  toast: $('toast'),
  left: $('canvas-left'),
  right: $('canvas-right'),
  pauseOverlay: $('overlay-pause'),
  endOverlay: $('overlay-end'),
  endStars: $('end-stars'),
  endTitle: $('end-title'),
  endDetail: $('end-detail'),
  next: $('btn-next'),
  sound: $('btn-sound'),
};

const sound = new SoundKit();
let difficultyId = DEFAULT_DIFFICULTY;
let hunt = null;
let sceneIndex = 0;
let paused = false;
let pose = shotPose();
let lastTickSecond = -1;
let rafId = null;

const EMPTY = new Set();

function fmtTime(s) {
  const t = Math.max(0, Math.ceil(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

function toast(msg) {
  els.toast.textContent = msg;
}

// ---------- menu ----------

function buildMenu() {
  els.grid.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'scene-card';
    const preview = document.createElement('canvas');
    preview.width = 300;
    preview.height = 225;
    const pctx = preview.getContext('2d');
    pctx.scale(0.5, 0.5);
    scene.paint(pctx, EMPTY);
    const best = progress.best(scene.id, difficultyId);
    const stars = '★'.repeat(best.stars) + '☆'.repeat(3 - best.stars);
    const body = document.createElement('div');
    body.className = 'scene-card-body';
    body.innerHTML = `
      <p class="scene-card-title">${i + 1}. ${scene.title}</p>
      <p class="scene-card-place">${scene.place}</p>
      <p class="scene-card-blurb">${scene.blurb}</p>
      <div class="scene-card-meta">
        <span>${scene.diffs.length} differences</span>
        <span class="scene-card-stars">${stars}</span>
      </div>`;
    card.append(preview, body);
    card.addEventListener('click', () => {
      sound.click();
      startHunt(i);
    });
    els.grid.append(card);
  });
  els.starTotal.textContent = progress.totalStars();
}

function showMenu() {
  hunt = null;
  paused = false;
  els.game.hidden = true;
  els.menu.hidden = false;
  els.pauseOverlay.hidden = true;
  els.endOverlay.hidden = true;
  buildMenu();
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

// ---------- hunts ----------

function prerender(scene, altered) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const c = document.createElement('canvas');
  c.width = PANEL_W * dpr;
  c.height = PANEL_H * dpr;
  const ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);
  scene.paint(ctx, altered);
  return c;
}

let panelLeft = null;
let panelRight = null;

function startHunt(index, keepDifficulty = true) {
  sceneIndex = ((index % SCENES.length) + SCENES.length) % SCENES.length;
  const scene = SCENES[sceneIndex];
  hunt = new Hunt(scene, difficultyId);
  paused = false;
  lastTickSecond = -1;
  panelLeft = prerender(scene, EMPTY);
  panelRight = prerender(scene, scene.allAltered);
  els.menu.hidden = true;
  els.game.hidden = false;
  els.pauseOverlay.hidden = true;
  els.endOverlay.hidden = true;
  els.scene.textContent = scene.title;
  els.place.textContent = scene.place;
  toast(`Find all ${scene.diffs.length} differences — click either picture.`);
  fitCanvases();
  syncHud();
  if (!rafId) loop(performance.now());
}

function fitCanvases() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  for (const c of [els.left, els.right]) {
    c.width = PANEL_W * dpr;
    c.height = PANEL_H * dpr;
  }
}

function drawPanels(now) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  for (const [canvas, img] of [[els.left, panelLeft], [els.right, panelRight]]) {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, PANEL_W, PANEL_H);
    ctx.drawImage(img, 0, 0, PANEL_W, PANEL_H);
    drawOverlay(ctx, hunt, now);
  }
}

function syncHud() {
  if (!hunt) return;
  els.counter.innerHTML = `Found ${hunt.found.size} of ${hunt.total} — <b>${hunt.remaining} to go</b>`;
  els.time.textContent = fmtTime(hunt.timeLeft);
  const frac = Math.max(0, hunt.timeLeft / hunt.difficulty.seconds);
  els.timerFill.style.width = `${frac * 100}%`;
  const low = hunt.timeLeft <= 30 && !hunt.over;
  els.timerFill.classList.toggle('low', low);
  els.time.classList.toggle('low', low);
  els.hearts.innerHTML =
    '♥'.repeat(Math.max(0, hunt.lives)) +
    `<span class="spent">${'♥'.repeat(Math.max(0, hunt.difficulty.lives - hunt.lives))}</span>`;
  els.score.textContent = hunt.score;
  els.hint.textContent = `Hint · ${hunt.hintsLeft}`;
  els.hint.disabled = hunt.hintsLeft <= 0 || hunt.over;
}

let prevT = 0;
function loop(t) {
  rafId = requestAnimationFrame(loop);
  const dt = Math.min(0.05, (t - prevT) / 1000 || 0);
  prevT = t;
  if (!hunt) return;
  if (pose) {
    // Screenshot pose: the clock and the ink hold still; only the hint breathes.
    hunt.hintT += dt;
  } else if (!paused && !hunt.over) {
    hunt.tick(dt);
    const whole = Math.ceil(hunt.timeLeft);
    if (whole !== lastTickSecond) {
      lastTickSecond = whole;
      if (whole <= 10 && whole > 0) sound.tick();
    }
    syncHud();
    if (hunt.over) finishHunt();
  }
  drawPanels(t / 1000);
}

function finishHunt() {
  if (!hunt) return;
  if (hunt.status === 'won') {
    sound.win();
    const stars = hunt.stars();
    progress.record(hunt.scene.id, difficultyId, stars, hunt.score);
    els.endStars.innerHTML = '★'.repeat(stars) + '<span class="dim">' + '★'.repeat(3 - stars) + '</span>';
    els.endTitle.textContent = 'Every change found!';
    els.endDetail.textContent =
      `${hunt.scene.title} cleared with ${fmtTime(hunt.difficulty.seconds - hunt.timeLeft)} on the clock, ` +
      `${hunt.mistakes} wrong click${hunt.mistakes === 1 ? '' : 's'} and ${hunt.hintsUsed} hint${hunt.hintsUsed === 1 ? '' : 's'} — score ${hunt.score}.`;
    els.next.textContent = sceneIndex + 1 < SCENES.length ? 'Next scene' : 'Back to the shelf';
  } else {
    sound.lose();
    els.endStars.innerHTML = '<span class="dim">★★★</span>';
    els.endTitle.textContent = hunt.lives <= 0 ? 'Out of hearts' : 'Time is up';
    els.endDetail.textContent =
      `You found ${hunt.found.size} of ${hunt.total} differences in ${hunt.scene.title}. ` +
      `The rest are still hiding — try again and watch the quiet corners.`;
    els.next.textContent = 'Try the next scene anyway';
  }
  els.starTotal.textContent = progress.totalStars();
  setTimeout(() => { els.endOverlay.hidden = false; }, 650);
}

// ---------- input wiring ----------

function onPoint({ x, y }) {
  if (!hunt || paused || hunt.over) return;
  sound.ensure();
  const result = hunt.click(x, y);
  if (result === 'found') {
    sound.find();
    toast(hunt.remaining > 0 ? `Found it — ${hunt.remaining} to go.` : 'That was the last one!');
  } else if (result === 'miss') {
    sound.miss();
    toast(hunt.lives > 0 ? `Not there — ${hunt.lives} heart${hunt.lives === 1 ? '' : 's'} left.` : 'That was the last heart.');
  }
  syncHud();
  if (hunt.over) finishHunt();
}

bindPointer(els.left, onPoint);
bindPointer(els.right, onPoint);

function doHint() {
  if (!hunt || paused || hunt.over) return;
  const id = hunt.useHint();
  if (id) {
    sound.hint();
    const d = hunt.scene.diffs.find((x) => x.id === id);
    toast(`Hint: look near ${d.label.replace(/^the |^a |^an /, 'the ')}.`);
  } else {
    toast('No hints left in this hunt.');
  }
  syncHud();
}

function setPaused(v) {
  if (!hunt || hunt.over) return;
  paused = v;
  els.pauseOverlay.hidden = !v;
}

document.addEventListener('keydown', (event) => {
  const verb = keyVerb(event);
  if (!verb) return;
  if (verb === 'menu') { showMenu(); return; }
  if (verb === 'mute') { toggleSound(); return; }
  if (verb.startsWith('scene:')) {
    if (!els.menu.hidden || hunt) startHunt(Number(verb.slice(6)));
    return;
  }
  if (!hunt) return;
  if (verb === 'hint') doHint();
  if (verb === 'pause') setPaused(!paused);
  if (verb === 'restart') startHunt(sceneIndex);
  if (verb === 'next') startHunt(sceneIndex + 1);
});

function toggleSound() {
  sound.muted = !sound.muted;
  els.sound.textContent = sound.muted ? 'Sound: off' : 'Sound: on';
}

els.sound.addEventListener('click', toggleSound);
$('btn-menu-top').addEventListener('click', showMenu);
els.hint.addEventListener('click', doHint);
$('btn-pause').addEventListener('click', () => setPaused(true));
$('btn-resume').addEventListener('click', () => setPaused(false));
$('btn-restart2').addEventListener('click', () => startHunt(sceneIndex));
$('btn-quit2').addEventListener('click', showMenu);
$('btn-retry').addEventListener('click', () => startHunt(sceneIndex));
$('btn-quit').addEventListener('click', showMenu);
els.next.addEventListener('click', () => {
  if (hunt && hunt.status === 'won' && sceneIndex + 1 >= SCENES.length) showMenu();
  else startHunt(sceneIndex + 1);
});

for (const pill of document.querySelectorAll('.pill')) {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach((p) => p.classList.remove('is-on'));
    pill.classList.add('is-on');
    difficultyId = pill.dataset.difficulty || DEFAULT_DIFFICULTY;
    if (!hunt) buildMenu();
  });
}

// ---------- boot ----------

if (pose && !pose.screen) {
  difficultyId = 'classic';
  const idx = SCENES.findIndex((s) => s.id === pose.scene);
  startHunt(idx >= 0 ? idx : 0);
  pose.timeLeft = 154;
  hunt.timeLeft = pose.timeLeft;
  for (const id of pose.found) hunt.found.add(id);
  hunt.score = pose.found.length * 200;
  if (pose.hint) {
    hunt.hintId = pose.hint;
    hunt.hintT = 0.5;
    hunt.hintsLeft -= 1;
  }
  for (const m of pose.misses) hunt.misses.push({ ...m, t: 0.3 });
  hunt.misses.forEach((m) => { m.t = 0.3; });
  syncHud();
} else {
  showMenu();
}
