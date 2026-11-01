// Drawings and animations of "why 16 and not 4?" (signal and noise).
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80); on slides with a
// punchline a figure is at most 660 high, otherwise it would be scaled down.
// Static figures are drawn once when the deck loads; animated ones as well,
// and their segments are the build-up steps of the slide.
//
// All noise comes from generators with a fixed seed, so a figure looks the
// same in the talk, in the PDF and on every reload.
"use strict";

const d = window.draw;
const $ = (id) => document.getElementById(id);

function rect(x, y, w, h, fill, rx = 0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
}

function circle(x, y, r, fill) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}

/* Normally distributed noise (Box-Muller) from a linear congruential
 * generator with a fixed seed; the raw signal of the windows figure uses it,
 * as it did in the original deck. */
function noiseLcg(seed) {
  let s = seed >>> 0;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  return () => {
    const u = Math.max(r(), 1e-9), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

/* mulberry32 with Box-Muller, as in the measuring deck. */
function randomSource(seed) {
  const random = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const gauss = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
  return { random, gauss };
}

/* A cloud of readings as a bell curve, drawn as a filled path. `half` is the
 * half-width of the whole cloud (three standard deviations); `from` and `to`
 * cut out a piece (in multiples of half, -1 to 1), so exactly the part that
 * falls across the boundary can be coloured instead of the whole cloud. */
function cloud(mx, half, height, base, colour, opacity = 0.55, from = -1, to = 1) {
  const pts = [];
  const n = 64;
  for (let i = 0; i <= n; i += 1) {
    const f = from + (i / n) * (to - from);
    const t = f * 3;
    pts.push(`${(mx + f * half).toFixed(1)},${(base - height * Math.exp(-(t * t) / 2)).toFixed(1)}`);
  }
  return `<path d="M${(mx + from * half).toFixed(1)},${base} L${pts.join(" L")} L${(mx + to * half).toFixed(1)},${base} Z" ` +
    `fill="${colour}" fill-opacity="${opacity}" stroke="${colour}" stroke-width="2"/>`;
}

/* A bracket under a span, open towards the top: ticks 15 high. */
function bracket(x1, x2, y, colour) {
  return `<path d="M${x1},${y + 15} L${x1},${y} L${x2},${y} L${x2},${y + 15}" fill="none" stroke="${colour}" stroke-width="3"/>`;
}

/* --- ten readings of one colour ---------------------------------------------------
 * The readings arrive one after the other, so they appear in time, and yellow,
 * the colour of "current", moves to the newest. Then the same ten values land
 * on a number line, and the spread becomes visible.
 * The swatch is the theme's red standing for the light of the LED, as in the
 * measuring deck; next to a real colour the labels stay gray and white, and the
 * yellow of "current" is allowed because yellow is not the colour shown.
 * Values: 48 mono, three digits are 86 wide, 120 apart. Number line 440 to
 * 1520 for the values 204 to 223. Forward only: readings do not leave. */
(function () {
  if (!$("fig-readings")) return;
  const c = d.colors();
  const values = [214, 211, 218, 209, 216, 213, 220, 207, 215, 212];
  const lo = 204, hi = 223, ax = 440, aw = 1080, ay = 380;
  const px = (v) => ax + ((v - lo) / (hi - lo)) * aw;
  const parts = [
    rect(120, 70, 200, 200, c.red, 10),
    d.label(220, 0, "LED red", { size: 32, color: c.gray, anchor: "middle", centerY: 310, keepCase: true }),
    d.label(220, 0, "ten readings", { size: 32, color: c.gray, anchor: "middle", centerY: 355 }),
    d.label(440, 0, "what the sensor reports", { size: 32, color: c.gray, centerY: 85 }),
  ];
  values.forEach((v, i) => {
    parts.push(d.g("v" + i, d.label(440 + i * 120, 0, String(v), { size: 48, mono: true, color: c.yellow, centerY: 170 })));
  });
  const axis = [d.line(ax, ay, ax + aw, ay, { color: c.dark, width: 2 })];
  [205, 210, 215, 220].forEach((v) => {
    axis.push(d.line(px(v), ay - 8, px(v), ay + 8, { color: c.dark, width: 2 }));
    axis.push(d.label(px(v), 0, String(v), { size: 32, mono: true, color: c.gray, anchor: "middle", centerY: ay - 40 }));
  });
  parts.push(d.g("axis", ...axis));
  values.forEach((v, i) => parts.push(d.g("p" + i, circle(px(v), ay, 10, c.light))));
  const a0 = px(Math.min(...values)), b0 = px(Math.max(...values));
  parts.push(d.g("spread",
    bracket(a0, b0, ay + 40, c.light),
    d.label((a0 + b0) / 2, 0, "spread: 207 to 220", { size: 32, color: c.white, anchor: "middle", centerY: ay + 110 })));
  $("fig-readings").innerHTML = d.svg(1680, 530, ...parts);
  const a = d.anim("fig-readings");
  const next = (i) => a.seq(a.par(a.show("v" + i, { dur: 200 }), a.color("v" + (i - 1), "white", { part: "text", dur: 200 })), a.wait(80));
  a.step(...values.slice(1).map((_, k) => next(k + 1)), a.color("v9", "white", { part: "text", dur: 200 }));
  a.step(a.show("axis", { dur: 400 }), a.seq(...values.map((_, i) => a.show("p" + i, { dur: 120 }))), a.show("spread", { dur: 400 }));
})();

/* --- the same signal, averaged over growing windows ---------------------------------
 * One raw signal of 288 readings (seed 20260907, as in the original figure);
 * below it the same signal averaged over windows of 4, 12 and 32 readings.
 * Averaging is a process in time, so each strip is computed while a yellow
 * line for "now" runs through the same stretch of time, and a bar appears
 * when its window closes: the longer the window, the fewer bars arrive, and
 * the counter on the right counts them. Strips 90 high, 60 apart, from y 40;
 * a value v sits at the dashed level minus v x 15, clamped to 43 so the raw
 * line stays in its strip. "288 readings" at 32 is 12 x 19.2 = 230 wide from
 * x 1410, so it ends at 1640. Forward only: time does not run backwards. */
(function () {
  if (!$("fig-windows")) return;
  const c = d.colors();
  const n = noiseLcg(20260907);
  const raw = Array.from({ length: 288 }, () => n());
  const x0 = 300, width = 1080, top = 40, height = 90, gap = 60, T = 2200;
  const yOf = (mid, v) => mid - Math.max(-43, Math.min(43, v * 15));
  const rows = [["raw signal", 1], ["mean of 4", 4], ["mean of 12", 12], ["mean of 32", 32]];
  const parts = [];
  rows.forEach(([name, win], k) => {
    const y = top + k * (height + gap), mid = y + height / 2;
    const frame = [
      d.label(x0 - 40, 0, name, { size: 32, color: c.gray, anchor: "end", centerY: mid }),
      d.line(x0, mid, x0 + width, mid, { color: c.dark, width: 2, dashed: true }),
    ];
    if (win === 1) {
      const pts = raw.map((v, i) => `${(x0 + (i / (raw.length - 1)) * width).toFixed(1)},${yOf(mid, v).toFixed(1)}`).join(" ");
      parts.push(...frame, `<polyline points="${pts}" fill="none" stroke="${c.light}" stroke-width="2"/>`,
        d.label(x0 + width + 30, 0, "288 readings", { size: 32, color: c.gray, centerY: mid }));
      return;
    }
    parts.push(d.g("row" + k, ...frame, d.g("n" + k, d.label(x0 + width + 30, 0, "0 readings", { size: 32, color: c.gray, centerY: mid }))));
    const count = Math.floor(raw.length / win), bw = width / count;
    for (let i = 0; i < count; i += 1) {
      const piece = raw.slice(i * win, (i + 1) * win);
      const m = piece.reduce((s, v) => s + v, 0) / piece.length;
      parts.push(d.g(`b${k}-${i}`, d.line(x0 + i * bw + 3, yOf(mid, m), x0 + (i + 1) * bw - 3, yOf(mid, m), { color: c.white, width: 6 })));
    }
    parts.push(d.g("now" + k, d.line(x0, y - 5, x0, y + height + 5, { color: c.yellow, width: 4 })));
  });
  $("fig-windows").innerHTML = d.svg(1680, 620, ...parts);
  const a = d.anim("fig-windows");
  rows.slice(1).forEach(([, win], j) => {
    const k = j + 1, count = Math.floor(raw.length / win), slot = T / count;
    const bars = Array.from({ length: count }, (_, i) => a.seq(a.wait(slot - 10), a.show(`b${k}-${i}`, { dur: 10 })));
    a.step(a.show("row" + k, { dur: 300 }), a.show("now" + k, { dur: 100 }),
      a.par(a.move("now" + k, width, 0, { dur: T, ease: "linear" }),
        a.count("n" + k, count, { from: 0, dur: T, ease: "linear", suffix: " readings" }),
        a.seq(...bars)),
      a.hide("now" + k, { dur: 200 }));
  });
})();

/* --- two symbols, two clouds, narrowing ------------------------------------------------
 * Two symbols at a fixed distance d (560 to 1120, boundary at 840). The clouds
 * start wide (half-width 520, reaching from x 40 to 1640), and the parts that reach across the boundary
 * are red: those readings land on the wrong side. Then the clouds narrow to a
 * half-width of 200, as they do with a longer window or shielded light; seven
 * widths cross-fade one into the next, the red parts shrink and vanish below
 * a half-width of 280, and the verdict changes. back: "play", since clouds
 * that widen again tell nothing wrong: faster readings do exactly that.
 * Cloud base 430, peak 220 high; d bracket at 110; the s bracket at 510 spans
 * the whole cloud of symbol b, like the brackets on the ratio slide. */
(function () {
  if (!$("fig-two-clouds")) return;
  const c = d.colors();
  const base = 430, peak = 220, ma = 560, mb = 1120, boundary = (ma + mb) / 2;
  const widths = [520, 467, 413, 360, 307, 253, 200];
  const parts = [
    d.line(30, base, 1650, base, { color: c.dark, width: 2 }),
    d.line(boundary, 185, boundary, base, { color: c.gray, width: 2, dashed: true }),
    d.label(boundary, 0, "boundary", { size: 32, color: c.gray, anchor: "middle", centerY: 160 }),
  ];
  widths.forEach((w, j) => {
    const g = [cloud(ma, w, peak, base, c.light), cloud(mb, w, peak, base, c.light)];
    if (w > boundary - ma) {
      g.push(cloud(ma, w, peak, base, c.red, 0.9, (boundary - ma) / w, 1));
      g.push(cloud(mb, w, peak, base, c.red, 0.9, -1, (boundary - mb) / w));
    }
    g.push(d.line(mb - w, 510, mb + w, 510, { color: c.yellow, width: 3 }),
      d.line(mb - w, 502, mb - w, 518, { color: c.yellow, width: 3 }),
      d.line(mb + w, 502, mb + w, 518, { color: c.yellow, width: 3 }));
    parts.push(d.g("w" + j, ...g));
  });
  parts.push(
    d.line(ma, 110, mb, 110, { color: c.yellow, width: 3 }),
    d.line(ma, 102, ma, 118, { color: c.yellow, width: 3 }),
    d.line(mb, 102, mb, 118, { color: c.yellow, width: 3 }),
    d.label(boundary, 0, "d", { size: 32, mono: true, color: c.yellow, anchor: "middle", centerY: 75 }),
    d.label(ma, 0, "symbol a", { size: 32, color: c.gray, anchor: "middle", centerY: 470 }),
    d.label(mb, 0, "symbol b", { size: 32, color: c.gray, anchor: "middle", centerY: 470 }),
    d.label(mb, 0, "s", { size: 32, mono: true, color: c.yellow, anchor: "middle", centerY: 550 }),
    d.g("bad", d.label(boundary, 0, "some readings land on the wrong side", { size: 32, color: c.red, anchor: "middle", centerY: 615 })),
    d.g("good", d.label(boundary, 0, "every reading lands on its own side", { size: 32, color: c.green, anchor: "middle", centerY: 615 })));
  $("fig-two-clouds").innerHTML = d.svg(1680, 650, ...parts);
  const a = d.anim("fig-two-clouds", { back: "play" });
  a.step(...widths.slice(1).map((_, j) => a.swap("w" + j, "w" + (j + 1), { dur: 380, ease: "linear" })),
    a.swap("bad", "good", { dur: 300 }));
})();

/* --- the ratio, and what "safely distinguishable" means ----------------------------- */
function drawRatio() {
  const c = d.colors();
  const base = 470, peak = 150, half = 90, ma = 560, mb = 1120;
  const parts = [
    d.formula(840, 0, "d/s", { size: 80, color: c.yellow, anchor: "middle", centerY: 75 }),
    d.label(600, 0, "d", { size: 32, mono: true, color: c.yellow, centerY: 165 }),
    d.label(680, 0, "distance between two symbols", { size: 32, color: c.light, centerY: 165 }),
    d.label(600, 0, "s", { size: 32, mono: true, color: c.yellow, centerY: 220 }),
    d.label(680, 0, "spread of your readings", { size: 32, color: c.light, centerY: 220 }),
    d.line(200, 275, 1480, 275, { color: c.dark, width: 2 }),
    d.line(300, base, 1380, base, { color: c.dark, width: 2 }),
    cloud(ma, half, peak, base, c.light),
    cloud(mb, half, peak, base, c.light),
  ];
  // The full extent of each cloud as a bracket, and the gap between them.
  // Bracket and letter look as on the slide before: spread is the same
  // quantity, so it carries the same sign.
  [ma, mb].forEach((m) => {
    parts.push(bracket(m - half, m + half, base + 30, c.yellow));
    parts.push(d.label(m, 0, "s", { size: 32, mono: true, color: c.yellow, anchor: "middle", centerY: base + 80 }));
  });
  parts.push(d.line(ma + half, base + 30, mb - half, base + 30, { color: c.dark, width: 2, dashed: true }));
  parts.push(d.label(840, 0, "a gap between them, not a touch: that is what safely distinguishable means",
    { size: 32, color: c.gray, anchor: "middle", centerY: 620 }));
  $("fig-ratio").innerHTML = d.svg(1680, 660, ...parts);
}

/* --- how many symbols fit? ------------------------------------------------------------
 * The usable range of the example, from the floor 40 to the ceiling 840, is
 * filled twice: with bands 200 wide (a cloud of plus or minus 100) and with
 * bands 50 wide (plus or minus 25). The bands stack up from the floor one
 * after the other, which is the calculation done by hand; then the division
 * appears under each column. Range y 90 to 530 (440 for 800 units), columns
 * 440 wide at x 520 and 1120. Left labels end at x 380; "ceiling" at 32 is
 * 134 wide and ends at 260, "840" (58 wide) ends at 380. "800 / 200 = 4" at
 * 48 mono is 13 x 28.8 = 374 wide, inside its column. Forward only. */
(function () {
  if (!$("fig-how-many")) return;
  const c = d.colors();
  const top = 90, bottom = 530, span = bottom - top, axisX = 400;
  const parts = [
    d.line(axisX, top, axisX, bottom, { color: c.dark, width: 2 }),
    d.line(axisX - 10, top, axisX + 10, top, { color: c.dark, width: 2 }),
    d.line(axisX - 10, bottom, axisX + 10, bottom, { color: c.dark, width: 2 }),
  ];
  [["ceiling", "840", top], ["range", "800", (top + bottom) / 2], ["floor", "40", bottom]].forEach(([word, value, y]) => {
    parts.push(d.label(260, 0, word, { size: 32, color: c.gray, anchor: "end", centerY: y }));
    parts.push(d.label(380, 0, value, { size: 32, mono: true, color: c.white, anchor: "end", centerY: y }));
  });
  const columns = [
    { key: "l", x: 520, n: 4, title: "bands 200 wide", sum: "800 / 200 = 4" },
    { key: "r", x: 1120, n: 16, title: "bands 50 wide", sum: "800 / 50 = 16" },
  ];
  columns.forEach(({ key, x, n, title, sum }) => {
    const bh = span / n;
    parts.push(d.g("t" + key, d.label(x + 220, 0, title, { size: 32, color: c.gray, anchor: "middle", centerY: 45 })));
    for (let i = 0; i < n; i += 1) {
      parts.push(d.g(`${key}${i}`, d.box(x, bottom - (i + 1) * bh + 3, 440, bh - 6, "", { border: c.light, rx: 4 })));
    }
    parts.push(d.g("s" + key, d.formula(x + 220, 0, sum, { size: 48, color: c.white, anchor: "middle", centerY: 600 })));
  });
  $("fig-how-many").innerHTML = d.svg(1680, 650, ...parts);
  const a = d.anim("fig-how-many");
  columns.forEach(({ key, n }) => {
    const each = Math.min(450, 2200 / n);
    a.step(a.show("t" + key, { dur: 300 }),
      a.seq(...Array.from({ length: n }, (_, i) => a.show(`${key}${i}`, { dur: each }))),
      a.show("s" + key, { dur: 400 }));
  });
})();

/* --- eight symbols, two window lengths ------------------------------------------------
 * What the Distinguishability Lab lets you play with, as a drawing: an alphabet
 * of eight symbols, 30 symbols sent, each read once. The short window has a
 * spread of 0.42 band widths, the window four times as long half of it (the
 * mean of four readings scatters half as much). Seed 21 gives six wrong
 * readings in the short window and none in the long one; the counts on the
 * right are computed from the data, not typed. Tracks 1000 x 200 at y 70 and
 * 370, eight bands of 25; a gray dash marks the level sent, the dot the
 * reading, red where it falls into another band. Results from x 1290:
 * "40 symbols/s" is 12 x 19.2 = 230 wide. The readings arrive in time, so
 * this runs forward only. */
(function () {
  if (!$("fig-lab")) return;
  const c = d.colors();
  const { random, gauss } = randomSource(21);
  const sent = [], noise = [];
  for (let i = 0; i < 30; i += 1) { sent.push(Math.floor(random() * 8)); noise.push(gauss()); }
  const tracks = [
    { y: 70, name: "short window", spread: 0.42, rate: "40 symbols/s" },
    { y: 370, name: "window four times as long", spread: 0.21, rate: "10 symbols/s" },
  ];
  const x = 250, w = 1000, h = 200, band = 25;
  const dotX = (i) => x + 35 + i * (w - 70) / 29;
  const parts = [];
  tracks.forEach((t, k) => {
    const levelY = (v) => t.y + h - (v + 0.5) * band;
    parts.push(d.label(x, 0, t.name, { size: 32, color: c.gray, centerY: t.y - 32 }));
    for (let b = 0; b < 8; b += 2) parts.push(`<rect x="${x + 2}" y="${t.y + h - (b + 1) * band}" width="${w - 4}" height="${band}" fill="${c.dark}" fill-opacity="0.45"/>`);
    parts.push(d.box(x, t.y, w, h, "", { border: c.dark, fill: "none", rounded: false }));
    let wrong = 0;
    sent.forEach((s, i) => {
      parts.push(d.line(dotX(i) - 12, levelY(s), dotX(i) + 12, levelY(s), { color: c.gray, width: 3 }));
      const v = s + t.spread * noise[i];
      const bad = Math.min(7, Math.max(0, Math.round(v))) !== s;
      if (bad) wrong += 1;
      const y = Math.min(t.y + h - 8, Math.max(t.y + 8, levelY(v)));
      parts.push(d.g(`p${k}-${i}`, circle(dotX(i), y, 7, bad ? c.red : c.white)));
    });
    parts.push(d.g("r" + k,
      d.label(1290, 0, `${wrong} of 30 wrong`, { size: 32, color: wrong ? c.red : c.green, centerY: t.y + 70 }),
      d.label(1290, 0, t.rate, { size: 32, color: c.gray, centerY: t.y + 130 })));
  });
  parts.push(d.label(840, 0, "a dot outside the band of its symbol is read as another symbol", { size: 32, color: c.gray, anchor: "middle", centerY: 625 }));
  $("fig-lab").innerHTML = d.svg(1680, 650, ...parts);
  const a = d.anim("fig-lab");
  tracks.forEach((_, k) => {
    a.step(a.seq(...sent.map((__, i) => a.show(`p${k}-${i}`, { dur: 75 }))), a.show("r" + k, { dur: 400 }));
  });
})();

/* --- the toolbox, with price tags ---------------------------------------------------------
 * Two columns of boxes 760 x 110, 130 apart from y 95; the tool in 32 at the
 * box's upper line (centre y + 38), its price in 20 below (centre y + 80):
 * text from y + 22 to y + 90, 22 above and 20 below. "longer integration
 * time" at 32 is 23 x 19.2 = 442 wide from x + 30. Three tools cost only
 * craft and are framed yellow. */
function drawToolbox() {
  const c = d.colors();
  const columns = [
    ["bigger d", [
      ["pick colours further apart", "fewer symbols fit into the range", false],
      ["use fewer symbols", "fewer bits per symbol", false],
      ["aim the light better", "only craft", true],
    ]],
    ["smaller s", [
      ["longer integration time", "fewer symbols per second", false],
      ["average several readings", "fewer symbols per second", false],
      ["block ambient light", "only craft", true],
      ["fix the geometry", "only craft", true],
    ]],
  ];
  const parts = [];
  columns.forEach(([head, rows], k) => {
    const x = 40 + k * 840;
    parts.push(d.label(x + 380, 0, head, { size: 48, mono: true, color: c.yellow, anchor: "middle", centerY: 45 }));
    rows.forEach(([tool, price, free], i) => {
      const y = 95 + i * 130;
      parts.push(d.box(x, y, 760, 110, "", { border: free ? c.yellow : c.dark, rx: 6 }));
      parts.push(d.label(x + 30, 0, tool, { size: 32, color: c.white, centerY: y + 38 }));
      parts.push(d.label(x + 30, 0, price, { size: 20, color: free ? c.yellow : c.gray, centerY: y + 80 }));
    });
  });
  parts.push(d.label(840, 0, "everything else is paid for in bits per symbol or symbols per second",
    { size: 32, color: c.gray, anchor: "middle", centerY: 630 }));
  $("fig-toolbox").innerHTML = d.svg(1680, 660, ...parts);
}

/* --- both roads lead to the same wall: one margin, two ways to spend it ------------------
 * "the bands get narrower" at 32 is 22 x 19.2 = 422 wide from x 220 and sits
 * below the box, so it may reach under it. */
function drawWall() {
  const c = d.colors();
  const bx = 620, bw = 440, by = 200, bh = 130;
  const wires = [
    d.arrow(220, by + bh / 2, bx, by + bh / 2, { color: c.light, width: 3 }),
    d.arrow(1460, by + bh / 2, bx + bw, by + bh / 2, { color: c.light, width: 3 }),
  ];
  const boxes = [d.box(bx, by, bw, bh, "the margin", { size: 48, border: c.yellow, color: c.yellow })];
  const labels = [
    d.label(220, 0, "more symbols", { size: 48, color: c.white, centerY: by - 50 }),
    d.label(220, 0, "the bands get narrower", { size: 32, color: c.gray, centerY: by + bh + 60 }),
    d.label(1460, 0, "faster symbols", { size: 48, color: c.white, anchor: "end", centerY: by - 50 }),
    d.label(1460, 0, "the clouds get wider", { size: 32, color: c.gray, anchor: "end", centerY: by + bh + 60 }),
  ];
  $("fig-wall").innerHTML = d.svg(1680, 460, ...d.layers(wires, boxes, labels));
}

if ($("fig-ratio")) drawRatio();
if ($("fig-toolbox")) drawToolbox();
if ($("fig-wall")) drawWall();
