// Names of functions and packages become code on every page.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { codeParts, plainText } from '../src/client/code-terms.js';
import { codeInHtml } from '../src/build/code-terms.mjs';

const codes = (text) => codeParts(text).filter((p) => p.code).map((p) => p.text);

test('calls, methods, package names and backticks are code', () => {
  assert.deepEqual(codes('Spalten auswählen mit select()'), ['select()']);
  assert.deepEqual(codes('dplyr::filter(), df.query() und is.na()'), ['dplyr::filter()', 'df.query()', 'is.na()']);
  assert.deepEqual(codes('die dplyr-Verben und ggplot2.'), ['dplyr', 'ggplot2']);
  assert.deepEqual(codes('ein Titel mit `|>`'), ['|>']);
});

test('ordinary words, plurals in brackets, paths and calls with arguments stay text', () => {
  assert.deepEqual(codes('Spalte(n) und Variable(n)'), []);
  assert.deepEqual(codes('github.com/tidyverse/dplyr und mydplyr'), []);
  assert.deepEqual(codes('base und stats'), []);
  assert.deepEqual(codes('f(x) und mean(age)'), []);
});

test('pages get <code> in their text, never in attributes, scripts or titles', () => {
  const page = '<title>select()</title><h1 data-x="dplyr">Mit select() und dplyr</h1><script>const a = "dplyr";</script><code>filter()</code><select><option>filter()</option></select>';
  assert.equal(
    codeInHtml(page),
    '<title>select()</title><h1 data-x="dplyr">Mit <code>select()</code> und <code>dplyr</code></h1><script>const a = "dplyr";</script><code>filter()</code><select><option>filter()</option></select>',
  );
  assert.equal(plainText('ein Titel mit `|>`'), 'ein Titel mit |>');
});
