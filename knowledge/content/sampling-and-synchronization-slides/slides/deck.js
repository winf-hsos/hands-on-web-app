// Drawings and animations of "keeping time" (sampling and synchronization).
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80); on slides with a
// punchline a figure is at most 660 high, otherwise it would be scaled down.
// Static figures are redrawn per build-up step (data-on-show, data-on-step);
// animated ones are drawn once when the deck loads, and their segments are
// the build-up steps of the slide. Random scatter comes from a generator with
// a fixed seed, so a figure looks the same in the talk, in the PDF and on
// every reload.
"use strict";

const d = window.draw;
const $ = (id) => document.getElementById(id);
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; return svg; };

function rect(x, y, w, h, fill, extra = "") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;
}

function circle(x, y, r, fill, extra = "") {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${extra}/>`;
}

/* uniform numbers in [0, 1) and normally distributed ones (Box-Muller) from a
 * linear congruential generator with a fixed seed */
function rng(seed) {
  let s = seed >>> 0;
  const u = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const g = () => Math.sqrt(-2 * Math.log(Math.max(u(), 1e-9))) * Math.cos(2 * Math.PI * u());
  return { u, g };
}

/* The colours of the light. They stand for themselves (red, green and blue
 * light), so on these figures labels and marks are white or gray, and the
 * judgement goes into the punchline (design rule on real colours). */
const light = (c, name) => ({ red: c.red, green: c.green, blue: c.blue })[name];

/* ---- part 1: what the receiver sees ---------------------------------------
 * Seven symbols as the sender switches them (cells with gaps between them) and
 * as the receiver sees them: one band of light without boundaries, in which
 * two equal neighbours run into one and each change is a short blend. Cells 150 wide from x 330, so the rows
 * end at 1380; row names right-aligned at 300 ("seen" is 4 x 19.2 = 77 wide). */
function drawStream(slide, step) {
  const c = d.colors();
  const seq = ["red", "green", "green", "blue", "red", "red", "green"];
  const x0 = 330, w = 150, end = x0 + seq.length * w;
  const parts = [
    d.label(300, 0, "sent", { anchor: "end", centerY: 145, color: c.light }),
    ...seq.map((s, i) => rect(x0 + i * w + 3, 90, w - 6, 110, light(c, s))),
    d.arrow(x0, 545, end + 30, 545, { color: c.gray }),
    d.label(end + 50, 0, "time", { centerY: 545, color: c.gray }),
  ];
  if (step >= 1) {
    // one band whose colour blends into the next over a short stretch, as a
    // sensor sees it: the LED does not switch in zero time, and the reading
    // window overlaps the change
    parts.push(d.label(300, 0, "seen", { anchor: "end", centerY: 395, color: c.light }));
    const blend = 14;
    const stops = [];
    seq.forEach((s, i) => {
      const a = (i * w + (i === 0 ? 0 : blend)) / (end - x0);
      const b = ((i + 1) * w - (i === seq.length - 1 ? 0 : blend)) / (end - x0);
      stops.push(`<stop offset="${a.toFixed(4)}" stop-color="${light(c, s)}"/>`, `<stop offset="${b.toFixed(4)}" stop-color="${light(c, s)}"/>`);
    });
    parts.push(`<defs><linearGradient id="seen-band" x1="${x0}" x2="${end}" y1="0" y2="0" gradientUnits="userSpaceOnUse">${stops.join("")}</linearGradient></defs>`);
    parts.push(rect(x0, 340, end - x0, 110, "url(#seen-band)"));
  }
  if (step >= 2) {
    // every boundary of the sender, dashed over the band; a question mark
    // where the band shows no change at all
    for (let k = 1; k < seq.length; k += 1) {
      const x = x0 + k * w;
      parts.push(d.line(x, 325, x, 465, { color: c.white, width: 3, dashed: true }));
      if (seq[k] === seq[k - 1]) parts.push(d.label(x, 0, "?", { size: 48, anchor: "middle", centerY: 490, color: c.white }));
    }
  }
  put("fig-stream", d.svg(1680, 600, ...parts));
}

/* ---- cause one: no two clocks run alike --------------------------------------
 * Twelve time slots of the sender, 110 wide from x 240, with a tick under the
 * middle of each slot; below them the readings of a receiver whose clock runs
 * 8 % slow, so reading i lands at (i + 0.5) * 110 * 1.08. From the seventh
 * reading on the error passes half a slot (55): the dot sits in the next slot
 * and is red. The drift is exaggerated so it shows within ten readings; the
 * caption says so. The readings appear one after another, a process in time:
 * four in the first segment, six in the second (2.4 s). */
(function () {
  if (!$("fig-drift")) return;
  const c = d.colors();
  const x0 = 240, w = 110, drift = 1.08;
  const slots = [];
  for (let i = 0; i < 12; i += 1) {
    const x = x0 + i * w;
    slots.push(d.box(x + 3, 110, w - 6, 110, String(i + 1), { border: c.gray, color: c.light, size: 32 }));
    slots.push(d.line(x + w / 2, 228, x + w / 2, 248, { color: c.gray, width: 3 }));
  }
  const readings = [];
  for (let i = 0; i < 10; i += 1) {
    const x = x0 + (i + 0.5) * w * drift;
    const wrong = (i + 0.5) * w * (drift - 1) > w / 2;
    readings.push(d.g("r" + i,
      d.line(x, 252, x, 300, { color: c.gray, width: 2, dashed: true }),
      circle(x.toFixed(1), 320, 15, wrong ? c.red : c.white)));
  }
  put("fig-drift", d.svg(1680, 520,
    d.label(210, 0, "sender", { anchor: "end", centerY: 165, color: c.light }),
    d.label(210, 0, "receiver", { anchor: "end", centerY: 320, color: c.light }),
    ...slots, ...readings,
    d.label(840, 0, "the receiver's clock runs 8 % slow, exaggerated so it shows after a few symbols",
      { anchor: "middle", centerY: 450, color: c.gray })));
  const a = d.anim("fig-drift");
  a.step(a.seq(...[0, 1, 2, 3].map((i) => a.show("r" + i, { dur: 350 }))));
  a.step(a.seq(...[4, 5, 6, 7, 8, 9].map((i) => a.show("r" + i, { dur: 400 }))));
})();

/* ---- cause two: the sensor needs time to look ---------------------------------
 * Two panels on the same time scale, 2 units per ms. Left, symbols of 100 ms
 * (200 units) and a measuring window of 50 ms (100 units, yellow: the window
 * that is measuring now) inside one bright symbol. Right, symbols of 40 ms
 * (80 units): the same window covers 60 units of bright and 40 of dark. Below
 * each window a box of the same width with the average brightness the sensor
 * reports, and a verdict. Bright and dark are gray levels, not colours of the light, so the
 * verdict colours keep their meaning here. */
function strip(x0, x1, len, firstBright, c) {
  const parts = [];
  for (let x = x0, k = 0; x < x1; x += len, k += 1) {
    const bright = (k % 2 === 0) === firstBright;
    parts.push(rect(x, 130, Math.min(len, x1 - x), 100, bright ? c.light : c.dark));
  }
  return parts;
}

/* Below the window, a box of the same width that shows what the sensor
 * reports: the average brightness over the window, drawn as the bright gray
 * at opacity f over the dark one. */
function average(x, f, c) {
  return [
    d.arrow(x + 50, 250, x + 50, 318, { color: c.gray }),
    rect(x, 330, 100, 100, c.dark),
    rect(x, 330, 100, 100, c.light, f < 1 ? ` fill-opacity="${f}"` : ""),
    rect(x, 330, 100, 100, "none", ` stroke="${c.yellow}" stroke-width="5"`),
  ];
}

function drawWindow(slide, step) {
  const c = d.colors();
  const parts = [
    d.label(430, 0, "symbols of 100 ms", { anchor: "middle", centerY: 85 }),
    ...strip(60, 800, 200, true, c),
    rect(510, 118, 100, 124, "none", ` stroke="${c.yellow}" stroke-width="5"`),
    d.label(450, 0, "window 50 ms", { anchor: "end", centerY: 280, color: c.yellow }),
    ...average(510, 1, c),
    d.label(640, 0, "what the sensor reports", { centerY: 380, color: c.light }),
    d.verdict(110, 470, 640, 130, "reads bright", true, { size: 32 }),
  ];
  if (step >= 1) {
    parts.push(
      d.label(1250, 0, "symbols of 40 ms", { anchor: "middle", centerY: 85 }),
      ...strip(880, 1620, 80, true, c),
      rect(1220, 118, 100, 124, "none", ` stroke="${c.yellow}" stroke-width="5"`),
      d.label(1160, 0, "window 50 ms", { anchor: "end", centerY: 280, color: c.yellow }));
  }
  if (step >= 2) {
    parts.push(...average(1220, 0.6, c),
      d.verdict(930, 470, 640, 130, "matches neither symbol", false, { size: 32 }));
  }
  put("fig-window", d.svg(1680, 640, ...parts));
}

/* ---- part 2: error over time ---------------------------------------------------
 * Shared axes of the two error figures, so both sit pixel for pixel in the
 * same place: time 0 to 20 s from x 260 (62 units per second), clock error 0
 * to 100 ms from y 500 upwards (4.2 units per ms). The dashed line is half a
 * symbol at ten symbols per second, 50 ms. */
const ex = (t) => 260 + t * 62;
const ey = (ms) => 500 - ms * 4.2;

function errorAxes(c) {
  return [
    d.line(260, 500, 1520, 500, { color: c.light, width: 3 }),
    d.line(260, 502, 260, 70, { color: c.light, width: 3 }),
    ...[0, 5, 10, 15, 20].map((t) => d.label(ex(t), 0, String(t), { anchor: "middle", centerY: 535, color: c.gray })),
    ...[0, 50, 100].map((ms) => d.label(235, 0, String(ms), { anchor: "end", centerY: ey(ms), color: c.gray })),
    d.label(880, 0, "seconds since the shared start", { anchor: "middle", centerY: 585, color: c.gray }),
    d.label(260, 0, "clock error in ms", { centerY: 40, color: c.gray }),
    d.line(260, ey(50), 1520, ey(50), { color: c.light, width: 2, dashed: true }),
    d.label(290, 0, "room at 10 symbols per second: 50 ms", { centerY: ey(50) - 30, color: c.light }),
  ];
}

/* Clocks that differ by 0.5 % drift 5 ms apart per second. The line draws
 * itself, a process in time: up to the crossing at 10 s white, beyond it red,
 * where the receiver reads the neighbouring symbol. The gray line is the room
 * left with a sensor window of 20 ms, 40 ms, which the error reaches at 8 s. */
(function () {
  if (!$("fig-error")) return;
  const c = d.colors();
  put("fig-error", d.svg(1680, 610,
    ...errorAxes(c),
    d.g("e1", d.line(ex(0), ey(0), ex(10), ey(50), { color: c.white, width: 5 })),
    d.g("e2", d.line(ex(10), ey(50), ex(20), ey(100), { color: c.red, width: 5 })),
    d.g("hit",
      circle(ex(10), ey(50), 12, c.red),
      d.label(ex(10) + 40, 0, "from here on it reads the neighbor", { centerY: 380, color: c.red })),
    d.g("win",
      d.line(260, ey(40), 1520, ey(40), { color: c.gray, width: 2, dashed: true }),
      circle(ex(8), ey(40), 10, c.gray),
      d.label(280, 0, "20 ms window: 40 ms", { centerY: ey(40) + 30, color: c.gray }))));
  const a = d.anim("fig-error");
  a.step(a.draw("e1", { dur: 2000, ease: "linear" }));
  a.step(a.draw("e2", { dur: 1600, ease: "linear" }), a.show("hit"), a.show("win"));
})();

/* ---- faster breaks sooner -----------------------------------------------------
 * Seconds until two clocks that differ by 0.5 % are half a symbol apart:
 * half a symbol is 0.5 / rate seconds, the drift 0.005 s per second, so the
 * time is 100 / rate. */
(function () {
  if (!$("fig-rate")) return;
  const c = d.colors();
  const chart = d.chart({
    type: "bar", width: 1680, height: 560, unit: " s",
    labels: ["1", "2", "5", "10", "20"],
    values: [100, 50, 20, 10, 5],
    states: [
      { values: "all" },
      { highlight: ["10"], note: { at: "10", text: "the example" } },
    ],
  });
  put("fig-rate", d.svg(1680, 620, chart.svg(),
    d.label(840, 0, "symbols per second", { anchor: "middle", centerY: 600, color: c.gray })));
  chart.steps("fig-rate");
})();

/* ---- markers reset the error ------------------------------------------------------
 * The axes of the figure before. Step 0: the error line from before. Step 1:
 * the same line dashed and gray, and in white the error with a marker every
 * four seconds (yellow ticks on the time axis): it grows to 20 ms and starts
 * again from zero, a sawtooth that never reaches the dashed line. */
function drawMarkers(slide, step) {
  const c = d.colors();
  const parts = [...errorAxes(c)];
  if (step === 0) {
    parts.push(d.line(ex(0), ey(0), ex(20), ey(100), { color: c.white, width: 5 }));
  } else {
    parts.push(d.line(ex(0), ey(0), ex(20), ey(100), { color: c.gray, width: 3, dashed: true }));
    const pts = [];
    for (let k = 0; k < 5; k += 1) pts.push(`${ex(4 * k)},${ey(0)}`, `${ex(4 * k + 4)},${ey(20)}`);
    parts.push(`<polyline points="${pts.join(" ")}" fill="none" stroke="${c.white}" stroke-width="5" stroke-linejoin="round"/>`);
    for (let k = 1; k < 5; k += 1) parts.push(d.line(ex(4 * k), 486, ex(4 * k), 514, { color: c.yellow, width: 6 }));
    parts.push(d.label(ex(14), 0, "at most 20 ms between two markers", { anchor: "middle", centerY: 380 }));
  }
  put("fig-markers", d.svg(1680, 610, ...parts));
}

/* ---- the receiver anchors its grid on a marker ------------------------------------
 * Six symbols of 200 units from x 240; the third is the marker, a dark pause.
 * The receiver samples five times per symbol (every 40 units from x 260) and
 * its grid of symbol boundaries (blue, dashed) is 60 units late. Segment 1:
 * the first sample inside the pause, at 660, gets a yellow dot below it. Segment 2: the
 * grid moves 40 to the left and now starts at that sample; it is 20 units off
 * the true boundary, less than one sample step. */
(function () {
  if (!$("fig-anchor")) return;
  const c = d.colors();
  const cells = [];
  for (let j = 0; j < 6; j += 1) {
    const x = 240 + 200 * j;
    cells.push(j === 2
      ? d.box(x + 3, 90, 194, 120, "marker", { border: c.gray, fill: c.dark, color: c.white, size: 32 })
      : d.box(x + 3, 90, 194, 120, "data", { border: c.gray, color: c.gray, size: 32 }));
  }
  const ticks = [];
  for (let k = 0; k < 30; k += 1) {
    const x = 260 + 40 * k;
    if (x !== 660) ticks.push(d.line(x, 250, x, 290, { color: c.light, width: 3 }));
  }
  const grid = [];
  for (let j = 0; j < 7; j += 1) grid.push(d.line(300 + 200 * j, 70, 300 + 200 * j, 330, { color: c.blue, width: 3, dashed: true }));
  grid.push(d.label(300, 0, "where the receiver's clock puts the symbol borders", { centerY: 370, color: c.blue }));
  put("fig-anchor", d.svg(1680, 560,
    d.label(210, 0, "sender", { anchor: "end", centerY: 150, color: c.light }),
    d.label(210, 0, "readings", { anchor: "end", centerY: 270, color: c.light }),
    ...cells, ...ticks,
    d.line(660, 250, 660, 290, { color: c.light, width: 3 }),
    d.g("first", circle(660, 312, 11, c.yellow)),
    d.g("grid", ...grid),
    d.g("found", d.label(660, 0, "the first reading in the pause", { anchor: "middle", centerY: 450, color: c.yellow })),
    d.g("result", d.label(840, 0, "its borders now start there, off by less than one reading", { anchor: "middle", centerY: 515 }))));
  const a = d.anim("fig-anchor");
  a.step(a.show("first", { dur: 400 }), a.show("found", { dur: 400 }));
  a.step(a.move("grid", -40, 0, { dur: 1200 }), a.show("result", { dur: 500 }));
})();

/* ---- part 3: a change means "next" ---------------------------------------------
 * Six symbols, two pairs of equal neighbours. The band the receiver sees has
 * only three changes, marked by white triangles above it. Real colours, so
 * the marks are white and the judgement is in the punchline. */
function drawNaive(slide, step) {
  const c = d.colors();
  const seq = ["red", "red", "green", "blue", "blue", "red"];
  const x0 = 330, w = 170;
  const parts = [
    d.label(300, 0, "sent", { anchor: "end", centerY: 145, color: c.light }),
    ...seq.map((s, i) => rect(x0 + i * w + 3, 90, w - 6, 110, light(c, s))),
  ];
  if (step >= 1) {
    parts.push(d.label(300, 0, "seen", { anchor: "end", centerY: 375, color: c.light }));
    let i = 0;
    while (i < seq.length) {
      let j = i;
      while (j + 1 < seq.length && seq[j + 1] === seq[i]) j += 1;
      parts.push(rect(x0 + i * w, 320, (j - i + 1) * w, 110, light(c, seq[i])));
      if (i > 0) {
        const x = x0 + i * w;
        parts.push(`<path d="M${x - 14},280 L${x + 14},280 L${x},304 Z" fill="${c.white}"/>`);
      }
      i = j + 1;
    }
    parts.push(d.label(840, 0, "six symbols, but only three changes", { anchor: "middle", centerY: 500 }));
  }
  put("fig-naive", d.svg(1680, 540, ...parts));
}

/* ---- the change carries the bit ---------------------------------------------------
 * Three colours on a triangle, clockwise red, green, blue. A clockwise step
 * means 1, an anticlockwise one 0, and a colour never follows itself. On the
 * right the example red, green, red, blue, one change per build-up step; the
 * edge of the current change turns yellow on the triangle, and the bits are
 * yellow for 1 and white for 0 (yellow means 1, as everywhere). */
function drawTriangle(slide, step) {
  const c = d.colors();
  const pos = { red: [460, 120], green: [700, 500], blue: [220, 500] };
  const seq = ["red", "green", "red", "blue"];
  const edges = [];
  for (const [a, b] of [["red", "green"], ["green", "blue"], ["blue", "red"]]) {
    edges.push(d.line(...pos[a], ...pos[b], { color: c.gray, width: 4 }));
  }
  if (step >= 1) {
    const [a, b] = [seq[step - 1], seq[step]];
    edges.push(d.line(...pos[a], ...pos[b], { color: c.yellow, width: 10 }));
  }
  // a clockwise arrow in the middle of the triangle (SVG arc, sweep flag 1)
  const cx = 460, cy = 380, r = 70;
  const at = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const [sx, sy] = at(-120), [tx, ty] = at(150);
  const th = (150 * Math.PI) / 180;
  const tan = [-Math.sin(th), Math.cos(th)], nor = [Math.cos(th), Math.sin(th)];
  const P = (k, m) => `${(tx + tan[0] * k + nor[0] * m).toFixed(1)},${(ty + tan[1] * k + nor[1] * m).toFixed(1)}`;
  const turn = `<path d="M${sx.toFixed(1)},${sy.toFixed(1)} A${r},${r} 0 1 1 ${tx.toFixed(1)},${ty.toFixed(1)}" fill="none" stroke="${c.light}" stroke-width="4"/>` +
    `<path d="M${P(16, 0)} L${P(-8, 13)} L${P(-8, -13)} Z" fill="${c.light}"/>`;
  const nodes = Object.entries(pos).map(([n, [x, y]]) => circle(x, y, 60, light(c, n)));
  const parts = [...edges, turn, ...nodes,
    d.label(900, 0, "clockwise step = 1", { centerY: 130 }),
    d.label(900, 0, "anticlockwise step = 0", { centerY: 195 }),
    d.label(900, 0, "a color never follows itself", { centerY: 260, color: c.gray }),
  ];
  const sx0 = 900, sw = 100, sg = 60;
  const bits = ["1", "0", "0"];
  for (let k = 0; k <= Math.min(step, 3); k += 1) {
    if (step === 0) break;
    parts.push(rect(sx0 + k * (sw + sg), 360, sw, sw, light(c, seq[k])));
    if (k >= 1) {
      const bx = sx0 + k * (sw + sg) - sg / 2;
      parts.push(d.label(bx, 0, bits[k - 1], { anchor: "middle", centerY: 530, size: 48, mono: true, color: bits[k - 1] === "1" ? c.yellow : c.white }));
    }
  }
  put("fig-triangle", d.svg(1680, 600, ...parts));
}

/* ---- what the change costs in bits -------------------------------------------------
 * k colours carry log2(k) bits as states and log2(k - 1) as changes. Columns
 * centred at 420, 840 and 1260; step 1 highlights the row of five colours,
 * the smallest alphabet that gives a clean two bits per change. */
function drawBits(slide, step) {
  const c = d.colors();
  const rows = [["3", "1.58", "1"], ["4", "2", "1.58"], ["5", "2.32", "2"]];
  const ys = [300, 390, 480];
  const parts = [
    d.label(840, 0, "as states", { anchor: "middle", centerY: 70, color: c.gray }),
    d.label(1260, 0, "as changes", { anchor: "middle", centerY: 70, color: c.gray }),
    d.label(420, 0, "k colors", { anchor: "middle", centerY: 150, size: 48 }),
    d.formula(840, 0, "b = log_2(k)", { size: 48, anchor: "middle", centerY: 150 }),
    d.formula(1260, 0, "b = log_2(k − 1)", { size: 48, anchor: "middle", centerY: 150 }),
    d.line(260, 215, 1420, 215, { color: c.dark, width: 2 }),
  ];
  if (step >= 1) parts.push(d.highlight(260, 1160, ys[2], 48, { color: c.yellow }));
  rows.forEach((row, i) => {
    const color = step >= 1 && i === 2 ? c.yellow : c.white;
    [420, 840, 1260].forEach((x, k) => parts.push(d.label(x, 0, row[k], { anchor: "middle", centerY: ys[i], size: 48, mono: true, color })));
  });
  put("fig-bits", d.svg(1680, 540, ...parts));
}

/* ---- part 4: two ways side by side --------------------------------------------------
 * Two boxes 780 wide; the longest line, "the receiver waits for a change"
 * (31 characters x 19.2 = 595), starts at the box edge + 40 and ends well
 * inside. Neither box is judged: both ways work, at different prices. */
function drawWays(slide, step) {
  const c = d.colors();
  const column = (x, title, lines) => [
    d.box(x, 30, 780, 500, "", { border: c.gray }),
    d.label(x + 390, 0, title, { anchor: "middle", centerY: 100, size: 48 }),
    ...lines.map((t, i) => d.label(x + 40, 0, t, { centerY: 210 + i * 80, color: c.light })),
  ];
  const parts = column(40, "with a clock", [
    "the receiver counts time",
    "markers limit the drift",
    "each marker costs a symbol",
    "k colors carry log₂ k bits",
  ]);
  if (step >= 1) {
    parts.push(...column(860, "without a clock", [
      "the receiver waits for a change",
      "there is no clock to drift",
      "mixed readings are filtered out",
      "k colors carry log₂(k − 1) bits",
    ]));
  }
  put("fig-ways", d.svg(1680, 560, ...parts));
}

/* ---- the formula -------------------------------------------------------------------
 * The time a file takes, and its three quantities left-aligned at x 600
 * (letters in code type, explanations at 700). */
function drawFormula(slide, step) {
  const c = d.colors();
  const parts = [d.formula(840, 0, "t = n / (r · b)", { size: 80, anchor: "middle", centerY: 140 })];
  if (step >= 1) {
    [["n", "bits to send"], ["r", "symbols per second"], ["b", "bits per symbol"]].forEach(([v, t], i) => {
      parts.push(d.label(600, 0, v, { centerY: 300 + i * 85, size: 48, mono: true, color: c.yellow }));
      parts.push(d.label(700, 0, t, { centerY: 300 + i * 85, size: 48 }));
    });
  }
  put("fig-formula", d.svg(1680, 520, ...parts));
}

/* ---- what a file costs ---------------------------------------------------------------
 * 2 KiB = 16,384 bits at five symbols per second with four colours: 2 bits
 * per symbol with a clock (1,638 s = 27.3 min), log2(3) = 1.58 bits per
 * change without one (2,067 s = 34.5 min). */
(function () {
  if (!$("fig-file")) return;
  const chart = d.chart({
    type: "hbar", width: 1680, height: 420, unit: " min", decimals: 0,
    labels: ["with a clock", "without a clock"],
    values: [27.3, 34.4],
    states: [
      { values: "all" },
      { highlight: ["without a clock"], note: { at: "without a clock", text: "7 minutes more" } },
    ],
  });
  put("fig-file", d.svg(1680, 420, chart.svg()));
  chart.steps("fig-file");
})();

/* ---- how much room does a reading have? -----------------------------------------
 * One symbol of 100 ms as a box 1000 wide (10 units per ms) from x 340, with
 * parts of its neighbours dimmed on either side. The reading sits in the
 * middle (yellow, the reading now). Step 0: 50 ms of room to either border.
 * Step 1: a measuring window of 20 ms (200 units) has to stay inside, so the
 * room shrinks to 40 ms on either side. */
function drawRoom(slide, step) {
  const c = d.colors();
  const parts = [
    rect(140, 150, 190, 160, c.dark),
    rect(1350, 150, 190, 160, c.dark),
    d.box(340, 150, 1000, 160, "", { border: c.light }),
    d.label(840, 0, "one symbol at 10 symbols per second: 100 ms", { anchor: "middle", centerY: 100, color: c.light }),
    d.label(235, 0, "neighbor", { anchor: "middle", centerY: 350, color: c.gray }),
    d.label(1445, 0, "neighbor", { anchor: "middle", centerY: 350, color: c.gray }),
  ];
  const left = step >= 1 ? 740 : 840, right = step >= 1 ? 940 : 840;
  const room = step >= 1 ? "40 ms" : "50 ms";
  if (step >= 1) {
    parts.push(rect(740, 165, 200, 130, "none", ` stroke="${c.yellow}" stroke-width="5"`));
    parts.push(d.label(840, 0, "window 20 ms", { anchor: "middle", centerY: 355, color: c.yellow }));
  }
  parts.push(circle(840, 230, 16, c.yellow));
  parts.push(
    d.arrow(left, 440, 345, 440, { color: c.white }),
    d.arrow(right, 440, 1335, 440, { color: c.white }),
    d.label((left + 340) / 2, 0, room, { anchor: "middle", centerY: 490, size: 48 }),
    d.label((right + 1340) / 2, 0, room, { anchor: "middle", centerY: 490, size: 48 }));
  put("fig-room", d.svg(1680, 560, ...parts));
}

/* ---- the same clocks at two rates -----------------------------------------------
 * One unit per ms: a symbol at one per second is 1000 wide, at ten per second
 * 100 wide, both from x 340. The room is the half to the right of the middle;
 * the clock error grows by 5 ms per second (0.5 %), so the time until it is
 * used up is the room divided by 5 ms. */
function drawTwoRates(slide, step) {
  const c = d.colors();
  const row = (y, label, len, calc) => [
    d.label(300, 0, label, { anchor: "end", centerY: y + 40, color: c.light }),
    d.box(340, y, len, 80, "", { border: c.light }),
    circle(340 + len / 2, y + 40, 10, c.yellow),
    d.arrow(340 + len / 2, y + 120, 340 + len - 4, y + 120, { color: c.white }),
    d.label(340 + len + 30, 0, `room ${len / 2} ms`, { centerY: y + 120, color: c.white }),
    d.label(340, 0, calc, { centerY: y + 190, size: 48 }),
  ];
  const parts = [...row(40, "1 per second", 1000, "500 ms ÷ 5 ms per second = 100 s")];
  if (step >= 1) parts.push(...row(330, "10 per second", 100, "50 ms ÷ 5 ms per second = 10 s"));
  put("fig-two-rates", d.svg(1680, 600, ...parts));
}

/* ---- how many choices does a change have? ---------------------------------------
 * Left, three colours on a triangle; right, four on a square (white light is
 * the fourth colour). The current colour, red, has a yellow ring (yellow: the
 * state now), and white arrows lead to every colour it may change to. */
function choiceArrows(from, targets, c) {
  return targets.map(([x, y]) => {
    const dx = x - from[0], dy = y - from[1], len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    return d.arrow(from[0] + ux * 80, from[1] + uy * 80, x - ux * 80, y - uy * 80, { color: c.white });
  });
}

function drawChoices(slide, step) {
  const c = d.colors();
  const tri = { red: [420, 110], green: [620, 410], blue: [220, 410] };
  const parts = [
    ...choiceArrows(tri.red, [tri.green, tri.blue], c),
    circle(...tri.red, 72, "none", ` stroke="${c.yellow}" stroke-width="6"`),
    ...Object.entries(tri).map(([n, [x, y]]) => circle(x, y, 58, light(c, n))),
    d.label(420, 0, "3 colors: 2 choices", { anchor: "middle", centerY: 540, size: 48 }),
  ];
  if (step >= 1) {
    const sq = { red: [1060, 110], green: [1400, 110], blue: [1400, 410], white: [1060, 410] };
    parts.push(
      ...choiceArrows(sq.red, [sq.green, sq.blue, sq.white], c),
      circle(...sq.red, 72, "none", ` stroke="${c.yellow}" stroke-width="6"`),
      ...Object.entries(sq).map(([n, [x, y]]) => circle(x, y, 58, n === "white" ? c.white : light(c, n))),
      d.label(1230, 0, "4 colors: 3 choices", { anchor: "middle", centerY: 540, size: 48 }));
  }
  if (step >= 2) parts.push(d.label(1230, 0, "two changes: 3 × 3 = 9 sequences", { anchor: "middle", centerY: 610, color: c.light }));
  put("fig-choices", d.svg(1680, 650, ...parts));
}

/* ---- real links -------------------------------------------------------------------
 * Every example slide has the same frame: the generated photo on the left
 * (560 square), on the right two gray lines saying what the thing is, and
 * below them a simplified picture of its signal from x 640 to 1640. Step 0
 * shows the signal, step 1 marks in yellow what keeps the receiver in step
 * (the marker or the change). */
function signalLine(points, c, color) {
  return `<polyline points="${points.map(([x, y]) => `${x},${y}`).join(" ")}" fill="none" stroke="${color || c.white}" stroke-width="5" stroke-linejoin="round"/>`;
}

const EXAMPLES = {
  "ex-uart": { photo: "img/serial.jpg", about: ["UART, the serial port: inside devices chips talk", "this way, and a receipt printer gets its bytes"],
    draw(step, c) {
      // idle, start, the eight bits of "S" (01010011, lowest bit first:
      // 1 1 0 0 1 0 1 0), stop, idle; cells 80 wide from x 640, high at 260
      const bits = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1];
      const x0 = 640, w = 80, hi = 260, lo = 380;
      const pts = [];
      bits.forEach((b, i) => { const y = b ? hi : lo; pts.push([x0 + i * w, y], [x0 + (i + 1) * w, y]); });
      const parts = [signalLine(pts, c)];
      bits.forEach((b, i) => parts.push(d.label(x0 + (i + 0.5) * w, 0, String(b), { anchor: "middle", centerY: 210, mono: true, color: i >= 2 && i < 10 ? c.white : c.gray })));
      parts.push(
        d.label(x0 + w / 2, 0, "idle", { anchor: "middle", centerY: 430, color: c.gray }),
        d.label(x0 + 1.5 * w, 0, "start", { anchor: "middle", centerY: 430, color: c.light }),
        d.label(x0 + 6 * w, 0, "letter S, lowest bit first", { anchor: "middle", centerY: 430, color: c.light, keepCase: true }),
        d.label(x0 + 10.5 * w, 0, "stop", { anchor: "middle", centerY: 430, color: c.light }),
        d.line(x0 + 2 * w, 405, x0 + 2 * w, 455, { color: c.gray, width: 2 }),
        d.line(x0 + 10 * w, 405, x0 + 10 * w, 455, { color: c.gray, width: 2 }),
        d.label(x0, 0, "high for 1, low for 0, each bit for an agreed time", { centerY: 495, color: c.light }),
        d.label(x0, 0, "one byte at a time: stop, rest, then a new start bit", { centerY: 545, color: c.light }));
      if (step >= 1) {
        parts.push(d.line(x0 + w, 220, x0 + w, 410, { color: c.yellow, width: 6 }));
        for (let i = 2; i < 10; i += 1) parts.push(circle(x0 + (i + 0.5) * w, bits[i] ? hi : lo, 9, c.yellow));
        parts.push(d.label(x0, 0, "the clock restarts at the start bit and reads each bit in its middle", { centerY: 600, color: c.yellow }));
      }
      return parts;
    } },
  "ex-dcf": { photo: "img/radio-clock.jpg", photoSize: 400, about: ["a radio clock sets itself from DCF77, a time", "signal sent from near Frankfurt"],
    draw(step, c) {
      // top: seconds 56 to 59 and 0, 1 of the signal, 160 wide from x 640;
      // the signal drops at the start of each second, briefly for 0 and
      // twice as long for 1 (not to scale), and not at all in second 59.
      // Bottom (step 2): the 59 bits sent from 10:09:00 on, announcing
      // 10:10 on Monday 2026-11-23 in central European time.
      const secs = [56, 57, 58, 59, 0, 1], bits = [0, 0, 1, null, 0, 0];
      const x0 = 640, w = 160, hi = 230, lo = 300;
      const pts = [[x0, hi]];
      secs.forEach((sec, i) => {
        const x = x0 + i * w;
        if (bits[i] !== null) { const len = bits[i] ? 60 : 30; pts.push([x, hi], [x, lo], [x + len, lo], [x + len, hi]); }
        pts.push([x + w, hi]);
      });
      const parts = [signalLine(pts, c)];
      secs.forEach((sec, i) => {
        parts.push(d.label(x0 + i * w + 10, 0, String(sec), { centerY: 340, mono: true, color: c.gray }));
        if (bits[i] !== null) parts.push(d.label(x0 + i * w + 15, 0, String(bits[i]), { anchor: "middle", centerY: 190, mono: true }));
      });
      parts.push(d.label(x0, 0, "one bit per second: a short dip is 0, a long one 1", { centerY: 385, color: c.light }));
      if (step >= 1) {
        parts.push(rect(x0 + 3 * w, 205, w, 115, "none", ` stroke="${c.yellow}" stroke-width="5"`));
        parts.push(d.label(x0, 0, "no dip in second 59: the next dip starts a minute", { centerY: 430, color: c.yellow }));
      }
      if (step >= 2) {
        const minute = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 to 14: start, weather and warnings
          0, 0, 0, 1, 0, 1,                            // 15 to 20: call, time zone (CET), leap second, start of time
          0, 0, 0, 0, 1, 0, 0, 1,                      // 21 to 28: minute 10, parity
          0, 0, 0, 0, 1, 0, 1,                         // 29 to 35: hour 10, parity
          1, 1, 0, 0, 0, 1,                            // 36 to 41: day 23
          1, 0, 0,                                     // 42 to 44: Monday
          1, 0, 0, 0, 1,                               // 45 to 49: month 11
          0, 1, 1, 0, 0, 1, 0, 0,                      // 50 to 57: year 26
          1,                                           // 58: parity of the date
        ];
        const bx = 40, bw = 27, by = 530;
        const focus = (i) => (i >= 21 && i <= 27) || (i >= 29 && i <= 34);
        minute.forEach((b, i) => {
          parts.push(rect(bx + i * bw + 1, by, bw - 2, 40, "none", ` stroke="${focus(i) ? c.yellow : c.gray}" stroke-width="2"`));
          parts.push(d.label(bx + i * bw + bw / 2, 0, String(b), { anchor: "middle", centerY: by + 20, size: 20, mono: true, color: focus(i) ? c.yellow : c.light }));
        });
        [0, 10, 40, 50].forEach((i) => parts.push(d.label(bx + i * bw + bw / 2, 0, "bit " + i, { anchor: i ? "middle" : "start", centerY: by - 20, size: 20, color: c.gray })));
        // the value of each bit of minute and hour: units 1 2 4 8, tens 10 20 40
        [[21, [1, 2, 4, 8, 10, 20, 40]], [29, [1, 2, 4, 8, 10, 20]]].forEach(([first, values]) =>
          values.forEach((v, k) => parts.push(d.label(bx + (first + k) * bw + bw / 2, 0, String(v), { anchor: "middle", centerY: by - 20 - (k % 2) * 24, size: 20, mono: true, color: c.yellow }))));
        const group = (a, b, text, color) => [
          d.line(bx + a * bw + 2, by + 52, bx + (b + 1) * bw - 2, by + 52, { color, width: 3 }),
          d.label(bx + ((a + b + 1) / 2) * bw, 0, text, { anchor: "middle", centerY: by + 82, color }),
        ];
        parts.push(...group(1, 20, "weather, time zone", c.gray), ...group(21, 27, "minute: 10", c.yellow),
          ...group(29, 34, "hour: 10", c.yellow), ...group(36, 57, "date: monday, 23 november 2026", c.gray));
      }
      return parts;
    } },
  "ex-manchester": { photo: "img/ethernet.jpg", about: ["ethernet: the network cable; 10BASE-T is its", "early form with 10 Mbit/s"],
    draw(step, c) {
      // Manchester code, bits 1 0 1 1 0 in cells 200 wide from x 640: low to
      // high in the middle for 1, high to low for 0, and an extra change at a
      // border between two equal bits. Dashed: bit borders. Below, the
      // receiver's readings, eight per bit; in step 1 the first reading after
      // each change in the middle turns yellow.
      const bits = [1, 0, 1, 1, 0], x0 = 640, w = 200, hi = 260, lo = 360;
      const pts = [];
      bits.forEach((b, i) => {
        const x = x0 + i * w, first = b ? lo : hi, second = b ? hi : lo;
        pts.push([x, first], [x + w / 2, first], [x + w / 2, second], [x + w, second]);
      });
      const parts = [signalLine(pts, c)];
      bits.forEach((b, i) => {
        parts.push(d.label(x0 + i * w + w / 2, 0, String(b), { anchor: "middle", centerY: 205, size: 48, mono: true, color: b ? c.yellow : c.white }));
        for (let k = 0; k < 8; k += 1) {
          const hit = step >= 1 && k === 4;
          parts.push(circle(x0 + i * w + (k + 0.5) * w / 8, 420, hit ? 9 : 5, hit ? c.yellow : c.gray));
        }
      });
      for (let i = 0; i <= bits.length; i += 1) parts.push(d.line(x0 + i * w, 240, x0 + i * w, 380, { color: c.gray, width: 2, dashed: true }));
      parts.push(d.label(x0, 0, "dashed: bit borders; dots: the receiver's readings", { centerY: 480, color: c.gray }));
      parts.push(d.label(x0, 0, "1: low to high in the middle, 0: high to low", { centerY: 530, color: c.light }));
      if (step >= 1) parts.push(d.label(x0, 0, "the first reading after the middle change resets the clock", { centerY: 580, color: c.yellow }));
      return parts;
    } },
  "ex-rc5": { photo: "img/remote.jpg", about: ["a TV remote control sends infrared light,", "14 bits per key press"],
    draw(step, c) {
      // the same code as light: for 1 the first half dark and the second lit,
      // for 0 the other way round; cells 200 wide from x 640. Dashed: bit
      // borders. Below, the TV's readings, eight per bit, the first after the
      // change in the middle yellow in step 1.
      const bits = [1, 1, 0, 1, 0], x0 = 640, w = 200;
      const parts = [d.box(x0, 260, 1000, 100, "", { border: c.gray })];
      bits.forEach((b, i) => {
        const x = x0 + i * w;
        parts.push(rect(b ? x + w / 2 : x, 262, w / 2, 96, c.light));
        parts.push(d.label(x + w / 2, 0, String(b), { anchor: "middle", centerY: 205, size: 48, mono: true, color: b ? c.yellow : c.white }));
        for (let k = 0; k < 8; k += 1) {
          const hit = step >= 1 && k === 4;
          parts.push(circle(x + (k + 0.5) * w / 8, 420, hit ? 9 : 5, hit ? c.yellow : c.gray));
        }
      });
      for (let i = 1; i < bits.length; i += 1) parts.push(d.line(x0 + i * w, 240, x0 + i * w, 380, { color: c.gray, width: 2, dashed: true }));
      parts.push(d.label(x0, 0, "dashed: bit borders; dots: the TV's readings", { centerY: 480, color: c.gray, keepCase: true }));
      parts.push(d.label(x0, 0, "1: dark, then light; 0: light, then dark", { centerY: 530, color: c.light }));
      if (step >= 1) parts.push(d.label(x0, 0, "the first reading after the middle change resets the clock", { centerY: 580, color: c.yellow }));
      return parts;
    } },
  "ex-usb": { photo: "img/usb.jpg", about: ["USB: the plug for keyboards, sticks and phones;", "every bit has a fixed length here too"],
    draw(step, c) {
      // NRZI: 0 changes the level, 1 keeps it. Top: 1 0 0 1 1 0, the rule.
      // Bottom, step 1: 0 1 1 1 1 1 1 1 0 runs flat for seven bits; step 2:
      // after six ones a 0 (yellow) is slipped in and forces a change.
      // Cells 100 wide from x 640.
      const row = (bits, y, stuffed) => {
        const x0 = 640, w = 100, hi = y, lo = y + 60;
        let level = hi;
        const pts = [[x0, level]];
        const parts = [];
        bits.forEach((b, i) => {
          const x = x0 + i * w;
          if (b === 0) { level = level === hi ? lo : hi; pts.push([x, level === hi ? lo : hi], [x, level]); }
          pts.push([x + w, level]);
          parts.push(d.label(x + w / 2, 0, String(b), { anchor: "middle", centerY: y - 35, mono: true, color: i === stuffed ? c.yellow : c.light }));
        });
        return [signalLine(pts, c), ...parts];
      };
      const parts = [
        ...row([1, 0, 0, 1, 1, 0], 210),
        d.label(640, 0, "0: the line changes, 1: it stays as it is", { centerY: 315, color: c.light }),
      ];
      if (step === 1) {
        parts.push(...row([0, 1, 1, 1, 1, 1, 1, 1, 0], 425));
        parts.push(d.label(640, 0, "seven ones: the line stays flat for seven bits", { centerY: 530, color: c.gray }));
      }
      if (step >= 2) {
        parts.push(...row([0, 1, 1, 1, 1, 1, 1, 0, 1, 0], 425, 7));
        parts.push(d.label(640, 0, "after six ones the sender slips in a 0", { centerY: 530, color: c.yellow }));
      }
      return parts;
    } },
};

EXAMPLES["ex-wheel"] = { photo: "img/scroll-wheel.jpg", about: ["a mouse wheel reports every notch with two", "sensors, A and B, each 0 or 1"],
  draw(step, c) {
    // the four states AB on a cycle, 00 01 11 10 clockwise; a step to the
    // next state clockwise is +1 notch, anticlockwise -1, and the state
    // across is never next. In step 1 an example of readings with the
    // notch each change means.
    const pos = { "00": [700, 190], "01": [960, 190], "11": [960, 370], "10": [700, 370] };
    const parts = [];
    for (const [st, [x, y]] of Object.entries(pos)) {
      parts.push(d.box(x, y, 120, 70, "", { border: c.gray }));
      parts.push(d.label(x + 60, 0, st, { anchor: "middle", centerY: y + 35, mono: true }));
    }
    parts.push(
      d.arrow(830, 225, 950, 225, { color: c.light }),
      d.arrow(1020, 270, 1020, 360, { color: c.light }),
      d.arrow(950, 405, 830, 405, { color: c.light }),
      d.arrow(760, 360, 760, 270, { color: c.light }),
      d.label(1130, 0, "clockwise: +1 notch", { centerY: 210, color: c.light }),
      d.label(1130, 0, "anticlockwise: −1", { centerY: 260, color: c.light }),
      d.label(1130, 0, "never across", { centerY: 310, color: c.gray }),
      d.label(1130, 0, "(00 to 11)", { centerY: 355, mono: true, color: c.gray }));
    if (step >= 1) {
      const seq = ["00", "01", "11", "01", "00", "10"], moves = ["+1", "+1", "−1", "−1", "−1"];
      seq.forEach((st, i) => parts.push(d.label(670 + i * 160, 0, st, { anchor: "middle", centerY: 500, mono: true })));
      moves.forEach((m, i) => parts.push(d.label(750 + i * 160, 0, m, { anchor: "middle", centerY: 550, mono: true, color: c.yellow })));
      parts.push(d.label(640, 0, "the speed of the hand does not matter", { centerY: 605, color: c.yellow }));
    }
    return parts;
  } };

function drawExample(slide, step) {
  const fig = slide.querySelector(".figure");
  const ex = EXAMPLES[fig.id];
  const c = d.colors();
  const parts = [
    `<image href="${ex.photo}" x="0" y="40" width="${ex.photoSize || 560}" height="${ex.photoSize || 560}" preserveAspectRatio="xMidYMid slice"/>`,
    ...ex.about.map((t, i) => d.label(640, 0, t, { centerY: 60 + i * 48, color: c.gray, keepCase: true })),
    ...ex.draw(step, c),
  ];
  put(fig.id, d.svg(1680, 640, ...parts));
}

/* ---- VGA, animated ------------------------------------------------------------
 * A picture of 10 x 6 pixels (cells 44 wide from x 660, y 160) fills row by
 * row. Below it, what travels over the cable: one small cell per pixel in the
 * order it is sent, and after every row a yellow sync pulse on its own wire;
 * after the last row a longer pulse on a second wire starts the next picture.
 * The pixel colours are the picture's colours: sky, sun, grass. */
(function () {
  if (!$("ex-vga")) return;
  const c = d.colors();
  const W = 10, H = 6, x0 = 660, y0 = 150, s = 44;
  const pic = [
    "bbbbbbbyyb",
    "bbbbbbbyyb",
    "bbbbbbbbbb",
    "bbbrrbbbbb",
    "ggrrrrgggg",
    "gggggggggg",
  ];
  const col = { b: c.blue, y: c.yellow, r: c.red, g: c.green };
  const parts = [
    `<image href="img/vga.jpg" x="0" y="40" width="560" height="560" preserveAspectRatio="xMidYMid slice"/>`,
    d.label(640, 0, "VGA: the classic cable between a computer", { centerY: 60, color: c.gray, keepCase: true }),
    d.label(640, 0, "and its monitor, sending one pixel after another", { centerY: 108, color: c.gray, keepCase: true }),
    rect(x0 - 4, y0 - 4, W * s + 8, H * s + 8, "none", ` stroke="${c.gray}" stroke-width="3"`),
    d.label(x0 + W * s + 40, 0, "the screen", { centerY: y0 + 30, color: c.gray }),
    d.label(640, 0, "over the cable: red, green, blue of each pixel, then a sync pulse", { centerY: 470, color: c.light }),
  ];
  // the cable: 60 pixel cells 14 wide and 6 pulses 18 wide, from x 640
  let tx = 640;
  const cells = [];
  for (let r = 0; r < H; r += 1) {
    for (let k = 0; k < W; k += 1) {
      parts.push(d.g(`p${r}-${k}`, rect(x0 + k * s, y0 + r * s, s - 2, s - 2, col[pic[r][k]])));
      parts.push(d.g(`t${r}-${k}`, rect(tx, 510, 13, 40, col[pic[r][k]])));
      cells.push([r, k]);
      tx += 14;
    }
    parts.push(d.g(`s${r}`, rect(tx + 2, 500, 10, 60, c.yellow)));
    tx += 18;
  }
  // the second wire: one pulse after the last line, for the next picture
  parts.push(d.line(640, 605, 1640, 605, { color: c.gray, width: 2 }));
  parts.push(d.g("frame", rect(tx + 2, 585, 26, 40, c.yellow)));
  parts.push(d.label(640, 0, "second wire", { centerY: 580, size: 20, color: c.gray }));
  parts.push(d.g("sync", d.label(x0 + W * s + 40, 0, "short pulse: next line", { centerY: y0 + 110, color: c.yellow }),
    d.label(x0 + W * s + 40, 0, "long pulse: next picture", { centerY: y0 + 160, color: c.yellow }),
    d.label(x0 + W * s + 40, 0, "each on its own wire", { centerY: y0 + 210, color: c.yellow })));
  put("ex-vga", d.svg(1680, 640, ...parts));
  const a = d.anim("ex-vga");
  const run = [];
  for (let r = 0; r < H; r += 1) {
    for (let k = 0; k < W; k += 1) run.push(a.par(a.show(`p${r}-${k}`, { dur: 70 }), a.show(`t${r}-${k}`, { dur: 70 })));
    run.push(a.show(`s${r}`, { dur: 200 }));
  }
  run.push(a.show("frame", { dur: 300 }));
  a.step(...run);
  a.step(a.show("sync"));
})();

/* ---- what 2 KiB look like ----------------------------------------------------------
 * The parrot photo at 128 x 128 pixels, shown 512 wide with sharp pixels.
 * Raw, three bytes per pixel, it would need 48 KiB; as the JPEG it is, 2,032
 * bytes, so it fits into 2 KiB. */
function drawKib(slide, step) {
  const c = d.colors();
  const parts = [
    `<image href="img/parrot.jpg" x="120" y="40" width="512" height="512" style="image-rendering: pixelated"/>`,
    d.label(760, 0, "128 × 128 pixels", { centerY: 130, size: 48 }),
    d.label(760, 0, "24-bit color: 3 bytes per pixel", { centerY: 210, color: c.light }),
  ];
  if (step >= 1) {
    parts.push(d.formula(760, 0, "128 · 128 · 3 = 49,152 bytes", { size: 48, centerY: 320 }));
    parts.push(d.label(760, 0, "= 48 KiB uncompressed", { centerY: 395, color: c.light, keepCase: true }));
  }
  if (step >= 2) {
    parts.push(d.label(760, 0, "as JPEG: 2,032 bytes", { centerY: 490, size: 48, color: c.yellow, keepCase: true }));
  }
  put("fig-kib", d.svg(1680, 600, ...parts));
}
