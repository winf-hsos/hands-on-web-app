// Drawings of "A map of meaning" (docs/figures.md): 1600 units wide, sizes 32
// and 48 only, colours from the theme. A still picture, because it shows a
// structure, the way from tokens to the numbers of a whole text, and not a
// process in time.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // the same small numbers on every visit: a linear congruential generator
  // with a fixed seed, giving values between -1 and 1
  function numbers(seed, n) {
    let s = seed >>> 0;
    return Array.from({ length: n }, () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return (s / 4294967296) * 2 - 1;
    });
  }

  // One list of numbers as a narrow strip: a frame 120 x 120 around a centre
  // line, and eight bars that reach right for a positive number and left for
  // a negative one. Eight stand for the 384 of the model.
  function strip(cx, y, values, colour, border) {
    const parts = [
      `<rect x="${cx - 60}" y="${y}" width="120" height="120" rx="8" fill="none" stroke="${border}" stroke-width="2"/>`,
      `<line x1="${cx}" y1="${y + 8}" x2="${cx}" y2="${y + 112}" stroke="${border}" stroke-width="1"/>`,
    ];
    values.forEach((v, k) => {
      const w = Math.abs(v) * 48;
      const x = v < 0 ? cx - w : cx;
      parts.push(`<rect x="${x.toFixed(1)}" y="${y + 9 + k * 13.5}" width="${w.toFixed(1)}" height="8" fill="${colour}"/>`);
    });
    return parts.join('');
  }

  // "The bank raised its rates" as the tokenizer of all-MiniLM-L6-v2 cuts
  // it, with the two markers. Seven columns of 180 from x 330, centres
  // 420 to 1500; the widest token, "[CLS]", is 5 x 19.2 = 96 wide in its
  // box of 150. The labels stand right-aligned at x 290; the widest line,
  // "aneinander an", is 13 x 19.2 = 250 wide and starts at 40. Rows: tokens
  // at 40, their numbers at 160, the numbers in context at 400, the average
  // at 620; the label of the average starts at 1060 to the right of it
  // ("der Mittelwert:" is 15 x 19.2 = 288 wide, ending at 1348).
  figure('tokens-to-text', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const tokens = ['[CLS]', 'the', 'bank', 'raised', 'its', 'rates', '[SEP]'];
      const BANK = 2;
      const xs = tokens.map((_, i) => 420 + i * 180);
      const own = tokens.map((_, i) => numbers(20261105 + i * 7919, 8));
      // in context every token keeps most of its own numbers and takes in
      // some of the others, as a picture of the six rounds in the model
      const mean = (lists) => lists[0].map((_, k) => lists.reduce((s, l) => s + l[k], 0) / lists.length);
      const shared = mean(own);
      const context = own.map((v) => v.map((x, k) => 0.6 * x + 0.4 * shared[k] * 2.2).map((x) => Math.max(-1, Math.min(1, x))));
      const text = mean(context).map((x) => Math.max(-1, Math.min(1, x * 1.8)));
      const tone = (i) => (i === BANK ? c.blue : c.light);
      const centre = xs[3];

      const lines = [];
      const into = []; // the lines into "bank", drawn above the others
      const boxes = [];
      const labels = [];
      xs.forEach((x, i) => {
        lines.push(d.arrow(x, 106, x, 154, { color: c.gray, width: 2, head: 12 }));
        // every token looks at every other one; the lines into "bank" are blue
        xs.forEach((from) => (i === BANK ? into : lines).push(d.line(from, 282, x, 398, { color: i === BANK ? c.blue : c.dark, width: i === BANK ? 2.5 : 1.5 })));
        lines.push(d.line(x, 522, centre, 618, { color: c.gray, width: 2 }));
        boxes.push(d.box(x - 75, 40, 150, 64, tokens[i], { size: 32, mono: true, keepCase: true, border: i === BANK ? c.blue : c.gray, color: i === BANK ? c.blue : c.white }));
        boxes.push(strip(x, 160, own[i], tone(i), c.gray));
        boxes.push(strip(x, 400, context[i], tone(i), c.gray));
      });
      boxes.push(strip(centre, 620, text, c.white, c.blue));

      const side = (centreY, text) => d.label(290, 0, text, { size: 32, color: c.gray, anchor: 'end', centerY: centreY });
      labels.push(
        side(72, t('Tokens', 'tokens')),
        side(220, t('je Token\n384 Zahlen', '384 numbers\nper token')),
        side(340, t('passen sich\naneinander an', 'adjust to\neach other')),
        side(460, t('Zahlen im\nZusammenhang', 'numbers in\ncontext')),
        d.label(1060, 0, t('der Mittelwert:\nein Text,\n384 Zahlen', 'the average:\none text,\n384 numbers'), { size: 32, color: c.white, centerY: 680 }),
      );
      return d.svg(1600, 760, ...d.layers(lines, into, boxes, labels));
    },
  });
})();
