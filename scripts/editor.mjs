// The editor: a local web app for creating, editing, linking, archiving and
// deleting content in knowledge/. It runs only on this computer, reads and
// writes the Markdown files directly and checks every change with the rules
// of the build before saving.
//
// Its start page is the site itself, with drafts (Nicolas, 2026-11-01): every
// address outside /edit/ and /api/ is passed on to the site preview
// (scripts/dev.mjs, started here if it is not running yet), and every page
// gets the editor banner with "Bearbeiten" and "Freigeben" (ui/overlay.js).
// The forms live under /edit/.
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

// Links go to the view with drafts (build/drafts.mjs), in the document's
// area, as served by this editor, so that the banner comes along.
const SECTION_PATH = { content: 'items', paths: 'paths', courses: 'courses', projects: 'projects', pages: '' };
const siteUrl = (section, id, area, lang) =>
  `/drafts/${area}/${lang}/${section === 'pages' ? '' : `${SECTION_PATH[section]}/${id}/`}`;

// Files the browser may load: the editor itself, the banner on the site
// pages, the site's stylesheet for the preview, fonts, and a few browser
// modules from node_modules. All under /edit/, so that they never shadow a
// page of the site.
const STATIC = {
  '/edit/': 'src/editor/ui/index.html',
  '/edit/editor.js': 'src/editor/ui/editor.js',
  '/edit/editor.css': 'src/editor/ui/editor.css',
  '/edit/overlay.js': 'src/editor/ui/overlay.js',
  '/edit/overlay.css': 'src/editor/ui/overlay.css',
  '/edit/site.css': 'src/styles/site.css',
  '/edit/fonts/sans.woff2': 'node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2',
  '/edit/fonts/sans-ext.woff2': 'node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-ext-wght-normal.woff2',
  '/edit/fonts/sans-italic.woff2': 'node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-italic.woff2',
  '/edit/fonts/mono.woff2': 'node_modules/@fontsource-variable/atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-wght-normal.woff2',
  '/edit/vendor/js-yaml.mjs': 'node_modules/js-yaml/dist/js-yaml.mjs',
};

// What every site page gets on its way through the editor.
const OVERLAY_HEAD = '<link rel="stylesheet" href="/edit/overlay.css">';
const OVERLAY_BODY = '<script type="module" src="/edit/overlay.js"></script>';

/**
 * Passes a request on to the site preview. Pages come back with the editor
 * banner; everything else, including the reload stream of the preview, is
 * piped through unchanged.
 */
function proxy(req, res) {
  const upstream = request(
    { host: '127.0.0.1', port: SITE_PORT, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${SITE_PORT}`, 'accept-encoding': 'identity' } },
    (up) => {
      if (!String(up.headers['content-type']).startsWith('text/html')) {
        res.writeHead(up.statusCode, up.headers);
        return up.pipe(res);
      }
      let text = '';
      up.setEncoding('utf8');
      up.on('data', (chunk) => (text += chunk));
      up.on('end', () => {
        const headers = { ...up.headers };
        delete headers['content-length'];
        res.writeHead(up.statusCode, headers);
        res.end(text.replace('</head>', `${OVERLAY_HEAD}</head>`).replace('</body>', `${OVERLAY_BODY}</body>`));
      });
    },
  );
  upstream.on('error', () => {
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8', 'Retry-After': '1' });
    res.end('<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="1"><p style="font:16px system-ui;margin:40px">Die Vorschau startet noch …</p>');
  });
  req.pipe(upstream);
}

/** The document a page of the site shows, from its address; null for lists and other pages. */
function docAt(path) {
  const m = path.match(/^(?:\/drafts)?\/([a-z]+)\/(de|en)\/(?:(items|paths|courses|projects)\/([a-z0-9-]+)\/)?$/);
  if (!m) return null;
  const [, area, lang, kind, id] = m;
  const { docs } = store.list();
  const doc = kind
    ? docs.find((d) => d.section === (kind === 'items' ? 'content' : kind) && d.id === id)
    : docs.find((d) => d.section === 'pages' && d.area === area);
  if (!doc) return null;
  const { section, status, errors, problems } = doc;
  // Not yet live: changed in the folder and not committed, or committed and not pushed.
  const folder = `knowledge/${section}/${doc.id}`;
  const upstream = git('rev-parse', '--abbrev-ref', '@{u}').status === 0;
  const pending = Boolean(git('status', '--porcelain', '--', folder).stdout.trim() || (upstream && git('diff', '--name-only', '@{u}', 'HEAD', '--', folder).stdout.trim()));
  return { section, id: doc.id, lang, status, errors, problems, pending, title: doc.titles[lang] ?? doc.titles[doc.lead] ?? doc.id };
}

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
    return json(res, 200, { ...state, icons, git: gitState(), site: '' });
  }
  // what the banner of a site page needs: the document on it and the git state
  if (req.method === 'GET' && resource === 'page') {
    return json(res, 200, { doc: docAt(new URL(req.url, 'http://x').searchParams.get('path') ?? ''), git: gitState() });
  }
  if (req.method === 'PUT' && resource === 'status' && section && id) {
    const result = store.setStatus(section, id, (await body(req)).status);
    return json(res, result.ok ? 200 : 422, result);
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
    if (path === '/') return res.writeHead(302, { Location: '/drafts/de/' }).end();
    if (path === '/edit') return res.writeHead(301, { Location: '/edit/' }).end();
    if (!path.startsWith('/edit/')) return proxy(req, res);
    const file = STATIC[path];
    if (!file || !existsSync(join(ROOT, file))) return res.writeHead(404).end('not found');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(readFileSync(join(ROOT, file)));
  } catch (error) {
    json(res, error.status ?? 500, { ok: false, errors: [error.message] });
  }
}).listen(PORT, '127.0.0.1', () => console.log(`[editor] http://localhost:${PORT} (the site with drafts; forms under /edit/)`));

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
