// Drawings and animations of "types of variables".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Text widths are
// estimated as characters x size x 0.6, in Arial as in the code font.
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);
const W32 = 19.2; // one character at 32

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

/* Step 2 of "types of variables": one everyday example per leaf and for free
 * text, the name in the code font at y 440 ("temp_celsius" is 230 wide around
 * 920, 805..1035) and a few values in gray at y 495 ('"blue", "brown"' is 288
 * wide around 240). The same examples stand on "what each scale allows". */
const EXAMPLES = [
  { cx: 240, name: "eye_colour", values: '"blue", "brown"' }, { cx: 600, name: "shirt_size", values: '"S", "M", "L"' },
  { cx: 920, name: "temp_celsius", values: "-3.5, 21.0" }, { cx: 1280, name: "height_cm", values: "162, 185" },
];
window.drawTree = function (_slide, step = 0) {
  const examples = [...EXAMPLES, { cx: QUALITATIVE_CX, name: "comment", values: "free text", plain: true }];
  const parts = [tree(step >= 1)];
  if (step >= 2) examples.forEach((e) => parts.push(
    d.label(e.cx, 0, e.name, { size: 32, mono: true, anchor: "middle", centerY: 440, color: C.light }),
    d.label(e.cx, 0, e.values, { size: 32, mono: !e.plain, anchor: "middle", centerY: 495, color: C.gray, keepCase: true })));
  el("fig-tree").innerHTML = d.svg(1680, 660, ...parts);
};

/* "every scale has its type in R": the same tree with all leaves, and under
 * each leaf the types R uses, as a tibble prints them. The two factor types
 * are blue, because the slide points to them; the others are light gray. A
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
      { size: 32, mono: true, centerY: 440, color: t === "fct" || t === "ord" ? C.blue : C.light, keepCase: true })));
  });
  el("fig-types").innerHTML = d.svg(1680, 660, ...parts);
};

/* --- slide: what each scale allows ---------------------------------------------------
 * Figure 1680 x 660 (has-punch). Header at y 100 in gray, four questions
 * centred at 420, 680, 940 and 1200 ("equal or not" is about 230 wide), the
 * examples left-aligned at 1360 ("temp_celsius" ends at 1590). Rule at 136,
 * rows at y 200, 300, 400, 500 with the scale at 48 on the left. A green tick
 * where the question may be asked, a short dark dash where not; one row more
 * per step. */
window.drawAllows = function (_slide, step = 0) {
  const questions = [{ text: "equal or not", cx: 420 }, { text: "order", cx: 680 }, { text: "differences", cx: 940 }, { text: "ratios", cx: 1200 }];
  const scales = LEAVES.map((l, i) => [l.text, EXAMPLES[i].name]);
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
 * Figure 1680 x 660 (has-punch). Left the five games of the room as a grid:
 * the door numbers at 48 above three columns around x 300, 460 and 620, the
 * games at 32 in gray from x 40 ("game 5" is 115 wide), cells 120 x 56 on a
 * pitch of 72 from y 130 (the last ends at 474). The cell with the car is
 * framed in white and says "car", the others are dark and empty. Under each
 * column how often the car stood there, at 48 (y 540). Right, from x 840, the
 * two calls at 48: mean(prize_door) is 461 wide (to 1301), its result after an
 * arrow at 1330..1410; table(prize_door) is 490 wide, and R's answer below it
 * as R prints it, the doors in gray and the counts in white. */
(function () {
  const COLS = [300, 460, 620];
  const top = (k) => 130 + 72 * k;
  const cells = [];
  PRIZE.forEach((prize, k) => {
    cells.push(d.label(40, 0, `game ${k + 1}`, { size: 32, centerY: top(k) + 28, color: C.gray }));
    COLS.forEach((cx, j) => cells.push(j + 1 === prize
      ? d.box(cx - 60, top(k), 120, 56, "car", { size: 32, border: C.white, width: 3 })
      : d.box(cx - 60, top(k), 120, 56, "", { border: C.dark })));
  });
  const counts = COLS.map((_, j) => PRIZE.filter((p) => p === j + 1).length);
  el("fig-doors").innerHTML = d.svg(1680, 660,
    ...COLS.map((cx, j) => d.label(cx, 0, String(j + 1), { size: 48, anchor: "middle", centerY: 80 })),
    ...cells,
    d.label(40, 0, "cars", { size: 32, centerY: 540, color: C.gray }),
    ...COLS.map((cx, j) => d.label(cx, 0, String(counts[j]), { size: 48, anchor: "middle", centerY: 540 })),
    d.label(840, 0, "mean(prize_door)", { size: 48, mono: true, centerY: 160 }),
    d.arrow(1330, 160, 1410, 160, { color: C.gray, width: 3 }),
    d.label(1440, 0, "2", { size: 48, mono: true, centerY: 160, color: C.gray }),
    d.label(840, 0, "table(prize_door)", { size: 48, mono: true, centerY: 320 }),
    d.label(840, 0, "1 2 3", { size: 48, mono: true, centerY: 410, color: C.gray }),
    d.label(840, 0, counts.join(" "), { size: 48, mono: true, centerY: 480 }));
})();

/* --- slide: ten degrees are not twice as warm as five ------------------------------------
 * Figure 1680 x 660 (has-punch), animated in one section. Left: two
 * thermometers around x 320 and 520 on one shared scale, -10..40 °C at
 * y 380..120 (5.2 per degree, so 5 °C stands at 302, 10 °C at 276 and 0 °C at
 * 328). Each is one outline: a tube 44 wide with a round top, flowing into a
 * bulb of radius 40 around y 440, the tube meeting the bulb where it is 44
 * wide (y 406.6). Inside a column 16 wide and a filled bulb of radius 30.
 * Ticks every 5 degrees on the right of each tube, longer every 10; the
 * numbers of the scale at 32 left of the first, ending at x 270 ("104" is 58
 * wide). A dashed line marks where water freezes, its label at 32 from x 610
 * (about 250 wide). The readings at 48 under the bulbs (y 530), a sentence at
 * 32 around 420 (y 605). Right: two prices in boxes 240 x 100 around x 1140
 * and 1420 (y 220..320), "200 ct" at 48 is 173 wide; the sentence around 1280
 * ("200 is still twice 100" is about 420 wide). The section swaps every
 * number to the other unit at once, the scale with them; the columns do not
 * move, because the heat stays the same. */
(function () {
  const level = (t) => 380 - (t + 10) * 5.2;
  const TUBE = 22, BULB_Y = 440, BULB_R = 40;
  const neck = BULB_Y - Math.sqrt(BULB_R ** 2 - TUBE ** 2);
  const SCALE = [-10, 0, 10, 20, 30, 40];
  const fahrenheit = (c) => c * 9 / 5 + 32;
  const thermo = (cx, t) => {
    const ticks = [];
    for (let v = -10; v <= 40; v += 5) ticks.push(d.line(cx + TUBE, level(v), cx + TUBE + (v % 10 === 0 ? 22 : 12), level(v), { color: C.gray }));
    const top = level(40) - 8;
    return `<path d="M${cx - TUBE},${neck} L${cx - TUBE},${top} A${TUBE},${TUBE} 0 0 1 ${cx + TUBE},${top} ` +
      `L${cx + TUBE},${neck} A${BULB_R},${BULB_R} 0 1 1 ${cx - TUBE},${neck} Z" fill="${C.bg}" stroke="${C.light}" stroke-width="3"/>` +
      `<circle cx="${cx}" cy="${BULB_Y}" r="30" fill="${C.white}"/>` +
      `<rect x="${cx - 8}" y="${level(t)}" width="16" height="${BULB_Y - level(t)}" rx="4" fill="${C.white}"/>` + ticks.join("");
  };
  const scale = (unit, convert) => SCALE.map((v) => d.g(`${unit}${v}`,
    d.label(270, 0, String(convert(v)), { size: 32, anchor: "end", centerY: level(v), color: C.gray })));
  const reading = (name, cx, text) => d.g(name, d.label(cx, 0, text, { size: 48, anchor: "middle", centerY: 530, keepCase: true }));
  const price = (name, cx, text) => d.g(name, d.label(cx, 0, text, { size: 48, anchor: "middle", centerY: 270 }));
  const sentence = (name, cx, text) => d.g(name, d.label(cx, 0, text, { size: 32, anchor: "middle", centerY: 605, color: C.light }));
  el("fig-zero").innerHTML = d.svg(1680, 660,
    d.label(420, 0, "temperature", { size: 32, anchor: "middle", centerY: 40, color: C.gray }),
    d.label(1280, 0, "price", { size: 32, anchor: "middle", centerY: 40, color: C.gray }),
    d.line(320 - TUBE, level(0), 590, level(0), { color: C.gray, dashed: true }),
    d.label(610, 0, "water freezes", { size: 32, centerY: level(0), color: C.gray }),
    thermo(320, 5), thermo(520, 10),
    ...scale("c", (v) => v), ...scale("f", fahrenheit),
    reading("c5", 320, "5 °C"), reading("c10", 520, "10 °C"), reading("f41", 320, "41 °F"), reading("f50", 520, "50 °F"),
    sentence("twice-c", 420, "10 is twice 5"), sentence("twice-f", 420, "50 is not twice 41"),
    d.box(1020, 220, 240, 100, "", { border: C.light }), d.box(1300, 220, 240, 100, "", { border: C.light }),
    price("e1", 1140, "1 €"), price("e2", 1420, "2 €"), price("ct100", 1140, "100 ct"), price("ct200", 1420, "200 ct"),
    sentence("twice-e", 1280, "2 is twice 1"), sentence("twice-ct", 1280, "200 is still twice 100"));
  // a change of unit is reversible, so ← plays it backwards
  const a = d.anim("fig-zero", { back: "play" });
  a.step(a.par(...SCALE.map((v) => a.swap(`c${v}`, `f${v}`, { dur: 1500 })),
    a.swap("c5", "f41", { dur: 1500 }), a.swap("c10", "f50", { dur: 1500 }), a.swap("twice-c", "twice-f", { dur: 1500 }),
    a.swap("e1", "ct100", { dur: 1500 }), a.swap("e2", "ct200", { dur: 1500 }), a.swap("twice-e", "twice-ct", { dur: 1500 })));
})();

/* --- slide: is a rating scale ordinal or interval? -----------------------------------------
 * Figure 1680 x 660 (has-punch). Left the answers of the 30 people in
 * milk_survey.csv as bars, 7, 13, 5, 2 and 3 for the values 1 to 5: bars 100
 * wide on a pitch of 150 around x 180..780, baseline at y 380, 20 per person
 * (13 reach y 120), the count at 32 above each bar, the values at 32 in the
 * code font below (y 415) and the meaning of 1 and 5 under them (y 455,
 * "hardly any" is 192 wide around 180). Under the bars the same values as a
 * line (y 540) with the two summaries as dots: the median at 2, the mean at
 * 2.37, their names at 32 below, the median's ending 20 left of its dot and
 * the mean's starting 20 right of it. Right, from x 1000, the two calls at 32
 * under their reading ("median(organic_share)  # 2" is 26 x 19.2 = 499 wide,
 * "mean(organic_share)  # 2.366667" 31 x 19.2 = 595, to 1595). */
(function () {
  const COUNTS = [7, 13, 5, 2, 3];
  const n = COUNTS.reduce((s, c) => s + c, 0);
  const mean = COUNTS.reduce((s, c, k) => s + c * (k + 1), 0) / n;
  const x = (value) => 180 + 150 * (value - 1);
  const bars = COUNTS.flatMap((c, k) => [
    `<rect x="${x(k + 1) - 50}" y="${380 - 20 * c}" width="100" height="${20 * c}" fill="${C.gray}"/>`,
    d.label(x(k + 1), 0, String(c), { size: 32, anchor: "middle", centerY: 380 - 20 * c - 26 }),
    d.label(x(k + 1), 0, String(k + 1), { size: 32, mono: true, anchor: "middle", centerY: 415, color: C.light }),
  ]);
  const dot = (value) => `<circle cx="${x(value)}" cy="540" r="12" fill="${C.white}"/>`;
  const reading = (cy, title, code, result) => [
    d.label(1000, 0, title, { size: 32, centerY: cy, color: C.gray }),
    d.label(1000, 0, code, { size: 32, mono: true, centerY: cy + 50 }),
    d.label(1000 + (code.length + 2) * W32, 0, result, { size: 32, mono: true, centerY: cy + 50, color: C.gray }),
  ];
  el("fig-rating").innerHTML = d.svg(1680, 660,
    d.label(480, 0, "organic_share", { size: 32, mono: true, anchor: "middle", centerY: 40, color: C.light }),
    ...bars,
    d.line(x(1) - 70, 380, x(5) + 70, 380, { color: C.light }),
    d.label(x(1), 0, "hardly any", { size: 32, anchor: "middle", centerY: 455, color: C.gray }),
    d.label(x(5), 0, "almost all", { size: 32, anchor: "middle", centerY: 455, color: C.gray }),
    d.line(x(1), 540, x(5), 540, { color: C.dark, width: 3 }),
    ...[1, 2, 3, 4, 5].map((v) => d.line(x(v), 528, x(v), 552, { color: C.dark, width: 3 })),
    dot(2), dot(mean),
    d.label(x(2) - 20, 0, "median", { size: 32, anchor: "end", centerY: 590 }),
    d.label(x(mean) + 20, 0, "mean", { size: 32, centerY: 590 }),
    ...reading(200, "as an ordinal scale", "median(organic_share)", "# 2"),
    ...reading(360, "as an interval scale", "mean(organic_share)", "# 2.366667"));
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
