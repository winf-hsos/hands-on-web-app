// Drawings and animations of "solving problems with computers".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80): 700 high on a slide
// without a punchline, 620 with one. Figures without an animation are redrawn
// per build-up step (data-on-show, data-on-step); animated ones are drawn once
// when the deck loads, and their segments are the build-up steps.
// Widths of text are estimated as characters x size x 0.6.
"use strict";

const d = window.draw;
const $ = (id) => document.getElementById(id);
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; return svg; };
const W = 1680, H = 700, HP = 620;

function circle(x, y, r, fill) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}

// Five colour symbols as the sender emits them. These are real colours of
// light, so every label next to them stays white or gray.
function colourSequence(x0, y, r, gap) {
  const c = d.colors();
  return [c.red, c.blue, c.green, c.blue, c.red].map((col, i) => circle(x0 + i * (2 * r + gap), y, r, col)).join("");
}

/* --- shared geometry of the single IPO box -----------------------------------
 * The box spans 600..1080, the arrows run from 420 to its left edge and from
 * its right edge to 1260, input and output sit centred at 300 and 1380. The
 * slides "a box with clear edges", "the sender" and "what enters the receiver"
 * use the same numbers (axis 270, box 165..375), so nothing moves between them. */
const AX = 270, BY = 165, BH = 210, CAP = 445;

function ioFrame(inside, o = {}) {
  const c = d.colors();
  return {
    wires: [
      d.arrow(420, AX, 600, AX, { color: c.light, width: 4, head: 20 }),
      d.arrow(1080, AX, 1260, AX, { color: c.light, width: 4, head: 20 }),
    ],
    box: d.box(600, BY, 480, BH, inside, { border: c.white, size: 48, mono: true, width: 4, rx: 12, ...o }),
  };
}

const caption = (x, text) => d.label(x, 0, text, { size: 32, color: d.colors().gray, anchor: "middle", centerY: CAP });

/* --- the shape: input, processing, output (still, build-up) -------------------- */
window.drawIpoReveal = function (_slide, step = 0) {
  const c = d.colors();
  const mid = 310;
  const wires = [
    d.arrow(420, mid, 600, mid, { color: c.light, width: 4, head: 20 }),
    d.arrow(1080, mid, 1260, mid, { color: c.light, width: 4, head: 20 }),
  ];
  const boxes = [d.box(600, 200, 480, 220, step >= 2 ? "processing" : "", { border: c.white, size: 48, width: 4, rx: 12 })];
  const labels = [];
  if (step >= 1) {
    labels.push(d.label(300, 0, "input", { size: 48, anchor: "middle", centerY: mid }));
    labels.push(d.label(1380, 0, "output", { size: 48, anchor: "middle", centerY: mid }));
  }
  if (step >= 3) {
    labels.push(d.label(840, 0, "IPO", { size: 48, anchor: "middle", keepCase: true, centerY: 540 }));
    labels.push(d.label(840, 0, "input, processing, output", { size: 32, color: c.gray, anchor: "middle", centerY: 605 }));
  }
  return put("fig-ipo-reveal", d.svg(W, H, ...d.layers(wires, boxes, labels)));
};

/* --- a test runs through add() ---------------------------------------------------
 * Segment 1 writes the expectation above the output. Segment 2 runs the test:
 * a yellow copy of "2, 3" travels into the box (it passes under the box, which
 * is filled with the background), the box lights up, and "5" travels out from
 * under the box to the output, where the check appears. Segment 3 shows the
 * same test against a box that returns 6. Forward only: data running back
 * into the box would tell something wrong.
 * "pass" ends at 1550 + 4 x 19.2 = 1627, inside the 1680. */
(function () {
  if (!$("fig-add-test")) return;
  const c = d.colors();
  const f = ioFrame("add()");
  const value = (x, text, o = {}) => d.label(x, 0, text, { size: 48, mono: true, anchor: "middle", centerY: AX, ...o });
  const hidden = [
    d.g("route-in", d.line(300, AX, 840, AX, { color: "none" })),
    d.g("route-out", d.line(840, AX, 1380, AX, { color: "none" })),
    d.g("token", value(300, "2, 3", { color: c.yellow })),
    d.g("out5", value(840, "5", { color: c.yellow })),
  ];
  const labels = [
    value(300, "2, 3"),
    d.g("q", value(1380, "?", { color: c.gray })),
    d.g("out6", value(1380, "6", { color: c.red })),
    d.g("expected",
      d.label(1380, 0, "expected", { size: 32, color: c.gray, anchor: "middle", centerY: 70 }),
      value(1380, "5", { centerY: 120 })),
    d.g("pass", d.mark(1515, AX, true), d.label(1550, 0, "pass", { size: 32, color: c.green, centerY: AX })),
    d.g("fail", d.mark(1515, AX, false), d.label(1550, 0, "fail", { size: 32, color: c.red, centerY: AX })),
    caption(300, "input"), caption(840, "processing"), caption(1380, "actual output"),
  ];
  $("fig-add-test").innerHTML = d.svg(W, HP, ...f.wires, ...hidden, d.g("box", f.box), ...labels);
  const a = d.anim("fig-add-test");
  a.set("out6", { opacity: 0 });
  a.set("fail", { opacity: 0 });
  a.set("pass", { opacity: 0 });
  a.step(a.show("expected", { dur: 500 }));
  a.step(a.show("token", { dur: 200 }),
    a.along("token", "route-in", { dur: 700 }),
    a.color("box", "yellow", { dur: 200 }),
    a.color("box", "white", { dur: 200 }),
    a.par(a.hide("q", { dur: 300 }), a.along("out5", "route-out", { dur: 700 })),
    a.par(a.color("out5", "white", { part: "text", dur: 300 }), a.show("pass", { dur: 300 })));
  a.step(a.par(a.swap("out5", "out6", { dur: 500 }), a.swap("pass", "fail", { dur: 500 })));
})();

/* --- the sender (still) ----------------------------------------------------------
 * Five symbols of radius 24 with 14 between them start at 1304, so the row
 * spans 1280..1576 and keeps 20 clear of the arrow's tip at 1260; its caption
 * sits under the middle symbol at 1428. */
(function () {
  if (!$("fig-sender")) return;
  const f = ioFrame("encode()");
  put("fig-sender", d.svg(W, HP, ...d.layers(f.wires, [f.box], [
    d.label(300, 0, '"hi"', { size: 48, mono: true, anchor: "middle", centerY: AX }),
    colourSequence(1304, AX, 24, 14),
    caption(300, "text"), caption(840, "program"), caption(1428, "colours"),
  ])));
})();

/* --- what enters the receiver ----------------------------------------------------
 * Segment 1: the sensor measures the red light, and in its place four readings
 * count up from zero. They stand left-aligned in one block around the input
 * point 300: "r = 203" is 7 x 19.2 = 134 wide, so the block runs from 233 to
 * 367, clear of the arrow at 420; four lines 45 apart centred on 270.
 * Segment 2: the readings are processed by the decision rule, and "red" comes
 * out from under the box. Forward only, a measurement does not turn back into
 * light. */
(function () {
  if (!$("fig-receiver")) return;
  const c = d.colors();
  const f = ioFrame("classify()");
  const readings = [["r", 203], ["g", 41], ["b", 57], ["c", 310]].map(([name, v], k) => {
    const cy = AX - 67.5 + k * 45;
    return d.label(233, 0, name + " =", { size: 32, mono: true, centerY: cy }) +
      d.g("v-" + name, d.label(367, 0, "0", { size: 32, mono: true, anchor: "end", centerY: cy }));
  });
  $("fig-receiver").innerHTML = d.svg(W, HP,
    ...f.wires,
    d.g("route-out", d.line(840, AX, 1380, AX, { color: "none" })),
    d.g("out", d.label(840, 0, '"red"', { size: 48, mono: true, anchor: "middle", color: c.yellow, centerY: AX })),
    d.g("box", f.box),
    d.g("light", circle(300, AX, 76, c.red)),
    d.g("cap-light", caption(300, "red light")),
    d.g("numbers", ...readings),
    d.g("cap-numbers", caption(300, "four readings")),
    caption(840, "a decision rule"));
  const a = d.anim("fig-receiver");
  a.set("numbers", { opacity: 0 });
  a.set("cap-numbers", { opacity: 0 });
  a.step(a.par(a.swap("light", "numbers", { dur: 500 }), a.swap("cap-light", "cap-numbers", { dur: 500 })),
    a.par(...["r", "g", "b", "c"].map((n, k) => a.count("v-" + n, [203, 41, 57, 310][k], { from: 0, dur: 1200 }))));
  a.step(a.color("box", "yellow", { dur: 250 }),
    a.color("box", "white", { dur: 250 }),
    a.along("out", "route-out", { dur: 800 }),
    a.color("out", "white", { part: "text", dur: 300 }));
})();

/* --- same reading, two rules (still, build-up) -------------------------------------
 * Input box 40..400 x 160..460 (centre 310) with four readings: "r = 40" is
 * 6 x 19.2 = 115 wide, left edge 40 + (360 - 115) / 2 = 162; lines 50 apart
 * around 310, so 59 stay free above and below the text.
 * Rule boxes 620..1160 (540 wide), 130 high around 210 and 410. The longest
 * line, "else: largest of r, g, b", is 24 x 19.2 = 461, left edge
 * 620 + (540 - 461) / 2 = 660; two lines 42 apart leave 28 above and below.
 * Outputs left-aligned behind the arrows at 1330 ('"off"' ends at 1474), marks
 * at 1570. The wire leaves the input at 400, branches at 500 and is drawn
 * behind the boxes. */
window.drawRule = function (_slide, step = 0) {
  const c = d.colors();
  const rows = [
    { cy: 210, limit: "100", out: '"off"', ok: false },
    { cy: 410, limit: "50", out: '"red"', ok: true },
  ].slice(0, step >= 1 ? 2 : 1);
  const wires = [d.line(400, 310, 500, 310, { color: c.light, width: 3 })];
  const boxes = [d.box(40, 160, 360, 300, "", { border: c.light, width: 3 })];
  const labels = [d.label(220, 0, "LED sends weak red", { size: 32, color: c.gray, anchor: "middle", centerY: 110, keepCase: true })];
  ["r = 40", "g = 12", "b = 15", "c = 70"].forEach((t, k) => labels.push(d.label(162, 0, t, { size: 32, mono: true, centerY: 235 + k * 50 })));
  rows.forEach((r, i) => {
    wires.push(d.line(500, 310, 500, r.cy, { color: c.light, width: 3 }));
    wires.push(d.arrow(500, r.cy, 620, r.cy, { color: c.light, width: 3, head: 16 }));
    wires.push(d.arrow(1160, r.cy, 1300, r.cy, { color: c.light, width: 3, head: 16 }));
    boxes.push(d.box(620, r.cy - 65, 540, 130, "", { border: c.white, width: 3 }));
    // the changed threshold of the second rule is highlighted: a yellow box over
    // its characters, which turn yellow too (mono, so they start at 7 x 19.2)
    const line1 = r.cy - 21, x50 = 660 + 7 * 19.2, w50 = r.limit.length * 19.2;
    labels.push(d.label(660, 0, "if c <", { size: 32, mono: true, centerY: line1 }));
    if (i === 1) labels.push(d.highlight(x50, w50, line1, 32));
    labels.push(d.label(x50, 0, r.limit, { size: 32, mono: true, color: i === 1 ? c.yellow : c.white, centerY: line1 }));
    labels.push(d.label(x50 + w50, 0, ": off", { size: 32, mono: true, centerY: line1 }));
    labels.push(d.label(660, 0, "else: largest of r, g, b", { size: 32, mono: true, centerY: r.cy + 21 }));
    labels.push(d.label(1330, 0, r.out, { size: 48, mono: true, centerY: r.cy }));
    if (step >= 2) labels.push(d.mark(1580, r.cy, r.ok));
  });
  if (step >= 2) {
    labels.push(d.label(1330, 0, "expected", { size: 32, color: c.gray, centerY: 100 }));
    labels.push(d.label(1510, 0, '"red"', { size: 32, mono: true, centerY: 100 }));
  }
  return put("fig-rule", d.svg(W, HP, ...d.layers(wires, boxes, labels)));
};

/* --- the light link as a chain of boxes -----------------------------------------
 * "hi" -> encode() -> five colours -> decode() -> "hi" on the axis 290.
 * encode() 300..570 and decode() 1110..1380, 150 high; the colours r 23 with
 * 22 between them centred on 836 (700..972). Segment 1 lets the data flow
 * through the sender, segment 2 through light and receiver; every arrow draws
 * itself in the direction of the flow, and the box at work lights up yellow.
 * Segment 3 marks the four boundaries yellow, as the places where both sides
 * need the same agreement. Forward only: the data have a direction.
 * The colours of the symbols are real colours of light; the yellow of the
 * boundaries is the one exception the design rules allow next to them, since
 * yellow is none of the colours shown and marks only the arrows. */
(function () {
  if (!$("fig-chain")) return;
  const c = d.colors();
  const y = 290;
  const arrow = (name, x1, x2) => d.g(name, d.arrow(x1, y, x2, y, { color: c.light, width: 4, head: 18 }));
  const card = (name, x, text) => d.g(name, d.box(x, y - 75, 270, 150, text, { border: c.white, size: 32, mono: true, width: 3, rx: 10 }));
  $("fig-chain").innerHTML = d.svg(W, HP,
    arrow("a0", 190, 300), arrow("a1", 570, 660), arrow("a2", 1015, 1110), arrow("a3", 1380, 1470),
    card("enc", 300, "encode()"), card("dec", 1110, "decode()"),
    d.label(60, 0, '"hi"', { size: 48, mono: true, centerY: y }),
    ...[0, 1, 2, 3, 4].map((i) => d.g("dot" + i, circle(700 + i * 68, y, 23, [c.red, c.blue, c.green, c.blue, c.red][i]))),
    d.g("out", d.label(1490, 0, '"hi"', { size: 48, mono: true, centerY: y })),
    d.label(435, 0, "sender", { size: 32, color: c.gray, anchor: "middle", centerY: 440 }),
    d.label(836, 0, "light", { size: 32, color: c.gray, anchor: "middle", centerY: 440 }),
    d.label(1245, 0, "receiver", { size: 32, color: c.gray, anchor: "middle", centerY: 440 }));
  const a = d.anim("fig-chain");
  const lit = (box) => [a.color(box, "yellow", { dur: 200 }), a.color(box, "white", { dur: 200 })];
  const dots = [0, 1, 2, 3, 4].map((i) => a.show("dot" + i, { dur: 120 }));
  a.step(a.draw("a0", { dur: 400 }), ...lit("enc"), a.draw("a1", { dur: 300 }), ...dots);
  a.step(a.draw("a2", { dur: 300 }), ...lit("dec"), a.draw("a3", { dur: 300 }), a.show("out", { dur: 300 }));
  a.step(a.par(...["a0", "a1", "a2", "a3"].flatMap((n) => [
    a.color(n, "yellow", { dur: 600 }), a.color(n, "yellow", { part: "fill", dur: 600 })])));
})();

/* --- opening the sender ------------------------------------------------------------
 * Outer box 280..1400 x 105..495 (centre 300). Inside, three boxes 290 wide
 * with 85 between them, 40 from the outer edges: 320, 695, 1070. "choose
 * colour" is 13 x 19.2 = 250, plus 2 x 20 margin = 290. The captions below,
 * at most 16 x 19.2 = 307 wide, are centred 375 apart and do not touch.
 * Segment 1 opens the box (send() fades out, the inner chain fades in), segment
 * 2 adds what each inner box turns into what. back: "play", since closing the
 * box again is the same view in reverse and tells nothing wrong. */
(function () {
  if (!$("fig-nested-sender")) return;
  const c = d.colors();
  const xs = [320, 695, 1070];
  const names = ["encode()", "choose colour", "drive LED"];
  const notes = ["text → symbols", "symbols → colour", "colour → voltage"];
  $("fig-nested-sender").innerHTML = d.svg(W, HP,
    d.arrow(80, 300, 280, 300, { color: c.light, width: 4, head: 20 }),
    d.arrow(1400, 300, 1600, 300, { color: c.light, width: 4, head: 20 }),
    d.box(280, 105, 1120, 390, "", { border: c.white, width: 4, rx: 14 }),
    d.label(180, 0, "message", { size: 32, anchor: "middle", centerY: 262 }),
    d.label(1500, 0, "light", { size: 32, anchor: "middle", centerY: 262 }),
    d.g("closed", d.label(840, 0, "send()", { size: 48, mono: true, anchor: "middle", centerY: 300 })),
    d.g("inner",
      d.arrow(610, 300, 695, 300, { color: c.light, width: 3, head: 16 }),
      d.arrow(985, 300, 1070, 300, { color: c.light, width: 3, head: 16 }),
      ...xs.map((x, i) => d.box(x, 220, 290, 160, names[i], { border: c.light, size: 32, mono: i === 0, keepCase: i === 2, width: 3, rx: 10 }))),
    d.g("notes", ...xs.map((x, i) => d.label(x + 145, 0, notes[i], { size: 32, color: c.gray, anchor: "middle", centerY: 440 }))));
  const a = d.anim("fig-nested-sender", { back: "play" });
  a.step(a.par(a.hide("closed", { dur: 500 }), a.show("inner", { dur: 700 })));
  a.step(a.show("notes", { dur: 500 }));
})();

/* --- the same shape at three levels (still, build-up) ------------------------------
 * d.ipo rows (fixed geometry: level at x + 60, output centred at x + 1380);
 * x 80 centres the rows, which reach from 140 to about 1520. */
window.drawLevels = function (_slide, step = 0) {
  const rows = [
    d.ipo(35, "message", "sender", "light", { x: 80, level: "system" }),
    d.ipo(275, "text", "encode()", "symbols", { x: 80, level: "function", monoBox: true }),
    d.ipo(515, "1, 1", "AND", "1", { x: 80, level: "gate", monoIn: true, monoOut: true, keepCase: true }),
  ];
  return put("fig-levels", d.svg(W, H, ...rows.slice(0, step + 1)));
};

/* --- boxes in a row, boxes inside boxes (still) ---------------------------------- */
(function () {
  if (!$("fig-relations")) return;
  const c = d.colors();
  const card = (x, y, w, h, t) => d.box(x, y, w, h, t, { border: c.light, size: 32, width: 3, rx: 10 });
  put("fig-relations", d.svg(W, HP,
    d.label(390, 0, "boxes in a row", { size: 48, anchor: "middle", centerY: 60 }),
    d.label(390, 0, "where do the data go next?", { size: 32, color: c.gray, anchor: "middle", centerY: 125 }),
    d.arrow(330, 360, 450, 360, { color: c.light, width: 4, head: 18 }),
    card(90, 285, 240, 150, "a"),
    card(450, 285, 240, 150, "b"),
    d.label(390, 0, "data flow", { size: 32, color: c.light, anchor: "middle", centerY: 565 }),
    d.line(820, 30, 820, 590, { color: c.dark, width: 2 }),
    d.label(1240, 0, "boxes inside boxes", { size: 48, anchor: "middle", centerY: 60 }),
    d.label(1240, 0, "what smaller work happens inside?", { size: 32, color: c.gray, anchor: "middle", centerY: 125 }),
    d.box(930, 220, 620, 280, "", { border: c.light, width: 4, rx: 12 }),
    card(990, 290, 220, 140, "a"),
    card(1270, 290, 220, 140, "b"),
    d.label(1240, 0, "hierarchy", { size: 32, color: c.light, anchor: "middle", centerY: 565 })));
})();

/* --- two questions (still, build-up) ------------------------------------------------
 * The box 600..1080 x 250..410 (centre 330). The upper question is centred on
 * 840 and ends at 840 + 30 x 9.6 = 1128; its answer starts at 1160. The lower
 * question, 56 x 19.2 = 1075 wide, runs from 302 to 1378. The answers are blue
 * because they point to where each question is taken up. */
window.drawTwoQuestions = function (_slide, step = 0) {
  const c = d.colors();
  const mid = 330;
  const wires = [
    d.arrow(420, mid, 600, mid, { color: c.light, width: 4, head: 20 }),
    d.arrow(1080, mid, 1260, mid, { color: c.light, width: 4, head: 20 }),
  ];
  const boxes = [d.box(600, 250, 480, 160, "processing", { border: c.white, size: 48, width: 4, rx: 12 })];
  const labels = [
    d.label(300, 0, "input", { size: 48, anchor: "middle", centerY: mid }),
    d.label(1380, 0, "output", { size: 48, anchor: "middle", centerY: mid }),
  ];
  if (step >= 1) {
    wires.push(d.arrow(840, 250, 840, 150, { color: c.light, width: 3, head: 16 }));
    labels.push(d.label(840, 0, "how does the box do its work?", { size: 32, anchor: "middle", centerY: 110 }));
  }
  if (step >= 2) {
    wires.push(d.arrow(300, 372, 300, 500, { color: c.light, width: 3, head: 16 }));
    wires.push(d.arrow(1380, 372, 1380, 500, { color: c.light, width: 3, head: 16 }));
    labels.push(d.label(840, 0, "how are things written so a machine can work with them?", { size: 32, anchor: "middle", centerY: 545 }));
  }
  if (step >= 3) {
    labels.push(d.label(1160, 0, "a program", { size: 32, color: c.blue, centerY: 110 }));
    labels.push(d.label(840, 0, "representation", { size: 32, color: c.blue, anchor: "middle", centerY: 610 }));
  }
  return put("fig-two-questions", d.svg(W, H, ...d.layers(wires, boxes, labels)));
};

/* --- an AI agent as a box (still, build-up) -----------------------------------------
 * The newest addition is yellow, earlier ones turn light gray; the comparison
 * at the end is the verdict and green. "an expected result" is 18 x 19.2 =
 * 346 wide, centred on 1420: 1247..1593. */
window.drawAgent = function (_slide, step = 0) {
  const c = d.colors();
  const axis = 275;
  const tone = (s) => (step === s ? c.yellow : c.light);
  const wires = [
    d.arrow(300, axis, 470, axis, { color: c.light, width: 4, head: 20 }),
    d.arrow(1210, axis, 1380, axis, { color: c.light, width: 4, head: 20 }),
  ];
  const boxes = [d.box(470, 135, 740, 280, "AI agent", { border: c.gray, size: 48, keepCase: true, dashed: true, width: 4, rx: 12 })];
  const labels = [
    d.label(280, 0, "your task", { size: 32, anchor: "end", centerY: axis }),
    d.label(1400, 0, "code", { size: 32, centerY: axis }),
  ];
  // one row under the drawing: example under the task, comparison under the
  // box (mark 34 + gap + 18 x 19.2 = 346, centred on 840), result under the code
  if (step >= 1) labels.push(d.label(195, 0, "a clear example", { size: 32, color: tone(1), anchor: "middle", centerY: 480 }));
  if (step >= 2) labels.push(d.label(1430, 0, "an expected result", { size: 32, color: tone(2), anchor: "middle", centerY: 480 }));
  if (step >= 3) {
    labels.push(d.mark(667, 480, true));
    labels.push(d.label(702, 0, "run it and compare", { size: 32, color: c.green, centerY: 480 }));
  }
  return put("fig-agent", d.svg(W, HP, ...d.layers(wires, boxes, labels)));
};
