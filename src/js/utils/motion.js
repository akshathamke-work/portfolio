/** Fades elements in once as they enter the viewport. */
export function observeReveals(root = document) {
  const targets = [...root.querySelectorAll('[data-reveal]')];
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );
  targets.forEach((el) => observer.observe(el));
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
