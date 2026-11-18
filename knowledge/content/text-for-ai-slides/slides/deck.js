// Drawings of "why text is better for ai".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without.
//
// Colors: gray for context, white for what you read first, blue for the
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

// Bootstrap Icons 1.11.3 (MIT): robot
const ICON_ROBOT = '<path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.710a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.980.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.700a.25.25 0 0 0-.182-.135"/><path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>';

// Bootstrap Icons 1.11.3 (MIT): person-fill, file-earmark-pdf, -word, -code
const ICON_PERSON = '<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>';
const ICON_PDF = '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/><path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.040 1.040 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.020 1.510c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>';
const ICON_WORD = '<path d="M5.485 6.879a.5.5 0 1 0-.97.242l1.5 6a.5.5 0 0 0 .967.01L8 9.402l1.018 3.73a.5.5 0 0 0 .967-.01l1.5-6a.5.5 0 0 0-.97-.242l-1.036 4.144-.997-3.655a.5.5 0 0 0-.964 0l-.997 3.655L5.485 6.88z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>';
const ICON_CODE = '<path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/><path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708m-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708"/>';

// The Positron icon, as published in posit-dev/positron
// (src/vs/workbench/browser/media/positron-icon.svg, viewBox 0 0 440 440).
// Positron and the Positron icon are trademarks of Posit Software, PBC; the
// icon keeps its own colors, because a logo is shown as it is.
function positronIcon(x, y, size) {
  const k = size / 440;
  return `<g transform="translate(${x} ${y}) scale(${k})">` +
    '<rect x="12" y="12" width="416" height="416" rx="103" ry="103" fill="#3a78b1"/>' +
    '<path d="M83.6,373.6v-178.6c0-63,52.4-143.7,142.7-143.7s144.1,69.7,144.1,141.1c0,122.6-116.6,143.1-116.6,143.1,0,0,7.2-11.5,7.2-29.5s-8-28-8-28c0,0,60-16,60-87s-53-83-86-83c-57,0-88.3,48.5-88.3,84.3v181.9c0,25.9-17.5,23.9-17.5,23.9h-19.2s-18.4,0-18.4-24.4Z" fill="#fff"/>' +
    '<circle cx="204.9" cy="306.6" r="48" fill="#fff"/></g>';
}

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
/* Text files: you and an agent write the content in the same file in   */
/* Positron (white lines are yours, blue lines the agent's); then a     */
/* template adds the layout, and quarto renders pdf, docx and html.     */
/* Animated in two sections: writing, then rendering.                   */
/* ------------------------------------------------------------------ */
const DOC_LINES = [
  ["# Results", "you"],
  ["Women name a **higher**", "you"],
  ["price than men.", "you"],
  ["```{r}", "agent"],
  ["med_w <- median(w$price)", "agent"],
  ["```", "agent"],
  ["See @doering2023.", "you"],
];
function figTextFiles() {
  const c = C();
  const g = d.g;
  const wires = [], boxes = [], labels = [];
  labels.push(d.label(130, 0, "the content: you and an agent write text", { size: 32, color: c.gray, centerY: 24 }));
  // who writes: you in white, the agent in blue
  labels.push(d.icon(10, 180, 80, ICON_PERSON, { color: c.white }));
  labels.push(d.label(50, 0, "you", { size: 20, color: c.white, anchor: "middle", centerY: 285 }));
  labels.push(d.icon(10, 360, 80, ICON_ROBOT, { color: c.blue }));
  labels.push(d.label(50, 0, "agent", { size: 20, color: c.blue, anchor: "middle", centerY: 465 }));
  // the editor window
  boxes.push(d.box(130, 60, 720, 520, "", { border: c.light, fill: "none" }));
  boxes.push(d.line(130, 120, 850, 120, { color: c.dark, width: 2 }));
  labels.push(positronIcon(146, 70, 40));
  labels.push(d.label(200, 0, "paper.qmd", { size: 20, color: c.gray, mono: true, keepCase: true, centerY: 90 }));
  DOC_LINES.forEach(([t, who], i) => labels.push(g("line" + i,
    d.label(170, 0, t, { size: 32, color: who === "you" ? c.white : c.blue, mono: true, keepCase: true, centerY: 170 + i * 56 }))));
  // layout and output, second section
  const R = [];
  R.push(d.label(1000, 0, "the layout", { size: 32, color: c.gray, centerY: 24 }));
  R.push(d.box(940, 60, 300, 110, "template", { border: c.light, dashed: true }));
  R.push(d.box(940, 260, 300, 110, "quarto", { border: c.light }));
  R.push(d.arrow(1090, 170, 1090, 256, { color: c.gray, width: 3 }));
  R.push(d.arrow(850, 315, 936, 315, { color: c.gray, width: 3 }));
  const outs = [["pdf", ICON_PDF, 150], ["docx", ICON_WORD, 315], ["html", ICON_CODE, 480]];
  outs.forEach(([t, ic, cy]) => {
    R.push(d.arrow(1240, 315, 1396, cy, { color: c.gray, width: 3 }));
    R.push(d.icon(1410, cy - 40, 80, ic, { color: c.white }));
    R.push(d.label(1510, 0, t, { size: 32, color: c.white, mono: true, centerY: cy }));
  });
  return d.svg(1680, 600, ...d.layers(wires, boxes, labels), g("render", ...R));
}
function playTextFiles(a) {
  a.step(...DOC_LINES.map((_, i) => a.show("line" + i, { dur: 260 })));
  a.step(a.show("render", { dur: 700 }));
}

/* ------------------------------------------------------------------ */
/* What the model gets: a text file it reads at once (first section),   */
/* a .docx it can only read after writing and running a script          */
/* (second section).                                                    */
/* ------------------------------------------------------------------ */
const PY = ["from docx import Document", "doc = Document(\"paper.docx\")", "for p in doc.paragraphs:", "    print(p.text)"];
function figModel() {
  const c = C();
  const g = d.g;
  const parts = [];
  const input = (y, icon, col, name) => [
    d.box(0, y, 360, 160, "", { border: c.light }),
    d.icon(20, y + 40, 80, icon, { color: col }),
    d.label(120, 0, name, { size: 32, color: c.white, mono: true, keepCase: true, centerY: y + 62 }),
    d.label(120, 0, "+ your prompt", { size: 20, color: c.gray, centerY: y + 106 }),
  ].join("");
  const llm = (y) => d.box(470, y, 240, 160, "LLM", { border: c.blue, size: 48, keepCase: true, width: 3 });
  const answer = (y) => d.box(1320, y, 360, 160, "answer", { border: c.light });
  const arrow = (x1, y, x2) => d.arrow(x1, y, x2 - 4, y, { color: c.gray, width: 3 });
  // row 1: a text file
  parts.push(input(40, ICON_FILE_TEXT, c.blue, "paper.qmd"));
  parts.push(g("t-in", arrow(360, 120, 470)), g("t-llm", llm(40)));
  parts.push(g("t-out", arrow(710, 120, 1320), d.label(1015, 0, "reads the text at once", { size: 32, color: c.gray, anchor: "middle", centerY: 80 })));
  parts.push(g("t-ans", answer(40)));
  // row 2: a word file
  const Y = 420;
  parts.push(input(Y, ICON_FILE_ZIP, c.light, "paper.docx"));
  parts.push(g("w-in", arrow(360, Y + 80, 470)), g("w-llm", llm(Y)));
  parts.push(g("w-run", arrow(710, Y + 80, 800),
    d.label(800, 0, "first writes and runs a script", { size: 32, color: c.gray, centerY: Y - 70 })));
  parts.push(g("w-py", d.box(800, Y - 30, 420, 220, "", { border: c.yellow }),
    ...PY.map((l, i) => d.label(820, 0, l, { size: 20, color: c.light, mono: true, keepCase: true, centerY: Y + 10 + i * 34 })),
    d.label(820, 0, "read_docx.py", { size: 20, color: c.yellow, mono: true, keepCase: true, centerY: Y + 160 })));
  parts.push(g("w-out", arrow(1220, Y + 80, 1320)));
  parts.push(g("w-ans", answer(Y)));
  return d.svg(1680, 680, ...parts);
}
function playModel(a) {
  const S = (t) => a.show(t, { dur: 300 });
  a.step(S("t-in"), S("t-llm"), S("t-out"), S("t-ans"));
  a.step(S("w-in"), S("w-llm"), S("w-run"), a.show("w-py", { dur: 500 }), S("w-out"), S("w-ans"));
}

/* ------------------------------------------------------------------ */
/* The same sentence as .qmd and as .docx; step 1 opens the .docx,      */
/* steps 2 to 4 mark the three pieces of the sentence on both sides, so   */
/* that it shows: the words are all there, but scattered in the markup.  */
/* Mono text is 0.6 em wide per character, which places the marks.       */
/* ------------------------------------------------------------------ */
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
// one line of mono text in which some pieces are colored; white-space pre
// keeps leading spaces, so columns stay where the marks expect them
function monoLine(x, cy, size, segs) {
  const c = C();
  return `<text x="${x}" y="${cy + size * 0.35}" font-family="${c.mono.replace(/"/g, "'")}" font-size="${size}" class="keep-case" style="white-space:pre">` +
    segs.map(([t, col]) => `<tspan fill="${col}">${esc(t)}</tspan>`).join("") + "</text>";
}
// split a line into pieces, coloring the words of `marks` in `hi`
function marked(line, marks, base, hi) {
  const segs = []; let rest = line;
  marks.forEach((m) => {
    const i = rest.indexOf(m);
    if (i < 0) return;
    if (i) segs.push([rest.slice(0, i), base]);
    segs.push([m, hi]);
    rest = rest.slice(i + m.length);
  });
  if (rest) segs.push([rest, base]);
  return segs;
}
const PIECES = ["Women name a", "higher", "price than men."];
function figDocx(step) {
  const c = C();
  const parts = [];
  const on = PIECES.slice(0, Math.max(0, step - 1));   // pieces marked so far
  // left: the text file
  parts.push(d.icon(0, 20, 96, ICON_FILE_TEXT, { color: c.blue }));
  parts.push(d.label(120, 0, "paper.qmd", { size: 48, color: c.white, mono: true, keepCase: true, centerY: 50 }));
  parts.push(d.label(120, 0, "1 file, 62 bytes", { size: 32, color: c.gray, centerY: 105 }));
  const qmd = ["Women name a **higher**", "price than men."];
  qmd.forEach((l, i) => {
    const cy = 236 + i * 48, act = on.filter((m) => l.includes(m));
    act.forEach((m) => parts.push(d.highlight(l.indexOf(m) * 19.2, m.length * 19.2, cy, 32)));
    parts.push(monoLine(0, cy, 32, marked(l, act, c.white, c.yellow)));
  });
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
    xml.forEach((l, i) => {
      const cy = 500 + i * 36;
      // a piece counts only where it stands as text, right after a ">"
      const act = on.filter((m) => l.includes(">" + m));
      act.forEach((m) => parts.push(d.highlight(X + (l.indexOf(">" + m) + 1) * 12, m.length * 12, cy, 20)));
      parts.push(monoLine(X, cy, 20, marked(l, act, c.light, c.yellow)));
    });
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
  parts.push(d.label(0, 0, "accept · reject", { size: 32, color: c.light, centerY: 520 }));
  // the same diffs are what version control keeps
  parts.push(d.label(0, 0, "and git keeps every such change as a version of your paper", { size: 32, color: c.gray, centerY: 600 }));
  return d.svg(1680, 640, ...parts);
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
  // three rows: each source sits level with its engine, html with quarto,
  // pdf with latex, and docx in the middle
  const rows = [120, 330, 540];
  const src = [".qmd", ".typ", ".tex"], eng = ["quarto", "typst", "latex"], out = ["html", "docx", "pdf"];
  rows.forEach((y, i) => {
    boxes.push(d.box(0, y, 320, 110, src[i], { border: c.blue, mono: true, keepCase: true }));
    boxes.push(d.box(680, y, 320, 110, eng[i], { border: c.light }));
    boxes.push(d.box(1360, y, 320, 110, out[i], { border: c.light, mono: true }));
  });
  const a = (x1, y1, x2, y2) => wires.push(d.arrow(x1, y1, x2 - 4, y2, { color: c.gray, width: 3 }));
  rows.forEach((y) => a(320, y + 55, 680, y + 55));   // each source to its engine
  wires.push(d.arrow(840, 230, 840, 326, { color: c.gray, width: 3 }));   // quarto -> typst (pdf through typst)
  a(1000, 175, 1360, 175);          // quarto -> html
  a(1000, 205, 1360, 350);          // quarto -> docx
  a(1000, 415, 1360, 560);          // typst -> pdf
  a(1000, 595, 1360, 595);          // latex -> pdf
  return d.svg(1680, 720, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* A number in the text from code: the source line and what Quarto     */
/* makes of it, one below the other.                                    */
/* ------------------------------------------------------------------ */
// The cut-out is a real rendering: img/original/quarto-output.qmd, rendered
// with Quarto 1.10 and Typst to PDF and cropped at 400 dpi (1917 x 367 px).
// The mark sits on "2.00" where PyMuPDF located it in the PDF.
const SNIP = { x: 0, y: 400, w: 1100, h: 1100 * 367 / 1917, mark: [432, 489, 92, 132] };
function tornEdge(x, y, w, h) {
  // straight sides, torn top and bottom edges, as if cut from the page
  const top = [], bottom = [], n = 40;
  for (let i = 0; i <= n; i++) {
    top.push(`${(x + w * i / n).toFixed(1)},${(y + 2 + ((i * 7919) % 5) * 1.6).toFixed(1)}`);
    bottom.push(`${(x + w - w * i / n).toFixed(1)},${(y + h - 2 - ((i * 104729) % 5) * 1.6).toFixed(1)}`);
  }
  return top.concat(bottom).join(" ");
}
function figInline(step) {
  const c = C();
  const parts = [];
  parts.push(d.label(0, 0, "you write", { size: 32, color: c.gray, centerY: 40 }));
  parts.push(d.label(0, 0, "```{r}\nmed_w <- sprintf(\"%.2f\", median(women$price))\n```\nWomen name a median of `{r} med_w` €.", { size: 32, color: c.white, mono: true, keepCase: true, centerY: 200, lineHeight: 1.5 }));
  if (step >= 1) {
    const S = SNIP;
    parts.push(d.label(0, 0, "quarto writes into the pdf", { size: 32, color: c.gray, centerY: 360 }));
    parts.push(`<defs><clipPath id="snip-clip"><polygon points="${tornEdge(S.x, S.y, S.w, S.h)}"/></clipPath></defs>`);
    parts.push(`<image href="img/quarto-output.png" x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" clip-path="url(#snip-clip)" preserveAspectRatio="none"/>`);
    const [x1, x2, y1, y2] = S.mark;
    parts.push(`<rect x="${S.x + x1 - 4}" y="${S.y + y1}" width="${x2 - x1 + 8}" height="${y2 - y1}" rx="4" fill="${c.yellow}" fill-opacity="0.45"/>`);
  }
  return d.svg(1680, 660, ...parts);
}
function showInline(slide, step) { put("fig-inline", figInline(step || 0)); }

/* ------------------------------------------------------------------ */
/* A report as a folder of text files, set into one PDF.                */
/* ------------------------------------------------------------------ */
// step 1 to 3 mark one element and say what it is, step 4 renders the pdf
const REPORT_TREE = [
  ["paper/", 0], ["paper.qmd", 1], ["references.bib", 1], ["sections/", 1],
  ["_introduction.qmd", 2], ["_methods.qmd", 2], ["_results.qmd", 2], ["_discussion.qmd", 2],
];
const REPORT_NOTES = [[1, [1], "the main document"], [2, [2], "your literature"], [3, [3, 4, 5, 6, 7], "one file per section"]];
function figReport(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const rowY = (i) => 60 + i * 80;
  REPORT_NOTES.forEach(([s, rows, note]) => {
    if (step < s) return;
    const now = step === s;
    if (now) rows.forEach((r) => labels.push(d.highlight(REPORT_TREE[r][1] * 60, REPORT_TREE[r][0].length * 19.2, rowY(r), 32)));
    labels.push(d.label(620, 0, "← " + note, { size: 32, color: now ? c.yellow : c.light, centerY: rowY(rows[0]) }));
  });
  REPORT_TREE.forEach(([t, lvl], i) => {
    const marked = REPORT_NOTES.some(([s, rows]) => s === step && rows.includes(i));
    labels.push(d.label(lvl * 60, 0, t, { size: 32, color: marked ? c.yellow : (lvl < 2 && t !== "references.bib" ? c.white : c.light), mono: true, keepCase: true, centerY: rowY(i) }));
  });
  if (step >= 4) {
    // centered between the tree (ends near 450) and the box (1160), below the notes
    wires.push(d.arrow(620, 520, 990, 520, { color: c.gray, width: 3 }));
    labels.push(d.label(805, 0, "quarto and typst", { size: 32, color: c.gray, anchor: "middle", centerY: 480 }));
    boxes.push(d.box(1160, 380, 440, 280, "", { border: c.light }));
    labels.push(d.icon(1310, 420, 140, ICON_FILE_TEXT, { color: c.light }));
    labels.push(d.label(1380, 0, "paper.pdf", { size: 32, color: c.white, mono: true, keepCase: true, anchor: "middle", centerY: 610 }));
  }
  return d.svg(1680, 680, ...d.layers(wires, boxes, labels));
}
function showReport(slide, step) { put("fig-report", figReport(step || 0)); }

/* ------------------------------------------------------------------ */
/* Meet the ai where it lives: an agent works in the terminal, and the  */
/* three text formats each bring a command; word has none.              */
/* ------------------------------------------------------------------ */
function figCli() {
  const c = C();
  const parts = [];
  parts.push(d.icon(0, 0, 80, ICON_ROBOT, { color: c.blue }));
  parts.push(d.label(110, 0, "an agent types the command and reads what comes back", { size: 32, color: c.gray, centerY: 40 }));
  parts.push(d.box(1, 110, 1678, 300, "", { border: c.light, fill: "none" }));
  const cmds = [
    ["quarto render paper.qmd --to pdf", "paper.pdf"],
    ["typst compile paper.typ", "paper.pdf"],
    ["latexmk -pdf paper.tex", "paper.pdf"],
  ];
  cmds.forEach(([cmd, out], i) => {
    const cy = 180 + i * 80;
    parts.push(d.label(40, 0, "$", { size: 32, color: c.gray, mono: true, centerY: cy }));
    parts.push(d.label(90, 0, cmd, { size: 32, color: c.white, mono: true, keepCase: true, centerY: cy }));
    parts.push(d.label(1100, 0, "→ " + out, { size: 32, color: c.gray, mono: true, keepCase: true, centerY: cy }));
  });
  parts.push(d.mark(22, 520, false));
  parts.push(d.label(80, 0, "word: menus and buttons, but no command to render or change a document", { size: 32, color: c.light, centerY: 520 }));
  return d.svg(1680, 600, ...parts);
}

/* ------------------------------------------------------------------ */
/* The same idea elsewhere: tools that keep their files as text and     */
/* bring a command line. Names with an address are links (blue).        */
/* ------------------------------------------------------------------ */
const ELSEWHERE = [
  ["excalidraw", "https://github.com/excalidraw/cli", "drawings are json text, and its official cli\nrenders them for humans and agents"],
  ["mermaid", "https://mermaid.js.org", "a diagram written as text, drawn by\ngithub, quarto and excalidraw"],
  ["ffmpeg", "https://ffmpeg.org", "videos and audio cut, converted and\njoined with one command"],
  [".csv", null, "a table as plain text\ninstead of a packed .xlsx file"],
  ["this deck", null, "slides as an html file and a script,\nso an ai can build and change them"],
];
function figElsewhere() {
  const c = C();
  const parts = [];
  ELSEWHERE.forEach(([name, url, what], i) => {
    const x = (i % 2) * 860, y = 50 + Math.floor(i / 2) * 260;
    const mono = name.startsWith(".");
    const title = d.label(x, 0, name, { size: 48, color: url ? c.blue : c.white, mono, keepCase: mono, centerY: y });
    parts.push(url ? `<a href="${url}" target="_blank" rel="noopener">${title}</a>` : title);
    parts.push(d.label(x, 0, what, { size: 32, color: c.light, centerY: y + 100 }));
  });
  return d.svg(1680, 720, ...parts);
}

// drawn at once, before stagekit.js builds the frames
put("fig-word", figWord());
const fm = document.getElementById("fig-model");
if (fm) { fm.innerHTML = figModel(); playModel(d.anim("fig-model")); }
const ft = document.getElementById("fig-text-files");
if (ft) { ft.innerHTML = figTextFiles(); playTextFiles(d.anim("fig-text-files")); }
put("fig-docx", figDocx(0));
put("fig-diff", figDiff());
put("fig-formats", figFormats());
put("fig-pipeline", figPipeline());
put("fig-inline", figInline(0));
put("fig-report", figReport(0));
put("fig-cli", figCli());
put("fig-elsewhere", figElsewhere());
Object.assign(window, { showDocx, showInline, showReport });
