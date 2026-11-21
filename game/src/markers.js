// markers.js — the ink that goes on top of a picture: green rings on found
// differences (with a pop as they land), fading red crosses on misses, the
// amber hint pulse and the sparkle particles a find throws off.

export function drawFoundRing(ctx, d, pop = 1) {
  const r = d.r * pop;
  ctx.save();
  ctx.strokeStyle = 'rgba(20,60,25,0.55)';
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#39d353';
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(d.x, d.y, r - 3.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// The pop curve for a fresh find: overshoot then settle, over 0.6 s.
export function popScale(t) {
  if (t >= 0.6) return 1;
  const k = t / 0.6;
  return 0.4 + 0.85 * k - 0.25 * k * k;
}

export function drawMiss(ctx, m) {
  const a = Math.max(0, 1 - m.t / 0.9);
  const s = 9;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = '#e23b3b';
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(m.x - s, m.y - s);
  ctx.lineTo(m.x + s, m.y + s);
  ctx.moveTo(m.x + s, m.y - s);
  ctx.lineTo(m.x - s, m.y + s);
  ctx.stroke();
  ctx.restore();
}

export function drawHintPulse(ctx, d, t) {
  const phase = (t % 1.1) / 1.1;
  const r = d.r + 6 + phase * 16;
  ctx.save();
  ctx.globalAlpha = 0.9 * (1 - phase);
  ctx.strokeStyle = '#ffb020';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = '#ffb020';
  ctx.lineWidth = 3;
  ctx.setLineDash([7, 6]);
  ctx.beginPath();
  ctx.arc(d.x, d.y, d.r + 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawParticles(ctx, particles) {
  ctx.save();
  for (const p of particles) {
    const a = Math.max(0, 1 - p.t / p.life);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.colour;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.6 * a + 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Everything that belongs on one panel for a hunt in progress.
export function drawOverlay(ctx, hunt, now) {
  for (const d of hunt.scene.diffs) {
    if (hunt.found.has(d.id)) {
      const ring = hunt.rings.find((r) => r.diff.id === d.id);
      drawFoundRing(ctx, d, ring ? popScale(ring.t) : 1);
    }
  }
  if (hunt.hintId) {
    const d = hunt.scene.diffs.find((x) => x.id === hunt.hintId);
    if (d) drawHintPulse(ctx, d, now);
  }
  for (const m of hunt.misses) drawMiss(ctx, m);
  drawParticles(ctx, hunt.particles);
}
