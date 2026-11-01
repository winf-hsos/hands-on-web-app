// Drawings of "Die Grundideen des Programmierens" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // Three variables as jars with a sticker: the name in blue on the sticker,
  // the value inside. A new name replaces the old one, then the score goes up.
  const JAR_W = 360, VALUE_Y = 330;
  const JARS = [
    { x: 100, name: 'vorname', en: 'name' },
    { x: 620, name: 'alter', en: 'age' },
    { x: 1140, name: 'punkte', en: 'points' },
  ];
  const MID = (x) => x + JAR_W / 2;

  figure('containers', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const value = (x, text, o = {}) => d.label(MID(x), 0, text, { size: 48, mono: true, keepCase: true, anchor: 'middle', centerY: VALUE_Y, ...o });
      // the longest name, "vorname", is 7 characters of code type at 48 units, 212 of the 280 on the sticker
      const jars = JARS.map((j) => {
        const name = t(j.name, j.en);
        return d.box(j.x, 60, JAR_W, 400, '', { border: c.light, rx: 40, width: 3 }) +
          d.box(j.x + 50, 30, JAR_W - 100, 36, '', { border: c.light, width: 3 }) +
          d.box(j.x + 40, 110, JAR_W - 80, 90, name, { border: c.blue, color: c.blue, size: 48, mono: true, keepCase: true, width: 3 });
      });
      return d.svg(
        1600,
        480,
        ...jars,
        d.g('anna', value(JARS[0].x, '"Anna"')),
        d.g('ben', value(JARS[0].x, '"Ben"')),
        value(JARS[1].x, '19'),
        d.g('zero', value(JARS[2].x, '0')),
        d.g('one', value(JARS[2].x, '1')),
        // "+ 1" is 3 characters, 91 wide at 48 units, between the value and the wall of the jar
        d.g('plus', d.label(MID(JARS[2].x) + 70, 0, '+ 1', { size: 48, mono: true, color: c.yellow, centerY: VALUE_Y })),
      );
    },
    animate(a) {
      a.set('ben', { opacity: 0, y: -80 });
      a.set('one', { opacity: 0, y: -80 });
      a.step(
        a.par(a.hide('anna', { dur: 600 }), a.move('anna', 0, -80, { dur: 600 })),
        a.par(a.show('ben', { dur: 600 }), a.move('ben', 0, 80, { dur: 600 })),
      );
      a.step(
        a.show('plus', { dur: 400 }),
        a.par(a.hide('zero', { dur: 600 }), a.move('zero', 0, -80, { dur: 600 })),
        a.par(a.show('one', { dur: 600 }), a.move('one', 0, 80, { dur: 600 })),
      );
    },
  });

  // The bouncer: one yes-or-no question, and exactly one of two ways.
  figure('fork', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const arrow = { color: c.light, width: 3, head: 16 };
      return d.svg(
        1600,
        480,
        ...d.layers(
          [d.arrow(240, 240, 395, 240, arrow), d.arrow(860, 240, 1170, 110, arrow), d.arrow(860, 240, 1170, 370, arrow)],
          // "mindestens 18?" is 14 characters at 48 units, about 370 of the 460
          [d.box(400, 170, 460, 140, t('mindestens 18?', 'at least 18?'), { size: 48, width: 3, rx: 10 })],
          [d.verdict(1180, 30, 380, 160, t('einlassen', 'let in'), true, { size: 48, width: 3 }), d.verdict(1180, 290, 380, 160, t('abweisen', 'turn away'), false, { size: 48, width: 3 })],
          [
            d.label(140, 0, t('Gast', 'guest'), { size: 48, anchor: 'middle', color: c.light, centerY: 240 }),
            d.label(990, 0, t('ja', 'yes'), { size: 32, anchor: 'middle', color: c.gray, centerY: 145 }),
            d.label(990, 0, t('nein', 'no'), { size: 32, anchor: 'middle', color: c.gray, centerY: 340 }),
          ],
        ),
      );
    },
  });

  // A loop over a bag of onions: the yellow frame is the onion the loop is at.
  const ITEM_W = 280, ITEM_Y = 240, ITEM_H = 120, GAP = 360;
  const itemX = (i) => 160 + i * GAP;

  figure('loop', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const items = [0, 1, 2, 3].map((i) =>
        d.box(itemX(i), ITEM_Y, ITEM_W, ITEM_H, t(`Zwiebel ${i + 1}`, `onion ${i + 1}`), { size: 48, border: c.light, color: c.light, width: 3 }) +
        d.g(`done-${i}`, d.label(itemX(i) + ITEM_W / 2, 0, t('geschält', 'peeled'), { size: 32, anchor: 'middle', color: c.gray, centerY: 410 })));
      return d.svg(
        1600,
        520,
        // "für jede Zwiebel im Netz:" is 25 characters at 48 units, about 620, so it ends left of the box at 840
        d.label(160, 0, t('für jede Zwiebel im Netz:', 'for each onion in the bag:'), { size: 48, centerY: 80 }),
        d.box(840, 20, 360, 120, t('schälen', 'peel'), { size: 48, width: 3, rx: 10 }),
        ...items,
        d.g('cursor', d.box(itemX(0) - 14, ITEM_Y - 14, ITEM_W + 28, ITEM_H + 28, '', { border: c.yellow, fill: 'none', width: 4, rx: 14 })),
        d.g('end', d.label(800, 0, t('Das Netz ist leer, und die Schleife endet.', 'The bag is empty, and the loop ends.'), { size: 32, anchor: 'middle', centerY: 490 })),
      );
    },
    animate(a) {
      const centre = (i) => [itemX(i) + ITEM_W / 2, ITEM_Y + ITEM_H / 2];
      a.step(a.show('cursor', { dur: 300 }), a.show('done-0', { dur: 400 }));
      a.step(a.moveTo('cursor', ...centre(1), { dur: 500 }), a.show('done-1', { dur: 400 }));
      a.step(a.moveTo('cursor', ...centre(2), { dur: 500 }), a.show('done-2', { dur: 400 }));
      a.step(a.moveTo('cursor', ...centre(3), { dur: 500 }), a.show('done-3', { dur: 400 }), a.par(a.hide('cursor', { dur: 400 }), a.show('end', { dur: 400 })));
    },
  });

  // A function as input, processing, output (d.ipo), called twice with a
  // different parameter: the steps inside stay the same.
  const IPO = { x: 40, y: 120 };
  const IN_X = IPO.x + 300, BOX_X = IPO.x + 830, OUT_X = IPO.x + 1380, ROW = IPO.y + 65;

  figure('machine', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const head = (x, text) => d.label(x, 0, text, { size: 32, anchor: 'middle', color: c.gray, centerY: 60 });
      const at = (x, text, o = {}) => d.label(x, 0, text, { size: 32, anchor: 'middle', centerY: ROW, ...o });
      return d.svg(
        1600,
        300,
        head(IN_X, 'Parameter'),
        head(BOX_X, t('Funktion', 'function')),
        head(OUT_X, t('Rückgabewert', 'return value')),
        d.ipo(IPO.y, '', 'Cappuccino', '', { x: IPO.x }),
        d.g('in-big', at(IN_X, t('groß', 'large'))),
        d.g('in-small', at(IN_X, t('klein', 'small'))),
        d.g('route', d.line(IN_X, ROW, BOX_X, ROW, { color: 'none' })),
        d.g('token-big', at(IN_X, t('groß', 'large'), { color: c.yellow })),
        d.g('token-small', at(IN_X, t('klein', 'small'), { color: c.yellow })),
        // "kleiner Cappuccino" is 18 characters at 32 units, about 300, centred at 1420 inside the 1600
        d.g('out-big', at(OUT_X, t('großer Cappuccino', 'large cappuccino'), { color: c.yellow })),
        d.g('out-small', at(OUT_X, t('kleiner Cappuccino', 'small cappuccino'), { color: c.yellow })),
      );
    },
    animate(a) {
      a.set('token-big', { opacity: 0 });
      a.set('token-small', { opacity: 0 });
      a.set('in-small', { opacity: 0 });
      a.step(a.show('token-big', { dur: 200 }), a.along('token-big', 'route', { dur: 900 }), a.hide('token-big', { dur: 200 }), a.show('out-big', { dur: 500 }));
      a.step(
        a.par(a.hide('out-big', { dur: 400 }), a.swap('in-big', 'in-small', { dur: 400 })),
        a.show('token-small', { dur: 200 }),
        a.along('token-small', 'route', { dur: 900 }),
        a.hide('token-small', { dur: 200 }),
        a.show('out-small', { dur: 500 }),
      );
    },
  });
})();
