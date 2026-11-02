"use strict";

/* Die Abbildungen des Artikels „Probleme zerlegen“, gerendert von stagekit
 * tools/figures.py in der hellen Palette. Dieselben Zeichenfunktionen wie auf
 * den Folien, jeweils im letzten Schritt ihres Aufbaus. Die deutschen
 * Fassungen entstehen aus einer Kopie dieser Datei, die vorn
 * `window.deckLang = "de"` setzt (scripts/deck-figures.mjs).
 *
 * Abbildungen erscheinen auf der Seite immer in 16:9 (Nicolas, 2026-11-02).
 * `sechzehnNeuntel` behaelt deshalb die volle Breite der Zeichnung, setzt die
 * Hoehe auf 9/16 davon und rueckt die Zeichnung mittig hinein. Die viewBox
 * beginnt dabei bei 0, wie es die Randpruefung von figures.py annimmt; sie
 * meldet den Leerraum ueber und unter der Zeichnung, der hier gewollt ist. */

function sechzehnNeuntel(svg) {
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const hoehe = Math.round((w * 9) / 16);
  const y = Math.round((hoehe - h) / 2);
  return svg
    .replace(/^<svg[^>]*viewBox="[^"]*"([^>]*)>/, `<svg width="${w}" height="${hoehe}" viewBox="0 0 ${w} ${hoehe}"$1><g transform="translate(0 ${y})">`)
    .replace(/<\/svg>$/, "</g></svg>");
}

window.figures = {
  "party": () => sechzehnNeuntel(window.deck01.party(null, 1)),
  "halving-search": () => sechzehnNeuntel(window.deck01.halve(null, 7)),
  "debug-chain": () => sechzehnNeuntel(window.deck01.debug(null, 2)),
  "smaller-first": () => sechzehnNeuntel(window.deck01.stairs()),
  "testable-exam": () => sechzehnNeuntel(window.deck01.exam(null, 1)),
  "testable-program": () => sechzehnNeuntel(window.deck01.project(null, 1)),
  "clear-borders": () => sechzehnNeuntel(window.deck01.agree()),
  "small-pieces": () => sechzehnNeuntel(window.deck01.machine(null, 1)),
};
