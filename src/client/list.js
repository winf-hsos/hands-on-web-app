// Content list: live search, type chips and further filters, grouped by
// type, topic or level. When the result changes, rows that stay glide to
// their new place and new ones fade in, so it is visible what the filter did.
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
const FILTERS = ['q', 'type', 'course', 'path', 'project', 'topic', 'level', 'progress'];
const MORE = ['course', 'path', 'project', 'topic', 'level', 'progress'];
const groups = JSON.parse(document.getElementById('groups').textContent);
const clear = document.getElementById('clear-filters');
const summary = form.querySelector('.finder-more > summary');
const badge = Object.assign(document.createElement('span'), { className: 'filter-badge', hidden: true });
summary.append(badge);

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
if ([...MORE, 'sort'].some((k) => fromUrl.has(k))) {
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

  // Group the sorted rows; each group gets a heading with its size.
  const by = value('group') || 'type';
  const sequence = [];
  if (by === 'none') sequence.push(...visible);
  else {
    for (const group of groups[by]) {
      const members = visible.filter((row) => row.dataset[by] === group.key);
      if (members.length === 0) continue;
      const h = heading(by, group);
      h.querySelector('.group-count').textContent = members.length;
      sequence.push(h, ...members);
    }
  }

  // FLIP: remember where rows were, change the list, then animate from there.
  const before = new Map([...list.children].filter((r) => !r.hidden).map((r) => [r, r.getBoundingClientRect()]));
  for (const h of list.querySelectorAll('.group-head')) if (!sequence.includes(h)) h.remove();
  for (const row of rows) row.hidden = !visible.includes(row);
  list.append(...sequence);
  if (animate && !reduceMotion) {
    sequence.forEach((row, i) => {
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
  clear.hidden = !FILTERS.some((name) => value(name));
  const more = MORE.filter((name) => value(name)).length;
  badge.hidden = more === 0;
  badge.textContent = more;

  const params = new URLSearchParams();
  for (const name of [...FILTERS, 'sort', 'group']) {
    const v = value(name);
    if (v && !(name === 'sort' && v === 'title') && !(name === 'group' && v === 'type')) params.set(name, v);
  }
  if (document.documentElement.dataset.view === 'cards') params.set('view', 'cards');
  history.replaceState(null, '', params.size ? `?${params}` : location.pathname);
}

const heads = new Map();
function heading(by, group) {
  const id = `${by}:${group.key}`;
  if (!heads.has(id)) {
    const li = document.createElement('li');
    li.className = 'group-head';
    const h = document.createElement('h2');
    if (group.icon) h.insertAdjacentHTML('beforeend', group.icon);
    if (group.color) h.append(Object.assign(document.createElement('span'), { className: 'dot' }));
    h.append(group.label, Object.assign(document.createElement('span'), { className: 'group-count' }));
    if (group.color) li.style.setProperty('--topic', group.color);
    li.append(h);
    heads.set(id, li);
  }
  return heads.get(id);
}

/** Clears every filter, but keeps order, grouping and view. */
function clearFilters() {
  for (const name of FILTERS) {
    const f = field(name);
    if (f instanceof RadioNodeList) for (const r of f) r.checked = false;
    else f.value = '';
  }
  chosenType = '';
  apply();
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
field('group').addEventListener('input', () => apply());
form.addEventListener('submit', (e) => e.preventDefault());
document.getElementById('reset').addEventListener('click', clearFilters);
clear.addEventListener('click', clearFilters);
form.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && FILTERS.some((name) => value(name))) clearFilters();
});
document.addEventListener('progress-change', () => {
  fillCourses();
  apply({ animate: false });
});

apply({ animate: false });
