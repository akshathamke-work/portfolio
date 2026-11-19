import { mulberry32 } from '../utils/random.js';
import { mod } from '../utils/math.js';

const TAU = Math.PI * 2;
const COLORS = ['#ff8a3d', '#2fe0b0', '#8a6bff', '#ffc44d', '#e9e6f5'];

/** Outlined triangles that tumble in 3D and drift at different depths. */
export class Triangles {
  constructor(count) {
    const rnd = mulberry32(21);
    this.items = Array.from({ length: count }, (_, i) => ({
      x: rnd(),
      y: rnd(),
      depth: 0.25 + rnd() * 0.75,
      size: 9 + rnd() * 24,
      color: COLORS[i % COLORS.length],
      a: [rnd() * TAU, rnd() * TAU, rnd() * TAU],
      v: [(rnd() - 0.5) * 0.7, (rnd() - 0.5) * 0.7, (rnd() - 0.5) * 0.7],
      drift: (rnd() - 0.5) * 8,
    }));
  }

  draw(ctx, { w, h, scroll, time, mx, my }) {
    const W = w + 160;
    const H = h + 160;
    ctx.lineJoin = 'round';
    for (const t of this.items) {
      const x = mod(t.x * W + time * t.drift * t.depth + mx * 36 * t.depth, W) - 80;
      const y = mod(t.y * H - scroll * 0.22 * t.depth + my * 24 * t.depth, H) - 80;
      const [ax, ay, az] = [t.a[0] + time * t.v[0], t.a[1] + time * t.v[1], t.a[2] + time * t.v[2]];
      const [sxA, cxA, syA, cyA, szA, czA] = [Math.sin(ax), Math.cos(ax), Math.sin(ay), Math.cos(ay), Math.sin(az), Math.cos(az)];
      ctx.beginPath();
      for (let k = 0; k < 3; k += 1) {
        const ang = (k * TAU) / 3;
        let vx = Math.cos(ang) * t.size;
        let vy = Math.sin(ang) * t.size;
        let vz = 0;
        let ty = vy * cxA - vz * sxA;
        vz = vy * sxA + vz * cxA;
        vy = ty;
        const tx = vx * cyA + vz * syA;
        vz = -vx * syA + vz * cyA;
        vx = tx;
        ty = vx * szA + vy * czA;
        vx = vx * czA - vy * szA;
        vy = ty;
        const p = 1 / (1 - vz / (t.size * 8));
        const px = x + vx * p;
        const py = y + vy * p;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.3 + 0.5 * t.depth;
      ctx.lineWidth = 1 + t.depth;
      ctx.strokeStyle = t.color;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}
