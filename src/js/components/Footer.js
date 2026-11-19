import { h, externalLink } from '../utils/dom.js';

export function Footer(profile) {
  return h(
    'footer',
    { class: 'site-footer' },
    h('p', {}, `\u00a9 ${new Date().getFullYear()} ${profile.name}, ${profile.location}`),
    h('ul', {}, profile.social.map((s) => h('li', {}, externalLink(s.label, s.href)))),
  );
}
