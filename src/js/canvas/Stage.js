import { ParticleField } from './ParticleField.js';
import { Triangles } from './Triangles.js';
import { getScenes } from './scenes.js';
import { lerp, smoothstep } from '../utils/math.js';
import { prefersReducedMotion } from '../utils/motion.js';

const KEYS = ['s', 'x', 'y', 'size', 'alpha'];

/**
 * Owns the fixed background canvas. Scroll position picks a target scene,
 * the displayed state eases toward it every frame, so motion stays smooth
 * even when scrolling is jumpy (mouse wheels, touch flings).
 */
export function startStage(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const lite = window.innerWidth < 760 || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  const field = new ParticleField(lite ? 4800 : 11000);
  const triangles = new Triangles(lite ? 9 : 16);
  const reduced = prefersReducedMotion();

  let vw = 0;
  let vh = 0;
  let narrow = false;
  let unit = 300;
  let scenes = [];
  const target = { s: 0, x: 0, y: 0, size: 1, alpha: 1 };
  const current = { s: 0, x: 0, y: 0, size: 1, alpha: 1 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    narrow = vw < 820;
    unit = Math.min(vw * (narrow ? 0.36 : 0.2), vh * (narrow ? 0.26 : 0.36));
    scenes = getScenes(narrow)
      .map((scene) => {
        const el = document.getElementById(scene.id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        return { ...scene, at: Math.max(0, top + rect.height / 2 - vh / 2) };
      })
      .filter(Boolean)
      .sort((a, b) => a.at - b.at);
  }

  function sample(y) {
    const first = scenes[0];
    const last = scenes[scenes.length - 1];
    if (y <= first.at) return Object.assign(target, first);
    if (y >= last.at) return Object.assign(target, last);
    let i = 0;
    while (y >= scenes[i + 1].at) i += 1;
    const a = scenes[i];
    const b = scenes[i + 1];
    const f = smoothstep((y - a.at) / (b.at - a.at));
    for (const key of KEYS) target[key] = lerp(a[key], b[key], f);
    return target;
  }

  measure();
  if (!scenes.length) return;
  Object.assign(current, sample(window.scrollY), { alpha: 0, size: current.size * 0.88 });
  current.size = target.size * 0.88;

  let last = performance.now();
  let clock = 0;

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduced) clock += dt;

    sample(window.scrollY);
    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);
    for (const key of KEYS) current[key] += (target[key] - current[key]) * k;
    const km = reduced ? 1 : 1 - Math.exp(-dt * 3);
    mouse.x += (mouse.tx - mouse.x) * km;
    mouse.y += (mouse.ty - mouse.y) * km;

    ctx.clearRect(0, 0, vw, vh);
    triangles.draw(ctx, { w: vw, h: vh, scroll: window.scrollY, time: clock, mx: mouse.x, my: mouse.y });
    field.draw(ctx, {
      s: current.s,
      cx: vw / 2 + current.x * vw,
      cy: vh / 2 + current.y * vh,
      unit: unit * current.size,
      alpha: current.alpha,
      yaw: Math.PI / 2 + Math.sin(clock * 0.25) * 0.45 + mouse.x * 0.35,
      pitch: mouse.y * 0.18 + 0.06,
      dotScale: narrow ? 1 : 1.15,
    });
    requestAnimationFrame(frame);
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.tx = (e.clientX / vw) * 2 - 1;
      mouse.ty = (e.clientY / vh) * 2 - 1;
    },
    { passive: true },
  );
  let resizeTimer = 0;
  const remeasure = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measure, 120);
  };
  window.addEventListener('resize', remeasure);
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(document.body);
  window.addEventListener('load', measure);

  requestAnimationFrame(frame);
}
