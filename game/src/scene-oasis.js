// scene-oasis.js — "Mirage Oasis": dunes, a palm grove, a striped tent, a
// camel and a still blue pool at the hottest hour of the day.

import { vGrad, glow, softShadow, circle, sparkle } from './canvas-kit.js';
import { shade } from './palette.js';

export const DIFFS = [
  { id: 'sun', x: 508, y: 78, r: 29, label: 'the sun changed colour' },
  { id: 'saddle', x: 148, y: 278, r: 21, label: "the camel's blanket changed colour" },
  { id: 'dates', x: 421, y: 186, r: 15, label: 'a bunch of dates is missing' },
  { id: 'tent-flag', x: 260, y: 192, r: 13, label: 'the tent flag is missing' },
  { id: 'pot', x: 406, y: 336, r: 15, label: 'a pot is missing' },
  { id: 'cactus-flower', x: 64, y: 236, r: 13, label: 'the cactus flower is gone' },
  { id: 'ibis', x: 350, y: 382, r: 16, label: 'the ibis flew away' },
  { id: 'rug', x: 254, y: 354, r: 23, label: 'the rug changed colour' },
  { id: 'palm-small', x: 544, y: 258, r: 21, label: 'the young palm is missing' },
  { id: 'skull', x: 108, y: 406, r: 17, label: 'the old skull is missing' },
];

function palm(ctx, x, base, h, lean, withDates, A) {
  // curved trunk with ring marks
  ctx.strokeStyle = '#9a744a';
  ctx.lineWidth = 11;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.quadraticCurveTo(x + lean * 0.3, base - h * 0.55, x + lean, base - h);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(90,60,30,0.5)';
  ctx.lineWidth = 2;
  for (let i = 1; i < 6; i++) {
    const t = i / 6;
    const px = x + lean * 0.3 * 2 * t * (1 - t) + lean * t * t;
    const py = base - h * t;
    ctx.beginPath(); ctx.moveTo(px - 6, py); ctx.lineTo(px + 6, py - 2); ctx.stroke();
  }
  const tx = x + lean, ty = base - h;
  // fronds
  ctx.strokeStyle = '#3f7d3a';
  ctx.lineWidth = 5;
  const fronds = [[-64, -26], [-40, -40], [-8, -48], [28, -44], [58, -28], [70, -6], [-72, -2]];
  for (const [dx, dy] of fronds) {
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + dx * 0.6, ty + dy - 12, tx + dx, ty + dy + 14);
    ctx.stroke();
  }
  ctx.strokeStyle = '#54914e';
  ctx.lineWidth = 3;
  for (const [dx, dy] of fronds) {
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + dx * 0.6, ty + dy - 8, tx + dx * 0.92, ty + dy + 12);
    ctx.stroke();
  }
  // coconuts / dates at the crown
  circle(ctx, tx - 6, ty + 8, 6, '#7a5a30');
  circle(ctx, tx + 7, ty + 9, 5.4, '#7a5a30');
  if (withDates && !A('dates')) {
    for (const [dx, dy] of [[-16, 12], [-12, 20], [-19, 21], [-15, 28]]) {
      circle(ctx, tx + dx, ty + dy, 4.2, '#e8a33c');
    }
  }
}

function pot(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x - 8 * s, y - 16 * s);
  ctx.lineTo(x + 8 * s, y - 16 * s);
  ctx.quadraticCurveTo(x + 13 * s, y - 4 * s, x + 9 * s, y + 8 * s);
  ctx.quadraticCurveTo(x, y + 13 * s, x - 9 * s, y + 8 * s);
  ctx.quadraticCurveTo(x - 13 * s, y - 4 * s, x - 8 * s, y - 16 * s);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(colour === '#b85c38' ? '#8f4526' : '#38618c', 0);
  ctx.fillRect(x - 9 * s, y - 18 * s, 18 * s, 4 * s);
}

export function paint(ctx, altered) {
  const A = (id) => altered.has(id);

  // hot sky
  vGrad(ctx, 0, 0, 600, 260, [[0, '#7ec8e8'], [0.55, '#bfe3ee'], [1, '#f7e3ae']]);
  glow(ctx, 508, 78, 84, '#ffdf7a', 0.75);
  circle(ctx, 508, 78, 29, A('sun') ? '#ff7847' : '#ffdf6b');
  circle(ctx, 508, 78, 23, A('sun') ? '#ff9060' : '#ffe98f');
  // heat birds, far off
  ctx.strokeStyle = 'rgba(70,60,50,0.7)'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
  for (const [x, y, s] of [[120, 70, 0.8], [160, 88, 0.6], [86, 96, 0.55]]) {
    ctx.beginPath();
    ctx.arc(x - 6 * s, y, 6 * s, Math.PI * 1.15, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 6 * s, y, 6 * s, Math.PI * 1.1, Math.PI * 1.85);
    ctx.stroke();
  }

  // dune layers
  ctx.fillStyle = '#eec27f';
  ctx.beginPath();
  ctx.moveTo(0, 210);
  ctx.quadraticCurveTo(180, 158, 380, 196);
  ctx.quadraticCurveTo(500, 216, 600, 196);
  ctx.lineTo(600, 450); ctx.lineTo(0, 450);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e5b96e';
  ctx.beginPath();
  ctx.moveTo(0, 268);
  ctx.quadraticCurveTo(220, 224, 430, 262);
  ctx.quadraticCurveTo(530, 280, 600, 262);
  ctx.lineTo(600, 450); ctx.lineTo(0, 450);
  ctx.closePath(); ctx.fill();
  // dune crest highlights + wind ripples
  ctx.strokeStyle = 'rgba(255,240,200,0.8)'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(0, 268); ctx.quadraticCurveTo(220, 224, 430, 262); ctx.stroke();
  ctx.strokeStyle = 'rgba(180,130,70,0.4)'; ctx.lineWidth = 1.6;
  for (const [x, y, w] of [[80, 300, 52], [300, 286, 64], [470, 306, 48], [150, 340, 58], [520, 350, 44]]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + w / 2, y - 5, x + w, y); ctx.stroke();
  }

  // oasis pool
  ctx.fillStyle = '#57b6c9';
  ctx.beginPath(); ctx.ellipse(438, 402, 128, 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#79c9d8';
  ctx.beginPath(); ctx.ellipse(438, 398, 108, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 2;
  for (const [x, y, w] of [[380, 394, 40], [452, 406, 52], [400, 412, 30]]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  }
  // grass rim
  ctx.strokeStyle = '#4f8f3f'; ctx.lineWidth = 2.4;
  for (let x = 322; x < 560; x += 13) {
    ctx.beginPath();
    ctx.moveTo(x, 388);
    ctx.quadraticCurveTo(x + 2, 376, x + 6, 372);
    ctx.stroke();
  }

  // palms
  palm(ctx, 470, 386, 218, -34, true, A);
  palm(ctx, 398, 378, 168, 22, false, A);
  palm(ctx, 96, 330, 150, 26, false, A);
  if (!A('palm-small')) palm(ctx, 544, 330, 92, -12, false, A);
  softShadow(ctx, 470, 390, 44, 7, 0.18);
  softShadow(ctx, 96, 334, 34, 6, 0.18);

  // tent, centre-left
  softShadow(ctx, 258, 330, 96, 9, 0.2);
  ctx.fillStyle = '#e8dcc2';
  ctx.beginPath();
  ctx.moveTo(168, 328); ctx.lineTo(260, 208); ctx.lineTo(352, 328);
  ctx.closePath(); ctx.fill();
  // stripes
  ctx.fillStyle = '#c8452c';
  for (const t of [0.22, 0.5, 0.78]) {
    const y = 208 + (328 - 208) * t;
    const half = 92 * t;
    ctx.beginPath();
    ctx.moveTo(260 - half, y); ctx.lineTo(260 + half, y);
    ctx.lineTo(260 + half * 0.86, y + 16); ctx.lineTo(260 - half * 0.86, y + 16);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8dcc2';
  }
  // shading on the right face
  ctx.fillStyle = 'rgba(120,70,30,0.16)';
  ctx.beginPath();
  ctx.moveTo(260, 208); ctx.lineTo(352, 328); ctx.lineTo(260, 328);
  ctx.closePath(); ctx.fill();
  // door flap
  ctx.fillStyle = '#7a4a28';
  ctx.beginPath();
  ctx.moveTo(238, 328); ctx.lineTo(260, 272); ctx.lineTo(282, 328);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5d3820';
  ctx.beginPath();
  ctx.moveTo(260, 272); ctx.lineTo(282, 328); ctx.lineTo(260, 328);
  ctx.closePath(); ctx.fill();
  // pole + flag
  ctx.strokeStyle = '#7a4a28'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(260, 208); ctx.lineTo(260, 184); ctx.stroke();
  if (!A('tent-flag')) {
    ctx.fillStyle = '#2f8f6e';
    ctx.beginPath();
    ctx.moveTo(260, 184); ctx.lineTo(282, 189); ctx.lineTo(260, 195);
    ctx.closePath(); ctx.fill();
  }
  // guy ropes
  ctx.strokeStyle = 'rgba(90,60,30,0.6)'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(176, 318); ctx.lineTo(138, 336);
  ctx.moveTo(344, 318); ctx.lineTo(382, 336);
  ctx.stroke();

  // rug in front of the tent
  const rugColour = A('rug') ? '#2f7d8f' : '#b83a4a';
  ctx.fillStyle = rugColour;
  ctx.beginPath();
  ctx.moveTo(206, 342); ctx.lineTo(302, 342); ctx.lineTo(314, 368); ctx.lineTo(194, 368);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#f2d06b'; ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(216, 348); ctx.lineTo(292, 348);
  ctx.moveTo(212, 356); ctx.lineTo(296, 356);
  ctx.moveTo(208, 363); ctx.lineTo(300, 363);
  ctx.stroke();
  // pots by the tent
  pot(ctx, 372, 344, 1, '#b85c38');
  pot(ctx, 388, 348, 0.8, '#38618c');
  if (!A('pot')) pot(ctx, 406, 344, 0.92, '#b85c38');

  // camel, left
  softShadow(ctx, 148, 330, 62, 8, 0.2);
  ctx.strokeStyle = '#c49a62'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (const x of [122, 138, 162, 176]) {
    ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, 330); ctx.stroke();
  }
  ctx.fillStyle = '#d9b078';
  ctx.beginPath(); ctx.ellipse(148, 282, 46, 24, 0, 0, Math.PI * 2); ctx.fill();
  // hump
  ctx.beginPath(); ctx.ellipse(140, 258, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
  // neck + head
  ctx.strokeStyle = '#d9b078'; ctx.lineWidth = 13;
  ctx.beginPath(); ctx.moveTo(186, 268); ctx.quadraticCurveTo(204, 250, 202, 230); ctx.stroke();
  ctx.fillStyle = '#d9b078';
  ctx.beginPath(); ctx.ellipse(206, 226, 13, 8, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(196, 220); ctx.lineTo(192, 208); ctx.lineTo(200, 214);
  ctx.closePath(); ctx.fill();
  circle(ctx, 202, 224, 1.9, '#3a2a16');
  ctx.strokeStyle = '#8a5c2c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(212, 230); ctx.lineTo(200, 244); ctx.stroke();
  // tail
  ctx.strokeStyle = '#c49a62'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(103, 272); ctx.quadraticCurveTo(94, 286, 98, 300); ctx.stroke();
  // saddle blanket
  ctx.fillStyle = A('saddle') ? '#38618c' : '#c22e3a';
  ctx.beginPath();
  ctx.moveTo(124, 258); ctx.lineTo(158, 258); ctx.lineTo(162, 284); ctx.lineTo(120, 284);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#f2d06b'; ctx.lineWidth = 2.2;
  ctx.strokeRect(127, 261, 30, 20);
  // saddle seat
  ctx.fillStyle = '#7a4a28';
  ctx.fillRect(132, 248, 18, 8);

  // ibis at the pool edge
  if (!A('ibis')) {
    ctx.strokeStyle = '#3a3a42'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(348, 388); ctx.lineTo(348, 400); ctx.stroke();
    ctx.fillStyle = '#f4f6f8';
    ctx.beginPath(); ctx.ellipse(350, 382, 11, 7, -0.2, 0, Math.PI * 2); ctx.fill();
    circle(ctx, 360, 377, 4.6, '#f4f6f8');
    ctx.strokeStyle = '#2c2c33'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(363, 378); ctx.quadraticCurveTo(370, 382, 368, 388); ctx.stroke();
    circle(ctx, 360, 376, 1.2, '#2c2c33');
  }

  // cactus, far left
  ctx.fillStyle = '#3f7d4a';
  ctx.fillRect(56, 244, 17, 74);
  ctx.beginPath(); ctx.ellipse(64.5, 244, 8.5, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(38, 262, 10, 34);
  ctx.beginPath(); ctx.ellipse(43, 262, 5, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(38, 288, 26, 9);
  ctx.fillRect(82, 256, 10, 30);
  ctx.beginPath(); ctx.ellipse(87, 256, 5, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(66, 278, 26, 9);
  ctx.fillStyle = shade('#3f7d4a', 0.18);
  ctx.fillRect(60, 246, 4, 70);
  if (!A('cactus-flower')) {
    for (let p = 0; p < 6; p++) {
      const a = (p / 6) * Math.PI * 2;
      circle(ctx, 64 + Math.cos(a) * 5, 236 + Math.sin(a) * 5, 3.6, '#e88cc0');
    }
    circle(ctx, 64, 236, 3, '#f2d06b');
  }

  // old skull in the sand
  if (!A('skull')) {
    ctx.fillStyle = '#efe6d0';
    ctx.beginPath(); ctx.ellipse(108, 404, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(99, 408, 18, 8);
    circle(ctx, 101, 402, 3.6, '#5a4a34');
    circle(ctx, 114, 402, 3.6, '#5a4a34');
    ctx.fillStyle = '#5a4a34';
    ctx.fillRect(105, 411, 2.4, 5);
    ctx.fillRect(111, 411, 2.4, 5);
    // horns
    ctx.strokeStyle = '#e2d6ba'; ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(94, 400); ctx.quadraticCurveTo(84, 392, 88, 384);
    ctx.moveTo(122, 400); ctx.quadraticCurveTo(132, 392, 128, 384);
    ctx.stroke();
  }

  // foreground sand shading
  vGrad(ctx, 0, 416, 600, 34, [[0, 'rgba(190,140,70,0)'], [1, 'rgba(190,140,70,0.35)']]);
  sparkle(ctx, 210, 420, 6, 'rgba(255,250,220,0.9)');
  sparkle(ctx, 560, 428, 5, 'rgba(255,250,220,0.8)');
}
