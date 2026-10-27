// What the page of a dataset says about its file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { datasetInfo, loadingCode } from '../src/build/dataset.mjs';

test('rows and columns are counted, with commas and line breaks inside quotes', () => {
  const root = mkdtempSync(join(tmpdir(), 'dataset-'));
  mkdirSync(join(root, 'media', 'datasets'), { recursive: true });
  mkdirSync(join(root, 'content', 'sample'), { recursive: true });
  writeFileSync(join(root, 'media', 'datasets', 'sample.csv'), 'id,"name, full",note\n1,"Ada, L.","two\nlines"\n2,Bob,\n');
  const info = datasetInfo(join(root, 'content', 'sample'), 'sample.csv');
  assert.deepEqual({ rows: info.rows, columns: info.columns }, { rows: 2, columns: 3 });
});

test('the loading code names the table after the file', () => {
  const code = loadingCode('mds12_schoko_milch.csv');
  assert.match(code.r, /^library\(readr\)\n\nmds12_schoko_milch <- read_csv\("mds12_schoko_milch.csv"\)$/);
  assert.match(code.python, /mds12_schoko_milch = pd.read_csv\("mds12_schoko_milch.csv", low_memory=False\)$/);
  assert.match(loadingCode('2024-prices.csv').r, /^library\(readr\)\n\nd_2024_prices <- /);
});
