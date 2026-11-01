// Drawings on content pages (docs/figures.md). Every figure[data-figure] is
// drawn from the item's figures.js with stagekit's draw.js, which reads the
// colours of the page at the moment it draws; so a drawing is drawn again
// when the page turns light or dark. A drawing with an animation (anim.js)
// starts at its first resting state and gets buttons below it: play the next
// segment, one step back, and the step it stands at. Nothing moves before
// someone presses play, and with reduced motion the buttons jump instead.
const { lang } = document.body.dataset;
const L = JSON.parse(document.body.dataset.figureLabels);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const PLAY = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
const BACK = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';

const drawings = [];
// anim.js lets a segment with `auto` call the deck for the next one; here
// that is the drawing whose animation played last
let playing = null;
window.stagekit ??= { next: () => playing?.forward() };

function setup(fig) {
  const spec = window.figures?.[fig.dataset.figure];
  const canvas = fig.querySelector('.drawing-canvas');
  if (!spec) {
    canvas.textContent = L.missing;
    return;
  }
  let anim = null;
  let key = 0; // the resting state shown: 0 is the start, n after segment n
  let controls = null;

  const draw = () => {
    canvas.innerHTML = spec.draw(lang);
    if (!spec.animate) return;
    anim = window.draw.anim(canvas.id);
    spec.animate(anim, lang);
    anim.onchange = paint;
    anim.frame(key + anim.first - 1);
    controls ??= buttons();
    paint();
  };

  function buttons() {
    const play = Object.assign(document.createElement('button'), { type: 'button', className: 'button drawing-play' });
    const back = Object.assign(document.createElement('button'), { type: 'button', className: 'button button-quiet drawing-back', innerHTML: BACK });
    back.setAttribute('aria-label', L.back);
    back.title = L.back;
    const state = Object.assign(document.createElement('span'), { className: 'drawing-step' });
    state.setAttribute('aria-live', 'polite');
    const bar = Object.assign(document.createElement('div'), { className: 'drawing-bar' });
    bar.append(play, back, state);
    canvas.after(bar);
    play.addEventListener('click', () => forward());
    back.addEventListener('click', () => {
      if (anim.prev()) return;
      key = Math.max(0, key - 1);
      anim.frame(key + anim.first - 1);
      paint();
    });
    return { play, back, state };
  }

  // the next segment; while one plays, to its end; after the last, from the start
  function forward() {
    playing = drawing;
    if (anim.next()) return paint();
    if (key === anim.steps) {
      key = 0;
      anim.frame(anim.first - 1);
    }
    key += 1;
    anim.frame(key + anim.first - 1, reduced.matches ? undefined : 'play');
    paint();
  }

  function paint() {
    if (!controls) return;
    const n = anim.steps;
    const label = key === 0 ? L.play : key === n ? L.again : L.next;
    controls.play.innerHTML = `${PLAY}<span>${label}</span>`;
    controls.back.disabled = key === 0;
    controls.state.textContent = key === 0 || n === 1 ? '' : L.step.replace('{n}', key).replace('{total}', n);
  }

  const drawing = { draw, forward };
  drawings.push(drawing);
  draw();
}

for (const fig of document.querySelectorAll('figure.drawing[data-figure]')) setup(fig);

// light or dark: by the button (data-theme) or by the system
const redraw = () => drawings.forEach((d) => d.draw());
new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redraw);
