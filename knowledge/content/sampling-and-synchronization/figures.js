// Drawings of "Sampling and synchronization" (docs/figures.md), taken from
// the deck sampling-and-synchronization-slides and laid out for the width of
// the text: 1600 units, sizes 32 and 48 only, and as still pictures in their
// final state.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  const rect = (x, y, w, h, fill, extra = '') =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;
  const circle = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

  // Twelve time slots of the sender, 105 wide from x 260, with a tick under
  // the middle of each; below them the readings of a receiver whose clock
  // runs 8 % slow, so reading i lands at (i + 0.5) * 105 * 1.08. From the
  // seventh reading on the error passes half a slot and the dot is red. Row
  // names right-aligned at 230 ("Empfänger" is 9 x 19.2 = 173 wide).
  figure('drift', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const x0 = 260, w = 105, drift = 1.08;
      const parts = [
        d.label(230, 0, t('Sender', 'sender'), { anchor: 'end', centerY: 115, color: c.light }),
        d.label(230, 0, t('Empfänger', 'receiver'), { anchor: 'end', centerY: 270, color: c.light }),
      ];
      for (let i = 0; i < 12; i += 1) {
        const x = x0 + i * w;
        parts.push(d.box(x + 3, 60, w - 6, 110, String(i + 1), { border: c.gray, color: c.light, size: 32 }));
        parts.push(d.line(x + w / 2, 178, x + w / 2, 198, { color: c.gray, width: 3 }));
      }
      for (let i = 0; i < 10; i += 1) {
        const x = x0 + (i + 0.5) * w * drift;
        const wrong = (i + 0.5) * w * (drift - 1) > w / 2;
        parts.push(d.line(x, 202, x, 250, { color: c.gray, width: 2, dashed: true }));
        parts.push(circle(x.toFixed(1), 270, 15, wrong ? c.red : c.white));
      }
      return d.svg(1600, 320, ...parts);
    },
  });

  // Two panels on the same time scale, 2 units per ms. Left, symbols of
  // 100 ms (200 units) and a measuring window of 50 ms (100 units, yellow)
  // inside one bright symbol. Right, symbols of 40 ms (80 units): the same
  // window covers 60 units of bright and 40 of dark. Below each a scale from
  // dark to bright with the reading on it, and a verdict. Bright and dark are
  // gray levels, so green and red keep their meaning.
  const strip = (x0, x1, len, c) => {
    const parts = [];
    for (let x = x0, k = 0; x < x1; x += len, k += 1) {
      parts.push(rect(x, 100, Math.min(len, x1 - x), 100, k % 2 === 0 ? c.light : c.dark));
    }
    return parts;
  };
  const gauge = (x0, x1, f, t, c) => [
    d.line(x0, 340, x1, 340, { color: c.gray, width: 3 }),
    d.line(x0, 325, x0, 355, { color: c.gray, width: 3 }),
    d.line(x1, 325, x1, 355, { color: c.gray, width: 3 }),
    d.label(x0, 0, t('dunkel', 'dark'), { anchor: 'middle', centerY: 390, color: c.gray }),
    d.label(x1, 0, t('hell', 'bright'), { anchor: 'middle', centerY: 390, color: c.gray }),
    circle(x0 + f * (x1 - x0), 340, 17, c.yellow),
  ];

  figure('window', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      return d.svg(1600, 600,
        d.label(400, 0, t('Symbole von 100 ms', 'symbols of 100 ms'), { anchor: 'middle', centerY: 50 }),
        ...strip(40, 760, 200, c),
        rect(490, 88, 100, 124, 'none', ` stroke="${c.yellow}" stroke-width="5"`),
        d.label(540, 0, t('Fenster 50 ms', 'window 50 ms'), { anchor: 'middle', centerY: 245, color: c.yellow }),
        ...gauge(100, 700, 1, t, c),
        d.verdict(90, 440, 620, 130, t('liest hell', 'reads bright'), true, { size: 32 }),
        d.label(1200, 0, t('Symbole von 40 ms', 'symbols of 40 ms'), { anchor: 'middle', centerY: 50 }),
        ...strip(840, 1560, 80, c),
        rect(1180, 88, 100, 124, 'none', ` stroke="${c.yellow}" stroke-width="5"`),
        d.label(1230, 0, t('Fenster 50 ms', 'window 50 ms'), { anchor: 'middle', centerY: 245, color: c.yellow }),
        ...gauge(900, 1500, 0.6, t, c),
        d.verdict(890, 440, 620, 130, t('passt zu keinem Symbol', 'matches neither symbol'), false, { size: 32 }));
    },
  });

  // Three colours on a triangle, clockwise red, green, blue; a clockwise step
  // means 1, an anticlockwise one 0. On the right the example red, green,
  // red, blue with its bits, yellow for 1 and white for 0. Real colours, so
  // the labels are white and gray.
  figure('triangle', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const col = { red: c.red, green: c.green, blue: c.blue };
      const pos = { red: [400, 90], green: [620, 450], blue: [180, 450] };
      const parts = [];
      for (const [a, b] of [['red', 'green'], ['green', 'blue'], ['blue', 'red']]) {
        parts.push(d.line(...pos[a], ...pos[b], { color: c.gray, width: 4 }));
      }
      const cx = 400, cy = 340, r = 65;
      const at = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
      const [sx, sy] = at(-120), [tx, ty] = at(150);
      const th = (150 * Math.PI) / 180;
      const tan = [-Math.sin(th), Math.cos(th)], nor = [Math.cos(th), Math.sin(th)];
      const P = (k, m) => `${(tx + tan[0] * k + nor[0] * m).toFixed(1)},${(ty + tan[1] * k + nor[1] * m).toFixed(1)}`;
      parts.push(`<path d="M${sx.toFixed(1)},${sy.toFixed(1)} A${r},${r} 0 1 1 ${tx.toFixed(1)},${ty.toFixed(1)}" fill="none" stroke="${c.light}" stroke-width="4"/>`);
      parts.push(`<path d="M${P(16, 0)} L${P(-8, 13)} L${P(-8, -13)} Z" fill="${c.light}"/>`);
      for (const [n, [x, y]] of Object.entries(pos)) parts.push(circle(x, y, 60, col[n]));
      parts.push(
        d.label(820, 0, t('Schritt im Uhrzeigersinn = 1', 'clockwise step = 1'), { centerY: 100 }),
        d.label(820, 0, t('Schritt gegen den Uhrzeigersinn = 0', 'anticlockwise step = 0'), { centerY: 160 }),
        d.label(820, 0, t('keine Farbe folgt auf sich selbst', 'a color never follows itself'), { centerY: 220, color: c.gray }));
      const seq = ['red', 'green', 'red', 'blue'];
      const bits = ['1', '0', '0'];
      seq.forEach((s, k) => parts.push(rect(820 + k * 160, 310, 100, 100, col[s])));
      bits.forEach((b, k) => parts.push(d.label(820 + (k + 1) * 160 - 30, 0, b,
        { anchor: 'middle', centerY: 470, size: 48, mono: true, color: b === '1' ? c.yellow : c.white })));
      return d.svg(1600, 520, ...parts);
    },
  });
})();
