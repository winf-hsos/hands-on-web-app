// Arithmetic with meaning (Nicolas, 2026-11-05, for the experiment "A map of
// meaning"): three words and two signs in text fields, king − man + woman,
// turned into numbers by the same small embedding model as the map of
// meaning (client/embedding.js), added and subtracted number by number, and
// compared with a fixed list of English words. The list shows the nearest
// words, leaving out the ones typed, with their similarity, the same sum as
// in the experiment's R box. A sketch beside it shows the calculation: with
// one minus and two plus, its four corners form a parallelogram, because the
// calculation adds the same arrow twice, and the star at the fourth corner
// carries the nearest word.
//
// The words to search and their numbers come from a file next to the page,
// named in the block (```word-arithmetic with media/arithmetic-words.json,
// written by scripts/meaning-data.mjs): per word a scale and 384 integers of
// 8 bits. The typed words are embedded in the browser, so any word works as
// input, while the result is always one of the words of the file.
import { keys, steady } from './demo-frame.js';
import { embedder, megabytes, dot, format, fill, svgEl } from './embedding.js';

const L = JSON.parse(document.body.dataset.wordArithmeticLabels ?? '{}');
const SHOWN = 6; // words in the list
const START = ['king', 'man', 'woman'];

/** The words of the file and their numbers as arrays of 384. */
async function vocabulary(file) {
  const data = await (await fetch(new URL(file, location.href))).json();
  const bytes = Uint8Array.from(atob(data.vectors), (c) => c.charCodeAt(0));
  const ints = new Int8Array(bytes.buffer);
  return data.words.map((word, i) => ({
    word,
    vector: Array.from(ints.subarray(i * data.dims, (i + 1) * data.dims), (x) => x * data.scales[i]),
  }));
}

function setup(box) {
  const file = box.dataset.wordArithmetic;
  box.innerHTML = `
    <div class="mm-start">
      <p>${L.intro}</p>
      <button type="button" class="button" data-load>${L.load}</button>
      <p class="mm-status" data-out="status" aria-live="polite"></p>
    </div>
    <div class="wa-main" hidden>
      <form class="wa-form" data-calc>
        <input class="mm-input wa-term" type="text" autocomplete="off" spellcheck="false" aria-label="${L.first}" value="${START[0]}">
        <button type="button" class="wa-sign" data-sign="-1" aria-label="${L.toggle}">−</button>
        <input class="mm-input wa-term" type="text" autocomplete="off" spellcheck="false" aria-label="${L.second}" value="${START[1]}">
        <button type="button" class="wa-sign" data-sign="1" aria-label="${L.toggle}">+</button>
        <input class="mm-input wa-term" type="text" autocomplete="off" spellcheck="false" aria-label="${L.third}" value="${START[2]}" placeholder="${L.optional}">
        <button type="submit" class="button">${L.compute}</button>
      </form>
      <div class="wa-result">
        <figure class="wa-figure">
          <svg class="wa-plot" viewBox="0 0 200 130" role="img" aria-label="${L.plot}"></svg>
          <figcaption class="mm-caption">${L.caption}</figcaption>
        </figure>
        <div>
          <p class="dg-label">${L.nearest}</p>
          <ol class="wa-results" aria-live="polite"></ol>
          <p class="mm-caption" data-out="note"></p>
        </div>
      </div>
    </div>`;

  const $ = (selector) => box.querySelector(selector);
  const out = (name) => $(`[data-out="${name}"]`);
  const terms = [...box.querySelectorAll('.wa-term')];
  const signs = [...box.querySelectorAll('.wa-sign')];
  const svg = $('.wa-plot');
  const results = $('.wa-results');
  const show = { status: steady(out('status'), [L.ready, fill(L.loading, { done: 99, total: 99 }), L.failed]) };
  show.status(L.ready);

  let embed = null;
  let words = [];

  async function load() {
    $('[data-load]').disabled = true;
    try {
      [{ embed }, words] = await Promise.all([
        embedder(megabytes((done, total) => show.status(fill(L.loading, { done, total })))),
        vocabulary(file),
      ]);
    } catch (error) {
      console.error(error);
      show.status(L.failed);
      $('[data-load]').disabled = false;
      return;
    }
    $('.mm-start').hidden = true;
    $('.wa-main').hidden = false;
    out('note').textContent = fill(L.note, { n: words.length });
    calculate();
  }

  /**
   * A sketch of the calculation, not a measured map: the similarity compares
   * directions, and no flat picture shows the result next to its nearest
   * word for every calculation (a shadow of the numbers on two directions
   * tried on 2026-11-05 put queen far from the star). With one minus and
   * two plus the corners form a parallelogram, because the same arrow is
   * added twice; any other calculation is drawn as a chain of arrows.
   */
  function draw(inputs, best) {
    svg.replaceChildren();
    const lines = svgEl('g', { class: 'wa-lines' });
    svg.append(lines);
    const arrow = ([x1, y1], [x2, y2], cls) => {
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
      const [bx, by] = [x2 - ux * 9, y2 - uy * 9]; // stop short of the dot or star
      lines.append(svgEl('line', { x1: x1 + ux * 5, y1: y1 + uy * 5, x2: bx, y2: by, class: cls }));
      if (cls === 'is-side') return;
      const head = [[bx + ux * 5, by + uy * 5], [bx - uy * 2.4, by + ux * 2.4], [bx + uy * 2.4, by - ux * 2.4]];
      lines.append(svgEl('polygon', { points: head.map((p) => p.join(',')).join(' '), class: cls }));
    };
    const text = ([x, y], words, cls, anchor = 'middle') => {
      const t = svgEl('text', { x, y, 'text-anchor': anchor, class: cls });
      t.textContent = words;
      svg.append(t);
    };
    const spot = (p, word, below) => {
      svg.append(svgEl('circle', { cx: p[0], cy: p[1], r: 2.6, class: 'wa-dot' }));
      text([p[0], p[1] + (below ? 11 : -6)], word, 'wa-word-label');
    };
    const star = (p) => {
      const r = 5;
      const corners = Array.from({ length: 10 }, (_, k) => {
        const a = (Math.PI / 5) * k - Math.PI / 2;
        const len = k % 2 ? r * 0.45 : r;
        return `${(p[0] + len * Math.cos(a)).toFixed(2)},${(p[1] + len * Math.sin(a)).toFixed(2)}`;
      });
      const mark = svgEl('polygon', { points: corners.join(' '), class: 'wa-star' });
      const title = svgEl('title', {});
      title.textContent = L.star;
      mark.append(title);
      svg.append(mark);
      text([p[0], p[1] - 9], `≈ ${best.word}  ${format(best.value)}`, 'wa-best');
    };

    const minus = inputs.findIndex((t) => t.sign < 0);
    const plus = inputs.map((_, i) => i).filter((i) => inputs[i].sign > 0);
    if (inputs.length === 3 && minus >= 0 && plus.length === 2) {
      // the subtracted word bottom left, the first added one above it, the
      // second added one bottom right and the star above that
      const [bl, tl, br, tr] = [[40, 102], [62, 40], [140, 102], [162, 40]];
      arrow(bl, tl, 'is-arrow');
      arrow(br, tr, 'is-arrow');
      arrow(bl, br, 'is-side');
      arrow(tl, tr, 'is-side');
      spot(bl, inputs[minus].text, true);
      spot(tl, inputs[plus[0]].text, false);
      spot(br, inputs[plus[1]].text, true);
      star(tr);
      return;
    }
    // otherwise a chain: the first word, then one arrow per further word
    const places = inputs.length === 3 ? [[25, 95], [100, 50], [175, 95]] : [[40, 90], [160, 55]];
    spot(places[0], inputs[0].text, true);
    inputs.slice(1).forEach((t, k) => {
      const [from, to] = [places[k], places[k + 1]];
      arrow(from, to, 'is-arrow');
      const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 12];
      text(mid, `${t.sign < 0 ? '−' : '+'} ${t.text}`, 'wa-step');
      if (k < inputs.length - 2) svg.append(svgEl('circle', { cx: to[0], cy: to[1], r: 1.6, class: 'wa-pass' }));
    });
    star(places[inputs.length - 1]);
  }

  let latest = 0; // only the last calculation started is shown
  async function calculate() {
    if (!embed) return;
    const run = ++latest;
    const inputs = terms
      .map((input, i) => ({ text: input.value.trim(), sign: i === 0 ? 1 : Number(signs[i - 1].dataset.sign) }))
      .filter((t) => t.text);
    if (inputs.length < 2) return;
    for (const t of inputs) t.vector = await embed(t.text);
    if (run !== latest) return;
    const target = inputs[0].vector.map((_, k) => inputs.reduce((s, t) => s + t.sign * t.vector[k], 0));
    const typed = new Set(inputs.map((t) => t.text.toLowerCase()));
    const ranking = words
      .filter((w) => !typed.has(w.word))
      .map((w) => ({ ...w, value: dot(target, w.vector) }))
      .sort((a, b) => b.value - a.value);
    const top = ranking[0].value || 1;
    results.replaceChildren(
      ...ranking.slice(0, SHOWN).map(({ word, value }, k) => {
        const li = Object.assign(document.createElement('li'), { className: `wa-row${k === 0 ? ' is-first' : ''}` });
        const bar = Object.assign(document.createElement('span'), { className: 'mm-bar' });
        bar.style.setProperty('--share', Math.max(0, value / top).toFixed(3));
        li.append(
          Object.assign(document.createElement('span'), { className: 'mm-value', textContent: format(value) }),
          bar,
          Object.assign(document.createElement('span'), { className: 'wa-word', textContent: word }),
        );
        return li;
      }),
    );
    draw(inputs, ranking[0]);
  }

  $('[data-load]').addEventListener('click', load);
  signs.forEach((sign) =>
    sign.addEventListener('click', () => {
      sign.dataset.sign = String(-Number(sign.dataset.sign));
      sign.textContent = sign.dataset.sign === '1' ? '+' : '−';
      calculate();
    }),
  );
  $('[data-calc]').addEventListener('submit', (e) => {
    e.preventDefault();
    calculate();
  });

  keys(box, [['L', L.keyLoad], ['W', L.keyWords]], (key) => {
    const k = key.toLowerCase();
    if (k === 'l' && !embed) load();
    else if (k === 'w' && embed) terms[0].select();
    else return false;
    return true;
  });
}

document.querySelectorAll('[data-word-arithmetic]').forEach(setup);
