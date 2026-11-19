import { h, externalLink } from '../utils/dom.js';

export function Hero(profile) {
  const lines = profile.headline.map((text, i) => {
    const inner = h('span', {}, text);
    inner.style.setProperty('--i', String(i));
    return h('span', { class: 'hero__line' }, inner);
  });

  return h(
    'section',
    { class: 'section hero', id: 'top', 'aria-labelledby': 'hero-title' },
    h(
      'div',
      { class: 'section__inner' },
      h(
        'div',
        { class: 'hero__copy' },
        h('h1', { id: 'hero-title', class: 'display' }, lines),
        h('p', { class: 'lede', 'data-reveal': '', 'data-delay': '0.7' }, `I\u2019m ${profile.name}, a ${profile.role.charAt(0).toLowerCase()}${profile.role.slice(1)}. ${profile.intro}`),
        h(
          'div',
          { class: 'hero__actions', 'data-reveal': '', 'data-delay': '0.85' },
          h('a', { class: 'btn', href: profile.primaryCta.href }, profile.primaryCta.label),
          ...profile.social.slice(0, 1).map((s) => externalLink(s.label, s.href, { class: 'text-link' })),
        ),
      ),
    ),
  );
}
