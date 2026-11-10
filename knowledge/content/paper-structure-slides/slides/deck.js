// Drawings of "how a scientific paper is built".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without. Widths of text are estimated as
// characters x size x 0.6. Colours: grey for what frames or stays out, white
// for content, blue for the point of a slide (the one thing its punchline or
// notes name), green only for the check that marks "goes in".
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);

// A box whose text stands left-aligned at a common edge, as the design rules
// ask for more than one line.
function textBox(x, y, w, h, text, o = {}) {
  return d.box(x, y, w, h, "", o) +
    d.label(x + 24, 0, text, { size: o.size || 32, centerY: y + h / 2, color: o.color || C.white, keepCase: o.keepCase });
}

/* --- slide: imrad -----------------------------------------------------------
 * Figure 1680 x 804. Four section boxes 420 wide at x 4 (inset by half the
 * stroke), 100 high on a pitch of 140 from y 130: "introduction" at 48 is
 * about 346 wide. The question of each section at 48 from x 480; the longest,
 * "why, and what is the question?" (30 characters), is about 864, so it ends
 * near x 1344. Title and abstract above (y 20..90) and the references below
 * (y 690..760) in grey dashed boxes: they frame the four, they are not part
 * of imrad. Build-up: introduction first, then one section per step. */
(function () {
  const rows = [
    ["introduction", "why, and what is the question?"],
    ["methods", "how did we find out?"],
    ["results", "what did we find?"],
    ["discussion", "what does it mean?"]];
  const part = (k) => {
    const y = 130 + 140 * k;
    return [d.box(4, y, 420, 100, rows[k][0], { size: 48, border: C.light }),
      d.label(480, 0, rows[k][1], { size: 48, centerY: y + 50 })];
  };
  el("fig-imrad").innerHTML = d.svg(1680, 804,
    d.box(4, 20, 420, 70, "title, abstract", { border: C.gray, color: C.gray, dashed: true }),
    d.box(4, 690, 420, 70, "references", { border: C.gray, color: C.gray, dashed: true }),
    d.g("s0", ...part(0)), d.g("s1", ...part(1)), d.g("s2", ...part(2)), d.g("s3", ...part(3)));
  const a = d.anim("fig-imrad");
  for (let k = 1; k <= 3; k++) a.set("s" + k, { opacity: 0 });
  for (let k = 1; k <= 3; k++) a.step(a.show("s" + k, { dur: 500 }));
})();

/* --- slide: how imrad won (Sollaci & Pereira 2004) --------------------------
 * Figure 1680 x 660 (has-punch). Only the values the paper states in its text
 * are drawn as dots; its Figure 1 shows the full curve, which is not
 * reproduced here, so the dots are joined by a dashed line that only connects
 * them. Stated: none in 1935, over 10 % in 1950, about 20 % in 1955 ("from
 * none to 20 %" over 1935-1955), over 80 % in the 1970s (here at 1975, where
 * the text says the share more than quadrupled since 1955), and in the 1980s
 * the only pattern (NEJM 1975, BMJ 1980, JAMA and The Lancet 1985 at 100 %).
 * Axes: year 1935..1985 on x 160..1600 (28.8 per year), share 0..100 % on
 * y 560..80 (4.8 per percent). Value labels sit where the line leaves room:
 * "over 10 %" ends at x 572 above the line, "about 20 %" starts at x 760 below
 * it, "over 80 %" ends at x 1290 above it, "100 %" centred above its dot. The
 * caption at the top runs to about x 1446 (67 characters at 32). */
(function () {
  const X = (year) => 160 + (year - 1935) * 28.8;
  const Y = (p) => 560 - 4.8 * p;
  const pts = [[1935, 0], [1950, 10], [1955, 20], [1975, 80], [1985, 100]];
  const path = pts.map(([t, p], k) => `${k ? "L" : "M"}${X(t)},${Y(p)}`).join(" ");
  const ticks = [1935, 1945, 1955, 1965, 1975, 1985].map((t) =>
    d.label(X(t), 0, String(t), { size: 32, color: C.gray, anchor: "middle", centerY: 600 }));
  const grid = [50, 100].map((p) => d.line(160, Y(p), 1600, Y(p), { color: C.dark }));
  const yl = [[0, "0 %"], [50, "50 %"], [100, "100 %"]].map(([p, t]) =>
    d.label(140, 0, t, { size: 32, color: C.gray, anchor: "end", centerY: Y(p) }));
  el("fig-history").innerHTML = d.svg(1680, 660,
    ...grid, d.line(160, 560, 1600, 560, { color: C.gray }), ...ticks, ...yl,
    `<path d="${path}" fill="none" stroke="${C.light}" stroke-width="3" stroke-dasharray="10 8"/>`,
    ...pts.map(([t, p]) => `<circle cx="${X(t)}" cy="${Y(p)}" r="10" fill="${C.white}"/>`),
    d.label(180, 0, "none", { size: 32, centerY: 525 }),
    d.label(572, 0, "over 10 %", { size: 32, anchor: "end", centerY: 482 }),
    d.label(760, 0, "about 20 %", { size: 32, centerY: 500 }),
    d.label(1290, 0, "over 80 %", { size: 32, anchor: "end", centerY: 150 }),
    d.label(1600, 0, "100 %", { size: 32, anchor: "middle", centerY: 40 }),
    d.label(160, 0, "share of original articles in imrad form, dots as stated in the text", { size: 32, color: C.gray, centerY: 30 }));
})();

/* --- slide: how long is each part? (Döring 2023, p. 771) --------------------
 * Figure 1680 x 660 (has-punch). Six bars of a paper of 20 pages, 56 high on
 * a pitch of 96 from centre y 40; names right-aligned at x 360 ("introduction"
 * at 32 is about 230), bars from x 400 at 180 per page, so the six pages of
 * the results end at x 1480 and their label ("6 pages", about 134) at 1634.
 * The results are blue, the point of the slide; the caption below in grey. */
(function () {
  const parts = [["introduction", 1], ["theory", 4], ["methods", 2], ["results", 6], ["discussion", 3], ["references", 4]];
  const bars = [];
  parts.forEach(([name, pages], k) => {
    const cy = 40 + 96 * k, col = name === "results" ? C.blue : C.light;
    bars.push(d.label(360, 0, name, { size: 32, anchor: "end", centerY: cy, color: name === "results" ? C.blue : C.white }),
      `<rect x="400" y="${cy - 28}" width="${180 * pages}" height="56" fill="${col}"/>`,
      d.label(420 + 180 * pages, 0, pages + (pages === 1 ? " page" : " pages"), { size: 32, color: C.gray, centerY: cy }));
  });
  el("fig-length").innerHTML = d.svg(1680, 660, ...bars,
    d.label(400, 0, "a rule of thumb for an empirical paper of 20 pages", { size: 32, color: C.gray, centerY: 620 }));
})();

/* --- slide: the hourglass ------------------------------------------------------
 * Figure 1680 x 660 (has-punch). Ten boxes centred at x 640, 56 high on a
 * pitch of 64 from y 12, so the last ends at y 644. Widths narrow from 1000 to
 * 380 and widen again; the longest text in a narrow box, "how you found out"
 * (17 characters, about 326), fits 380 minus the margins. Question and answer
 * are blue: the punchline names them. On the right, grey brackets at x 1200
 * name the sections, labels from x 1230. Build-up: introduction, then methods
 * and results, then the discussion. */
(function () {
  const rows = [
    ["the topic and why it matters", 1000], ["what is known", 820], ["the gap", 640], ["your question", 460, true],
    ["how you found out", 380], ["what you found", 380],
    ["your answer", 460, true], ["compared with others", 640], ["limitations", 820], ["what follows from it", 1000]];
  const y = (k) => 12 + 64 * k;
  const box = (k) => {
    const [text, w, point] = rows[k];
    return d.box(640 - w / 2, y(k), w, 56, text, point ? { border: C.blue, color: C.blue, width: 3 } : { border: C.light });
  };
  const bracket = (from, to, name) => [
    d.line(1200, y(from) + 4, 1200, y(to) + 52, { color: C.gray, width: 2 }),
    d.label(1230, 0, name, { size: 32, color: C.gray, centerY: (y(from) + y(to) + 56) / 2 })];
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => box(a + i));
  el("fig-hourglass").innerHTML = d.svg(1680, 660,
    d.g("intro", ...range(0, 3), ...bracket(0, 3, "introduction")),
    d.g("middle", ...range(4, 5), ...bracket(4, 4, "methods"), ...bracket(5, 5, "results")),
    d.g("disc", ...range(6, 9), ...bracket(6, 9, "discussion")));
  const a = d.anim("fig-hourglass");
  a.set("middle", { opacity: 0 }); a.set("disc", { opacity: 0 });
  a.step(a.show("middle", { dur: 500 }));
  a.step(a.show("disc", { dur: 500 }));
})();

/* --- slides: what goes in, what stays out ----------------------------------------
 * Figure 1680 x 660 (has-punch). Two columns divided by a grey line at x 880.
 * Left "goes in" at 48 with a green check before it (the check means "belongs
 * here"); its items in white at 32 from x 76, at most 40 characters (768,
 * ending before x 860). Right "stays out" at 48 in grey, items in grey from
 * x 940, at most 38 characters (730, ending before x 1676). Items on a pitch
 * of 96 from centre y 150, so five end at 534. The item the punchline speaks
 * of is blue. Nothing is red: what stays out is not wrong, it belongs to
 * another section. */
function inOut(id, ins, outs, point) {
  const parts = [
    d.line(880, 10, 880, 640, { color: C.dark }),
    d.mark(40, 50, true),
    d.label(76, 0, "goes in", { size: 48, centerY: 50 }),
    d.label(940, 0, "stays out", { size: 48, color: C.gray, centerY: 50 })];
  ins.forEach((t, k) => parts.push(d.label(76, 0, t, { size: 32, centerY: 150 + 96 * k, color: k === point ? C.blue : C.white })));
  outs.forEach((t, k) => parts.push(d.label(940, 0, t, { size: 32, centerY: 150 + 96 * k, color: C.gray })));
  el(id).innerHTML = d.svg(1680, 660, ...parts);
}
inOut("fig-intro",
  ["why the topic matters", "what is already known", "the gap: what is not known yet", "your question, in the last paragraph"],
  ["a summary of the whole field", "your results", "a question that appears only later"], 3);
inOut("fig-methods",
  ["the data source, and that you reuse it", "the sample and how it was recruited", "the questions you use, word for word",
    "how you cleaned the data", "how you analysed them"],
  ["what a mean or a median is", "your results"], 0);
inOut("fig-results",
  ["findings in the order of your questions", "numbers, with the size of each group", "tables and figures",
    "each finding once: text, table or figure"],
  ["why it is so", "what it means", "words like “remarkably”"], 3);
inOut("fig-discussion",
  ["the answer to your question, first", "how it compares with other studies", "the limitations of data and method",
    "what follows for practice and research"],
  ["new results", "every number once again", "a vague “more research is needed”"], 0);

/* --- slide: result or interpretation ------------------------------------------------
 * Figure 1680 x 660 (has-punch). The sentence from the quiz in a box 900 x 130
 * at (390, 60), two lines at 32 from x 414; the longer, "probably because they
 * value animal welfare." (43 characters), is about 826, so it ends near 1240.
 * Text block 88..162, 28 from either edge. Step 1 cuts it in two: arrows from
 * under the box lead to two boxes 816 x 240 at x 4 and 860, y 340. In each box
 * a grey heading and three lines (heading centre y + 46, lines 64, 105.6 and
 * 147.2 below it), so the block runs from y + 30 to y + 210 and keeps 30 from
 * both edges; the longest line, "vegetarians named a higher price limit" (38),
 * is about 730. */
(function () {
  const half = (x, head, text) => [
    d.box(x, 340, 816, 240, "", { border: C.light }),
    d.label(x + 24, 0, head, { size: 32, color: C.gray, centerY: 386 }),
    d.label(x + 24, 0, text, { size: 32, centerY: 450 + 41.6 })];
  el("fig-split").innerHTML = d.svg(1680, 660,
    textBox(390, 60, 900, 130, "vegetarians named a higher price limit,\nprobably because they value animal welfare."),
    d.g("split",
      d.arrow(600, 190, 412, 340, { color: C.gray }), d.arrow(1080, 190, 1268, 340, { color: C.gray }),
      ...half(4, "results", "vegetarians named a higher price limit\nthan omnivores, with a median of\n2.49 € against 1.99 €."),
      ...half(860, "discussion", "this may reflect that they value\nanimal welfare, as earlier studies\nsuggest.")));
  const a = d.anim("fig-split");
  a.set("split", { opacity: 0 });
  a.step(a.show("split", { dur: 600 }));
})();

/* --- slide: dissecting a real paper (Dorina et al. 2025) -----------------------------
 * Figure 1680 x 804. The article as an outline in a grey frame (4..1000 x
 * 4..800): the title at 48 (29 characters, about 835), then 16 headings at 32
 * on a pitch of 42 from centre y 130, sections in white from x 40,
 * subsections in grey from x 80; the longest, "3.2. predicting plant-based
 * milk consumption" (44, about 845), ends near x 925. The headings are the
 * article's own (checked against the JATS full text). Step by step a blue
 * highlight marks a row and a blue label on the right (from x 1080, at most 31
 * characters, about 595) says what to read there; an arrow joins them. */
(function () {
  const rows = [
    ["abstract", 0, true], ["1. introduction", 0], ["1.1. theory of planned behaviour", 1], ["1.2. the current study", 1],
    ["2. materials and methods", 0], ["2.1. procedure", 1], ["2.2. participants", 1], ["2.3. measures", 1], ["2.4. data analysis", 1],
    ["3. results", 0], ["3.1. predicting intention", 1], ["3.2. predicting plant-based milk consumption", 1],
    ["4. discussion", 0], ["strengths and limitations", 1], ["5. conclusions", 0], ["references", 0, true]];
  const cy = (k) => 130 + 42 * k;
  const x = (k) => (rows[k][1] ? 80 : 40);
  const mark = (k, text) => [
    d.highlight(x(k), rows[k][0].length * 19.2, cy(k), 32, { color: C.blue, opacity: 0.3 }),
    d.arrow(1070, cy(k), 1010, cy(k), { color: C.blue, width: 3 }),
    d.label(1080, 0, text, { size: 32, color: C.blue, centerY: cy(k) })];
  el("fig-paper").innerHTML = d.svg(1680, 804,
    d.box(4, 4, 996, 796, "", { border: C.gray }),
    d.label(40, 0, "health, environment or taste?", { size: 48, centerY: 60 }),
    ...rows.map(([t, sub, grey], k) => d.label(x(k), 0, t, { size: 32, centerY: cy(k), color: sub || grey ? C.gray : C.white })),
    d.g("m1", ...mark(3, "the question, with hypotheses")),
    d.g("m2", ...mark(12, "the answer: first paragraph")),
    d.g("m3", ...mark(13, "the limitations")));
  const a = d.anim("fig-paper");
  ["m1", "m2", "m3"].forEach((m) => a.set(m, { opacity: 0 }));
  ["m1", "m2", "m3"].forEach((m) => a.step(a.show(m, { dur: 500 })));
})();

/* --- slide: the paper in miniature ----------------------------------------------------
 * Figure 1680 x 804. Five rows on a pitch of 120 from centre y 80: the part in
 * grey, right-aligned at x 260, and one sentence at 32 from x 300; the longest
 * (70 characters, about 1344) ends near x 1644. The numbers are those of the
 * milk survey (median of price_too_expensive by diet: vegetarian 2.49 €,
 * n = 29; omnivore 1.99 €, n = 379; 611 of 2,809 named a price). The caption
 * in grey at y 700. One row per step. */
(function () {
  const rows = [
    ["problem", "milk competes on price, so it matters where people's price limits lie."],
    ["question", "do people with different diets name different price limits for milk?"],
    ["method", "we reanalysed an existing survey; 611 of 2,809 people named a limit."],
    ["findings", "vegetarians' median limit was 2.49 €, that of omnivores 1.99 €."],
    ["conclusion", "price limits may differ by diet, which a larger study should test."]];
  el("fig-abstract").innerHTML = d.svg(1680, 804,
    ...rows.map(([part, text], k) => d.g("r" + k,
      d.label(260, 0, part, { size: 32, color: C.gray, anchor: "end", centerY: 80 + 120 * k }),
      d.label(300, 0, text, { size: 32, centerY: 80 + 120 * k }))),
    d.label(300, 0, "one sentence per part, about 150 to 250 words in all, written last", { size: 32, color: C.gray, centerY: 700 }));
  const a = d.anim("fig-abstract");
  for (let k = 1; k <= 4; k++) a.set("r" + k, { opacity: 0 });
  for (let k = 1; k <= 4; k++) a.step(a.show("r" + k, { dur: 500 }));
})();
