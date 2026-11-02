// Drawings and animations of "types of variables".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Text widths are
// estimated as characters x size x 0.6, in Arial as in the code font.
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);
const W32 = 19.2; // one character at 32

/* --- the types of R and their colours -----------------------------------------
 * As in "vectors and data frames in R": double orange, integer turquoise,
 * character purple, logical yellow; the factor, new in this deck, is red. */
const TYPE = { dbl: d.color("groups-g1"), int: d.color("groups-g3"), chr: d.color("groups-g2"), lgl: C.yellow, fct: C.red, ord: C.red };

/* --- five games of the room, the first four as a table ---------------------------- */
const PRIZE = [2, 1, 3, 3, 1];
const CHOICE = [2, 3, 1, 1, 1];
const OPENS = [1, 2, 2, 2, 3];
const DECISION = ["stay", "switch", "stay", "switch", "switch"];

/* --- slide: one row per game, one column per fact -----------------------------------
 * Figure 1680 x 660 (has-punch). Columns in the code font at 32, each 48 wider
 * than its name: game 40..180, prize_door 180..420, contestant_choice
 * 420..794 (326 + 48), monty_opens 794..1054, decision 1054..1254. Header at
 * y 130, rule at 160, four rows on a pitch of 64 from y 200 to 392. Numbers
 * right-aligned 24 from the right edge of their column, text left-aligned 24
 * from the left. Step 1 frames row 2, step 2 the column prize_door, step 3 the
 * cell decision of game 4; the current frame is yellow, earlier ones gray.
 * Labels on the right from x 1300 ("observation (row)" is about 326 wide),
 * the column label under its column at y 480. */
const TABLE_COLS = [
  { key: "game", x: 40, w: 140 }, { key: "prize_door", x: 180, w: 240 }, { key: "contestant_choice", x: 420, w: 374 },
  { key: "monty_opens", x: 794, w: 260 }, { key: "decision", x: 1054, w: 200 },
];
window.drawTable = function (_slide, step = 0) {
  const rows = [0, 1, 2, 3].map((k) => ({ game: k + 1, prize_door: PRIZE[k], contestant_choice: CHOICE[k], monty_opens: OPENS[k], decision: DECISION[k] }));
  const cy = (k) => 200 + 64 * k;
  const at = (c, v) => (typeof v === "number" ? c.x + c.w - 24 : c.x + 24);
  const anchor = (v) => (typeof v === "number" ? "end" : "start");
  const parts = [];
  TABLE_COLS.forEach((c) => {
    parts.push(d.label(at(c, rows[0][c.key]), 0, c.key, { size: 32, mono: true, anchor: anchor(rows[0][c.key]), centerY: 130, color: C.gray }));
    rows.forEach((r, k) => parts.push(d.label(at(c, r[c.key]), 0, String(r[c.key]), { size: 32, mono: true, anchor: anchor(r[c.key]), centerY: cy(k) })));
  });
  parts.push(d.line(40, 160, 1254, 160, { color: C.dark }));
  const frame = (n, x, y, w, h) => (step < n ? "" :
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="${step === n ? C.yellow : C.gray}" stroke-width="4"/>`);
  const note = (n, x, cyText, text, o = {}) => (step < n ? "" : d.label(x, 0, text, { size: 32, centerY: cyText, color: C.light, ...o }));
  parts.push(frame(1, 36, cy(1) - 26, 1222, 52), note(1, 1300, cy(1), "observation (row)"),
    frame(2, 184, 104, 232, 318), note(2, 300, 480, "variable (column)", { anchor: "middle" }),
    frame(3, 1058, cy(3) - 26, 192, 52), note(3, 1300, cy(3), "value (cell)"));
  el("fig-table").innerHTML = d.svg(1680, 660, ...parts);
};

/* --- slide: a variable varies ----------------------------------------------------------
 * Figure 1680 x 660 (has-punch). Two columns of five cells 240 x 56 on a pitch
 * of 70 from y 112: decision around x 420 in white, number_of_doors around
 * x 1260 in gray. Names above at y 50 in the code font ("number_of_doors" is
 * 288 wide); below each column a word at 48 (y 520) and a line at 32 (y 580,
 * "differs from game to game" is about 480 wide, centred at 420: 180..660). */
(function () {
  const column = (cx, name, values, color) => [
    d.label(cx, 0, name, { size: 32, mono: true, anchor: "middle", centerY: 50, color: C.light }),
    ...values.map((v, k) => d.box(cx - 120, 112 + 70 * k, 240, 56, String(v), { border: color, color, size: 32, mono: true, rx: 6 })),
  ];
  el("fig-constant").innerHTML = d.svg(1680, 660,
    ...column(420, "decision", DECISION, C.white),
    ...column(1260, "number_of_doors", [3, 3, 3, 3, 3], C.gray),
    d.label(420, 0, "variable", { size: 48, anchor: "middle", centerY: 520 }),
    d.label(420, 0, "differs from game to game", { size: 32, anchor: "middle", centerY: 580, color: C.gray }),
    d.label(1260, 0, "constant", { size: 48, anchor: "middle", centerY: 520, color: C.gray }),
    d.label(1260, 0, "the same in every game", { size: 32, anchor: "middle", centerY: 580, color: C.gray }));
})();

/* --- the tree of types, on "types of variables" and "every scale has its type in R" ---
 * Figure 1680 x 660. Root 400 x 64 around x 840 ("types of variables" at 32 is
 * 346 + 2 x 20); three branches 260 x 64 at y 170 around 420, 1100 and 1540
 * ("categorical" and "qualitative" are 211 + 2 x 20), the last ending at 1670;
 * four leaves 220 x 64 at y 320 around 240, 600, 920 and 1280. Connectors run
 * at right angles and are drawn before the boxes, which cover their ends. */
const BRANCHES = [{ text: "categorical", cx: 420 }, { text: "numerical", cx: 1100 }, { text: "qualitative", cx: 1540 }];
const LEAVES = [{ text: "nominal", cx: 240 }, { text: "ordinal", cx: 600 }, { text: "interval", cx: 920 }, { text: "ratio", cx: 1280 }];
const QUALITATIVE_CX = 1540;
function tree(showLeaves) {
  const wires = [
    d.line(840, 84, 840, 127, { color: C.gray }), d.line(420, 127, 1540, 127, { color: C.gray }),
    ...BRANCHES.map((b) => d.line(b.cx, 127, b.cx, 170, { color: C.gray })),
  ];
  const boxes = [d.box(640, 20, 400, 64, "types of variables", { size: 32 }),
    ...BRANCHES.map((b) => d.box(b.cx - 130, 170, 260, 64, b.text, { size: 32 }))];
  if (showLeaves) {
    [[420, 240, 600], [1100, 920, 1280]].forEach(([from, a, b]) => wires.push(
      d.line(from, 234, from, 277, { color: C.gray }), d.line(a, 277, b, 277, { color: C.gray }),
      d.line(a, 277, a, 320, { color: C.gray }), d.line(b, 277, b, 320, { color: C.gray })));
    boxes.push(...LEAVES.map((l) => d.box(l.cx - 110, 320, 220, 64, l.text, { size: 32, border: C.light })));
  }
  return d.layers(wires, boxes);
}

/* Step 2 of "types of variables": one example per leaf and for free text, the
 * name in the code font at y 440 ("organic_share" is 250 wide around 600) and
 * a few values in gray at y 495. */
window.drawTree = function (_slide, step = 0) {
  const examples = [
    { cx: 240, name: "decision", values: '"stay", "switch"' }, { cx: 600, name: "organic_share", values: "1 to 5" },
    { cx: 920, name: "year", values: "1994, 2026" }, { cx: 1280, name: "price", values: "1.51" },
    { cx: QUALITATIVE_CX, name: "comment", values: "free text", plain: true },
  ];
  const parts = [tree(step >= 1)];
  if (step >= 2) examples.forEach((e) => parts.push(
    d.label(e.cx, 0, e.name, { size: 32, mono: true, anchor: "middle", centerY: 440, color: C.light }),
    d.label(e.cx, 0, e.values, { size: 32, mono: !e.plain, anchor: "middle", centerY: 495, color: C.gray })));
  el("fig-tree").innerHTML = d.svg(1680, 660, ...parts);
};

/* "every scale has its type in R": the same tree with all leaves, and under
 * each leaf the types R uses, as a tibble prints them, in their colours. A
 * type is 5 characters (96 wide at 32) with 24 between, the group centred
 * under its leaf: three types under nominal span 336 (72..408). Step 1 the
 * categorical types, step 2 the numerical ones, step 3 free text. */
window.drawTypes = function (_slide, step = 0) {
  const groups = [
    { cx: 240, types: ["chr", "lgl", "fct"], step: 1 }, { cx: 600, types: ["ord"], step: 1 },
    { cx: 920, types: ["dbl", "int"], step: 2 }, { cx: 1280, types: ["dbl", "int"], step: 2 },
    { cx: QUALITATIVE_CX, types: ["chr"], step: 3 },
  ];
  const parts = [tree(true)];
  groups.filter((g) => step >= g.step).forEach((g) => {
    const width = g.types.length * 96 + (g.types.length - 1) * 24;
    g.types.forEach((t, k) => parts.push(d.label(g.cx - width / 2 + 120 * k, 0, `<${t}>`,
      { size: 32, mono: true, centerY: 440, color: TYPE[t], keepCase: true })));
  });
  el("fig-types").innerHTML = d.svg(1680, 660, ...parts);
};

/* --- slide: what each scale allows ---------------------------------------------------
 * Figure 1680 x 660 (has-punch). Header at y 100 in gray, four questions
 * centred at 420, 680, 940 and 1200 ("equal or not" is about 230 wide), the
 * examples left-aligned at 1360 ("organic_share" ends at 1610). Rule at 136,
 * rows at y 200, 300, 400, 500 with the scale at 48 on the left. A green tick
 * where the question may be asked, a short dark dash where not; one row more
 * per step. */
window.drawAllows = function (_slide, step = 0) {
  const questions = [{ text: "equal or not", cx: 420 }, { text: "order", cx: 680 }, { text: "differences", cx: 940 }, { text: "ratios", cx: 1200 }];
  const scales = [["nominal", "decision"], ["ordinal", "organic_share"], ["interval", "year"], ["ratio", "price"]];
  const parts = questions.map((q) => d.label(q.cx, 0, q.text, { size: 32, anchor: "middle", centerY: 100, color: C.gray }));
  parts.push(d.label(1360, 0, "example", { size: 32, centerY: 100, color: C.gray }), d.line(2, 136, 1678, 136, { color: C.dark }));
  scales.slice(0, step + 1).forEach(([scale, example], i) => {
    const cy = 200 + 100 * i;
    parts.push(d.label(0, 0, scale, { size: 48, centerY: cy }));
    questions.forEach((q, j) => parts.push(j <= i ? d.mark(q.cx, cy, true) : d.line(q.cx - 16, cy, q.cx + 16, cy, { color: C.dark, width: 4 })));
    parts.push(d.label(1360, 0, example, { size: 32, mono: true, centerY: cy, color: C.light }));
  });
  el("fig-allows").innerHTML = d.svg(1680, 660, ...parts);
};

/* --- slide: door 3 is not three times door 1 ------------------------------------------
 * Figure 1680 x 660 (has-punch). Three doors 160 x 300 at x 40, 250, 460
 * (y 80..380), their numbers at 48 in the middle. On the right the code at 48
 * from x 700: "prize_door <- c(2, 1, 3, 3, 1)" is 864 wide and ends at 1564,
 * mean(prize_door) is 461, its result 2 after an arrow at 1200..1280. Below the
 * claim as a judged box 976 x 150 from x 700, ending at 1676 (2 inside the
 * edge for the half stroke); the claim at 32 is about 691 wide. */
(function () {
  const door = (x, n) => d.box(x, 80, 160, 300, "", { border: C.white, width: 3, fill: "none" }) +
    d.label(x + 80, 0, String(n), { size: 48, anchor: "middle", centerY: 230 });
  el("fig-doors").innerHTML = d.svg(1680, 660,
    door(40, 1), door(250, 2), door(460, 3),
    d.label(700, 0, "prize_door <- c(2, 1, 3, 3, 1)", { size: 48, mono: true, centerY: 120, keepCase: true }),
    d.label(700, 0, "mean(prize_door)", { size: 48, mono: true, centerY: 220 }),
    d.arrow(1200, 220, 1280, 220, { color: C.gray, width: 3 }),
    d.label(1310, 0, "2", { size: 48, mono: true, centerY: 220, color: TYPE.dbl }),
    d.verdict(700, 320, 976, 150, "the average car stands behind door 2", false, { size: 32 }));
})();

/* --- slide: ten degrees are not twice as warm as five ------------------------------------
 * Figure 1680 x 660 (has-punch), animated in one section. Left: two
 * thermometers around x 300 and 540, tube 40 x 300 from y 90, bulb at y 420;
 * the column maps -10..40 °C to y 370..110, so 5 °C stands at 292 and 10 °C at
 * 266. The readings at 48 under the bulbs (y 500), a sentence at 32 around 420
 * (y 590). Right: two prices in boxes 240 x 100 around x 1140 and 1420 (y
 * 220..320), "200 ct" at 48 is 173 wide; the sentence around 1280 ("200 is still
 * twice 100" is about 420 wide). The section swaps every number to the other
 * unit at once; the thermometers do not move, because the heat stays the same. */
(function () {
  const level = (t) => 370 - (t + 10) * 5.2;
  const thermo = (cx, t) =>
    `<rect x="${cx - 10}" y="${level(t)}" width="20" height="${420 - level(t)}" fill="${C.light}"/>` +
    `<circle cx="${cx}" cy="420" r="26" fill="${C.light}"/>` +
    `<rect x="${cx - 20}" y="90" width="40" height="320" rx="20" fill="none" stroke="${C.light}" stroke-width="3"/>` +
    `<circle cx="${cx}" cy="420" r="34" fill="none" stroke="${C.light}" stroke-width="3"/>`;
  const reading = (name, cx, text) => d.g(name, d.label(cx, 0, text, { size: 48, anchor: "middle", centerY: 500, keepCase: true }));
  const price = (name, cx, text) => d.g(name, d.label(cx, 0, text, { size: 48, anchor: "middle", centerY: 270 }));
  const sentence = (name, cx, text) => d.g(name, d.label(cx, 0, text, { size: 32, anchor: "middle", centerY: 590, color: C.light }));
  el("fig-zero").innerHTML = d.svg(1680, 660,
    d.label(420, 0, "temperature", { size: 32, anchor: "middle", centerY: 40, color: C.gray }),
    d.label(1280, 0, "price", { size: 32, anchor: "middle", centerY: 40, color: C.gray }),
    thermo(300, 5), thermo(540, 10),
    reading("c5", 300, "5 °C"), reading("c10", 540, "10 °C"), reading("f41", 300, "41 °F"), reading("f50", 540, "50 °F"),
    sentence("twice-c", 420, "10 is twice 5"), sentence("twice-f", 420, "50 is not twice 41"),
    d.box(1020, 220, 240, 100, "", { border: C.light }), d.box(1300, 220, 240, 100, "", { border: C.light }),
    price("e1", 1140, "1 €"), price("e2", 1420, "2 €"), price("ct100", 1140, "100 ct"), price("ct200", 1420, "200 ct"),
    sentence("twice-e", 1280, "2 is twice 1"), sentence("twice-ct", 1280, "200 is still twice 100"));
  // a change of unit is reversible, so ← plays it backwards
  const a = d.anim("fig-zero", { back: "play" });
  a.step(a.par(a.swap("c5", "f41", { dur: 1500 }), a.swap("c10", "f50", { dur: 1500 }), a.swap("twice-c", "twice-f", { dur: 1500 }),
    a.swap("e1", "ct100", { dur: 1500 }), a.swap("e2", "ct200", { dur: 1500 }), a.swap("twice-e", "twice-ct", { dur: 1500 })));
})();

/* --- slide: is a rating scale ordinal or interval? -----------------------------------------
 * Figure 1680 x 660 (has-punch). The variable name at y 40, five answer boxes
 * 160 x 100 on a pitch of 200 from x 360 (y 80..180), the meaning of 1 and 5 at
 * y 225 under the outer boxes. Two positions as boxes 820 x 160 at y 300, from
 * x 2 and from x 856 (ending at 1676, 2 inside the edge). Each holds two lines
 * left-aligned 40 from its edge: the line centres at 359 and 401 leave 43
 * above the first (32 high) and 43 below the second. The second line is code,
 * its result in gray after two spaces; the medians and means are those of the
 * 30 people in the survey sample (median 2, mean 71 / 30 = 2.366667; "# 2.366667" ends at 896 + 40 + 31 x 19.2 = 1531). */
(function () {
  const position = (x, title, code, result) => [
    d.box(x, 300, 820, 160, "", { border: C.light }),
    d.label(x + 40, 0, title, { size: 32, centerY: 359 }),
    d.label(x + 40, 0, code, { size: 32, mono: true, centerY: 401 }),
    d.label(x + 40 + (code.length + 2) * W32, 0, result, { size: 32, mono: true, centerY: 401, color: C.gray }),
  ];
  el("fig-rating").innerHTML = d.svg(1680, 660,
    d.label(840, 0, "organic_share", { size: 32, mono: true, anchor: "middle", centerY: 40, color: C.light }),
    ...[1, 2, 3, 4, 5].map((n, k) => d.box(360 + 200 * k, 80, 160, 100, String(n), { size: 48, mono: true, border: C.light })),
    d.label(440, 0, "hardly any", { size: 32, anchor: "middle", centerY: 225, color: C.gray }),
    d.label(1240, 0, "almost all", { size: 32, anchor: "middle", centerY: 225, color: C.gray }),
    ...position(2, "purists: it is ordinal", "median(organic_share)", "# 2"),
    ...position(856, "pragmatists: five or more steps", "mean(organic_share)", "# 2.366667"));
})();

/* --- slide: what you may compute ------------------------------------------------------------
 * Figure 1680 x 660 (has-punch). Columns: scale 0..220, count 220..420,
 * location 420..780, spread 780..1140, ratios 1140..1400, picture 1400..1680;
 * entries left-aligned 24 from the left edge of their column. The widest,
 * "median()  mean()", is 16 characters, 307 + 24 in a column of 360; "ordered bars"
 * is about 230 in a column of 280. Header at y 100, rule at 136, rows at y 200,
 * 290, 380, 470. What a row adds is white, what it keeps from the row above is
 * gray; one row more per step. */
window.drawCompute = function (_slide, step = 0) {
  const cols = { count: 220, location: 420, spread: 780, ratios: 1140, picture: 1400 };
  const N = true, I = false; // new on this row, or kept from the row above
  const rows = [
    { scale: "nominal", count: [["count()", N]], picture: [["bar chart", N]] },
    { scale: "ordinal", count: [["count()", I]], location: [["median()", N]], spread: [["quantile()", N]], picture: [["ordered bars", N]] },
    { scale: "interval", count: [["count()", I]], location: [["median()", I], ["mean()", N]], spread: [["quantile()", I], ["sd()", N]], picture: [["histogram", N]] },
    { scale: "ratio", count: [["count()", I]], location: [["median()", I], ["mean()", I]], spread: [["quantile()", I], ["sd()", I]], ratios: [["new / old", N]], picture: [["histogram", I]] },
  ];
  const parts = Object.entries(cols).map(([name, x]) => d.label(x + 24, 0, name, { size: 32, centerY: 100, color: C.gray }));
  parts.push(d.line(2, 136, 1678, 136, { color: C.dark }));
  rows.slice(0, step + 1).forEach((r, i) => {
    const cy = 200 + 90 * i;
    parts.push(d.label(0, 0, r.scale, { size: 32, centerY: cy }));
    Object.entries(cols).forEach(([name, x]) => {
      let at = x + 24;
      (r[name] || []).forEach(([text, isNew]) => {
        parts.push(d.label(at, 0, text, { size: 32, mono: name !== "picture", centerY: cy, color: isNew ? C.white : C.gray }));
        at += (text.length + 2) * W32;
      });
    });
  });
  el("fig-compute").innerHTML = d.svg(1680, 660, ...parts);
};
