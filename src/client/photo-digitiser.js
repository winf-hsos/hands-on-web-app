// The photo digitiser: a photo as the "analog" original on the left, its
// digital version on the right, and two decisions with a price tag. The
// resolution samples the picture (256 × 256 points down to a single pixel),
// the colour depth quantises every point (true colour down to 16 colours,
// four greys and black and white). Below, the arithmetic is written out:
// points times bits per point is the file size, and over a light link of
// 30 bits per second that size becomes a transmission time. Pointing at a
// pixel shows its value as bits in the chosen system and marks the cell on
// both pictures, so you see which patch of the original became this one
// value. Taken over from the LiFi concept demos (photo-digitiser) and drawn
// in the platform's own design.
//
// Written with ```photo-digitiser in Markdown (remark-knowledge.mjs); the
// labels come from the page (data-photo-digitiser-labels on <body>). The
// photos lie in knowledge/media/photos/ and are AI-generated.
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.photoDigitiserLabels ?? '{}');
const PHOTOS = '/media/photos/';
const MOTIFS = ['parrot', 'sunset', 'lighthouse'];
const FULL = 256;
const RESOLUTIONS = [1, 2, 4, 8, 16, 32, 64, 128, 256];
const DEPTHS = [
  { key: 'bw', bits: 1 },
  { key: 'grey2', bits: 2 },
  { key: 'c4', bits: 4 },
  { key: 'grey', bits: 8 },
  { key: 'c8', bits: 8 },
  { key: 'c16', bits: 16 },
  { key: 'c24', bits: 24 },
];
const LINK_BPS = 30; // a typical light link of the LiFi challenges

// The sixteen colours of the EGA palette: eight base colours, each once dark
// and once bright. At 4 bits every point takes the nearest of them.
const EGA = [
  [0, 0, 0], [0, 0, 170], [0, 170, 0], [0, 170, 170],
  [170, 0, 0], [170, 0, 170], [170, 85, 0], [170, 170, 170],
  [85, 85, 85], [85, 85, 255], [85, 255, 85], [85, 255, 255],
  [255, 85, 85], [255, 85, 255], [255, 255, 85], [255, 255, 255],
];

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const lang = document.documentElement.lang || 'en';
const number = new Intl.NumberFormat(lang);
const decimal = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const level = (v, bits) => Math.round(v / 255 * ((1 << bits) - 1)); // the step a channel value falls on
const back = (step, bits) => Math.round(step / ((1 << bits) - 1) * 255); // and that step as a value again
const bin = (v, bits) => v.toString(2).padStart(bits, '0');

function nearestEga(r, g, b) {
  let best = 0;
  let distance = Infinity;
  EGA.forEach(([er, eg, eb], i) => {
    const d = (r - er) ** 2 + (g - eg) ** 2 + (b - eb) ** 2;
    if (d < distance) [distance, best] = [d, i];
  });
  return best;
}

/** A point of the photo in the chosen system: its colour and its channels as [name, value, bits]. */
function quantise(r, g, b, depth) {
  const grey = luma(r, g, b);
  switch (depth) {
    case 'bw': {
      const on = grey >= 118 ? 1 : 0;
      return { rgb: [on * 255, on * 255, on * 255], channels: [['', on, 1]] };
    }
    case 'grey2': {
      const step = Math.round(grey / 255 * 3);
      return { rgb: Array(3).fill(step * 85), channels: [[L.grey, step, 2]] };
    }
    case 'c4': {
      const i = nearestEga(r, g, b);
      return { rgb: EGA[i], channels: [[L.colourNo, i, 4]] };
    }
    case 'grey': {
      const v = Math.round(grey);
      return { rgb: [v, v, v], channels: [[L.grey, v, 8]] };
    }
    case 'c8':
    case 'c16': {
      const bits = depth === 'c8' ? [3, 3, 2] : [5, 6, 5];
      const steps = [r, g, b].map((v, i) => level(v, bits[i]));
      return { rgb: steps.map((s, i) => back(s, bits[i])), channels: steps.map((s, i) => ['rgb'[i], s, bits[i]]) };
    }
    default:
      return { rgb: [r, g, b], channels: [['r', r, 8], ['g', g, 8], ['b', b, 8]] };
  }
}

function duration(seconds) {
  if (seconds < 1) return L.underASecond;
  if (seconds < 90) return Math.round(seconds) === 1 ? L.oneSecond : fill(L.seconds, { n: number.format(Math.round(seconds)) });
  if (seconds < 5400) return fill(L.minutes, { n: number.format(Math.round(seconds / 60)) });
  if (seconds < 172800) return fill(L.hours, { n: decimal.format(seconds / 3600) });
  return fill(L.days, { n: decimal.format(seconds / 86400) });
}

// The arithmetic under the pictures, one function per line, so that the
// longest form of each line can be found among all settings.
const calc = {
  line: (res, bits) => fill(L.calcLine, { res, bits }),
  size: (res, bits) => {
    const total = res * res * bits;
    const bytes = total / 8;
    const kib = bytes >= 1024 ? fill(L.calcKib, { kib: bytes >= 102400 ? number.format(Math.round(bytes / 1024)) : decimal.format(bytes / 1024) }) : '';
    return fill(L.calcSize, { bits: number.format(total), bytes: number.format(bytes) }) + kib;
  },
  time: (res, bits) => fill(L.calcTime, { rate: LINK_BPS, time: duration((res * res * bits) / LINK_BPS) }),
};

function setup(box, id) {
  const state = { motif: 0, res: 5, depth: 6 };
  const photos = [];
  let ready = false; // all three photos loaded

  box.innerHTML = `
    <div class="dg-choices" role="group" aria-label="${L.picture}">
      <span class="dg-label">${L.picture}</span>
      ${MOTIFS.map((m, i) => `<button type="button" class="pd-motif" data-motif="${i}" aria-label="${L.motifs[m]}" title="${L.motifs[m]}"><img src="${PHOTOS}${m}.png" alt="" width="40" height="40"></button>`).join('')}
    </div>
    <div class="pd-pair">
      <div class="pd-side">
        <span class="dg-label pd-caption">${L.original}</span>
        <div class="pd-frame"><canvas class="pd-canvas" data-canvas="orig" width="${FULL}" height="${FULL}" role="img" aria-label="${L.original}"></canvas><div class="pd-cell"></div></div>
      </div>
      <div class="pd-side">
        <span class="dg-label pd-caption">${L.digital}</span>
        <div class="pd-frame"><canvas class="pd-canvas pd-pixelated" data-canvas="dig" width="1" height="1" role="img" aria-label="${L.digital}"></canvas><div class="pd-cell"></div></div>
      </div>
    </div>
    <p class="pd-pixel"><span data-out="where"></span><span class="pd-bits" data-out="bits"></span><span data-out="numbers"></span></p>
    <div class="dg-calc">
      <p data-out="line"></p>
      <p class="dg-size" data-out="size"></p>
      <p class="dg-time" data-out="time"></p>
    </div>
    <div class="dg-panel">
      <div class="dg-knob">
        <label class="dg-label" for="pd-res-${id}">${L.resolution}</label>
        <input type="range" class="dg-range" id="pd-res-${id}" min="0" max="${RESOLUTIONS.length - 1}" step="1">
        <p class="dg-reading" data-out="res"></p>
      </div>
      <div class="dg-knob">
        <span class="dg-label" id="pd-depth-${id}">${L.depth}</span>
        <div class="dg-chips" role="group" aria-labelledby="pd-depth-${id}">
          ${DEPTHS.map((d, i) => `<button type="button" class="chip-button" data-depth="${i}">${L.depths[d.key].label}</button>`).join('')}
        </div>
        <p class="dg-reading" data-out="depth"></p>
      </div>
    </div>
    <p class="dg-note">${L.credit}</p>`;

  const $ = (selector) => box.querySelector(selector);
  const orig = $('[data-canvas="orig"]');
  const dig = $('[data-canvas="dig"]');
  const range = $('.dg-range');
  const motifs = [...box.querySelectorAll('[data-motif]')];
  const depths = [...box.querySelectorAll('[data-depth]')];
  const cells = [...box.querySelectorAll('.pd-cell')];

  // the places that change, each as large as its largest form from the start
  const all = (f) => RESOLUTIONS.flatMap((res) => DEPTHS.map((d) => f(res, d.bits)));
  const show = {
    line: steady($('[data-out="line"]'), all(calc.line)),
    size: steady($('[data-out="size"]'), all(calc.size)),
    time: steady($('[data-out="time"]'), all(calc.time)),
    res: steady($('[data-out="res"]'), RESOLUTIONS.map((res) => fill(L.resReading, { res, n: number.format(res * res) }))),
    depth: steady(
      $('[data-out="depth"]'),
      DEPTHS.map((d) => fill(L.depthReading, { bits: d.bits, text: L.depths[d.key].text })),
    ),
    where: steady($('[data-out="where"]'), [fill(L.pointAt, { bits: 24 }), fill(L.pixelAt, { x: 255, y: 255 })]),
  };
  const bitsOut = $('[data-out="bits"]');
  const numbersOut = $('[data-out="numbers"]');

  let digital = null; // the quantised pixels of the current picture, as ImageData

  // The original with a faint sampling grid: every cell of it becomes ONE
  // pixel on the right. Below 8 screen pixels per cell the grid is left out,
  // since it would lie over the picture like a veil.
  function drawOriginal() {
    const ctx = orig.getContext('2d');
    ctx.drawImage(photos[state.motif], 0, 0, FULL, FULL);
    const res = RESOLUTIONS[state.res];
    const cell = FULL / res;
    if (cell < 8) return;
    ctx.strokeStyle = 'rgb(255 255 255 / 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < res; i++) {
      ctx.moveTo(i * cell + 0.5, 0);
      ctx.lineTo(i * cell + 0.5, FULL);
      ctx.moveTo(0, i * cell + 0.5);
      ctx.lineTo(FULL, i * cell + 0.5);
    }
    ctx.stroke();
  }

  // Sampling: the browser averages the photo down to res × res points.
  // Quantising: every point is rounded to the levels of the chosen system.
  function digitise() {
    const res = RESOLUTIONS[state.res];
    const depth = DEPTHS[state.depth].key;
    dig.width = dig.height = res;
    const ctx = dig.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(photos[state.motif], 0, 0, res, res);
    const img = ctx.getImageData(0, 0, res, res);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const { rgb } = quantise(d[i], d[i + 1], d[i + 2], depth);
      [d[i], d[i + 1], d[i + 2]] = rgb;
    }
    ctx.putImageData(img, 0, 0);
    digital = img;
  }

  function showPixel(at) {
    const depth = DEPTHS[state.depth];
    if (!at || !digital) {
      show.where(fill(L.pointAt, { bits: depth.bits }));
      bitsOut.textContent = numbersOut.textContent = '';
      for (const cell of cells) cell.classList.remove('is-on');
      return;
    }
    const [x, y] = at;
    const res = RESOLUTIONS[state.res];
    const i = (y * res + x) * 4;
    // the stored pixel is already quantised, so quantising it again gives its own channels
    const { channels } = quantise(digital.data[i], digital.data[i + 1], digital.data[i + 2], depth.key);
    show.where(fill(L.pixelAt, { x, y }));
    bitsOut.textContent = channels.map(([, v, n]) => bin(v, n)).join(' ');
    numbersOut.textContent = '= ' + channels.map(([name, v]) => (name ? `${name} ${v}` : `${v}`)).join(', ');
    // a frame over the cell on both pictures, sized from the drawn width
    for (const cell of cells) {
      const size = 100 / res;
      Object.assign(cell.style, { width: `${size}%`, height: `${size}%`, left: `${x * size}%`, top: `${y * size}%` });
      cell.classList.add('is-on');
    }
  }

  function pixelUnder(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const res = RESOLUTIONS[state.res];
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * res);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * res);
    return x >= 0 && y >= 0 && x < res && y < res ? [x, y] : null;
  }

  function render() {
    const res = RESOLUTIONS[state.res];
    const depth = DEPTHS[state.depth];
    range.value = String(state.res);
    range.setAttribute('aria-valuetext', fill(L.resReading, { res, n: number.format(res * res) }));
    motifs.forEach((b, i) => b.setAttribute('aria-pressed', String(i === state.motif)));
    depths.forEach((b, i) => b.setAttribute('aria-pressed', String(i === state.depth)));
    show.line(calc.line(res, depth.bits));
    show.size(calc.size(res, depth.bits));
    show.time(calc.time(res, depth.bits));
    show.res(fill(L.resReading, { res, n: number.format(res * res) }));
    show.depth(fill(L.depthReading, { bits: depth.bits, text: L.depths[depth.key].text }));
    if (ready) {
      drawOriginal();
      digitise();
    }
    showPixel(null);
  }

  const set = (changes) => {
    Object.assign(state, changes);
    render();
  };

  range.addEventListener('input', () => set({ res: Number(range.value) }));
  for (const b of motifs) b.addEventListener('click', () => set({ motif: Number(b.dataset.motif) }));
  for (const b of depths) b.addEventListener('click', () => set({ depth: Number(b.dataset.depth) }));

  // Pointing with a mouse shows a pixel while the pointer is over it; a tap
  // or a drag with a finger shows the pixel and keeps it until the next one.
  for (const canvas of [orig, dig]) {
    const point = (e) => showPixel(pixelUnder(e, canvas));
    canvas.addEventListener('pointerdown', point);
    canvas.addEventListener('pointermove', point);
    canvas.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && showPixel(null));
  }

  // keys only while the focus is in the demonstrator, so the page still scrolls
  keys(
    box,
    [
      ['← / →', L.keyResolution],
      ['1 – 7', L.keyDepth],
      ['N', L.keyPicture],
    ],
    (key) => {
      if (key === 'ArrowLeft' || key === 'ArrowDown') set({ res: Math.max(0, state.res - 1) });
      else if (key === 'ArrowRight' || key === 'ArrowUp') set({ res: Math.min(RESOLUTIONS.length - 1, state.res + 1) });
      else if (key >= '1' && key <= String(DEPTHS.length)) set({ depth: Number(key) - 1 });
      else if (key === 'n' || key === 'N') set({ motif: (state.motif + 1) % MOTIFS.length });
      else return false;
      return true;
    },
  );

  render();
  Promise.all(
    MOTIFS.map(
      (m, i) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve((photos[i] = img));
          img.onerror = reject;
          img.src = `${PHOTOS}${m}.png`;
        }),
    ),
  ).then(
    () => {
      ready = true;
      render();
    },
    () => show.where(L.noPhotos),
  );
}
document.querySelectorAll('[data-photo-digitiser]').forEach((box, i) => setup(box, i));
