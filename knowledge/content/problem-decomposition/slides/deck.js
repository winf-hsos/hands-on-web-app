/* Zeichnungen fuer das allgemeine Deck „cutting problems" (stagekit-Fassung).
 * Seit 2026-10-22 ohne LiFi-Bezug; die Projektfolien stehen im Deck
 * „cutting the lifi project".
 * Regeln: Zeichenflaeche 1680 x 700 (mit Punchline 1680 x 620), nur die vier
 * Groessen des Themes (20, 32, 48, 80), Beschriftungen in 32, Werte in 48,
 * Punchlines als <div class="punch"> auf der Folie, nie in der Zeichnung.
 * Jede Funktion gibt ihr SVG zurueck und schreibt es nur, wenn es die Folie
 * gibt: so kann tools/figures.py dieselben Zeichnungen fuer die Website
 * rendern (siehe figures.js). Die Folien sind englisch; `window.deckLang = "de"`
 * (gesetzt von scripts/deck-figures.mjs beim Rendern) liefert die deutschen
 * Beschriftungen fuer den Artikel. */
"use strict";

const T = (en, de) => (window.deckLang === "de" ? de : en);

const d = window.draw;
const $ = (id) => document.getElementById(id);
const W = 1680;                              // Zeichenbreite; die Hoehe schneidet jede
// Zeichnung auf ihren Inhalt zu, damit sie in der Flaeche mittig steht statt oben zu kleben.

/* Ein Kasten mit zentriertem Text, ueberall gleich. Die Fuellung ist der
 * Folienhintergrund, nicht "none": So deckt der Kasten die Leitung ab, die in
 * ihn hineinfuehrt, und keine Linie liegt auf seinem Rand. Kaesten werden
 * deshalb immer NACH den Leitungen gezeichnet. */
function card(x, y, w, h, text, o = {}) {
  const c = d.colors();
  return d.box(x, y, w, h, text, { size: 32, rounded: true, rx: 10, width: 3, fill: c.bg, ...o });
}

// gruener Haken und rotes Kreuz als Zeichen, nicht als Buchstabe
function tick(x, y, col) {
  const c = d.colors();
  return `<path d="M${x - 16},${y} l12,14 l24,-30" fill="none" stroke="${col || c.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function cross(x, y) {
  const c = d.colors();
  return `<path d="M${x - 14},${y - 14} l28,28 M${x + 14},${y - 14} l-28,28" fill="none" stroke="${c.red}" stroke-width="5" stroke-linecap="round"/>`;
}

/* ---- ein Baum: oben das Problem, darunter die Teile ------------------------
 * Wird zweimal gebraucht (Party, Zerlegung), deshalb eine Funktion. */
function tree(root, leaves, opts = {}) {
  const c = d.colors();
  const show = opts.show === undefined ? true : opts.show;
  // getrennte Ebenen: erst alle Leitungen, dann alle Kaesten, dann die Labels.
  // Sonst liegt ein Strich auf dem Rand des Kastens, in den er hineinfuehrt.
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

// --- die party: das kennt ihr schon -----------------------------------------
window.drawParty = function (slide, step) {
  const leaves = T(["drinks", "food", "music", "guests", "cleanup"], ["Getränke", "Essen", "Musik", "Gäste", "Aufräumen"]).map((t) => ({ text: t }));
  const svg = tree(T("party, saturday, 30 guests", "Party, Samstag, 30 Gäste"), leaves, { show: step >= 1, rootSize: 48 });
  if ($("fig-party")) $("fig-party").innerHTML = svg;
  return svg;
};

/* --- halbieren: der suchbereich schrumpft mit jeder frage --------------------
 * Eine Zeile je Frage; alle Zeilen stehen von Anfang an, nur die Balken
 * kommen dazu. Die gesuchte 73 markiert eine rote Senkrechte. */
// eine Funktion, damit die Beschriftung die Sprache beim Zeichnen nimmt
const halveRows = () => [
  { lo: 1, hi: 100, q: T("1 to 100", "1 bis 100") },
  { lo: 51, hi: 100, q: T("bigger than 50?  yes", "größer als 50?  ja") },
  { lo: 51, hi: 75, q: T("bigger than 75?  no", "größer als 75?  nein") },
  { lo: 64, hi: 75, q: T("bigger than 63?  yes", "größer als 63?  ja") },
  { lo: 70, hi: 75, q: T("bigger than 69?  yes", "größer als 69?  ja") },
  { lo: 73, hi: 75, q: T("bigger than 72?  yes", "größer als 72?  ja") },
  { lo: 73, hi: 74, q: T("bigger than 74?  no", "größer als 74?  nein") },
  { lo: 73, hi: 73, q: T("is it 73?  yes", "ist es 73?  ja") },
];
window.drawHalve = function (slide, step) {
  const c = d.colors();
  const parts = [];
  const x0 = 200, x1 = 1180, target = 73;
  const at = (v) => x0 + ((v - 1) / 100) * (x1 - x0);
  const rowH = 66, y0 = 40, barH = 30;
  const HALVE = halveRows();
  HALVE.forEach((row, i) => {
    const y = y0 + i * rowH;
    if (i > step) return;                       // Zeile erscheint mit ihrem Schritt
    const count = row.hi - row.lo + 1;
    parts.push(d.label(x0 - 30, y + barH - 6, String(count), { size: 32, color: i === step ? c.white : c.gray, anchor: "end", mono: true }));
    parts.push(`<rect x="${at(row.lo)}" y="${y}" width="${Math.max(3, at(row.hi + 1) - at(row.lo))}" height="${barH}" rx="4" fill="${i === step ? c.blue : c.dark}"/>`);
    parts.push(d.label(x1 + 40, y + barH - 6, row.q, { size: 32, color: i === step ? c.white : c.gray, mono: true }));
  });
  // die gesuchte Zahl: eine duenne rote Senkrechte durch alle Zeilen
  const tx = at(target) + (at(target + 1) - at(target)) / 2;
  parts.push(d.line(tx, y0 - 14, tx, y0 + HALVE.length * rowH - 30, { color: c.red, width: 2 }));
  parts.push(d.label(tx, y0 - 24, "73", { size: 20, color: c.red, anchor: "middle", mono: true }));
  const svg = d.svg(W, y0 + HALVE.length * rowH - 10, ...parts);
  if ($("fig-halve")) $("fig-halve").innerHTML = svg;
  if ($("halve-caption")) {
    $("halve-caption").textContent = step >= 7 ? "seven questions are enough, whatever the number." : "";
  }
  return svg;
};

/* --- fehlersuche: in der mitte der kette testen ------------------------------ */
function chain(parts, y, title, items, testAfter, dim, mark = T("test here", "hier testen")) {
  const c = d.colors();
  const n = items.length, boxW = 250, gap = 60, total = n * boxW + (n - 1) * gap;
  const x0 = (W - total) / 2;
  const wires = [], boxes = [], labels = [];
  labels.push(d.label(x0, y - 40, title, { size: 32, color: c.gray }));
  items.forEach((t, i) => {
    const x = x0 + i * (boxW + gap);
    const out = dim && i < testAfter;          // ausgeschlossene Haelfte
    if (i < n - 1) {
      wires.push(d.line(x + boxW, y + 45, x + boxW + gap, y + 45, { color: out ? c.dark : c.light, width: 2 }));
    }
    boxes.push(card(x, y, boxW, 90, t, { border: out ? c.dark : c.light, color: out ? c.dark : c.light }));
  });
  if (testAfter !== null) {
    // der Test sitzt in der Mitte der Kette, sein Pfeil endet ueber den Kaesten
    const tx = x0 + testAfter * (boxW + gap) - gap / 2;
    wires.push(d.arrow(tx, y - 70, tx, y - 6, { color: c.red, width: 3 }));
    labels.push(d.label(tx, y - 84, mark, { size: 32, color: c.red, anchor: "middle" }));
  }
  parts.push(...d.layers(wires, boxes, labels));
}
window.drawDebug = function (slide, step) {
  const parts = [];
  chain(parts, 110, T("wifi dead at home", "WLAN zu Hause tot"), T(["laptop", "wifi", "router", "provider", "internet"], ["Laptop", "WLAN", "Router", "Anbieter", "Internet"]),
        step >= 1 ? 2 : null, step >= 1);
  if (step >= 2) {
    // Kastenbreite 250: laengstes Wort "read file", 9 x 32 x 0,6 = 173 + 40 Rand
    chain(parts, 400, T("wrong total in a program", "falsche Summe in einem Programm"),
          T(["read file", "parse", "add up", "round", "print"], ["Datei lesen", "zerlegen", "addieren", "runden", "ausgeben"]),
          2, true, T("print it here", "hier ausgeben"));
  }
  const svg = d.svg(W, 520, ...parts);
  if ($("fig-debug")) $("fig-debug").innerHTML = svg;
  return svg;
};

/* --- die treppe: erst die kleinere fassung ---------------------------------- */
function drawStairs() {
  const c = d.colors();
  const parts = [];
  // Kastenbreite 260: laengste Zeile "send it to", 10 x 32 x 0,6 = 192 + 40 Rand
  const steps = [
    { t: T("print a\nmessage", "Nachricht\nausgeben") },
    { t: T("send it to\nyourself", "an dich\nselbst\nschicken") },
    { t: T("send it to\nanother\ncomputer", "an einen\nanderen\nRechner") },
    { t: T("two people\nchatting", "zwei\nMenschen\nchatten") },
    { t: T("a group\nchat", "ein\nGruppenchat") },
  ];
  const boxW = 260, gap = 60, x0 = 100, base = 560;
  steps.forEach((s, i) => {
    const x = x0 + i * (boxW + gap), h = 130 + i * 80, y = base - h;
    const here = i === 0;
    parts.push(card(x, y, boxW, h, s.t, {
      border: here ? c.blue : c.light, color: here ? c.bg : c.light, fill: here ? c.blue : c.bg,
    }));
  });
  parts.push(d.label(x0 + boxW / 2, base - 130 - 30, T("you are here", "hier stehst du"), { size: 32, color: c.blue, anchor: "middle" }));
  const svg = d.svg(W, base + 20, ...parts);
  if ($("fig-stairs")) $("fig-stairs").innerHTML = svg;
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
  // der Haken steht unter dem Kasten, wie auf der Absprachen-Folie, und nie im Text
  if (won) parts.push(tick(x1 + boxW / 2, y + boxH + 70));
  return d.svg(W, y + boxH + 110, ...parts);
}
window.drawExam = function (slide, step) {
  // rechts: laengste Zeile 18 Zeichen x 48 x 0,6 = 518 + 40 Rand, passt in 700
  const svg = twoBoxes(T("i need to learn maths.", "Ich muss Mathe lernen."),
    T("i can solve an old\nexam in 90 minutes.", "Ich löse eine alte\nKlausur in 90 Minuten."), step);
  if ($("fig-exam")) $("fig-exam").innerHTML = svg;
  return svg;
};
window.drawProject = function (slide, step) {
  // rechts drei Zeilen: laengste 19 Zeichen x 48 x 0,6 = 547 + 40; Hoehe 3 x 62 = 187 von 250
  const svg = twoBoxes(T("the app works.", "Die App funktioniert."),
    T("a wrong password\nshows an error,\n10 times out of 10.", "Ein falsches Passwort\nzeigt einen Fehler,\nzehnmal von zehn."), step);
  if ($("fig-project")) $("fig-project").innerHTML = svg;
  return svg;
};
window.drawMachine = function (slide, step) {
  // rechts: laengste Zeile 31 Zeichen x 32 x 0,6 = 595 + 40, passt in 700
  const svg = twoBoxes(T("build me a\nchat app.", "Bau mir eine\nChat-App."),
    T("write a function that puts\nthe time in front of a message.\ntest: \"hi\" at 9:05\ngives \"09:05 hi\".",
      "Schreib eine Funktion, die\nder Nachricht die Uhrzeit\nvoranstellt. Test: \"hi\"\num 9:05 ergibt \"09:05 hi\"."), step,
    { leftHead: T("one big wish", "Ein großer Wunsch"), rightHead: T("one small piece, with its test", "Ein kleines Stück mit seinem Test"), size: 32, mono: true });
  if ($("fig-machine")) $("fig-machine").innerHTML = svg;
  return svg;
};

/* --- absprachen: klare grenze gegen ueberlappung -----------------------------
 * Links zwei Kaesten, die sich eine Kante teilen; rechts dieselbe Arbeit, aber
 * die beiden Zustaendigkeiten ueberlappen. Die Ueberlappung ist die Aussage,
 * deshalb ist sie rot hinterlegt und traegt die Frage, die dann offen bleibt. */
function drawAgree() {
  const c = d.colors();
  const parts = [];
  const boxW = 340, boxH = 210, y = 40;

  // links: eine gemeinsame Kante, jeder weiss, was seins ist
  const lx = 110;
  parts.push(card(lx, y, boxW, boxH, T("you:\nstarters", "du:\nVorspeise"), { border: c.light, color: c.light }));
  parts.push(card(lx + boxW, y, boxW, boxH, T("me:\ndessert", "ich:\nNachtisch"), { border: c.light, color: c.light }));
  parts.push(d.line(lx + boxW, y, lx + boxW, y + boxH, { color: c.green, width: 3, dashed: true }));
  parts.push(tick(lx + boxW, y + boxH + 80));
  parts.push(d.label(lx + boxW, y + boxH + 150, T("works: the border is clear", "klappt: die Grenze ist klar"), { size: 32, color: c.gray, anchor: "middle" }));

  // rechts: zwei Kaesten, die sich ueberlappen; der Ueberschnitt ist die Aussage
  const rx = 940, rw = 380, ov = 180;
  const bx = rx + rw - ov;                       // linke Kante des zweiten Kastens
  parts.push(card(rx, y, rw, boxH, "", { border: c.light }));
  parts.push(card(bx, y, rw, boxH, "", { border: c.light }));
  // der Ueberschnitt kommt ueber die Kaesten: ihre Fuellung wuerde ihn sonst zudecken
  parts.push(`<rect x="${bx}" y="${y}" width="${ov}" height="${boxH}" fill="${c.red}" opacity="0.16"/>`);
  parts.push(d.line(bx, y, bx, y + boxH, { color: c.red, width: 3 }));
  parts.push(d.line(bx + ov, y, bx + ov, y + boxH, { color: c.red, width: 3 }));
  parts.push(d.label(rx + (rw - ov) / 2, y + boxH / 2 - 6, T("you:\nthe food", "du:\ndas Essen"), { size: 32, color: c.light, anchor: "middle", lineHeight: 1.3 }));
  parts.push(d.label(bx + ov + (rw - ov) / 2, y + boxH / 2 - 6, T("me:\nthe food", "ich:\ndas Essen"), { size: 32, color: c.light, anchor: "middle", lineHeight: 1.3 }));
  parts.push(d.label(bx + ov / 2, y + boxH / 2 + 12, "?", { size: 48, color: c.red, anchor: "middle" }));
  const rc = bx + ov / 2;
  parts.push(cross(rc, y + boxH + 80));
  parts.push(d.label(rc, y + boxH + 150, T("chaos: who buys the bread?", "Chaos: Wer kauft das Brot?"), { size: 32, color: c.gray, anchor: "middle" }));

  const svg = d.svg(W, y + boxH + 190, ...parts);
  if ($("fig-agree")) $("fig-agree").innerHTML = svg;
  return svg;
}

// --- start -------------------------------------------------------------------
// Auf der Folie zeichnen; ohne Folie (figures.js fuer die Website) nur bereitstellen.
if ($("fig-stairs")) {
  drawStairs(); drawAgree();
}
window.deck01 = { party: window.drawParty, halve: window.drawHalve,
                  debug: window.drawDebug, stairs: drawStairs, agree: drawAgree,
                  exam: window.drawExam, project: window.drawProject, machine: window.drawMachine };
