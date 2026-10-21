// Local preview: serves dist/, rebuilds when the knowledge base or the code
// changes, and reloads open pages. If the knowledge base has errors, every
// page shows them instead, so a typo in the editor is visible at once.
// Usage: node scripts/dev.mjs [port]
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, statSync, watch } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.argv[2] ?? 4321);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

let state = { ok: true, errors: [] };
const clients = new Set();

function rebuild() {
  // A separate process each time, so that changed build code is picked up too.
  const run = spawnSync(process.execPath, [join(ROOT, 'scripts/build.mjs'), '--json'], { encoding: 'utf8' });
  try {
    state = JSON.parse(run.stdout);
  } catch {
    state = { ok: false, errors: [run.stderr || run.stdout || 'build failed without output'] };
  }
  if (state.ok) console.log(`[dev] built ${state.count} pages`);
  else console.error(`[dev] ${state.errors.length} error(s):\n  ${state.errors.join('\n  ')}`);
  for (const res of clients) res.write('data: reload\n\n');
}

const RELOAD = `<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>`;
const escape = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const errorPage = () =>
  `<!doctype html><meta charset="utf-8"><title>Build errors</title>
<body style="font:16px/1.5 system-ui;max-width:860px;margin:40px auto;padding:0 16px">
<h1 style="color:#c2185b">The knowledge base has ${state.errors.length} error(s)</h1>
<p>Fix them in the editor; this page reloads by itself.</p>
<ul>${state.errors.map((e) => `<li><pre style="white-space:pre-wrap;margin:4px 0">${escape(e)}</pre></li>`).join('')}</ul>${RELOAD}`;

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (!state.ok) {
    res.writeHead(500, { 'Content-Type': TYPES['.html'] });
    return res.end(errorPage());
  }
  try {
    let file = join(DIST, path);
    if (!file.startsWith(DIST)) return res.writeHead(403).end();
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    let status = 200;
    if (!existsSync(file)) {
      file = join(DIST, '404.html');
      status = 404;
    }
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    let body = readFileSync(file);
    if (type.startsWith('text/html')) body = body.toString().replace('</body>', `${RELOAD}</body>`);
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    // dist/ is being replaced by a build right now; the reload follows.
    res.writeHead(503, { 'Content-Type': 'text/plain', 'Retry-After': '1' });
    res.end('Building…');
  }
}).listen(PORT, () => console.log(`[dev] http://localhost:${PORT}`));

let timer;
for (const dir of ['knowledge', 'src', 'public']) {
  watch(join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}
rebuild();
