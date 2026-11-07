// Drawings of "Reasoning" (docs/figures.md): 1600 units wide, sizes 32 and 48
// only, colours from the theme. All three are still pictures, because they
// compare two ways of answering, show the structure of a training round and
// contrast two ways of spending more thought; none is a process that needs
// its course to be understood.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // Lines of text in a box, left-aligned and evenly spaced (stagekit rule:
  // several lines in a box are left-aligned, with the same room above and
  // below).
  function lines(x, firstCentre, step, texts, o) {
    return texts.map((text, i) => d.label(x, 0, text, { size: 32, centerY: firstCentre + i * step, ...o }));
  }

  // The tractor question of the lesson, answered at once and after thinking.
  // Columns: question 40-400, thinking 520-1100, answer 1220-1560. The
  // longest line in the thinking box, "x + x + 10,000 = 11,000", is 23 x 19.2
  // = 442 wide and starts at 560, ending at 1002. "1,000 €" in 48 is
  // 7 x 28.8 = 202 wide in its box of 340.
  figure('answer-or-think', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const ROW_A = 95;
      const ROW_B = 380;
      const wires = [
        d.arrow(400, ROW_A, 1205, ROW_A, { color: c.gray, width: 3, head: 16 }),
        d.arrow(400, ROW_B, 505, ROW_B, { color: c.gray, width: 3, head: 16 }),
        d.arrow(1100, ROW_B, 1205, ROW_B, { color: c.gray, width: 3, head: 16 }),
      ];
      const boxes = [
        d.box(40, ROW_A - 55, 360, 110, t('Frage', 'question'), { size: 48, border: c.gray }),
        d.verdict(1220, ROW_A - 70, 340, 160, t('1.000 €', '1,000 €'), false, { size: 48 }),
        d.box(40, ROW_B - 55, 360, 110, t('Frage', 'question'), { size: 48, border: c.gray }),
        d.box(520, 240, 580, 280, '', { border: c.blue }),
        d.verdict(1220, ROW_B - 70, 340, 160, t('500 €', '500 €'), true, { size: 48 }),
      ];
      const labels = [
        d.label(802, 0, t('antwortet sofort', 'answers right away'), { size: 32, color: c.gray, anchor: 'middle', centerY: ROW_A - 32 }),
        d.label(810, 0, t('denkt zuerst schriftlich nach', 'thinks in writing first'), { size: 32, color: c.blue, anchor: 'middle', centerY: 212 }),
        ...lines(560, 290, 60, t(
          ['Anhänger: x', 'Traktor: x + 10.000', 'x + x + 10.000 = 11.000', 'x = 500'],
          ['trailer: x', 'tractor: x + 10,000', 'x + x + 10,000 = 11,000', 'x = 500'],
        ), { color: c.white }),
      ];
      return d.svg(1600, 560, ...d.layers(wires, boxes, labels));
    },
  });

  // One round of learning from rewards. Problem 40-340, model 420-640, four
  // attempts 760-1180 with their centres at 105, 235, 365 and 495, marks at
  // 1240, rewards from 1290; the way back runs below at 600. The longest
  // attempt, "Versuch 2: … 1.000 €", is 20 x 19.2 = 384 wide in its box of
  // 420; "Belohnung 0" is 11 x 19.2 = 211 wide and ends at 1501.
  figure('learning-from-rewards', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const MID = 300;
      const attempts = [
        { text: t('Versuch 1: … 500 €', 'attempt 1: … 500 €'), ok: true },
        { text: t('Versuch 2: … 1.000 €', 'attempt 2: … 1,000 €'), ok: false },
        { text: t('Versuch 3: … 400 €', 'attempt 3: … 400 €'), ok: false },
        { text: t('Versuch 4: … 500 €', 'attempt 4: … 500 €'), ok: true },
      ];
      const ys = [105, 235, 365, 495];
      const wires = [
        d.arrow(340, MID, 405, MID, { color: c.gray, width: 3, head: 16 }),
        ...ys.map((y) => d.arrow(640, MID, 745, y, { color: c.gray, width: 2, head: 14 })),
        d.line(1400, 540, 1400, 610, { color: c.blue, width: 3 }),
        d.line(1400, 610, 530, 610, { color: c.blue, width: 3 }),
        d.arrow(530, 610, 530, 375, { color: c.blue, width: 3, head: 16 }),
      ];
      const boxes = [
        d.box(40, MID - 80, 300, 160, t('Aufgabe mit\nbekannter Lösung', 'problem with a\nknown answer'), { size: 32, border: c.gray }),
        d.box(420, MID - 60, 220, 120, t('Modell', 'model'), { size: 48, border: c.white }),
        ...attempts.map((a, i) => d.box(760, ys[i] - 45, 420, 90, a.text, { size: 32, border: a.ok ? c.light : c.dark, color: a.ok ? c.white : c.gray })),
        ...attempts.map((a, i) => d.mark(1240, ys[i], a.ok)),
      ];
      const labels = [
        ...attempts.map((a, i) => d.label(1290, 0, t(`Belohnung ${a.ok ? 1 : 0}`, `reward ${a.ok ? 1 : 0}`), { size: 32, color: a.ok ? c.white : c.gray, centerY: ys[i] })),
        d.label(965, 0, t('das Denken, das zu ✓ führte, wird wahrscheinlicher', 'the thinking that led to ✓ becomes more likely'), { size: 32, color: c.blue, anchor: 'middle', centerY: 650 }),
      ];
      return d.svg(1600, 690, ...d.layers(wires, boxes, labels));
    },
  });

  // Two ways of spending more thought on the same question. Left 40-760:
  // one long chain with a correction in it; its longest line, "wait, step 2
  // is wrong", is 22 x 19.2 = 422 wide from 100. Right 840-1560: five short
  // chains of 110 at a pitch of 140 from 870, their answers below and a vote.
  figure('longer-or-more-often', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const wires = [];
      const boxes = [d.box(60, 100, 680, 450, '', { border: c.blue })];
      const labels = [
        d.label(400, 0, t('länger nachdenken', 'think longer'), { size: 32, color: c.blue, anchor: 'middle', centerY: 60 }),
        d.label(1200, 0, t('öfter nachdenken', 'think more often'), { size: 32, color: c.blue, anchor: 'middle', centerY: 60 }),
      ];
      const chain = t(
        ['Schritt 1', 'Schritt 2', 'Moment, Schritt 2 ist falsch', 'Schritt 2, neu', 'Schritt 3', 'Antwort: 500 €'],
        ['step 1', 'step 2', 'wait, step 2 is wrong', 'step 2, again', 'step 3', 'answer: 500 €'],
      );
      chain.forEach((text, i) => {
        const y = 160 + i * 70;
        if (i === 2) boxes.push(d.highlight(100, text.length * 19.2, y, 32, { color: c.gray, opacity: 0.25 }));
        labels.push(d.label(100, 0, text, { size: 32, centerY: y, color: i === chain.length - 1 ? c.white : c.light }));
      });

      const answers = ['500', '500', t('1.000', '1,000'), '500', '400'];
      answers.forEach((a, i) => {
        const x = 870 + i * 140;
        const cx = x + 55;
        boxes.push(d.box(x, 100, 110, 220, '', { border: c.gray }));
        [150, 195, 240].forEach((y, k) => boxes.push(d.line(x + 20, y, x + 90 - k * 15, y, { color: c.gray, width: 3 })));
        labels.push(d.label(cx, 0, a, { size: 32, anchor: 'middle', centerY: 280, color: c.white }));
        // the arrows end spread along the top of the vote box, not in one point
        wires.push(d.arrow(cx, 320, 1200 + (cx - 1200) * 0.4, 442, { color: c.gray, width: 2, head: 12 }));
      });
      boxes.push(d.box(980, 450, 440, 100, t('Mehrheit: 500 €', 'majority: 500 €'), { size: 32, border: c.blue }));
      return d.svg(1600, 590, ...d.layers(wires, boxes, labels));
    },
  });
})();
