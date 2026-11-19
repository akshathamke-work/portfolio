import { h, triangleIcon } from '../utils/dom.js';

export function Experience(entries) {
  return h(
    'section',
    { class: 'section', id: 'experience', 'aria-labelledby': 'experience-title' },
    h(
      'div',
      { class: 'section__inner split split--right' },
      h('h2', { id: 'experience-title', class: 'heading', 'data-reveal': '' }, 'Experience and education'),
      h(
        'ol',
        { class: 'timeline' },
        entries.map((e, i) =>
          h(
            'li',
            { class: 'timeline__item', 'data-reveal': '', 'data-delay': String(0.1 * i) },
            triangleIcon(e.color, 26),
            h(
              'div',
              {},
              h('h3', { class: 'timeline__role' }, e.role),
              h('p', { class: 'timeline__meta' }, `${e.company}, ${e.period}`),
              h('p', { class: 'timeline__summary' }, e.summary),
            ),
          ),
        ),
      ),
    ),
  );
}
