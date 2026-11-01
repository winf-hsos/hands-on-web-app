// Drawings of "Die Grundideen des Programmierens" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // Three variables as jars with a sticker: the name in blue on the sticker,
  // the value inside.
  const JAR_W = 360, VALUE_Y = 330;
  const JARS = [
    { x: 100, name: 'vorname', en: 'name', value: '"Anna"' },
    { x: 620, name: 'alter', en: 'age', value: '19' },
    { x: 1140, name: 'punkte', en: 'points', value: '0' },
  ];

  figure('containers', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      // the longest name, "vorname", is 7 characters of code type at 48 units, 212 of the 280 on the sticker
      const jars = JARS.map((j) =>
        d.box(j.x, 60, JAR_W, 400, '', { border: c.light, rx: 40, width: 3 }) +
        d.box(j.x + 50, 30, JAR_W - 100, 36, '', { border: c.light, width: 3 }) +
        d.box(j.x + 40, 110, JAR_W - 80, 90, t(j.name, j.en), { border: c.blue, color: c.blue, size: 48, mono: true, keepCase: true, width: 3 }) +
        d.label(j.x + JAR_W / 2, 0, j.value, { size: 48, mono: true, keepCase: true, anchor: 'middle', centerY: VALUE_Y }));
      return d.svg(1600, 480, ...jars);
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

  // A loop over a bag of onions, as a still picture half-way through: two
  // onions are peeled, the yellow frame is the one the loop is at.
  const ITEM_W = 280, ITEM_Y = 240, ITEM_H = 120, GAP = 360, AT = 2;
  const itemX = (i) => 160 + i * GAP;

  figure('loop', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const items = [0, 1, 2, 3].map((i) =>
        d.box(itemX(i), ITEM_Y, ITEM_W, ITEM_H, t(`Zwiebel ${i + 1}`, `onion ${i + 1}`), { size: 48, border: c.light, color: c.light, width: 3 }) +
        (i < AT ? d.label(itemX(i) + ITEM_W / 2, 0, t('geschält', 'peeled'), { size: 32, anchor: 'middle', color: c.gray, centerY: 410 }) : ''));
      return d.svg(
        1600,
        440,
        // "für jede Zwiebel im Netz:" is 25 characters at 48 units, about 620, so it ends left of the box at 840
        d.label(160, 0, t('für jede Zwiebel im Netz:', 'for each onion in the bag:'), { size: 48, centerY: 80 }),
        d.box(840, 20, 360, 120, t('schälen', 'peel'), { size: 48, width: 3, rx: 10 }),
        ...items,
        d.box(itemX(AT) - 14, ITEM_Y - 14, ITEM_W + 28, ITEM_H + 28, '', { border: c.yellow, fill: 'none', width: 4, rx: 14 }),
      );
    },
  });

  // A function as input, processing, output, called twice in one segment:
  // the parameter slips behind the box, and a large or a small cup comes out.
  const ROW = 190, IN_X = 220, BOX = { x: 520, y: 110, w: 560, h: 160 }, CUP_X = 1400, SAUCER_Y = 330;
  const BOX_MID = BOX.x + BOX.w / 2;

  // a cup of cappuccino on its saucer, s = 1 for the large one
  const cup = (s) => {
    const c = d.colors();
    const stroke = `stroke="${c.light}" stroke-width="3"`;
    const top = SAUCER_Y - 12 * s - 150 * s, bottom = SAUCER_Y - 12 * s;
    const x = (dx) => CUP_X + dx * s;
    const steam = (dx) => `<path d="M${x(dx)},${top - 24 * s} c${-14 * s},${-14 * s} ${14 * s},${-28 * s} 0,${-42 * s} c${-14 * s},${-14 * s} ${14 * s},${-28 * s} 0,${-42 * s}" fill="none" stroke="${c.gray}" stroke-width="3" stroke-linecap="round"/>`;
    return [
      `<ellipse cx="${CUP_X}" cy="${SAUCER_Y}" rx="${150 * s}" ry="${18 * s}" fill="${c.bg}" ${stroke}/>`,
      `<path d="M${x(92)},${top + 30 * s} C${x(150)},${top + 30 * s} ${x(150)},${top + 100 * s} ${x(82)},${top + 105 * s}" fill="none" ${stroke}/>`,
      `<path d="M${x(-100)},${top} L${x(100)},${top} L${x(75)},${bottom - 20 * s} Q${x(70)},${bottom} ${x(50)},${bottom} L${x(-50)},${bottom} Q${x(-70)},${bottom} ${x(-75)},${bottom - 20 * s} Z" fill="${c.bg}" ${stroke}/>`,
      `<ellipse cx="${CUP_X}" cy="${top}" rx="${100 * s}" ry="${16 * s}" fill="${c.bg}" ${stroke}/>`,
      steam(-30),
      steam(30),
    ].join('');
  };

  figure('machine', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const head = (x, text) => d.label(x, 0, text, { size: 32, anchor: 'middle', color: c.gray, centerY: 40 });
      // '"klein"' is 7 characters of code type at 48 units, 212, centred at 220
      const param = (text) => d.label(IN_X, 0, `"${text}"`, { size: 48, mono: true, keepCase: true, anchor: 'middle', centerY: ROW });
      const arrow = { color: c.light, width: 3, head: 16 };
      return d.svg(
        1600,
        360,
        head(IN_X, 'Parameter'),
        head(BOX_MID, t('Funktion', 'function')),
        head(CUP_X, t('Rückgabewert', 'return value')),
        // the moving copies lie under arrow and box, so the box swallows them
        d.g('route', d.line(IN_X, ROW, BOX_MID, ROW, { color: 'none' })),
        d.g('token-big', param(t('groß', 'large'))),
        d.g('token-small', param(t('klein', 'small'))),
        d.arrow(345, ROW, BOX.x - 5, ROW, arrow),
        // "make_cappuccino" is 15 characters of code type at 48 units, 455 of the 560
        d.box(BOX.x, BOX.y, BOX.w, BOX.h, 'make_cappuccino', { size: 48, mono: true, keepCase: true, width: 3, rx: 10 }),
        d.arrow(BOX.x + BOX.w + 15, ROW, 1225, ROW, arrow),
        d.g('in-big', param(t('groß', 'large'))),
        d.g('in-small', param(t('klein', 'small'))),
        d.g('cup-big', cup(1)),
        d.g('cup-small', cup(0.65)),
      );
    },
    animate(a) {
      a.set('token-big', { opacity: 0 });
      a.set('token-small', { opacity: 0 });
      a.set('in-small', { opacity: 0 });
      a.set('cup-big', { opacity: 0 });
      a.set('cup-small', { opacity: 0 });
      // both calls in one segment, as one sequence: large, then small
      a.step(
        a.show('token-big', { dur: 1 }),
        a.along('token-big', 'route', { dur: 900 }),
        a.hide('token-big', { dur: 1 }),
        a.show('cup-big', { dur: 500 }),
        a.wait(700),
        a.par(a.hide('cup-big', { dur: 400 }), a.swap('in-big', 'in-small', { dur: 400 })),
        a.show('token-small', { dur: 1 }),
        a.along('token-small', 'route', { dur: 900 }),
        a.hide('token-small', { dur: 1 }),
        a.show('cup-small', { dur: 500 }),
      );
    },
  });
})();
