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
/* the survey, type in R, summary, chart as a sketch with its name.     */
/* Columns 345 wide from x = 300; longest entry "<fct> with levels" is  */
/* 17 characters of 32 px code, about 326.                              */
/* ------------------------------------------------------------------ */
function figScales() {
  const c = C();
  const x0 = 300, cw = 345;
  const cx = (i) => x0 + i * cw + cw / 2;
  const cols = ["nominal", "ordinal", "interval", "ratio"];
  const examples = [["diet", "omnivore, vegan, …"], ["milk_freq", "daily … rarely"],
                    ["year of birth", "1958, 1987, …"], ["age", "23, 67, …"]];
  const types = ["<fct>", "<fct> with levels", "<dbl>", "<dbl>"];
  const sums = ["count()", "count(), median()", "mean(), sd()", "mean(), sd()"];
  const plots = ["bars, by\nfrequency", "bars, in the\norder of the scale", "histogram,\nboxplot", "histogram,\nboxplot"];
  const yEx = 180, yType = 290, ySum = 360, ySk = 405, yPlot = 560;
  const parts = [
    d.label(x0 + cw, 0, "categorical", { size: 32, color: c.gray, anchor: "middle", centerY: 20 }),
    d.label(x0 + 3 * cw, 0, "metric", { size: 32, color: c.gray, anchor: "middle", centerY: 20 }),
    d.line(x0 + 20, 46, x0 + 2 * cw - 20, 46, { color: c.dark, width: 2 }),
    d.line(x0 + 2 * cw + 20, 46, x0 + 4 * cw - 20, 46, { color: c.dark, width: 2 }),
    d.line(0, 130, 1680, 130, { color: c.dark, width: 2 }),
    d.label(0, 0, "example", { size: 32, color: c.gray, centerY: yEx }),
    d.label(0, 0, "in R", { size: 32, color: c.gray, centerY: yType, keepCase: true }),
    d.label(0, 0, "summary", { size: 32, color: c.gray, centerY: ySum }),
    d.label(0, 0, "chart", { size: 32, color: c.gray, centerY: 480 }),
  ];
  cols.forEach((t, i) => {
    parts.push(d.label(cx(i), 0, t, { size: 48, anchor: "middle", centerY: 88 }));
    parts.push(d.label(cx(i), 0, examples[i][0], { size: 32, anchor: "middle", color: c.light, centerY: yEx, mono: i !== 2, keepCase: true }));
    parts.push(d.label(cx(i), 0, examples[i][1], { size: 32, anchor: "middle", color: c.gray, centerY: yEx + 42 }));
    parts.push(d.label(cx(i), 0, types[i], { size: 32, anchor: "middle", mono: true, keepCase: true, color: c.light, centerY: yType }));
    parts.push(d.label(cx(i), 0, sums[i], { size: 32, anchor: "middle", mono: true, keepCase: true, color: c.light, centerY: ySum }));
    parts.push(d.label(cx(i), 0, plots[i], { size: 32, anchor: "middle", color: c.light, centerY: yPlot, lineHeight: 1.3 }));
  });
  parts.push(placed(cx(0) - 97, ySk, 0.75, sketch.barsSorted(c)));
  parts.push(placed(cx(1) - 97, ySk, 0.75, sketch.barsScale(c)));
  [2, 3].forEach((i) => {
    parts.push(placed(cx(i) - 150, ySk + 25, 0.55, sketch.hist(c)));
    parts.push(placed(cx(i) + 7, ySk + 25, 0.55, sketch.box(c)));
  });
  return put("fig-scales", d.svg(1680, 620, ...parts));
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
/* A chart in layers. Three sheets one above the other like slides on   */
/* a projector, each a parallelogram 560 x 150 shifted by 70 to the     */
/* right per layer: data (a small table), aesthetics (the axes), geom   */
/* (bars). On the right in grey the layers that only refine.            */
/* ------------------------------------------------------------------ */
function figGrammar() {
  const c = C();
  const parts = [];
  const sheet = (x, y, inner, name, sub) => {
    const sk = 90;  // horizontal skew of the sheet
    parts.push(`<polygon points="${x + sk},${y} ${x + 560 + sk},${y} ${x + 560},${y + 150} ${x},${y + 150}" fill="${c.bg}" stroke="${c.light}" stroke-width="3"/>`);
    parts.push(inner(x, y));
    parts.push(d.label(x + 700, 0, name, { size: 48, centerY: y + 60, mono: true, keepCase: true }));
    parts.push(d.label(x + 700, 0, sub, { size: 32, color: c.gray, centerY: y + 112 }));
  };
  // geom at the bottom, data on top, drawn bottom up so the upper sheets cover the lower
  sheet(80, 470, (x, y) => [60, 100, 80, 40, 120].map((h, i) =>
    `<rect x="${x + 150 + i * 70}" y="${y + 135 - h * 0.9}" width="44" height="${h * 0.9}" fill="${c.blue}"/>`).join(""),
    "geom_bar()", "the form: bars, points, boxes");
  sheet(80, 270, (x, y) =>
    `<line x1="${x + 130}" y1="${y + 130}" x2="${x + 540}" y2="${y + 130}" stroke="${c.light}" stroke-width="3"/>` +
    `<line x1="${x + 150}" y1="${y + 135}" x2="${x + 180}" y2="${y + 20}" stroke="${c.light}" stroke-width="3"/>` +
    d.label(x + 470, 0, "x = diet", { size: 20, color: c.gray, mono: true, keepCase: true, centerY: y + 108 }),
    "aes()", "which column goes where");
  sheet(80, 70, (x, y) => [0, 1, 2, 3].map((r) =>
    [0, 1, 2].map((k) => `<rect x="${x + 150 + k * 120 - r * 14}" y="${y + 22 + r * 28}" width="104" height="18" fill="${c.dark}"/>`).join("")).join(""),
    "survey", "the data, one row per person");
  // what only refines, in grey on the right
  parts.push(d.line(1330, 90, 1330, 600, { color: c.dark, width: 2 }));
  parts.push(d.label(1380, 0, "refined by:", { size: 32, color: c.gray, centerY: 250 }));
  parts.push(d.label(1380, 0, "labs()\nscale_…()\ntheme()", { size: 32, color: c.gray, mono: true, keepCase: true, centerY: 380, lineHeight: 1.5 }));
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
