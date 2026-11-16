// What the page of a dataset says about its file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { datasetInfo, datasetsUsed, loadingCode, rdsFile } from '../src/build/dataset.mjs';

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

test('an RDS file next to the CSV is offered, and R reads it with readRDS()', () => {
  const root = mkdtempSync(join(tmpdir(), 'dataset-'));
  mkdirSync(join(root, 'media', 'datasets'), { recursive: true });
  mkdirSync(join(root, 'content', 'sample'), { recursive: true });
  writeFileSync(join(root, 'media', 'datasets', 'sample.csv'), 'id\n1\n');
  const item = join(root, 'content', 'sample');
  assert.equal(rdsFile(item, 'sample.csv'), null);
  writeFileSync(join(root, 'media', 'datasets', 'sample.rds'), 'x');
  assert.equal(rdsFile(item, 'sample.csv'), 'sample.rds');
  const code = loadingCode('sample.csv', 'sample.rds', 'or with types');
  assert.match(code.r, /read_csv\("sample.csv"\)\n\n# or with types\nsample <- readRDS\("sample.rds"\)$/);
  assert.doesNotMatch(code.python, /rds/);
});

test('a page works with the data sets its R boxes use, by any of their names, and those it lists', () => {
  const files = new Map([
    ['anscombe.csv', 'anscombe-quartet'],
    ['milk_survey_compact.csv', 'milk-survey-compact'],
    ['mds12_schoko_milch.csv', 'milk-chocolate-survey'],
    ['shapes.csv', 'same-stats-shapes'],
  ]);
  const body = [
    'Text that mentions survey, which does not count.',
    '```r',
    'anscombe |>',
    '  summarize(n = n())',
    '```',
    'The shapes: [[same-stats-shapes]].',
    '```r static',
    'survey |>',
    '  count(diet)',
    '```',
    '```python',
    'shapes = 1',
    '```',
  ].join('\n');
  const names = { survey: 'milk_survey_compact.csv' };
  assert.deepEqual(datasetsUsed(body, { files, names, listed: ['same-stats-shapes'] }), ['anscombe-quartet', 'same-stats-shapes', 'milk-survey-compact']);
  // the page's own r_datasets win over the names every page knows
  assert.deepEqual(datasetsUsed(body, { files, names: { ...names, survey: 'mds12_schoko_milch.csv' } }), ['anscombe-quartet', 'milk-chocolate-survey']);
  // a name inside a longer one is not the name
  assert.deepEqual(datasetsUsed('```r\nmy_anscombe <- anscombe2\n```', { files }), []);
});
