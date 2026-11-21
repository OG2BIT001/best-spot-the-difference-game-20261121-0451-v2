// palette.js — tiny colour helpers: parse, mix and shade hex colours so the
// scene painters can build lit/shadowed pairs from one base colour.

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbString([r, g, b], alpha = 1) {
  return alpha >= 1
    ? `rgb(${r | 0},${g | 0},${b | 0})`
    : `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
}

// Mix two hex colours: t = 0 gives a, t = 1 gives b.
export function mix(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbString([
    ca[0] + (cb[0] - ca[0]) * t,
    ca[1] + (cb[1] - ca[1]) * t,
    ca[2] + (cb[2] - ca[2]) * t,
  ]);
}

// Lighten (t > 0, toward white) or darken (t < 0, toward black) a hex colour.
export function shade(hex, t) {
  return t >= 0 ? mix(hex, '#ffffff', t) : mix(hex, '#000000', -t);
}

export function withAlpha(hex, alpha) {
  return rgbString(hexToRgb(hex), alpha);
}
