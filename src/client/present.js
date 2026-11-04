// Presenting the code boxes of a page (runner.js): a code box goes onto a
// stage that fills the screen, together with the heading of its section and
// the paragraph right above it, so that a page with code becomes an
// interactive presentation, in which the code is changed and run together
// on a projector (Nicolas, 2026-11-04). The arrow keys (outside the editor),
// Page Up and Page Down (which presentation clickers send) and two small
// buttons go to the previous and the next code box of the page; F or Escape
// leave. The box itself is moved onto the stage and back, so what was typed
// and run stays with it, and the page is left at the box shown last.
//
// Context and box are scaled together, like an element in focus mode
// (focus.js): to the width of the screen, and so that the box with a fixed
// room of eight lines for its output fits the height as well.

const L = JSON.parse(document.body.dataset.focusLabels ?? '{}');
const icon = (path) => `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const ENTER = icon('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>');
const LEAVE = icon('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>');
const PREVIOUS = icon('<path d="M15 6l-6 6 6 6"/>');
const NEXT = icon('<path d="M9 6l6 6-6 6"/>');
const MAX_ZOOM = 2.5;
const MIN_ZOOM = 0.5;
const native = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const typing = (e) => e.target.closest?.('input, textarea, select, [contenteditable]');

const entries = [];
let stage = null;
let shown = null; // the entry on the stage

/** The element that stands where the entry's box belongs on the page. */
const place = (entry) => (entry === shown ? entry.holder : entry.box);
const inOrder = () =>
  entries
    .filter((e) => place(e).isConnected)
    .sort((a, b) => (place(a).compareDocumentPosition(place(b)) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

/** Copies of the heading of the section `at` stands in and of the paragraph right above it. */
function context(at) {
  const root = at.closest('main') ?? document.body;
  const before = (node) => node.compareDocumentPosition(at) & Node.DOCUMENT_POSITION_FOLLOWING;
  const heading = [...root.querySelectorAll('h2, h3, h4')].filter(before).at(-1) ?? root.querySelector('h1');
  let above = at.previousElementSibling;
  if (above && !above.matches('p, ul, ol, blockquote')) above = null;
  return [heading, above].filter(Boolean).map((node) => {
    const copy = node.cloneNode(true);
    for (const n of [copy, ...copy.querySelectorAll('[id]')]) n.removeAttribute('id');
    copy.querySelectorAll('button, .heading-anchor').forEach((n) => n.remove());
    return copy;
  });
}

function build() {
  stage = document.createElement('div');
  stage.className = 'code-stage';
  stage.tabIndex = -1;
  stage.innerHTML = `
    <div class="prose stage-context"></div>
    <div class="prose stage-box"></div>
    <nav class="stage-nav" aria-label="${L.present}">
      <button type="button" class="focus-toggle" data-go="-1" title="${L.previous} (←)" aria-label="${L.previous}">${PREVIOUS}</button>
      <span class="stage-position" aria-live="polite"></span>
      <button type="button" class="focus-toggle" data-go="1" title="${L.next} (→)" aria-label="${L.next}">${NEXT}</button>
      <button type="button" class="focus-toggle" data-leave title="${L.leavePresent} (F)" aria-label="${L.leavePresent}">${LEAVE}</button>
    </nav>`;
  document.body.append(stage);
  stage.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.go))));
  stage.querySelector('[data-leave]').addEventListener('click', close);
  // full screen, where the browser grants it, is only an addition: the stage covers the page anyway
  stage.addEventListener('fullscreenchange', () => (document.fullscreenElement === stage ? fit() : close()));
  stage.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const writing = typing(e);
    if (e.key === 'PageDown' || (!writing && e.key === 'ArrowRight')) go(1);
    else if (e.key === 'PageUp' || (!writing && e.key === 'ArrowLeft')) go(-1);
    else if (!writing && (e.key === 'f' || e.key === 'F')) close();
    else if (!writing && e.key === 'Escape' && document.fullscreenElement !== stage) close();
    else return;
    e.preventDefault();
    e.stopPropagation();
  });
  addEventListener('resize', fit);
}

/** Puts `entry` on the stage in place of the one shown, and its box in place of the holder. */
function show(entry) {
  const previous = shown;
  if (previous) {
    previous.holder.replaceWith(previous.box);
    previous.box.classList.remove('on-stage');
  }
  shown = entry;
  stage.querySelector('.stage-context').replaceChildren(...context(entry.box));
  entry.box.replaceWith(entry.holder);
  stage.querySelector('.stage-box').replaceChildren(entry.box);
  entry.box.classList.add('on-stage');
  const list = inOrder();
  const n = list.indexOf(entry) + 1;
  stage.querySelector('.stage-position').textContent = fill(L.position, { n, total: list.length });
  stage.querySelector('[data-go="-1"]').disabled = n <= 1;
  stage.querySelector('[data-go="1"]').disabled = n >= list.length;
  previous?.label();
  entry.label();
  stage.scrollTop = 0;
  fit();
}

function go(step) {
  if (!shown) return;
  const list = inOrder();
  const next = list[list.indexOf(shown) + step];
  if (!next) return;
  show(next);
  stage.focus({ preventScroll: true });
}

function open(entry) {
  if (!stage) build();
  entry.width = entry.box.getBoundingClientRect().width;
  stage.classList.add('is-open');
  document.documentElement.classList.add('has-focus');
  show(entry);
  if (native) stage.requestFullscreen().catch(() => {});
  stage.focus({ preventScroll: true });
}

function close() {
  if (!shown) return;
  if (document.fullscreenElement === stage) {
    document.exitFullscreen(); // fullscreenchange comes back here
    return;
  }
  const entry = shown;
  shown = null;
  entry.holder.replaceWith(entry.box);
  entry.box.classList.remove('on-stage');
  stage.classList.remove('is-open');
  document.documentElement.classList.remove('has-focus');
  entry.label();
  entry.box.scrollIntoView({ block: 'center' });
  entry.box.focus({ preventScroll: true });
}

/** Scales context and box together, so that both fit the width and the box with its output the height. */
function fit() {
  if (!shown) return;
  const words = stage.querySelector('.stage-context');
  const style = getComputedStyle(stage);
  const room = stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  let best = { zoom: 0 };
  for (const w of [shown.width, 800, 960]) {
    stage.style.setProperty('--focus-width', `${w}px`);
    stage.style.setProperty('--focus-zoom', '1');
    const height = words.getBoundingClientRect().height + shown.height() + 24;
    const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (innerWidth * 0.92) / w, (room * 0.98) / height));
    if (zoom > best.zoom) best = { zoom, w };
  }
  stage.style.setProperty('--focus-width', `${best.w}px`);
  stage.style.setProperty('--focus-zoom', best.zoom.toFixed(3));
}

/**
 * Gives a code box its button for presenting, placed into `bar`; `height()`
 * measures the box with a fixed room for its output. Returns a function that
 * fits the stage again, for when the code has changed.
 */
export function presentable(box, bar, height) {
  const button = Object.assign(document.createElement('button'), { type: 'button', className: 'focus-toggle' });
  bar.append(button);
  if (box.tabIndex < 0 && !box.hasAttribute('tabindex')) box.tabIndex = -1;
  const entry = {
    box,
    height,
    width: 0,
    holder: Object.assign(document.createElement('div'), { className: 'stage-holder' }),
    label() {
      const on = shown === entry;
      button.innerHTML = on ? LEAVE : ENTER;
      button.title = `${on ? L.leavePresent : L.present} (F)`;
      button.setAttribute('aria-label', on ? L.leavePresent : L.present);
      button.setAttribute('aria-pressed', String(on));
    },
  };
  entries.push(entry);
  button.addEventListener('click', () => (shown === entry ? close() : open(entry)));
  box.addEventListener('keydown', (e) => {
    if (shown || e.ctrlKey || e.metaKey || e.altKey || typing(e)) return;
    if (e.key !== 'f' && e.key !== 'F') return;
    open(entry);
    e.preventDefault();
  });
  entry.label();
  return () => queueMicrotask(fit);
}
