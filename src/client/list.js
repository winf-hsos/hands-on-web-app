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
let courses = [];
const fromUrl = new URLSearchParams(location.search);
loadIndex().then((data) => {
  mini = new MiniSearch({
    fields: ['title', 'summary', 'body', 'code'],
    extractField: (doc, f) => (f === 'code' ? String(doc.code) : doc[f]),
    searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 3, code: 5, summary: 2 } },
  });
  mini.addAll(data.items);
  courses = data.courses;
  fillCourses(fromUrl.get('course'));
  if (value('q') || value('course')) apply({ animate: false });
});

// The course filter offers only the courses this learner has added, and
// stays hidden until there is one.
function fillCourses(chosen = value('course')) {
  const select = field('course');
  const mine = load().courses.map((id) => courses.find((c) => c.id === id)).filter(Boolean);
  select.replaceChildren(select.options[0], ...mine.map((c) => new Option(c.title, c.id)));
  select.value = mine.some((c) => c.id === chosen) ? chosen : '';
  select.closest('.field').hidden = mine.length === 0;
}

// Filters live in the URL, so that a filtered list can be bookmarked or shared.
for (const [key, v] of fromUrl) {
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
    if (value('path') && !d.paths.split(' ').includes(value('path'))) return false;
    if (value('project') && !d.projects.split(' ').includes(value('project'))) return false;
    if (value('course') && !courses.find((c) => c.id === value('course'))?.all.includes(d.id)) return false;
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
  const before = new Map(rows.filter((r) => !r.hidden).map((r) => [r, r.getBoundingClientRect()]));
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
        const now = row.getBoundingClientRect();
        const dx = old.left - now.left;
        const dy = old.top - now.top;
        if (dx || dy) row.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
      }
    });
  }

  const n = visible.length;
  document.getElementById('count').textContent = `${n} ${n === 1 ? form.dataset.one : form.dataset.many}`;
  document.getElementById('empty').hidden = n > 0;

  const params = new URLSearchParams();
  for (const name of ['q', 'type', 'course', 'path', 'project', 'topic', 'level', 'progress', 'sort']) {
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
document.addEventListener('progress-change', () => {
  fillCourses();
  apply({ animate: false });
});

// List or cards: a preference of this browser, set on <html> by the inline
// script in the head before the first paint, so the page does not jump.
const root = document.documentElement;
const switches = [...document.querySelectorAll('.view-switch button')];
function showView(view) {
  for (const b of switches) b.setAttribute('aria-pressed', String(b.dataset.view === view));
}
showView(root.dataset.view === 'cards' ? 'cards' : 'list');
for (const button of switches) {
  button.addEventListener('click', () => {
    const view = button.dataset.view;
    if ((root.dataset.view ?? 'list') === view) return;
    root.dataset.view = view;
    showView(view);
    try {
      localStorage.setItem('hocs-view', view);
    } catch {}
    if (!reduceMotion) {
      list.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], {
        duration: 260,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      });
    }
  });
}
apply({ animate: false });
