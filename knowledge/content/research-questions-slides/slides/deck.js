// Drawings of "what is a research question?" (second version, 2026-11-11).
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without. Widths of text are estimated as
// characters x size x 0.6 (Arial and the code font alike).
//
// The second version shows answers instead of framing questions: sentences
// with their important words in colour instead of rows of boxes, and small
// charts with the numbers of the survey (all recomputed from
// mds12_schoko_milch.csv). Colours: grey for context or a weak version, blue
// for the point of a slide and for the parts of a question that point into
// the data, yellow for what the slide is about right now, green with a check
// for a question that works. There is no red in this deck: a question that
// does not work stays grey and says why in grey.
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* Lines of text in which single words carry their own colour. Each line is a
 * list of segments: a plain string, or [text, colour, keepCase]. The block is
 * centred on cy like label(); anchor "middle" centres every line on x. */
function rich(x, cy, lines, o = {}) {
  const size = o.size || 32, lh = 1.3;
  const y0 = cy + size * 0.35 - (lines.length - 1) * size * lh / 2;
  const family = C.font.replace(/"/g, "'");
  return lines.map((segs, i) =>
    `<text x="${x}" y="${y0 + i * size * lh}" text-anchor="${o.anchor || "start"}" font-family="${family}" font-size="${size}" fill="${o.color || C.white}">` +
    segs.map((s) => (typeof s === "string" ? esc(s)
      : `<tspan fill="${s[1]}"${s[2] ? ' class="keep-case"' : ""}>${esc(s[0])}</tspan>`)).join("") +
    `</text>`).join("");
}

const mono = (x, cy, text, o = {}) =>
  d.label(x, 0, text, { size: 32, mono: true, keepCase: true, color: C.gray, centerY: cy, ...o });

/* --- slide: topic, problem, question -------------------------------------------
 * Figure 1680 x 804, after Döring (2023), p. 148. A funnel from 1400 wide at
 * y 20 (x 140..1540) to a spout 280 wide (x 700..980) at y 470, down to y 540,
 * filled in three bands that appear with their level. Everything is centred
 * on x 840: the topic at 48 (y 105), the problem in two lines at 32 (y 285,
 * "how price affects choosing" about 500, where the funnel is about 830 wide)
 * and, under the spout, the question in three lines at 48 in yellow, the
 * longest "alpro oat drink change when its price" (37 characters, about 1066,
 * x 307..1373). Level names in grey at x 40; "question" ends at 195. */
(function () {
  const top = 20, bot = 470;
  const xl = (y) => 140 + 560 * (y - top) / (bot - top);
  const xr = (y) => 1540 - 560 * (y - top) / (bot - top);
  const band = (y1, y2) =>
    `<path d="M${xl(y1)} ${y1} L${xr(y1)} ${y1} L${xr(y2)} ${y2} L${xl(y2)} ${y2} Z" fill="${C.dark}" fill-opacity="0.5"/>`;
  el("fig-funnel").innerHTML = d.svg(1680, 804,
    band(top, 190),
    d.g("b2", band(200, 370)),
    d.g("b3", band(380, bot), `<rect x="700" y="${bot}" width="280" height="70" fill="${C.dark}" fill-opacity="0.5"/>`),
    `<path d="M140 ${top} L1540 ${top} L980 ${bot} L980 540 M700 540 L700 ${bot} L140 ${top}" fill="none" stroke="${C.gray}" stroke-width="2"/>`,
    d.label(40, 0, "topic", { size: 32, color: C.gray, centerY: 105 }),
    d.label(840, 0, "plant-based milk", { size: 48, anchor: "middle", centerY: 105 }),
    d.g("problem",
      d.label(40, 0, "problem", { size: 32, color: C.gray, centerY: 285 }),
      d.label(840, 0, "how price affects choosing\noat milk over cow's milk", { size: 32, anchor: "middle", centerY: 285 })),
    d.g("question",
      d.arrow(840, 548, 840, 596, { color: C.yellow, width: 3 }),
      d.label(40, 0, "question", { size: 32, color: C.gray, centerY: 690 }),
      d.label(840, 0, "how does purchase certainty for\nalpro oat drink change when its price\nrises from 1.79 to 2.09 euros?",
        { size: 48, color: C.yellow, anchor: "middle", centerY: 690 })));
  const a = d.anim("fig-funnel");
  a.step(a.show("b2", { dur: 400 }), a.show("problem", { dur: 400 }));
  a.step(a.show("b3", { dur: 400 }), a.show("question", { dur: 400 }));
})();

/* --- slide: two conditions -------------------------------------------------------
 * Figure 1680 x 804, after Huntington-Klein, ch. 2. A map instead of boxes:
 * x axis "answerable with evidence" from the origin (220, 700) to 1660, y axis
 * "teaches us how the world works" up to 40, quadrants divided by dashed lines
 * at x 940 and y 370. Three questions land on it, one per step: top left the
 * ad (centred at 580), bottom right the count of big-city respondents (at
 * 1300; "answerable, but it teaches nothing" about 650), top right the good
 * question as a green verdict 640 x 180 at (980, 100), its two lines at most
 * 29 characters (about 557), its columns in the code font under it (y 330). */
(function () {
  el("fig-conditions").innerHTML = d.svg(1680, 804,
    d.line(940, 40, 940, 700, { color: C.dark, dashed: true }), d.line(220, 370, 1660, 370, { color: C.dark, dashed: true }),
    d.arrow(220, 700, 1660, 700, { color: C.gray }), d.arrow(220, 700, 220, 40, { color: C.gray }),
    d.label(1660, 0, "answerable with evidence", { size: 32, color: C.gray, anchor: "end", centerY: 750 }),
    d.label(250, 0, "teaches us how the world works", { size: 32, color: C.gray, centerY: 50 }),
    d.g("w1",
      d.label(580, 0, "which milk ad is the best?", { size: 32, color: C.light, anchor: "middle", centerY: 190 }),
      d.label(580, 0, "no measure decides “best”", { size: 32, color: C.gray, anchor: "middle", centerY: 250 })),
    d.g("w2",
      d.label(1300, 0, "how many respondents live\nin a big city?", { size: 32, color: C.light, anchor: "middle", centerY: 500 }),
      d.label(1300, 0, "answerable, but it teaches nothing", { size: 32, color: C.gray, anchor: "middle", centerY: 590 })),
    d.g("good",
      d.verdict(980, 100, 640, 180, "do older respondents buy a\nlarger share of organic food?", true),
      mono(1300, 330, "Q002alter, v032bioanteil", { anchor: "middle" })));
  const a = d.anim("fig-conditions");
  ["w1", "w2", "good"].forEach((g) => a.step(a.show(g, { dur: 500 })));
})();

/* --- slide: question or hypothesis -----------------------------------------------
 * Figure 1680 x 660 (has-punch), after Döring (2023), pp. 149-152. Two
 * sentences set large, without frames: the research question in blue at 48
 * (41 characters, about 1181), under it in grey what it is; then the
 * hypothesis in two lines at 48 (the longer 41 characters), under it in grey
 * what it is (77 characters at 32, about 1478). The hypothesis comes with
 * the step. */
(function () {
  el("fig-qh").innerHTML = d.svg(1680, 660,
    d.label(0, 0, "which shops do vegans use for their food?", { size: 48, color: C.blue, centerY: 80 }),
    d.label(0, 0, "a research question: open, for when prior knowledge is thin", { size: 32, color: C.gray, centerY: 150 }),
    d.g("hyp",
      d.label(0, 0, "respondents over 60 buy a larger share of\norganic food than respondents under 30.", { size: 48, centerY: 330 }),
      d.label(0, 0, "a hypothesis: a claim with a direction, derived from theory you have to cite", { size: 32, color: C.gray, centerY: 450 })));
  const a = d.anim("fig-qh");
  a.step(a.show("hyp", { dur: 500 }));
})();

/* --- slide: three kinds of questions ----------------------------------------------
 * Figure 1680 x 804. Three columns 516 wide centred at x 260, 840 and 1420,
 * one per step. Each: the kind at 48 (y 40), the question at 32 in up to
 * three lines (y 160, at most 24 characters, about 460), the answer from the
 * survey as a small chart (y 290..620) and the columns in the code font in
 * grey (y 690).
 * descriptive: a ring, r 130 with a stroke of 40, 73.5 % of it blue, the
 *   share at 80 in its middle (73.5 % of 2,811 name the discounter).
 * relational: two bars 140 wide on the base y 580 at 26 per percent, big
 *   cities 9.2 % (n = 1,042) in blue, elsewhere 4.4 % (n = 1,769).
 * causal: the four prices of the experiment as price tags, the yellow warning
 *   sign and in grey why: only a design that separates the cause, here an
 *   experiment, may answer it. Its answer comes on the slide "and the answer". */
(function () {
  const cx = [260, 840, 1420];
  const head = (k, kind, question) => [
    d.label(cx[k], 0, kind, { size: 48, anchor: "middle", centerY: 40 }),
    d.label(cx[k], 0, question, { size: 32, anchor: "middle", centerY: 160 })];
  const r = 130, circ = 2 * Math.PI * r, x0 = cx[0], y0 = 430;
  const ring = [
    `<circle cx="${x0}" cy="${y0}" r="${r}" fill="none" stroke="${C.dark}" stroke-width="40"/>`,
    `<circle cx="${x0}" cy="${y0}" r="${r}" fill="none" stroke="${C.blue}" stroke-width="40" stroke-dasharray="${0.735 * circ} ${circ}" transform="rotate(-90 ${x0} ${y0})"/>`,
    d.label(x0, 0, "73 %", { size: 80, anchor: "middle", centerY: y0 }),
    d.label(x0, 0, "name the discounter", { size: 32, color: C.gray, anchor: "middle", centerY: 615 })];
  const bar = (x, pct, colour, value, name) => {
    const h = 26 * pct;
    return [`<rect x="${x}" y="${580 - h}" width="140" height="${h}" fill="${colour}"/>`,
      d.label(x + 70, 0, value, { size: 48, color: colour, anchor: "middle", centerY: 580 - h - 40 }),
      d.label(x + 70, 0, name, { size: 32, color: C.gray, anchor: "middle", centerY: 615 })];
  };
  const tags = [1.69, 1.79, 1.89, 2.09].map((p, j) =>
    d.box(cx[2] - 250 + 128 * j, 300, 112, 60, p.toFixed(2), { border: C.light, color: C.light }));
  el("fig-kinds").innerHTML = d.svg(1680, 804,
    d.g("k0", ...head(0, "descriptive", "what share of the\nrespondents shops\nat a discounter?"), ...ring,
      mono(cx[0], 690, "v008ort_1discount", { anchor: "middle" })),
    d.g("k1", ...head(1, "relational", "do people in big cities\nshop online more often?"),
      ...bar(cx[1] - 160, 9.2, C.blue, "9 %", "big city"), ...bar(cx[1] + 20, 4.4, C.light, "4 %", "elsewhere"),
      mono(cx[1], 690, "D044stadtf,\nv008ort_9online", { anchor: "middle" })),
    d.g("k2", ...head(2, "causal", "does a higher price\nlower purchase certainty\nfor alpro oat drink?"), ...tags,
      d.mark(cx[2], 430, "caution"),
      d.label(cx[2], 0, "only with a design that\nseparates the cause,\nhere an experiment", { size: 32, color: C.gray, anchor: "middle", centerY: 540 }),
      mono(cx[2], 690, "ad015p1reaktion4,\nU015p1reaktion4_3alpro", { anchor: "middle" })));
  const a = d.anim("fig-kinds");
  a.step(a.show("k1", { dur: 500 }));
  a.step(a.show("k2", { dur: 500 }));
})();

/* --- slide: too broad, just right -------------------------------------------------
 * Figure 1680 x 660 (has-punch). Left (x 0..1000): the broad question at 48
 * in grey (35 characters, about 1008) with why under it; with step 1 the
 * narrow question in three lines at 48 (the longest 34 characters, about
 * 979), its variation, outcome and comparison in blue, and under it the three
 * parts, the name in grey right-aligned at x 200 and the value from x 230.
 * Right (x 1100..1680), with step 2, the answer: the share of respondents
 * who buy at least half organic (codes 3 to 5 of v032bioanteil), vegetarians
 * 64.9 % (n = 134) against 35.7 % without restrictions (n = 1,827), as two
 * bars 150 wide on the base y 520 at 4 per percent. */
(function () {
  const B = C.blue;
  const part = (cy, name, value, isColumn) => [
    d.label(200, 0, name, { size: 32, color: C.gray, anchor: "end", centerY: cy }),
    d.label(230, 0, value, { size: 32, color: B, centerY: cy, mono: isColumn, keepCase: isColumn })];
  const bar = (cx, pct, colour, value, name, n) => {
    const h = 4 * pct;
    return [`<rect x="${cx - 75}" y="${520 - h}" width="150" height="${h}" fill="${colour}"/>`,
      d.label(cx, 0, value, { size: 48, color: colour, anchor: "middle", centerY: 520 - h - 40 }),
      d.label(cx, 0, name, { size: 32, color: C.gray, anchor: "middle", centerY: 560 }),
      d.label(cx, 0, n, { size: 20, color: C.gray, anchor: "middle", centerY: 600 })];
  };
  el("fig-broad").innerHTML = d.svg(1680, 660,
    d.label(0, 0, "what drives organic food purchases?", { size: 48, color: C.light, centerY: 40 }),
    d.label(0, 0, "a whole research programme, not one question", { size: 32, color: C.gray, centerY: 100 }),
    d.g("narrow",
      rich(0, 260, [
        ["do ", ["vegetarians", B], " buy a larger"],
        [["share of organic food", B], " ", ["than people", B]],
        [["who eat meat without restrictions", B], "?"]], { size: 48 }),
      ...part(430, "variation", "V041nofleischf", true),
      ...part(480, "outcome", "v032bioanteil", true),
      ...part(530, "comparison", "vegetarians against no restrictions", false)),
    d.g("answer",
      d.label(1390, 0, "buy at least half organic", { size: 32, color: C.gray, anchor: "middle", centerY: 40 }),
      ...bar(1250, 64.9, C.blue, "65 %", "vegetarian", "n = 134"),
      ...bar(1530, 35.7, C.light, "36 %", "no restriction", "n = 1,827")));
  const a = d.anim("fig-broad");
  a.step(a.show("narrow", { dur: 500 }));
  a.step(a.show("answer", { dur: 500 }));
})();

/* --- slide: four traps ---------------------------------------------------------------
 * Figure 1680 x 804. A grid of two by two cells 810 wide at x 0 and 870,
 * y 0 and 410, divided by dark lines. In each cell the name of the trap in
 * grey (y + 30), the question at 48 in two lines (y + 140; the longest line,
 * "does a higher income make", 25 characters, about 720) and why these data
 * cannot answer it in grey (y + 270). One cell per step; the question of the
 * cell before turns grey, so that white is always the current one. */
(function () {
  const traps = [
    ["normative", "should oat milk cost as\nmuch as cow's milk?", "data describe what is,\nthey do not judge it"],
    ["vague", "what do germans think\nabout food?", "no object, no measure"],
    ["causal without design", "does a higher income make\npeople buy organic?", "income goes with education,\nplace and values"],
    ["not in the data", "has organic buying grown\nsince 2020?", "one survey at one time,\nnovember 2025"]];
  const cells = traps.map(([name, question, why], k) => {
    const x = (k % 2) * 870, y = Math.floor(k / 2) * 410;
    return d.g("t" + k,
      d.label(x, 0, name, { size: 32, color: C.gray, centerY: y + 30 }),
      d.g("q" + k, d.label(x, 0, question, { size: 48, centerY: y + 140 })),
      d.label(x, 0, why, { size: 32, color: C.gray, centerY: y + 270 }));
  });
  el("fig-traps").innerHTML = d.svg(1680, 804,
    d.line(835, 10, 835, 794, { color: C.dark }), d.line(0, 390, 1680, 390, { color: C.dark }), ...cells);
  const a = d.anim("fig-traps");
  for (let k = 1; k < 4; k++) a.step(a.color("q" + (k - 1), C.gray, { part: "text", dur: 300 }), a.show("t" + k, { dur: 500 }));
})();

/* --- slide: rescue the question ----------------------------------------------------
 * Figure 1680 x 660 (has-punch), everything centred on x 840. The trap at 48
 * (46 characters, about 1325) with "make" in yellow, why in grey under it.
 * With the step a grey arrow leads to the rescued question in two lines at 48
 * (the longer 40 characters, about 1152), "related to" in green, its columns in
 * the code font in grey and the green check under it. */
(function () {
  el("fig-rescue").innerHTML = d.svg(1680, 660,
    rich(840, 70, [["does a higher income ", ["make", C.yellow], " people buy organic?"]], { size: 48, anchor: "middle" }),
    d.label(840, 0, "causal, without a design that could show it", { size: 32, color: C.gray, anchor: "middle", centerY: 140 }),
    d.g("fix",
      d.arrow(840, 185, 840, 250, { color: C.gray }),
      rich(840, 330, [["is household income ", ["related to", C.green], " the share"], ["of organic food people buy?"]], { size: 48, anchor: "middle" }),
      mono(840, 445, "d049einkommen, v032bioanteil", { anchor: "middle" }),
      d.mark(840, 515, true)));
  const a = d.anim("fig-rescue");
  a.step(a.show("fix", { dur: 500 }));
})();

/* --- slide: from idea to question --------------------------------------------------
 * Figure 1680 x 804. Left the vague idea at 48 in grey (two lines, "prices and"
 * about 288), an arrow to a dark line at x 560 that holds six fields on a
 * pitch of 124 from y 30: the name in grey right-aligned at x 800, the value
 * in white from x 830 (two lines at most, the longest "milk alternatives in
 * the last 12 months" about 750, ending near 1580). No frames; one step fills
 * one field. */
(function () {
  const fields = [
    ["who", "people who bought and drank milk or\nmilk alternatives in the last 12 months"],
    ["where", "an online panel across germany"],
    ["when", "november 2025"],
    ["variation", "price of alpro oat drink: 1.69, 1.79,\n1.89 or 2.09 euros"],
    ["outcome", "purchase certainty from −4 to +4"],
    ["comparison", "each price against the regular 1.79"]];
  const rows = fields.map(([name, value], k) => {
    const cy = 80 + 124 * k;
    return d.g("f" + k,
      d.label(800, 0, name, { size: 32, color: C.gray, anchor: "end", centerY: cy }),
      d.label(830, 0, value, { size: 32, centerY: cy }));
  });
  el("fig-idea").innerHTML = d.svg(1680, 804,
    d.label(0, 0, "prices and\noat milk", { size: 48, color: C.light, centerY: 402 }),
    d.arrow(340, 402, 540, 402, { color: C.gray }),
    d.line(560, 40, 560, 764, { color: C.dark, width: 3 }), ...rows);
  const a = d.anim("fig-idea");
  for (let k = 0; k < 6; k++) a.set("f" + k, { opacity: 0 });
  for (let k = 0; k < 6; k++) a.step(a.show("f" + k, { dur: 400 }));
})();

/* --- slide: the price experiment -----------------------------------------------------
 * Figure 1680 x 660 (has-punch). Four shelves 380 wide on a pitch of 420 from
 * x 22. On each three cartons drawn as outlines with a gable (110 wide, body
 * y 240..370, gable to y 195): weihenstephan, gut & günstig and alpro, the
 * names at 20 in two lines (7 characters, about 85). The shelf is a grey line
 * at y 372. Prices under the cartons: the two that stay the same in
 * grey-light at 32, the price of alpro in blue at 48, because it is the one
 * thing that differs. The variant above each shelf (y 140), how many people
 * saw it in grey under it (y 520), and above all in grey that chance decided
 * (y 50, 46 characters, about 880). */
(function () {
  const variants = [["−10 cents", "1.69", 141], ["regular", "1.79", 142], ["+10 cents", "1.89", 161], ["+30 cents", "2.09", 157]];
  const packs = [["weihen-\nstephan", "1.79"], ["gut &\ngünstig", "1.09"], ["alpro", null]];
  const carton = (px, colour, width) =>
    `<path d="M${px} 370 L${px} 240 L${px + 15} 205 L${px + 15} 195 L${px + 95} 195 L${px + 95} 205 L${px + 110} 240 L${px + 110} 370 Z M${px} 240 L${px + 110} 240" ` +
    `fill="${C.bg}" stroke="${colour}" stroke-width="${width}" stroke-linejoin="round"/>`;
  const parts = [d.label(840, 0, "chance decided which shelf each respondent saw", { size: 32, color: C.gray, anchor: "middle", centerY: 50 })];
  variants.forEach(([name, price, n], k) => {
    const x = 22 + 420 * k;
    parts.push(d.label(x + 190, 0, name, { size: 32, anchor: "middle", centerY: 140 }),
      d.line(x, 372, x + 380, 372, { color: C.gray, width: 4 }));
    packs.forEach(([brand, fixed], j) => {
      const px = x + 10 + 125 * j, alpro = fixed === null, col = alpro ? C.blue : C.light;
      parts.push(carton(px, col, alpro ? 3 : 2),
        d.label(px + 55, 0, brand, { size: 20, color: col, anchor: "middle", centerY: 305 }),
        d.label(px + 55, 0, alpro ? price : fixed, { size: alpro ? 48 : 32, color: col, anchor: "middle", centerY: 420 }));
    });
    parts.push(d.label(x + 190, 0, "n = " + n, { size: 32, color: C.gray, anchor: "middle", centerY: 520 }));
  });
  el("fig-shelves").innerHTML = d.svg(1680, 660, ...parts);
})();

/* --- slide: and the answer -------------------------------------------------------------
 * Figure 1680 x 660 (has-punch). The mean purchase certainty for alpro per
 * price on the full scale from -4 to +4 (y 560..80, 60 per point, zero at
 * 320), the prices placed in proportion on x (1.69 at 420, 2500 per euro, so
 * 2.09 at 1420). Each mean is a blue dot with its 95 % interval (mean +- 1.96
 * standard errors), the value at 32 above the interval:
 *   1.69: n 140, mean +0.09, sd 2.82, 95 % from -0.37 to +0.56
 *   1.79: n 139, mean -0.13, sd 2.93, 95 % from -0.62 to +0.36
 *   1.89: n 161, mean +0.03, sd 3.08, 95 % from -0.44 to +0.51
 *   2.09: n 156, mean -0.26, sd 2.95, 95 % from -0.72 to +0.21
 * The scale names in grey right-aligned at x 360 ("−4 certainly not" about
 * 307), prices under the axis (y 600) with n at 20 (y 640). */
(function () {
  const X = (p) => 420 + (p - 1.69) * 2500;
  const Y = (v) => 320 - 60 * v;
  const pts = [[1.69, 0.09, -0.37, 0.56, 140, "+0.1"], [1.79, -0.13, -0.62, 0.36, 139, "−0.1"],
    [1.89, 0.03, -0.44, 0.51, 161, "0.0"], [2.09, -0.26, -0.72, 0.21, 156, "−0.3"]];
  const parts = [
    d.line(380, Y(4), 1500, Y(4), { color: C.dark }), d.line(380, Y(-4), 1500, Y(-4), { color: C.dark }),
    d.line(380, Y(0), 1500, Y(0), { color: C.gray, width: 2 }),
    d.label(360, 0, "+4 certainly", { size: 32, color: C.gray, anchor: "end", centerY: Y(4) }),
    d.label(360, 0, "0", { size: 32, color: C.gray, anchor: "end", centerY: Y(0) }),
    d.label(360, 0, "−4 certainly not", { size: 32, color: C.gray, anchor: "end", centerY: Y(-4) }),
    d.label(380, 0, "mean purchase certainty for alpro, with its 95 % interval", { size: 32, color: C.gray, centerY: 25 })];
  pts.forEach(([p, m, lo, hi, n, text]) => {
    const x = X(p);
    parts.push(d.line(x, Y(hi), x, Y(lo), { color: C.blue, width: 4 }),
      d.line(x - 12, Y(hi), x + 12, Y(hi), { color: C.blue, width: 4 }), d.line(x - 12, Y(lo), x + 12, Y(lo), { color: C.blue, width: 4 }),
      `<circle cx="${x}" cy="${Y(m)}" r="12" fill="${C.blue}"/>`,
      d.label(x, 0, text, { size: 32, anchor: "middle", centerY: Y(hi) - 34 }),
      d.label(x, 0, p.toFixed(2) + " €", { size: 32, color: p === 1.79 ? C.white : C.light, anchor: "middle", centerY: 600 }),
      d.label(x, 0, "n = " + n, { size: 20, color: C.gray, anchor: "middle", centerY: 640 }));
  });
  el("fig-answer").innerHTML = d.svg(1680, 660, ...parts);
})();

/* --- slide: the data came first -------------------------------------------------------
 * Figure 1680 x 804, read from left to right. Your question (4..364, y
 * 300..400) leads to the check, a box 520 x 160 at (480, 270) with two lines
 * ("is every word a column", about 422). From its right edge a line to a
 * dark-grey bus at x 1060 (y 115..590), and from it three arrows into the
 * outcomes at x 1200 (476 wide): answerable, a green verdict 150 high (its
 * text sits at y 98, so the arrow enters at 115); drop it, grey and dashed
 * (y 300..400); adapt the question, blue (y 540..640). Above each arrow its
 * condition in grey, centred at 1129 ("partly" about 115). The blue way back
 * leaves adapt at its bottom, goes down to y 740 and left with corners of
 * radius 40, and enters your question from below; "check it again" in blue
 * under it (y 775). The outcomes and the way back come with the step. */
(function () {
  const out = (cy, cond) => [d.arrow(1060, cy, 1198, cy, { color: C.gray }),
    d.label(1129, 0, cond, { size: 32, color: C.gray, anchor: "middle", centerY: cy - 30 })];
  el("fig-cycle").innerHTML = d.svg(1680, 804,
    d.arrow(364, 350, 478, 350, { color: C.gray }),
    d.box(4, 300, 360, 100, "your question", { border: C.light }),
    d.box(480, 270, 520, 160, "is every word a column\nin the codebook?", { border: C.light }),
    d.g("out",
      d.line(1000, 350, 1060, 350, { color: C.gray }), d.line(1060, 115, 1060, 590, { color: C.gray }),
      ...out(115, "yes"), ...out(350, "no"), ...out(590, "partly"),
      `<path d="M1438 640 L1438 700 Q1438 740 1398 740 L224 740 Q184 740 184 700 L184 420" fill="none" stroke="${C.blue}" stroke-width="3"/>`,
      d.arrow(184, 430, 184, 404, { color: C.blue, width: 3 }),
      d.label(811, 0, "check it again", { size: 32, color: C.blue, anchor: "middle", centerY: 775 }),
      d.verdict(1200, 40, 476, 150, "answerable", true),
      d.box(1200, 300, 476, 100, "drop it", { border: C.gray, color: C.light, dashed: true }),
      d.box(1200, 540, 476, 100, "adapt the question", { border: C.blue, color: C.blue, width: 3 })));
  const a = d.anim("fig-cycle");
  a.step(a.show("out", { dur: 600 }));
})();

/* --- slide: check it against the codebook ---------------------------------------------
 * Figure 1680 x 804. The sharpened question in three lines at 32 (the longest
 * 75 characters, about 1440), the four places that point into the data in
 * blue. Under it, without frames, one row per place on a pitch of 110 from
 * y 300: the place in blue (x 0; "people who buy and drink milk" about 557),
 * its column in the code font (x 620; "U015p1reaktion4_3alpro" about 422) and
 * what the codebook says in grey-light (x 1100, two lines of at most 29
 * characters, about 557). In grey at the bottom how many people it rests on. */
(function () {
  const B = C.blue;
  const rows = [
    ["people who buy and drink milk", "v006gekauft_3mi == 3", "bought and drank milk or milk\nalternatives in 12 months"],
    ["its price", "ad015p1reaktion4", "codes 1 to 4 for 1.69 to\n2.09 €, assigned by chance"],
    ["purchase certainty", "U015p1reaktion4_3alpro", "from −4 for certainly not\nto +4 for certainly"],
    ["the regular 1.79 euros", "ad015p1reaktion4 == 2", "“Normal alpro” in\nAD015p1reaktion4f"]];
  const parts = [
    rich(0, 70, [
      ["how does ", ["purchase certainty", B], " for alpro oat drink change among ", ["people who buy", B]],
      [["and drink milk", B], " when ", ["its price", B], " lies 10 cents below, or 10 or 30 cents above,"],
      [["the regular 1.79 euros", B], "?"]]),
    d.label(0, 0, "in the question", { size: 32, color: C.gray, centerY: 210 }),
    d.label(620, 0, "column", { size: 32, color: C.gray, centerY: 210 }),
    d.label(1100, 0, "what the codebook says", { size: 32, color: C.gray, centerY: 210 })];
  rows.forEach(([place, column, says], k) => {
    const cy = 300 + 110 * k;
    parts.push(d.line(0, cy - 55, 1680, cy - 55, { color: C.dark }),
      d.label(0, 0, place, { size: 32, color: B, centerY: cy }),
      mono(620, cy, column, { color: C.white }),
      d.label(1100, 0, says, { size: 32, color: C.light, centerY: cy, keepCase: k === 3 }));
  });
  parts.push(d.label(0, 0, "601 respondents saw a price and 596 rated alpro; time and place are not columns",
    { size: 32, color: C.gray, centerY: 750 }));
  el("fig-codebook").innerHTML = d.svg(1680, 804, ...parts);
})();
