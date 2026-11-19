import { h, externalLink } from '../utils/dom.js';
import { ProjectArt } from './ProjectArt.js';

const LEAVE_MS = 700;

function Slide(project, index) {
  const copy = h(
    'div',
    { class: 'slide__copy' },
    h('h3', { class: 'slide__title' }, project.title),
    h('p', { class: 'slide__role' }, project.role),
    h('p', { class: 'slide__summary' }, project.summary),
    h('ul', { class: 'tags', 'aria-label': 'Technologies' }, project.tags.map((tag) => h('li', {}, tag))),
    project.href ? externalLink('View project', project.href, { class: 'text-link' }) : null,
  );
  const card = h(
    'div',
    { class: 'slide__card' },
    ProjectArt(project.accent, index + 1),
    h('div', { class: 'slide__caption' }, h('strong', {}, project.title), h('span', {}, project.role)),
  );
  card.style.setProperty('--accent', project.accent);
  return h('article', { class: 'slide', 'aria-roledescription': 'slide' }, copy, card);
}

export function Projects(projects) {
  let index = 0;
  let timer = 0;
  const slides = projects.map(Slide);
  const counter = h('p', { class: 'carousel__count', 'aria-live': 'polite' });

  const stage = h('div', { class: 'carousel__stage' }, slides);
  const prev = h('button', { class: 'round-btn round-btn--purple', type: 'button', 'aria-label': 'Previous project' }, '\u2190');
  const next = h('button', { class: 'round-btn round-btn--teal', type: 'button', 'aria-label': 'Next project' }, '\u2192');

  const root = h(
    'section',
    { class: 'section', id: 'work', 'aria-labelledby': 'work-title', 'aria-roledescription': 'carousel' },
    h(
      'div',
      { class: 'section__inner' },
      h('h2', { id: 'work-title', class: 'heading', 'data-reveal': '' }, 'Selected work'),
      h('p', { class: 'lede', 'data-reveal': '', 'data-delay': '0.1' }, 'Four builds, one habit: ship it, measure it, improve it.'),
      stage,
      h('div', { class: 'carousel__controls' }, prev, next, counter),
    ),
  );

  function show(to, dir) {
    const from = index;
    index = (to + slides.length) % slides.length;
    root.style.setProperty('--dir', String(dir));
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
      if (i === from && i !== index) {
        slide.classList.add('is-leaving');
        window.setTimeout(() => slide.classList.remove('is-leaving'), LEAVE_MS);
      }
      if (active) slide.classList.remove('is-leaving');
      slide.classList.toggle('is-active', active);
    });
    counter.textContent = `${index + 1} of ${slides.length}`;
  }

  const go = (dir) => {
    window.clearTimeout(timer);
    show(index + dir, dir);
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  let startX = null;
  stage.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
  });
  stage.addEventListener('pointerup', (e) => {
    if (startX !== null && Math.abs(e.clientX - startX) > 50) go(e.clientX < startX ? 1 : -1);
    startX = null;
  });
  stage.addEventListener('pointercancel', () => {
    startX = null;
  });

  show(0, 1);
  return root;
}
