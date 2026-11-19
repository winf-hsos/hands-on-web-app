/* Drawings of the deck "word distributions" (2026-11-18).
 *
 * Font sizes 20, 32, 48 and 80 only. Lines first, then boxes, then labels.
 * Slides that build up redraw the same canvas on every step with a fixed
 * geometry, so nothing moves between steps. Every drawing is 1680 wide, the
 * width of the figure area, so 1 unit is 1 pixel on the 1920 canvas.
 *
 * Colours: pink (role "blue") is the context the slide points at, the word
 * a bag belongs to; yellow is the word drawn right now; light grey is the
 * rest of a distribution; dark grey what is not counted. Green and red do not
 * appear, because nothing here is judged by colour.
 *
 * All counts are computed here from the same 22 sentences as the experiment
 * (knowledge/media/datasets/farm_corpus.csv), so the slides cannot drift
 * from the data.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();
const put = (id, svg) => { if ($(id)) $(id).innerHTML = svg; };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* One line of text in several colours, as tspans that flow on, so the font
 * measures the words and not an estimate. parts: [[text, colour], ...];
 * centerY like d.label. */
function rich(x, cy, parts, o = {}) {
  const c = C();
  const size = o.size || 32;
  const family = (o.mono ? c.mono : c.font).replace(/"/g, "'");
  const spans = parts.map(([t, col]) => `<tspan fill="${col || c.white}">${esc(t)}</tspan>`).join("");
  return `<text x="${x}" y="${cy + size * 0.35}" text-anchor="${o.anchor || "start"}" font-family="${family}" font-size="${size}" ` +
    `style="white-space: pre"${o.keepCase ? ' class="keep-case"' : ""}>${spans}</text>`;
}
const mono = (x, cy, text, o = {}) => d.label(x, 0, text, { size: 32, mono: true, centerY: cy, ...o });
const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx === undefined ? 4 : o.rx}" fill="${fill}"` +
  `${o.opacity === undefined ? "" : ` fill-opacity="${o.opacity}"`}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.width || 2}"` : ""}` +
  `${o.dashed ? ' stroke-dasharray="8 6"' : ""}/>`;

/* ------------------------------------------------------------------ */
/* the corpus and its counts                                           */
/* ------------------------------------------------------------------ */
const CORPUS = [
  "the cow gives milk", "the sheep gives wool", "the hen lays eggs", "the bee makes honey",
  "the cow eats grass", "the sheep eats grass", "the hen eats grain", "the cow sleeps in the barn",
  "the sheep sleeps in the field", "the hen lays eggs in the nest", "the bee makes honey in the hive",
  "the bee lives in the hive", "the farmer milks the cow", "the farmer feeds the hen",
  "the farmer sells the milk", "the farmer sells the eggs", "the milk is white", "the honey is sweet",
  "the grass is green", "the wool is soft", "the cow is big", "the bee is small",
];
const TOKENS = CORPUS.map((s) => ["<s>", ...s.split(" "), "</s>"]);

// bags[word] = [[next, count], ...], most frequent first, ties in corpus order
const BAGS = (() => {
  const m = new Map();
  for (const t of TOKENS) for (let i = 0; i + 1 < t.length; i++) {
    if (!m.has(t[i])) m.set(t[i], new Map());
    const b = m.get(t[i]);
    b.set(t[i + 1], (b.get(t[i + 1]) || 0) + 1);
  }
  const out = {};
  for (const [w, b] of m) out[w] = [...b].sort((a, z) => z[1] - a[1]);
  return out;
})();
const total = (bag) => bag.reduce((s, [, n]) => s + n, 0);

/* ------------------------------------------------------------------ */
/* the question behind every language model: P(next | context)         */
/* ------------------------------------------------------------------ */
// "P(next | context)" in mono 80 is 17 characters of 48 = 816, from 432;
// "next" is centred on character 4 (624), "context" on 12.5 (1032). The
// next token is yellow, the context pink, as in the rest of the deck.
function figFormula(step) {
  const c = C();
  const parts = [
    rich(840, 150, [["P(", c.white], ["next", c.yellow], [" | ", c.gray], ["context", c.blue], [")", c.white]],
      { size: 80, mono: true, anchor: "middle", keepCase: true }),
    d.line(528, 240, 720, 240, { color: c.yellow, width: 4 }),
    d.line(864, 240, 1200, 240, { color: c.blue, width: 4 }),
    d.label(624, 0, "the next token", { size: 32, color: c.gray, anchor: "middle", centerY: 290 }),
    d.label(1032, 0, "everything before it", { size: 32, color: c.gray, anchor: "middle", centerY: 290 }),
  ];
  if (step >= 1) parts.push(
    d.label(840, 0, "a large language model computes exactly this,\nfor every possible next token, over and over", { size: 48, anchor: "middle", centerY: 490 }));
  return d.svg(1680, 600, ...parts);
}
function showFormula(slide, step) { put("fig-formula", figFormula(step)); }

/* ------------------------------------------------------------------ */
/* what comes next? the guess of the room and of a counting model      */
/* ------------------------------------------------------------------ */
// "the hen sleeps in the " is 22 characters in mono 80, 22 x 48 = 1056,
// plus a blank of 240: 1296 in all, so the sentence starts at 192.
function figGuess(step) {
  const c = C();
  const x0 = 192, blank = x0 + 22 * 48;
  const parts = [
    mono(x0, 160, "the hen sleeps in the", { size: 80 }),
    d.line(blank, 205, blank + 240, 205, { color: c.light, width: 3 }),
  ];
  // the two answers: labels right-aligned at 660, answers from 720
  if (step >= 1) parts.push(
    d.label(660, 0, "you", { size: 32, color: c.gray, anchor: "end", centerY: 370 }),
    mono(720, 370, "barn", { size: 48 }));
  if (step >= 2) parts.push(
    d.label(660, 0, "the training data", { size: 32, color: c.gray, anchor: "end", centerY: 480 }),
    mono(720, 480, "hive", { size: 48 }),
    // the reason: what followed "in the" in the 22 sentences
    rich(840, 620, [["in the", c.blue], [" → hive 2  ·  barn 1  ·  field 1  ·  nest 1", c.gray]],
      { size: 32, mono: true, anchor: "middle" }));
  return d.svg(1680, 700, ...parts);
}
function showGuess(slide, step) { put("fig-guess", figGuess(step)); }

/* ------------------------------------------------------------------ */
/* the naive idea: count what followed the context                     */
/* ------------------------------------------------------------------ */
// Context, counting and distribution as three frames in a row: 360 at 40,
// 600 at 540 and 360 at 1280, joined by arrows; the formula below.
function figCount() {
  const c = C();
  const bag = [["hive", 2], ["barn", 1], ["field", 1], ["nest", 1]];
  const n = total(bag);
  const parts = [
    d.arrow(410, 210, 530, 210, { color: c.gray, width: 3, head: 16 }),
    d.arrow(1150, 210, 1270, 210, { color: c.gray, width: 3, head: 16 }),
    rect(40, 90, 360, 240, "none", { stroke: c.blue, width: 3, rx: 16 }),
    rect(540, 90, 600, 240, "none", { stroke: c.light, width: 3, rx: 16 }),
    rect(1280, 90, 360, 240, "none", { stroke: c.light, width: 3, rx: 16 }),
    d.label(220, 0, "context", { size: 32, color: c.gray, anchor: "middle", centerY: 40 }),
    d.label(840, 0, "count", { size: 32, color: c.gray, anchor: "middle", centerY: 40 }),
    d.label(1460, 0, "next word", { size: 32, color: c.gray, anchor: "middle", centerY: 40 }),
    mono(220, 210, "in the", { size: 48, anchor: "middle", color: c.blue }),
    d.label(840, 0, "what followed it\nin the training data", { size: 32, anchor: "middle", centerY: 210 }),
  ];
  bag.forEach(([w, k], i) => {
    const cy = 144 + i * 44;
    parts.push(mono(1330, cy, w), mono(1590, cy, `${k}/${n}`, { anchor: "end" }));
  });
  parts.push(
    d.formula(840, 0, "P(next | context) = count(context, next) / count(context)", { size: 48, anchor: "middle", centerY: 470 }),
    d.label(840, 0, "the same conditional probability, estimated by counting", { size: 32, color: c.gray, anchor: "middle", centerY: 560 }));
  return d.svg(1680, 620, ...parts);
}

/* ------------------------------------------------------------------ */
/* the corpus: 22 sentences in two columns                             */
/* ------------------------------------------------------------------ */
// Mono 32 is 19.2 per character; the longest sentence, "the bee makes honey
// in the hive", has 31 characters, 595 wide, and a column has 840.
function figCorpus() {
  const c = C();
  const parts = [];
  CORPUS.forEach((s, i) => {
    const col = i < 11 ? 0 : 1, row = i % 11;
    const x = 60 + col * 840, cy = 40 + row * 58;
    parts.push(d.label(x + 50, 0, String(i + 1), { size: 32, color: c.gray, anchor: "end", centerY: cy }),
      mono(x + 80, cy, s, { color: c.light }));
  });
  return d.svg(1680, 660, ...parts);
}

/* ------------------------------------------------------------------ */
/* every sentence becomes tokens                                       */
/* ------------------------------------------------------------------ */
// Box width: characters x 28.8 (mono 48) + 60, at least 146. Six boxes and
// five gaps of 40 make 1192, so the row starts at 244.
function figTokens() {
  const c = C();
  const toks = ["<s>", "the", "cow", "gives", "milk", "</s>"];
  const widths = toks.map((t) => Math.max(146, Math.round(t.length * 28.8 + 60)));
  const row = widths.reduce((s, w) => s + w, 0) + 40 * 5;
  let x = (1680 - row) / 2;
  const boxes = [], labels = [];
  const centres = [];
  toks.forEach((t, i) => {
    const marker = i === 0 || i === toks.length - 1;
    boxes.push(d.box(x, 340, widths[i], 100, t, { size: 48, mono: true, border: marker ? c.blue : c.light, color: marker ? c.blue : c.white }));
    centres.push(x + widths[i] / 2);
    x += widths[i] + 40;
  });
  labels.push(
    d.label(centres[0], 0, "start", { size: 32, color: c.gray, anchor: "middle", centerY: 510 }),
    d.label((centres[1] + centres[4]) / 2, 0, "one token per word", { size: 32, color: c.gray, anchor: "middle", centerY: 510 }),
    d.label(centres[5], 0, "end", { size: 32, color: c.gray, anchor: "middle", centerY: 510 }));
  return d.svg(1680, 600,
    mono(840, 110, "the cow gives milk", { size: 48, anchor: "middle" }),
    d.arrow(840, 160, 840, 320, { color: c.gray, width: 3, head: 16 }),
    ...boxes, ...labels);
}

/* ------------------------------------------------------------------ */
/* no context: how often each word occurs                              */
/* ------------------------------------------------------------------ */
// Ten most frequent words of 104; 31 counts are 899 wide (29 per count).
// Step 0 shows the counts, step 1 the same rows as percentages, steps 2 and
// 3 what a model writes from them: drawn at random, or always the top word.
function figUnigram(step) {
  const c = C();
  const counts = new Map();
  for (const s of CORPUS) for (const w of s.split(" ")) counts.set(w, (counts.get(w) || 0) + 1);
  const all = [...counts].sort((a, z) => z[1] - a[1]);
  const n = all.reduce((s, [, k]) => s + k, 0);
  const parts = [];
  all.slice(0, 10).forEach(([w, k], i) => {
    const cy = 40 + i * 46, len = k * 29;
    parts.push(mono(300, cy, w, { anchor: "end", color: c.light }),
      rect(330, cy - 15, len, 30, c.light),
      mono(350 + len, cy, step >= 1 ? `${Math.round((k / n) * 100)} %` : String(k), { color: c.gray }));
  });
  parts.push(d.label(330, 0, `… and ${all.length - 10} more words, ${n} in all`, { size: 32, color: c.gray, centerY: 506 }));
  if (step >= 2) parts.push(
    d.label(560, 0, "drawn at random", { size: 32, color: c.gray, anchor: "end", centerY: 600 }),
    mono(600, 600, "the is the cow in the hen the …", { size: 48 }));
  if (step >= 3) parts.push(
    d.label(560, 0, "always the most likely", { size: 32, color: c.gray, anchor: "end", centerY: 680 }),
    mono(600, 680, "the the the the the the …", { size: 48, color: c.yellow }));
  return d.svg(1680, 720, ...parts);
}
function showUnigram(slide, step) { put("fig-unigram", figUnigram(step)); }

/* ------------------------------------------------------------------ */
/* one word of context: three bags as tables, and the formula          */
/* ------------------------------------------------------------------ */
// Three columns of 480 at 80, 640 and 1200; word at x, count right-aligned
// at x + 300, probability right-aligned at x + 440.
function figPairs() {
  const c = C();
  const parts = [];
  ["gives", "eats", "is"].forEach((w, k) => {
    const x = 80 + k * 560, bag = BAGS[w], n = total(bag);
    parts.push(rich(x, 50, [[w, c.blue], [" →", c.gray]], { size: 48, mono: true }));
    bag.forEach(([next, m], i) => {
      const cy = 140 + i * 52;
      parts.push(mono(x, cy, next), mono(x + 300, cy, String(m), { anchor: "end", color: c.gray }),
        mono(x + 440, cy, `${m}/${n}`, { anchor: "end" }));
    });
  });
  parts.push(
    d.formula(840, 0, "P(next | eats) = count(eats, next) / count(eats)", { size: 32, anchor: "middle", centerY: 560, color: c.light }),
    d.formula(840, 0, "P(grass | eats) = 2 / 3", { size: 48, anchor: "middle", centerY: 640 }));
  return d.svg(1680, 700, ...parts);
}

/* ------------------------------------------------------------------ */
/* the word cards are the model: three bags                            */
/* ------------------------------------------------------------------ */
// A bag is a rounded frame, its word above it in pink. Cards are 150 x 64
// with one word in mono 32 (at most 5 characters, 96 wide). The bag "the"
// holds 31 blank cards of 72 x 44 in rows of 8, gap 12: 8 x 84 = 672 wide.
function figBags() {
  const c = C();
  const parts = [];
  const bag = (x, w, word, cards, caption) => {
    parts.push(rich(x + w / 2, 70, [[word, c.blue]], { size: 48, mono: true, anchor: "middle" }),
      rect(x, 130, w, 420, "none", { stroke: c.light, rx: 28, width: 3 }),
      d.label(x + w / 2, 0, caption, { size: 32, color: c.gray, anchor: "middle", centerY: 610 }));
    if (cards) {
      const n = cards.length, ch = 64, gap = 24, top = 130 + (420 - (n * ch + (n - 1) * gap)) / 2;
      cards.forEach((t, i) => parts.push(d.box(x + (w - 150) / 2, top + i * (ch + gap), 150, ch, t, { size: 32, mono: true, border: c.light })));
    }
  };
  bag(40, 360, "gives", ["milk", "wool"], "milk 1/2 · wool 1/2");
  bag(460, 360, "eats", ["grass", "grass", "grain"], "grass 2/3 · grain 1/3");
  bag(880, 760, "the", null, "31 cards: cow 5 · hen 4 · bee 4 · …");
  for (let i = 0; i < 31; i++) {
    const row = Math.floor(i / 8), col = i % 8;
    parts.push(rect(880 + 44 + col * 84, 130 + 92 + row * 60, 72, 44, "none", { stroke: c.light, width: 2 }));
  }
  return d.svg(1680, 660, ...parts);
}

/* ------------------------------------------------------------------ */
/* writing is drawing: the bags walked one draw at a time              */
/* ------------------------------------------------------------------ */
// The written tokens run along the top in mono 48, the newest in yellow.
// Below them the bag of the last word: bars from 400, a probability of 1 is
// 1000 wide; the card drawn in yellow. At most 8 rows, from 300 every 52.
const WALK = ["<s>", "the", "milk", "is", "green", "</s>"];
function bagRows(word) {
  const bag = BAGS[word], n = total(bag);
  if (bag.length <= 8) return bag.map(([w, k]) => [w, k, n]);
  // the bag "the": the seven largest and one row for the single cards
  const top = bag.slice(0, 7).map(([w, k]) => [w, k, n]);
  const rest = bag.slice(7);
  return [...top, [`${rest.length} more`, 1, n, "each"]];
}
function figWalk(step) {
  const c = C();
  const parts = [];
  const shown = WALK.slice(0, Math.min(step, 4) + 2);
  const line = shown.map((t, i) => {
    const marker = t === "<s>" || t === "</s>";
    const newest = i === shown.length - 1 && step <= 4;
    return [t + (i < shown.length - 1 ? " " : ""), newest ? c.yellow : marker ? c.gray : c.white];
  });
  parts.push(rich(40, 70, line, { size: 48, mono: true }));
  if (step <= 4) {
    const word = WALK[step], drawn = WALK[step + 1];
    // "bag" in Arial 32 is about 55 wide, so the word starts at 110
    parts.push(d.label(40, 0, "bag", { size: 32, color: c.gray, centerY: 190 }),
      mono(110, 190, word, { color: c.blue }));
    bagRows(word).forEach(([w, k, n, each], i) => {
      const cy = 280 + i * 52, len = Math.round((k / n) * 1000);
      const col = w === drawn ? c.yellow : c.light;
      parts.push(mono(370, cy, w, { anchor: "end", color: col }),
        rect(400, cy - 15, len, 30, col),
        mono(420 + len, cy, `${k}/${n}${each ? " each" : ""}`, { color: c.gray }));
    });
  } else {
    parts.push(d.label(840, 0, "a new sentence: every pair comes from the corpus,\nand the sentence is false", { size: 48, anchor: "middle", centerY: 420 }));
  }
  return d.svg(1680, 720, ...parts);
}
function showWalk(slide, step) { put("fig-walk", figWalk(step)); }

/* ------------------------------------------------------------------ */
/* what the bags write: four kinds of sentences                        */
/* ------------------------------------------------------------------ */
// Two columns of 760 at 60 and 900; the longest sentence, "the farmer sells
// the bee is small", has 33 characters, 634 wide in mono 32.
function figKinds() {
  const c = C();
  const kinds = [
    ["copied from the corpus", ["the hen lays eggs", "the farmer milks the cow"]],
    ["new and plausible", ["the bee lives in the barn", "the hen eats grass"]],
    ["new, fluent and false", ["the milk is green", "the farmer milks the hen"]],
    ["it runs on", ["the cow gives milk is green", "the farmer sells the bee is small"]],
  ];
  const parts = [];
  kinds.forEach(([head, lines], i) => {
    const x = 60 + (i % 2) * 840, y = 60 + Math.floor(i / 2) * 300;
    parts.push(d.label(x, 0, head, { size: 32, color: c.gray, centerY: y }));
    lines.forEach((s, k) => parts.push(mono(x, y + 80 + k * 60, s)));
  });
  return d.svg(1680, 600, ...parts);
}

/* ------------------------------------------------------------------ */
/* temperature: the bag "the" at 1, 0.5 and 2                          */
/* ------------------------------------------------------------------ */
// 14 rows from 110 every 42 (last at 656). Bars from 260, a probability of
// 0.26 is about 1030 wide (4000 per unit). The counted distribution stays as
// a white outline on top of the bars of another temperature, so it shows
// where a bar has grown beyond it.
const TEMPS = [1, 0.5, 2];
function figTemp(step) {
  const c = C();
  const bag = BAGS.the, n = total(bag);
  const T = TEMPS[step];
  const p = bag.map(([, k]) => k / n);
  const w = p.map((v) => v ** (1 / T));
  const z = w.reduce((s, v) => s + v, 0);
  const parts = [d.formula(40, 0, `T = ${T}`, { size: 48, color: c.yellow, centerY: 40 })];
  bag.forEach(([word], i) => {
    const cy = 110 + i * 42, q = w[i] / z;
    const len = Math.round(q * 4000), base = Math.round(p[i] * 4000);
    parts.push(mono(230, cy, word, { anchor: "end", color: c.light }),
      rect(260, cy - 15, len, 30, c.blue, { opacity: 0.85 }));
    if (step > 0) parts.push(rect(260, cy - 15, base, 30, "none", { stroke: c.white, width: 2 }));
    parts.push(mono(280 + Math.max(len, base), cy, `${Math.round(q * 100)} %`, { color: c.gray }));
  });
  parts.push(d.formula(1640, 0, "p^{1/T}", { size: 48, anchor: "end", centerY: 380 }),
    d.label(1640, 0, "then divided\nby the sum", { size: 32, color: c.gray, anchor: "end", centerY: 470 }));
  return d.svg(1680, 700, ...parts);
}
function showTemp(slide, step) { put("fig-temp", figTemp(step)); }

/* ------------------------------------------------------------------ */
/* temperature 0 goes round in circles                                 */
/* ------------------------------------------------------------------ */
// Four boxes of 220 x 90 on a ring around 840, 330; the arrows run between
// their corners, each with the count that made it the most frequent choice.
function figCircle() {
  const c = C();
  const box = (cx, cy, t) => d.box(cx - 110, cy - 45, 220, 90, t, { size: 48, mono: true, border: c.light });
  const arrows = [
    d.arrow(955, 130, 1150, 290, { color: c.yellow, width: 3, head: 16 }),
    d.arrow(1150, 390, 955, 545, { color: c.yellow, width: 3, head: 16 }),
    d.arrow(725, 545, 530, 390, { color: c.yellow, width: 3, head: 16 }),
    d.arrow(530, 290, 725, 130, { color: c.yellow, width: 3, head: 16 }),
  ];
  return d.svg(1680, 720, ...arrows,
    box(840, 100, "the"), box(1260, 340, "cow"), box(840, 580, "sleeps"), box(420, 340, "in"),
    d.label(1090, 0, "5 of 31", { size: 32, color: c.gray, centerY: 190 }),
    d.label(1090, 0, "1 of 5, a tie", { size: 32, color: c.gray, centerY: 490 }),
    d.label(590, 0, "2 of 2", { size: 32, color: c.gray, anchor: "end", centerY: 490 }),
    d.label(590, 0, "5 of 5", { size: 32, color: c.gray, anchor: "end", centerY: 190 }),
    mono(840, 690, "the cow sleeps in the cow sleeps in the cow …", { anchor: "middle", color: c.light }));
}

/* ------------------------------------------------------------------ */
/* a penalty for repeating: the bag "the" after "the cow sleeps in the" */
/* ------------------------------------------------------------------ */
// A simplified picture: every word already in the text has its count
// divided by 1.3 before the model takes the top word. Five rows from 250
// every 56; bars from 400, 120 per count. Step 1 shrinks "cow" and leaves
// its counted bar as a white outline; step 2 shows both written sentences.
const PENALTY = 1.3;
function figRepeat(step) {
  const c = C();
  const text = ["the", "cow", "sleeps", "in", "the"];
  const rows = BAGS.the.slice(0, 5);
  const score = (w, k) => (step >= 1 && text.includes(w) ? k / PENALTY : k);
  const best = rows.reduce((b, [w, k]) => (score(w, k) > score(b[0], b[1]) ? [w, k] : b));
  const parts = [
    d.label(40, 0, "written so far", { size: 32, color: c.gray, centerY: 60 }),
    mono(400, 60, text.join(" "), { size: 48, color: c.blue }),
    d.label(40, 0, "bag", { size: 32, color: c.gray, centerY: 160 }),
    mono(110, 160, "the", { color: c.blue }),
    d.label(220, 0, "at temperature 0 the top word wins", { size: 32, color: c.gray, centerY: 160 }),
  ];
  rows.forEach(([w, k], i) => {
    const cy = 250 + i * 56, s = score(w, k);
    const len = Math.round(s * 120), base = k * 120;
    const col = w === best[0] ? c.yellow : c.light;
    parts.push(mono(370, cy, w, { anchor: "end", color: col }), rect(400, cy - 15, len, 30, col));
    if (s !== k) parts.push(rect(400, cy - 15, base, 30, "none", { stroke: c.white, width: 2 }));
    parts.push(mono(420 + base, cy, s !== k ? `${k} ÷ ${PENALTY} = ${s.toFixed(1)}` : String(k), { color: c.gray }));
  });
  if (step >= 2) parts.push(
    d.label(370, 0, "without penalty", { size: 32, color: c.gray, anchor: "end", centerY: 590 }),
    mono(400, 590, "the cow sleeps in the cow sleeps in the …", { color: c.light }),
    d.label(370, 0, "with penalty", { size: 32, color: c.gray, anchor: "end", centerY: 660 }),
    mono(400, 660, "the cow sleeps in the hen lays eggs"));
  return d.svg(1680, 700, ...parts);
}
function showRepeat(slide, step) { put("fig-repeat", figRepeat(step)); }

/* ------------------------------------------------------------------ */
/* two words of context                                                */
/* ------------------------------------------------------------------ */
// Two columns at 160 and 980; word at x, probability right-aligned at x + 420.
function figTri() {
  const c = C();
  const tri = (a, b) => {
    const m = new Map();
    for (const t of TOKENS) for (let i = 0; i + 2 < t.length; i++)
      if (t[i] === a && t[i + 1] === b) m.set(t[i + 2], (m.get(t[i + 2]) || 0) + 1);
    return [...m].sort((x, z) => z[1] - x[1]);
  };
  const parts = [
    d.label(160, 0, "one word", { size: 32, color: c.gray, centerY: 30 }),
    d.label(980, 0, "two words", { size: 32, color: c.gray, centerY: 30 }),
  ];
  // n is the size of the whole bag, also where only its first rows are shown
  const column = (x, y, context, rows, more, n = total(rows)) => {
    parts.push(rich(x, y, [[context, c.blue], [" →", c.gray]], { size: 48, mono: true }));
    rows.forEach(([w, k], i) => parts.push(mono(x, y + 70 + i * 50, w), mono(x + 420, y + 70 + i * 50, `${k}/${n}`, { anchor: "end" })));
    if (more) parts.push(d.label(x, 0, more, { size: 32, color: c.gray, centerY: y + 70 + rows.length * 50 }));
  };
  column(160, 120, "gives", BAGS.gives);
  column(980, 120, "cow gives", tri("cow", "gives"));
  column(160, 360, "the", BAGS.the.slice(0, 3), `… ${BAGS.the.length} words in all`, total(BAGS.the));
  column(980, 360, "in the", tri("in", "the"));
  return d.svg(1680, 640, ...parts);
}

/* ------------------------------------------------------------------ */
/* more context, more copying                                          */
/* ------------------------------------------------------------------ */
// Shares of 20,000 written sentences that are in the corpus word for word:
// 0.15 with one word of context, 0.66 with two (measured with the same
// counts; the experiment rounds them to one in six and two in three).
// A share of 1 is 1100 wide, from 460; the frame shows the whole.
function figCopy(step) {
  const c = C();
  const rows = [["one word of context", 0.15, "about 1 in 6"], ["two words of context", 0.66, "about 2 in 3"]];
  const parts = [d.label(840, 0, "share of written sentences that are in the corpus word for word", { size: 32, color: c.gray, anchor: "middle", centerY: 40 })];
  rows.forEach(([label, share, text], i) => {
    const cy = 220 + i * 200;
    parts.push(d.label(420, 0, label, { size: 32, anchor: "end", centerY: cy }),
      rect(460, cy - 40, 1100, 80, "none", { stroke: c.dark, width: 2 }));
    if (i <= step) parts.push(rect(460, cy - 40, Math.round(share * 1100), 80, c.light),
      d.label(460 + Math.round(share * 1100) + 24, 0, text, { size: 32, centerY: cy }));
  });
  return d.svg(1680, 560, ...parts);
}
function showCopy(slide, step) { put("fig-copy", figCopy(step)); }

/* ------------------------------------------------------------------ */
/* fluent and false: every pair of the sentence was counted            */
/* ------------------------------------------------------------------ */
// "the milk is green" in mono 80, 17 characters of 48 = 816, from 432.
// Each pair gets a pink line under its two words and the sentence it was
// counted in; words start at characters 0, 4, 9 and 12.
function figFalse() {
  const c = C();
  const x0 = 432, ch = 48;
  const at = (k) => x0 + k * ch;
  const pairs = [[0, 8, "the milk is white"], [4, 11, "the milk is white"], [9, 17, "the grass is green"]];
  const parts = [mono(x0, 110, "the milk is green", { size: 80 })];
  pairs.forEach(([a, b, from], i) => {
    const y = 220 + i * 130;
    parts.push(d.line(at(a), y, at(b), y, { color: c.blue, width: 4 }),
      // "counted in" in Arial 32 is about 150 wide, so the sentence starts 180 later
      d.label(at(a), 0, "counted in", { size: 32, color: c.gray, centerY: y + 46 }),
      mono(at(a) + 180, y + 46, from, { color: c.light }));
  });
  return d.svg(1680, 620, ...parts);
}

/* ------------------------------------------------------------------ */
/* zero means never counted                                            */
/* ------------------------------------------------------------------ */
// Left: the bag "milks the", a share of 1 is 400 wide from 300; the sheep
// is a dashed empty frame. Right: no bag at all for "dog".
function figZero() {
  const c = C();
  return d.svg(1680, 560,
    rich(80, 60, [["milks the", c.blue], [" →", c.gray]], { size: 48, mono: true }),
    mono(270, 180, "cow", { anchor: "end" }), rect(300, 165, 400, 30, c.light), mono(724, 180, "1/1", { color: c.gray }),
    mono(270, 250, "sheep", { anchor: "end", color: c.gray }), rect(300, 235, 400, 30, "none", { stroke: c.dark, dashed: true }),
    mono(724, 250, "0", { color: c.gray }),
    d.label(80, 0, "sheep are milked, too:\n0 only means never counted", { size: 32, color: c.gray, centerY: 400 }),
    rich(980, 60, [["the dog", c.blue], [" →", c.gray]], { size: 48, mono: true }),
    rect(980, 140, 400, 160, "none", { stroke: c.dark, dashed: true, rx: 28 }),
    d.label(1180, 0, "no bag", { size: 32, color: c.gray, anchor: "middle", centerY: 220 }),
    d.label(980, 0, "dog never occurs, so the\nmodel cannot even begin", { size: 32, color: c.gray, centerY: 400 }));
}

/* ------------------------------------------------------------------ */
/* the table is almost empty: 34 x 34 cells, 72 filled                 */
/* ------------------------------------------------------------------ */
// Cells of 18 with a gap of 2, so the grid is 34 x 20 = 680 square, at 40.
// Rows are <s> and the 33 words, columns the 33 words and </s>, both in the
// order of first appearance. A filled cell is pink, the more opaque the
// more likely. Text on the right from 800; values right-aligned at 1640.
function figGrid(step) {
  const c = C();
  const words = [];
  for (const s of CORPUS) for (const w of s.split(" ")) if (!words.includes(w)) words.push(w);
  const rows = ["<s>", ...words], cols = [...words, "</s>"];
  const cells = [];
  rows.forEach((r, i) => {
    const bag = new Map(BAGS[r] || []), n = total(BAGS[r] || []);
    cols.forEach((col, j) => {
      const x = 40 + j * 20, y = 20 + i * 20;
      cells.push(bag.has(col)
        ? rect(x, y, 18, 18, c.blue, { rx: 2, opacity: (0.35 + 0.65 * bag.get(col) / n).toFixed(2) })
        : rect(x, y, 18, 18, "none", { rx: 2, stroke: c.dark, width: 1 }));
    });
  });
  const filled = Object.values(BAGS).reduce((s, b) => s + b.length, 0);
  const parts = [...cells,
    d.formula(800, 0, `34 × 34 = ${(34 * 34).toLocaleString("en")} cells`, { size: 48, centerY: 70 }),
    rich(800, 150, [[`${filled} filled`, c.blue], [": the parameters", c.white]], { size: 48 }),
    d.label(800, 0, `${(34 * 34 - filled).toLocaleString("en")} cells stay 0`, { size: 32, color: c.gray, centerY: 225 })];
  if (step >= 1) parts.push(
    d.label(800, 0, "with a vocabulary of 100,000 tokens", { size: 32, color: c.gray, centerY: 380 }),
    d.label(800, 0, "one word of context", { size: 32, centerY: 450 }),
    d.formula(1640, 0, "10^{10} cells", { size: 48, anchor: "end", centerY: 450 }),
    d.label(800, 0, "two words of context", { size: 32, centerY: 525 }),
    d.formula(1640, 0, "10^{15} cells", { size: 48, anchor: "end", centerY: 525 }),
    d.label(800, 0, "GPT-3, thousands of tokens", { size: 32, centerY: 630, keepCase: true }),
    d.label(1640, 0, "175 billion parameters", { size: 32, anchor: "end", centerY: 630 }));
  return d.svg(1680, 720, ...parts);
}
function showGrid(slide, step) { put("fig-grid", figGrid(step)); }

/* ------------------------------------------------------------------ */
/* the same question, a different answer                               */
/* ------------------------------------------------------------------ */
// Three columns: the aspect at 40 in grey, the counting model at 440 and a
// real language model at 1060; the longest cell, "billions of learned
// numbers", has 27 characters, 518 wide in 32.
function figCompare() {
  const c = C();
  const rows = [
    ["context", "1 or 2 words", "thousands of tokens"],
    ["what it knows", "72 counts", "billions of learned numbers"],
    ["similar words", "know nothing of each other", "lie close together"],
  ];
  const parts = [
    d.label(440, 0, "counting model", { size: 32, color: c.gray, centerY: 40 }),
    d.label(1060, 0, "real language model", { size: 32, color: c.blue, centerY: 40 }),
    d.line(40, 90, 1640, 90, { color: c.dark }),
  ];
  rows.forEach(([a, b, r], i) => {
    const cy = 170 + i * 100;
    parts.push(d.label(40, 0, a, { size: 32, color: c.gray, centerY: cy }),
      d.label(440, 0, b, { size: 32, color: c.light, centerY: cy }),
      d.label(1060, 0, r, { size: 32, centerY: cy }));
  });
  parts.push(d.line(40, 440, 1640, 440, { color: c.dark }),
    d.label(40, 0, "the same", { size: 32, color: c.gray, centerY: 520 }),
    d.label(440, 0, "predict the next token from what came before, write by\ndrawing with a temperature, know a start and an end", { size: 32, centerY: 540 }));
  return d.svg(1680, 640, ...parts);
}

/* ------------------------------------------------------------------ */
/* draw the still figures once, on load                                */
/* ------------------------------------------------------------------ */
[["fig-count", figCount], ["fig-corpus", figCorpus], ["fig-tokens", figTokens], ["fig-pairs", figPairs], ["fig-bags", figBags],
 ["fig-kinds", figKinds], ["fig-circle", figCircle], ["fig-tri", figTri], ["fig-false", figFalse],
 ["fig-zero", figZero], ["fig-compare", figCompare]].forEach(([id, fn]) => put(id, fn()));
put("fig-formula", figFormula(0));
put("fig-guess", figGuess(0));
put("fig-unigram", figUnigram(0));
put("fig-walk", figWalk(0));
put("fig-temp", figTemp(0));
put("fig-repeat", figRepeat(0));
put("fig-copy", figCopy(0));
put("fig-grid", figGrid(0));

Object.assign(window, { showFormula, showGuess, showUnigram, showWalk, showTemp, showRepeat, showCopy, showGrid });
