/* Drawings for content pages (docs/figures.md): the registry an item's
 * figures.js writes into, and parts that recur across items, built from
 * stagekit's draw.js in the same colours and sizes. A classic script like
 * draw.js, so that a stagekit deck can load the same files in the same
 * order: draw.js, anim.js, figure-parts.js, then the item's figures.js.
 *
 *   figure(name, { draw(lang), animate(a, lang) })   register a drawing
 *   figureParts.say(lang)                  t('Ordner', 'Folder') picks the language
 *   figureParts.folder(x, y, name, o)      folder symbol with its name; o: active, dim
 *   figureParts.file(x, y, name, o)        file symbol with its name; o: active, dim
 *   figureParts.tree(x, y, rows, o)        a folder tree; rows: { name, depth, file, active, dim }
 *   figureParts.terminal(x, y, w, h, o)    a terminal window; o: title, lines, size
 *   figureParts.codeWidth(text, size)      width of a text in code type
 *
 * Coordinates are units of the drawing, 1600 wide (docs/figures.md). */
(function () {
  'use strict';
  const d = window.draw;
  if (!d) throw new Error('figure-parts: load stagekit draw.js first');
  window.figures = window.figures || {};
  window.figure = (name, spec) => {
    window.figures[name] = spec;
  };

  const say = (lang) => (de, en) => (lang === 'en' ? en : de);
  // Code type on the page (Atkinson Hyperlegible Mono) is 0.632 of its size
  // per character, wider than stagekit's Roboto Mono (0.6): counted with it,
  // what fits on the page also fits on a slide. SVG joins runs of spaces, so
  // a text in a drawing has single spaces only.
  const MONO = 0.632;
  const codeWidth = (text, size = 32) => String(text).length * size * MONO;
  const tone = (o, c) => (o.active ? c.yellow : o.dim ? c.dark : o.color || c.white);

  // a folder 56 x 44 with its tab, the name 24 to the right, centred on it
  function folder(x, y, name, o = {}) {
    const c = d.colors();
    const col = tone(o, c);
    const shape =
      `<path d="M${x + 2},${y + 8} q0,-6 6,-6 h14 l6,6 h22 q6,0 6,6 v24 q0,6 -6,6 h-42 q-6,0 -6,-6 z" ` +
      `fill="${o.active ? c.yellow : c.bg}" fill-opacity="${o.active ? 0.25 : 1}" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`;
    return shape + (name ? d.label(x + 80, 0, name, { size: o.size || 32, color: col, mono: true, keepCase: true, centerY: y + 24 }) : '');
  }

  // a sheet 40 x 50 with a folded corner, the name to the right
  function file(x, y, name, o = {}) {
    const c = d.colors();
    const col = tone(o, c);
    const shape =
      `<path d="M${x + 10},${y + 2} h20 l12,12 v34 q0,2 -2,2 h-30 q-2,0 -2,-2 v-44 q0,-2 2,-2 z M${x + 30},${y + 2} v12 h12" ` +
      `fill="${o.active ? c.yellow : c.bg}" fill-opacity="${o.active ? 0.25 : 1}" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`;
    return shape + (name ? d.label(x + 80, 0, name, { size: o.size || 32, color: col, mono: true, keepCase: true, centerY: y + 26 }) : '');
  }

  // A folder tree, one row per entry, 64 apart and 72 in per level. The lines
  // come first, so that the symbols cover their ends (stagekit: d.layers).
  function tree(x, y, rows, o = {}) {
    const c = d.colors();
    const step = o.step || 64, indent = o.indent || 72;
    const lines = [], symbols = [];
    rows.forEach((r, i) => {
      const top = y + i * step, left = x + r.depth * indent;
      if (r.depth > 0) {
        // up to the nearest row above that is one level higher: the parent
        let p = i - 1;
        while (p >= 0 && rows[p].depth >= r.depth) p -= 1;
        const px = x + (r.depth - 1) * indent + 28, py = y + p * step + 46;
        lines.push(d.line(px, py, px, top + 24, { color: c.gray, width: 2 }), d.line(px, top + 24, left - 6, top + 24, { color: c.gray, width: 2 }));
      }
      const draw = r.file ? file : folder;
      symbols.push(o.group ? d.g(o.group(r, i), draw(left, top, r.name, r)) : draw(left, top, r.name, r));
    });
    return d.layers(lines, symbols).join('');
  }
  tree.height = (n, step = 64) => n * step;

  // A terminal window: a title bar and lines in code type. A line is a text,
  // or { prompt, text, color } where the prompt stands gray before the text.
  function terminal(x, y, w, h, o = {}) {
    const c = d.colors();
    const size = o.size || 32, lh = Math.round(size * 1.6), bar = 56;
    const parts = [
      // frame inset by half its stroke (stagekit: nothing runs over its place)
      `<rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="14" fill="${c.bg}" stroke="${c.gray}" stroke-width="3"/>`,
      d.line(x + 1.5, y + bar, x + w - 1.5, y + bar, { color: c.gray, width: 2 }),
      d.label(x + 32, 0, o.title || '', { size: 32, color: c.gray, centerY: y + bar / 2 }),
    ];
    (o.lines || []).forEach((line, i) => {
      const l = typeof line === 'string' ? { text: line } : line;
      const base = y + bar + 36 + size * 0.35 + i * lh;
      const prompt = l.prompt ? l.prompt + ' ' : '';
      if (prompt) parts.push(d.label(x + 32, base, prompt, { size, mono: true, keepCase: true, color: c.gray }));
      parts.push(d.label(x + 32 + codeWidth(prompt, size), base, l.text || '', { size, mono: true, keepCase: true, color: l.color || c.white }));
    });
    return parts.join('');
  }
  // where line i of a terminal at y stands, for labels next to it
  terminal.lineY = (y, i, size = 32) => y + 56 + 36 + i * Math.round(size * 1.6);

  window.figureParts = { say, codeWidth, folder, file, tree, terminal };
})();
