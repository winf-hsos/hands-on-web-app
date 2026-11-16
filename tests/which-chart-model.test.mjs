// The chart finder without the page (client/which-chart-model.js): the
// questions and where they lead, the columns of the compact survey and the
// charts they get, and the R code, which keeps the house rules. That every
// template made from survey columns runs in R (tidyverse, read_csv on
// milk_survey_compact.csv, ggplot_build without errors or warnings) was
// checked with Rscript when the module was written, for all 404 choices.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COLUMNS, RESULTS, column, fromSurvey, nextQuestion, pathTo, reachable, resultsFor, template } from '../src/client/which-chart-model.js';

/** Answers the questions with `values` in turn, checking each is offered. */
function walk(...values) {
  const answers = [];
  for (const value of values) {
    const q = nextQuestion(answers);
    assert.ok(q, `a question is open before ${value}`);
    assert.ok(q.options.includes(value), `${q.id} offers ${value}`);
    answers.push([q.id, value]);
  }
  return answers;
}

test('the questions lead to all ten charts, and no further question stays open', () => {
  const paths = {
    'bars-frequency': ['one', 'nominal'],
    'bars-scale': ['one', 'ordinal'],
    histogram: ['one', 'number'],
    'stacked-counts': ['two', 'nominal', 'ordinal', 'counts'],
    'stacked-shares': ['two', 'ordinal', 'nominal', 'shares'],
    'boxplots-side': ['two', 'nominal', 'number'],
    scatter: ['two', 'number', 'number', 'no'],
    'count-points': ['two', 'number', 'number', 'yes'],
    line: ['two', 'time', 'number'],
  };
  const reached = new Set();
  for (const [result, values] of Object.entries(paths)) {
    const answers = walk(...values);
    assert.equal(nextQuestion(answers), null);
    assert.equal(resultsFor(answers)[0], result);
    resultsFor(answers).forEach((r) => reached.add(r));
  }
  assert.deepEqual([...reached].sort(), [...RESULTS].sort());
});

test('one number gets the histogram first and the boxplot as a second choice', () => {
  assert.deepEqual(resultsFor(walk('one', 'number')), ['histogram', 'boxplot']);
});

test('points in time are offered only for two variables, and not twice', () => {
  assert.ok(!nextQuestion([['count', 'one']]).options.includes('time'));
  assert.ok(nextQuestion([['count', 'two']]).options.includes('time'));
  assert.ok(!nextQuestion(walk('two', 'time')).options.includes('time'));
});

test('the order of two variables does not change the chart', () => {
  assert.deepEqual(resultsFor(walk('two', 'number', 'time')), ['line']);
  assert.deepEqual(resultsFor(walk('two', 'number', 'ordinal')), ['boxplots-side']);
});

test('points in time beside categories are groups, counted or as shares', () => {
  assert.equal(nextQuestion(walk('two', 'time', 'nominal')).id, 'measure');
  assert.deepEqual(resultsFor(walk('two', 'nominal', 'time', 'shares')), ['stacked-shares']);
});

test('only two categories are asked about counts or shares, only two numbers about equal values', () => {
  assert.equal(nextQuestion(walk('two', 'nominal', 'nominal')).id, 'measure');
  assert.equal(nextQuestion(walk('two', 'number', 'number')).id, 'ties');
  assert.equal(nextQuestion(walk('two', 'ordinal', 'number')), null);
  assert.deepEqual(resultsFor([]), []);
});

test('the survey has its 20 columns without id, ordinal text with levels', () => {
  assert.equal(COLUMNS.length, 20);
  assert.equal(column('id'), undefined);
  for (const c of COLUMNS.filter((c) => c.kind === 'ordinal')) assert.ok(c.levels?.length > 2, c.name);
  assert.deepEqual(column('tiktok').levels, ['daily', 'weekly', 'monthly', 'rarely', 'never']);
});

test('a single survey column gets bars, bars in scale order or a histogram', () => {
  assert.deepEqual(fromSurvey('diet').results, ['bars-frequency']);
  assert.deepEqual(fromSurvey('town_size').results, ['bars-scale']);
  assert.deepEqual(fromSurvey('eco_conscious').results, ['bars-scale']);
  assert.deepEqual(fromSurvey('age').results, ['histogram', 'boxplot']);
  assert.deepEqual(fromSurvey('age', '').results, ['histogram', 'boxplot']);
  assert.equal(fromSurvey('nothing'), null);
});

test('two survey columns get the chart of their scales', () => {
  const chart = (a, b) => fromSurvey(a, b).results[0];
  assert.equal(chart('age', 'price_too_expensive'), 'scatter');
  assert.equal(chart('eco_conscious', 'loves_meat'), 'count-points');
  assert.equal(chart('brand_quality', 'household_size'), 'count-points');
  assert.equal(chart('household_size', 'age'), 'count-points');
  assert.equal(chart('gender', 'diet'), 'stacked-shares');
  assert.equal(chart('rated_brand', 'brand_buy'), 'stacked-shares');
  assert.equal(chart('shops_organic', 'organic_share'), 'stacked-shares');
  assert.equal(chart('age', 'diet'), 'boxplots-side');
  assert.equal(chart('eco_conscious', 'age'), 'boxplots-side');
  assert.equal(chart('tiktok', 'price_too_expensive'), 'boxplots-side');
});

test('the answers from the survey are the ones the questions would get', () => {
  for (const [a, b] of [['gender', 'diet'], ['age', 'state'], ['loves_meat', 'loves_cooking'], ['milk_freq'], ['age', 'household_size']]) {
    const s = fromSurvey(a, b);
    assert.equal(nextQuestion(s.answers), null);
    assert.deepEqual(resultsFor(s.answers), s.results);
    s.answers.forEach(([q, value], i) => assert.ok(nextQuestion(s.answers.slice(0, i)).options.includes(value), `${q} = ${value}`));
  }
});

/** The house rules: data alone on the first line, a new line after |>, ggplot() empty, aes() and the geom as layers, then labs(). */
function assertHouseStyle(code) {
  const lines = code.split('\n');
  assert.match(lines[0], /^(survey|<data>) \|>$/);
  for (const line of lines) if (line.includes('|>')) assert.match(line, /\|>$/, line);
  const at = lines.indexOf('  ggplot() +');
  assert.ok(at > 0, 'ggplot() stands alone and empty');
  assert.match(lines[at + 1], /^ {2}aes\(.+\) \+$/);
  assert.match(lines[at + 2], /^ {2}geom_\w+\(.*\) \+$/);
  assert.match(lines[at + 3], /^ {2}labs\(/);
  assert.match(code, /\)$/);
}

test('every template keeps the house rules and shows its placeholders in angle brackets', () => {
  for (const result of RESULTS) {
    const code = template(result);
    assertHouseStyle(code);
    assert.match(code, /<\w[\w ]*>/, result);
  }
  assert.match(template('histogram'), /geom_histogram\(binwidth = <width>\)/);
  assert.match(template('bars-frequency'), /aes\(y = fct_rev\(fct_infreq\(<category>\)\)\)/);
  assert.match(template('stacked-shares'), /aes\(x = <group>, fill = <category>\) \+\n {2}geom_bar\(position = "fill"\) \+\n {2}labs\(x = "<x label>", y = "Share", fill = "<fill label>"\)/);
  assert.match(template('line'), /^<data> \|>\n {2}ggplot\(\) \+\n {2}aes\(x = <time>, y = <number>\) \+\n {2}geom_line\(\)/);
});

test('templates from the survey run as they are: real names, no placeholders, the house rules kept', () => {
  for (const a of COLUMNS) {
    for (const b of [null, ...COLUMNS]) {
      if (b === a) continue;
      const s = fromSurvey(a.name, b?.name);
      for (const result of s.results) {
        const code = template(result, s.roles);
        assertHouseStyle(code);
        assert.doesNotMatch(code, /<[a-z]/, `${a.name} ${b?.name}: ${result}`);
      }
    }
  }
});

test('survey templates leave out what is missing, order the scales and set the implausible prices aside', () => {
  const code = (a, b) => {
    const s = fromSurvey(a, b);
    return template(s.results[0], s.roles);
  };
  assert.equal(
    code('diet'),
    'survey |>\n  filter(!is.na(diet)) |>\n  ggplot() +\n  aes(y = fct_rev(fct_infreq(diet))) +\n  geom_bar() +\n  labs(x = "Number of respondents", y = "Diet")',
  );
  assert.equal(code('gender').includes('filter('), false);
  assert.match(code('milk_freq'), /mutate\(milk_freq = factor\(milk_freq, levels = c\(\n {4}"daily", "weekly", "monthly", "rarely"\n {2}\)\)\) \|>/);
  assert.match(code('town_size'), /levels = c\(\n {4}"city", "large town", "town", "small town", "very small town", "village"\n {2}\)\)\) \|>/);
  assert.doesNotMatch(code('eco_conscious'), /factor/);
  assert.match(code('eco_conscious', 'age'), /mutate\(eco_conscious = factor\(eco_conscious\)\) \|>/);
  assert.match(code('price_too_expensive'), /^survey \|>\n {2}# answers above 10 € left out\n {2}filter\(price_too_expensive <= 10\) \|>/);
  assert.match(code('shops_discounter'), /aes\(y = shops_discounter\)/);
  assert.match(code('state', 'age'), /aes\(x = age, y = state\)/);
  assert.match(code('diet', 'age'), /aes\(x = diet, y = age\)/);
  assert.match(code('age', 'diet'), /aes\(x = diet, y = age\)/);
  assert.match(code('state', 'diet'), /aes\(y = state, fill = diet\)[\s\S]*labs\(x = "Share", y = "Federal state", fill = "Diet"\)/);
  assert.match(code('eco_conscious', 'loves_meat'), /filter\(!is.na\(eco_conscious\), !is.na\(loves_meat\)\)[\s\S]*geom_count\(\)/);
  assert.match(code('age'), /geom_histogram\(binwidth = 5\)/);
});

test('each answer narrows the charts still in question, and every chart has a way to it', () => {
  assert.deepEqual(reachable([]), RESULTS);
  assert.deepEqual(reachable(walk('one')), ['bars-frequency', 'bars-scale', 'histogram', 'boxplot']);
  assert.deepEqual(reachable(walk('two', 'number')), ['boxplots-side', 'scatter', 'count-points', 'line']);
  assert.deepEqual(reachable(walk('one', 'number')), ['histogram', 'boxplot']);
  for (const result of RESULTS) {
    const { answers, index } = pathTo(result);
    assert.equal(nextQuestion(answers), null);
    assert.equal(resultsFor(answers)[index], result);
  }
  assert.deepEqual(pathTo('boxplot'), { answers: walk('one', 'number'), index: 1 });
});
