import { loadContent } from './data/index.js';
import { h } from './utils/dom.js';
import { observeReveals } from './utils/motion.js';
import { startStage } from './canvas/Stage.js';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { Approach } from './components/Approach.js';
import { Stack } from './components/Stack.js';
import { Projects } from './components/Projects.js';
import { Experience } from './components/Experience.js';
import { Contact } from './components/Contact.js';
import { Footer } from './components/Footer.js';

function mount() {
  const { profile, projects, stack, experience } = loadContent();
  document.title = `${profile.name} | ${profile.role}`;

  const app = document.getElementById('app');
  app.replaceChildren(
    Header(profile),
    h(
      'main',
      { id: 'main' },
      Hero(profile),
      Approach(profile),
      Stack(profile.stack, stack),
      Projects(projects),
      Experience(experience),
      Contact(profile),
    ),
    Footer(profile),
  );

  document.querySelectorAll('[data-delay]').forEach((el) => el.style.setProperty('--d', `${el.dataset.delay}s`));
  observeReveals(app);
  startStage(document.getElementById('stage'));
  requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));
}

try {
  mount();
} catch (error) {
  console.error(error);
  document.getElementById('app').replaceChildren(
    h('p', { class: 'fatal', role: 'alert' }, 'This page could not load its content. Check the browser console for details.'),
  );
}
