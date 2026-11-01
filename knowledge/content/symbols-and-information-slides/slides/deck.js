// Drawings and animations of "what light means" (symbols and information).
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80); figures on a slide with
// a punchline stay at most 650 high, so the height does not shrink them.
// Figures without an animation are redrawn per build-up step (data-on-show,
// data-on-step); animated ones are drawn once when the deck loads.
"use strict";

const d = window.draw;
const $ = (id) => document.getElementById(id);
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; return svg; };

function field(x, y, w, h, fill, rx = 6) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
}

/* The four colours the LED really sends, from [colors.led] of the theme. They
 * show the subject, not a role, so they look the same in every palette, and a
 * drawing that shows them keeps its labels white and leaves the verdict to the
 * punchline (rule on real colours in docs/design-rules.md). */
const led = () => ({
  red: d.color("led-red"), green: d.color("led-green"),
  blue: d.color("led-blue"), yellow: d.color("led-yellow"),
});

/* --- perfect reception, perfect nonsense ----------------------------------------
 * The sender spells "team" with four colours; all four arrive, and the
 * receiver, whose table swaps red and yellow, reads "meat". */

window.drawNonsense = function (_slide, step = 0) {
  const c = d.colors();
  const l = led();
  const colours = [["red", l.red], ["green", l.green], ["blue", l.blue], ["yellow", l.yellow]];
  const sender = ["t", "e", "a", "m"];
  const receiver = ["m", "e", "a", "t"];
  const x0 = 120, row = 78, top = 120;
  const parts = [];

  const table = (x, title, mapping) => {
    parts.push(d.label(x, top - 40, title, { size: 32, color: c.gray }));
    colours.forEach(([name, col], i) => {
      const y = top + i * row;
      parts.push(field(x, y, 44, 44, col));
      parts.push(d.label(x + 70, 0, name, { size: 32, color: c.light, centerY: y + 22 }));
      parts.push(d.label(x + 250, 0, "→", { size: 32, color: c.gray, centerY: y + 22 }));
      parts.push(d.label(x + 320, 0, mapping[i], { size: 32, color: c.white, mono: true, centerY: y + 22 }));
    });
  };

  table(x0, "the sender's table", sender);
  if (step >= 1) table(x0 + 900, "the receiver's table", receiver);
  else parts.push(d.label(x0 + 900, top - 40, "the receiver's table", { size: 32, color: c.gray }));

  // the four colours sent, and what each side makes of them
  const y = top + 4 * row + 70;
  parts.push(d.label(x0, 0, "sent:", { size: 32, color: c.gray, centerY: y + 22 }));
  [l.red, l.green, l.blue, l.yellow].forEach((col, i) => parts.push(field(x0 + 130 + i * 64, y, 44, 44, col)));
  parts.push(d.label(x0 + 420, 0, "→  team", { size: 32, color: c.white, mono: true, centerY: y + 22 }));
  if (step >= 1) {
    parts.push(d.label(x0 + 900, 0, "read as:", { size: 32, color: c.gray, centerY: y + 22 }));
    parts.push(d.label(x0 + 1120, 0, "meat", { size: 32, color: c.white, mono: true, centerY: y + 22 }));
  }
  return put("fig-nonsense", d.svg(1680, y + 120, ...parts));
};

/* --- the guessing game, measured ---------------------------------------------------
 * One of 32 cards is wanted, here the 22nd. Above, the possibilities left as a
 * chain 32 → 16 → 8 → 4 → 2 → 1; below, the 32 cards in a row, and every
 * question darkens the half that is ruled out. Six boxes of 170 with 80 between
 * them are 1420 wide, from 130 to 1550; 32 cards of 40 with 6 between them are
 * 1466 wide, from 107 to 1573. Segment 1 asks the first question, segment 2
 * the four others, until one card is left and turns green. Forward only: a
 * search that runs backwards would un-ask its questions. */
(function () {
  if (!$("fig-halving")) return;
  const c = d.colors();
  const counts = [32, 16, 8, 4, 2, 1];
  const x0 = 130, w = 170, gap = 80, y = 70, h = 120;
  const target = 21;
  const cardX = (k) => 107 + k * 46;

  // which cards each question rules out: always the half without the target
  const ruledOut = [];
  let lo = 0, hi = 32;
  for (let q = 0; q < 5; q += 1) {
    const mid = (lo + hi) / 2;
    const out = [];
    if (target < mid) { for (let k = mid; k < hi; k += 1) out.push(k); hi = mid; }
    else { for (let k = lo; k < mid; k += 1) out.push(k); lo = mid; }
    ruledOut.push(out);
  }

  const wires = [], boxes = [], labels = [];
  labels.push(d.label(x0, 40, "possibilities left", { size: 20, color: c.gray }));
  counts.forEach((n, i) => {
    const x = x0 + i * (w + gap);
    const box = d.box(x, y, w, h, String(n), { size: 48, mono: true, border: c.white, color: c.white });
    boxes.push(d.g(`b${i}`, box));
    if (i > 0) wires.push(d.g(`a${i}`, d.arrow(x - gap, y + h / 2, x, y + h / 2, { color: c.gray, width: 3 })));
  });
  for (let k = 0; k < 32; k += 1) boxes.push(d.g(`c${k}`, field(cardX(k), 300, 40, 60, c.light, 4)));
  labels.push(d.label(cardX(0), 400, "32 cards, one of them is wanted", { size: 32, color: c.gray }));
  labels.push(d.g("caption", d.label(840, 500, "each yes-or-no question rules out half of what is left", { size: 32, color: c.gray, anchor: "middle" })));
  $("fig-halving").innerHTML = d.svg(1680, 540, ...d.layers(wires, boxes, labels));

  const a = d.anim("fig-halving");
  const ask = (q, dur) => a.seq(
    a.draw(`a${q + 1}`, { dur }),
    a.par(a.show(`b${q + 1}`, { dur }),
      a.color(`b${q}`, "gray-dark", { dur }), a.color(`b${q}`, "gray-light", { part: "text", dur }),
      ...ruledOut[q].map((k) => a.color(`c${k}`, "gray-dark", { part: "fill", dur }))));
  a.step(ask(0, 500), a.show("caption", { dur: 400 }));
  a.step(ask(1, 300), ask(2, 300), ask(3, 300), ask(4, 300), a.color(`c${target}`, "green", { part: "fill", dur: 400 }));
})();

/* --- the halving question against the lopsided one ----------------------------------- */

function drawQuestions() {
  const c = d.colors();
  const columns = [
    { x: 90, question: '"is it red?"', colour: c.green,
      rows: [["yes", "16 left"], ["no", "16 left"]], foot: "always exactly one halving" },
    { x: 900, question: '"is it the ace of spades?"', colour: c.red,
      rows: [["yes", "0 left, solved"], ["no", "31 left"]], foot: "almost always the second line" },
  ];
  const parts = [];
  columns.forEach(({ x, question, colour, rows, foot }) => {
    parts.push(d.label(x, 60, question, { size: 32, color: colour, mono: true }));
    parts.push(d.line(x, 90, x + 690, 90, { color: c.dark, width: 2 }));
    rows.forEach(([answer, rest], i) => {
      const y = 160 + i * 80;
      parts.push(d.label(x, y, answer, { size: 32, color: c.light, mono: true }));
      parts.push(d.label(x + 180, y, "→", { size: 32, color: c.gray }));
      parts.push(d.label(x + 260, y, rest, { size: 32, color: c.white }));
    });
    parts.push(d.label(x, 370, foot, { size: 32, color: c.gray }));
  });
  parts.push(d.line(830, 30, 830, 410, { color: c.dark, width: 2 }));
  return put("fig-questions", d.svg(1680, 450, ...parts));
}

/* --- what a question is worth on average ---------------------------------------------- */

function drawWorth() {
  const c = d.colors();
  const cols = [80, 620, 880, 1130, 1420];
  const head = ["question", "answer", "chance", "you learn", "on average"];
  const rows = [
    ['"is it red?"', "yes", "1/2", "1 bit", "1 bit", c.green],
    ["", "no", "1/2", "1 bit", "", c.green],
    ['"is it the ace of spades?"', "yes", "1/32", "5 bit", "0.2 bit", c.red],
    ["", "no", "31/32", "0.05 bit", "", c.red],
  ];
  const parts = [];
  head.forEach((t, j) => parts.push(d.label(cols[j], 60, t, { size: 20, color: c.gray })));
  parts.push(d.line(60, 90, 1620, 90, { color: c.dark, width: 2 }));
  rows.forEach((row, i) => {
    const y = 160 + i * 80;
    for (let j = 0; j < 5; j += 1) {
      if (!row[j]) continue;
      const colour = j === 0 || j === 4 ? row[5] : c.light;
      parts.push(d.label(cols[j], y, row[j], { size: 32, color: colour, mono: j > 0 }));
    }
    if (i === 1) parts.push(d.line(60, y + 40, 1620, y + 40, { color: c.dark, width: 2 }));
  });
  parts.push(d.label(80, 520, "a rare answer tells you a lot, while an expected answer tells you little",
    { size: 32, color: c.gray }));
  return put("fig-worth", d.svg(1680, 570, ...parts));
}

/* --- the expected value, in general ----------------------------------------------------
 * The two parts of the formula are explained in blue, the colour that refers. */

window.drawExpected = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [
    d.label(90, 40, "in words", { size: 20, color: c.gray }),
    d.label(90, 95, "how likely an answer is  ×  what that answer is worth,  added up", { size: 32, color: c.light }),
    d.label(90, 180, "in symbols", { size: 20, color: c.gray }),
    d.formula(90, 250, "E = Σ p_i · log_2(1/p_i)", { size: 48, color: c.white }),
    d.formula(90, 335, "p_i", { size: 32, color: c.blue }),
    d.label(560, 335, "how likely that answer is", { size: 32, color: c.gray }),
    d.formula(90, 395, "log_2(1/p_i)", { size: 32, color: c.blue }),
    d.label(560, 395, "what that answer is worth, in bits", { size: 32, color: c.gray }),
  ];
  if (step >= 1) {
    parts.push(d.label(90, 480, "the two questions, worked out", { size: 20, color: c.gray }));
    parts.push(d.formula(90, 540, "0.5 · 1 + 0.5 · 1 = 1 bit", { size: 32, color: c.green }));
    parts.push(d.formula(90, 600, "0.03 · 5 + 0.97 · 0.05 = 0.2 bit", { size: 32, color: c.red }));
  }
  return put("fig-expected", d.svg(1680, 640, ...parts));
};

/* --- one bit, and the two formulas -------------------------------------------------------
 * The 1 is yellow because yellow means 1. */

window.drawBit = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [
    d.box(200, 40, 260, 160, "0", { size: 80, mono: true, border: c.dark, color: c.light }),
    d.box(520, 40, 260, 160, "1", { size: 80, mono: true, border: c.yellow, color: c.yellow }),
    d.label(200, 270, "one bit = one decision between two equally likely possibilities", { size: 32, color: c.white }),
  ];
  if (step >= 1) {
    parts.push(d.formula(200, 390, "H = log_2(N)", { size: 48, color: c.white }));
    parts.push(d.label(660, 390, "uncertainty: how many halvings are still missing", { size: 32, color: c.gray }));
    parts.push(d.formula(200, 480, "I = H_1 - H_2", { size: 48, color: c.white }));
    parts.push(d.label(660, 480, "information: what an answer removed", { size: 32, color: c.gray }));
    parts.push(d.label(200, 570, "32 cards mean an uncertainty of 5 bits, and each halving removes 1 bit",
      { size: 32, color: c.light }));
  }
  return put("fig-bit", d.svg(1680, 610, ...parts));
};

/* --- what a bigger alphabet buys ---------------------------------------------------------- */

window.drawAlphabetBits = function (_slide, step = 0) {
  const c = d.colors();
  const rows = [
    { colours: 2, bits: 1, length: 1.0 },
    { colours: 4, bits: 2, length: 0.5 },
    { colours: 8, bits: 3, length: 1 / 3 },
    { colours: 16, bits: 4, length: 0.25 },
  ];
  const parts = [
    d.label(80, 60, "colours", { size: 20, color: c.gray }),
    d.label(330, 60, "bits per symbol", { size: 20, color: c.gray }),
  ];
  if (step >= 1) parts.push(d.label(700, 60, "time for the same file, at the same symbol rate", { size: 20, color: c.gray }));
  parts.push(d.line(60, 90, 1620, 90, { color: c.dark, width: 2 }));
  rows.forEach((r, i) => {
    const y = 150 + i * 110;
    parts.push(d.label(80, 0, String(r.colours), { size: 32, color: c.white, mono: true, centerY: y }));
    parts.push(d.formula(330, 0, `log_2(${r.colours}) = ${r.bits}`, { size: 32, color: c.light, centerY: y }));
    if (step >= 1) {
      const full = 820;
      parts.push(field(700, y - 26, full * r.length, 52, c.light, 4));
      parts.push(d.label(700 + full * r.length + 24, 0, `${Math.round(100 * r.length)} %`, { size: 32, color: c.gray, mono: true, centerY: y }));
    }
  });
  return put("fig-alphabet-bits", d.svg(1680, 600, ...parts));
};

/* --- two symbols are enough ---------------------------------------------------------------
 * Lit flashes are yellow, because yellow means 1. */

function drawGroups() {
  const c = d.colors();
  const patterns = ["10110", "00001", "11111", "01010"];
  const parts = [d.label(90, 60, "two symbols, five flashes per character", { size: 32, color: c.gray })];
  patterns.forEach((bits, r) => {
    const y = 120 + r * 96;
    bits.split("").forEach((b, i) => parts.push(field(90 + i * 96, y, 72, 72, b === "1" ? c.yellow : c.dark, 8)));
    parts.push(d.label(600, 0, bits, { size: 32, color: c.light, mono: true, centerY: y + 36 }));
  });
  parts.push(d.formula(860, 0, "2^5 = 32", { size: 80, color: c.white, centerY: 260 }));
  parts.push(d.label(860, 400, "32 combinations: room for a whole alphabet", { size: 32, color: c.gray }));
  return put("fig-groups", d.svg(1680, 540, ...parts));
}

/* --- when symbols are not equally likely -------------------------------------------------- */

function drawMorse() {
  const c = d.colors();
  const rows = [
    ["e", ".", "the most common letter", c.white],
    ["t", "-", "", c.light],
    ["q", "- - . -", "a rare letter", c.gray],
  ];
  const parts = [];
  rows.forEach(([letter, code, note, colour], i) => {
    const y = 100 + i * 150;
    parts.push(d.label(140, 0, letter, { size: 80, color: colour, mono: true, centerY: y }));
    // dots and dashes as shapes, so the length of each code is visible
    let x = 380;
    code.split(" ").forEach((z) => {
      if (z === ".") { parts.push(field(x, y - 14, 28, 28, colour, 14)); x += 60; }
      else { parts.push(field(x, y - 14, 88, 28, colour, 6)); x += 120; }
    });
    if (note) parts.push(d.label(900, 0, note, { size: 32, color: c.gray, centerY: y }));
  });
  parts.push(d.label(140, 545, "in real text, symbols are not equally likely", { size: 32, color: c.gray }));
  return put("fig-morse", d.svg(1680, 590, ...parts));
}

/* --- the catch ------------------------------------------------------------------------------
 * Two boxes of 700 x 344 with 100 between them, 90 to 1590. The longest line,
 * "the colours move closer together" (33 characters at 32), is 634 wide and
 * starts 50 inside its box, so it ends 16 short of the frame. Text block: the
 * title (48) is centred at 123, its top 99, 39 below the frame at 60; the last
 * line (32) is centred at 349, its bottom 365, 39 above the frame at 404. */

function drawCatch() {
  const c = d.colors();
  const parts = [
    d.box(90, 60, 700, 344, "", { border: c.dark, fill: "none" }),
    d.box(890, 60, 700, 344, "", { border: c.dark, fill: "none" }),
    d.label(140, 140, "the payoff", { size: 48, color: c.green }),
    d.label(940, 140, "the price", { size: 48, color: c.red }),
  ];
  [["more bits per symbol", "the same file needs fewer symbols", "and arrives sooner"],
   ["the colours move closer together", "noise reaches across the gap", "and symbols are read wrong"]]
    .forEach((lines, col) => lines.forEach((t, i) => {
      parts.push(d.label(140 + col * 800, 240 + i * 60, t, { size: 32, color: c.light }));
    }));
  return put("fig-catch", d.svg(1680, 460, ...parts));
}

/* --- start -------------------------------------------------------------------------------- */

if ($("fig-questions")) {
  drawQuestions();
  drawWorth();
  drawGroups();
  drawMorse();
  drawCatch();
}
