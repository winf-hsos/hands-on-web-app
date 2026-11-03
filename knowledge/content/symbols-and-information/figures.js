// Drawings of "Symbols and information" (docs/figures.md), taken from the
// item's own deck (slides/deck.js) and laid out for the width of the text:
// 1600 units, sizes 32 and 48 only, and as still pictures in their final state.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // Two mapping tables for the same four colours, as on the slide: the
  // receiver's table swaps red and yellow, so "team" is read as "meat". The
  // colour names are code values and stay English; the German page spells
  // "gans" and reads "sang". Only the two letters that differ are red.
  const COLOURS = ['red', 'green', 'blue', 'yellow'];
  const TABLES = {
    en: { sender: ['t', 'e', 'a', 'm'], receiver: ['m', 'e', 'a', 't'], meant: 'team', read: 'meat' },
    de: { sender: ['g', 'a', 'n', 's'], receiver: ['s', 'a', 'n', 'g'], meant: 'gans', read: 'sang' },
  };

  figure('two-tables', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const data = TABLES[lang === 'en' ? 'en' : 'de'];
      const parts = [];
      const code = (x, y, text, o = {}) => d.label(x, 0, text, { size: 32, mono: true, keepCase: true, color: c.light, centerY: y, ...o });

      parts.push(d.label(60, 0, t('empfangen:', 'received:'), { size: 32, color: c.gray, centerY: 50 }));
      // the four colours, 23 characters of code type at 32 units, about 440, from 330 on
      parts.push(code(330, 50, COLOURS.join(' '), { color: c.white }));
      parts.push(d.line(40, 100, 1560, 100, { color: c.gray, width: 2 }));

      const table = (x, head, letters, other) => {
        parts.push(d.label(x, 0, head, { size: 32, color: c.gray, centerY: 150 }));
        COLOURS.forEach((colour, i) => {
          const y = 220 + i * 70;
          parts.push(code(x, y, colour));
          parts.push(d.label(x + 200, 0, '→', { size: 32, color: c.gray, centerY: y }));
          const differs = other && letters[i] !== other[i];
          parts.push(code(x + 280, y, letters[i], { size: 48, color: differs ? c.red : c.white }));
        });
      };
      table(60, t('die Tabelle des Senders', "the sender's table"), data.sender);
      table(860, t('die Tabelle des Empfängers', "the receiver's table"), data.receiver, data.sender);

      parts.push(d.line(40, 480, 1560, 480, { color: c.gray, width: 2 }));
      parts.push(d.label(60, 0, t('gemeint:', 'meant:'), { size: 32, color: c.gray, centerY: 540 }));
      parts.push(code(340, 540, data.meant, { size: 48, color: c.white }));
      parts.push(d.label(860, 0, t('gelesen:', 'read:'), { size: 32, color: c.gray, centerY: 540 }));
      parts.push(code(1140, 540, data.read, { size: 48, color: c.red }));
      return d.svg(1600, 590, ...parts);
    },
  });

  // Guessing one card out of 32: every halving question leaves half, and the
  // yellow frame is where the five questions end.
  const COUNTS = [32, 16, 8, 4, 2, 1];
  const X0 = 90, W = 170, GAP = 80, Y = 100, H = 130;

  figure('halving', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const arrows = [], boxes = [], labels = [];
      COUNTS.forEach((n, i) => {
        const x = X0 + i * (W + GAP);
        const last = i === COUNTS.length - 1;
        boxes.push(d.box(x, Y, W, H, String(n), { size: 48, mono: true, keepCase: true, width: 3, border: last ? c.yellow : c.light }));
        if (i > 0) {
          arrows.push(d.arrow(x - GAP, Y + H / 2, x - 5, Y + H / 2, { color: c.gray, width: 3, head: 16 }));
          labels.push(d.label(x - GAP / 2, 0, '?', { size: 32, anchor: 'middle', color: c.blue, centerY: Y + H / 2 - 35 }));
        }
      });
      labels.push(d.label(X0, 0, t('noch möglich', 'possibilities left'), { size: 32, color: c.gray, centerY: 40 }));
      // "fünf Fragen, und jede halbiert, was übrig ist" is 45 characters at 32 units, about 860, centred
      labels.push(d.label(800, 0, t('fünf Fragen, und jede halbiert, was übrig ist', 'five questions, and each halves what is left'), { size: 32, anchor: 'middle', color: c.gray, centerY: 290 }));
      return d.svg(1600, 330, ...d.layers(arrows, boxes, labels));
    },
  });

  // What a bigger alphabet buys, the slide in its last step: colours, bits
  // per symbol and the time the same file takes at the same symbol rate.
  // Bars start at 640 and are 760 long at 100 %, so "100 %" ends near 1520.
  const ROWS = [
    { colours: 2, bits: 1, length: 1 },
    { colours: 4, bits: 2, length: 1 / 2 },
    { colours: 8, bits: 3, length: 1 / 3 },
    { colours: 16, bits: 4, length: 1 / 4 },
  ];

  figure('alphabet-bits', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const parts = [
        d.label(60, 0, t('Farben', 'colours'), { size: 32, color: c.gray, centerY: 40 }),
        d.label(260, 0, t('Bit je Symbol', 'bits per symbol'), { size: 32, color: c.gray, centerY: 40 }),
        d.label(640, 0, t('Zeit für dieselbe Datei', 'time for the same file'), { size: 32, color: c.gray, centerY: 40 }),
        d.line(40, 80, 1560, 80, { color: c.gray, width: 2 }),
      ];
      ROWS.forEach((r, i) => {
        const y = 140 + i * 100;
        parts.push(d.label(60, 0, String(r.colours), { size: 48, mono: true, keepCase: true, color: c.white, centerY: y }));
        parts.push(d.formula(260, 0, `log_2(${r.colours}) = ${r.bits}`, { size: 32, color: c.light, centerY: y }));
        const w = 760 * r.length;
        parts.push(`<rect x="640" y="${y - 26}" width="${w}" height="52" rx="4" fill="${c.light}"/>`);
        parts.push(d.label(640 + w + 24, 0, `${Math.round(100 * r.length)} %`, { size: 32, mono: true, keepCase: true, color: c.gray, centerY: y }));
      });
      return d.svg(1600, 490, ...parts);
    },
  });
})();
