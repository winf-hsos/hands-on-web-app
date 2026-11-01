// Drawings of "Symbols and information" (docs/figures.md), after the deck
// symbols-and-information-slides, redrawn at the width of the text.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // Two mapping tables for the same four colours. The colour names are code
  // values and stay English; the letters follow the page, as in the
  // experiment perfect-reception-perfect-nonsense (A E S T / E I N S).
  const COLOURS = ['red', 'green', 'blue', 'yellow'];
  const TABLES = {
    en: { sender: ['A', 'E', 'S', 'T'], receiver: ['T', 'A', 'E', 'S'], received: ['blue', 'green', 'red', 'yellow'], meant: 'SEAT', read: 'EATS' },
    de: { sender: ['E', 'I', 'N', 'S'], receiver: ['I', 'N', 'S', 'E'], received: ['yellow', 'red', 'green', 'blue'], meant: 'SEIN', read: 'EINS' },
  };

  figure('two-tables', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const data = TABLES[lang === 'en' ? 'en' : 'de'];
      const parts = [];
      const code = (x, y, text, o = {}) => d.label(x, 0, text, { size: 32, mono: true, keepCase: true, color: c.light, centerY: y, ...o });

      parts.push(d.label(60, 0, t('empfangen:', 'received:'), { size: 32, color: c.gray, centerY: 50 }));
      // the four colours, 26 characters of code type at 32 units, about 530, from 330 on
      parts.push(code(330, 50, data.received.join(' '), { color: c.white }));
      parts.push(d.line(40, 100, 1560, 100, { color: c.gray, width: 2 }));

      const table = (x, head, letters, color) => {
        parts.push(d.label(x, 0, head, { size: 32, color: c.gray, centerY: 150 }));
        COLOURS.forEach((colour, i) => {
          const y = 220 + i * 70;
          parts.push(code(x, y, colour));
          parts.push(d.label(x + 200, 0, '→', { size: 32, color: c.gray, centerY: y }));
          parts.push(code(x + 280, y, letters[i], { size: 48, color }));
        });
      };
      table(60, t('die Tabelle des Senders', "the sender's table"), data.sender, c.white);
      table(860, t('die Tabelle des Empfängers', "the receiver's table"), data.receiver, c.red);

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
})();
