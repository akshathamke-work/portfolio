/**
 * Where the particle shape sits while each section is centred on screen.
 * s: shape index (0 brain, 1 bulb, 2 burst; fractions are the dissolve between)
 * x, y: offset as a fraction of viewport width/height. size: scale. alpha: opacity.
 * Between two sections the values are blended as the page scrolls.
 */
export function getScenes(narrow) {
  if (narrow) {
    return [
      { id: 'top', s: 0, x: 0, y: 0.27, size: 1, alpha: 0.85 },
      { id: 'approach', s: 0.5, x: 0, y: 0, size: 1.2, alpha: 0.35 },
      { id: 'stack', s: 1, x: 0, y: 0, size: 1, alpha: 0.32 },
      { id: 'work', s: 1.5, x: 0, y: 0, size: 1.2, alpha: 0.22 },
      { id: 'experience', s: 1.75, x: 0, y: 0, size: 1.3, alpha: 0.18 },
      { id: 'contact', s: 2, x: 0, y: -0.02, size: 1, alpha: 0.5 },
    ];
  }
  return [
    { id: 'top', s: 0, x: 0.24, y: 0, size: 1, alpha: 1 },
    { id: 'approach', s: 0.5, x: 0, y: 0, size: 1.25, alpha: 0.55 },
    { id: 'stack', s: 1, x: -0.24, y: 0, size: 1, alpha: 1 },
    { id: 'work', s: 1.5, x: 0, y: 0, size: 1.3, alpha: 0.28 },
    { id: 'experience', s: 1.75, x: 0, y: 0, size: 1.5, alpha: 0.22 },
    { id: 'contact', s: 2, x: 0, y: -0.02, size: 1.1, alpha: 1 },
  ];
}
