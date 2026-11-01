// Drawings of "Ein Python-Programm in der Kommandozeile starten" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // python hallo.py as input, processing, output (d.ipo): the file goes into
  // Python, and what the program prints appears in the terminal.
  const PROMPT = 'PS C:\\Users\\anna\\studium\\programmieren\\uebung-1>';
  // terminal 1592 wide: prompt and command are 48 + 1 + 15 characters, 1294 at 32 units, plus 64
  const T = { x: 4, y: 4, w: 1592, h: 250 };
  const IPO = { x: 40, y: 330 };

  figure('python-runs-file', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      const line = (i) => p.terminal.lineY(T.y, i);
      const mono = { size: 32, mono: true, keepCase: true };
      return d.svg(
        1600,
        480,
        p.terminal(T.x, T.y, T.w, T.h, { title: 'PowerShell' }),
        d.label(T.x + 32, 0, PROMPT, { ...mono, color: c.gray, centerY: line(0) }),
        d.label(T.x + 32 + p.codeWidth(`${PROMPT} `), 0, 'python hallo.py', { ...mono, centerY: line(0) }),
        d.g('asked', d.label(T.x + 32, 0, t('Wie heißt du? Anna', 'What is your name? Anna'), { ...mono, centerY: line(1) })),
        d.g('printed', d.label(T.x + 32, 0, t('Hallo, Anna!', 'Hello, Anna!'), { ...mono, color: c.yellow, centerY: line(2) })),
        // the row from draw.js, without its output, which comes in the second segment
        d.ipo(IPO.y, 'hallo.py', 'python', '', { x: IPO.x, monoIn: true, monoBox: true, keepCase: true }),
        d.g('route', d.line(IPO.x + 300, IPO.y + 65, IPO.x + 520, IPO.y + 65, { color: 'none' })),
        d.g('file', d.label(IPO.x + 300, 0, 'hallo.py', { ...mono, anchor: 'middle', color: c.yellow, centerY: IPO.y + 65 })),
        d.g('out', d.label(IPO.x + 1380, 0, t('Hallo, Anna!', 'Hello, Anna!'), { ...mono, anchor: 'middle', color: c.yellow, centerY: IPO.y + 65 })),
      );
    },
    animate(a) {
      a.set('file', { opacity: 0 });
      a.step(a.show('file', { dur: 300 }), a.along('file', 'route', { dur: 1000 }), a.hide('file', { dur: 300 }));
      a.step(a.show('asked', { dur: 400 }), a.par(a.show('out', { dur: 500 }), a.show('printed', { dur: 500 })));
    },
  });
})();
