// Drawings of "Die Kommandozeile" (docs/figures.md).
(function () {
  const d = window.draw;
  const p = window.figureParts;

  // PowerShell and the Mac Terminal side by side with the same command, and
  // below it the line from PowerShell taken apart into its three parts.
  figure('anatomy', {
    draw(lang) {
      const t = p.say(lang);
      const c = d.colors();
      // windows 772 wide: the longest line, "PS C:\Users\anna> ls Documents",
      // is 30 characters, 607 at 32 units, plus 32 on each side
      const win = p.terminal(4, 4, 772, 260, {
        title: 'PowerShell (Windows)',
        lines: [{ prompt: 'PS C:\\Users\\anna>', text: 'ls Documents' }, { text: 'd---- uni', color: c.gray }, { text: '-a--- lebenslauf.pdf', color: c.gray }],
      });
      const mac = p.terminal(824, 4, 772, 260, {
        title: 'Terminal (Mac)',
        lines: [{ prompt: 'anna@MacBook ~ %', text: 'ls Documents' }, { text: 'lebenslauf.pdf uni', color: c.gray }],
      });
      // the parts in code type, 48 units, 20 on each side; "ls" gets 140 so the box is not a sliver
      const parts = [
        { text: 'PS C:\\Users\\anna>', name: t('Prompt', 'Prompt'), note: t('wo du gerade bist', 'where you are') },
        { text: 'ls', name: t('Befehl', 'Command'), note: t('was geschehen soll', 'what to do') },
        { text: 'Documents', name: t('Argument', 'Argument'), note: t('womit', 'what to do it with') },
      ].map((part) => ({ ...part, w: Math.max(140, Math.ceil(p.codeWidth(part.text, 48)) + 40) }));
      let x = (1600 - parts.reduce((sum, part) => sum + part.w, 0) - 2 * 40) / 2;
      const row = parts.map((part) => {
        const s =
          d.box(x, 330, part.w, 90, part.text, { size: 48, mono: true, keepCase: true, border: part.name === parts[1].name ? c.blue : c.gray }) +
          d.label(x + part.w / 2, 0, part.name, { size: 32, anchor: 'middle', centerY: 470 }) +
          d.label(x + part.w / 2, 0, part.note, { size: 32, anchor: 'middle', color: c.gray, centerY: 518 });
        x += part.w + 40;
        return s;
      });
      return d.svg(1600, 550, win, mac, ...row);
    },
  });
})();
