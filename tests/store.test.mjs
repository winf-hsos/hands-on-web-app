// The editor's writer: saving must not reformat what did not change.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, cpSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadKnowledge } from '../src/build/load.mjs';
import { serialize, createStore } from '../src/editor/store.mjs';

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
  assert.ok(after.includes(`topics: [representing-information, processing-information]\nstatus: ${rest.status}`));
});

test('a new file is written in the canonical style', () => {
  const text = serialize('content', { type: 'term', code: 1234, title: 'Test', summary: 'Kurz.', level: 1, duration: 5, topics: ['solving-problems'], status: 'draft', updated: new Date('2026-10-22') }, 'Text\n', true);
  assert.equal(text, '---\ntype: term\ncode: 1234\ntitle: Test\nsummary: Kurz.\nlevel: 1\nduration: 5\ntopics: [solving-problems]\nstatus: draft\nupdated: 2026-10-22\n---\n\nText\n');
});

test('releasing a draft changes its status line only, and taking it back restores the file', () => {
  // a copy without the large media files, so that nothing in knowledge/ is touched
  const dir = mkdtempSync(join(tmpdir(), 'hocs-store-'));
  try {
    cpSync(ROOT, dir, { recursive: true, filter: (src) => statSync(src).isDirectory() || statSync(src).size < 300_000 });
    const store = createStore(dir);
    // any draft whose German file leads, since drafts get released over time
    const draft = loadKnowledge(dir).sections.content.find((d) => d.files.de && !d.files.de.data.translation_of && d.files.de.data.status === 'draft');
    assert.ok(draft, 'the knowledge base has no draft with a German lead file');
    const path = join(dir, 'content', draft.id, 'de.md');
    const before = readFileSync(path, 'utf8');
    assert.ok(before.includes('status: draft'));

    assert.equal(store.setStatus('content', draft.id, 'published').ok, true);
    const after = readFileSync(path, 'utf8');
    const changed = after.split(/\r?\n/).filter((line, i) => line !== before.split(/\r?\n/)[i]);
    assert.deepEqual(changed, ['status: published']);

    assert.equal(store.setStatus('content', draft.id, 'draft').ok, true);
    assert.equal(readFileSync(path, 'utf8'), before);
    assert.equal(store.setStatus('content', draft.id, 'archived').ok, false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a passage changed in place replaces exactly its characters, an empty one goes with its blank lines', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hocs-store-'));
  try {
    cpSync(ROOT, dir, { recursive: true, filter: (src) => statSync(src).isDirectory() || statSync(src).size < 300_000 });
    const store = createStore(dir);
    const id = 'measuring-your-noise';
    const body = () => store.read('content', id).files.de.body;
    const at = (text) => {
      const start = body().indexOf(text);
      return { start, end: start + text.length, expected: text };
    };

    const heading = '## Was ihr braucht';
    assert.equal(store.patch('content', id, 'de', { body: { ...at(heading), text: '## Was ihr dazu braucht' } }).ok, true);
    assert.ok(body().includes('\n## Was ihr dazu braucht\n'));

    const before = body();
    assert.equal(store.patch('content', id, 'de', { body: { ...at('## Was ihr dazu braucht'), text: '' } }).ok, true);
    // the Python code in the body has blank-line pairs of its own, so count them instead of forbidding them
    const gaps = (text) => (text.replace(/\r/g, '').match(/\n{3}/g) || []).length;
    assert.ok(!body().includes('Was ihr dazu braucht'));
    assert.equal(gaps(body()), gaps(before));
    assert.equal(body().length < before.length, true);

    const stale = store.patch('content', id, 'de', { body: { start: 0, end: 4, expected: 'nope', text: 'x' } });
    assert.equal(stale.ok, false);
    assert.equal(stale.conflict, true);

    assert.equal(store.patch('content', id, 'de', { data: { modules: null } }).ok, true);
    assert.equal('modules' in store.read('content', id).files.de.data, false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
