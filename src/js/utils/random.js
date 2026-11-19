/** Small seeded PRNG so particle shapes are identical on every load. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Approximate normal distribution in [-1, 1]. */
export const gauss = (rnd) => (rnd() + rnd() + rnd() + rnd() - 2) / 2;
