// scene-reef.js — "Coral Garden": a sunlit reef with a sea turtle, a fish
// school, jellyfish, coral towers and a treasure chest on the sand.

import { vGrad, glow, softShadow, circle } from './canvas-kit.js';
import { shade, withAlpha } from './palette.js';

export const DIFFS = [
  { id: 'turtle', x: 198, y: 176, r: 27, label: "the turtle's shell changed pattern" },
  { id: 'chest', x: 472, y: 356, r: 25, label: 'the treasure chest closed' },
  { id: 'starfish', x: 118, y: 394, r: 17, label: 'the starfish is missing' },
  { id: 'fish', x: 354, y: 106, r: 15, label: 'a fish left the school' },
  { id: 'jellyfish', x: 522, y: 108, r: 21, label: 'the jellyfish drifted away' },
  { id: 'coral', x: 82, y: 296, r: 25, label: 'the great coral changed colour' },
  { id: 'bubbles', x: 252, y: 128, r: 17, label: 'the bubble trail is gone' },
  { id: 'conch', x: 302, y: 402, r: 17, label: 'the conch shell is missing' },
  { id: 'seaweed', x: 560, y: 296, r: 19, label: 'the tall kelp is missing' },
  { id: 'eel', x: 424, y: 300, r: 19, label: 'the eel ducked back into its rock' },
];

function fishShape(ctx, x, y, s, colour, flip = 1) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x - 12 * s * flip, y);
  ctx.quadraticCurveTo(x, y - 8 * s, x + 11 * s * flip, y);
  ctx.quadraticCurveTo(x, y + 8 * s, x - 12 * s * flip, y);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 11 * s * flip, y);
  ctx.lineTo(x - 19 * s * flip, y - 6 * s);
  ctx.lineTo(x - 19 * s * flip, y + 6 * s);
  ctx.closePath(); ctx.fill();
  circle(ctx, x + 6 * s * flip, y - 1.5 * s, 1.5 * s, '#12303f');
}

function coralFan(ctx, x, y, s, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 5 * s;
  ctx.lineCap = 'round';
  const branches = [[0, -52], [-20, -44], [20, -44], [-36, -28], [36, -28], [-10, -60], [12, -58]];
  for (const [dx, dy] of branches) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + dx * s * 0.4, y + dy * s * 0.6, x + dx * s, y + dy * s);
    ctx.stroke();
    circle(ctx, x + dx * s, y + dy * s, 3.4 * s, shade(colour === '#e86a92' ? '#c44a74' : '#c85a28', 0));
  }
}

function kelp(ctx, x, base, h, colour, sway) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.bezierCurveTo(x + sway, base - h * 0.35, x - sway, base - h * 0.7, x + sway * 0.6, base - h);
  ctx.stroke();
  ctx.fillStyle = shade(colour === '#2e8f5b' ? '#3fae6e' : '#2e8f5b', 0);
  for (const t of [0.3, 0.55, 0.8]) {
    const px = x + Math.sin(t * 3) * sway * 0.5;
    const py = base - h * t;
    ctx.beginPath();
    ctx.ellipse(px + 8, py, 9, 4, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function paint(ctx, altered) {
  const A = (id) => altered.has(id);

  // water
  vGrad(ctx, 0, 0, 600, 450, [[0, '#3f96cc'], [0.5, '#2a6ea6'], [1, '#17456e']]);
  // light rays
  ctx.fillStyle = 'rgba(255,255,230,0.10)';
  for (const [x, w] of [[90, 46], [210, 30], [350, 56], [480, 34]]) {
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x + w, 0); ctx.lineTo(x + w + 44, 330); ctx.lineTo(x + 30, 330);
    ctx.closePath(); ctx.fill();
  }
  glow(ctx, 300, 10, 190, '#bfe8ff', 0.3);
  // distant reef silhouettes
  ctx.fillStyle = 'rgba(16,52,84,0.5)';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(90, 290, 180, 322);
  ctx.quadraticCurveTo(300, 350, 420, 318);
  ctx.quadraticCurveTo(520, 296, 600, 326);
  ctx.lineTo(600, 450); ctx.lineTo(0, 450);
  ctx.closePath(); ctx.fill();

  // sand bed
  vGrad(ctx, 0, 378, 600, 72, [[0, '#d9c08a'], [1, '#b89a64']]);
  ctx.fillStyle = 'rgba(120,90,50,0.35)';
  for (const [x, y] of [[60, 420], [180, 434], [330, 424], [470, 436], [540, 418], [240, 410]]) {
    ctx.beginPath(); ctx.ellipse(x, y, 14, 3.4, 0, 0, Math.PI * 2); ctx.fill();
  }

  // rock cluster, right-centre (the eel's home)
  ctx.fillStyle = '#5d6a78';
  ctx.beginPath();
  ctx.moveTo(378, 378); ctx.lineTo(392, 322); ctx.lineTo(430, 306); ctx.lineTo(466, 330); ctx.lineTo(474, 378);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade('#5d6a78', 0.14);
  ctx.beginPath();
  ctx.moveTo(392, 322); ctx.lineTo(430, 306); ctx.lineTo(446, 330); ctx.lineTo(414, 336);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#232c34';
  ctx.beginPath(); ctx.ellipse(424, 322, 13, 9, 0.3, 0, Math.PI * 2); ctx.fill();
  if (!A('eel')) {
    ctx.strokeStyle = '#7fae4c';
    ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(424, 326); ctx.quadraticCurveTo(410, 306, 420, 292);
    ctx.stroke();
    circle(ctx, 421, 290, 6.4, '#7fae4c');
    circle(ctx, 418.6, 288, 1.5, '#10220c');
    circle(ctx, 423.6, 288, 1.5, '#10220c');
    ctx.strokeStyle = '#5d8a38'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(418, 294); ctx.quadraticCurveTo(421, 296, 424, 294); ctx.stroke();
  }

  // great coral, left
  softShadow(ctx, 84, 380, 52, 7, 0.2);
  ctx.fillStyle = '#6a7683';
  ctx.beginPath();
  ctx.moveTo(30, 382); ctx.lineTo(44, 344); ctx.lineTo(120, 344); ctx.lineTo(136, 382);
  ctx.closePath(); ctx.fill();
  coralFan(ctx, 82, 348, 1.5, A('coral') ? '#f08c2e' : '#e86a92');
  coralFan(ctx, 44, 362, 0.9, '#b48ce8');
  coralFan(ctx, 122, 364, 0.8, '#e86a92');
  // tube sponges
  for (const [x, h, c] of [[150, 40, '#e8c53a'], [162, 28, '#d8a92e'], [140, 22, '#e8c53a']]) {
    ctx.fillStyle = c;
    ctx.fillRect(x, 382 - h, 11, h);
    ctx.fillStyle = shade('#b8932a', 0);
    ctx.beginPath(); ctx.ellipse(x + 5.5, 382 - h, 6.4, 3, 0, 0, Math.PI * 2); ctx.fill();
  }
  // anemone
  ctx.strokeStyle = '#c95f9e'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI * (0.15 + 0.7 * (i / 8));
    ctx.beginPath();
    ctx.moveTo(230, 388);
    ctx.quadraticCurveTo(230 + Math.cos(a) * 12, 388 + Math.sin(a) * 12, 230 + Math.cos(a) * 19, 388 + Math.sin(a) * 19);
    ctx.stroke();
  }
  circle(ctx, 230, 390, 6, '#a34a80');

  // kelp strands
  kelp(ctx, 36, 388, 120, '#2e8f5b', 12);
  kelp(ctx, 540, 392, 130, '#2e8f5b', -14);
  if (!A('seaweed')) kelp(ctx, 566, 394, 170, '#359b64', 16);
  kelp(ctx, 330, 396, 74, '#2e8f5b', 10);

  // turtle, centre-left, swimming right
  const tx = 198, ty = 182;
  ctx.fillStyle = '#5d8a4a';
  ctx.beginPath(); ctx.ellipse(tx - 44, ty + 20, 17, 8, 0.7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx + 40, ty + 24, 15, 7, -0.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(tx + 30, ty - 22, 14, 7, 0.6, 0, Math.PI * 2); ctx.fill();
  circle(ctx, tx + 62, ty - 6, 11, '#6d9c57');
  circle(ctx, tx + 66, ty - 8, 2, '#14301c');
  ctx.fillStyle = '#7fae62';
  ctx.beginPath(); ctx.ellipse(tx + 58, ty + 2, 6, 3.4, 0.4, 0, Math.PI * 2); ctx.fill();
  // shell
  ctx.fillStyle = '#4a7a3c';
  ctx.beginPath(); ctx.ellipse(tx, ty, 50, 33, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5d8a4a';
  ctx.beginPath(); ctx.ellipse(tx, ty - 3, 42, 27, 0, 0, Math.PI * 2); ctx.fill();
  if (A('turtle')) {
    ctx.strokeStyle = '#3c6630'; ctx.lineWidth = 3.4;
    for (const dx of [-26, 0, 26]) {
      ctx.beginPath();
      ctx.moveTo(tx + dx, ty - 28); ctx.lineTo(tx + dx, ty + 22);
      ctx.stroke();
    }
    ctx.beginPath(); ctx.ellipse(tx, ty - 3, 42, 27, 0, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.fillStyle = '#3c6630';
    for (const [dx, dy, r] of [[-24, -10, 8], [4, -16, 9], [26, -6, 7], [-8, 6, 9], [-30, 10, 6], [20, 12, 7]]) {
      circle(ctx, tx + dx, ty + dy, r, '#3c6630');
      circle(ctx, tx + dx, ty + dy, r * 0.55, '#6d9c57');
    }
  }
  // bubble trail behind the turtle
  if (!A('bubbles')) {
    for (const [x, y, r] of [[252, 128, 5], [244, 108, 3.8], [258, 88, 3], [248, 66, 2.4]]) {
      ctx.strokeStyle = 'rgba(230,248,255,0.85)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      circle(ctx, x - r * 0.3, y - r * 0.3, r * 0.28, 'rgba(255,255,255,0.8)');
    }
  }

  // fish school
  const school = [[300, 92, 1, '#f2b04a'], [330, 76, 0.85, '#f2b04a'], [354, 106, 0.95, '#f08c2e'], [322, 122, 0.8, '#f2b04a'], [282, 118, 0.75, '#f08c2e'], [368, 82, 0.7, '#f2b04a']];
  school.forEach(([x, y, s, c], i) => {
    if (A('fish') && i === 2) return;
    fishShape(ctx, x, y, s, c);
  });
  // two blue fish below
  fishShape(ctx, 150, 120, 1.05, '#57b6e8', -1);
  fishShape(ctx, 182, 140, 0.85, '#57b6e8', -1);
  // a ray gliding at the back
  ctx.fillStyle = 'rgba(30,70,105,0.65)';
  ctx.beginPath();
  ctx.moveTo(420, 210);
  ctx.quadraticCurveTo(470, 188, 520, 210);
  ctx.quadraticCurveTo(470, 224, 420, 210);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(30,70,105,0.65)'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(520, 210); ctx.quadraticCurveTo(548, 216, 556, 232); ctx.stroke();

  // jellyfish, top right
  if (!A('jellyfish')) {
    ctx.fillStyle = 'rgba(232,140,192,0.75)';
    ctx.beginPath();
    ctx.moveTo(498, 108);
    ctx.quadraticCurveTo(500, 74, 522, 72);
    ctx.quadraticCurveTo(544, 74, 546, 108);
    ctx.quadraticCurveTo(534, 100, 522, 108);
    ctx.quadraticCurveTo(510, 100, 498, 108);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(232,140,192,0.8)'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    for (const dx of [-14, -5, 5, 14]) {
      ctx.beginPath();
      ctx.moveTo(522 + dx, 106);
      ctx.bezierCurveTo(522 + dx - 6, 124, 522 + dx + 6, 138, 522 + dx, 156);
      ctx.stroke();
    }
    circle(ctx, 514, 88, 3.4, 'rgba(255,220,240,0.9)');
  }

  // treasure chest on the sand
  softShadow(ctx, 472, 386, 52, 7, 0.25);
  if (!A('chest')) glow(ctx, 472, 330, 44, '#ffd94a', 0.65);
  ctx.fillStyle = '#7a4a28';
  ctx.fillRect(432, 348, 80, 36);
  ctx.fillStyle = '#8a5732';
  ctx.fillRect(432, 348, 80, 8);
  ctx.strokeStyle = '#4a3423'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(432, 364); ctx.lineTo(512, 364); ctx.stroke();
  // lid: open in the left picture, shut in the right
  ctx.fillStyle = '#8a5732';
  if (A('chest')) {
    ctx.beginPath();
    ctx.moveTo(432, 348); ctx.quadraticCurveTo(472, 322, 512, 348);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(432, 348); ctx.quadraticCurveTo(472, 324, 512, 348); ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(434, 348); ctx.lineTo(452, 306); ctx.lineTo(466, 310); ctx.lineTo(458, 348);
    ctx.closePath(); ctx.fill();
    // gold spilling out
    for (const [dx, dy] of [[0, 0], [12, -4], [24, 0], [6, 6], [18, 7]]) {
      circle(ctx, 466 + dx, 344 + dy, 5, '#ffd94a');
      circle(ctx, 466 + dx, 344 + dy, 2.4, '#fff0a8');
    }
  }
  // bands + lock
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(446, 348, 7, 36);
  ctx.fillRect(492, 348, 7, 36);
  roundRectLock(ctx, 464, 356, 16, 14, '#e8c53a');

  // starfish
  if (!A('starfish')) {
    ctx.fillStyle = '#f08c4a';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      const a2 = a + Math.PI / 5;
      ctx.lineTo(118 + Math.cos(a) * 17, 394 + Math.sin(a) * 17);
      ctx.lineTo(118 + Math.cos(a2) * 7.5, 394 + Math.sin(a2) * 7.5);
    }
    ctx.closePath(); ctx.fill();
    for (const [dx, dy] of [[0, -6], [-6, 3], [6, 3], [0, 6]]) {
      circle(ctx, 118 + dx, 394 + dy, 1.7, '#c96a2e');
    }
  }
  // conch
  if (!A('conch')) {
    ctx.fillStyle = '#f2c4a8';
    ctx.beginPath();
    ctx.moveTo(282, 408);
    ctx.quadraticCurveTo(280, 388, 298, 384);
    ctx.quadraticCurveTo(320, 382, 322, 398);
    ctx.quadraticCurveTo(320, 412, 304, 412);
    ctx.lineTo(288, 412);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d89a76'; ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(292, 390); ctx.quadraticCurveTo(304, 386, 316, 392);
    ctx.moveTo(290, 400); ctx.quadraticCurveTo(304, 396, 318, 402);
    ctx.stroke();
    ctx.fillStyle = '#e88ca8';
    ctx.beginPath(); ctx.ellipse(318, 404, 5, 8, 0.4, 0, Math.PI * 2); ctx.fill();
  }
  // scattered shells + pearls
  for (const [x, y, c] of [[210, 420, '#f2d0e0'], [520, 424, '#f2e3c8'], [60, 428, '#f2e3c8']]) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x - 9, y + 5);
    ctx.quadraticCurveTo(x, y - 10, x + 9, y + 5);
    ctx.closePath(); ctx.fill();
  }
  circle(ctx, 352, 428, 3.4, '#fdf6ec');
  // plankton sparkle
  for (const [x, y] of [[90, 60], [180, 210], [420, 60], [560, 190], [300, 250], [40, 160]]) {
    circle(ctx, x, y, 1.7, 'rgba(230,248,255,0.6)');
  }
  ctx.fillStyle = withAlpha('#0c2c48', 0.12);
  ctx.fillRect(0, 0, 600, 450);
}

function roundRectLock(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x + 3, y);
  ctx.lineTo(x + w - 3, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + 3);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + 3);
  ctx.quadraticCurveTo(x, y, x + 3, y);
  ctx.closePath(); ctx.fill();
  circle(ctx, x + w / 2, y + h / 2, 2.6, '#7a5a10');
}
