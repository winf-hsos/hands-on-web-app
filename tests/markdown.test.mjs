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
  assert.match(html, /<pre><code class="language-text">Ausgabe/);
});

test('hints and solutions fold away, and several hints are numbered', () => {
  const html = render('> [!HINT]\n> eins\n\n> [!HINT]\n> zwei\n\n> [!SOLUTION]\n> drei\n');
  assert.deepEqual(html.match(/<summary[^>]*>[^<]*<\/summary>/g), [
    '<summary class="callout-title">Tipp 1 anzeigen</summary>',
    '<summary class="callout-title">Tipp 2 anzeigen</summary>',
    '<summary class="callout-title">Lösung anzeigen</summary>',
  ]);
  assert.match(render('> [!HINT]\n> one\n', 'en'), /<summary class="callout-title">Show a hint<\/summary>/);
});

test('the highlighter knows keywords, builtins, strings, numbers, comments and defined names', () => {
  const kinds = tokenize('def area(w):  # size\n    return print("x", 4.5)')
    .filter((t) => t.type)
    .map((t) => `${t.type}:${t.text}`);
  assert.deepEqual(kinds, ['keyword:def', 'function:area', 'comment:# size', 'keyword:return', 'builtin:print', 'string:"x"', 'number:4.5']);
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
