// The logic of the chart finder (client/which-chart.js) without the page: the
// questions that lead to a chart, the ten charts they can end in, the columns
// of the compact milk survey with their scale, and the R code for each chart,
// with placeholders in angle brackets or with real columns of the survey.
//
// The answers are a list of [question, value] pairs in the order they were
// given, so that "back" drops the last one. The scale of a variable decides
// the chart: categories without an order, categories with an order, numbers,
// or points in time, which only make sense together with a second variable.
//
// The code follows the house rules for R: the data set alone on the first
// line, a new line after every |>, ggplot() empty, aes() and every geom a
// layer of their own, then labs(). Labels in the code stay English.
// Tested by tests/which-chart-model.test.mjs.

export const SCALES = ['nominal', 'ordinal', 'number', 'time'];

/** The ten charts, in the order of the overview. */
export const RESULTS = ['bars-frequency', 'bars-scale', 'histogram', 'boxplot', 'stacked-counts', 'stacked-shares', 'boxplots-side', 'scatter', 'count-points', 'line'];

const COUNTED = 'Number of respondents';

/** The answers as an object: { count, 'scale-1', 'scale-2', measure, ties }. */
export const asObject = (answers) => Object.fromEntries(answers);

const isCategory = (scale) => scale === 'nominal' || scale === 'ordinal';

/**
 * The next question for the answers so far, with the values it offers, or
 * null when the answers lead to a chart.
 */
export function nextQuestion(answers) {
  const a = asObject(answers);
  if (!a.count) return { id: 'count', options: ['one', 'two'] };
  if (!a['scale-1']) return { id: 'scale-1', options: a.count === 'one' ? ['nominal', 'ordinal', 'number'] : SCALES };
  if (a.count === 'one') return null;
  if (!a['scale-2']) return { id: 'scale-2', options: a['scale-1'] === 'time' ? ['nominal', 'ordinal', 'number'] : SCALES };
  const scales = [a['scale-1'], a['scale-2']];
  // points in time beside categories are a row of groups with an order
  const grouped = scales.every((s) => isCategory(s) || s === 'time');
  if (grouped && !a.measure) return { id: 'measure', options: ['counts', 'shares'] };
  if (scales.every((s) => s === 'number') && !a.ties) return { id: 'ties', options: ['yes', 'no'] };
  return null;
}

/**
 * The charts the answers lead to, the best first; empty while a question is
 * open. One number gets the histogram and, as a second choice, the boxplot.
 */
export function resultsFor(answers) {
  if (nextQuestion(answers)) return [];
  const a = asObject(answers);
  const s1 = a['scale-1'];
  if (a.count === 'one') return s1 === 'nominal' ? ['bars-frequency'] : s1 === 'ordinal' ? ['bars-scale'] : ['histogram', 'boxplot'];
  const scales = [s1, a['scale-2']];
  if (a.measure) return [a.measure === 'counts' ? 'stacked-counts' : 'stacked-shares'];
  if (a.ties) return [a.ties === 'yes' ? 'count-points' : 'scatter'];
  if (scales.includes('time')) return ['line'];
  return ['boxplots-side'];
}

// --- the compact survey ------------------------------------------------------------

const RATING = '(-2 to +2)';

/**
 * The columns of milk_survey_compact.csv (without id) as R reads them from
 * the CSV file: text columns arrive as character, so an order of categories
 * has to be given with factor(). kind is nominal, ordinal (text with levels),
 * rating (an ordered scale stored as numbers) or number; few marks a number
 * with only a handful of values, long a category with many or long names that
 * reads better on the y-axis, missing a column with NA, max the value above
 * which answers are left out as implausible.
 */
export const COLUMNS = [
  { name: 'age', kind: 'number', label: 'Age in years', binwidth: 5 },
  { name: 'gender', kind: 'nominal', label: 'Gender' },
  { name: 'state', kind: 'nominal', label: 'Federal state', long: true },
  { name: 'town_size', kind: 'ordinal', label: 'Size of place of residence', levels: ['city', 'large town', 'town', 'small town', 'very small town', 'village'], missing: true },
  { name: 'household_size', kind: 'number', label: 'People in household', binwidth: 1, few: true, missing: true },
  { name: 'diet', kind: 'nominal', label: 'Diet', missing: true },
  { name: 'organic_share', kind: 'rating', label: 'Share of organic food (1 to 5)', missing: true },
  { name: 'milk_freq', kind: 'ordinal', label: 'Milk consumption', levels: ['daily', 'weekly', 'monthly', 'rarely'], missing: true },
  { name: 'milk_brand', kind: 'nominal', label: 'Brand shown', missing: true },
  { name: 'price_too_expensive', kind: 'number', label: 'Too expensive from (euros)', binwidth: 0.5, max: 10, missing: true },
  { name: 'shops_discounter', kind: 'nominal', label: 'Shops at a discounter', logical: true },
  { name: 'shops_organic', kind: 'nominal', label: 'Shops at an organic store', logical: true },
  { name: 'eco_conscious', kind: 'rating', label: `Eco-conscious ${RATING}`, missing: true },
  { name: 'prefers_organic', kind: 'rating', label: `Prefers organic food ${RATING}`, missing: true },
  { name: 'loves_meat', kind: 'rating', label: `Loves meals with meat ${RATING}`, missing: true },
  { name: 'loves_cooking', kind: 'rating', label: `Loves cooking ${RATING}`, missing: true },
  { name: 'rated_brand', kind: 'nominal', label: 'Rated brand', long: true, missing: true },
  { name: 'brand_quality', kind: 'rating', label: `Quality of the brand ${RATING}`, missing: true },
  { name: 'brand_buy', kind: 'rating', label: `Would buy the brand ${RATING}`, missing: true },
  { name: 'tiktok', kind: 'ordinal', label: 'TikTok use', levels: ['daily', 'weekly', 'monthly', 'rarely', 'never'], missing: true },
];

export const column = (name) => COLUMNS.find((c) => c.name === name);

// a number that the boxplot cannot stand for: a rating or a number with few values
const fewValued = (c) => c.kind === 'rating' || Boolean(c.few);

/** The scale a column answers with when it stands in the questions. */
const scaleOf = (c) => (c.kind === 'rating' ? 'ordinal' : c.kind);

/**
 * The way from one or two columns of the survey to their chart: the answers
 * the questions would have got, the charts, and the columns in their roles
 * for template(). The first column goes on the x-axis where the chart lets it
 * choose, the second on the y-axis or into the colour.
 */
export function fromSurvey(first, second) {
  const a = column(first);
  const b = second ? column(second) : null;
  if (!a) return null;
  if (!b || b === a) {
    const scale = scaleOf(a);
    const answers = [['count', 'one'], ['scale-1', scale]];
    const results = resultsFor(answers);
    const roles = scale === 'number' ? { number: a } : { category: a };
    return { answers, results, roles };
  }
  const numeric = (c) => c.kind === 'number' || c.kind === 'rating';
  // a rating beside a number with many values is a row of ordered groups
  const ratingByNumber = (r, n) => r.kind === 'rating' && n.kind === 'number' && !n.few;
  let answers;
  let roles;
  if (numeric(a) && numeric(b) && !ratingByNumber(a, b) && !ratingByNumber(b, a)) {
    // two numbers; ratings or numbers with few values give many equal pairs
    const ties = fewValued(a) || fewValued(b) ? 'yes' : 'no';
    answers = [['count', 'two'], ['scale-1', 'number'], ['scale-2', 'number'], ['ties', ties]];
    roles = { x: a, y: b };
  } else if (a.kind === 'number' || b.kind === 'number') {
    // a category, or a rating as a scale of ordered groups, beside a number
    answers = [['count', 'two'], ['scale-1', scaleOf(a)], ['scale-2', scaleOf(b)]];
    roles = a.kind === 'number' ? { category: b, number: a } : { category: a, number: b };
  } else {
    // two categories: in a survey the groups are rarely the same size
    answers = [['count', 'two'], ['scale-1', scaleOf(a)], ['scale-2', scaleOf(b)], ['measure', 'shares']];
    roles = { group: a, category: b };
  }
  return { answers, results: resultsFor(answers), roles };
}

// --- the code ------------------------------------------------------------------

// stand-ins for the columns of a template without data
const SLOT = {
  category: { name: '<category>', label: '<label>' },
  number: { name: '<number>', label: '<label>' },
  group: { name: '<group>', label: '<x label>' },
  fill: { name: '<category>', label: '<fill label>' },
  boxCategory: { name: '<category>', label: '<x label>' },
  boxNumber: { name: '<number>', label: '<y label>' },
  x: { name: '<number_x>', label: '<x label>' },
  y: { name: '<number_y>', label: '<y label>' },
  time: { name: '<time>', label: '<x label>' },
  value: { name: '<number>', label: '<y label>' },
};

const quote = (s) => `"${s}"`;

function labs(pairs) {
  const parts = pairs.map(([k, v]) => `${k} = ${quote(v)}`);
  const line = `  labs(${parts.join(', ')})`;
  return line.length <= 72 ? line : `  labs(\n${parts.map((p, i) => `    ${p}${i < parts.length - 1 ? ',' : ''}`).join('\n')}\n  )`;
}

/** The steps before ggplot(): leave out what is missing or implausible, then give categories their order. */
function prepare(columns, factored) {
  const steps = [];
  const real = columns.filter((c) => c && !c.name.startsWith('<'));
  const missing = real.filter((c) => c.missing && c.max === undefined).map((c) => `!is.na(${c.name})`);
  if (missing.length) steps.push(`  filter(${missing.join(', ')}) |>`);
  for (const c of real.filter((c) => c.max !== undefined)) {
    steps.push(`  # answers above ${String(c.max)} € left out`, `  filter(${c.name} <= ${c.max}) |>`);
  }
  for (const c of factored) {
    if (c.name.startsWith('<')) steps.push(`  mutate(${c.name} = factor(${c.name}, levels = c("<first>", "<second>", "<third>"))) |>`);
    else if (c.levels) {
      const levels = c.levels.map(quote).join(', ');
      const line = `  mutate(${c.name} = factor(${c.name}, levels = c(${levels}))) |>`;
      // a long list of levels gets a line of its own
      steps.push(...(line.length <= 80 ? [line] : [`  mutate(${c.name} = factor(${c.name}, levels = c(`, `    ${levels}`, '  ))) |>']));
    }
    else if (c.kind === 'rating') steps.push(`  mutate(${c.name} = factor(${c.name})) |>`);
  }
  return steps;
}

const chart = (data, steps, aes, geom, labels) => [`${data} |>`, ...steps, '  ggplot() +', `  aes(${aes}) +`, `  ${geom} +`, labs(labels)].join('\n');

// a category that needs factor() for its order: text with levels, or a rating
// that has to become groups (not in bars, where numbers already keep the order)
const needsOrder = (c) => Boolean(c?.levels) || c?.kind === 'rating';

/**
 * The R code of a chart. Without roles every column is a placeholder in
 * angle brackets; with the roles from fromSurvey() the code runs as it is on
 * the compact survey, loaded as `survey`.
 */
export function template(result, roles = {}) {
  const real = Object.keys(roles).length > 0;
  switch (result) {
    case 'bars-frequency': {
      const c = roles.category ?? SLOT.category;
      const aes = c.logical ? `y = ${c.name}` : `y = fct_rev(fct_infreq(${c.name}))`;
      return chart('survey', prepare([c], []), aes, 'geom_bar()', [['x', COUNTED], ['y', c.label]]);
    }
    case 'bars-scale': {
      const c = roles.category ?? SLOT.category;
      return chart('survey', prepare([c], c.levels || !real ? [c] : []), `x = ${c.name}`, 'geom_bar()', [['x', c.label], ['y', COUNTED]]);
    }
    case 'histogram': {
      const c = roles.number ?? SLOT.number;
      return chart('survey', prepare([c], []), `x = ${c.name}`, `geom_histogram(binwidth = ${c.binwidth ?? '<width>'})`, [['x', c.label], ['y', COUNTED]]);
    }
    case 'boxplot': {
      const c = roles.number ?? SLOT.number;
      return chart('survey', prepare([c], []), `x = ${c.name}`, 'geom_boxplot()', [['x', c.label]]);
    }
    case 'stacked-counts':
    case 'stacked-shares': {
      const g = roles.group ?? SLOT.group;
      const f = roles.category ?? SLOT.fill;
      const shares = result === 'stacked-shares';
      const across = shares ? 'Share' : COUNTED;
      const geom = shares ? 'geom_bar(position = "fill")' : 'geom_bar()';
      const order = [g, f].filter(needsOrder);
      if (g.long) return chart('survey', prepare([g, f], order), `y = ${g.name}, fill = ${f.name}`, geom, [['x', across], ['y', g.label], ['fill', f.label]]);
      return chart('survey', prepare([g, f], order), `x = ${g.name}, fill = ${f.name}`, geom, [['x', g.label], ['y', across], ['fill', f.label]]);
    }
    case 'boxplots-side': {
      const c = roles.category ?? SLOT.boxCategory;
      const n = roles.number ?? SLOT.boxNumber;
      const order = needsOrder(c) ? [c] : [];
      if (c.long) return chart('survey', prepare([c, n], order), `x = ${n.name}, y = ${c.name}`, 'geom_boxplot()', [['x', n.label], ['y', c.label]]);
      return chart('survey', prepare([c, n], order), `x = ${c.name}, y = ${n.name}`, 'geom_boxplot()', [['x', c.label], ['y', n.label]]);
    }
    case 'scatter':
    case 'count-points': {
      const x = roles.x ?? SLOT.x;
      const y = roles.y ?? SLOT.y;
      return chart('survey', prepare([x, y], []), `x = ${x.name}, y = ${y.name}`, result === 'scatter' ? 'geom_point()' : 'geom_count()', [['x', x.label], ['y', y.label]]);
    }
    case 'line': {
      const t = roles.time ?? SLOT.time;
      const v = roles.number ?? SLOT.value;
      return chart('<data>', [], `x = ${t.name}, y = ${v.name}`, 'geom_line()', [['x', t.label], ['y', v.label]]);
    }
    default:
      return '';
  }
}
