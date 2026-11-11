// Drawings of "how a scientific paper is built" (second version, 2026-11-11).
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without.
//
// The second version shows instead of listing: imrad as the floor plan of a
// house, the lengths as twenty pages, the hourglass as an hourglass, and one
// short example paper on the milk survey whose four pages carry the second
// part and whose abstract closes the deck. Colours: grey for context and for
// what does not belong, blue for the point of a slide (the sentence or the
// room it is about), yellow for what is happening right now (the cut, the
// newest sentence, the reading order). There is no red: a sentence in the
// wrong room is not wrong, it belongs somewhere else.
//
// The numbers of the example come from knowledge/media/datasets/
// milk_survey_compact.csv: 2,809 respondents, 619 saw one of two milks, 611
// named a price from which it would be too expensive; 20 prices above 10 €
// and 3 below 0.50 € are left out, so 588 remain. Median by diet: vegetarian
// 2.445 € (n = 28), vegan 2.00 € (17), flexitarian 1.99 € (166), omnivore
// 1.99 € (362), pescetarian 1.99 € (7); women 2.00 € (326), men 1.89 € (262).
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const family = C.font.replace(/"/g, "'");

/* Width of a text as the slide shows it: lower case unless keepCase, in the
 * theme font. Measured on a canvas, so it holds on hidden slides too. */
const ctx = document.createElement("canvas").getContext("2d");
function textWidth(s, size = 32, keepCase = false) {
  ctx.font = `${size}px ${C.font}`;
  return ctx.measureText(keepCase ? s : s.toLowerCase()).width;
}

/* Lines of text in which single words carry their own colour. Each line is a
 * list of segments: a plain string, or [text, colour, keepCase]. The block is
 * centred on cy like label(); anchor "middle" centres every line on x. */
function rich(x, cy, lines, o = {}) {
  const size = o.size || 32, lh = o.lh || 1.3;
  const y0 = cy + size * 0.35 - (lines.length - 1) * size * lh / 2;
  return lines.map((segs, i) =>
    `<text x="${x}" y="${y0 + i * size * lh}" text-anchor="${o.anchor || "start"}" font-family="${family}" font-size="${size}" fill="${o.color || C.white}">` +
    segs.map((s) => (typeof s === "string" ? esc(s)
      : `<tspan fill="${s[1]}"${s[2] ? ' class="keep-case"' : ""}>${esc(s[0])}</tspan>`)).join("") +
    `</text>`).join("");
}

/* --- slide: imrad --------------------------------------------------------------
 * Figure 1680 x 804. A floor plan in thin light lines: the house from x 184 to
 * 1456 and y 170 to 690, four rooms in reading order (introduction 380 wide,
 * methods 280, results 280, discussion 332). The widest name, "introduction"
 * at 48, is about 300 and keeps a good margin to either wall. Each room has
 * its name at 48 (centre y 330) and its question in two lines at 32 (centre
 * y 440); the doors are gaps of 80 in the walls (y 590..670) with the swing
 * of the door. In front of the house, grey and dashed, the entrance "title,
 * abstract" (x 6..184); behind it, grey and dashed, the narrow room
 * "references" (x 1456..1674). The room that is added is lit in blue; the
 * next step moves the light on. */
(function () {
  const walls = [184, 564, 844, 1124, 1456];
  const rooms = [
    ["introduction", "why, and what is\nthe question?"],
    ["methods", "how did we\nfind out?"],
    ["results", "what did\nwe find?"],
    ["discussion", "what does\nit mean?"]];
  const T = 170, B = 690, D1 = 590, D2 = 670;
  const wallPath = `M184 ${T} L1456 ${T} M184 ${B} L1456 ${B} ` +
    walls.map((x) => `M${x} ${T} L${x} ${D1} M${x} ${D2} L${x} ${B}`).join(" ");
  const door = (x, col) => `<path d="M${x} ${D1} A80 80 0 0 1 ${x + 80} ${D2} M${x} ${D2} L${x + 80} ${D2}" fill="none" stroke="${col}" stroke-width="2"/>`;
  const floor = (k) => `<rect x="${walls[k] + 6}" y="${T + 6}" width="${walls[k + 1] - walls[k] - 12}" height="${B - T - 12}" fill="${C.blue}" fill-opacity="0.25"/>`;
  const room = (k) => {
    const cx = (walls[k] + walls[k + 1]) / 2;
    return [d.label(cx, 0, rooms[k][0], { size: 48, anchor: "middle", centerY: 330 }),
      d.label(cx, 0, rooms[k][1], { size: 32, anchor: "middle", color: C.light, centerY: 440 })];
  };
  const dashed = `fill="none" stroke="${C.gray}" stroke-width="2" stroke-dasharray="8 6"`;
  el("fig-imrad").innerHTML = d.svg(1680, 804,
    d.g("f0", floor(0)), d.g("f1", floor(1)), d.g("f2", floor(2)), d.g("f3", floor(3)),
    `<path d="M184 400 L6 400 L6 ${B} L184 ${B}" ${dashed}/>`,
    d.label(94, 0, "title,\nabstract", { size: 32, anchor: "middle", color: C.gray, centerY: 495 }),
    `<path d="M1456 ${T} L1674 ${T} L1674 ${B} L1456 ${B}" ${dashed}/>`,
    d.label(1565, 0, "references", { size: 32, anchor: "middle", color: C.gray, centerY: 330 }),
    `<path d="${wallPath}" fill="none" stroke="${C.light}" stroke-width="3" stroke-linecap="square"/>`,
    ...walls.map((x, k) => door(x, k === 0 || k === 4 ? C.gray : C.light)),
    d.g("r0", ...room(0)), d.g("r1", ...room(1)), d.g("r2", ...room(2)), d.g("r3", ...room(3)));
  const a = d.anim("fig-imrad");
  for (let k = 1; k <= 3; k++)
    a.step(a.par(a.hide("f" + (k - 1), { dur: 500 }), a.show("f" + k, { dur: 500 }), a.show("r" + k, { dur: 500 })));
})();

/* --- slide: how imrad won (Sollaci & Pereira 2004) ----------------------------
 * Figure 1680 x 660 (has-punch). Only the values the paper states in its text
 * are drawn as dots: none in 1935, over 10 % in 1950, about 20 % in 1955, over
 * 80 % in the 1970s (here at 1975) and, in the 1980s, the only form. The area
 * under the line that joins them is a quiet dark grey. Axes: year 1935..1985
 * on x 160..1480 (26.4 per year), share 0..100 % on y 560..110 (4.5 per
 * percent). On the 100 % line the four journals at the year from which they
 * printed only imrad: NEJM 1975 (x 1216), BMJ 1980 (1348), JAMA and The
 * Lancet 1985 (1480, two lines, the longer about 170 wide, so 1395..1565,
 * clear of BMJ at 1319..1377). The caption at the top ends near x 900. */
(function () {
  const X = (year) => 160 + (year - 1935) * 26.4;
  const Y = (p) => 560 - 4.5 * p;
  const pts = [[1935, 0], [1950, 10], [1955, 20], [1975, 80], [1985, 100]];
  const line = pts.map(([t, p], k) => `${k ? "L" : "M"}${X(t)},${Y(p)}`).join(" ");
  const ticks = [1935, 1945, 1955, 1965, 1975, 1985].map((t) =>
    d.label(X(t), 0, String(t), { size: 32, color: C.gray, anchor: "middle", centerY: 604 }));
  const yl = [[0, "0 %"], [50, "50 %"], [100, "100 %"]].map(([p, t]) =>
    d.label(140, 0, t, { size: 32, color: C.gray, anchor: "end", centerY: Y(p) }));
  const journal = (year, name, cy) => [
    `<circle cx="${X(year)}" cy="${Y(100)}" r="8" fill="${C.bg}" stroke="${C.light}" stroke-width="3"/>`,
    d.label(X(year), 0, name, { size: 32, anchor: "middle", color: C.light, keepCase: true, centerY: cy })];
  el("fig-history").innerHTML = d.svg(1680, 660,
    d.line(160, Y(50), 1480, Y(50), { color: C.dark }),
    d.line(160, Y(100), 1480, Y(100), { color: C.dark }),
    `<path d="${line} L${X(1985)},560 L160,560 Z" fill="${C.dark}" fill-opacity="0.55"/>`,
    d.line(160, 560, 1480, 560, { color: C.gray }), ...ticks, ...yl,
    `<path d="${line}" fill="none" stroke="${C.light}" stroke-width="3"/>`,
    ...journal(1975, "NEJM", 74), ...journal(1980, "BMJ", 74), ...journal(1985, "JAMA,\nThe Lancet", 53),
    ...pts.map(([t, p]) => `<circle cx="${X(t)}" cy="${Y(p)}" r="10" fill="${C.white}"/>`),
    d.label(182, 0, "none", { size: 32, centerY: 527 }),
    d.label(536, 0, "over 10 %", { size: 32, anchor: "end", centerY: 486 }),
    d.label(712, 0, "about 20 %", { size: 32, centerY: 506 }),
    d.label(1180, 0, "over 80 %", { size: 32, anchor: "end", centerY: 160 }),
    d.label(160, 0, "share of original articles in imrad form", { size: 32, color: C.gray, centerY: 50 }));
})();

/* --- slide: how long is each part? (Döring 2023, p. 771) ------------------------
 * Figure 1680 x 660 (has-punch). Twenty pages in one row, each 64 x 90 with
 * hinted lines of text, 6 apart within a part and 32 between parts, from
 * x 90 to 1614; the part's name centred under it. "introduction" (about 190)
 * under its single page runs from about 27 to 217, clear of "theory" under
 * the next part. The six pages of the results are blue. Below, as the second
 * step, a paper of the same length that Döring calls unbalanced: twelve pages
 * of theory and two of results; the other six pages are drawn dark and
 * unnamed, since the book gives only these two numbers. A small green check
 * before the first caption and a yellow warning sign before the second mark
 * which of the two papers is the one to follow. */
(function () {
  const W = 64, H = 90, GAP = 6, SEP = 32;
  const page = (x, y, col, lineCol) => lineCol === null
    ? `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="3" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="6 5"/>`
    : `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="3" fill="none" stroke="${col}" stroke-width="2"/>` +
      [0, 1, 2, 3, 4, 5].map((i) => `<line x1="${x + 10}" y1="${y + 18 + 11 * i}" x2="${x + (i === 5 ? 36 : 54)}" y2="${y + 18 + 11 * i}" stroke="${lineCol}" stroke-width="3"/>`).join("");
  function row(y, parts) {
    let x = 90;
    const out = [];
    parts.forEach(([name, n, kind]) => {
      const col = kind === "point" ? C.blue : kind === "dim" ? C.gray : C.light;
      const lineCol = kind === "point" ? C.blue : kind === "dim" ? null : C.dark;
      const x0 = x;
      for (let i = 0; i < n; i++) { out.push(page(x, y, col, lineCol)); x += W + GAP; }
      x += SEP - GAP;
      if (name) out.push(d.label((x0 + x - SEP) / 2, 0, name, { size: 32, anchor: "middle", centerY: y + H + 45, color: kind === "point" ? C.blue : C.white }));
    });
    return out;
  }
  el("fig-length").innerHTML = d.svg(1680, 660,
    d.mark(108, 100, true, { size: 28 }),
    d.label(140, 0, "a rule of thumb for an empirical paper of 20 pages", { size: 32, color: C.gray, centerY: 100 }),
    ...row(140, [["introduction", 1], ["theory", 4], ["methods", 2], ["results", 6, "point"], ["discussion", 3], ["references", 4]]),
    d.g("bad",
      d.mark(108, 380, "caution", { size: 28 }),
      rich(140, 380, [["and one with twelve pages of theory and two of results, which ", ["Döring", C.gray, true], " calls unbalanced"]], { color: C.gray }),
      ...row(420, [["", 1, "dim"], ["theory", 12], ["", 1, "dim"], ["results", 2, "point"], ["", 4, "dim"]])));
  const a = d.anim("fig-length");
  a.step(a.show("bad", { dur: 600 }));
})();

/* --- slide: the hourglass (after Cals & Kotz 2013) -------------------------------
 * Figure 1680 x 660 (has-punch). An hourglass drawn as one: two curved bulbs
 * centred on x 760, from 1080 wide at the rims (y 8 and 652) to a neck 420
 * wide (x 550..970) between y 264 and 392. Ten lines of text at 32 on a pitch
 * of 64 from centre y 40, each narrower than the glass at its height: at
 * y 232 the glass is about 444 wide and "your question" about 210; in the
 * neck "how you found out" about 280 of 420. Question and answer are blue,
 * the two sentences the punchline names. On the right, grey brackets at
 * x 1370 name the sections. On the left, in grey, what the width means: how
 * broad the text is, the whole field at the rims and only your study in the
 * neck ("broad:" and "the field" right-aligned at x 190, where the bulb
 * begins at about 222; "narrow: only your study", about 440, right-aligned
 * at 520 beside the neck), so that nobody reads it as the length of a part.
 * Build-up: top bulb, neck, bottom bulb. */
(function () {
  const rows = [
    "the topic and why it matters", "what is known", "the gap", ["your question"],
    "how you found out", "what you found",
    ["your answer"], "compared with others", "limitations", "what follows from it"];
  const cy = (k) => 40 + 64 * k;
  const text = (k) => {
    const point = Array.isArray(rows[k]);
    return d.label(760, 0, point ? rows[k][0] : rows[k], { size: 32, anchor: "middle", centerY: cy(k), color: point ? C.blue : C.white });
  };
  const glass = "M220,8 C220,150 550,160 550,264 L550,392 C550,500 220,510 220,652 " +
    "L1300,652 C1300,510 970,500 970,392 L970,264 C970,160 1300,150 1300,8 Z";
  const bracket = (from, to, name) => {
    const y1 = cy(from) - 24, y2 = cy(to) + 24;
    return [`<path d="M1360 ${y1} L1370 ${y1} L1370 ${y2} L1360 ${y2}" fill="none" stroke="${C.gray}" stroke-width="2"/>`,
      d.label(1400, 0, name, { size: 32, color: C.gray, centerY: (y1 + y2) / 2 })];
  };
  const width = (x, y, t) => d.label(x, 0, t, { size: 32, color: C.gray, anchor: "end", centerY: y });
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => text(a + i));
  el("fig-hourglass").innerHTML = d.svg(1680, 660,
    `<path d="${glass}" fill="${C.dark}" fill-opacity="0.35" stroke="${C.light}" stroke-width="3"/>`,
    d.line(190, 8, 1330, 8, { color: C.gray, width: 8 }), d.line(190, 652, 1330, 652, { color: C.gray, width: 8 }),
    d.g("intro", ...range(0, 3), ...bracket(0, 3, "introduction"), width(190, 80, "broad:\nthe field")),
    d.g("middle", ...range(4, 5), ...bracket(4, 4, "methods"), ...bracket(5, 5, "results"), width(520, 328, "narrow: only your study")),
    d.g("disc", ...range(6, 9), ...bracket(6, 9, "discussion"), width(190, 580, "broad:\nthe field")));
  const a = d.anim("fig-hourglass");
  a.step(a.show("middle", { dur: 500 }));
  a.step(a.show("disc", { dur: 500 }));
})();

/* --- slides: four sections of the example paper ---------------------------------------
 * Figure 1680 x 660 (has-punch). A section of the example paper taken apart
 * into its building blocks, one panel per block and no page frame around
 * them: a dark panel with a bar on its left edge, the name of the block in
 * grey at 32 from 30 inside the panel, and the sentence at 32, left-aligned,
 * from a text column that starts 50 after the longest name. The block the
 * slide is about has its bar, name and sentence in blue. Panels are 50 high
 * plus 42 per line (92 for one line, 134 for two) and 14 apart. The shape
 * of the stack carries the shape of the section: the introduction narrows
 * like a funnel (each panel 120 narrower, centred on 840), the discussion
 * widens again, methods and results are a list of equal panels. Under the
 * panels, after a gap, the sentence that does not belong here, kept quiet:
 * grey, struck through, a short arrow and the room it belongs in, without a
 * box. Build-up: the blocks, their names, the stray sentence. */
function sectionPage(id, o) {
  const lw = Math.max(...o.blocks.map((b) => textWidth(b.name)));
  const tx = 30 + lw + 50;
  const n = o.blocks.length;
  const parts = [], names = [];
  let y = 4;
  o.blocks.forEach((b, i) => {
    const w = o.shape === "funnel" ? 1680 - 120 * i : o.shape === "widen" ? 1680 - 120 * (n - 1 - i) : 1680;
    const x = (1680 - w) / 2;
    const h = b.h || 50 + 42 * b.text.length;
    const col = b.point ? C.blue : C.gray;
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.dark}" fill-opacity="0.35"/>`,
      `<rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="${col}"/>`,
      b.figure ? b.figure(x + tx, y) : rich(x + tx, y + h / 2, b.text, { color: b.point ? C.blue : C.white }));
    names.push(d.label(x + 30, 0, b.name, { size: 32, color: col, centerY: y + h / 2 }));
    y += h + 14;
  });
  const wy = y + 50, w = textWidth(o.wrong);
  el(id).innerHTML = d.svg(1680, 660, ...parts,
    d.g("names", ...names),
    d.g("wrong",
      d.label(30, 0, o.wrong, { size: 32, color: C.gray, centerY: wy }),
      d.line(24, wy, 36 + w, wy, { color: C.gray, width: 2 }),
      d.arrow(60 + w, wy, 150 + w, wy, { color: C.gray, width: 2 }),
      d.label(170 + w, 0, "belongs in " + o.room, { size: 32, color: C.gray, centerY: wy })));
  const a = d.anim(id);
  a.step(a.show("names", { dur: 500 }));
  a.step(a.show("wrong", { dur: 500 }));
}

// Introduction: a funnel from the topic to the question.
sectionPage("fig-intro", {
  shape: "funnel",
  blocks: [
    { name: "the topic", text: [["milk competes on price in every supermarket."]] },
    { name: "what is known", text: [["earlier studies asked why people choose plant-based milk"], ["(", ["Dorina et al., 2025", C.white, true], ")."]] },
    { name: "the gap", text: [["but whether price limits differ with diet is not known."]] },
    { name: "your question", point: true, text: [["do price limits for milk differ by diet?"]] }],
  wrong: "vegetarians accept higher prices.", room: "the results" });

// Methods: a recipe, four equal steps.
sectionPage("fig-methods", {
  shape: "list",
  blocks: [
    { name: "data source", text: [["we reanalysed the milk and chocolate survey, an existing online"], ["survey of 2,809 adults in ", ["Germany", C.white, true], "."]] },
    { name: "measure and sample", text: [["619 respondents saw one of two milks and were asked from which"], ["price it would be too expensive; 611 named one."]] },
    { name: "cleaning", text: [["we left out 23 prices below 0.50 € or above 10 €, which can"], ["hardly be meant for a litre, so 588 remained."]] },
    { name: "analysis", point: true, text: [["we compared the median price limit of the diet groups."]] }],
  wrong: "the median is the middle value of a sorted list.", room: "a textbook" });

// Results: the finding, the pointer and figure 1 as the third block, 270
// high. The figure is a dot plot of the five medians on a pitch of 38 from
// 36 inside the panel, names right-aligned at 165 from the text column
// ("pescetarian" about 165), the axis from 1.80 € at 185 to 2.60 € at 905
// (900 per euro), n at 20 in a column at 945, tick labels at 20 under the
// plot and the caption under them.
(function () {
  const groups = [["vegetarian", 2.445, 28], ["vegan", 2.0, 17], ["flexitarian", 1.99, 166], ["omnivore", 1.99, 362], ["pescetarian", 1.99, 7]];
  const figure = (x0, y0) => {
    const X = (v) => x0 + 185 + (v - 1.8) * 900;
    const ry = (k) => y0 + 36 + 38 * k;
    return [
      ...[2.0, 2.5].map((v) => d.line(X(v), y0 + 16, X(v), y0 + 206, { color: C.gray, dashed: true })),
      ...[2.0, 2.5].map((v) => d.label(X(v), 0, v.toFixed(2) + " €", { size: 20, color: C.gray, anchor: "middle", centerY: y0 + 224 })),
      ...groups.map(([name, v, n], k) => [
        d.label(x0 + 165, 0, name, { size: 32, anchor: "end", centerY: ry(k) }),
        d.line(x0 + 185, ry(k), X(v), ry(k), { color: C.gray }),
        `<circle cx="${X(v)}" cy="${ry(k)}" r="9" fill="${C.white}"/>`,
        d.label(x0 + 945, 0, "n = " + n, { size: 20, color: C.gray, centerY: ry(k) })]).flat(),
      d.label(x0, 0, "figure 1. median price limit by diet", { size: 20, color: C.gray, centerY: y0 + 250 })].join("");
  };
  sectionPage("fig-results", {
    shape: "list",
    blocks: [
      { name: "the finding, with n", text: [["vegetarians named a median price limit of 2.45 € (n = 28),"], ["omnivores one of 1.99 € (n = 362)."]] },
      { name: "pointer to the figure", point: true, text: [["figure 1 shows all five diet groups."]] },
      { name: "the full picture", h: 270, figure }],
    wrong: "probably because they value animal welfare.", room: "the discussion" });
})();

// Discussion: an upside-down funnel, from the answer to what follows.
sectionPage("fig-discussion", {
  shape: "widen",
  blocks: [
    { name: "the answer", point: true, text: [["only vegetarians named higher price limits."]] },
    { name: "what it cannot say", text: [["whether this reflects concern for animals,"], ["the data cannot say."]] },
    { name: "limitations", text: [["only 28 vegetarians named a limit, and each"], ["respondent saw only one of two milks."]] },
    { name: "what follows", text: [["a larger sample should test whether the difference holds."]] }],
  wrong: "women named higher price limits than men.", room: "the results" });

/* --- slide: result or interpretation ---------------------------------------------------
 * Figure 1680 x 660 (has-punch). The sentence from the quiz at 48, one half
 * per line, centred on x 840 (y 70 and 150); a grey copy lies under it and
 * stays where it was when the halves move. Section 1: a yellow dashed cut
 * runs between the halves (y 110) and two rooms appear below, drawn like the
 * floor plan with a door in the left wall: results (x 4..816) and discussion
 * (x 864..1676), y 290..650, each with its name in grey at the top. Section
 * 2: the cut turns grey, each half shrinks to 0.62 and glides into its room,
 * then turns into a whole sentence of that room at 32 (three lines centred
 * on y 460, the longest about 600 of the 764 inside, clear of the door swing
 * at y 530..610). */
(function () {
  const room = (x, name) => [
    `<path d="M${x} 530 L${x} 290 L${x + 812} 290 L${x + 812} 650 L${x} 650 L${x} 610" fill="none" stroke="${C.light}" stroke-width="2"/>`,
    `<path d="M${x} 530 A80 80 0 0 1 ${x + 80} 610 M${x} 610 L${x + 80} 610" fill="none" stroke="${C.light}" stroke-width="2"/>`,
    d.label(x + 24, 0, name, { size: 32, color: C.gray, centerY: 330 })];
  const half1 = "vegetarians named a higher price limit,", half2 = "probably because they value animal welfare.";
  el("fig-split").innerHTML = d.svg(1680, 660,
    d.label(840, 0, half1, { size: 48, anchor: "middle", color: C.gray, centerY: 70 }),
    d.label(840, 0, half2, { size: 48, anchor: "middle", color: C.gray, centerY: 150 }),
    d.g("rooms", ...room(4, "results"), ...room(864, "discussion")),
    d.g("cut", d.line(60, 110, 1620, 110, { color: C.yellow, width: 3, dashed: true })),
    d.g("h1", d.label(840, 0, half1, { size: 48, anchor: "middle", centerY: 70 })),
    d.g("h2", d.label(840, 0, half2, { size: 48, anchor: "middle", centerY: 150 })),
    d.g("r1", d.label(40, 0, "vegetarians named a higher price limit\nthan omnivores, a median of 2.45 €\nagainst 1.99 € (n = 28 and 362).", { size: 32, centerY: 460 })),
    d.g("r2", d.label(900, 0, "this may reflect that they value\nanimal welfare, a reason the data\nthemselves do not show.", { size: 32, centerY: 460 })));
  const a = d.anim("fig-split");
  a.step(a.draw("cut", { dur: 900 }), a.show("rooms", { dur: 500 }));
  a.step(a.par(a.color('[data-a="cut"] line', "gray", { dur: 400 }),
      a.moveTo("h1", 410, 460, { dur: 1000 }), a.scale("h1", 0.62, { dur: 1000 }),
      a.moveTo("h2", 1270, 460, { dur: 1000 }), a.scale("h2", 0.62, { dur: 1000 })),
    a.par(a.swap("h1", "r1", { dur: 600 }), a.swap("h2", "r2", { dur: 600 })));
})();

/* --- slide: dissecting a real paper (Dorina et al. 2025) ---------------------------------
 * Figure 1680 x 804. The article as an outline in a grey frame (4..1000 x
 * 4..800): the title at 48, then its 16 headings at 32 on a pitch of 44 from
 * centre y 112, sections from x 90 and subsections in grey from x 130 (the
 * longest ends near x 840). The headings are the article's own. Step by step
 * a blue highlight marks a row; it is 39 high (size 28), so the two adjacent
 * marks keep 5 apart. A yellow numeral at x 46 gives the reading order and a
 * blue label on the right (from x 1080, at most about 480) says what to read
 * there; an arrow joins label and frame. With the first mark a grey note
 * at the top right says why these three: they are what to read first, in
 * this order. */
(function () {
  const rows = [
    ["abstract", 0, true], ["1. introduction", 0], ["1.1. theory of planned behaviour", 1], ["1.2. the current study", 1],
    ["2. materials and methods", 0], ["2.1. procedure", 1], ["2.2. participants", 1], ["2.3. measures", 1], ["2.4. data analysis", 1],
    ["3. results", 0], ["3.1. predicting intention", 1], ["3.2. predicting plant-based milk consumption", 1],
    ["4. discussion", 0], ["strengths and limitations", 1], ["5. conclusions", 0], ["references", 0, true]];
  const cy = (k) => 112 + 44 * k;
  const x = (k) => (rows[k][1] ? 130 : 90);
  const mark = (k, n, text) => [
    d.highlight(x(k), textWidth(rows[k][0]), cy(k), 28, { color: C.blue, opacity: 0.3 }),
    d.label(46, 0, String(n), { size: 32, anchor: "middle", color: C.yellow, centerY: cy(k) }),
    d.arrow(1066, cy(k), 1012, cy(k), { color: C.blue, width: 3 }),
    d.label(1080, 0, text, { size: 32, color: C.blue, centerY: cy(k) })];
  el("fig-paper").innerHTML = d.svg(1680, 804,
    d.box(4, 4, 996, 796, "", { border: C.gray, fill: "none" }),
    d.g("m1", d.label(1080, 0, "read these three first,\nin this order", { size: 32, color: C.gray, centerY: 112 }),
      ...mark(3, 1, "the question and hypotheses")),
    d.g("m2", ...mark(12, 2, "the answer, first paragraph")),
    d.g("m3", ...mark(13, 3, "the limitations")),
    d.label(90, 0, "health, environment or taste?", { size: 48, centerY: 52 }),
    ...rows.map(([t, sub, grey], k) => d.label(x(k), 0, t, { size: 32, centerY: cy(k), color: sub || grey ? C.gray : C.white })));
  const a = d.anim("fig-paper");
  ["m1", "m2", "m3"].forEach((m) => a.step(a.show(m, { dur: 500 })));
})();

/* --- slide: the paper in miniature ------------------------------------------------------
 * Figure 1680 x 804. The abstract of the example paper as running text at
 * 32, set from x 40 to at most x 1640 with the measured width of every word,
 * lines on a pitch of 100 from centre y 200, so that above each sentence
 * there is room for the name of the section it comes from (20, grey) and
 * under it for a thin underline. The newest sentence is underlined in
 * yellow; once the next one comes, it takes its own colour, blue and
 * grey-light in turn, like the name of its section above it. Bottom left, the word count grows with
 * the text; with the last sentence the usual length appears beside it. */
(function () {
  const sentences = [
    ["introduction", "milk competes on price, but whether price limits for milk differ by diet has not been asked."],
    ["methods", "we reanalysed an online survey of 2,809 adults in Germany and compared, across five diets, the price from which 588 of them found a milk too expensive."],
    ["results", "vegetarians named a median limit of 2.45 € (n = 28), the other four diets 1.99 € or 2.00 €."],
    ["discussion", "price limits may be higher among vegetarians, which a larger sample should test."]];
  const keep = (w) => w.replace(/[.,]$/, "") === "Germany";
  const X0 = 40, MAXW = 1600, size = 32, sp = textWidth(" ");
  const cy = (line) => 200 + 100 * line;
  // greedy line breaking over all words, each word tagged with its sentence
  const words = sentences.map(([, s], i) => s.split(" ").map((w) => ({ w, s: i }))).flat();
  const placed = [];
  let line = 0, x = X0;
  words.forEach((t) => {
    const w = textWidth(t.w, size, keep(t.w));
    if (x > X0 && x + w > X0 + MAXW) { line++; x = X0; }
    placed.push({ ...t, x, line, width: w });
    x += w + sp;
  });
  // each sentence keeps its own colour once the next one comes, blue and
  // grey-light in turn, so that sentences that meet on one line stay apart
  const own = (i) => (i % 2 === 0 ? C.blue : C.light);
  const groups = sentences.map(([room], i) => {
    const mine = placed.filter((p) => p.s === i);
    const out = [d.label(mine[0].x, 0, room, { size: 20, color: own(i), centerY: cy(mine[0].line) - 40 })];
    const unders = [];
    [...new Set(mine.map((p) => p.line))].forEach((ln) => {
      const seg = mine.filter((p) => p.line === ln);
      const x1 = seg[0].x, x2 = seg[seg.length - 1].x + seg[seg.length - 1].width;
      out.push(`<text x="${x1}" y="${cy(ln) + size * 0.35}" font-family="${family}" font-size="${size}" fill="${C.white}">` +
        seg.map((p) => (keep(p.w) ? `<tspan class="keep-case">${esc(p.w)}</tspan>` : esc(p.w))).join(" ") + `</text>`);
      unders.push(d.line(x1, cy(ln) + 26, x2, cy(ln) + 26, { color: C.yellow, width: 3 }));
    });
    return d.g("s" + i, ...out, d.g("u" + i, ...unders));
  });
  // words are what holds a letter or a digit; "2.45 €" counts once
  const count = (i) => sentences.slice(0, i + 1).reduce((n, [, s]) => n + s.split(" ").filter((w) => /[\p{L}\p{N}]/u.test(w)).length, 0);
  el("fig-abstract").innerHTML = d.svg(1680, 804, ...groups,
    d.g("wc", d.label(40, 0, count(0) + " words", { size: 32, color: C.gray, centerY: 690 })),
    d.g("norm", d.label(300, 0, "150 to 250 words are usual, and the abstract is written last", { size: 32, color: C.gray, centerY: 690 })));
  const a = d.anim("fig-abstract");
  for (let i = 1; i < sentences.length; i++) {
    const items = [a.color(`[data-a="u${i - 1}"] line`, own(i - 1), { dur: 400 }), a.show("s" + i, { dur: 500 }),
      a.count("wc", count(i), { from: count(i - 1), suffix: " words", dur: 600 })];
    if (i === sentences.length - 1) items.push(a.show("norm", { dur: 500 }));
    a.step(a.par(...items));
  }
})();
