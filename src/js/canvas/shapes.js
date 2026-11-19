import { mulberry32, gauss } from '../utils/random.js';

const TAU = Math.PI * 2;

/** Colour buckets: white, gold, orange, purple, teal, pink. */
export const PALETTE = [
  [255, 255, 255],
  [255, 196, 77],
  [255, 122, 58],
  [138, 107, 255],
  [47, 224, 176],
  [255, 95, 162],
];

function weighted(rnd, table) {
  let total = 0;
  for (const [, w] of table) total += w;
  let r = rnd() * total;
  for (const [value, w] of table) {
    r -= w;
    if (r <= 0) return value;
  }
  return table[0][0];
}

/** A side-on brain: two lobes with a cleft, folds, cerebellum and stem. */
function brain(n, rnd) {
  const pos = new Float32Array(n * 3);
  const col = new Uint8Array(n);
  let i = 0;
  while (i < n) {
    const part = rnd();
    let x;
    let y;
    let z;
    if (part < 0.86) {
      const u = rnd() * 2 - 1;
      const t = rnd() * TAU;
      const s = Math.sqrt(1 - u * u);
      const dx = s * Math.cos(t);
      let dy = u;
      const dz = s * Math.sin(t);
      if (dy < -0.25) dy = -0.25 + (dy + 0.25) * 0.5;
      const f =
        Math.sin(7 * dx + 3.2 * dy + 5 * dz) * Math.sin(6.5 * dz - 4 * dy + 1.3) +
        0.6 * Math.sin(10 * dy + 4 * dx + 2 * dz);
      if (rnd() > 0.1 + 0.9 * (0.5 + (0.5 * f) / 1.6) ** 1.4) continue;
      let r = 1 + 0.07 * f;
      r *= 1 - 0.14 * Math.exp(-(dx * dx) / 0.012) * Math.max(dy, 0);
      x = dx * 0.58 * r;
      y = dy * 0.62 * r + 0.08;
      z = dz * 0.98 * r;
    } else if (part < 0.96) {
      const u = rnd() * 2 - 1;
      const t = rnd() * TAU;
      const s = Math.sqrt(1 - u * u);
      if (Math.sin(u * 18) < -0.3) continue;
      x = s * Math.cos(t) * 0.3;
      y = u * 0.2 - 0.3;
      z = s * Math.sin(t) * 0.3 - 0.62;
    } else {
      const a = rnd() * TAU;
      const hgt = rnd();
      x = Math.cos(a) * 0.09;
      z = Math.sin(a) * 0.09 - 0.3 - hgt * 0.1;
      y = -0.2 - hgt * 0.5;
    }
    const k = Math.sin(2.4 * x + 1.9 * z + 2.6 * y) + (rnd() - 0.5) * 1.1;
    let c;
    if (k > 0.8) c = 1;
    else if (k > 0.1) c = 0;
    else if (k > -0.5) c = rnd() < 0.5 ? 2 : 0;
    else c = 3;
    if (rnd() < 0.03) c = 4;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    col[i] = c;
    i += 1;
  }
  return { pos, col };
}

function bulbRadius(y) {
  if (y >= -0.1) {
    const d = (y - 0.36) / 0.64;
    return d * d >= 1 ? 0 : 0.64 * Math.sqrt(1 - d * d);
  }
  if (y >= -0.42) {
    const t = (y + 0.42) / 0.32;
    return 0.22 + 0.22 * t * t * (3 - 2 * t);
  }
  if (y >= -0.95) return 0.22 + 0.012 * Math.sin(y * 45);
  return Math.max(0, 0.22 * (1 - (-0.95 - y) / 0.05));
}

/** A light bulb: glass sphere, neck, threaded base and a glowing filament. */
function bulb(n, rnd) {
  const pos = new Float32Array(n * 3);
  const col = new Uint8Array(n);
  let i = 0;
  while (i < n) {
    let x;
    let y;
    let z;
    if (rnd() < 0.06) {
      const t = rnd();
      x = (t * 2 - 1) * 0.14;
      y = 0.3 + 0.1 * Math.sin(t * 24);
      z = 0.02;
    } else {
      y = rnd() * 2 - 1;
      const r = bulbRadius(y);
      if (r < 0.005 || rnd() > r / 0.64 + 0.05) continue;
      const a = rnd() * TAU;
      x = Math.cos(a) * r;
      z = Math.sin(a) * r;
    }
    const band = (y + 1) / 2;
    let c;
    if (band > 0.75) c = weighted(rnd, [[1, 5], [0, 3], [2, 1]]);
    else if (band > 0.45) c = weighted(rnd, [[1, 3], [2, 3], [0, 1]]);
    else if (band > 0.22) c = weighted(rnd, [[2, 2], [3, 3], [5, 1]]);
    else c = weighted(rnd, [[3, 3], [4, 3], [0, 1]]);
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    col[i] = c;
    i += 1;
  }
  return { pos, col };
}

/** A glowing crescent ribbon inside a soft halo, used for the contact scene. */
function burst(n, rnd) {
  const pos = new Float32Array(n * 3);
  const col = new Uint8Array(n);
  for (let i = 0; i < n; i += 1) {
    let x;
    let y;
    let z;
    let c;
    if (rnd() < 0.28) {
      const a = rnd() * TAU;
      const r = 0.4 + Math.abs(gauss(rnd)) * 1.1;
      x = gauss(rnd) * 0.35;
      z = Math.cos(a) * r;
      y = Math.sin(a) * r * 0.9;
      c = weighted(rnd, [[3, 4], [4, 3], [0, 2], [5, 1]]);
    } else {
      const t = rnd();
      const a = -1.1 + t * 3.4;
      const radius = 0.82 + 0.22 * Math.sin(t * 5.5 + 0.8) + gauss(rnd) * 0.16 * (1.1 - t * 0.5);
      z = radius * Math.cos(a);
      y = radius * Math.sin(a) * 0.95;
      x = gauss(rnd) * 0.22 + Math.sin(a * 2) * 0.25;
      if (t < 0.3) c = 3;
      else if (t < 0.6) c = 2;
      else if (t < 0.85) c = 1;
      else c = 4;
      if (rnd() < 0.08) c = 0;
    }
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    col[i] = c;
  }
  return { pos, col };
}

/** Shapes in scroll order: brain, bulb, burst. */
export function createShapes(count, seed = 7) {
  const rnd = mulberry32(seed);
  return [brain(count, rnd), bulb(count, rnd), burst(count, rnd)];
}
