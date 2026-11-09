// Drawings and animations of "drawing the line" (analog and digital).
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80); figures on a slide with
// a punchline stay at most 650 high, so the height does not shrink them.
// Figures without an animation are redrawn per build-up step (data-on-show,
// data-on-step); animated ones are drawn once when the deck loads.
//
// The picture slides compute with the real photo: pixelate() scales it down to
// n by n points, rounds the channels to a number of levels and scales it up
// again without smoothing. The result is a data URI.
//
// The drawings the article of this item shows are functions that return their
// SVG, so that stagekit's tools/figures.py renders the same drawings for it
// (slides/figures.js, scripts/deck-figures.mjs). An animated drawing takes
// `final`: true draws the state its last segment ends in, as one still
// picture. The slides are English; `window.deckLang = "de"` (set by
// deck-figures.mjs) gives the German labels for the article.
"use strict";

const T = (en, de) => (window.deckLang === "de" ? de : en);

const d = window.draw;
const $ = (id) => document.getElementById(id);
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; return svg; };
// a named group for anim.js; figures.py loads no anim.js, and a still picture
// needs no names
const g = (name, ...parts) => (d.g ? d.g(name, ...parts) : parts.flat().join(""));

function rect(x, y, w, h, fill, rx = 0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
}

function circle(x, y, r, fill) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}

/* --- cutting the photo into points and levels ------------------------------ */

const PHOTO = "img/parrot.jpg";
const cache = new Map();
let source = null;

function loadPhoto() {
  if (source) return source;
  source = new Promise((done, fail) => {
    const img = new Image();
    img.onload = () => done(img);
    img.onerror = fail;
    img.src = PHOTO;
  });
  return source;
}

// n: points per edge, levels: values per channel (2 = 1 bit), grey: desaturate first
async function pixelate(n, levels = 256, grey = false) {
  const key = `${n}|${levels}|${grey}`;
  if (cache.has(key)) return cache.get(key);
  const img = await loadPhoto();

  const small = document.createElement("canvas");
  small.width = n; small.height = n;
  const sc = small.getContext("2d");
  sc.drawImage(img, 0, 0, n, n);

  if (levels < 256 || grey) {
    const data = sc.getImageData(0, 0, n, n);
    const p = data.data;
    const step = 255 / (levels - 1);
    for (let i = 0; i < p.length; i += 4) {
      if (grey) {
        const g = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
        p[i] = p[i + 1] = p[i + 2] = g;
      }
      for (let k = 0; k < 3; k += 1) p[i + k] = Math.round(p[i + k] / step) * step;
    }
    sc.putImageData(data, 0, 0);
  }

  const large = document.createElement("canvas");
  large.width = 512; large.height = 512;
  const lc = large.getContext("2d");
  lc.imageSmoothingEnabled = false;
  lc.drawImage(small, 0, 0, 512, 512);
  const uri = large.toDataURL("image/png");
  cache.set(key, uri);
  return uri;
}

function picture(uri, x, y, size) {
  return `<image href="${uri}" x="${x}" y="${y}" width="${size}" height="${size}" `
    + `image-rendering="pixelated" preserveAspectRatio="none"/>`;
}

/* --- digital is not the same as electronic ----------------------------------
 * Picture and name per thing; the name is the point, so it stands beside the
 * picture. The icons are cut-out PNGs with transparency, so they stay PNG. */

function drawKinds() {
  const c = d.colors();
  const digital = [["img/icon-flip-scoreboard.png", "flip scoreboard"],
                   ["img/icon-light-switch.png", "light switch"],
                   ["img/icon-abacus.png", "abacus"],
                   ["img/icon-die.png", "a die"]];
  const analog = [["img/icon-slide-rule.png", "slide rule"],
                  ["img/icon-thermometer.png", "dial thermometer"],
                  ["img/icon-dimmer.png", "dimmer"],
                  ["img/icon-water-tap.png", "water tap"]];
  const g = 108, pitch = 132, top = 96;
  const parts = [
    d.label(60, 56, "digital", { size: 32, color: c.white }),
    d.label(900, 56, "analog", { size: 32, color: c.white }),
    d.line(60, 76, 780, 76, { color: c.dark, width: 2 }),
    d.line(900, 76, 1620, 76, { color: c.dark, width: 2 }),
    d.line(840, 30, 840, 620, { color: c.dark, width: 2 }),
  ];
  const column = (entries, x) => entries.forEach(([path, text], i) => {
    const y = top + i * pitch;
    parts.push(`<image href="${path}" x="${x}" y="${y}" width="${g}" height="${g}"/>`);
    parts.push(d.label(x + g + 34, 0, text, { size: 32, color: c.light, centerY: y + g / 2 }));
  });
  column(digital, 60);
  column(analog, 900);
  return put("fig-kinds", d.svg(1680, top + 4 * pitch + 20, ...parts));
}

/* --- the same disturbance, twice ----------------------------------------------
 * Two worlds side by side, analog on the left, digital on the right (step 1).
 * Each has two upright scales of the same range, 0 to 400: what was sent and
 * what was received, with the value as a dot and as a number. The sent value
 * 300 is white, the received 323 yellow, because it is the one we look at; an
 * arrow carries the disturbance of +23 from one scale to the other, and a
 * dashed line at the height of 300 shows how far it moved. In the digital
 * world a boundary at 200 cuts both scales into dark and bright, and the
 * received value is still bright. Upright scales, so that the way from sender
 * to receiver runs left to right and the value runs up: the two never share
 * an axis. Numbers as in the article's code. */

function between(step = 1) {
  const c = d.colors();
  const top = 120, bottom = 480;
  const vy = (v) => bottom - (v / 400) * (bottom - top);
  const sent = 300, got = 323, boundary = 200;
  const parts = [];
  const world = (x0, title, verdict, ok, regions) => {
    const sx = x0 + 240, rx = x0 + 600;
    parts.push(d.label(x0 + 20, 50, title, { size: 32, color: c.white }));
    if (regions) {
      const by = vy(boundary);
      parts.push(d.line(sx - 50, by, rx + 50, by, { color: c.light, width: 3 }));
      // the names of the regions stand between the scales, "bright" below the
      // arrow and above the boundary, "dark" in the middle of its region
      parts.push(d.label((sx + rx) / 2, 0, T("bright", "hell"), { size: 32, color: c.light, anchor: "middle", centerY: (vy(sent) + by) / 2 + 6 }));
      parts.push(d.label((sx + rx) / 2, 0, T("dark", "dunkel"), { size: 32, color: c.light, anchor: "middle", centerY: (by + bottom) / 2 }));
    }
    for (const x of [sx, rx]) parts.push(d.line(x, top, x, bottom, { color: c.gray, width: 3 }));
    parts.push(d.line(sx, vy(sent), rx, vy(sent), { color: c.dark, width: 2, dashed: true }));
    parts.push(d.arrow(sx + 24, vy(sent) - 4, rx - 24, vy(got) + 2, { color: c.gray, width: 2 }));
    parts.push(d.label((sx + rx) / 2, vy(sent) - 36, T("+23 on the way", "+23 unterwegs"), { size: 20, color: c.gray, anchor: "middle" }));
    parts.push(circle(sx, vy(sent), 14, c.white));
    parts.push(circle(rx, vy(got), 14, c.yellow));
    parts.push(d.label(sx - 30, 0, String(sent), { size: 32, color: c.white, mono: true, anchor: "end", centerY: vy(sent) }));
    parts.push(d.label(rx + 30, 0, String(got), { size: 32, color: c.yellow, mono: true, centerY: vy(got) }));
    parts.push(d.label(sx, bottom + 40, T("sent", "gesendet"), { size: 20, color: c.gray, anchor: "middle" }));
    parts.push(d.label(rx, bottom + 40, T("received", "empfangen"), { size: 20, color: c.gray, anchor: "middle" }));
    parts.push(d.label(x0 + 20, bottom + 110, verdict, { size: 32, color: ok ? c.green : c.red }));
  };
  world(20, T("analog: every value counts", "analog: jeder Wert zählt"), T("a different value", "ein anderer Wert"), false, false);
  if (step >= 1) {
    parts.push(d.line(840, 20, 840, 600, { color: c.dark, width: 2, dashed: true }));
    world(860, T("digital: only the region counts", "digital: nur der Bereich zählt"), T("still bright, the same state", "noch hell, derselbe Zustand"), true, true);
  }
  return d.svg(1680, 620, ...parts);
}

window.drawBetween = (_slide, step = 0) => put("fig-between", between(step));

/* --- light has no steps ---------------------------------------------------------
 * Above, a gradient from dark to bright with no step anywhere; below, step 1,
 * four greys with gaps between them, numbered as the states a program knows.
 * Gradient and greys are the real greys they stand for (computed values, not
 * palette colours), because they show the subject. */

function light(step = 1) {
  const c = d.colors();
  const x0 = 60, w = 1560, h = 110;
  const parts = [
    `<defs><linearGradient id="light-ramp" x1="0" x2="1" y1="0" y2="0">`
      + `<stop offset="0" stop-color="rgb(0,0,0)"/><stop offset="1" stop-color="rgb(255,255,255)"/></linearGradient></defs>`,
    // the German line, 55 characters, is 1056 wide at 32
    d.label(x0, 60, T("light: between any two brightnesses lies another", "Licht: zwischen zwei Helligkeiten liegt immer noch eine"), { size: 32, color: c.white }),
    `<rect x="${x0}" y="90" width="${w}" height="${h}" rx="8" fill="url(#light-ramp)" stroke="${c.gray}" stroke-width="2"/>`,
  ];
  if (step >= 1) {
    const n = 4, gap = 40, cell = (w - (n - 1) * gap) / n;
    parts.push(d.label(x0, 330, T("your program: a few states, clearly apart", "dein Programm: wenige Zustände, klar getrennt"), { size: 32, color: c.white }));
    for (let i = 0; i < n; i += 1) {
      const v = Math.round((i / (n - 1)) * 255);
      const x = x0 + i * (cell + gap);
      parts.push(`<rect x="${x}" y="360" width="${cell}" height="${h}" rx="8" fill="rgb(${v},${v},${v})" stroke="${c.gray}" stroke-width="2"/>`);
      parts.push(d.label(x + cell / 2, 530, String(i), { size: 32, color: c.light, anchor: "middle", mono: true }));
    }
  }
  return d.svg(1680, 560, ...parts);
}

window.drawLight = (_slide, step = 0) => put("fig-light", light(step));

/* --- the analog middle -------------------------------------------------------
 * Digital, analog, digital: the stretch between sender and sensor is a smooth
 * curve with changing swings, stepless and always moving, not a zigzag. The
 * three zones are told apart by the dashed lines, not by colour; above the
 * stretch stand the things that disturb it. The LED dot is yellow because it
 * is lit. */

function middle() {
  const c = d.colors();
  const y = 170, h = 150;
  const mid = y + h / 2;
  const kx0 = 430, kx1 = 980;          // start and end of the analog stretch
  const wires = [], boxes = [], labels = [];

  const points = [];
  for (let i = 0; i <= 400; i += 1) {
    const t = i / 400;
    // window: zero at both ends, so the curve meets the connecting lines
    const win = Math.sin(Math.PI * t) ** 0.65;
    const env = 30 + 22 * Math.sin(t * Math.PI * 2.7 + 0.9);
    const v = Math.sin(t * 47) * 0.6 + Math.sin(t * 19.4 + 1.1) * 0.3 + Math.sin(t * 89 + 2.2) * 0.13;
    points.push(`${(kx0 + t * (kx1 - kx0)).toFixed(1)},${(mid + win * env * v * 1.5).toFixed(1)}`);
  }
  wires.push(`<polyline points="${points.join(" ")}" fill="none" stroke="${c.gray}" stroke-width="3"/>`);
  wires.push(d.line(340, mid, kx0, mid, { color: c.gray, width: 3 }));
  wires.push(d.arrow(kx1, mid, 1060, mid, { color: c.gray, width: 3 }));

  boxes.push(d.box(40, y, 300, h, T("sender", "Sender"), { size: 32, border: c.white }));
  boxes.push(d.box(1060, y, 300, h, T("sensor", "Sensor"), { size: 32, border: c.white }));
  boxes.push(circle(400, mid, 20, c.yellow));

  labels.push(d.label(190, y - 30, "(255, 0, 0)", { size: 32, color: c.light, anchor: "middle", mono: true }));
  labels.push(d.label(1400, 0, "r = 203\ng =  41\nb =  57", { size: 32, color: c.light, mono: true, centerY: mid }));
  // the longest line, 33 characters in German, is 634 wide at 32: 388 to 1022, inside the dashed lines
  labels.push(d.label(705, y - 86, T("ambient light · reflections\ndistance · angle · sensor noise",
    "Umgebungslicht · Spiegelungen\nAbstand · Winkel · Sensorrauschen"), { size: 32, color: c.gray, anchor: "middle" }));

  [[190, "digital"], [705, "analog"], [1355, "digital"]].forEach(([x, t]) => {
    labels.push(d.label(x, y + h + 90, t, { size: 32, color: c.light, anchor: "middle" }));
  });
  [365, 1030].forEach((x) => labels.push(d.line(x, 40, x, y + h + 110, { color: c.dark, width: 2, dashed: true })));
  return d.svg(1680, 460, ...d.layers(wires, boxes, labels));
}

/* --- the same scatter, cut into more regions ------------------------------------
 * Three columns, each the whole range of the sensor's readings from low to
 * high, cut into 2, 4 and 8 regions, one region per colour of the alphabet.
 * The legend above says what the dots are: seven readings while the sender
 * shows one and the same colour. In every column they scatter in the same band
 * (45 above and below the centre of one region). With 2 regions (half a
 * region: 105) and 4 (52.5) every reading stays inside; with 8 (26.25) three of
 * them cross a boundary and turn red. The first column stands from the start;
 * each segment cuts the next column (its boundaries draw in), then the
 * readings fall into the band one by one. back: "play", since cutting, showing
 * and recolouring tell nothing wrong in reverse. The offsets are the ones in
 * the article's code, which finds the same three readings. */

const SCATTER = [-16, 30, -41, 8, 43, -21, 19];

function regions(final = false) {
  const c = d.colors();
  const top = 140, height = 420, width = 220;
  const columns = [{ x: 250, n: 2 }, { x: 730, n: 4 }, { x: 1210, n: 8 }];
  const spread = 45;
  const wrong = [];
  const back = [], front = [];

  columns.forEach(({ x, n }, k) => {
    const cell = height / n;
    const mid = top + height / 2 - cell / 2;          // centre of the region just above the middle
    const frame = [
      d.box(x, top, width, height, "", { border: c.light, rounded: false, fill: "none" }),
      d.label(x + width / 2, top + height + 60, T(`${n} regions`, `${n} Bereiche`), { size: 32, color: c.gray, anchor: "middle" }),
    ];
    const band = rect(x + 20, mid - spread, width - 40, 2 * spread, c.dark);
    const cuts = [];
    for (let i = 1; i < n; i += 1) cuts.push(d.line(x + 2, top + i * cell, x + width - 2, top + i * cell, { color: c.gray, width: 3 }));
    const dots = SCATTER.map((off, i) => {
      const name = `r${k}-${i}`;
      const out = Math.abs(off) > cell / 2;
      if (out) wrong.push(name);
      return g(name, circle(x + 40 + i * 23.3, mid + off, 10, final && out ? c.red : c.white));
    });
    if (k === 0) {
      back.push(...frame, band);
      front.push(...cuts, ...dots);
    } else {
      back.push(g(`frame${k}`, ...frame), g(`band${k}`, band));
      front.push(g(`cuts${k}`, ...cuts), ...dots);
    }
  });
  // legend: what a dot is and what the band is; "one reading while the same
  // colour is sent" is 41 characters, 787 wide at 32: 290 to 1077
  back.push(circle(262, 50, 10, c.white),
    d.label(290, 0, T("one reading while the same colour is sent", "eine Messung, während dieselbe Farbe kommt"), { size: 32, color: c.light, centerY: 50 }),
    rect(1120, 32, 60, 36, c.dark),
    d.label(1200, 0, T("how far they scatter", "wie weit sie streuen"), { size: 32, color: c.light, centerY: 50 }),
    // the axis: what the height of a column means, written beside its two ends
    d.arrow(215, top + height, 215, top, { color: c.gray, width: 2 }),
    d.label(195, 0, T("high\nreading", "hoher\nMesswert"), { size: 20, color: c.gray, anchor: "end", centerY: top + 24 }),
    d.label(195, 0, T("low\nreading", "niedriger\nMesswert"), { size: 20, color: c.gray, anchor: "end", centerY: top + height - 24 }));
  return { svg: d.svg(1680, 640, ...back, ...front), wrong };
}

if ($("fig-regions")) {
  const { svg, wrong } = regions();
  $("fig-regions").innerHTML = svg;
  const a = d.anim("fig-regions", { back: "play" });
  [1, 2].forEach((k) => {
    const fall = SCATTER.map((_, i) => a.show(`r${k}-${i}`, { dur: 150 }));
    const items = [a.show(`frame${k}`, { dur: 400 }), a.draw(`cuts${k}`, { dur: 600 }), a.show(`band${k}`, { dur: 300 }), a.seq(...fall)];
    const red = wrong.filter((name) => name.startsWith(`r${k}-`));
    if (red.length) items.push(a.par(...red.map((name) => a.color(name, "red", { part: "fill", dur: 500 }))));
    a.step(...items);
  });
}

/* --- what the thrown-away precision buys ------------------------------------
 * Two copy chains, generation after generation, and each box shows what it
 * holds. Above, every tape holds a wave: the copy takes over the wave of the
 * last one with all its noise and adds noise of its own, so the wave inside
 * gets rougher from box to box. Below, every file holds the same bits, because
 * each copy is read and set again. Column heads say which generation it is.
 * Each segment makes one more generation in both chains. Forward only: copies
 * run in one direction. */

function copies() {
  const c = d.colors();
  const x0 = 60, w = 280, h = 150, gap = 100;
  const tapeY = 110, fileY = 390;
  const steps = 40;
  const wires = [], boxes = [], labels = [];

  // fixed pseudo-random numbers, so every export draws the same noise
  let seed = 7;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  // noise[gen][i]: the disturbance of generation gen, its own plus all before it
  const noise = [new Array(steps + 1).fill(0)];
  for (let gen = 1; gen < 4; gen += 1) noise.push(noise[gen - 1].map((v) => v + random() * 6 * gen * gen));

  const wave = (x, gen) => {
    const points = [];
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const y = tapeY + h / 2 + Math.sin(t * Math.PI * 2) * 38 + noise[gen][i];
      points.push(`${(x + 24 + t * (w - 48)).toFixed(1)},${y.toFixed(1)}`);
    }
    return `<polyline points="${points.join(" ")}" fill="none" stroke="${c.light}" stroke-width="3"/>`;
  };

  for (let i = 0; i < 4; i += 1) {
    const x = x0 + i * (w + gap);
    const first = i === 0;
    const border = first ? c.white : c.gray;
    const head = d.label(x + w / 2, 70, first ? T("original", "Original") : T(`copy ${i}`, `Kopie ${i}`), { size: 32, color: first ? c.white : c.light, anchor: "middle" });
    const tape = [d.box(x, tapeY, w, h, "", { border }), wave(x, i)];
    const file = [d.box(x, fileY, w, h, "0110", { border, size: 48, mono: true, color: c.light })];
    if (first) {
      labels.push(head);
      boxes.push(...tape, ...file);
    } else {
      wires.push(g(`arrow${i}`,
        d.arrow(x - gap + 10, tapeY + h / 2, x - 10, tapeY + h / 2, { color: c.gray, width: 3 }),
        d.arrow(x - gap + 10, fileY + h / 2, x - 10, fileY + h / 2, { color: c.gray, width: 3 })));
      boxes.push(g(`copy${i}`, head, ...tape, ...file));
    }
  }
  labels.push(d.label(x0, tapeY + h + 40, T("tape: every copy takes over the noise of the last one and adds its own",
    "Band: jede Kopie übernimmt das Rauschen der letzten und fügt eigenes hinzu"), { size: 20, color: c.gray }));
  labels.push(d.label(x0, fileY + h + 40, T("file: every copy is read and set again from clean bits",
    "Datei: jede Kopie wird gelesen und aus sauberen Bits neu gesetzt"), { size: 20, color: c.gray }));
  return d.svg(1680, 600, ...d.layers(wires, boxes, labels));
}

if ($("fig-copies")) {
  $("fig-copies").innerHTML = copies();
  const a = d.anim("fig-copies");
  for (let i = 1; i < 4; i += 1) {
    a.step(a.draw(`arrow${i}`, { dur: 500 }), a.show(`copy${i}`, { dur: 500 }));
  }
}

/* --- the two cuts --------------------------------------------------------------
 * The grey levels next to the third picture are drawn as the real greys they
 * stand for (computed rgb values, not palette colours): they show the subject. */

window.drawCuts = async function (_slide, step = 0) {
  const c = d.colors();
  const g = 300, y = 90;
  const xs = [110, 690, 1270];
  const full = await pixelate(256);
  const sampled = await pixelate(16);
  const quantized = await pixelate(16, 4, true);

  const parts = [];
  parts.push(picture(full, xs[0], y, g));
  for (let i = 1; i < 16; i += 1) {
    const t = (i / 16) * g;
    parts.push(d.line(xs[0] + t, y, xs[0] + t, y + g, { color: c.gray, width: 1 }));
    parts.push(d.line(xs[0], y + t, xs[0] + g, y + t, { color: c.gray, width: 1 }));
  }
  parts.push(picture(sampled, xs[1], y, g));
  parts.push(d.arrow(xs[0] + g + 40, y + g / 2, xs[1] - 40, y + g / 2, { color: c.gray, width: 3 }));
  parts.push(d.label(xs[0] + g / 2, y - 30, "the analog picture", { size: 32, color: c.gray, anchor: "middle" }));
  parts.push(d.label(xs[1] + g / 2, y - 30, "16 × 16 points", { size: 32, color: c.white, anchor: "middle" }));
  // "how many points: the resolution" is 31 characters, 595 wide at 32: 150 to 745
  parts.push(d.label(150, y + g + 90, "cut 1: sampling", { size: 32, color: step >= 1 ? c.light : c.yellow }));
  parts.push(d.label(150, y + g + 131, "how many points: the resolution", { size: 32, color: c.gray }));

  if (step >= 1) {
    parts.push(picture(quantized, xs[2], y, g));
    parts.push(d.arrow(xs[1] + g + 40, y + g / 2, xs[2] - 40, y + g / 2, { color: c.gray, width: 3 }));
    parts.push(d.label(xs[2] + g / 2, y - 30, "4 grey levels", { size: 32, color: c.white, anchor: "middle" }));
    // "how many levels: the colour depth" is 33 characters, 634 wide: 900 to 1534
    parts.push(d.label(900, y + g + 90, "cut 2: quantization", { size: 32, color: c.yellow }));
    parts.push(d.label(900, y + g + 131, "how many levels: the colour depth", { size: 32, color: c.gray }));
    for (let i = 0; i < 4; i += 1) {
      const v = Math.round((i / 3) * 255);
      // with a frame, or the brightest level vanishes on a light background
      parts.push(rect(xs[2] + g + 30, y + g - (i + 1) * 62, 46, 54, `rgb(${v},${v},${v})`, 4)
        .replace("/>", ` stroke="${c.gray}" stroke-width="2"/>`));
    }
  }
  return put("fig-cuts", d.svg(1680, y + g + 170, ...parts));
};

/* --- which cut was too coarse? ------------------------------------------------ */

async function drawArtefacts() {
  const c = d.colors();
  const g = 340, y = 40;
  const left = 260, right = 1080;
  const blocky = await pixelate(8);
  const flat = await pixelate(128, 2, false);
  const frame = (x) => d.box(x, y, g, g, "", { border: c.dark, fill: "none", rounded: false });
  return put("fig-artefacts", d.svg(1680, y + g + 140,
    picture(blocky, left, y, g),
    picture(flat, right, y, g),
    frame(left),
    frame(right),
    d.label(left + g / 2, y + g + 60, "too few points", { size: 32, color: c.white, anchor: "middle" }),
    d.label(left + g / 2, y + g + 101, "blocks", { size: 32, color: c.gray, anchor: "middle" }),
    d.label(right + g / 2, y + g + 60, "too few levels", { size: 32, color: c.white, anchor: "middle" }),
    d.label(right + g / 2, y + g + 101, "hard patches instead of soft shading", { size: 32, color: c.gray, anchor: "middle" })));
}

/* --- what a picture costs ------------------------------------------------------ */

function drawCost() {
  const c = d.colors();
  const cols = [80, 560, 900, 1240];
  const head = ["points", "bits per point", "size", "over the light link at 30 bit/s"];
  const rows = [
    ["4,096", "24 bit", "12 KB", "about 55 minutes"],
    ["4,096", "1 bit", "512 bytes", "about 2 minutes"],
  ];
  const parts = [
    d.label(80, 60, "64 × 64 points × bits per point = size", { size: 32, color: c.gray, mono: true }),
  ];
  head.forEach((t, j) => parts.push(d.label(cols[j], 160, t, { size: 20, color: c.gray })));
  parts.push(d.line(60, 190, 1620, 190, { color: c.dark, width: 2 }));
  rows.forEach((row, i) => {
    const y = 270 + i * 110;
    row.forEach((v, j) => {
      const last = j === 3;
      parts.push(d.label(cols[j], y, v, {
        size: 32, mono: !last, keepCase: true,
        color: last ? (i ? c.green : c.red) : c.white,
      }));
    });
  });
  parts.push(d.line(60, 400, 1620, 400, { color: c.dark, width: 2 }));
  return put("fig-cost", d.svg(1680, 440, ...parts));
}

/* --- how far can you go? -------------------------------------------------------- */

window.drawExtreme = async function (_slide, step = 0) {
  const levels = [
    { n: 128, text: "128 × 128" },
    { n: 32, text: "32 × 32" },
    { n: 8, text: "8 × 8" },
    { n: 2, text: "2 × 2" },
  ];
  const c = d.colors();
  const g = 300, y = 40, x0 = 110, gap = 76;
  const parts = [];
  for (let i = 0; i <= Math.min(3, step); i += 1) {
    const x = x0 + i * (g + gap);
    parts.push(picture(await pixelate(levels[i].n), x, y, g));
    parts.push(d.label(x + g / 2, y + g + 60, levels[i].text, { size: 32, color: c.white, anchor: "middle", mono: true }));
    const bytes = Math.round((levels[i].n * levels[i].n * 24) / 8);
    parts.push(d.label(x + g / 2, y + g + 101, `${bytes.toLocaleString("en")} bytes`, { size: 32, color: c.gray, anchor: "middle", mono: true }));
  }
  return put("fig-extreme", d.svg(1680, y + g + 140, ...parts));
};

/* --- the same two cuts, for sound ------------------------------------------------
 * One sound wave in three panels: stepless, then measured at twelve points in
 * time, then each value rounded to one of four amplitude levels. Every panel
 * has its axes, time to the right and amplitude (how far the air is pushed,
 * which a microphone turns into a voltage) upwards. Step 0 shows the wave,
 * step 1 the first cut, step 2 the second; the caption of the cut just made
 * is yellow (current), on the article's still picture both are white. The
 * faint curve behind the dots is the wave they were taken from. */

function soundCuts(step = 2, final = true) {
  const c = d.colors();
  const panelW = 440, top = 50, panelH = 300;
  const bottom = top + panelH;
  const [a, b, q] = [60, 620, 1180];
  const samples = 12, levels = 4;
  const signal = (s) => 0.5 + 0.3 * Math.sin(2 * Math.PI * s * 1.3 + 0.4) + 0.12 * Math.sin(2 * Math.PI * s * 3.1 + 1);
  const yOf = (v) => bottom - 20 - v * (panelH - 40);
  const curve = (x0, color) => {
    const pts = [];
    for (let i = 0; i <= 200; i += 1) pts.push(`${(x0 + 10 + (i / 200) * (panelW - 20)).toFixed(1)},${yOf(signal(i / 200)).toFixed(1)}`);
    return `<polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="3"/>`;
  };
  const sampleX = (x0, i) => x0 + 10 + ((i + 0.5) / samples) * (panelW - 20);
  const levelOf = (v) => Math.round(v * (levels - 1)) / (levels - 1);
  const head = (now) => (now && !final ? c.yellow : c.white);
  // "Amplitude" and "amplitude" are 9 characters, 108 wide at 20, beside the arrow's tip
  const axes = (x0) => [
    d.arrow(x0, bottom, x0 + panelW, bottom, { color: c.gray, width: 2 }),
    d.arrow(x0, bottom, x0, top - 30, { color: c.gray, width: 2 }),
    d.label(x0 + 14, top - 22, T("amplitude", "Amplitude"), { size: 20, color: c.gray }),
    d.label(x0 + panelW, bottom + 30, T("time", "Zeit"), { size: 20, color: c.gray, anchor: "end" }),
  ];
  // the longest caption, "Schnitt 2: Quantisieren", is 23 characters, 442 wide at 32, centred on its panel
  const caption = (x0, text, note, color) => [
    d.label(x0 + panelW / 2, 0, text, { size: 32, anchor: "middle", color, centerY: bottom + 80 }),
    d.label(x0 + panelW / 2, 0, note, { size: 32, anchor: "middle", color: c.gray, centerY: bottom + 125 }),
  ];
  const arrow = (x0, x1) => d.arrow(x0 + panelW + 30, top + panelH / 2, x1 - 30, top + panelH / 2, { color: c.gray, width: 3 });

  const parts = [...axes(a), curve(a, c.white), ...caption(a, T("the sound wave", "die Schallwelle"), T("stepless", "stufenlos"), c.white)];
  if (step >= 1) {
    parts.push(...axes(b), curve(b, c.dark), arrow(a, b));
    for (let i = 0; i < samples; i += 1) {
      const x = sampleX(b, i);
      parts.push(d.line(x, top, x, bottom, { color: c.dark, width: 2, dashed: true }));
      parts.push(circle(x, yOf(signal((i + 0.5) / samples)), 10, c.white));
    }
    parts.push(...caption(b, T("cut 1: sampling", "Schnitt 1: Abtasten"), T("12 points in time", "12 Zeitpunkte"), head(step === 1)));
  }
  if (step >= 2) {
    parts.push(...axes(q), curve(q, c.dark), arrow(b, q));
    for (let k = 0; k < levels; k += 1) {
      const y = yOf(k / (levels - 1));
      parts.push(d.line(q, y, q + panelW, y, { color: c.gray, width: 2 }));
    }
    for (let i = 0; i < samples; i += 1) parts.push(circle(sampleX(q, i), yOf(levelOf(signal((i + 0.5) / samples))), 10, c.white));
    parts.push(...caption(q, T("cut 2: quantization", "Schnitt 2: Quantisieren"), T("4 amplitude levels", "4 Amplitudenstufen"), head(true)));
  }
  return d.svg(1680, bottom + 150, ...parts);
}

window.drawSound = (_slide, step = 0) => put("fig-sound", soundCuts(step, false));

/* --- start ------------------------------------------------------------------------ */

if ($("fig-kinds")) {
  drawKinds();
  put("fig-middle", middle());
  drawCost();
  drawArtefacts();
}

// the drawings of the article, each in its last state (slides/figures.js)
window.deckAnalog = {
  between: () => between(1),
  middle,
  light: () => light(1),
  regions: () => regions(true).svg,
  copies,
  soundCuts: () => soundCuts(2, true),
};
