import { h } from '../utils/dom.js';
import { Logo } from './Logo.js';

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'Experience', href: '#experience' },
];

export function Header(profile) {
  const header = h(
    'header',
    { class: 'site-header' },
    h(
      'a',
      { class: 'brand', href: '#top', 'aria-label': `${profile.name}, back to top` },
      Logo(30),
      h('span', {}, profile.name),
    ),
    h(
      'nav',
      { class: 'site-nav', 'aria-label': 'Primary' },
      h('ul', {}, NAV.map((item) => h('li', {}, h('a', { href: item.href }, item.label)))),
      h('a', { class: 'btn btn--small', href: '#contact' }, 'Get in touch'),
    ),
  );

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', update, { passive: true });
  update();
  return header;
}
