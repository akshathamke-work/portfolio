import { svg } from '../utils/dom.js';
import { mulberry32 } from '../utils/random.js';

/** Generates a unique dot-grid illustration for each project from its accent colour. */
export function ProjectArt(accent, seed) {
  const rnd = mulberry32(seed * 131 + 17);
  const cols = 14;
  const rows = 18;
  const fx = 0.3 + rnd() * 0.4;
  const fy = 0.25 + rnd() * 0.35;
  const art = svg('svg', { class: 'art', viewBox: '0 0 140 180', 'aria-hidden': 'true', focusable: 'false' });
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const d = Math.hypot(c / cols - fx, (r / rows - fy) * 0.8);
      const radius = Math.max(0.35, 3.1 * (1 - d * 1.55));
      art.append(svg('circle', { cx: 5 + c * 10, cy: 5 + r * 10, r: radius.toFixed(2), fill: accent, opacity: (0.35 + (1 - d) * 0.65).toFixed(2) }));
    }
  }
  art.append(
    svg('path', { d: 'M70 34 118 118H22Z', fill: 'none', stroke: '#ffffff', 'stroke-width': '1.2', 'stroke-linejoin': 'round', opacity: '0.85' }),
  );
  return art;
}
