// Drawings of "Measuring and experimenting" (docs/figures.md), taken from the
// item's own deck (slides/deck.js) and laid out for the width of the text:
// 1600 units, sizes 32 and 48 only, and as still pictures in their final state.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  const circle = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

  // Calibrate, then classify. The red and blue dots stand for real colours,
  // so their labels are gray; yellow marks the distance that wins, since it
  // is none of the colours shown. Axes from (230, 560) to x 1400 and y 80;
  // the centres of the clouds are the means of the six references each.
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
        ...RED.map(([r, b]) => circle(px(r), py(b), 13, c.red)),
        ...BLUE.map(([r, b]) => circle(px(r), py(b), 13, c.blue)),
        d.label(px(red[0]), 0, t('Rot-Referenzen', 'red references'), { size: 32, color: c.gray, anchor: 'middle', centerY: 515 }),
        d.label(560, 0, t('Blau-Referenzen', 'blue references'), { size: 32, color: c.gray, centerY: 175 }),
        circle(nx, ny, 16, c.red),
        // "neu: r=170 b=80" is 15 characters of code type at 32, about 300, below the dot
        d.label(nx - 30, 0, t('neu: r=170 b=80', 'new: r=170 b=80'), { size: 32, mono: true, keepCase: true, anchor: 'end', centerY: ny + 45 }),
        d.label(1060, 0, t('die nächste Wolke gewinnt', 'the nearest cloud wins'), { size: 32, color: c.yellow, centerY: 330 }),
      );
    },
  });

  // Thirty symbols, sent alternately off (level 0.3) and on (0.7); the
  // receiver decides at 0.5. Every symbol is read ten times with noise of
  // 0.13 (mulberry32, seed 604, as in the deck), and the three tracks decide
  // from the first reading, the mean of five and the mean of ten: three
  // single readings land on the wrong side, no mean does. Tracks 1100 x 150
  // from x 40, their names above them; a value v sits at the middle minus
  // (v - 0.5) x 240, clamped to 0.24 ... 0.76, so a dot of radius 9 stays
  // inside. The costs from x 1180: "150 Ablesungen" is 14 x 19.2 = 269 wide.
  const TRACK_X = 40, TRACK_W = 1100, TRACK_H = 150;

  function decisions() {
    let seed = 604;
    const random = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const gauss = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    const tracks = [[], [], []];
    for (let i = 0; i < 30; i += 1) {
      const level = i % 2 ? 0.7 : 0.3;
      const reads = Array.from({ length: 10 }, () => level + 0.13 * gauss());
      const mean = (n) => reads.slice(0, n).reduce((s, v) => s + v, 0) / n;
      [reads[0], mean(5), mean(10)].forEach((v, k) => tracks[k].push({ v, wrong: i % 2 ? v < 0.5 : v > 0.5 }));
    }
    return tracks;
  }

  figure('decisions', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const tracks = decisions();
      const rows = [
        { name: t('eine Ablesung je Entscheidung', 'one reading per decision'), cost: [t('30 Ablesungen', '30 readings'), t('20 Zeichen/s', '20 symbols/s')] },
        { name: t('Mittel aus 5', 'mean of 5'), cost: [t('150 Ablesungen', '150 readings'), t('4 Zeichen/s', '4 symbols/s')] },
        { name: t('Mittel aus 10', 'mean of 10'), cost: [t('300 Ablesungen', '300 readings'), t('2 Zeichen/s', '2 symbols/s')] },
      ];
      const parts = [];
      rows.forEach((row, k) => {
        const top = 60 + k * 240, mid = top + TRACK_H / 2;
        parts.push(d.label(TRACK_X, 0, row.name, { size: 32, color: c.gray, centerY: top - 30 }));
        parts.push(d.box(TRACK_X, top, TRACK_W, TRACK_H, '', { border: c.dark, rounded: false }));
        parts.push(d.line(TRACK_X + 2, mid, TRACK_X + TRACK_W - 2, mid, { color: c.gray, width: 2, dashed: true }));
        tracks[k].forEach(({ v, wrong }, i) => {
          const y = mid - (Math.min(0.76, Math.max(0.24, v)) - 0.5) * 240;
          parts.push(circle(TRACK_X + 35 + (i * (TRACK_W - 70)) / 29, y, 9, wrong ? c.red : c.light));
        });
        parts.push(d.label(1180, 0, row.cost[0], { size: 32, centerY: mid - 22 }));
        parts.push(d.label(1180, 0, row.cost[1], { size: 32, color: c.gray, centerY: mid + 22 }));
      });
      return d.svg(1600, 700, ...parts);
    },
  });

  // The knob: integration time. Every reading is a bar, and its width is its
  // time window, so the bars of a row tile the same second. The bars that
  // leave the band which still reads correctly are red. Rows 1120 x 125 from
  // x 40; the notes on the right start at 1190: "richtig gelesen wird" is
  // 20 x 19.2 = 384 wide and ends at 1574.
  const ROWS = [
    { de: 'wenige lange Ablesungen', en: 'few long readings', offsets: [3, 9, -7, 5] },
    { de: 'mehr, kürzere Ablesungen', en: 'more, shorter readings', offsets: [10, -12, 13, -8, 11, -13, 9, -11] },
    { de: 'viele kurze Ablesungen', en: 'many short readings', offsets: [14, -12, 15, -34, 10, 15, -13, 36, -10, 13, -15, 11] },
  ];

  figure('integration', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const x = 40, w = 1120, h = 125, bandY = 39, bandH = 47, barH = 12, gap = 8;
      const tops = [60, 265, 470];
      const parts = [];
      ROWS.forEach((row, r) => {
        const y = tops[r], slot = w / row.offsets.length;
        parts.push(d.label(x, 0, t(row.de, row.en), { size: 32, color: c.gray, centerY: y - 28 }));
        parts.push(d.box(x, y, w, h, '', { border: c.dark, rounded: false }));
        parts.push(rect(x + 2, y + bandY, w - 4, bandH, c.dark));
        row.offsets.forEach((off, i) => {
          const outside = Math.abs(off) + barH / 2 > bandH / 2;
          parts.push(rect(x + i * slot + gap / 2, y + bandY + bandH / 2 + off - barH / 2, slot - gap, barH, outside ? c.red : c.white));
        });
      });
      const band = (r) => tops[r] + bandY + bandH / 2;
      const lastY = tops[2] + h;
      parts.push(
        d.arrow(x, lastY + 45, x + w, lastY + 45, { color: c.dark, width: 2, head: 12 }),
        d.arrow(x + w, lastY + 45, x, lastY + 45, { color: c.dark, width: 2, head: 12 }),
        d.label(x + w / 2, 0, t('eine Sekunde', 'one second'), { size: 32, color: c.gray, anchor: 'middle', centerY: lastY + 85 }),
        d.line(1170, band(1), 1182, band(1), { color: c.gray, width: 3 }),
        d.label(1190, 0, t('Bereich, der noch\nrichtig gelesen wird', 'the band that still\nreads correctly'), { size: 32, color: c.gray, centerY: band(1) }),
        d.label(1190, 0, t('diese landen in\nder falschen Farbe', 'these land in\nthe wrong colour'), { size: 32, color: c.red, centerY: band(2) }),
      );
      return d.svg(1600, lastY + 120, ...parts);
    },
  });
})();
