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
 * Figure 1680 x 660 (has-punch), everything centred on y 300. Mini tables of
 * cells 48 x 30 with 6 between (54 per column, 36 per row): the survey has 4
 * columns and 6 rows (210 x 210), the first result 3 x 4 (156 x 138), the
 * second 2 x 2 (102 x 66). Boxes are 260 wide: "transformation" at Arial 32 is
 * about 205. A copy of each table flies into the box, the table itself stays,
 * and the result goes on into the next transformation.
 * x: survey 0..210, box 310..570, result 670..826, box 926..1186,
 * result 1286..1388, an arrow to a small chart at 1500..1680, because a chart
 * is where most transformations in data analysis end. The arrow out of a box
 * appears with the table that comes out of it. The bars are plain and carry
 * the letters A, B, C under the axis, at 20 centred on the bar. */
function miniTable(x, y, cols, rows) {
  let s = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    s += `<rect x="${x + c * 54}" y="${y + r * 36}" width="48" height="30" rx="4" fill="${r === 0 ? C.light : C.gray}"/>`;
  return s;
}
(function () {
  const arrow = (name, x1, x2) => d.g(name, d.arrow(x1, 300, x2, 300, { color: C.gray, width: 3 }));
  const box = (name, x) => d.g(name, d.box(x, 240, 260, 120, "transformation", { size: 32, width: 3 }));
  el("fig-inout").innerHTML = d.svg(1680, 660,
    d.g("t0", miniTable(0, 195, 4, 6)), arrow("a1", 228, 298), box("box1", 310), arrow("a2", 582, 652),
    d.g("t1", miniTable(670, 231, 3, 4)), arrow("a3", 844, 914), box("box2", 926), arrow("a4", 1198, 1268),
    d.g("t2", miniTable(1286, 267, 2, 2)), arrow("a5", 1406, 1476),
    // the goal of the chain: a chart, axes 1500..1680 x 210..390, three bars
    d.g("axes", d.line(1500, 210, 1500, 390, { color: C.gray, width: 3 }), d.line(1500, 390, 1680, 390, { color: C.gray, width: 3 })),
    ...[[1520, 140, "A"], [1574, 90, "B"], [1628, 60, "C"]].map(([x, h, name], k) =>
      d.g("bar" + k, `<rect x="${x}" y="${388 - h}" width="36" height="${h}" rx="3" fill="${C.light}"/>`,
        d.label(x + 18, 0, name, { size: 20, anchor: "middle", keepCase: true, color: C.gray, centerY: 414 }))),
    d.g("c0", miniTable(0, 195, 4, 6)), d.g("c1", miniTable(670, 231, 3, 4)));
  const a = d.anim("fig-inout");
  // a copy of the table flies into the box and shrinks there; the table itself stays
  const feed = (copy, boxName, cx) => a.seq(a.show(copy, { dur: 1 }),
    a.par(a.color(boxName, "yellow", { dur: 400 }), a.moveTo(copy, cx, 300, { dur: 1100 }), a.scale(copy, 0.3, { dur: 1100 })),
    a.hide(copy, { dur: 250 }));
  a.step(feed("c0", "box1", 440));
  a.step(a.par(a.show("a2", { dur: 700 }), a.show("t1", { dur: 700 }), a.color("box1", "white", { dur: 700 })));
  a.step(a.par(a.show("a3", { dur: 400 }), a.show("box2", { dur: 400 })),
    feed("c1", "box2", 1056),
    a.par(a.show("a4", { dur: 600 }), a.show("t2", { dur: 600 }), a.color("box2", "white", { dur: 600 })));
  a.step(a.par(a.show("a5", { dur: 500 }), a.show("axes", { dur: 500 })),
    ...[0, 1, 2].map((k) => a.show("bar" + k, { dur: 300 })));
})();

/* --- slide: six basic operations ----------------------------------------------------
 * Grid 3 x 2 in reading order: cells 520 wide with 60 between (3 x 520 + 2 x
 * 60 = 1680), 402 high. Every name and its question stand from the start (32,
 * white and gray; the longest question, "what is typical, how many?", is about
 * 420 at Arial 32 < 520). One step per operation: the table appears (5 rows of
 * 36 x 24 cells with 4 between, 40 per column and 28 per row, 136 high), a copy
 * of it moves 276 to the right and changes there the way the operation changes
 * a table. The last step adds the dplyr verb under every name.
 * Every cell is a group with the classes r<row> and c<column>, so a step can
 * move or recolour a row or a column of the copy. */
const OPS = [
  { name: "select columns", q: "which columns do I need?", verb: "select()", cols: 4,
    fill: (r, c) => (c === 0 || c === 2 ? "on" : "off") },
  { name: "filter rows", q: "who is this about?", verb: "filter()", cols: 4,
    fill: (r) => (r === 1 || r === 3 ? "off" : "on") },
  { name: "sort", q: "what comes first?", verb: "arrange()", cols: 4, text: [3, 1, 4, 5, 2] },
  { name: "compute new columns", q: "what can be derived?", verb: "mutate()", cols: 4, extra: 1 },
  { name: "summarize", q: "what is typical, how many?", verb: "summarize()", cols: 4 },
  { name: "group", q: "how do subgroups differ?", verb: "group_by()", cols: 4 },
];
const OP_GROUPS = ["groups-g1", "groups-g2", "groups-g1", "groups-g3", "groups-g2"];
function pictoTable(name, x, y, t, extra = 0) {
  let s = "";
  for (let r = 0; r < 5; r++) for (let c = 0; c < t.cols + extra; c++) {
    const keyCol = t.text && c === 0;
    const kind = c >= t.cols ? "new" : t.fill ? t.fill(r, c) : "on";
    const fill = keyCol || kind === "off" ? C.dark : kind === "new" ? C.yellow : C.light;
    s += `<g class="r${r} c${c}"><rect x="${x + c * 40}" y="${y + r * 28}" width="36" height="24" rx="3" fill="${fill}"/>` +
      (keyCol ? d.label(x + 18, 0, String(t.text[r]), { size: 20, mono: true, anchor: "middle", centerY: y + r * 28 + 12 }) : "") + "</g>";
  }
  return d.g(name, s);
}
(function () {
  const parts = [];
  OPS.forEach((t, k) => {
    const x0 = (k % 3) * 580, y0 = Math.floor(k / 3) * 402;
    parts.push(pictoTable("o" + k + "b", x0 + 40, y0 + 40, t),
      d.g("o" + k + "a", d.arrow(x0 + 216, y0 + 108, x0 + 296, y0 + 108, { color: C.gray, width: 3 })),
      pictoTable("o" + k + "c", x0 + 40, y0 + 40, t, t.extra || 0),
      d.label(x0 + 40, 0, t.name, { size: 32, centerY: y0 + 240 }),
      d.label(x0 + 40, 0, t.q, { size: 32, color: C.gray, centerY: y0 + 290, keepCase: true }),   // "I" stays upper case
      d.g("o" + k + "v", d.label(x0 + 40, 0, t.verb, { size: 32, mono: true, color: C.blue, centerY: y0 + 345 })));
  });
  el("fig-ops").innerHTML = d.svg(1680, 804, ...parts);

  const a = d.anim("fig-ops");
  const cells = (k, cls) => `[data-a="o${k}c"] .${cls}`;
  const rows = [0, 1, 2, 3, 4];
  const change = [
    // select: two columns go, the third closes up
    () => a.seq(a.par(a.hide(cells(0, "c1"), { dur: 400 }), a.hide(cells(0, "c3"), { dur: 400 })),
                a.move(cells(0, "c2"), -40, 0, { dur: 500 })),
    // filter: two rows go, the rest close up
    () => a.seq(a.par(a.hide(cells(1, "r1"), { dur: 400 }), a.hide(cells(1, "r3"), { dur: 400 })),
                a.par(a.move(cells(1, "r2"), 0, -28, { dur: 500 }), a.move(cells(1, "r4"), 0, -56, { dur: 500 }))),
    // sort: every row slides to the place of its number
    () => a.par(...OPS[2].text.map((v, r) => a.move(cells(2, "r" + r), 0, (v - 1 - r) * 28, { dur: 900 }))),
    // mutate: the new column fills row by row
    () => a.seq(...rows.map((r) => a.show(cells(3, "r" + r + ".c4"), { dur: 150 }))),
    // summarize: all rows fall into the first, which keeps only the two computed columns
    () => a.seq(a.par(...rows.slice(1).map((r) => a.par(a.move(cells(4, "r" + r), 0, -r * 28, { dur: 700 }), a.hide(cells(4, "r" + r), { dur: 700 })))),
                a.par(a.hide(cells(4, "r0.c2"), { dur: 300 }), a.hide(cells(4, "r0.c3"), { dur: 300 }),
                      a.color(cells(4, "r0") + " rect", "yellow", { part: "fill", dur: 300 }))),
    // group: every row takes the colour of its group, nothing else changes
    () => a.par(...rows.map((r) => a.color(cells(5, "r" + r) + " rect", OP_GROUPS[r], { part: "fill", dur: 700 }))),
  ];
  OPS.forEach((t, k) => a.step(
    a.par(a.show("o" + k + "b", { dur: 300 }), a.show("o" + k + "c", { dur: 300 })),
    a.par(a.show("o" + k + "a", { dur: 600 }), a.move("o" + k + "c", 276, 0, { dur: 600 })),
    change[k]()));
  a.step(a.par(...OPS.map((t, k) => a.show("o" + k + "v", { dur: 600 }))));
})();

/* --- slide: the rules of the verbs, on filter() ---------------------------------------
 * Figure "below" (1680 x 672). The call in the code font at 80, 48 units per
 * character, starting at x 0: "filter" 0..5, "(" 6, "survey" 7..12, "," 13,
 * "age" 15..17, ">= 50)" 19..24, so survey is centred at 480 and age at 792,
 * and the call ends at 1200. Each step points at one part with a note at 32:
 * above survey, below age, and right of the call the new table (4 x 3 cells
 * of 48 x 30, 1360..1570) with two lines beneath. The last step turns the
 * call into the pipe form: survey moves to the front of line 1 (y 200) next to
 * a new |>, and "  filter(age >= 50)" closes up on line 2 (y 320). */
(function () {
  const code = (name, i, text, color = C.white) =>
    d.g(name, d.label(i * 48, 0, text, { size: 80, mono: true, color, centerY: 260 }));
  const note = (text, x, cy) => d.label(x, 0, text, { size: 32, anchor: "middle", centerY: cy, color: C.light });
  el("fig-rules").innerHTML = d.svg(1680, 672,
    code("k-verb", 0, "filter", C.blue), code("k-p", 6, "("), code("k-survey", 7, "survey"), code("k-c", 13, ","),
    code("k-age", 15, "age"), code("k-rest", 19, ">= 50)"),
    d.g("n1", note("the first argument is a table", 480, 60), d.arrow(480, 95, 480, 200, { color: C.gray, width: 3 })),
    d.g("n2", note("columns by their bare name, without quotes and without $", 792, 480), d.arrow(792, 440, 792, 320, { color: C.gray, width: 3 })),
    d.g("n3", d.arrow(1230, 260, 1340, 260, { color: C.gray, width: 3 }), miniTable(1360, 209, 4, 3),
      d.label(1465, 0, "a new table comes out,\nsurvey stays as it was", { size: 32, anchor: "middle", centerY: 400, lineHeight: 1.4, color: C.light })),
    // the same call with the pipe: "survey |>" on y 200, "  filter(age >= 50)" on y 320
    d.g("k-pipe", d.label(7 * 48, 0, "|>", { size: 80, mono: true, color: C.blue, centerY: 200 })),
    d.g("n4", d.label(0, 0, "we always write it like this; more on the pipe |> later", { size: 32, centerY: 480, color: C.light })));
  const a = d.anim("fig-rules");
  a.step(a.par(a.color("k-survey", "yellow", { part: "text", dur: 400 }), a.show("n1", { dur: 600 })));
  a.step(a.par(a.color("k-survey", "white", { part: "text", dur: 400 }), a.color("k-age", "yellow", { part: "text", dur: 400 }), a.show("n2", { dur: 600 })));
  a.step(a.par(a.color("k-age", "white", { part: "text", dur: 400 }), a.show("n3", { dur: 800 })));
  // survey moves in front of the verb, the pipe joins them, the verb goes one line down
  a.step(a.par(a.hide("n1", { dur: 400 }), a.hide("n2", { dur: 400 }), a.hide("n3", { dur: 400 }), a.hide("k-c", { dur: 400 })),
    a.par(a.move("k-survey", -7 * 48, -60, { dur: 1000 }),
      ...["k-verb", "k-p"].map((t) => a.move(t, 2 * 48, 60, { dur: 1000 })),
      ...["k-age", "k-rest"].map((t) => a.move(t, -6 * 48, 60, { dur: 1000 }))),
    a.show("k-pipe", { dur: 500 }),
    a.show("n4", { dur: 500 }));
})();

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

/* --- arrange(age), then arrange(desc(age)): the rows slide to their places ----------
 * Ascending 32, 47, 48, 55, 56, 74: row 4 to place 0, 3 to 1, 6 to 2, 2 to 3,
 * 1 to 4, 5 to 5. Descending is the same order turned round. The code above
 * gets desc() with the second step (arrangeCode). As in a spreadsheet, a small
 * arrow at the header of age shows the direction: it appears pointing up and
 * turns round with desc(). It stands at x 212, between the column's left edge
 * (180) and the header "age" (238..296). */
(function () {
  const sortArrow = d.g("sortdir", `<path d="M212 146 V120 M203 130 L212 120 L221 130" fill="none" stroke="${C.yellow}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`);
  el("fig-arrange").innerHTML = d.svg(1680, 672, surveyTable(), sortArrow);
  const a = d.anim("fig-arrange");
  const asc = { 1: 4, 2: 3, 3: 1, 4: 0, 5: 5, 6: 2 };
  const sortTo = (from, to) => a.par(...ROWS.map((r) => a.move("r" + r.id, 0, (to(r) - from(r)) * RH, { dur: 1400 })));
  const k0 = (r) => ROWS.indexOf(r);
  a.step(a.par(a.color(".col-age", "yellow", { part: "text", dur: 300 }), a.show("sortdir", { dur: 300 })),
         sortTo(k0, (r) => asc[r.id]),
         a.color(".col-age", "white", { part: "text", dur: 300 }));
  a.step(a.par(a.color(".col-age", "yellow", { part: "text", dur: 300 }), a.rotate("sortdir", 180, { dur: 500 })),
         sortTo((r) => asc[r.id], (r) => 5 - asc[r.id]),
         a.color(".col-age", "white", { part: "text", dur: 300 }));
})();
function arrangeCode(slide, step) {
  slide.querySelector("#arrange-arg").innerHTML = step >= 2 ? '<span class="hl">desc</span>(age)' : "age";
}

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

/* --- summarize(): count the rows, then the organic shares fly into one cell ----------
 * The result table stands right of the survey: n at 1100..1220, mean_organic
 * at 1220..1500 ("mean_organic" is 12 x 19.2 = 230 < 280 - 24). The mean of
 * 2, 2, 1, 1, 2, 2 is 10 / 6, printed by R as 1.67. */
(function () {
  const n = { key: "n", x: 1100, w: 120, num: true };
  const mean = { key: "mean_organic", x: 1220, w: 280, num: true };
  const share = COLS[3];
  el("fig-summarize").innerHTML = d.svg(1680, 672, surveyTable(),
    head(n, "rh-n"), head(mean, "rh-mean"),
    d.g("sum-n", cell(n, 0, mid(rowY(0)))),
    d.g("sum-mean", cell(mean, "1.67", mid(rowY(0)))),
    ...ROWS.map((r, k) => d.g("f" + r.id, cell(share, r.organic_share, mid(rowY(k)), { color: C.yellow }))));
  const a = d.anim("fig-summarize");
  a.step(a.par(a.show("rh-n", { dur: 300 }), a.show("sum-n", { dur: 300 })),
    ...ROWS.map((r, k) => a.seq(
      a.par(a.color("r" + r.id, "yellow", { part: "text", dur: 150 }), a.count("sum-n", k + 1, { from: k, dur: 150 })),
      a.color("r" + r.id, "white", { part: "text", dur: 150 }))));
  a.step(a.par(a.show("rh-mean", { dur: 300 }), ...ROWS.map((r) => a.show("f" + r.id, { dur: 300 }))),
    a.par(...ROWS.map((r) => a.moveTo("f" + r.id, 1440, mid(rowY(0)), { dur: 1000 }))),
    a.par(...ROWS.map((r) => a.hide("f" + r.id, { dur: 200 })), a.show("sum-mean", { dur: 300 })),
    a.par(...COLS.map((c) => a.hide("h-" + c.key, { dur: 500 })), ...ROWS.map((r) => a.hide("r" + r.id, { dur: 500 }))),
    // the result takes the place of the survey (its n column then starts at x 60)
    a.par(...["rh-n", "rh-mean", "sum-n", "sum-mean"].map((t) => a.move(t, -1040, 0, { dur: 700 }))));
})();

/* --- group_by(): every row takes its group's colour, then the groups part --------- */
const BLOCKS = { 5: 24, 6: 48 };     // gaps between the groups: omnivore 1-4, flexitarian 5, vegetarian 6
// Both group slides carry three lines of code at 48 above the figure (down to
// y 375 on the canvas), so their drawing sits 70 lower: the label "# Groups"
// then starts below the code, and the last row still ends at 666 < 672.
const lower = (...parts) => `<g transform="translate(0,70)">${parts.join("")}</g>`;
const groupsLabel = (name) => d.g(name, d.label(60, 0, "# Groups:   diet [3]", { size: 32, mono: true, keepCase: true, color: C.gray, centerY: 50 }));
(function () {
  el("fig-group").innerHTML = d.svg(1680, 672, lower(surveyTable(), groupsLabel("groups")));
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
  el("fig-summarize-groups").innerHTML = d.svg(1680, 672, lower(
    surveyTable({ dy: BLOCKS, tint: true }), groupsLabel("groups"),
    ...rc.map((c) => head(c, "rh-" + c.key)),
    ...result.map((q, k) => d.g(q.name, rowBg("qbg" + k, 60, 640, rowY(k), d.color(GROUP[q.diet])),
      ...rc.map((c) => cell(c, q[c.key], mid(rowY(k))))))));
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
 * Code font at 80: 48 units per character. Upper line "x |> f(y)" from x 420:
 * x at 420 (centre 444), |> at 516, f(y) at 660. Lower line "f(x, y)" with its
 * f also at 660, so the slot of x is at 756 (centre 780). Step 1: x flies along
 * a curve into the slot while f( and , y) appear; step 2: how to read it;
 * step 3: the keys that type it, drawn as keycaps.
 * Keycaps: code font at 32 (19.2 per character) plus 36, 56 high, a gray
 * edge 6 below the dark cap; ctrl 0..113, shift 160..292, m 340..395. */
function keycap(x, cy, label) {
  const w = Math.round(label.length * 19.2 + 36), y = cy - 28;
  return `<rect x="${x}" y="${y + 6}" width="${w}" height="56" rx="8" fill="${C.gray}"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="56" rx="8" fill="${C.dark}" stroke="${C.gray}" stroke-width="2"/>` +
    d.label(x + w / 2, 0, label, { size: 32, mono: true, anchor: "middle", centerY: cy });
}
(function () {
  const code = (x, text, cy, color = C.white) => d.label(x, 0, text, { size: 80, mono: true, color, centerY: cy });
  const plus = (x) => d.label(x, 0, "+", { size: 32, color: C.gray, anchor: "middle", centerY: 720 });
  el("fig-pipe").innerHTML = d.svg(1680, 804,
    d.label(0, 0, "you write", { size: 32, color: C.gray, centerY: 150 }),
    code(420, "x", 150, C.yellow), d.g("pipe-a", code(516, "|>", 150)), code(660, "f(y)", 150),
    d.g("runs", d.label(0, 0, "R runs", { size: 32, color: C.gray, centerY: 390, keepCase: true })),
    d.g("f-open", code(660, "f(", 390)), d.g("f-rest", code(804, ", y)", 390)),
    d.g("route", `<path d="M444 150 C 444 300, 780 240, 780 390" fill="none" stroke="none"/>`),
    d.g("x-fly", code(420, "x", 150, C.yellow)),
    d.g("read", d.label(0, 0, "read |> as \"and then\"", { size: 48, centerY: 560 }),
      d.label(0, 0, "%>% in older code does the same", { size: 32, color: C.gray, centerY: 625 })),
    d.g("keys", keycap(0, 720, "ctrl"), plus(136), keycap(160, 720, "shift"), plus(316), keycap(340, 720, "m"),
      d.label(440, 0, "types |> in RStudio and Positron, cmd instead of ctrl on a Mac", { size: 32, color: C.light, centerY: 720, keepCase: true })));
  const a = d.anim("fig-pipe");
  a.step(a.par(a.color("pipe-a", "yellow", { part: "text", dur: 300 }), a.show("x-fly", { dur: 1 })),
    a.par(a.along("x-fly", "route", { dur: 1400 }), a.show("runs", { dur: 600 }),
      a.show("f-open", { dur: 600 }), a.show("f-rest", { dur: 600 })),
    a.color("pipe-a", "white", { part: "text", dur: 300 }));
  a.step(a.show("read", { dur: 600 }));
  a.step(a.show("keys", { dur: 600 }));
})();

/* --- a pipeline: the table passes four stations ----------------------------------------
 * Five stations in a row, centred at x 160 + 340 k: the survey and the four
 * verbs. Boxes 240 x 80 with the verb in the code font at 32 ("summarize" is
 * 173 + 40 < 240), the full call above each box at 20 ("summarize(n = n())" is
 * 216 < 320), arrows in the 100 between the boxes. Under each station the
 * table it returns, 320 wide: age (90) and diet (230), after summarize() diet
 * (230) and n (90), header at 300 and rows of 52 from 328 ("flexitarian" is
 * 211 + 12 < 230). Each step lights the station, a copy of the table before it
 * moves 340 to the right and changes there; summarize() keeps the colours of
 * the groups. Everything sits 60 lower, so the last row ends at 700 < 804. */
(function () {
  const X = (k) => 160 + 340 * k;
  const RT = 52, top = (p) => 328 + RT * p, rm = (p) => top(p) + RT / 2;
  const verbs = ["survey", "filter", "group_by", "summarize", "arrange"];
  const calls = ["", "filter(age >= 40)", "group_by(diet)", "summarize(n = n())", "arrange(desc(n))"];
  const pc = [{ key: "age", x0: -160, w: 90, num: true }, { key: "diet", x0: -70, w: 230 }];
  const qc = [{ key: "diet", x0: -160, w: 230 }, { key: "n", x0: 70, w: 90, num: true }];
  const txt = (x, v, cy, color = C.white, end = false) =>
    d.label(x, 0, String(v), { size: 32, mono: true, centerY: cy, color, anchor: end ? "end" : "start" });
  const cellAt = (cx, c, v, cy, color) => c.num ? txt(cx + c.x0 + c.w - 12, v, cy, color, true) : txt(cx + c.x0 + 12, v, cy, color);
  // a table: a named header and one named group per row (background first, so it can take a group colour)
  function table(name, k, cols, rows) {
    const cx = X(k);
    return d.g(name,
      d.g(name + "-h", ...cols.map((c) => cellAt(cx, c, c.key, 300, C.gray)), d.line(cx - 160, 324, cx + 160, 324, { color: C.dark })),
      ...rows.map((r) => d.g(name + "-r" + r.id,
        `<rect x="${cx - 160}" y="${top(r.pos) + 3}" width="320" height="${RT - 6}" rx="6" fill="${r.tint ? d.color(GROUP[r.diet]) : C.bg}" fill-opacity="0.35"/>`,
        ...cols.map((c) => cellAt(cx, c, r[c.key], rm(r.pos))))));
  }
  const all = ROWS.map((r, p) => ({ ...r, pos: p }));
  const older = ROWS.filter((r) => r.age >= 40).map((r, p) => ({ ...r, pos: p }));
  const counts = [{ id: "f", diet: "flexitarian", n: 1 }, { id: "o", diet: "omnivore", n: 3 }, { id: "v", diet: "vegetarian", n: 1 }]
    .map((r, p) => ({ ...r, pos: p, tint: true }));
  const parts = [];
  verbs.forEach((v, k) => {
    parts.push(d.g("st" + k, d.box(X(k) - 120, 100, 240, 80, v, { size: 32, mono: true })));
    if (calls[k]) parts.push(d.g("call" + k, d.label(X(k), 0, calls[k], { size: 20, mono: true, anchor: "middle", color: C.gray, centerY: 70 })));
    if (k < 4) parts.push(d.arrow(X(k) + 124, 140, X(k + 1) - 126, 140, { color: C.gray, width: 3 }));
  });
  parts.push(table("t0", 0, pc, all), table("c1", 0, pc, all), table("c2", 1, pc, older),
    table("c3", 2, pc, older.map((r) => ({ ...r, tint: true }))), table("s3", 3, qc, counts), table("c4", 3, qc, counts),
    d.g("glab", d.label(X(2) - 160, 0, "# Groups:   diet [3]", { size: 20, mono: true, keepCase: true, color: C.gray, centerY: 262 })));
  el("fig-pipeline").innerHTML = d.svg(1680, 804, `<g transform="translate(0,60)">`, ...parts, `</g>`);

  const a = d.anim("fig-pipeline");
  // station k and its call light up, the previous one goes back
  const light = (k) => a.par(
    a.color("st" + k, "yellow", { dur: 300 }), a.color("st" + k, "yellow", { part: "text", dur: 300 }),
    a.color("call" + k, "yellow", { part: "text", dur: 300 }),
    ...(k > 1 ? [a.color("st" + (k - 1), "white", { dur: 300 }), a.color("st" + (k - 1), "white", { part: "text", dur: 300 }),
                 a.color("call" + (k - 1), "gray", { part: "text", dur: 300 })] : []));
  const carry = (name) => a.seq(a.show(name, { dur: 1 }), a.move(name, 340, 0, { dur: 700 }));
  // filter: the 32-year-old goes, the two rows below close up
  a.step(light(1), carry("c1"), a.hide("c1-r4", { dur: 400 }),
    a.par(a.move("c1-r5", 0, -RT, { dur: 500 }), a.move("c1-r6", 0, -RT, { dur: 500 })));
  // group_by: the rows take the colours of their groups, nothing else changes
  a.step(light(2), carry("c2"),
    a.par(a.show("glab", { dur: 600 }), ...older.map((r) => a.color(`[data-a="c2-r${r.id}"] rect`, GROUP[r.diet], { part: "fill", dur: 600 }))));
  // summarize: each group falls into its row of the result, in the colour of the group
  const into = { omnivore: 1, flexitarian: 0, vegetarian: 2 };
  a.step(light(3), carry("c3"),
    a.par(a.hide("c3-h", { dur: 700 }), a.show("s3", { dur: 700 }),
      ...older.map((r) => a.par(a.move("c3-r" + r.id, 0, (into[r.diet] - r.pos) * RT, { dur: 900 }), a.hide("c3-r" + r.id, { dur: 900 })))));
  // arrange: the omnivores move to the top
  a.step(light(4), carry("c4"),
    a.par(a.move("c4-ro", 0, -RT, { dur: 800 }), a.move("c4-rf", 0, RT, { dur: 800 })));
})();
