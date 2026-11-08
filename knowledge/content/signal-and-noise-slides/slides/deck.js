// Drawings and animations of "signal and noise", merged on 2026-11-08 from the
// decks "why 16 and not 4?" and "measuring and experimenting".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80); on slides with a
// punchline a figure is at most 660 high, otherwise it would be scaled down.
// Figures without an animation are drawn once when the deck loads, or redrawn
// per build-up step (data-on-show, data-on-step); animated ones are drawn once
// when the deck loads, and their segments are the build-up steps of the slide.
//
// All noise comes from generators with a fixed seed, so a figure looks the
// same in the talk, in the PDF and on every reload.
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

/* The symbol for a mean, x with a bar, at 32 in mono: the bar spans the x
 * (19.2 wide) and sits 14 above the centre line, just over the x-height. */
function xbar(x, cy, colour) {
  return d.label(x, 0, "x", { size: 32, mono: true, color: colour, centerY: cy }) +
    d.line(x + 1, cy - 15, x + 18, cy - 15, { color: colour, width: 3 });
}

// Bootstrap Icons "exclamation-triangle-fill" 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_WARNING = '<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>';

// A verdict box without a verdict yet, framed yellow with a warning sign where
// verdict() puts its check: the claim still needs a check of its own.
function caution(x, y, w, h, text, o = {}) {
  const c = d.colors();
  const size = 40, cy = y + h - 44;
  return d.verdict(x, y, w, h, text, null, { ...o, border: c.yellow }) +
    d.icon(x + w / 2 - size / 2, cy - size / 2, size, ICON_WARNING, { color: c.yellow });
}

/* ===================== part 1: what the numbers say ===================== */

window.drawSensor = function (_slide, step = 0) {
  const c = d.colors();
  const rows = [
    ["r", "203", 205],
    ["g", "41", 285],
    ["b", "57", 365],
    ["c", "310", 445],
  ];
  const count = step >= 1 ? 4 : 3;
  const wires = [];
  const labels = [];
  rows.slice(0, count).forEach(([name, value, y]) => {
    const color = name === "c" ? c.yellow : c.light;
    wires.push(d.arrow(615, y, 895, y, { color, width: name === "c" ? 4 : 2.5 }));
    labels.push(d.label(945, y + 11, `${name} = ${value}`, { size: 32, color, mono: true }));
  });
  const boxes = [d.box(235, 155, 380, 340, "sensor", { size: 48, border: c.light })];
  if (step >= 2) {
    labels.push(d.label(1210, 410, "clear", { size: 32, color: c.yellow, mono: true }));
    labels.push(d.label(1210, 460, "no colour filter", { size: 32, color: c.gray }));
    labels.push(d.label(1210, 510, "most sensitive", { size: 32, color: c.gray }));
  }
  return put("fig-sensor", d.svg(1680, 620, ...d.layers(wires, boxes, labels)));
};

/* --- sent is not measured ------------------------------------------------------
 * The light travels from what was sent to what arrives, and the four readings
 * count up there, so the numbers visibly come from the measurement and not
 * from the LED. The arriving box is 590 x 330 around y 320; four lines of 48
 * with 57.6 between them have their centres at 233.6 ... 406.4, which leaves
 * 54 above the first and below the last line. The longest line, "r = 203", is
 * 7 x 28.8 = 202 wide, so the names start at 1245 - 101 = 1144 and the values
 * end at 1346, right-aligned so that the counting digits stay in place.
 * Forward only: light running back into the LED would tell something wrong. */
(function () {
  if (!$("fig-sent-measured")) return;
  const c = d.colors();
  const values = [["r", 203], ["g", 41], ["b", 57], ["c", 310]];
  const lines = values.map(([name, value], k) => {
    const cy = 233.6 + k * 57.6;
    return d.label(1144, 0, name + " =", { size: 48, mono: true, centerY: cy }) +
      d.g("v-" + name, d.label(1346, 0, "0", { size: 48, mono: true, anchor: "end", centerY: cy }));
  });
  // the sent values in the same grid, three lines around y 320 in a box centred at 365
  const sent = [["r", 255], ["g", 0], ["b", 0]].map(([name, value], k) => {
    const cy = 262.4 + k * 57.6;
    return d.label(264, 0, name + " =", { size: 48, mono: true, centerY: cy }) +
      d.label(466, 0, String(value), { size: 48, mono: true, anchor: "end", centerY: cy });
  });
  $("fig-sent-measured").innerHTML = d.svg(1680, 620,
    d.label(365, 105, "what you send", { size: 32, color: c.gray, anchor: "middle" }),
    d.box(80, 155, 570, 330, "", { border: c.dark }),
    ...sent,
    d.g("light", d.arrow(700, 320, 900, 320, { color: c.gray, width: 3 })),
    d.g("arrive",
      d.label(1245, 105, "what arrives", { size: 32, color: c.gray, anchor: "middle" }),
      d.box(950, 155, 590, 330, "", { border: c.light }),
      ...lines),
    d.g("why", d.label(840, 565, "the filters overlap, distance dims the light, and the room shines in too", { size: 32, color: c.gray, anchor: "middle" })));
  const a = d.anim("fig-sent-measured");
  a.step(a.draw("light", { dur: 600 }), a.show("arrive", { dur: 300 }),
    a.par(...values.map(([name, value]) => a.count("v-" + name, value, { from: 0, dur: 1200 }))),
    a.show("why", { dur: 400 }));
})();

window.drawDark = function (_slide, step = 0) {
  const c = d.colors();
  const baseline = 515;
  const ambientY = 385;
  const parts = [
    d.line(180, baseline, 1470, baseline, { color: c.dark, width: 3 }),
    rect(330, ambientY, 260, baseline - ambientY, c.dark),
    d.line(210, ambientY, 1450, ambientY, { color: c.gray, width: 3, dashed: true }),
    d.label(460, 590, "LED off", { size: 32, color: c.gray, anchor: "middle", mono: true, keepCase: true }),
    d.label(1490, ambientY + 11, "ambient light", { size: 32, color: c.gray }),
  ];
  if (step >= 1) {
    parts.push(rect(900, 145, 260, baseline - 145, c.red));
    parts.push(d.label(1030, 590, "LED red", { size: 32, color: c.gray, anchor: "middle", mono: true, keepCase: true }));
  }
  if (step >= 2) {
    parts.push(d.line(1195, 155, 1195, ambientY - 10, { color: c.yellow, width: 4 }));
    parts.push(d.line(1178, 155, 1212, 155, { color: c.yellow, width: 4 }));
    parts.push(d.line(1178, ambientY - 10, 1212, ambientY - 10, { color: c.yellow, width: 4 }));
    parts.push(d.label(1245, 270, "what the LED adds", { size: 32, color: c.yellow, keepCase: true }));
  }
  if (step >= 3) {
    parts.push(d.label(840, 650, "reading = ambient + LED + noise", { size: 32, color: c.white, anchor: "middle", mono: true, keepCase: true }));
  }
  return put("fig-dark", d.svg(1680, 680, ...parts));
};

/* --- ten readings of one colour ---------------------------------------------------
 * The first reading is there from the start; the other nine arrive one after
 * the other (Nicolas, 2026-11-08: no yellow "current" on the newest, it read
 * as a meaning of its own). Then the same ten values land on a number line
 * with their spread, and last the mean appears as a line with its symbol.
 * The swatch is the theme's red standing for the light of the LED, so the
 * labels stay gray and white; the mean is blue as on the other slides that
 * point to a reference value. Values: 48 mono, three digits are 86 wide, 120
 * apart. Number line 440 to 1520 for the values 204 to 223; the mean 213.5
 * sits at x 980, between the tick labels 210 (781) and 215 (1065), so its
 * line can cross the label row. Forward only: readings do not leave. */
(function () {
  if (!$("fig-readings")) return;
  const c = d.colors();
  const values = [214, 211, 218, 209, 216, 213, 220, 207, 215, 212];
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const lo = 204, hi = 223, ax = 440, aw = 1080, ay = 400;
  const px = (v) => ax + ((v - lo) / (hi - lo)) * aw;
  const parts = [
    rect(120, 70, 200, 200, c.red, 10),
    d.label(220, 0, "LED red", { size: 32, color: c.gray, anchor: "middle", centerY: 310, keepCase: true }),
    d.label(220, 0, "ten readings", { size: 32, color: c.gray, anchor: "middle", centerY: 355 }),
    d.label(440, 0, "what the sensor reports", { size: 32, color: c.gray, centerY: 85 }),
  ];
  values.forEach((v, i) => {
    const text = d.label(440 + i * 120, 0, String(v), { size: 48, mono: true, color: c.white, centerY: 170 });
    parts.push(i === 0 ? text : d.g("v" + i, text));
  });
  const axis = [d.line(ax, ay, ax + aw, ay, { color: c.dark, width: 2 })];
  [205, 210, 215, 220].forEach((v) => {
    axis.push(d.line(px(v), ay - 8, px(v), ay + 8, { color: c.dark, width: 2 }));
    axis.push(d.label(px(v), 0, String(v), { size: 32, mono: true, color: c.gray, anchor: "middle", centerY: ay - 45 }));
  });
  parts.push(d.g("axis", ...axis));
  values.forEach((v, i) => parts.push(d.g("p" + i, circle(px(v), ay, 10, c.light))));
  const a0 = px(Math.min(...values)), b0 = px(Math.max(...values));
  parts.push(d.g("spread",
    bracket(a0, b0, ay + 40, c.light),
    d.label((a0 + b0) / 2, 0, "spread: 207 to 220", { size: 32, color: c.white, anchor: "middle", centerY: ay + 100 })));
  const mx = px(mean);
  parts.push(d.g("mean",
    d.line(mx, 250, mx, ay + 25, { color: c.blue, width: 4 }),
    xbar(mx + 20, 262, c.blue),
    d.label(mx + 54, 0, "= " + mean.toFixed(1), { size: 32, mono: true, color: c.blue, centerY: 262 })));
  $("fig-readings").innerHTML = d.svg(1680, 530, ...parts);
  const a = d.anim("fig-readings");
  a.step(...values.slice(1).map((_, k) => a.seq(a.show("v" + (k + 1), { dur: 200 }), a.wait(80))));
  a.step(a.show("axis", { dur: 400 }), a.seq(...values.map((_, i) => a.show("p" + i, { dur: 120 }))), a.show("spread", { dur: 400 }));
  a.step(a.show("mean", { dur: 400 }));
})();

/* --- five readings, one mean ---------------------------------------------------------
 * Twenty readings of the same colour in four groups of five. A yellow copy of
 * each group (yellow: the group being averaged right now) travels down and
 * meets at the mean of its five, where one white dot stays. The first group
 * runs slowly, the other three faster; then brackets compare the spread of
 * the single readings with the spread of the means. Same scale for both rows:
 * values 205 to 222 on x 420 to 1500. Single readings jitter up and down by 22
 * so that equal values stay visible; the means do not need it. Forward only:
 * a mean does not split back into its readings. */
(function () {
  if (!$("fig-spread")) return;
  const c = d.colors();
  const groups = [[214, 211, 218, 209, 210], [213, 220, 207, 215, 218],
    [217, 210, 214, 208, 216], [211, 219, 216, 212, 218]];
  const lo = 205, hi = 222, ax = 420, aw = 1080, yt = 190, yb = 430;
  const px = (v) => ax + ((v - lo) / (hi - lo)) * aw;
  const means = groups.map((g) => g.reduce((sum, v) => sum + v, 0) / g.length);
  const all = groups.flat();
  const jitter = (i) => ((i % 3) - 1) * 22;
  const parts = [
    d.label(ax - 40, 0, "single readings", { size: 32, color: c.gray, anchor: "end", centerY: yt }),
    d.label(ax - 40, 0, "means of five", { size: 32, color: c.gray, anchor: "end", centerY: yb }),
    d.line(ax, yt, ax + aw, yt, { color: c.dark, width: 2 }),
    d.line(ax, yb, ax + aw, yb, { color: c.dark, width: 2 }),
  ];
  all.forEach((v, i) => parts.push(circle(px(v), yt + jitter(i), 10, c.light)));
  groups.forEach((g, k) => {
    const ghosts = g.map((v, j) => d.g(`gh${k}-${j}`, circle(px(v), yt + jitter(k * 5 + j), 10, c.yellow)));
    parts.push(d.g("gh" + k, ...ghosts));
    parts.push(d.g("m" + k, circle(px(means[k]), yb, 12, c.white)));
  });
  const t0 = px(Math.min(...all)), t1 = px(Math.max(...all));
  const m0 = px(Math.min(...means)), m1 = px(Math.max(...means));
  const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
  parts.push(d.g("brackets",
    bracket(t0, t1, yt + 50, c.light),
    d.label((t0 + t1) / 2, 0, `${fmt(Math.min(...all))} to ${fmt(Math.max(...all))}`, { size: 32, mono: true, color: c.white, anchor: "middle", centerY: yt + 100 }),
    bracket(m0, m1, yb + 40, c.light),
    d.label((m0 + m1) / 2, 0, `${fmt(Math.min(...means))} to ${fmt(Math.max(...means))}`, { size: 32, mono: true, color: c.white, anchor: "middle", centerY: yb + 90 })));
  $("fig-spread").innerHTML = d.svg(1680, 560, ...parts);
  const a = d.anim("fig-spread");
  const merge = (k, slow) => a.seq(
    a.show("gh" + k, { dur: slow ? 400 : 200 }), a.wait(slow ? 250 : 80),
    a.par(...groups[k].map((v, j) => a.move(`gh${k}-${j}`, px(means[k]) - px(v), yb - yt - jitter(k * 5 + j), { dur: slow ? 1000 : 550 }))),
    a.par(a.hide("gh" + k, { dur: 200 }), a.show("m" + k, { dur: 200 })));
  a.step(merge(0, true));
  a.step(merge(1, false), merge(2, false), merge(3, false));
  a.step(a.show("brackets", { dur: 400 }));
})();

/* ===================== part 2: what decides your alphabet ===================== */

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
    parts.push(d.g("row" + k, ...frame, d.g("n" + k, d.label(x0 + width + 30, 0, "0 means", { size: 32, color: c.gray, centerY: mid }))));
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
        a.count("n" + k, count, { from: 0, dur: T, ease: "linear", suffix: " means" }),
        a.seq(...bars)),
      a.hide("now" + k, { dur: 200 }));
  });
})();

/* --- two symbols, two clouds, and their ratio -----------------------------------------
 * Two symbols at a fixed distance d (560 to 1120, boundary at 840). The clouds
 * start wide (half-width 520, reaching from x 40 to 1640), and the parts that
 * reach across the boundary are red: those readings land on the wrong side.
 * Then the clouds narrow to a half-width of 200, as they do with a longer
 * window or shielded light; seven widths cross-fade one into the next, the red
 * parts shrink and vanish below a half-width of 280, and the verdict changes.
 * back: "play", since clouds that widen again tell nothing wrong: faster
 * readings do exactly that.
 * The ratio slide that follows draws the same scene at the final width, so
 * that nothing moves between the two slides (Nicolas, 2026-11-08); only the
 * texts change there: d and s get their meaning, d/s appears on the left, and
 * the verdict line becomes the definition of "safely distinguishable".
 * Cloud base 430, peak 220 high; d bracket at 110; the s bracket at 510 spans
 * the whole cloud of symbol b. "distance between the symbols" (28 x 19.2 =
 * 538) runs from 870 to 1408, "spread of the readings" (22 x 19.2 = 422) from
 * 1150 to 1572; "d/s" at 80 mono is 144 wide around x 180, left of cloud a. */
const CLOUDS = { base: 430, peak: 220, ma: 560, mb: 1120, boundary: 840, widths: [520, 467, 413, 360, 307, 253, 200] };

function cloudScene(w, c) {
  const { base, peak, ma, mb, boundary } = CLOUDS;
  const g = [cloud(ma, w, peak, base, c.light), cloud(mb, w, peak, base, c.light)];
  if (w > boundary - ma) {
    g.push(cloud(ma, w, peak, base, c.red, 0.9, (boundary - ma) / w, 1));
    g.push(cloud(mb, w, peak, base, c.red, 0.9, -1, (boundary - mb) / w));
  }
  g.push(d.line(mb - w, 510, mb + w, 510, { color: c.yellow, width: 3 }),
    d.line(mb - w, 502, mb - w, 518, { color: c.yellow, width: 3 }),
    d.line(mb + w, 502, mb + w, 518, { color: c.yellow, width: 3 }));
  return g;
}

function cloudFrame(c) {
  const { base, ma, mb, boundary } = CLOUDS;
  return [
    d.line(30, base, 1650, base, { color: c.dark, width: 2 }),
    d.line(boundary, 185, boundary, base, { color: c.gray, width: 2, dashed: true }),
    d.label(boundary, 0, "boundary", { size: 32, color: c.gray, anchor: "middle", centerY: 160 }),
    d.line(ma, 110, mb, 110, { color: c.yellow, width: 3 }),
    d.line(ma, 102, ma, 118, { color: c.yellow, width: 3 }),
    d.line(mb, 102, mb, 118, { color: c.yellow, width: 3 }),
    d.label(boundary, 0, "d", { size: 32, mono: true, color: c.yellow, anchor: "middle", centerY: 75 }),
    d.label(ma, 0, "symbol a", { size: 32, color: c.gray, anchor: "middle", centerY: 470 }),
    d.label(mb, 0, "symbol b", { size: 32, color: c.gray, anchor: "middle", centerY: 470 }),
    d.label(mb, 0, "s", { size: 32, mono: true, color: c.yellow, anchor: "middle", centerY: 550 }),
  ];
}

const goodLine = (c) => d.label(CLOUDS.boundary, 0, "every reading lands on its own side", { size: 32, color: c.green, anchor: "middle", centerY: 615 });

(function () {
  if (!$("fig-two-clouds")) return;
  const c = d.colors();
  const { widths, boundary } = CLOUDS;
  const parts = cloudFrame(c);
  widths.forEach((w, j) => parts.push(d.g("w" + j, ...cloudScene(w, c))));
  parts.push(
    d.g("bad", d.label(boundary, 0, "some readings land on the wrong side", { size: 32, color: c.red, anchor: "middle", centerY: 615 })),
    d.g("good", goodLine(c)));
  $("fig-two-clouds").innerHTML = d.svg(1680, 650, ...parts);
  const a = d.anim("fig-two-clouds", { back: "play" });
  a.step(...widths.slice(1).map((_, j) => a.swap("w" + j, "w" + (j + 1), { dur: 380, ease: "linear" })),
    a.swap("bad", "good", { dur: 300 }));
})();

(function () {
  if (!$("fig-ratio")) return;
  const c = d.colors();
  const { widths, boundary, mb } = CLOUDS;
  const parts = [...cloudFrame(c), ...cloudScene(widths[widths.length - 1], c),
    d.g("good", goodLine(c)),
    d.g("def", d.label(boundary, 0, "safely distinguishable: a gap between the clouds, not a touch", { size: 32, color: c.white, anchor: "middle", centerY: 615 })),
    d.g("legend",
      d.label(boundary + 30, 0, "distance between the symbols", { size: 32, color: c.gray, centerY: 75 }),
      d.label(mb + 30, 0, "spread of the readings", { size: 32, color: c.gray, centerY: 550 }),
      d.formula(180, 0, "d/s", { size: 80, color: c.yellow, anchor: "middle", centerY: 290 }),
      d.label(180, 0, "the ratio", { size: 32, color: c.gray, anchor: "middle", centerY: 370 }))];
  $("fig-ratio").innerHTML = d.svg(1680, 650, ...parts);
  const a = d.anim("fig-ratio", { back: "play" });
  a.step(a.swap("good", "def", { dur: 400 }), a.show("legend", { dur: 400 }));
})();

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
  // the left column stands from the start, so the first frame is not an
  // empty axis (Nicolas, 2026-11-08); the right one builds band by band
  const { key, n } = columns[1];
  a.step(a.show("t" + key, { dur: 300 }),
    a.seq(...Array.from({ length: n }, (_, i) => a.show(`${key}${i}`, { dur: 2200 / n }))),
    a.show("s" + key, { dur: 400 }));
})();

/* --- calibrate, then classify ----------------------------------------------------
 * The red and blue dots stand for real colours, so the labels are gray and
 * white. Yellow marks the distance that wins: an exception to that rule,
 * because yellow is none of the colours shown and means "current" here as
 * everywhere. A new reading arrives, both distances are drawn alike, then the
 * shorter one turns yellow and the reading takes the colour of its class.
 * back: "play", since showing, recolouring and hiding again tell nothing wrong
 * in reverse. */
(function () {
  if (!$("fig-calibration")) return;
  const c = d.colors();
  const x0 = 245, y0 = 570, xMax = 1490, yTop = 85;
  const px = (r) => x0 + (r / 255) * (xMax - x0);
  const py = (b) => y0 - (b / 255) * (y0 - yTop);
  const red = [[188, 50], [195, 62], [198, 58], [200, 55], [205, 70], [210, 48]];
  const blue = [[30, 195], [35, 210], [40, 215], [45, 220], [50, 205], [55, 198]];
  const nr = [170, 80];
  $("fig-calibration").innerHTML = d.svg(1680, 680,
    d.g("to-red", d.line(px(nr[0]), py(nr[1]), px(198), py(58), { color: c.dark, width: 4, dashed: true })),
    d.g("to-blue", d.line(px(nr[0]), py(nr[1]), px(45), py(210), { color: c.dark, width: 3, dashed: true })),
    d.arrow(x0, y0, xMax + 45, y0, { color: c.light, width: 3 }),
    d.arrow(x0, y0, x0, yTop - 35, { color: c.light, width: 3 }),
    d.label(xMax + 70, y0 + 11, "r", { size: 48, color: c.white, mono: true }),
    d.label(x0 - 22, yTop - 35, "b", { size: 48, color: c.white, mono: true, anchor: "end" }),
    d.label(1510, 125, "g is roughly constant here", { size: 32, color: c.gray, anchor: "end", mono: true }),
    ...red.map(([r, b]) => circle(px(r), py(b), 13, c.red)),
    ...blue.map(([r, b]) => circle(px(r), py(b), 13, c.blue)),
    d.label(1400, 430, "red references", { size: 32, color: c.gray, anchor: "middle" }),
    d.label(520, 175, "blue references", { size: 32, color: c.gray }),
    d.label(840, 645, "measure known colours many times", { size: 32, color: c.gray, anchor: "middle" }),
    d.g("new",
      d.g("new-dot", circle(px(nr[0]), py(nr[1]), 16, c.white)),
      d.label(px(nr[0]) - 40, py(nr[1]) + 12, "new: r=170  b=80", { size: 32, color: c.white, anchor: "end", mono: true })),
    d.g("wins", d.label(1230, 300, "nearest match wins", { size: 32, color: c.yellow, mono: true })));
  const a = d.anim("fig-calibration", { back: "play" });
  a.step(a.show("new", { dur: 500 }));
  a.step(a.par(a.show("to-red", { dur: 600 }), a.show("to-blue", { dur: 600 })));
  a.step(a.par(a.color("to-red", "yellow", { dur: 600 }), a.color("new-dot", "red", { part: "fill", dur: 600 }),
    a.show("wins", { dur: 600 })));
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
  // the short window stands from the start, so the first frame is not two
  // empty tracks (Nicolas, 2026-11-08); the long window's readings arrive
  a.step(a.seq(...sent.map((__, i) => a.show(`p1-${i}`, { dur: 75 }))), a.show("r1", { dur: 400 }));
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

/* ===================== part 3: build evidence ===================== */

window.drawAuthorities = function (_slide, step = 0) {
  const c = d.colors();
  const xs = [50, 610, 1170];
  const titles = ["it sounds right", "the assistant predicts it", "the series shows it"];
  const bodies = [
    "longer readings\ncollect more light",
    "double the\nintegration time",
    "41 / 50  →  47 / 50\nrecognised correctly",
  ];
  const visible = Math.min(2, step);
  const parts = [];
  for (let i = 0; i <= visible; i += 1) {
    parts.push(d.label(xs[i], 125, titles[i], { size: 32, color: c.gray }));
    const o = { size: 32, color: i === 2 ? c.white : c.light, mono: i > 0 };
    if (i < 2 && step >= 2) parts.push(caution(xs[i], 165, 460, 300, bodies[i], o));
    else parts.push(d.verdict(xs[i], 165, 460, 300, bodies[i], i === 2 ? true : null, { ...o, border: c.dark }));
    if (i === 2) parts.push(d.label(xs[i] + 230, 535, "evidence from your setup", { size: 32, color: c.green, anchor: "middle" }));
  }
  return put("fig-authorities", d.svg(1680, 640, ...parts));
};

/* --- question, prediction, measurement, decision -----------------------------
 * Four boxes 330 wide with 90 between them. An experiment runs through them in
 * this order, so each segment draws the arrow to the next box and moves the
 * white frame of "current" there; the box left behind turns gray. Forward only:
 * run backwards, the arrows would point the wrong way. */
(function () {
  if (!$("fig-experiment-loop")) return;
  const c = d.colors();
  const xs = [35, 455, 875, 1295];
  const names = ["question", "prediction", "measurement", "decision"];
  const bodies = [
    "does a longer window\nimprove recognition?",
    "recognition should\nimprove",
    "",
    "hypothesis\nsupported\nor refuted",
  ];
  // The measurement box compares the two windows of the question: names left,
  // values right-aligned, and what the numbers count underneath.
  const results = (x) => [
    d.label(x + 30, 0, "short", { size: 32, color: c.light, centerY: 258 }),
    d.label(x + 300, 0, "41 / 50", { size: 32, color: c.white, mono: true, anchor: "end", centerY: 258 }),
    d.label(x + 30, 0, "long", { size: 32, color: c.light, centerY: 313 }),
    d.label(x + 300, 0, "47 / 50", { size: 32, color: c.white, mono: true, anchor: "end", centerY: 313 }),
    d.label(x + 165, 0, "correct out of 50", { size: 20, color: c.gray, anchor: "middle", centerY: 372 }),
  ];
  const wires = [], boxes = [], labels = [];
  xs.forEach((x, i) => {
    if (i < 3) wires.push(d.g("w" + i, d.arrow(x + 330, 305, xs[i + 1], 305, { color: c.gray, width: 3 })));
    labels.push(d.g("n" + i, d.label(x + 165, 120, names[i], { size: 32, color: c.gray, anchor: "middle" })));
    const box = d.box(x, 190, 330, 230, bodies[i], { size: 32, color: c.white, border: c.white });
    boxes.push(d.g("b" + i, box, i === 2 ? results(x) : []));
  });
  $("fig-experiment-loop").innerHTML = d.svg(1680, 620, ...d.layers(wires, boxes, labels));
  const a = d.anim("fig-experiment-loop");
  for (let k = 1; k < 4; k += 1) {
    a.step(a.draw("w" + (k - 1), { dur: 500 }),
      a.par(a.show("b" + k, { dur: 400 }), a.show("n" + k, { dur: 400 }),
        a.color("b" + (k - 1), "gray-dark", { dur: 400 }),
        a.color("b" + (k - 1), "gray-light", { part: "text", dur: 400 })));
  }
})();

window.drawTeams = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [
    d.label(100, 105, "team a", { size: 32, color: c.gray }),
    d.label(890, 105, "team b", { size: 32, color: c.gray }),
  ];
  const a = "changed distance and\nintegration time\n\nrecognition improved";
  const b = "changed only distance\n\nrecognition improved";
  if (step >= 1) {
    parts.push(d.verdict(100, 155, 690, 300, a, false, { size: 32, color: c.light }));
    parts.push(d.verdict(890, 155, 690, 300, b, true, { size: 32, color: c.white }));
    parts.push(d.label(445, 545, "what caused it?", { size: 32, color: c.gray, anchor: "middle" }));
    parts.push(d.label(1235, 545, "distance", { size: 32, color: c.green, anchor: "middle", mono: true }));
  } else {
    parts.push(d.verdict(100, 155, 690, 300, a, null, { size: 32, color: c.light, border: c.dark }));
    parts.push(d.verdict(890, 155, 690, 300, b, null, { size: 32, color: c.white, border: c.light }));
  }
  return put("fig-teams", d.svg(1680, 620, ...parts));
};

window.drawSeries = function (_slide, step = 0) {
  const c = d.colors();
  const xs = [35, 590, 1145];
  const titles = ["before", "during", "after"];
  const bodies = [
    "write conditions\nwrite the expectation",
    "change one variable\ntake a control reading\nrepeat enough times",
    "keep every value\ncompare with expectation\nrecord the outcome",
  ];
  const visible = Math.min(2, step);
  const wires = [];
  for (let i = 0; i < visible; i += 1) wires.push(d.arrow(xs[i] + 500, 330, xs[i + 1] - 20, 330, { color: c.gray, width: 3 }));
  const boxes = [], labels = [];
  for (let i = 0; i <= visible; i += 1) {
    labels.push(d.label(xs[i] + 250, 125, titles[i], { size: 32, color: c.gray, anchor: "middle" }));
    boxes.push(d.box(xs[i], 175, 500, 330, bodies[i], { size: 32, border: i === visible ? c.white : c.dark, color: i === visible ? c.white : c.light }));
  }
  return put("fig-series", d.svg(1680, 620, ...d.layers(wires, boxes, labels)));
};

window.drawLuck = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [d.label(425, 570, "guessing succeeds about once in 32 attempts", { size: 32, color: c.gray, anchor: "middle" })];
  if (step >= 2) {
    parts.push(d.verdict(120, 100, 610, 390, "5 / 5", false, { size: 80, mono: true, color: c.light }));
    parts.push(d.verdict(950, 100, 610, 390, "50 / 50", true, { size: 80, mono: true, color: c.white }));
  } else {
    parts.push(d.verdict(120, 100, 610, 390, "5 / 5", null, { size: 80, mono: true, border: c.dark, color: c.light }));
    parts.push(d.verdict(950, 100, 610, 390, "50 / 50", null, { size: 80, mono: true, border: c.light, color: c.white }));
  }
  if (step >= 1) parts.push(d.label(1255, 570, "guessing: about 1 in 1,125,899,906,842,624", { size: 32, color: c.gray, anchor: "middle", mono: true }));
  if (step >= 2) parts.push(d.label(1255, 650, "evidence", { size: 32, color: c.green, anchor: "middle" }));
  return put("fig-luck", d.svg(1680, 680, ...parts));
};

window.drawAssistant = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [
    d.label(80, 80, "assistant suggestion", { size: 32, color: c.gray }),
    d.label(925, 80, "your measurement series", { size: 32, color: c.gray }),
  ];
  const suggestion = '"increase the gain —\nrecognition will improve"';
  const series = "gain ↑\nrecognition: 94% → 82%";
  if (step >= 2) {
    parts.push(d.verdict(80, 120, 700, 230, suggestion, false, { size: 32, color: c.light }));
    parts.push(d.verdict(925, 120, 675, 230, series, true, { size: 32, color: c.white, mono: true }));
  } else {
    parts.push(d.verdict(80, 120, 700, 230, suggestion, null, { size: 32, border: c.dark, color: c.light }));
    parts.push(d.verdict(925, 120, 675, 230, series, null, { size: 32, border: c.light, color: c.white, mono: true }));
  }
  if (step >= 1) {
    ["one variable", "enough repetitions", "control reading"].forEach((t, i) => {
      parts.push(d.label(960 + i * 215, 420, `✓ ${t}`, { size: 20, color: c.gray }));
    });
  }
  if (step >= 2) parts.push(d.label(1260, 475, "ground truth for your setup", { size: 32, color: c.green, anchor: "middle" }));
  if (step >= 3) {
    const y = 585, xs = [300, 735, 1170], names = ["suggestion", "measurement", "outcome"];
    parts.push(d.arrow(500, y, 625, y, { color: c.gray, width: 3 }));
    parts.push(d.arrow(935, y, 1060, y, { color: c.gray, width: 3 }));
    names.forEach((name, i) => parts.push(d.box(xs[i], y - 55, 200, 110, name, { size: 20, border: c.dark, mono: true })));
    parts.push(d.label(190, y - 12, "log of", { size: 32, color: c.yellow, anchor: "end", mono: true }));
    parts.push(d.label(190, y + 26, "mistakes", { size: 32, color: c.yellow, anchor: "end", mono: true }));
  }
  return put("fig-assistant", d.svg(1680, 670, ...parts));
};

if ($("fig-toolbox")) drawToolbox();
