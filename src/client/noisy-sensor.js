// The noisy sensor: the sender sends a symbol, LED off or LED on, and the
// receiver reads the sensor and decides at the calibrated threshold. The same
// readings decide three times: alone, averaged over five and averaged over
// ten. Both effects show at once, fewer wrong decisions and fewer symbols per
// second. Every lane keeps the last 40 symbols as stacked dots, a red dot is
// a wrong decision, and the numbers beside it count every symbol sent. Taken
// over from the LiFi concept demos (noisy-sensor) and drawn in the platform's
// own design.
//
// The random numbers come from a seeded generator, so that a demonstration in
// class starts the same way every time.
//
// Written with ```noisy-sensor in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-noisy-sensor-labels on <body>).
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.noisySensorLabels ?? '{}');
const MIN = 0; // the axis: sensor value of the clear channel, arbitrary units
const MAX = 100;
const OFF = 35; // how "LED off" arrives: room light, never zero
const ON = 65; // how "LED on" arrives
const THRESHOLD = (OFF + ON) / 2; // the threshold from the calibration
const RATE = 20; // readings per second at an integration time of 50 ms
const LANES = [1, 5, 10]; // how many readings one decision averages
const NOISE = [6, 11, 17]; // low, medium, high
const KEEP = 40; // symbols kept as dots
const BIN = 2; // width of one stack of dots, in axis units
const SEED = 44; // chosen so that the single reading shows its errors early
const BURST = 25;

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const lang = document.documentElement.lang || 'en';
const decimal = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
const percent = (value) => Math.max(0, Math.min(100, ((value - MIN) / (MAX - MIN)) * 100));

/** A seeded generator (linear congruential) and normally distributed noise from it. */
export function generator(seed) {
  let state = seed;
  const random = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const gauss = () => Math.sqrt(-2 * Math.log(Math.max(random(), 1e-9))) * Math.cos(2 * Math.PI * random());
  return { random, gauss };
}

/** The value each lane decides on: the mean of its first n readings. */
export const laneValues = (readings) => LANES.map((n) => readings.slice(0, n).reduce((a, b) => a + b, 0) / n);

function setup(box, id) {
  const laneName = (n) =>
    n === 1
      ? `<span class="ns-n">${L.single}</span><span class="ns-sub">${L.singleSub}</span>`
      : `<span class="ns-n">${fill(L.mean, { n })}</span><span class="ns-sub">${fill(L.meanSub, { n })}</span>`;

  box.innerHTML = `
    <div class="ns-controls">
      <button type="button" class="button" data-send>${L.send}</button>
      <button type="button" class="button button-quiet" data-burst>${fill(L.burst, { n: BURST })}</button>
      <button type="button" class="button button-quiet" data-reset>${L.reset}</button>
      <span class="ns-noise" role="group" aria-labelledby="ns-noise-${id}">
        <span class="dg-label" id="ns-noise-${id}">${L.noise}</span>
        ${L.noiseNames.map((name, i) => `<button type="button" class="chip-button" data-noise="${i}">${name}</button>`).join('')}
      </span>
    </div>
    <p class="ns-sent" aria-live="polite">${L.last} <b data-out="sent"></b></p>
    <div class="ns-lanes">
      <span></span>
      <div class="ns-head" aria-hidden="true">
        <span class="ns-side">${L.readsOff}</span>
        <span class="ns-mark ns-off" style="left:${percent(OFF)}%">${L.ledOff}</span>
        <span class="ns-mark ns-thr" style="left:${percent(THRESHOLD)}%">${L.threshold}</span>
        <span class="ns-mark ns-on" style="left:${percent(ON)}%">${L.ledOn}</span>
        <span class="ns-side ns-side-on">${L.readsOn}</span>
      </div>
      <span></span>
      ${LANES.map(
        (n) => `
        <div class="ns-name">${laneName(n)}</div>
        <div class="ns-lane" data-lane="${n}" aria-hidden="true">
          <div class="ns-region" style="width:${percent(THRESHOLD)}%"></div>
          <div class="ns-centre" style="left:${percent(OFF)}%"></div>
          <div class="ns-centre ns-centre-on" style="left:${percent(ON)}%"></div>
          <div class="ns-thr-line" style="left:${percent(THRESHOLD)}%"></div>
        </div>
        <div class="ns-stats" data-stats="${n}">
          <p class="ns-wrong" data-out="wrong"></p>
          <p class="ns-sub" data-out="readings"></p>
          <p class="ns-sub">${fill(L.rate, { rate: decimal.format(RATE / n) })}</p>
        </div>`,
      ).join('')}
      <span class="dg-label ns-axis-name">${L.axis}</span>
      <div class="ns-axis" aria-hidden="true">
        ${[MIN, 25, 50, 75, MAX].map((v) => `<span style="left:${percent(v)}%">${v}</span>`).join('')}
      </div>
      <span></span>
    </div>
    <p class="dg-note">${L.note}</p>
    <p class="dg-note">${L.simulated}</p>`;

  const $ = (selector) => box.querySelector(selector);
  const noiseButtons = [...box.querySelectorAll('[data-noise]')];
  const showSent = steady($('[data-out="sent"]'), ['—', L.ledOff, L.ledOn]);
  const lanes = LANES.map((n, index) => {
    const stats = $(`[data-stats="${n}"]`);
    const big = 9999;
    return {
      n,
      index,
      lane: $(`[data-lane="${n}"]`),
      stats,
      wrong: steady(stats.querySelector('[data-out="wrong"]'), [fill(L.wrong, { wrong: big, sent: big })]),
      readings: steady(stats.querySelector('[data-out="readings"]'), [fill(L.readings, { readings: big * 10 })]),
    };
  });

  let noise = 1;
  let rng;
  let history; // per symbol: { symbol, values: [v1, v5, v10] }
  let sent;
  let wrong;
  let last;

  function reset() {
    rng = generator(SEED);
    history = [];
    sent = 0;
    wrong = LANES.map(() => 0);
    last = '';
    render();
  }

  function send() {
    const symbol = rng.random() < 0.5 ? 'on' : 'off';
    const centre = symbol === 'on' ? ON : OFF;
    // ten readings; every lane uses as many of them as it averages
    const readings = Array.from({ length: 10 }, () => centre + rng.gauss() * NOISE[noise]);
    const values = laneValues(readings);
    values.forEach((value, i) => {
      if ((value > THRESHOLD ? 'on' : 'off') !== symbol) wrong[i] += 1;
    });
    sent += 1;
    history.push({ symbol, values });
    if (history.length > KEEP) history = history.slice(-KEEP);
    last = symbol;
  }

  function draw() {
    lanes.forEach(({ index, lane }) => {
      lane.querySelectorAll('.ns-dot').forEach((dot) => dot.remove());
      // first count how high the tallest stack gets, then choose the row
      // height so that it still fits into the lane
      const heights = new Map();
      for (const entry of history) {
        const bin = Math.round(entry.values[index] / BIN);
        heights.set(bin, (heights.get(bin) ?? 0) + 1);
      }
      const tallest = Math.max(1, ...heights.values());
      const step = Math.min(9, (lane.clientHeight - 16) / tallest);
      const stacks = new Map();
      history.forEach((entry, position) => {
        const value = entry.values[index];
        const bin = Math.round(value / BIN);
        const row = stacks.get(bin) ?? 0;
        stacks.set(bin, row + 1);
        const isWrong = (value > THRESHOLD ? 'on' : 'off') !== entry.symbol;
        const dot = document.createElement('span');
        dot.className = `ns-dot${isWrong ? ' is-wrong' : ''}${position === history.length - 1 ? ' is-current' : ''}`;
        dot.style.left = `${percent(value)}%`;
        dot.style.bottom = `${8 + row * step}px`;
        lane.append(dot);
      });
    });
  }

  function render() {
    noiseButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === noise)));
    showSent(last === 'on' ? L.ledOn : last === 'off' ? L.ledOff : '—');
    lanes.forEach(({ n, index, stats, wrong: showWrong, readings }) => {
      showWrong(fill(L.wrong, { wrong: wrong[index], sent }));
      readings(fill(L.readings, { readings: sent * n }));
      stats.classList.toggle('has-wrong', wrong[index] > 0);
    });
    draw();
  }

  const sendOne = () => {
    send();
    render();
  };
  const sendMany = () => {
    for (let i = 0; i < BURST; i++) send();
    render();
  };
  const setNoise = (i) => {
    noise = i;
    reset();
  };

  $('[data-send]').addEventListener('click', sendOne);
  $('[data-burst]').addEventListener('click', sendMany);
  $('[data-reset]').addEventListener('click', reset);
  noiseButtons.forEach((b, i) => b.addEventListener('click', () => setNoise(i)));

  // the stacks follow the height of the lanes, which changes on a phone and in full screen
  new ResizeObserver(() => draw()).observe(lanes[0].lane);

  // keys only while the focus is in the demonstrator, so the page still scrolls
  keys(
    box,
    [
      [L.keySpace, L.keySend],
      ['B', fill(L.keyBurst, { n: BURST })],
      ['R', L.keyReset],
      ['1 – 3', L.keyNoise],
    ],
    (key) => {
      const k = key.toLowerCase();
      if (key === ' ' || k === 's') sendOne();
      else if (k === 'b') sendMany();
      else if (k === 'r') reset();
      else if (key >= '1' && key <= '3') setNoise(Number(key) - 1);
      else return false;
      return true;
    },
  );

  reset();
}

document.querySelectorAll('[data-noisy-sensor]').forEach((box, i) => setup(box, i));
