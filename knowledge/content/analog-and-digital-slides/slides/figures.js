"use strict";

/* The figures of the article "analog and digital", rendered by stagekit
 * tools/figures.py in the light palette. They are the same drawing functions
 * as on the slides (window.deckAnalog in deck.js), each in the state its
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
  "between": () => rand(window.deckAnalog.between()),
  "three-zones": () => rand(window.deckAnalog.middle(), -30),
  "light": () => rand(window.deckAnalog.light()),
  "regions": () => rand(window.deckAnalog.regions()),
  "copies": () => rand(window.deckAnalog.copies()),
  "two-cuts": () => rand(window.deckAnalog.soundCuts()),
};
