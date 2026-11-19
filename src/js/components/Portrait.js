import { h } from '../utils/dom.js';
import { Logo } from './Logo.js';

/**
 * Portrait card in the style of the reference's team card. If the photo file
 * is missing, the monogram is shown instead so the layout never breaks.
 */
export function Portrait(profile) {
  const frame = h('div', { class: 'portrait__frame' });
  const img = h('img', {
    src: profile.photo,
    alt: `Portrait of ${profile.name}`,
    width: '600',
    height: '800',
    decoding: 'async',
    loading: 'lazy',
  });
  img.addEventListener('error', () => {
    frame.classList.add('is-fallback');
    frame.replaceChildren(Logo(120));
  });
  frame.append(img);

  return h(
    'figure',
    { class: 'portrait', 'data-reveal': '' },
    frame,
    h('figcaption', { class: 'portrait__caption' }, h('strong', {}, profile.name), h('span', {}, `${profile.role}, ${profile.location}`)),
  );
}
