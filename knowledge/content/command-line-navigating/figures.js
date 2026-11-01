// Drawings of "Durch Ordner navigieren" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // Four cd commands, one per segment: each is typed, the yellow mark moves
  // to the folder it leads to, and the next prompt names that folder.
  const ROWS = [
    { name: 'anna', depth: 0 },
    { name: 'Desktop', depth: 1 },
    { name: 'Documents', depth: 1 },
    { name: 'uni', depth: 2 },
    { name: 'Downloads', depth: 1 },
  ];
  const X = 40, Y = 60;
  // the row the mark stands on before the first and after each command
  const AT = [0, 2, 3, 2, 0];
  const PROMPTS = ['PS C:\\Users\\anna>', 'PS C:\\Users\\anna\\Documents>', 'PS C:\\Users\\anna\\Documents\\uni>', 'PS C:\\Users\\anna\\Documents>', 'PS C:\\Users\\anna>'];
  const COMMANDS = ['cd Documents', 'cd uni', 'cd ..', 'cd ~'];
  // the mark, 300 wide: "Documents" one level in needs 56 + 24 + 9 characters of code type, 262
  const markCenter = (row) => [X + ROWS[row].depth * 72 - 14 + 150, Y + row * 64 + 24];
  // terminal 956 wide: the longest line, "PS C:\Users\anna\Documents\uni> cd ..", is 37 characters, 748, plus 64
  const T = { x: 640, y: 20, w: 956, h: 380 };

  figure('cd-moves', {
    draw() {
      const c = d.colors();
      const [mx, my] = markCenter(AT[0]);
      const mark = `<rect x="${mx - 150}" y="${my - 34}" width="300" height="68" rx="10" fill="${c.yellow}" fill-opacity="0.2" stroke="${c.yellow}" stroke-width="3"/>`;
      const lines = PROMPTS.map((prompt, i) => {
        const y = p.terminal.lineY(T.y, i);
        const s = [d.g(`prompt-${i}`, d.label(T.x + 32, 0, prompt, { size: 32, mono: true, keepCase: true, color: c.gray, centerY: y }))];
        if (COMMANDS[i]) s.push(d.g(`cmd-${i}`, d.label(T.x + 32 + p.codeWidth(`${prompt} `), 0, COMMANDS[i], { size: 32, mono: true, keepCase: true, centerY: y })));
        return s.join('');
      });
      return d.svg(1600, 400, d.g('here', mark), p.tree(X, Y, ROWS), p.terminal(T.x, T.y, T.w, T.h, { title: 'PowerShell' }), ...lines);
    },
    animate(a) {
      COMMANDS.forEach((_, i) => {
        a.step(a.show(`cmd-${i}`, { dur: 300 }), a.moveTo('here', ...markCenter(AT[i + 1]), { dur: 700 }), a.show(`prompt-${i + 1}`, { dur: 300 }));
      });
    },
  });
})();
