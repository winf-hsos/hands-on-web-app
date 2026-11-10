// Drawings and animations of "first steps with quarto".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 804 high
// (slides without a punchline). Crops of the rendered example paper are PNGs
// in img/, made from example/milk-prices.qmd; the drawings place them.
// Colours: grey for everything, yellow for what is being worked on or has
// just changed, green for computed results, blue for the key that links a
// citation to its entry, and the yellow triangle for "not checked".
const d = window.draw;
const C = d.colors();
const el = (id) => document.getElementById(id);
const CH = 32 * 0.6;   // advance of one character of the code font at 32
// SVG collapses leading spaces, so indentation in code lines becomes no-break spaces
const indent = (s) => s.replace(/^ +/, (m) => " ".repeat(m.length));

/* --- slide: copy and paste -------------------------------------------------------
 * Figure 1680 x 804. The script analysis.R is a box 480 x 580 at (40, 120)
 * with ten grey bars for its lines (x 80, from y 163 on a pitch of 52); the
 * report report.docx is a box 516 x 580 at (1120, 120). In the report a chart
 * (six bars 36 wide on a pitch of 52 from x 1170, baseline 320, middle 250),
 * a table (1170..1466, y 380..500, middle 440) and a number ("median: 1.99 €",
 * 14 characters, about 270 at 32, middle 600). Three arrows run from the
 * script (x 520) to the report (x 1120) at the middle of each, with their
 * label 30 above (the longest, "export chart", about 230). Step 1: the fourth
 * line turns yellow, the arrows grey and dashed, and a caution triangle
 * stands right of each result (x 1590, inside the report). The captions sit
 * under the boxes at y 752 ("one line changes" about 310, "still right?" 230). */
(function () {
  const rows = [250, 440, 600];
  const names = ["export chart", "copy table", "type number"];
  const bars = [300, 220, 360, 260, 180, 320, 240, 380, 200, 280];
  const code = bars.map((w, k) => `<rect x="80" y="${163 + 52 * k}" width="${w}" height="14" rx="4" fill="${C.gray}"/>`);
  const chart = [60, 100, 140, 90, 120, 70].map((h, k) => `<rect x="${1170 + 52 * k}" y="${320 - h}" width="36" height="${h}" fill="${C.light}"/>`);
  const table = [
    `<rect x="1170" y="380" width="296" height="120" fill="none" stroke="${C.light}" stroke-width="2"/>`,
    ...[410, 440, 470].map((y) => d.line(1170, y, 1466, y, { color: C.light })),
    d.line(1318, 380, 1318, 500, { color: C.light })];
  const dashed = rows.map((y) => d.line(520, y, 1100, y, { color: C.dark, dashed: true }) + d.arrow(1096, y, 1120, y, { color: C.dark }));
  el("fig-copy").innerHTML = d.svg(1680, 804,
    d.g("solid", ...rows.map((y) => d.arrow(520, y, 1120, y, { color: C.light }))),
    d.g("dashed", ...dashed),
    ...rows.map((y, k) => d.label(820, 0, names[k], { size: 32, color: C.gray, anchor: "middle", centerY: y - 30 })),
    d.label(40, 0, "analysis.R", { size: 32, mono: true, color: C.gray, centerY: 84, keepCase: true }),
    d.box(40, 120, 480, 580, ""), ...code,
    d.g("changed", `<rect x="80" y="319" width="260" height="14" rx="4" fill="${C.yellow}"/>`,
      d.label(280, 0, "one line changes", { size: 32, color: C.gray, anchor: "middle", centerY: 752 })),
    d.label(1120, 0, "report.docx", { size: 32, mono: true, color: C.gray, centerY: 84 }),
    d.box(1120, 120, 516, 580, ""), ...chart, ...table,
    d.label(1170, 0, "median: 1.99 €", { size: 32, centerY: 600 }),
    d.g("doubt", ...rows.map((y) => d.mark(1590, y, "caution")),
      d.label(1378, 0, "still right?", { size: 32, color: C.gray, anchor: "middle", centerY: 752 })));
  const a = d.anim("fig-copy");
  a.set("dashed", { opacity: 0 }); a.set("changed", { opacity: 0 }); a.set("doubt", { opacity: 0 });
  // one line of the script changes, and the three copies are no longer checked
  a.step(a.show("changed", { dur: 500 }), a.par(a.hide("solid", { dur: 500 }), a.show("dashed", { dur: 500 })),
    a.show("doubt", { dur: 500 }));
})();

/* --- slide: one source -------------------------------------------------------------
 * Figure 1680 x 804. The document is a box 700 x 632 at (200, 60) with
 * thirteen lines in the code font at 32 from x 232, line k centred at
 * 100 + 46 k (the longest, 28 characters, about 540). Its name stands under
 * it at y 740. Brackets at x 930..950 hold the three kinds of content:
 * header lines 0-3 (y 82..256), text lines 5-7 (312..440), R lines 9-12
 * (496..670). The name of each kind at 48 from x 990, 22 above the middle of
 * its bracket, and a line at 32 in grey 28 below it (the longest, 30
 * characters, about 580, so it ends near x 1570). One kind per step. */
(function () {
  const lines = ["---", 'title: "What is milk worth?"', "format: typst", "---", "",
    "## Introduction", "Milk is one of the few foods", "whose price many know by heart.", "",
    "```{r}", "survey |>", "  count(diet)", "```"];
  const kinds = [
    ["meta", 82, 256, "metadata", "about the whole document"],
    ["text", 312, 440, "markdown", "the text, with a few marks"],
    ["code", 496, 670, "R code", "runs when the document renders"]];
  el("fig-source").innerHTML = d.svg(1680, 804,
    d.box(200, 60, 700, 632, "", { border: C.light }),
    ...lines.map((s, k) => d.label(232, 0, indent(s), { size: 32, mono: true, centerY: 100 + 46 * k, keepCase: true })),
    d.label(550, 0, "milk-prices.qmd", { size: 32, mono: true, color: C.gray, anchor: "middle", centerY: 740 }),
    ...kinds.map(([name, y1, y2, title, what]) => d.g(name,
      `<path d="M930,${y1} H950 V${y2} H930" fill="none" stroke="${C.gray}" stroke-width="3"/>`,
      d.label(990, 0, title, { size: 48, centerY: (y1 + y2) / 2 - 22, keepCase: title === "R code" }),
      d.label(990, 0, what, { size: 32, color: C.gray, centerY: (y1 + y2) / 2 + 28 }))));
  const a = d.anim("fig-source");
  for (const [name] of kinds) a.set(name, { opacity: 0 });
  for (const [name] of kinds) a.step(a.show(name, { dur: 500 }));
})();

/* --- slide: what rendering does ------------------------------------------------------
 * Figure 1680 x 804. A chain on the row y 330: three documents 220 x 300
 * (y 180..480) for the .qmd (x 60), the .md (x 800) and the PDF (x 1410), and
 * two programs 100 high (y 280..380): knitr 280 wide at x 400 ("knitr runs R"
 * about 230), typst 180 wide at x 1130. Arrows between them: 280→400,
 * 680→800, 1020→1130, 1310→1410. The file names in the code font under the
 * documents at y 520 ("milk-prices.qmd" about 290, centred). A bracket at
 * y 600 spans the chain, and the one command stands under it at y 650.
 * Inside a document: three header bars (y 200..248), pairs of text bars, and
 * two chunks 180 x 50 at y 304 and 408. Yellow: the program at work and the
 * chunks it runs. Green: the results knitr puts in place of the chunks. */
(function () {
  const bar = (x, y, w, col = C.gray, h = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${col}"/>`;
  const page = (x) => d.box(x, 180, 220, 300, "", { border: C.light, rx: 6 });
  const text = (x) => [bar(x + 20, 200, 80), bar(x + 20, 220, 140), bar(x + 20, 240, 100),
    bar(x + 20, 268, 170), bar(x + 20, 286, 140), bar(x + 20, 372, 180), bar(x + 20, 390, 120)];
  const chunk = (x, y) => `<rect x="${x + 20}" y="${y}" width="180" height="50" rx="6" fill="${C.dark}"/>` +
    d.label(x + 34, 0, "{r}", { size: 20, mono: true, color: C.light, centerY: y + 25 });
  const glow = (x, y) => `<rect x="${x + 20}" y="${y}" width="180" height="50" rx="6" fill="${C.yellow}" fill-opacity="0.25" stroke="${C.yellow}" stroke-width="3"/>`;
  const hist = (x, y, col) => [14, 26, 40, 30, 20, 10].map((h, k) => `<rect x="${x + 40 + 24 * k}" y="${y + 46 - h}" width="18" height="${h}" fill="${col}"/>`).join("");
  const grid = (x, y, col) => `<rect x="${x + 40}" y="${y + 4}" width="140" height="44" fill="none" stroke="${col}" stroke-width="2"/>` +
    d.line(x + 40, y + 19, x + 180, y + 19, { color: col }) + d.line(x + 40, y + 33, x + 180, y + 33, { color: col }) +
    d.line(x + 120, y + 4, x + 120, y + 48, { color: col });
  const name = (x, s) => d.label(x + 110, 0, s, { size: 32, mono: true, color: C.gray, anchor: "middle", centerY: 520 });
  const program = (x, w, s, o = {}) => d.box(x, 280, w, 100, s, { border: C.light, size: 32, ...o });
  const active = (x, w) => `<rect x="${x}" y="280" width="${w}" height="100" rx="8" fill="none" stroke="${C.yellow}" stroke-width="4"/>`;
  const arrows = [[280, 400], [680, 800], [1020, 1130], [1310, 1410]];
  el("fig-render").innerHTML = d.svg(1680, 804,
    ...arrows.map(([x1, x2]) => d.arrow(x1, 330, x2, 330, { color: C.dark })),
    ...arrows.map(([x1, x2], k) => d.g("a" + (k + 1), d.arrow(x1, 330, x2, 330, { color: C.light, width: 3 }))),
    // the empty places of the files still to come
    `<rect x="800" y="180" width="220" height="300" rx="6" fill="none" stroke="${C.dark}" stroke-width="2" stroke-dasharray="8 6"/>`,
    `<rect x="1410" y="180" width="220" height="300" rx="6" fill="none" stroke="${C.dark}" stroke-width="2" stroke-dasharray="8 6"/>`,
    page(60), ...text(60), chunk(60, 304), chunk(60, 408), name(60, "milk-prices.qmd"),
    d.g("qglow", glow(60, 304), glow(60, 408)),
    program(400, 280, "knitr runs R", { keepCase: true }), d.g("kact", active(400, 280)),
    program(1130, 180, "typst"), d.g("tact", active(1130, 180)),
    d.g("md", page(800), ...text(800), hist(800, 304, C.green), grid(800, 408, C.green), name(800, "milk-prices.md")),
    d.g("pdf", page(1410), bar(1460, 198, 120, C.light, 14), bar(1430, 228, 160), bar(1430, 246, 120),
      hist(1410, 280, C.light), bar(1430, 346, 170), bar(1430, 364, 140), grid(1410, 390, C.light),
      bar(1430, 452, 150), name(1410, "milk-prices.pdf")),
    d.g("cmd", `<path d="M60,585 V600 H1630 V585" fill="none" stroke="${C.gray}" stroke-width="2"/>`,
      d.label(845, 0, "quarto render milk-prices.qmd", { size: 32, mono: true, color: C.gray, anchor: "middle", centerY: 650 })));
  const a = d.anim("fig-render");
  for (const t of ["qglow", "kact", "tact", "md", "pdf", "cmd"]) a.set(t, { opacity: 0 });
  // knitr takes the .qmd and runs its chunks
  a.step(a.draw("a1", { dur: 600 }), a.par(a.show("kact", { dur: 400 }), a.show("qglow", { dur: 400 })));
  // out comes Markdown, with the results where the chunks were
  a.step(a.par(a.hide("kact", { dur: 300 }), a.hide("qglow", { dur: 300 })), a.draw("a2", { dur: 600 }), a.show("md", { dur: 600 }));
  // typst takes the Markdown
  a.step(a.draw("a3", { dur: 600 }), a.show("tact", { dur: 400 }));
  // and sets the PDF; one command runs the whole chain
  a.step(a.hide("tact", { dur: 300 }), a.draw("a4", { dur: 600 }), a.show("pdf", { dur: 600 }), a.show("cmd", { dur: 500 }));
})();

/* --- slide: citations ------------------------------------------------------------------
 * Figure 1680 x 804. Left the file references.bib: a box 720 x 440 at (4, 90)
 * with its ten lines in the code font at 32 from x 32, line k centred at
 * 130 + 40 k (the longest, 32 characters, about 615). Right from x 820 the
 * citation in milk-prices.qmd, a box 852 x 80 at y 90 with one line of 41
 * characters (about 790), and under "milk-prices.pdf" at y 260 two crops of
 * the rendered paper: the sentence with the citation at 3.4 units per point
 * (806 x 88 at y 290) and the bibliography, 852 wide (y 410, 119 high). The key wickham2023 is blue
 * where it is written, since it links the citation to its entry. One file
 * per step, from the source to the PDF. */
(function () {
  const bib = ["", "  author = {Wickham, Hadley and", "    Çetinkaya-Rundel, Mine and", "    Grolemund, Garrett},",
    "  title = {R for Data Science},", "  edition = {2},", "  publisher = {O'Reilly},", "  year = {2023},",
    "  url = {https://r4ds.hadley.nz}", "}"];
  const mono = (x, cy, s, color) => d.label(x, 0, indent(s), { size: 32, mono: true, centerY: cy, keepCase: true, color });
  const head = (x, s) => d.label(x, 0, s, { size: 32, mono: true, color: C.gray, centerY: 60 });
  el("fig-cite").innerHTML = d.svg(1680, 804,
    head(4, "references.bib"), d.box(4, 90, 720, 440, "", { border: C.light }),
    mono(32, 130, "@book{"), mono(32 + 6 * CH, 130, "wickham2023", C.blue), mono(32 + 17 * CH, 130, ","),
    ...bib.map((s, k) => (k ? mono(32, 130 + 40 * k, s) : "")),
    d.g("qmd", head(820, "milk-prices.qmd"), d.box(820, 90, 852, 80, "", { border: C.light }),
      mono(842, 130, "we summarise it [@"), mono(842 + 18 * CH, 130, "wickham2023", C.blue),
      mono(842 + 29 * CH, 130, ", chap. 10].")),
    d.g("pdf", d.label(820, 0, "milk-prices.pdf", { size: 32, mono: true, color: C.gray, centerY: 260 }),
      d.image(820, 290, 806, 88, "img/pdf-citation.png"),
      d.image(820, 410, 852, 119, "img/pdf-bibliography.png")));
  const a = d.anim("fig-cite");
  a.set("qmd", { opacity: 0 }); a.set("pdf", { opacity: 0 });
  a.step(a.show("qmd", { dur: 500 }));
  a.step(a.show("pdf", { dur: 600 }));
})();

/* --- slide: render ------------------------------------------------------------------------
 * Figure 1680 x 804. Left, under "in positron" (y 90), an editor 760 x 260 at
 * (4, 120): its tab with the file name (centred at y 158) and the button
 * "preview" 184 x 48 at (560, 134), blue because it is what you click
 * ("preview" at 32 about 135); grey bars for the code below the line at
 * y 196. Under "in the terminal" (y 470) a box 760 x 90 at (4, 500) with the
 * command (29 characters, about 560). Grey arrows from both at y 250 and 545
 * to the two pages of the PDF, 368 x 520 at x 900 and 1300 (y 120..640),
 * named at y 690. The button is drawn after Positron, not a screenshot. */
(function () {
  const codeBars = [380, 300, 440, 260].map((w, k) => `<rect x="32" y="${226 + 34 * k}" width="${w}" height="12" rx="4" fill="${C.gray}"/>`);
  el("fig-preview").innerHTML = d.svg(1680, 804,
    d.arrow(764, 250, 896, 250, { color: C.gray }), d.arrow(764, 545, 896, 545, { color: C.gray }),
    d.label(4, 0, "in positron", { size: 32, color: C.gray, centerY: 90 }),
    d.box(4, 120, 760, 260, "", { border: C.light }),
    d.line(4, 196, 764, 196, { color: C.dark }),
    d.label(32, 0, "milk-prices.qmd", { size: 32, mono: true, centerY: 158, keepCase: true }),
    d.box(560, 134, 184, 48, "preview", { border: C.blue, color: C.blue, width: 3, size: 32 }),
    ...codeBars,
    d.label(4, 0, "in the terminal", { size: 32, color: C.gray, centerY: 470 }),
    d.box(4, 500, 760, 90, "", { border: C.light }),
    d.label(32, 0, "quarto render milk-prices.qmd", { size: 32, mono: true, centerY: 545, keepCase: true }),
    d.image(900, 120, 368, 520, "img/pdf-page-1.png"),
    d.image(1300, 120, 368, 520, "img/pdf-page-2.png"),
    d.label(1284, 0, "milk-prices.pdf", { size: 32, mono: true, color: C.gray, anchor: "middle", centerY: 690 }));
})();
