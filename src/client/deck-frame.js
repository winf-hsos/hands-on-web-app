// Embedded slide decks (stagekit, pages.mjs slidesBlock). A deck listens for
// keys in its own document, which only has the keyboard after a click into it.
// Full screen from the button below the deck left the focus on the button, so
// the arrows went to this page and the deck stayed on its title slide. The
// button therefore hands the focus to the deck, this page passes keys on while
// a deck fills the screen, and a click anywhere on a slide turns it: stagekit
// itself turns only at the outer fifths, which suits a presenter, but a reader
// clicks into the middle.

const frames = [...document.querySelectorAll('.deck-frame iframe')];

function passKey(frame, e) {
  const win = frame.contentWindow;
  win.focus();
  const { key, code, shiftKey, ctrlKey, altKey, metaKey } = e;
  win.document.dispatchEvent(new win.KeyboardEvent('keydown', { key, code, shiftKey, ctrlKey, altKey, metaKey, bubbles: true, cancelable: true }));
}

function clickToTurn(frame) {
  const doc = frame.contentDocument;
  if (!doc?.defaultView?.stagekit || doc.clickToTurn) return;
  doc.clickToTurn = true;
  let overlay = false;
  // noted before stagekit closes an open code window: that click only closes it
  doc.addEventListener('click', () => (overlay = Boolean(doc.querySelector('.code-overlay'))), true);
  doc.addEventListener('click', (e) => {
    const win = doc.defaultView;
    const x = e.clientX / win.innerWidth;
    if (overlay || x < 0.2 || x > 0.8 || e.defaultPrevented || String(win.getSelection())) return;
    if (e.target.closest('a, button, input, textarea, select, summary, iframe, [data-no-advance], .code-overlay') || e.target.isContentEditable) return;
    win.stagekit.next();
  });
}

for (const frame of frames) {
  frame.addEventListener('load', () => clickToTurn(frame));
  if (frame.contentDocument?.readyState === 'complete') clickToTurn(frame);
}

for (const button of document.querySelectorAll('[data-fullscreen]')) {
  button.addEventListener('click', async () => {
    const frame = document.querySelector(button.dataset.fullscreen);
    if (!frame) return;
    await frame.requestFullscreen();
    frame.contentWindow.focus();
  });
}

document.addEventListener('keydown', (e) => {
  const frame = frames.find((f) => f === document.fullscreenElement);
  if (!frame || e.key === 'Escape') return;
  e.preventDefault();
  passKey(frame, e);
});
