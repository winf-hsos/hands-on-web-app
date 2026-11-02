"use strict";

/* The figures of the article "solving problems with computers", rendered by
 * stagekit tools/figures.py in the light palette. They are the same drawing
 * functions as on the slides (window.deck02 in deck.js), each in the state its
 * build-up ends in. The German versions come from a copy of this file that sets
 * `window.deckLang = "de"` first (scripts/deck-figures.mjs).
 *
 * `rand` adds a narrow margin above and below, since some labels reach a few
 * pixels beyond the slide's viewBox; `bottom` trims the margin below where the
 * slide leaves room under the drawing. */

function rand(svg, bottom = 16, top = 16) {
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const height = h + top + bottom;
  return svg
    .replace(/^<svg[^>]*viewBox="[^"]*"([^>]*)>/, `<svg width="${w}" height="${height}" viewBox="0 0 ${w} ${height}"$1><g transform="translate(0 ${top})">`)
    .replace(/<\/svg>$/, "</g></svg>");
}

window.figures = {
  "add-test": () => rand(window.deck02.addTest(), -157),
  "receiver": () => rand(window.deck02.receiver(), -157, -134),
  "chain": () => rand(window.deck02.chain(), -162, -184),
  "levels": () => rand(window.deck02.levels(), -55),
  "relations": () => rand(window.deck02.relations(), -30),
  "two-questions": () => rand(window.deck02.twoQuestions(), -72),
  "agent": () => rand(window.deck02.agent(), -122, -104),
};
