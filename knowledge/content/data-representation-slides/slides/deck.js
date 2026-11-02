// Drawings and animations of "vectors and data frames in R".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80).
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);

/* --- the four types and their colours -----------------------------------------
 * double orange, integer turquoise, character purple, logical yellow, through the
 * whole deck. Logical values follow the rule of yellow as 1: TRUE is yellow,
 * FALSE stays dark. Green and red only judge (won, lost). */
const TYPE = { double: "groups-g1", integer: "groups-g3", character: "groups-g2", logical: "yellow" };
const tc = (type) => (type === "logical" ? C.yellow : d.color(TYPE[type]));

// a value in a box, in the colour of its type; FALSE gets the dark frame of a 0
function cellBox(x, y, w, h, value, type, o = {}) {
  const off = type === "logical" && value === false;
  const color = off ? C.gray : tc(type);
  return d.box(x, y, w, h, typeof value === "boolean" ? String(value).toUpperCase() : String(value),
    { border: off ? C.dark : color, color, size: o.size || 32, mono: true, rx: 6, width: o.width || 2, keepCase: true });
}

/* --- five rounds of the game, the first five of the project phase "vectors" --- */
const PRIZE = [2, 1, 3, 3, 1];
const CHOICE = [2, 3, 1, 1, 1];
const OPENS = [1, 2, 2, 2, 3];
const DECISION = ["stay", "switch", "stay", "switch", "switch"];
const VECTORS = [
  { name: "prize_door", values: PRIZE, type: "double" },
  { name: "contestant_choice", values: CHOICE, type: "double" },
  { name: "monty_opens", values: OPENS, type: "double" },
  { name: "decision", values: DECISION, type: "character" },
];
const STAY = DECISION.map((v) => v === "stay");
const FIRST_RIGHT = PRIZE.map((p, k) => p === CHOICE[k]);

/* --- slide: four shapes of data ------------------------------------------------
 * Figure 1680 x 660 (has-punch). Cells 56 x 40 on a pitch of 44, five rows from
 * y 60 down to 496; the text column of the data frame is 140 wide ("switch" in
 * the code font at 32 is 115). x: scalar 138, vector 518, matrix 838/898/958,
 * data frame 1230/1290/1350/1410..1550; the span 138..1550 sits in the middle.
 * The names stand under each shape at y 560. */
(function () {
  const Y = (k) => 60 + 44 * k;
  const column = (name, x, v, w = 56) => d.g(name, ...v.values.map((val, k) => cellBox(x, Y(k), w, 40, val, v.type)));
  const name = (n, cx, text) => d.g(n, d.label(cx, 0, text, { size: 32, anchor: "middle", centerY: 560 }));
  el("fig-shapes").innerHTML = d.svg(1680, 660,
    cellBox(138, Y(0), 56, 40, 2, "double"), name("lab-scalar", 166, "scalar value"),
    ...PRIZE.map((val, k) => d.g("v" + k, cellBox(518, Y(k), 56, 40, val, "double"))), name("lab-vector", 546, "vector"),
    column("m0", 838, VECTORS[0]), column("m1", 898, VECTORS[1]), column("m2", 958, VECTORS[2]), name("lab-matrix", 926, "matrix"),
    column("f0", 1230, VECTORS[0]), column("f1", 1290, VECTORS[1]), column("f2", 1350, VECTORS[2]), column("f3", 1410, VECTORS[3], 140),
    name("lab-frame", 1390, "data frame"));
  const a = d.anim("fig-shapes");
  // the vector grows downwards cell by cell, and the single value gets its name
  a.step(a.show("lab-scalar", { dur: 300 }), ...PRIZE.map((v, k) => a.show("v" + k, { dur: 70 })), a.show("lab-vector", { dur: 300 }));
  // three vectors of one type side by side: a block
  a.step(...[0, 1, 2].map((k) => a.show("m" + k, { dur: 350 })), a.show("lab-matrix", { dur: 300 }));
  // the same three and a column of text: every column has its own type
  a.step(...[0, 1, 2, 3].map((k) => a.show("f" + k, { dur: 350 })), a.show("lab-frame", { dur: 300 }));
})();

/* --- slide: one game, four facts --------------------------------------------------
 * Figure 1680 x 804. Three doors 220 x 360 at x 40, 300, 560 (y 120..480):
 * door 1 stands open with a goat (img/goat.png, generated, 200 x 195 from y
 * 224), door 2 holds the car (Bootstrap Icons
 * "car-front-fill" 1.11.3, MIT, (c) The Bootstrap Authors). Captions under the
 * doors at 32: "opened by the host" is about 290 wide around 150, "your pick"
 * about 150 around 410. The four facts on the right in the code font at 48
 * (28.8 per character): "contestant_choice" runs from 900 to 1390, the values
 * start at 1440, "\"stay\"" ends at 1613. The sentence below in two lines. */
const CAR = '<path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>';
(function () {
  const door = (x, n, o = {}) => d.box(x, 120, 220, 360, "", { border: o.open ? C.gray : C.white, dashed: o.open, width: 3, fill: "none" }) +
    d.label(x + 110, 0, String(n), { size: 48, anchor: "middle", centerY: 180, color: o.open ? C.gray : C.white });
  const fact = (k, name, value, type) =>
    d.label(900, 0, name, { size: 48, mono: true, centerY: 180 + 90 * k, color: C.light }) +
    d.label(1440, 0, value, { size: 48, mono: true, centerY: 180 + 90 * k, color: tc(type) });
  el("fig-game").innerHTML = d.svg(1680, 804,
    door(40, 1, { open: true }), d.image(50, 224, 200, 195, "img/goat.png"),
    door(300, 2), d.icon(340, 250, 140, CAR, { color: C.light }),
    door(560, 3),
    d.label(150, 0, "opened by the host", { size: 32, anchor: "middle", centerY: 530, color: C.gray }),
    d.label(410, 0, "your pick", { size: 32, anchor: "middle", centerY: 530, color: C.gray }),
    fact(0, "prize_door", "2", "double"), fact(1, "contestant_choice", "2", "double"),
    fact(2, "monty_opens", "1", "double"), fact(3, "decision", '"stay"', "character"),
    d.label(40, 0, "a game show with three doors: you pick one, the host opens another\nwith a goat behind it, and you stay with your door or switch.",
      { size: 32, centerY: 690, color: C.light, lineHeight: 1.4 }));
})();

/* --- slide: the same position, the same round ----------------------------------------
 * Figure 1680 x 660 (has-punch). Five cells per row on a pitch of 300, 280 wide,
 * x = 6 + 300 k, so the last ends at 1486. Positions 1..5 above at y 24; the
 * name of each vector above its row (y 66 + 128 r, 18 free above the cells), the cells below it (top
 * 100 + 128 r, 52 high). The marker is one frame per row around position k,
 * grouped, so it moves as one; it never covers a name. The sentence for the
 * round at y 610, swapped between round 1 and round 4. */
const ROW_CELL = (k) => 6 + 300 * k;
const ROW_W = 280;
(function () {
  const parts = PRIZE.map((v, k) => d.label(ROW_CELL(k) + ROW_W / 2, 0, String(k + 1), { size: 32, mono: true, anchor: "middle", centerY: 24, color: C.gray }));
  VECTORS.forEach((v, r) => {
    parts.push(d.label(6, 0, v.name, { size: 32, mono: true, centerY: 66 + 128 * r, color: C.light }));
    v.values.forEach((val, k) => parts.push(cellBox(ROW_CELL(k), 100 + 128 * r, ROW_W, 52, val, v.type)));
  });
  parts.push(d.g("marker", ...VECTORS.map((v, r) =>
    `<rect x="${ROW_CELL(0) - 5}" y="${95 + 128 * r}" width="${ROW_W + 10}" height="62" rx="9" fill="none" stroke="${C.yellow}" stroke-width="4"/>`)));
  const round = (k) => `round ${k + 1}: car behind door ${PRIZE[k]}, door ${CHOICE[k]} picked, host opened door ${OPENS[k]}, player ${DECISION[k] === "stay" ? "stayed" : "switched"}`;
  parts.push(d.g("round1", d.label(6, 0, round(0), { size: 32, centerY: 610 })),
             d.g("round4", d.label(6, 0, round(3), { size: 32, centerY: 610 })));
  el("fig-position").innerHTML = d.svg(1680, 660, ...parts);
  const a = d.anim("fig-position");
  a.step(a.par(a.show("marker", { dur: 500 }), a.show("round1", { dur: 500 })));
  a.step(a.par(a.move("marker", 3 * 300, 0, { dur: 1200 }), a.swap("round1", "round4", { dur: 600 })));
})();

/* --- slide: one vector, one type --------------------------------------------------
 * Figure 1680 x 660 (has-punch). Three columns: what you write (code font at
 * 32, the longest, c("stay", "switch"), is 365 wide), the vector R holds
 * (boxes 170 x 64 on a pitch of 186 from x 520, three at most, to 1062;
 * '"switch"' in the code font at 32 is 154) and
 * what typeof() answers, at 1240 in the colour of the type. Rows at y 150,
 * 270, 390, 510; headers in gray at y 40. */
(function () {
  const rows = [
    { code: "c(2, 1, 3)", values: [2, 1, 3], type: "double" },
    { code: "c(2L, 1L, 3L)", values: [2, 1, 3], type: "integer" },
    { code: 'c("stay", "switch")', values: ['"stay"', '"switch"'], type: "character" },
    { code: "c(TRUE, FALSE)", values: [true, false], type: "logical" },
  ];
  const parts = [
    d.label(0, 0, "you write", { size: 32, centerY: 40, color: C.gray }),
    d.label(520, 0, "R holds", { size: 32, centerY: 40, color: C.gray, keepCase: true }),
    d.label(1240, 0, "typeof()", { size: 32, mono: true, centerY: 40, color: C.gray }),
  ];
  rows.forEach((r, i) => {
    const cy = 150 + 120 * i;
    parts.push(d.label(0, 0, r.code, { size: 32, mono: true, centerY: cy, keepCase: true }));
    r.values.forEach((v, k) => parts.push(cellBox(520 + 186 * k, cy - 32, 170, 64, v, r.type)));
    parts.push(d.label(1240, 0, `"${r.type}"`, { size: 32, mono: true, centerY: cy, color: tc(r.type) }));
  });
  el("fig-types").innerHTML = d.svg(1680, 660, ...parts);
})();

/* --- slide: when types meet ------------------------------------------------------
 * Figure 1680 x 660 (has-punch). Code at 48 on the left (c(1, TRUE, "stay") is
 * 518 wide), boxes 200 x 80 on a pitch of 224 from x 600 (three end at 1248),
 * the resulting type at 1330 in the code font at 48 ("\"character\"" is 317,
 * ends at 1647). Row 1 at y 180, row 2 at y 380. What R really does: c()
 * converts every value straight to the most general type, so TRUE becomes 1
 * next to a number and "TRUE" next to text. The order of the types runs below
 * at y 540, drawn with arrows between the names (logical 134 wide, double 115,
 * character 173 in the code font at 32). */
(function () {
  const row = (cy, values, types) => values.map((v, k) => cellBox(600 + 224 * k, cy - 40, 200, 80, v, types[k], { size: 48 }));
  const code = (cy, text) => d.label(0, 0, text, { size: 48, mono: true, centerY: cy, keepCase: true });
  const type = (name, cy, t) => d.g(name, d.label(1330, 0, `"${t}"`, { size: 48, mono: true, centerY: cy, color: tc(t) }));
  el("fig-coerce").innerHTML = d.svg(1680, 660,
    code(180, "c(1, TRUE)"), ...row(180, [1], ["double"]),
    d.g("a-old", cellBox(824, 140, 200, 80, true, "logical", { size: 48 })),
    d.g("a-new", cellBox(824, 140, 200, 80, 1, "double", { size: 48 })), type("a-type", 180, "double"),
    code(380, 'c(1, TRUE, "stay")'),
    d.g("b-old", ...row(380, [1, true, '"stay"'], ["double", "logical", "character"])),
    d.g("b-new", ...row(380, ['"1"', '"TRUE"', '"stay"'], ["character", "character", "character"])), type("b-type", 380, "character"),
    d.g("chain",
      d.label(494, 0, "logical", { size: 32, mono: true, centerY: 540, color: tc("logical") }),
      d.arrow(654, 540, 734, 540, { color: C.gray, width: 3 }),
      d.label(764, 0, "double", { size: 32, mono: true, centerY: 540, color: tc("double") }),
      d.arrow(904, 540, 984, 540, { color: C.gray, width: 3 }),
      d.label(1014, 0, "character", { size: 32, mono: true, centerY: 540, color: tc("character") })));
  const a = d.anim("fig-coerce");
  a.step(a.swap("a-old", "a-new", { dur: 800 }), a.show("a-type", { dur: 500 }));
  a.step(a.swap("b-old", "b-new", { dur: 800 }), a.par(a.show("b-type", { dur: 500 }), a.show("chain", { dur: 500 })));
})();

/* --- slide: comparing whole vectors ---------------------------------------------------
 * Figure 1680 x 660 (has-punch). Names on the left in the code font at 32
 * ("contestant_choice" is 326), cells from x 380 on a pitch of 200, 180 wide,
 * the last ending at 1360: prize_door at y 120, contestant_choice at y 220,
 * the result at y 380 ("FALSE" is 96 < 116). A frame runs over both values of
 * one position while the answer appears below it; the expression stands under
 * the result at y 480. */
(function () {
  const X = (k) => 380 + 200 * k;
  const parts = [
    d.label(0, 0, "prize_door", { size: 32, mono: true, centerY: 120, color: C.light }),
    d.label(0, 0, "contestant_choice", { size: 32, mono: true, centerY: 220, color: C.light }),
  ];
  PRIZE.forEach((v, k) => parts.push(cellBox(X(k), 92, 180, 56, v, "double"), cellBox(X(k), 192, 180, 56, CHOICE[k], "double"),
    d.g("res" + k, cellBox(X(k), 352, 180, 56, FIRST_RIGHT[k], "logical"))));
  parts.push(d.g("scan", `<rect x="${X(0) - 6}" y="84" width="192" height="172" rx="10" fill="none" stroke="${C.yellow}" stroke-width="4"/>`),
    d.g("expr", d.label(X(0), 0, "prize_door == contestant_choice", { size: 32, mono: true, centerY: 480 })));
  el("fig-compare").innerHTML = d.svg(1680, 660, ...parts);
  const a = d.anim("fig-compare");
  const walk = [a.show("scan", { dur: 150 })];
  PRIZE.forEach((v, k) => {
    walk.push(a.show("res" + k, { dur: 120 }));
    if (k < PRIZE.length - 1) walk.push(a.move("scan", 200, 0, { dur: 180 }));
  });
  a.step(...walk, a.par(a.hide("scan", { dur: 200 }), a.show("expr", { dur: 400 })));
})();

/* --- slide: picking values by a condition -----------------------------------------------
 * Figure 1680 x 660 (has-punch), the same grid as the rounds: pitch 300, cells
 * 280 wide. Above decision == "stay" (cells at y 90), below first_pick_right
 * (cells at y 260). The cells below a FALSE fade and sink, the two that are
 * left close up from the left; the expression appears at y 420. */
(function () {
  const parts = [
    d.label(6, 0, 'decision == "stay"', { size: 32, mono: true, centerY: 52, color: C.light }),
    d.label(6, 0, "first_pick_right", { size: 32, mono: true, centerY: 222, color: C.light }),
  ];
  STAY.forEach((v, k) => parts.push(cellBox(ROW_CELL(k), 90, ROW_W, 56, v, "logical"),
    d.g("p" + k, cellBox(ROW_CELL(k), 260, ROW_W, 56, FIRST_RIGHT[k], "logical"))));
  parts.push(d.g("expr", d.label(6, 0, 'first_pick_right[decision == "stay"]', { size: 32, mono: true, centerY: 420 })));
  el("fig-subset").innerHTML = d.svg(1680, 660, ...parts);
  const a = d.anim("fig-subset");
  const kept = STAY.map((v, k) => (v ? k : -1)).filter((k) => k >= 0);
  a.step(
    a.par(...STAY.map((v, k) => (v ? null : a.par(a.hide("p" + k, { dur: 700 }), a.move("p" + k, 0, 60, { dur: 700 })))).filter(Boolean)),
    a.par(...kept.map((k, j) => a.move("p" + k, (j - k) * 300, 0, { dur: 900 })), a.show("expr", { dur: 600 })));
})();

/* --- slide: when a value is missing ------------------------------------------------------
 * Figure 1680 x 660 (has-punch). Left: the vector at 48 (y 80), its boxes
 * 160 x 72 on a pitch of 180 (y 164..236), then two calls with their results
 * after an arrow at x 760: mean(x, na.rm = TRUE) is 605 wide. Right of x 1080
 * three relatives of NA, each with a line of explanation from x 1200 ("0 / 0,
 * not a number" at 32 is about 300 wide). */
(function () {
  const na = d.box(180, 164, 160, 72, "NA", { border: C.gray, color: C.gray, dashed: true, size: 48, mono: true, rx: 6, keepCase: true });
  const call = (cy, code, result, color) => d.label(0, 0, code, { size: 48, mono: true, centerY: cy, keepCase: true }) +
    d.arrow(650, cy, 730, cy, { color: C.gray, width: 3 }) +
    d.label(760, 0, result, { size: 48, mono: true, centerY: cy, color, keepCase: true });
  const relative = (cy, key, text) => d.label(1080, 0, key, { size: 32, mono: true, centerY: cy, keepCase: true }) +
    d.label(1200, 0, text, { size: 32, centerY: cy, color: C.light });
  el("fig-na").innerHTML = d.svg(1680, 660,
    d.label(0, 0, "x <- c(2, NA, 3)", { size: 48, mono: true, centerY: 80, keepCase: true }),
    cellBox(0, 164, 160, 72, 2, "double", { size: 48 }), na, cellBox(360, 164, 160, 72, 3, "double", { size: 48 }),
    call(340, "mean(x)", "NA", C.gray), call(450, "mean(x, na.rm = TRUE)", "2.5", tc("double")),
    d.label(1080, 0, "related, but not the same", { size: 32, centerY: 80, color: C.gray }),
    relative(200, "NULL", "nothing at all"), relative(290, "NaN", "0 / 0, not a number"), relative(380, "Inf", "1 / 0, infinite"));
})();

/* --- slide: vectors become a table -------------------------------------------------------
 * Figure "below" with a punchline: 1680 x 528 on the canvas from y 300. The
 * header at y 30 in gray, a rule at 52, five rows on a pitch of 44 from y 74
 * to 250. Final columns: row numbers 285..355, prize_door 355..585,
 * contestant_choice 585..945 (its name is 326 + 2 x 17), monty_opens 945..1195,
 * decision 1195..1395. At first the four vectors stand apart, shifted by
 * -120, -40, 40, 120. Numbers right-aligned 24 from the column's right edge,
 * text left-aligned 24 from its left. The notes on the right start at 1430. */
(function () {
  const cols = [
    { x: 355, w: 230, off: -120 }, { x: 585, w: 360, off: -40 }, { x: 945, w: 250, off: 40 }, { x: 1195, w: 200, off: 120 },
  ];
  const cy = (k) => 74 + 44 * k;
  const text = (c, v, y, color) => v === undefined ? "" : d.label(typeof v === "number" ? c.x + c.w - 24 : c.x + 24, 0, String(v),
    { size: 32, mono: true, anchor: typeof v === "number" ? "end" : "start", centerY: y, color });
  const parts = VECTORS.map((v, i) => {
    const c = cols[i];
    return `<g transform="translate(${c.off},0)">` + d.g("col" + i,
      text(c, v.name, 30, C.gray), ...v.values.map((val, k) => text(c, val, cy(k), tc(v.type)))) + "</g>";
  });
  parts.push(d.g("rule", d.line(285, 52, 1395, 52, { color: C.dark })),
    d.g("rownums", ...PRIZE.map((v, k) => d.label(339, 0, String(k + 1), { size: 32, mono: true, anchor: "end", centerY: cy(k), color: C.gray }))),
    d.g("rowframe", `<rect x="281" y="${cy(3) - 22}" width="1118" height="44" rx="8" fill="none" stroke="${C.yellow}" stroke-width="4"/>`,
      d.label(1430, 0, "one row\nis one game", { size: 32, centerY: cy(3), color: C.light })),
    d.g("colframe", `<rect x="1191" y="10" width="208" height="262" rx="8" fill="none" stroke="${C.yellow}" stroke-width="4"/>`,
      d.label(1430, 0, "one column\nis one vector", { size: 32, centerY: 100, color: C.light })));
  el("fig-frame").innerHTML = d.svg(1680, 528, ...parts);
  const a = d.anim("fig-frame");
  a.step(a.par(...cols.map((c, i) => a.move("col" + i, -c.off, 0, { dur: 1000 }))),
    a.par(a.show("rule", { dur: 500 }), a.show("rownums", { dur: 500 })));
  a.step(a.show("rowframe", { dur: 500 }), a.show("colframe", { dur: 500 }));
})();

/* --- the first six games of the data set -------------------------------------------------- */
const GAMES = [
  { contestant: "Charles", prize_door: 3, contestant_choice: 3, monty_opens: 2, decision: "stay" },
  { contestant: "Patricia", prize_door: 1, contestant_choice: 3, monty_opens: 2, decision: "stay" },
  { contestant: "Karen", prize_door: 3, contestant_choice: 3, monty_opens: 1, decision: "stay" },
  { contestant: "Jessica", prize_door: 3, contestant_choice: 1, monty_opens: 2, decision: "stay" },
  { contestant: "Joseph", prize_door: 1, contestant_choice: 3, monty_opens: 2, decision: "stay" },
  { contestant: "Robert", prize_door: 1, contestant_choice: 3, monty_opens: 2, decision: "stay" },
];
const won = (g) => (g.decision === "stay") === (g.prize_door === g.contestant_choice);
// one column of a small table: name in gray, numbers right-aligned, text left-aligned, 24 from the edge
function tableColumn(col, rows, cyHead, cyRow, color, headColor = C.gray) {
  const at = (v) => (typeof v === "number" ? col.x + col.w - 24 : col.x + 24);
  const anchor = (v) => (typeof v === "number" ? "end" : "start");
  return d.label(at(rows[0][col.key]), 0, col.key, { size: 32, mono: true, anchor: anchor(rows[0][col.key]), centerY: cyHead, color: headColor }) +
    rows.map((r, k) => d.label(at(r[col.key]), 0, String(r[col.key]), { size: 32, mono: true, anchor: anchor(r[col.key]), centerY: cyRow(k), color: color(r[col.key]), keepCase: true })).join("");
}

/* --- slide: a vector or a table? -----------------------------------------------------------
 * Figure 1680 x 660 (has-punch). The six rows at 32 in the code font: header
 * at y 40, rule at 64, rows on a pitch of 52 from y 92 to 352. Columns:
 * contestant 0..240, prize_door 240..480, contestant_choice 480..854 (326 +
 * 48), monty_opens 854..1114, decision 1114..1314. Step 1: the values of
 * decision leave the table and lie down as a vector of boxes 140 x 56 on a
 * pitch of 150 at y 500, under the call at y 450. Step 2: a copy of the column
 * with its header moves 326 to the right (1440..1640) and keeps a frame as a
 * table, its call anchored at the right edge at y 450 (422 wide). */
(function () {
  const cols = [
    { key: "contestant", x: 0, w: 240 }, { key: "prize_door", x: 240, w: 240 }, { key: "contestant_choice", x: 480, w: 374 },
    { key: "monty_opens", x: 854, w: 260 }, { key: "decision", x: 1114, w: 200 },
  ];
  const cyRow = (k) => 92 + 52 * k;
  const typeColor = (v) => tc(typeof v === "number" ? "integer" : "character");
  const dec = cols[4];
  el("fig-access").innerHTML = d.svg(1680, 660,
    ...cols.map((c) => tableColumn(c, GAMES, 40, cyRow, typeColor)), d.line(0, 64, 1314, 64, { color: C.dark }),
    d.g("call-a", d.label(0, 0, "monty_hall$decision", { size: 32, mono: true, centerY: 450 })),
    d.g("vec-boxes", ...GAMES.map((g, j) => d.box(j * 150 + 2, 500, 140, 56, "", { border: tc("character"), fill: "none", rx: 6 }))),
    ...GAMES.map((g, k) => d.g("v" + k, d.label(dec.x + 24, 0, g.decision, { size: 32, mono: true, centerY: cyRow(k), color: tc("character") }))),
    d.g("copy-b", tableColumn(dec, GAMES, 40, cyRow, typeColor), d.line(dec.x, 64, dec.x + dec.w, 64, { color: C.dark }),
      d.box(dec.x + 4, 12, dec.w - 8, 370, "", { border: C.gray, fill: "none", rx: 8 })),
    d.g("call-b", d.label(1676, 0, 'monty_hall["decision"]', { size: 32, mono: true, anchor: "end", centerY: 450 })));
  const a = d.anim("fig-access");
  a.step(a.show("call-a", { dur: 400 }),
    a.par(...GAMES.map((g, j) => a.moveTo("v" + j, j * 150 + 72, 528, { dur: 1200 }))),
    a.show("vec-boxes", { dur: 400 }));
  a.step(a.show("call-b", { dur: 400 }), a.show("copy-b", { dur: 1 }), a.move("copy-b", 326, 0, { dur: 1200 }));
})();

/* --- slide: a new column from the others ------------------------------------------------------
 * Figure 1680 x 502 under the code (from y 470 on the canvas). The six rows
 * with prize_door 0..240, contestant_choice 240..614, decision 614..814 and
 * the new column won 814..974, its name in blue as the new part, TRUE green
 * and FALSE red because won judges the game. Header at y 30, rule at 54, rows
 * on a pitch of 52 from y 82 to 342. The note on the right from x 1100. */
(function () {
  const rows = GAMES.map((g) => ({ ...g, won: won(g) ? "TRUE" : "FALSE" }));
  const cols = [
    { key: "prize_door", x: 0, w: 240 }, { key: "contestant_choice", x: 240, w: 374 },
    { key: "decision", x: 614, w: 200 }, { key: "won", x: 814, w: 160 },
  ];
  const cyRow = (k) => 82 + 52 * k;
  const color = (v) => (v === "TRUE" ? C.green : v === "FALSE" ? C.red : tc(typeof v === "number" ? "integer" : "character"));
  el("fig-won").innerHTML = d.svg(1680, 502,
    ...cols.slice(0, 3).map((c) => tableColumn(c, rows, 30, cyRow, color)),
    tableColumn(cols[3], rows, 30, cyRow, color, C.blue),
    d.line(0, 54, 974, 54, { color: C.dark }),
    d.label(1100, 0, "a column is a vector,\nso everything from part 2\nworks on it.", { size: 32, centerY: 200, color: C.light, lineHeight: 1.4 }));
})();

/* --- slide: tidy data ------------------------------------------------------------------------
 * Figure 1680 x 660 (has-punch), after the figure in R for Data Science: three
 * panels 520 wide with 60 between, centred at 260, 840, 1420. Each holds the
 * same small table, 4 columns x 5 rows of cells 64 x 40 with 8 between (280 x
 * 232, from y 80), and marks in blue what the rule is about: every column,
 * every row, every cell. The rule in words under each panel at y 420; the
 * longest, "each observation is a row", is about 400 wide. */
(function () {
  const parts = [];
  const rules = ["each variable is a column", "each observation is a row", "each value is a cell"];
  [260, 840, 1420].forEach((cx, p) => {
    const x0 = cx - 140, y0 = 80;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++)
      parts.push(`<rect x="${x0 + 72 * c}" y="${y0 + 48 * r}" width="64" height="40" rx="4" fill="${r === 0 ? C.gray : C.dark}"/>`);
    const mark = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="${C.blue}" stroke-width="4"/>`;
    if (p === 0) for (let c = 0; c < 4; c++) parts.push(mark(x0 + 72 * c - 4, y0 - 4, 72, 240));
    if (p === 1) for (let r = 1; r < 5; r++) parts.push(mark(x0 - 4, y0 + 48 * r - 4, 288, 48));
    if (p === 2) for (let r = 1; r < 5; r++) for (let c = 0; c < 4; c++) parts.push(mark(x0 + 72 * c - 3, y0 + 48 * r - 3, 70, 46));
    parts.push(d.label(cx, 0, rules[p], { size: 32, anchor: "middle", centerY: 420 }));
  });
  el("fig-tidy").innerHTML = d.svg(1680, 660, ...parts);
})();
