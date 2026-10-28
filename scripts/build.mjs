// Builds the static site into dist/: reads and checks the knowledge base,
// renders every page in both languages and copies the browser assets.
// Exits with a list of errors if the knowledge base breaks a rule.
// Usage: node scripts/build.mjs
import { mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync, copyFileSync, renameSync, cpSync, linkSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadKnowledge, LANGS } from '../src/build/load.mjs';
import { validate } from '../src/build/validate.mjs';
import { createSite } from '../src/build/site.mjs';
import { t } from '../src/build/i18n.mjs';
import { isUnpublished } from '../src/build/deck.mjs';
import { rCompletions } from '../src/build/r-completions.mjs';
import { iconSvg } from '../src/build/icons.mjs';
import { layout, chooser } from '../src/templates/layout.mjs';
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

// Python in the browser (client/runner.js). Pyodide is copied as a whole into
// a folder named after its version, so its files need no hashes of their own.
const PYODIDE = modules('pyodide');
const PYODIDE_FILES = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
const PYODIDE_BASE = `/assets/vendor/pyodide-${JSON.parse(readFileSync(join(PYODIDE, 'package.json'), 'utf8')).version}/`;

// R in the browser (client/r-engine.js): webR as published, without its demo
// console, tests and source maps, and the R packages fetched once by
// `npm run fetch-r-packages` into vendor/webr-repo/.
const WEBR = join(modules('webr'), 'dist');
const WEBR_BASE = `/assets/vendor/webr-${JSON.parse(readFileSync(join(modules('webr'), 'package.json'), 'utf8')).version}/`;
const WEBR_SKIP = /^(repl|tests|webR)$|\.(map|cjs|d\.ts)$/;
const WEBR_REPO = join(ROOT, 'vendor/webr-repo');
const WEBR_REPO_BASE = '/assets/vendor/webr-repo/';

/** Hard links instead of copies where the file system allows: webR is large, and the preview rebuilds often. */
function linkTree(from, to, skip = () => false) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (skip(entry.name)) continue;
    const source = join(from, entry.name);
    const target = join(to, entry.name);
    if (entry.isDirectory()) linkTree(source, target);
    else {
      try {
        linkSync(source, target);
      } catch {
        copyFileSync(source, target);
      }
    }
  }
}

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
        icon: iconSvg(v.types[i.lead.type].icon),
        body: plain(text.file.body),
      };
    }),
    paths: site.paths.map((p) => ({ id: p.id, code: p.lead.code, url: site.url(p, lang), title: site.localize(p, lang).title })),
    projects: site.projects.map((p) => ({ id: p.id, code: p.lead.code, url: site.url(p, lang), title: site.localize(p, lang).title })),
    courses: site.courses.map((c) => ({
      id: c.id,
      code: c.lead.code,
      access: c.lead.access_code,
      url: site.url(c, lang),
      title: site.localize(c, lang).title,
      items: site.courseSteps(c).filter((s) => !s.optional).map((s) => s.id),
      all: site.courseSteps(c).map((s) => s.id),
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
    // Archived content stays in the knowledge base but not on the site.
    for (const section of Object.keys(knowledge.sections)) {
      knowledge.sections[section] = knowledge.sections[section].filter((d) => d.lead.status !== 'archived');
    }
    count = render(knowledge);
  } catch (error) {
    rmSync(DIST, { recursive: true, force: true });
    throw error;
  }
  // Windows refuses the swap while another build (the preview's, say) or a
  // reader holds a file in dist/; a few short retries get past that, and the
  // half-built folder never stays behind.
  for (let attempt = 1; ; attempt++) {
    try {
      rmSync(OUT, { recursive: true, force: true });
      renameSync(DIST, OUT);
      break;
    } catch (error) {
      if (attempt === 5) {
        rmSync(DIST, { recursive: true, force: true });
        throw error;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100 * attempt);
    }
  }
  if (!quiet) console.log(`Built ${count} pages in ${Date.now() - started} ms.`);
  return { ok: true, errors, warnings, count };
}

/** Writes the whole site into DIST and returns the number of pages. */
function render(knowledge) {
  const areas = Object.keys(knowledge.vocabulary.areas);
  rmSync(DIST, { recursive: true, force: true });

  const hashes = {};
  for (const [name, source] of Object.entries(ASSETS)) {
    const target = join(DIST, 'assets', name);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
    hashes[name] = createHash('sha1').update(readFileSync(source)).digest('hex').slice(0, 8);
  }
  // what R editors suggest: functions and the columns of the data sets
  const completions = JSON.stringify(rCompletions(join(ROOT, 'knowledge')));
  writeFileSync(join(DIST, 'assets', 'r-completions.json'), completions);
  hashes['r-completions.json'] = createHash('sha1').update(completions).digest('hex').slice(0, 8);
  for (const file of PYODIDE_FILES) {
    mkdirSync(join(DIST, PYODIDE_BASE), { recursive: true });
    copyFileSync(join(PYODIDE, file), join(DIST, PYODIDE_BASE, file));
  }
  linkTree(WEBR, join(DIST, WEBR_BASE), (name) => WEBR_SKIP.test(name));
  if (existsSync(WEBR_REPO)) linkTree(WEBR_REPO, join(DIST, WEBR_REPO_BASE));
  else console.warn('R packages missing: run `npm run fetch-r-packages` so that R blocks can load dplyr.');
  // shared media of the knowledge base (logos, data sets), under /media/
  cpSync(join(ROOT, 'knowledge/media'), join(DIST, 'media'), { recursive: true });
  // Slide decks as they are, next to the stagekit runtime they expect two
  // folders up: /decks/<id>/index.html loads ../../stagekit/stagekit.js.
  cpSync(join(ROOT, 'vendor/stagekit'), join(DIST, 'stagekit'), { recursive: true, filter: (source) => !source.endsWith('.md') });
  for (const item of knowledge.sections.content.filter((i) => i.lead.type === 'slides')) {
    const from = join(item.dir, 'slides');
    cpSync(from, join(DIST, 'decks', item.id), {
      recursive: true,
      // scripts, drafts, original photos and export frames stay off the site
      filter: (source) => !isUnpublished(source.slice(from.length + 1)),
    });
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
  // name and summary of each area, for the entrance and the area menu
  const entrances = Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      areas.map((key) => {
        const site = createSite(knowledge, key);
        return { key, name: knowledge.vocabulary.areas[key][lang], summary: site.localize(site.home, lang).summary };
      }),
    ]),
  );
  // every area is a part of the site of its own, built from the same knowledge
  for (const area of areas) {
    const site = createSite(knowledge, area);
    const writePage = (lang, page) => {
      write(page.path, String(layout({ site, lang, asset, pyodide: PYODIDE_BASE, webr: { base: WEBR_BASE, repo: WEBR_REPO_BASE }, total: site.items.length, entrances: entrances[lang], ...page })));
      count += 1;
    };
    for (const lang of LANGS) {
      writePage(lang, pages.home(site, lang));
      writePage(lang, pages.items(site, lang));
      writePage(lang, pages.paths(site, lang));
      writePage(lang, pages.courses(site, lang));
      writePage(lang, pages.map(site, lang));
      writePage(lang, pages.projects(site, lang));
      for (const doc of site.projects) writePage(lang, pages.project(site, doc, lang));
      writePage(lang, pages.learning(site, lang));
      for (const doc of site.items) writePage(lang, pages.item(site, doc, lang));
      for (const doc of site.paths) writePage(lang, pages.path(site, doc, lang));
      for (const doc of site.courses) writePage(lang, pages.course(site, doc, lang));
      write(`${site.link(lang)}index.json`, JSON.stringify(clientIndex(site, lang)));
    }
  }

  // the entrance: one page per language that leads into the areas
  for (const lang of LANGS) {
    write(`/${lang}/`, String(chooser({ lang, areas: entrances[lang], asset })));
    count += 1;
  }
  write('404.html', String(layout({ site: createSite(knowledge, areas[0]), lang: 'de', asset, entrances: entrances.de, ...pages.notFound() })));
  write(
    'index.html',
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Hands-on</title>
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
