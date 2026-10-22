// The editor's writer: saving must not reformat what did not change.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadKnowledge } from '../src/build/load.mjs';
import { serialize } from '../src/editor/store.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'knowledge');
const files = () =>
  Object.values(loadKnowledge(ROOT).sections)
    .flat()
    .flatMap((doc) => Object.values(doc.files).map((file) => ({ doc, file, text: readFileSync(join(ROOT, file.path), 'utf8') })));
const write = ({ doc, file, text }, data = file.data) => serialize(doc.section, data, file.body, !('translation_of' in file.data), text);

test('saving a file unchanged gives exactly the same text', () => {
  for (const entry of files()) assert.equal(write(entry), entry.text, entry.file.path);
});

test('changing one field changes only that field', () => {
  const entry = files().find((e) => e.file.path === 'projects/lifi/de.md');
  const after = write(entry, { ...entry.file.data, status: 'archived' });
  const changed = after.split('\n').filter((line, i) => line !== entry.text.split('\n')[i]);
  assert.deepEqual(changed, ['status: archived']);
});

test('a new field lands at its place in the canonical order', () => {
  const entry = files().find((e) => e.file.path === 'content/morse-code/de.md');
  const after = write(entry, { ...entry.file.data, modules: ['dup'] });
  const lines = after.split('\n');
  assert.equal(lines[lines.indexOf('modules: [dup]') - 1], 'topics: [representing-information, transferring-information]');
});

test('a removed field disappears with all its lines', () => {
  const entry = files().find((e) => e.file.path === 'content/petzold-code/de.md');
  const { relations, ...rest } = entry.file.data;
  const after = write(entry, rest);
  assert.ok(!after.includes('see_also'));
  assert.ok(after.includes('topics: [representing-information, processing-information]\nstatus: draft'));
});

test('a new file is written in the canonical style', () => {
  const text = serialize('content', { type: 'term', code: 1234, title: 'Test', summary: 'Kurz.', level: 1, duration: 5, topics: ['solving-problems'], status: 'draft', updated: new Date('2026-10-22') }, 'Text\n', true);
  assert.equal(text, '---\ntype: term\ncode: 1234\ntitle: Test\nsummary: Kurz.\nlevel: 1\nduration: 5\ntopics: [solving-problems]\nstatus: draft\nupdated: 2026-10-22\n---\n\nText\n');
});
