// Renders the figures of the deck number-systems-slides for the lessons on number systems,
// in English and German, and puts each into the media/ folder of the item
// that shows it (`<name>.en.svg`, `<name>.de.svg`). The figures are drawn by
// the deck's own functions (slides/deck.js, slides/figures.js), so a change
// on a slide changes the figure in the lesson with it.
//
// Run after a build, since stagekit's figures.py needs the runtime next to the
// deck, as in dist/decks/:
//   npm run build && node scripts/number-systems-figures.mjs [path/to/stagekit]
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STAGEKIT = process.argv[2] ?? 'C:/code/stagekit';
const DECK = join(ROOT, 'dist/decks/number-systems-slides');
const CONTENT = join(ROOT, 'knowledge/content');

// which figure belongs to which item
const PLACES = {
  'place-value-ten': 'place-value-systems',
  'place-value-eight': 'place-value-systems',
  'colours-as-digits': 'place-value-systems',
  'counting-in-binary': 'binary-numbers',
  'why-two-states': 'why-two-states',
  'byte-place-values': 'byte',
  'hex-nibbles': 'hexadecimal',
  'hex-dump': 'hexadecimal',
  'unit-ladders': 'binary-prefixes',
  'missing-gigabytes': 'binary-prefixes',
};

if (!existsSync(join(DECK, 'number-systems.html'))) {
  console.error('dist/decks/number-systems-slides is missing: run npm run build first');
  process.exit(1);
}

function render(deckDir, out) {
  const run = spawnSync('python', [join(STAGEKIT, 'tools/figures.py'), join(deckDir, 'number-systems.html'), '--out', out, '--theme', 'light'], {
    encoding: 'utf8',
  });
  process.stdout.write(run.stdout);
  process.stderr.write(run.stderr);
  if (run.status !== 0) process.exit(run.status ?? 1);
}

// the German copy sits beside the deck, so that it finds the runtime the same way
const tmp = join(ROOT, 'dist/_number-systems-figures');
const german = join(ROOT, 'dist/decks/_number-systems-de');
for (const dir of [tmp, german]) rmSync(dir, { recursive: true, force: true });
cpSync(DECK, german, { recursive: true });
writeFileSync(join(german, 'figures.js'), `window.deckLang = "de";\n${readFileSync(join(DECK, 'figures.js'), 'utf8')}`);

for (const [lang, deckDir] of [['en', DECK], ['de', german]]) {
  const out = join(tmp, `svg-${lang}`);
  mkdirSync(out, { recursive: true });
  render(deckDir, out);
  for (const [name, item] of Object.entries(PLACES)) {
    const media = join(CONTENT, item, 'media');
    mkdirSync(media, { recursive: true });
    copyFileSync(join(out, `${name}.svg`), join(media, `${name}.${lang}.svg`));
  }
}
for (const dir of [tmp, german]) rmSync(dir, { recursive: true, force: true });
console.log(`[figures] ${Object.keys(PLACES).length} figures in two languages`);
