// Drawings of "why text is better for ai".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without.
//
// Colours: grey for context, white for what you read first, blue for the
// language model and for text files, yellow for the line that matters now.
// Green and red judge (pros and cons, checks and crosses) and, in the diff,
// mark the added and the removed line as every diff tool does.
//
// The .docx numbers are measured: the sentence "Women name a **higher**
// price than men." in a .qmd file of 62 bytes, rendered with Quarto 1.10 to
// .docx, gives a zip of 16 files and 10,593 bytes; word/document.xml holds
// the paragraph shown on the slide. A file saved by Word itself holds more.
const d = window.draw;
const C = () => d.colors();
const put = (id, svg) => { const e = document.getElementById(id); if (e) e.innerHTML = svg; };

// Bootstrap Icons 1.11.3 (MIT): file-earmark-text and file-earmark-zip
const ICON_FILE_TEXT = '<path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/><path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>';
const ICON_FILE_ZIP = '<path d="M5 7.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v.938l.4 1.599a1 1 0 0 1-.416 1.074l-.93.62a1 1 0 0 1-1.11 0l-.929-.62a1 1 0 0 1-.415-1.074L5 8.438zm2 0H6v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.929-.62-.4-1.598A1 1 0 0 1 7 8.438z"/><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1h-2v1h-1v1h1v1h-1v1h1v1H6V5H5V4h1V3H5V2h1V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>';

/* ------------------------------------------------------------------ */
/* Word: what speaks for it and what against it.                        */
/* ------------------------------------------------------------------ */
function figWord() {
  const c = C();
  const parts = [];
  const pros = ["familiar to everyone", "comments and track changes", "often good enough"];
  const cons = ["text and layout in one", "numbers typed by hand", "a binary package, not text", "formulas are hard work"];
  parts.push(d.label(0, 0, "for word", { size: 48, color: c.white, centerY: 50 }));
  pros.forEach((t, i) => {
    parts.push(d.mark(22, 160 + i * 100, true));
    parts.push(d.label(80, 0, t, { size: 32, color: c.light, centerY: 160 + i * 100 }));
  });
  parts.push(d.label(900, 0, "against it", { size: 48, color: c.white, centerY: 50 }));
  cons.forEach((t, i) => {
    parts.push(d.mark(922, 160 + i * 100, false));
    parts.push(d.label(980, 0, t, { size: 32, color: i === 2 ? c.yellow : c.light, centerY: 160 + i * 100 }));
  });
  return d.svg(1680, 560, ...parts);
}

/* ------------------------------------------------------------------ */
/* A language model takes text and gives text.                          */
/* ------------------------------------------------------------------ */
function figModel() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  boxes.push(d.box(0, 200, 420, 200, "prompt\n(text)", { border: c.light }));
  boxes.push(d.box(630, 170, 420, 260, "LLM", { border: c.blue, size: 80, keepCase: true, width: 3 }));
  boxes.push(d.box(1260, 200, 420, 200, "answer\n(text)", { border: c.light }));
  wires.push(d.arrow(420, 300, 626, 300, { color: c.gray, width: 3 }));
  wires.push(d.arrow(1050, 300, 1256, 300, { color: c.gray, width: 3 }));
  labels.push(d.label(840, 0, "a .docx, a .pptx or a .xlsx has to be unpacked into text first", { size: 32, color: c.gray, anchor: "middle", centerY: 560 }));
  return d.svg(1680, 660, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* The same sentence as .qmd and as .docx; step 1 opens the .docx.     */
/* ------------------------------------------------------------------ */
function figDocx(step) {
  const c = C();
  const parts = [];
  // left: the text file
  parts.push(d.icon(0, 20, 96, ICON_FILE_TEXT, { color: c.blue }));
  parts.push(d.label(120, 0, "paper.qmd", { size: 48, color: c.white, mono: true, keepCase: true, centerY: 50 }));
  parts.push(d.label(120, 0, "1 file, 62 bytes", { size: 32, color: c.gray, centerY: 105 }));
  parts.push(d.label(0, 0, "Women name a **higher**\nprice than men.", { size: 32, color: c.white, mono: true, keepCase: true, centerY: 260, lineHeight: 1.5 }));
  if (step >= 1) {
    const X = 860;
    parts.push(d.line(800, 0, 800, 760, { color: c.dark, width: 2 }));
    parts.push(d.icon(X, 20, 96, ICON_FILE_ZIP, { color: c.light }));
    parts.push(d.label(X + 120, 0, "paper.docx", { size: 48, color: c.white, mono: true, keepCase: true, centerY: 50 }));
    parts.push(d.label(X + 120, 0, "a zip of 16 files, 10,593 bytes", { size: 32, color: c.gray, centerY: 105 }));
    const files = ["[Content_Types].xml", "_rels/.rels", "word/document.xml", "word/styles.xml", "word/numbering.xml", "word/settings.xml", "… and 10 more"];
    files.forEach((f, i) => parts.push(d.label(X, 0, f, { size: 20, color: i === 2 ? c.yellow : c.gray, mono: true, keepCase: true, centerY: 180 + i * 34 })));
    const xml = [
      '<w:p><w:pPr><w:pStyle w:val="FirstParagraph"/>',
      '</w:pPr><w:r><w:t xml:space="preserve">Women name a',
      '</w:t></w:r><w:r><w:t xml:space="preserve"> </w:t>',
      '</w:r><w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t',
      ' xml:space="preserve">higher</w:t></w:r><w:r><w:t',
      ' xml:space="preserve"> </w:t></w:r><w:r><w:t',
      ' xml:space="preserve">price than men.</w:t></w:r></w:p>',
    ];
    parts.push(d.label(X, 0, "in word/document.xml:", { size: 20, color: c.gray, centerY: 450 }));
    xml.forEach((l, i) => parts.push(d.label(X, 0, l, { size: 20, color: c.light, mono: true, keepCase: true, centerY: 500 + i * 36 })));
  }
  return d.svg(1680, 804, ...parts);
}
function showDocx(slide, step) { put("fig-docx", figDocx(step || 0)); }

/* ------------------------------------------------------------------ */
/* A change to a text file, as a diff: the removed line in red with a  */
/* minus, the added one in green with a plus.                           */
/* ------------------------------------------------------------------ */
function figDiff() {
  const c = C();
  const parts = [];
  parts.push(d.label(0, 0, "sections/_results.qmd", { size: 32, color: c.gray, mono: true, keepCase: true, centerY: 40 }));
  const rows = [
    [" ", "## Results", c.gray, null],
    ["-", "Women name a higher price than men.", c.white, c.red],
    ["+", "Women name a higher price than men", c.white, c.green],
    ["+", "(median 2.00 € vs. 1.89 €).", c.white, c.green],
  ];
  rows.forEach(([sign, t, col, bg], i) => {
    const y = 110 + i * 90;
    if (bg) parts.push(`<rect x="0" y="${y}" width="1680" height="72" rx="6" fill="${bg}" fill-opacity="0.16"/>`);
    parts.push(d.label(24, 0, sign, { size: 32, color: bg || c.gray, mono: true, centerY: y + 36 }));
    parts.push(d.label(90, 0, t, { size: 32, color: col, mono: true, keepCase: true, centerY: y + 36 }));
  });
  parts.push(d.label(0, 0, "accept · reject", { size: 32, color: c.light, centerY: 540 }));
  return d.svg(1680, 600, ...parts);
}

/* ------------------------------------------------------------------ */
/* The same four things in Quarto, Typst and LaTeX.                     */
/* Columns 480 apart from x = 200: 32 px mono, at most 25 characters     */
/* (475 px), so the last column ends at 1635.                           */
/* ------------------------------------------------------------------ */
function figFormats() {
  const c = C();
  const parts = [];
  const cols = [
    [".qmd", "quarto (markdown)", ["# Results", "the **median** price", "$\\tilde{x} = 2.00$", "[@doering2023]"]],
    [".typ", "typst", ["= Results", "the *median* price", "$tilde(x) = 2.00$", "@doering2023"]],
    [".tex", "latex", ["\\section{Results}", "the \\textbf{median} price", "$\\tilde{x} = 2.00$", "\\cite{doering2023}"]],
  ];
  const rows = ["heading", "bold", "formula", "citation"];
  rows.forEach((r, j) => parts.push(d.label(0, 0, r, { size: 32, color: c.gray, centerY: 200 + j * 120 })));
  cols.forEach(([ext, name, lines], i) => {
    const x = 200 + i * 480;
    parts.push(d.label(x, 0, ext, { size: 48, color: c.blue, mono: true, keepCase: true, centerY: 50 }));
    parts.push(d.label(x, 0, name, { size: 32, color: c.gray, centerY: 105 }));
    lines.forEach((l, j) => parts.push(d.label(x, 0, l, { size: 32, color: c.white, mono: true, keepCase: true, centerY: 200 + j * 120 })));
  });
  return d.svg(1680, 660, ...parts);
}

/* ------------------------------------------------------------------ */
/* From the source to the file you hand in: text, engine, format.       */
/* ------------------------------------------------------------------ */
function figPipeline() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const col = (x, title) => labels.push(d.label(x + 160, 0, title, { size: 32, color: c.gray, anchor: "middle", centerY: 40 }));
  col(0, "you write text"); col(680, "an engine sets it"); col(1360, "you hand in");
  const src = [[".qmd", 120], [".typ", 330], [".tex", 540]];
  const eng = [["quarto", 170], ["typst", 400], ["latex", 590]];
  // outputs ordered so that no arrow crosses another
  const out = [["html", 120], ["docx", 330], ["pdf", 540]];
  src.forEach(([t, y]) => boxes.push(d.box(0, y, 320, 110, t, { border: c.blue, mono: true, keepCase: true })));
  eng.forEach(([t, y]) => boxes.push(d.box(680, y, 320, 110, t, { border: c.light })));
  out.forEach(([t, y]) => boxes.push(d.box(1360, y, 320, 110, t, { border: c.light, mono: true })));
  const a = (x1, y1, x2, y2) => wires.push(d.arrow(x1, y1, x2 - 4, y2, { color: c.gray, width: 3 }));
  a(320, 175, 680, 225);            // .qmd -> quarto
  a(320, 385, 680, 455);            // .typ -> typst
  a(320, 595, 680, 645);            // .tex -> latex
  a(840, 280, 840, 400);            // quarto -> typst (pdf through typst)
  a(1000, 205, 1360, 175);          // quarto -> html
  a(1000, 245, 1360, 385);          // quarto -> docx
  a(1000, 455, 1360, 580);          // typst -> pdf
  a(1000, 645, 1360, 615);          // latex -> pdf
  return d.svg(1680, 720, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* A number in the text from code: the source line and what Quarto     */
/* makes of it, one below the other.                                    */
/* ------------------------------------------------------------------ */
function figInline(step) {
  const c = C();
  const parts = [];
  parts.push(d.label(0, 0, "you write", { size: 32, color: c.gray, centerY: 40 }));
  parts.push(d.label(0, 0, "```{r}\nmed_w <- median(women$price)\n```\nWomen name a median of `{r} med_w` €.", { size: 32, color: c.white, mono: true, keepCase: true, centerY: 200, lineHeight: 1.5 }));
  if (step >= 1) {
    parts.push(d.label(0, 0, "quarto writes", { size: 32, color: c.gray, centerY: 430 }));
    parts.push(d.label(0, 0, "Women name a median of 2.00 €.", { size: 48, color: c.yellow, keepCase: true, centerY: 510 }));
  }
  return d.svg(1680, 660, ...parts);
}
function showInline(slide, step) { put("fig-inline", figInline(step || 0)); }

/* ------------------------------------------------------------------ */
/* A report as a folder of text files, set into one PDF.                */
/* ------------------------------------------------------------------ */
function figReport() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const tree = [
    ["paper/", 0, c.white], ["paper.qmd", 1, c.white], ["references.bib", 1, c.light], ["sections/", 1, c.white],
    ["_introduction.qmd", 2, c.light], ["_methods.qmd", 2, c.light], ["_results.qmd", 2, c.light], ["_discussion.qmd", 2, c.light],
  ];
  tree.forEach(([t, lvl, col], i) => labels.push(d.label(lvl * 60, 0, t, { size: 32, color: col, mono: true, keepCase: true, centerY: 60 + i * 80 })));
  wires.push(d.arrow(760, 360, 1150, 360, { color: c.gray, width: 3 }));
  labels.push(d.label(955, 0, "quarto and typst", { size: 32, color: c.gray, anchor: "middle", centerY: 320 }));
  boxes.push(d.box(1160, 220, 440, 280, "", { border: c.light }));
  labels.push(d.icon(1310, 260, 140, ICON_FILE_TEXT, { color: c.light }));
  labels.push(d.label(1380, 0, "paper.pdf", { size: 32, color: c.white, mono: true, keepCase: true, anchor: "middle", centerY: 450 }));
  return d.svg(1680, 680, ...d.layers(wires, boxes, labels));
}

// drawn at once, before stagekit.js builds the frames
put("fig-word", figWord());
put("fig-model", figModel());
put("fig-docx", figDocx(0));
put("fig-diff", figDiff());
put("fig-formats", figFormats());
put("fig-pipeline", figPipeline());
put("fig-inline", figInline(0));
put("fig-report", figReport());
Object.assign(window, { showDocx, showInline });
