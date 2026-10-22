/* Zeichnungen fuer das Deck „cutting the lifi project" (stagekit-Fassung).
 * Der Projektteil des Inputs zum Zerlegen, am 2026-10-22 aus dem Deck
 * „cutting problems" herausgeloest; die Zeichnungen stammen von dort, neu ist
 * nur die Teamfolie (drawTeam).
 * Regeln: Zeichenflaeche 1680 x 700 (mit Punchline 1680 x 620), nur die vier
 * Groessen des Themes (20, 32, 48, 80), Beschriftungen in 32, Werte in 48,
 * Punchlines als <div class="punch"> auf der Folie, nie in der Zeichnung. */
"use strict";

const d = window.draw;
const $ = (id) => document.getElementById(id);
const W = 1680;

/* Ein Kasten mit zentriertem Text, ueberall gleich. Die Fuellung ist der
 * Folienhintergrund, damit er die Leitung abdeckt, die in ihn hineinfuehrt;
 * Kaesten werden deshalb immer NACH den Leitungen gezeichnet. */
function card(x, y, w, h, text, o = {}) {
  const c = d.colors();
  return d.box(x, y, w, h, text, { size: 32, rounded: true, rx: 10, width: 3, fill: c.bg, ...o });
}

// gruener Haken als Zeichen, nicht als Buchstabe
function tick(x, y, col) {
  const c = d.colors();
  return `<path d="M${x - 16},${y} l12,14 l24,-30" fill="none" stroke="${col || c.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/* ---- ein Baum: oben das Problem, darunter die Teile ------------------------ */
function tree(root, leaves, opts = {}) {
  const c = d.colors();
  const show = opts.show === undefined ? true : opts.show;
  const wires = [], boxes = [], labels = [];
  const rootW = opts.rootW || 700, rootH = 110, rootX = (W - rootW) / 2, rootY = 10;
  boxes.push(card(rootX, rootY, rootW, rootH, root, { border: c.white, color: c.white, size: opts.rootSize || 32 }));

  const n = leaves.length, boxW = opts.boxW || 260, gap = (W - 80 - n * boxW) / (n - 1);
  const boxY = 300, boxH = 160, midY = 230;
  if (show) {
    const first = 40 + boxW / 2, last = 40 + (n - 1) * (boxW + gap) + boxW / 2;
    wires.push(d.line(W / 2, rootY + rootH, W / 2, midY, { color: c.dark, width: 2 }));
    wires.push(d.line(first, midY, last, midY, { color: c.dark, width: 2 }));
    leaves.forEach((leaf, i) => {
      const x = 40 + i * (boxW + gap), cx = x + boxW / 2;
      wires.push(d.line(cx, midY, cx, boxY, { color: c.dark, width: 2 }));
      boxes.push(card(x, boxY, boxW, boxH, leaf.text, { border: c.light, color: c.light }));
      if (leaf.note) {
        labels.push(d.label(cx, boxY + boxH + 60, leaf.note, { size: 32, color: c.yellow, anchor: "middle" }));
      }
    });
  }
  return d.svg(W, boxY + boxH + (opts.notes ? 90 : 20), ...d.layers(wires, boxes, labels));
}

// --- das problem des projekts, geschnitten -------------------------------------
window.drawCut = function (slide, step) {
  const leaves = [
    { text: "tell colours\napart", note: "challenge 1" },
    { text: "turn letters\ninto colours", note: "challenge 2" },
    { text: "find start\nand end", note: "challenge 3" },
    { text: "move a\nwhole file", note: "challenge 4" },
  ].map((l) => ({ text: l.text, note: step >= 2 ? l.note : "" }));
  const svg = tree("transfer a file with light", leaves, { show: step >= 1, boxW: 320, rootSize: 48, notes: true });
  if ($("fig-cut")) $("fig-cut").innerHTML = svg;
  return svg;
};

/* --- die treppe: die challenges als stufen ----------------------------------- */
function drawStairs() {
  const c = d.colors();
  const parts = [];
  const steps = [
    { t: "light\non/off", n: "challenge 0" },
    { t: "multiple\ncolours", n: "challenge 1" },
    { t: "a letter", n: "challenge 2" },
    { t: "a word", n: "challenge 3" },
    { t: "a whole\nfile", n: "challenge 4" },
  ];
  const boxW = 260, gap = 60, x0 = 100, base = 560;
  steps.forEach((s, i) => {
    const x = x0 + i * (boxW + gap), h = 130 + i * 80, y = base - h;
    const here = i === 0;
    parts.push(card(x, y, boxW, h, s.t, {
      border: here ? c.blue : c.light, color: here ? c.bg : c.light, fill: here ? c.blue : c.bg,
    }));
    parts.push(d.label(x + boxW / 2, base + 46, s.n, { size: 32, color: here ? c.blue : c.gray, anchor: "middle" }));
  });
  parts.push(d.label(x0 + boxW / 2, base - 130 - 30, "you are here", { size: 32, color: c.blue, anchor: "middle" }));
  const svg = d.svg(W, base + 80, ...parts);
  if ($("fig-stairs")) $("fig-stairs").innerHTML = svg;
  return svg;
}

// --- die karte des moduls ----------------------------------------------------
/* Oben die grosse Frage des Moduls, darunter die vier Fragen ueber Information. Alle vier stehen
 * gleichrangig: Das Projekt beruehrt jede von ihnen, wenn auch nicht gleich stark. */
function drawMap() {
  const c = d.colors();
  const parts = [];
  const qy = 70;
  parts.push(d.label(W / 2, qy, "how do computers solve\ncomplex problems?",
    { size: 48, color: c.white, anchor: "middle", lineHeight: 1.25 }));

  const cols = [
    { q: "how do computers\nrepresent information?", ex: "colours into symbols,\nletters into bits" },
    { q: "how do computers\nstore information?", ex: "a file is bytes;\nwhat holds them?" },
    { q: "how do computers\ntransfer information?", ex: "signal and noise,\ntiming, protocols" },
    { q: "how do computers\nprocess information?", ex: "checksums, filters,\nencryption" },
  ];
  const boxW = 370, gap = (W - 80 - 4 * boxW) / 3, boxY = 350, boxH = 160;
  const midY = 280;
  const first = 40 + boxW / 2, last = 40 + 3 * (boxW + gap) + boxW / 2;
  parts.push(d.line(W / 2, qy + 110, W / 2, midY, { color: c.dark, width: 2 }));
  parts.push(d.line(first, midY, last, midY, { color: c.dark, width: 2 }));
  cols.forEach((col, i) => {
    const x = 40 + i * (boxW + gap), cx = x + boxW / 2;
    parts.push(d.line(cx, midY, cx, boxY, { color: c.dark, width: 2 }));
  });
  cols.forEach((col, i) => {
    const x = 40 + i * (boxW + gap), cx = x + boxW / 2;
    parts.push(card(x, boxY, boxW, boxH, col.q, { border: c.light, color: c.light, lineHeight: 1.25 }));
    parts.push(d.label(cx, boxY + boxH + 56, col.ex, { size: 32, color: c.gray, anchor: "middle", lineHeight: 1.25 }));
  });
  const svg = d.svg(W, boxY + boxH + 100, ...parts);
  if ($("fig-map")) $("fig-map").innerHTML = svg;
  return svg;
}

/* --- fehlersuche: in der mitte der projektkette testen ----------------------- */
window.drawDebug = function (slide, step) {
  const c = d.colors();
  const items = ["sender", "led", "air", "sensor", "receiver"];
  const n = items.length, boxW = 250, gap = 60, total = n * boxW + (n - 1) * gap;
  const x0 = (W - total) / 2, y = 130, testAfter = 2, dim = step >= 1;
  const wires = [], boxes = [], labels = [];
  items.forEach((t, i) => {
    const x = x0 + i * (boxW + gap);
    const out = dim && i < testAfter;          // ausgeschlossene Haelfte
    if (i < n - 1) {
      wires.push(d.line(x + boxW, y + 45, x + boxW + gap, y + 45, { color: out ? c.dark : c.light, width: 2 }));
    }
    boxes.push(card(x, y, boxW, 90, t, { border: out ? c.dark : c.light, color: out ? c.dark : c.light }));
  });
  if (step >= 1) {
    // der Test sitzt in der Mitte der Kette, sein Pfeil endet ueber den Kaesten
    const tx = x0 + testAfter * (boxW + gap) - gap / 2;
    wires.push(d.arrow(tx, y - 70, tx, y - 6, { color: c.red, width: 3 }));
    labels.push(d.label(tx, y - 84, "test here", { size: 32, color: c.red, anchor: "middle" }));
  }
  const svg = d.svg(W, y + 130, ...d.layers(wires, boxes, labels));
  if ($("fig-debug")) $("fig-debug").innerHTML = svg;
  return svg;
};

/* --- das team: eine person je ende der strecke ------------------------------
 * Wie die Vorspeise-und-Nachtisch-Zeichnung im allgemeinen Deck, nur die
 * gelungene Haelfte: zwei Kaesten mit gemeinsamer Kante, die Kante gruen
 * gestrichelt, darunter, was ueber die Grenze geht.
 * Breite 340: laengste Zeile "receiver", 8 x 32 x 0,6 = 154 + 40 Rand. */
function drawTeam() {
  const c = d.colors();
  const parts = [];
  const boxW = 340, boxH = 210, y = 40, lx = (W - 2 * boxW) / 2;
  parts.push(card(lx, y, boxW, boxH, "you:\nsender", { border: c.light, color: c.light }));
  parts.push(card(lx + boxW, y, boxW, boxH, "me:\nreceiver", { border: c.light, color: c.light }));
  parts.push(d.line(lx + boxW, y, lx + boxW, y + boxH, { color: c.green, width: 3, dashed: true }));
  parts.push(tick(lx + boxW, y + boxH + 80));
  parts.push(d.label(lx + boxW, y + boxH + 150, "what crosses the border is written down", { size: 32, color: c.gray, anchor: "middle" }));
  const svg = d.svg(W, y + boxH + 190, ...parts);
  if ($("fig-team")) $("fig-team").innerHTML = svg;
  return svg;
}

/* --- zwei kaesten im vergleich, der rechte mit dem test ---------------------- */
function twoBoxes(left, right, step, opts = {}) {
  const c = d.colors();
  const parts = [];
  const boxW = 700, boxH = 250, y = 70, gap = 120;
  const x0 = (W - 2 * boxW - gap) / 2, x1 = x0 + boxW + gap;
  const won = step >= 1;
  parts.push(d.label(x0 + boxW / 2, y - 40, opts.leftHead || "", { size: 32, color: c.gray, anchor: "middle" }));
  parts.push(d.label(x1 + boxW / 2, y - 40, opts.rightHead || "", { size: 32, color: c.gray, anchor: "middle" }));
  const size = opts.size || 48;
  // Code steht linksbuendig an einer gemeinsamen Kante, der Block als Ganzes
  // mittig im Kasten (stagekit-Regel); ein Satz in normaler Schrift bleibt zentriert.
  const box = (x, text, border, color) => {
    if (!opts.mono) return card(x, y, boxW, boxH, text, { border, color, size, lineHeight: 1.3 });
    const longest = Math.max(...text.split("\n").map((l) => l.length));
    const left = x + (boxW - longest * size * 0.6) / 2;
    return card(x, y, boxW, boxH, "", { border }) +
      d.label(left, 0, text, { size, color, mono: true, lineHeight: 1.3, centerY: y + boxH / 2 });
  };
  parts.push(box(x0, left, won ? c.dark : c.light, won ? c.dark : c.light));
  parts.push(box(x1, right, won ? c.green : c.light, won ? c.white : c.light));
  if (won) parts.push(tick(x1 + boxW / 2, y + boxH + 70));
  return d.svg(W, y + boxH + 110, ...parts);
}
window.drawProject = function (slide, step) {
  const svg = twoBoxes("the receiver works.", "red or blue?\nright 50 times in a row.", step);
  if ($("fig-project")) $("fig-project").innerHTML = svg;
  return svg;
};
window.drawMachine = function (slide, step) {
  const svg = twoBoxes("build me the\nfile transfer.",
    "read the sensor ten times\nand return the average.\ntest: covered, it stays under 10.\nred led on, it goes over 100.", step,
    { leftHead: "one big wish", rightHead: "one small piece, with its test", size: 32, mono: true });
  if ($("fig-machine")) $("fig-machine").innerHTML = svg;
  return svg;
};

// --- start -------------------------------------------------------------------
if ($("fig-map")) {
  drawStairs(); drawMap(); drawTeam();
}
window.deckLifiCut = { cut: window.drawCut, stairs: drawStairs, map: drawMap, debug: window.drawDebug,
                       team: drawTeam, project: window.drawProject, machine: window.drawMachine };
