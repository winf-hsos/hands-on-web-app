// Drawings of "From algorithm to program" (docs/figures.md), after the
// bubble sort slide of the deck algorithms-and-programs-slides.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // Six bars 120 wide and 180 apart: 6 x 120 + 5 x 60 = 1020, so the row
  // starts at (1600 - 1020) / 2 = 290, and a swap moves a bar by 180. Heights
  // 62 per unit on a base line at 450, so the tallest (6) reaches up to 78.
  // The start order 2 5 1 6 3 4 needs two passes with three swaps each and a
  // third without one.
  const START = [2, 5, 1, 6, 3, 4];
  const X0 = 290, STEP = 180, BAR_W = 120, BASE = 450, UNIT = 62, NOTE_Y = 520;

  // run the rules first, to know what each pass compares and swaps
  const PASSES = [];
  const order = START.slice();
  for (;;) {
    const moves = [];
    for (let i = 0; i < order.length - 1; i += 1) {
      const swap = order[i] > order[i + 1];
      moves.push({ left: `b${order[i]}`, right: `b${order[i + 1]}`, swap });
      if (swap) [order[i], order[i + 1]] = [order[i + 1], order[i]];
    }
    PASSES.push(moves);
    if (!moves.some((m) => m.swap)) break;
  }

  // the note below the row, one per state, all centred at 800; the longest,
  // "Durchgang 3: keine Vertauschung, fertig", is 37 characters at 32 units, about
  // 750 wide
  const notes = (t) => [
    t('vor dem ersten Durchgang', 'before the first pass'),
    ...PASSES.map((moves, k) => {
      const n = moves.filter((m) => m.swap).length;
      if (n === 0) return t(`Durchgang ${k + 1}: keine Vertauschung, fertig`, `pass ${k + 1}: no swap, done`);
      return t(`Durchgang ${k + 1}: ${n} Vertauschungen`, `pass ${k + 1}: ${n} swaps`);
    }),
  ];

  figure('bubble', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const bars = START.map((v, i) =>
        d.g(`b${v}`, d.box(X0 + i * STEP, BASE - v * UNIT, BAR_W, v * UNIT, '', { border: c.light, width: 3, rx: 6 })));
      // all notes stand at the same place; only the first is visible in the
      // still picture, the animation fades the others in (its inline style
      // overrides the opacity attribute)
      const texts = notes(t).map((text, k) => {
        const note = d.label(800, 0, text, { size: 32, anchor: 'middle', color: k === PASSES.length ? c.green : c.gray, centerY: NOTE_Y });
        return k === 0 ? d.g('n0', note) : `<g data-a="n${k}" opacity="0">${note}</g>`;
      });
      return d.svg(1600, 560, ...bars, ...texts);
    },
    animate(a) {
      for (let k = 1; k <= PASSES.length; k += 1) a.set(`n${k}`, { opacity: 0 });
      // one segment per pass, at most about 2.6 s; a comparison turns both
      // bars yellow, a swap slides them past each other
      PASSES.forEach((moves, k) => {
        const items = [a.par(a.hide(`n${k}`, { dur: 200 }), a.show(`n${k + 1}`, { dur: 200 }))];
        moves.forEach(({ left, right, swap }) => {
          items.push(a.par(a.color(left, 'yellow', { dur: 120 }), a.color(right, 'yellow', { dur: 120 })));
          items.push(swap ? a.par(a.move(left, STEP, 0, { dur: 320 }), a.move(right, -STEP, 0, { dur: 320 })) : a.wait(80));
          items.push(a.par(a.color(left, 'gray-light', { dur: 120 }), a.color(right, 'gray-light', { dur: 120 })));
        });
        if (k === PASSES.length - 1) items.push(a.par(...START.map((v) => a.color(`b${v}`, 'green', { dur: 400 }))));
        a.step(...items);
      });
    },
  });
})();
