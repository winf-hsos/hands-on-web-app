"use strict";

/* Die Abbildungen der Lektionen zu Zahlensystemen, gerendert von stagekit
 * tools/figures.py in der hellen Palette. Dieselben Zeichenfunktionen wie auf
 * den Folien, jeweils im Endzustand ihres Aufbaus. Die deutschen Fassungen
 * entstehen aus einer Kopie dieser Datei, die vorn `window.deckLang = "de"`
 * setzt; welche Abbildung in welche Lektion gehoert, steht in
 * scripts/why-ten-figures.mjs.
 *
 * Auf der Webseite wird eine Abbildung auf die Spaltenbreite skaliert, und
 * jeder leere Rand macht den Rest kleiner. `zuschnitt` setzt deshalb die
 * viewBox auf den tatsaechlich benutzten Bereich. */

function zuschnitt(svg, x, y, w, h) {
  return svg.replace(/^<svg[^>]*viewBox="[^"]*"/,
                     `<svg width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"`);
}

window.figures = {
  "place-value-ten": () => zuschnitt(window.deck10.place(null, 1), 460, 10, 760, 500),
  "place-value-eight": () => zuschnitt(window.deck10.eight(null, 1), 460, 10, 760, 500),
  "colours-as-digits": () => zuschnitt(window.deck10.ownBase(null, 2), 90, 20, 1200, 580),
  "counting-in-binary": () => zuschnitt(window.deck10.binaryCount(), 270, 30, 1230, 600),
  "why-two-states": () => zuschnitt(window.deck10.whyTwo(null, 1), 180, 50, 1320, 520),
  "byte-place-values": () => zuschnitt(window.deck10.byte(null, 1), 120, 20, 1420, 460),
  "hex-nibbles": () => zuschnitt(window.deck10.hex(null, 2), 140, 40, 1540, 560),
  "hex-dump": () => zuschnitt(window.deck10.dump(null, 1), 140, 30, 1440, 470),
  "unit-ladders": () => zuschnitt(window.deck10.ladders(), 90, 30, 1540, 590),
  "missing-gigabytes": () => zuschnitt(window.deck10.disk(null, 1), 110, 60, 1460, 390),
};
