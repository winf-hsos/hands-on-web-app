// Focus mode for code boxes, result tables and quizzes (runner.js,
// tables.js, quiz.js): one button shows the element alone on the screen,
// enlarged to the width of the screen, so that a class can read it on a
// projector and work on it together (Nicolas, 2026-11-01).
//
// Unlike a demonstrator (demo-frame.js), the element is scaled by its width
// only: a quiz grows when its explanation opens and a code box when it
// prints, and fitting the height as well would make the text jump. What does
// not fit scrolls. F switches focus while the element has the focus, Escape
// leaves. Where the browser has no full screen for elements, the same view
// opens as a layer over the page.

const L = JSON.parse(document.body.dataset.focusLabels ?? '{}');
const icon = (path) => `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const ENTER = icon('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>');
const LEAVE = icon('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>');
const MAX_ZOOM = 2.5;
const native = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);

const isFocused = (box) => document.fullscreenElement === box || box.classList.contains('is-focus');
const typing = (e) => e.target.closest?.('input, textarea, select, [contenteditable]');

/**
 * Gives `box` a focus button, placed into `bar`; returns the button.
 * `width()` measures what is to fill the screen, by default the box itself.
 */
export function focusable(box, bar, width = () => box.getBoundingClientRect().width) {
  const button = Object.assign(document.createElement('button'), { type: 'button', className: 'button button-quiet focus-toggle' });
  bar.append(button);
  box.classList.add('focusable');
  if (box.tabIndex < 0 && !box.hasAttribute('tabindex')) box.tabIndex = -1;

  function label() {
    const on = isFocused(box);
    button.innerHTML = `${on ? LEAVE : ENTER}<span>${on ? L.leave : L.enter}</span>`;
    button.title = `${on ? L.leave : L.enter} (F)`;
    button.setAttribute('aria-pressed', String(on));
  }

  // The children keep the width the element has on the page and are scaled
  // to the width of the screen; the element itself fills the screen and scrolls.
  function fit() {
    if (!isFocused(box)) return;
    const zoom = Math.min(MAX_ZOOM, (innerWidth * 0.92) / box.dataset.focusFits);
    box.style.setProperty('--focus-zoom', Math.max(1, zoom).toFixed(3));
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
  return button;
}
