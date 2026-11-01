// Drawings of "Virtuelle Python-Umgebungen" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // The Python of the computer on its own, and two projects, each with its
  // own .venv holding a different version of the same package.
  const TOP = 20, H = 440;
  const project = (x, name, version) => {
    const c = d.colors();
    // inner tree: "requests 2.32" one level in needs 40 + 72 + 80 + 13 characters (263) of the 480
    const rows = [
      { name: '.venv', depth: 0 },
      { name: 'python', depth: 1, file: true },
      { name: `requests ${version}`, depth: 1, file: true, color: c.blue },
      { name: 'main.py', depth: 0, file: true },
    ];
    return d.box(x, TOP, 480, H, '', { border: c.gray, rx: 14 }) + p.folder(x + 28, TOP + 24, name) + p.tree(x + 40, TOP + 120, rows);
  };

  figure('two-environments', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      return d.svg(
        1600,
        480,
        d.box(40, TOP, 440, H, '', { border: c.gray, rx: 14 }),
        d.label(260, 0, t('auf dem Rechner', 'on the computer'), { size: 32, anchor: 'middle', color: c.gray, centerY: TOP + 48 }),
        // "Python 3.13" is 11 characters, 334 wide at 48 units, in a box of 440
        d.label(260, 0, 'Python 3.13', { size: 48, mono: true, keepCase: true, anchor: 'middle', centerY: TOP + H / 2 }),
        d.label(260, 0, t('ohne zusätzliche\nPakete', 'without extra\npackages'), { size: 32, anchor: 'middle', color: c.gray, centerY: TOP + H / 2 + 100 }),
        project(560, 'projekt-a', '2.32'),
        project(1080, 'projekt-b', '2.28'),
      );
    },
  });
})();
