// Drawings of "Analog and digital" (docs/figures.md), after the deck
// analog-and-digital-slides, redrawn at the width of the text.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // A link that sends data with light: numbers become light, light becomes
  // numbers again, and the stretch in between belongs to physics.
  const BOX_Y = 110, BOX_H = 140, MID = BOX_Y + BOX_H / 2;
  const SENDER_X = 20, SENSOR_X = 1120, BOX_W = 280;
  const CURVE_X0 = 380, CURVE_X1 = 1060;

  // the light as a smooth, restless curve: overlaid waves under a wandering
  // envelope, zero at both ends so that it meets the straight lines
  const light = (c) => {
    const pts = [];
    for (let i = 0; i <= 400; i += 1) {
      const t = i / 400;
      const fade = Math.sin(Math.PI * t) ** 0.65;
      const envelope = 30 + 22 * Math.sin(t * Math.PI * 2.7 + 0.9);
      const value = Math.sin(t * 47) * 0.6 + Math.sin(t * 19.4 + 1.1) * 0.3 + Math.sin(t * 89 + 2.2) * 0.13;
      pts.push(`${(CURVE_X0 + t * (CURVE_X1 - CURVE_X0)).toFixed(1)},${(MID + fade * envelope * value * 1.4).toFixed(1)}`);
    }
    return `<polyline points="${pts.join(' ')}" fill="none" stroke="${c.light}" stroke-width="3"/>`;
  };

  figure('three-zones', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const zone = (x, text, color) => d.label(x, 0, text, { size: 32, anchor: 'middle', color, centerY: 330 });
      return d.svg(
        1600,
        370,
        ...d.layers(
          [
            d.line(SENDER_X + BOX_W, MID, CURVE_X0, MID, { color: c.light, width: 3 }),
            light(c),
            d.arrow(CURVE_X1, MID, SENSOR_X - 5, MID, { color: c.light, width: 3, head: 16 }),
            d.line(340, 20, 340, 350, { color: c.gray, width: 2, dashed: true }),
            d.line(1100, 20, 1100, 350, { color: c.gray, width: 2, dashed: true }),
          ],
          [
            // "Sender" and "sensor" are 6 characters at 48 units, about 175 of the 280
            d.box(SENDER_X, BOX_Y, BOX_W, BOX_H, t('Sender', 'sender'), { size: 48, width: 3, rx: 10 }),
            d.box(SENSOR_X, BOX_Y, BOX_W, BOX_H, t('Sensor', 'sensor'), { size: 48, width: 3, rx: 10 }),
          ],
          [
            // "(255, 0, 0)" is 11 characters of code type at 32 units, about 225, centred over the sender
            d.label(SENDER_X + BOX_W / 2, 0, '(255, 0, 0)', { size: 32, mono: true, keepCase: true, anchor: 'middle', color: c.light, centerY: 60 }),
            // "Umgebungslicht · Abstand · Rauschen" is 35 characters at 32 units, about 670, between the dashes at 340 and 1100
            d.label(720, 0, t('Umgebungslicht · Abstand · Rauschen', 'ambient light · distance · noise'), { size: 32, anchor: 'middle', color: c.gray, centerY: 50 }),
            // the three readings, 7 characters of code type at 32 units, about 140, from 1420 on
            d.label(1420, 0, 'r = 203\ng = 41\nb = 57', { size: 32, mono: true, keepCase: true, color: c.light, centerY: MID }),
            zone(180, 'digital', c.white),
            zone(720, 'analog', c.blue),
            zone(1350, 'digital', c.white),
          ],
        ),
      );
    },
  });

  // The same wobble three times, only the number of regions grows. The
  // sender aims at the middle of the second region from the bottom; the band
  // is the wobble of the code example (up to 29 of a range of 300), scaled to
  // the 480 units of a column.
  const COL_Y = 20, COL_H = 480, COL_W = 220, WOBBLE = 46;
  const COLUMNS = [
    { x: 190, n: 2 },
    { x: 690, n: 4 },
    { x: 1190, n: 8 },
  ];

  figure('decision-levels', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const parts = [];
      for (const { x, n } of COLUMNS) {
        const region = COL_H / n;
        const bottom = COL_Y + COL_H;
        const middle = bottom - 1.5 * region;
        const fits = WOBBLE < region / 2;
        const color = fits ? c.white : c.red;
        const cx = x + COL_W / 2;
        parts.push(d.box(x, COL_Y, COL_W, COL_H, '', { border: c.light, fill: 'none', rounded: false, width: 3 }));
        for (let i = 1; i < n; i += 1) parts.push(d.line(x, COL_Y + i * region, x + COL_W, COL_Y + i * region, { color: c.gray, width: 2 }));
        parts.push(d.line(cx, middle - WOBBLE, cx, middle + WOBBLE, { color, width: 4 }));
        for (const dy of [-WOBBLE, WOBBLE]) parts.push(d.line(cx - 26, middle + dy, cx + 26, middle + dy, { color, width: 4 }));
        parts.push(`<circle cx="${cx}" cy="${middle}" r="11" fill="${color}"/>`);
        // "8 Bereiche" is 10 characters at 32 units, about 190 of the 220
        parts.push(d.label(cx, 0, t(`${n} Bereiche`, `${n} regions`), { size: 32, anchor: 'middle', color: c.gray, centerY: 550 }));
        parts.push(d.mark(cx, 615, fits));
      }
      return d.svg(1600, 650, ...parts);
    },
  });

  // The two cuts on one signal: the continuous curve, then measured at
  // twelve points in time or place, then each value rounded to one of four
  // levels.
  const PANEL_W = 440, PANEL_Y = 30, PANEL_H = 300, PANELS = [20, 580, 1140];
  const SAMPLES = 12, LEVELS = 4;
  const signal = (s) => 0.5 + 0.3 * Math.sin(2 * Math.PI * s * 1.3 + 0.4) + 0.12 * Math.sin(2 * Math.PI * s * 3.1 + 1);
  const yOf = (v) => PANEL_Y + PANEL_H - 20 - v * (PANEL_H - 40);
  const curve = (x0, color) => {
    const pts = [];
    for (let i = 0; i <= 200; i += 1) pts.push(`${(x0 + (i / 200) * PANEL_W).toFixed(1)},${yOf(signal(i / 200)).toFixed(1)}`);
    return `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="3"/>`;
  };
  const sampleX = (x0, i) => x0 + ((i + 0.5) / SAMPLES) * PANEL_W;
  const levelOf = (v) => Math.round(v * (LEVELS - 1)) / (LEVELS - 1);

  figure('two-cuts', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const [a, b, q] = PANELS;
      const parts = [curve(a, c.white)];
      const dot = (x, y, color) => `<circle cx="${x}" cy="${y}" r="10" fill="${color}"/>`;

      parts.push(curve(b, c.dark));
      for (let i = 0; i < SAMPLES; i += 1) {
        const x = sampleX(b, i);
        parts.push(d.line(x, PANEL_Y, x, PANEL_Y + PANEL_H, { color: c.dark, width: 2, dashed: true }));
        parts.push(dot(x, yOf(signal((i + 0.5) / SAMPLES)), c.white));
      }

      parts.push(curve(q, c.dark));
      for (let k = 0; k < LEVELS; k += 1) {
        const y = yOf(k / (LEVELS - 1));
        parts.push(d.line(q, y, q + PANEL_W, y, { color: c.gray, width: 2 }));
      }
      for (let i = 0; i < SAMPLES; i += 1) parts.push(dot(sampleX(q, i), yOf(levelOf(signal((i + 0.5) / SAMPLES))), c.blue));

      const arrow = { color: c.gray, width: 3, head: 16 };
      parts.push(d.arrow(a + PANEL_W + 20, PANEL_Y + PANEL_H / 2, b - 20, PANEL_Y + PANEL_H / 2, arrow));
      parts.push(d.arrow(b + PANEL_W + 20, PANEL_Y + PANEL_H / 2, q - 20, PANEL_Y + PANEL_H / 2, arrow));

      // the longest heading, "Schnitt 2: Quantisieren", is 23 characters at 32 units, about 440, centred on its panel
      const caption = (x0, head, note) => [
        d.label(x0 + PANEL_W / 2, 0, head, { size: 32, anchor: 'middle', centerY: 380 }),
        d.label(x0 + PANEL_W / 2, 0, note, { size: 32, anchor: 'middle', color: c.gray, centerY: 425 }),
      ];
      parts.push(...caption(a, t('das Signal', 'the signal'), t('stufenlos', 'continuous')));
      parts.push(...caption(b, t('Schnitt 1: Abtasten', 'cut 1: sampling'), t('12 Messpunkte', '12 points')));
      parts.push(...caption(q, t('Schnitt 2: Quantisieren', 'cut 2: quantising'), t('4 Stufen', '4 levels')));
      return d.svg(1600, 460, ...parts);
    },
  });
})();
