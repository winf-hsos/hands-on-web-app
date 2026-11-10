// What the R editor suggests where: columns inside a pipe, after $, names
// assigned in the block, functions, and nothing inside strings and comments.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suggest, nextIndent } from '../src/client/r-context.js';

const tables = {
  survey: [['id', 'int'], ['age', 'int'], ['diet', 'chr'], ['milk_brand', 'chr'], ['milk_freq', 'chr']],
  rewe: [['price', 'dbl'], ['product_name', 'chr']],
};
const functions = [['filter', 'filter(.data, ...)', 'dplyr'], ['mean', 'mean(x, ...)', 'base'], ['mutate', 'mutate(.data, ...)', 'dplyr'], ['ages', 'never', 'base']];

/** Suggestions with the cursor at §, as "kind:name". */
function at(code, options = {}) {
  const cursor = code.indexOf('§');
  const result = suggest(code.replace('§', ''), cursor, { tables, functions, ...options });
  return result?.items.map((i) => `${i.kind}:${i.name}`) ?? null;
}

test('inside a call of a pipe the columns of its table come first', () => {
  assert.deepEqual(at('survey |> filter(di§)'), ['column:diet']);
  assert.deepEqual(at('survey %>% filter(di§)'), ['column:diet']);
});

test('a pipe over several lines keeps its table', () => {
  assert.deepEqual(at('survey |>\n  filter(age > 50) |>\n  select(mi§)'), ['column:milk_brand', 'column:milk_freq']);
});

test('after a finished statement the table no longer counts', () => {
  assert.deepEqual(at('survey |> nrow()\nmean(mi§)'), null);
});

test('after table$ only that table\'s columns are offered, even without typing', () => {
  const code = 'mean(survey$';
  assert.deepEqual(suggest(code, code.length, { tables, functions }).items.map((i) => i.name), ['id', 'age', 'diet', 'milk_brand', 'milk_freq']);
});

test('columns made by mutate() count as columns further down the pipe', () => {
  const code = 'survey |>\n  mutate(decade = age %/% 10) |>\n  filter(dec';
  assert.deepEqual(suggest(code, code.length, { tables, functions }).items.map((i) => `${i.kind}:${i.name}`), ['column:decade']);
});

test('a name assigned from a table carries its columns', () => {
  const code = 'vegans <- survey |> filter(diet == "vegan")\nvegans$ag';
  assert.deepEqual(suggest(code, code.length, { tables, functions }).items.map((i) => i.name), ['age']);
});

test('names assigned in the block are offered, before functions of the same start', () => {
  const code = 'ages <- c(56, 55)\nmean(ag';
  assert.deepEqual(suggest(code, code.length, { tables, functions }).items.map((i) => `${i.kind}:${i.name}`), ['variable:ages']);
});

test('outside a call there are no columns, but tables and functions', () => {
  const code = 'su';
  assert.deepEqual(suggest(code, code.length, { tables, functions }).items.map((i) => `${i.kind}:${i.name}`), ['table:survey']);
  const code2 = 'mu';
  assert.deepEqual(suggest(code2, code2.length, { tables, functions }).items.map((i) => `${i.kind}:${i.name}`), ['function:mutate']);
});

test('one letter is not enough unless asked for, except for the columns of a pipe', () => {
  const code = 'x <- m';
  assert.equal(suggest(code, code.length, { tables, functions }), null);
  assert.equal(suggest(code, code.length, { tables, functions, force: true }).items[0].name, 'mean');
  const piped = 'survey |>\n  filter(a';
  assert.equal(suggest(piped, piped.length, { tables, functions }).items[0].name, 'age');
});

test('nothing inside strings and comments, and nothing for what is already complete', () => {
  for (const code of ['survey |> filter(diet == "veg', '# mea', 'x <- 1 # comment about mea']) {
    assert.equal(suggest(code, code.length, { tables, functions }), null, code);
  }
  const code = 'mean';
  assert.equal(suggest(code, code.length, { tables, functions }), null);
});

test('columns are found for ggplot() and aes() too', () => {
  const code = 'ggplot(rewe, aes(x = pr';
  assert.equal(suggest(code, code.length, { tables, functions }).items[0].name, 'price');
});

test('only the offered tables are suggested by name, but every table keeps its columns', () => {
  assert.deepEqual(at('su§', { offered: [] }), null);
  assert.deepEqual(at('survey$ag§', { offered: [] }), ['column:age']);
});

test('a function carries its signature and the package it comes from', () => {
  const code = 'survey |> fil';
  const [item] = suggest(code, code.length, { tables, functions }).items;
  assert.deepEqual(item, { name: 'filter', kind: 'function', detail: 'filter(.data, ...)', pkg: 'dplyr' });
});

test('a plot built layer by layer with + still knows its table in aes()', () => {
  const code = 'rewe |>\n  ggplot() +\n  aes(y = pr';
  assert.deepEqual(suggest(code, code.length, { tables, functions }).items.map((i) => i.name), ['price', 'product_name']);
});

test('after package:: come all functions of that package, also those the page does not use', () => {
  const known = [...functions, ['sd', 'sd(x, na.rm = FALSE)', 'stats'], ['select', 'select(.data, ...)', 'dplyr']];
  const names = (code, options = {}) => suggest(code, code.length, { tables, functions, known, ...options })?.items.map((i) => i.name);
  assert.deepEqual(names('dplyr::'), ['filter', 'mutate', 'select']);
  assert.deepEqual(names('survey |> dplyr::s'), ['select']);
  assert.deepEqual(names('stats::'), ['sd']);
  assert.equal(names('nothing::'), undefined);
});

test('a call written with its package still knows the table of the pipe', () => {
  const code = 'survey |> dplyr::filter(di';
  assert.deepEqual(suggest(code, code.length, { tables, functions }).items.map((i) => i.name), ['diet']);
});

test('constants come before functions, keywords without a package', () => {
  const constants = [['pi', '<dbl> 3.141593', 'base'], ['TRUE', '<lgl>', null]];
  const items = (code) => suggest(code, code.length, { tables, functions, constants })?.items.map((i) => `${i.kind}:${i.name}:${i.pkg}`);
  assert.deepEqual(items('x <- TR'), ['constant:TRUE:null']);
  assert.deepEqual(items('area <- pi'), undefined); // typed in full, nothing left to suggest
  assert.deepEqual(suggest('base::', 6, { tables, functions, constants }).items.map((i) => i.name), ['pi', 'ages', 'mean']);
});

test('Enter keeps the steps of a pipe or a plot one level in, however many came before', () => {
  assert.equal(nextIndent('survey |>'), '  ');
  assert.equal(nextIndent('survey |>\n  filter(age > 30) |>'), '  ');
  assert.equal(nextIndent('survey |>\n  filter(age > 30) |>\n  count(diet) |>'), '  ');
  assert.equal(nextIndent('survey |>\n  ggplot() +\n  aes(x = diet) +'), '  ');
  assert.equal(nextIndent('x <- survey %>%\n  filter(age > 30) %>%'), '  ');
});

test('where the statement ends, Enter goes back to where it started', () => {
  assert.equal(nextIndent('survey |>\n  count(diet)'), '');
  assert.equal(nextIndent('if (TRUE) {\n  x <- survey |>\n    count(diet)'), '  ');
  assert.equal(nextIndent('x <- 1'), '');
});

test('brackets open a level, and a call over several lines closes back into its pipe', () => {
  assert.equal(nextIndent('survey |>\n  summarise('), '    ');
  assert.equal(nextIndent('survey |>\n  summarise(\n    mean_age = mean(age),'), '    ');
  assert.equal(nextIndent('survey |>\n  summarise(\n    mean_age = mean(age),\n    n = n()\n  ) |>'), '  ');
  assert.equal(nextIndent('survey |>\n  summarise(n = n(),'), '    ');
  assert.equal(nextIndent('survey |> # the "|>" here\n  count(diet) # done'), '');
});

test('columns written as typed come before those that match only in another case', () => {
  const wide = { survey: [['d040luxus', 'int'], ['d044stadt', 'int'], ['D044stadtf', 'chr']] };
  assert.deepEqual(at('survey |> filter(D04§)', { tables: wide }), ['column:D044stadtf', 'column:d040luxus', 'column:d044stadt']);
});
