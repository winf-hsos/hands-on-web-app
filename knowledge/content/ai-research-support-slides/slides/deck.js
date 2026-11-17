// Drawings of "ai as a copilot in empirical research".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without.
//
// Colours: grey for context, white for what you read first, blue for the
// steps where an AI can take over much of the work (the map) and for the
// point of a chart, yellow for what is happening now, green and red only for
// the measured gains and losses on the frontier slide.
//
// Sources of the numbers:
// - Dell'Acqua et al. (2023), Navigating the jagged technological frontier,
//   HBS Working Paper 24-013: 758 BCG consultants, GPT-4. Inside the
//   frontier 12.2 % more tasks, 25.1 % faster, more than 40 % higher quality;
//   outside it 19 percentage points less likely to be correct.
// - Walters & Wilder (2023), Scientific Reports 13, 14045: 636 references in
//   84 short literature reviews; fabricated 55 % (GPT-3.5) and 18 % (GPT-4);
//   of the real ones, 43 % and 24 % had substantive errors.
const d = window.draw;
const C = () => d.colors();
const put = (id, svg) => { const e = document.getElementById(id); if (e) e.innerHTML = svg; };

/* ------------------------------------------------------------------ */
/* The map: seven steps of a study with existing survey data, in two   */
/* rows read left to right and top to bottom. Step 0 the planning row, */
/* step 1 the row of analysis and writing, step 2 marks in blue where   */
/* an AI can do much of the work.                                       */
/* ------------------------------------------------------------------ */
function figMap(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const s = step || 0;
  const W = 340, H = 120, G = 80;
  const rows = [
    { y: 110, title: "plan the study", steps: [["research\nquestion", 0], ["literature", 1], ["data and\ncodebook", 0]] },
    { y: 450, title: "analyse and write", steps: [["analysis", 1], ["figures", 1], ["writing", 1], ["presentation", 0]] },
  ];
  rows.forEach((r, ri) => {
    if (ri > s) return;
    labels.push(d.label(0, 0, r.title, { size: 32, color: c.gray, centerY: r.y - 40 }));
    r.steps.forEach(([t, ai], i) => {
      const x = i * (W + G);
      const border = s >= 2 ? (ai ? c.blue : c.white) : c.light;
      boxes.push(d.box(x + 2, r.y, W - 4, H, t, { border, color: c.white, width: s >= 2 ? 3 : 2 }));
      if (i) wires.push(d.arrow(x - G + 4, r.y + H / 2, x - 2, r.y + H / 2, { color: c.gray, width: 3 }));
    });
  });
  if (s >= 2) {
    boxes.push(d.box(2, 680, 60, 40, "", { border: c.blue, width: 3 }));
    labels.push(d.label(90, 0, "an ai can do much of the work, and you check it", { size: 32, color: c.light, centerY: 700 }));
    boxes.push(d.box(2, 745, 60, 40, "", { border: c.white, width: 3 }));
    labels.push(d.label(90, 0, "you decide, and an ai gives feedback", { size: 32, color: c.light, centerY: 765 }));
  }
  return d.svg(1680, 804, ...d.layers(wires, boxes, labels));
}
function showMap(slide, step) { put("fig-map", figMap(step)); }

/* ------------------------------------------------------------------ */
/* One step of the study: what you ask on the left, what you check on  */
/* the right. The empty squares are the checks still to be ticked.     */
/* Line widths: prompt 32 px, at most 40 characters per line (760 px); */
/* checks 32 px, at most 30 characters per line (590 px).              */
/* ------------------------------------------------------------------ */
function figAsk(prompt, checks) {
  const c = C();
  const boxes = [], labels = [];
  labels.push(d.label(0, 0, "you ask", { size: 32, color: c.gray, centerY: 40 }));
  // the box fits the request: 46 px per line and 50 px above and below
  const h = prompt.split("\n").length * 46 + 100;
  boxes.push(d.box(2, 90, 856, h, "", { border: c.light }));
  labels.push(d.label(50, 0, prompt, { size: 32, color: c.white, centerY: 90 + h / 2, lineHeight: 1.45 }));
  labels.push(d.label(980, 0, "you check", { size: 32, color: c.gray, centerY: 40 }));
  checks.forEach((t, i) => {
    const cy = 150 + i * 170;
    boxes.push(d.box(982, cy - 20, 40, 40, "", { border: c.yellow, rx: 4, width: 3 }));
    labels.push(d.label(1060, 0, t, { size: 32, color: c.white, centerY: cy }));
  });
  return d.svg(1680, 660, ...d.layers(boxes, labels));
}

const ASK = {
  "fig-ask-question": figAsk(
    "here is our research question and the\ncodebook of the survey. which columns\nwould answer it, and can the data\nanswer it at all? don't change the\nquestion, just tell us what you see.",
    ["do these columns exist\nin the codebook?", "does the question fit data\nthat are already collected?", "is it still your question?"]),
  "fig-ask-literature": figAsk(
    "suggest search terms in english and\ngerman for studies on the willingness\nto pay for organic milk, and name\nthree journals where they appear.",
    ["search the library yourself\nwith these terms", "open every study\nand read it", "cite only what you\nhave read"]),
  "fig-ask-analysis": figAsk(
    "write r code that compares the price\nfrom which milk is too expensive\nbetween vegetarians and omnivores,\nwith the median and the number of\nrespondents in each group.",
    ["run the code yourself", "check filters and\nmissing values", "count one group by hand"]),
  "fig-ask-figures": figAsk(
    "make this bar chart readable: bars\nsorted by size, labels for people,\nthe number of respondents in the\ncaption. keep the data as they are.",
    ["does the chart answer\nyour question?", "do the bars start at zero?", "are the labels in\nyour words?"]),
  "fig-ask-writing": figAsk(
    "read our methods section and list\nwhat someone would need to repeat\nthe analysis. don't rewrite it, only\nname what is missing.",
    ["accept or reject each point", "the sentences stay yours", "no new claim without\na source"]),
};

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
/* Invented references: share of fabricated references per model,     */
/* bars from 0 to 100 %; the real ones with errors as grey text.        */
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

// drawn at once, before stagekit.js builds the frames
put("fig-map", figMap(0));
Object.entries(ASK).forEach(([id, svg]) => put(id, svg));
put("fig-frontier", figFrontier());
put("fig-references", figReferences());
Object.assign(window, { showMap });
