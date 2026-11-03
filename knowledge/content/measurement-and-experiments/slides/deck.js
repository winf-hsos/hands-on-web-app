// Drawings and animations of "measuring and experimenting".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures without an
// animation are redrawn per build-up step (data-on-show, data-on-step);
// animated ones are drawn once when the deck loads.
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

function drawIpoMap() {
  const c = d.colors();
  const axis = 300;
  const wires = [
    d.arrow(315, axis, 585, axis, { color: c.gray, width: 3 }),
    d.arrow(1095, axis, 1365, axis, { color: c.gray, width: 3 }),
  ];
  const boxes = [d.box(585, 165, 510, 270, "classify()", { size: 48, mono: true, border: c.light })];
  const labels = [
    d.label(265, axis + 11, "light", { size: 32, color: c.gray, anchor: "end" }),
    d.label(1415, axis + 11, '"red"', { size: 32, color: c.gray, mono: true }),
    d.label(450, 510, "we zoom in here", { size: 32, color: c.blue, anchor: "middle" }),
    d.line(450, 475, 450, 350, { color: c.blue, width: 3 }),
  ];
  return put("fig-ipo-map", d.svg(1680, 600, ...d.layers(wires, boxes, labels)));
}

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

/* --- five readings, one after the other ---------------------------------------
 * The readings arrive in time, so they appear one by one, and yellow, the
 * colour of "current", moves to the newest; the first stands alone at the start
 * so the audience can predict the second. Forward only, readings do not leave. */
(function () {
  if (!$("fig-five-readings")) return;
  const c = d.colors();
  const vals = [198, 205, 201, 195, 206];
  $("fig-five-readings").innerHTML = d.svg(1680, 620,
    ...vals.map((v, i) => d.g("v" + i, d.label(260 + i * 290, 285, String(v), { size: 48, color: c.yellow, anchor: "middle", mono: true }))),
    d.g("same", d.label(840, 405, "same LED · same settings · five readings", { size: 32, color: c.gray, anchor: "middle", keepCase: true })),
    d.g("all", d.label(840, 535, "all of them are measurements", { size: 48, color: c.white, anchor: "middle" })));
  const a = d.anim("fig-five-readings");
  const next = (i) => a.par(a.show("v" + i, { dur: 400 }), a.color("v" + (i - 1), "white", { part: "text", dur: 400 }));
  a.step(next(1));
  a.step(next(2), a.wait(300), next(3), a.wait(300), next(4));
  a.step(a.show("same", { dur: 500 }));
  a.step(a.show("all", { dur: 500 }));
})();

/* --- how many readings per decision? ---------------------------------------------
 * Thirty symbols, sent alternately off (level 0.3) and on (0.7); the receiver
 * decides at the threshold 0.5. Every symbol is read ten times with noise of
 * 0.13 (a fixed sequence, seed 604, so every showing looks the same), and the
 * three tracks decide from the first reading, the mean of five and the mean of
 * ten. With this seed three single readings land on the wrong side and no mean
 * does. Tracks 1020 x 160 around y 110, 300, 490; a value v sits at
 * cy - (v - 0.5) x 260, clamped to 0.24 ... 0.76, so a dot of radius 9 stays
 * 3 inside its track. Dots from x 280 to 1240, 33.1 apart. The cost stands to
 * the right: "300 readings" is 12 x 19.2 = 230 wide from 1300. The dots arrive
 * in time order, so this runs forward only. */
(function () {
  if (!$("fig-decisions")) return;
  const c = d.colors();
  let seed = 604;
  const random = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const gauss = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
  const tracks = [[], [], []];
  for (let i = 0; i < 30; i += 1) {
    const level = i % 2 ? 0.7 : 0.3;
    const reads = Array.from({ length: 10 }, () => level + 0.13 * gauss());
    const mean = (n) => reads.slice(0, n).reduce((s, v) => s + v, 0) / n;
    [reads[0], mean(5), mean(10)].forEach((v, k) => tracks[k].push({ v, wrong: i % 2 ? v < 0.5 : v > 0.5 }));
  }
  const rows = [
    { cy: 110, name: "1 reading", cost: ["30 readings", "20 symbols/s"] },
    { cy: 300, name: "mean of 5", cost: ["150 readings", "4 symbols/s"] },
    { cy: 490, name: "mean of 10", cost: ["300 readings", "2 symbols/s"] },
  ];
  const parts = [];
  rows.forEach((row, k) => {
    parts.push(d.label(230, 0, row.name, { size: 32, color: c.gray, anchor: "end", centerY: row.cy }));
    parts.push(d.box(250, row.cy - 80, 1020, 160, "", { border: c.dark, rounded: false }));
    parts.push(d.line(252, row.cy, 1268, row.cy, { color: c.gray, width: 2, dashed: true }));
    tracks[k].forEach(({ v, wrong }, i) => {
      const y = row.cy - (Math.min(0.76, Math.max(0.24, v)) - 0.5) * 260;
      parts.push(d.g(`p${k}-${i}`, circle(280 + i * 960 / 29, y, 9, wrong ? c.red : c.light)));
    });
    parts.push(d.g("cost" + k,
      d.label(1300, 0, row.cost[0], { size: 32, color: c.white, centerY: row.cy - 22 }),
      d.label(1300, 0, row.cost[1], { size: 32, color: c.gray, centerY: row.cy + 22 })));
  });
  parts.push(d.label(840, 625, "a dot on the wrong side of the dashed threshold is a wrong decision", { size: 32, color: c.gray, anchor: "middle" }));
  $("fig-decisions").innerHTML = d.svg(1680, 650, ...parts);
  const a = d.anim("fig-decisions");
  const fill = (k) => a.seq(...tracks[k].map((_, i) => a.show(`p${k}-${i}`, { dur: 80 })));
  a.step(fill(0));
  a.step(a.par(fill(1), fill(2)));
  a.step(a.par(...rows.map((_, k) => a.show("cost" + k, { dur: 500 }))));
})();

window.drawSpread = function (_slide, step = 0) {
  const c = d.colors();
  const x0 = 210, w = 1250;
  const top = [0.08, 0.19, 0.25, 0.37, 0.44, 0.52, 0.61, 0.73, 0.82, 0.94];
  const bottom = [0.39, 0.43, 0.46, 0.48, 0.50, 0.52, 0.55, 0.57, 0.60, 0.62];
  const parts = [
    d.label(x0, 100, "individual readings", { size: 32, color: c.gray }),
    d.label(x0, 395, "averages of five", { size: 32, color: c.gray }),
    d.line(x0, 250, x0 + w, 250, { color: c.dark, width: 3 }),
    d.line(x0, 530, x0 + w, 530, { color: c.dark, width: 3 }),
  ];
  top.forEach((p, i) => parts.push(circle(x0 + p * w, 250 + ((i % 3) - 1) * 22, 10, c.light)));
  bottom.forEach((p, i) => parts.push(circle(x0 + p * w, 530 + ((i % 3) - 1) * 22, 10, c.light)));
  if (step >= 1) {
    parts.push(d.arrow(x0 + top[0] * w, 330, x0 + top[top.length - 1] * w, 330, { color: c.gray, width: 3, head: 12 }));
    parts.push(d.arrow(x0 + top[top.length - 1] * w, 330, x0 + top[0] * w, 330, { color: c.gray, width: 3, head: 12 }));
    parts.push(d.label(x0 + top[0] * w + 10, 315, "spread", { size: 32, color: c.gray }));
  }
  if (step >= 2) {
    const meanX = x0 + 0.51 * w;
    parts.push(d.line(meanX, 170, meanX, 590, { color: c.blue, width: 5 }));
    parts.push(d.label(meanX + 28, 160, "mean", { size: 32, color: c.blue }));
  }
  return put("fig-spread", d.svg(1680, 650, ...parts));
};

/* --- the knob: integration time ----------------------------------------------------
 * Every reading is a bar, and its width is its time window: the bars of a row
 * tile the same second. Long means wide and calm, short means narrow and
 * jittery. All three rows run through that second at the same time, behind a
 * yellow line for "now", and a bar appears when its window closes; so the
 * audience sees that the short windows deliver more readings in the same time.
 * Then the bars that leave the band which still reads correctly turn red.
 * Forward only, time does not run backwards. */
(function () {
  if (!$("fig-integration")) return;
  const c = d.colors();
  const rows = [
    { label: "few long readings", y: 80, offsets: [3, 9, -7, 5] },
    { label: "more, shorter readings", y: 285, offsets: [10, -12, 13, -8, 11, -13, 9, -11] },
    { label: "many short readings", y: 490, offsets: [14, -12, 15, -34, 10, 15, -13, 36, -10, 13, -15, 11] },
  ];
  const x = 75, w = 1230, h = 125, second = 3000;
  const bandY = 39, bandH = 47, barH = 12, gap = 8;
  const parts = [], outside = [];
  rows.forEach((row, r) => {
    const slot = w / row.offsets.length;
    parts.push(d.label(x, row.y - 18, row.label, { size: 32, color: c.gray }));
    parts.push(d.box(x, row.y, w, h, "", { border: c.dark, fill: c.bg, rounded: false }));
    parts.push(rect(x + 2, row.y + bandY, w - 4, bandH, c.dark));
    row.offsets.forEach((off, i) => {
      if (Math.abs(off) + barH / 2 > bandH / 2) outside.push(`bar${r}-${i}`);
      parts.push(d.g(`bar${r}-${i}`, rect(x + i * slot + gap / 2, row.y + bandY + bandH / 2 + off - barH / 2, slot - gap, barH, c.white)));
    });
  });
  // the horizontal axis is time: without it the three rows cannot be read
  const lastY = rows[2].y + h;
  parts.push(d.arrow(x, lastY + 45, x + w, lastY + 45, { color: c.dark, width: 2, head: 12 }));
  parts.push(d.arrow(x + w, lastY + 45, x, lastY + 45, { color: c.dark, width: 2, head: 12 }));
  parts.push(d.label(x + w / 2, lastY + 90, "one second", { size: 32, color: c.gray, anchor: "middle" }));
  parts.push(d.g("now", d.line(x + 2, rows[0].y - 6, x + 2, lastY + 6, { color: c.yellow, width: 4 })));
  parts.push(d.g("explain",
    d.label(1345, 340, "the band that still", { size: 32, color: c.gray }),
    d.label(1345, 390, "reads correctly", { size: 32, color: c.gray }),
    d.line(1330, 365, 1310, 365, { color: c.gray, width: 3 }),
    d.label(1345, 560, "these land in the", { size: 32, color: c.red }),
    d.label(1345, 610, "wrong colour", { size: 32, color: c.red })));
  $("fig-integration").innerHTML = d.svg(1680, lastY + 125, ...parts);
  const a = d.anim("fig-integration");
  a.step(a.par(a.move("now", w - 4, 0, { dur: second, ease: "linear" }),
    ...rows.map((row, r) => a.seq(...row.offsets.map((_, i) =>
      a.seq(a.wait(second / row.offsets.length - 100), a.show(`bar${r}-${i}`, { dur: 100 })))))));
  a.step(a.par(a.hide("now", { dur: 400 }), a.show("explain", { dur: 600 }),
    ...outside.map((name) => a.color(name, "red", { part: "fill", dur: 600 }))));
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

if ($("fig-ipo-map")) drawIpoMap();
