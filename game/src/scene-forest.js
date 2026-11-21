// scene-forest.js — "Firefly Hollow": a moonlit forest clearing with a
// mushroom ring, a stream, an owl and drifting fireflies.

import { vGrad, glow, softShadow, circle, sparkle, bush, grassTufts } from './canvas-kit.js';
import { shade, withAlpha } from './palette.js';

export const DIFFS = [
  { id: 'moon', x: 498, y: 68, r: 26, label: 'the crescent moon filled out' },
  { id: 'owl', x: 126, y: 118, r: 15, label: 'the owl closed its eyes' },
  { id: 'mushroom-cap', x: 178, y: 322, r: 25, label: 'the big mushroom changed colour' },
  { id: 'fireflies', x: 424, y: 246, r: 22, label: 'a swarm of fireflies vanished' },
  { id: 'lantern', x: 332, y: 148, r: 15, label: 'the hanging lantern went out' },
  { id: 'flower', x: 472, y: 356, r: 17, label: 'the tall foxglove is missing' },
  { id: 'frog', x: 266, y: 388, r: 16, label: 'the frog hopped away' },
  { id: 'star', x: 238, y: 56, r: 13, label: 'the brightest star went out' },
  { id: 'mushroom-small', x: 394, y: 342, r: 15, label: 'a small mushroom is missing' },
  { id: 'berries', x: 66, y: 306, r: 19, label: 'the berries changed colour' },
];

function bigTree(ctx, x, base, h, lean) {
  ctx.fillStyle = '#2c2135';
  ctx.beginPath();
  ctx.moveTo(x - 20, base);
  ctx.quadraticCurveTo(x - 12 + lean, base - h * 0.5, x - 6 + lean, base - h * 0.72);
  ctx.lineTo(x + 10 + lean, base - h * 0.72);
  ctx.quadraticCurveTo(x + 14 + lean, base - h * 0.45, x + 22, base);
  ctx.closePath();
  ctx.fill();
  // branch
  ctx.strokeStyle = '#2c2135';
  ctx.lineWidth = 11;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + lean, base - h * 0.62);
  ctx.quadraticCurveTo(x + 52 + lean, base - h * 0.7, x + 96 + lean, base - h * 0.66);
  ctx.stroke();
  // canopy blobs
  for (const [dx, dy, r] of [[-30, 0.86, 52], [28, 0.9, 58], [0, 0.99, 50], [66, 0.8, 36], [-64, 0.78, 34]]) {
    circle(ctx, x + dx + lean, base - h * dy, r, '#24382c');
  }
  for (const [dx, dy, r] of [[-14, 0.9, 34], [36, 0.94, 30]]) {
    circle(ctx, x + dx + lean, base - h * dy, r, '#2e4a38');
  }
}

function mushroom(ctx, x, y, s, capColour) {
  ctx.fillStyle = '#e8dcc2';
  ctx.beginPath();
  ctx.moveTo(x - 7 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 16 * s, x - 3 * s, y - 20 * s);
  ctx.lineTo(x + 3 * s, y - 20 * s);
  ctx.quadraticCurveTo(x + 5 * s, y - 16 * s, x + 7 * s, y);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = capColour;
  ctx.beginPath();
  ctx.moveTo(x - 20 * s, y - 16 * s);
  ctx.quadraticCurveTo(x, y - 40 * s, x + 20 * s, y - 16 * s);
  ctx.quadraticCurveTo(x, y - 10 * s, x - 20 * s, y - 16 * s);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,250,235,0.85)';
  for (const [dx, dy, r] of [[-9, -24, 2.6], [4, -28, 3.2], [11, -21, 2.2], [-2, -19, 1.8]]) {
    circle(ctx, x + dx * s, y + dy * s, r * s, 'rgba(255,250,235,0.85)');
  }
}

export function paint(ctx, altered) {
  const A = (id) => altered.has(id);

  // night sky
  vGrad(ctx, 0, 0, 600, 450, [[0, '#101c33'], [0.55, '#1d3350'], [1, '#2c4a5e']]);
  // stars
  const stars = [[40, 40], [110, 84], [180, 30], [320, 44], [386, 96], [540, 130], [70, 150], [440, 30], [272, 108], [560, 52]];
  for (const [x, y] of stars) circle(ctx, x, y, 1.6, 'rgba(255,255,240,0.8)');
  if (!A('star')) sparkle(ctx, 238, 56, 11, '#fff6c8');
  sparkle(ctx, 452, 108, 7, 'rgba(255,246,200,0.8)');
  // moon
  glow(ctx, 498, 68, 62, '#ffeeb0', 0.55);
  circle(ctx, 498, 68, 24, '#fdf3c0');
  if (!A('moon')) {
    ctx.fillStyle = '#1a2c47';
    circle(ctx, 488, 60, 21, '#1a2c47');
  } else {
    circle(ctx, 490, 60, 4, 'rgba(190,180,130,0.5)');
    circle(ctx, 506, 78, 3, 'rgba(190,180,130,0.5)');
  }

  // far tree line
  ctx.fillStyle = '#16281f';
  ctx.beginPath();
  ctx.moveTo(0, 268);
  for (let x = 0; x <= 600; x += 40) ctx.lineTo(x + 20, 226 + ((x * 7) % 23));
  ctx.lineTo(600, 268);
  ctx.closePath(); ctx.fill();

  // clearing ground
  vGrad(ctx, 0, 262, 600, 188, [[0, '#2e5238'], [1, '#1d3524']]);
  ctx.fillStyle = 'rgba(240,255,210,0.07)';
  ctx.beginPath();
  ctx.ellipse(310, 330, 210, 52, 0, 0, Math.PI * 2); ctx.fill();

  // stream across the front
  ctx.fillStyle = '#274b63';
  ctx.beginPath();
  ctx.moveTo(0, 450); ctx.lineTo(0, 414);
  ctx.quadraticCurveTo(160, 396, 320, 410);
  ctx.quadraticCurveTo(470, 422, 600, 406);
  ctx.lineTo(600, 450);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(200,230,255,0.5)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  for (const [x, y, w] of [[60, 428, 44], [210, 420, 56], [380, 430, 40], [500, 420, 52]]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  }
  // moon path on the stream
  ctx.strokeStyle = 'rgba(255,240,180,0.55)';
  for (const [x, y, w] of [[478, 424, 26], [488, 434, 20], [470, 414, 18]]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  }

  // framing trees
  bigTree(ctx, 84, 330, 300, -8);
  bigTree(ctx, 540, 322, 268, 10);

  // owl on the left tree's branch
  const ox = 126, oy = 118;
  ctx.fillStyle = '#7a5c40';
  ctx.beginPath(); ctx.ellipse(ox, oy, 15, 19, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(ox - 13, oy - 12); ctx.lineTo(ox - 7, oy - 24); ctx.lineTo(ox - 2, oy - 13);
  ctx.moveTo(ox + 13, oy - 12); ctx.lineTo(ox + 7, oy - 24); ctx.lineTo(ox + 2, oy - 13);
  ctx.closePath(); ctx.fill();
  circle(ctx, ox - 6, oy - 4, 6.4, '#efe3c8');
  circle(ctx, ox + 6, oy - 4, 6.4, '#efe3c8');
  if (A('owl')) {
    ctx.strokeStyle = '#3a2a1c'; ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(ox - 10, oy - 4); ctx.lineTo(ox - 2, oy - 4);
    ctx.moveTo(ox + 2, oy - 4); ctx.lineTo(ox + 10, oy - 4);
    ctx.stroke();
  } else {
    circle(ctx, ox - 6, oy - 4, 3, '#241a10');
    circle(ctx, ox + 6, oy - 4, 3, '#241a10');
  }
  ctx.fillStyle = '#e8a33c';
  ctx.beginPath();
  ctx.moveTo(ox - 2.6, oy + 1); ctx.lineTo(ox + 2.6, oy + 1); ctx.lineTo(ox, oy + 5);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a8845c';
  ctx.beginPath(); ctx.ellipse(ox, oy + 10, 8, 9, 0, 0, Math.PI * 2); ctx.fill();

  // hanging lantern, strung on a rope between the two trees
  ctx.strokeStyle = '#14100c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(84, 108); ctx.quadraticCurveTo(300, 152, 560, 100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(332, 128); ctx.lineTo(332, 138); ctx.stroke();
  if (!A('lantern')) glow(ctx, 332, 150, 30, '#ffc46a', 0.8);
  ctx.fillStyle = '#241d16';
  ctx.fillRect(324, 138, 16, 4);
  ctx.fillStyle = A('lantern') ? '#4c4438' : '#ffca6a';
  ctx.fillRect(325, 142, 14, 15);
  ctx.fillStyle = '#241d16';
  ctx.fillRect(324, 157, 16, 4);

  // mushroom ring
  softShadow(ctx, 178, 356, 34, 7, 0.25);
  mushroom(ctx, 178, 352, 1.35, A('mushroom-cap') ? '#7a4fd0' : '#d23b2e');
  mushroom(ctx, 128, 366, 0.8, '#d23b2e');
  mushroom(ctx, 232, 368, 0.65, '#e07840');
  if (!A('mushroom-small')) mushroom(ctx, 394, 360, 0.7, '#d23b2e');
  mushroom(ctx, 428, 372, 0.5, '#e07840');

  // berry bush, left
  bush(ctx, 66, 330, 90, '#2e5238');
  const berryColour = A('berries') ? '#4f7fe0' : '#e04a5a';
  for (const [dx, dy] of [[-22, -18], [4, -26], [24, -14], [-6, -8], [16, -30]]) {
    circle(ctx, 66 + dx, 330 + dy, 4.6, berryColour);
    circle(ctx, 66 + dx - 1.4, 330 + dy - 1.4, 1.5, 'rgba(255,255,255,0.5)');
  }

  // foxglove, right
  if (!A('flower')) {
    ctx.strokeStyle = '#3f7046'; ctx.lineWidth = 3.4;
    ctx.beginPath(); ctx.moveTo(472, 392); ctx.quadraticCurveTo(468, 356, 472, 330); ctx.stroke();
    for (const [y, s] of [[338, 8], [350, 9.5], [364, 10.5], [378, 11]]) {
      circle(ctx, 472, y, s, '#e88cc0');
      circle(ctx, 472, y, s * 0.55, '#f7c4de');
    }
    circle(ctx, 472, 326, 5.5, '#e88cc0');
  }
  // other flowers
  for (const [x, y, c] of [[300, 384, '#f2d06b'], [318, 392, '#e88cc0'], [96, 396, '#f2d06b'], [520, 388, '#b48ce8'], [548, 396, '#f2d06b']]) {
    ctx.strokeStyle = '#3f7046'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, y); ctx.stroke();
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      circle(ctx, x + Math.cos(a) * 4, y + Math.sin(a) * 4, 3.2, c);
    }
    circle(ctx, x, y, 2.4, '#fff3c4');
  }

  // flat stone + frog
  ctx.fillStyle = '#5c665e';
  ctx.beginPath(); ctx.ellipse(266, 398, 30, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = shade('#5c665e', 0.16);
  ctx.beginPath(); ctx.ellipse(262, 395, 22, 6, 0, 0, Math.PI * 2); ctx.fill();
  if (!A('frog')) {
    ctx.fillStyle = '#5aa24f';
    ctx.beginPath(); ctx.ellipse(266, 388, 13, 9, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, 258, 380, 4.6, '#5aa24f');
    circle(ctx, 274, 380, 4.6, '#5aa24f');
    circle(ctx, 258, 380, 2.2, '#14240f');
    circle(ctx, 274, 380, 2.2, '#14240f');
    ctx.fillStyle = '#8fce7f';
    ctx.beginPath(); ctx.ellipse(266, 392, 8, 4.6, 0, 0, Math.PI * 2); ctx.fill();
  }

  // ferns + grass
  grassTufts(ctx, [140, 210, 350, 470, 60, 560], 402, '#3f7046');
  grassTufts(ctx, [250, 420, 520], 380, '#35603c');

  // fireflies
  const flies = [[150, 210, 2.4], [210, 250, 2], [268, 196, 2.6], [356, 226, 2], [470, 190, 2.4], [520, 250, 2], [110, 270, 1.8], [300, 286, 2]];
  for (const [x, y, r] of flies) {
    glow(ctx, x, y, 12, '#ffe97a', 0.5);
    circle(ctx, x, y, r, '#ffef9a');
  }
  if (!A('fireflies')) {
    for (const [x, y, r] of [[424, 246, 2.6], [410, 232, 2], [440, 260, 2.2], [418, 262, 1.8]]) {
      glow(ctx, x, y, 13, '#ffe97a', 0.55);
      circle(ctx, x, y, r, '#ffef9a');
    }
  }
  ctx.fillStyle = withAlpha('#0a1420', 0.1);
  ctx.fillRect(0, 0, 600, 450);
}
