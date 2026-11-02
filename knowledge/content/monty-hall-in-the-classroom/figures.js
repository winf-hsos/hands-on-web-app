// Drawings of "Three doors in the classroom" (docs/figures.md): who stands
// where at the front of the room, and one game in five steps. Both are still
// pictures, 1600 units wide, sizes 32 and 48 only. Blue marks the door the
// player has chosen; the verdict of the last step is red, since the example
// game is lost.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  const person = (x, y, stroke, width = 3) => `<circle cx="${x}" cy="${y}" r="30" fill="${d.colors().bg}" stroke="${stroke}" stroke-width="${width}"/>`;
  const seat = (x, y, stroke) => `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${stroke}" stroke-width="3"/>`;

  // A floor plan from above. Board 1520 wide at the top with a hint of the
  // record's grid on its right; the host behind the table, the player in
  // front of it, three rows of fourteen seats below. Labels at 32:
  // "Moderator mit Würfel und Münze" is 30 x 19.2 = 576, ending at 750;
  // "wer rät, je Spiel eine neue Person" is 34 x 19.2 = 653, from 850 to 1503.
  figure('classroom-setup', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const doors = [1, 2, 3].map((n, i) =>
        d.box(510 + i * 210, 295, 160, 110, String(n), { size: 48, border: c.light, width: 3 }));
      const grid = [
        ...[62, 98].map((y) => d.line(900, y, 1500, y, { color: c.dark })),
        ...[1000, 1100, 1200, 1300, 1400].map((x) => d.line(x, 46, x, 114, { color: c.dark })),
      ];
      const seats = [];
      for (let row = 0; row < 3; row += 1) for (let k = 0; k < 14; k += 1) seats.push(seat(247 + k * 85, 630 + row * 60, c.dark));
      return d.svg(
        1600,
        840,
        d.box(40, 30, 1520, 100, '', { border: c.light }),
        ...grid,
        d.label(80, 0, t('Tafel oder Beamer: das Protokoll', 'Board or projector: the record'), { size: 32, centerY: 80 }),
        person(1250, 200, c.light),
        d.label(1300, 0, t('Protokoll', 'Record keeper'), { size: 32, centerY: 200 }),
        person(800, 200, c.light),
        d.label(750, 0, t('Moderator mit Würfel und Münze', 'Host with die and coin'), { size: 32, anchor: 'end', centerY: 200 }),
        d.box(470, 265, 660, 170, '', { border: c.dark }),
        ...doors,
        person(800, 520, c.blue, 5),
        d.label(850, 0, t('wer rät, je Spiel eine neue Person', 'the player, someone new each game'), { size: 32, centerY: 520 }),
        ...seats,
        d.label(800, 0, t('Publikum: stimmt ab und schaut zu', 'Audience: votes and watches'), { size: 32, color: c.gray, anchor: 'middle', centerY: 805 }),
      );
    },
  });

  // One game, a row per step: the step on the left (48, with a note at 32
  // below it, at most "Würfel 3 oder 4: Auto hinter 2", 30 x 19.2 = 576 from
  // x 40), the three doors on the right, 200 wide with gaps of 80 from x 740.
  // A closed door shows its number; a door seen from behind or opened shows
  // number and card, "1: Ziege" being 8 x 19.2 = 154 wide. The car is behind
  // door 2, the player chooses door 1, the host must open door 3, and the
  // player stays and loses.
  // 130 high, so that the verdict of the last step has room for its text
  // above the cross.
  const DOOR_X = [740, 1020, 1300], DOOR_W = 200, DOOR_H = 130;

  figure('one-game', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const card = (n) => (n === 2 ? t('Auto', 'car') : t('Ziege', 'goat'));
      const closed = (n, top, chosen) => d.box(DOOR_X[n - 1], top, DOOR_W, DOOR_H, String(n), { size: 48, border: chosen ? c.blue : c.light, width: chosen ? 5 : 3 });
      const open = (n, top) => d.box(DOOR_X[n - 1], top, DOOR_W, DOOR_H, `${n}: ${card(n)}`, { size: 32, border: c.gray, dashed: true, color: n === 2 ? c.white : c.gray });
      const steps = [
        { title: t('1 Verstecken', '1 Hide'), note: t('Würfel 3 oder 4: Auto hinter 2', 'die 3 or 4: car behind 2'), doors: (top) => [open(1, top), open(2, top), open(3, top)] },
        { title: t('2 Wählen', '2 Choose'), note: t('die Person vorne wählt Tür 1', 'the player picks door 1'), doors: (top) => [closed(1, top, true), closed(2, top), closed(3, top)] },
        { title: t('3 Öffnen', '3 Open'), note: t('der Moderator zeigt eine Ziege', 'the host shows a goat'), doors: (top) => [closed(1, top, true), closed(2, top), open(3, top)] },
        {
          title: t('4 Entscheiden', '4 Decide'),
          note: t('bleiben oder wechseln?', 'stay or switch?'),
          doors: (top) => [closed(1, top, true), closed(2, top), open(3, top), d.arrow(948, top + DOOR_H / 2, 1012, top + DOOR_H / 2, { color: c.blue, width: 3 })],
        },
        {
          title: t('5 Aufdecken', '5 Reveal'),
          note: t('geblieben, also verloren', 'stayed, so lost'),
          doors: (top) => [d.verdict(DOOR_X[0], top, DOOR_W, DOOR_H, `1: ${card(1)}`, false, { size: 32 }), open(2, top), open(3, top)],
        },
      ];
      const parts = [];
      steps.forEach((step, i) => {
        const top = 40 + i * 170, mid = top + DOOR_H / 2;
        parts.push(d.label(40, 0, step.title, { size: 48, centerY: mid - 22 }));
        parts.push(d.label(40, 0, step.note, { size: 32, color: c.gray, centerY: mid + 30 }));
        parts.push(...step.doors(top));
      });
      return d.svg(1600, 890, ...parts);
    },
  });
})();
