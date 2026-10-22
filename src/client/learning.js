// My learning: courses opened by code, what is done, and taking the
// progress along to another browser (link, QR code, file).
import qrcode from 'qrcode-generator';
import { load, save, merge, encode, decode, isDone, loadIndex } from './progress.js';

const $ = (id) => document.getElementById(id);
const data = await loadIndex();
const el = (tag, props = {}, ...children) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

// --- courses ------------------------------------------------------------------

// Access codes are compared without case, spaces or hyphens, so that
// "licht 26" opens LICHT-26 as well.
const normal = (s) => s.toUpperCase().replace(/[\s-]/g, '');

$('course-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const course = data.courses.find((c) => normal(c.access) === normal($('course-code').value));
  $('course-error').hidden = !!course;
  if (!course) return;
  const progress = load();
  if (!progress.courses.includes(course.id)) progress.courses.push(course.id);
  save(progress);
  location.href = course.url;
});

function renderCourses(progress) {
  const list = $('my-courses');
  const mine = progress.courses.map((id) => data.courses.find((c) => c.id === id)).filter(Boolean);
  if (!mine.length) return list.replaceChildren(el('li', { className: 'muted', textContent: list.dataset.empty }));
  list.replaceChildren(
    ...mine.map((course) => {
      const done = course.items.filter((id) => isDone(progress, id)).length;
      const meter = el('div', { className: 'meter' }, el('div', { className: 'meter-track' }, el('div', { className: 'meter-fill' })));
      meter.style.setProperty('--progress', `${course.items.length ? (done / course.items.length) * 100 : 0}%`);
      const remove = el('button', { type: 'button', className: 'text-button', textContent: list.dataset.remove });
      remove.addEventListener('click', () => {
        const p = load();
        p.courses = p.courses.filter((id) => id !== course.id);
        save(p);
      });
      return el(
        'li',
        { className: 'row row-course' },
        el('a', { className: 'row-link', href: course.url }, el('span', { className: 'row-title', textContent: course.title })),
        meter,
        remove,
      );
    }),
  );
}

// --- done -----------------------------------------------------------------------

function renderDone(progress) {
  const list = $('done-list');
  const done = data.items
    .filter((i) => progress.items[i.id]?.done)
    .sort((a, b) => progress.items[b.id].done.localeCompare(progress.items[a.id].done));
  if (!done.length) return list.replaceChildren(el('li', { className: 'muted', textContent: list.dataset.empty }));
  const lang = document.documentElement.lang;
  list.replaceChildren(
    ...done.map((item) => {
      const day = new Date(progress.items[item.id].done).toLocaleDateString(lang, { day: 'numeric', month: 'short' });
      const row = el(
        'li',
        { className: 'row is-done' },
        el(
          'a',
          { className: 'row-link', href: item.url, innerHTML: item.icon },
          el('span', { className: 'row-head' }, el('span', { className: 'row-title', textContent: item.title }), el('span', { className: 'row-meta', textContent: day })),
        ),
      );
      row.style.setProperty('--topic', item.color);
      return row;
    }),
  );
}

// --- taking it along -----------------------------------------------------------

const takeAlong = document.querySelector('.take-along');
async function renderShare(progress) {
  if (!takeAlong.open) return; // the QR code is a detail: only built when asked for
  const link = `${location.origin}${location.pathname}#p=${await encode(progress, data)}`;
  $('share-link').value = link;
  const qr = qrcode(0, 'L');
  qr.addData(link);
  qr.make();
  $('qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
}
takeAlong.addEventListener('toggle', () => renderShare(load()));

const result = $('import-result');
const showResult = (ok) => {
  result.textContent = ok ? result.dataset.done : result.dataset.failed;
  result.hidden = false;
};

// A link with #p=… carries progress from another browser. Only the browser
// sees the part after #; it is never sent to the web server.
const incoming = new URLSearchParams(location.hash.slice(1)).get('p');
if (incoming) {
  decode(incoming, data)
    .then((progress) => {
      $('import').hidden = false;
      const clear = () => {
        $('import').hidden = true;
        history.replaceState(null, '', location.pathname);
      };
      $('import-yes').onclick = () => {
        save(merge(load(), progress));
        clear();
        showResult(true);
      };
      $('import-no').onclick = clear;
    })
    .catch(() => showResult(false));
}
if (location.hash === '#course') $('course-code').focus();

$('copy').addEventListener('click', async (e) => {
  const button = e.currentTarget;
  await navigator.clipboard.writeText($('share-link').value);
  const label = button.textContent;
  button.textContent = button.dataset.done;
  setTimeout(() => (button.textContent = label), 1500);
});

$('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(load(), null, 2)], { type: 'application/json' });
  const a = el('a', { href: URL.createObjectURL(blob), download: `hands-on-cs-progress-${new Date().toISOString().slice(0, 10)}.json` });
  a.click();
  URL.revokeObjectURL(a.href);
});

$('import-file').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const progress = JSON.parse(await file.text());
    if (progress.v !== 1 || typeof progress.items !== 'object') throw new Error('format');
    save(merge(load(), { ...progress, courses: progress.courses ?? [] }));
    showResult(true);
  } catch {
    showResult(false);
  }
});

$('reset').addEventListener('click', (e) => {
  if (confirm(e.currentTarget.dataset.confirm)) save({ v: 1, items: {}, courses: [] });
});

function render(progress) {
  renderCourses(progress);
  renderDone(progress);
  renderShare(progress);
}
document.addEventListener('progress-change', (e) => render(e.detail));
render(load());
