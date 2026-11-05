/* Drawings of the deck "a map of meaning" (2026-11-05).
 *
 * Font sizes 20, 32, 48 and 80 only. Lines first, then boxes, then labels
 * (d.layers). Slides that build up redraw the same canvas on every step and
 * leave out what is not visible yet, so nothing moves between steps.
 * Every drawing is 1680 wide, the width of the figure area, so 1 unit is
 * 1 pixel on the 1920 canvas.
 *
 * Colours: pink (role "blue") is what the slide points at, yellow the result
 * of a calculation or a search (the star of the demonstrator), grey all the
 * rest. Green and red do not appear, because nothing here is judged.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();

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

/* the same small numbers on every visit, between -1 and 1 */
function numbers(seed, n) {
  let s = seed >>> 0;
  return Array.from({ length: n }, () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s / 4294967296) * 2 - 1;
  });
}
const clip = (v) => Math.max(-1, Math.min(1, v));

/* the yellow star of the arithmetic demonstrator, centred at cx, cy */
function star(cx, cy, r, colour) {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = (Math.PI / 5) * k - Math.PI / 2;
    const len = k % 2 ? r * 0.45 : r;
    return `${(cx + len * Math.cos(a)).toFixed(1)},${(cy + len * Math.sin(a)).toFixed(1)}`;
  });
  return `<polygon points="${pts.join(" ")}" fill="${colour}"/>`;
}

/* ------------------------------------------------------------------ */
/* close in meaning, close on the map: a sheet as most groups lay it   */
/* ------------------------------------------------------------------ */
function figSheet() {
  const c = C();
  const W = 1680, H = 780;
  // Six zones of 460 x 310 in two rows: x 60, 610, 1160 (ends 1620), y 50 and
  // 420 (ends 730). Cards 150 x 76, two by two, centres 95 left and right of
  // the zone's middle and at 130 and 232 below its top; a few units of jitter
  // so the groups look laid by hand. The sheet frame is inset by 3 for its
  // stroke of 2.
  const zones = [
    ["travel", [1, 7, 13, 19]], ["money", [3, 9, 15, 21]], ["computers", [6, 12, 18, 24]],
    ["health", [4, 10, 16, 22]], ["food", [5, 11, 17, 23]], ["animals", [2, 8, 14, 20]],
  ];
  const focus = [3, 20, 8, 12]; // the two bank and the two python cards
  const jitter = numbers(4711, 48);
  const frames = [], cards = [], labels = [];
  frames.push(`<rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="12" fill="none" stroke="${c.dark}" stroke-width="2"/>`);
  zones.forEach(([name, ids], z) => {
    const zx = [60, 610, 1160][z % 3], zy = [50, 420][Math.floor(z / 3)];
    frames.push(d.box(zx, zy, 460, 310, "", { border: c.gray, dashed: true, rx: 40, fill: "none" }));
    labels.push(d.label(zx + 230, 0, name, { size: 32, color: c.gray, anchor: "middle", centerY: zy + 44 }));
    ids.forEach((id, k) => {
      const cx = zx + 230 + (k % 2 ? 95 : -95) + jitter[z * 8 + k] * 8;
      const cy = zy + (k < 2 ? 130 : 232) + jitter[z * 8 + k + 4] * 6;
      const on = focus.includes(id);
      cards.push(d.box(cx - 75, cy - 38, 150, 76, String(id), { size: 32, border: on ? c.blue : c.light, color: on ? c.blue : c.white }));
    });
  });
  return d.svg(W, H, ...d.layers(frames, cards, labels));
}

/* ------------------------------------------------------------------ */
/* a place is a list of numbers                                        */
/* ------------------------------------------------------------------ */
function figAxes(step) {
  const c = C();
  const W = 1680, H = 780;
  // The sheet as a square of 700 from x 120 and y 60: -10 to 10 on both
  // axes, 35 units per step, origin at 470, 410.
  const X = (u) => 470 + u * 35, Y = (v) => 410 - v * 35;
  const lines = [], boxes = [], labels = [];
  lines.push(d.arrow(X(-10), Y(0), X(10) + 20, Y(0), { color: c.light, width: 2 }));
  lines.push(d.arrow(X(0), Y(-10), X(0), Y(10) - 20, { color: c.light, width: 2 }));
  labels.push(d.label(X(10) + 40, 0, "right", { size: 32, color: c.gray, centerY: Y(0) }));
  labels.push(d.label(X(0), 0, "up", { size: 32, color: c.gray, anchor: "middle", centerY: 22 }));
  labels.push(d.label(X(-10), 0, "−10", { size: 32, color: c.gray, anchor: "middle", centerY: Y(0) + 34 }));
  labels.push(d.label(X(10) - 10, 0, "10", { size: 32, color: c.gray, anchor: "middle", centerY: Y(0) + 34 }));
  labels.push(d.label(X(0) - 16, 0, "10", { size: 32, color: c.gray, anchor: "end", centerY: Y(10) }));
  labels.push(d.label(X(0) - 16, 0, "−10", { size: 32, color: c.gray, anchor: "end", centerY: Y(-10) }));

  // card 1 at (-6, 4), with dashed lines to both axes
  lines.push(d.line(X(-6), Y(4), X(-6), Y(0), { color: c.gray, dashed: true }));
  lines.push(d.line(X(-6), Y(4), X(0), Y(4), { color: c.gray, dashed: true }));
  boxes.push(d.box(X(-6) - 35, Y(4) - 25, 70, 50, "1", { size: 32 }));

  // The right column starts at 980; the longest line, "card 15 → (4, −5, −6)",
  // is 21 x 48 x 0.6 = 605 wide and ends at 1585.
  if (step >= 1) labels.push(d.label(980, 0, "card 1  → (−6, 4)", { size: 48, mono: true, centerY: Y(4) }));
  if (step >= 2) {
    // a third direction, drawn slanting through the origin, and two cards on
    // the same spot of the sheet that it pulls apart
    lines.push(d.line(X(-4), Y(-4), X(4), Y(4), { color: c.blue, width: 2, dashed: true }));
    labels.push(d.label(X(4) + 14, 0, "a third direction", { size: 32, color: c.blue, centerY: Y(4) - 14 }));
    boxes.push(d.box(X(4) - 35, Y(-5) - 25, 70, 50, "9", { size: 32 }));
    boxes.push(d.box(X(4) - 27, Y(-5) - 17, 70, 50, "15", { size: 32 }));
    labels.push(d.label(980, 0, "two cards on the same spot:", { size: 32, color: c.gray, centerY: 470 }));
    labels.push(rich(980, 550, [["card 9  → (4, −5, ", c.white], ["2", c.blue], [")", c.white]], { size: 48, mono: true }));
    labels.push(rich(980, 630, [["card 15 → (4, −5, ", c.white], ["−6", c.blue], [")", c.white]], { size: 48, mono: true }));
  }
  return d.svg(W, H, ...d.layers(lines, boxes, labels));
}
function showAxes(slide, step) { if ($("fig-axes")) $("fig-axes").innerHTML = figAxes(step || 0); }

/* ------------------------------------------------------------------ */
/* a table with one row per token                                      */
/* ------------------------------------------------------------------ */
function figTable() {
  const c = C();
  const W = 1680, H = 780;
  // Rows at 90, 230, 370, 510; tokens right-aligned at 260 in 48 ("puppy" is
  // 5 x 28.8 = 144 wide). Sixteen bars of 36 every 56 from 320, up to 50
  // above or below the row's middle, then "…" at 1240.
  const base = numbers(101, 16), n2 = numbers(202, 16), n3 = numbers(303, 16), n4 = numbers(404, 16);
  const rows = [
    ["dog", base],
    ["puppy", base.map((v, k) => clip(0.85 * v + 0.15 * n2[k]))],
    ["cat", base.map((v, k) => clip(0.55 * v + 0.45 * n3[k]))],
    ["car", n4],
  ];
  const parts = [];
  rows.forEach(([word, vals], r) => {
    const cy = 90 + r * 140;
    parts.push(d.label(260, 0, word, { size: 48, mono: true, anchor: "end", centerY: cy }));
    parts.push(d.line(316, cy, 1216, cy, { color: c.dark, width: 1 }));
    vals.forEach((v, k) => {
      const h = Math.abs(v) * 50;
      parts.push(`<rect x="${320 + k * 56}" y="${(v > 0 ? cy - h : cy).toFixed(1)}" width="36" height="${h.toFixed(1)}" fill="${c.light}"/>`);
    });
    parts.push(d.label(1240, 0, "…", { size: 48, color: c.gray, centerY: cy }));
  });
  parts.push(d.label(260, 0, "…", { size: 48, mono: true, color: c.gray, anchor: "end", centerY: 630 }));
  parts.push(d.label(320, 0, "30,522 tokens × 384 numbers", { size: 32, color: c.gray, centerY: 730 }));
  return d.svg(W, H, ...parts);
}

/* ------------------------------------------------------------------ */
/* similarity is the angle between two arrows                          */
/* ------------------------------------------------------------------ */
function figAngle(step) {
  const c = C();
  const W = 1680, H = 780;
  // Three panels of 560, origins at 280, 840, 1400 and y 360, arrows of 220.
  // The note under the third panel, "1.3 million word pairs is −0.09", is
  // 31 x 32 x 0.6 = 595 wide, so it is centred under the panel and still
  // ends at 1698; it starts at 1103 and is therefore set left at 1150 in two
  // lines of at most 27 characters (518, ending at 1668).
  const L = 220, oy = 360;
  const tip = (ox, deg, len = L) => [ox + len * Math.cos(deg * Math.PI / 180), oy - len * Math.sin(deg * Math.PI / 180)];
  const panels = [
    [280, [35, 35], "1", "same direction"],
    [840, [0, 90], "0", "at a right angle"],
    [1400, [0, 180], "−1", "opposite"],
  ];
  const parts = [];
  panels.forEach(([ox, [a, b], value, caption], i) => {
    // the first panel: the same direction, one arrow shorter, so both show
    const lenB = i === 0 ? 130 : L;
    // shift the origin so the pair of arrows stands centred over its labels
    const cx = ox, o = ox - [90, 110, 0][i];
    const ta = tip(o, a), tb = tip(o, b, lenB);
    parts.push(d.arrow(o, oy, ta[0], ta[1], { color: c.white, width: 4, head: 22 }));
    parts.push(d.arrow(o, oy, tb[0], tb[1], { color: c.light, width: 4, head: 22 }));
    parts.push(`<circle cx="${o}" cy="${oy}" r="6" fill="${c.white}"/>`);
    parts.push(d.label(cx, 0, value, { size: 80, anchor: "middle", centerY: 520 }));
    parts.push(d.label(cx, 0, caption, { size: 32, color: c.gray, anchor: "middle", centerY: 600 }));
  });
  if (step >= 1) {
    parts.push(d.label(1400, 0, "almost never: the lowest of\n1.3 million word pairs is −0.09", { size: 32, color: c.gray, anchor: "middle", centerY: 700 }));
  }
  return d.svg(W, H, ...parts);
}
function showAngle(slide, step) { if ($("fig-angle")) $("fig-angle").innerHTML = figAngle(step || 0); }

/* ------------------------------------------------------------------ */
/* horizontal bars of similarity values                                */
/* ------------------------------------------------------------------ */
// Labels right-aligned at 480 in 48: "puppy · invoice" is 15 x 28.8 = 432
// wide and starts at 48. Bars from 520, 1000 units for a value of 1, so the
// dashed line of 1 stands at 1520; values follow 24 after the bar.
function bars(rows, top, gap, visible) {
  const c = C();
  const lines = [], parts = [];
  const bottom = top + (rows.length - 1) * gap;
  lines.push(d.line(520, top - 50, 520, bottom + 50, { color: c.gray, width: 2 }));
  lines.push(d.line(1520, top - 50, 1520, bottom + 50, { color: c.dark, width: 2, dashed: true }));
  parts.push(d.label(1520, 0, "1", { size: 32, color: c.gray, anchor: "middle", centerY: top - 76 }));
  parts.push(d.label(520, 0, "0", { size: 32, color: c.gray, anchor: "middle", centerY: top - 76 }));
  rows.slice(0, visible).forEach(([text, value, colour], r) => {
    const cy = top + r * gap;
    parts.push(d.label(480, 0, text, { size: 48, color: colour || c.white, anchor: "end", centerY: cy }));
    parts.push(`<rect x="521" y="${cy - 24}" width="${(value * 1000).toFixed(0)}" height="48" fill="${colour || c.light}"/>`);
    parts.push(d.label(520 + value * 1000 + 24, 0, value.toFixed(2), { size: 48, color: colour || c.white, centerY: cy }));
  });
  return [...lines, ...parts];
}

function figPairs(step) {
  const c = C();
  const rows = [
    ["dog · puppy", 0.81], ["dog · cat", 0.66], ["dog · car", 0.48],
    ["warm · cold", 0.72, c.blue], ["hot · cold", 0.53, c.blue], ["puppy · invoice", 0.22, c.gray],
  ];
  // rows every 112 from 110: the last one at 670
  return d.svg(1680, 780, ...bars(rows, 110, 112, step >= 1 ? 6 : 3));
}
function showPairs(slide, step) { if ($("fig-pairs")) $("fig-pairs").innerHTML = figPairs(step || 0); }

function figBack() {
  const c = C();
  const rows = [["lord", 0.79], ["brother", 0.75], ["king", 0.74, c.blue]];
  const parts = [d.label(40, 0, "queen − woman + man", { size: 48, mono: true, centerY: 70 })];
  return d.svg(1680, 780, ...parts, ...bars(rows, 330, 150, 3));
}

/* ------------------------------------------------------------------ */
/* king − man + woman: the parallelogram, as an animation               */
/* ------------------------------------------------------------------ */
function drawArith() {
  const el = $("fig-arith");
  if (!el) return;
  const c = C();
  // A sketch, not to scale. Corners: man 300,640; king 520,200; woman
  // 1100,640; queen 1320,200. The arrow king − man is pink; a copy of it
  // moves 800 to the right until it starts at woman.
  const P = { man: [300, 640], king: [520, 200], woman: [1100, 640], queen: [1320, 200] };
  const short = (a, b, s = 30) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
    return [a[0] + dx / len * s, a[1] + dy / len * s, b[0] - dx / len * s, b[1] - dy / len * s];
  };
  const [ax1, ay1, ax2, ay2] = short(P.man, P.king);
  const spot = (p, word, below) => [
    `<circle cx="${p[0]}" cy="${p[1]}" r="10" fill="${c.white}"/>`,
    d.label(p[0], 0, word, { size: 48, anchor: "middle", centerY: p[1] + (below ? 60 : -60) }),
  ].join("");
  el.innerHTML = d.svg(1680, 780,
    d.g("sides", d.line(...short(P.man, P.woman), { color: c.gray, width: 2, dashed: true }),
      d.line(...short(P.king, P.queen), { color: c.gray, width: 2, dashed: true })),
    d.g("v1", d.arrow(ax1, ay1, ax2, ay2, { color: c.blue, width: 6, head: 30 })),
    d.g("v1label", d.label(330, 0, "king − man", { size: 32, color: c.blue, mono: true, anchor: "end", centerY: 420 })),
    d.g("v2", d.arrow(ax1, ay1, ax2, ay2, { color: c.blue, width: 6, head: 30 })),
    spot(P.man, "man", true), spot(P.king, "king", false), spot(P.woman, "woman", true),
    d.g("result", star(P.queen[0], P.queen[1], 34, c.yellow),
      d.label(P.queen[0], 0, "≈ queen  0.85", { size: 48, color: c.yellow, anchor: "middle", centerY: P.queen[1] - 70 })),
    d.label(1640, 0, "a sketch, not to scale", { size: 32, color: c.gray, anchor: "end", centerY: 750 }),
  );
  const a = d.anim("fig-arith");
  a.step(a.par(a.draw("v1"), a.show("v1label")));
  a.step(a.show("v2", { dur: 1 }), a.move("v2", 800, 0, { dur: 1600 }), a.show("sides"));
  a.step(a.show("result"));
}

/* ------------------------------------------------------------------ */
/* what the model reads: texts and their tokens                        */
/* ------------------------------------------------------------------ */
function chips(x, cy, tokens, pieces) {
  const c = C();
  // Each chip is chars x 19.2 + 24 wide in mono 32, with 12 between chips.
  const parts = [];
  let at = x;
  tokens.forEach((t) => {
    const w = t.length * 19.2 + 24;
    const marker = t.startsWith("[");
    const piece = pieces.includes(t);
    const col = marker ? c.gray : piece ? c.blue : c.white;
    parts.push(d.box(at, cy - 30, w, 60, t, { size: 32, mono: true, keepCase: true, border: marker ? c.dark : col, color: col }));
    at += w + 12;
  });
  return parts;
}

function figTokens() {
  const c = C();
  // Texts left at 40 in 32 ("I can't get home tonight" is 24 x 19.2 = 461);
  // chips from 560. The longest row, the first, has 30 characters in nine
  // chips: 576 + 9 x 24 + 8 x 12 = 888, ending at 1448.
  const rows = [
    ["I can't get home tonight", ["[CLS]", "i", "can", "'", "t", "get", "home", "tonight", "[SEP]"], []],
    ["unbelievably", ["[CLS]", "un", "##bel", "##ie", "##va", "##bly", "[SEP]"], ["un", "##bel", "##ie", "##va", "##bly"]],
    ["ChatGPT", ["[CLS]", "chat", "##gp", "##t", "[SEP]"], ["chat", "##gp", "##t"]],
    ["Ich bin krank", ["[CLS]", "ich", "bin", "k", "##rank", "[SEP]"], ["k", "##rank"]],
  ];
  const parts = [];
  rows.forEach(([text, tokens, pieces], r) => {
    const cy = 80 + r * 150;
    parts.push(d.label(40, 0, text, { size: 32, keepCase: true, centerY: cy }));
    parts.push(...chips(560, cy, tokens, pieces));
  });
  parts.push(rich(40, 720, [["unbelievably · incredibly  ", c.gray], ["0.35", c.white]], { size: 32 }));
  return d.svg(1680, 780, ...parts);
}

/* ------------------------------------------------------------------ */
/* four steps from tokens to one list (the figure of the experiment)   */
/* ------------------------------------------------------------------ */
function strip(cx, y, values, colour, border) {
  const parts = [
    `<rect x="${cx - 60}" y="${y}" width="120" height="120" rx="8" fill="none" stroke="${border}" stroke-width="2"/>`,
    `<line x1="${cx}" y1="${y + 8}" x2="${cx}" y2="${y + 112}" stroke="${border}" stroke-width="1"/>`,
  ];
  values.forEach((v, k) => {
    const w = Math.abs(v) * 48;
    const x = v < 0 ? cx - w : cx;
    parts.push(`<rect x="${x.toFixed(1)}" y="${y + 9 + k * 13.5}" width="${w.toFixed(1)}" height="8" fill="${colour}"/>`);
  });
  return parts.join("");
}

function figText(step) {
  const c = C();
  // The figure of the page, moved 80 to the right: token columns centred at
  // 500 to 1580 (the box of "[SEP]" ends at 1655), side labels right-aligned
  // at 370 ("384 numbers each" is 16 x 19.2 = 307 wide and starts at 63).
  // Rows: tokens at 40, own numbers at 160, numbers in context at 400, the
  // average at 620. The keyword of the current step is yellow.
  const tokens = ["[CLS]", "the", "bank", "raised", "its", "rates", "[SEP]"];
  const BANK = 2;
  const xs = tokens.map((_, i) => 500 + i * 180);
  const own = tokens.map((_, i) => numbers(20261105 + i * 7919, 8));
  const mean = (lists) => lists[0].map((_, k) => lists.reduce((s, l) => s + l[k], 0) / lists.length);
  const shared = mean(own);
  const context = own.map((v) => v.map((x, k) => clip(0.6 * x + 0.4 * shared[k] * 2.2)));
  const text = mean(context).map((x) => clip(x * 1.8));
  const tone = (i) => (i === BANK ? c.blue : c.light);
  const centre = xs[3];

  const lines = [], into = [], boxes = [], labels = [];
  xs.forEach((x, i) => {
    boxes.push(d.box(x - 75, 40, 150, 64, tokens[i], { size: 32, mono: true, keepCase: true, border: i === BANK ? c.blue : c.gray, color: i === BANK ? c.blue : c.white }));
    if (step >= 1) {
      lines.push(d.arrow(x, 106, x, 154, { color: c.gray, width: 2, head: 12 }));
      boxes.push(strip(x, 160, own[i], tone(i), c.gray));
    }
    if (step >= 2) {
      xs.forEach((from) => (i === BANK ? into : lines).push(d.line(from, 282, x, 398, { color: i === BANK ? c.blue : c.dark, width: i === BANK ? 2.5 : 1.5 })));
      boxes.push(strip(x, 400, context[i], tone(i), c.gray));
    }
    if (step >= 3) lines.push(d.line(x, 522, centre, 618, { color: c.gray, width: 2 }));
  });
  if (step >= 3) {
    boxes.push(strip(centre, 620, text, c.white, c.blue));
    labels.push(d.label(centre + 100, 0, "one text,\n384 numbers", { size: 32, color: c.white, centerY: 680 }));
  }
  const keys = [
    [72, "cutting"], [220, "looking up\n384 numbers each"], [400, "adjusting\nto each other"], [680, "averaging"],
  ];
  keys.forEach(([cy, words], k) => {
    if (k > step) return;
    labels.push(d.label(370, 0, words, { size: 32, color: k === step ? c.yellow : c.gray, anchor: "end", centerY: cy }));
  });
  return d.svg(1680, 760, ...d.layers(lines, into, boxes, labels));
}
function showText(slide, step) { if ($("fig-text")) $("fig-text").innerHTML = figText(step || 0); }

/* ------------------------------------------------------------------ */
/* where the numbers come from: two stages                             */
/* ------------------------------------------------------------------ */
function figStages() {
  const c = C();
  // Two panels of 780 at x 20 and 880, framed from y 20 to 600; captions
  // below at 680. Texts in boxes are checked against their widths in the
  // comments next to them.
  const lines = [], boxes = [], labels = [];
  boxes.push(d.box(20, 20, 780, 580, "", { border: c.dark, fill: "none", rx: 16 }));
  boxes.push(d.box(880, 20, 780, 580, "", { border: c.dark, fill: "none", rx: 16 }));
  labels.push(d.label(410, 0, "stage 1: guess the hidden word", { size: 32, color: c.gray, anchor: "middle", centerY: 70 }));
  labels.push(d.label(1270, 0, "stage 2: pairs that belong together", { size: 32, color: c.gray, anchor: "middle", centerY: 70 }));

  // stage 1: "the ____ barked" (15 x 28.8 = 432) over "at the postman."
  labels.push(rich(410, 180, [["the ", c.white], ["____", c.blue], [" barked", c.white]], { size: 48, anchor: "middle" }));
  labels.push(d.label(410, 0, "at the postman.", { size: 48, anchor: "middle", centerY: 250 }));
  boxes.push(d.box(230, 400, 160, 70, "dog", { size: 32, border: c.blue, color: c.blue }));
  boxes.push(d.box(430, 400, 160, 70, "puppy", { size: 32, border: c.blue, color: c.blue }));
  labels.push(d.label(410, 0, "which word fits?", { size: 32, color: c.gray, anchor: "middle", centerY: 345 }));

  // stage 2: a question and its answer pulled together, an unrelated text
  // pushed away. "how do i reset" is 14 x 19.2 = 269, "open settings" 13 x
  // 19.2 = 250, "this soup needs" 15 x 19.2 = 288: all fit their 340 boxes.
  boxes.push(d.box(930, 140, 340, 130, "how do i reset\nmy password?", { size: 32 }));
  boxes.push(d.box(930, 400, 340, 130, "open settings\nand click reset.", { size: 32 }));
  lines.push(d.arrow(1060, 278, 1060, 332, { color: c.blue, width: 4, head: 18 }));
  lines.push(d.arrow(1140, 392, 1140, 338, { color: c.blue, width: 4, head: 18 }));
  labels.push(d.label(1170, 0, "closer", { size: 32, color: c.blue, centerY: 335 }));
  boxes.push(d.box(1320, 260, 300, 130, "this soup needs\nmore salt.", { size: 32, border: c.gray, color: c.gray }));
  labels.push(d.label(1470, 0, "further away", { size: 32, color: c.gray, anchor: "middle", centerY: 430 }));

  labels.push(d.label(410, 0, "words that fit the same gaps\nget similar numbers", { size: 32, color: c.light, anchor: "middle", centerY: 690 }));
  labels.push(d.label(1270, 0, "more than 1 billion pairs of texts", { size: 32, color: c.light, anchor: "middle", centerY: 690 }));
  return d.svg(1680, 780, ...d.layers(lines, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* 384 directions, drawn on two: a cloud and its shadow                */
/* ------------------------------------------------------------------ */
function figShadow() {
  const c = C();
  // A plane in perspective: corners 80,700 · 940,700 · 1080,520 · 260,520.
  // A point (u, v) in 0..1 lies on it at the bilinear position; its height h
  // lifts it up by h units. Two points share almost the same (u, v) but lie
  // far apart in height: their shadows touch, they are pink. The text column
  // starts at 1140; its longest line, "the two directions in which", is
  // 27 x 19.2 = 518 wide and ends at 1658.
  const corner = { a: [80, 700], b: [940, 700], c: [1080, 520], d: [260, 520] };
  const at = (u, v) => {
    const x = (1 - v) * ((1 - u) * corner.a[0] + u * corner.b[0]) + v * ((1 - u) * corner.d[0] + u * corner.c[0]);
    const y = (1 - v) * corner.a[1] + v * corner.d[1];
    return [x, y];
  };
  const rnd = numbers(777, 72);
  const pts = Array.from({ length: 22 }, (_, k) => [0.08 + 0.84 * (rnd[k * 3] + 1) / 2, 0.1 + 0.8 * (rnd[k * 3 + 1] + 1) / 2, 120 + 300 * (rnd[k * 3 + 2] + 1) / 2]);
  pts.push([0.62, 0.45, 420, "pink"], [0.645, 0.47, 110, "pink"]);
  const lines = [], dots = [], labels = [];
  lines.push(`<polygon points="${[corner.a, corner.b, corner.c, corner.d].map((p) => p.join(",")).join(" ")}" fill="${c.dark}" fill-opacity="0.35" stroke="${c.gray}" stroke-width="2"/>`);
  pts.forEach(([u, v, h, mark]) => {
    const [x, y] = at(u, v);
    const col = mark ? c.blue : c.white;
    lines.push(d.line(x, y - h, x, y, { color: mark ? c.blue : c.dark, width: mark ? 2 : 1.5, dashed: true }));
    dots.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="10" ry="5" fill="${mark ? c.blue : c.gray}"/>`);
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${(y - h).toFixed(1)}" r="9" fill="${col}"/>`);
  });
  labels.push(d.label(1140, 0, "principal component analysis:\nthe two directions in which\nthe cards differ most", { size: 32, color: c.light, centerY: 300 }));
  labels.push(d.label(1140, 0, "close in the shadow,\nfar apart in the numbers", { size: 32, color: c.blue, centerY: 520 }));
  return d.svg(1680, 780, ...d.layers(lines, dots, labels));
}

/* ------------------------------------------------------------------ */
/* search by meaning                                                   */
/* ------------------------------------------------------------------ */
function figSearch(step) {
  const c = C();
  // Labels of the rows right-aligned at 300, content from 340. The card text
  // in 32, "my train was cancelled and i missed the last connection." (56 x
  // 19.2 = 1075), runs from 420 to 1495; its value stands right-aligned at
  // 1670. The single-word searches below appear on step 1.
  const parts = [];
  parts.push(star(370, 70, 30, c.yellow));
  parts.push(d.label(420, 0, "I can't get home tonight", { size: 48, keepCase: true, centerY: 70 }));
  parts.push(d.label(300, 0, "by meaning", { size: 32, color: c.gray, anchor: "end", centerY: 190 }));
  parts.push(d.label(340, 0, "1", { size: 32, color: c.gray, centerY: 190 }));
  parts.push(d.label(420, 0, "My train was cancelled and I missed the last connection.", { size: 32, color: c.yellow, keepCase: true, centerY: 190 }));
  parts.push(d.label(1670, 0, "0.31", { size: 32, color: c.yellow, anchor: "end", centerY: 190 }));
  parts.push(d.label(340, 0, "2", { size: 32, color: c.gray, centerY: 260 }));
  parts.push(d.label(420, 0, "We landed in Lisbon three hours late.", { size: 32, keepCase: true, centerY: 260 }));
  parts.push(d.label(300, 0, "by keywords", { size: 32, color: c.gray, anchor: "end", centerY: 360 }));
  parts.push(d.label(420, 0, "nothing: no card shares a word with the question", { size: 32, color: c.light, centerY: 360 }));
  if (step >= 1) {
    parts.push(d.line(40, 450, 1640, 450, { color: c.dark, width: 2 }));
    parts.push(d.label(300, 0, "one word", { size: 32, color: c.gray, anchor: "end", centerY: 540 }));
    const rows = [["river", ["card 20", "0.49"], ["card 3", "0.20"]], ["snake", ["card 8", "0.46"], ["card 12", "0.24"]]];
    rows.forEach(([word, first, second], r) => {
      const cy = 540 + r * 110;
      parts.push(d.box(340, cy - 32, 180, 64, word, { size: 32, mono: true, border: c.yellow, color: c.yellow }));
      parts.push(d.arrow(540, cy, 620, cy, { color: c.gray, width: 2 }));
      parts.push(rich(660, cy, [[first[0] + "  ", c.blue], [first[1], c.white]], { size: 48 }));
      parts.push(rich(1100, cy, [[second[0] + "  ", c.blue], [second[1], c.white]], { size: 48 }));
    });
  }
  return d.svg(1680, 780, ...parts);
}
function showSearch(slide, step) { if ($("fig-search")) $("fig-search").innerHTML = figSearch(step || 0); }

/* ------------------------------------------------------------------ */
/* about the same, or the same?                                        */
/* ------------------------------------------------------------------ */
function figLimits(step) {
  const c = C();
  // Four pairs every 180 from 70: the sentences in 32 on one line, the bar
  // below them, 1200 units for a value of 1, the value 24 after the bar.
  // The longest line, the vaccines, is 54 x 19.2 = 1037 wide.
  const W = c.white, P = c.blue, G = c.gray;
  const rows = [
    [[["I love this film.", W], ["   ·   ", G], ["I do ", W], ["not", P], [" love this film.", W]], 0.74],
    [[["I love this film.", W], ["   ·   ", G], ["What a wonderful movie!", W]], 0.59],
    [[["The ", W], ["dog", P], [" bit the ", W], ["man", P], [".", W], ["   ·   ", G], ["The ", W], ["man", P], [" bit the ", W], ["dog", P], [".", W]], 0.97],
    [[["Vaccines cause autism.", W], ["   ·   ", G], ["Vaccines do ", W], ["not", P], [" cause autism.", W]], 0.86],
  ];
  const parts = [];
  rows.slice(0, step >= 1 ? 4 : 2).forEach(([sentence, value], r) => {
    const top = 70 + r * 180;
    parts.push(rich(40, top, sentence, { size: 32, keepCase: true }));
    parts.push(`<rect x="40" y="${top + 40}" width="${(value * 1200).toFixed(0)}" height="40" fill="${c.light}"/>`);
    parts.push(d.label(40 + value * 1200 + 24, 0, value.toFixed(2), { size: 48, centerY: top + 60 }));
  });
  return d.svg(1680, 780, ...parts);
}
function showLimits(slide, step) { if ($("fig-limits")) $("fig-limits").innerHTML = figLimits(step || 0); }

/* ------------------------------------------------------------------ */
/* similarity is one sum                                               */
/* ------------------------------------------------------------------ */
function figSum(step) {
  const c = C();
  // The first six of the 384 numbers of cards 1 and 7, as the model gives
  // them (knowledge/media/datasets/meaning_vectors.csv), and their products.
  // Columns every 200 from 360 (right-aligned at col + 160), "…" at 1580;
  // "−0.0022" is 7 x 19.2 = 134 wide.
  const a = [-0.0189, -0.0445, 0.0417, 0.0777, 0.0544, 0.0546];
  const b = [0.1159, 0.0211, 0.0192, 0.0385, 0.0392, -0.0357];
  const fmt = (v) => (v < 0 ? "−" : "") + Math.abs(v).toFixed(4);
  const col = (k) => 360 + k * 200 + 160;
  const parts = [];
  const row = (cy, name, vals, colour) => {
    parts.push(d.label(40, 0, name, { size: 32, color: c.gray, centerY: cy }));
    vals.forEach((v, k) => parts.push(d.label(col(k), 0, fmt(v), { size: 32, mono: true, color: colour, anchor: "end", centerY: cy })));
    parts.push(d.label(1580, 0, "…", { size: 32, color: c.gray, centerY: cy }));
  };
  row(80, "card 1", a, c.white);
  row(180, "card 7", b, c.white);
  if (step >= 1) {
    a.forEach((_, k) => parts.push(d.label(col(k) - 67, 0, "×", { size: 32, color: c.gray, anchor: "middle", centerY: 130 })));
    parts.push(d.line(360, 240, 1640, 240, { color: c.gray, width: 2 }));
    row(300, "products", a.map((v, k) => Math.round(v * b[k] * 10000) / 10000), c.light);
  }
  if (step >= 2) {
    parts.push(rich(1640, 420, [["sum of all 384 = ", c.white], ["0.32", c.yellow]], { size: 48, anchor: "end" }));
    parts.push(d.formula(840, 0, "similarity = a_1b_1 + a_2b_2 + … + a_{384}b_{384}", { size: 48, anchor: "middle", centerY: 600 }));
  }
  return d.svg(1680, 780, ...parts);
}
function showSum(slide, step) { if ($("fig-sum")) $("fig-sum").innerHTML = figSum(step || 0); }

/* ------------------------------------------------------------------ */
/* what real systems do with it                                        */
/* ------------------------------------------------------------------ */
function figRag() {
  const c = C();
  return d.svg(1680, 780,
    d.ipo(40, "a question", "embedding model\nand search", "the nearest\nparagraphs"),
    d.ipo(260, "question and\nparagraphs", "language model", "an answer"),
    d.label(840, 0, "retrieval-augmented generation", { size: 48, anchor: "middle", centerY: 520 }),
    d.label(840, 0, "search · recommendations · duplicate questions · inside every language model", { size: 32, color: c.gray, anchor: "middle", centerY: 620 }),
  );
}

/* ------------------------------------------------------------------ */
/* draw the still figures once, on load                                */
/* ------------------------------------------------------------------ */
[["fig-sheet", figSheet], ["fig-table", figTable], ["fig-back", figBack], ["fig-tokens", figTokens],
 ["fig-stages", figStages], ["fig-shadow", figShadow], ["fig-rag", figRag]].forEach(([id, fn]) => {
  if ($(id)) $(id).innerHTML = fn();
});
drawArith();
