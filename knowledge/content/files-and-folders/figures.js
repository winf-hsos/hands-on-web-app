// Drawings of "Dateien und Ordner" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // The tree from C:\ to notizen.txt with the folders of the path lit, and
  // the path written out below, as on Windows and on a Mac.
  const ROWS = [
    { name: 'C:\\', depth: 0, on: 0 },
    { name: 'Users', depth: 1, on: 1 },
    { name: 'anna', depth: 2, on: 2 },
    { name: 'Desktop', depth: 3 },
    { name: 'Documents', depth: 3, on: 3 },
    { name: 'uni', depth: 4, on: 4 },
    { name: 'notizen.txt', depth: 5, file: true, on: 5 },
    { name: 'Downloads', depth: 3 },
  ];
  const X = 40, Y = 20, PATH_X = 260;

  figure('folder-tree', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      // each folder on the path once more on top, in yellow, at its place in the tree (64 per row, 72 per level)
      const lit = ROWS.map((r, i) => r.on === undefined ? '' : (r.file ? p.file : p.folder)(X + r.depth * 72, Y + i * 64, r.name, { active: true }));
      return d.svg(
        1600,
        710,
        p.tree(X, Y, ROWS),
        ...lit,
        // "C:\" is 3 characters of code type at 32 units, so the note starts well clear of it
        d.label(260, 0, t('auf dem Mac heißt die Wurzel /', 'on a Mac the root is /'), { size: 32, color: c.gray, centerY: Y + 24 }),
        // the path in code type, 48 units: "C:\Users\anna\Documents\uni\notizen.txt" is 38 characters, 1153 from 260
        d.label(X, 0, 'Windows', { size: 32, color: c.gray, centerY: 610 }),
        d.label(PATH_X, 0, 'C:\\Users\\anna\\Documents\\uni\\notizen.txt', { size: 48, mono: true, keepCase: true, color: c.yellow, centerY: 610 }),
        d.label(X, 0, 'Mac', { size: 32, color: c.gray, centerY: 680 }),
        d.label(PATH_X, 0, '/Users/anna/Documents/uni/notizen.txt', { size: 32, mono: true, keepCase: true, color: c.gray, centerY: 680 }),
      );
    },
  });
})();
