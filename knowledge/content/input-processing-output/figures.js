// Drawings of "Input, processing, output" (docs/figures.md), after the deck
// input-processing-output-slides. All three are still pictures.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // The receiver as one IPO row: d.ipo puts the input around 300, the box
  // from 580 to 1080 (middle 830) and the output around 1380. The input is
  // two lines of readings; the longer, "r=203 g=41", is 10 characters of code
  // type at 32 units, about 202, so it spans 199 to 401, left of the arrow.
  figure('receiver', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const note = (x, text, y) => d.label(x, 0, text, { size: 32, anchor: 'middle', color: c.gray, centerY: y });
      return d.svg(
        1600,
        400,
        note(300, t('Eingabe', 'input'), 40),
        note(830, t('Verarbeitung', 'processing'), 40),
        note(1380, t('Ausgabe', 'output'), 40),
        d.ipo(110, '', 'classify()', '"red"', { monoBox: true, keepCase: true, monoOut: true }),
        d.label(300, 0, 'r=203 g=41\nb=57 c=310', { size: 32, mono: true, keepCase: true, anchor: 'middle', centerY: 175 }),
        note(300, t('vier Zahlen', 'four numbers'), 330),
        // "eine Entscheidungsregel" is 23 characters at 32 units, about 440 under the 500 of the box
        note(830, t('eine Entscheidungsregel', 'a decision rule'), 330),
        note(1380, t('ein Wort', 'a word'), 330),
      );
    },
  });

  // The light link as a chain. Boxes 320 wide, since "encode()" is 8
  // characters of code type at 48 units, about 243, plus 20 on each side;
  // '"hi"' is 4 characters at 48, about 121. Five dots stand for the colours
  // on their way. A blue bracket over both boxes is the agreement they share.
  const MID = 200, BOX_Y = 130, BOX_H = 140, ENC = 250, DEC = 1050, BOX_W = 320;
  const DOTS = [700, 756, 812, 868, 924];

  figure('chain', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const arrow = { color: c.light, width: 3, head: 16 };
      const encMid = ENC + BOX_W / 2, decMid = DEC + BOX_W / 2;
      const text = (x) => d.label(x, 0, '"hi"', { size: 48, mono: true, keepCase: true, anchor: 'middle', centerY: MID });
      const note = (x, words) => d.label(x, 0, words, { size: 32, anchor: 'middle', color: c.gray, centerY: 330 });
      const bracket = { color: c.blue, width: 3 };
      return d.svg(
        1600,
        370,
        ...d.layers(
          [
            d.arrow(150, MID, ENC - 10, MID, arrow),
            d.arrow(ENC + BOX_W + 15, MID, 665, MID, arrow),
            d.arrow(960, MID, DEC - 10, MID, arrow),
            d.arrow(DEC + BOX_W + 15, MID, 1445, MID, arrow),
            d.line(encMid, BOX_Y - 10, encMid, 90, bracket),
            d.line(encMid, 90, decMid, 90, bracket),
            d.line(decMid, 90, decMid, BOX_Y - 10, bracket),
          ],
          [
            d.box(ENC, BOX_Y, BOX_W, BOX_H, 'encode()', { size: 48, mono: true, keepCase: true, width: 3, rx: 10 }),
            d.box(DEC, BOX_Y, BOX_W, BOX_H, 'decode()', { size: 48, mono: true, keepCase: true, width: 3, rx: 10 }),
            ...DOTS.map((x) => `<circle cx="${x}" cy="${MID}" r="20" fill="${c.light}"/>`),
          ],
          [
            text(80),
            text(1510),
            // "dieselbe Vereinbarung auf beiden Seiten" is 39 characters at 32 units, about 750
            d.label(812, 0, t('dieselbe Vereinbarung auf beiden Seiten', 'the same agreement on both sides'), { size: 32, anchor: 'middle', color: c.blue, centerY: 50 }),
            note(encMid, t('Sender', 'sender')),
            note(812, t('Licht', 'light')),
            note(decMid, t('Empfänger', 'receiver')),
          ],
        ),
      );
    },
  });

  // The same IPO shape on three levels, one d.ipo row each (130 high), with
  // the level as a heading above its row.
  const ROWS = [
    { y: 70, level: ['System', 'system'], input: ['Nachricht', 'message'], box: ['Sender', 'sender'], output: ['Licht', 'light'] },
    { y: 300, level: ['Funktion', 'function'], input: ['Text', 'text'], box: 'encode()', output: ['Farben', 'colours'], code: true },
    { y: 530, level: ['Logikgatter', 'logic gate'], input: '1, 1', box: 'AND', output: '1', code: true, bits: true },
  ];

  figure('levels', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const say = (v) => (Array.isArray(v) ? t(v[0], v[1]) : v);
      const rows = ROWS.map((r) =>
        d.label(40, 0, say(r.level), { size: 32, color: c.gray, centerY: r.y - 30 }) +
        d.ipo(r.y, say(r.input), say(r.box), say(r.output), { monoBox: r.code, keepCase: r.code, monoIn: r.bits, monoOut: r.bits }));
      return d.svg(1600, 680, ...rows);
    },
  });
})();
