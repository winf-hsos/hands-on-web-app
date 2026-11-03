// The audio digitiser: the same two cuts as for a picture, now for the ear.
// A sound is digitised with a sampling rate (how often per second it is
// measured, 48 kHz down to 250 Hz) and a bit depth (how many loudness levels
// a measurement may take, 16 bits down to 1). The result can be seen, as a
// staircase over the smooth wave in a window of 25 ms, and heard, with the
// Web Audio API built into the browser. It is digitised the naive way, by
// holding and rounding, without the smoothing filters of real converters, so
// the cuts sound at their rawest, aliasing included; a note under the
// demonstrator says so. Below, the arithmetic is the same as for the
// picture: measurements times bits is the file size, and over a light link
// that size becomes a transmission time. Taken over from the LiFi concept
// demos (audio-digitiser) and drawn in the platform's own design.
//
// Four sounds are made in code; the voice is an AI-generated recording in
// knowledge/media/audio/voice.wav (48 kHz, 16-bit mono PCM).
//
// Written with ```audio-digitiser in Markdown (remark-knowledge.mjs); the
// labels come from the page (data-audio-digitiser-labels on <body>).
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.audioDigitiserLabels ?? '{}');
const VOICE = '/media/audio/voice.wav';
const SR = 48000; // the "analog" reference: 48,000 values a second stand in for stepless
const DUR = 2.5; // seconds per sound
const LEN = SR * DUR;
const RATES = [250, 500, 1000, 2000, 4000, 6000, 8000, 12000, 24000, 48000]; // all divide 48,000
const DEPTHS = [16, 12, 8, 4, 2, 1];
const SOUNDS = ['melody', 'band', 'bass', 'chirp', 'voice'];
const WINDOW_S = 0.025; // the window that is drawn
const LINK_BPS = 30; // a typical light link of the LiFi challenges

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const lang = document.documentElement.lang || 'en';
const number = new Intl.NumberFormat(lang);
const decimal = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// --- the sounds, made in code ---------------------------------------------------

const envelope = (t, dur) => Math.min(t / 0.01, 1) * Math.exp((-3 * t) / dur); // a short attack, a soft decay

/** Notes one after the other, each a sum of harmonics with their amplitudes. */
function notes(freqs, step, length, harmonics, gain) {
  const data = new Float32Array(LEN);
  freqs.forEach((f0, n) => {
    // a whole start index: floor(start * SR + i) would hit single samples twice
    const base = Math.round(n * step * SR);
    for (let i = 0; i < length * SR && base + i < LEN; i++) {
      const t = i / SR;
      let v = 0;
      harmonics.forEach((amp, h) => amp && (v += amp * Math.sin(2 * Math.PI * f0 * (h + 1) * t)));
      data[base + i] += gain * envelope(t, length) * v;
    }
  });
  return data;
}

const MAKE = {
  // the first bars of Beethoven's Ode to Joy, in the public domain and known to everybody
  melody: () => notes([329.63, 329.63, 349.23, 392.0, 392.0, 349.23, 329.63, 293.66, 261.63], 0.275, 0.26, [1, 0.5, 0.25, 0.12], 0.35),
  // a bass figure with odd harmonics only
  bass: () => notes([110, 110, 165, 110, 131, 131, 98, 110], 0.31, 0.28, [1, 0, 0.33, 0, 0.2], 0.5),
  // four calls, each sweeping up from 1,400 Hz to 3,600 Hz
  chirp: () => {
    const data = new Float32Array(LEN);
    for (let c = 0; c < 4; c++) {
      const base = Math.round(c * 0.62 * SR);
      for (let i = 0; i < 0.45 * SR && base + i < LEN; i++) {
        const t = i / SR;
        data[base + i] += 0.45 * envelope(t, 0.45) * Math.sin(2 * Math.PI * (1400 * t + (1100 * t * t) / 0.45));
      }
    }
    return data;
  },
  // A little band: a held chord, a bass line, a kick and a hi-hat. The noisy
  // hi-hat is the best witness of aliasing in the demonstrator.
  band: () => {
    const data = new Float32Array(LEN);
    const STEP = 0.3125; // eight quavers in 2.5 s
    for (let i = 0; i < LEN; i++) {
      const t = i / SR;
      const env = Math.min(t / 0.4, 1) * Math.min((DUR - t) / 0.4, 1);
      let v = 0;
      for (const f of [220, 261.63, 329.63]) v += Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * 2 * f * t);
      data[i] += 0.06 * env * v; // A minor
    }
    const bassline = [110, 110, 130.8, 110, 164.8, 130.8, 110, 98];
    for (let s = 0; s < 8; s++) {
      const base = Math.round(s * STEP * SR);
      for (let i = 0; i < 0.28 * SR && base + i < LEN; i++) {
        const t = i / SR;
        data[base + i] += 0.28 * envelope(t, 0.28) * (Math.sin(2 * Math.PI * bassline[s] * t) + 0.3 * Math.sin(2 * Math.PI * 3 * bassline[s] * t));
      }
      if (s % 4 === 0) {
        // the kick on one and five, its pitch falling fast
        for (let i = 0; i < 0.15 * SR && base + i < LEN; i++) {
          const t = i / SR;
          data[base + i] += 0.5 * Math.exp(-18 * t) * Math.sin(2 * Math.PI * Math.max(110 - 400 * t, 45) * t);
        }
      }
      for (let i = 0; i < 0.03 * SR && base + i < LEN; i++) {
        data[base + i] += 0.12 * Math.exp(-i / (0.008 * SR)) * (Math.random() * 2 - 1); // the hi-hat: a burst of noise
      }
    }
    return data;
  },
};

/** The samples of a WAV file with 16-bit PCM, read from its data chunk; no library needed. */
function parseWav(buffer) {
  const view = new DataView(buffer);
  for (let at = 12; at + 8 <= view.byteLength; ) {
    const id = String.fromCharCode(...[0, 1, 2, 3].map((i) => view.getUint8(at + i)));
    const size = view.getUint32(at + 4, true);
    if (id === 'data') {
      const out = new Float32Array(LEN);
      const n = Math.min(Math.floor(size / 2), LEN, Math.floor((view.byteLength - at - 8) / 2));
      for (let i = 0; i < n; i++) out[i] = view.getInt16(at + 8 + i * 2, true) / 32768;
      return out;
    }
    at += 8 + size + (size % 2);
  }
  throw new Error('no data chunk');
}

/** Where the window of a sound lies: fixed for the made ones, at the loudest place (a vowel) for the voice. */
function loudest(data) {
  const n = Math.floor(WINDOW_S * SR);
  let best = 0;
  let most = -1;
  for (let s = 0; s + n < LEN; s += 240) {
    let energy = 0;
    for (let i = 0; i < n; i += 8) energy += data[s + i] ** 2;
    if (energy > most) [most, best] = [energy, s];
  }
  return best / SR;
}

// --- digitising ---------------------------------------------------------------

const quantise = (v, bits) => {
  const levels = (1 << bits) - 1;
  return (Math.round((v * 0.5 + 0.5) * levels) / levels) * 2 - 1;
};

/** Sampling by holding every measured value until the next one, quantising by rounding it. */
function digitise(source, rate, bits) {
  const hold = SR / rate;
  const out = new Float32Array(LEN);
  for (let i = 0; i < LEN; i += hold) out.fill(quantise(Math.max(-1, Math.min(1, source[i])), bits), i, Math.min(i + hold, LEN));
  return out;
}

function duration(seconds) {
  if (seconds < 1) return L.underASecond;
  if (seconds < 90) return Math.round(seconds) === 1 ? L.oneSecond : fill(L.seconds, { n: number.format(Math.round(seconds)) });
  if (seconds < 5400) return fill(L.minutes, { n: number.format(Math.round(seconds / 60)) });
  if (seconds < 172800) return fill(L.hours, { n: decimal.format(seconds / 3600) });
  return fill(L.days, { n: decimal.format(seconds / 86400) });
}

// The arithmetic under the wave, one function per line, so that the longest
// form of each line can be found among all settings.
const calc = {
  line: (rate, bits) => fill(L.calcLine, { dur: decimal.format(DUR), rate: number.format(rate), bits }),
  size: (rate, bits) => {
    const total = DUR * rate * bits;
    const bytes = total / 8;
    const kib = bytes >= 1024 ? fill(L.calcKib, { kib: decimal.format(bytes / 1024) }) : '';
    return fill(L.calcSize, { bits: number.format(total), bytes: number.format(bytes) }) + kib;
  },
  time: (rate, bits) => fill(L.calcTime, { rate: LINK_BPS, time: duration((DUR * rate * bits) / LINK_BPS) }),
};

// --- playing ------------------------------------------------------------------

let audio = null; // one AudioContext for the page, made at the first press of a button
let playing = null;

function stop() {
  try {
    playing?.stop();
  } catch {
    // already over
  }
  playing = null;
}

function play(data) {
  audio ??= new AudioContext();
  audio.resume();
  stop();
  const buffer = audio.createBuffer(1, LEN, SR);
  buffer.copyToChannel(data, 0);
  playing = audio.createBufferSource();
  playing.buffer = buffer;
  playing.connect(audio.destination);
  playing.start();
}

// --- the demonstrator ---------------------------------------------------------

function setup(box, id) {
  const state = { sound: 0, rate: RATES.length - 1, depth: 0 };
  const sounds = {};
  const windowAt = { melody: 0.05, band: 0.35, bass: 0.02, chirp: 0.06, voice: 0 };
  let digital = null;

  box.innerHTML = `
    <div class="dg-choices" role="group" aria-label="${L.sound}">
      <span class="dg-label">${L.sound}</span>
      ${SOUNDS.map((s, i) => `<button type="button" class="chip-button" data-sound="${i}">${L.sounds[s]}</button>`).join('')}
    </div>
    <p class="dg-label ad-window">${L.window}</p>
    <canvas class="ad-wave" role="img" aria-label="${L.waveLabel}"></canvas>
    <p class="ad-legend">
      <span><span class="ad-swatch ad-swatch-analog"></span>${L.analog}</span>
      <span><span class="ad-swatch ad-swatch-digital"></span>${L.digital}</span>
    </p>
    <div class="ad-players">
      <button type="button" class="button button-quiet" data-play="original">${L.playOriginal}</button>
      <button type="button" class="button button-quiet" data-play="digital">${L.playDigital}</button>
      <button type="button" class="button button-quiet" data-play="stop">${L.stop}</button>
    </div>
    <div class="dg-calc">
      <p data-out="line"></p>
      <p class="dg-size" data-out="size"></p>
      <p class="dg-time" data-out="time"></p>
    </div>
    <div class="dg-panel">
      <div class="dg-knob">
        <label class="dg-label" for="ad-rate-${id}">${L.rate}</label>
        <input type="range" class="dg-range" id="ad-rate-${id}" min="0" max="${RATES.length - 1}" step="1">
        <p class="dg-reading" data-out="rate"></p>
      </div>
      <div class="dg-knob">
        <span class="dg-label" id="ad-depth-${id}">${L.depth}</span>
        <div class="dg-chips" role="group" aria-labelledby="ad-depth-${id}">
          ${DEPTHS.map((bits, i) => `<button type="button" class="chip-button" data-depth="${i}">${fill(L.depthChip, { bits })}</button>`).join('')}
        </div>
        <p class="dg-reading" data-out="depth"></p>
      </div>
    </div>
    <p class="dg-note">${L.note}</p>`;

  const $ = (selector) => box.querySelector(selector);
  const canvas = $('.ad-wave');
  const range = $('.dg-range');
  const soundButtons = [...box.querySelectorAll('[data-sound]')];
  const depthButtons = [...box.querySelectorAll('[data-depth]')];
  const voiceButton = soundButtons[SOUNDS.indexOf('voice')];
  const rateText = (rate) => fill(L.rateReading, { rate: number.format(rate), text: L.rateHints[rate] });
  const depthText = (bits) => fill(L.depthReading, { bits, levels: number.format(2 ** bits), text: L.depthHints[bits] });

  // the places that change, each as large as its largest form from the start
  const all = (f) => RATES.flatMap((rate) => DEPTHS.map((bits) => f(rate, bits)));
  const show = {
    line: steady($('[data-out="line"]'), all(calc.line)),
    size: steady($('[data-out="size"]'), all(calc.size)),
    time: steady($('[data-out="time"]'), all(calc.time)),
    rate: steady($('[data-out="rate"]'), RATES.map(rateText)),
    depth: steady($('[data-out="depth"]'), DEPTHS.map(depthText)),
  };

  // The drawing: the analog wave, the digital staircase over it, and the
  // measured points when they lie far enough apart to be told apart. Colours
  // come from the page, so the drawing follows the light and the dark theme;
  // the canvas has as many pixels as it shows, zoomed in full screen too.
  function draw() {
    const name = SOUNDS[state.sound];
    const source = sounds[name];
    const ratio = (devicePixelRatio || 1) * (canvas.currentCSSZoom ?? 1);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (canvas.width !== Math.round(W * ratio) || canvas.height !== Math.round(H * ratio)) {
      canvas.width = Math.round(W * ratio);
      canvas.height = Math.round(H * ratio);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!source || !digital) return;
    const colour = getComputedStyle(box);
    const css = (v) => colour.getPropertyValue(v).trim();
    const start = Math.floor(windowAt[name] * SR);
    const n = Math.floor(WINDOW_S * SR);
    const x = (i) => (i / n) * W;
    const y = (v) => H / 2 - Math.max(-1, Math.min(1, v)) * (H / 2 - 10);
    const line = (data, stroke, width) => {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.beginPath();
      for (let i = 0; i < n; i++) ctx[i ? 'lineTo' : 'moveTo'](x(i), y(data[start + i]));
      ctx.stroke();
    };
    ctx.lineJoin = 'round';
    ctx.strokeStyle = css('--rule');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
    line(source, css('--quiet'), 1.5);
    line(digital, css('--accent'), 2);
    const hold = SR / RATES[state.rate];
    if (x(hold) >= 6) {
      ctx.fillStyle = css('--ink');
      for (let i = 0; i < n; i += hold) {
        ctx.beginPath();
        ctx.arc(x(i), y(digital[start + i]), 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  function render() {
    const name = SOUNDS[state.sound];
    const rate = RATES[state.rate];
    const bits = DEPTHS[state.depth];
    range.value = String(state.rate);
    range.setAttribute('aria-valuetext', rateText(rate));
    soundButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === state.sound)));
    depthButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === state.depth)));
    show.line(calc.line(rate, bits));
    show.size(calc.size(rate, bits));
    show.time(calc.time(rate, bits));
    show.rate(rateText(rate));
    show.depth(depthText(bits));
    sounds[name] ??= MAKE[name]?.();
    digital = sounds[name] ? digitise(sounds[name], rate, bits) : null;
    draw();
  }

  const set = (changes) => {
    if ('sound' in changes && changes.sound !== state.sound) stop();
    Object.assign(state, changes);
    render();
  };

  range.addEventListener('input', () => set({ rate: Number(range.value) }));
  for (const b of soundButtons) b.addEventListener('click', () => set({ sound: Number(b.dataset.sound) }));
  for (const b of depthButtons) b.addEventListener('click', () => set({ depth: Number(b.dataset.depth) }));
  const actions = {
    original: () => sounds[SOUNDS[state.sound]] && play(sounds[SOUNDS[state.sound]]),
    digital: () => digital && play(digital),
    stop,
  };
  for (const b of box.querySelectorAll('[data-play]')) b.addEventListener('click', actions[b.dataset.play]);

  // the voice comes as a file; its button waits until it is there
  voiceButton.disabled = true;
  fetch(VOICE)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.statusText))))
    .then((buffer) => {
      sounds.voice = parseWav(buffer);
      windowAt.voice = loudest(sounds.voice);
      voiceButton.disabled = false;
      if (SOUNDS[state.sound] === 'voice') render();
    })
    .catch(() => (voiceButton.title = L.noVoice));

  // redrawn when the canvas changes its size, when full screen zooms it, and when the theme changes
  new ResizeObserver(() => draw()).observe(canvas);
  new MutationObserver(() => draw()).observe(box, { attributes: true, attributeFilter: ['style'] });
  new MutationObserver(() => draw()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => draw());

  // keys only while the focus is in the demonstrator, so the page still scrolls
  keys(
    box,
    [
      ['← / →', L.keyRate],
      ['1 – 6', L.keyDepth],
      ['O', L.keyOriginal],
      ['D', L.keyDigital],
      ['S', L.keyStop],
      ['N', L.keySound],
    ],
    (key) => {
      const k = key.toLowerCase();
      if (key === 'ArrowLeft' || key === 'ArrowDown') set({ rate: Math.max(0, state.rate - 1) });
      else if (key === 'ArrowRight' || key === 'ArrowUp') set({ rate: Math.min(RATES.length - 1, state.rate + 1) });
      else if (key >= '1' && key <= String(DEPTHS.length)) set({ depth: Number(key) - 1 });
      else if (k === 'o') actions.original();
      else if (k === 'd') actions.digital();
      else if (k === 's') stop();
      else if (k === 'n') {
        let next = (state.sound + 1) % SOUNDS.length;
        if (soundButtons[next].disabled) next = (next + 1) % SOUNDS.length;
        set({ sound: next });
      } else return false;
      return true;
    },
  );

  render();
}

document.querySelectorAll('[data-audio-digitiser]').forEach((box, i) => setup(box, i));
