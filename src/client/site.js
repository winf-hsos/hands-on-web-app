// Behaviour shared by every page: theme, progress marks, "mark as done",
// the search dialog, the list or card view (view.js), copy buttons on code
// (copy.js), shortcuts and full screen for demonstrators (demo-frame.js) and the
// background (backdrop.js).
import { load, update, isDone, today, loadIndex } from './progress.js';
import './backdrop.js';
import './copy.js';
import './demo-frame.js';
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

// The green check of a done row in a path, course or list is a button: it
// offers to take the mark back, in a small popover beside it.
const { markedDone, markUndone } = document.body.dataset;
let undo;

function offerUndo(check) {
  const id = check.closest('[data-progress-id]').dataset.progressId;
  if (!undo) {
    undo = document.createElement('div');
    undo.className = 'undo-pop';
    undo.popover = 'auto';
    undo.innerHTML = '<button type="button"></button>';
    undo.firstChild.textContent = markUndone;
    document.body.append(undo);
    addEventListener('scroll', () => undo.matches(':popover-open') && undo.hidePopover(), { passive: true });
    undo.addEventListener('toggle', (e) => e.newState === 'closed' && undo.check?.setAttribute('aria-expanded', 'false'));
  }
  undo.firstChild.onclick = () => {
    undo.hidePopover();
    update(id, (p) => {
      p.done = undefined;
    });
    check.closest('[data-progress-id]').querySelector('.row-link')?.focus();
  };
  undo.check = check;
  const box = check.getBoundingClientRect();
  undo.style.left = `${Math.max(8, Math.min(box.left - 8, innerWidth - 260))}px`;
  undo.style.top = `${box.bottom + 6}px`;
  undo.showPopover();
  check.setAttribute('aria-expanded', 'true');
  undo.firstChild.focus();
}

document.addEventListener('click', (e) => {
  const check = e.target.closest('.row.is-done :is(.row-step, .row-done)');
  if (check) offerUndo(check);
});
document.addEventListener('keydown', (e) => {
  const check = e.target.closest?.('.row.is-done :is(.row-step, .row-done)');
  if (check && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    offerUndo(check);
  }
});

function render(progress) {
  for (const el of document.querySelectorAll('[data-progress-id]')) {
    const done = isDone(progress, el.dataset.progressId);
    el.classList.toggle('is-done', done);
    const check = el.querySelector(':scope > :is(.row-step, .row-done)');
    if (!check) continue;
    if (done) {
      Object.assign(check, { tabIndex: 0, title: `${markedDone} – ${markUndone}` });
      check.setAttribute('role', 'button');
      check.setAttribute('aria-label', `${markedDone}: ${markUndone}`);
      check.setAttribute('aria-haspopup', 'true');
      check.setAttribute('aria-expanded', 'false');
      check.removeAttribute('aria-hidden');
    } else {
      for (const name of ['tabindex', 'role', 'aria-label', 'aria-haspopup', 'aria-expanded']) check.removeAttribute(name);
      check.title = check.classList.contains('row-done') ? markedDone : '';
      if (check.classList.contains('row-step')) check.setAttribute('aria-hidden', 'true');
    }
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

// a page has two such links: an arrow beside its kicker and, on an item, a
// button at the end; both name the place in their tooltip
const backLinks = [...document.querySelectorAll('[data-back]')];
if (backLinks.length) placeBack(backLinks);

async function placeBack(links) {
  let from;
  try {
    from = new URL(document.referrer);
  } catch {
    return;
  }
  if (from.origin !== location.origin || from.pathname === location.pathname) return;
  // paths look like /<area>/<lang>/<section>/<id>/, on the site with drafts
  // with /drafts in front. Courses are called modules on the site and live
  // under /modules/.
  const parts = (path) => {
    const p = path.split('/').filter(Boolean).filter((part, i) => i > 0 || part !== 'drafts');
    if (p[2] === 'modules') p[2] = 'courses';
    return p;
  };
  const [hereArea, lang, hereSection, hereId] = parts(location.pathname);
  const page = `${hereSection}/${hereId}`;
  let [fromArea, , section, id] = parts(from.pathname);
  let switched = false;
  if (fromArea === hereArea && section === hereSection && id === hereId) {
    // Coming from the same page in the other language: the place to go back
    // to is where that page came from, in this language.
    let saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem('hocs-back'));
    } catch {}
    if (saved?.page !== page) return;
    from = new URL(saved.from.replace(/\/(de|en)\//, `/${lang}/`), location.origin);
    [fromArea, , section, id] = parts(from.pathname);
    switched = true;
  }
  try {
    sessionStorage.setItem('hocs-back', JSON.stringify({ page, from: `${from.pathname}${from.search}` }));
  } catch {}

  const labels = JSON.parse(links[0].dataset.back);
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
  for (const link of links) {
    link.href = section === 'learning' ? from.pathname : `${from.pathname}${from.search}`;
    link.setAttribute('aria-label', label);
    link.dataset.tip = label;
    link.addEventListener('click', (e) => {
      if (!viaHistory || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      history.back();
    });
  }
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
