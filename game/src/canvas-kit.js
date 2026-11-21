// canvas-kit.js — shared drawing helpers for the scene painters: gradients,
// soft shadows, clouds, trees, sparkles and other shapes every vista reuses.
// Everything here draws with everyday canvas 2D calls only, so the same
// painters run in a browser and in the screenshot harness unchanged.

import { shade, withAlpha } from './palette.js';

// Fill a rect with a vertical linear gradient through [offset, colour] stops.
export function vGrad(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  for (const [o, c] of stops) g.addColorStop(o, c);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

// Fill a rect with a horizontal linear gradient.
export function hGrad(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  for (const [o, c] of stops) g.addColorStop(o, c);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

// A radial glow: concentric translucent circles, cheap and soft.
export function glow(ctx, x, y, r, colour, strength = 0.5) {
  const steps = 6;
  for (let i = steps; i >= 1; i--) {
    ctx.fillStyle = withAlpha(colour, (strength / steps) * (1 - i / (steps + 1)));
    ctx.beginPath();
    ctx.arc(x, y, (r * i) / steps, 0, Math.PI * 2);
    ctx.fill();
  }
}

// A soft ground shadow: a flattened translucent ellipse.
export function softShadow(ctx, x, y, rx, ry, alpha = 0.18) {
  ctx.fillStyle = `rgba(20,16,40,${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function circle(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ring(ctx, x, y, r, colour, width) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

// A rounded rectangle path (not filled — caller fills or strokes).
export function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function roundRect(ctx, x, y, w, h, r, colour) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = colour;
  ctx.fill();
}

// A puffy cloud: a row of overlapping circles on a flat base.
export function cloud(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  const puffs = [[0, 0, 26], [24, 6, 20], [-25, 7, 19], [8, -10, 18], [-12, -8, 15]];
  for (const [dx, dy, r] of puffs) {
    ctx.beginPath();
    ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2);
    ctx.fill();
  }
  roundRect(ctx, x - 38 * s, y, 76 * s, 12 * s, 6 * s, colour);
}

// A four-point sparkle star.
export function sparkle(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.closePath();
  ctx.fill();
}

// A pine tree: layered triangles with a shaded side and a trunk.
export function pineTree(ctx, x, y, h, colour) {
  const w = h * 0.36;
  ctx.fillStyle = shade(colour, -0.25);
  ctx.fillRect(x - 3, y - h * 0.08, 6, h * 0.1);
  const tiers = [[0.52, 0.34], [0.3, 0.3], [0.08, 0.28]];
  for (const [top, span] of tiers) {
    const ty = y - h * (1 - top);
    const tw = w * span * 2.4;
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x - tw / 2, ty);
    ctx.lineTo(x, ty - h * 0.34);
    ctx.lineTo(x + tw / 2, ty);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = shade(colour, -0.18);
    ctx.beginPath();
    ctx.moveTo(x, ty - h * 0.34);
    ctx.lineTo(x + tw / 2, ty);
    ctx.lineTo(x, ty);
    ctx.closePath();
    ctx.fill();
  }
}

// A round leafy tree with fruit dots.
export function roundTree(ctx, x, y, h, colour, fruit = null) {
  ctx.fillStyle = '#6d4a2f';
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.quadraticCurveTo(x - 3, y - h * 0.4, x - 10, y - h * 0.52);
  ctx.lineTo(x - 4, y - h * 0.52);
  ctx.quadraticCurveTo(x, y - h * 0.42, x + 2, y - h * 0.3);
  ctx.quadraticCurveTo(x + 4, y - h * 0.42, x + 10, y - h * 0.52);
  ctx.lineTo(x + 16, y - h * 0.52);
  ctx.quadraticCurveTo(x + 6, y - h * 0.38, x + 5, y);
  ctx.closePath();
  ctx.fill();
  const blobs = [[0, 0.78, 0.30], [-0.16, 0.68, 0.22], [0.17, 0.7, 0.23], [0, 0.6, 0.24]];
  for (const [dx, cy, r] of blobs) {
    circle(ctx, x + dx * h, y - cy * h, r * h, colour);
  }
  circle(ctx, x - 0.05 * h, y - 0.72 * h, 0.2 * h, shade(colour, 0.12));
  if (fruit) {
    const spots = [[-0.14, 0.66], [0.1, 0.58], [0.02, 0.8], [0.18, 0.74], [-0.08, 0.52]];
    for (const [dx, cy] of spots) circle(ctx, x + dx * h, y - cy * h, h * 0.028, fruit);
  }
}

// A plump bush with highlight.
export function bush(ctx, x, y, w, colour) {
  circle(ctx, x - w * 0.28, y - w * 0.1, w * 0.24, colour);
  circle(ctx, x + w * 0.26, y - w * 0.12, w * 0.27, colour);
  circle(ctx, x, y - w * 0.2, w * 0.3, colour);
  circle(ctx, x - w * 0.08, y - w * 0.28, w * 0.16, shade(colour, 0.14));
}

// A simple gull: two arcs.
export function gull(ctx, x, y, s, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.05, Math.PI * 1.85);
  ctx.stroke();
}

// Little grass tufts along a baseline.
export function grassTufts(ctx, xs, y, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (const x of xs) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - 3, y - 9, x - 6, y - 11);
    ctx.moveTo(x + 4, y);
    ctx.quadraticCurveTo(x + 4, y - 10, x + 8, y - 13);
    ctx.moveTo(x + 8, y);
    ctx.quadraticCurveTo(x + 9, y - 8, x + 13, y - 10);
    ctx.stroke();
  }
}
