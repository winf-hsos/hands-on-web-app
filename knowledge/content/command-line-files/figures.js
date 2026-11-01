// Drawings of "Ordner und Dateien anlegen, kopieren und verschieben" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // Two folders and two commands: cp sends a copy across and the original
  // stays, mv takes the file itself across.
  const LEFT = 40, RIGHT = 940, TOP = 30, W = 620, H = 300;
  const SHIFT = RIGHT - LEFT;
  const ROW = (i) => TOP + 110 + i * 80;
  const PROMPT = 'PS C:\\Users\\anna\\uebung>';
  const COMMANDS = ['cp notizen.txt archiv', 'mv ideen.txt archiv'];
  const T = { x: 40, y: 370, w: 1520, h: 200 };

  const panel = (x, name) =>
    d.box(x, TOP, W, H, '', { border: d.colors().gray, rx: 14 }) + p.folder(x + 28, TOP + 24, name);

  figure('copy-and-move', {
    draw() {
      const c = d.colors();
      const lines = COMMANDS.map((cmd, i) => {
        const y = p.terminal.lineY(T.y, i);
        // the command starts one character after the prompt
        return d.g(`cmd-${i}`, d.label(T.x + 32, 0, PROMPT, { size: 32, mono: true, keepCase: true, color: c.gray, centerY: y }), d.label(T.x + 32 + p.codeWidth(`${PROMPT} `), 0, cmd, { size: 32, mono: true, keepCase: true, centerY: y }));
      });
      return d.svg(
        1600,
        580,
        panel(LEFT, 'uebung'),
        panel(RIGHT, 'archiv'),
        p.file(LEFT + 60, ROW(0), 'notizen.txt'),
        d.g('copy', p.file(LEFT + 60, ROW(0), 'notizen.txt')),
        d.g('ideas', p.file(LEFT + 60, ROW(1), 'ideen.txt')),
        p.terminal(T.x, T.y, T.w, T.h, { title: 'PowerShell' }),
        ...lines,
      );
    },
    animate(a) {
      a.step(a.show('cmd-0', { dur: 300 }), a.move('copy', SHIFT, 0, { dur: 1200 }));
      a.step(a.show('cmd-1', { dur: 300 }), a.move('ideas', SHIFT, 0, { dur: 1200 }));
    },
  });
})();
