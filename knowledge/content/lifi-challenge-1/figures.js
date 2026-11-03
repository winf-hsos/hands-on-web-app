// Drawings of challenge 1 (docs/figures.md): 1600 units wide, sizes 32 and
// 48 only, and as still pictures.
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // What run_test does in one go: first it shows every colour once and hands
  // the readings to calibrate, then it sends the random sequence of the
  // course server and hands every recognised name back for comparison.
  // The two functions the team writes have a bright frame, everything that
  // comes ready a grey one.
  const A = { x: 40, w: 380 }; // "jede Farbe einmal," 18 characters at 32, about 350
  const B = { x: 500, w: 420 }; // send_symbol(name), 17 characters of code at 32, about 344 + 40
  const C = { x: 1080, w: 440 }; // calibrate(readings), 19 characters of code at 32, about 384 + 40
  const ROW1 = 80, ROW2 = 330, H = 110;

  figure('run-test', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const lines = [], boxes = [], labels = [];
      const centre = (col) => col.x + col.w / 2;
      const given = (col, y, h, text, mono) => {
        boxes.push(d.box(col.x, y, col.w, h, '', { border: c.gray, width: 2 }));
        labels.push(
          mono
            ? d.label(centre(col), 0, text, { size: 32, mono: true, keepCase: true, anchor: 'middle', color: c.light, centerY: y + h / 2 })
            : d.label(col.x + 24, 0, text, { size: 32, color: c.light, centerY: y + h / 2 }),
        );
      };
      const yours = (col, y, text) => {
        boxes.push(d.box(col.x, y, col.w, H, '', { border: c.white, width: 3 }));
        labels.push(d.label(centre(col), 0, text, { size: 32, mono: true, keepCase: true, anchor: 'middle', color: c.white, centerY: y + H / 2 }));
      };
      const light = (y) => {
        lines.push(d.arrow(B.x + B.w, y, C.x - 4, y, { color: c.gray, width: 3, head: 16 }));
        labels.push(d.label((B.x + B.w + C.x) / 2, 0, t('Licht', 'light'), { size: 32, anchor: 'middle', color: c.gray, centerY: y - 30 }));
      };

      // 1: calibrating
      labels.push(d.label(A.x, 0, t('1 Kalibrieren, einmal vor jedem Durchgang', '1 Calibrating, once before every run'), { size: 32, color: c.gray, centerY: 40 }));
      given(A, ROW1, H, t('jede Farbe einmal,\nder Reihe nach', 'every colour once,\nin order'));
      lines.push(d.arrow(A.x + A.w, ROW1 + H / 2, B.x - 4, ROW1 + H / 2, { color: c.gray, width: 3, head: 16 }));
      given(B, ROW1, H, 'send_symbol(name)', true);
      light(ROW1 + H / 2);
      yours(C, ROW1, 'calibrate(readings)');

      // what calibrate learns is what receive_symbol compares with
      lines.push(d.arrow(centre(C), ROW1 + H, centre(C), ROW2 - 4, { color: c.gray, width: 3, head: 16 }));
      labels.push(d.label(centre(C) + 24, 0, 'REFERENCES', { size: 32, mono: true, keepCase: true, color: c.light, centerY: (ROW1 + H + ROW2) / 2 }));

      // 2: testing; the server box reaches down to where the answer comes back
      labels.push(d.label(A.x, 0, t('2 Testen, 20 Versuche', '2 Testing, 20 tries'), { size: 32, color: c.gray, centerY: ROW2 - 40 }));
      given(A, ROW2, 230, t('Kursserver:\nZufallsfolge\nund Vergleich', 'course server:\nrandom sequence\nand comparison'));
      lines.push(d.arrow(A.x + A.w, ROW2 + H / 2, B.x - 4, ROW2 + H / 2, { color: c.gray, width: 3, head: 16 }));
      given(B, ROW2, H, 'send_symbol(name)', true);
      light(ROW2 + H / 2);
      yours(C, ROW2, 'receive_symbol()');

      // the recognised name goes back to the server
      const back = ROW2 + 190;
      lines.push(d.line(centre(C), ROW2 + H, centre(C), back, { color: c.gray, width: 3 }));
      lines.push(d.arrow(centre(C), back, A.x + A.w + 4, back, { color: c.gray, width: 3, head: 16 }));
      labels.push(d.label((A.x + A.w + centre(C)) / 2, 0, t('erkannter Name', 'recognised name'), { size: 32, anchor: 'middle', color: c.gray, centerY: back - 30 }));

      // and the result to the team cockpit
      lines.push(d.arrow(centre(A), ROW2 + 230, centre(A), ROW2 + 290, { color: c.gray, width: 3, head: 16 }));
      labels.push(d.label(A.x, 0, t('Ergebnis im Team-Cockpit', 'result in the team cockpit'), { size: 32, color: c.light, centerY: ROW2 + 325 }));

      return d.svg(1600, ROW2 + 370, ...d.layers(lines, boxes, labels));
    },
  });
})();
