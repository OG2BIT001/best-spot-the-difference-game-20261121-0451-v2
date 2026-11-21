// scene-harbour.js — "Sunset Harbour": a lighthouse, sailboats and a stone
// quay under a peach sunset. paint(ctx, altered) draws the left picture when
// `altered` is empty and the right picture with each difference in it applied.

import { vGrad, glow, softShadow, circle, cloud, gull, roundRect } from './canvas-kit.js';
import { shade, withAlpha } from './palette.js';

export const DIFFS = [
  { id: 'sun', x: 428, y: 118, r: 30, label: 'the sun changed colour' },
  { id: 'lamp', x: 508, y: 96, r: 17, label: 'the lighthouse lamp went out' },
  { id: 'flag', x: 512, y: 48, r: 13, label: 'the flag changed colour' },
  { id: 'sail', x: 208, y: 232, r: 30, label: 'the big sail changed colour' },
  { id: 'gull', x: 148, y: 88, r: 17, label: 'a gull flew away' },
  { id: 'buoy', x: 332, y: 336, r: 15, label: 'the buoy is missing' },
  { id: 'cottage-window', x: 66, y: 208, r: 13, label: 'the cottage window went dark' },
  { id: 'crates', x: 123, y: 353, r: 21, label: 'a crate is missing' },
  { id: 'lantern', x: 50, y: 314, r: 15, label: 'the quay lantern went out' },
  { id: 'cloudlet', x: 306, y: 66, r: 25, label: 'a small cloud vanished' },
];

function lighthouse(ctx, A) {
  const x = 508;
  // rocky point
  ctx.fillStyle = '#5d5468';
  ctx.beginPath();
  ctx.moveTo(448, 300); ctx.lineTo(470, 268); ctx.lineTo(520, 258); ctx.lineTo(560, 274); ctx.lineTo(574, 300);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade('#5d5468', 0.15);
  ctx.beginPath();
  ctx.moveTo(470, 268); ctx.lineTo(520, 258); ctx.lineTo(540, 274); ctx.lineTo(500, 280);
  ctx.closePath(); ctx.fill();
  // tower: tapered, banded red and cream
  const bands = ['#f3e9d2', '#c8452c', '#f3e9d2', '#c8452c', '#f3e9d2'];
  for (let i = 0; i < 5; i++) {
    const y0 = 262 - i * 34;
    const w0 = 34 - i * 2.4;
    ctx.fillStyle = bands[i];
    ctx.beginPath();
    ctx.moveTo(x - w0 / 2, y0); ctx.lineTo(x + w0 / 2, y0);
    ctx.lineTo(x + (w0 - 2.4) / 2, y0 - 34); ctx.lineTo(x - (w0 - 2.4) / 2, y0 - 34);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(60,20,20,0.18)';
    ctx.beginPath();
    ctx.moveTo(x + w0 / 6, y0); ctx.lineTo(x + w0 / 2, y0);
    ctx.lineTo(x + (w0 - 2.4) / 2, y0 - 34); ctx.lineTo(x + w0 / 6, y0 - 34);
    ctx.closePath(); ctx.fill();
  }
  // gallery + lamp room
  roundRect(ctx, x - 20, 84, 40, 7, 3, '#3a3348');
  if (!A('lamp')) glow(ctx, x, 104, 34, '#ffd76a', 0.85);
  roundRect(ctx, x - 12, 91, 24, 20, 3, A('lamp') ? '#4a4358' : '#ffd76a');
  ctx.fillStyle = '#2e2838';
  ctx.fillRect(x - 14, 89, 28, 3);
  // dome + flag pole
  ctx.fillStyle = '#3a3348';
  ctx.beginPath();
  ctx.moveTo(x - 15, 89); ctx.quadraticCurveTo(x, 66, x + 15, 89);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2e2838'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, 74); ctx.lineTo(x, 44); ctx.stroke();
  ctx.fillStyle = A('flag') ? '#2f6fd0' : '#d23b2e';
  ctx.beginPath();
  ctx.moveTo(x, 44); ctx.lineTo(x + 17, 49); ctx.lineTo(x, 55);
  ctx.closePath(); ctx.fill();
  // door
  roundRect(ctx, x - 6, 236, 12, 26, 5, '#4a3226');
}

function sailboat(ctx, x, y, s, sailColour, hullColour) {
  // hull
  ctx.fillStyle = hullColour;
  ctx.beginPath();
  ctx.moveTo(x - 34 * s, y); ctx.lineTo(x + 34 * s, y);
  ctx.lineTo(x + 24 * s, y + 13 * s); ctx.lineTo(x - 22 * s, y + 13 * s);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(hullColour, 0.3);
  ctx.fillRect(x - 34 * s, y, 68 * s, 3.5 * s);
  // mast + rigging
  ctx.strokeStyle = '#4a3226'; ctx.lineWidth = 2.4 * s;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 62 * s); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,30,30,0.55)'; ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(x, y - 62 * s); ctx.lineTo(x - 32 * s, y);
  ctx.moveTo(x, y - 62 * s); ctx.lineTo(x + 32 * s, y);
  ctx.stroke();
  // sails
  ctx.fillStyle = sailColour;
  ctx.beginPath();
  ctx.moveTo(x + 3 * s, y - 60 * s); ctx.lineTo(x + 3 * s, y - 4 * s); ctx.lineTo(x + 30 * s, y - 4 * s);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(sailColour === '#f7f2e2' ? '#e8dfc8' : sailColour, -0.08);
  ctx.beginPath();
  ctx.moveTo(x - 3 * s, y - 56 * s); ctx.lineTo(x - 3 * s, y - 4 * s); ctx.lineTo(x - 26 * s, y - 4 * s);
  ctx.closePath(); ctx.fill();
}

export function paint(ctx, altered) {
  const A = (id) => altered.has(id);

  // sky
  vGrad(ctx, 0, 0, 600, 300, [[0, '#7e6bb8'], [0.45, '#e88ca0'], [0.8, '#ffb37a'], [1, '#ffd9a0']]);
  // sun + glow
  glow(ctx, 428, 118, 90, '#ffdf8a', 0.7);
  circle(ctx, 428, 118, 30, A('sun') ? '#ff8c42' : '#ffe9a8');
  circle(ctx, 428, 118, 24, A('sun') ? '#ffa257' : '#fff3c4');
  // clouds
  cloud(ctx, 120, 62, 1.1, 'rgba(255,214,196,0.9)');
  cloud(ctx, 470, 40, 0.8, 'rgba(255,205,190,0.8)');
  if (!A('cloudlet')) cloud(ctx, 306, 66, 0.55, 'rgba(255,220,200,0.85)');
  cloud(ctx, 210, 130, 0.7, 'rgba(250,190,175,0.6)');
  // gulls
  gull(ctx, 96, 104, 1, '#4c3a54');
  if (!A('gull')) gull(ctx, 148, 88, 0.85, '#4c3a54');
  gull(ctx, 196, 116, 0.7, '#57455e');

  // distant headland, left, with a cottage
  ctx.fillStyle = '#6d5a7d';
  ctx.beginPath();
  ctx.moveTo(0, 300); ctx.lineTo(0, 226); ctx.quadraticCurveTo(70, 196, 138, 224);
  ctx.quadraticCurveTo(180, 240, 196, 300);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade('#6d5a7d', 0.12);
  ctx.beginPath();
  ctx.moveTo(0, 226); ctx.quadraticCurveTo(70, 196, 138, 224);
  ctx.quadraticCurveTo(120, 232, 60, 236); ctx.quadraticCurveTo(20, 238, 0, 244);
  ctx.closePath(); ctx.fill();
  // cottage
  ctx.fillStyle = '#efe3cc';
  ctx.fillRect(44, 196, 44, 30);
  ctx.fillStyle = '#8a4436';
  ctx.beginPath();
  ctx.moveTo(38, 198); ctx.lineTo(66, 178); ctx.lineTo(94, 198);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = A('cottage-window') ? '#4c4258' : '#ffd76a';
  ctx.fillRect(60, 204, 11, 11);
  ctx.strokeStyle = '#5a4632'; ctx.lineWidth = 1.4;
  ctx.strokeRect(60, 204, 11, 11);
  ctx.beginPath(); ctx.moveTo(65.5, 204); ctx.lineTo(65.5, 215); ctx.stroke();

  // sea
  vGrad(ctx, 0, 300, 600, 96, [[0, '#e8906f'], [0.25, '#c96a72'], [1, '#7a4a78']]);
  // sun path sparkles
  ctx.strokeStyle = 'rgba(255,220,150,0.75)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  const spark = [[398, 312, 46], [410, 330, 60], [392, 352, 40], [420, 372, 66], [404, 388, 44]];
  for (const [x, y, w] of spark) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,240,220,0.35)';
  const rip = [[80, 322, 36], [180, 344, 48], [520, 330, 30], [250, 372, 42], [120, 384, 30]];
  for (const [x, y, w] of rip) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  }

  lighthouse(ctx, A);

  // boats
  softShadow(ctx, 208, 306, 46, 6, 0.2);
  sailboat(ctx, 208, 292, 1.15, A('sail') ? '#d84a5a' : '#f7f2e2', '#7a4436');
  sailboat(ctx, 356, 300, 0.7, '#f3d9a4', '#44586e');
  // buoy
  if (!A('buoy')) {
    ctx.fillStyle = '#d23b2e';
    ctx.beginPath();
    ctx.moveTo(332, 322); ctx.lineTo(340, 344); ctx.lineTo(324, 344);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f3e9d2'; ctx.fillRect(326, 332, 12, 4);
    circle(ctx, 332, 320, 3.5, '#ffd76a');
  }

  // quay (foreground)
  vGrad(ctx, 0, 396, 600, 54, [[0, '#8a7358'], [1, '#6b563f']]);
  ctx.fillStyle = '#77644a'; ctx.fillRect(0, 396, 600, 5);
  ctx.strokeStyle = 'rgba(40,28,18,0.35)'; ctx.lineWidth = 1.4;
  for (let x = 30; x < 600; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 402); ctx.lineTo(x - 8, 450); ctx.stroke();
  }
  // crates
  const crate = (x, y, s) => {
    ctx.fillStyle = '#a97d4e';
    ctx.fillRect(x, y, 34 * s, 30 * s);
    ctx.strokeStyle = '#7a5a34'; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 34 * s, 30 * s);
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + 34 * s, y + 30 * s);
    ctx.moveTo(x + 34 * s, y); ctx.lineTo(x, y + 30 * s);
    ctx.stroke();
  };
  crate(88, 366, 1);
  crate(124, 366, 1);
  if (!A('crates')) crate(106, 338, 1);
  // barrel
  ctx.fillStyle = '#8a5f3a';
  ctx.beginPath();
  ctx.ellipse(196, 382, 17, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#5f4126'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.ellipse(196, 374, 16.4, 5, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(196, 392, 16.4, 5, 0, 0, Math.PI * 2); ctx.stroke();
  // lantern post, left foreground
  ctx.fillStyle = '#33302e';
  ctx.fillRect(46, 330, 5, 66);
  ctx.fillRect(38, 326, 21, 5);
  if (!A('lantern')) glow(ctx, 50, 314, 26, '#ffca6a', 0.8);
  roundRect(ctx, 41, 302, 17, 24, 4, A('lantern') ? '#55504e' : '#ffca6a');
  ctx.strokeStyle = '#262422'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(41, 310); ctx.lineTo(58, 310);
  ctx.moveTo(49.5, 302); ctx.lineTo(49.5, 326);
  ctx.stroke();
  roundRect(ctx, 44, 296, 11, 6, 2, '#262422');
  // rope coil on the quay
  ctx.strokeStyle = '#c9a76a';
  ctx.lineWidth = 3.4;
  for (const r of [13, 8.5, 4.5]) {
    ctx.beginPath();
    ctx.ellipse(268, 428, r + 6, r * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // bollard
  roundRect(ctx, 420, 402, 16, 30, 5, '#3c3835');
  roundRect(ctx, 415, 398, 26, 9, 4, '#2c2825');
  ctx.strokeStyle = '#c9a76a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(428, 408);
  ctx.quadraticCurveTo(470, 424, 520, 418);
  ctx.stroke();
  // foam at the lighthouse rocks
  ctx.strokeStyle = 'rgba(255,246,230,0.8)';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(452, 302); ctx.quadraticCurveTo(478, 296, 504, 302);
  ctx.quadraticCurveTo(536, 308, 570, 300);
  ctx.stroke();
  // a wash of dusk over the whole frame
  ctx.fillStyle = withAlpha('#40284e', 0.08);
  ctx.fillRect(0, 0, 600, 450);
}
