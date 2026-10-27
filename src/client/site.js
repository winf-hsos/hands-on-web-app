// Behaviour shared by every page: theme, progress marks, "mark as done",
// the search dialog, the list or card view (view.js), copy buttons on code
// (copy.js) and the background (backdrop.js).
import { load, update, isDone, today, loadIndex } from './progress.js';
import './backdrop.js';
import './copy.js';
import './view.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- theme -------------------------------------------------------------------

document.querySelector('.theme')?.addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const next = () => {
    root.dataset.theme = dark ? 'light' : 'dark';
    try {
      localStorage.setItem('hocs-theme', root.dataset.theme);
    } catch {}
  };
  if (document.startViewTransition && !reduceMotion) document.startViewTransition(next);
  else next();
});

// --- progress marks ------------------------------------------------------------

const page = document.querySelector('[data-item-page]');
if (page) {
  const id = page.dataset.itemPage;
  update(id, (p) => (p.seen ??= today()));
  document.querySelector('[data-mark-done]')?.addEventListener('click', () =>
    update(id, (p) => {
      p.done = p.done ? undefined : today();
    }),
  );
}

function render(progress) {
  for (const el of document.querySelectorAll('[data-progress-id]')) {
    el.classList.toggle('is-done', isDone(progress, el.dataset.progressId));
  }
  for (const el of document.querySelectorAll('[data-progress-ids]')) {
    const ids = el.dataset.progressIds.split(' ').filter(Boolean);
    const done = ids.filter((id) => isDone(progress, id)).length;
    el.style.setProperty('--progress', `${ids.length ? (done / ids.length) * 100 : 0}%`);
    el.querySelector('.meter-label').textContent = `${done} ${el.dataset.of} ${ids.length} ${el.dataset.done}`;
  }
  const button = document.querySelector('[data-mark-done]');
  if (button && page) {
    const done = isDone(progress, page.dataset.itemPage);
    button.setAttribute('aria-pressed', String(done));
    button.querySelector('span').textContent = done ? button.dataset.done : button.dataset.open;
  }
  const ring = document.querySelector('.ring');
  if (ring) {
    const total = Number(document.body.dataset.total);
    const done = Object.values(progress.items).filter((p) => p.done).length;
    ring.style.setProperty('--p', total ? Math.min(100, (done / total) * 100) : 0);
  }
}
render(load());
document.addEventListener('progress-change', (e) => render(e.detail));
addEventListener('storage', (e) => e.key === 'hocs-progress' && render(load()));

// Full screen for embedded slide decks.
for (const button of document.querySelectorAll('[data-fullscreen]')) {
  button.addEventListener('click', () => document.querySelector(button.dataset.fullscreen)?.requestFullscreen());
}

// --- search dialog -------------------------------------------------------------

const dialog = document.querySelector('dialog.search');
const input = dialog.querySelector('input');
const list = dialog.querySelector('.search-results');
let search;
let selected = 0;

async function engine() {
  if (search) return search;
  const [{ default: MiniSearch }, data] = await Promise.all([import('minisearch'), loadIndex()]);
  const mini = new MiniSearch({
    fields: ['title', 'summary', 'body', 'code'],
    storeFields: ['title', 'summary', 'url', 'meta', 'color', 'icon'],
    extractField: (doc, field) => (field === 'code' ? String(doc.code) : doc[field]),
    searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 3, code: 5, summary: 2 } },
  });
  mini.addAll(data.items);
  search = { mini, data };
  return search;
}

function open() {
  if (dialog.open) return;
  dialog.showModal();
  input.select();
  engine();
}

function show(results) {
  selected = 0;
  list.replaceChildren(
    ...results.slice(0, 8).map((r, i) => {
      const li = document.createElement('li');
      li.style.setProperty('--i', i);
      const a = document.createElement('a');
      a.href = r.url;
      a.setAttribute('role', 'option');
      a.setAttribute('aria-selected', String(i === 0));
      const span = (className, text) => Object.assign(document.createElement('span'), { className, textContent: text });
      const icon = span('r-icon', '');
      icon.innerHTML = r.icon ?? ''; // built from the icon set, not from user input
      a.append(icon, span('r-title', r.title), span('r-meta', r.meta ?? ''), span('r-summary', r.summary ?? ''));
      li.append(a);
      return li;
    }),
  );
}

input.addEventListener('input', async () => {
  const query = input.value.trim();
  if (!query) return show([]);
  const { mini, data } = await engine();
  const byCode = [...data.items, ...data.paths, ...data.projects, ...data.courses].find((d) => String(d.code) === query);
  const hits = mini.search(query);
  show(byCode ? [byCode, ...hits.filter((h) => h.id !== byCode.id)] : hits);
});

input.addEventListener('keydown', (e) => {
  const links = [...list.querySelectorAll('a')];
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!links.length) return;
    selected = (selected + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links.forEach((a, i) => a.setAttribute('aria-selected', String(i === selected)));
    links[selected].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (links[selected]) location.href = links[selected].href;
  }
});

dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close(); // a click on the backdrop
});
document.querySelector('.search-open').addEventListener('click', open);
document.addEventListener('keydown', (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '');
  if ((e.key === '/' && !typing) || (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
    e.preventDefault();
    open();
  }
});

// --- back to where the learner came from -------------------------------------------

// The build puts a sensible default into the link ("back to the content" on
// an item). If the learner came from another page of this site, the link
// leads there instead, with its filters, and says where that is. Going back
// uses the browser's history when it can, so the page comes back exactly as
// it was left, scroll position included.
// The page this tab showed last, as it was when it was left (filters set by
// replaceState included): only if that is the referrer is history.back() safe.
let lastPage = null;
try {
  lastPage = sessionStorage.getItem('hocs-last-page');
} catch {}
addEventListener('pagehide', () => {
  try {
    sessionStorage.setItem('hocs-last-page', `${location.pathname}${location.search}`);
  } catch {}
});

const backLink = document.querySelector('[data-back]');
if (backLink) placeBack(backLink);

async function placeBack(link) {
  let from;
  try {
    from = new URL(document.referrer);
  } catch {
    return;
  }
  if (from.origin !== location.origin || from.pathname === location.pathname) return;
  // paths look like /<area>/<lang>/<section>/<id>/
  const [hereArea, lang, hereSection, hereId] = location.pathname.split('/').filter(Boolean);
  const page = `${hereSection}/${hereId}`;
  let [fromArea, , section, id] = from.pathname.split('/').filter(Boolean);
  let switched = false;
  if (fromArea === hereArea && section === hereSection && id === hereId) {
    // Coming from the same page in the other language: the place to go back
    // to is where that page came from, in this language.
    let saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem('hocs-back'));
    } catch {}
    if (saved?.page !== page) return;
    from = new URL(saved.from.replace(/^\/([a-z]+)\/(de|en)\//, `/$1/${lang}/`), location.origin);
    [fromArea, , section, id] = from.pathname.split('/').filter(Boolean);
    switched = true;
  }
  try {
    sessionStorage.setItem('hocs-back', JSON.stringify({ page, from: `${from.pathname}${from.search}` }));
  } catch {}

  const labels = JSON.parse(link.dataset.back);
  let label;
  // a page of the other area is named by the area, not by its own title
  if (fromArea !== hereArea) return;
  if (!section) label = labels.home;
  else if (!id) {
    const filtered = section === 'items' && [...from.searchParams.keys()].some((k) => k !== 'view');
    label = filtered ? labels.filtered : labels[section];
  } else {
    const data = await loadIndex();
    const docs = { items: data.items, paths: data.paths, courses: data.courses, projects: data.projects }[section] ?? [];
    const doc = docs.find((d) => d.id === id);
    if (doc) label = labels.titled.replace('{title}', doc.title);
  }
  if (!label) return;

  // A course link (…/learning/?code=…) would only open the course again, and
  // it replaced itself in the history, so back would go too far.
  const viaHistory = !switched && section !== 'learning' && lastPage === `${from.pathname}${from.search}` && history.length > 1;
  link.href = section === 'learning' ? from.pathname : `${from.pathname}${from.search}`;
  link.querySelector('.back-label').textContent = label;
  link.addEventListener('click', (e) => {
    if (!viaHistory || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    history.back();
  });
}

// --- the area menu behind the title -----------------------------------------------------

const areaMenu = document.querySelector('.area-menu');
if (areaMenu) {
  document.addEventListener('click', (e) => {
    if (areaMenu.open && !areaMenu.contains(e.target)) areaMenu.open = false;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && areaMenu.open) {
      areaMenu.open = false;
      areaMenu.querySelector('summary').focus();
    }
  });
}
