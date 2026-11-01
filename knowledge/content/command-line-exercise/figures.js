// Drawings of "Übung: Ein Ordner fürs Studium" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // The structure the exercise builds, below the home folder.
  const ROWS = [
    { name: '~', depth: 0, quiet: true },
    { name: 'studium', depth: 1 },
    { name: 'programmieren', depth: 2 },
    { name: 'notizen.txt', depth: 3, file: true },
    { name: 'uebung-1', depth: 3 },
    { name: 'hallo.py', depth: 4, file: true },
    { name: 'mathe', depth: 2 },
    { name: 'formeln.txt', depth: 3, file: true },
  ];

  figure('target', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      // the note sits well right of "~", centred on its row
      // the home folder in gray: where the exercise starts, not part of what it builds
      const rows = ROWS.map((r) => (r.quiet ? { ...r, color: c.gray } : r));
      return d.svg(1600, 540, p.tree(40, 20, rows), d.label(200, 0, t('dein Benutzerordner', 'your home folder'), { size: 32, color: c.gray, centerY: 44 }));
    },
  });
})();
