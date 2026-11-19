import { PALETTE, createShapes } from './shapes.js';
import { mulberry32 } from '../utils/random.js';
import { clamp } from '../utils/math.js';

const LEVEL_ALPHA = [0.35, 0.72, 1];
const LEVELS = LEVEL_ALPHA.length;
const SCATTER = 1.15;

/**
 * Thousands of dots that morph between 3D shapes. Each dot has its own delay,
 * so the shapes dissolve into a drifting cloud and re-form, as in the reference.
 * Dots are queued by colour and depth so each frame needs only a few style changes.
 */
export class ParticleField {
  constructor(count) {
    this.count = count;
    this.shapes = createShapes(count);
    const rnd = mulberry32(99);
    this.delay = new Float32Array(count);
    this.scatter = new Float32Array(count * 3);
    this.size = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      this.delay[i] = rnd();
      this.scatter[i * 3] = rnd() * 2 - 1;
      this.scatter[i * 3 + 1] = rnd() * 2 - 1;
      this.scatter[i * 3 + 2] = rnd() * 2 - 1;
      this.size[i] = 1.1 + rnd() * 1.5;
    }
    const queues = PALETTE.length * LEVELS;
    this.queue = Array.from({ length: queues }, () => new Float32Array(count * 3));
    this.queueLength = new Uint32Array(queues);
    this.styles = PALETTE.flatMap(([r, g, b]) => LEVEL_ALPHA.map((a) => `rgba(${r},${g},${b},${a})`));
  }

  /** view: { s, cx, cy, unit, alpha, yaw, pitch, dotScale } */
  draw(ctx, view) {
    const { count, delay, scatter, size, queue, queueLength } = this;
    const last = this.shapes.length - 1;
    const from = Math.min(Math.floor(view.s), last - 1);
    const mix = clamp(view.s - from, 0, 1);
    const A = this.shapes[from];
    const B = this.shapes[from + 1];
    const cosY = Math.cos(view.yaw);
    const sinY = Math.sin(view.yaw);
    const cosP = Math.cos(view.pitch);
    const sinP = Math.sin(view.pitch);
    queueLength.fill(0);

    for (let i = 0; i < count; i += 1) {
      const k = i * 3;
      const local = clamp((mix * 1.6 - delay[i]) / 0.6, 0, 1);
      const e = local * local * (3 - 2 * local);
      const fly = Math.sin(Math.PI * e) * SCATTER;
      const px = A.pos[k] + (B.pos[k] - A.pos[k]) * e + scatter[k] * fly;
      const py = A.pos[k + 1] + (B.pos[k + 1] - A.pos[k + 1]) * e + scatter[k + 1] * fly;
      const pz = A.pos[k + 2] + (B.pos[k + 2] - A.pos[k + 2]) * e + scatter[k + 2] * fly;

      const x1 = px * cosY + pz * sinY;
      const z1 = -px * sinY + pz * cosY;
      const y1 = py * cosP - z1 * sinP;
      const z2 = py * sinP + z1 * cosP;

      const persp = 1 / (1 - z2 * 0.22);
      const sx = view.cx + x1 * view.unit * persp;
      const sy = view.cy - y1 * view.unit * persp;
      const level = z2 > 0.25 ? 2 : z2 > -0.35 ? 1 : 0;
      const bucket = e < 0.5 ? A.col[i] : B.col[i];
      const q = bucket * LEVELS + level;
      const at = queueLength[q];
      const buf = queue[q];
      buf[at] = sx;
      buf[at + 1] = sy;
      buf[at + 2] = size[i] * persp * view.dotScale;
      queueLength[q] = at + 3;
    }

    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = view.alpha;
    for (let q = 0; q < queue.length; q += 1) {
      const len = queueLength[q];
      if (!len) continue;
      ctx.fillStyle = this.styles[q];
      const buf = queue[q];
      for (let j = 0; j < len; j += 3) {
        const s = buf[j + 2];
        ctx.fillRect(buf[j] - s / 2, buf[j + 1] - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}
