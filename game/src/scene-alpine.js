// scene-alpine.js — "First Snow Cabin": a log cabin under snowy peaks, with
// a snowman, a decorated pine, a sled and a dog by the woodpile.

import { vGrad, glow, softShadow, circle, sparkle, pineTree } from './canvas-kit.js';
import { shade } from './palette.js';

export const DIFFS = [
  { id: 'smoke', x: 176, y: 116, r: 21, label: 'the chimney smoke is gone' },
  { id: 'snowman-hat', x: 440, y: 256, r: 16, label: "the snowman's hat changed colour" },
  { id: 'window', x: 138, y: 264, r: 14, label: 'the cabin window went dark' },
  { id: 'sled', x: 350, y: 372, r: 21, label: 'the sled is missing' },
  { id: 'star', x: 486, y: 58, r: 14, label: 'the bright star went out' },
  { id: 'tree-star', x: 316, y: 240, r: 13, label: 'the star fell off the pine' },
  { id: 'footprints', x: 292, y: 408, r: 23, label: 'the footprints were swept away' },
  { id: 'icicle', x: 226, y: 238, r: 15, label: 'an icicle is missing' },
  { id: 'dog', x: 524, y: 352, r: 19, label: 'the dog wandered off' },
  { id: 'wreath', x: 200, y: 284, r: 13, label: 'the wreath came off the door' },
];

function mountain(ctx, pts, colour, snowColour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (const [x, y] of pts.slice(1)) ctx.lineTo(x, y);
  ctx.closePath(); ctx.fill();
  // snow cap near the first peak point (pts[1] is the summit)
  const [sx, sy] = pts[1];
  ctx.fillStyle = snowColour;
  ctx.beginPath();
  ctx.moveTo(sx - 26, sy + 30);
  ctx.lineTo(sx, sy);
  ctx.lineTo(sx + 26, sy + 30);
  ctx.lineTo(sx + 10, sy + 22);
  ctx.lineTo(sx, sy + 30);
  ctx.lineTo(sx - 12, sy + 20);
  ctx.closePath(); ctx.fill();
}

export function paint(ctx, altered) {
  const A = (id) => altered.has(id);

  // dawn sky
  vGrad(ctx, 0, 0, 600, 300, [[0, '#8fa8cc'], [0.6, '#c3cfe4'], [1, '#e8ecf4']]);
  circle(ctx, 84, 62, 22, '#fdf6d8');
  glow(ctx, 84, 62, 52, '#fdf6d8', 0.5);
  if (!A('star')) sparkle(ctx, 486, 58, 12, '#ffffff');
  sparkle(ctx, 380, 40, 7, 'rgba(255,255,255,0.8)');
  // falling snow
  const snow = [[30, 30], [120, 90], [210, 40], [300, 120], [420, 90], [540, 150], [70, 190], [350, 30], [470, 190], [160, 150], [260, 200], [580, 60]];
  for (const [x, y] of snow) circle(ctx, x, y, 2.2, 'rgba(255,255,255,0.85)');

  // peaks
  mountain(ctx, [[-20, 268], [110, 108], [240, 268]], '#7c8db0', '#f4f8ff');
  mountain(ctx, [[150, 268], [300, 76], [460, 268]], '#93a5c4', '#ffffff');
  mountain(ctx, [[360, 268], [492, 140], [620, 268]], '#7c8db0', '#f4f8ff');
  // tree line on the slopes
  ctx.fillStyle = '#4a5d74';
  for (const [x, y, s] of [[60, 250, 16], [180, 258, 13], [420, 252, 15], [520, 258, 12], [330, 262, 11]]) {
    ctx.beginPath();
    ctx.moveTo(x - s * 0.5, y); ctx.lineTo(x, y - s); ctx.lineTo(x + s * 0.5, y);
    ctx.closePath(); ctx.fill();
  }

  // snowfield
  vGrad(ctx, 0, 262, 600, 188, [[0, '#eef3fa'], [1, '#d3deee']]);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath(); ctx.ellipse(150, 300, 130, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(470, 330, 150, 24, 0, 0, Math.PI * 2); ctx.fill();
  // frozen pond, bottom left
  ctx.fillStyle = '#bcd2e8';
  ctx.beginPath(); ctx.ellipse(88, 404, 74, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(88, 402, 52, 13, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(52, 400); ctx.lineTo(76, 408); ctx.lineTo(96, 398);
  ctx.stroke();

  // background pines
  pineTree(ctx, 36, 320, 92, '#3d5a48');
  pineTree(ctx, 566, 316, 104, '#3d5a48');
  pineTree(ctx, 520, 300, 74, '#476a54');

  // cabin
  softShadow(ctx, 186, 342, 118, 10, 0.16);
  // logs
  ctx.fillStyle = '#8a6238';
  ctx.fillRect(96, 226, 184, 108);
  ctx.strokeStyle = 'rgba(70,45,20,0.5)'; ctx.lineWidth = 2;
  for (let y = 244; y < 334; y += 15) {
    ctx.beginPath(); ctx.moveTo(96, y); ctx.lineTo(280, y); ctx.stroke();
  }
  for (const x of [96, 280]) {
    for (let y = 230; y < 334; y += 15) circle(ctx, x, y + 4, 5, '#a87c48');
  }
  // roof with snow
  ctx.fillStyle = '#5d4030';
  ctx.beginPath();
  ctx.moveTo(78, 230); ctx.lineTo(188, 168); ctx.lineTo(298, 230);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f6f9ff';
  ctx.beginPath();
  ctx.moveTo(86, 226); ctx.lineTo(188, 170); ctx.lineTo(290, 226);
  ctx.lineTo(262, 226); ctx.quadraticCurveTo(230, 208, 188, 210);
  ctx.quadraticCurveTo(140, 208, 112, 226);
  ctx.closePath(); ctx.fill();
  // icicles under the eaves
  ctx.fillStyle = 'rgba(210,232,250,0.95)';
  const icicles = [[120, 26], [150, 18], [196, 30], [226, 22], [258, 16]];
  icicles.forEach(([x, len], i) => {
    if (A('icicle') && i === 3) return;
    ctx.beginPath();
    ctx.moveTo(x - 4, 228); ctx.lineTo(x + 4, 228); ctx.lineTo(x, 228 + len);
    ctx.closePath(); ctx.fill();
  });
  // chimney + smoke
  ctx.fillStyle = '#7a4a3a';
  ctx.fillRect(168, 148, 22, 34);
  ctx.fillStyle = '#5d382c';
  ctx.fillRect(164, 142, 30, 9);
  if (!A('smoke')) {
    for (const [x, y, r, a] of [[180, 128, 9, 0.5], [172, 110, 12, 0.42], [182, 90, 15, 0.34], [170, 68, 18, 0.26]]) {
      circle(ctx, x, y, r, `rgba(240,244,250,${a})`);
    }
  }
  // door + wreath
  roundRectDoor(ctx, 186, 262, 30, 72, '#5d4030');
  circle(ctx, 210, 300, 2.6, '#e8c85a');
  if (!A('wreath')) {
    ctx.strokeStyle = '#3f7046'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(201, 284, 9, 0, Math.PI * 2); ctx.stroke();
    for (const a of [0.4, 1.8, 3.2, 4.6]) {
      circle(ctx, 201 + Math.cos(a) * 9, 284 + Math.sin(a) * 9, 2.4, '#d84a3a');
    }
    circle(ctx, 201, 274, 3, '#d84a3a');
  }
  // window
  if (!A('window')) glow(ctx, 138, 264, 30, '#ffd98a', 0.6);
  ctx.fillStyle = A('window') ? '#4c5462' : '#ffd98a';
  ctx.fillRect(122, 248, 32, 32);
  ctx.strokeStyle = '#5d4030'; ctx.lineWidth = 3;
  ctx.strokeRect(122, 248, 32, 32);
  ctx.beginPath();
  ctx.moveTo(138, 248); ctx.lineTo(138, 280);
  ctx.moveTo(122, 264); ctx.lineTo(154, 264);
  ctx.stroke();
  // window box pine + second small window
  ctx.fillStyle = '#6e4525'; ctx.fillRect(118, 282, 40, 8);
  ctx.fillStyle = '#ffe9b0';
  ctx.fillRect(238, 252, 22, 22);
  ctx.strokeStyle = '#5d4030'; ctx.lineWidth = 2.6;
  ctx.strokeRect(238, 252, 22, 22);

  // decorated pine
  pineTree(ctx, 316, 330, 96, '#2f5d3e');
  for (const [dx, dy, c] of [[-12, -30, '#d84a3a'], [10, -44, '#f2b04a'], [-6, -58, '#4f7fd0'], [12, -18, '#e88cc0'], [-16, -14, '#f2b04a'], [4, -72, '#d84a3a']]) {
    circle(ctx, 316 + dx, 330 + dy, 3.6, c);
  }
  if (!A('tree-star')) sparkle(ctx, 316, 240, 10, '#ffd94a');

  // snowman
  softShadow(ctx, 440, 362, 36, 6, 0.15);
  circle(ctx, 440, 338, 24, '#f8fbff');
  circle(ctx, 440, 304, 17, '#f8fbff');
  circle(ctx, 440, 276, 12.5, '#f8fbff');
  circle(ctx, 435, 273, 1.9, '#22242a');
  circle(ctx, 445, 273, 1.9, '#22242a');
  ctx.fillStyle = '#f08c2e';
  ctx.beginPath();
  ctx.moveTo(440, 278); ctx.lineTo(454, 281); ctx.lineTo(440, 283);
  ctx.closePath(); ctx.fill();
  circle(ctx, 440, 300, 2.2, '#22242a');
  circle(ctx, 440, 312, 2.2, '#22242a');
  circle(ctx, 440, 334, 2.4, '#22242a');
  // arms
  ctx.strokeStyle = '#6e4525'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(426, 302); ctx.lineTo(404, 288);
  ctx.moveTo(454, 302); ctx.lineTo(476, 292);
  ctx.stroke();
  // hat: top hat, black or red
  const hatColour = A('snowman-hat') ? '#c22e3a' : '#2c2c34';
  ctx.fillStyle = hatColour;
  ctx.fillRect(424, 266, 32, 5);
  ctx.fillRect(430, 244, 20, 23);
  ctx.fillStyle = shade(hatColour === '#2c2c34' ? '#454552' : '#8f1f29', 0);
  ctx.fillRect(430, 258, 20, 5);
  // scarf
  ctx.strokeStyle = '#c22e3a'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(440, 290, 11, 0.3, Math.PI - 0.3); ctx.stroke();
  ctx.fillStyle = '#c22e3a';
  ctx.fillRect(448, 292, 7, 18);

  // sled
  if (!A('sled')) {
    ctx.strokeStyle = '#8a3b2e'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(322, 384); ctx.quadraticCurveTo(316, 372, 328, 368);
    ctx.moveTo(330, 386); ctx.lineTo(382, 386);
    ctx.stroke();
    ctx.fillStyle = '#b84a3a';
    ctx.fillRect(328, 372, 52, 6);
    ctx.fillRect(334, 360, 6, 14);
    ctx.fillRect(368, 360, 6, 14);
    ctx.fillStyle = '#d88c5a';
    ctx.fillRect(328, 360, 52, 5);
    ctx.strokeStyle = '#8a3b2e'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(380, 374); ctx.quadraticCurveTo(394, 366, 392, 354); ctx.stroke();
  }

  // footprints from the door
  if (!A('footprints')) {
    ctx.fillStyle = 'rgba(140,165,200,0.55)';
    const prints = [[222, 352], [238, 366], [232, 380], [252, 390], [262, 404], [282, 410], [300, 420]];
    prints.forEach(([x, y], i) => {
      ctx.beginPath();
      ctx.ellipse(x, y, 4.6, 7, i % 2 ? 0.4 : -0.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // woodpile + dog, right
  ctx.fillStyle = '#7a5636';
  for (const [x, y] of [[540, 330], [558, 330], [549, 318], [540, 342], [558, 342], [549, 354]]) {
    circle(ctx, x, y, 8, '#a87c48');
    circle(ctx, x, y, 5, '#c49a62');
    circle(ctx, x, y, 2, '#8a6238');
  }
  if (!A('dog')) {
    ctx.fillStyle = '#b0793f';
    ctx.beginPath(); ctx.ellipse(520, 356, 17, 10, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, 503, 348, 9, '#b0793f');
    ctx.fillStyle = '#8a5c2c';
    ctx.beginPath();
    ctx.moveTo(498, 342); ctx.lineTo(494, 334); ctx.lineTo(502, 338);
    ctx.closePath(); ctx.fill();
    circle(ctx, 500, 347, 1.7, '#241a10');
    ctx.fillStyle = '#241a10';
    ctx.beginPath(); ctx.ellipse(494, 351, 3, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b0793f'; ctx.lineWidth = 4.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(536, 350); ctx.quadraticCurveTo(546, 342, 544, 332); ctx.stroke();
    ctx.fillStyle = '#b0793f';
    ctx.fillRect(508, 362, 5, 10);
    ctx.fillRect(528, 362, 5, 10);
    ctx.fillStyle = '#d84a3a';
    ctx.fillRect(496, 352, 13, 4.6);
  }
  // sparkle drifts
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const [x, y] of [[180, 396], [392, 420], [492, 386], [60, 356], [300, 350]]) {
    sparkle(ctx, x, y, 5, 'rgba(255,255,255,0.9)');
  }
}

function roundRectDoor(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + 10);
  ctx.quadraticCurveTo(x + w / 2, y - 6, x + w, y + 10);
  ctx.lineTo(x + w, y + h);
  ctx.closePath(); ctx.fill();
}
