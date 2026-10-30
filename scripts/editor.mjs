// The editor: a local web app for creating, editing, linking, archiving and
// deleting content in knowledge/. It runs only on this computer, reads and
// writes the Markdown files directly and checks every change with the rules
// of the build before saving. If the site preview (scripts/dev.mjs) is not
// running yet, it is started as well, so that "View on site" works.
// Usage: node scripts/editor.mjs [port]
import { createServer, request } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';
import { createStore } from '../src/editor/store.mjs';
import { renderMarkdown } from '../src/build/markdown.mjs';
import { iconSvg } from '../src/build/icons.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] ?? 4322);
const SITE_PORT = 4321;
const store = createStore(join(ROOT, 'knowledge'));

// Links go to the view with drafts (build/drafts.mjs), in the document's area.
const SECTION_PATH = { content: 'items', paths: 'paths', courses: 'courses', projects: 'projects', pages: '' };
const siteUrl = (section, id, area, lang) =>
  `http://localhost:${SITE_PORT}/drafts/${area}/${lang}/${section === 'pages' ? '' : `${SECTION_PATH[section]}/${id}/`}`;

// Files the browser may load: the editor itself, the site's stylesheet for
// the preview, fonts, and a few browser modules from node_modules.
const STATIC = {
  '/': 'src/editor/ui/index.html',
  '/editor.js': 'src/editor/ui/editor.js',
  '/editor.css': 'src/editor/ui/editor.css',
  '/site.css': 'src/styles/site.css',
  '/fonts/sans.woff2': 'node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2',
  '/fonts/sans-ext.woff2': 'node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-ext-wght-normal.woff2',
  '/fonts/sans-italic.woff2': 'node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-italic.woff2',
  '/fonts/mono.woff2': 'node_modules/@fontsource-variable/atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-wght-normal.woff2',
  '/vendor/js-yaml.mjs': 'node_modules/js-yaml/dist/js-yaml.mjs',
};
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2' };

// Never wait for a password on a terminal that nobody sees; the credential
// manager of Git for Windows asks in a window of its own.
const git = (...args) => spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', timeout: 120_000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });

/**
 * Changes in knowledge/ not yet committed, and commits not yet pushed. A push
 * publishes: GitHub builds the site from it (.github/workflows/pages.yml).
 * `ahead` counts against the remote as last fetched or pushed.
 */
function gitState() {
  const status = git('status', '--porcelain', '--', 'knowledge');
  if (status.status !== 0) return { available: false };
  const remote = git('remote').stdout.split('\n').find(Boolean) ?? null;
  const upstream = git('rev-parse', '--abbrev-ref', '@{u}').status === 0;
  const ahead = remote ? Number(git('rev-list', '--count', upstream ? '@{u}..HEAD' : 'HEAD').stdout.trim()) || 0 : 0;
  return { available: true, changes: status.stdout.split('\n').filter(Boolean).map((l) => l.slice(3)), remote, upstream, ahead };
}

/** Markdown preview with the site's own renderer; links resolve to the site preview. */
function preview({ markdown = '', lang = 'de', quiz = false }) {
  const { docs } = store.list();
  const byId = new Map(docs.map((d) => [d.id, d]));
  return renderMarkdown(markdown.replace(/\s*\{#[a-z0-9-]+\}\s*$/gm, ''), {
    lang,
    quiz,
    resolve: (id) => {
      const d = byId.get(id);
      return d ? { url: siteUrl(d.section, d.id, d.area, lang), title: d.titles[lang] ?? d.titles[d.lead] ?? id } : null;
    },
  });
}

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};

async function body(req) {
  let text = '';
  for await (const chunk of req) text += chunk;
  return text ? JSON.parse(text) : {};
}

async function api(req, res, path) {
  const [, , resource, section, id] = path.split('/');
  if (req.method === 'GET' && resource === 'state') {
    const state = store.list();
    const icons = Object.fromEntries([
      ...Object.entries(state.vocabulary.types ?? {}).map(([type, def]) => [type, iconSvg(def.icon)]),
      ['path', iconSvg('route')],
      ['course', iconSvg('graduation-cap')],
      ['project', iconSvg('hammer')],
      ['page', iconSvg('file')],
    ]);
    return json(res, 200, { ...state, icons, git: gitState(), site: `http://localhost:${SITE_PORT}` });
  }
  if (req.method === 'GET' && resource === 'code') return json(res, 200, { code: store.newCode() });
  if (req.method === 'POST' && resource === 'preview') return json(res, 200, { html: preview(await body(req)) });
  if (resource === 'doc' && section && id) {
    if (req.method === 'GET') {
      const doc = store.read(section, id);
      const area = store.areaOf(doc.files[doc.lead]?.data);
      return json(res, 200, { ...doc, url: Object.fromEntries(['de', 'en'].map((l) => [l, siteUrl(section, id, area, l)])) });
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const result = store.save(section, id, (await body(req)).files ?? {}, { create: req.method === 'POST' });
      return json(res, result.ok ? 200 : 422, result);
    }
    if (req.method === 'DELETE') {
      const result = store.remove(section, id);
      return json(res, result.ok ? 200 : 422, result);
    }
  }
  if (req.method === 'POST' && resource === 'commit') {
    const { message } = await body(req);
    const state = gitState();
    if (!state.available) return json(res, 422, { ok: false, errors: ['This folder is not a git repository.'] });
    if (!state.changes.length) return json(res, 422, { ok: false, errors: ['There are no changes in knowledge/ to commit.'] });
    git('add', '--', 'knowledge');
    const commit = git('commit', '-m', String(message || 'Update knowledge base').slice(0, 500), '--', 'knowledge');
    return json(res, commit.status === 0 ? 200 : 422, { ok: commit.status === 0, output: commit.stdout + commit.stderr });
  }
  if (req.method === 'POST' && resource === 'publish') {
    const state = gitState();
    if (!state.remote) return json(res, 422, { ok: false, errors: ['There is no GitHub repository to publish to yet (git remote).'] });
    const branch = git('branch', '--show-current').stdout.trim();
    const push = state.upstream ? git('push') : git('push', '-u', state.remote, branch);
    return json(res, push.status === 0 ? 200 : 422, { ok: push.status === 0, output: (push.stdout + push.stderr).trim() || push.error?.message });
  }
  return json(res, 404, { ok: false, errors: ['unknown request'] });
}

createServer(async (req, res) => {
  // Only this computer, and only pages served from here: the Host check
  // keeps other websites out via DNS tricks, the custom header keeps them
  // from sending changes through the visitor's browser.
  const host = req.headers.host ?? '';
  if (!/^(localhost|127\.0\.0\.1):\d+$/.test(host)) return res.writeHead(403).end();
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  try {
    if (path.startsWith('/api/')) {
      if (req.method !== 'GET' && req.headers['x-editor'] !== '1') return json(res, 403, { ok: false, errors: ['missing X-Editor header'] });
      return await api(req, res, path);
    }
    const file = STATIC[path];
    if (!file || !existsSync(join(ROOT, file))) return res.writeHead(404).end('not found');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(readFileSync(join(ROOT, file)));
  } catch (error) {
    json(res, error.status ?? 500, { ok: false, errors: [error.message] });
  }
}).listen(PORT, '127.0.0.1', () => console.log(`[editor] http://localhost:${PORT}`));

// Start the site preview unless it is already running.
const probe = request({ host: '127.0.0.1', port: SITE_PORT, path: '/', method: 'HEAD', timeout: 800 });
probe.on('response', () => console.log(`[editor] site preview already running on ${SITE_PORT}`));
probe.on('error', () => {
  const child = spawn(process.execPath, [join(ROOT, 'scripts/dev.mjs'), String(SITE_PORT)], { stdio: 'inherit' });
  const stop = () => child.kill();
  process.on('exit', stop);
  process.on('SIGINT', () => process.exit());
});
probe.end();
