// Behaviour shared by every page: theme, progress marks, "mark as done",
// and the search dialog.
import { load, update, isDone, today, loadIndex } from './progress.js';

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
      a.style.setProperty('--topic', r.color ?? 'var(--accent)');
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
  const byCode = [...data.items, ...data.paths, ...data.courses].find((d) => String(d.code) === query);
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
