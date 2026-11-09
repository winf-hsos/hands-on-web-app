// Drawings and animations of "exploratory data analysis".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without. The charts from R are SVGs in img/,
// drawn by figures.R; the drawings here place them and add what moves.
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);

// A box whose text stands left-aligned at a common edge, as the design rules
// ask for more than one line; one-line boxes elsewhere keep centred text.
function textBox(x, y, w, h, text, o = {}) {
  return d.box(x, y, w, h, "", o) +
    d.label(x + 24, 0, text, { size: o.size || 32, centerY: y + h / 2, color: o.color || C.white, keepCase: o.keepCase });
}

// The six types: exploratory, the type of this deck, is blue everywhere,
// the other five stay neutral.
const typeBox = (x, y, w, h, name, o = {}) => name === "exploratory"
  ? d.box(x, y, w, h, name, { border: C.blue, color: C.blue, width: 3, size: o.size || 32 })
  : d.box(x, y, w, h, name, { border: C.light, size: o.size || 32 });

/* --- slide: the workflow of a data analysis -----------------------------------
 * Figure 1680 x 660 (has-punch), after R for Data Science. The row y 300
 * holds load 90..270 and tidy 340..520 (180 x 64), the frame "explore"
 * 590..1250 (y 70..530) and communicate 1330..1590 (260 x 64; "communicate"
 * at 32 is about 210); grey arrows run from box to box in between. Inside the
 * frame the three steps of the loop form a triangle, 220 x 64 each
 * ("transform" about 175): transform 810..1030 at y 175, model 630..850 and
 * visualise 990..1210 at y 400, 40 from the frame on either side. Blue arrows
 * lead from one box to the next, clockwise; "explore" at 48 heads the frame.
 * The frame "program" runs from (20, 30) to (1660, 630). */
(function () {
  el("fig-workflow").innerHTML = d.svg(1680, 660,
    d.g("program",
      `<rect x="20" y="30" width="1640" height="600" rx="24" fill="none" stroke="${C.gray}" stroke-width="2"/>`,
      d.label(60, 0, "program", { size: 32, color: C.gray, centerY: 590 })),
    d.g("load", d.box(90, 268, 180, 64, "load")),
    d.g("tidy", d.arrow(270, 300, 340, 300, { color: C.gray }), d.box(340, 268, 180, 64, "tidy")),
    d.g("into", d.arrow(520, 300, 590, 300, { color: C.gray }),
      d.box(590, 70, 660, 460, "", { border: C.light, rx: 24 }),
      d.label(920, 0, "explore", { size: 48, color: C.blue, anchor: "middle", centerY: 122 })),
    d.g("nodes", d.box(810, 175, 220, 64, "transform"), d.box(990, 400, 220, 64, "visualise"),
      d.box(630, 400, 220, 64, "model")),
    d.g("a1", d.arrow(990, 239, 1080, 400, { color: C.blue, width: 3 })),
    d.g("a2", d.arrow(990, 432, 850, 432, { color: C.blue, width: 3 })),
    d.g("a3", d.arrow(760, 400, 850, 239, { color: C.blue, width: 3 })),
    d.g("comm", d.arrow(1250, 300, 1330, 300, { color: C.gray }), d.box(1330, 268, 260, 64, "communicate")));
  const a = d.anim("fig-workflow");
  a.set("program", { opacity: 0 });
  // load, then tidy: the preparation
  a.step(a.show("tidy", { dur: 600 }));
  // the frame and its three steps appear, then the arrows go round once
  a.step(a.par(a.show("into", { dur: 500 }), a.show("nodes", { dur: 500 })),
    a.show("a1", { dur: 400 }), a.show("a2", { dur: 400 }), a.show("a3", { dur: 400 }));
  // what was understood goes out
  a.step(a.show("comm", { dur: 600 }));
  // programming holds it all together
  a.step(a.show("program", { dur: 800 }));
})();

/* --- slide: two kinds of questions ---------------------------------------------
 * Figure 1680 x 660 (has-punch), two panels centred at x 400 and 1280. Left a
 * histogram of twelve bars (44 wide, pitch 50, x 100..694, baseline y 400),
 * right a scatter plot with its axes from (980, 130) to (1590, 400), named
 * x at the end of the horizontal and y above the vertical one. The dots come
 * from a seeded random generator: x uniform, y a rising trend plus normal
 * noise, so they look like data and stay the same on every load. Under each
 * panel what it shows at y 440, in grey, and the question at y 540 in two
 * lines (about 22 characters, 350 wide at 32). */
(function () {
  const heights = [24, 60, 110, 170, 226, 250, 220, 172, 122, 78, 42, 18];
  const bars = heights.map((h, k) => `<rect x="${100 + 50 * k}" y="${400 - h}" width="44" height="${h}" fill="${C.light}"/>`);
  let seed = 20261109;
  const uniform = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const normal = () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
  const dots = [];
  for (let i = 0; i < 52; i++) {
    const x = 1005 + uniform() * 560;
    const y = Math.max(150, Math.min(390, 372 - (x - 1000) * 0.34 + normal() * 34));
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${C.light}"/>`);
  }
  el("fig-questions").innerHTML = d.svg(1680, 660,
    d.line(90, 400, 704, 400, { color: C.gray }), ...bars,
    d.label(400, 0, "one column", { size: 32, color: C.gray, anchor: "middle", centerY: 446 }),
    d.label(400, 0, "what variation occurs\nwithin one variable?", { size: 32, anchor: "middle", centerY: 550 }),
    d.line(980, 130, 980, 400, { color: C.gray }), d.line(980, 400, 1590, 400, { color: C.gray }), ...dots,
    d.label(1610, 0, "x", { size: 32, color: C.gray, centerY: 398 }),
    d.label(980, 0, "y", { size: 32, color: C.gray, anchor: "middle", centerY: 104 }),
    d.label(1280, 0, "two columns", { size: 32, color: C.gray, anchor: "middle", centerY: 446 }),
    d.label(1280, 0, "what covariation occurs\nbetween variables?", { size: 32, anchor: "middle", centerY: 550 }));
})();

/* --- slide: six yes-or-no questions (after Leek & Peng 2015) -------------------
 * Figure 1680 x 804. The questions run down a spine of boxes 1044 wide from
 * x 4 (the longest one-line question, 52 characters at 32, is about 850);
 * two-line questions are 96 high, one-line ones 60, 48 between them. The
 * spine arrows stand at x 120. Types that leave the spine go right, from
 * x 1048 to boxes 440 wide at x 1236 ("not a data analysis" about 310). The
 * fourth question splits: no leads down to question 5 (x 4..664), yes to the
 * right and down to question 6 (x 904..1664). Their answers end in four
 * boxes 300 wide on the row y 680..740, the methods in grey at y 776.
 *   Q1 y 2..62    Q2 y 110..170    Q3 y 218..314    Q4 y 362..458
 *   Q5, Q6 y 506..602    split at y 640    types y 680..740 */
(function () {
  const W = 1044;
  const down = (y1, y2, text) => [d.arrow(120, y1, 120, y2, { color: C.gray }),
    d.label(136, 0, text, { size: 32, color: C.gray, centerY: (y1 + y2) / 2 })];
  const exit = (cy, text, type) => [d.arrow(W + 4, cy, 1236, cy, { color: C.gray }),
    d.label(1142, 0, text, { size: 32, color: C.gray, anchor: "middle", centerY: cy + 24 }),
    type ? typeBox(1236, cy - 30, 440, 60, type)
      : d.box(1236, cy - 30, 440, 60, "not a data analysis", { border: C.gray, color: C.gray, dashed: true })];
  // a split under a box: down from its middle, across, and down into two types
  const split = (cx, left, right, labels, names) => [
    d.line(cx, 602, cx, 640, { color: C.gray }), d.line(left, 640, right, 640, { color: C.gray }),
    d.arrow(left, 640, left, 680, { color: C.gray }), d.arrow(right, 640, right, 680, { color: C.gray }),
    d.label(left - 14, 0, labels[0], { size: 32, color: C.gray, anchor: "end", centerY: 662 }),
    d.label(right - 14, 0, labels[1], { size: 32, color: C.gray, anchor: "end", centerY: 662 }),
    typeBox(left - 150, 680, 300, 60, names[0]), typeBox(right - 150, 680, 300, 60, names[1])];
  el("fig-tree").innerHTML = d.svg(1680, 804,
    d.g("s0", textBox(4, 2, W, 60, "did you summarise the data?")),
    d.g("s1", ...exit(32, "no", null)),
    d.g("s2", ...down(62, 110, "yes"), textBox(4, 110, W, 60, "did you report the summaries without interpretation?"),
      ...exit(140, "yes", "descriptive")),
    d.g("s3", ...down(170, 218, "no"),
      textBox(4, 218, W, 96, "did you quantify whether your discoveries\nare likely to hold in a new sample?"),
      ...exit(266, "no", "exploratory")),
    d.g("s4", ...down(314, 362, "yes"),
      textBox(4, 362, W, 96, "are you trying to figure out how changing the\naverage of one measurement affects another?"),
      d.arrow(334, 458, 334, 506, { color: C.gray }), d.label(348, 0, "no", { size: 32, color: C.gray, centerY: 482 }),
      d.line(W + 4, 410, 1284, 410, { color: C.gray }), d.arrow(1284, 410, 1284, 506, { color: C.gray }),
      d.label(1166, 0, "yes", { size: 32, color: C.gray, anchor: "middle", centerY: 388 })),
    d.g("s5", ...split(334, 174, 514, ["yes", "no"], ["predictive", "inferential"]),
      textBox(4, 506, 660, 96, "are you trying to predict\nmeasurement(s) for individuals?")),
    d.g("s6", ...split(1284, 1084, 1484, ["average", "deterministic"], ["causal", "mechanistic"]),
      textBox(904, 506, 760, 96, "is the effect you are looking for\nan average or a deterministic effect?")),
    d.g("s7",
      d.label(174, 0, "machine learning", { size: 32, color: C.gray, anchor: "middle", centerY: 776 }),
      d.label(1084, 0, "experiments, causal inference", { size: 32, color: C.gray, anchor: "middle", centerY: 776 })));
  const a = d.anim("fig-tree");
  // one question per step, each with the answers that leave the tree there
  for (let k = 1; k <= 7; k++) a.step(a.show("s" + k, { dur: 600 }));
})();

/* --- slide: the step people skip -------------------------------------------------
 * Figure 1680 x 660 (has-punch). Three types in a row, 400 x 80 at x 70, 640
 * and 1210 (y 60..140), with what each one needs underneath at y 200 (the
 * longest, "needs a test against chance", is about 450 wide, centred under
 * its box). The yellow marker sits around the current type and moves 570 to
 * the right per step; a red cross under a requirement says it was not shown.
 * The claim stands in a box 1240 x 100 at (220, 400); the longest sentence,
 * 61 characters at 32, is about 980. */
(function () {
  const xs = [70, 640, 1210];
  const needs = ["holds for these 2,811 people", "needs a test against chance", "needs an experiment"];
  const claims = [
    "in our survey, younger respondents are more open to oat milk.",
    "young people in Germany are more open to oat milk.",
    "being young makes people more open to oat milk."];
  el("fig-skip").innerHTML = d.svg(1680, 660,
    d.arrow(470, 100, 640, 100, { color: C.gray }), d.arrow(1040, 100, 1210, 100, { color: C.gray }),
    ...["exploratory", "inferential", "causal"].map((t, k) => typeBox(xs[k], 60, 400, 80, t, { size: 48 })),
    ...needs.map((n, k) => d.label(xs[k] + 200, 0, n, { size: 32, color: C.gray, anchor: "middle", centerY: 200 })),
    d.g("x1", d.mark(840, 262, false)), d.g("x2", d.mark(1410, 262, false)),
    d.g("marker", `<rect x="56" y="46" width="428" height="108" rx="16" fill="none" stroke="${C.yellow}" stroke-width="4"/>`),
    d.label(240, 0, "the claim", { size: 32, color: C.gray, centerY: 364 }),
    d.box(220, 400, 1240, 100, "", { border: C.light, rx: 24 }),
    ...claims.map((c, k) => d.g("c" + k, d.label(840, 0, c, { size: 32, anchor: "middle", centerY: 450, keepCase: true }))));
  const a = d.anim("fig-skip");
  a.set("x1", { opacity: 0 }); a.set("x2", { opacity: 0 }); a.set("c1", { opacity: 0 }); a.set("c2", { opacity: 0 });
  // the sentence promises more, the marker moves on, and the evidence is missing
  a.step(a.par(a.swap("c0", "c1", { dur: 700 }), a.move("marker", 570, 0, { dur: 900 })), a.show("x1", { dur: 400 }));
  a.step(a.par(a.swap("c1", "c2", { dur: 700 }), a.move("marker", 570, 0, { dur: 900 })), a.show("x2", { dur: 400 }));
})();

/* --- slide: search long enough ---------------------------------------------------
 * Figure 1680 x 660 (has-punch). One dot per column of the survey, 606 dots in
 * rows of 34 on a pitch of 28 from (40, 70), so the grid ends at x 964 and
 * y 546. Blue lines join dots at random: the pairs that pass a test by chance.
 * The numbers stand on the right from x 1060, each number at 48 with its
 * caption in grey below; the longest caption line is about 30 characters
 * (480 at 32). The count comes from the last section of figures.R:
 * shuffling every column three times left 7,051, 7,217 and 7,276 of about
 * 144,000 testable pairs below p = 0.05. */
(function () {
  const pos = (i) => [40 + 28 * (i % 34), 70 + 28 * Math.floor(i / 34)];
  let seed = 7;
  const rand = (n) => { seed = (seed * 16807) % 2147483647; return seed % n; };
  const lines = [];
  for (let k = 0; k < 34; k++) {
    const [x1, y1] = pos(rand(606)), [x2, y2] = pos(rand(606));
    lines.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.blue}" stroke-width="1.5" stroke-opacity="0.8"/>`);
  }
  const dots = [];
  for (let i = 0; i < 606; i++) { const [x, y] = pos(i); dots.push(`<circle cx="${x}" cy="${y}" r="5" fill="${C.gray}"/>`); }
  const fact = (cy, number, caption, color) => [
    d.label(1060, 0, number, { size: 48, color, centerY: cy }),
    // a caption of two lines moves down by half a line, so its first line keeps its place
    d.label(1060, 0, caption, { size: 32, color: C.gray, centerY: cy + 64 + 21 * (caption.split("\n").length - 1) })];
  el("fig-chance").innerHTML = d.svg(1680, 660, ...lines, ...dots,
    ...fact(100, "606", "columns", C.white),
    ...fact(260, "183,315", "pairs of columns", C.white),
    ...fact(420, "about 7,000", "pass a test at 5 % even though\nevery column was shuffled", C.blue));
})();

/* --- slide: half of the table is empty -------------------------------------------
 * Figure 1680 x 660 (has-punch). The PNG holds one pixel per cell, 606 x 2811;
 * it is stretched to 1400 x 500 at (220, 70), so the whole table fits. Labels:
 * columns above, rows on the left (right-aligned at x 196), a legend at y 615. */
(function () {
  el("fig-missing").innerHTML = d.svg(1680, 660,
    d.image(220, 70, 1400, 500, "img/missing-cells.png", { fit: "none" }),
    d.label(920, 0, "606 columns", { size: 32, color: C.gray, anchor: "middle", centerY: 38 }),
    d.label(196, 0, "2,811\nrows", { size: 32, color: C.gray, anchor: "end", centerY: 320 }),
    `<rect x="220" y="600" width="32" height="32" fill="${C.light}"/>`,
    d.label(268, 0, "answered", { size: 32, color: C.gray, centerY: 616 }),
    `<rect x="480" y="600" width="32" height="32" fill="${C.dark}"/>`,
    d.label(528, 0, "empty", { size: 32, color: C.gray, centerY: 616 }));
})();

/* --- slide: unusual values ----------------------------------------------------------
 * Figure 1680 x 660 (has-punch). The two histograms from R, 1200 x 660 at the
 * left edge, swap into each other; on the right from x 1290 the 16 answers
 * above 20, four to a row, right-aligned at x 1380, 1470, 1560, 1650 (a value
 * of three digits at 32 in the code font is about 58). */
(function () {
  const extremes = [65, 80, 120, 140, 150, 159, 160, 167, 170, 170, 170, 250, 250, 280, 344, 999];
  el("fig-price").innerHTML = d.svg(1680, 660,
    d.g("full", d.image(0, 0, 1200, 660, "img/price-full.svg")),
    d.g("zoom", d.image(0, 0, 1200, 660, "img/price-zoom.svg")),
    d.g("extremes",
      d.label(1290, 0, "16 answers above 20", { size: 32, color: C.gray, centerY: 180 }),
      ...extremes.map((v, k) => d.label(1380 + 90 * (k % 4), 0, String(v),
        { size: 32, mono: true, anchor: "end", centerY: 250 + 56 * Math.floor(k / 4) }))));
  const a = d.anim("fig-price");
  a.set("zoom", { opacity: 0 }); a.set("extremes", { opacity: 0 });
  // the axis goes from 0 to 1000 to 0 to 5, and the distribution appears
  a.step(a.swap("full", "zoom", { dur: 900 }));
  a.step(a.show("extremes", { dur: 600 }));
})();

/* --- slide: mean or median? ----------------------------------------------------------
 * Figure 1680 x 660 (has-punch). Two rows, mean() at y 280 and median() at
 * y 460, names right-aligned at x 420 in the code font at 48; values at 80,
 * centred at x 760 (before) and 1340 (after), "8.11 €" about 250 wide. Grey
 * arrows between the columns from x 930 to 1170. */
(function () {
  const row = (cy, name, before, after, beforeColor) => [
    d.label(420, 0, name, { size: 48, mono: true, anchor: "end", centerY: cy }),
    d.label(760, 0, before, { size: 80, anchor: "middle", centerY: cy, color: beforeColor }),
    d.arrow(930, cy, 1170, cy, { color: C.gray }),
    d.label(1340, 0, after, { size: 80, anchor: "middle", centerY: cy })];
  el("fig-mean").innerHTML = d.svg(1680, 660,
    d.label(760, 0, "all 612 answers", { size: 32, color: C.gray, anchor: "middle", centerY: 120 }),
    d.label(1340, 0, "16 answers above 20 set to NA", { size: 32, color: C.gray, anchor: "middle", centerY: 120, keepCase: true }),
    ...row(280, "mean()", "8.11 €", "2.17 €", C.red),
    ...row(460, "median()", "1.99 €", "1.99 €", C.white));
})();

/* --- slide: from exploring to the next question -----------------------------------
 * Figure 1680 x 660 (has-punch). Three cards 516 wide on a pitch of 580 from
 * x 2: the finding (140 high, from y 40), an arrow, the question it raises
 * (dashed, 140 high, from y 250) and the type of that question in grey at
 * y 436. Text in two lines at 32 from x + 24; the longest line, "younger
 * respondents are", is about 370 wide. */
(function () {
  const cards = [
    ["younger respondents are\nmore open to oat milk", "does it hold for all\nof Germany?", "an inferential question"],
    ["vegans and vegetarians\nbuy more organic food", "is it the diet, or the\nincome behind it?", "a causal question"],
    ["16 price answers lie\nabove 20 €", "how should the\nquestionnaire ask?", "a question for the design"]];
  const parts = [];
  cards.forEach(([finding, question, type], k) => {
    const x = 2 + 580 * k, cx = x + 258;
    parts.push(d.arrow(cx, 180, cx, 250, { color: C.gray }),
      textBox(x, 40, 516, 140, finding, { border: C.light }),
      textBox(x, 250, 516, 140, question, { border: C.white, dashed: true, keepCase: true }),
      d.label(cx, 0, type, { size: 32, color: C.gray, anchor: "middle", centerY: 436 }));
  });
  el("fig-cards").innerHTML = d.svg(1680, 660, ...parts);
})();
