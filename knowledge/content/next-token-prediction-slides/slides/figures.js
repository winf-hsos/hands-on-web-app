"use strict";

/* The figures of the lesson "next-token prediction", rendered by stagekit
 * tools/figures.py in the light palette (scripts/deck-figures.mjs). They are
 * the same drawing functions as on the slides (deck.js), each in the state its
 * build-up ends in, except the loop, which stops before the question to the
 * room, since the lesson answers it in the text.
 *
 * `rand` adds a narrow margin above and below, since some labels reach a few
 * pixels beyond the slide's viewBox; `bottom` trims the margin below where the
 * slide leaves room under the drawing, `top` the margin above. */

function rand(svg, bottom = 16, top = 16) {
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const height = h + top + bottom;
  return svg
    .replace(/^<svg[^>]*viewBox="[^"]*"([^>]*)>/, `<svg width="${w}" height="${height}" viewBox="0 0 ${w} ${height}"$1><g transform="translate(0 ${top})">`)
    .replace(/<\/svg>$/, "</g></svg>");
}

window.figures = {
  "tokens": () => rand(figTokens(1), -80),
  "rare-words": () => rand(figSplit(1), -44),
  "probabilities": () => rand(figProbs(1), 32),
  "loop": () => rand(figLoop(3), -140),
  "temperature": () => rand(figTemp(2), -69),
  "top-k-top-p": () => rand(figCut(2), -41),
  "context": () => rand(figStack(4), -42),
  "tractor-or-gate": () => rand(figIt(1), -32, -40),
  "attention-grid": () => rand(figMatrix(5), -32),
};
