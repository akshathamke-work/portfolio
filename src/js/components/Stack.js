import { h } from '../utils/dom.js';

export function Stack({ title, intro }, groups) {
  return h(
    'section',
    { class: 'section', id: 'stack', 'aria-labelledby': 'stack-title' },
    h(
      'div',
      { class: 'section__inner split split--right' },
      h(
        'div',
        { class: 'stack__copy' },
        h('h2', { id: 'stack-title', class: 'heading', 'data-reveal': '' }, title),
        h('p', { class: 'lede', 'data-reveal': '', 'data-delay': '0.1' }, intro),
        h(
          'dl',
          { class: 'stack__groups' },
          groups.flatMap((g, i) => [
            h('dt', { 'data-reveal': '', 'data-delay': String(0.15 + i * 0.06) }, g.group),
            h('dd', { 'data-reveal': '', 'data-delay': String(0.15 + i * 0.06) }, g.items.join(', ')),
          ]),
        ),
      ),
    ),
  );
}
