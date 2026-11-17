// Drawings of "ai as a copilot in empirical research".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without.
//
// Colors: gray for context, white for what you read first, blue for the
// share of the work an AI takes on, yellow for what is current or matters
// most, green and red only for the measured gains and losses on the frontier
// slide.
//
// Sources:
// - Kinds of AI: selection after the overview of the university library
//   Duisburg-Essen, "KI-Tools für Literaturrecherche und wissenschaftliches
//   Arbeiten" (as of November 2026), https://www.uni-due.de/ub/ki-tools.php
// - Phases: Döring (2023), Forschungsmethoden und Evaluation, 6th ed.,
//   section 1.3.1 (p. 23) and chapters 5 to 13, one per phase.
// - Dell'Acqua et al. (2023), HBS Working Paper 24-013: 758 BCG consultants,
//   GPT-4. Inside the frontier 12.2 % more tasks, 25.1 % faster, more than
//   40 % higher quality; outside it 19 percentage points less often correct.
// - Walters & Wilder (2023), Scientific Reports 13, 14045: 636 references;
//   fabricated 55 % (GPT-3.5) and 18 % (GPT-4); of the real ones, 43 % and
//   24 % had substantive errors.
// - Topaz et al. (2026), The Lancet 407, 1779–1781 (figures as reported by
//   Retraction Watch, 7 May 2026): papers with at least one fabricated
//   reference, 1 in 2,828 (2023), 1 in 458 (2025), 1 in 277 (first seven
//   weeks of 2026).
// - Rao, Wong & Callison-Burch (2026), arXiv 2604.03173: cited links that do
//   not resolve and were never archived, 10.7 % for two deep research agents
//   and 4.8 % for eight models with web search (pooled).
const d = window.draw;
const C = () => d.colors();
const put = (id, svg) => { const e = document.getElementById(id); if (e) e.innerHTML = svg; };

/* ------------------------------------------------------------------ */
/* Three kinds of AI, one column each, appearing one by one.            */
/* Text at 32 px holds 24 characters per line in a 520 wide column.     */
/* ------------------------------------------------------------------ */
const KINDS = [
  ["chatbots", "answer in a chat, on\nalmost any topic", "ChatGPT, Claude, Gemini,\nChat AI (GWDG)", "what you type\nor upload"],
  ["research tools", "do one job in research\nand do it well", "Consensus, Elicit,\nSciSpace, Litmaps,\nResearch Rabbit,\nNotebookLM", "a database of papers\nand your PDFs"],
  ["agents", "act on their own, on\nalmost any task", "OpenCode, Claude Code,\nCodex", "your files, programs\nand the web"],
];
function figKinds(step) {
  const c = C();
  const boxes = [], labels = [];
  const W = 520, G = 60, T = 20, H = 760;
  KINDS.forEach(([name, what, ex, reach], i) => {
    if (i > step) return;
    const x = i * (W + G);
    boxes.push(d.box(x + 2, T, W - 4, H - 4, "", { border: i === step ? c.white : c.dark, width: 2 }));
    labels.push(d.label(x + 36, 0, name, { size: 48, color: c.white, centerY: T + 70 }));
    labels.push(d.label(x + 36, 0, what, { size: 32, color: c.light, centerY: T + 175, lineHeight: 1.35 }));
    labels.push(d.label(x + 36, 0, "for example", { size: 20, color: c.gray, centerY: T + 285 }));
    labels.push(d.label(x + 36, 0, ex, { size: 32, color: c.white, keepCase: true, lineHeight: 1.35, centerY: T + 320 + ex.split("\n").length * 21.6 }));
    labels.push(d.label(x + 36, 0, "works with", { size: 20, color: c.gray, centerY: T + 590 }));
    labels.push(d.label(x + 36, 0, reach, { size: 32, color: c.light, lineHeight: 1.35, centerY: T + 668 }));
  });
  return d.svg(1680, 804, ...d.layers(boxes, labels));
}
function showKinds(slide, step) { put("fig-kinds", figKinds(step || 0)); }

/* ------------------------------------------------------------------ */
/* The nine phases of an empirical study after Döring (2023), in three  */
/* rows of three. Step 1 marks the middle row, which a secondary        */
/* analysis takes over from the people who ran the survey.              */
/* ------------------------------------------------------------------ */
function figPhases(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const W = 520, G = 60, H = 110;
  const rows = [
    { y: 60, title: "plan", phases: ["research topic", "state of research", "study design"] },
    { y: 310, title: "collect data", phases: ["operationalization", "sampling", "data collection"] },
    { y: 560, title: "analyze and report", phases: ["data preparation", "data analysis", "presentation"] },
  ];
  let n = 0;
  rows.forEach((r, ri) => {
    const other = step >= 1 && ri === 1;
    labels.push(d.label(0, 0, r.title, { size: 32, color: c.gray, centerY: r.y - 30 }));
    r.phases.forEach((t, i) => {
      n += 1;
      const x = i * (W + G);
      boxes.push(d.box(x + 2, r.y, W - 4, H, "", { border: other ? c.dark : c.light, dashed: other }));
      labels.push(d.label(x + 32, 0, String(n), { size: 32, color: c.gray, mono: true, centerY: r.y + H / 2 }));
      labels.push(d.label(x + 90, 0, t, { size: 32, color: other ? c.gray : c.white, centerY: r.y + H / 2 }));
      if (i) wires.push(d.arrow(x - G + 6, r.y + H / 2, x - 4, r.y + H / 2, { color: c.gray, width: 3 }));
    });
  });
  if (step >= 1) labels.push(d.label(0, 0, "in a secondary analysis, the people who ran the survey did these", { size: 32, color: c.gray, centerY: 450 }));
  return d.svg(1680, 700, ...d.layers(wires, boxes, labels));
}
function showPhases(slide, step) { put("fig-phases", figPhases(step || 0)); }

/* ------------------------------------------------------------------ */
/* Three levels of AI use as a staircase: each level a column that      */
/* starts higher than the one before. The bar on top shows the share    */
/* of the work the AI takes on (blue) and the share that stays yours.   */
/* Text at 32 px holds 23 characters per line (460 px inside a column). */
/* Step n shows the levels 1 to n + 1.                                  */
/* ------------------------------------------------------------------ */
const LEVEL_NAMES = ["1  ai advises", "2  ai drafts, you review", "3  ai does it, you check"];
const LEVELS = {
  general: [
    "you do the work, and\nai explains, suggests\nand gives feedback",
    "ai makes a draft, and\nyou review, change\nand decide",
    "an agent does the whole\nstep, and you check\nthe result",
  ],
  question: [
    "you write the question,\nai says which columns\nof the codebook fit",
    "ai suggests five\nquestions for the data,\nyou pick one and\nsharpen it",
    "an agent reads codebook\nand data, picks a\nquestion and checks\nthat the data answer it",
  ],
  literature: [
    "ai suggests search\nterms, you search the\nlibrary and read",
    "a research tool finds\nand summarizes\nstudies, you read the\nbest ones",
    "an agent searches\ndatabases in the\nbrowser, reads the\npapers and writes the\nstate of research",
  ],
  analysis: [
    "you write the r code,\nai explains errors\nand functions",
    "ai writes the r code,\nyou run it and check\nthe numbers",
    "an agent writes, runs\nand fixes the code and\nreports the results",
  ],
  figures: [
    "you draw the chart,\nai suggests what to\nimprove",
    "ai writes the ggplot2\ncode, you adjust\nlabels and order",
    "an agent draws all\ncharts and puts them\ninto the paper",
  ],
  writing: [
    "you write, ai gives\nfeedback on structure\nand language",
    "ai drafts a section\nfrom your notes, and\nyou rewrite it",
    "an agent writes the\nwhole paper from data\nand sources",
  ],
};
function figLevels(topic, step) {
  const c = C();
  const boxes = [], labels = [];
  const W = 520, G = 60, B = 740;
  const tops = [330, 220, 110];
  const share = [0.2, 0.6, 0.9];
  (LEVELS[topic] || LEVELS.general).forEach((t, i) => {
    if (i > step) return;
    const x = i * (W + G), T = tops[i];
    const now = i === step;
    labels.push(d.label(x, 0, LEVEL_NAMES[i], { size: 32, color: now ? c.white : c.light, centerY: T - 36 }));
    boxes.push(d.box(x + 2, T, W - 4, B - T, "", { border: now ? c.white : c.dark, width: 2 }));
    const bx = x + 30, bw = W - 60;
    boxes.push(d.box(bx, T + 30, bw, 24, "", { border: null, fill: c.dark, rx: 3 }));
    boxes.push(d.box(bx, T + 30, bw * share[i], 24, "", { border: null, fill: c.blue, rx: 3 }));
    const lines = t.split("\n").length;
    labels.push(d.label(bx, 0, t, { size: 32, color: now ? c.white : c.light, lineHeight: 1.35, centerY: T + 96 + lines * 21.6 }));
  });
  labels.push(d.label(0, 0, "blue: the share of the work done by ai", { size: 20, color: c.gray, centerY: 784 }));
  return d.svg(1680, 804, ...d.layers(boxes, labels));
}
function showLevels(slide, step) {
  const el = slide.querySelector(".figure[data-levels]");
  if (el) el.innerHTML = figLevels(el.dataset.levels, step || 0);
}

/* ------------------------------------------------------------------ */
/* The jagged frontier: a zig-zag line splits tasks an AI does well    */
/* from those it does badly, with the measured effects on each side.   */
/* ------------------------------------------------------------------ */
function figFrontier() {
  const c = C();
  const parts = [];
  const xs = [880, 760, 980, 820, 1040, 860, 960, 780, 900];
  const pts = xs.map((x, i) => [x, i * (660 / (xs.length - 1))]);
  const poly = [[0, 0], ...pts, [0, 660]].map((p) => p.join(",")).join(" ");
  parts.push(`<polygon points="${poly}" fill="${c.dark}" fill-opacity="0.45"/>`);
  parts.push(`<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${c.light}" stroke-width="3" stroke-linejoin="round"/>`);
  parts.push(d.label(40, 0, "inside the frontier", { size: 48, color: c.white, centerY: 110 }));
  ["12.2 % more tasks done", "25.1 % faster", "over 40 % higher quality"].forEach((t, i) => {
    parts.push(d.label(40, 0, t, { size: 32, color: c.green, centerY: 220 + i * 70 }));
  });
  parts.push(d.label(40, 0, "with ai than without", { size: 32, color: c.gray, centerY: 450 }));
  parts.push(d.label(1100, 0, "outside it", { size: 48, color: c.white, centerY: 110 }));
  parts.push(d.label(1100, 0, "19 percentage points\nless often correct", { size: 32, color: c.red, centerY: 255 }));
  parts.push(d.label(1100, 0, "with ai than without", { size: 32, color: c.gray, centerY: 450 }));
  return d.svg(1680, 660, ...parts);
}

/* ------------------------------------------------------------------ */
/* Invented references in 2023: share of fabricated references per     */
/* model, bars from 0 to 100 %; the real ones with errors as gray text. */
/* ------------------------------------------------------------------ */
function figReferences() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const X = 300, Wf = 1100;   // 0 % at X, 100 % at X + Wf
  const rows = [["GPT-3.5", 55, 43], ["GPT-4", 18, 24]];
  labels.push(d.label(X, 0, "references that do not exist", { size: 32, color: c.gray, centerY: 50 }));
  rows.forEach(([m, f, e], i) => {
    const y = 110 + i * 230;
    labels.push(d.label(0, 0, m, { size: 48, color: c.white, centerY: y + 50, keepCase: true }));
    boxes.push(d.box(X, y, Wf * f / 100, 100, "", { border: null, fill: c.blue, rx: 4 }));
    labels.push(d.label(X + Wf * f / 100 + 24, 0, f + " %", { size: 48, color: c.white, centerY: y + 50 }));
    labels.push(d.label(X, 0, `of the real ones, ${e} % had errors in authors, year or pages`, { size: 32, color: c.gray, centerY: y + 150 }));
  });
  wires.push(d.line(X, 90, X, 560, { color: c.gray, width: 2 }));
  return d.svg(1680, 660, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* Made-up references in 2026, two panels. Left: published biomedical  */
/* papers that cite at least one reference that does not exist, per    */
/* 10,000 papers (1 in 2,828 = 3.5; 1 in 458 = 21.8; 1 in 277 = 36.1). */
/* Right: cited links in AI answers that never existed.                 */
/* ------------------------------------------------------------------ */
function figRefs2026() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  // left panel: x 0..780
  labels.push(d.label(0, 0, "biomedical papers citing a\nreference that does not exist", { size: 32, color: c.gray, centerY: 60, lineHeight: 1.3 }));
  const L = [["2023", 3.5, "1 in 2,828"], ["2025", 21.8, "1 in 458"], ["2026", 36.1, "1 in 277"]];
  const X1 = 140, S1 = 12;   // 12 units per paper in 10,000
  L.forEach(([y, v, t], i) => {
    const cy = 200 + i * 130;
    const now = i === 2;
    labels.push(d.label(0, 0, y, { size: 32, color: now ? c.white : c.light, centerY: cy }));
    boxes.push(d.box(X1, cy - 40, v * S1, 80, "", { border: null, fill: now ? c.yellow : c.gray, rx: 4 }));
    labels.push(d.label(X1 + v * S1 + 20, 0, t, { size: 32, color: now ? c.white : c.light, centerY: cy }));
  });
  wires.push(d.line(X1, 150, X1, 510, { color: c.gray, width: 2 }));
  labels.push(d.label(0, 0, "2026: the first seven weeks", { size: 20, color: c.gray, centerY: 560 }));
  // right panel: x 940..1680
  const X2 = 940, S2 = 50;   // 50 units per percent
  labels.push(d.label(X2, 0, "links in ai answers\nthat never existed", { size: 32, color: c.gray, centerY: 60, lineHeight: 1.3 }));
  const R = [["deep research agents", 10.7], ["models with web search", 4.8]];
  R.forEach(([t, v], i) => {
    const y = 160 + i * 180;
    labels.push(d.label(X2, 0, t, { size: 32, color: c.light, centerY: y }));
    boxes.push(d.box(X2, y + 30, v * S2, 80, "", { border: null, fill: c.gray, rx: 4 }));
    labels.push(d.label(X2 + v * S2 + 20, 0, v + " %", { size: 32, color: c.white, centerY: y + 70 }));
  });
  return d.svg(1680, 660, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* A table for the appendix: one row per use of AI. Left-aligned        */
/* columns; the last column, how you checked, is the one that counts.   */
/* ------------------------------------------------------------------ */
const USE_COLS = [0, 380, 830, 1140];
const USE_ROWS = [
  ["tool and model", "what for", "section", "how checked"],
  ["agent (model)", "r code for figure 2", "results", "ran it, counted n by hand"],
  ["chatbot (model)", "search terms", "introduction", "searched the library"],
  ["research tool", "finding studies", "introduction", "read every study cited"],
  ["agent (model)", "feedback on structure", "methods", "took 2 of 5 points"],
];
function figUseTable() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const top = 40, rh = 120;
  boxes.push(d.box(USE_COLS[3] - 30, top - 10, 1680 - USE_COLS[3] + 28, rh * USE_ROWS.length, "", { border: null, fill: c.dark, rx: 6 }));
  USE_ROWS.forEach((row, r) => {
    const cy = top + 50 + r * rh;
    row.forEach((t, k) => {
      const head = r === 0;
      const color = head ? (k === 3 ? c.white : c.gray) : (k === 3 ? c.white : c.light);
      labels.push(d.label(USE_COLS[k], 0, t, { size: 32, color, centerY: cy }));
    });
    if (r < USE_ROWS.length - 1) wires.push(d.line(0, cy + rh / 2, 1680, cy + rh / 2, { color: r === 0 ? c.gray : c.dark, width: 2 }));
  });
  return d.svg(1680, 660, ...d.layers(boxes, wires, labels));
}

// drawn at once, before stagekit.js builds the frames
put("fig-kinds", figKinds(0));
put("fig-phases", figPhases(0));
document.querySelectorAll(".figure[data-levels]").forEach((el) => { el.innerHTML = figLevels(el.dataset.levels, 0); });
put("fig-frontier", figFrontier());
put("fig-references", figReferences());
put("fig-refs-2026", figRefs2026());
put("fig-use-table", figUseTable());
Object.assign(window, { showKinds, showPhases, showLevels });
