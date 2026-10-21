// Builds the static site into dist/: reads and checks the knowledge base,
// renders every page in both languages and copies the browser assets.
// Exits with a list of errors if the knowledge base breaks a rule.
// Usage: node scripts/build.mjs
import { mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync, copyFileSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadKnowledge, LANGS } from '../src/build/load.mjs';
import { validate } from '../src/build/validate.mjs';
import { createSite, url } from '../src/build/site.mjs';
import { t } from '../src/build/i18n.mjs';
import { layout } from '../src/templates/layout.mjs';
import * as pages from '../src/templates/pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// Pages are written to a fresh folder that replaces dist/ only at the end,
// so that a running preview never serves a half-written site.
const OUT = join(ROOT, 'dist');
const DIST = join(ROOT, `.dist-${process.pid}`);
const modules = (name) => join(ROOT, 'node_modules', name);

// Published name -> source file. Fonts keep stable names because the
// stylesheet refers to them; everything else gets a content hash in its URL.
const ASSETS = {
  'site.css': join(ROOT, 'src/styles/site.css'),
  'favicon.svg': join(ROOT, 'public/favicon.svg'),
  'vendor/minisearch.js': modules('minisearch/dist/es/index.js'),
  'vendor/qrcode.mjs': modules('qrcode-generator/dist/qrcode.mjs'),
  'fonts/sans.woff2': modules('@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2'),
  'fonts/sans-ext.woff2': modules('@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-ext-wght-normal.woff2'),
  'fonts/sans-italic.woff2': modules('@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-italic.woff2'),
  'fonts/mono.woff2': modules('@fontsource-variable/atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-wght-normal.woff2'),
};
for (const file of readdirSync(join(ROOT, 'src/client'))) ASSETS[`client/${file}`] = join(ROOT, 'src/client', file);

// Plain text of a Markdown body, good enough for full-text search.
const plain = (md) =>
  md
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|[\]-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Data the browser needs for search, progress transfer and course codes. */
function clientIndex(site, lang) {
  const v = site.vocabulary;
  return {
    items: site.items.map((i) => {
      const text = site.localize(i, lang);
      return {
        id: i.id,
        code: i.lead.code,
        url: site.url(i, lang),
        title: text.title,
        summary: text.summary,
        meta: `${v.types[i.lead.type][lang]}, ${i.lead.duration} ${t(lang, 'minutes')}`,
        color: site.topicColor(i),
        body: plain(text.file.body),
      };
    }),
    paths: site.paths.map((p) => ({ id: p.id, code: p.lead.code, url: site.url(p, lang), title: site.localize(p, lang).title })),
    courses: site.courses.map((c) => ({
      id: c.id,
      code: c.lead.code,
      access: c.lead.access_code,
      url: site.url(c, lang),
      title: site.localize(c, lang).title,
      items: c.lead.units.flatMap((u) => site.steps(u.items).filter((s) => !s.optional).map((s) => s.id)),
    })),
  };
}

export function build({ quiet = false } = {}) {
  const started = Date.now();
  const knowledge = loadKnowledge(join(ROOT, 'knowledge'));
  const { errors, warnings } = validate(knowledge);
  if (warnings.length && !quiet) console.warn(`\n${warnings.length} warning(s):\n  ${warnings.join('\n  ')}`);
  if (errors.length) return { ok: false, errors, warnings };

  let count;
  try {
    count = render(createSite(knowledge));
  } catch (error) {
    rmSync(DIST, { recursive: true, force: true });
    throw error;
  }
  rmSync(OUT, { recursive: true, force: true });
  renameSync(DIST, OUT);
  if (!quiet) console.log(`Built ${count} pages in ${Date.now() - started} ms.`);
  return { ok: true, errors, warnings, count };
}

/** Writes the whole site into DIST and returns the number of pages. */
function render(site) {
  rmSync(DIST, { recursive: true, force: true });

  const hashes = {};
  for (const [name, source] of Object.entries(ASSETS)) {
    const target = join(DIST, 'assets', name);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
    hashes[name] = createHash('sha1').update(readFileSync(source)).digest('hex').slice(0, 8);
  }
  const asset = (name) => {
    if (!hashes[name]) throw new Error(`unknown asset ${name}`);
    return name.startsWith('fonts/') ? `/assets/${name}` : `/assets/${name}?v=${hashes[name]}`;
  };

  const write = (path, text) => {
    const file = join(DIST, path, path.endsWith('.html') || path.endsWith('.json') ? '' : 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };
  let count = 0;
  const writePage = (lang, page) => {
    write(page.path, String(layout({ lang, asset, total: site.items.length, ...page })));
    count += 1;
  };

  for (const lang of LANGS) {
    writePage(lang, pages.home(site, lang));
    writePage(lang, pages.items(site, lang));
    writePage(lang, pages.paths(site, lang));
    writePage(lang, pages.map(site, lang));
    writePage(lang, pages.learning(site, lang));
    for (const doc of site.items) writePage(lang, pages.item(site, doc, lang));
    for (const doc of site.paths) writePage(lang, pages.path(site, doc, lang));
    for (const doc of site.courses) writePage(lang, pages.course(site, doc, lang));
    write(`${url(lang)}index.json`, JSON.stringify(clientIndex(site, lang)));
  }
  write('404.html', String(layout({ lang: 'de', asset, ...pages.notFound() })));
  write(
    'index.html',
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Hands-on Computer Science</title>
<meta http-equiv="refresh" content="1; url=/de/">
<script>const l=(navigator.languages||[navigator.language]).find(x=>/^(de|en)/i.test(x));location.replace(l&&/^en/i.test(l)?'/en/':'/de/')</script>
</head><body><p><a href="/de/">Deutsch</a> · <a href="/en/">English</a></p></body></html>\n`,
  );

  return count;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--json')) {
    // For scripts/dev.mjs: the result as one JSON object on stdout.
    let result;
    try {
      result = build({ quiet: true });
    } catch (error) {
      result = { ok: false, errors: [error.stack] };
    }
    process.stdout.write(JSON.stringify(result));
    process.exit(0);
  }
  const result = build();
  if (!result.ok) {
    console.error(`\nThe knowledge base has ${result.errors.length} error(s):\n  ${result.errors.join('\n  ')}\n`);
    process.exit(1);
  }
}
