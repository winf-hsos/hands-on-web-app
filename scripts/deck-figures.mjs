// Renders the figures of a deck for the article in the same item, in English
// and German, into the item's media/ folder (`<name>.en.svg`, `<name>.de.svg`).
// The figures are drawn by the deck's own functions (slides/deck.js, listed in
// slides/figures.js), so a change on a slide changes the figure in the article
// with it; the article only ever shows figures made this way (Nicolas,
// 2026-11-02). The deck switches its labels to German when `window.deckLang`
// is "de".
//
// Run after a build, since stagekit's figures.py needs the runtime next to the
// deck, as in dist/decks/:
//   npm run build && node scripts/deck-figures.mjs problem-decomposition [--stagekit path]
// The deck number-systems-slides serves lessons of its own and has
// scripts/number-systems-figures.mjs.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { deckFile } from '../src/build/deck.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const at = args.indexOf('--stagekit');
const STAGEKIT = at >= 0 ? args.splice(at, 2)[1] : 'C:/code/stagekit';
const ids = args;
if (!ids.length) {
  console.error('usage: node scripts/deck-figures.mjs <item> [<item> …] [--stagekit path]');
  process.exit(1);
}

for (const id of ids) {
  const item = join(ROOT, 'knowledge/content', id);
  const deck = join(ROOT, 'dist/decks', id);
  const found = deckFile(item);
  if (found.error || !existsSync(join(item, 'slides/figures.js'))) {
    console.error(`${id}: needs a deck with slides/figures.js`);
    process.exit(1);
  }
  if (!existsSync(join(deck, found.file))) {
    console.error(`dist/decks/${id} is missing: run npm run build first`);
    process.exit(1);
  }
  // the German copy sits beside the deck, so that it finds the runtime the same way
  const german = join(ROOT, `dist/decks/_${id}-de`);
  const out = join(ROOT, `dist/_${id}-figures`);
  for (const dir of [german, out]) rmSync(dir, { recursive: true, force: true });
  cpSync(deck, german, { recursive: true });
  writeFileSync(join(german, 'figures.js'), `window.deckLang = "de";\n${readFileSync(join(deck, 'figures.js'), 'utf8')}`);

  const media = join(item, 'media');
  mkdirSync(media, { recursive: true });
  let count = 0;
  for (const [lang, dir] of [['en', deck], ['de', german]]) {
    const svgs = join(out, lang);
    mkdirSync(svgs, { recursive: true });
    // a second try when Chrome from the first language had not yet let go
    let run;
    for (let attempt = 0; attempt < 2 && !run?.stdout.includes('.svg'); attempt++)
      run = spawnSync('python', [join(STAGEKIT, 'tools/figures.py'), join(dir, found.file), '--out', svgs, '--theme', 'light'], { encoding: 'utf8' });
    process.stdout.write(run.stdout);
    process.stderr.write(run.stderr);
    if (run.status !== 0) process.exit(run.status ?? 1);
    for (const file of readdirSync(svgs).filter((f) => f.endsWith('.svg'))) {
      copyFileSync(join(svgs, file), join(media, file.replace(/\.svg$/, `.${lang}.svg`)));
      count++;
    }
  }
  for (const dir of [german, out]) rmSync(dir, { recursive: true, force: true });
  console.log(`[figures] ${id}: ${count / 2} figures in two languages`);
}
