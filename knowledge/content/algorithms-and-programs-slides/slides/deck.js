// Drawings and animations of "algorithms and programs".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80); the loop drawing is 460
// wide and sits beside the code in a box exactly that wide. Figures without an animation
// are redrawn per build-up step (data-on-show, data-on-step); animated ones
// are drawn once when the deck loads.
//
// Real colours: several drawings show what the LED shows, so red, green, blue
// and yellow there stand for light and not for a role. Labels in those
// drawings are white or gray. The one exception is the yellow marker of the
// current line or the current moment in "the list at work" and in the two
// timelines: it marks a single element in a colour the LED does not show on
// those slides (red and blue only), so it cannot be read as light.
"use strict";

const d = window.draw;
const $ = (id) => document.getElementById(id);
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; return svg; };

// one character of the code font is 0.6 em wide
const cw = (size) => size * 0.6;

function circle(cx, cy, r, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

// a bar on a timeline: a thick line with square ends, so draw() lets it grow
// from left to right like time passing
function bar(x1, x2, cy, h, color) {
  return `<line x1="${x1}" y1="${cy}" x2="${x2}" y2="${cy}" stroke="${color}" stroke-width="${h}"/>`;
}

/* A line of code, set at its centre height. SVG text drops leading blanks, so
 * the indentation becomes an x offset. `spans` colours parts of the line:
 * [[from, to, color], ...] with character indices into the line; the rest
 * takes o.color. Each piece is placed at its own column, so the pieces line up
 * exactly as one line would. */
function codeLine(x, cy, line, o = {}) {
  const size = o.size || 32, base = o.color || d.colors().white;
  const cuts = [];
  let at = 0;
  (o.spans || []).slice().sort((p, q) => p[0] - q[0]).forEach(([from, to, color]) => {
    if (from > at) cuts.push([at, from, base]);
    cuts.push([from, to, color]);
    at = to;
  });
  if (at < line.length) cuts.push([at, line.length, base]);
  return cuts.map(([from, to, color]) => {
    const text = line.slice(from, to);
    const lead = text.length - text.trimStart().length;
    if (!text.trim()) return "";
    return d.label(x + (from + lead) * cw(size), 0, text.trim(),
      { size, mono: true, keepCase: true, color, centerY: cy });
  }).join("");
}

/* --- bubble sort on six bars ----------------------------------------------------
 * Bars 120 wide, 180 apart: 6 x 120 + 5 x 60 = 1020, so the row starts at
 * (1680 - 1020) / 2 = 330, and a swap moves a bar by 180. Heights 62 per unit
 * on a base line at 470, so the tallest (6) reaches up to 98. The start order
 * 2 5 1 6 3 4 needs two passes with three swaps each and a third without one.
 * A comparison turns both bars yellow (current), a swap slides them past each
 * other. One segment per pass, at most 2.6 s. Forward only: sorting run
 * backwards would only unsort. */
(function () {
  if (!$("fig-bubble")) return;
  const c = d.colors();
  const start = [2, 5, 1, 6, 3, 4];
  const x0 = 330, step = 180, bw = 120, base = 470, unit = 62;

  // run the rules first, to know what each pass does
  const order = start.slice(), passes = [];
  for (;;) {
    const moves = [];
    for (let i = 0; i < order.length - 1; i += 1) {
      const swap = order[i] > order[i + 1];
      moves.push({ l: "b" + order[i], r: "b" + order[i + 1], swap });
      if (swap) [order[i], order[i + 1]] = [order[i + 1], order[i]];
    }
    passes.push(moves);
    if (!moves.some((m) => m.swap)) break;
  }

  // the tally of each pass below the row: 330, 750, 1170; the longest,
  // "pass 3: no swap, done", is 21 x 32 x 0.6 = 403 wide and ends at 1573
  const tally = passes.map((moves, k) => {
    const n = moves.filter((m) => m.swap).length;
    const last = k === passes.length - 1;
    const text = last ? `pass ${k + 1}: no swap, done` : `pass ${k + 1}: ${n} swaps`;
    return d.g("t" + k, d.label(330 + k * 420, 0, text, { size: 32, color: last ? c.green : c.gray, centerY: 560 }));
  });
  $("fig-bubble").innerHTML = d.svg(1680, 620,
    ...start.map((v, i) => d.g("b" + v,
      d.box(x0 + i * step, base - v * unit, bw, v * unit, "", { border: c.light, width: 3, rx: 6 }))),
    ...tally);

  const a = d.anim("fig-bubble");
  passes.forEach((moves, k) => {
    const items = [];
    moves.forEach(({ l, r, swap }) => {
      items.push(a.par(a.color(l, "yellow", { dur: 120 }), a.color(r, "yellow", { dur: 120 })));
      items.push(swap ? a.par(a.move(l, step, 0, { dur: 320 }), a.move(r, -step, 0, { dur: 320 })) : a.wait(80));
      items.push(a.par(a.color(l, "gray-light", { dur: 120 }), a.color(r, "gray-light", { dur: 120 })));
    });
    if (k === passes.length - 1) items.push(a.par(...start.map((v) => a.color("b" + v, "green", { dur: 400 }))));
    items.push(a.show("t" + k, { dur: 250 }));
    a.step(...items);
  });
})();

/* --- the list at work -------------------------------------------------------------
 * The program in a box 920 x 520 at (100, 40), code in 48: the widest line,
 * "from lifi_hardware import led", is 29 x 28.8 = 835 from x 140 to 975, which
 * leaves 45 to the right edge at 1020. Seven lines 64.8 apart, centres from
 * 105.6 to 494.4, so the text reaches from 81.6 to 518.4 and keeps 41.6 to the
 * top and to the bottom of the box. The two import lines stay gray, the four
 * instructions run. To the right of each instruction its effect (from 1060,
 * "waits one second" is 16 x 19.2 = 307 wide and ends at 1367), then the LED
 * at 1520 and the time below it.
 * One segment per line, each at most 1.4 s. Forward only: the lines run from
 * top to bottom, and running them backwards would tell the opposite. */
(function () {
  if (!$("fig-list")) return;
  const c = d.colors();
  const lines = ["import time", "from lifi_hardware import led", "",
    "led.set_color(255, 0, 0)", "time.sleep(1)", "led.set_color(0, 0, 255)", "time.sleep(1)"];
  const effects = { 3: "turns red", 4: "waits one second", 5: "turns blue", 6: "waits one second" };
  const cy = (i) => 105.6 + i * 64.8;
  const code = lines.map((line, i) => {
    if (!line) return "";
    const set = codeLine(140, cy(i), line, { size: 48, color: i < 2 ? c.gray : c.white });
    return i < 2 ? set : d.g("l" + i, set);
  });
  $("fig-list").innerHTML = d.svg(1680, 600,
    d.box(100, 40, 920, 520, "", { border: c.dark, width: 2, rx: 10 }),
    // the current line: 24 x 28.8 = 691 wide, the width of the longest instruction
    d.g("cursor", d.highlight(140, 691, cy(3), 48)),
    ...code,
    ...Object.entries(effects).map(([i, text]) =>
      d.g("e" + i, d.label(1060, 0, text, { size: 32, color: c.gray, centerY: cy(Number(i)) }))),
    d.label(1520, 0, "LED", { size: 32, color: c.gray, anchor: "middle", keepCase: true, centerY: 130 }),
    d.g("led", circle(1520, 260, 70, c.dark)),
    d.label(1520, 0, "time", { size: 32, color: c.gray, anchor: "middle", centerY: 400 }),
    d.g("time", d.label(1520, 0, "0.0 s", { size: 48, color: c.white, anchor: "middle", mono: true, centerY: 460 })));

  const a = d.anim("fig-list");
  const go = (i) => a.par(
    i === 3 ? a.show("cursor", { dur: 250 }) : a.move("cursor", 0, 64.8, { dur: 350 }),
    i > 3 ? a.color("l" + (i - 1), "white", { part: "text", dur: 250 }) : a.wait(0),
    a.color("l" + i, "yellow", { part: "text", dur: 250 }),
    a.show("e" + i, { dur: 300 }));
  // the line and its effect together: the LED changes while its line lights up,
  // and the clock runs while a sleep line is the current one
  a.step(a.par(go(3), a.color("led", "red", { part: "fill", dur: 250 })));
  a.step(a.par(go(4), a.count("time", 1, { from: 0, decimals: 1, suffix: " s", dur: 1000, ease: "linear" })));
  a.step(a.par(go(5), a.color("led", "blue", { part: "fill", dur: 250 })));
  a.step(a.par(go(6), a.count("time", 2, { from: 1, decimals: 1, suffix: " s", dur: 1000, ease: "linear" })));
})();

/* --- one line: which thing, what happens to it, with which values -------------------
 * The line in 48, 24 x 28.8 = 691 wide, centred: from 494.4. Each note hangs
 * below the middle of its part, one row lower than the one before, so the
 * pointers never cross a note: "which thing" (11 x 19.2 = 211 around 537) ends
 * at 643, left of the pointer at 724; "what to do with it" (346 around 724)
 * ends at 897, left of the pointer at 1027. */
window.drawAnatomy = function (_slide, step = 0) {
  const c = d.colors();
  const size = 48, w = cw(size), cy = 120;
  const parts = [
    { text: "led", note: "which thing" },
    { text: ".set_color", note: "what to do with it" },
    { text: "(255, 0, 0)", note: "with which values" },
  ];
  let x = (1680 - 24 * w) / 2;
  const out = [];
  parts.forEach((p, i) => {
    const pw = p.text.length * w, mid = x + pw / 2;
    const active = step === i + 1;
    if (active) out.push(d.highlight(x, pw, cy, size));
    out.push(d.label(x, 0, p.text, { size, mono: true, keepCase: true, color: active ? c.yellow : c.white, centerY: cy }));
    if (step >= i + 1) {
      const ny = 250 + i * 90;
      out.push(d.line(mid, cy + 44, mid, ny - 26, { color: c.gray, width: 2 }));
      out.push(d.label(mid, 0, p.note, { size: 32, color: active ? c.yellow : c.light, anchor: "middle", centerY: ny }));
    }
    x += pw;
  });
  return put("fig-anatomy", d.svg(1680, 480, ...out));
};

/* --- same instruction, different values -----------------------------------------
 * Three calls in 48, the instruction in gray, the values in white; the widest,
 * "led.set_color(255, 255, 0)", is 26 x 28.8 = 749 wide from 310 to 1059.
 * Beside each the LED in the colour it shows (radius 45 around 1175) and the
 * name of the colour from 1255 ("yellow" ends at 1370): the composition
 * spans 310 to 1370 around the middle at 840. */
function drawValues() {
  const c = d.colors();
  const rows = [
    { values: "255, 0, 0", color: c.red, name: "red" },
    { values: "0, 0, 255", color: c.blue, name: "blue" },
    { values: "255, 255, 0", color: c.yellow, name: "yellow" },
  ];
  const out = [];
  rows.forEach((row, i) => {
    const cy = 90 + i * 150;
    const line = `led.set_color(${row.values})`;
    out.push(codeLine(310, cy, line, { size: 48, color: c.light, spans: [[14, 14 + row.values.length, c.white]] }));
    out.push(circle(1175, cy, 45, row.color));
    out.push(d.label(1255, 0, row.name, { size: 32, color: c.gray, centerY: cy }));
  });
  return put("fig-values", d.svg(1680, 480, ...out));
}

/* --- two programs against the clock -----------------------------------------------
 * Two columns 700 wide at x 100 and 880. In each: the heading, the program in
 * a box 700 x 230 (code in 32, lines 43.2 apart, the first centred at 110 in
 * both boxes so the lines can be compared across), then the LED (radius 30
 * around x + 35) and a timeline from x + 100 to x + 700, 300 per second,
 * 0 to 2 s. A segment of the LED that lasts a millisecond is 0.3 wide and is
 * drawn 3 wide, on top of its neighbour, so it can be seen at all.
 * Two segments in real time: half a second, where the two LEDs already
 * differ, then the rest up to two seconds and the result. Forward only: time
 * does not run backwards on the LED. */
function drawTimelines(id, spec) {
  if (!$(id)) return;
  const c = d.colors();
  const xs = [100, 880], pxs = 300, split = 0.5;
  const tx = (x, t) => x + 100 + t * pxs;
  const pieces = [];
  const parts = [], slivers = [], labels = [];   // slivers drawn after the bars, on top
  xs.forEach((x, k) => {
    labels.push(d.label(x, 0, spec.heads[k], { size: 32, color: c.gray, centerY: 30 }));
    parts.push(d.box(x, 60, 700, 230, "", { border: c.dark, width: 2, rx: 10 }));
    spec.code[k].forEach((line, i) => labels.push(codeLine(x + 30, 110 + i * 43.2, line, { size: 32 })));
    parts.push(d.g("led" + k, circle(x + 35, 360, 30, c.dark)));
    parts.push(d.line(tx(x, 0), 391, tx(x, 2), 391, { color: c.dark, width: 2 }));
    [0, 1, 2].forEach((t) => {
      parts.push(d.line(tx(x, t), 391, tx(x, t), 401, { color: c.gray, width: 2 }));
      labels.push(d.label(tx(x, t), 0, t + " s", { size: 20, color: c.gray, anchor: "middle", mono: true, centerY: 422 }));
    });
    spec.segs[k].forEach((s, j) => {
      const cut = s.from < split && s.to > split ? [[s.from, split], [split, s.to]] : [[s.from, s.to]];
      cut.forEach(([from, to], h) => {
        const name = `p${k}-${j}-${h}`;
        const sliver = (to - from) * pxs < 3;
        const svg = d.g(name, bar(tx(x, from), sliver ? tx(x, from) + 3 : tx(x, to), 360, 54, c[s.color]));
        (sliver ? slivers : parts).push(svg);
        pieces.push({ k, name, from, to, color: s.color });
      });
    });
    labels.push(d.g("cur" + k, d.line(tx(x, 0), 322, tx(x, 0), 398, { color: c.yellow, width: 4 })));
    labels.push(d.g("res" + k, d.label(x, 0, spec.results[k], { size: 32, color: c.white, centerY: 480 })));
  });
  if (spec.note) labels.push(d.g("note", d.label(840, 0, spec.note, { size: 32, color: c.gray, anchor: "middle", keepCase: true, centerY: 550 })));
  $(id).innerHTML = d.svg(1680, 600, ...parts, ...slivers, ...labels);

  const a = d.anim(id);
  const phase = (ps, pe) => a.par(...xs.map((x, k) => {
    const items = [];
    let now = ps;
    pieces.filter((p) => p.k === k && p.from >= ps && p.from < pe).forEach((p) => {
      if (p.from > now) items.push(a.wait((p.from - now) * 1000));
      items.push(a.par(a.color("led" + k, p.color, { part: "fill", dur: 1 }),
        a.draw(p.name, { dur: Math.max(1, (p.to - p.from) * 1000), ease: "linear" })));
      now = p.to;
    });
    const end = spec.ends && spec.ends[k];
    if (end !== undefined && end > ps && end <= pe) {
      if (end > now) items.push(a.wait((end - now) * 1000));
      items.push(a.color("led" + k, "gray-dark", { part: "fill", dur: 1 }));
    }
    return a.par(a.seq(...items), a.move("cur" + k, (pe - ps) * pxs, 0, { dur: (pe - ps) * 1000, ease: "linear" }));
  }));
  a.step(phase(0, split));
  a.step(phase(split, 2),
    a.par(a.show("res0", { dur: 300 }), a.show("res1", { dur: 300 }), ...(spec.note ? [a.show("note", { dur: 300 })] : [])));
}

drawTimelines("fig-pause", {
  heads: ["a pause between the colours", "no pause between them"],
  code: [
    ["led.set_color(255, 0, 0)", "time.sleep(1)", "led.set_color(0, 0, 255)", "time.sleep(1)"],
    ["led.set_color(255, 0, 0)", "led.set_color(0, 0, 255)", "time.sleep(2)"],
  ],
  segs: [
    [{ from: 0, to: 1, color: "red" }, { from: 1, to: 2, color: "blue" }],
    [{ from: 0, to: 0.001, color: "red" }, { from: 0.001, to: 2, color: "blue" }],
  ],
  results: ["you see red, then blue.", "you only see blue."],
});

// The course module switches the LED off when a program ends, so here the
// last colour lasts only as long as the program still runs.
drawTimelines("fig-order", {
  heads: ["pause in the middle", "pause at the end"],
  code: [
    ["led.set_color(255, 0, 0)", "time.sleep(1)", "led.set_color(0, 0, 255)"],
    ["led.set_color(255, 0, 0)", "led.set_color(0, 0, 255)", "time.sleep(1)"],
  ],
  segs: [
    [{ from: 0, to: 1, color: "red" }, { from: 1, to: 1.001, color: "blue" }],
    [{ from: 0, to: 0.001, color: "red" }, { from: 0.001, to: 1, color: "blue" }],
  ],
  ends: [1.001, 1],
  results: ["you see red.", "you see blue."],
  // 59 x 32 x 0.6 = 1133 wide around 840
  note: "after the last line the program ends, and the LED goes off.",
});

/* --- the loop, unrolled in time ---------------------------------------------------
 * 460 wide, the width of its box beside the code, which stands exactly as on
 * the slide before. Time runs downwards on an axis at x 64 from 20 to 500, 120
 * per second, with its seconds left of it, ending at 44. A pass is a bar from
 * 70 to 150 in the colour the LED shows, with its number and its values right
 * of it from 180 (the widest, "255, 255, 0", is 11 x 12 = 132). The passes
 * follow each other on their own once started (auto), one second each as on
 * the device. No marker for "now": one of the colours is yellow. Forward
 * only, like time. */
(function () {
  if (!$("fig-loop")) return;
  const c = d.colors();
  const ty = (t) => 20 + t * 120;
  const passes = [
    { color: c.red, values: "255, 0, 0" },
    { color: c.green, values: "0, 255, 0" },
    { color: c.blue, values: "0, 0, 255" },
    { color: c.yellow, values: "255, 255, 0" },
  ];
  const parts = [d.line(64, ty(0), 64, ty(4), { color: c.dark, width: 2 })];
  for (let t = 0; t <= 4; t += 1) {
    parts.push(d.line(54, ty(t), 64, ty(t), { color: c.gray, width: 2 }));
    parts.push(d.label(44, 0, t + " s", { size: 20, color: c.gray, anchor: "end", mono: true, centerY: ty(t) }));
  }
  passes.forEach((p, k) => {
    const mid = ty(k + 0.5);
    parts.push(d.g("n" + k, d.label(180, 0, "pass " + (k + 1), { size: 20, color: c.gray, mono: true, centerY: mid - 16 })));
    parts.push(d.g("p" + k, `<line x1="110" y1="${ty(k) + 3}" x2="110" y2="${ty(k + 1) - 3}" stroke="${p.color}" stroke-width="80"/>`));
    parts.push(d.g("v" + k, d.label(180, 0, p.values, { size: 20, color: c.light, mono: true, centerY: mid + 16 })));
  });
  parts.push(d.g("sum", d.label(4, 0, "four passes, four seconds", { size: 32, color: c.gray, centerY: 560 })));
  $("fig-loop").innerHTML = d.svg(460, 600, ...parts);

  const a = d.anim("fig-loop", { auto: true, gap: 150 });
  passes.forEach((_, k) => {
    a.step(a.par(a.show("n" + k, { dur: 150 }), a.show("v" + k, { dur: 150 })),
      a.draw("p" + k, { dur: 1000, ease: "linear" }),
      ...(k === 3 ? [a.show("sum", { dur: 300 })] : []));
  });
})();

/* --- what does it cost: two correct procedures ------------------------------------
 * Names from 180 in 48 ("ask every number", 16 x 24 = 384 at most, ends near
 * 570), the counts centred at 900 and 1300, the rule under the head from 180
 * to 1440. The better procedure is green, as a verdict. */
function drawCost() {
  const c = d.colors();
  const out = [
    d.label(900, 0, "100 numbers", { size: 32, color: c.gray, anchor: "middle", centerY: 60 }),
    d.label(1300, 0, "1000 numbers", { size: 32, color: c.gray, anchor: "middle", centerY: 60 }),
    d.line(180, 100, 1440, 100, { color: c.dark, width: 2 }),
  ];
  [
    { name: "ask every number", a: "99", b: "999", color: c.light },
    { name: "halve the range", a: "7", b: "10", color: c.green },
  ].forEach((row, i) => {
    const cy = 170 + i * 110;
    out.push(d.label(180, 0, row.name, { size: 48, color: row.color, centerY: cy }));
    out.push(d.label(900, 0, row.a, { size: 48, color: row.color, anchor: "middle", mono: true, centerY: cy }));
    out.push(d.label(1300, 0, row.b, { size: 48, color: row.color, anchor: "middle", mono: true, centerY: cy }));
  });
  out.push(d.label(840, 0, "both find the number, but only one of them stays fast as the range grows.",
    { size: 32, color: c.gray, anchor: "middle", centerY: 410 }));
  return put("fig-cost", d.svg(1680, 460, ...out));
}

/* --- an error message, read line by line --------------------------------------------
 * The traceback exactly as Python 3.12 and later print it, in 32 from x 60:
 * the longest line is 78 x 19.2 = 1498 wide and ends at 1558. Lines 56 apart.
 * Each step marks one place with d.highlight and names it in yellow; earlier
 * notes stay in gray. Notes for lines 1 and 2 from 1010 (line 1 ends at 943),
 * the note for the last line below it. */
window.drawError = function (_slide, step = 0) {
  const c = d.colors();
  const size = 32, w = cw(size), x0 = 60;
  const lines = [
    "Traceback (most recent call last):",
    '  File "C:\\lifi\\blink.py", line 5, in <module>',
    "    time.slep(1)",
    "    ^^^^^^^^^",
    "AttributeError: module 'time' has no attribute 'slep'. Did you mean: 'sleep'?",
  ];
  const cy = (i) => 50 + i * 56;
  const range = (i, text) => { const at = lines[i].indexOf(text); return [at, at + text.length]; };
  const marks = [
    { line: 1, ranges: [range(1, '"C:\\lifi\\blink.py", line 5')], note: "which file, and which line", at: [1010, cy(1)] },
    { line: 2, ranges: [range(2, "time.slep(1)")], note: "what stands there", at: [1010, cy(2)] },
    { line: 4, ranges: [range(4, "'slep'"), range(4, "'sleep'")], note: "what does not exist, and what Python guesses you meant", at: [x0, 350] },
  ];
  const out = [];
  const spans = {};
  marks.forEach((m, k) => {
    if (step !== k + 1) return;
    m.ranges.forEach(([from, to]) => out.push(d.highlight(x0 + from * w, (to - from) * w, cy(m.line), size)));
    spans[m.line] = m.ranges.map(([from, to]) => [from, to, c.yellow]);
  });
  lines.forEach((line, i) => out.push(codeLine(x0, cy(i), line, { size, color: i === 4 ? c.white : c.light, spans: spans[i] })));
  marks.forEach((m, k) => {
    if (step < k + 1) return;
    out.push(d.label(m.at[0], 0, m.note, { size: 32, color: step === k + 1 ? c.yellow : c.gray, keepCase: true, centerY: m.at[1] }));
  });
  return put("fig-error", d.svg(1680, 400, ...out));
};

/* --- two ways to ask ------------------------------------------------------------------
 * Two prompts 1400 wide from 140, written left aligned from 180 in the code
 * font. The second prompt's longer line is 51 x 19.2 = 979 wide. The verdict
 * sits 44 above each box's lower edge, the text block centred above it:
 * box 1 is 150 high (line at 73), box 2 190 high (lines at 332.2 and 373.8). */
window.drawAsk = function (_slide, step = 0) {
  const c = d.colors();
  const x = 140, w = 1400;
  const out = [
    d.verdict(x, 20, w, 150, "", step >= 1 ? false : null, { border: c.light, width: 3 }),
    codeLine(x + 40, 73, "write me a program for the LED.", { color: step >= 1 ? c.light : c.white }),
    d.label(x, 0, "this gets you code.", { size: 32, color: c.gray, centerY: 215 }),
  ];
  if (step >= 1) {
    out.push(d.verdict(x, 280, w, 190, "", true, { width: 3 }));
    out.push(codeLine(x + 40, 332.2, "the LED should be red for three seconds, then blue."));
    out.push(codeLine(x + 40, 373.8, "explain each line before you write it."));
    out.push(d.label(x, 0, "this gets you understanding.", { size: 32, color: c.gray, centerY: 515 }));
  }
  return put("fig-ask", d.svg(1680, 560, ...out));
};

// --- start ---------------------------------------------------------------------------
drawValues();
drawCost();
