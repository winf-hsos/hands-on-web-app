"use strict";

/* The figures of the lesson "code systems", rendered by stagekit
 * tools/figures.py in the light palette (scripts/deck-figures.mjs). They are
 * the same drawing functions as on the slides (window.deckCodes in deck.js),
 * each in the state its build-up ends in. The German versions come from a copy
 * of this file that sets `window.deckLang = "de"` first.
 *
 * On a slide a drawing may have air around it, on the page it may not: there
 * the figure is scaled to the width of the text, and every empty margin makes
 * the rest smaller. `crop` therefore cuts the canvas down to the area really
 * used and moves the drawing into it, without changing the drawing itself. */

function crop(svg, x, y, w, h) {
  return svg
    .replace(/^<svg[^>]*viewBox="[^"]*"([^>]*)>/, `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"$1><g transform="translate(${-x} ${-y})">`)
    .replace(/<\/svg>$/, "</g></svg>");
}

const k = window.deckCodes;
window.figures = {
  "code-as-agreement": () => crop(k.mapping(), 150, 95, 1420, 400),
  "ascii-letters-are-numbers": () => crop(k.ascii(null, 1), 380, 30, 935, 590),
  "too-small-a-table": () => crop(k.utf8(null, 1), 300, 30, 1090, 520),
  "two-tables-one-message": () => crop(k.twoTables(null, 2), 40, 130, 1600, 460),
  "positions-per-letter": () => crop(k.positions(null, 2), 40, 10, 1600, 570),
  "codebook-64-slots": () => crop(k.codebook(), 305, 20, 1070, 760),
  "table-both-directions": () => crop(k.bothWays(null, 2), 40, 60, 1440, 500),
  "not-in-the-table": () => crop(k.notInTable(), 40, 20, 1600, 580),
  "prefix-ambiguity": () => crop(k.ambiguous(null, 1), 40, 20, 1600, 780),
  "three-ways-out": () => crop(k.threeWays(), 40, 100, 1600, 440),
  "fixed-versus-variable": () => crop(k.lengthCost(), 40, 40, 1600, 440),
  "three-readings": () => crop(k.threeReadings(null, 1), 60, 50, 1620, 490),
  "rgb-mixing": () => crop(k.pixel(), 60, 40, 1560, 500),
  "who-says-which-reading": () => crop(k.whoSays(), 40, 120, 1600, 340),
  "sixty-four-everywhere": () => crop(k.sixtyFour(), 40, 30, 1600, 510),
};
