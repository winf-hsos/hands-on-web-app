// Drawings of "Signal and noise" (docs/figures.md), taken from the deck
// signal-and-noise-slides and laid out for the width of the text: 1600
// units, sizes 32 and 48 only, and as still pictures in their final state.
// All noise comes from generators with a fixed seed, so a drawing looks the
// same on every visit.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // normally distributed noise (Box-Muller) from a linear congruential
  // generator with a fixed seed, as in the deck
  function noise(seed) {
    let s = seed >>> 0;
    const r = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    return () => {
      const u = Math.max(r(), 1e-9), v = r();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
  }

  // A cloud of readings as a bell curve; `half` is the half-width of the
  // whole cloud (three standard deviations), and `from` and `to` cut out a
  // piece (in multiples of half, -1 to 1), so that exactly the part across
  // the boundary can be coloured.
  function cloud(mx, half, height, base, colour, opacity = 0.55, from = -1, to = 1) {
    const pts = [];
    for (let i = 0; i <= 64; i += 1) {
      const f = from + (i / 64) * (to - from);
      pts.push(`${(mx + f * half).toFixed(1)},${(base - height * Math.exp(-((f * 3) ** 2) / 2)).toFixed(1)}`);
    }
    return `<path d="M${(mx + from * half).toFixed(1)},${base} L${pts.join(' L')} L${(mx + to * half).toFixed(1)},${base} Z" fill="${colour}" fill-opacity="${opacity}" stroke="${colour}" stroke-width="2"/>`;
  }

  // a bracket over or under a span, ticks 15 long towards `dir`
  const bracket = (x1, x2, y, colour, dir = 1) =>
    `<path d="M${x1},${y + 15 * dir} L${x1},${y} L${x2},${y} L${x2},${y + 15 * dir}" fill="none" stroke="${colour}" stroke-width="3"/>`;

  // The same raw signal of 288 readings (seed 20260907, as in the deck),
  // and below it averaged over windows of 4, 12 and 32 readings. Strips 90
  // high, 60 apart, from x 300 to 1260; names right-aligned at 270
  // ("Mittel aus 32" is 13 x 19.2 = 250 wide), counts from 1290
  // ("288 Ablesungen" is 14 x 19.2 = 269 wide, ending at 1559).
  figure('windows', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const n = noise(20260907);
      const raw = Array.from({ length: 288 }, () => n());
      const x0 = 300, width = 960, top = 40, height = 90, gap = 60;
      const yOf = (mid, v) => mid - Math.max(-43, Math.min(43, v * 15));
      const rows = [
        [t('Rohsignal', 'raw signal'), 1],
        [t('Mittel aus 4', 'mean of 4'), 4],
        [t('Mittel aus 12', 'mean of 12'), 12],
        [t('Mittel aus 32', 'mean of 32'), 32],
      ];
      const parts = [];
      rows.forEach(([name, win], k) => {
        const mid = top + k * (height + gap) + height / 2;
        const count = raw.length / win;
        parts.push(
          d.label(x0 - 30, 0, name, { size: 32, color: c.gray, anchor: 'end', centerY: mid }),
          d.line(x0, mid, x0 + width, mid, { color: c.dark, width: 2, dashed: true }),
          d.label(x0 + width + 30, 0, t(`${count} Ablesungen`, `${count} readings`), { size: 32, color: c.gray, centerY: mid }),
        );
        if (win === 1) {
          const pts = raw.map((v, i) => `${(x0 + (i / (raw.length - 1)) * width).toFixed(1)},${yOf(mid, v).toFixed(1)}`).join(' ');
          parts.push(`<polyline points="${pts}" fill="none" stroke="${c.light}" stroke-width="2"/>`);
          return;
        }
        const bw = width / count;
        for (let i = 0; i < count; i += 1) {
          const m = raw.slice(i * win, (i + 1) * win).reduce((s, v) => s + v, 0) / win;
          parts.push(d.line(x0 + i * bw + 3, yOf(mid, m), x0 + (i + 1) * bw - 3, yOf(mid, m), { color: c.white, width: 6 }));
        }
      });
      return d.svg(1600, 620, ...parts);
    },
  });

  // Two symbols at the same distance d, twice: on the left narrow clouds
  // (half-width 100, no reading crosses the boundary), on the right wide ones
  // (half-width 230), whose parts across the boundary are red. Each panel is
  // 760 wide, the symbols 260 apart around its middle; "manche landen auf
  // der falschen Seite" is 36 x 19.2 = 691 wide, inside its panel.
  const PANELS = [
    { mid: 400, half: 100, de: 'schmale Wolken', en: 'narrow clouds', ok: true },
    { mid: 1200, half: 230, de: 'breite Wolken', en: 'wide clouds', ok: false },
  ];

  figure('two-clouds', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const base = 400, peak = 190, gapAB = 260;
      const parts = [];
      PANELS.forEach(({ mid, half, de, en, ok }) => {
        const ma = mid - gapAB / 2, mb = mid + gapAB / 2;
        parts.push(
          d.label(mid, 0, t(de, en), { size: 32, color: c.gray, anchor: 'middle', centerY: 30 }),
          d.line(mid - 380, base, mid + 370, base, { color: c.dark, width: 2 }),
          cloud(ma, half, peak, base, c.light),
          cloud(mb, half, peak, base, c.light),
        );
        if (half > gapAB / 2) {
          parts.push(cloud(ma, half, peak, base, c.red, 0.9, gapAB / 2 / half, 1));
          parts.push(cloud(mb, half, peak, base, c.red, 0.9, -1, -gapAB / 2 / half));
        }
        parts.push(
          d.line(mid, 180, mid, base, { color: c.gray, width: 2, dashed: true }),
          bracket(ma, mb, 120, c.yellow),
          d.label(mid, 0, 'd', { size: 32, mono: true, keepCase: true, color: c.yellow, anchor: 'middle', centerY: 90 }),
          d.label(ma, 0, 'a', { size: 32, mono: true, keepCase: true, color: c.gray, anchor: 'middle', centerY: 435 }),
          d.label(mb, 0, 'b', { size: 32, mono: true, keepCase: true, color: c.gray, anchor: 'middle', centerY: 435 }),
          d.label(mid, 0, ok ? t('jede Ablesung auf ihrer Seite', 'every reading on its own side') : t('manche landen auf der falschen Seite', 'some land on the wrong side'), {
            size: 32,
            color: ok ? c.green : c.red,
            anchor: 'middle',
            centerY: 500,
          }),
        );
      });
      return d.svg(1600, 530, ...parts);
    },
  });

  // The usable range of the example, from the floor 40 to the ceiling 840,
  // filled twice: with four bands 200 wide and with sixteen bands 50 wide.
  // Range y 90 to 530, columns 440 wide at x 480 and 1080; the division in
  // 48 below each column: "800 / 200 = 4" is 13 x 28.8 = 374 wide.
  figure('how-many', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const top = 90, bottom = 530, span = bottom - top, axisX = 380;
      const parts = [
        d.line(axisX, top, axisX, bottom, { color: c.dark, width: 2 }),
        d.line(axisX - 10, top, axisX + 10, top, { color: c.dark, width: 2 }),
        d.line(axisX - 10, bottom, axisX + 10, bottom, { color: c.dark, width: 2 }),
      ];
      [
        [t('Decke', 'ceiling'), '840', top],
        [t('Bereich', 'range'), '800', (top + bottom) / 2],
        [t('Boden', 'floor'), '40', bottom],
      ].forEach(([word, value, y]) => {
        parts.push(d.label(240, 0, word, { size: 32, color: c.gray, anchor: 'end', centerY: y }));
        parts.push(d.label(360, 0, value, { size: 32, mono: true, keepCase: true, anchor: 'end', centerY: y }));
      });
      [
        { x: 480, n: 4, title: t('Bänder, 200 breit', 'bands 200 wide'), sum: '800 / 200 = 4' },
        { x: 1080, n: 16, title: t('Bänder, 50 breit', 'bands 50 wide'), sum: '800 / 50 = 16' },
      ].forEach(({ x, n, title, sum }) => {
        const bh = span / n;
        parts.push(d.label(x + 220, 0, title, { size: 32, color: c.gray, anchor: 'middle', centerY: 45 }));
        for (let i = 0; i < n; i += 1) parts.push(d.box(x, bottom - (i + 1) * bh + 3, 440, bh - 6, '', { border: c.light, rx: 4 }));
        parts.push(d.formula(x + 220, 0, sum, { size: 48, anchor: 'middle', centerY: 600 }));
      });
      return d.svg(1600, 640, ...parts);
    },
  });

  // Calibrate, then classify. The red and blue dots stand for real colours,
  // so their labels are gray; yellow marks the distance that wins, since it
  // is none of the colours shown. Axes from (230, 560) to x 1400 and y 80;
  // the centres of the clouds are the means of the six references each.
  const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const RED = [[188, 50], [195, 62], [198, 58], [200, 55], [205, 70], [210, 48]];
  const BLUE = [[30, 195], [35, 210], [40, 215], [45, 220], [50, 205], [55, 198]];
  const NEW = [170, 80];

  figure('calibration', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const x0 = 230, y0 = 560, xMax = 1400, yTop = 80;
      const px = (r) => x0 + (r / 255) * (xMax - x0);
      const py = (b) => y0 - (b / 255) * (y0 - yTop);
      const mean = (pts, k) => pts.reduce((s, q) => s + q[k], 0) / pts.length;
      const red = [mean(RED, 0), mean(RED, 1)], blue = [mean(BLUE, 0), mean(BLUE, 1)];
      const nx = px(NEW[0]), ny = py(NEW[1]);
      return d.svg(
        1600,
        620,
        d.line(nx, ny, px(blue[0]), py(blue[1]), { color: c.dark, width: 3, dashed: true }),
        d.line(nx, ny, px(red[0]), py(red[1]), { color: c.yellow, width: 4, dashed: true }),
        d.arrow(x0, y0, xMax + 45, y0, { color: c.light, width: 3 }),
        d.arrow(x0, y0, x0, yTop - 40, { color: c.light, width: 3 }),
        d.label(xMax + 70, 0, 'r', { size: 48, mono: true, keepCase: true, centerY: y0 }),
        d.label(x0 - 25, 0, 'b', { size: 48, mono: true, keepCase: true, anchor: 'end', centerY: yTop - 30 }),
        // "g bleibt hier etwa gleich" is 25 characters at 32, about 480, ending at 1560
        d.label(1560, 0, t('g bleibt hier etwa gleich', 'g stays roughly the same here'), { size: 32, color: c.gray, anchor: 'end', centerY: 110 }),
        ...RED.map(([r, b]) => dot(px(r), py(b), 13, c.red)),
        ...BLUE.map(([r, b]) => dot(px(r), py(b), 13, c.blue)),
        d.label(px(red[0]), 0, t('Rot-Referenzen', 'red references'), { size: 32, color: c.gray, anchor: 'middle', centerY: 515 }),
        d.label(560, 0, t('Blau-Referenzen', 'blue references'), { size: 32, color: c.gray, centerY: 175 }),
        dot(nx, ny, 16, c.red),
        // "neu: r=170 b=80" is 15 characters of code type at 32, about 300, below the dot
        d.label(nx - 30, 0, t('neu: r=170 b=80', 'new: r=170 b=80'), { size: 32, mono: true, keepCase: true, anchor: 'end', centerY: ny + 45 }),
        d.label(1060, 0, t('die nächste Wolke gewinnt', 'the nearest cloud wins'), { size: 32, color: c.yellow, centerY: 330 }),
      );
    },
  });
})();
