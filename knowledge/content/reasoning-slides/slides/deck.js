/* Drawings of the deck "Reasoning" (draft of 2026-11-12, reworked the same day
 * after Nicolas' review).
 *
 * Canvas 1680 wide, so that font sizes come out as written here. Allowed: 20,
 * 32, 48, 80. Wires first, then boxes, then labels (d.layers). Slides with a
 * build-up always draw the same canvas; what is not visible yet is left out,
 * never moved.
 *
 * Colours: grey for everything, pink (role "blue") for the point of the slide.
 * Green and red only as small marks for right and wrong, never as a large
 * verdict box (Nicolas, 2026-11-03).
 *
 * The drawing learning-from-rewards comes from the lesson
 * (content/reasoning/figures.js, 1600 wide) and is shifted 40 to the right.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();
const put = (id, svg) => { const el = $(id); if (el) el.innerHTML = svg; };
const shift = (...parts) => `<g transform="translate(40,0)">${parts.flat().join("")}</g>`;

// Bootstrap Icons "person-fill" 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_PERSON = '<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>';

/* Text width in Arial, measured in the browser; monospace counts 0.6 x size */
function breite(text, size, mono) {
  if (mono) return text.length * size * 0.6;
  const ctx = breite.ctx || (breite.ctx = document.createElement("canvas").getContext("2d"));
  ctx.font = `${size}px ${C().font}`;
  return ctx.measureText(text).width;
}

/* Left-aligned lines with equal spacing */
function zeilen(x, erste, abstand, texte, o) {
  return texte.map((t, i) => d.label(x, 0, t, { size: 32, centerY: erste + i * abstand, ...o }));
}

/* Keep runs of spaces in monospace lines (SVG collapses them) */
const pre = (t) => t.replace(/ {2,}|^ /g, (m) => " ".repeat(m.length));

/* Column headers of the IPO model: input, processing, output */
function ipoHeads(xs) {
  const c = C();
  return ["input", "processing", "output"].map((t, i) => d.label(xs[i], 0, t, { size: 32, color: c.gray, anchor: "middle", centerY: 30 }));
}

/* ------------------------------------------------------------------ */
/* Tractor question as IPO: answer at once, or write first             */
/* ------------------------------------------------------------------ */
/* Input column centre 150, model 370-670, output 780-1600. Answer boxes
 * 1400-1600 ("1,000 €" in 48 is about 160), mark at 1640. Lower row: the
 * thoughts are output, and the arrow below leads them back into the model,
 * because every new token is predicted from everything written so far. */
function figAnswer(step) {
  const c = C();
  const A = 130, B = 390;
  const wires = [
    d.arrow(250, A, 355, A, { color: c.gray, width: 3, head: 16 }),
    d.arrow(670, A, 1385, A, { color: c.gray, width: 3, head: 16 }),
  ];
  const boxes = [
    d.box(370, A - 60, 300, 120, "language model", { size: 32, border: c.light }),
    d.box(1400, A - 55, 200, 110, "1,000 €", { size: 48, border: c.light }),
    d.mark(1640, A, false),
  ];
  const labels = [
    ...ipoHeads([150, 520, 1190]),
    d.label(150, 0, "question", { size: 32, anchor: "middle", centerY: A }),
    d.label(1030, 0, "answers right away", { size: 32, color: c.gray, anchor: "middle", centerY: A - 30 }),
    d.label(1600, 0, "then together: 12,000 €", { size: 32, color: c.gray, anchor: "end", centerY: A + 90 }),
  ];
  if (step >= 1) {
    wires.push(
      d.arrow(250, B, 355, B, { color: c.gray, width: 3, head: 16 }),
      d.arrow(670, B, 765, B, { color: c.gray, width: 3, head: 16 }),
      d.arrow(1300, B, 1385, B, { color: c.gray, width: 3, head: 16 }),
      d.line(1040, 510, 1040, 570, { color: c.blue, width: 3 }),
      d.line(1040, 570, 520, 570, { color: c.blue, width: 3 }),
      d.arrow(520, 570, 520, 455, { color: c.blue, width: 3, head: 16 }));
    // longest line "x + x + 10,000 = 11,000" about 360 from 820; four lines 55 apart, centred in 270-510
    boxes.push(
      d.box(370, B - 60, 300, 120, "language model", { size: 32, border: c.light }),
      d.box(780, 270, 520, 240, "", { border: c.blue, width: 3 }),
      d.box(1400, B - 55, 200, 110, "500 €", { size: 48, border: c.light }),
      d.mark(1640, B, true));
    labels.push(
      d.label(150, 0, "question", { size: 32, anchor: "middle", centerY: B }),
      d.label(1040, 0, "thinks in writing first", { size: 32, color: c.blue, anchor: "middle", centerY: 245 }),
      ...zeilen(820, 308, 55, ["trailer: x", "tractor: x + 10,000", "x + x + 10,000 = 11,000", "x = 500"], { color: c.white }),
      d.label(780, 0, "the model reads its own thoughts again", { size: 32, color: c.blue, anchor: "middle", centerY: 610 }));
  }
  return d.svg(1680, 640, ...d.layers(wires, boxes, labels));
}
function showAnswer(slide, step) { put("fig-answer", figAnswer(step || 0)); }

/* ------------------------------------------------------------------ */
/* more tokens, more computation: IPO, animated                        */
/* ------------------------------------------------------------------ */
/* Section 1: the model writes 14 thought tokens and one answer token, one
 * after the other (a real process: generation token by token). Section 2:
 * the thoughts collapse into a folded box and only the answer travels on to
 * the user. Squares 44 in a pitch of 52 from 690; answer square at 1418. */
function figPasses() {
  const c = C();
  const Y = 150, q = 44, pitch = 52, x0 = 690, n = 14;
  const parts = [
    ...ipoHeads([130, 460, 1076]),
    d.label(130, 0, "question", { size: 32, anchor: "middle", centerY: Y }),
    d.arrow(220, Y, 295, Y, { color: c.gray, width: 3, head: 16 }),
    d.box(310, Y - 60, 300, 120, "language model", { size: 32, border: c.light }),
    d.arrow(610, Y, 675, Y, { color: c.gray, width: 3, head: 16 }),
    d.icon(1560, Y - 50, 80, ICON_PERSON, { color: c.light }),
    d.label(1600, 0, "user", { size: 32, color: c.gray, anchor: "middle", centerY: Y + 70 }),
    d.g("summary", d.box(x0, Y - 35, 300, 70, "thought for 12 s", { size: 32, border: c.gray, color: c.gray, dashed: true })),
  ];
  for (let i = 0; i < n; i++) parts.push(d.g(`t${i}`, d.box(x0 + i * pitch, Y - q / 2, q, q, "", { border: c.blue, width: 3 })));
  parts.push(
    d.g("lblthoughts", d.label(x0 + ((n - 1) * pitch + q) / 2, 0, "thoughts", { size: 32, color: c.blue, anchor: "middle", centerY: Y - 55 })),
    d.g("answer", d.box(x0 + n * pitch, Y - q / 2, q, q, "", { border: c.white, width: 3 }),
                  d.label(x0 + n * pitch + q / 2, 0, "answer", { size: 32, anchor: "middle", centerY: Y - 55 })),
    d.g("touser", d.arrow(1062, Y, 1545, Y, { color: c.blue, width: 3, head: 16 })),
    d.g("lbltouser", d.label(1300, 0, "only the answer", { size: 32, color: c.blue, anchor: "middle", centerY: Y + 45 })),
    d.g("cap1", d.label(840, 0, "every token is one pass through the model, so 500 tokens of thought are 500 passes", { size: 32, color: c.gray, anchor: "middle", centerY: 300 })),
    d.g("cap2", d.label(840, 0, "the app folds the thoughts away or summarises them, and the user sees only the answer", { size: 32, color: c.gray, anchor: "middle", centerY: 300 })));
  return d.svg(1680, 340, ...parts);
}
if ($("fig-passes")) {
  put("fig-passes", figPasses());
  const a = d.anim("fig-passes");
  const n = 14, pitch = 52;
  a.step(...Array.from({ length: n }, (_, i) => a.show(`t${i}`, { dur: 70 })), a.show("answer", { dur: 150 }), a.show("lblthoughts", { dur: 300 }));
  a.step(a.par(a.hide("lblthoughts", { dur: 300 }), ...Array.from({ length: n }, (_, i) => a.move(`t${i}`, -i * pitch, 0, { dur: 700 }))),
         a.par(...Array.from({ length: n }, (_, i) => a.hide(`t${i}`, { dur: 200 })), a.show("summary", { dur: 300 })),
         a.par(a.move("answer", 1010 - (690 + n * pitch), 0, { dur: 600 }), a.hide("cap1", { dur: 300 })),
         a.par(a.draw("touser", { dur: 600 }), a.show("lbltouser", { dur: 400 }), a.show("cap2", { dur: 400 })));
}

/* ------------------------------------------------------------------ */
/* the context is the paper                                             */
/* ------------------------------------------------------------------ */
/* Context box 60-700 with the question and the thoughts so far in
 * monospace 32 (19.2 per character, longest 28 characters = 538 from 100).
 * The model reads all of it and predicts the next token, which then becomes
 * part of the context. */
function figPaper(step) {
  const c = C();
  const m = { size: 32, mono: true };
  const wires = [
    d.arrow(970, 290, 1065, 290, { color: c.gray, width: 3, head: 16 }),
    d.arrow(1380, 290, 1455, 290, { color: c.gray, width: 3, head: 16 }),
  ];
  const boxes = [
    d.box(60, 70, 640, 430, "", { border: c.gray }),
    d.box(180, 422, 100, 46, "", { border: c.blue, dashed: true }),
    d.box(1080, 230, 300, 120, "language model", { size: 32, border: c.light }),
    d.box(1470, 245, 140, 90, step >= 1 ? "500" : "?", { size: 48, mono: true, border: c.blue, color: c.blue, width: 3 }),
  ];
  const labels = [
    d.label(60, 0, "context", { size: 32, color: c.gray, centerY: 35 }),
    ...zeilen(100, 120, 50, ["tractor + trailer = 11,000 €", "tractor = trailer + 10,000 €"], { ...m, color: c.gray }),
    ...zeilen(100, 245, 50, ["trailer: x", "tractor: x + 10,000", "x + x + 10,000 = 11,000", "2x = 1,000", "x ="], { ...m, color: c.white }),
    d.label(730, 0, "question", { size: 32, color: c.gray, centerY: 145 }),
    d.label(730, 0, "thoughts", { size: 32, color: c.gray, centerY: 320 }),
    d.label(730, 0, "so far", { size: 32, color: c.gray, centerY: 360 }),
    d.label(1230, 0, "every new token is predicted", { size: 32, color: c.gray, anchor: "middle", centerY: 130 }),
    d.label(1230, 0, "from everything written so far", { size: 32, color: c.gray, anchor: "middle", centerY: 175 }),
  ];
  if (step >= 1) {
    wires.push(d.line(1540, 335, 1540, 540, { color: c.blue, width: 3 }),
               d.line(1540, 540, 230, 540, { color: c.blue, width: 3 }),
               d.arrow(230, 540, 230, 472, { color: c.blue, width: 3, head: 14 }));
    boxes.push(d.highlight(100, breite("2x = 1,000", 32, true), 395, 32, { color: c.blue, opacity: 0.25 }));
    labels.push(d.label(230, 0, "500", { ...m, color: c.blue, anchor: "middle", centerY: 445 }),
                d.label(1000, 0, "the new token is written down and read again", { size: 32, color: c.blue, anchor: "middle", centerY: 580 }));
  }
  return d.svg(1680, 610, ...d.layers(wires, boxes, labels));
}
function showPaper(slide, step) { put("fig-paper", figPaper(step || 0)); }

/* ------------------------------------------------------------------ */
/* one big step or many small ones                                      */
/* ------------------------------------------------------------------ */
/* Left 0-760 the jump, right from 880 the stairs: line i at x 880 + 100 i,
 * centre 110 + 100 i. Widest line "x + x + 10,000 = 11,000" from 1180:
 * 23 x 19.2 = 442, end 1622. Connectors run down from 20 right of the line
 * start and then to the next line. */
function figSteps() {
  const c = C();
  const texte = ["trailer: x", "tractor: x + 10,000", "x + x + 10,000 = 11,000", "x = 500"];
  const xs = texte.map((_, i) => 880 + i * 100), ys = texte.map((_, i) => 110 + i * 100);
  const wires = [d.arrow(170, 400, 590, 135, { color: c.gray, width: 3, head: 18 })];
  for (let i = 0; i < texte.length - 1; i++) {
    wires.push(d.line(xs[i] + 20, ys[i] + 26, xs[i] + 20, ys[i + 1], { color: c.blue, width: 3 }),
               d.arrow(xs[i] + 20, ys[i + 1], xs[i + 1] - 14, ys[i + 1], { color: c.blue, width: 3, head: 14 }));
  }
  const labels = [
    d.label(380, 0, "one big step", { size: 32, color: c.gray, anchor: "middle", centerY: 30 }),
    d.label(1210, 0, "small steps", { size: 32, color: c.blue, anchor: "middle", centerY: 30 }),
    d.label(60, 0, "question", { size: 32, color: c.white, centerY: 430 }),
    d.label(600, 0, "answer", { size: 32, color: c.white, centerY: 110 }),
    d.label(330, 0, "?", { size: 48, color: c.gray, anchor: "middle", centerY: 230 }),
    ...texte.map((t, i) => d.label(xs[i], 0, t, { size: 32, color: c.white, centerY: ys[i] })),
  ];
  return d.svg(1680, 460, ...d.layers(wires, labels));
}

/* ------------------------------------------------------------------ */
/* a step on paper can be checked                                       */
/* ------------------------------------------------------------------ */
/* Monospace 48 from x 300; longest line "wait, that is 12,000, not 11,000."
 * 34 x 28.8 = 979, end 1279. */
function figCheck(step) {
  const c = C();
  const m = { size: 48, mono: true };
  const alt = step >= 1 ? c.gray : c.white;
  const parts = zeilen(300, 50, 80, ["trailer: 1,000", "tractor: 11,000", "together: 12,000"], { ...m, color: alt });
  if (step >= 1) {
    parts.push(d.label(300, 0, "wait, that is 12,000, not 11,000.", { ...m, color: c.blue, centerY: 310 }),
               d.label(300, 0, "trailer: x, tractor: x + 10,000", { ...m, color: c.white, centerY: 390 }));
  }
  return d.svg(1680, 440, ...parts);
}
function showCheck(slide, step) { put("fig-check", figCheck(step || 0)); }

/* ------------------------------------------------------------------ */
/* prompts: few-shot, chain of thought, zero-shot                       */
/* ------------------------------------------------------------------ */
/* Monospace 32 with original case (a prompt is what the computer reads):
 * 19.2 per character, at most 76 characters from 100 (end 1560). Lines 46
 * apart. Pink lines are what differs between the prompts. The answer box
 * appears in step 1 with a small mark. */
const ROGER = ["Q: Roger has 5 tennis balls. He buys 2 cans of 3 tennis balls each.", "   How many tennis balls does he have now?"];
const APPLES = ["Q: The cafeteria had 23 apples. They used 20 for lunch and bought", "   6 more. How many apples do they have?"];
const PROMPTS = {
  "fig-fewshot": {
    prompt: [...ROGER, "A: The answer is 11.", "", ...APPLES, "A:"], pink: [],
    answer: ["The answer is 27."], ok: false,
  },
  "fig-cotprompt": {
    prompt: [...ROGER, "A: Roger started with 5 balls. 2 cans of 3 tennis balls each are",
             "   6 balls. 5 + 6 = 11. The answer is 11.", "", ...APPLES, "A:"], pink: [2, 3],
    answer: ["The cafeteria had 23 apples. They used 20, so 23 - 20 = 3.", "They bought 6 more, so 3 + 6 = 9. The answer is 9."], ok: true,
  },
  "fig-zeroshot": {
    prompt: [...APPLES, "A: Let's think step by step."], pink: [2],
    answer: ["They started with 23 apples and used 20, so 23 - 20 = 3.", "Then they bought 6 more, so 3 + 6 = 9. The answer is 9."], ok: true,
  },
};
function figPrompt(id, step) {
  const c = C();
  const p = PROMPTS[id];
  const top = 70, lh = 46, pad = 34;
  const hP = p.prompt.length * lh + 2 * pad - 14;
  const yA = top + hP + 90;
  const hA = p.answer.length * lh + 2 * pad - 14;
  const parts = [
    d.label(60, 0, "prompt", { size: 32, color: c.gray, centerY: 35 }),
    d.box(60, top, 1560, hP, "", { border: c.gray }),
    ...p.prompt.map((t, i) => d.label(100, 0, pre(t), { size: 32, mono: true, keepCase: true, color: p.pink.includes(i) ? c.blue : c.white, centerY: top + pad + 9 + i * lh })),
  ];
  if (step >= 1) parts.push(
    d.label(60, 0, "the model continues", { size: 32, color: c.gray, centerY: yA - 35 }),
    d.box(60, yA, 1460, hA, "", { border: c.light }),
    ...p.answer.map((t, i) => d.label(100, 0, t, { size: 32, mono: true, keepCase: true, centerY: yA + pad + 9 + i * lh })),
    d.mark(1570, yA + hA / 2, p.ok));
  const hMax = top + hP + 90 + hA + 10;
  return d.svg(1680, hMax, ...parts);
}
function showFewshot(slide, step) { put("fig-fewshot", figPrompt("fig-fewshot", step || 0)); }
function showCotprompt(slide, step) { put("fig-cotprompt", figPrompt("fig-cotprompt", step || 0)); }
function showZeroshot(slide, step) { put("fig-zeroshot", figPrompt("fig-zeroshot", step || 0)); }

/* ------------------------------------------------------------------ */
/* bars with a track up to 100 %                                        */
/* ------------------------------------------------------------------ */
/* Bar labels right-aligned at 520 (at most about 460 wide), track 560-1360
 * (800 = 100 %), value 20 behind the bar. Each group has a grey title from 60
 * and two bars; a group needs 250 in height. Titles are written in lower case
 * by hand, with names in their own case. groups: [{ title, bars: [[label,
 * value, accent]] }] */
function barParts(groups, step, y0) {
  const c = C();
  const X = 560, L = 800, h = 60;
  const parts = [];
  groups.forEach((g, gi) => {
    if (gi > step) return;
    const y = y0 + gi * 250;
    parts.push(d.label(60, 0, g.title, { size: 32, color: c.gray, centerY: y, keepCase: true }));
    g.bars.forEach(([name, v, akzent], bi) => {
      const cy = y + 75 + bi * 85;
      parts.push(
        d.box(X, cy - h / 2, L, h, "", { border: c.dark, fill: "none", rx: 4 }),
        `<rect x="${X}" y="${cy - h / 2}" width="${L * v / 100}" height="${h}" rx="4" fill="${akzent ? c.blue : c.gray}"/>`,
        d.label(X - 40, 0, name, { size: 32, color: akzent ? c.white : c.light, anchor: "end", centerY: cy, keepCase: true }),
        d.label(X + L * v / 100 + 20, 0, `${v} %`, { size: 32, color: c.white, centerY: cy }),
      );
    });
  });
  return parts;
}
function hbars(groups, step, extra = [], extraH = 0) {
  return d.svg(1680, 40 + groups.length * 250 - 30 + extraH, ...barParts(groups, step, 40), ...extra);
}

const COT = [
  { title: "PaLM, maths word problems, eight solved examples in the prompt", bars: [["answers only", 18], ["with steps", 57, true]] },
  { title: "text-davinci-002, arithmetic word problems, no examples", bars: [["without the sentence", 18], ["with the sentence", 79, true]] },
];
function showCot(slide, step) {
  const c = C();
  const s = step || 0;
  const note = s >= 2 ? [d.label(60, 0, "all of this in 2021 and 2022, before ChatGPT and with older models", { size: 32, color: c.blue, centerY: 530, keepCase: true })] : [];
  put("fig-cot", hbars(COT, Math.min(s, 1), note, 80));
}

/* ------------------------------------------------------------------ */
/* AIME                                                                 */
/* ------------------------------------------------------------------ */
/* Left the problem (Arial 32, about 840 wide from 60), right the facts from
 * 1000 (at most about 620 wide). Problem 1 of AIME 2024 I, answer 204. */
function figAime(step) {
  const c = C();
  const problem = [
    "every morning, aya walks 9 kilometres and then",
    "stops at a coffee shop. at a constant s km/h,",
    "the walk takes 4 hours, including t minutes in",
    "the coffee shop. at s + 2 km/h it takes 2 hours",
    "and 24 minutes, including the same t minutes.",
    "how many minutes does the walk take her,",
    "including the t minutes, at s + ½ km/h?",
  ];
  const parts = [
    d.label(60, 0, "problem 1 of 15", { size: 32, color: c.gray, centerY: 30 }),
    ...zeilen(60, 100, 52, problem, { color: c.white }),
    d.label(1000, 0, "american invitational", { size: 32, centerY: 100 }),
    d.label(1000, 0, "mathematics examination", { size: 32, centerY: 145 }),
    ...zeilen(1000, 230, 45, ["for the best high-school", "students in the united states"], { color: c.light }),
    d.label(1000, 0, "15 problems in 3 hours", { size: 32, color: c.light, centerY: 365 }),
  ];
  if (step >= 1) parts.push(
    d.label(60, 0, "answer: 204", { size: 48, color: c.blue, centerY: 500 }),
    ...zeilen(1000, 455, 45, ["every answer is a whole number", "from 0 to 999, so a program", "can check it"], { color: c.blue }));
  return d.svg(1680, 560, ...parts);
}
function showAime(slide, step) { put("fig-aime", figAime(step || 0)); }

/* o1 against GPT-4o, with the note that o1 was the first reasoning model */
function figO1() {
  const c = C();
  return hbars([{ title: "AIME, one attempt per problem", bars: [["GPT-4o", 12], ["o1", 74, true]] }], 0, [
    d.label(60, 0, "released in 09/2024 as the first published reasoning model,", { size: 32, color: c.light, centerY: 330 }),
    d.label(60, 0, "trained with rewards to think before every answer", { size: 32, color: c.light, centerY: 375 }),
  ], 190);
}

/* ------------------------------------------------------------------ */
/* timeline in two columns                                              */
/* ------------------------------------------------------------------ */
/* Left from 60 (date) and 260 (event), right from 900 and 1100; longest
 * entry on the right "o3, Gemini 2.0 Flash Thinking" about 470, end 1570.
 * Below the left column the release of ChatGPT as a boundary, below the right
 * one the state of today. */
const FRUEH = [["2021", "scratchpads"], ["01/2022", "chain of thought"], ["03/2022", "self-consistency"], ["05/2022", "\"let's think step by step\""], ["10/2022", "ReAct"]];
const SPAET = [["09/2024", "o1"], ["12/2024", "o3, Gemini 2.0 Flash Thinking"], ["01/2025", "DeepSeek-R1"], ["02/2025", "Claude 3.7 Sonnet"], ["07/2025", "gold at the IMO"], ["08/2025", "GPT-5, gpt-oss"]];
function figTimeline(step) {
  const c = C();
  const parts = [d.label(60, 0, "asked for in the prompt, with older models", { size: 32, color: c.gray, centerY: 40 })];
  FRUEH.forEach(([wann, was], i) => parts.push(
    d.label(60, 0, wann, { size: 32, color: c.gray, centerY: 120 + i * 70 }),
    d.label(260, 0, was, { size: 32, color: c.light, centerY: 120 + i * 70, keepCase: was === "ReAct" })));
  parts.push(d.line(60, 445, 800, 445, { color: c.gray, width: 2, dashed: true }),
             d.label(60, 0, "11/2022", { size: 32, color: c.gray, centerY: 490 }),
             d.label(260, 0, "ChatGPT", { size: 32, color: c.white, centerY: 490, keepCase: true }));
  if (step >= 1) parts.push(d.label(900, 0, "trained to reason", { size: 32, color: c.blue, centerY: 40 }));
  SPAET.forEach(([wann, was], i) => {
    if (step < (i < 3 ? 1 : 2)) return;
    parts.push(d.label(900, 0, wann, { size: 32, color: c.gray, centerY: 120 + i * 70 }),
               d.label(1100, 0, was, { size: 32, color: c.white, centerY: 120 + i * 70, keepCase: true }));
  });
  if (step >= 3) parts.push(d.label(900, 0, "today: reasoning is standard in new models", { size: 32, color: c.blue, centerY: 560 }));
  return d.svg(1680, 600, ...parts);
}
function showTimeline(slide, step) { put("fig-timeline", figTimeline(step || 0)); }

/* ------------------------------------------------------------------ */
/* three stages, each with a small example                              */
/* ------------------------------------------------------------------ */
/* Columns 480 wide at 40, 600, 1160. Upper box: title and two lines
 * (longest "on books, code, the web" about 360). Lower box: example in
 * monospace 32 with at most 20 characters (384) from x + 40. */
function figStages(step) {
  const c = C();
  const m = { size: 32, mono: true, keepCase: true };
  const STUFEN = [
    ["1  pretraining", ["predict the next token", "on books, code, the web"], "plain"],
    ["2  examples of thinking", ["optional: a few thousand", "worked answers"], "dashed"],
    ["3  learning from rewards", ["attempts whose answer", "a program can check"], "new"],
  ];
  const parts = [];
  STUFEN.forEach(([titel, text, art], i) => {
    if (i > step) return;
    const x = 40 + i * 560;
    const farbe = art === "new" ? c.blue : c.light;
    parts.push(d.box(x, 20, 480, 210, "", { border: farbe, width: 3, dashed: art === "dashed" }),
               d.label(x + 40, 0, titel, { size: 32, color: art === "new" ? c.blue : c.white, centerY: 70 }),
               ...zeilen(x + 40, 135, 45, text, { color: c.gray }),
               d.box(x, 260, 480, 340, "", { border: c.dark, width: 2 }),
               d.label(x + 40, 0, "example", { size: 32, color: c.gray, centerY: 300 }));
    if (i === 0) parts.push(
      d.label(x + 40, 0, "The capital of", { ...m, centerY: 380 }),
      d.label(x + 40, 0, "France is", { ...m, centerY: 430 }),
      d.label(x + 40 + 10 * 19.2, 0, "Paris", { ...m, color: c.blue, centerY: 430 }),
      d.label(x + 40, 0, "pink: the next token", { size: 32, color: c.blue, centerY: 530 }));
    if (i === 1) parts.push(
      d.label(x + 40, 0, "Q: 23 - 20 + 6?", { ...m, centerY: 360 }),
      d.label(x + 40, 0, "<think>", { ...m, color: c.gray, centerY: 405 }),
      d.label(x + 40, 0, "23 - 20 = 3", { ...m, color: c.blue, centerY: 450 }),
      d.label(x + 40, 0, "3 + 6 = 9", { ...m, color: c.blue, centerY: 495 }),
      d.label(x + 40, 0, "</think> A: 9", { ...m, color: c.gray, centerY: 540 }));
    if (i === 2) parts.push(
      d.label(x + 40, 0, "Q: 23 - 20 + 6?", { ...m, centerY: 360 }),
      d.label(x + 40, 0, "attempt 1: … 9", { ...m, centerY: 420 }),
      d.mark(x + 400, 420, true),
      d.label(x + 40, 0, "attempt 2: … 27", { ...m, centerY: 475 }),
      d.mark(x + 400, 475, false),
      d.label(x + 40, 0, "more like attempt 1", { size: 32, color: c.blue, centerY: 545 }));
  });
  return d.svg(1680, 620, ...parts);
}
function showStages(slide, step) { put("fig-stages", figStages(step || 0)); }

/* ------------------------------------------------------------------ */
/* one round of learning from rewards (from the lesson), animated       */
/* ------------------------------------------------------------------ */
/* A procedure that works step by step: write attempts, check, reinforce
 * what was rewarded. Three sections, each intermediate state readable on
 * its own. */
function figRewards() {
  const c = C();
  const MID = 300, ys = [105, 235, 365, 495];
  const versuche = [["attempt 1: … 500 €", true], ["attempt 2: … 1,000 €", false], ["attempt 3: … 400 €", false], ["attempt 4: … 500 €", true]];
  return d.svg(1680, 690, shift(
    d.arrow(340, MID, 405, MID, { color: c.gray, width: 3, head: 16 }),
    d.g("fan", ...ys.map((y) => d.arrow(640, MID, 745, y, { color: c.gray, width: 2, head: 14 }))),
    d.g("back", d.line(1400, 540, 1400, 610, { color: c.blue, width: 3 }),
                d.line(1400, 610, 530, 610, { color: c.blue, width: 3 }),
                d.arrow(530, 610, 530, 375, { color: c.blue, width: 3, head: 16 })),
    d.box(40, MID - 80, 300, 160, "problem with a\nknown answer", { size: 32, border: c.gray }),
    d.box(420, MID - 60, 220, 120, "model", { size: 48, border: c.white }),
    d.g("attempts", ...versuche.map(([t], i) => d.box(760, ys[i] - 45, 420, 90, t, { size: 32, border: c.light }))),
    d.g("checks", ...versuche.map(([, ok], i) => d.mark(1240, ys[i], ok)),
                  ...versuche.map(([, ok], i) => d.label(1290, 0, `reward ${ok ? 1 : 0}`, { size: 32, color: ok ? c.white : c.gray, centerY: ys[i] }))),
    d.g("backlabel", d.label(965, 0, "the thinking that led to ✓ becomes more likely", { size: 32, color: c.blue, anchor: "middle", centerY: 650 })),
  ));
}
if ($("fig-rewards")) {
  put("fig-rewards", figRewards());
  const a = d.anim("fig-rewards");
  a.step(a.draw("fan", { dur: 600 }), a.show("attempts", { dur: 500 }));
  a.step(a.show("checks", { dur: 600 }));
  a.step(a.draw("back", { dur: 1200 }), a.show("backlabel", { dur: 400 }));
}

/* ------------------------------------------------------------------ */
/* the aha moment of R1-Zero, with its problem                          */
/* ------------------------------------------------------------------ */
/* Monospace 32 in the original case, at most 78 characters from 60 (end
 * 1558). Shortened with "…", as marked in the paper (table 3). */
function figAha(step) {
  const c = C();
  const m = { size: 32, mono: true, keepCase: true };
  const parts = [
    d.label(60, 0, "problem: if a > 1, then the sum of the real solutions of √(a - √(a + x)) = x is equal to", { size: 32, color: c.gray, centerY: 30 }),
    d.label(60, 0, "thoughts of DeepSeek R1-Zero, part-way through its training:", { size: 32, color: c.gray, centerY: 100, keepCase: true }),
    d.label(60, 0, "To solve the equation √(a - √(a + x)) = x, let's start by squaring …", { ...m, centerY: 165 }),
    d.label(60, 0, "a - √(a + x) = x²  …  x⁴ - 2ax² - x + (a² - a) = 0", { ...m, centerY: 215 }),
  ];
  if (step >= 1) parts.push(
    d.label(60, 0, "Wait, wait. Wait. That's an aha moment I can flag here.", { ...m, color: c.blue, centerY: 290 }),
    d.label(60, 0, "Let's reevaluate this step-by-step to identify if the correct sum can be …", { ...m, centerY: 340 }),
    d.label(60, 0, "nobody showed it how to think: it was trained with rewards alone,", { size: 32, color: c.light, centerY: 430 }),
    d.label(60, 0, "and on AIME it improved from 16 % to 71 % in the course of this training", { size: 32, color: c.light, centerY: 475, keepCase: true }));
  return d.svg(1680, 510, ...parts);
}
function showAha(slide, step) { put("fig-aha", figAha(step || 0)); }

/* ------------------------------------------------------------------ */
/* why maths and code came first: what a program checks                 */
/* ------------------------------------------------------------------ */
/* Left maths from 60, right code from 900; longest line on the right
 * "assert sort([3, 1, 2]) == [1, 2, 3]" 35 x 19.2 = 672, end 1572. */
function figCheckable() {
  const c = C();
  const m = { size: 32, mono: true, keepCase: true };
  return d.svg(1680, 470,
    d.label(60, 0, "maths: compare with the known answer", { size: 32, color: c.gray, centerY: 30 }),
    d.label(60, 0, pre("answer of the model: 204"), { ...m, centerY: 120 }),
    d.label(60, 0, pre("known answer:        204"), { ...m, centerY: 170 }),
    d.mark(90, 260, true), d.label(140, 0, "reward 1", { size: 32, centerY: 260 }),
    d.label(900, 0, "code: run the tests", { size: 32, color: c.gray, centerY: 30 }),
    d.label(900, 0, "def sort(numbers): …", { ...m, centerY: 120 }),
    d.label(900, 0, "assert sort([3, 1, 2]) == [1, 2, 3]", { ...m, centerY: 170 }),
    d.mark(930, 260, true), d.label(980, 0, "4 of 4 tests passed, reward 1", { size: 32, centerY: 260 }),
    d.label(840, 0, "a program checks in milliseconds, millions of times, and nobody has to read the attempts", { size: 32, color: c.blue, anchor: "middle", centerY: 400 }));
}

/* ------------------------------------------------------------------ */
/* reward hacking: an example after OpenAI (2025), simplified           */
/* ------------------------------------------------------------------ */
/* Row labels right-aligned at 260, content from 300; longest monospace
 * line "If verify() always returned True, every test would pass." 57 x 19.2
 * = 1094, end 1394. */
function figHack(step) {
  const c = C();
  const m = { size: 32, mono: true, keepCase: true };
  const row = (t, y) => d.label(260, 0, t, { size: 32, color: c.gray, anchor: "end", centerY: y });
  const parts = [
    row("task", 40), d.label(300, 0, "make the failing tests pass", { size: 32, centerY: 40 }),
    row("thoughts", 120),
    d.label(300, 0, "The tests only call verify() to check the result.", { ...m, centerY: 120 }),
    d.label(300, 0, "If verify() always returned True, every test would pass.", { ...m, color: c.blue, centerY: 170 }),
    row("code", 250),
    d.label(300, 0, "def verify(result):", { ...m, centerY: 250 }),
    d.label(300, 0, pre("    return True"), { ...m, color: c.blue, centerY: 300 }),
  ];
  if (step >= 1) parts.push(
    d.mark(330, 390, true), d.label(380, 0, "all tests pass, reward 1", { size: 32, centerY: 390 }),
    d.mark(330, 450, false), d.label(380, 0, "the program still does nothing useful", { size: 32, centerY: 450 }),
    d.label(300, 0, "reward hacking: the model finds the loophole in the reward", { size: 32, color: c.blue, centerY: 540 }));
  return d.svg(1680, 580, ...parts);
}
function showHack(slide, step) { put("fig-hack", figHack(step || 0)); }

/* ------------------------------------------------------------------ */
/* distillation, and a small reasoning model against a large one        */
/* ------------------------------------------------------------------ */
/* Large model 60-440, arrow to 865, six small models 200 wide in a pitch of
 * 240 from 880 (end 1560). Below in step 1 the bars: AIME 2024, one attempt
 * (DeepSeek-R1 paper, table 5). */
function figDistill(step) {
  const c = C();
  const groessen = ["1.5B", "7B", "8B", "14B", "32B", "70B"];
  const wires = [d.arrow(440, 150, 865, 150, { color: c.gray, width: 3, head: 16 })];
  const boxes = [d.box(60, 40, 380, 220, "DeepSeek-R1", { size: 48, border: c.light, keepCase: true })];
  groessen.forEach((g, i) => {
    const x = 880 + (i % 3) * 240, y = 40 + Math.floor(i / 3) * 130;
    boxes.push(d.box(x, y, 200, 90, g, { size: 32, border: i ? c.gray : c.blue, color: i ? c.light : c.blue, keepCase: true, width: i ? 2 : 3 }));
  });
  const labels = [d.label(650, 0, "thoughts and answers", { size: 32, color: c.gray, anchor: "middle", centerY: 110 })];
  const bars = step >= 1 ? barParts([{ title: "AIME, one attempt per problem", bars: [["GPT-4o, no reasoning", 9.3], ["R1 distilled into 1.5B", 28.9, true]] }], 0, 340) : [];
  return d.svg(1680, 600, ...d.layers(wires, boxes, labels), ...bars);
}
function showDistill(slide, step) { put("fig-distill", figDistill(step || 0)); }

/* ------------------------------------------------------------------ */
/* two curves                                                           */
/* ------------------------------------------------------------------ */
/* Two charts 600 wide at 120 and 920; axes at y 380, lines straight because
 * the x axis is logarithmic. Shape after OpenAI 2024, for illustration. */
function figCurves(step) {
  const c = C();
  const parts = [];
  [["more training", c.gray], ["more time to think", c.blue]].forEach(([achse, farbe], i) => {
    if (i > step) return;
    const x0 = 120 + i * 800;
    parts.push(d.line(x0, 380, x0 + 600, 380, { color: c.gray, width: 2 }),
               d.line(x0, 80, x0, 380, { color: c.gray, width: 2 }),
               d.line(x0 + 40, 340, x0 + 560, 120, { color: farbe, width: 4 }),
               ...[0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${x0 + 40 + k * 104}" cy="${340 - k * 44}" r="9" fill="${farbe}"/>`),
               d.label(x0, 0, "accuracy", { size: 32, color: c.gray, centerY: 45 }),
               d.label(x0 + 300, 0, `${achse} (log scale)`, { size: 32, color: i ? c.blue : c.light, anchor: "middle", centerY: 425 }));
  });
  return d.svg(1680, 460, ...parts);
}
function showCurves(slide, step) { put("fig-curves", figCurves(step || 0)); }

/* ------------------------------------------------------------------ */
/* think longer or more often (from the lesson)                         */
/* ------------------------------------------------------------------ */
function figLonger(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  boxes.push(d.box(60, 100, 680, 450, "", { border: c.blue, width: 3 }));
  labels.push(d.label(400, 0, "think longer", { size: 32, color: c.blue, anchor: "middle", centerY: 60 }));
  const kette = ["step 1", "step 2", "wait, step 2 is wrong", "step 2, again", "step 3", "answer: 500 €"];
  kette.forEach((t, i) => {
    const y = 160 + i * 70;
    if (i === 2) boxes.push(d.highlight(100, breite(t, 32), y, 32, { color: c.gray, opacity: 0.25 }));
    labels.push(d.label(100, 0, t, { size: 32, centerY: y, color: i === kette.length - 1 ? c.white : c.light }));
  });
  if (step >= 1) {
    labels.push(d.label(1200, 0, "think more often", { size: 32, color: c.blue, anchor: "middle", centerY: 60 }));
    ["500", "500", "1,000", "500", "400"].forEach((a, i) => {
      const x = 870 + i * 140, cx = x + 55;
      boxes.push(d.box(x, 100, 110, 220, "", { border: c.gray }));
      [150, 195, 240].forEach((y, k) => boxes.push(d.line(x + 20, y, x + 90 - k * 15, y, { color: c.gray, width: 3 })));
      labels.push(d.label(cx, 0, a, { size: 32, anchor: "middle", centerY: 280, color: c.white }));
      wires.push(d.arrow(cx, 320, 1200 + (cx - 1200) * 0.4, 442, { color: c.gray, width: 2, head: 12 }));
    });
    boxes.push(d.box(980, 450, 440, 100, "majority: 500 €", { size: 32, border: c.blue, width: 3 }));
  }
  if (step >= 2) labels.push(d.label(800, 0, "o1 on AIME: 74 % with one attempt, 83 % with 64 attempts and a majority vote", { size: 32, color: c.gray, anchor: "middle", centerY: 630, keepCase: true }));
  return d.svg(1680, 660, shift(d.layers(wires, boxes, labels)));
}
function showLonger(slide, step) { put("fig-longer", figLonger(step || 0)); }

/* ------------------------------------------------------------------ */
/* the bitter lesson: where learning and where search                   */
/* ------------------------------------------------------------------ */
/* Two boxes 740 wide at 60 and 880; longest line "think more often: several
 * attempts and a vote" about 610 from 920. */
function figBitter(step) {
  const c = C();
  const parts = [
    d.label(840, 0, "learning and search keep scaling with computation", { size: 48, anchor: "middle", centerY: 45 }),
    d.label(840, 0, "Rich Sutton, The Bitter Lesson, 2019", { size: 32, color: c.gray, anchor: "middle", centerY: 110, keepCase: true }),
  ];
  const spalte = (x, titel, zeilenText, beispiel) => [
    d.box(x, 170, 740, 330, "", { border: c.blue, width: 3 }),
    d.label(x + 40, 0, titel, { size: 32, color: c.blue, centerY: 220 }),
    ...zeilen(x + 40, 290, 50, zeilenText, { color: c.white }),
    ...zeilen(x + 40, 410, 50, beispiel, { color: c.gray }),
  ];
  if (step >= 1) parts.push(...spalte(60, "learning: in training",
    ["many attempts at problems with known", "answers, and the model learns from rewards"],
    ["the round of learning from rewards,", "repeated over many thousand problems"]));
  if (step >= 2) parts.push(...spalte(880, "search: when answering",
    ["think longer: wait, check, try again", "think more often: several attempts and a vote"],
    ["the same model gets better the more", "time it may spend on one question"]));
  return d.svg(1680, 520, ...parts);
}
function showBitter(slide, step) { put("fig-bitter", figBitter(step || 0)); }

/* ------------------------------------------------------------------ */
/* hints: the setup of the experiment, as an illustration               */
/* ------------------------------------------------------------------ */
/* Two columns 740 wide at 60 and 880. Longest line "a professor thinks the
 * answer is (A)." about 560. Both columns share the line heights, so that
 * question, thoughts and answer stand side by side. */
function figHintSetup(step) {
  const c = C();
  const frage = ["which is the largest desert?", pre("(A) Sahara   (B) Antarctica"), pre("(C) Gobi   (D) Arabian")];
  const spalte = (x, titel, farbe, hinweis, gedanken, antwort) => [
    d.label(x, 0, titel, { size: 32, color: farbe, centerY: 30 }),
    d.box(x, 60, 740, 250, "", { border: c.gray }),
    ...zeilen(x + 40, 110, 50, frage, { color: c.white, keepCase: true }),
    ...(hinweis ? [d.label(x + 40, 0, hinweis, { size: 32, color: c.blue, centerY: 265, keepCase: true })] : []),
    d.label(x, 0, "thoughts", { size: 32, color: c.gray, centerY: 360 }),
    ...zeilen(x, 410, 45, gedanken, { color: c.light, keepCase: true }),
    d.label(x, 0, antwort, { size: 32, color: c.white, centerY: 560, keepCase: true }),
  ];
  const parts = spalte(60, "without a hint", c.gray, null,
    ["a desert is defined by how little rain", "falls, and Antarctica gets very little,", "so the answer is (B)."], "answer: (B)");
  if (step >= 1) parts.push(...spalte(880, "with a hint", c.blue, "a professor thinks the answer is (A).",
    ["the Sahara is the largest hot desert,", "about 9 million km², so the answer", "is (A)."], "answer: (A)"),
    d.label(840, 0, "the hint changed the answer, and the thoughts do not mention it", { size: 32, color: c.blue, anchor: "middle", centerY: 630 }));
  return d.svg(1680, 660, ...parts);
}
function showHintSetup(slide, step) { put("fig-hintsetup", figHintSetup(step || 0)); }

const HINT = [{ title: "the model used the hint, and its thoughts mentioned it", bars: [["Claude 3.7 Sonnet", 25, true], ["DeepSeek-R1", 39, true]] }];

/* ------------------------------------------------------------------ */
/* thinking inside the agent loop                                       */
/* ------------------------------------------------------------------ */
function figLoop(step) {
  const c = C();
  const wires = [
    d.arrow(980, 230, 1178, 130, { color: c.gray, width: 3, head: 16 }),
    d.arrow(1330, 160, 1330, 358, { color: c.gray, width: 3, head: 16 }),
    d.arrow(1158, 410, 982, 300, { color: c.gray, width: 3, head: 16 }),
  ];
  const boxes = [
    d.box(720, 210, 260, 100, "think", { size: 32, border: step >= 1 ? c.blue : c.light, width: 3 }),
    d.box(1180, 60, 300, 100, "call a tool", { size: 32, border: c.light }),
    d.box(1160, 360, 340, 100, "read the result", { size: 32, border: c.light }),
  ];
  const labels = [];
  if (step >= 1) labels.push(
    d.label(680, 0, "a plan before the first step", { size: 32, color: c.blue, anchor: "end", centerY: 180 }),
    d.label(680, 0, "a check after each result", { size: 32, color: c.blue, anchor: "end", centerY: 260 }),
    d.label(680, 0, "wait, that failed", { size: 32, color: c.blue, anchor: "end", centerY: 340 }));
  return d.svg(1680, 500, ...d.layers(wires, boxes, labels));
}
function showLoop(slide, step) { put("fig-loop", figLoop(step || 0)); }

/* ------------------------------------------------------------------ */
/* time horizon after METR (Time Horizon 1.1)                           */
/* ------------------------------------------------------------------ */
/* All models that METR marks as state of the art, from its data file
 * benchmark_results_1_1.yaml (page last updated 2026-09-08): release year
 * and 50 % horizon in seconds. Reasoning models (from o1-preview on) in pink,
 * earlier ones in grey. Claude Mythos Preview as an open circle: measured at
 * 16 hours or more, beyond which the task suite is unreliable.
 * x: 2019-2026.5 on 260-1600. y logarithmic: 1 s at 560, 97 per decade. */
const METR = [
  [2019.121, 3, 0], [2020.405, 9, 0], [2022.200, 36, 0], [2023.197, 239, 0], [2023.847, 243, 0],
  [2024.364, 419, 0], [2024.468, 684, 0], [2024.699, 1220, 1], [2024.808, 1231, 0], [2024.929, 2330, 1],
  [2025.148, 3623, 1], [2025.288, 7184, 1], [2025.597, 12181, 1], [2025.879, 13460, 1], [2025.896, 17580, 1],
  [2025.942, 21135, 1], [2026.096, 43128, 1], [2026.263, 62687, 2],
];
function figMetr() {
  const c = C();
  const X = (j) => 260 + (j - 2019) / 7.5 * 1340;
  const Y = (s) => 560 - Math.log10(s) * 97;
  const parts = [];
  [[1, "1 second"], [60, "1 minute"], [3600, "1 hour"], [86400, "1 day"]].forEach(([s, t]) => parts.push(
    d.line(260, Y(s), 1620, Y(s), { color: c.dark, width: 2, dashed: true }),
    d.label(240, 0, t, { size: 32, color: c.gray, anchor: "end", centerY: Y(s) })));
  for (let j = 2019; j <= 2026; j++) parts.push(d.label(X(j), 0, String(j), { size: 32, color: c.gray, anchor: "middle", centerY: 605 }));
  METR.forEach(([j, s, art]) => parts.push(art === 2
    ? `<circle cx="${X(j)}" cy="${Y(s)}" r="10" fill="${c.bg}" stroke="${c.blue}" stroke-width="4"/>`
    : `<circle cx="${X(j)}" cy="${Y(s)}" r="10" fill="${art ? c.blue : c.gray}"/>`));
  const at = (j, s, text, o = {}) => d.label(X(j) - 25, 0, text, { size: 32, anchor: "end", centerY: Y(s), keepCase: true, ...o });
  parts.push(
    d.label(X(2019.121) + 25, 0, "GPT-2, 2019: 3 seconds", { size: 32, centerY: Y(3), keepCase: true, color: c.light }),
    at(2023.197, 239, "GPT-4, 03/2023: 4 minutes", { color: c.light }),
    at(2024.929, 2330, "o1, 12/2024: 39 minutes"),
    at(2025.597, 12181, "GPT-5, 08/2025: 3.4 hours", { centerY: 560 - Math.log10(12181) * 97 - 12 }),
    at(2026.096, 43128, "Claude Opus 4.6, 02/2026: 12 hours"),
    d.label(1600, 0, "Claude Mythos Preview, 04/2026: 16 hours or more", { size: 32, anchor: "end", centerY: 50, keepCase: true }),
    `<circle cx="290" cy="125" r="10" fill="${c.blue}"/>`, d.label(315, 0, "reasoning models", { size: 32, centerY: 125 }),
    `<circle cx="290" cy="170" r="10" fill="${c.gray}"/>`, d.label(315, 0, "earlier models", { size: 32, color: c.light, centerY: 170 }),
    d.label(280, 0, "since 2023: doubling about every four months", { size: 32, color: c.gray, centerY: 270 }),
    d.label(940, 0, "time a skilled person needs for the tasks that the agent solves in half of the cases", { size: 32, color: c.gray, anchor: "middle", centerY: 655 }));
  return d.svg(1680, 680, ...parts);
}

/* ------------------------------------------------------------------ */
/* drawings without build-up, once on load                              */
/* ------------------------------------------------------------------ */
put("fig-steps", figSteps());
put("fig-checkable", figCheckable());
put("fig-o1", figO1());
put("fig-hint", hbars(HINT, 0, [d.label(60, 0, "in the other cases, the thoughts gave a plausible reason without the real one", { size: 32, color: C().light, centerY: 310 })], 110));
put("fig-metr", figMetr());
