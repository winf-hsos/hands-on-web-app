// Drawings and animations of "tidy data with tidyr".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures on slides with a
// punchline are 1680 x 660, the others 1680 x 804.
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);

/* --- tables in the code font -----------------------------------------------------
 * All tables set their cells in the code font at 32: 19.2 units per character,
 * 24 padding inside a column. Numbers stand right-aligned, text left-aligned, as
 * R prints a tibble. A column is { key, w, num, label }; its width is checked
 * against its longest entry where it is defined (characters x 19.2 + 48). */
const CH = 19.2, PAD = 24;
const caps = (s) => /[A-Z]/.test(s);               // NA and the like keep their case
function cellText(col, s, cy, color = C.white) {
  return col.num
    ? d.label(col.x + col.w - PAD, 0, s, { size: 32, mono: true, anchor: "end", centerY: cy, color, keepCase: caps(s) })
    : d.label(col.x + PAD, 0, s, { size: 32, mono: true, centerY: cy, color, keepCase: caps(s) });
}
// where the text s starts in a column, so a copy can fly from one cell to another
const leftEdge = (col, s) => (col.num ? col.x + col.w - PAD - String(s).length * CH : col.x + PAD);

/* A table: header row at y, rows of height rh beneath. Named parts for the
 * animations: <name>-h-<key> (header text and its rule), <name>-r<k> (row k),
 * <name>-<k>-<key> (one cell, class <name>-col-<key>). o.color(row, col, s)
 * may colour single cells, o.headColor(col) single names in the header;
 * missing values (NA) are gray. */
function grid(name, x, y, rh, spec, rows, o = {}) {
  let at = x;
  const cols = spec.map((c) => { const col = Object.assign({}, c, { x: at }); at += c.w; return col; });
  const hy = y + rh / 2, ry = (k) => y + rh * (k + 1) + rh / 2;
  const parts = cols.map((c) => d.g(`${name}-h-${c.key}`,
    o.noHeader ? "" : cellText(c, c.label === undefined ? c.key : c.label, hy, (o.headColor && o.headColor(c)) || C.gray),
    d.line(c.x, y + rh, c.x + c.w, y + rh, { color: C.dark })));
  rows.forEach((r, k) => parts.push(d.g(`${name}-r${k}`, ...cols.map((c) => {
    const v = r[c.key];
    if (v === undefined || v === null || v === "") return "";
    const s = c.fmt ? c.fmt(v) : String(v);
    const color = (o.color && o.color(r, c, s)) || (s === "NA" ? C.gray : C.white);
    return `<g data-a="${name}-${k}-${c.key}" class="${name}-col-${c.key}">${cellText(c, s, ry(k), color)}</g>`;
  }))));
  return { parts: parts.join(""), cols, col: (key) => cols.find((c) => c.key === key), hy, ry, right: at };
}

// a copy of the text s, drawn where it ends (col, cy) and set off to where it
// starts (left edge sx, centre sy); fly() shows it there and moves it home
function flyer(a, name, col, s, cy, sx, sy, color = C.white) {
  const f = { name, dx: sx - leftEdge(col, s), dy: sy - cy };
  a.set(name, { x: f.dx, y: f.dy });
  f.svg = d.g(name, cellText(col, s, cy, color));
  return f;
}
const fly = (a, f, dur = 1200) => a.seq(a.show(f.name, { dur: 1 }), a.move(f.name, -f.dx, -f.dy, { dur }));

const two = (v) => v.toFixed(2);
const num = (v) => String(v);

/* --- the data --------------------------------------------------------------------
 * Three real respondents of the survey (rows 1, 16 and 36 of the raw file) and
 * the price they find fair for a litre of each brand (question u013pzahl). The
 * brands carry the short names the survey gives them (u013pzahl_1weihen), so the
 * drawings use the same names as the data after pivot_longer(). The column that
 * tells the people apart is called respondent, because it repeats in a long
 * table: "respondent" is 10 x 19.2 = 192 + 24 + a little room, 230 wide. */
const BRANDS = ["weihen", "gut", "alpro"];
const RESP = { key: "respondent", w: 230, num: true };
const P3 = [
  { respondent: 1, age: 55, weihen: 1.49, gut: 1.09, alpro: 1.89 },
  { respondent: 16, age: 46, weihen: 1.19, gut: 1.19, alpro: 1.49 },
  { respondent: 36, age: 53, weihen: 1.09, gut: 1.09, alpro: 1.49 },
];
const LONG3 = P3.flatMap((p) => BRANDS.map((b) => ({ respondent: p.respondent, brand: b, price: p[b] })));
// "weihen" is 6 x 19.2 = 115 + 48 = 163: brand columns are 180 wide
const WIDE_SPEC = [RESP, { key: "weihen", w: 180, num: true, fmt: two },
  { key: "gut", w: 130, num: true, fmt: two }, { key: "alpro", w: 150, num: true, fmt: two }];   // 690
const LONG_SPEC = [RESP, { key: "brand", w: 180 }, { key: "price", w: 150, num: true, fmt: two }];  // 560

// a small made-up table: two respondents, two brands, price and certainty (-4 to 4)
const ANSWERS = [
  { respondent: 1, brand: "weihen", measure: "price", value: "1.49" },
  { respondent: 1, brand: "weihen", measure: "sure", value: "2" },
  { respondent: 1, brand: "alpro", measure: "price", value: "1.89" },
  { respondent: 1, brand: "alpro", measure: "sure", value: "-1" },
  { respondent: 16, brand: "weihen", measure: "price", value: "1.19" },
  { respondent: 16, brand: "weihen", measure: "sure", value: "3" },
  { respondent: 16, brand: "alpro", measure: "price", value: "1.49" },
  { respondent: 16, brand: "alpro", measure: "sure", value: "1" },
];
// "measure" is 7 x 19.2 = 134 + 48 = 182 < 200; 760 wide in all
const ANS_SPEC = [RESP, { key: "brand", w: 180 }, { key: "measure", w: 200 }, { key: "value", w: 150, num: true }];

/* --- slide: one answer, four tables ------------------------------------------------
 * Figure 1680 x 660, four framed cards, each with a gray caption above its table.
 * Left the tidy long table in a card 620 x 660 at x 0: caption at y 26, table
 * (560 wide) from x 30 with rows of 52 from y 50 to 570; on the last step the
 * card gets its green verdict, the mark 44 above the lower edge at 616. Right,
 * from x 680, three cards 1000 x 212 with 12 between (3 x 212 + 2 x 12 = 660):
 * caption at y + 26, table from x + 30 with rows of 36 from y + 46 to y + 190.
 * The widest is "all prices in one cell": 230 + "weihen 1.49, gut 1.09, alpro
 * 1.89" (34 x 19.2 = 653 + 48 = 701) = 931 < 1000 - 30. */
(function () {
  const card = (x, y, w, h) => d.box(x, y, w, h, "", { border: C.dark, fill: "none" });
  const cap = (x, cy, s) => d.label(x, 0, s, { size: 32, color: C.gray, centerY: cy });
  const t1 = grid("t1", 30, 50, 52, LONG_SPEC, LONG3);
  const X = 680, H = 212, G = 12, RH = 36, top = (k) => k * (H + G);
  const t2 = grid("t2", X + 30, top(0) + 46, RH, WIDE_SPEC, P3);
  const cellsOf = (p) => BRANDS.map((b) => `${b} ${two(p[b])}`).join(", ");
  const t3 = grid("t3", X + 30, top(1) + 46, RH, [RESP, { key: "prices", w: 701 }],
    P3.map((p) => ({ respondent: p.respondent, prices: cellsOf(p) })));
  const t4 = grid("t4", X + 30, top(2) + 46, RH, [{ key: "brand", w: 180 }, ...P3.map((p) => ({ key: "p" + p.respondent, label: String(p.respondent), w: 110, num: true, fmt: two }))],
    BRANDS.map((b) => Object.fromEntries([["brand", b], ...P3.map((p) => ["p" + p.respondent, p[b]])])));
  const right = (name, k, caption, t) => d.g(name, card(X, top(k), 1000, H), cap(X + 30, top(k) + 26, caption), t.parts);
  el("fig-four").innerHTML = d.svg(1680, 660,
    card(0, 0, 620, 660), cap(30, 26, "one row per answer"), t1.parts,
    d.g("ok", d.verdict(0, 0, 620, 660, "", true, { fill: "none", width: 3 })),
    right("s2", 0, "one column per brand", t2), right("s3", 1, "all prices in one cell", t3), right("s4", 2, "one column per person", t4));
  const a = d.anim("fig-four");
  a.step(a.show("s2", { dur: 500 }));
  a.step(a.show("s3", { dur: 500 }));
  a.step(a.show("s4", { dur: 500 }));
  a.step(a.show("ok", { dur: 600 }));
})();

/* --- slide: three rules --------------------------------------------------------------
 * The long table, centred (560 wide from x 560), rows of 56 from y 40 to 600; a
 * line of text at 48 under it, centred on y 700 (the longest, "every observation
 * has its own row", is about 33 x 26 = 860 < 1680). Yellow fields (d.highlight
 * style, without a frame) mark the column brand, then the row of respondent 16
 * on alpro (row 5), then a single cell of that row, the price 1.49. */
(function () {
  const t = grid("rl", 560, 40, 56, LONG_SPEC, LONG3);
  const field = (name, x, y, w, h) => d.g(name, `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.yellow}" fill-opacity="0.18"/>`);
  const b = t.col("brand"), p = t.col("price"), R = 5;
  const line = (name, s) => d.g(name, d.label(840, 0, s, { size: 48, anchor: "middle", centerY: 700 }));
  el("fig-rules").innerHTML = d.svg(1680, 804,
    field("f-col", b.x + 4, 44, b.w - 8, 552), field("f-row", 564, t.ry(R) - 24, 552, 48), field("f-cell", p.x + 4, t.ry(R) - 24, p.w - 8, 48),
    t.parts,
    line("l1", "every variable has its own column"), line("l2", "every observation has its own row"), line("l3", "every value has its own cell"));
  const a = d.anim("fig-rules", { back: "play" });
  const brandCells = LONG3.map((r, k) => `rl-${k}-brand`);
  const rowCells = ["respondent", "brand", "price"].map((k) => `rl-${R}-${k}`);
  a.step(a.par(a.show("f-col", { dur: 500 }), a.color("rl-h-brand", "yellow", { part: "text", dur: 500 }),
    ...brandCells.map((c) => a.color(c, "yellow", { part: "text", dur: 500 })), a.show("l1", { dur: 500 })));
  a.step(a.par(a.hide("f-col", { dur: 500 }), a.color("rl-h-brand", "gray", { part: "text", dur: 500 }),
    ...brandCells.filter((c) => c !== `rl-${R}-brand`).map((c) => a.color(c, "white", { part: "text", dur: 500 })),
    a.show("f-row", { dur: 500 }), ...rowCells.map((c) => a.color(c, "yellow", { part: "text", dur: 500 })),
    a.hide("l1", { dur: 400 }), a.show("l2", { dur: 500 })));
  a.step(a.par(a.hide("f-row", { dur: 500 }), a.show("f-cell", { dur: 500 }),
    ...rowCells.slice(0, 2).map((c) => a.color(c, "white", { part: "text", dur: 500 })),
    a.hide("l2", { dur: 400 }), a.show("l3", { dur: 500 })));
})();

/* --- slide: what is one observation? -------------------------------------------------
 * Figure 1680 x 660. Left the wide table with the age (800 wide from x 0),
 * right the long table (560 wide from x 960), both with rows of 48 from y 100;
 * the wide one ends at 292, the long one at 580. Each question stands above its
 * table at 32 (about 38 x 16 = 610 wide), each mark below its table. */
(function () {
  const w = grid("ow", 0, 100, 48, [WIDE_SPEC[0], { key: "age", w: 110, num: true }, ...WIDE_SPEC.slice(1)], P3);
  const l = grid("ol", 960, 100, 48, LONG_SPEC, LONG3);
  const q = (x, s) => d.label(x, 0, s, { size: 32, color: C.light, centerY: 40 });
  el("fig-obs").innerHTML = d.svg(1680, 660, w.parts, l.parts,
    d.g("q1", q(0, "how old are the people who answered?"), d.mark(400, 340, true)),
    d.g("q2", q(960, "which brand is thought to be cheapest?"), d.mark(1240, 622, true)));
  const a = d.anim("fig-obs", { back: "play" });
  a.step(a.show("q1", { dur: 500 }));
  a.step(a.show("q2", { dur: 500 }));
})();

/* --- slide: why it pays off ------------------------------------------------------------
 * Figure 1680 x 660: two pieces of code in the code font at 32, drawn rather
 * than set as code blocks, because they compare and are not meant to be run.
 * Left from x 0, the longest line "    weihen = median(weihen)," is 28 x 19.2
 * = 538; right from x 900, "  summarize(median = median(price))" is
 * 36 x 19.2 = 691, so it ends at 1591. Lines 52 apart from y 150. */
(function () {
  // SVG collapses leading spaces, so the indent is written as no-break spaces
  const indent = (s) => s.replace(/^ +/, (m) => " ".repeat(m.length));
  const code = (x, lines, color = C.white) => lines.map((s, k) => d.label(x, 0, indent(s), { size: 32, mono: true, centerY: 150 + 52 * k, color })).join("");
  const head = (x, s) => d.label(x, 0, s, { size: 32, color: C.gray, centerY: 60 });
  const foot = (x, s) => d.label(x, 0, s, { size: 32, color: C.light, centerY: 520 });
  el("fig-why").innerHTML = d.svg(1680, 660,
    head(0, "one column per brand"),
    code(0, ["prices |>", "  summarize(", "    weihen = median(weihen),", "    gut = median(gut),", "    alpro = median(alpro)", "  )"]),
    foot(0, "one line for every brand"),
    head(900, "one row per person and brand"),
    code(900, ["prices_long |>", "  group_by(brand) |>", "  summarize(median = median(price))"]),
    foot(900, "one line for all brands"));
})();

/* --- slide: four ways to be messy --------------------------------------------------------
 * Figure 1680 x 804, four small tables from the deck's own data in a 2 x 2 grid:
 * left column from x 0, right column from x 750, rows of the grid at y 0 and
 * 420. Each cell has the pattern at 32 on top (cy y + 20), the table from
 * y + 60 with rows of 46 (three rows end at y + 244) and the verb in the code
 * font in blue below (cy y + 300). The messy part is yellow: the brands in the
 * header, the column measure, the ranges, the lists. Widths: 690 (respondent
 * 230, weihen 180, gut 130, alpro 150), 580 (respondent, measure 200, value
 * 150), 480 (brand 180, range 300; "1.30 to 1.50" is 12 x 19.2 = 230 + 48) and
 * 930 (respondent, shops 700; "discounter, supermarket, farm shop" is 34 x 19.2
 * = 653 + 48), so the widest right one ends at 1680. */
(function () {
  const yellow = (keys) => (r, c) => (keys.includes(c.key) ? C.yellow : null);
  const cells = [
    { name: "values in column names", verb: "pivot_longer()",
      spec: WIDE_SPEC, rows: P3.slice(0, 2), o: { headColor: (c) => (BRANDS.includes(c.key) ? C.yellow : null) } },
    { name: "two variables in one column", verb: "pivot_wider()",
      spec: [RESP, { key: "measure", w: 200 }, { key: "value", w: 150, num: true }],
      rows: ANSWERS.slice(0, 2).concat([ANSWERS[4]]), o: { color: yellow(["measure"]) } },
    { name: "two values in one cell", verb: "separate_wider_delim()",
      spec: [{ key: "brand", w: 180 }, { key: "range", w: 300 }],
      rows: [{ brand: "weihen", range: "1.30 to 1.50" }, { brand: "gut", range: "0.90 to 1.10" }], o: { color: yellow(["range"]) } },
    { name: "a list in one cell", verb: "separate_longer_delim()",
      spec: [RESP, { key: "shops", w: 700 }],
      rows: [{ respondent: 12, shops: "supermarket" }, { respondent: 24, shops: "discounter, supermarket, farm shop" }],
      o: { color: yellow(["shops"]) } },
  ];
  const parts = cells.map((t, k) => {
    const x = (k % 2) * 750, y = Math.floor(k / 2) * 420;
    return d.label(x, 0, t.name, { size: 32, centerY: y + 20 }) +
      grid("mx" + k, x, y + 60, 46, t.spec, t.rows, t.o).parts +
      d.label(x, 0, t.verb, { size: 32, mono: true, color: C.blue, centerY: y + 300 });
  });
  el("fig-messy").innerHTML = d.svg(1680, 804, ...parts);
})();

/* --- slide: the price question, as the survey stores it --------------------------------
 * Figure 1680 x 660: rows 1, 2, 3, 16 and 36 of the raw file with the three
 * price columns ("u013pzahl_1weihen" is 17 x 19.2 = 326 + 48 < 380), 1370 wide
 * from x 155, rows of 52 from y 20 to 436; the rows left out are marked by a
 * gray row of ellipses. Under the table two gray lines at 32. */
(function () {
  const keys = ["u013pzahl_1weihen", "u013pzahl_2gut", "u013pzahl_3alpro"];
  const spec = [RESP, ...keys.map((k) => ({ key: k, w: 380, num: true }))];
  const row = (respondent, v) => Object.fromEntries([["respondent", String(respondent)], ...keys.map((k, j) => [k, v[j]])]);
  const gap = row("…", ["…", "…", "…"]);
  const rows = [row(1, ["1.49", "1.09", "1.89"]), row(2, ["NA", "NA", "NA"]), row(3, ["NA", "NA", "NA"]),
    gap, row(16, ["1.19", "1.19", "1.49"]), gap, row(36, ["1.09", "1.09", "1.49"])];
  const t = grid("rp", 155, 20, 52, spec, rows, { color: (r) => (r === gap ? C.gray : null) });
  el("fig-raw-prices").innerHTML = d.svg(1680, 660, t.parts,
    d.label(840, 0, "2,580 of the 2,811 rows are empty in all three columns,\nbecause only 231 people were asked this question",
      { size: 32, anchor: "middle", color: C.gray, centerY: 530, lineHeight: 1.4 }));
})();

/* --- slide: pivot_longer(): columns become rows ------------------------------------------
 * Figure 1680 x 804. Left the wide table W (690 wide from x 0), right the long
 * table L (560 wide from x 900), both with rows of 56 and the header at y 100;
 * L ends at 660. Every value of L is a copy that flies in from where it stood
 * in W: the respondent from its row, the brand from the header, the price from its
 * cell. Above L's header, at y 60, names_to and values_to in yellow. */
(function () {
  const W = grid("W", 0, 100, 56, WIDE_SPEC, P3);
  const L = grid("L", 900, 100, 56, LONG_SPEC, [], { });
  const a = d.anim("fig-longer");
  const flights = P3.map((p, k) => BRANDS.flatMap((b, j) => {
    const m = 3 * k + j, cy = L.ry(m), src = W.col(b);
    return [
      flyer(a, `fl-id-${m}`, L.col("respondent"), String(p.respondent), cy, leftEdge(W.col("respondent"), String(p.respondent)), W.ry(k)),
      flyer(a, `fl-b-${m}`, L.col("brand"), b, cy, leftEdge(src, b), W.hy, C.yellow),
      flyer(a, `fl-p-${m}`, L.col("price"), two(p[b]), cy, leftEdge(src, two(p[b])), W.ry(k), C.yellow),
    ];
  }));
  const tag = (name, s, col) => d.g(name, d.label(col.x + col.w / 2, 0, s, { size: 32, mono: true, anchor: "middle", color: C.yellow, centerY: 60 }));
  el("fig-longer").innerHTML = d.svg(1680, 804, d.g("W", W.parts), d.g("Lh", L.parts),
    ...flights.flat().map((f) => f.svg),
    tag("t-names", "names_to", L.col("brand")), tag("t-values", "values_to", L.col("price")));
  const brandCols = BRANDS.flatMap((b) => [`W-h-${b}`, `.W-col-${b}`]);
  a.step(a.par(...brandCols.map((t) => a.color(t, "yellow", { part: "text", dur: 600 }))));
  a.step(a.show("Lh", { dur: 300 }), a.par(...flights[0].map((f) => fly(a, f, 1300))));
  a.step(a.par(...flights.slice(1).flat().map((f) => fly(a, f, 1500))));
  a.step(a.par(a.hide("W", { dur: 800 }), a.show("t-names", { dur: 800 }), a.show("t-values", { dur: 800 }),
    ...flights.flat().filter((f) => !f.name.startsWith("fl-id")).map((f) => a.color(f.name, "white", { part: "text", dur: 800 }))));
})();

/* --- slide: nine columns of zeros and ones ------------------------------------------------
 * Figure 1680 x 660, the first four rows as R prints them: respondent and the
 * first four of the nine shop columns (360 wide; "v008ort_1discount" is
 * 17 x 19.2 = 326 + 24, so it starts 10 into its column), 1670 wide from x 5, rows of 60 from y 30 to 330; the ones in yellow.
 * Below, in gray, the line in which R names the other five columns (two lines
 * at 32, the longer about 57 x 19.2 = 1094). */
(function () {
  const keys = ["v008ort_1discount", "v008ort_2super", "v008ort_3sbmarkt", "v008ort_4fach"];
  const vals = [[1, 1, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [1, 0, 1, 0]];
  const t = grid("sh", 5, 30, 60, [RESP, ...keys.map((k) => ({ key: k, w: 360, num: true }))],
    vals.map((v, i) => Object.fromEntries([["respondent", i + 1], ...keys.map((k, j) => [k, v[j]])])),
    { color: (r, c, s) => (c.key !== "respondent" && s === "1" ? C.yellow : null) });
  el("fig-shops").innerHTML = d.svg(1680, 660, t.parts,
    d.label(5 + PAD, 0, "# 5 more variables: v008ort_5markt, v008ort_6hof,\n#   v008ort_7bioladen, v008ort_8onlineds, v008ort_9online",
      { size: 32, mono: true, color: C.gray, centerY: 430, lineHeight: 1.4 }));
})();

/* --- slide: two variables in one column -------------------------------------------------
 * Figure 1680 x 660: the made-up long table, 760 wide and centred (x 460),
 * rows of 60 from y 40 to 580. The same table starts the next animation. */
(function () {
  el("fig-measure").innerHTML = d.svg(1680, 660, grid("ms", 460, 40, 60, ANS_SPEC, ANSWERS).parts);
})();

/* --- slide: pivot_wider(): rows become columns --------------------------------------------
 * Figure 1680 x 804. Left the long table A (760 wide from x 0), right the wide
 * table B (710 wide from x 900), rows of 56 with the header at y 100; A ends at
 * 604. Each pair of rows becomes one row of B: respondent and brand fly from the first
 * row of the pair, the two values from the column value; the names price and
 * sure fly from the column measure of the first pair into B's header. Rows
 * that are done turn dark gray. */
(function () {
  const A = grid("A", 0, 100, 56, ANS_SPEC, ANSWERS);
  const B = grid("B", 900, 100, 56, [RESP, { key: "brand", w: 180 },
    { key: "price", w: 150, num: true }, { key: "sure", w: 150, num: true }], [], { noHeader: true });
  const a = d.anim("fig-wider");
  const pairs = [0, 1, 2, 3].map((q) => {
    const p = ANSWERS[2 * q], s = ANSWERS[2 * q + 1], cy = B.ry(q);
    const fs = [
      flyer(a, `w-id-${q}`, B.col("respondent"), String(p.respondent), cy, leftEdge(A.col("respondent"), String(p.respondent)), A.ry(2 * q)),
      flyer(a, `w-b-${q}`, B.col("brand"), p.brand, cy, leftEdge(A.col("brand"), p.brand), A.ry(2 * q)),
      flyer(a, `w-p-${q}`, B.col("price"), p.value, cy, leftEdge(A.col("value"), p.value), A.ry(2 * q), C.yellow),
      flyer(a, `w-s-${q}`, B.col("sure"), s.value, cy, leftEdge(A.col("value"), s.value), A.ry(2 * q + 1), C.yellow),
    ];
    if (q === 0) fs.push(
      flyer(a, "w-h-price", B.col("price"), "price", B.hy, leftEdge(A.col("measure"), "price"), A.ry(0), C.yellow),
      flyer(a, "w-h-sure", B.col("sure"), "sure", B.hy, leftEdge(A.col("measure"), "sure"), A.ry(1), C.yellow));
    return fs;
  });
  const fixed = (key) => d.g("Bh-" + key, cellText(B.col(key), key, B.hy, C.gray));
  el("fig-wider").innerHTML = d.svg(1680, 804, A.parts, d.g("Bh", B.parts, fixed("respondent"), fixed("brand")),
    ...pairs.flat().map((f) => f.svg));
  const done = (q) => a.par(a.color(`A-r${2 * q}`, "gray-dark", { part: "text", dur: 300 }), a.color(`A-r${2 * q + 1}`, "gray-dark", { part: "text", dur: 300 }));
  a.step(a.par(...["A-h-measure", "A-h-value", ".A-col-measure", ".A-col-value"].map((t) => a.color(t, "yellow", { part: "text", dur: 600 }))));
  a.step(a.show("Bh", { dur: 300 }), a.par(...pairs[0].map((f) => fly(a, f, 1300))), done(0));
  a.step(a.par(...pairs.slice(1).flat().map((f) => fly(a, f, 1500))), a.par(done(1), done(2), done(3)));
})();

/* --- slide: two directions -----------------------------------------------------------------
 * Figure 1680 x 804. The wide table (690 wide from x 0, header at y 290, ends
 * at 514) and the long one (560 wide from x 1120, header at y 100, ends at 660).
 * Between them, from x 730 to 1080, an arrow to the right at y 350 with
 * pivot_longer() above it and one to the left at y 470 with pivot_wider() below
 * it ("pivot_longer()" is 14 x 19.2 = 269 < 350). */
(function () {
  const w = grid("dw", 0, 290, 56, WIDE_SPEC, P3);
  const l = grid("dl", 1120, 100, 56, LONG_SPEC, LONG3);
  el("fig-dirs").innerHTML = d.svg(1680, 804, w.parts, l.parts,
    d.arrow(730, 350, 1080, 350, { color: C.gray, width: 3 }),
    d.label(905, 0, "pivot_longer()", { size: 32, mono: true, anchor: "middle", color: C.blue, centerY: 310 }),
    d.arrow(1080, 470, 730, 470, { color: C.gray, width: 3 }),
    d.label(905, 0, "pivot_wider()", { size: 32, mono: true, anchor: "middle", color: C.blue, centerY: 510 }));
})();

/* --- slide: two variables across two brands (".value") ------------------------------------
 * Figure 1680 x 804. Top the wide table V (1350 wide from x 165; "price_weihen"
 * is 12 x 19.2 = 230 + 48 < 280), rows of 56 from y 60 to 228. Each header is
 * three pieces: the variable, "_", the brand. Below, the tidy table T (710 wide
 * from x 165), header at y 380, rows to 660. Step 1 splits the names at "_",
 * step 2 moves the yellow variable names into T's header, copies the brands
 * into the column brand and moves every value to its row. */
(function () {
  const VARS = ["price", "sure"], BR = ["weihen", "alpro"];
  const both = [
    { respondent: 1, price_weihen: "1.49", price_alpro: "1.89", sure_weihen: "2", sure_alpro: "-1" },
    { respondent: 16, price_weihen: "1.19", price_alpro: "1.49", sure_weihen: "3", sure_alpro: "1" },
  ];
  const keys = VARS.flatMap((v) => BR.map((b) => `${v}_${b}`));
  // the skeleton only (respondent header and rules); names and values are drawn as pieces below
  const V = grid("V", 165, 60, 56, [RESP, ...keys.map((k) => ({ key: k, w: 280, num: true, label: "" }))], []);
  const T = grid("T", 165, 380, 56, [RESP, { key: "brand", w: 180 },
    { key: "price", w: 150, num: true }, { key: "sure", w: 150, num: true }], [], { noHeader: true });
  const a = d.anim("fig-value");
  // the header pieces, at the place of the right-aligned name
  const pieces = [];
  const at = {};
  keys.forEach((k) => {
    const [v, b] = k.split("_"), col = V.col(k), L0 = leftEdge(col, k);
    at[k] = { pre: L0 - 8, suf: L0 + (v.length + 1) * CH + 8 };       // after the split
    const lab = (x, s, color) => d.label(x, 0, s, { size: 32, mono: true, color, centerY: V.hy });
    pieces.push(d.g(`pre-${k}`, lab(L0, v, C.gray)), d.g(`us-${k}`, lab(L0 + v.length * CH, "_", C.gray)),
      d.g(`suf-${k}`, lab(L0 + (v.length + 1) * CH, b, C.gray)));
  });
  // brand copies: from the suffix of price_<brand> into both rows of that brand
  const rowOf = (r, bi) => 2 * r + bi;                // T: 1 weihen, 1 alpro, 16 weihen, 16 alpro
  const brandFlights = [], idFlights = [];
  both.forEach((row, r) => BR.forEach((b, bi) => {
    const m = rowOf(r, bi), cy = T.ry(m);
    brandFlights.push(flyer(a, `vb-${m}`, T.col("brand"), b, cy, at[`price_${b}`].suf, V.hy));
    idFlights.push(flyer(a, `vi-${m}`, T.col("respondent"), String(row.respondent), cy, leftEdge(V.col("respondent"), String(row.respondent)), V.ry(r)));
  }));
  const tHead = (key) => d.g("Th-" + key, cellText(T.col(key), key, T.hy, C.gray));
  el("fig-value").innerHTML = d.svg(1680, 804, d.g("Vskel", V.parts),
    // every value a piece of its own, so it can move to its row
    ...both.map((row, r) => keys.map((k) => d.g(`vv-${r}-${k}`, cellText(V.col(k), row[k], V.ry(r)))).join("")),
    d.g("vid", both.map((row, r) => cellText(V.col("respondent"), String(row.respondent), V.ry(r))).join("")),
    ...pieces, d.g("Tskel", T.parts, tHead("respondent"), tHead("brand")),
    ...brandFlights.map((f) => f.svg), ...idFlights.map((f) => f.svg));
  // step 1: the names split at "_", the variable part turns yellow
  a.step(a.par(...keys.flatMap((k) => [a.hide(`us-${k}`, { dur: 600 }), a.move(`pre-${k}`, -8, 0, { dur: 800 }),
    a.move(`suf-${k}`, 8, 0, { dur: 800 }), a.color(`pre-${k}`, "yellow", { part: "text", dur: 800 }),
    a.color(`suf-${k}`, "white", { part: "text", dur: 800 })])));
  // step 2: variable names into the header, brands and respondents copied, values to their rows
  const toHead = (k) => {
    const v = k.split("_")[0], col = T.col(v);
    return a.move(`pre-${k}`, leftEdge(col, v) - at[k].pre, T.hy - V.hy, { dur: 1400 });
  };
  const toCell = (r, k) => {
    const [v, b] = k.split("_"), s = both[r][k], col = T.col(v);
    return a.move(`vv-${r}-${k}`, leftEdge(col, s) - leftEdge(V.col(k), s), T.ry(rowOf(r, BR.indexOf(b))) - V.ry(r), { dur: 1400 });
  };
  a.step(a.par(a.show("Tskel", { dur: 300 }), a.hide("Vskel", { dur: 600 }), a.hide("vid", { dur: 300 }),
    ...keys.map((k) => a.hide(`suf-${k}`, { dur: 300 })),
    ...keys.map(toHead), ...both.flatMap((row, r) => keys.map((k) => toCell(r, k))),
    ...brandFlights.map((f) => fly(a, f, 1400)), ...idFlights.map((f) => fly(a, f, 1400))));
})();

/* --- slide: two values in one cell ----------------------------------------------------------
 * Figure 1680 x 804. A table brand (200) and range (320; "1.30 to 1.50" is
 * 12 x 19.2 = 230 + 48 < 320) from x 560, rows of 64 with the header at y 200.
 * Each range is three pieces: from, " to ", to. Step 1 marks " to " in yellow,
 * step 2 drops it: the header range gives way to from (760..1000) and to
 * (1000..1240), and the right piece moves into its column. */
(function () {
  const ranges = [{ brand: "weihen", range: ["1.30", "1.50"] }, { brand: "gut", range: ["0.90", "1.10"] }, { brand: "alpro", range: ["1.50", "1.70"] }];
  const t = grid("sw", 560, 200, 64, [{ key: "brand", w: 200 }, { key: "range", w: 320 }], ranges.map((r) => ({ brand: r.brand })));
  const nt = grid("sn", 760, 200, 64, [{ key: "from", w: 240 }, { key: "to", w: 240 }], []);
  const x0 = 760 + PAD;
  const lab = (x, cy, s, color = C.white) => d.label(x, 0, s, { size: 32, mono: true, centerY: cy, color });
  const parts = [];
  ranges.forEach((r, k) => {
    const cy = t.ry(k);
    parts.push(d.g(`lo-${k}`, lab(x0, cy, r.range[0])),
      // SVG drops the spaces around " to ", so only "to" is drawn, one character in
      d.g(`sep-${k}`, lab(x0 + 5 * CH, cy, "to")),
      d.g(`mark-${k}`, d.highlight(x0 + 5 * CH, 2 * CH, cy, 32)),
      d.g(`hi-${k}`, lab(x0 + 8 * CH, cy, r.range[1])));
  });
  el("fig-split-wide").innerHTML = d.svg(1680, 804, t.parts, d.g("new-head", nt.parts), ...parts);
  const a = d.anim("fig-split-wide", { back: "play" });
  a.step(a.par(...ranges.flatMap((r, k) => [a.show(`mark-${k}`, { dur: 500 }), a.color(`sep-${k}`, "yellow", { part: "text", dur: 500 })])));
  a.step(a.par(a.hide("sw-h-range", { dur: 600 }), a.show("new-head", { dur: 600 }),
    ...ranges.flatMap((r, k) => [a.hide(`sep-${k}`, { dur: 600 }), a.hide(`mark-${k}`, { dur: 600 }),
      a.move(`hi-${k}`, 1000 + PAD - (x0 + 8 * CH), 0, { dur: 1200 })])));
})();

/* --- slide: a list in one cell ----------------------------------------------------------------
 * Figure 1680 x 804. Left the table S (respondent 230, shops 860; the longest
 * list, "supermarket, specialist shop, organic shop", is 42 x 19.2 = 806 + 48
 * < 860) from x 0, rows of 64 with the header at y 100. Right the long table R
 * (respondent 230, shops 330; "specialist shop" is 15 x 19.2 = 288 + 24 < 330)
 * from x 1120, rows of 56 from y 100 to 548. The pieces of each list move into
 * R one below the other; the respondents are copied. Real answers of respondents 12, 24 and 48. */
(function () {
  const lists = [{ respondent: 12, shops: ["supermarket"] }, { respondent: 24, shops: ["discounter", "supermarket", "farm shop"] },
    { respondent: 48, shops: ["supermarket", "specialist shop", "organic shop"] }];
  const S = grid("S", 0, 100, 64, [RESP, { key: "shops", w: 860 }], lists.map((l) => ({ respondent: l.respondent })));
  const R = grid("R", 1120, 100, 56, [RESP, { key: "shops", w: 330 }], []);
  const a = d.anim("fig-split-long");
  const lab = (x, cy, s, color = C.white) => d.label(x, 0, s, { size: 32, mono: true, centerY: cy, color });
  const parts = [], moves = [], marks = [], ids = [];
  let m = 0;
  lists.forEach((l, k) => {
    let off = 0;
    const cy = S.ry(k), x0 = 230 + PAD;
    l.shops.forEach((s, i) => {
      parts.push(d.g(`pc-${k}-${i}`, lab(x0 + off * CH, cy, s)));
      moves.push(a.move(`pc-${k}-${i}`, R.col("shops").x + PAD - (x0 + off * CH), R.ry(m) - cy, { dur: 1400 }));
      ids.push(flyer(a, `li-${m}`, R.col("respondent"), String(l.respondent), R.ry(m), leftEdge(S.col("respondent"), String(l.respondent)), cy));
      off += s.length;
      if (i < l.shops.length - 1) {
        parts.push(d.g(`cm-${k}-${i}`, lab(x0 + off * CH, cy, ",")), d.g(`hl-${k}-${i}`, d.highlight(x0 + off * CH, CH, cy, 32)));
        marks.push(`${k}-${i}`);
        off += 2;
      }
      m++;
    });
  });
  el("fig-split-long").innerHTML = d.svg(1680, 804, d.g("Sall", S.parts), d.g("Rh", R.parts), ...parts, ...ids.map((f) => f.svg));
  a.step(a.par(...marks.flatMap((n) => [a.show(`hl-${n}`, { dur: 500 }), a.color(`cm-${n}`, "yellow", { part: "text", dur: 500 })])));
  a.step(a.par(a.show("Rh", { dur: 300 }), a.hide("Sall", { dur: 800 }),
    ...marks.flatMap((n) => [a.hide(`hl-${n}`, { dur: 400 }), a.hide(`cm-${n}`, { dur: 400 })]),
    ...moves, ...ids.map((f) => fly(a, f, 1400))));
})();

/* --- slide: one question, three shapes ----------------------------------------------------------
 * Figure 1680 x 804, three labelled shapes of the same answers (respondents 12,
 * 24 and 48), each with a gray caption at 32 above it.
 * 1, top left: the list in one cell (respondent 230, shops 860), rows of 46 from
 *    y 60 to 244.
 * 2, bottom left: one column per shop with 1 for ticked (respondent 230, five
 *    columns of 90), rows of 46 from y 510 to 694. Five of the nine shops are
 *    named, in the order of the raw file; their names stand at 45 degrees from
 *    the foot of the header row (the longest, "specialist shop", is about 240
 *    long, so it reaches 170 up, to about y 378, below the caption at 340), and a gray
 *    "+ 4 more" stands where a sixth column would begin.
 * 3, right: the tidy table (respondent 230, shop 340, from x 1110 to 1680),
 *    rows of 44 from y 360 to 712.
 * Both arrows end at the tidy table: from 1 along y 152 to x 1395 and down to
 * 296, above the caption of 3, the verb above it (centred on 1395, 442 wide);
 * from 2 along y 625 from x 720 to 1095, the verb in two lines below it.
 * Build: first 1 with its arrow and 3, then 2 with its arrow. */
(function () {
  const lists = [{ respondent: 12, shops: "supermarket" }, { respondent: 24, shops: "discounter, supermarket, farm shop" },
    { respondent: 48, shops: "supermarket, specialist shop, organic shop" }];
  const SHOPS = ["discounter", "supermarket", "specialist shop", "farm shop", "organic shop"];
  // v008ort_1discount, _2super, _4fach, _6hof and _7bioladen of the raw file
  const ticks = { 12: [0, 1, 0, 0, 0], 24: [1, 1, 0, 1, 0], 48: [0, 1, 1, 0, 1] };
  const A2 = grid("a2", 0, 60, 46, [RESP, { key: "shops", w: 860 }], lists);
  const B2 = grid("b2", 0, 510, 46, [RESP, ...SHOPS.map((n, j) => ({ key: "s" + j, w: 90, num: true }))],
    lists.map((l) => Object.fromEntries([["respondent", l.respondent], ...ticks[l.respondent].map((v, j) => ["s" + j, v])])),
    { noHeader: true, color: (r, c, s) => (c.key !== "respondent" && s === "1" ? C.yellow : null) });
  const tidy = lists.flatMap((l) => l.shops.split(", ").map((s) => ({ respondent: l.respondent, shop: s })));
  const C2 = grid("c2", 1110, 360, 44, [RESP, { key: "shop", w: 340 }], tidy);
  const cap = (x, cy, s) => d.label(x, 0, s, { size: 32, color: C.gray, centerY: cy });
  const verb = (x, cy, s) => d.label(x, 0, s, { size: 32, mono: true, color: C.blue, anchor: "middle", centerY: cy, lineHeight: 1.4 });
  // a shop name at 45 degrees, starting at the foot of the header row
  const FOOT = 548;
  const slanted = (x, s, color) => `<g transform="rotate(-45 ${x} ${FOOT})">${d.label(x, FOOT, s, { size: 32, color })}</g>`;
  const heads = SHOPS.map((n, j) => slanted(B2.col("s" + j).x + 30, n, C.gray)).join("") +
    slanted(230 + 5 * 90 + 30, "+ 4 more", C.dark);
  el("fig-shapes").innerHTML = d.svg(1680, 804,
    cap(0, 30, "a list in one cell"), A2.parts,
    d.line(1110, 152, 1395, 152, { color: C.gray, width: 3 }), d.arrow(1395, 152, 1395, 296, { color: C.gray, width: 3 }),
    verb(1395, 112, "separate_longer_delim()"),
    cap(1110, 330, "tidy: one row per person and shop"), C2.parts,
    d.g("shape2", cap(0, 340, "one column per shop, 1 means ticked"), B2.parts,
      cellText(B2.col("respondent"), "respondent", B2.hy, C.gray), heads,
      d.arrow(720, 625, 1095, 625, { color: C.gray, width: 3 }),
      verb(907, 668, "pivot_longer() |>\nfilter()")));
  const a = d.anim("fig-shapes");
  a.step(a.show("shape2", { dur: 600 }));
})();

/* --- slides: spreadsheet habits and fill() ---------------------------------------------------
 * Both figures 1680 x 804 with the same table at the same place: brand (180),
 * respondent (230), price (150) from x 1040, rows of 64 with the header at y 150, to
 * 598, every cell in a thin frame as in a spreadsheet. On the first slide the
 * brand stands only at the top of its block; on the second the gaps read NA,
 * and fill() copies the value above downward, in green. */
const SHEET = [
  { brand: "weihen", respondent: 1, price: 1.49 }, { brand: "", respondent: 16, price: 1.19 }, { brand: "", respondent: 36, price: 1.09 },
  { brand: "alpro", respondent: 1, price: 1.89 }, { brand: "", respondent: 16, price: 1.49 }, { brand: "", respondent: 36, price: 1.49 },
];
const SHEET_SPEC = [{ key: "brand", w: 180 }, RESP, { key: "price", w: 150, num: true, fmt: two }];
const SHEET_X = 1040;
function sheetFrames() {
  let s = "";
  for (let r = 0; r < 7; r++) {
    let x = SHEET_X;
    SHEET_SPEC.forEach((c) => { s += `<rect x="${x}" y="${150 + r * 64}" width="${c.w}" height="64" fill="none" stroke="${C.dark}" stroke-width="1"/>`; x += c.w; });
  }
  return s;
}
(function () {
  el("fig-sheet").innerHTML = d.svg(1680, 804, sheetFrames(), grid("hs", SHEET_X, 150, 64, SHEET_SPEC, SHEET).parts);
})();
(function () {
  const rows = SHEET.map((r) => Object.assign({}, r, { brand: r.brand || "NA" }));
  const t = grid("fl", SHEET_X, 150, 64, SHEET_SPEC, rows);
  const a = d.anim("fig-fill");
  const col = t.col("brand");
  const gaps = [1, 2, 4, 5];
  // the last brand above row k, which fill() writes into it
  const above = (k) => { while (!SHEET[k].brand) k--; return SHEET[k].brand; };
  const fills = gaps.map((k) => flyer(a, `fill-${k}`, col, above(k), t.ry(k), col.x + PAD, t.ry(k - 1), C.green));
  el("fig-fill").innerHTML = d.svg(1680, 804, sheetFrames(), t.parts, ...fills.map((f) => f.svg));
  const down = (i) => a.par(a.hide(`fl-${gaps[i]}-brand`, { dur: 300 }), fly(a, fills[i], 600));
  a.step(a.par(a.seq(down(0), down(1)), a.seq(down(2), down(3))));
})();
