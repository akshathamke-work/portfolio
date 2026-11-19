import { svg } from '../utils/dom.js';

let uid = 0;

/**
 * Monogram for "Aksha Thamke": a triangle forms the A (echoing the floating
 * triangles), its crossbar is the top of a T, and the stem drops to the base.
 * The teal dot at the apex is a single particle.
 */
export function Logo(size = 30) {
  uid += 1;
  const id = `logo-grad-${uid}`;
  return svg(
    'svg',
    { class: 'logo', viewBox: '0 0 32 32', width: size, height: size, role: 'img', 'aria-label': 'AT monogram', focusable: 'false' },
    svg(
      'defs',
      {},
      svg(
        'linearGradient',
        { id, x1: '4', y1: '28', x2: '28', y2: '4', gradientUnits: 'userSpaceOnUse' },
        svg('stop', { offset: '0', 'stop-color': '#8a6bff' }),
        svg('stop', { offset: '1', 'stop-color': '#ff8a3d' }),
      ),
    ),
    svg('path', {
      d: 'M16 5 28 28H4Z M8.6 18.5H23.4 M16 18.5V28',
      fill: 'none',
      stroke: `url(#${id})`,
      'stroke-width': '2.4',
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round',
    }),
    svg('circle', { cx: '16', cy: '2.6', r: '1.7', fill: '#2fe0b0' }),
  );
}
