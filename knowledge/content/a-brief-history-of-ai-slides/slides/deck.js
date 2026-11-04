/* Zeichnungen des Decks "A Brief History of AI".
 *
 * Erlaubte Schriftgroessen: 20, 32, 48, 80. Keine anderen Werte.
 * Leitungen zuerst, dann Kaesten, dann Beschriftungen (d.layers).
 * Folien mit Aufbau zeichnen immer die volle Geometrie, nur die Farben
 * wechseln; so wandert zwischen zwei Schritten nichts.
 *
 * Bis zum 2026-11-04 lagen hier sieben Zeichnungen, die das Deck seit dem
 * 2026-09-23 nicht mehr zeigte (Schleife, chatbot vs. agent und andere); sie
 * stehen im Deck "AI agents". Geblieben ist der Ablauf des Experiments, den
 * auch die Lektion zeigt (slides/figures.js, scripts/deck-figures.mjs).
 * Mit window.deckLang = "de" sind die Beschriftungen deutsch.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();
const de = () => window.deckLang === "de";

/* ------------------------------------------------------------------ */
/* Vom Foto zur Webseite: zwei Eingaben, vier Schritte des Agenten     */
/* ------------------------------------------------------------------ */
/* step 0: nur die Eingaben; step 1-4: der jeweilige Schritt kommt dazu und
 * ist gelb (aktuell); step 5: alles da, nichts mehr aktuell (fuer die Lektion).
 * Waagerecht, 1680 x 500: Die Flaeche einer Folie mit Punchline ist 1680 x 660,
 * so bleibt die Zeichnung in Originalgroesse und jede Schrift auf ihrer Stufe. */
function figExperiment(step = 5) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const t = (en, deu) => (de() ? deu : en);

  // vier Schritte nebeneinander: 4 * 388 + 3 * 40 = 1672, ab x 2 (halber Strich)
  const bw = 388, gap = 40, by = 190, bh = 160, x0 = 2;
  const xs = [0, 1, 2, 3].map((i) => x0 + i * (bw + gap)); // 2, 430, 858, 1286
  // Kaesten in 48, je Zeile hoechstens 12 Zeichen ("Wissensbasis"):
  // 12 * 48 * 0.6 = 346 + 2 * 20 Rand = 386 <= 388
  // Notizen in 32 unter den Kaesten, je Zeile hoechstens 20 Zeichen:
  // 20 * 32 * 0.6 = 384 <= 388
  const steps = [
    [t("1 · research", "1 · recherchieren"), t("knowledge\nbase", "Wissensbasis"), t("a file per milestone\nwith its source", "je Meilenstein eine\nDatei mit Quelle")],
    [t("2 · build", "2 · bauen"), t("timeline\napp", "Zeitleiste"), t("every entry links\nto its source", "jeder Eintrag mit\nLink zur Quelle")],
    [t("3 · quiz", "3 · Quiz"), t("quiz", "Quiz"), t("50 questions from\nthe knowledge base", "50 Fragen aus\nder Wissensbasis")],
    [t("4 · publish", "4 · veröffentlichen"), t("public\nwebsite", "Webseite"), t("on GitHub Pages,\nwithout the sources", "auf GitHub Pages,\nohne die Quellen")],
  ];

  // Eingaben ueber dem ersten Schritt, in 32 und zweizeilig:
  // 13 * 32 * 0.6 = 250 + 2 * 20 = 290 <= 300 ("milestones.md")
  const iw = 300, ih = 110, iy = 2;
  const inputs = [
    [2, t("photo of\nthe pinboard", "Foto der\nPinnwand"), false],
    [342, "milestones.md", true],
  ];
  const join = 146, into = xs[0] + bw / 2; // 196, zwischen den Mitten 152 und 492
  inputs.forEach(([x, text, mono]) => {
    wires.push(d.line(x + iw / 2, iy + ih, x + iw / 2, join, { color: c.gray, width: 3 }));
    boxes.push(d.box(x, iy, iw, ih, text, { border: c.light, color: c.white, size: 32, mono, keepCase: mono }));
  });
  wires.push(d.line(2 + iw / 2, join, 342 + iw / 2, join, { color: c.gray, width: 3 }));

  steps.forEach(([verb, thing, note], i) => {
    const n = i + 1, x = xs[i];
    const shown = step >= n, current = step === n;
    const line = shown ? c.gray : c.dark;
    if (i === 0) wires.push(d.arrow(into, join, into, by - 4, { color: line, width: 3 }));
    else wires.push(d.arrow(xs[i - 1] + bw, by + bh / 2, x - 4, by + bh / 2, { color: line, width: 3 }));
    boxes.push(d.box(x, by, bw, bh, thing, {
      border: current ? c.yellow : shown ? c.white : c.dark,
      color: shown ? c.white : c.dark, size: 48,
    }));
    labels.push(d.label(x, 0, verb, { size: 32, color: shown ? c.gray : c.dark, centerY: 400 }));
    // keepCase, damit GitHub Pages gross bleibt; der Rest ist schon klein geschrieben
    labels.push(d.label(x, 0, note, { size: 32, color: shown ? c.light : c.dark, centerY: 466, keepCase: true }));
  });

  // Notizen: zwei Zeilen um 466, die untere endet bei rund 466 + 42 / 2 + 16 = 503
  return d.svg(1680, 510, ...d.layers(wires, boxes, labels));
}

window.deckFigures = { experiment: figExperiment };

window.drawExperiment = (slide, step) => {
  if ($("fig-experiment")) $("fig-experiment").innerHTML = figExperiment(step || 0);
};

if ($("fig-experiment")) $("fig-experiment").innerHTML = figExperiment(0);
