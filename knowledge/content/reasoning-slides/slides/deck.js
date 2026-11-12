/* Zeichnungen des Decks "Reasoning" (Entwurf vom 2026-11-12, am selben Tag
 * freigegeben).
 *
 * Leinwand 1680 breit, damit die Schriftgroessen so herauskommen, wie sie
 * hier stehen. Erlaubt: 20, 32, 48, 80. Leitungen zuerst, dann Kaesten, dann
 * Beschriftungen (d.layers). Folien mit Aufbau zeichnen immer dieselbe
 * Leinwand; was noch nicht sichtbar sein soll, wird weggelassen, nie
 * verschoben.
 *
 * Farben: Grau fuer alles, Pink (Rolle "blue") fuer den Punkt der Folie.
 * Gruen und Rot nur als kleine Zeichen fuer richtig und falsch bei der
 * Traktorfrage, nie als grosser Urteilskasten (Wunsch Nicolas, 2026-11-03).
 *
 * Die Zeichnungen answer-or-think, learning-from-rewards und
 * longer-or-more-often stammen aus der Lektion (content/reasoning/figures.js,
 * 1600 breit) und sind hier um 40 nach rechts gerueckt.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; };
const shift = (...parts) => `<g transform="translate(40,0)">${parts.flat().join("")}</g>`;

/* Textbreite in Arial, im Browser gemessen; Codeschrift rechnet 0,6 x Groesse */
function breite(text, size, mono) {
  if (mono) return text.length * size * 0.6;
  const ctx = breite.ctx || (breite.ctx = document.createElement("canvas").getContext("2d"));
  ctx.font = `${size}px ${C().font}`;
  return ctx.measureText(text).width;
}

/* Linksbuendige Zeilen mit gleichem Abstand */
function zeilen(x, erste, abstand, texte, o) {
  return texte.map((t, i) => d.label(x, 0, t, { size: 32, centerY: erste + i * abstand, ...o }));
}

/* ------------------------------------------------------------------ */
/* Traktorfrage: sofort antworten oder erst schreiben (aus der Lektion) */
/* ------------------------------------------------------------------ */
/* Antwortkaesten 1220-1480 (260 breit; "1,000 €" in 48 = 7 x 28,8 = 202),
 * das Zeichen bei 1530. Statt eines roten Urteilskastens steht unter der
 * falschen Antwort, was aus ihr folgt. */
function figAnswer(step) {
  const c = C();
  const A = 95, B = 380;
  const wires = [d.arrow(400, A, 1205, A, { color: c.gray, width: 3, head: 16 })];
  const boxes = [
    d.box(40, A - 55, 360, 110, "question", { size: 48, border: c.gray }),
    d.box(1220, A - 55, 260, 110, "1,000 €", { size: 48, border: c.light }),
    d.mark(1530, A, false),
  ];
  const labels = [
    d.label(802, 0, "answers right away", { size: 32, color: c.gray, anchor: "middle", centerY: A - 32 }),
    // "then together: 12,000 €" rund 350 breit, mittig unter dem Kasten: 1175-1525
    d.label(1350, 0, "then together: 12,000 €", { size: 32, color: c.gray, anchor: "middle", centerY: A + 90 }),
  ];
  if (step >= 1) {
    wires.push(d.arrow(400, B, 505, B, { color: c.gray, width: 3, head: 16 }),
               d.arrow(1100, B, 1205, B, { color: c.gray, width: 3, head: 16 }));
    // Denkkasten 520-1100; laengste Zeile "x + x + 10,000 = 11,000" 23 x 19,2 = 442 ab 560
    // Textblock 274-486 (Mitten 290..470, je 16 darueber und darunter), Kasten 240-520: oben 34, unten 34
    boxes.push(d.box(40, B - 55, 360, 110, "question", { size: 48, border: c.gray }),
               d.box(520, 240, 580, 280, "", { border: c.blue, width: 3 }),
               d.box(1220, B - 55, 260, 110, "500 €", { size: 48, border: c.light }),
               d.mark(1530, B, true));
    labels.push(d.label(810, 0, "thinks in writing first", { size: 32, color: c.blue, anchor: "middle", centerY: 212 }),
                ...zeilen(560, 290, 60, ["trailer: x", "tractor: x + 10,000", "x + x + 10,000 = 11,000", "x = 500"], { color: c.white }));
  }
  return d.svg(1680, 560, shift(d.layers(wires, boxes, labels)));
}
function showAnswer(slide, step) { put("fig-answer", figAnswer(step || 0)); }

/* ------------------------------------------------------------------ */
/* mehr Tokens, mehr Rechnung                                           */
/* ------------------------------------------------------------------ */
/* Quadrate 50 breit im Raster 64: 17 pinke Gedanken 390-1464, die Antwort
 * 1478-1528. Fragekaesten 60-320. */
function figPasses() {
  const c = C();
  const q = 50, pitch = 64, x0 = 390;
  const wires = [
    d.arrow(320, 150, 378, 150, { color: c.gray, width: 3, head: 14 }),
    d.arrow(320, 330, 378, 330, { color: c.gray, width: 3, head: 14 }),
  ];
  const boxes = [
    d.box(60, 100, 260, 100, "question", { size: 32, border: c.gray }),
    d.box(x0, 125, q, q, "", { border: c.white, width: 3 }),
    d.box(60, 280, 260, 100, "question", { size: 32, border: c.gray }),
  ];
  for (let i = 0; i < 17; i++) boxes.push(d.box(x0 + i * pitch, 305, q, q, "", { border: c.blue, width: 3 }));
  boxes.push(d.box(x0 + 17 * pitch, 305, q, q, "", { border: c.white, width: 3 }));
  const labels = [
    d.label(840, 0, "every square is one token, and every token is one pass through all layers", { size: 32, color: c.gray, anchor: "middle", centerY: 30 }),
    d.label(x0 + q / 2, 0, "answer", { size: 32, color: c.white, anchor: "middle", centerY: 95 }),
    d.label(480, 0, "1 pass", { size: 32, color: c.gray, centerY: 150 }),
    d.label(x0 + (16 * pitch + q) / 2, 0, "thoughts", { size: 32, color: c.blue, anchor: "middle", centerY: 275 }),
    d.label(x0 + 17 * pitch + q / 2, 0, "answer", { size: 32, color: c.white, anchor: "middle", centerY: 275 }),
    d.label(840, 0, "500 tokens of thought before the answer are 500 passes", { size: 32, color: c.gray, anchor: "middle", centerY: 420 }),
  ];
  return d.svg(1680, 450, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* der Kontext ist das Papier: 37 x 48 schriftlich                     */
/* ------------------------------------------------------------------ */
/* Codeschrift 48: 28,8 je Zeichen. Linke Seiten rechtsbuendig bei 850, das
 * Gleichheitszeichen fest bei 880, Ergebnisse rechtsbuendig bei 1080, so
 * stehen Einer unter Einern. */
function figPaper(step) {
  const c = C();
  const m = { size: 48, mono: true };
  const parts = [d.label(840, 0, "37 × 48", { size: 80, mono: true, anchor: "middle", centerY: 70 })];
  if (step >= 1) {
    parts.push(
      d.label(850, 0, "37 × 40", { ...m, anchor: "end", color: c.light, centerY: 200 }),
      d.label(880, 0, "=", { ...m, anchor: "middle", color: c.light, centerY: 200 }),
      d.label(1080, 0, "1,480", { ...m, anchor: "end", centerY: 200 }),
      d.label(850, 0, "37 × 8", { ...m, anchor: "end", color: c.light, centerY: 280 }),
      d.label(880, 0, "=", { ...m, anchor: "middle", color: c.light, centerY: 280 }),
      d.label(1080, 0, "296", { ...m, anchor: "end", centerY: 280 }),
      d.line(920, 325, 1090, 325, { color: c.light, width: 3 }),
      d.label(1080, 0, "1,776", { ...m, anchor: "end", color: c.blue, centerY: 375 }),
    );
  }
  return d.svg(1680, 420, ...parts);
}
function showPaper(slide, step) { put("fig-paper", figPaper(step || 0)); }

/* ------------------------------------------------------------------ */
/* ein grosser Schritt oder viele kleine                               */
/* ------------------------------------------------------------------ */
/* Links 0-760 der Sprung, rechts ab 880 die Treppe: Zeile i bei x 880 + 100 i,
 * Mitte 110 + 100 i. Breiteste Zeile "x + x + 10,000 = 11,000" ab 1080:
 * 23 x 19,2 = 442, Ende 1522. Die Verbinder laufen von 20 rechts der
 * Zeilenkante senkrecht nach unten und dann zur naechsten Zeile. */
function figSteps() {
  const c = C();
  const texte = ["trailer: x", "tractor: x + 10,000", "x + x + 10,000 = 11,000", "x = 500"];
  const xs = texte.map((_, i) => 880 + i * 100), ys = texte.map((_, i) => 110 + i * 100);
  const wires = [d.arrow(170, 400, 590, 135, { color: c.gray, width: 3, head: 18 })];
  for (let i = 0; i < texte.length - 1; i++) {
    wires.push(d.line(xs[i] + 20, ys[i] + 26, xs[i] + 20, ys[i + 1], { color: c.blue, width: 3 }),
               d.arrow(xs[i] + 20, ys[i + 1], xs[i + 1] - 14, ys[i + 1], { color: c.blue, width: 3, head: 14 }));
  }
  const labels = [
    d.label(380, 0, "one big step", { size: 32, color: c.gray, anchor: "middle", centerY: 30 }),
    d.label(1210, 0, "small steps", { size: 32, color: c.blue, anchor: "middle", centerY: 30 }),
    d.label(60, 0, "question", { size: 32, color: c.white, centerY: 430 }),
    d.label(600, 0, "answer", { size: 32, color: c.white, centerY: 110 }),
    d.label(330, 0, "?", { size: 48, color: c.gray, anchor: "middle", centerY: 230 }),
    ...texte.map((t, i) => d.label(xs[i], 0, t, { size: 32, color: c.white, centerY: ys[i] })),
  ];
  return d.svg(1680, 460, ...d.layers(wires, labels));
}

/* ------------------------------------------------------------------ */
/* ein Schritt auf Papier laesst sich pruefen                          */
/* ------------------------------------------------------------------ */
/* Codeschrift 48 ab x 300; laengste Zeile "wait, that is 12,000, not 11,000."
 * 34 x 28,8 = 979, Ende 1279. */
function figCheck(step) {
  const c = C();
  const m = { size: 48, mono: true };
  const alt = step >= 1 ? c.gray : c.white;
  const parts = zeilen(300, 50, 80, ["trailer: 1,000", "tractor: 11,000", "together: 12,000"], { ...m, color: alt });
  if (step >= 1) {
    parts.push(d.label(300, 0, "wait, that is 12,000, not 11,000.", { ...m, color: c.blue, centerY: 310 }),
               d.label(300, 0, "trailer: x, tractor: x + 10,000", { ...m, color: c.white, centerY: 390 }));
  }
  return d.svg(1680, 440, ...parts);
}
function showCheck(slide, step) { put("fig-check", figCheck(step || 0)); }

/* ------------------------------------------------------------------ */
/* Balken mit Spur bis 100 %                                           */
/* ------------------------------------------------------------------ */
/* Beschriftung rechtsbuendig bei 520, Spur 560-1360 (800 = 100 %), Wert 20
 * hinter dem Balken. Je Gruppe ein grauer Titel und zwei Balken; eine Gruppe
 * braucht 250 in der Hoehe. groups: [{ title, bars: [[label, wert, akzent]] }] */
function hbars(groups, step) {
  const c = C();
  const X = 560, L = 800, h = 60;
  const parts = [];
  groups.forEach((g, gi) => {
    if (gi > step) return;
    const y = 40 + gi * 250;
    // Titel ab 60: der laengste ("AIME, a maths competition …", 85 Zeichen) ist rund 1300 breit
    parts.push(d.label(60, 0, g.title, { size: 32, color: c.gray, centerY: y }));
    g.bars.forEach(([name, v, akzent], bi) => {
      const cy = y + 75 + bi * 85;
      parts.push(
        d.box(X, cy - h / 2, L, h, "", { border: c.dark, fill: "none", rx: 4 }),
        `<rect x="${X}" y="${cy - h / 2}" width="${L * v / 100}" height="${h}" rx="4" fill="${akzent ? c.blue : c.gray}"/>`,
        d.label(X - 40, 0, name, { size: 32, color: akzent ? c.white : c.light, anchor: "end", centerY: cy, keepCase: true }),
        d.label(X + L * v / 100 + 20, 0, `${v} %`, { size: 32, color: c.white, centerY: cy }),
      );
    });
  });
  return d.svg(1680, 40 + groups.length * 250 - 30, ...parts);
}

const COT = [
  { title: "eight worked examples in the prompt: grade-school maths word problems", bars: [["without", 18], ["with", 57, true]] },
  { title: "\"let's think step by step\" added to the question: arithmetic word problems", bars: [["without", 18], ["with", 79, true]] },
];
function showCot(slide, step) { put("fig-cot", hbars(COT, step || 0)); }

/* ------------------------------------------------------------------ */
/* Zeitleiste in zwei Spalten                                           */
/* ------------------------------------------------------------------ */
/* Links ab 60 (Datum) und 260 (Ereignis), rechts ab 900 und 1100; laengster
 * Eintrag rechts "o3, Gemini 2.0 Flash Thinking" rund 470, Ende 1570. */
const FRUEH = [["2021", "scratchpads"], ["01/2022", "chain of thought"], ["03/2022", "self-consistency"], ["05/2022", "\"let's think step by step\""], ["10/2022", "ReAct"]];
const SPAET = [["09/2024", "o1"], ["12/2024", "o3, Gemini 2.0 Flash Thinking"], ["01/2025", "DeepSeek-R1"], ["02/2025", "Claude 3.7 Sonnet"], ["07/2025", "gold at the IMO"], ["08/2025", "GPT-5, gpt-oss"]];
function figTimeline(step) {
  const c = C();
  const parts = [d.label(60, 0, "asked for in the prompt", { size: 32, color: c.gray, centerY: 40 })];
  FRUEH.forEach(([wann, was], i) => parts.push(
    d.label(60, 0, wann, { size: 32, color: c.gray, centerY: 120 + i * 70 }),
    d.label(260, 0, was, { size: 32, color: c.light, centerY: 120 + i * 70, keepCase: was === "ReAct" })));
  if (step >= 1) parts.push(d.label(900, 0, "trained to reason", { size: 32, color: c.blue, centerY: 40 }));
  SPAET.forEach(([wann, was], i) => {
    if (step < (i < 3 ? 1 : 2)) return;
    parts.push(d.label(900, 0, wann, { size: 32, color: c.gray, centerY: 120 + i * 70 }),
               d.label(1100, 0, was, { size: 32, color: c.white, centerY: 120 + i * 70, keepCase: true }));
  });
  return d.svg(1680, 510, ...parts);
}
function showTimeline(slide, step) { put("fig-timeline", figTimeline(step || 0)); }

/* ------------------------------------------------------------------ */
/* drei Stufen                                                          */
/* ------------------------------------------------------------------ */
/* Kaesten 480 breit bei 40, 600, 1160; laengste Zeile "token on books, code"
 * 20 x 19,2 = 384 + 2 x 40 Rand = 464. Textblock 84-286 (Mitten 100..270),
 * Kasten 44-326: oben und unten je 40. */
const STUFEN = [
  ["1  pretraining", ["predict the next", "token on books, code", "and the internet"], "plain"],
  ["2  examples of thinking", ["optional:", "a few thousand", "worked answers"], "dashed"],
  ["3  learning from rewards", ["attempts whose", "answer a program", "can check"], "new"],
];
function figStages(step) {
  const c = C();
  const parts = [];
  STUFEN.forEach(([titel, text, art], i) => {
    if (i > step) return;
    const x = 40 + i * 560;
    const farbe = art === "new" ? c.blue : c.light;
    parts.push(d.box(x, 44, 480, 282, "", { border: farbe, width: 3, dashed: art === "dashed" }),
               d.label(x + 40, 0, titel, { size: 32, color: art === "new" ? c.blue : c.white, centerY: 100 }),
               ...zeilen(x + 40, 170, 50, text, { color: c.gray }));
  });
  return d.svg(1680, 370, ...parts);
}
function showStages(slide, step) { put("fig-stages", figStages(step || 0)); }

/* ------------------------------------------------------------------ */
/* eine Runde Lernen aus Belohnungen (aus der Lektion), animiert         */
/* ------------------------------------------------------------------ */
/* Ein Verfahren, das Schritt fuer Schritt arbeitet: Versuche schreiben,
 * pruefen, das Belohnte verstaerken. Drei Abschnitte, schrittweise; jeder
 * Zwischenstand ist fuer sich lesbar. Rueckwaerts wird nur gesprungen, weil
 * die Rueckmeldung ins Modell eine Richtung hat. */
function figRewards() {
  const c = C();
  const MID = 300, ys = [105, 235, 365, 495];
  const versuche = [["attempt 1: … 500 €", true], ["attempt 2: … 1,000 €", false], ["attempt 3: … 400 €", false], ["attempt 4: … 500 €", true]];
  return d.svg(1680, 690, shift(
    d.arrow(340, MID, 405, MID, { color: c.gray, width: 3, head: 16 }),
    d.g("fan", ...ys.map((y) => d.arrow(640, MID, 745, y, { color: c.gray, width: 2, head: 14 }))),
    d.g("back", d.line(1400, 540, 1400, 610, { color: c.blue, width: 3 }),
                d.line(1400, 610, 530, 610, { color: c.blue, width: 3 }),
                d.arrow(530, 610, 530, 375, { color: c.blue, width: 3, head: 16 })),
    // "problem with a / known answer": 14 x 19,2 = 269 < 300
    d.box(40, MID - 80, 300, 160, "problem with a\nknown answer", { size: 32, border: c.gray }),
    d.box(420, MID - 60, 220, 120, "model", { size: 48, border: c.white }),
    // laengster Versuch "attempt 2: … 1,000 €" 20 x 19,2 = 384 < 420
    d.g("attempts", ...versuche.map(([t], i) => d.box(760, ys[i] - 45, 420, 90, t, { size: 32, border: c.light }))),
    d.g("checks", ...versuche.map(([, ok], i) => d.mark(1240, ys[i], ok)),
                  ...versuche.map(([, ok], i) => d.label(1290, 0, `reward ${ok ? 1 : 0}`, { size: 32, color: ok ? c.white : c.gray, centerY: ys[i] }))),
    d.g("backlabel", d.label(965, 0, "the thinking that led to ✓ becomes more likely", { size: 32, color: c.blue, anchor: "middle", centerY: 650 })),
  ));
}
if ($("fig-rewards")) {
  put("fig-rewards", figRewards());
  const a = d.anim("fig-rewards");
  a.step(a.draw("fan", { dur: 600 }), a.show("attempts", { dur: 500 }));
  a.step(a.show("checks", { dur: 600 }));
  a.step(a.draw("back", { dur: 1200 }), a.show("backlabel", { dur: 400 }));
}

/* ------------------------------------------------------------------ */
/* pruefbar und das Schlupfloch                                         */
/* ------------------------------------------------------------------ */
/* Links ab 60, rechts ab 900; laengste Zeile rechts "a program that runs and
 * does nothing" 36 x 19,2 = 691, Ende 1591. */
function figLoophole(step) {
  const c = C();
  const parts = [
    d.label(60, 0, "a program can check", { size: 32, color: c.gray, centerY: 40 }),
    d.mark(90, 140, true), d.label(140, 0, "maths: compare with the result", { size: 32, centerY: 140 }),
    d.mark(90, 230, true), d.label(140, 0, "code: run the tests", { size: 32, centerY: 230 }),
  ];
  if (step >= 1) parts.push(
    d.label(900, 0, "a loophole", { size: 32, color: c.gray, centerY: 40 }),
    d.label(900, 0, "the test only checks that it runs", { size: 32, centerY: 140 }),
    d.arrow(940, 168, 940, 205, { color: c.gray, width: 3, head: 14 }),
    d.label(900, 0, "a program that runs and does nothing", { size: 32, centerY: 230 }),
    d.label(900, 0, "reward hacking", { size: 48, color: c.blue, centerY: 330 }));
  return d.svg(1680, 370, ...parts);
}
function showLoophole(slide, step) { put("fig-loophole", figLoophole(step || 0)); }

/* ------------------------------------------------------------------ */
/* Destillation                                                         */
/* ------------------------------------------------------------------ */
/* Grosses Modell 60-440, Pfeil bis 865, sechs kleine Modelle 200 breit im
 * Raster 240 ab 880 (Ende 1560). "thoughts and answers" rund 330, mittig 650. */
function figDistill() {
  const c = C();
  const groessen = ["1.5B", "7B", "8B", "14B", "32B", "70B"];
  const wires = [d.arrow(440, 190, 865, 190, { color: c.gray, width: 3, head: 16 })];
  const boxes = [d.box(60, 80, 380, 220, "DeepSeek-R1", { size: 48, border: c.light, keepCase: true })];
  groessen.forEach((g, i) => {
    const x = 880 + (i % 3) * 240, y = 80 + Math.floor(i / 3) * 130;
    boxes.push(d.box(x, y, 200, 90, g, { size: 32, border: i ? c.gray : c.blue, color: i ? c.light : c.blue, keepCase: true, width: i ? 2 : 3 }));
  });
  const labels = [
    d.label(650, 0, "thoughts and answers", { size: 32, color: c.gray, anchor: "middle", centerY: 150 }),
    d.label(840, 0, "even the smallest one beat GPT-4o on AIME", { size: 32, color: c.gray, anchor: "middle", centerY: 380, keepCase: true }),
  ];
  return d.svg(1680, 410, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* zwei Kurven                                                          */
/* ------------------------------------------------------------------ */
/* Zwei Diagramme 600 breit bei 120 und 920; Achsen bei y 380, Linien
 * gerade, weil die x-Achse logarithmisch ist. Form nach OpenAI 2024, zur
 * Veranschaulichung. */
function figCurves(step) {
  const c = C();
  const parts = [];
  [["more training", c.gray], ["more time to think", c.blue]].forEach(([achse, farbe], i) => {
    if (i > step) return;
    const x0 = 120 + i * 800;
    parts.push(d.line(x0, 380, x0 + 600, 380, { color: c.gray, width: 2 }),
               d.line(x0, 80, x0, 380, { color: c.gray, width: 2 }),
               d.line(x0 + 40, 340, x0 + 560, 120, { color: farbe, width: 4 }),
               ...[0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${x0 + 40 + k * 104}" cy="${340 - k * 44}" r="9" fill="${farbe}"/>`),
               d.label(x0, 0, "accuracy", { size: 32, color: c.gray, centerY: 45 }),
               d.label(x0 + 300, 0, `${achse} (log scale)`, { size: 32, color: i ? c.blue : c.light, anchor: "middle", centerY: 425 }));
  });
  return d.svg(1680, 460, ...parts);
}
function showCurves(slide, step) { put("fig-curves", figCurves(step || 0)); }

/* ------------------------------------------------------------------ */
/* laenger oder oefter nachdenken (aus der Lektion)                    */
/* ------------------------------------------------------------------ */
function figLonger(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  boxes.push(d.box(60, 100, 680, 450, "", { border: c.blue, width: 3 }));
  labels.push(d.label(400, 0, "think longer", { size: 32, color: c.blue, anchor: "middle", centerY: 60 }));
  // laengste Zeile "wait, step 2 is wrong" 21 x 19,2 = 403 ab 100
  const kette = ["step 1", "step 2", "wait, step 2 is wrong", "step 2, again", "step 3", "answer: 500 €"];
  kette.forEach((t, i) => {
    const y = 160 + i * 70;
    if (i === 2) boxes.push(d.highlight(100, breite(t, 32), y, 32, { color: c.gray, opacity: 0.25 }));
    labels.push(d.label(100, 0, t, { size: 32, centerY: y, color: i === kette.length - 1 ? c.white : c.light }));
  });
  if (step >= 1) {
    labels.push(d.label(1200, 0, "think more often", { size: 32, color: c.blue, anchor: "middle", centerY: 60 }));
    ["500", "500", "1,000", "500", "400"].forEach((a, i) => {
      const x = 870 + i * 140, cx = x + 55;
      boxes.push(d.box(x, 100, 110, 220, "", { border: c.gray }));
      [150, 195, 240].forEach((y, k) => boxes.push(d.line(x + 20, y, x + 90 - k * 15, y, { color: c.gray, width: 3 })));
      labels.push(d.label(cx, 0, a, { size: 32, anchor: "middle", centerY: 280, color: c.white }));
      wires.push(d.arrow(cx, 320, 1200 + (cx - 1200) * 0.4, 442, { color: c.gray, width: 2, head: 12 }));
    });
    // "majority: 500 €" 15 x 19,2 = 288 < 440
    boxes.push(d.box(980, 450, 440, 100, "majority: 500 €", { size: 32, border: c.blue, width: 3 }));
  }
  // Schritt 2: die Zahlen zu o1, mittig unter beiden Haelften
  if (step >= 2) labels.push(d.label(800, 0, "o1 on AIME: 74 % with one attempt, 83 % with 64 attempts and a majority vote", { size: 32, color: c.gray, anchor: "middle", centerY: 630, keepCase: true }));
  return d.svg(1680, 660, shift(d.layers(wires, boxes, labels)));
}
function showLonger(slide, step) { put("fig-longer", figLonger(step || 0)); }

/* ------------------------------------------------------------------ */
/* Treue der Gedanken                                                   */
/* ------------------------------------------------------------------ */
const HINT = [{ title: "used a hint to the answer and said so in its thoughts", bars: [["Claude 3.7 Sonnet", 25, true], ["DeepSeek-R1", 39, true]] }];

/* ------------------------------------------------------------------ */
/* Denken in der Agentenschleife                                        */
/* ------------------------------------------------------------------ */
/* think 720-980 (Mitte 850, 260), Werkzeug 1180-1480 oben, Ergebnis
 * 1160-1500 unten; "read the result" 15 x 19,2 = 288 < 340. Die pinken
 * Beschriftungen rechtsbuendig bei 680, laengste "a plan before the first
 * step" rund 430, Anfang 250. */
function figLoop(step) {
  const c = C();
  const wires = [
    d.arrow(980, 230, 1178, 130, { color: c.gray, width: 3, head: 16 }),
    d.arrow(1330, 160, 1330, 358, { color: c.gray, width: 3, head: 16 }),
    d.arrow(1158, 410, 982, 300, { color: c.gray, width: 3, head: 16 }),
  ];
  const boxes = [
    d.box(720, 210, 260, 100, "think", { size: 32, border: step >= 1 ? c.blue : c.light, width: 3 }),
    d.box(1180, 60, 300, 100, "call a tool", { size: 32, border: c.light }),
    d.box(1160, 360, 340, 100, "read the result", { size: 32, border: c.light }),
  ];
  const labels = [];
  if (step >= 1) labels.push(
    d.label(680, 0, "a plan before the first step", { size: 32, color: c.blue, anchor: "end", centerY: 180 }),
    d.label(680, 0, "a check after each result", { size: 32, color: c.blue, anchor: "end", centerY: 260 }),
    d.label(680, 0, "wait, that failed", { size: 32, color: c.blue, anchor: "end", centerY: 340 }));
  return d.svg(1680, 500, ...d.layers(wires, boxes, labels));
}
function showLoop(slide, step) { put("fig-loop", figLoop(step || 0)); }

/* ------------------------------------------------------------------ */
/* Zeithorizont nach METR                                               */
/* ------------------------------------------------------------------ */
/* x: 2019-2026 auf 260-1560. y logarithmisch in Sekunden: 1 s bei 480,
 * 10 Stunden (36.000 s, log 4,556) bei 90; die oberste Linie (10 Stunden) entfaellt,
 * damit die Beschriftung des zweiten Punkts frei steht. Gemessen und beschriftet sind nur
 * die beiden Punkte (METR, Time Horizon 1.1, 2026); die gestrichelte Linie
 * ist die Verdopplung alle sieben Monate, rueckwaerts vom ersten Punkt. */
function figMetr() {
  const c = C();
  const X = (jahr) => 260 + (jahr - 2019) / 7 * 1300;
  const Y = (s) => 480 - Math.log10(s) / Math.log10(36000) * 390;
  const p1 = [2025.12, 3600], p2 = [2025.88, 18000];
  const trend = (jahr) => 3600 * Math.pow(2, (jahr - p1[0]) / (7 / 12));
  const parts = [];
  [[1, "1 second"], [60, "1 minute"], [3600, "1 hour"]].forEach(([s, t]) => parts.push(
    d.line(260, Y(s), 1600, Y(s), { color: c.dark, width: 2, dashed: true }),
    d.label(240, 0, t, { size: 32, color: c.gray, anchor: "end", centerY: Y(s) })));
  for (let j = 2019; j <= 2026; j++) parts.push(d.label(X(j), 0, String(j), { size: 32, color: c.gray, anchor: "middle", centerY: 525 }));
  const pts = [];
  for (let j = 2019; j <= p1[0] + 1e-9; j += 0.05) pts.push(`${X(j).toFixed(1)},${Y(trend(j)).toFixed(1)}`);
  pts.push(`${X(p1[0]).toFixed(1)},${Y(p1[1]).toFixed(1)}`);
  parts.push(`<polyline points="${pts.join(" ")}" fill="none" stroke="${c.gray}" stroke-width="3" stroke-dasharray="10 8"/>`,
             d.line(X(p1[0]), Y(p1[1]), X(p2[0]), Y(p2[1]), { color: c.blue, width: 4 }),
             `<circle cx="${X(p1[0])}" cy="${Y(p1[1])}" r="11" fill="${c.blue}"/>`,
             `<circle cx="${X(p2[0])}" cy="${Y(p2[1])}" r="11" fill="${c.blue}"/>`,
             d.label(X(p1[0]) - 30, 0, "Claude 3.7 Sonnet, 02/2025: about 1 hour", { size: 32, anchor: "end", centerY: Y(p1[1]) - 45, keepCase: true }),
             d.label(X(p2[0]) - 30, 0, "Claude Opus 4.5, 11/2025: over 5 hours", { size: 32, anchor: "end", centerY: Y(p2[1]) - 45, keepCase: true }),
             d.label(280, 0, "dashed: doubling about every seven months", { size: 32, color: c.gray, centerY: (Y(60) + Y(3600)) / 2 }),
             d.label(20, 0, "length of the tasks an agent solves in half of the cases", { size: 32, color: c.gray, centerY: 30 }));
  return d.svg(1680, 560, ...parts);
}

/* ------------------------------------------------------------------ */
/* Zeichnungen ohne Aufbau einmal beim Laden                            */
/* ------------------------------------------------------------------ */
put("fig-passes", figPasses());
put("fig-steps", figSteps());
put("fig-o1", hbars([{ title: "AIME, a maths competition for strong high-school students, one attempt per problem", bars: [["GPT-4o", 12], ["o1", 74, true]] }], 0));
put("fig-distill", figDistill());
put("fig-hint", hbars(HINT, 0));
put("fig-metr", figMetr());
