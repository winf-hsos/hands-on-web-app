// Drawings of "what is a research question?".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without. Widths of text are estimated as
// characters x size x 0.6 (Arial and the code font alike).
//
// Colours: grey for everything that is only context or a weak version, blue
// for the point of a slide (the question that comes out of the funnel, what
// varies in the experiment, adapting a question), green with a check for a
// question that works. There is no red cross in this deck: a question that
// does not work stays grey and says why in grey.
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);

// A box whose lines stand left-aligned at a common edge, as the design rules
// ask for more than one line of text in a box.
function textBox(x, y, w, h, text, o = {}) {
  return d.box(x, y, w, h, "", o) +
    d.label(x + 24, 0, text, { size: o.size || 32, centerY: y + h / 2, color: o.color || C.white, keepCase: o.keepCase, mono: o.mono });
}

// A weak question: dashed grey frame, grey text. weak() centres the text in
// the box; weakBeside() places it like a verdict box, for a weak question
// that stands next to a green verdict, so that both texts sit at one height.
const weak = (x, y, w, h, text) => d.box(x, y, w, h, text, { border: C.gray, color: C.light, dashed: true });
const weakBeside = (x, y, w, h, text) => d.verdict(x, y, w, h, text, null, { border: C.gray, color: C.light, dashed: true });

/* --- slide: topic, problem, question -------------------------------------------
 * Figure 1680 x 804, after Döring (2023), p. 148. A funnel from 1400 wide at
 * y 40 (x 140..1540) to a spout 280 wide (x 700..980) at y 470, down to y 540;
 * its sides fall 560 in 430, so at y 248 the inside is 858 wide and at y 332
 * 640 wide. The topic (48, "plant-based milk" about 460) sits at y 120, the
 * problem (two lines at 32, the longer "how price affects choosing" about 500)
 * at y 290. Out of the spout an arrow leads into the question, a blue box
 * 1200 x 160 at (240, 600) with two lines at 32 from x 264; the longer line,
 * 55 characters, is about 1060. Level names in grey at x 40, left of the
 * funnel ("question" about 155, so it ends at 195, before the box at 240). */
(function () {
  el("fig-funnel").innerHTML = d.svg(1680, 804,
    `<path d="M140 40 L1540 40 L980 470 L980 540 M700 540 L700 470 L140 40" fill="none" stroke="${C.gray}" stroke-width="2"/>`,
    d.label(40, 0, "topic", { size: 32, color: C.gray, centerY: 120 }),
    d.label(840, 0, "plant-based milk", { size: 48, anchor: "middle", centerY: 120 }),
    d.g("problem",
      d.label(40, 0, "problem", { size: 32, color: C.gray, centerY: 290 }),
      d.label(840, 0, "how price affects choosing\noat milk over cow's milk", { size: 32, anchor: "middle", centerY: 290 })),
    d.g("question",
      d.arrow(840, 548, 840, 598, { color: C.blue, width: 3 }),
      d.label(40, 0, "question", { size: 32, color: C.gray, centerY: 680 }),
      textBox(240, 600, 1200, 160, "how does purchase certainty for alpro oat drink change\nwhen its price rises from 1.79 to 2.09 euros?",
        { border: C.blue, width: 3 })));
  const a = d.anim("fig-funnel");
  a.step(a.show("problem", { dur: 500 }));
  a.step(a.show("question", { dur: 500 }));
})();

/* --- slide: two conditions -------------------------------------------------------
 * Figure 1680 x 804, after Huntington-Klein, ch. 2. Two criteria 808 x 120 at
 * x 4 and 868 (2 from the edge, half the stroke width). Under each a weak
 * question 808 x 120 at y 190 that fails it, grey and dashed ("how many
 * respondents" in two lines, the longer about 400), and why in grey at y 380
 * (the longest line, "teaches nothing about behaviour", about 600). The
 * question that meets both is a green verdict 1000 x 170 at (340, 480): two
 * lines at 32, the longer 45 characters, about 860; its columns in the code
 * font in grey at y 716 (39 characters, about 750). */
(function () {
  el("fig-conditions").innerHTML = d.svg(1680, 804,
    d.box(4, 20, 808, 120, "answerable with evidence", { border: C.light }),
    d.box(868, 20, 808, 120, "tells us something about\nhow the world works", { border: C.light }),
    d.g("weak",
      weak(4, 190, 808, 120, "which milk ad is the best?"),
      weak(868, 190, 808, 120, "how many respondents\nlive in lower saxony?"),
      d.label(408, 0, "no measure for “best”, so\nno evidence can decide it", { size: 32, color: C.gray, anchor: "middle", centerY: 380 }),
      d.label(1272, 0, "answerable, but the answer\nteaches nothing about behaviour", { size: 32, color: C.gray, anchor: "middle", centerY: 380 })),
    d.g("good",
      d.verdict(340, 480, 1000, 170, "do respondents who care about the environment\nbuy a larger share of organic food?", true),
      d.label(840, 0, "p030green_5umweltbewusst, v032bioanteil", { size: 32, mono: true, color: C.gray, anchor: "middle", centerY: 716, keepCase: true })));
  const a = d.anim("fig-conditions");
  a.step(a.show("weak", { dur: 500 }));
  a.step(a.show("good", { dur: 500 }));
})();

/* --- slide: question or hypothesis -----------------------------------------------
 * Figure 1680 x 804, after Döring (2023), pp. 149-152. Two frames 808 x 560 at
 * x 4 and 868 (y 20..580). Inside, from x + 40: the name at 48 (y 90), what it
 * is in three lines at 32 (y 230), "for example" in grey (y 380) and an
 * example in grey-light (from y 450). The longest line, "findings, which you
 * have to cite", 32 characters, is about 615, inside 728. The research
 * question is blue, because it is the normal case for a survey that is
 * already collected; the sentence under the frames says so, in blue (78
 * characters at 32, about 1500). */
(function () {
  const col = (x, name, what, example, accent) => [
    d.box(x, 20, 808, 560, "", { border: accent ? C.blue : C.light, width: accent ? 3 : 2, rx: 16 }),
    d.label(x + 40, 0, name, { size: 48, color: accent ? C.blue : C.white, centerY: 90 }),
    d.label(x + 40, 0, what, { size: 32, centerY: 230 }),
    d.label(x + 40, 0, "for example", { size: 32, color: C.gray, centerY: 380 }),
    d.label(x + 40, 0, example, { size: 32, color: C.light, centerY: 470 })];
  el("fig-qh").innerHTML = d.svg(1680, 804,
    ...col(4, "research question", "open: it asks and does not claim,\noften a w-question (how, which, who),\nfor when prior knowledge is thin",
      "which shops do vegans\nuse for their food?", true),
    ...col(868, "hypothesis", "a claim with a direction, derived\nfrom theory or earlier findings,\nwhich you have to cite",
      "respondents over 60 buy a larger\nshare of organic food than\nrespondents under 30", false),
    d.label(840, 0, "with a survey that is already collected, the open question is the normal case",
      { size: 32, color: C.blue, anchor: "middle", centerY: 680 }));
})();

/* --- slide: three kinds of questions ----------------------------------------------
 * Figure 1680 x 804. Three columns 516 wide on a pitch of 580 from x 2 (the
 * last ends at 1678). Each: the kind at 48 in a box 516 x 90 (y 20..110),
 * what it asks in grey (two lines at 32, y 175), and one step each the
 * example from the survey as a verdict box 516 x 200 (y 250..450; three lines
 * at 32, the longest "lower purchase certainty" 24 characters, about 460,
 * inside 476), with its columns in the code font in grey below (first line on
 * the baseline 512). Causal gets the yellow warning sign: such a claim needs
 * a design that separates the cause, said in grey under it (y 650). */
(function () {
  const kinds = [
    ["descriptive", "how many, how often,\nhow is it distributed?", "what share of the\nrespondents shops\nat a discounter?", "v008ort_1discount", null],
    ["relational", "do groups differ, do two\nthings go together?", "do people in big cities\nshop online more often?", "d044stadt,\nv008ort_9online", null],
    ["causal", "what happens if we\nchange one thing?", "does a higher price\nlower purchase certainty\nfor alpro oat drink?", "ad015p1reaktion4,\nU015p1reaktion4_3alpro", "caution"]];
  const parts = [];
  kinds.forEach(([kind, asks], k) => {
    const x = 2 + 580 * k, cx = x + 258;
    parts.push(d.box(x, 20, 516, 90, kind, { border: C.light, size: 48 }),
      d.label(cx, 0, asks, { size: 32, color: C.gray, anchor: "middle", centerY: 175 }));
  });
  kinds.forEach(([, , example, columns, mark], k) => {
    const x = 2 + 580 * k, cx = x + 258;
    parts.push(d.g("ex" + k,
      d.verdict(x, 250, 516, 200, example, mark),
      d.label(cx, 512, columns, { size: 32, mono: true, color: C.gray, anchor: "middle", keepCase: true }),
      mark ? d.label(cx, 0, "needs a design that\nseparates the cause", { size: 32, color: C.gray, anchor: "middle", centerY: 650 }) : ""));
  });
  el("fig-kinds").innerHTML = d.svg(1680, 804, ...parts);
  const a = d.anim("fig-kinds");
  for (let k = 0; k < 3; k++) a.step(a.show("ex" + k, { dur: 500 }));
})();

/* --- slide: too broad, just right -------------------------------------------------
 * Figure 1680 x 660 (has-punch). Left the broad question, grey and dashed,
 * 700 x 260 at (4, 40), and why in grey under it (y 380). A grey arrow leads
 * to the narrow one, a green verdict 760 x 260 at (916, 40): four lines at 32,
 * the longest "share of organic food than" about 500. Under it its three
 * parts on the row y 470..560, centred at x 280, 840 and 1400: what each part
 * is in grey, the column or the groups below ("vegetarians against no
 * restrictions" in two lines, the longer about 400). */
(function () {
  const part = (cx, name, value, mono) => [
    d.label(cx, 0, name, { size: 32, color: C.gray, anchor: "middle", centerY: 470 }),
    d.label(cx, 0, value, { size: 32, mono, anchor: "middle", centerY: mono ? 530 : 551, keepCase: mono })];
  el("fig-broad").innerHTML = d.svg(1680, 660,
    weakBeside(4, 40, 700, 260, "what drives organic\nfood purchases?"),
    d.label(354, 0, "a whole research programme,\nnot one question", { size: 32, color: C.gray, anchor: "middle", centerY: 360 }),
    d.arrow(704, 148, 914, 148, { color: C.gray }),
    d.verdict(916, 40, 760, 260, "do vegetarians buy a larger\nshare of organic food than\npeople who eat meat\nwithout restrictions?", true),
    ...part(280, "one variation", "V041nofleischf", true),
    ...part(840, "one outcome", "v032bioanteil", true),
    ...part(1400, "one comparison", "vegetarians against\nno restrictions", false));
})();

/* --- slide: four traps ---------------------------------------------------------------
 * Figure 1680 x 804. Four rows 150 high on a pitch of 190 from y 20. In each:
 * the name of the trap in white at x 4 ("causal without design" about 405),
 * the question grey and dashed in a box 640 x 150 at x 440 (two lines, the
 * longest "should oat milk cost as much" about 540), and why it fails in grey
 * from x 1120 (the longest line, "income goes with education," about 520,
 * ends at 1640). One row per step. */
(function () {
  const traps = [
    ["normative", "should oat milk cost as\nmuch as cow's milk?", "data describe what is,\nthey do not judge it"],
    ["vague", "what do germans think\nabout food?", "no object, no measure"],
    ["causal without design", "does a higher income make\npeople buy organic?", "income goes with education,\nplace and values"],
    ["not in the data", "has organic buying grown\nsince 2020?", "one survey at one time,\nnovember 2025"]];
  const parts = traps.map(([name, question, why], k) => {
    const y = 20 + 190 * k, cy = y + 75;
    return d.g("t" + k,
      d.label(4, 0, name, { size: 32, centerY: cy }),
      weak(440, y, 640, 150, question),
      d.label(1120, 0, why, { size: 32, color: C.gray, centerY: cy }));
  });
  el("fig-traps").innerHTML = d.svg(1680, 804, ...parts);
  const a = d.anim("fig-traps");
  a.set("t1", { opacity: 0 }); a.set("t2", { opacity: 0 }); a.set("t3", { opacity: 0 });
  for (let k = 1; k < 4; k++) a.step(a.show("t" + k, { dur: 500 }));
})();

/* --- slide: rescue the question ----------------------------------------------------
 * Figure 1680 x 660 (has-punch), the drawing centred in it (y 110..430).
 * The trap grey and dashed, 680 x 240 at (4, 110), placed like the verdict
 * beside it so both texts sit at one height, why in grey under it (y 410).
 * A grey arrow to the rescued question, a green verdict 800 x 240 at (876, 110): three lines at 32, the longest "is
 * household income related" about 520. Its columns in the code font in grey
 * at y 400 ("d049einkommen, v032bioanteil", 28 characters, about 540). */
(function () {
  el("fig-rescue").innerHTML = d.svg(1680, 660,
    weakBeside(4, 110, 680, 240, "does income make\npeople buy organic?"),
    d.label(344, 0, "causal, without a design\nthat could show it", { size: 32, color: C.gray, anchor: "middle", centerY: 410 }),
    d.arrow(684, 208, 874, 208, { color: C.gray }),
    d.verdict(876, 110, 800, 240, "is household income related\nto the share of organic\nfood people buy?", true),
    d.label(1276, 0, "d049einkommen, v032bioanteil", { size: 32, mono: true, color: C.gray, anchor: "middle", centerY: 400, keepCase: true }));
})();

/* --- slide: from idea to question --------------------------------------------------
 * Figure 1680 x 804. Left the vague idea, grey and dashed, 400 x 120 at
 * (4, 342); an arrow leads to six fields on a pitch of 124 from y 30, each
 * 100 high: the name in grey right-aligned at x 740 ("comparison" about 190,
 * from x 550), the value in a box 916 wide at x 760 (two lines at most, the
 * longest "milk alternatives in the last 12 months" about 750, inside 868).
 * The empty fields are dashed; one step fills one field. */
(function () {
  const fields = [
    ["who", "people who bought and drank milk or\nmilk alternatives in the last 12 months"],
    ["where", "an online panel across germany"],
    ["when", "november 2025"],
    ["variation", "price of alpro oat drink: 1.69, 1.79,\n1.89 or 2.09 euros"],
    ["outcome", "purchase certainty from −4 to +4"],
    ["comparison", "each price against the regular 1.79"]];
  const parts = [
    weak(4, 342, 400, 120, "prices and oat milk"),
    d.arrow(404, 402, 536, 402, { color: C.gray })];
  fields.forEach(([name, value], k) => {
    const y = 30 + 124 * k;
    parts.push(d.label(740, 0, name, { size: 32, color: C.gray, anchor: "end", centerY: y + 50 }),
      d.box(760, y, 916, 100, "", { border: C.dark, dashed: true }));
  });
  fields.forEach(([, value], k) => {
    const y = 30 + 124 * k;
    parts.push(d.g("f" + k, textBox(760, y, 916, 100, value, { border: C.light })));
  });
  el("fig-idea").innerHTML = d.svg(1680, 804, ...parts);
  const a = d.anim("fig-idea");
  for (let k = 0; k < 6; k++) a.set("f" + k, { opacity: 0 });
  for (let k = 0; k < 6; k++) a.step(a.show("f" + k, { dur: 400 }));
})();

/* --- slide: the price experiment -----------------------------------------------------
 * Figure 1680 x 660 (has-punch). Four shelves 380 wide on a pitch of 420 from
 * x 22 (the last ends at 1662). On each three packs 110 x 170 at x + 10,
 * x + 135 and x + 260 (the last ends at x + 370): weihenstephan, gut & günstig
 * and alpro, the names at 20 in two lines (7 characters, about 85). The shelf
 * is a grey line at y 372. Prices under the packs: the two that stay the same
 * in grey-light at 32, the price of alpro in blue at 48, because it is the one
 * thing that differs. The variant above each shelf (y 140), how many people
 * saw it in grey under it (y 520), and above all in grey that chance decided
 * (y 50, 46 characters, about 880). */
(function () {
  const variants = [["−10 cents", "1.69", 141], ["regular", "1.79", 142], ["+10 cents", "1.89", 161], ["+30 cents", "2.09", 157]];
  const packs = [["weihen-\nstephan", "1.79"], ["gut &\ngünstig", "1.09"], ["alpro", null]];
  const parts = [d.label(840, 0, "chance decided which shelf each respondent saw", { size: 32, color: C.gray, anchor: "middle", centerY: 50 })];
  variants.forEach(([name, price, n], k) => {
    const x = 22 + 420 * k;
    parts.push(d.label(x + 190, 0, name, { size: 32, anchor: "middle", centerY: 140 }),
      d.line(x, 372, x + 380, 372, { color: C.gray, width: 4 }));
    packs.forEach(([brand, fixed], j) => {
      const px = x + 10 + 125 * j, alpro = fixed === null;
      parts.push(d.box(px, 200, 110, 170, brand, { border: alpro ? C.blue : C.light, color: alpro ? C.blue : C.light, size: 20, width: alpro ? 3 : 2 }),
        d.label(px + 55, 0, alpro ? price : fixed, { size: alpro ? 48 : 32, color: alpro ? C.blue : C.light, anchor: "middle", centerY: 420 }));
    });
    parts.push(d.label(x + 190, 0, "n = " + n, { size: 32, color: C.gray, anchor: "middle", centerY: 520 }));
  });
  el("fig-shelves").innerHTML = d.svg(1680, 660, ...parts);
})();

/* --- slide: the data came first -------------------------------------------------------
 * Figure 1680 x 804. The row y 100..200: your question (x 40..440), codebook
 * (x 640..1040) and variables (x 1240..1640), grey arrows between. From the
 * bottom of variables a line goes down to the bus at y 330, which runs from
 * x 240 to 1440; arrows lead from it into three outcomes on the row y 460:
 * adapt the question (blue, 400 x 110 at x 40), drop it (grey and dashed at
 * x 640) and answerable (a green verdict 400 x 150 at x 1240). What leads
 * there stands in grey under each (y 650; "every word has a column" about
 * 440, centred at 1440). The blue loop leaves adapt on its left side at its
 * middle (y 515), runs up at x 20 and enters your question from the left at
 * its middle (y 150); x 20 lies 20 left of the boxes and 18 from the edge.
 * One step adds the outcomes. */
(function () {
  el("fig-cycle").innerHTML = d.svg(1680, 804,
    d.arrow(440, 150, 638, 150, { color: C.gray }), d.arrow(1040, 150, 1238, 150, { color: C.gray }),
    d.box(40, 100, 400, 100, "your question", { border: C.light }),
    d.box(640, 100, 400, 100, "codebook", { border: C.light }),
    d.box(1240, 100, 400, 100, "variables", { border: C.light }),
    d.g("out",
      d.line(1440, 200, 1440, 330, { color: C.gray }), d.line(240, 330, 1440, 330, { color: C.gray }),
      d.arrow(240, 330, 240, 458, { color: C.gray }), d.arrow(840, 330, 840, 458, { color: C.gray }),
      d.arrow(1440, 330, 1440, 458, { color: C.gray }),
      `<path d="M40 515 L20 515 L20 150 L24 150" fill="none" stroke="${C.blue}" stroke-width="3"/>`,
      d.arrow(20, 150, 38, 150, { color: C.blue, width: 3 }),
      d.box(40, 460, 400, 110, "adapt the question", { border: C.blue, color: C.blue, width: 3 }),
      weak(640, 460, 400, 110, "drop it"),
      d.verdict(1240, 460, 400, 150, "answerable", true),
      d.label(240, 0, "a part is missing", { size: 32, color: C.gray, anchor: "middle", centerY: 650 }),
      d.label(840, 0, "nothing fits", { size: 32, color: C.gray, anchor: "middle", centerY: 650 }),
      d.label(1440, 0, "every word has a column", { size: 32, color: C.gray, anchor: "middle", centerY: 650 })));
  const a = d.anim("fig-cycle");
  a.step(a.show("out", { dur: 600 }));
})();
