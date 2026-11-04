"use strict";

/* Die Abbildungen des Artikels „Probleme zerlegen“, gerendert von stagekit
 * tools/figures.py in der hellen Palette. Dieselben Zeichenfunktionen wie auf
 * den Folien, jeweils im letzten Schritt ihres Aufbaus. Die deutschen
 * Fassungen entstehen aus einer Kopie dieser Datei, die vorn
 * `window.deckLang = "de"` setzt (scripts/deck-figures.mjs).
 *
 * Zeichnungen behalten ihre eigene Hoehe (Nicolas, 2026-11-02): Ein Rahmen in
 * 16:9 liess breite, flache Zeichnungen in viel Leerraum stehen. Nur Fotos
 * erscheinen in 16:9. `rand` gibt oben und unten einen schmalen Rand, weil
 * manche Beschriftung ein paar Pixel ueber die viewBox der Folie hinausragt;
 * die viewBox beginnt weiter bei 0, wie es die Randpruefung von figures.py
 * annimmt. Wo die Folie unter der Zeichnung Platz laesst, gleicht `unten`
 * den Rand an den oberen an. */

function rand(svg, unten = 16, abstand = 16) {
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const hoehe = h + abstand + unten;
  return svg
    .replace(/^<svg[^>]*viewBox="[^"]*"([^>]*)>/, `<svg width="${w}" height="${hoehe}" viewBox="0 0 ${w} ${hoehe}"$1><g transform="translate(0 ${abstand})">`)
    .replace(/<\/svg>$/, "</g></svg>");
}

window.figures = {
  "party": () => rand(window.deck01.party(null, 1)),
  "halving-search": () => rand(window.deck01.halve(null, 7)),
  "debug-chain": () => rand(window.deck01.debug(null, 2), -14),
  "smaller-first": () => rand(window.deck01.stairs()),
  "testable-exam": () => rand(window.deck01.exam(null, 1), -10),
  "testable-program": () => rand(window.deck01.project(null, 1), -10),
  "clear-borders": () => rand(window.deck01.agree(), -17),
  "small-pieces": () => rand(window.deck01.machine(null, 1), -10),
};
