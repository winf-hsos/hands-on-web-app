// Runnable code blocks, folded hints and the highlighter.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown } from '../src/build/markdown.mjs';
import { tokenize } from '../src/client/highlight.js';

const render = (md, lang = 'de') => renderMarkdown(md, { lang, resolve: () => null });

test('a python block becomes a runnable box, a static one only shows the code', () => {
  const html = render('```python\nprint(1)\n```\n\n```python static\nx = ...\n```\n\n```text\nAusgabe\n```\n');
  assert.equal((html.match(/class="runner" data-runner/g) ?? []).length, 1);
  assert.match(html, /<pre class="code"><code class="language-python">x = \.\.\.<\/code><\/pre>/);
  assert.match(html, /<pre class="code"><code class="language-text">Ausgabe/);
});

test('a block that is not run can name the file it is saved as', () => {
  const html = render('```python static file=task_1_light_on.py\nled.off()\n```\n\n```text file=notes.txt\nhi\n```\n\n```python file=run.py\nprint(1)\n```\n');
  assert.match(html, /<pre class="code" data-file="task_1_light_on\.py"><code class="language-python">/);
  assert.match(html, /<pre class="code" data-file="notes\.txt"><code class="language-text">hi/);
  // a runnable box has its own buttons and names no file
  assert.equal((html.match(/data-file=/g) ?? []).length, 2);
});

test('hints and solutions fold away, and several hints are numbered', () => {
  const html = render('> [!HINT]\n> eins\n\n> [!HINT]\n> zwei\n\n> [!SOLUTION]\n> drei\n');
  assert.deepEqual(html.match(/<\/svg>[^<]*<\/summary>/g), [
    '</svg>TIPP 1 ANZEIGEN</summary>',
    '</svg>TIPP 2 ANZEIGEN</summary>',
    '</svg>LÖSUNG ANZEIGEN</summary>',
  ]);
  assert.match(render('> [!HINT]\n> one\n', 'en'), /<\/svg>SHOW A HINT<\/summary>/);
});

test('hints are numbered within their section, so that each task starts at 1', () => {
  const html = render('## Aufgabe 1\n\n> [!HINT]\n> a\n\n> [!HINT]\n> b\n\n## Aufgabe 2\n\n> [!HINT]\n> c\n\n## Aufgabe 3\n\n> [!HINT]\n> d\n\n> [!HINT]\n> e\n');
  assert.deepEqual(html.match(/<\/svg>[^<]*<\/summary>/g), [
    '</svg>TIPP 1 ANZEIGEN</summary>',
    '</svg>TIPP 2 ANZEIGEN</summary>',
    '</svg>TIPP ANZEIGEN</summary>',
    '</svg>TIPP 1 ANZEIGEN</summary>',
    '</svg>TIPP 2 ANZEIGEN</summary>',
  ]);
});

test('every callout title stands in capitals after an icon of its kind', () => {
  const html = render('> [!NOTE]\n> a\n\n> [!TIP]\n> b\n\n> [!IMPORTANT]\n> c\n\n> [!WARNING]\n> d\n\n> [!CAUTION]\n> e\n');
  assert.deepEqual(html.match(/<\/svg>[^<]*<\/p>/g), ['</svg>HINWEIS</p>', '</svg>TIPP</p>', '</svg>WICHTIG</p>', '</svg>ACHTUNG</p>', '</svg>VORSICHT</p>']);
  assert.equal((html.match(/<p class="callout-title"><svg class="callout-icon"[^>]*aria-hidden="true">/g) ?? []).length, 5);
});

test('models in one paragraph become a row of viewers with captions', () => {
  const html = render('![Die Wanne](model:media/a.stl "Wanne") ![Der Deckel](model:media/b.stl "Deckel")\n');
  assert.match(html, /^<div class="model-row"[^>]*><figure class="model" data-model="media\/a.stl"><div class="model-canvas" role="img" aria-label="Die Wanne"><\/div><figcaption>Wanne<\/figcaption><\/figure><figure class="model" data-model="media\/b.stl">/);
  assert.doesNotMatch(html, /<img/);
});

test('photos with a title become figures with captions, side by side', () => {
  const html = render('![Vorn](media/a.jpg "Von vorn") ![Hinten](media/b.jpg "Von hinten")\n');
  assert.match(html, /^<div class="photo-row"[^>]*><figure class="photo"><img src="media\/a.jpg" alt="Vorn"[^>]*><figcaption>Von vorn<\/figcaption><\/figure><figure class="photo">/);
  assert.doesNotMatch(render('![Vorn](media/a.jpg)\n'), /photo-row/);
});

test('top-level sections get ids from their text, quiz questions do not', () => {
  const html = render('## Größe und Maß\n\ntext\n\n### Größe und Maß\n\n> ## inside\n\n## Phase {#own}\n');
  assert.match(html, /<h2 id="groesse-und-mass">/);
  assert.match(html, /<h3 id="groesse-und-mass-2">/);
  assert.doesNotMatch(html, /id="inside"|id="phase/);
  assert.doesNotMatch(renderMarkdown('## Frage\n\n- [x] a\n- [ ] b\n', { lang: 'de', quiz: true, resolve: () => null }), /<h2 id=/);
});

test('the highlighter knows keywords, builtins, strings, numbers, comments and defined names', () => {
  const kinds = tokenize('def area(w):  # size\n    return print("x", 4.5)')
    .filter((t) => t.type)
    .map((t) => `${t.type}:${t.text}`);
  assert.deepEqual(kinds, ['keyword:def', 'function:area', 'comment:# size', 'keyword:return', 'builtin:print', 'string:"x"', 'number:4.5']);
});

test('a docstring is one string over all its lines, also while it is still open', () => {
  const kinds = (code) => tokenize(code).filter((t) => t.type).map((t) => t.type);
  assert.deepEqual(kinds('"""\nThis is for\nyou.\n"""\nx = 1'), ['string', 'number']);
  assert.deepEqual(kinds("'''open\nis not\n"), ['string']);
});

test('an r block runs too and says which language it is, and a verb-demo block becomes its place', () => {
  const html = render('```r\nsurvey |> nrow()\n```\n\n```r static\nlibrary(dplyr)\n```\n\n```verb-demo\n```\n');
  assert.equal((html.match(/class="runner" data-runner="" data-lang="r"/g) ?? []).length, 1);
  assert.match(html, /<pre class="code"><code class="language-r">/);
  assert.match(html, /<div class="verb-demo" data-verb-demo=""><\/div>/);
});

test('the R highlighter knows the pipe, the arrow, dplyr verbs, NA and names with dots', () => {
  const kinds = tokenize('x <- survey |> filter(is.na(age), diet %in% c("vegan")) # NA\nNA', 'r')
    .filter((t) => t.type)
    .map((t) => `${t.type}:${t.text}`);
  assert.deepEqual(kinds, ['op:<-', 'op:|>', 'builtin:filter', 'builtin:is.na', 'op:%in%', 'builtin:c', 'string:"vegan"', 'comment:# NA', 'keyword:NA']);
});

test('a monty-hall block becomes the place of the game with three doors', () => {
  assert.match(render('```monty-hall\n```\n'), /<div class="monty-hall" data-monty-hall=""><\/div>/);
});

test('a byte-switchboard block becomes the place of the eight switches', () => {
  assert.match(render('```byte-switchboard\n```\n'), /<div class="byte-switchboard" data-byte-switchboard=""><\/div>/);
});

test('a word-guess block passes its sentences, one per line, to the guessing game', () => {
  assert.match(render('```word-guess\nthe hen sleeps in the barn\n\nthe sheep is white\n```\n'), /data-word-guess="\[[^"]*the hen sleeps in the barn[^"]*,[^"]*the sheep is white[^"]*\]"/);
});

test('a meaning-map block passes its texts, one per line, to the map of meaning', () => {
  assert.match(render('```meaning-map\nThe bank raised its interest rates.\n\nA python swallowed a whole rabbit.\n```\n'), /data-meaning-map="\[[^"]*The bank raised its interest rates\.[^"]*,[^"]*A python swallowed a whole rabbit\.[^"]*\]"/);
});

test('a word-arithmetic block names the file of words it searches', () => {
  assert.match(render('```word-arithmetic\nmedia/arithmetic-words.json\n```\n'), /<div class="word-arithmetic" data-word-arithmetic="media\/arithmetic-words.json"><\/div>/);
});

test('a gallery block becomes small pictures in groups that link to their files, with the download above', () => {
  const html = render('```gallery\ndownload: media/cards.pdf\ngroups:\n  - title: Role cards\n    images:\n      - { src: media/cards/a.svg, alt: Role card Model }\n```\n');
  assert.match(html, /<figure class="gallery" data-gallery="[^"]+">/);
  assert.match(html, /<a class="gallery-download" href="media\/cards.pdf" download>/);
  assert.match(html, /<p class="gallery-title">Role cards<\/p>/);
  assert.match(html, /<a class="gallery-item" href="media\/cards\/a.svg"[^>]*><img src="media\/cards\/a.svg" alt="Role card Model" loading="lazy"/);
});

test('every demonstrator sits in a frame that gets the full-screen button', () => {
  for (const name of ['verb-demo', 'monty-hall', 'byte-switchboard', 'photo-digitiser', 'audio-digitiser', 'question-game', 'prefix-trap', 'hex-viewer', 'noisy-sensor', 'distinguishability-lab', 'next-word', 'word-guess', 'meaning-map', 'word-arithmetic', 'data-table']) {
    assert.match(render('```' + name + '\n```\n'), new RegExp(`<div class="demo" data-demo=""><div class="${name}" data-${name}=""></div></div>`));
  }
});

test('a quote inside an option is its reason, hidden until answered; one after the list explains the question', () => {
  const md = '## Welche Basis? {#ns-001}\n\n- [x] Zwei\n  > Zwei Zustände.\n- [ ] Zehn\n\n> Allgemein.\n';
  const html = renderMarkdown(md, { lang: 'de', quiz: true, resolve: () => null });
  assert.match(html, /data-question="ns-001"/);
  assert.equal((html.match(/class="quiz-reason" hidden/g) ?? []).length, 1);
  assert.match(html, /<li class="quiz-option" data-correct="true">[\s\S]*<div class="quiz-reason" hidden>[\s\S]*Zwei Zustände\.[\s\S]*<\/li>/);
  assert.match(html, /<div class="quiz-explanation" hidden>[\s\S]*Allgemein\./);
});

test('with sourceMap every top-level block names its place in the source, a quiz question spanning its parts', () => {
  const md = 'Eins\n\n```r\nx\n```\n\n## Frage\n\n- [x] ja\n- [ ] nein\n';
  const html = renderMarkdown(md, { lang: 'de', resolve: () => null, sourceMap: true, quiz: true });
  const places = [...html.matchAll(/data-src="(\d+)-(\d+)"/g)].map(([, a, b]) => md.slice(Number(a), Number(b)));
  assert.deepEqual(places, ['Eins', '```r\nx\n```', '## Frage\n\n- [x] ja\n- [ ] nein']);
  assert.doesNotMatch(render(md), /data-src/);
});

test('empty cells of a table become fields to fill in, labelled by their row and column', () => {
  const html = render('| Bedingung | r | g |\n|---|---|---|\n| Erwartung | 255 | |\n| Hand | | |\n');
  assert.equal((html.match(/class="table-input"/g) ?? []).length, 3);
  assert.match(html, /<table data-fillable="1"/);
  assert.match(html, /data-cell="0-2" aria-label="Erwartung, g"/);
  assert.doesNotMatch(render('| a | b |\n|---|---|\n| 1 | 2 |\n'), /table-input|data-fillable/);
});

test('a shell-demo block becomes the folder tree and command line, with its scenario as data', () => {
  const html = render('```shell-demo\nstart: Documents\ntree:\n  Documents: {}\n```\n');
  assert.match(html, /<div class="demo" data-demo=""><div class="shell-demo" data-shell-demo="\{&#x22;start&#x22;:&#x22;Documents&#x22;,&#x22;tree&#x22;:\{&#x22;Documents&#x22;:\{\}\}\}"><\/div><\/div>/);
});
