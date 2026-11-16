/* Drawings of the deck "data visualisation with R and ggplot2".
 *
 * Font sizes only 20, 32, 48 and 80. Slides with steps always draw the full
 * geometry and only change colours, so nothing can move between two steps.
 * Width estimate: code font 0.6 em per character, Arial about 0.55 em.
 * The charts with data are not drawn here but by ggplot2:
 * scripts/data-visualisation-figures.R in the repository writes img/fig-*.svg.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();
const put = (id, svg) => { if ($(id)) $(id).innerHTML = svg; return svg; };

/* ------------------------------------------------------------------ */
/* Small schematic charts, 260 x 140 from (0, 0), no data. Marks in     */
/* gray_light; the caller moves and scales them with placed().          */
/* ------------------------------------------------------------------ */
const axis = (c) => `<line x1="0" y1="140" x2="260" y2="140" stroke="${c.gray}" stroke-width="2"/>`;
const rect = (x, y, w, h, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`;
const boxes = (c, qs, x0 = 30) => qs.map((q, i) => {
  const bx = x0 + i * 80, w = 50, Y = (v) => 140 - v;
  return `<line x1="${bx + w / 2}" y1="${Y(q[0])}" x2="${bx + w / 2}" y2="${Y(q[4])}" stroke="${c.light}" stroke-width="3"/>` +
    `<rect x="${bx}" y="${Y(q[3])}" width="${w}" height="${q[3] - q[1]}" fill="${c.bg}" stroke="${c.light}" stroke-width="3"/>` +
    `<line x1="${bx}" y1="${Y(q[2])}" x2="${bx + w}" y2="${Y(q[2])}" stroke="${c.light}" stroke-width="3"/>`;
}).join("");
const sketch = {
  // nominal: horizontal bars, longest on top
  barsSorted: (c) => [230, 170, 110, 60, 30].map((w, i) => rect(0, 6 + i * 27, w, 20, c.light)).join("") +
    `<line x1="0" y1="0" x2="0" y2="140" stroke="${c.gray}" stroke-width="2"/>`,
  // ordinal: bars in the order of the scale, heights not sorted
  barsScale: (c) => [110, 40, 70, 30, 55].map((h, i) => rect(20 + i * 50, 140 - h, 34, h, c.light)).join("") + axis(c),
  hist: (c) => [20, 50, 95, 130, 100, 60, 30, 12].map((h, i) => rect(10 + i * 30, 140 - h, 29, h, c.light)).join("") + axis(c),
  box: (c) => boxes(c, [[30, 60, 80, 105, 130]], 105) + axis(c),
  stacked: (c) => [[0.5, 0.5], [0.3, 0.7], [0.15, 0.85]].map((p, i) => {
    const bx = 40 + i * 70, w = 46, h1 = 140 * p[0];
    return rect(bx, 0, w, h1, c.blue) + rect(bx, h1, w, 140 - h1, c.dark);
  }).join(""),
  boxes: (c) => boxes(c, [[30, 60, 80, 105, 130], [15, 45, 60, 90, 120], [40, 70, 95, 110, 135]]) + axis(c),
  scatter: (c) => [[20, 30], [45, 50], [60, 40], [80, 75], [100, 70], [120, 95], [140, 90], [165, 115], [185, 105], [210, 130], [235, 120]]
    .map(([a, b]) => `<circle cx="${10 + a}" cy="${140 - b}" r="7" fill="${c.light}"/>`).join(""),
};
const placed = (x, y, k, svg) => `<g transform="translate(${x} ${y}) scale(${k})">${svg}</g>`;

/* ------------------------------------------------------------------ */
/* The scale decides. Four columns (nominal, ordinal, interval, ratio), */
/* above every two the group (categorical, metric), rows: example from  */
/* the survey (every one a column: the birth year only in the full    */
/* survey, the compact one turned it into age), type in R, summary,   */
/* chart as a sketch with its name.                                    */
/* Columns 345 wide from x = 300; longest entry "<fct> with levels" is  */
/* 17 characters of 32 px code, about 326.                              */
/* ------------------------------------------------------------------ */
function figScales(slide, step) {
  // rows appear one at a time: 0 the four scales, 1 example, 2 in R,
  // 3 summary, 4 chart; hidden rows keep their place (opacity 0)
  const s = step === undefined ? 0 : step;
  const c = C();
  const x0 = 300, cw = 345;
  const cx = (i) => x0 + i * cw + cw / 2;
  const cols = ["nominal", "ordinal", "interval", "ratio"];
  const examples = [["diet", "omnivore, vegan, …"], ["milk_freq", "daily … rarely"],
                    ["q002geburt", "1958, 1987, …"], ["age", "23, 67, …"]];
  const types = ["<fct>", "<fct> with levels", "<dbl>", "<dbl>"];
  const sums = ["count()", "count(), median()", "mean(), sd()", "mean(), sd()"];
  const plots = ["bars, by\nfrequency", "bars, in the\norder of the scale", "histogram,\nboxplot", "histogram,\nboxplot"];
  const yEx = 220, yType = 340, ySum = 430, ySk = 490, yPlot = 690;
  const rows = [[], [], [], [], []];
  rows[0].push(
    d.label(x0 + cw, 0, "categorical", { size: 32, color: c.gray, anchor: "middle", centerY: 20 }),
    d.label(x0 + 3 * cw, 0, "metric", { size: 32, color: c.gray, anchor: "middle", centerY: 20 }),
    d.line(x0 + 20, 46, x0 + 2 * cw - 20, 46, { color: c.dark, width: 2 }),
    d.line(x0 + 2 * cw + 20, 46, x0 + 4 * cw - 20, 46, { color: c.dark, width: 2 }),
    d.line(0, 140, 1680, 140, { color: c.dark, width: 2 }));
  rows[1].push(d.label(0, 0, "example", { size: 32, color: c.gray, centerY: yEx + 22 }));
  rows[2].push(d.label(0, 0, "in R", { size: 32, color: c.gray, centerY: yType, keepCase: true }));
  rows[3].push(d.label(0, 0, "summary", { size: 32, color: c.gray, centerY: ySum }));
  rows[4].push(d.label(0, 0, "chart", { size: 32, color: c.gray, centerY: ySk + 63 }));
  cols.forEach((t, i) => {
    rows[0].push(d.label(cx(i), 0, t, { size: 48, anchor: "middle", centerY: 94 }));
    rows[1].push(d.label(cx(i), 0, examples[i][0], { size: 32, anchor: "middle", color: c.light, centerY: yEx, mono: true, keepCase: true }));
    rows[1].push(d.label(cx(i), 0, examples[i][1], { size: 32, anchor: "middle", color: c.gray, centerY: yEx + 44 }));
    rows[2].push(d.label(cx(i), 0, types[i], { size: 32, anchor: "middle", mono: true, keepCase: true, color: c.light, centerY: yType }));
    rows[3].push(d.label(cx(i), 0, sums[i], { size: 32, anchor: "middle", mono: true, keepCase: true, color: c.light, centerY: ySum }));
    rows[4].push(d.label(cx(i), 0, plots[i], { size: 32, anchor: "middle", color: c.light, centerY: yPlot, lineHeight: 1.3 }));
  });
  // sketches 260 x 140: categorical ones at 0.9 (234 x 126), the metric pair
  // at 0.6 (156 x 84), centred in the same band
  rows[4].push(placed(cx(0) - 117, ySk, 0.9, sketch.barsSorted(c)));
  rows[4].push(placed(cx(1) - 117, ySk, 0.9, sketch.barsScale(c)));
  [2, 3].forEach((i) => {
    rows[4].push(placed(cx(i) - 162, ySk + 21, 0.6, sketch.hist(c)));
    rows[4].push(placed(cx(i) + 6, ySk + 21, 0.6, sketch.box(c)));
  });
  const parts = rows.map((r, k) => `<g opacity="${s >= k ? 1 : 0}">${r.join("")}</g>`);
  const el = slide ? slide.querySelector("#fig-scales") : $("fig-scales");
  const svg = d.svg(1680, 760, ...parts);
  if (el) el.innerHTML = svg;
  return svg;
}
window.figScales = figScales;

/* ------------------------------------------------------------------ */
/* The map of part 1: two rows (one variable, two variables), three     */
/* cells each, every cell with its question, a sketch and the chart.    */
/* row = 0 or 1 frames the cells of that row in blue and greys the      */
/* other row; row = -1 shows all cells alike. Cells 520 x 300 at        */
/* x = 260 + i * 470; the longest name "stacked bars to 100 %" is 21    */
/* characters at 32 px, about 370.                                      */
/* ------------------------------------------------------------------ */
const MAP = [
  [{ q: "nominal", name: "bars by frequency", s: "barsSorted" },
   { q: "ordinal", name: "bars in scale order", s: "barsScale" },
   { q: "a number", name: "histogram, boxplot", s: "hist" }],
  [{ q: "two categories", name: "stacked bars to 100 %", s: "stacked" },
   { q: "a number by group", name: "boxplots side by side", s: "boxes" },
   { q: "two numbers", name: "scatter plot", s: "scatter" }],
];
function mapSvg(row) {
  const c = C();
  const parts = [];
  const rowY = [0, 340], rowName = ["one variable", "two variables"];
  MAP.forEach((cells, r) => {
    const on = row < 0 || row === r;
    parts.push(d.label(0, 0, rowName[r], { size: 32, color: on ? c.light : c.dark, centerY: rowY[r] + 150, lineHeight: 1.3 }));
    cells.forEach((cell, i) => {
      const x = 300 + i * 460, y = rowY[r];
      if (row === r) parts.push(d.box(x, y + 4, 420, 292, "", { border: c.blue, width: 3 }));
      parts.push(d.label(x + 210, 0, cell.q, { size: 32, color: on ? c.gray : c.dark, anchor: "middle", centerY: y + 44 }));
      const sk = sketch[cell.s](on ? c : { ...c, light: c.dark, blue: c.dark, gray: c.dark });
      parts.push(`<g opacity="${on ? 1 : 0.6}">${placed(x + 80, y + 80, 1, sk)}</g>`);
      parts.push(d.label(x + 210, 0, cell.name, { size: 32, color: on ? c.white : c.dark, anchor: "middle", centerY: y + 256 }));
    });
  });
  return d.svg(1680, 640, ...parts);
}
function figMap() { return put("fig-map", mapSvg(-1)); }
function figMapOne() { return put("fig-map-one", mapSvg(0)); }
function figMapTwo() { return put("fig-map-two", mapSvg(1)); }
Object.assign(window, { figMap, figMapOne, figMapTwo });

/* ------------------------------------------------------------------ */
/* A chart in layers, as an exploded view: three sheets lying in the    */
/* same oblique plane, one above the other, joined at their corners by  */
/* dashed lines. Each sheet is drawn flat (640 x 320) and put into the  */
/* plane by one matrix, so table, axes and bars share the perspective.  */
/* Labels sit on the right, joined to their sheet by a thin line; what  */
/* has defaults (the other four layers) stands in grey beyond a rule.  */
/* Widths: "which column goes where" 23 chars x 32 x 0.55 = 405, from   */
/* x = 980 to 1385; "more layers:" 211 from 1470.                       */
/* ------------------------------------------------------------------ */
function figGrammar() {
  const c = C();
  const W = 640, H = 320, k = 0.6, f = 0.42, X = 60;
  const Ys = [40, 250, 460];
  const plane = (Y, inner) => `<g transform="matrix(1 0 ${k} ${f} ${X} ${Y})">${inner}</g>`;
  const P = (x, y, Y) => [X + x + k * y, Y + f * y];
  const ns = 'vector-effect="non-scaling-stroke"';
  const sheet = (Y, inner) => plane(Y,
    `<rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="${c.bg}" stroke="${c.light}" stroke-width="3" ${ns}/>` + inner);

  // data: a header row and five rows of cells
  const table = [0, 1, 2, 3].map((j) =>
    `<rect x="${50 + j * 140}" y="34" width="124" height="34" rx="4" fill="${c.gray}"/>` +
    [0, 1, 2, 3, 4].map((r) => `<rect x="${50 + j * 140}" y="${88 + r * 42}" width="124" height="28" rx="4" fill="${c.dark}"/>`).join("")).join("");
  // aesthetics: two axes with ticks, the space the data will be mapped into
  const axes =
    `<line x1="70" y1="270" x2="590" y2="270" stroke="${c.light}" stroke-width="3" ${ns}/>` +
    `<line x1="70" y1="270" x2="70" y2="40" stroke="${c.light}" stroke-width="3" ${ns}/>` +
    [150, 250, 350, 450, 550].map((x) => `<line x1="${x}" y1="270" x2="${x}" y2="290" stroke="${c.light}" stroke-width="3" ${ns}/>`).join("") +
    [200, 130, 60].map((y) => `<line x1="50" y1="${y}" x2="70" y2="${y}" stroke="${c.light}" stroke-width="3" ${ns}/>`).join("");
  // geom: bars on a baseline
  const bars = `<line x1="70" y1="270" x2="590" y2="270" stroke="${c.dark}" stroke-width="3" ${ns}/>` +
    [120, 200, 160, 80, 230].map((h, i) => `<rect x="${110 + i * 100}" y="${270 - h}" width="70" height="${h}" fill="${c.blue}"/>`).join("");

  const parts = [];
  // corner lines first, so the sheets cover them
  [[0, 0], [W, 0], [0, H], [W, H]].forEach(([x, y]) => {
    for (let i = 0; i < 2; i++) {
      const [x1, y1] = P(x, y, Ys[i]), [x2, y2] = P(x, y, Ys[i + 1]);
      parts.push(d.line(x1, y1, x2, y2, { color: c.dark, width: 2, dashed: true }));
    }
  });
  parts.push(sheet(Ys[0], table), sheet(Ys[1], axes), sheet(Ys[2], bars));
  // axis names in screen coordinates, so the text is not slanted
  const [ax, ay] = P(600, 270, Ys[1]), [bx, by] = P(70, 30, Ys[1]);
  parts.push(d.label(ax + 14, 0, "x", { size: 32, color: c.gray, mono: true, keepCase: true, centerY: ay }));
  parts.push(d.label(bx - 64, 0, "y", { size: 32, color: c.gray, mono: true, keepCase: true, centerY: by }));

  const names = [["survey", "one row per person"], ["aes()", "which column goes where"], ["geom_bar()", "bars, points, boxes"]];
  names.forEach(([name, sub], i) => {
    const [rx, ry] = P(W, H / 2, Ys[i]);
    parts.push(d.line(rx + 16, ry, 950, ry, { color: c.dark, width: 2 }));
    parts.push(d.label(980, 0, name, { size: 48, mono: true, keepCase: true, centerY: ry - 22 }));
    parts.push(d.label(980, 0, sub, { size: 32, color: c.gray, centerY: ry + 30 }));
  });
  parts.push(d.line(1430, 60, 1430, 600, { color: c.dark, width: 2 }));
  parts.push(d.label(1470, 0, "more layers:", { size: 32, color: c.gray, centerY: 230 }));
  parts.push(d.label(1470, 0, "stat_…()\nfacet_…()\ncoord_…()\ntheme()", { size: 32, color: c.gray, mono: true, keepCase: true, centerY: 380, lineHeight: 1.5 }));
  return put("fig-grammar", d.svg(1680, 640, ...parts));
}
window.figGrammar = figGrammar;

/* ------------------------------------------------------------------ */
/* One layer at a time: the picture on the right follows the step.      */
/* ------------------------------------------------------------------ */
function layerStep(slide, step) {
  const s = Math.min(step || 0, 3);
  const img = slide.querySelector("img.layer");
  if (img) img.src = `img/fig-layer-${s + 1}.svg`;
  // the code lines keep their place: later lines are hidden, the newest is blue
  slide.querySelectorAll("[data-line]").forEach((line) => {
    const n = Number(line.dataset.line);
    line.style.visibility = n <= s ? "visible" : "hidden";
    line.classList.toggle("now", n === s && s > 0);
  });
}
window.layerStep = layerStep;

/* Start: draw the first pictures if the slides are there */
if ($("fig-scales")) figScales();
if ($("fig-map")) figMap();
if ($("fig-map-one")) figMapOne();
if ($("fig-map-two")) figMapTwo();
if ($("fig-grammar")) figGrammar();
