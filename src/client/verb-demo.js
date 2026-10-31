// The dplyr verbs to try out: a small table from the survey excerpt and one
// button per verb. A click shows the line of R and turns the table into the
// result, with rows and columns that go fading out, the ones that stay
// gliding to their new place, and new ones fading in. Each verb starts from
// the original table, so the buttons can be tried in any order; the first
// button brings the original table back.
//
// Written with ```verb-demo in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-verb-demo-labels on <body>).
import { keys } from './demo-frame.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const L = JSON.parse(document.body.dataset.verbDemoLabels ?? '{}');
const COLUMNS = ['id', 'age', 'diet', 'organic_share'];

function parse(csv) {
  const [head, ...lines] = csv.trim().split('\n');
  const names = head.split(',');
  return lines.map((line) => Object.fromEntries(line.split(',').map((v, i) => [names[i], v])));
}

const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;
const round1 = (x) => Math.round(x * 10) / 10;

// Each verb: the line of R, and what it does to { columns, rows }.
// Rows carry a key, so that the animation knows which row is which.
const VERBS = [
  {
    name: 'select()',
    code: 'survey |> select(id, diet)',
    apply: (t) => ({ columns: ['id', 'diet'], rows: t.rows }),
  },
  {
    name: 'filter()',
    code: 'survey |> filter(age >= 50)',
    apply: (t) => ({ ...t, rows: t.rows.filter((r) => Number(r.age) >= 50) }),
  },
  {
    name: 'arrange()',
    code: 'survey |> arrange(desc(age))',
    apply: (t) => ({ ...t, rows: [...t.rows].sort((a, b) => b.age - a.age) }),
  },
  {
    name: 'mutate()',
    code: 'survey |> mutate(decade = age %/% 10 * 10)',
    apply: (t) => ({ columns: [...t.columns, 'decade'], rows: t.rows.map((r) => ({ ...r, decade: String(Math.floor(r.age / 10) * 10) })) }),
  },
  {
    name: 'summarize()',
    code: 'survey |> summarize(n = n(), mean_age = mean(age))',
    apply: (t) => ({ columns: ['n', 'mean_age'], rows: [{ key: 'all', n: String(t.rows.length), mean_age: String(round1(mean(t.rows.map((r) => Number(r.age))))) }] }),
  },
  {
    name: 'group_by() |> summarize()',
    code: 'survey |> group_by(diet) |> summarize(n = n(), mean_age = mean(age))',
    apply: (t) => {
      const diets = [...new Set(t.rows.map((r) => r.diet))].sort();
      return {
        columns: ['diet', 'n', 'mean_age'],
        rows: diets.map((diet) => {
          const members = t.rows.filter((r) => r.diet === diet);
          return { key: `diet-${diet}`, diet, n: String(members.length), mean_age: String(round1(mean(members.map((r) => Number(r.age))))) };
        }),
      };
    },
  },
];

function el(tag, { dataset, ...props } = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  Object.assign(node.dataset, dataset);
  node.append(...children);
  return node;
}

async function setup(box) {
  const csv = await fetch(`${document.body.dataset.datasets ?? '/media/datasets/'}milk_survey.csv`).then((r) => r.text());
  const original = {
    columns: COLUMNS,
    rows: parse(csv)
      .slice(0, 6)
      .map((r) => ({ key: `row-${r.id}`, ...Object.fromEntries(COLUMNS.map((c) => [c, r[c]])) })),
  };

  const code = el('pre', { className: 'code verb-demo-code' }, el('code', { textContent: 'survey' }));
  const table = el('table', { className: 'verb-demo-table' });
  const chip = (text) => el('button', { type: 'button', className: 'chip-button', textContent: text });
  const reset = chip(L.original ?? 'Original');
  const buttons = VERBS.map((verb) => chip(verb.name));
  box.replaceChildren(
    el('div', { className: 'verb-demo-buttons' }, reset, ...buttons),
    code,
    el('div', { className: 'verb-demo-frame' }, table),
    el('p', { className: 'verb-demo-foot', textContent: L.hint ?? '' }),
  );

  let current = original;
  let busy = false;

  function render(t) {
    const head = el('tr', {}, ...t.columns.map((c) => el('th', { textContent: c, dataset: { col: c } })));
    const body = t.rows.map((r) =>
      el('tr', { dataset: { key: r.key } }, ...t.columns.map((c) => el('td', { textContent: r[c] ?? 'NA', dataset: { col: c }, className: r[c] === '' || r[c] == null ? 'na' : '' }))),
    );
    table.replaceChildren(el('thead', {}, head), el('tbody', {}, ...body));
  }

  async function show(next, line, active) {
    if (busy) return;
    busy = true;
    [reset, ...buttons].forEach((b) => b.setAttribute('aria-pressed', String(b === active)));
    code.firstChild.textContent = line;
    if (reduceMotion) {
      render(next);
      current = next;
      busy = false;
      return;
    }
    const keys = new Set(next.rows.map((r) => r.key));
    const cols = new Set(next.columns);
    // 1. what goes away fades out
    const leaving = [
      ...[...table.querySelectorAll('tbody tr')].filter((tr) => !keys.has(tr.dataset.key)),
      ...[...table.querySelectorAll('[data-col]')].filter((cell) => !cols.has(cell.dataset.col)),
    ];
    await Promise.all(leaving.map((node) => node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).finished));
    // 2. what stays glides to its new place, what is new fades in
    const before = new Map([...table.querySelectorAll('tbody tr')].map((tr) => [tr.dataset.key, tr.getBoundingClientRect()]));
    const frame = table.parentElement;
    const from = frame.getBoundingClientRect().height;
    render(next);
    const to = frame.getBoundingClientRect().height;
    frame.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 380, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
    for (const tr of table.querySelectorAll('tbody tr')) {
      const old = before.get(tr.dataset.key);
      if (old) {
        const dy = old.top - tr.getBoundingClientRect().top;
        if (dy) tr.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
      } else tr.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 80, fill: 'backwards' });
    }
    const had = new Set(current.columns);
    for (const cell of table.querySelectorAll('[data-col]')) {
      if (!had.has(cell.dataset.col)) cell.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 120, fill: 'backwards' });
    }
    current = next;
    busy = false;
  }

  VERBS.forEach((verb, i) => buttons[i].addEventListener('click', () => show(verb.apply(original), verb.code, buttons[i])));
  reset.addEventListener('click', () => show(original, 'survey', reset));
  reset.setAttribute('aria-pressed', 'true');
  keys(
    box,
    [
      ['0', L.keyOriginal],
      [`1 – ${VERBS.length}`, L.keyVerbs],
    ],
    (key) => {
      const button = /^\d$/.test(key) && [reset, ...buttons][Number(key)];
      if (!button) return false;
      button.click();
      return true;
    },
  );
  render(original);
}

for (const box of document.querySelectorAll('[data-verb-demo]')) setup(box);
