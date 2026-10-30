// Drawings and animations of "data transformation with R and dplyr".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80).
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);

/* --- the six rows of the survey ------------------------------------------------
 * The same rows as the verb demonstrator on the site. The table stands at the
 * same place on every slide of part 2: figures with the class "below" are
 * 1680 x 672 and map 1:1 onto the canvas (top 300, bottom 108).
 *
 * Columns in the code font at size 32 (19.2 units per character): the longest
 * value in diet, "flexitarian", is 211 + 24 padding < 300; the header
 * "organic_share" is 250, right-aligned at x + w - 24, so it starts at 646,
 * inside its column (620..920). Numbers stand right-aligned, text left-aligned. */
const ROWS = [
  { id: 1, age: 56, diet: "omnivore", organic_share: 2 },
  { id: 2, age: 55, diet: "omnivore", organic_share: 2 },
  { id: 3, age: 47, diet: "omnivore", organic_share: 1 },
  { id: 4, age: 32, diet: "omnivore", organic_share: 1 },
  { id: 5, age: 74, diet: "flexitarian", organic_share: 2 },
  { id: 6, age: 48, diet: "vegetarian", organic_share: 2 },
];
const COLS = [
  { key: "id", x: 60, w: 120, num: true },
  { key: "age", x: 180, w: 140, num: true },
  { key: "diet", x: 320, w: 300 },
  { key: "organic_share", x: 620, w: 300, num: true },
];
const RH = 64, TOP = 100;                    // row height; top of the header row
const rowY = (k) => TOP + RH * (k + 1);      // top of data row k
const mid = (y) => y + RH / 2;
const GROUP = { omnivore: "groups-g1", flexitarian: "groups-g2", vegetarian: "groups-g3" };

// one cell: numbers right-aligned with 24 padding, text left-aligned with 24
function cell(col, value, cy, o = {}) {
  const x = col.num ? col.x + col.w - 24 : col.x + 24;
  return d.label(x, 0, String(value), { size: 32, mono: true, anchor: col.num ? "end" : "start", centerY: cy, color: o.color || C.white });
}
// a header: name in gray, a rule beneath that belongs to the column
function head(col, name = "h-" + col.key) {
  return d.g(name, cell(col, col.label || col.key, mid(TOP), { color: C.gray }),
    d.line(col.x, TOP + RH, col.x + col.w, TOP + RH, { color: C.dark }));
}
// a row background: invisible on black until it takes a group colour
const rowBg = (name, x, w, y, fill = C.bg) =>
  d.g(name, `<rect x="${x}" y="${y + 4}" width="${w}" height="${RH - 8}" rx="6" fill="${fill}" fill-opacity="0.35"/>`);

/* The survey table: header and six rows, every row a group r<id>, every cell a
 * group with the class col-<key>, so an animation can move a row and still find
 * a column. opts.dy shifts single rows (blocks of group_by), opts.tint colours
 * the backgrounds by group, opts.extra adds parts to a row (marks, say). */
function surveyTable(o = {}) {
  const parts = COLS.map((c) => head(c));
  ROWS.forEach((r, k) => {
    const y = rowY(k) + ((o.dy && o.dy[r.id]) || 0);
    const fill = o.tint ? d.color(GROUP[r.diet]) : C.bg;
    parts.push(d.g("r" + r.id,
      rowBg("bg" + r.id, 60, 860, y, fill),
      ...COLS.map((c) => `<g class="col-${c.key}">${cell(c, r[c.key], mid(y))}</g>`),
      (o.extra && o.extra(r, y)) || ""));
  });
  return parts.join("");
}

/* --- slide: a question for the survey ---------------------------------------------
 * The whole survey as a pale grid, 30 rows and 11 columns: cells 140 x 12 with
 * 8 between columns and 4 between rows, 11 x 148 = 1628 wide, 30 x 16 = 480
 * high. diet and organic_share are the 7th and 8th column. */
(function () {
  const parts = [d.label(0, 0, "do vegetarians buy more organic food than others?", { size: 48, centerY: 40 })];
  for (let c = 0; c < 11; c++) {
    const bright = c === 6 || c === 7;
    for (let r = 0; r < 30; r++) {
      parts.push(`<rect x="${26 + c * 148}" y="${170 + r * 16}" width="140" height="12" rx="2" fill="${bright ? C.gray : C.dark}"/>`);
    }
  }
  // "organic_share" is 13 x 12 = 156 at size 20, 8 more than its column; its neighbours carry no label
  parts.push(d.label(26 + 6 * 148 + 70, 0, "diet", { size: 20, mono: true, anchor: "middle", centerY: 145, color: C.light }));
  parts.push(d.label(26 + 7 * 148 + 70, 0, "organic_share", { size: 20, mono: true, anchor: "middle", centerY: 145, color: C.light }));
  el("fig-question").innerHTML = d.svg(1680, 660, ...parts);
})();

/* --- slide: a table in, a table out -------------------------------------------------
 * Figure 1680 x 660 (has-punch). Mini tables of cells 60 x 36 with 6 between;
 * the input has 4 columns and 6 rows (258 x 246), the output 2 columns and 3
 * rows (126 x 120). The box is 340 wide: "transformation" is 14 x 19.2 = 269
 * plus 2 x 20 padding = 309 (Arial is narrower; the rule of thumb holds). */
function miniTable(x, y, cols, rows, fills) {
  let s = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const fill = fills ? fills(r, c) : (r === 0 ? C.light : C.gray);
    s += `<rect x="${x + c * 66}" y="${y + r * 42}" width="60" height="36" rx="4" fill="${fill}"/>`;
  }
  return s;
}
(function () {
  el("fig-inout").innerHTML = d.svg(1680, 660,
    d.arrow(420, 330, 655, 330, { color: C.gray, width: 3 }),
    d.arrow(1025, 330, 1260, 330, { color: C.gray, width: 3 }),
    d.g("box", d.box(670, 255, 340, 150, "transformation", { size: 32, width: 3 })),
    d.g("in", miniTable(120, 207, 4, 6)),
    d.g("out", miniTable(1300, 270, 2, 3)));
  const a = d.anim("fig-inout");
  a.step(a.par(a.color("box", "yellow", { dur: 500 }),
               a.seq(a.par(a.moveTo("in", 840, 330, { dur: 1200 }), a.scale("in", 0.3, { dur: 1200 })),
                     a.hide("in", { dur: 300 }))));
  a.step(a.par(a.show("out", { dur: 800 }), a.color("box", "white", { dur: 800 })));
})();

/* --- slide: six basic operations ----------------------------------------------------
 * Grid 3 x 2: cells 520 wide with 60 between (3 x 520 + 2 x 60 = 1680), 402
 * high. A pictogram is a mini table before (4 columns, 5 rows of 36 x 24 cells
 * with 4 between: 156 x 136), an arrow and the table after (up to 5 columns,
 * 196 wide, ending at x0 + 512). Below it the name in white and the question
 * in gray, both at 32; the longest question, "what is typical, how many?",
 * is 26 characters, about 420 at Arial 32 < 520. Columns appear one per step:
 * columns and rows, order and new columns, summaries and groups. */
const OPS = [
  // [column, row, name, question, before, after]
  [0, 0, "select columns", "which columns do I need?",
    { cols: 4, rows: 5, fill: (r, c) => (c === 0 || c === 2 ? "on" : "off") },
    { cols: 2, rows: 5 }],
  [0, 1, "filter rows", "who is this about?",
    { cols: 4, rows: 5, fill: (r) => (r === 1 || r === 3 ? "off" : "on") },
    { cols: 4, rows: 3 }],
  [1, 0, "sort", "what comes first?",
    { cols: 4, rows: 5, text: [3, 1, 4, 5, 2] },
    { cols: 4, rows: 5, text: [1, 2, 3, 4, 5] }],
  [1, 1, "compute new columns", "what can be derived?",
    { cols: 4, rows: 5 },
    { cols: 5, rows: 5, fill: (r, c) => (c === 4 ? "new" : "on") }],
  [2, 0, "summarize", "what is typical, how many?",
    { cols: 2, rows: 5 },
    { cols: 2, rows: 1, fill: () => "new" }],
  [2, 1, "group", "how do subgroups differ?",
    { cols: 4, rows: 5, fill: (r, c) => (c === 0 ? ["groups-g1", "groups-g2", "groups-g1", "groups-g3", "groups-g2"][r] : "on") },
    { cols: 2, rows: 3, fill: (r, c) => (c === 0 ? ["groups-g1", "groups-g2", "groups-g3"][r] : "on") }],
];
function pictoTable(x, y, t) {
  let s = "";
  const top = y + (136 - (t.rows * 28 - 4)) / 2;      // centred on the height of five rows
  for (let r = 0; r < t.rows; r++) for (let c = 0; c < t.cols; c++) {
    const kind = t.fill ? t.fill(r, c) : "on";
    const keyCol = t.text && c === 0;
    const fill = keyCol ? C.dark : kind === "on" ? C.light : kind === "off" ? C.dark : kind === "new" ? C.yellow : d.color(kind);
    s += `<rect x="${x + c * 40}" y="${top + r * 28}" width="36" height="24" rx="3" fill="${fill}"/>`;
    if (keyCol) s += d.label(x + 18, 0, String(t.text[r]), { size: 20, mono: true, anchor: "middle", centerY: top + r * 28 + 12 });
  }
  return s;
}
function drawOps(slide, step) {
  const parts = [];
  OPS.forEach(([col, row, name, question, before, after]) => {
    if (col > step) return;
    const x0 = col * 580, y0 = row * 402;
    parts.push(pictoTable(x0 + 40, y0 + 40, before),
      d.arrow(x0 + 216, y0 + 108, x0 + 296, y0 + 108, { color: C.gray, width: 3 }),
      pictoTable(x0 + 316, y0 + 40, after),
      d.label(x0 + 40, 0, name, { size: 32, centerY: y0 + 240 }),
      d.label(x0 + 40, 0, question, { size: 32, color: C.gray, centerY: y0 + 290 }));
  });
  el("fig-ops").innerHTML = d.svg(1680, 804, ...parts);
}

/* --- slide: six rows of the survey ---------------------------------------------- */
el("fig-rows").innerHTML = d.svg(1680, 672, surveyTable());

/* --- select(): the columns id and diet stay; diet moves next to id ------------------ */
(function () {
  el("fig-select").innerHTML = d.svg(1680, 672, surveyTable());
  const a = d.anim("fig-select");
  a.step(a.par(a.color("h-id", "yellow", { part: "text" }), a.color("h-diet", "yellow", { part: "text" })));
  a.step(
    a.par(a.hide("h-age"), a.hide(".col-age"), a.hide("h-organic_share"), a.hide(".col-organic_share")),
    a.par(a.move("h-diet", -140, 0), a.move(".col-diet", -140, 0)),
    a.par(a.color("h-id", "gray", { part: "text", dur: 400 }), a.color("h-diet", "gray", { part: "text", dur: 400 })));
})();

/* --- filter(): a frame runs down age, every row gets its verdict ----------------------
 * The marks stand right of the table at x 960, inside their row, so they move
 * with it. The frame is the age cell inset by 4. */
(function () {
  const keep = (r) => r.age >= 50;
  el("fig-filter").innerHTML = d.svg(1680, 672,
    surveyTable({ extra: (r, y) => d.g("m" + r.id, d.mark(960, mid(y), keep(r))) }),
    d.g("scan", d.box(184, rowY(0) + 4, 132, RH - 8, "", { border: C.yellow, fill: "none", width: 3 })));
  const a = d.anim("fig-filter");
  const walk = [a.show("scan", { dur: 200 })];
  ROWS.forEach((r, k) => {
    walk.push(a.show("m" + r.id, { dur: 200 }));
    if (k < ROWS.length - 1) walk.push(a.move("scan", 0, RH, { dur: 250 }));
  });
  walk.push(a.hide("scan", { dur: 200 }));
  a.step(...walk);
  a.step(a.par(a.hide("r3", { dur: 600 }), a.hide("r4", { dur: 600 }), a.hide("r6", { dur: 600 })),
         a.move("r5", 0, -2 * RH, { dur: 700 }));
})();

/* --- arrange(desc(age)): the rows slide to their new places --------------------------
 * New order 74, 56, 55, 48, 47, 32: row 5 to place 0, 1 to 1, 2 to 2, 6 to 3,
 * 3 to 4, 4 to 5. */
(function () {
  el("fig-arrange").innerHTML = d.svg(1680, 672, surveyTable());
  const a = d.anim("fig-arrange");
  const to = { 1: 1, 2: 2, 3: 4, 4: 5, 5: 0, 6: 3 };
  a.step(a.color(".col-age", "yellow", { part: "text", dur: 300 }),
         a.par(...ROWS.map((r, k) => a.move("r" + r.id, 0, (to[r.id] - k) * RH, { dur: 1400 }))),
         a.color(".col-age", "white", { part: "text", dur: 300 }));
})();

/* --- mutate(): a new column decade, filled row by row --------------------------------
 * decade stands right of organic_share, x 920..1120; "decade" is 6 x 19.2 = 115. */
(function () {
  const dec = { key: "decade", x: 920, w: 200, num: true };
  el("fig-mutate").innerHTML = d.svg(1680, 672, surveyTable(), head(dec),
    ...ROWS.map((r, k) => d.g("d" + r.id, cell(dec, Math.floor(r.age / 10) * 10, mid(rowY(k)), { color: C.yellow }))));
  const a = d.anim("fig-mutate");
  a.step(a.show("h-decade", { dur: 600 }));
  a.step(...ROWS.map((r) => a.seq(
    a.color(`[data-a="r${r.id}"] .col-age`, "yellow", { part: "text", dur: 120 }),
    a.show("d" + r.id, { dur: 200 }),
    a.par(a.color(`[data-a="r${r.id}"] .col-age`, "white", { part: "text", dur: 120 }),
          a.color("d" + r.id, "white", { part: "text", dur: 120 })))));
})();

/* --- summarize(): count the rows, then the ages fly into one cell --------------------
 * The result table stands right of the survey: n at 1100..1220, mean_age at
 * 1220..1440 ("mean_age" is 8 x 19.2 = 154 < 220 - 24). */
(function () {
  const n = { key: "n", x: 1100, w: 120, num: true };
  const mean = { key: "mean_age", x: 1220, w: 220, num: true };
  const age = COLS[1];
  el("fig-summarize").innerHTML = d.svg(1680, 672, surveyTable(),
    head(n, "rh-n"), head(mean, "rh-mean"),
    d.g("sum-n", cell(n, 0, mid(rowY(0)))),
    d.g("sum-mean", cell(mean, 52, mid(rowY(0)))),
    ...ROWS.map((r, k) => d.g("f" + r.id, cell(age, r.age, mid(rowY(k)), { color: C.yellow }))));
  const a = d.anim("fig-summarize");
  a.step(a.par(a.show("rh-n", { dur: 300 }), a.show("sum-n", { dur: 300 })),
    ...ROWS.map((r, k) => a.seq(
      a.par(a.color("r" + r.id, "yellow", { part: "text", dur: 150 }), a.count("sum-n", k + 1, { from: k, dur: 150 })),
      a.color("r" + r.id, "white", { part: "text", dur: 150 }))));
  a.step(a.par(a.show("rh-mean", { dur: 300 }), ...ROWS.map((r) => a.show("f" + r.id, { dur: 300 }))),
    a.par(...ROWS.map((r) => a.moveTo("f" + r.id, 1330, mid(rowY(0)), { dur: 1000 }))),
    a.par(...ROWS.map((r) => a.hide("f" + r.id, { dur: 200 })), a.show("sum-mean", { dur: 300 })),
    a.par(...COLS.map((c) => a.hide("h-" + c.key, { dur: 500 })), ...ROWS.map((r) => a.hide("r" + r.id, { dur: 500 }))),
    // the result takes the place of the survey (its n column then starts at x 60)
    a.par(...["rh-n", "rh-mean", "sum-n", "sum-mean"].map((t) => a.move(t, -1040, 0, { dur: 700 }))));
})();

/* --- group_by(): every row takes its group's colour, then the groups part --------- */
const BLOCKS = { 5: 24, 6: 48 };     // gaps between the groups: omnivore 1-4, flexitarian 5, vegetarian 6
const groupsLabel = (name) => d.g(name, d.label(60, 0, "# Groups:   diet [3]", { size: 32, mono: true, keepCase: true, color: C.gray, centerY: 50 }));
(function () {
  el("fig-group").innerHTML = d.svg(1680, 672, surveyTable(), groupsLabel("groups"));
  const a = d.anim("fig-group");
  a.step(a.par(a.show("groups", { dur: 600 }),
    ...ROWS.map((r) => a.color("bg" + r.id, GROUP[r.diet], { part: "fill", dur: 600 }))));
  a.step(a.par(a.move("r5", 0, BLOCKS[5], { dur: 700 }), a.move("r6", 0, BLOCKS[6], { dur: 700 })));
})();

/* --- group_by() and summarize(): each block collapses into one row --------------------
 * Starts where group_by() ended (tinted rows, gaps). The result has the columns
 * diet (60..360), n (360..480) and mean_age (480..700); its rows are drawn at
 * their final places and start at the top of their block, so they appear
 * where the block was and then close up in the order of the groups. */
(function () {
  const rc = [
    { key: "diet", x: 60, w: 300 },
    { key: "n", x: 360, w: 120, num: true },
    { key: "mean_age", x: 480, w: 220, num: true },
  ];
  const result = [
    { name: "q-flex", diet: "flexitarian", n: 1, mean_age: 74, from: rowY(4) + BLOCKS[5] },
    { name: "q-omni", diet: "omnivore", n: 4, mean_age: 47.5, from: rowY(0) },
    { name: "q-veg", diet: "vegetarian", n: 1, mean_age: 48, from: rowY(5) + BLOCKS[6] },
  ];
  el("fig-summarize-groups").innerHTML = d.svg(1680, 672,
    surveyTable({ dy: BLOCKS, tint: true }), groupsLabel("groups"),
    ...rc.map((c) => head(c, "rh-" + c.key)),
    ...result.map((q, k) => d.g(q.name, rowBg("qbg" + k, 60, 640, rowY(k), d.color(GROUP[q.diet])),
      ...rc.map((c) => cell(c, q[c.key], mid(rowY(k)))))));
  const a = d.anim("fig-summarize-groups");
  result.forEach((q, k) => a.set(q.name, { y: q.from - rowY(k) }));
  a.step(
    a.par(a.hide("groups", { dur: 600 }),
      ...COLS.map((c) => a.hide("h-" + c.key, { dur: 600 })),
      ...rc.map((c) => a.show("rh-" + c.key, { dur: 600 })),
      // the omnivore rows close up onto the first one and fade
      ...[1, 2, 3, 4].map((id) => a.par(a.move("r" + id, 0, -(id - 1) * RH, { dur: 900 }), a.hide("r" + id, { dur: 900 }))),
      a.hide("r5", { dur: 900 }), a.hide("r6", { dur: 900 }),
      ...result.map((q) => a.show(q.name, { dur: 900 }))),
    a.par(...result.map((q, k) => a.move(q.name, 0, rowY(k) - q.from, { dur: 800 }))));
})();

/* --- the pipe: x |> f(y) is f(x, y) --------------------------------------------------
 * Code font at 80: 48 units per character. Both lines start so that their f
 * stands at x 660: the upper x at 420 (centre 444), the lower one at
 * 660 + 2 x 48 = 756 (centre 780). */
el("fig-pipe").innerHTML = d.svg(1680, 804,
  d.label(0, 0, "you write", { size: 32, color: C.gray, centerY: 160 }),
  d.label(0, 0, "R runs", { size: 32, color: C.gray, centerY: 400, keepCase: true }),
  d.label(420, 0, "x", { size: 80, mono: true, color: C.yellow, centerY: 160 }),
  d.label(468, 0, " |> f(y)",{ size: 80, mono: true, centerY: 160 }),
  d.label(660, 0, "f(", { size: 80, mono: true, centerY: 400 }),
  d.label(756, 0, "x", { size: 80, mono: true, color: C.yellow, centerY: 400 }),
  d.label(804, 0, ", y)", { size: 80, mono: true, centerY: 400 }),
  d.arrow(456, 220, 768, 336, { color: C.yellow, width: 3, head: 18 }),
  d.label(0, 0, "read |> as \"and then\"", { size: 48, centerY: 600 }),
  d.label(0, 0, "%>% from older code means the same; ctrl+shift+m types the pipe", { size: 32, color: C.gray, centerY: 700 }));

/* --- a pipeline: the table passes four stations ----------------------------------------
 * Left the code at 32 in the code font, lines 80 apart; the longest,
 * "  summarize(n = n()) |>", is 23 x 19.2 = 442. Right a row of four stations,
 * 230 wide with 40 between (4 x 230 + 3 x 40 = 1040, x 640..1680); "summarize"
 * is 9 x 19.2 = 173 + 40 < 230. The table below the stations has the columns
 * age and diet (760..1200), after summarize() diet and n (760..1180). */
(function () {
  const lines = ["survey |>", "  filter(age >= 40) |>", "  group_by(diet) |>", "  summarize(n = n()) |>", "  arrange(desc(n))"];
  const st = ["filter", "group_by", "summarize", "arrange"];
  const T = 200;                                  // top of the table header
  const ry = (k) => T + RH * (k + 1);
  const pc = [{ key: "age", x: 760, w: 140, num: true }, { key: "diet", x: 900, w: 300 }];
  const qc = [{ key: "diet", x: 760, w: 300 }, { key: "n", x: 1060, w: 120, num: true }];
  const hd = (c, name) => d.g(name, cell(c, c.key, mid(T), { color: C.gray }), d.line(c.x, T + RH, c.x + c.w, T + RH, { color: C.dark }));
  const parts = [d.line(642, 80, 1678, 80, { color: C.dark })];   // the line through the stations, inset by 2
  // SVG collapses leading spaces, so the indentation is set in no-break spaces
  lines.forEach((l, k) => parts.push(d.g("cl" + k, d.label(0, 0, l.replace(/^ +/, (s) => " ".repeat(s.length)), { size: 32, mono: true, centerY: 80 + k * 80 }))));
  st.forEach((s, k) => parts.push(d.g("st" + (k + 1), d.box(642 + k * 270, 40, 226, 80, s, { size: 32, mono: true }))));
  pc.forEach((c) => parts.push(hd(c, "ph-" + c.key)));
  qc.forEach((c) => parts.push(hd(c, "qh-" + c.key)));
  ROWS.forEach((r, k) => parts.push(d.g("p" + r.id, rowBg("pbg" + r.id, 760, 440, ry(k)),
    ...pc.map((c) => cell(c, r[c.key], mid(ry(k)))))));
  const res = [["flexitarian", 1], ["omnivore", 3], ["vegetarian", 1]];
  res.forEach(([diet, n], k) => parts.push(d.g("q" + k, cell(qc[0], diet, mid(ry(k))), cell(qc[1], n, mid(ry(k))))));
  parts.push(d.g("pgroups", d.label(760, 0, "# Groups:   diet [3]", { size: 32, mono: true, keepCase: true, color: C.gray, centerY: 170 })));
  el("fig-pipeline").innerHTML = d.svg(1680, 804, ...parts);

  const a = d.anim("fig-pipeline");
  // the station k and its code line light up, the previous ones go back to white
  const light = (k) => a.par(
    a.color("st" + k, "yellow", { dur: 300 }), a.color("st" + k, "yellow", { part: "text", dur: 300 }),
    a.color("cl" + k, "yellow", { part: "text", dur: 300 }),
    ...(k > 1 ? [a.color("st" + (k - 1), "white", { dur: 300 }), a.color("st" + (k - 1), "white", { part: "text", dur: 300 }),
                 a.color("cl" + (k - 1), "white", { part: "text", dur: 300 })] : []));
  a.step(light(1), a.hide("p4", { dur: 500 }),
    a.par(a.move("p5", 0, -RH, { dur: 600 }), a.move("p6", 0, -RH, { dur: 600 })));
  a.step(light(2), a.par(a.show("pgroups", { dur: 600 }),
    ...ROWS.filter((r) => r.id !== 4).map((r) => a.color("pbg" + r.id, GROUP[r.diet], { part: "fill", dur: 600 }))));
  a.step(light(3), a.par(a.hide("pgroups", { dur: 700 }),
    ...pc.map((c) => a.hide("ph-" + c.key, { dur: 700 })), ...ROWS.map((r) => a.hide("p" + r.id, { dur: 700 }))),
    a.par(...qc.map((c) => a.show("qh-" + c.key, { dur: 700 })), ...[0, 1, 2].map((k) => a.show("q" + k, { dur: 700 }))));
  a.step(light(4), a.par(a.move("q1", 0, -RH, { dur: 900 }), a.move("q0", 0, RH, { dur: 900 })));
})();
