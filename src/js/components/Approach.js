import { h } from '../utils/dom.js';
import { Portrait } from './Portrait.js';

export function Approach(profile) {
  const { title, paragraphs } = profile.approach;
  return h(
    'section',
    { class: 'section', id: 'approach', 'aria-labelledby': 'approach-title' },
    h(
      'div',
      { class: 'section__inner split split--portrait' },
      Portrait(profile),
      h(
        'div',
        { class: 'approach__copy' },
        h('h2', { id: 'approach-title', class: 'heading', 'data-reveal': '' }, title),
        h(
          'div',
          { class: 'prose' },
          paragraphs.map((text, i) => h('p', { 'data-reveal': '', 'data-delay': String(0.12 * (i + 1)) }, text)),
        ),
      ),
    ),
  );
}
