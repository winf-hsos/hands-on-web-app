// Content list: live search, type chips and further filters. When the
// result changes, rows that stay glide to their new place and new ones
// fade in, so it is visible what the filter did.
import MiniSearch from 'minisearch';
import { load, isDone, loadIndex } from './progress.js';

const form = document.getElementById('finder');
const list = document.getElementById('rows');
const rows = [...list.querySelectorAll('.row')];
const field = (name) => form.elements.namedItem(name);
const value = (name) => {
  const f = field(name);
  return (f instanceof RadioNodeList ? f.value : f?.value) ?? '';
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let mini;
loadIndex().then((data) => {
  mini = new MiniSearch({
    fields: ['title', 'summary', 'body', 'code'],
    extractField: (doc, f) => (f === 'code' ? String(doc.code) : doc[f]),
    searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 3, code: 5, summary: 2 } },
  });
  mini.addAll(data.items);
  if (value('q')) apply();
});

// Filters live in the URL, so that a filtered list can be bookmarked or shared.
for (const [key, v] of new URLSearchParams(location.search)) {
  const f = field(key);
  if (f) f.value = v;
}
if ([...new URLSearchParams(location.search).keys()].some((k) => k !== 'q' && k !== 'type')) {
  form.querySelector('.finder-more').open = true;
}

function apply({ animate = true } = {}) {
  const query = value('q').trim();
  const ranked = query && mini ? mini.search(query) : null;
  const score = new Map(ranked?.map((r) => [r.id, r.score]));
  const progress = load();
  const visible = rows.filter((row) => {
    const d = row.dataset;
    if (ranked && !score.has(d.id)) return false;
    if (value('type') && d.type !== value('type')) return false;
    if (value('topic') && !d.topics.split(' ').includes(value('topic'))) return false;
    if (value('level') && d.level !== value('level')) return false;
    if (value('progress') === 'done' && !isDone(progress, d.id)) return false;
    if (value('progress') === 'open' && isDone(progress, d.id)) return false;
    return true;
  });
  const sort = value('sort');
  const lang = document.documentElement.lang;
  const title = (row) => row.querySelector('.row-title').textContent;
  visible.sort((a, b) => {
    if (ranked && sort === 'title') return score.get(b.dataset.id) - score.get(a.dataset.id);
    if (sort === 'duration' || sort === 'level') return Number(a.dataset[sort]) - Number(b.dataset[sort]);
    return title(a).localeCompare(title(b), lang);
  });

  // FLIP: remember where rows were, change the list, then animate from there.
  const before = new Map(rows.filter((r) => !r.hidden).map((r) => [r, r.getBoundingClientRect().top]));
  for (const row of rows) row.hidden = !visible.includes(row);
  list.append(...visible);
  if (animate && !reduceMotion) {
    visible.forEach((row, i) => {
      const old = before.get(row);
      if (old === undefined) {
        row.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], {
          duration: 280,
          delay: Math.min(i, 8) * 25,
          easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
          fill: 'backwards',
        });
      } else {
        const dy = old - row.getBoundingClientRect().top;
        if (dy) row.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
      }
    });
  }

  const n = visible.length;
  document.getElementById('count').textContent = `${n} ${n === 1 ? form.dataset.one : form.dataset.many}`;
  document.getElementById('empty').hidden = n > 0;

  const params = new URLSearchParams();
  for (const name of ['q', 'type', 'topic', 'level', 'progress', 'sort']) {
    const v = value(name);
    if (v && !(name === 'sort' && v === 'title')) params.set(name, v);
  }
  history.replaceState(null, '', params.size ? `?${params}` : location.pathname);
}

// There is no "all" chip: clicking the chosen type again clears the filter.
// A radio fires no input event when clicked while checked, so track it here.
let chosenType = value('type');
form.addEventListener('click', (e) => {
  const input = e.target;
  if (!(input instanceof HTMLInputElement) || input.name !== 'type') return;
  if (input.value === chosenType) {
    input.checked = false;
    chosenType = '';
    apply();
  } else {
    chosenType = input.value;
  }
});

form.addEventListener('input', () => apply());
form.addEventListener('submit', (e) => e.preventDefault());
document.getElementById('reset').addEventListener('click', () => {
  form.reset();
  chosenType = '';
  apply();
});
document.addEventListener('progress-change', () => apply({ animate: false }));
apply({ animate: false });
