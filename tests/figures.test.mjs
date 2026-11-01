// Drawings on content pages (docs/figures.md): where a text shows one, and
// the rules a figures.js has to keep.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown } from '../src/build/markdown.mjs';
import { figureRefs, figureRules } from '../src/build/figures.mjs';

const render = (md) => renderMarkdown(md, { lang: 'de', resolve: () => null });

test('a figure image alone in its paragraph becomes the place of a drawing', () => {
  const html = render('Text davor.\n\n![Ein Baum aus Ordnern](figure:folder-tree "Der Pfad durch den Baum.")\n');
  assert.match(html, /<figure class="drawing" data-figure="folder-tree"><div class="drawing-canvas" id="figure-folder-tree" role="img" aria-label="Ein Baum aus Ordnern"><\/div><figcaption>Der Pfad durch den Baum.<\/figcaption><\/figure>/);
  assert.doesNotMatch(html, /<img/);
  // without a caption, there is no figcaption
  assert.doesNotMatch(render('![Baum](figure:tree)\n'), /figcaption/);
});

test('an ordinary image stays an image', () => {
  assert.match(render('![Bild](media/byte.de.svg)\n'), /<img src="media\/byte.de.svg" alt="Bild">/);
});

test('the names a text shows are found', () => {
  assert.deepEqual(figureRefs('![a](figure:one)\n\nText\n\n![b](figure:two-parts "c")'), ['one', 'two-parts']);
});

test('only the four sizes of stagekit and no colour values of its own', () => {
  assert.deepEqual(figureRules("d.label(0, 0, 'x', { size: 32 });\nd.box(0, 0, 9, 9, 'y', { size: 48 });"), []);
  assert.deepEqual(figureRules("d.label(0, 0, 'x', { size: 30 });"), ['line 1: size 30; only 32, 48 or 80']);
  assert.deepEqual(figureRules("d.line(0, 0, 9, 9, { color: '#ff0000' });"), ['line 1: a colour value; use the colours of the theme']);
  // a comment may name anything
  assert.deepEqual(figureRules('// 30 × 0.6 = 18, size: 30 would be wrong, #fff too'), []);
});
