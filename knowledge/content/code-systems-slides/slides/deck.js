// Drawings of "what the bits mean" (code systems), taken over from the LiFi
// deck code-systems.
//
// Every function returns its SVG and writes it into an element only if the
// element exists, so the file also runs without slides, as when stagekit's
// tools/figures.py renders the figures of the lesson code-systems
// (slides/figures.js, scripts/deck-figures.mjs). The slides are English;
// `window.deckLang = "de"` (set by deck-figures.mjs) gives the German labels
// for the article. Figures are redrawn per build-up step (data-on-show,
// data-on-step); a figure for the article is the state its build-up ends in.
//
// Where a colour alphabet is shown, its fields carry the four colours the LED
// really sends, from [colors.led] of the theme, and not a role: they stand for
// colours, not for meaning.
"use strict";

const T = (en, de) => (window.deckLang === "de" ? de : en);

const d = window.draw;
const $ = (id) => document.getElementById(id);
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; return svg; };
const led = () => [d.color("led-red"), d.color("led-green"), d.color("led-blue"), d.color("led-yellow")];

/* Real values from a photo of a parrot (256 by 256), read out when the deck
 * was built, so that the slide shows what it claims: PHOTO_BYTES are eight
 * consecutive bytes from pixel (192, 160), PHOTO_PIXEL is the colour of pixel
 * (156, 225). PHOTO_URI is the same photo as a JPEG of 220 points, inline so
 * that the figures rendered by figures.py, which loads only draw.js, deck.js
 * and figures.js, are complete. */
const PHOTO_BYTES = [0x4D, 0x00, 0x00, 0xB0, 0x24, 0x1E, 0xFF, 0x45];
const PHOTO_BYTE_AT = [0.7500, 0.6250];
const PHOTO_PIXEL = [236, 171, 3];
const PHOTO_PIXEL_AT = [0.6094, 0.8789];
const PHOTO_URI = "data:image/jpeg;base64,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";

const hex = (v) => v.toString(16).toUpperCase().padStart(2, "0");
const decimal = (v) => T(v.toFixed(1), v.toFixed(1).replace(".", ","));

/* Several lines in a box stand left-aligned on a common edge, so that equals
 * signs and values line up; the block as a whole sits in the middle. Returns
 * that left edge. */
function leftEdge(x, width, lines, size) {
  const widest = Math.max(...lines.map((z) => z.length)) * size * 0.6;
  return x + (width - widest) / 2;
}

/* The usual sign for a space: a baseline with two short upstrokes. Drawn, not
 * set, since the font may not have it. */
function spaceSign(cx, cy, col) {
  const w = 30, h = 13;
  return `<path d="M${cx - w / 2},${cy - h} L${cx - w / 2},${cy} L${cx + w / 2},${cy} L${cx + w / 2},${cy - h}" ` +
    `fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const grey = (v) => `rgb(${v},${v},${v})`;

/* The photo as a thumbnail with a red mark at the place it is about. The mark
 * gets a pale halo, since red alone disappears on the red feathers of the
 * bird, in both palettes. */
function thumbnail(x, y, size, frac) {
  const c = d.colors();
  const mx = x + frac[0] * size, my = y + frac[1] * size;
  const r = 14;
  const mark = (col, w) =>
    `<rect x="${mx - r}" y="${my - r}" width="${2 * r}" height="${2 * r}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
  return `<image x="${x}" y="${y}" width="${size}" height="${size}" href="${PHOTO_URI}" preserveAspectRatio="none"/>` +
    mark(c.white, 8) + mark(c.red, 3);
}

/* --- Part 1 --------------------------------------------------------------- */

/* One character, three agreements: the same A becomes three quite different
 * sequences. The colour names are code values and stay English. */
window.drawMapping = function () {
  const c = d.colors();
  const targets = [
    ["0100 0001", "ascii", T("ascii", "ASCII")],
    [".-", "morse", T("morse", "Morse")],
    ["red green green", "colour", T("a colour code", "ein Farbcode")],
  ];
  const parts = [];
  parts.push(d.box(180, 180, 180, 180, "A", { size: 80, mono: true, keepCase: true, border: c.white }));
  targets.forEach(([bits, , name], i) => {
    const y = 110 + i * 130, h = 110, mid = y + h / 2;
    parts.push(d.arrow(380, 270, 740, mid, { color: c.gray, width: 2 }));
    parts.push(d.box(760, y, 520, h, bits, { size: 48, mono: true, border: c.light }));
    parts.push(d.label(1320, 0, name, { size: 32, color: c.gray, centerY: mid }));
  });
  return put("fig-mapping", d.svg(1680, 520, ...parts));
};

/* ascii: character, number, and in the second step the bits below. */
window.drawAscii = function (_slide, step = 0) {
  const c = d.colors();
  const rows = [["A", 65], ["B", 66], ["C", 67], ["a", 97]];
  const parts = [
    d.label(500, 0, T("character", "Zeichen"), { size: 20, color: c.gray, anchor: "middle", centerY: 55 }),
    d.label(800, 0, T("number", "Zahl"), { size: 20, color: c.gray, anchor: "middle", centerY: 55 }),
    d.label(1110, 0, T("bits", "Bits"), { size: 20, color: c.gray, anchor: "middle", centerY: 55 }),
  ];
  rows.forEach(([ch, n], i) => {
    const y = 100 + i * 120, mid = y + 45;
    parts.push(d.box(440, y, 120, 90, ch, { size: 48, mono: true, keepCase: true, border: c.white }));
    parts.push(d.arrow(590, mid, 700, mid, { color: c.gray, width: 2 }));
    parts.push(d.label(800, 0, String(n), { size: 48, color: c.white, anchor: "middle", mono: true, centerY: mid }));
    if (step >= 1) {
      const bits = n.toString(2).padStart(8, "0");
      parts.push(d.label(1110, 0, bits.slice(0, 4) + " " + bits.slice(4), {
        size: 48, color: c.light, anchor: "middle", mono: true, centerY: mid,
      }));
    }
  });
  // The distinction belongs to the definition, but only as a side note.
  parts.push(d.label(840, 0, T("a code is not encryption, not compression, and not source code",
                               "ein Code ist keine Verschlüsselung, keine Kompression und kein Programmtext"),
                     { size: 20, color: c.dark, anchor: "middle", centerY: 590 }));
  return put("fig-ascii", d.svg(1680, 630, ...parts));
};

/* The one table was too small. First the characters ascii lacks, then the
 * numbers unicode gives them. That utf-8 writes these numbers with different
 * lengths stands below as a side note: it is the second step, not the point. */
window.drawUtf8 = function (_slide, step = 0) {
  const c = d.colors();
  const chars = [["A", 65, true], ["z", 122, true], ["7", 55, true], ["?", 63, true],
                 ["ä", 228, false], ["€", 8364, false], ["π", 960, false]];
  const cw = 120, gap = 16;
  const x0 = (1680 - (chars.length * cw + (chars.length - 1) * gap)) / 2;
  const parts = [d.label(840, 0, T("does ascii have it?", "Kennt ASCII das Zeichen?"), { size: 20, color: c.gray, anchor: "middle", centerY: 55 })];
  chars.forEach(([ch, nr, inside], i) => {
    const x = x0 + i * (cw + gap);
    parts.push(d.box(x, 100, cw, 110, ch, {
      size: 48, mono: true, keepCase: true, border: inside ? c.light : c.red,
    }));
    parts.push(d.mark(x + cw / 2, 270, inside, { size: 30 }));
    if (step >= 1) {
      parts.push(d.label(x + cw / 2, 0, String(nr), {
        size: 32, mono: true, anchor: "middle", color: c.yellow, centerY: 420,
      }));
    }
  });
  if (step >= 1) {
    parts.push(d.label(840, 0, T("unicode: a number for every one of them", "Unicode: eine Nummer für jedes davon"),
                       { size: 32, color: c.white, anchor: "middle", centerY: 350 }));
  }
  parts.push(d.label(840, 0, T("utf-8 then writes those numbers down: common ones in one byte, rare ones in up to four",
                               "UTF-8 schreibt diese Nummern dann als Bytes: häufige in einem, seltene in bis zu vier"),
                     { size: 20, color: c.gray, anchor: "middle", centerY: 520 }));
  return put("fig-utf8", d.svg(1680, 570, ...parts));
};

/* Two tables, one word: the same code word, two meanings, no error message.
 * The receiver's table swaps n and m, so norm is read as morn (sonne as somme
 * on the German page). */
window.drawTwoTables = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [];
  const table = (x, title, rows) => {
    parts.push(d.box(x, 140, 420, 280, "", { border: c.light }));
    parts.push(d.label(x + 210, 0, title, { size: 20, color: c.gray, anchor: "middle", centerY: 185 }));
    const left = leftEdge(x, 420, rows.map(([t]) => t), 48);
    rows.forEach(([t, lit], i) => {
      parts.push(d.label(left, 0, t, {
        size: 48, mono: true, color: lit ? c.yellow : c.light, centerY: 265 + i * 70,
      }));
    });
  };
  table(60, T("sender", "Sender"), [["n = 0110", true], ["m = 1001", false]]);
  table(1200, T("receiver", "Empfänger"), [["n = 1001", false], ["m = 0110", true]]);
  parts.push(d.arrow(500, 270, 1180, 270, { color: c.gray, width: 2 }));
  parts.push(d.label(840, 0, "0110", { size: 48, color: c.yellow, anchor: "middle", mono: true, centerY: 215 }));
  parts.push(d.label(840, 0, T("the same bits either way", "auf beiden Seiten dieselben Bits"), { size: 20, color: c.gray, anchor: "middle", centerY: 320 }));
  if (step >= 1) {
    parts.push(d.label(270, 0, T("typed", "getippt"), { size: 20, color: c.gray, anchor: "middle", centerY: 470 }));
    parts.push(d.label(270, 0, T("norm", "sonne"), { size: 48, color: c.white, anchor: "middle", mono: true, centerY: 530 }));
  }
  if (step >= 2) {
    parts.push(d.label(1410, 0, T("printed", "ausgegeben"), { size: 20, color: c.gray, anchor: "middle", centerY: 470 }));
    parts.push(d.label(1410, 0, T("morn", "somme"), { size: 48, color: c.red, anchor: "middle", mono: true, centerY: 530 }));
  }
  return put("fig-two-tables", d.svg(1680, 590, ...parts));
};

/* --- Part 2 --------------------------------------------------------------- */

/* How many positions per letter? The calculation of the number systems,
 * applied. Above the columns stands what is counted with (four colours) and
 * what for (26 letters); without both the red crosses would have no reason. */
window.drawPositions = function (_slide, step = 0) {
  const c = d.colors();
  const columns = [
    [T("1 position", "1 Stelle"), T("4 codes", "4 Codes"), T("not enough for 26", "reicht nicht für 26"), false],
    [T("2 positions", "2 Stellen"), "4 x 4 = 16", T("not enough for 26", "reicht nicht für 26"), false],
    [T("3 positions", "3 Stellen"), "4 x 4 x 4 = 64", T("enough for 26", "reicht für 26"), true],
  ];
  const parts = [d.label(840, 0, T("the colour alphabet", "das Farbalphabet"), { size: 20, color: c.gray, anchor: "middle", centerY: 30 })];
  led().forEach((f, k) => {
    parts.push(`<rect x="${650 + k * 100}" y="50" width="80" height="80" rx="8" fill="${f}"/>`);
  });
  parts.push(d.label(840, 0, T("26 letters to encode", "26 Buchstaben zu codieren"), { size: 32, color: c.white, anchor: "middle", centerY: 190 }));
  columns.forEach(([title, sum, note, ok], i) => {
    const x = 60 + i * 550;
    const verdict = step >= i ? ok : null;
    parts.push(d.verdict(x, 230, 460, 260, "", verdict, { border: c.light }));
    parts.push(d.label(x + 230, 0, title, { size: 32, color: c.gray, anchor: "middle", centerY: 295 }));
    parts.push(d.label(x + 230, 0, sum, { size: 48, color: c.white, anchor: "middle", mono: true, centerY: 370 }));
    if (step >= i) {
      parts.push(d.label(x + 230, 0, note, {
        size: 32, color: ok ? c.green : c.red, anchor: "middle", centerY: 545,
      }));
    }
  });
  return put("fig-positions", d.svg(1680, 600, ...parts));
};

/* The codebook as what it is: 64 slots, most of them empty. */
window.drawCodebook = function () {
  const c = d.colors();
  const chars = "abcdefghijklmnopqrstuvwxyz".split("")
    .concat([" ", "."], "0123456789".split(""));
  const cw = 120, ch = 84, gap = 10;
  const x0 = (1680 - (8 * cw + 7 * gap)) / 2, y0 = 30;
  const parts = [];
  for (let i = 0; i < 64; i++) {
    const x = x0 + (i % 8) * (cw + gap), y = y0 + Math.floor(i / 8) * (ch + gap);
    const z = chars[i];
    const used = z !== undefined;
    const extra = used && i >= 26;
    parts.push(d.box(x, y, cw, ch, "", { border: used ? c.light : c.dark, rx: 6 }));
    if (z === " ") {
      // a space cannot be set, it is invisible, and a short form such as "sp"
      // reads as two letters, so it is drawn
      parts.push(spaceSign(x + cw / 2, y + 40, c.yellow));
    } else if (used) {
      parts.push(d.label(x + cw / 2, 0, z, {
        size: 32, mono: true, anchor: "middle", color: extra ? c.yellow : c.white, centerY: y + 31,
      }));
    }
    const code = i.toString(4).padStart(3, "0");
    parts.push(d.label(x + cw / 2, 0, code, {
      size: 20, mono: true, anchor: "middle", color: used ? c.gray : c.dark, centerY: y + 64,
    }));
  }
  return put("fig-codebook", d.svg(1680, y0 + 8 * ch + 7 * gap + 20, ...parts));
};

/* The same table, read in both directions. */
window.drawBothWays = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [];
  // the code words have three places since the codebook, so the columns sit
  // further right and the left label stays on the slide
  const row = (y, head, left, box, right, visible) => {
    const mid = y + 60;
    if (!visible) return;
    parts.push(d.label(750, 0, head, { size: 20, color: c.gray, anchor: "middle", centerY: y - 40 }));
    parts.push(d.label(380, 0, left, { size: 48, color: c.white, anchor: "end", mono: true, centerY: mid }));
    parts.push(d.arrow(410, mid, 520, mid, { color: c.gray, width: 2 }));
    parts.push(d.box(530, y, 440, 120, box, { size: 32, border: c.light }));
    parts.push(d.arrow(990, mid, 1100, mid, { color: c.gray, width: 2 }));
    parts.push(d.label(1130, 0, right, { size: 48, color: c.white, anchor: "start", mono: true, centerY: mid }));
  };
  row(120, T("sending", "senden"), "\"cab\"", T("look up", "nachschlagen"), "002 000 001", true);
  row(410, T("receiving", "empfangen"), "002 000 001", T("look up backwards", "rückwärts suchen"), "\"cab\"", step >= 1);
  if (step >= 2) {
    parts.push(`<path d="M510,180 L470,180 L470,470 L510,470" fill="none" stroke="${c.yellow}" stroke-width="3"/>`);
    parts.push(d.label(440, 0, T("one table", "eine Tabelle"), { size: 32, color: c.yellow, anchor: "end", centerY: 325 }));
  }
  return put("fig-both-ways", d.svg(1680, 580, ...parts));
};

/* What is not in the table: the space has no code word. The call that sends
 * it stands above, so that the practical case is clear. */
window.drawNotInTable = function () {
  const c = d.colors();
  const words = T("good morning", "guten morgen");
  const text = words.split("");
  const cw = 100, gap = 10;
  const x0 = (1680 - (text.length * cw + (text.length - 1) * gap)) / 2;
  const parts = [
    d.label(840, 0, `send("${words}")`,
            { size: 32, mono: true, keepCase: true, color: c.light, anchor: "middle", centerY: 45 }),
    d.label(840, 0, T("the codebook has a to z and nothing else", "das Codebuch kennt a bis z und sonst nichts"),
            { size: 20, color: c.gray, anchor: "middle", centerY: 100 }),
  ];
  text.forEach((ch, i) => {
    const x = x0 + i * (cw + gap);
    const gapHere = ch === " ";
    parts.push(d.box(x, 150, cw, 100, gapHere ? T("space", "Leer") : ch, {
      size: gapHere ? 20 : 48, mono: !gapHere, color: gapHere ? c.red : c.white,
      border: gapHere ? c.red : c.light, dashed: gapHere,
    }));
    if (gapHere) {
      parts.push(d.label(x + cw / 2, 0, "?", { size: 48, color: c.red, anchor: "middle", mono: true, centerY: 305 }));
    } else {
      parts.push(d.mark(x + cw / 2, 305, true, { size: 30 }));
    }
  });
  parts.push(d.label(840, 0, T("three ways out, and you have to pick one", "drei Auswege, und einen musst du wählen"),
                     { size: 32, color: c.gray, anchor: "middle", centerY: 390 }));
  [T("add it\nto the table", "in die Tabelle\naufnehmen"),
   T("drop it\nbefore sending", "vor dem Senden\nentfernen"),
   T("stop\nwith a message", "mit einer Meldung\nabbrechen")].forEach((t, i) => {
    parts.push(d.box(60 + i * 550, 430, 460, 150, t, { size: 32, border: c.light }));
  });
  return put("fig-not-in-table", d.svg(1680, 620, ...parts));
};

/* --- Part 3 --------------------------------------------------------------- */

/* The code that does not work, in the same sender and receiver layout as the
 * two tables: both sides hold the same table, and it still goes wrong. The
 * readings stand at the receiver, who would have to choose and cannot. */
window.drawAmbiguous = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [];
  const rows = ["a = 0", "b = 01", "c = 10"];
  const table = (x, title) => {
    parts.push(d.box(x, 40, 420, 280, "", { border: c.light }));
    parts.push(d.label(x + 210, 0, title, { size: 20, color: c.gray, anchor: "middle", centerY: 85 }));
    const left = leftEdge(x, 420, rows, 48);
    rows.forEach((z, i) => {
      parts.push(d.label(left, 0, z, { size: 48, mono: true, color: c.white, centerY: 155 + i * 55 }));
    });
  };
  table(60, T("sender", "Sender"));
  table(1200, T("receiver", "Empfänger"));
  parts.push(d.arrow(500, 180, 1180, 180, { color: c.gray, width: 2 }));
  parts.push(d.label(840, 0, "010", { size: 80, color: c.yellow, anchor: "middle", mono: true, centerY: 100 }));
  parts.push(d.label(840, 0, T("three bits, no gaps between them", "drei Bits ohne Lücken dazwischen"),
                     { size: 20, color: c.gray, anchor: "middle", centerY: 245 }));
  parts.push(d.label(270, 0, T("typed", "getippt"), { size: 20, color: c.gray, anchor: "middle", centerY: 375 }));
  parts.push(d.label(270, 0, "a c", { size: 48, color: c.white, anchor: "middle", mono: true, centerY: 440 }));
  parts.push(d.label(1410, 0, T("could read", "könnte lesen"), { size: 20, color: c.gray, anchor: "middle", centerY: 370 }));

  /* One reading: the three bits as cells, brackets over the groups below and
   * the letters that come out. No judgement: both readings follow the rules,
   * and that is exactly the problem. */
  const reading = (y, groups) => {
    const bits = "010".split("");
    const zw = 76, space = 12;
    const x0 = 1410 - (3 * zw + 2 * space) / 2;
    bits.forEach((b, i) => {
      parts.push(d.box(x0 + i * (zw + space), y, zw, zw, b, { size: 48, mono: true, border: c.light, rx: 4 }));
    });
    let from = 0;
    groups.forEach(([length, letter]) => {
      const l = x0 + from * (zw + space);
      const r = l + length * zw + (length - 1) * space;
      const ky = y + zw + 26;
      parts.push(`<path d="M${l},${ky - 15} L${l},${ky} L${r},${ky} L${r},${ky - 15}" ` +
                 `fill="none" stroke="${c.light}" stroke-width="3"/>`);
      parts.push(d.label((l + r) / 2, 0, letter,
                         { size: 48, mono: true, anchor: "middle", color: c.white, centerY: ky + 44 }));
      from += length;
    });
  };
  reading(410, [[1, "a"], [2, "c"]]);
  if (step >= 1) reading(600, [[2, "b"], [1, "a"]]);
  return put("fig-ambiguous", d.svg(1680, 790, ...parts));
};

/* Three ways out, all of them work. No recipe: the choice stays with whoever
 * builds the code. All three columns show the same form "a = …", the lines
 * left-aligned on a common edge so that the equals signs line up. */
window.drawThreeWays = function () {
  const c = d.colors();
  const columns = [
    [T("fixed length", "feste Länge"), ["a = 00", "b = 01", "c = 10"], T("count instead of guessing", "abzählen statt raten")],
    [T("a separator", "ein Trennzeichen"), ["a = .-", "b = -...", "c = -.-."], T("morse pauses between letters", "Morse: Pausen dazwischen")],
    [T("no code word\nstarts another", "kein Codewort\nbeginnt ein anderes"), ["a = 0", "b = 10", "c = 110"], T("read until it matches", "lesen, bis es passt")],
  ];
  const parts = [];
  columns.forEach(([title, rows, foot], i) => {
    const x = 60 + i * 550;
    const left = leftEdge(x, 460, rows, 32);
    parts.push(d.verdict(x, 120, 460, 340, "", true));
    parts.push(d.label(x + 230, 0, title, { size: 32, color: c.gray, anchor: "middle", centerY: 180 }));
    rows.forEach((z, k) => {
      parts.push(d.label(left, 0, z, { size: 32, color: c.white, mono: true, centerY: 260 + k * 55 }));
    });
    parts.push(d.label(x + 230, 0, foot, { size: 32, color: c.light, anchor: "middle", centerY: 510 }));
  });
  return put("fig-three-ways", d.svg(1680, 560, ...parts));
};

/* What fixed length costs: the same word in two codes of one's own. Beside
 * each row stands the rule it is coded by, or it stays open where the 30 and
 * the 26 come from. The common letters are those of the language of the page;
 * "experiment" has seven of them in English and in German alike. */
window.drawLengthCost = function () {
  const c = d.colors();
  const word = "experiment".split("");
  const common = new Set(T("etaoinshrd", "enisratdhu").split(""));
  const unit = 30, x0 = 460;
  const parts = [
    d.label(840, 0, T("the same word in two codes of your own", "dasselbe Wort in zwei selbst gebauten Codes"),
            { size: 20, color: c.gray, anchor: "middle", centerY: 60 }),
  ];
  const bar = (y, widths, name, rule) => {
    const mid = y + 45;
    let x = x0;
    widths.forEach((b, i) => {
      const w = b * unit;
      parts.push(d.box(x, y, w, 90, word[i], { size: 32, mono: true, keepCase: true, border: c.light, rx: 4 }));
      x += w;
    });
    parts.push(d.label(430, 0, name, { size: 32, color: c.white, anchor: "end", centerY: mid - 22 }));
    parts.push(d.label(430, 0, rule, { size: 20, color: c.gray, anchor: "end", centerY: mid + 22 }));
    // the sums stand on a common edge, not at the end of their bar, so the
    // difference shows as a gap between the two rows
    const total = widths.reduce((a, b) => a + b, 0);
    parts.push(d.label(1400, 0, total + T(" positions", " Stellen"), { size: 32, color: c.white, centerY: mid - 22 }));
    parts.push(d.label(1400, 0, decimal(total / word.length) + T(" per letter", " je Buchstabe"),
                       { size: 20, color: c.gray, centerY: mid + 22 }));
  };
  bar(140, word.map(() => 3), T("fixed", "fest"), T("three positions for every letter", "drei Stellen für jeden Buchstaben"));
  bar(300, word.map((ch) => (common.has(ch) ? 2 : 4)), T("variable", "variabel"),
      T("two for the common ones, four for the rest", "zwei für die häufigen, vier für den Rest"));
  parts.push(d.label(840, 0, T("the ten most common letters in english: e t a o i n s h r d",
                               "die zehn häufigsten Buchstaben im Deutschen: e n i s r a t d h u"),
                     { size: 20, color: c.gray, anchor: "middle", centerY: 460 }));
  return put("fig-length-cost", d.svg(1680, 510, ...parts));
};

/* --- Part 4 --------------------------------------------------------------- */

/* Eight real bytes from the photo, three readings. */
window.drawThreeReadings = function (_slide, step = 0) {
  const c = d.colors();
  const parts = [thumbnail(80, 60, 220, PHOTO_BYTE_AT)];
  parts.push(d.label(190, 0, T("the photo", "das Foto"), { size: 20, color: c.gray, anchor: "middle", centerY: 305 }));
  parts.push(d.arrow(320, 170, 430, 170, { color: c.gray, width: 2 }));

  const bw = 130, gap = 10, bx = 460;
  PHOTO_BYTES.forEach((v, i) => {
    parts.push(d.box(bx + i * (bw + gap), 120, bw, 100, hex(v), { size: 32, mono: true, keepCase: true, border: c.white }));
  });
  parts.push(d.label(bx, 0, T("eight bytes out of the middle of it", "acht Bytes aus seiner Mitte"), { size: 20, color: c.gray, centerY: 90 }));

  if (step >= 1) {
    const columns = [
      [T("as text", "als Text"), (x, y, w) => PHOTO_BYTES.map((v, i) =>
        d.label(x + (w - 7 * 44) / 2 + i * 44, 0, v >= 33 && v <= 126 ? String.fromCharCode(v) : ".",
                { size: 32, mono: true, keepCase: true, anchor: "middle", color: c.light, centerY: y + 100 })).join("")],
      [T("as grey values", "als Grauwerte"), (x, y, w) => PHOTO_BYTES.map((v, i) =>
        `<rect x="${x + (w - 8 * 40) / 2 + i * 40}" y="${y + 67}" width="34" height="66" fill="${grey(v)}" stroke="${c.dark}" stroke-width="1"/>`).join("")],
      [T("as audio", "als Ton"), (x, y, w) => {
        const pts = PHOTO_BYTES.map((v, i) => `${x + (w - 7 * 52) / 2 + i * 52},${y + 130 - (v / 255) * 80}`).join(" ");
        return `<polyline points="${pts}" fill="none" stroke="${c.light}" stroke-width="3"/>` +
          PHOTO_BYTES.map((v, i) => `<circle cx="${x + (w - 7 * 52) / 2 + i * 52}" cy="${y + 130 - (v / 255) * 80}" r="5" fill="${c.light}"/>`).join("");
      }],
    ];
    columns.forEach(([title, draw], i) => {
      const x = 220 + i * 450, y = 330, w = 420;
      parts.push(d.arrow(840, 250, x + w / 2, y - 10, { color: c.gray, width: 2 }));
      parts.push(d.box(x, y, w, 180, "", { border: c.light }));
      parts.push(d.label(x + w / 2, 0, title, { size: 20, color: c.gray, anchor: "middle", centerY: y + 35 }));
      parts.push(draw(x, y, w));
    });
  }
  return put("fig-three-readings", d.svg(1680, 560, ...parts));
};

/* One pixel is three numbers. The photo sits in the same place as on the
 * slide before, so that it does not jump. Instead of a box of its own, the
 * hex notation carries the colour itself: it shows the subject, not a role. */
window.drawPixel = function () {
  const c = d.colors();
  const [r, g, b] = PHOTO_PIXEL;
  const colour = `rgb(${r},${g},${b})`;
  const parts = [
    thumbnail(80, 60, 220, PHOTO_PIXEL_AT),
    d.label(190, 0, T("one pixel of it", "ein Bildpunkt daraus"), { size: 20, color: c.gray, anchor: "middle", centerY: 305 }),
    d.arrow(320, 170, 430, 170, { color: c.gray, width: 2 }),
  ];
  const maxb = 760;
  [[T("red", "Rot"), r], [T("green", "Grün"), g], [T("blue", "Blau"), b]].forEach(([name, v], i) => {
    const y = 70 + i * 80, mid = y + 30;
    parts.push(d.label(590, 0, name, { size: 32, color: c.gray, anchor: "end", centerY: mid }));
    parts.push(`<rect x="620" y="${y}" width="${(v / 255) * maxb}" height="60" rx="4" fill="${c.dark}"/>`);
    parts.push(d.label(1560, 0, String(v), { size: 32, color: c.white, anchor: "end", mono: true, centerY: mid }));
  });
  parts.push(d.label(840, 0, T("the same colour, written as hex: two places per byte", "dieselbe Farbe hexadezimal: zwei Stellen je Byte"),
                     { size: 20, color: c.gray, anchor: "middle", centerY: 400 }));
  parts.push(d.label(840, 0, "#" + hex(r) + hex(g) + hex(b),
                     { size: 80, color: colour, anchor: "middle", mono: true, keepCase: true, centerY: 490 }));
  return put("fig-pixel", d.svg(1680, 560, ...parts));
};

/* Who says which reading applies? Three answers, from the weakest to the one a
 * protocol builds in. */
window.drawWhoSays = function () {
  const c = d.colors();
  const columns = [
    [T("the file extension", "die Dateiendung"), ".txt   .png   .wav", true],
    [T("a header in the file", "Kopfdaten in der Datei"), T("the first bytes say it", "der Anfang sagt es"), false],
    [T("a type field", "ein Typfeld"), T("sent with the message", "in der Nachricht"), false],
  ];
  const parts = [];
  columns.forEach(([title, below, mono], i) => {
    const x = 60 + i * 550;
    parts.push(d.box(x, 140, 460, 300, "", { border: c.light }));
    parts.push(d.label(x + 230, 0, title, { size: 32, color: c.white, anchor: "middle", centerY: 230 }));
    parts.push(d.label(x + 230, 0, below, { size: 32, color: c.gray, anchor: "middle", mono, centerY: 320 }));
  });
  return put("fig-who-says", d.svg(1680, 500, ...parts));
};

/* --- Part 5 --------------------------------------------------------------- */

/* Braille, DNA and the colour alphabet do the same calculation. */
window.drawSixtyFour = function () {
  const c = d.colors();
  const parts = [];
  const column = (i, title, glyph, below, formula) => {
    const x = 60 + i * 550;
    parts.push(d.label(x + 230, 0, title, { size: 32, color: c.gray, anchor: "middle", centerY: 60 }));
    parts.push(d.box(x, 100, 460, 420, "", { border: c.light }));
    parts.push(glyph(x + 230));
    parts.push(d.label(x + 230, 0, below, { size: 32, color: c.light, anchor: "middle", centerY: 390 }));
    parts.push(d.formula(x + 230, 0, formula, { size: 48, color: c.white, anchor: "middle", centerY: 465 }));
  };

  column(0, T("braille", "Braille"), (cx) => {
    const raised = [true, true, false, true, false, false];   // the pattern of "f"
    let s = "";
    raised.forEach((on, k) => {
      const px = cx - 45 + (k % 2) * 90, py = 190 + Math.floor(k / 2) * 70;
      s += `<circle cx="${px}" cy="${py}" r="24" fill="${on ? c.white : "none"}" stroke="${on ? c.white : c.dark}" stroke-width="3"/>`;
    });
    return s;
  }, T("2 states, 6 positions", "2 Zustände, 6 Stellen"), "2^6 = 64");

  column(1, T("dna", "DNA"), (cx) => "ACG".split("").map((base, k) =>
    d.box(cx - 165 + k * 110, 150, 90, 90, base, { size: 48, mono: true, keepCase: true, border: c.light })
  ).join(""), T("4 bases, 3 positions", "4 Basen, 3 Stellen"), "4^3 = 64");

  column(2, T("colour alphabet", "Farbalphabet"), (cx) => led().slice(0, 3).map((f, k) =>
    `<rect x="${cx - 165 + k * 110}" y="150" width="90" height="90" rx="8" fill="${f}"/>`
  ).join(""), T("4 colours, 3 positions", "4 Farben, 3 Stellen"), "4^3 = 64");

  return put("fig-sixty-four", d.svg(1680, 520, ...parts));
};

/* --- Start ---------------------------------------------------------------- */

if ($("fig-mapping")) {
  window.drawMapping();
  window.drawCodebook();
  window.drawNotInTable();
  window.drawThreeWays();
  window.drawLengthCost();
  window.drawPixel();
  window.drawWhoSays();
  window.drawSixtyFour();
}

window.deckCodes = {
  mapping: window.drawMapping,
  ascii: window.drawAscii,
  utf8: window.drawUtf8,
  twoTables: window.drawTwoTables,
  positions: window.drawPositions,
  codebook: window.drawCodebook,
  bothWays: window.drawBothWays,
  notInTable: window.drawNotInTable,
  ambiguous: window.drawAmbiguous,
  threeWays: window.drawThreeWays,
  lengthCost: window.drawLengthCost,
  threeReadings: window.drawThreeReadings,
  pixel: window.drawPixel,
  whoSays: window.drawWhoSays,
  sixtyFour: window.drawSixtyFour,
};
