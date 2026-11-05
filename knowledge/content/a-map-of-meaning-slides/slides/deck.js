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
// The cards lie freely on the sheet, each at the place where it fits, and
// the clumps only emerge from that: some tight, some loose, some cards in
// between (9, the declined card, between travel and money; 24, the
// password, between money and computers; 16, the broken wrist, at the edge
// of health). No outlines and no names, because nothing on the sheet is a
// fixed group. Cards are 120 x 64; centres differ by at least 130 across or
// 74 down, so no two overlap. Slide 6 lays its axes over the same sheet:
// the origin sits at 840, 390 and one unit is 80, so card 24 lies at (2, 1)
// and no card crosses the horizontal axis.
const CARDS = {
  1: [200, 150], 7: [330, 120], 13: [260, 230], 19: [400, 210],
  9: [560, 250], 3: [720, 180], 15: [820, 260], 21: [760, 340],
  24: [1000, 310], 6: [1180, 100], 18: [1320, 150], 12: [1460, 250],
  4: [180, 470], 22: [300, 560], 10: [150, 640], 16: [420, 660],
  5: [760, 560], 23: [880, 480], 11: [900, 630], 17: [700, 660],
  2: [1250, 520], 14: [1390, 580], 8: [1520, 470], 20: [1200, 680],
};
// The two bank and the two python cards show their shared word instead of
// their number, so nobody can tell from the sheet which card is which.
// "… python …" is 10 characters, about 180 wide in 32: these cards are 210
// wide, which none of their neighbours at the same height reaches.
const FOCUS = { 3: "bank", 20: "bank", 8: "python", 12: "python" };

// The sheet with its cards; `only` (a card or a list of cards) dims every
// other card. The frame is inset by 3 for its stroke of 2.
function sheetCards(only) {
  const c = C();
  const keep = only === undefined ? null : [].concat(only);
  const frame = `<rect x="3" y="3" width="1674" height="774" rx="12" fill="none" stroke="${c.dark}" stroke-width="2"/>`;
  const cards = Object.entries(CARDS).map(([id, [x, y]]) => {
    const n = Number(id);
    const dim = keep !== null && !keep.includes(n);
    const word = FOCUS[n];
    if (word) {
      const col = dim ? c.gray : word === "bank" ? c.blue : c.yellow;
      return d.box(x - 105, y - 32, 210, 64, `… ${word} …`, { size: 32, border: dim ? c.dark : col, color: col });
    }
    return d.box(x - 60, y - 32, 120, 64, id, { size: 32, border: dim ? c.dark : c.light, color: dim ? c.gray : c.white });
  });
  return [frame, cards];
}

function figSheet() {
  const [frame, cards] = sheetCards();
  return d.svg(1680, 780, frame, ...cards);
}

/* ------------------------------------------------------------------ */
/* a place is a list of numbers: axes laid over the same sheet         */
/* ------------------------------------------------------------------ */
function figAxes(step) {
  const c = C();
  // Origin 840, 390, one unit 80: x runs from -10 at 40 to 10 at 1640, y from
  // -4.5 to 4.5. Ticks every unit, numbers at -10, -5, 5, 10 and at -4, 4.
  // Step 0 shows the sheet of slide 5 unchanged, with the axes on top; from
  // step 1 every card but 24 is dimmed. The coordinates stand right of card
  // 24 in mono 48: "→ (2, 1, −3)" is 12 x 28.8 = 346 wide, from 1075 to 1421;
  // it spans y 286 to 334, below card 12, whose box ends at 282. The note of step 2 stands at the top from 900; "a third
  // number, a third direction" is 33 x 19.2 = 634 wide and ends at 1534,
  // above cards 6 and 18 (their tops at 98 and 138).
  const X = (u) => 840 + u * 80, Y = (v) => 390 - v * 80;
  const lines = [], labels = [];
  lines.push(d.arrow(X(-10), Y(0), X(10), Y(0), { color: c.light, width: 2 }));
  lines.push(d.arrow(X(0), Y(-4.5), X(0), Y(4.5) + 6, { color: c.light, width: 2 }));
  for (let u = -9; u <= 9; u++) if (u) lines.push(d.line(X(u), Y(0) - 6, X(u), Y(0) + 6, { color: c.light, width: 2 }));
  for (let v = -4; v <= 4; v++) if (v) lines.push(d.line(X(0) - 6, Y(v), X(0) + 6, Y(v), { color: c.light, width: 2 }));
  [-10, -5, 5, 10].forEach((u) => labels.push(d.label(X(u), 0, String(u).replace("-", "−"), { size: 32, color: c.gray, anchor: "middle", centerY: Y(0) + 34 })));
  [-4, 4].forEach((v) => labels.push(d.label(X(0) - 16, 0, String(v).replace("-", "−"), { size: 32, color: c.gray, anchor: "end", centerY: Y(v) })));

  // Step 2 reads a second card, 18 at (6, 3): its line to the y axis runs at
  // y 150, below card 6 (its box ends at 132); "→ (6, 3)" is 8 x 28.8 = 230
  // wide, from 1400 to 1630, above card 12 (from 218). Step 3 adds the third
  // number to card 24 only.
  // On step 3 card 18 steps back again: its line at x 1320 would cross the
  // longer "→ (2, 1, −3)".
  const both = step === 2;
  const [frame, cards] = sheetCards(both ? [24, 18] : step >= 1 ? 24 : undefined);
  const read = (id, x0) => {
    const [x, y] = CARDS[id];
    lines.push(d.line(x, y + 32, x, Y(0), { color: c.white, width: 2, dashed: true }));
    lines.push(d.line(x - 60, y, X(0), y, { color: c.white, width: 2, dashed: true }));
    return [x0, y];
  };
  if (step >= 1) {
    const [x0, y] = read(24, 1075);
    labels.push(rich(x0, y, step >= 3
      ? [["→ (2, 1, ", c.white], ["−3", c.blue], [")", c.white]]
      : [["→ (2, 1)", c.white]], { size: 48, mono: true }));
  }
  if (both) {
    const [x0, y] = read(18, 1400);
    labels.push(rich(x0, y, [["→ (6, 3)", c.white]], { size: 48, mono: true }));
  }
  if (step >= 3) labels.push(d.label(300, 0, "a third number, a third direction", { size: 32, color: c.blue, centerY: 40 }));
  return d.svg(1680, 780, frame, ...lines, ...cards, ...labels);
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
    // the second arrow in pink, so that it stands out where it lies on the first
    parts.push(d.arrow(o, oy, tb[0], tb[1], { color: c.blue, width: 4, head: 22 }));
    parts.push(`<circle cx="${o}" cy="${oy}" r="6" fill="${c.white}"/>`);
    parts.push(d.label(cx, 0, value, { size: 80, anchor: "middle", centerY: 520 }));
    parts.push(d.label(cx, 0, caption, { size: 32, color: c.gray, anchor: "middle", centerY: 600 }));
  });
  if (step >= 1) {
    // three lines of at most 29 characters (557 wide), centred at 1400: 1122 to 1678
    parts.push(d.label(1400, 0, "almost never with the model*:\nthe lowest of 1.3 million\nword pairs is −0.09", { size: 32, color: c.gray, anchor: "middle", centerY: 710 }));
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
  // what the two hashes mean; about 50 characters, right-aligned at 1640 (from about 760)
  parts.push(rich(1640, 720, [["##", c.blue], ["  continues the piece before it, without a space", c.gray]], { size: 32, anchor: "end" }));
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

  const lines = [], into = [], stack = [], boxes = [], labels = [];
  // The six layers of the transformer: five outlines behind every strip in
  // context, 8 up and 8 to the right each, so the stack reaches x + 100 and
  // stays clear of the next strip at x + 120. Filled with the background, so
  // the nearer ones cover the further ones.
  const layer = (x, k) => `<rect x="${x - 60 + 8 * k}" y="${400 - 8 * k}" width="120" height="120" rx="8" fill="${c.bg}" stroke="${c.dark}" stroke-width="2"/>`;
  xs.forEach((x, i) => {
    boxes.push(d.box(x - 75, 40, 150, 64, tokens[i], { size: 32, mono: true, keepCase: true, border: i === BANK ? c.blue : c.gray, color: i === BANK ? c.blue : c.white }));
    if (step >= 1) {
      lines.push(d.arrow(x, 106, x, 154, { color: c.gray, width: 2, head: 12 }));
      boxes.push(strip(x, 160, own[i], tone(i), c.gray));
    }
    if (step >= 2) {
      xs.forEach((from) => (i === BANK ? into : lines).push(d.line(from, 282, x, 398, { color: i === BANK ? c.blue : c.dark, width: i === BANK ? 2.5 : 1.5 })));
      for (let k = 5; k >= 1; k--) stack.push(layer(x, k));
      boxes.push(layer(x, 0), strip(x, 400, context[i], tone(i), c.gray));
    }
    if (step >= 3) lines.push(d.line(x, 522, centre, 618, { color: c.gray, width: 2 }));
  });
  if (step >= 3) {
    boxes.push(strip(centre, 620, text, c.white, c.blue));
    labels.push(d.label(centre + 100, 0, "one text,\n384 numbers", { size: 32, color: c.white, centerY: 680 }));
  }
  const keys = [
    [72, "cutting"], [220, "looking up\n384 numbers each"], [400, "attention:\nadjusting to\neach other"], [680, "averaging"],
  ];
  keys.forEach(([cy, words], k) => {
    if (k > step) return;
    labels.push(d.label(370, 0, words, { size: 32, color: k === step ? c.yellow : c.gray, anchor: "end", centerY: cy }));
  });
  // "in 6 layers of" is 14 characters, about 250 wide, from about 120
  if (step >= 2) labels.push(d.label(370, 0, "in 6 layers of\na transformer", { size: 32, color: step === 2 ? c.light : c.gray, anchor: "end", centerY: 545 }));
  return d.svg(1680, 760, ...d.layers(lines, into, stack, boxes, labels));
}
function showText(slide, step) { if ($("fig-text")) $("fig-text").innerHTML = figText(step || 0); }

/* ------------------------------------------------------------------ */
/* the same token, two meanings: one list of 384 numbers per "bank"     */
/* ------------------------------------------------------------------ */
function figBank() {
  const c = C();
  // Three sentences in 32 from 40, the longest "we watched the ducks from
  // the bank of the river." (48 characters, about 850 wide in the sans font)
  // ends before 900. Each gets the strip of its token "bank" after the six
  // layers, centred at 1060, and a value right-aligned at 1640 that compares
  // the strip with the first one. The strips are drawn like those of the
  // four steps: eight bars stand for 384 numbers.
  const W = c.white, P = c.blue;
  const a = numbers(31, 8), other = numbers(57, 8), near = numbers(83, 8);
  const strips = [
    a,
    a.map((v, k) => clip(0.7 * v + 0.3 * other[k])),
    a.map((v, k) => clip(0.9 * v + 0.1 * near[k])),
  ];
  const rows = [
    [[["the ", W], ["bank", P], [" raised its interest rates.", W]], ""],
    [[["we watched the ducks from the ", W], ["bank", P], [" of the river.", W]], "0.76"],
    [[["my salary goes straight to the ", W], ["bank", P], [".", W]], "0.88"],
  ];
  const lines = [], boxes = [], labels = [];
  labels.push(d.label(1060, 0, "384 numbers\nof this “bank”", { size: 32, color: c.gray, anchor: "middle", centerY: 50 }));
  labels.push(d.label(1640, 0, "similarity to\nthe first “bank”", { size: 32, color: c.gray, anchor: "end", centerY: 50 }));
  rows.forEach(([text, value], r) => {
    const cy = 200 + r * 180;
    labels.push(rich(40, cy, text, { size: 32 }));
    lines.push(d.arrow(910, cy, 985, cy, { color: c.gray, width: 2, head: 12 }));
    boxes.push(strip(1060, cy - 60, strips[r], P, r === 0 ? P : c.gray));
    if (value) labels.push(d.label(1640, 0, value, { size: 48, color: c.yellow, anchor: "end", centerY: cy }));
  });
  // the longer line has 70 characters, about 1230 wide
  labels.push(d.label(40, 0, "all three start from the same row of the table, but after the six\nlayers of the model* every “bank” has 384 numbers of its own", { size: 32, color: c.gray, centerY: 710 }));
  return d.svg(1680, 780, ...d.layers(lines, boxes, labels));
}

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
  // the longest line, "every similarity is still", has 25 characters
  labels.push(d.label(1140, 0, "only for the picture:\nevery similarity is still\ncomputed with all 384", { size: 32, color: c.white, centerY: 690 }));
  return d.svg(1680, 780, ...d.layers(lines, dots, labels));
}

/* ------------------------------------------------------------------ */
/* search by meaning                                                   */
/* ------------------------------------------------------------------ */
function figSearch() {
  const c = C();
  // Labels of the rows right-aligned at 300, content from 340. The card text
  // in 32, "my train was cancelled and i missed the last connection." (56 x
  // 19.2 = 1075), runs from 420 to 1495; its value stands right-aligned at
  // 1640. Rows a little lower than before, now that the slide has room.
  const parts = [];
  parts.push(star(370, 120, 30, c.yellow));
  parts.push(d.label(420, 0, "I can't get home tonight", { size: 48, keepCase: true, centerY: 120 }));
  parts.push(d.label(300, 0, "by meaning", { size: 32, color: c.gray, anchor: "end", centerY: 290 }));
  parts.push(d.label(340, 0, "1", { size: 32, color: c.gray, centerY: 290 }));
  parts.push(d.label(420, 0, "My train was cancelled and I missed the last connection.", { size: 32, color: c.yellow, keepCase: true, centerY: 290 }));
  parts.push(d.label(1640, 0, "0.31", { size: 32, color: c.yellow, anchor: "end", centerY: 290 }));
  parts.push(d.label(340, 0, "2", { size: 32, color: c.gray, centerY: 380 }));
  parts.push(d.label(420, 0, "We landed in Lisbon three hours late.", { size: 32, keepCase: true, centerY: 380 }));
  parts.push(d.label(1640, 0, "0.26", { size: 32, anchor: "end", centerY: 380 }));
  parts.push(d.line(40, 480, 1640, 480, { color: c.dark, width: 2 }));
  parts.push(d.label(300, 0, "by keywords", { size: 32, color: c.gray, anchor: "end", centerY: 580 }));
  parts.push(d.label(420, 0, "nothing: no card shares a word with the question", { size: 32, color: c.light, centerY: 580 }));
  return d.svg(1680, 780, ...parts);
}

/* one word as the question: the bank and python cards, with their texts */
function figWords() {
  const c = C();
  // Per word a yellow box at 40 (180 wide) and two cards from 300: number in
  // grey, text in 32 with the shared word in pink, the value right-aligned at
  // 1640. The longest text, "Python is a popular language for data
  // analysis." (49 x 19.2 = 941, in the sans font less), ends before 1360.
  const W = c.white, P = c.blue, G = c.gray;
  const groups = [
    ["river", [
      ["20", [["We watched the ducks from the ", W], ["bank", P], [" of the river.", W]], "0.49", c.yellow],
      ["3", [["The ", W], ["bank", P], [" raised its interest rates.", W]], "0.20", c.white],
    ]],
    ["snake", [
      ["8", [["A ", W], ["python", P], [" swallowed a whole rabbit.", W]], "0.46", c.yellow],
      ["12", [["Python", P], [" is a popular language for data analysis.", W]], "0.24", c.white],
    ]],
  ];
  const parts = [];
  groups.forEach(([word, cards], g) => {
    const top = 110 + g * 290;
    parts.push(d.box(40, top - 32, 180, 64, word, { size: 32, mono: true, border: c.yellow, color: c.yellow }));
    cards.forEach(([card, text, value, col], k) => {
      const cy = top + k * 90;
      // the card number right-aligned at 340, every text from 380
      parts.push(d.label(340, 0, card, { size: 32, color: G, anchor: "end", centerY: cy }));
      parts.push(rich(380, cy, text, { size: 32, keepCase: true }));
      parts.push(d.label(1640, 0, value, { size: 48, color: col, anchor: "end", centerY: cy }));
    });
  });
  parts.push(d.label(40, 0, "in their sentences, “bank” and “python” have adjusted their numbers", { size: 32, color: c.gray, centerY: 720 }));
  return d.svg(1680, 780, ...parts);
}

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
    parts.push(d.formula(840, 0, "cosine similarity = a_1b_1 + a_2b_2 + … + a_{384}b_{384}", { size: 48, anchor: "middle", centerY: 580 }));
    parts.push(d.label(840, 0, "the cosine of the angle between the two arrows, which for arrows of length 1 is just this sum", { size: 32, color: c.gray, anchor: "middle", centerY: 680 }));
  }
  return d.svg(1680, 780, ...parts);
}
function showSum(slide, step) { if ($("fig-sum")) $("fig-sum").innerHTML = figSum(step || 0); }

/* ------------------------------------------------------------------ */
/* how a language model picks the next token                          */
/* ------------------------------------------------------------------ */
function figNext(step) {
  const c = C();
  // Left column, centred at 288: the tokens so far (chips from 40, ending at
  // about 535), the layers, the list of numbers for the last position in
  // pink. Right column from 680: rows of the token table, a bar each from
  // 920 (at most 700 wide, to 1620). The bars are a sketch, not measured.
  const lines = [], boxes = [], labels = [];
  boxes.push(...chips(40, 70, ["the", "dog", "barked", "at", "the"], []));
  lines.push(d.arrow(288, 108, 288, 168, { color: c.gray, width: 2, head: 14 }));
  boxes.push(d.box(88, 175, 400, 80, "all its layers", { size: 32, border: c.gray, color: c.white }));
  lines.push(d.arrow(288, 262, 288, 316, { color: c.gray, width: 2, head: 14 }));
  boxes.push(`<rect x="228" y="320" width="120" height="120" rx="8" fill="${c.bg}"/>`, strip(288, 320, numbers(4242, 8), c.blue, c.blue));
  labels.push(d.label(288, 0, "where the next\ntoken should lie", { size: 32, color: c.blue, anchor: "middle", centerY: 515 }));
  if (step >= 1) {
    lines.push(d.arrow(370, 380, 640, 380, { color: c.gray, width: 2, head: 14 }));
    labels.push(d.label(680, 0, "every row of the token table", { size: 32, color: c.gray, centerY: 70 }));
    labels.push(d.label(1620, 0, "similarity", { size: 32, color: c.gray, anchor: "end", centerY: 70 }));
    const rows = [["postman", 0.92], ["mailman", 0.84], ["door", 0.52], ["cat", 0.36], ["invoice", 0.12]];
    rows.forEach(([word, s], r) => {
      const cy = 170 + r * 90;
      const hit = step >= 2 && r === 0;
      boxes.push(d.box(680, cy - 30, 200, 60, word, { size: 32, mono: true, keepCase: true, border: hit ? c.yellow : c.gray, color: hit ? c.yellow : c.white }));
      boxes.push(`<rect x="920" y="${cy - 20}" width="${(s * 700).toFixed(0)}" height="40" fill="${hit ? c.yellow : c.light}"/>`);
    });
    labels.push(d.label(680, 0, "… one row for every token it knows", { size: 32, color: c.gray, centerY: 620 }));
  }
  if (step >= 2) {
    labels.push(rich(40, 700, [["the dog barked at the ", c.white], ["postman", c.yellow]], { size: 48 }));
  }
  labels.push(d.label(1620, 0, "a sketch, not measured", { size: 32, color: c.gray, anchor: "end", centerY: 750 }));
  return d.svg(1680, 780, ...d.layers(lines, boxes, labels));
}
function showNext(slide, step) { if ($("fig-next")) $("fig-next").innerHTML = figNext(step || 0); }

/* ------------------------------------------------------------------ */
/* what real systems do with it                                        */
/* ------------------------------------------------------------------ */
function figRag() {
  const c = C();
  // The geometry of d.ipo, but with every text centred on the arrows at
  // y + 65: d.ipo sets its input and output from a baseline, so two lines
  // hang below the arrow.
  const row = (y, input, processing, output) => [
    d.label(300, 0, input, { size: 32, color: c.light, anchor: "middle", centerY: y + 65 }),
    d.arrow(440, y + 65, 565, y + 65, { color: c.light, width: 3, head: 16 }),
    d.box(580, y, 500, 130, processing, { border: c.light, color: c.light, size: 32, width: 3, rx: 10 }),
    d.arrow(1095, y + 65, 1220, y + 65, { color: c.light, width: 3, head: 16 }),
    d.label(1380, 0, output, { size: 32, color: c.light, anchor: "middle", centerY: y + 65 }),
  ].join("");
  return d.svg(1680, 780,
    row(40, "a question", "embedding model\nand search", "the nearest\nparagraphs"),
    row(260, "question and\nparagraphs", "language model", "an answer"),
    d.label(840, 0, "retrieval-augmented generation", { size: 48, anchor: "middle", centerY: 520 }),
    d.label(840, 0, "search · recommendations · duplicate questions", { size: 32, color: c.gray, anchor: "middle", centerY: 620 }),
  );
}

/* ------------------------------------------------------------------ */
/* draw the still figures once, on load                                */
/* ------------------------------------------------------------------ */
[["fig-sheet", figSheet], ["fig-table", figTable], ["fig-bank", figBank],["fig-back", figBack], ["fig-tokens", figTokens],
 ["fig-stages", figStages], ["fig-shadow", figShadow], ["fig-search", figSearch], ["fig-words", figWords],
 ["fig-rag", figRag]].forEach(([id, fn]) => {
  if ($(id)) $(id).innerHTML = fn();
});
drawArith();
