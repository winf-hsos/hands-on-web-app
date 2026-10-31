// The frame of every demonstrator (imported by site.js): two quiet buttons
// above it, one for its keyboard shortcuts and one for full screen, so that
// it can be shown on a projector in class.
//
// Shortcuts: ? opens and closes the list, F switches full screen, Escape
// closes. A demonstrator adds its own keys with `keys()` below; they appear
// in the same list and work while the focus is inside the frame, which a
// click anywhere in it gives.
//
// Full screen: the demonstrator keeps the layout it has on the page and is
// scaled up to fill the screen, so nothing reflows and the controls stay
// where they were. Where the browser has no full screen for elements (Safari
// on the iPhone) or refuses it (inside a frame), the same view opens as a
// layer over the page.

const L = JSON.parse(document.body.dataset.demoFrameLabels ?? '{}');
const icon = (path) => `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const ENTER = icon('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>');
const LEAVE = icon('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>');
const KEYBOARD = icon('<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6.5 10h1M10.5 10h1M14.5 10h1M6.5 14h11"/>');
const MAX_ZOOM = 3;
const native = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);

const isFull = (frame) => document.fullscreenElement === frame || frame.classList.contains('is-fullscreen');

// Keys are for the demonstrator, not for a field someone is typing in, and
// never together with Ctrl, Alt or Cmd, which belong to the browser.
const ignored = (e) => e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.('input, textarea, select, [contenteditable]');

/**
 * The keyboard shortcuts of a demonstrator. `list` holds [keys, what they do]
 * for the overview, with the keys separated by spaces ("1 – 8", "↑ / ↓");
 * `handle(key)` gets every key pressed inside the frame and returns true for
 * the ones it used.
 */
export function keys(box, list, handle) {
  const frame = box.closest('[data-demo]') ?? box;
  frame.demoKeys = list;
  frame.addEventListener('keydown', (e) => {
    if (!ignored(e) && handle(e.key)) e.preventDefault();
  });
}

function setup(frame) {
  const stage = frame.lastElementChild;
  frame.tabIndex = -1; // a click anywhere in the frame gives it the focus
  const bar = Object.assign(document.createElement('div'), { className: 'demo-bar' });
  const button = (title) => Object.assign(document.createElement('button'), { type: 'button', className: 'demo-tool', title });
  const help = button(`${L.keys} (?)`);
  help.innerHTML = `${KEYBOARD}<span>${L.keys}</span>`;
  help.setAttribute('aria-expanded', 'false');
  const full = button('');
  bar.append(help, full);
  const panel = Object.assign(document.createElement('div'), { className: 'demo-keys', hidden: true });
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-label', L.keys);
  frame.prepend(bar, panel);

  // --- shortcuts ---------------------------------------------------------------

  function showKeys(open) {
    if (open) {
      const rows = [...(frame.demoKeys ?? []), ['F', L.fullscreenKey], ['?', L.helpKey], ['Esc', L.escKey]];
      const kbd = (text) => text.split(' ').map((k) => (k === '–' || k === '/' ? ` ${k} ` : `<kbd>${k}</kbd>`)).join('');
      panel.innerHTML = `<p class="demo-keys-head">${L.keys}</p><dl>${rows.map(([k, what]) => `<dt>${kbd(k)}</dt><dd>${what}</dd>`).join('')}</dl><p class="demo-keys-note">${L.focusNote}</p>`;
    }
    panel.hidden = !open;
    help.setAttribute('aria-expanded', String(open));
  }

  help.addEventListener('click', () => showKeys(panel.hidden));
  frame.addEventListener('pointerdown', (e) => !panel.hidden && !panel.contains(e.target) && !help.contains(e.target) && showKeys(false));
  frame.addEventListener('keydown', (e) => {
    if (ignored(e)) return;
    if (e.key === '?') showKeys(panel.hidden);
    else if (e.key === 'f' || e.key === 'F') isFull(frame) ? leave() : enter();
    else if (e.key === 'Escape' && !panel.hidden) showKeys(false);
    else if (e.key === 'Escape' && frame.classList.contains('is-fullscreen')) leave();
    else return;
    e.preventDefault();
  });

  // --- full screen -------------------------------------------------------------

  function label() {
    const on = isFull(frame);
    full.innerHTML = `${on ? LEAVE : ENTER}<span>${on ? L.leave : L.enter}</span>`;
    full.title = `${on ? L.leave : L.enter} (F)`;
    full.setAttribute('aria-pressed', String(on));
  }

  // the width the demonstrator had on the page, scaled to fit the screen
  function fit() {
    if (!isFull(frame)) return;
    // measured as drawn and divided by the zoom, so that setting the same
    // zoom again changes nothing and the observer below comes to rest
    const zoom = Number(stage.style.zoom) || 1;
    const { width, height } = stage.getBoundingClientRect();
    const room = { width: innerWidth * 0.94, height: (innerHeight - bar.offsetHeight) * 0.92 };
    const next = Math.min(MAX_ZOOM, room.width / (width / zoom), room.height / (height / zoom));
    if (Math.abs(next - zoom) > 0.01) stage.style.zoom = next.toFixed(3);
  }

  function enter() {
    frame.style.setProperty('--demo-width', `${stage.getBoundingClientRect().width}px`);
    if (native) frame.requestFullscreen().catch(layer);
    else layer();
  }

  function layer() {
    frame.classList.add('is-fullscreen');
    document.documentElement.classList.add('has-fullscreen-demo');
    changed();
  }

  function leave() {
    if (document.fullscreenElement === frame) document.exitFullscreen();
    else {
      frame.classList.remove('is-fullscreen');
      document.documentElement.classList.remove('has-fullscreen-demo');
      changed();
    }
  }

  function changed() {
    if (!isFull(frame)) {
      stage.style.zoom = '';
      frame.style.removeProperty('--demo-width');
    }
    label();
    requestAnimationFrame(fit);
    // the keys keep working in full screen
    if (!frame.contains(document.activeElement)) frame.focus({ preventScroll: true });
  }

  full.addEventListener('click', () => (isFull(frame) ? leave() : enter()));
  frame.addEventListener('fullscreenchange', changed);
  addEventListener('resize', fit);
  // demonstrators that grow (a new table, a longer message) keep fitting
  new ResizeObserver(() => isFull(frame) && fit()).observe(stage);
  label();
}

for (const frame of document.querySelectorAll('[data-demo]')) setup(frame);
