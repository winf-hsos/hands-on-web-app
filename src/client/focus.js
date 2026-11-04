// Focus mode for code boxes, result tables and quizzes (runner.js,
// tables.js, quiz.js): one button shows the element alone on the screen,
// enlarged to the width of the screen, so that a class can read it on a
// projector and work on it together (Nicolas, 2026-11-01).
//
// Unlike a demonstrator (demo-frame.js), the element is not measured as it
// is, because it grows while someone works with it and its text would jump.
// A table is scaled by its width only. A quiz fits the height as well,
// measured with everything its question can open, and a code box with a
// fixed room for its output (Nicolas, 2026-11-02), so that nothing changes
// size while a question is answered or a program runs.
// The button is a small symbol in the element's header row, named only in its
// tooltip, so that it does not compete with the element's own buttons
// (Nicolas, 2026-11-04).
// F switches focus while the element has the focus, Escape leaves. Where the
// browser has no full screen for elements, the same view opens as a layer
// over the page.

const L = JSON.parse(document.body.dataset.focusLabels ?? '{}');
const icon = (path) => `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const ENTER = icon('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>');
const LEAVE = icon('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>');
const MAX_ZOOM = 2.5;
const MIN_ZOOM = 0.5;
const native = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);

const isFocused = (box) => document.fullscreenElement === box || box.classList.contains('is-focus');
const typing = (e) => e.target.closest?.('input, textarea, select, [contenteditable]');

/**
 * Gives `box` a focus button, placed into `bar`. `width()` measures what is to
 * fill the screen, by default the box itself; `height()`, if given, the height
 * at the page's size of what must fit on the screen as well, laid out at the
 * current `--focus-width`. `widths` are further column widths to try then, of
 * which the one that comes out largest wins. Returns a function that fits
 * again, for when what `height()` measures has changed.
 */
export function focusable(box, bar, { width = () => box.getBoundingClientRect().width, height, widths = [] } = {}) {
  const button = Object.assign(document.createElement('button'), { type: 'button', className: 'focus-toggle' });
  bar.append(button);
  box.classList.add('focusable');
  if (box.tabIndex < 0 && !box.hasAttribute('tabindex')) box.tabIndex = -1;

  function label() {
    const on = isFocused(box);
    button.innerHTML = on ? LEAVE : ENTER;
    button.title = `${on ? L.leave : L.enter} (F)`;
    button.setAttribute('aria-label', on ? L.leave : L.enter);
    button.setAttribute('aria-pressed', String(on));
  }

  // The children keep the width the element has on the page and are scaled
  // to the width of the screen; the element itself fills the screen and scrolls.
  function fit() {
    if (!isFocused(box)) return;
    const across = (w) => Math.min(MAX_ZOOM, (innerWidth * 0.92) / w);
    if (!height) {
      box.style.setProperty('--focus-zoom', Math.max(1, across(box.dataset.focusFits)).toFixed(3));
      return;
    }
    const style = getComputedStyle(box);
    const room = box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    let best = { zoom: 0 };
    for (const w of [Number(box.dataset.focusFits), ...widths]) {
      box.style.setProperty('--focus-width', `${w}px`);
      // a little to spare, for rounding at the larger size
      const zoom = Math.max(MIN_ZOOM, Math.min(across(w), (room * 0.98) / height()));
      if (zoom > best.zoom) best = { zoom, w };
    }
    box.style.setProperty('--focus-width', `${best.w}px`);
    box.style.setProperty('--focus-zoom', best.zoom.toFixed(3));
  }

  function enter() {
    box.dataset.focusFits = width();
    box.style.setProperty('--focus-width', `${box.getBoundingClientRect().width}px`);
    if (native) box.requestFullscreen().catch(layer);
    else layer();
  }

  function layer() {
    box.classList.add('is-focus');
    document.documentElement.classList.add('has-focus');
    changed();
  }

  function leave() {
    if (document.fullscreenElement === box) document.exitFullscreen();
    else {
      box.classList.remove('is-focus');
      document.documentElement.classList.remove('has-focus');
      changed();
    }
  }

  function changed() {
    const on = isFocused(box);
    box.classList.toggle('in-focus', on);
    if (on) fit();
    else ['--focus-zoom', '--focus-width'].forEach((p) => box.style.removeProperty(p));
    label();
    if (!box.contains(document.activeElement)) box.focus({ preventScroll: true });
    if (!on) box.scrollIntoView({ block: 'nearest' });
  }

  button.addEventListener('click', () => (isFocused(box) ? leave() : enter()));
  box.addEventListener('fullscreenchange', changed);
  box.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e)) return;
    if (e.key === 'f' || e.key === 'F') isFocused(box) ? leave() : enter();
    else if (e.key === 'Escape' && box.classList.contains('is-focus')) leave();
    else return;
    e.preventDefault();
  });
  addEventListener('resize', fit);
  label();
  return fit;
}
