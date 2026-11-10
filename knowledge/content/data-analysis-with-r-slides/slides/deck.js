/* Zeichnungen des Decks "data analysis with R" (Praxis MGF, Sitzung 1).
 *
 * Erlaubte Schriftgroessen: 20, 32, 48, 80. Keine anderen Werte.
 * Folien mit Aufbau zeichnen immer die volle Geometrie, nur die Farbe wechselt;
 * dadurch kann zwischen zwei Schritten nichts wandern.
 * Breitenabschaetzung: Codeschrift 0,6 em je Zeichen, Arial rund 0,55 em.
 * Die Diagramme mit Daten (Bundeslaender, Wohnort, Alter, Quote) zeichnet nicht dieses
 * Skript, sondern ggplot2: figures/make_figures.R schreibt img/fig-*.svg.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();
const put = (id, svg) => { if ($(id)) $(id).innerHTML = svg; return svg; };

// Bootstrap Icons "folder2-open" 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_FOLDER2_OPEN = '<path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z"/>';

/* ------------------------------------------------------------------ */
/* Two windows, one folder                                              */
/*                                                                      */
/* Der Kursordner in der Mitte, mit Ordnersymbol, drei Unterordner      */
/* untereinander; links Positron, rechts OpenCode, je mit Logo (aus der */
/* installierten App, img/logos/) und einem Pfeil auf den Ordner.       */
/* Logos sind Markenzeichen und behalten ihre Farben; sie stehen als    */
/* Bild in der Zeichnung, nicht als Palettenfarbe.                      */
/* ------------------------------------------------------------------ */
function figFolder() {
  const c = C();
  const fx = 520, fy = 90, fw = 640, fh = 590;
  const rows = [
    { name: "my-code", note: "your folder", col: c.white },
    { name: "data", note: "your datasets", col: c.white },
    { name: "course", note: "course material, don't edit", col: c.gray },
  ];
  const arrows = [
    d.arrow(400, 385, fx - 6, 385, { color: c.gray, width: 3, head: 18 }),
    d.arrow(1280, 385, fx + fw + 6, 385, { color: c.gray, width: 3, head: 18 }),
  ];
  // Seitenkaesten 360 x 230: Logo 96 oben, darunter der Name in 48 px;
  // Logo von 290 bis 386, Namensmitte bei 440, Unterkante 500
  const side = (x, name, logo) => [
    d.box(x, 270, 360, 230, "", { width: 3, rx: 12 }),
    `<image href="img/logos/${logo}" x="${x + 132}" y="292" width="96" height="96"/>`,
    d.label(x + 180, 0, name, { size: 48, anchor: "middle", centerY: 444, keepCase: true }),
  ];
  const boxes = [
    d.box(fx, fy, fw, fh, "", { border: c.light, width: 3, rx: 12 }),
    ...side(40, "Positron", "positron.svg"),
    ...side(1280, "OpenCode", "opencode.svg"),
  ];
  const labels = [
    d.icon(fx + 44, fy + 36, 48, ICON_FOLDER2_OPEN, { color: c.light }),
    d.label(fx + 112, 0, "data-analytics-courses", { size: 32, mono: true, keepCase: true, color: c.light, centerY: fy + 60 }),
    d.line(fx + 40, fy + 105, fx + fw - 40, fy + 105, { color: c.dark, width: 2 }),
    d.label(220, 560, "where you work", { size: 32, color: c.gray, anchor: "middle" }),
    d.label(1460, 560, "your assistant", { size: 32, color: c.gray, anchor: "middle" }),
  ];
  // Unterordner: Name in 48 px Code, darunter die Erklaerung in 32 px Grau
  rows.forEach((r, i) => {
    const cy = fy + 190 + i * 140;
    labels.push(d.label(fx + 60, 0, r.name, { size: 48, mono: true, keepCase: true, color: r.col, centerY: cy }));
    labels.push(d.label(fx + 60, 0, r.note, { size: 32, color: c.gray, centerY: cy + 50 }));
  });
  return put("fig-folder", d.svg(1680, 720, ...d.layers(arrows, boxes, labels)));
}
window.figFolder = figFolder;

/* ------------------------------------------------------------------ */
/* Der Prozess der explorativen Datenanalyse nach Wickham et al.        */
/* (R for Data Science, 2. Aufl.): import, tidy, der Kreis aus          */
/* transform, visualise und model ("understand"), communicate; die     */
/* Leiste "program" darunter ist weggelassen. Das Bild steht am Anfang  */
/* der Teile "load and inspect", "transform" und "visualise"; der       */
/* Kasten des Teils ist gelb (Gelb heisst "aktuell"), der Rest weiss.   */
/* tidy steckt bei uns in transform, model gehoert zum statistischen    */
/* Teil des Moduls: beide grau.                                        */
/* ------------------------------------------------------------------ */
function figProcess(id, focus) {
  const c = C();
  const y = 190, h = 110, cy = y + h / 2;            // Mittelachse der Hauptzeile
  // frame "understand": symmetric to the main axis (cy = 245), 205 above and below
  const fx = 540, fy = 40, fw = 800, fh = 410;
  const box = (key, x, yy, w, t, o = {}) => d.box(x, yy, w, h, t, {
    size: 32, width: 3, rx: 10, ...o,
    ...(key === focus ? { border: c.yellow, color: c.yellow } : {}) });
  const grey = { border: c.dark, color: c.gray };
  const wires = [
    d.arrow(220, cy, 274, cy, { color: c.gray, width: 3, head: 12 }),
    d.arrow(480, cy, 574, cy, { color: c.gray, width: 3, head: 12 }),
    d.arrow(820, 215, 1014, 160, { color: c.gray, width: 3, head: 12 }),
    d.arrow(1140, 215, 1140, 274, { color: c.gray, width: 3, head: 12 }),
    d.arrow(1014, 335, 826, 270, { color: c.gray, width: 3, head: 12 }),
    d.arrow(fx + fw, cy, 1394, cy, { color: c.gray, width: 3, head: 12 }),
  ];
  const boxes = [
    d.box(fx, fy, fw, fh, "", { border: c.dark, width: 2, rx: 16, dashed: true, fill: "none" }),
    box("import", 0, y, 220, "import"),
    box("tidy", 280, y, 200, "tidy", grey),
    box("transform", 580, y, 240, "transform"),
    box("visualise", 1020, 105, 240, "visualise"),
    box("model", 1020, 280, 240, "model", grey),
    box("communicate", 1400, y, 270, "communicate"),
  ];
  const labels = [
    d.label(fx + 24, fy + 44, "understand", { size: 32, color: c.gray }),
    d.label(1535, 350, "quarto", { size: 32, anchor: "middle", color: c.gray }),
  ];
  // 2 px to the right: the 3 px frame of "import" starts at x = 0 and half of it would be cut off
  return put(id, d.svg(1680, 490, `<g transform="translate(2 0)">${d.layers(wires, boxes, labels).join("")}</g>`));
}
window.figProcess = figProcess;
window.figProcessImport = () => figProcess("fig-process-import", "import");
window.figProcessTransform = () => figProcess("fig-process-transform", "transform");
window.figProcessVisualise = () => figProcess("fig-process-visualise", "visualise");

/* ------------------------------------------------------------------ */
/* 606 columns, one system: links die Praefixe, rechts die Kette am Alter */
/* ------------------------------------------------------------------ */
function figPrefix() {
  const c = C();
  const parts = [];
  const prefixes = [
    ["q", "quota, screening"], ["v", "behaviour"], ["p", "psychographic scales"],
    ["d", "demographics"], ["m", "milk"], ["s", "chocolate"],
  ];
  // links: Buchstabe in 48 px Code, Bedeutung in 48 px Arial; sechs Zeilen zu 96
  prefixes.forEach(([k, v], i) => {
    const cy = 70 + i * 96;
    parts.push(d.label(20, 0, k, { size: 48, mono: true, keepCase: true, color: c.white, centerY: cy }));
    parts.push(d.label(110, 0, v, { size: 48, color: c.light, centerY: cy }));
  });
  // rechts: vier Stufen der Altersvariable untereinander, Pfeile dazwischen,
  // Erklaerung rechtsbuendig daneben. "Q002altergru4f" in 48 px ist 403 breit.
  const chain = [
    ["q002geburt", "raw"], ["Q002alter", "computed"],
    ["Q002altergru4", "grouped"], ["Q002altergru4f", "as text"],
  ];
  const x = 760;
  chain.forEach(([name, note], i) => {
    const cy = 70 + i * 160;
    parts.push(d.label(x, 0, name, { size: 48, mono: true, keepCase: true, color: i === 0 ? c.light : c.white, centerY: cy }));
    parts.push(d.label(1660, 0, note, { size: 32, color: c.gray, anchor: "end", centerY: cy }));
    if (i < chain.length - 1) parts.push(d.arrow(x + 40, cy + 38, x + 40, cy + 122, { color: c.gray, width: 3, head: 16 }));
  });
  return put("fig-prefix", d.svg(1680, 620, ...parts));
}
window.figPrefix = figPrefix;

/* ------------------------------------------------------------------ */
/* Test first, then learn: self-test, Raute, done oder level, zurueck   */
/* Leitungen zuerst, dann die Formen, damit keine Linie auf einem Rahmen */
/* liegt.                                                               */
/* ------------------------------------------------------------------ */
function figSelfTest() {
  const c = C();
  const cx = 840, cy = 190, hw = 200, hh = 110;
  const wires = [
    d.arrow(400, cy, cx - hw - 6, cy, { color: c.gray, width: 3, head: 18 }),
    d.arrow(cx + hw, cy, 1234, cy, { color: c.gray, width: 3, head: 18 }),
    d.arrow(cx, cy + hh, cx, 414, { color: c.gray, width: 3, head: 18 }),
    d.line(580, 490, 220, 490, { color: c.gray, width: 3 }),
    d.arrow(220, 490, 220, 266, { color: c.gray, width: 3, head: 18 }),
  ];
  const shapes = [
    d.box(40, 120, 360, 140, "self-test", { size: 48, width: 3, rx: 12 }),
    `<polygon points="${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}" fill="${c.bg}" stroke="${c.white}" stroke-width="3"/>`,
    d.verdict(1240, 100, 430, 180, "/final-check", true, { size: 48, mono: true, width: 3, rx: 12 }),
    d.box(580, 420, 520, 140, "", { border: c.light, width: 3, rx: 12 }),
  ];
  const labels = [
    d.label(cx, 0, "passed?", { size: 32, anchor: "middle", centerY: cy }),
    d.label(1135, 0, "yes", { size: 32, color: c.gray, anchor: "middle", centerY: cy - 36 }),
    d.label(cx + 30, 0, "no", { size: 32, color: c.gray, centerY: 362 }),
    // zwei Zeilen im Kasten 420..560: Mitten 467 und 513, oben und unten je 31 frei
    d.label(cx, 0, "/self-study", { size: 32, mono: true, keepCase: true, anchor: "middle", centerY: 467 }),
    d.label(cx, 0, "the exercise, 5 chapters", { size: 32, color: c.light, anchor: "middle", centerY: 513 }),
  ];
  return put("fig-selftest", d.svg(1680, 600, ...d.layers(wires, shapes, labels)));
}
window.figSelfTest = figSelfTest;

/* ------------------------------------------------------------------ */
/* Your assistant: does / doesn't, als zwei bewertete Kaesten.          */
/* Mehrere Zeilen im Kasten stehen linksbuendig an einer gemeinsamen    */
/* Kante, der Block sitzt mittig ueber dem Zeichen; die Kaesten tragen  */
/* deshalb keinen eigenen Text, die Zeilen kommen als Labels dazu.      */
/* Hoehe: vier Zeilen zu 32 px mit 51 Zeilenabstand = 205, dazu das     */
/* Zeichen (inset 44) und Luft: 360.                                    */
/* ------------------------------------------------------------------ */
function figAssistant() {
  const c = C();
  const cols = [
    { x: 40, title: "does", ok: true,
      items: ["explains as often as you like", "reads error messages", "writes code in small steps", "keeps to the course standards"] },
    { x: 880, title: "doesn't", ok: false,
      items: ["solve the self-test", "decide what you investigate", "take responsibility for the result"] },
  ];
  const parts = [];
  const w = 760, y = 110, h = 360;
  cols.forEach((col) => {
    parts.push(d.label(col.x + w / 2, 0, col.title, { size: 48, anchor: "middle", centerY: 50 }));
    // no big red box (Nicolas, 2026-11-03): the "doesn't" box keeps a neutral
    // frame, and only its cross, where verdict() would put it, judges
    if (col.ok) parts.push(d.verdict(col.x, y, w, h, "", true, { width: 3, rx: 12 }));
    else parts.push(d.verdict(col.x, y, w, h, "", null, { width: 3, rx: 12, border: c.light }), d.mark(col.x + w / 2, y + h - 44, false));
    const n = col.items.length, lh = 51;
    const top = y + (h - 44) / 2 - (n - 1) * lh / 2;
    col.items.forEach((t, i) => parts.push(d.label(col.x + 48, 0, t, { size: 32, color: c.light, centerY: top + i * lh })));
  });
  return put("fig-assistant", d.svg(1680, 500, ...parts));
}
window.figAssistant = figAssistant;

/* ------------------------------------------------------------------ */
/* The data: a CSV file. Oben die Datei als Text (Kopfzeile und die     */
/* ersten drei Befragten, 4 von 606 Spalten, echte Werte), darunter die */
/* Tabelle, die read_csv() daraus macht. Schritt 0: nur die Datei;      */
/* Schritt 1: Kommas und NA gelb, rechts die Regeln; Schritt 2: die     */
/* Tabelle. Alles steht in jedem Schritt an seinem Platz, was noch      */
/* nicht dran ist, in der Hintergrundfarbe. Codeschrift 32 px, 0,6 em = */
/* 19,2 je Zeichen: die Kopfzeile (45 Zeichen) ist 864 breit.            */
/* ------------------------------------------------------------------ */
const CSV_LINES = [
  "q002geburt,q003land,D043kinderzahl,D044stadtf",
  "1970,1,NA,Kleinstadt <5000",
  "1990,7,0,Großstadt",
  "1963,6,NA,Großstadt",
];
function figCsv(slide, step) {
  const c = C();
  const s = Number(step) || 0;
  const cw = 19.2, x0 = 30, y0 = 110, lh = 50;
  const show = (k, col) => (s >= k ? col : c.bg);
  const parts = [
    d.label(0, 0, "the file: plain text", { size: 32, color: c.gray, centerY: 24 }),
    d.box(0, 60, 924, 230, "", { border: c.dark, width: 2, rx: 12 }),
  ];
  // the file, character runs: commas and NA in yellow from step 1 on
  CSV_LINES.forEach((line, r) => {
    const cy = y0 + r * lh;
    const tokens = line.split(/(,)/);
    let pos = 0;
    tokens.forEach((t) => {
      const isComma = t === ",", isNA = t === "NA";
      const col = (isComma || isNA) && s >= 1 ? c.yellow : (r === 0 ? c.light : c.white);
      parts.push(d.label(x0 + pos * cw, 0, t, { size: 32, mono: true, keepCase: true, color: col, centerY: cy }));
      pos += t.length;
    });
  });
  // the rules, right of the file
  const rx = 980;
  parts.push(d.label(rx, 0, "first line: the column names", { size: 32, color: show(1, c.light), centerY: y0 }));
  parts.push(`<line x1="${rx - 24}" y1="${y0 + lh - 18}" x2="${rx - 24}" y2="${y0 + 3 * lh + 18}" stroke="${show(1, c.gray)}" stroke-width="3"/>`);
  parts.push(d.label(rx, 0, "one line = one respondent", { size: 32, color: show(1, c.light), centerY: y0 + 2 * lh }));
  // the separator and the missing value, as they are written in the file
  parts.push(d.label(rx, 0, ",", { size: 32, mono: true, keepCase: true, color: show(1, c.yellow), centerY: 330 }));
  parts.push(d.label(rx + 32, 0, "next column", { size: 32, color: show(1, c.light), centerY: 330 }));
  parts.push(d.label(rx + 260, 0, "NA", { size: 32, mono: true, keepCase: true, color: show(1, c.yellow), centerY: 330 }));
  parts.push(d.label(rx + 310, 0, "missing", { size: 32, color: show(1, c.light), centerY: 330 }));
  // the table read_csv() makes
  parts.push(d.arrow(460, 300, 460, 370, { color: show(2, c.gray), width: 3, head: 14 }));
  parts.push(d.label(490, 0, "read_csv()", { size: 32, mono: true, keepCase: true, color: show(2, c.light), centerY: 335 }));
  const header = CSV_LINES[0].split(",");
  const rows = CSV_LINES.slice(1).map((l) => l.split(","));
  const widths = header.map((h, j) => Math.max(h.length, ...rows.map((r) => r[j].length)) * cw + 48);
  const tx = 0, ty = 390, rh = 52;
  let x = tx;
  header.forEach((h, j) => {
    parts.push(d.label(x + 20, 0, h, { size: 32, mono: true, keepCase: true, color: show(2, c.gray), centerY: ty + rh / 2 }));
    rows.forEach((row, i) => {
      const v = row[j];
      const col = v === "NA" ? c.yellow : c.white;
      parts.push(d.label(x + 20, 0, v, { size: 32, mono: true, keepCase: true, color: show(2, col), centerY: ty + (i + 1.5) * rh }));
    });
    x += widths[j];
  });
  parts.push(`<line x1="${tx}" y1="${ty + rh}" x2="${x}" y2="${ty + rh}" stroke="${show(2, c.dark)}" stroke-width="2"/>`);
  parts.push(d.label(x + 40, 0, "a tibble:\n3 rows, 4 columns", { size: 32, color: show(2, c.gray), centerY: ty + 2.5 * rh, lineHeight: 1.3 }));
  return put("fig-csv", d.svg(1680, 600, ...parts));
}
window.figCsv = figCsv;

/* ------------------------------------------------------------------ */
/* The pipe: das Ergebnis links wird das erste Argument rechts.         */
/* Zeile 1: "survey |> count(", ein gelb gestrichelter leerer Platz,    */
/* ", D044stadtf)"; ein Pfeil fuehrt von survey unten herum in den      */
/* Platz. Zeile 2 (Schritt 1): "count(survey, D044stadtf)", survey steht */
/* genau unter dem Platz und ist gelb hinterlegt. Codeschrift 48 px,     */
/* 0,6 em = 28,8 je Zeichen: "survey |> " endet bei 288, "count(" bei    */
/* 461, der Platz ist so breit wie "survey" (173). In Schritt 0 steht    */
/* Zeile 2 in der Hintergrundfarbe, damit nichts wandert.               */
/* ------------------------------------------------------------------ */
function figPipe(slide, step) {
  const c = C();
  const s = Number(step) || 0;
  const cw = 28.8, y1 = 110, y2 = 450;
  const code = (x, y, t, col) => d.label(x, 0, t, { size: 48, mono: true, keepCase: true, color: col, centerY: y });
  const slot = 6 * cw + 288;                 // 461: Beginn des Platzes
  const slotW = 6 * cw;                      // 173
  const wires = [
    d.line(86, y1 + 40, 86, 250, { color: c.gray, width: 3 }),
    d.line(86, 250, slot + slotW / 2, 250, { color: c.gray, width: 3 }),
    d.arrow(slot + slotW / 2, 250, slot + slotW / 2, y1 + 42, { color: c.gray, width: 3, head: 16 }),
  ];
  const row2 = s >= 1;
  const parts = [
    code(0, y1, "survey |> count(", c.white),
    `<rect x="${slot}" y="${y1 - 36}" width="${slotW}" height="72" rx="8" fill="none" stroke="${c.yellow}" stroke-width="3" stroke-dasharray="8 6"/>`,
    code(slot + slotW, y1, ", D044stadtf)", c.white),
    d.label(0, 0, "the result on the left becomes the first argument on the right", { size: 32, color: c.gray, centerY: 310 }),
    d.label(0, 0, "is the same as", { size: 32, color: row2 ? c.gray : c.bg, centerY: y2 }),
    row2 ? d.highlight(slot, slotW, y2, 48, { color: c.yellow }) : "",
    code(288, y2, "count(", row2 ? c.white : c.bg),
    code(slot, y2, "survey", row2 ? c.yellow : c.bg),
    code(slot + slotW, y2, ", D044stadtf)", row2 ? c.white : c.bg),
  ];
  return put("fig-pipe", d.svg(1680, 520, ...wires, ...parts));
}
window.figPipe = figPipe;

/* ------------------------------------------------------------------ */
/* Kleine Skizzen fuer Abbildungstypen, gezeichnet in einem Feld von    */
/* 260 x 140 ab (0, 0); die Aufrufer verschieben und skalieren sie mit  */
/* einem <g transform>. Marken in gray_light, keine Daten.              */
/* ------------------------------------------------------------------ */
const sketch = {
  bars: (c, hs) => hs.map((hh, i) => `<rect x="${20 + i * 50}" y="${140 - hh}" width="34" height="${hh}" fill="${c.light}"/>`).join("") +
    `<line x1="0" y1="140" x2="260" y2="140" stroke="${c.gray}" stroke-width="2"/>`,
  hist: (c) => [20, 50, 95, 130, 100, 60, 30, 12].map((hh, i) => `<rect x="${10 + i * 30}" y="${140 - hh}" width="29" height="${hh}" fill="${c.light}"/>`).join("") +
    `<line x1="0" y1="140" x2="260" y2="140" stroke="${c.gray}" stroke-width="2"/>`,
  box: (c) => [[30, 60, 80, 105, 130], [15, 45, 60, 90, 120], [40, 70, 95, 110, 135]].map((q, i) => {
    const bx = 30 + i * 80, w = 50, Y = (v) => 140 - v;
    return `<line x1="${bx + w / 2}" y1="${Y(q[0])}" x2="${bx + w / 2}" y2="${Y(q[4])}" stroke="${c.light}" stroke-width="3"/>` +
      `<rect x="${bx}" y="${Y(q[3])}" width="${w}" height="${q[3] - q[1]}" fill="${c.bg}" stroke="${c.light}" stroke-width="3"/>` +
      `<line x1="${bx}" y1="${Y(q[2])}" x2="${bx + w}" y2="${Y(q[2])}" stroke="${c.light}" stroke-width="3"/>`; }).join("") +
    `<line x1="0" y1="140" x2="260" y2="140" stroke="${c.gray}" stroke-width="2"/>`,
};
const placed = (x, y, k, svg) => `<g transform="translate(${x} ${y}) scale(${k})">${svg}</g>`;

/* ------------------------------------------------------------------ */
/* Which plot? It depends on the scale. Vier Spalten (nominal, ordinal, */
/* interval, ratio), ueber je zwei die Gruppe (categorical, metric),    */
/* vier Zeilen: Beispiel mit Beispielwerten, Datentyp in R, Kennzahl,   */
/* Abbildung als Skizze mit Namen. Nach den Karten "Nominal variable"   */
/* bis "Ratio variable" aus Werkzeuge. Spalten 345 breit ab x = 300;    */
/* laengster Eintrag "count(), median()" 17 Zeichen in 32 px Code = 326.*/
/* Skizzen: eine mit Faktor 0,75 (195 x 105), bei den metrischen zwei  */
/* mit 0,55 (143 x 77) nebeneinander.                                   */
/* ------------------------------------------------------------------ */
function figScales() {
  const c = C();
  const x0 = 300, cw = 345;
  const cx = (i) => x0 + i * cw + cw / 2;
  const cols = ["nominal", "ordinal", "interval", "ratio"];
  const examples = [["state", "Bavaria, Hesse, …"], ["size of place", "big city … village"],
                    ["year of birth", "1958, 1987, …"], ["age", "23, 67, …"]];
  const types = ["<fct>", "<fct> ordered", "<dbl>", "<dbl>"];
  const sums = ["count()", "count(), median()", "mean(), sd()", "mean(), sd()"];
  const plots = ["bar chart,\nby frequency", "bar chart,\nin scale order", "histogram,\nboxplot", "histogram,\nboxplot"];
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
    d.label(0, 0, "plot", { size: 32, color: c.gray, centerY: 480 }),
  ];
  cols.forEach((t, i) => {
    parts.push(d.label(cx(i), 0, t, { size: 48, anchor: "middle", centerY: 88 }));
    parts.push(d.label(cx(i), 0, examples[i][0], { size: 32, anchor: "middle", color: c.light, centerY: yEx }));
    // state names are proper names: keep their capitals
    parts.push(d.label(cx(i), 0, examples[i][1], { size: 32, anchor: "middle", color: c.gray, centerY: yEx + 42, keepCase: i === 0 }));
    parts.push(d.label(cx(i), 0, types[i], { size: 32, anchor: "middle", mono: true, keepCase: true, color: c.light, centerY: yType }));
    parts.push(d.label(cx(i), 0, sums[i], { size: 32, anchor: "middle", mono: true, keepCase: true, color: c.light, centerY: ySum }));
    parts.push(d.label(cx(i), 0, plots[i], { size: 32, anchor: "middle", color: c.light, centerY: yPlot, lineHeight: 1.3 }));
  });
  // Skizzen: nominal nach Haeufigkeit absteigend, ordinal in der Reihenfolge der Skala
  parts.push(placed(cx(0) - 97, ySk, 0.75, sketch.bars(c, [130, 100, 70, 45, 25])));
  parts.push(placed(cx(1) - 97, ySk, 0.75, sketch.bars(c, [110, 40, 70, 30, 55])));
  [2, 3].forEach((i) => {
    parts.push(placed(cx(i) - 150, ySk + 25, 0.55, sketch.hist(c)));
    parts.push(placed(cx(i) + 7, ySk + 25, 0.55, sketch.box(c)));
  });
  return put("fig-scales", d.svg(1680, 620, ...parts));
}
window.figScales = figScales;

/* ------------------------------------------------------------------ */
/* Which plot for which question? Sechs einfache Formen als kleine      */
/* Skizzen, drei mal zwei, je Name, Skizze und die Frage, fuer die sie  */
/* taugt. Skizzen schematisch, keine Daten; Marken in gray_light, die   */
/* Stapel in drei Grautoenen. Zelle 540 x 330, Skizze 260 x 140.        */
/* ------------------------------------------------------------------ */
function figPlotTypes() {
  const c = C();
  const bar = (x, y, w, hh, col) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${col}"/>`;
  const cells = [
    { name: "bar chart", q: "how many\nper category?", draw: (x, y) => [60, 110, 85, 40].map((hh, i) =>
        bar(x + 30 + i * 60, y + 140 - hh, 40, hh, c.light)).join("") },
    { name: "histogram", q: "how is one number\nspread?", draw: (x, y) => [20, 50, 95, 130, 100, 60, 30, 12].map((hh, i) =>
        bar(x + 10 + i * 30, y + 140 - hh, 29, hh, c.light)).join("") },
    { name: "boxplot", q: "does a number differ\nbetween groups?", draw: (x, y) => [[30, 60, 80, 105, 130], [15, 45, 60, 90, 120], [40, 70, 95, 110, 135]].map((b, i) => {
        const bx = x + 30 + i * 80, w = 50, Y = (v) => y + 140 - v;
        return `<line x1="${bx + w / 2}" y1="${Y(b[0])}" x2="${bx + w / 2}" y2="${Y(b[4])}" stroke="${c.light}" stroke-width="3"/>` +
          `<rect x="${bx}" y="${Y(b[3])}" width="${w}" height="${b[3] - b[1]}" fill="${c.bg}" stroke="${c.light}" stroke-width="3"/>` +
          `<line x1="${bx}" y1="${Y(b[2])}" x2="${bx + w}" y2="${Y(b[2])}" stroke="${c.light}" stroke-width="3"/>`; }).join("") },
    { name: "stacked bars, 100 %", q: "does a category differ\nbetween groups?", draw: (x, y) => [[0.5, 0.3], [0.35, 0.4], [0.2, 0.45]].map((p, i) => {
        const bx = x + 50 + i * 70, w = 46, H = 140, h1 = H * p[0], h2 = H * p[1];
        return bar(bx, y, w, h1, c.light) + bar(bx, y + h1, w, h2, c.gray) + bar(bx, y + h1 + h2, w, H - h1 - h2, c.dark); }).join("") },
    { name: "scatter plot", q: "do two numbers\ngo together?", draw: (x, y) => [[20, 30], [45, 50], [60, 40], [80, 75], [100, 70], [120, 95], [140, 90], [165, 115], [185, 105], [210, 130], [235, 120]].map(([a, b]) =>
        `<circle cx="${x + 10 + a}" cy="${y + 140 - b}" r="7" fill="${c.light}"/>`).join("") },
    { name: "line chart", q: "how does it change\nover time?", draw: (x, y) => {
        const pts = [[0, 30], [40, 45], [80, 40], [120, 80], [160, 70], [200, 110], [240, 125]];
        return `<polyline points="${pts.map(([a, b]) => `${x + 10 + a},${y + 140 - b}`).join(" ")}" fill="none" stroke="${c.light}" stroke-width="4"/>`; } },
  ];
  const parts = [];
  cells.forEach((cell, i) => {
    const x = (i % 3) * 570, y = Math.floor(i / 3) * 350;
    const sx = x + 140;                           // Skizze mittig in der 540er Zelle
    parts.push(d.label(x + 270, 0, cell.name, { size: 32, anchor: "middle", centerY: y + 24 }));
    parts.push(cell.draw(sx, y + 64));
    parts.push(`<line x1="${sx}" y1="${y + 206}" x2="${sx + 260}" y2="${y + 206}" stroke="${c.gray}" stroke-width="2"/>`);
    parts.push(d.label(x + 270, y + 256, cell.q, { size: 32, color: c.gray, anchor: "middle", lineHeight: 1.3 }));
  });
  return put("fig-plottypes", d.svg(1680, 680, ...parts));
}
window.figPlotTypes = figPlotTypes;

/* Start: erste Zeichnungen schreiben, falls die Folien da sind */
if ($("fig-folder")) figFolder();
if ($("fig-process-import")) figProcessImport();
if ($("fig-process-transform")) figProcessTransform();
if ($("fig-process-visualise")) figProcessVisualise();
if ($("fig-csv")) figCsv(null, 0);
if ($("fig-pipe")) figPipe(null, 0);
if ($("fig-scales")) figScales();
if ($("fig-plottypes")) figPlotTypes();
if ($("fig-prefix")) figPrefix();
if ($("fig-selftest")) figSelfTest();
if ($("fig-assistant")) figAssistant();
