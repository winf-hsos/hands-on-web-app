// The distinguishability lab: a simulated channel drawn like an oscilloscope,
// in two layers.
//
//   1. The analog signal runs through as a thin, noisy curve. Its noise is a
//      property of the channel and does not depend on the measurement window.
//   2. The measurement window lies on the time axis as bands, every second one
//      shaded. At the end of each band the receiver averages all raw values in
//      it into one reading, the bar. Longer windows make the bands wider and
//      the readings calmer, but deliver fewer of them per second. The symbol
//      recognised stands above each band and runs along below the picture as
//      the record of what was received; errors are red.
//
// The reader sends: a click on a level, a digit or the arrow keys. A change of
// symbol in the middle of a band honestly gives a mixed reading. The
// disturbance adds a decaying drift to the signal, like stray light or mains
// hum. The signal could be light, voltage or sound; the real numbers come from
// one's own link. Taken over from the LiFi concept demos
// (distinguishability-lab) and drawn in the platform's own design.
//
// The drawing runs only while it can be seen, and starts paused for anyone
// who asked their system for reduced motion.
//
// Written with ```distinguishability-lab in Markdown (remark-knowledge.mjs);
// the labels come from the page (data-distinguishability-lab-labels on <body>).
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.distinguishabilityLabLabels ?? '{}');
const SCALE = 1024; // signal scale, arbitrary units
const FLOOR = 70; // lowest level sent
const TOP = SCALE - 40; // highest level sent
const RAW_DT = 5; // ms between two raw values of the channel
const SIGMA_RAW = 116; // spread of a single raw value
const HISTORY = 400; // readings counted for the error rate
const TRANSCRIPT = 60; // length of the record of what was received
const DIGITS = '0123456789ABCDEF';
const PX_PER_MS = 0.35; // time axis: the width of a band is the window length
const PAD = 14;
const PAD_TOP = 30; // room for the row of recognised symbols
const PAD_LEFT = 44; // room for the names of the levels
const K = { min: 2, max: 16, start: 4 };
const WIN = { min: 10, max: 500, step: 10, start: 50 };
const SPEED = { min: 10, max: 100, step: 5, start: 35 };

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const lang = document.documentElement.lang || 'en';
const number = new Intl.NumberFormat(lang);
const oneDecimal = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const twoDecimals = new Intl.NumberFormat(lang, { maximumFractionDigits: 2 });

/** The k levels sent, evenly spread from FLOOR to TOP. */
export const levels = (k) => Array.from({ length: k }, (_, i) => FLOOR + (i * (TOP - FLOOR)) / (k - 1));

/** The index of the level nearest to a value: the receiver's decision. */
export function nearest(value, lv) {
  let best = 0;
  lv.forEach((level, i) => {
    if (Math.abs(value - level) < Math.abs(value - lv[best])) best = i;
  });
  return best;
}

function gaussian() {
  const u = 1 - Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

function setup(box, id) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = {
    k: K.start,
    windowMs: WIN.start,
    speed: SPEED.start / 100, // slow motion: share of real time
    current: 1, // the symbol being sent
    paused: reduced,
    results: [], // true = recognised correctly
    received: [], // { digit, ok }
  };

  box.innerHTML = `
    <canvas class="dl-scope" role="img" aria-label="${L.scopeLabel}"></canvas>
    <p class="dl-received"><span class="dg-label">${L.received}</span><span class="dl-tape"><span class="dl-transcript" data-out="transcript"></span></span></p>
    <div class="dl-stats">
      ${[
        ['sending', L.sending, L.sendingNote],
        ['error', L.error, L.errorNote],
        ['rate', L.rate, L.rateNote],
        ['bits', L.bits, ''],
        ['throughput', L.throughput, L.throughputNote],
      ]
        .map(([key, label, note]) => `<div class="dl-stat"><p class="dg-label">${label}</p><p class="dl-value" data-out="${key}"></p><p class="dl-note" data-out="${key}-note">${note}</p></div>`)
        .join('')}
    </div>
    <div class="dg-panel">
      <div class="dg-knob">
        <label class="dg-label" for="dl-k-${id}">${L.alphabet}</label>
        <input type="range" class="dg-range" id="dl-k-${id}" data-knob="k" min="${K.min}" max="${K.max}" step="1" value="${K.start}">
        <p class="dg-reading" data-out="k"></p>
      </div>
      <div class="dg-knob">
        <label class="dg-label" for="dl-win-${id}">${L.window}</label>
        <input type="range" class="dg-range" id="dl-win-${id}" data-knob="win" min="${WIN.min}" max="${WIN.max}" step="${WIN.step}" value="${WIN.start}">
        <p class="dg-reading" data-out="win"></p>
      </div>
      <div class="dg-knob">
        <label class="dg-label" for="dl-speed-${id}">${L.speed}</label>
        <input type="range" class="dg-range" id="dl-speed-${id}" data-knob="speed" min="${SPEED.min}" max="${SPEED.max}" step="${SPEED.step}" value="${SPEED.start}">
        <p class="dg-reading" data-out="speed"></p>
      </div>
    </div>
    <div class="dl-controls">
      <button type="button" class="button button-quiet" data-pause></button>
      <button type="button" class="button button-quiet" data-step>${L.step}</button>
      <button type="button" class="button button-quiet" data-disturb>${L.disturb}</button>
    </div>
    <p class="dg-note">${L.note}</p>`;

  const $ = (selector) => box.querySelector(selector);
  const canvas = $('.dl-scope');
  const knobs = { k: $('[data-knob="k"]'), win: $('[data-knob="win"]'), speed: $('[data-knob="speed"]') };
  const pauseButton = $('[data-pause]');
  const transcript = $('[data-out="transcript"]');
  const systemName = (k) => (L.systems[k] ? fill(L.systems[k], { k }) : fill(L.base, { k }));
  const kText = (k) => fill(L.alphabetReading, { k, name: systemName(k), last: DIGITS[k - 1] });
  const winText = (ms) => fill(L.windowReading, { ms: number.format(ms), n: number.format(Math.round(ms / RAW_DT)) });
  const speedText = (p) => fill(L.speedReading, { p });
  const range = (r) => Array.from({ length: (r.max - r.min) / (r.step ?? 1) + 1 }, (_, i) => r.min + i * (r.step ?? 1));

  // the places that change, each as large as its largest form from the start
  const show = {
    sending: steady($('[data-out="sending"]'), ['F']),
    error: steady($('[data-out="error"]'), [`${oneDecimal.format(100)} %`]),
    rate: steady($('[data-out="rate"]'), [`${number.format(100)}/s`]),
    bits: steady($('[data-out="bits"]'), [twoDecimals.format(3.32)]),
    bitsNote: steady($('[data-out="bits-note"]'), ['log2(16)']),
    throughput: steady($('[data-out="throughput"]'), [`${number.format(400)} bit/s`]),
    k: steady($('[data-out="k"]'), range(K).map(kText)),
    win: steady($('[data-out="win"]'), range(WIN).map(winText)),
    speed: steady($('[data-out="speed"]'), range(SPEED).map(speedText)),
  };

  // --- the simulation ---------------------------------------------------------
  // Simulated time runs in real time, slowed by the display speed; a raw value
  // arises every RAW_DT ms and a reading at every window boundary.
  let simTime = 0;
  let sweepStart = 0; // start of the current screen page
  let nextRawAt = RAW_DT; // lives across frames, so slow motion still arrives
  const raws = []; // { t, v } the raw analog signal
  const marks = []; // { t0, t1, avg, digit, ok } the readings
  let win = null; // the window in progress { t0, sum, n, tally }
  const disturbance = { amp: 0, sign: 1, startedAt: 0 };

  const newWindow = (t0) => (win = { t0, sum: 0, n: 0, tally: new Array(16).fill(0) });

  function disturb() {
    disturbance.amp = 140 + Math.random() * 160;
    disturbance.sign = Math.random() < 0.5 ? -1 : 1;
    disturbance.startedAt = simTime;
  }

  // a fast rise, then a wobbling decay
  function disturbanceOffset() {
    if (!disturbance.amp) return 0;
    const t = (simTime - disturbance.startedAt) / 1000;
    if (t > 6) {
      disturbance.amp = 0;
      return 0;
    }
    const envelope = Math.min(t / 0.4, 1) * Math.exp(-t / 2.2);
    return disturbance.sign * disturbance.amp * envelope * (1 + 0.25 * Math.sin(t * 5.3));
  }

  function step(dtMs) {
    const end = simTime + dtMs;
    const lv = levels(state.k);
    while (nextRawAt <= end) {
      const t = nextRawAt;
      nextRawAt += RAW_DT;
      simTime = t;
      const v = lv[state.current] + gaussian() * SIGMA_RAW + disturbanceOffset();
      raws.push({ t, v });
      win.sum += v;
      win.n += 1;
      win.tally[state.current] += 1;
      if (t >= win.t0 + state.windowMs && win.n > 0) {
        const avg = win.sum / win.n;
        const digit = nearest(avg, lv);
        const sent = win.tally.indexOf(Math.max(...win.tally));
        const ok = digit === sent;
        marks.push({ t0: win.t0, t1: t, avg, digit, ok });
        state.results.push(ok);
        if (state.results.length > HISTORY) state.results.shift();
        state.received.push({ digit, ok });
        if (state.received.length > TRANSCRIPT) state.received.shift();
        newWindow(t);
        stats();
      }
    }
    simTime = end;
  }

  // --- the drawing --------------------------------------------------------------
  // Colours come from the page, so the drawing follows the light and the dark
  // theme; the canvas has as many pixels as it shows, zoomed in full screen too.
  let W = 0;
  let H = 0;
  const yOf = (value) => H - PAD - (value / SCALE) * (H - PAD - PAD_TOP);
  const xOf = (t) => PAD_LEFT + (t - sweepStart) * PX_PER_MS;

  // When the writing head reaches the right edge, a new screen page begins and
  // the old curve disappears; nothing scrolls.
  function prune() {
    if (xOf(simTime) > W - PAD - 4) {
      sweepStart = simTime;
      raws.length = 0;
      marks.length = 0;
    }
  }

  function draw() {
    const ratio = (devicePixelRatio || 1) * (canvas.currentCSSZoom ?? 1);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (canvas.width !== Math.round(W * ratio) || canvas.height !== Math.round(H * ratio)) {
      canvas.width = Math.round(W * ratio);
      canvas.height = Math.round(H * ratio);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!win) return;
    const style = getComputedStyle(box);
    const css = (v) => style.getPropertyValue(v).trim();
    const mono = css('--mono');
    const sans = css('--sans');
    const right = W - PAD;
    const lv = levels(state.k);

    // the window bands, every second one shaded, the one in progress last
    ctx.fillStyle = css('--ink');
    ctx.globalAlpha = 0.05;
    marks.concat([{ t0: win.t0, t1: simTime, running: true }]).forEach((m, i) => {
      if (i % 2 && !m.running) return;
      const x0 = Math.max(PAD_LEFT, xOf(m.t0));
      const x1 = Math.min(right, xOf(m.t1));
      if (x1 > x0) ctx.fillRect(x0, PAD_TOP, x1 - x0, H - PAD - PAD_TOP);
    });
    ctx.globalAlpha = 1;

    // the decision boundaries, dashed
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = css('--rule');
    ctx.lineWidth = 1;
    for (let i = 0; i < lv.length - 1; i++) {
      const y = yOf((lv[i] + lv[i + 1]) / 2);
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // the levels sent with their digits on the left; the one being sent in the accent colour
    ctx.font = `13px ${mono}`;
    ctx.textBaseline = 'middle';
    lv.forEach((level, i) => {
      const y = yOf(level);
      const active = i === state.current;
      ctx.strokeStyle = active ? css('--accent') : css('--quiet');
      ctx.globalAlpha = active ? 1 : 0.6;
      ctx.lineWidth = active ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(right, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = active ? css('--accent') : css('--quiet');
      ctx.fillText(DIGITS[i], 16, y);
    });

    // the analog signal: a thin, noisy curve
    ctx.strokeStyle = css('--quiet');
    ctx.lineWidth = 1;
    ctx.beginPath();
    let started = false;
    for (const r of raws) {
      const x = xOf(r.t);
      if (x < PAD_LEFT) continue;
      ctx[started ? 'lineTo' : 'moveTo'](x, yOf(r.v));
      started = true;
    }
    ctx.stroke();

    // the readings: a bar per band at the height of its mean, the symbol recognised above
    ctx.font = `12px ${mono}`;
    ctx.textAlign = 'center';
    for (const m of marks) {
      const x0 = Math.max(PAD_LEFT, xOf(m.t0));
      const x1 = Math.min(right, xOf(m.t1));
      if (x1 <= x0) continue;
      const colour = m.ok ? css('--ink') : css('--error');
      ctx.strokeStyle = colour;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x0, yOf(m.avg));
      ctx.lineTo(x1, yOf(m.avg));
      ctx.stroke();
      if (x1 - x0 >= 13) {
        ctx.fillStyle = m.ok ? css('--quiet') : colour;
        ctx.fillText(DIGITS[m.digit], (x0 + x1) / 2, PAD_TOP - 12);
      }
    }
    ctx.textAlign = 'start';

    // the writing head
    const head = xOf(simTime);
    ctx.strokeStyle = css('--quiet');
    ctx.beginPath();
    ctx.moveTo(head, PAD_TOP);
    ctx.lineTo(head, H - PAD);
    ctx.stroke();

    const message = disturbance.amp ? L.disturbing : state.paused ? L.paused : '';
    if (message) {
      ctx.fillStyle = disturbance.amp ? css('--error') : css('--quiet');
      ctx.font = `13px ${sans}`;
      ctx.fillText(message, PAD_LEFT + 8, PAD_TOP + 12);
    }
  }

  // --- the clock: frames only while the lab can be seen --------------------------
  let visible = false;
  let frame = 0;
  let lastTs = 0;
  function tick(ts) {
    frame = 0;
    const dt = lastTs ? Math.min(ts - lastTs, 100) : 0; // a hidden tab is not made up for
    lastTs = ts;
    if (!state.paused) {
      step(dt * state.speed);
      prune();
    }
    draw();
    if (visible && !state.paused) frame = requestAnimationFrame(tick);
  }
  function run() {
    if (frame || !visible || state.paused) return;
    lastTs = 0;
    frame = requestAnimationFrame(tick);
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) run();
    else draw();
  }).observe(canvas);

  // --- figures and controls ---------------------------------------------------------
  function stats() {
    const n = state.results.length;
    const errors = state.results.filter((ok) => !ok).length;
    const rate = 1000 / state.windowMs;
    const bits = Math.log2(state.k);
    const errPct = n ? (100 * errors) / n : 0;
    show.error(`${oneDecimal.format(errPct)} %`);
    const errEl = $('[data-out="error"]');
    errEl.classList.toggle('is-good', n > 0 && errPct < 0.5);
    errEl.classList.toggle('is-bad', errPct > 5);
    show.rate(`${number.format(Math.round(rate))}/s`);
    show.bits(twoDecimals.format(bits));
    show.bitsNote(`log2(${state.k})`);
    show.throughput(`${number.format(Math.round(rate * bits))} bit/s`);
    transcript.innerHTML = state.received.map((r) => (r.ok ? DIGITS[r.digit] : `<span class="dl-error">${DIGITS[r.digit]}</span>`)).join('');
  }

  function readKnobs() {
    state.k = Number(knobs.k.value);
    state.windowMs = Number(knobs.win.value);
    state.speed = Number(knobs.speed.value) / 100;
    if (state.current >= state.k) state.current = state.k - 1;
    show.k(kText(state.k));
    show.win(winText(state.windowMs));
    show.speed(speedText(Math.round(state.speed * 100)));
    knobs.k.setAttribute('aria-valuetext', kText(state.k));
    knobs.win.setAttribute('aria-valuetext', winText(state.windowMs));
    knobs.speed.setAttribute('aria-valuetext', speedText(Math.round(state.speed * 100)));
    show.sending(DIGITS[state.current]);
    state.results.length = 0; // new conditions, a new error rate
    newWindow(simTime);
    stats();
    draw();
  }

  function select(i) {
    if (i < 0 || i >= state.k) return;
    state.current = i;
    show.sending(DIGITS[i]);
    state.results.length = 0;
    draw();
  }

  function setPaused(paused) {
    state.paused = paused;
    pauseButton.textContent = paused ? L.run : L.pause;
    if (paused) draw();
    else run();
  }

  // exactly one measurement window, from its start to the finished reading
  function stepOnce() {
    setPaused(true);
    step(Math.max(win.t0 + state.windowMs - simTime, RAW_DT));
    prune();
    draw();
  }

  // a click or tap on the trace chooses the nearest level
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const lv = levels(state.k);
    let best = 0;
    lv.forEach((level, i) => {
      if (Math.abs(y - yOf(level)) < Math.abs(y - yOf(lv[best]))) best = i;
    });
    select(best);
  });
  Object.values(knobs).forEach((knob) => knob.addEventListener('input', readKnobs));
  pauseButton.addEventListener('click', () => setPaused(!state.paused));
  $('[data-step]').addEventListener('click', stepOnce);
  $('[data-disturb]').addEventListener('click', () => {
    disturb();
    draw();
  });

  // redrawn when the canvas changes its size, when full screen zooms it, and when the theme changes
  new ResizeObserver(() => draw()).observe(canvas);
  new MutationObserver(() => draw()).observe(box, { attributes: true, attributeFilter: ['style'] });
  new MutationObserver(() => draw()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => draw());

  // keys only while the focus is in the demonstrator, so the page still scrolls
  keys(
    box,
    [
      ['0 – 9', L.keyDigit],
      ['↑ / ↓', L.keyUpDown],
      [L.keySpace, L.keyPause],
      ['M', L.keyStep],
      ['D', L.keyDisturb],
    ],
    (key) => {
      const digit = '0123456789'.indexOf(key);
      if (key === ' ') setPaused(!state.paused);
      else if (key === 'm' || key === 'M') stepOnce();
      else if (key === 'd' || key === 'D') disturb();
      else if (key === 'ArrowUp') select(state.current + 1);
      else if (key === 'ArrowDown') select(state.current - 1);
      else if (digit >= 0 && digit < state.k) select(digit);
      else return false;
      return true;
    },
  );

  newWindow(0);
  pauseButton.textContent = state.paused ? L.run : L.pause;
  readKnobs();
}

document.querySelectorAll('[data-distinguishability-lab]').forEach((box, i) => setup(box, i));
