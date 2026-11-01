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
"use strict";

const d = window.draw;
const $ = (id) => document.getElementById(id);
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; return svg; };

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
                  ["img/icon-hourglass.png", "hourglass"]];
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

/* --- the analog middle -------------------------------------------------------
 * Digital, analog, digital: the stretch between sender and sensor is a smooth
 * curve with changing swings, stepless and always moving, not a zigzag. Red
 * marks the zone no program controls; the LED dot is yellow because it is lit. */

function drawMiddle() {
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

  boxes.push(d.box(40, y, 300, h, "sender", { size: 32, border: c.white }));
  boxes.push(d.box(1060, y, 300, h, "sensor", { size: 32, border: c.white }));
  boxes.push(circle(400, mid, 20, c.yellow));

  labels.push(d.label(190, y - 30, "(255, 0, 0)", { size: 32, color: c.light, anchor: "middle", mono: true }));
  labels.push(d.label(1400, 0, "r = 203\ng =  41\nb =  57", { size: 32, color: c.light, mono: true, centerY: mid }));
  labels.push(d.label(705, y - 30, "ambient light · distance · noise", { size: 32, color: c.gray, anchor: "middle" }));

  [[190, "digital", c.light], [705, "analog", c.red], [1355, "digital", c.light]].forEach(([x, t, col]) => {
    labels.push(d.label(x, y + h + 90, t, { size: 32, color: col, anchor: "middle" }));
  });
  [365, 1030].forEach((x) => labels.push(d.line(x, 40, x, y + h + 110, { color: c.dark, width: 2, dashed: true })));
  return put("fig-middle", d.svg(1680, 460, ...d.layers(wires, boxes, labels)));
}

/* --- same wobble, more regions ----------------------------------------------
 * Three columns, each the same range of readings, cut into 2, 4 and 8 regions.
 * In every column the same seven readings scatter in the same band (52 above
 * and below the centre of one region). With 2 regions (half a region: 120) and
 * 4 (60) every reading stays inside; with 8 (30) three of them cross a
 * boundary and turn red. The first column stands from the start; each segment
 * cuts the next column (its boundaries draw in), then the readings fall into
 * the band one by one. back: "play", since cutting, showing and recolouring
 * tell nothing wrong in reverse. */
(function () {
  if (!$("fig-regions")) return;
  const c = d.colors();
  const top = 40, height = 480, width = 220;
  const columns = [{ x: 250, n: 2 }, { x: 730, n: 4 }, { x: 1210, n: 8 }];
  const wobble = 52;
  const offsets = [-18, 34, -47, 9, 50, -24, 22];
  const wrong = [];
  const back = [], front = [];

  columns.forEach(({ x, n }, k) => {
    const cell = height / n;
    const mid = top + height / 2 - cell / 2;          // centre of the region just above the middle
    const frame = [
      d.box(x, top, width, height, "", { border: c.light, rounded: false, fill: "none" }),
      d.label(x + width / 2, top + height + 60, `${n} regions`, { size: 32, color: c.gray, anchor: "middle" }),
    ];
    const band = rect(x + 20, mid - wobble, width - 40, 2 * wobble, c.dark);
    const cuts = [];
    for (let i = 1; i < n; i += 1) cuts.push(d.line(x + 2, top + i * cell, x + width - 2, top + i * cell, { color: c.gray, width: 3 }));
    const dots = offsets.map((off, i) => {
      const name = `r${k}-${i}`;
      if (Math.abs(off) > cell / 2) wrong.push(name);
      return d.g(name, circle(x + 40 + i * 23.3, mid + off, 10, c.white));
    });
    if (k === 0) {
      back.push(...frame, band);
      front.push(...cuts, ...dots);
    } else {
      back.push(d.g(`frame${k}`, ...frame), d.g(`band${k}`, band));
      front.push(d.g(`cuts${k}`, ...cuts), ...dots);
    }
  });
  $("fig-regions").innerHTML = d.svg(1680, 640, ...back, ...front);

  const a = d.anim("fig-regions", { back: "play" });
  [1, 2].forEach((k) => {
    const fall = offsets.map((_, i) => a.show(`r${k}-${i}`, { dur: 150 }));
    const items = [a.show(`frame${k}`, { dur: 400 }), a.draw(`cuts${k}`, { dur: 600 }), a.show(`band${k}`, { dur: 300 }), a.seq(...fall)];
    const red = wrong.filter((name) => name.startsWith(`r${k}-`));
    if (red.length) items.push(a.par(...red.map((name) => a.color(name, "red", { part: "fill", dur: 500 }))));
    a.step(...items);
  });
})();

/* --- what the thrown-away precision buys ------------------------------------
 * Two copy chains, generation after generation. Above, the tape copies its
 * wave with the noise of the last copy and adds its own; below, the file is
 * read and set again, so the bits stay the same. Each segment makes one more
 * generation in both chains. Forward only: copies run in one direction. */
(function () {
  if (!$("fig-copies")) return;
  const c = d.colors();
  const x0 = 60, w = 250, h = 100, gap = 130;
  const wires = [], boxes = [], labels = [];

  const wave = (x, y, noise) => {
    const points = [];
    for (let i = 0; i <= 26; i += 1) {
      const t = i / 26;
      const base = Math.sin(t * Math.PI * 2) * 22;
      // zero at both ends, so the wave meets the boxes at their middle
      const disturbance = (i % 2 ? -1 : 1) * noise * (0.6 + 0.4 * Math.sin(i * 1.7)) * Math.sin(Math.PI * t);
      points.push(`${(x + t * gap).toFixed(1)},${(y + base + disturbance).toFixed(1)}`);
    }
    return `<polyline points="${points.join(" ")}" fill="none" stroke="${c.light}" stroke-width="3"/>`;
  };

  for (let i = 0; i < 4; i += 1) {
    const x = x0 + i * (w + gap);
    const first = i === 0;
    const o = { size: 32, border: first ? c.white : c.dark, color: first ? c.white : c.light };
    const tape = d.box(x, 60, w, h, first ? "tape" : "copy", o);
    const file = [d.box(x, 330, w, h, first ? "file" : "copy", o),
      d.label(x + w / 2, 490, "0110", { size: 32, color: c.light, anchor: "middle", mono: true })];
    if (first) {
      boxes.push(tape, file[0]);
      labels.push(file[1]);
    } else {
      wires.push(d.g(`wave${i}`, wave(x - gap, 110, i * 6)));
      wires.push(d.g(`arrow${i}`, d.arrow(x - gap, 380, x, 380, { color: c.gray, width: 3 })));
      boxes.push(d.g(`tape${i}`, tape), d.g(`file${i}`, ...file));
    }
  }
  labels.push(d.label(x0, 40, "analog: every copy carries the noise of the last one", { size: 20, color: c.gray }));
  labels.push(d.label(x0, 310, "digital: every copy is read and set again", { size: 20, color: c.gray }));
  $("fig-copies").innerHTML = d.svg(1680, 530, ...d.layers(wires, boxes, labels));

  const a = d.anim("fig-copies");
  for (let i = 1; i < 4; i += 1) {
    a.step(a.par(a.draw(`wave${i}`, { dur: 700 }), a.draw(`arrow${i}`, { dur: 700 })),
      a.par(a.show(`tape${i}`, { dur: 400 }), a.show(`file${i}`, { dur: 400 })));
  }
})();

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

/* --- start ------------------------------------------------------------------------ */

if ($("fig-kinds")) {
  drawKinds();
  drawMiddle();
  drawCost();
  drawArtefacts();
}
