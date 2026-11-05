// A gallery of pictures (```gallery in Markdown, remark-knowledge.mjs): the
// page shows them small in a grid, and a click opens one large in a view over
// the page, with its description below it, two small arrows to the previous
// and the next picture of the gallery and a button that closes it. The arrow
// keys, Page Up and Page Down go through the pictures, Escape closes. The view
// keeps one size for every picture, so that nothing jumps while going
// through them (Nicolas, 2026-11-05, for the cards of Be the Agent).
//
// Without this script every small picture is a link to its file.

const icon = (path) => `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const PREVIOUS = icon('<path d="M15 6l-6 6 6 6"/>');
const NEXT = icon('<path d="M9 6l6 6-6 6"/>');
const CLOSE = icon('<path d="M6 6l12 12M18 6L6 18"/>');
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);

function setup(gallery) {
  const L = JSON.parse(gallery.dataset.gallery || '{}');
  const items = [...gallery.querySelectorAll('.gallery-item')];
  let view = null;
  let index = 0;

  function build() {
    view = document.createElement('dialog');
    view.className = 'gallery-view';
    view.innerHTML = `
      <div class="gallery-stage"><img alt=""></div>
      <p class="gallery-caption" aria-live="polite"></p>
      <nav class="stage-nav">
        <button type="button" class="focus-toggle" data-go="-1" title="${L.previous} (←)" aria-label="${L.previous}">${PREVIOUS}</button>
        <span class="stage-position"></span>
        <button type="button" class="focus-toggle" data-go="1" title="${L.next} (→)" aria-label="${L.next}">${NEXT}</button>
        <button type="button" class="focus-toggle" data-close title="${L.close} (Esc)" aria-label="${L.close}">${CLOSE}</button>
      </nav>`;
    document.body.append(view);
    view.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.go))));
    view.querySelector('[data-close]').addEventListener('click', () => view.close());
    // a click beside the picture, on the dark backdrop, closes as well
    view.addEventListener('click', (e) => e.target === view && view.close());
    view.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1);
      else return;
      e.preventDefault();
    });
    view.addEventListener('close', () => items[index].focus({ preventScroll: true }));
  }

  function show(i) {
    index = i;
    const picture = items[i].querySelector('img');
    const big = view.querySelector('.gallery-stage img');
    big.src = items[i].getAttribute('href');
    big.alt = picture.alt;
    view.querySelector('.gallery-caption').textContent = picture.alt;
    view.querySelector('.stage-position').textContent = fill(L.position, { n: i + 1, total: items.length });
    view.querySelector('[data-go="-1"]').disabled = i === 0;
    view.querySelector('[data-go="1"]').disabled = i === items.length - 1;
  }

  function go(step) {
    const next = index + step;
    if (next >= 0 && next < items.length) show(next);
  }

  items.forEach((item, i) =>
    item.addEventListener('click', (e) => {
      if (e.button || e.ctrlKey || e.metaKey || e.shiftKey) return; // a new tab stays possible
      e.preventDefault();
      if (!view) build();
      show(i);
      view.showModal();
    }),
  );
}

document.querySelectorAll('[data-gallery]').forEach(setup);
