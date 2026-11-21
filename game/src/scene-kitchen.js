// scene-kitchen.js — "Hearthside Kitchen": a warm cottage kitchen with a
// stove, a shelf of jars, a wall clock, bunting and a cat asleep by the table.

import { vGrad, hGrad, glow, softShadow, circle, roundRect, roundRectPath } from './canvas-kit.js';
import { shade } from './palette.js';

export const DIFFS = [
  { id: 'clock', x: 482, y: 92, r: 25, label: 'the clock shows a different time' },
  { id: 'kettle', x: 152, y: 236, r: 23, label: 'the kettle changed colour' },
  { id: 'cat-tail', x: 452, y: 360, r: 18, label: "the cat's tail moved" },
  { id: 'jar', x: 252, y: 118, r: 15, label: 'a jar is missing from the shelf' },
  { id: 'curtain', x: 54, y: 152, r: 15, label: 'the curtain changed colour' },
  { id: 'moon', x: 106, y: 82, r: 15, label: 'the moon left the window' },
  { id: 'bunting', x: 306, y: 58, r: 17, label: 'a bunting flag is missing' },
  { id: 'teapot', x: 302, y: 292, r: 21, label: 'the teapot is missing' },
  { id: 'herbs', x: 542, y: 178, r: 15, label: 'the herb bundle is missing' },
  { id: 'orange', x: 402, y: 308, r: 14, label: 'an orange is missing from the bowl' },
];

function jar(ctx, x, y, w, h, fill, lid) {
  roundRect(ctx, x, y, w, h, 4, 'rgba(230,240,245,0.5)');
  roundRect(ctx, x + 2, y + 8, w - 4, h - 10, 3, fill);
  roundRect(ctx, x - 1, y - 5, w + 2, 8, 2, lid);
}

export function paint(ctx, altered) {
  const A = (id) => altered.has(id);

  // wall + wainscot + floor
  vGrad(ctx, 0, 0, 600, 336, [[0, '#e8b07e'], [1, '#df9f66']]);
  ctx.fillStyle = '#b3793f';
  ctx.fillRect(0, 300, 600, 36);
  ctx.strokeStyle = 'rgba(90,55,25,0.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 318); ctx.lineTo(600, 318); ctx.stroke();
  vGrad(ctx, 0, 336, 600, 114, [[0, '#9c6a3d'], [1, '#7c522c']]);
  ctx.strokeStyle = 'rgba(60,38,16,0.45)'; ctx.lineWidth = 2;
  for (let x = 20; x < 600; x += 74) {
    ctx.beginPath(); ctx.moveTo(x, 338); ctx.lineTo(x - 14, 450); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(0, 392); ctx.lineTo(600, 392); ctx.stroke();

  // window, left: night outside
  roundRect(ctx, 30, 40, 132, 158, 6, '#7a4a28');
  roundRect(ctx, 38, 48, 116, 142, 4, '#1d2c4e');
  vGrad(ctx, 38, 48, 116, 142, [[0, '#1d2c4e'], [1, '#33507e']]);
  for (const [x, y] of [[58, 66], [84, 120], [130, 58], [140, 140], [52, 160]]) {
    circle(ctx, x, y, 1.6, 'rgba(255,255,240,0.85)');
  }
  if (!A('moon')) {
    glow(ctx, 106, 82, 26, '#ffeeb0', 0.6);
    circle(ctx, 106, 82, 13, '#fdf3c0');
    circle(ctx, 101, 78, 10.5, '#33507e');
    ctx.fillStyle = '#33507e';
    ctx.fillRect(96, 66, 22, 8);
    circle(ctx, 101, 78, 10.5, '#2a4470');
  }
  // snowy hill through the glass
  ctx.fillStyle = '#48679c';
  ctx.beginPath();
  ctx.moveTo(38, 190); ctx.quadraticCurveTo(90, 156, 154, 178); ctx.lineTo(154, 190);
  ctx.closePath(); ctx.fill();
  // frame cross + sill
  ctx.fillStyle = '#7a4a28';
  ctx.fillRect(92, 48, 7, 142);
  ctx.fillRect(38, 112, 116, 7);
  roundRect(ctx, 24, 196, 144, 10, 3, '#8a5732');
  // curtains
  const curtainColour = A('curtain') ? '#4f7d4a' : '#b8433a';
  for (const side of [0, 1]) {
    const x = side === 0 ? 34 : 128;
    ctx.fillStyle = curtainColour;
    ctx.beginPath();
    ctx.moveTo(x, 44);
    ctx.quadraticCurveTo(x + (side === 0 ? 16 : -16), 110, x + (side === 0 ? 8 : -8), 168);
    ctx.lineTo(x + (side === 0 ? 26 : -26), 168);
    ctx.quadraticCurveTo(x + (side === 0 ? 20 : -20), 110, x + (side === 0 ? 26 : -26), 44);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = shade(curtainColour === '#b8433a' ? '#8f3129' : '#3c6339', 0);
    ctx.fillRect(x + (side === 0 ? 2 : 16), 44, 6, 124);
  }
  ctx.fillStyle = '#5f3a1e';
  ctx.fillRect(26, 36, 140, 7);

  // bunting across the top
  ctx.strokeStyle = 'rgba(90,55,25,0.65)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(176, 26); ctx.quadraticCurveTo(360, 74, 548, 22); ctx.stroke();
  const flagCols = ['#d84a5a', '#f2b04a', '#4f9e57', '#4f7fd0', '#b48ce8', '#e88cc0'];
  const flagPos = [[212, 40], [258, 50], [306, 56], [354, 56], [402, 50], [450, 40]];
  flagPos.forEach(([x, y], i) => {
    if (A('bunting') && i === 2) return;
    ctx.fillStyle = flagCols[i];
    ctx.beginPath();
    ctx.moveTo(x - 11, y); ctx.lineTo(x + 11, y); ctx.lineTo(x, y + 20);
    ctx.closePath(); ctx.fill();
  });

  // pendant lamp
  ctx.strokeStyle = '#4a3423'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(330, 0); ctx.lineTo(330, 44); ctx.stroke();
  glow(ctx, 330, 84, 46, '#ffd98a', 0.65);
  ctx.fillStyle = '#38618c';
  ctx.beginPath();
  ctx.moveTo(302, 76); ctx.quadraticCurveTo(330, 40, 358, 76);
  ctx.closePath(); ctx.fill();
  circle(ctx, 330, 82, 9, '#ffe1a0');

  // shelf with jars
  roundRect(ctx, 206, 138, 168, 9, 3, '#8a5732');
  ctx.fillStyle = '#6e4525';
  ctx.beginPath();
  ctx.moveTo(222, 147); ctx.lineTo(234, 147); ctx.lineTo(228, 160);
  ctx.moveTo(346, 147); ctx.lineTo(358, 147); ctx.lineTo(352, 160);
  ctx.closePath(); ctx.fill();
  jar(ctx, 216, 104, 26, 34, '#c8452c', '#7a4a28');
  if (!A('jar')) jar(ctx, 250, 110, 22, 28, '#e8a33c', '#7a4a28');
  jar(ctx, 282, 100, 28, 38, '#5d8a4a', '#7a4a28');
  jar(ctx, 320, 108, 24, 30, '#8a5aa0', '#7a4a28');
  // plates under the shelf
  for (const x of [238, 292, 348]) {
    circle(ctx, x, 178, 17, '#f3ead8');
    ring2(ctx, x, 178, 12, '#b8433a');
  }

  // wall clock
  circle(ctx, 482, 92, 30, '#7a4a28');
  circle(ctx, 482, 92, 25, '#f7efdc');
  ctx.fillStyle = '#4a3423';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    circle(ctx, 482 + Math.cos(a) * 20, 92 + Math.sin(a) * 20, i % 3 === 0 ? 2 : 1.2, '#4a3423');
  }
  ctx.strokeStyle = '#33241a'; ctx.lineCap = 'round';
  ctx.lineWidth = 3.4;
  if (A('clock')) {
    // half past six: hour hand past the six, minute hand on the six
    ctx.beginPath(); ctx.moveTo(482, 92); ctx.lineTo(490, 106); ctx.stroke();
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(482, 92); ctx.lineTo(482, 110); ctx.stroke();
  } else {
    // three o'clock sharp
    ctx.beginPath(); ctx.moveTo(482, 92); ctx.lineTo(498, 92); ctx.stroke();
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(482, 92); ctx.lineTo(482, 74); ctx.stroke();
  }
  circle(ctx, 482, 92, 3, '#b8433a');

  // stove, left-centre
  softShadow(ctx, 152, 344, 78, 9, 0.25);
  roundRect(ctx, 96, 258, 112, 84, 8, '#3e3a44');
  roundRect(ctx, 96, 258, 112, 12, 6, '#55505e');
  roundRect(ctx, 118, 288, 68, 44, 6, '#2a2730');
  roundRect(ctx, 124, 294, 56, 32, 4, '#17141c');
  glow(ctx, 152, 310, 24, '#ff8c42', 0.55);
  ctx.fillStyle = '#ff9a4d';
  ctx.beginPath();
  ctx.moveTo(138, 322); ctx.quadraticCurveTo(146, 300, 152, 322);
  ctx.quadraticCurveTo(158, 300, 166, 322);
  ctx.quadraticCurveTo(152, 330, 138, 322);
  ctx.closePath(); ctx.fill();
  circle(ctx, 110, 278, 4, '#c9c2d4');
  circle(ctx, 194, 278, 4, '#c9c2d4');
  // kettle on top
  const kettleColour = A('kettle') ? '#38618c' : '#b87333';
  ctx.strokeStyle = 'rgba(240,240,240,0.75)'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(140, 214); ctx.quadraticCurveTo(136, 202, 142, 196);
  ctx.moveTo(152, 212); ctx.quadraticCurveTo(152, 198, 158, 194);
  ctx.moveTo(164, 214); ctx.quadraticCurveTo(168, 202, 162, 196);
  ctx.stroke();
  ctx.fillStyle = kettleColour;
  ctx.beginPath();
  ctx.moveTo(124, 258); ctx.quadraticCurveTo(122, 226, 140, 220);
  ctx.lineTo(164, 220); ctx.quadraticCurveTo(182, 226, 180, 258);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(kettleColour === '#b87333' ? '#96581f' : '#2a4a6e', 0);
  ctx.fillRect(124, 250, 56, 8);
  ctx.fillStyle = '#2e2a33';
  ctx.beginPath();
  ctx.moveTo(178, 236); ctx.lineTo(194, 230); ctx.lineTo(196, 238); ctx.lineTo(180, 244);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2e2a33'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(152, 224, 17, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  circle(ctx, 152, 219, 4.4, '#2e2a33');

  // table, centre-right
  softShadow(ctx, 352, 372, 118, 10, 0.22);
  roundRect(ctx, 238, 306, 228, 13, 5, '#8a5732');
  ctx.fillStyle = '#75502c';
  ctx.fillRect(252, 319, 12, 52);
  ctx.fillRect(440, 319, 12, 52);
  ctx.fillRect(252, 352, 200, 8);
  // tablecloth runner
  ctx.fillStyle = '#b8433a';
  ctx.fillRect(238, 306, 228, 5);
  // teapot
  if (!A('teapot')) {
    ctx.fillStyle = '#4f7d6a';
    ctx.beginPath(); ctx.ellipse(302, 294, 24, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(278, 290); ctx.lineTo(264, 282); ctx.lineTo(266, 296); ctx.lineTo(279, 300);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#4f7d6a'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(326, 292, 10, -1.1, 1.2); ctx.stroke();
    circle(ctx, 302, 276, 5, '#3c6355');
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(294, 288, 7, 4.5, -0.5, 0, Math.PI * 2); ctx.fill();
  }
  // cups
  for (const x of [352, 384]) {
    roundRect(ctx, x, 292, 20, 13, 3, '#f3ead8');
    ctx.strokeStyle = '#d8cbb2'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x + 22, 298, 5, -1.2, 1.2); ctx.stroke();
    ctx.strokeStyle = 'rgba(240,240,240,0.7)'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(x + 5, 288); ctx.quadraticCurveTo(x + 8, 280, x + 13, 288); ctx.stroke();
  }
  // fruit bowl
  ctx.fillStyle = '#38618c';
  ctx.beginPath();
  ctx.moveTo(372, 312); ctx.lineTo(428, 312); ctx.quadraticCurveTo(420, 330, 400, 330);
  ctx.quadraticCurveTo(380, 330, 372, 312);
  ctx.closePath(); ctx.fill();
  circle(ctx, 386, 306, 10, '#d84a3a');
  circle(ctx, 400, 300, 10, '#e8a33c');
  if (!A('orange')) circle(ctx, 414, 307, 9.5, '#f08c2e');
  circle(ctx, 392, 296, 9, '#8fbf4d');
  ctx.fillStyle = '#5d8a4a';
  ctx.beginPath(); ctx.ellipse(400, 289, 5, 2.6, 0.4, 0, Math.PI * 2); ctx.fill();

  // hanging herbs, right
  ctx.strokeStyle = '#5f3a1e'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(542, 128); ctx.lineTo(542, 150); ctx.stroke();
  if (!A('herbs')) {
    ctx.fillStyle = '#4f7d4a';
    for (const [dx, dy, r] of [[0, 162, 13], [-9, 176, 11], [9, 178, 11], [0, 188, 10]]) {
      circle(ctx, 542 + dx, dy, r, '#4f7d4a');
    }
    circle(ctx, 538, 160, 7, '#65945e');
    ctx.strokeStyle = '#7a4a28'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(530, 150); ctx.lineTo(554, 150); ctx.stroke();
  }
  // hanging pans
  ctx.strokeStyle = '#5f3a1e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(500, 128); ctx.lineTo(500, 148); ctx.stroke();
  circle(ctx, 500, 162, 14, '#8f8a94');
  circle(ctx, 500, 162, 10, '#a9a3b0');
  ctx.fillRect(497, 132, 6, 8);

  // rug + cat
  ctx.fillStyle = '#a03d4e';
  ctx.beginPath(); ctx.ellipse(452, 386, 86, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#b84a5c';
  ctx.beginPath(); ctx.ellipse(452, 384, 64, 16, 0, 0, Math.PI * 2); ctx.fill();
  // cat body, curled
  ctx.fillStyle = '#e08e45';
  ctx.beginPath(); ctx.ellipse(446, 372, 30, 15, 0, 0, Math.PI * 2); ctx.fill();
  circle(ctx, 424, 362, 13, '#e08e45');
  ctx.fillStyle = '#e08e45';
  ctx.beginPath();
  ctx.moveTo(415, 354); ctx.lineTo(413, 344); ctx.lineTo(421, 350);
  ctx.moveTo(433, 354); ctx.lineTo(435, 344); ctx.lineTo(427, 350);
  ctx.closePath(); ctx.fill();
  circle(ctx, 420, 361, 1.8, '#5a3423');
  circle(ctx, 429, 361, 1.8, '#5a3423');
  ctx.strokeStyle = '#5a3423'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(422, 367); ctx.quadraticCurveTo(424.5, 369, 427, 367); ctx.stroke();
  ctx.fillStyle = '#c9742f';
  for (const dx of [-14, -4, 8, 18]) {
    ctx.beginPath(); ctx.ellipse(446 + dx, 366, 3.4, 7, 0.4, 0, Math.PI * 2); ctx.fill();
  }
  // the tail: curled up in the left picture, flat in the right
  ctx.strokeStyle = '#e08e45'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath();
  if (A('cat-tail')) {
    ctx.moveTo(474, 376); ctx.quadraticCurveTo(492, 378, 496, 368);
  } else {
    ctx.moveTo(474, 372); ctx.quadraticCurveTo(490, 356, 484, 344);
  }
  ctx.stroke();
  ctx.strokeStyle = '#c9742f'; ctx.lineWidth = 7;
  ctx.beginPath();
  if (A('cat-tail')) {
    ctx.moveTo(490, 376); ctx.lineTo(496, 368);
  } else {
    ctx.moveTo(486, 350); ctx.lineTo(484, 344);
  }
  ctx.stroke();
}

function ring2(ctx, x, y, r, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}
