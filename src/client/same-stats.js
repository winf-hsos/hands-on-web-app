// Same numbers, different pictures: one scatter plot whose points move from
// one shape to the next (a cloud, a circle, a star, a heart …), while the
// summary beside it, means, standard deviations and correlation, stays the
// same to two decimals. The points can be hidden, so that a class first sees
// only the numbers and guesses what the data look like.
//
// The shapes come from scripts/same-stats-data.mjs, after the method of
// Matejka and Fitzmaurice (2017); point i of every shape belongs to point i
// of every other, so each point travels on its own path. The move between
// two shapes is a real process here and therefore animated; with reduced
// motion the points jump.
//
// Written with ```same-stats in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-same-stats-labels on <body>).
import { keys, steady } from './demo-frame.js';
import { SHAPES } from './same-stats-data.js';

const L = JSON.parse(document.body.dataset.sameStatsLabels ?? '{}');
const NAMES = Object.keys(SHAPES);
const SIZE = 400; // the plot in SVG units, square
const PAD = { left: 52, right: 14, top: 12, bottom: 42 };
const MOVE = 1100; // milliseconds from one shape to the next
const PLAY = 2600; // milliseconds per shape while playing
const TICKS = [0, 25, 50, 75, 100];
const NS = 'http://www.w3.org/2000/svg';

const lang = document.documentElement.lang || 'en';
// toFixed as in the script, then the decimal sign of the page's language
const point = new Intl.NumberFormat(lang).format(0.5).charAt(1);
const number = { format: (v) => v.toFixed(2).replace('.', point).replace('-', '\u2212') };
const px = (x) => PAD.left + (x / 10000) * (SIZE - PAD.left - PAD.right);
const py = (y) => SIZE - PAD.bottom - (y / 10000) * (SIZE - PAD.top - PAD.bottom);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Means, sample standard deviations and Pearson's r of a shape, in plot
    units: on the hundredths as integers and in the same order as
    scripts/same-stats-data.mjs, so that the page rounds exactly the values the
    script checked. */
export function summary(pairs) {
  const n = pairs.length / 2;
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (let i = 0; i < pairs.length; i += 2) {
    const x = pairs[i], y = pairs[i + 1];
    sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y;
  }
  const mx = sx / n, my = sy / n;
  const vx = (sxx - n * mx * mx) / (n - 1), vy = (syy - n * my * my) / (n - 1);
  const cov = (sxy - n * mx * my) / (n - 1);
  return { meanX: mx / 100, meanY: my / 100, sdX: Math.sqrt(vx) / 100, sdY: Math.sqrt(vy) / 100, r: cov / Math.sqrt(vx * vy) };
}

function setup(box, id) {
  const stat = (key) => `<div class="ss-stat"><dt>${L.stats[key]}</dt><dd data-stat="${key}"></dd></div>`;
  box.innerHTML = `
    <div class="ss-shapes" role="group" aria-labelledby="ss-shapes-${id}">
      <span class="dg-label" id="ss-shapes-${id}">${L.shape}</span>
      ${NAMES.map((name, i) => `<button type="button" class="chip-button" data-shape="${i}">${L.names[name] ?? name}</button>`).join('')}
    </div>
    <div class="ss-body">
      <div class="ss-plot-box">
        <svg class="ss-plot" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="${L.plot}"></svg>
        <p class="ss-guess" aria-hidden="true">${L.guess}</p>
      </div>
      <div class="ss-side">
        <p class="dg-label">${L.summary}</p>
        <dl class="ss-stats">${['meanX', 'meanY', 'sdX', 'sdY', 'r'].map(stat).join('')}</dl>
        <p class="ss-now" aria-live="polite"><span>${L.now}</span> <b data-out="now"></b></p>
      </div>
    </div>
    <div class="ss-controls">
      <button type="button" class="button button-quiet" data-prev>${L.prev}</button>
      <button type="button" class="button" data-next>${L.next}</button>
      <button type="button" class="button button-quiet" data-play></button>
      <button type="button" class="button button-quiet" data-points></button>
    </div>
    <p class="dg-note">${L.note}</p>`;

  const $ = (selector) => box.querySelector(selector);
  const svg = $('.ss-plot');
  const plotBox = $('.ss-plot-box');
  const shapeButtons = [...box.querySelectorAll('[data-shape]')];
  const showNow = steady($('[data-out="now"]'), NAMES.map((name) => L.names[name] ?? name));
  const showPlay = steady($('[data-play]'), [L.play, L.pause]);
  const showPoints = steady($('[data-points]'), [L.hide, L.show]);

  // axes and grid, drawn once
  const add = (parent, tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    parent.append(el);
    return el;
  };
  const grid = add(svg, 'g', { class: 'ss-grid' });
  for (const t of TICKS) {
    add(grid, 'line', { x1: px(t * 100), x2: px(t * 100), y1: py(0), y2: py(10000) });
    add(grid, 'line', { x1: px(0), x2: px(10000), y1: py(t * 100), y2: py(t * 100) });
    add(grid, 'text', { x: px(t * 100), y: SIZE - PAD.bottom + 18, 'text-anchor': 'middle' }).textContent = t;
    add(grid, 'text', { x: PAD.left - 8, y: py(t * 100) + 4, 'text-anchor': 'end' }).textContent = t;
  }
  add(grid, 'text', { x: px(5000), y: SIZE - 4, 'text-anchor': 'middle', class: 'ss-axis' }).textContent = 'x';
  add(grid, 'text', { x: 10, y: py(5000) + 4, class: 'ss-axis' }).textContent = 'y';
  const dots = add(svg, 'g', { class: 'ss-dots' });
  const count = SHAPES[NAMES[0]].length / 2;
  const circles = Array.from({ length: count }, () => add(dots, 'circle', { r: 3.2 }));

  let current = 0;
  let shown = SHAPES[NAMES[0]].slice(); // the positions on screen, also mid-move
  let frame = 0;
  let timer = 0;
  let hidden = false;

  const place = (pairs) => {
    circles.forEach((c, i) => {
      c.setAttribute('cx', px(pairs[2 * i]).toFixed(1));
      c.setAttribute('cy', py(pairs[2 * i + 1]).toFixed(1));
    });
  };

  function render() {
    shapeButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === current)));
    const s = summary(SHAPES[NAMES[current]]);
    for (const [key, value] of Object.entries(s)) $(`[data-stat="${key}"]`).textContent = number.format(value);
    showNow(L.names[NAMES[current]] ?? NAMES[current]);
    showPlay(timer ? L.pause : L.play);
    showPoints(hidden ? L.show : L.hide);
    plotBox.classList.toggle('is-hidden', hidden);
  }

  function go(index) {
    current = (index + NAMES.length) % NAMES.length;
    const from = shown.slice();
    const to = SHAPES[NAMES[current]];
    cancelAnimationFrame(frame);
    render();
    if (still()) {
      shown = to.slice();
      place(shown);
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const t = ease(Math.min(1, (now - start) / MOVE));
      for (let i = 0; i < to.length; i++) shown[i] = from[i] + (to[i] - from[i]) * t;
      place(shown);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  const stop = () => {
    clearInterval(timer);
    timer = 0;
  };
  const togglePlay = () => {
    if (timer) stop();
    else {
      timer = setInterval(() => go(current + 1), PLAY);
      go(current + 1);
    }
    render();
  };
  const togglePoints = () => {
    hidden = !hidden;
    render();
  };
  const choose = (i) => {
    stop();
    go(i);
  };

  shapeButtons.forEach((b, i) => b.addEventListener('click', () => choose(i)));
  $('[data-prev]').addEventListener('click', () => choose(current - 1));
  $('[data-next]').addEventListener('click', () => choose(current + 1));
  $('[data-play]').addEventListener('click', togglePlay);
  $('[data-points]').addEventListener('click', togglePoints);

  keys(
    box,
    [
      [`→ / ${L.keySpace}`, L.keyNext],
      ['←', L.keyPrev],
      [`1 – ${NAMES.length}`, L.keyShape],
      ['A', L.keyPlay],
      ['P', L.keyPoints],
    ],
    (key) => {
      const k = key.toLowerCase();
      if (key === 'ArrowRight' || key === ' ') choose(current + 1);
      else if (key === 'ArrowLeft') choose(current - 1);
      else if (key >= '1' && key <= String(NAMES.length)) choose(Number(key) - 1);
      else if (k === 'a') togglePlay();
      else if (k === 'p') togglePoints();
      else return false;
      return true;
    },
  );

  place(shown);
  render();
}

document.querySelectorAll('[data-same-stats]').forEach((box, i) => setup(box, i));
