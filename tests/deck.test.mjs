// Which files of a deck folder go on the site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isUnpublished } from '../src/build/deck.mjs';

test('scripts, drafts, original photos and export frames stay off the site', () => {
  for (const file of ['skript.md', 'entwurf.md', 'img/original/photo.png', 'export/slides/01.png', 'export/sheet.png']) {
    assert.equal(isUnpublished(file), true, file);
  }
});

test('the deck, its assets and the PDF are published', () => {
  for (const file of ['index.html', 'deck.js', 'theme.css', 'img/photo.jpg', 'export/index.pdf']) {
    assert.equal(isUnpublished(file), false, file);
  }
});
