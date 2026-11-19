// Zero-dependency static server for local development: `npm start`.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../src', import.meta.url)));
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.json': 'application/json; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://localhost');
    let file = normalize(join(ROOT, decodeURIComponent(pathname)));
    // Never serve anything outside src/ (blocks ../ path traversal).
    if (file !== ROOT && !file.startsWith(ROOT + sep)) throw Object.assign(new Error('Forbidden'), { code: 403 });
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch (error) {
    res.writeHead(error.code === 403 ? 403 : 404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(error.code === 403 ? 'Forbidden' : 'Not found');
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Portfolio running at http://localhost:${PORT}`));
