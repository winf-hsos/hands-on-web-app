// The drift simulator: two clocks and one sequence of colors. The sender puts
// a random color into every time slot of fixed length, like the LED of a
// light link. The receiver samples in what it believes to be the middle of
// each slot, but its clock runs off by an adjustable percentage, so the error
// grows with every symbol: the sampling points wander out of their slots, and
// the received line slips against the sent one, with colors read twice or
// skipped.
//
// The colors are only distinguishable symbols and carry no meaning; which
// color stands for what is for every team to decide. A marker every n symbols
// shows the way out: the sender gives up one slot for a marker, the receiver
// realigns on it, the error drops back to zero, and the marker visibly costs
// rate. How the receiver detects the marker in the signal is left out here;
// the demonstrator shows only what realigning does.
//
// Drawn as a sweep: the writing head runs from left to right, nothing scrolls,
// and at the right edge a new screen page begins. The drawing runs only while
// it can be seen, and starts paused for anyone who asked their system for
// reduced motion. Taken over from the LiFi concept demos (drift-simulator,
// commit cf1d269) and drawn in the platform's own design; the deck
// sampling-and-synchronization-slides keeps its own copy of the original.
//
// Written with ```drift-simulator in Markdown (remark-knowledge.mjs); the
// labels come from the page (data-drift-simulator-labels on <body>).
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.driftSimulatorLabels ?? '{}');
const T = 100; // ms per time slot, by the sender's clock
// four distinguishable colors of the LED; they stay the same in both themes
// because they stand for light, not for a meaning on the page
const COLORS = ['#009ee3', '#ffd23f', '#4ade80', '#b06cf0'];
const MARKER = -1; // a marker slot, no data symbol
const HISTORY = 100; // readings counted for the wrong reads
const TRANSCRIPT = 48; // symbols in the sent and received lines
const SEED = 7; // the same colors after every reset, so a demonstration repeats
const ERR = { min: -5, max: 5, step: 0.25, start: 2 }; // receiver clock error in %
const MARK = { min: 0, max: 24, step: 1, start: 0 }; // marker every n symbols, 0 = off
const SPEED = { min: 10, max: 100, step: 5, start: 40 }; // share of real time in %
const SLOT_PX = 38; // width of a time slot in the picture
const PAD = 14;

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const lang = document.documentElement.lang || 'en';
const signed = new Intl.NumberFormat(lang, { maximumFractionDigits: 2, signDisplay: 'exceptZero' });
const offset = new Intl.NumberFormat(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' });
const plain = new Intl.NumberFormat(lang, { maximumFractionDigits: 2 });
const oneDecimal = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });

/** A seeded generator (linear congruential), uniform in [0, 1). */
function generator(seed) {
  let state = seed;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** After how many symbols a clock that is off by `err` (a share) is half a slot off. */
export const halfSlotAfter = (err) => (err === 0 ? Infinity : Math.round(0.5 / Math.abs(err)));

/** The share of slots spent on markers when one comes every `every` symbols. */
export const markerOverhead = (every) => (every > 0 ? 1 / (every + 1) : 0);

function setup(box, id) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = {
    err: ERR.start / 100, // the receiver's clock error as a share
    markerEvery: MARK.start,
    speed: SPEED.start / 100, // slow motion: share of real time
    paused: reduced,
  };

  box.innerHTML = `
    <canvas class="dr-scope" role="img" aria-label="${L.scopeLabel}"></canvas>
    <div class="dr-lines">
      <p class="dr-line"><span class="dg-label">${L.sent}</span><span class="dr-tape"><span class="dr-transcript" data-out="sent"></span></span></p>
      <p class="dr-line"><span class="dg-label">${L.received}</span><span class="dr-tape"><span class="dr-transcript" data-out="received"></span></span></p>
    </div>
    <div class="dr-stats">
      ${[
        ['clock', L.clock, ''],
        ['off', L.off, L.offNote],
        ['half', L.half, L.halfNote],
        ['wrong', L.wrong, L.wrongNote],
        ['overhead', L.overhead, L.overheadNote],
      ]
        .map(([key, label, note]) => `<div class="dr-stat"><p class="dg-label">${label}</p><p class="dr-value" data-out="${key}"></p><p class="dr-note" data-out="${key}-note">${note}</p></div>`)
        .join('')}
    </div>
    <div class="dg-panel">
      <div class="dg-knob">
        <label class="dg-label" for="dr-err-${id}">${L.err}</label>
        <input type="range" class="dg-range" id="dr-err-${id}" data-knob="err" min="${ERR.min}" max="${ERR.max}" step="${ERR.step}" value="${ERR.start}">
        <p class="dg-reading" data-out="err"></p>
      </div>
      <div class="dg-knob">
        <label class="dg-label" for="dr-mark-${id}">${L.marker}</label>
        <input type="range" class="dg-range" id="dr-mark-${id}" data-knob="mark" min="${MARK.min}" max="${MARK.max}" step="${MARK.step}" value="${MARK.start}">
        <p class="dg-reading" data-out="mark"></p>
      </div>
      <div class="dg-knob">
        <label class="dg-label" for="dr-speed-${id}">${L.speed}</label>
        <input type="range" class="dg-range" id="dr-speed-${id}" data-knob="speed" min="${SPEED.min}" max="${SPEED.max}" step="${SPEED.step}" value="${SPEED.start}">
        <p class="dg-reading" data-out="speed"></p>
      </div>
    </div>
    <div class="dr-controls">
      <button type="button" class="button button-quiet" data-pause></button>
      <button type="button" class="button button-quiet" data-step>${L.step}</button>
      <button type="button" class="button button-quiet" data-marker>${L.sendMarker}</button>
      <button type="button" class="button button-quiet" data-reset>${L.reset}</button>
    </div>
    <p class="dg-note">${L.note}</p>`;

  const $ = (selector) => box.querySelector(selector);
  const canvas = $('.dr-scope');
  const knobs = { err: $('[data-knob="err"]'), mark: $('[data-knob="mark"]'), speed: $('[data-knob="speed"]') };
  const pauseButton = $('[data-pause]');
  const sentLine = $('[data-out="sent"]');
  const receivedLine = $('[data-out="received"]');
  const range = (r) => Array.from({ length: Math.round((r.max - r.min) / r.step) + 1 }, (_, i) => r.min + i * r.step);

  const percent = (p) => `${signed.format(p)} %`;
  const errText = (p) => (p === 0 ? L.errZero : fill(L.errReading, { p: percent(p) }));
  const markText = (n) => (n > 0 ? fill(L.markerReading, { n }) : L.markerOff);
  const speedText = (p) => fill(L.speedReading, { p });
  const clockNote = (p) => (p === 0 ? L.inStep : p > 0 ? L.slow : L.fast);
  const halfText = (err) => (err === 0 ? L.never : plain.format(halfSlotAfter(err)));
  const overheadText = (n) => `${oneDecimal.format(100 * markerOverhead(n))} %`;

  // the places that change, each as large as its largest form from the start
  const show = {
    clock: steady($('[data-out="clock"]'), range(ERR).map(percent)),
    clockNote: steady($('[data-out="clock-note"]'), [L.inStep, L.slow, L.fast]),
    off: steady($('[data-out="off"]'), [offset.format(-0.99)]),
    half: steady($('[data-out="half"]'), [L.never, ...range(ERR).filter(Boolean).map((p) => halfText(p / 100))]),
    wrong: steady($('[data-out="wrong"]'), ['–', '100']),
    overhead: steady($('[data-out="overhead"]'), range(MARK).map(overheadText)),
    err: steady($('[data-out="err"]'), range(ERR).map(errText)),
    mark: steady($('[data-out="mark"]'), range(MARK).map(markText)),
    speed: steady($('[data-out="speed"]'), range(SPEED).map(speedText)),
  };

  // --- the model ------------------------------------------------------------------
  // Slots arise one after the other and stay as they are, so a marker distance
  // changed later does not change the past.
  const slots = []; // color index per slot, or MARKER
  let random;
  let sinceMarker = 0; // data slots since the last marker
  let pendingMarker = false; // a marker asked for by hand, once

  function ensureSlots(upto) {
    while (slots.length <= upto) {
      if (pendingMarker || (state.markerEvery > 0 && sinceMarker >= state.markerEvery)) {
        pendingMarker = false;
        slots.push(MARKER);
        sinceMarker = 0;
      } else {
        slots.push(Math.floor(random() * COLORS.length));
        sinceMarker += 1;
      }
    }
  }

  // --- the simulation ---------------------------------------------------------------
  // Simulated time runs in real time, slowed by the display speed; the receiver
  // samples whenever its own clock says the middle of the next slot has come.
  let simTime;
  let sweepStart; // first slot of the current screen page
  let nextTick; // the receiver's next sampling time
  let expectedSlot; // the slot the reading is meant to hit
  let lastOffset; // the current error in slots
  const dots = []; // { t, ci, ok, sync } the sampling points
  const received = []; // { ci, ok } the symbols read
  const results = []; // true = the right slot was hit

  function step(dtMs) {
    const end = simTime + dtMs;
    ensureSlots(Math.floor(end / T) + 1);
    let sampled = false;
    while (nextTick <= end) {
      const t = nextTick;
      const slot = Math.floor(t / T);
      const ci = slots[slot];
      lastOffset = (t - (expectedSlot + 0.5) * T) / T;
      sampled = true;
      if (ci === MARKER) {
        // realign: the next sample sits exactly in the middle again
        dots.push({ t, ci, ok: true, sync: true });
        expectedSlot = slot + 1;
        nextTick = (slot + 1.5) * T;
        lastOffset = 0;
      } else {
        const ok = slot === expectedSlot;
        dots.push({ t, ci, ok, sync: false });
        received.push({ ci, ok });
        if (received.length > TRANSCRIPT) received.shift();
        results.push(ok);
        if (results.length > HISTORY) results.shift();
        expectedSlot += 1;
        nextTick = t + T * (1 + state.err);
      }
    }
    simTime = end;
    if (sampled) {
      stats();
      lines();
    }
  }

  // --- the drawing --------------------------------------------------------------
  // Colors of the page come from its theme; the canvas has as many pixels as it
  // shows, zoomed in full screen too.
  let W = 0;
  let H = 0;
  const xOf = (t) => PAD + (t / T - sweepStart) * SLOT_PX;

  // When the writing head reaches the right edge, a new screen page begins.
  function prune() {
    if (xOf(simTime) > W - PAD - 4) {
      sweepStart = Math.floor(simTime / T);
      while (dots.length && dots[0].t < sweepStart * T) dots.shift();
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
    const style = getComputedStyle(box);
    const css = (v) => style.getPropertyValue(v).trim();
    const right = W - PAD;
    const bandTop = 34; // the sender's band
    const bandHeight = Math.max(48, H * 0.36);
    const rowY = H - 44; // the row of sampling points, its name below it
    const head = Math.min(xOf(simTime), right);

    // the names of the two rows
    ctx.font = `12px ${css('--sans')}`;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = css('--quiet');
    ctx.fillText(L.senderRow, PAD, bandTop - 10);
    ctx.fillText(L.receiverRow, PAD, rowY + 26);

    // the sender's band: one color per slot, as far as the head has come
    const lastSlot = Math.floor(simTime / T);
    for (let k = sweepStart; k <= lastSlot; k++) {
      const x0 = xOf(k * T);
      const w = Math.min(SLOT_PX, head - x0);
      if (w <= 0 || x0 > right) continue;
      const ci = slots[k];
      if (ci === MARKER) {
        ctx.fillStyle = css('--ink');
        ctx.globalAlpha = 0.1;
        ctx.fillRect(x0, bandTop, w, bandHeight);
        ctx.globalAlpha = 1;
        if ((k + 1) * T <= simTime) {
          ctx.fillStyle = css('--ink');
          ctx.font = `15px ${css('--mono')}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('◆', x0 + SLOT_PX / 2, bandTop + bandHeight / 2);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'alphabetic';
        }
      } else {
        ctx.fillStyle = COLORS[ci];
        ctx.fillRect(x0, bandTop, w, bandHeight);
      }
      // the border between two slots in the color of the page
      ctx.strokeStyle = css('--paper');
      ctx.lineWidth = 2;
      ctx.strokeRect(x0, bandTop, Math.min(SLOT_PX, right - x0), bandHeight);
    }

    // the sampling points: a needle up into the band, a dot in the color read
    for (const d of dots) {
      const x = xOf(d.t);
      if (x < PAD || x > right) continue;
      ctx.strokeStyle = css('--quiet');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, bandTop + bandHeight);
      ctx.lineTo(x, rowY - 6);
      ctx.stroke();
      ctx.fillStyle = d.sync ? css('--ink') : COLORS[d.ci];
      ctx.beginPath();
      if (d.sync) {
        // a marker: a small diamond instead of a dot
        ctx.moveTo(x, rowY - 6);
        ctx.lineTo(x + 6, rowY);
        ctx.lineTo(x, rowY + 6);
        ctx.lineTo(x - 6, rowY);
        ctx.closePath();
      } else {
        ctx.arc(x, rowY, 5, 0, 2 * Math.PI);
      }
      ctx.fill();
      if (!d.ok && !d.sync) {
        ctx.strokeStyle = css('--error');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, rowY, 8.5, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // the writing head
    ctx.strokeStyle = css('--quiet');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(head, bandTop - 4);
    ctx.lineTo(head, rowY + 10);
    ctx.stroke();

    if (state.paused) {
      ctx.fillStyle = css('--quiet');
      ctx.font = `13px ${css('--sans')}`;
      ctx.textAlign = 'right';
      ctx.fillText(L.paused, right, bandTop - 10);
      ctx.textAlign = 'left';
    }
  }

  // --- the clock: frames only while the simulator can be seen ----------------------
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

  // --- figures and controls -----------------------------------------------------------
  function stats() {
    const p = Math.round(state.err * 10000) / 100;
    show.clock(percent(p));
    show.clockNote(clockNote(p));
    show.off(offset.format(lastOffset));
    $('[data-out="off"]').classList.toggle('is-bad', Math.abs(lastOffset) >= 0.5);
    show.half(halfText(state.err));
    const wrong = results.filter((ok) => !ok).length;
    show.wrong(results.length ? plain.format(wrong) : '–');
    const wrongEl = $('[data-out="wrong"]');
    wrongEl.classList.toggle('is-good', results.length > 0 && wrong === 0);
    wrongEl.classList.toggle('is-bad', wrong > 0);
    show.overhead(overheadText(state.markerEvery));
  }

  // the sent line from the finished slots without markers, the received one as read
  function lines() {
    const done = Math.floor(simTime / T);
    const sent = [];
    for (let i = Math.max(0, done - TRANSCRIPT * 2); i < done; i++) {
      if (slots[i] !== undefined && slots[i] !== MARKER) sent.push(slots[i]);
    }
    const symbol = (ci, ok = true) => `<span class="dr-sym${ok ? '' : ' is-wrong'}" style="background:${COLORS[ci]}"></span>`;
    sentLine.innerHTML = sent.slice(-TRANSCRIPT).map((ci) => symbol(ci)).join('');
    receivedLine.innerHTML = received.map((r) => symbol(r.ci, r.ok)).join('');
  }

  function readKnobs() {
    state.err = Number(knobs.err.value) / 100;
    state.markerEvery = Number(knobs.mark.value);
    state.speed = Number(knobs.speed.value) / 100;
    const p = Number(knobs.err.value);
    show.err(errText(p));
    show.mark(markText(state.markerEvery));
    show.speed(speedText(Math.round(state.speed * 100)));
    knobs.err.setAttribute('aria-valuetext', errText(p));
    knobs.mark.setAttribute('aria-valuetext', markText(state.markerEvery));
    knobs.speed.setAttribute('aria-valuetext', speedText(Math.round(state.speed * 100)));
    stats();
  }

  function reset() {
    random = generator(SEED);
    simTime = 0;
    sweepStart = 0;
    nextTick = 0.5 * T;
    expectedSlot = 0;
    lastOffset = 0;
    slots.length = 0;
    sinceMarker = 0;
    pendingMarker = false;
    dots.length = 0;
    received.length = 0;
    results.length = 0;
    lines();
    stats();
    draw();
  }

  function setPaused(paused) {
    state.paused = paused;
    pauseButton.textContent = paused ? L.run : L.pause;
    if (paused) draw();
    else run();
  }

  // exactly one sample: stops and moves on to the next sampling time
  function stepOnce() {
    setPaused(true);
    step(Math.max(nextTick - simTime, 1));
    prune();
    draw();
  }

  // a marker by hand: the next slot not yet sent becomes a marker
  const sendMarker = () => {
    pendingMarker = true;
  };

  function nudgeError(delta) {
    const next = Math.max(ERR.min, Math.min(ERR.max, Number(knobs.err.value) + delta));
    knobs.err.value = String(next);
    readKnobs();
  }

  Object.values(knobs).forEach((knob) => knob.addEventListener('input', readKnobs));
  pauseButton.addEventListener('click', () => setPaused(!state.paused));
  $('[data-step]').addEventListener('click', stepOnce);
  $('[data-marker]').addEventListener('click', sendMarker);
  $('[data-reset]').addEventListener('click', reset);

  // redrawn when the canvas changes its size, when full screen zooms it, and when the theme changes
  new ResizeObserver(() => draw()).observe(canvas);
  new MutationObserver(() => draw()).observe(box, { attributes: true, attributeFilter: ['style'] });
  new MutationObserver(() => draw()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => draw());

  // keys only while the focus is in the demonstrator, so the page still scrolls
  keys(
    box,
    [
      ['↑ / ↓', L.keyError],
      [L.keySpace, L.keyPause],
      ['M', L.keyStep],
      ['S', L.keyMarker],
      ['R', L.keyReset],
    ],
    (key) => {
      const k = key.toLowerCase();
      if (key === ' ') setPaused(!state.paused);
      else if (key === 'ArrowUp') nudgeError(ERR.step);
      else if (key === 'ArrowDown') nudgeError(-ERR.step);
      else if (k === 'm') stepOnce();
      else if (k === 's') sendMarker();
      else if (k === 'r') reset();
      else return false;
      return true;
    },
  );

  pauseButton.textContent = state.paused ? L.run : L.pause;
  reset();
  readKnobs();
}

document.querySelectorAll('[data-drift-simulator]').forEach((box, i) => setup(box, i));
