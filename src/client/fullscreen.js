// A full-screen button above every demonstrator (imported by site.js), so
// that it can be shown on a projector in class. In full screen the
// demonstrator keeps the layout it has on the page and is scaled up to fill
// the screen, so nothing reflows and the controls stay where they were.
// Where the browser has no full screen for elements (Safari on the iPhone)
// or refuses it (inside a frame), the same view opens as a layer over the
// page.

const L = JSON.parse(document.body.dataset.demoFullscreenLabels ?? '{}');
const ENTER = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
const LEAVE = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
const MAX_ZOOM = 3;
const native = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);

const isFull = (frame) => document.fullscreenElement === frame || frame.classList.contains('is-fullscreen');

function setup(frame) {
  const stage = frame.lastElementChild;
  const bar = Object.assign(document.createElement('div'), { className: 'demo-bar' });
  const button = Object.assign(document.createElement('button'), { type: 'button', className: 'demo-fullscreen' });
  bar.append(button);
  frame.prepend(bar);

  function label() {
    const full = isFull(frame);
    button.innerHTML = `${full ? LEAVE : ENTER}<span>${full ? L.leave : L.enter}</span>`;
    button.setAttribute('aria-pressed', String(full));
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
  }

  button.addEventListener('click', () => (isFull(frame) ? leave() : enter()));
  frame.addEventListener('fullscreenchange', changed);
  addEventListener('resize', fit);
  // the layer has no Escape of its own, unlike the native full screen
  addEventListener('keydown', (e) => e.key === 'Escape' && frame.classList.contains('is-fullscreen') && leave());
  // demonstrators that grow (a new table, a longer message) keep fitting
  new ResizeObserver(() => isFull(frame) && fit()).observe(stage);
  label();
}

for (const frame of document.querySelectorAll('[data-demo]')) setup(frame);
