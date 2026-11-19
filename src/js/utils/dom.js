import { isSafeUrl } from './validate.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
/** Attributes that could inject markup or script are never set from data. */
const BLOCKED = new Set(['style', 'srcdoc', 'innerhtml', 'outerhtml']);
const URL_ATTRS = new Set(['href', 'src', 'xlink:href']);
/** Images may also come from the site's own assets folder. */
const LOCAL_ASSET = /^\.\/assets\/[\w.-]+$/;

function applyProps(el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    const lower = key.toLowerCase();
    if (BLOCKED.has(lower)) continue;
    if (key === 'class') el.setAttribute('class', value);
    else if (key === 'text') el.textContent = value;
    else if (lower.startsWith('on') && typeof value === 'function') el.addEventListener(lower.slice(2), value);
    else if (URL_ATTRS.has(lower) && !isSafeUrl(value) && !(lower === 'src' && LOCAL_ASSET.test(value))) continue;
    else el.setAttribute(key, value === true ? '' : String(value));
  }
}

function appendChildren(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child === undefined || child === null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/** Build an element. Strings become text nodes, never HTML. */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  applyProps(el, props);
  appendChildren(el, children);
  return el;
}

export function svg(tag, props = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  applyProps(el, props);
  appendChildren(el, children);
  return el;
}

/** External links always get noopener/noreferrer. */
export function externalLink(label, href, props = {}) {
  const external = href.startsWith('https://');
  return h(
    'a',
    { href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}), ...props },
    label,
  );
}

/** Small triangle glyph reused as logo and list marker (echoes the floating triangles). */
export function triangleIcon(color, size = 22) {
  return svg(
    'svg',
    { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': 'true', focusable: 'false', class: 'tri-icon' },
    svg('path', {
      d: 'M12 3 21 20H3Z',
      fill: 'none',
      stroke: color,
      'stroke-width': '2',
      'stroke-linejoin': 'round',
    }),
  );
}
