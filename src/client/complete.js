// Suggestions while typing in a code editor, R or Python: a list at the
// cursor, filled by `find` (r-complete.js and py-context.js decide what fits).
// The list opens after two letters, after `table$`, `package::` or a dot, or
// with Ctrl+Space; arrows choose, Enter or Tab takes, Esc closes. Nothing is
// ever inserted without being chosen.

/** Where the cursor is in the window, from a hidden copy of the text laid out like the editor. */
function caret(editor, mirror) {
  const style = getComputedStyle(editor);
  for (const p of ['font', 'letterSpacing', 'lineHeight', 'padding', 'border', 'boxSizing', 'whiteSpace', 'overflowWrap', 'tabSize', 'width']) mirror.style[p] = style[p];
  const marker = document.createElement('span');
  marker.textContent = '​';
  mirror.replaceChildren(editor.value.slice(0, editor.selectionStart), marker);
  // the rectangle as drawn, so it is right in focus mode too, where the box is zoomed
  const { left, bottom } = marker.getBoundingClientRect();
  return { left, top: bottom };
}

let count = 0;

/** `find(editor, force)` gives { start, end, items } or null; `prepare` runs on the first focus. */
export function attachCompletion(editor, labels, find, prepare = () => {}) {
  const id = `complete-${++count}`;
  const list = Object.assign(document.createElement('ul'), { id, className: 'complete', hidden: true });
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', labels.list);
  document.body.append(list);
  const mirror = Object.assign(document.createElement('div'), { className: 'complete-mirror' });
  mirror.setAttribute('aria-hidden', 'true');
  editor.parentElement.append(mirror);
  editor.setAttribute('aria-autocomplete', 'list');
  editor.setAttribute('aria-controls', id);
  editor.setAttribute('aria-expanded', 'false');

  let current = null; // { start, end, items }
  let active = 0;
  let taking = false; // inserting a choice, which must not open the list again

  const close = () => {
    current = null;
    list.hidden = true;
    editor.setAttribute('aria-expanded', 'false');
    editor.removeAttribute('aria-activedescendant');
  };

  const highlight = (index) => {
    active = index;
    [...list.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === index)));
    editor.setAttribute('aria-activedescendant', `${id}-${index}`);
    list.children[index]?.scrollIntoView({ block: 'nearest' });
  };

  async function open(force = false) {
    const found = await find(editor, force);
    if (!found || document.activeElement !== editor) return close();
    current = found;
    list.replaceChildren(
      ...current.items.map((item, i) => {
        const li = Object.assign(document.createElement('li'), { id: `${id}-${i}`, className: `complete-item kind-${item.kind}` });
        li.setAttribute('role', 'option');
        const name = Object.assign(document.createElement('span'), { className: 'complete-name', textContent: item.name });
        const detail = Object.assign(document.createElement('span'), { className: 'complete-detail', textContent: item.detail || labels[item.kind] });
        li.append(name, detail);
        // the package in braces, as RStudio and Positron show it
        if (item.pkg) li.append(Object.assign(document.createElement('span'), { className: 'complete-package', textContent: `{${item.pkg}}` }));
        li.addEventListener('pointerdown', (e) => {
          e.preventDefault(); // keep the focus in the editor
          take(i);
        });
        return li;
      }),
    );
    // In focus mode and on the stage of a presentation (present.js) only the
    // box is shown (in full screen nothing else is drawn), so the list goes
    // into it and takes on the zoom of the code.
    const home = editor.closest('.in-focus, .on-stage') ?? document.body;
    if (list.parentElement !== home) home.append(list);
    list.hidden = false;
    const zoom = list.currentCSSZoom ?? (parseFloat(getComputedStyle(list).zoom) || 1);
    const at = caret(editor, mirror);
    // a zoomed element's left and top are zoomed as well
    list.style.left = `${Math.max(8, Math.min(at.left, innerWidth - list.offsetWidth * zoom - 8)) / zoom}px`;
    list.style.top = `${(at.top + 4) / zoom}px`;
    editor.setAttribute('aria-expanded', 'true');
    highlight(0);
  }

  function take(index) {
    const item = current?.items[index];
    if (!item) return close();
    const { start, end } = current;
    close();
    taking = true;
    editor.focus();
    editor.setSelectionRange(start, end);
    const call = item.kind === 'function' || item.kind === 'method';
    const text = call ? `${item.name}()` : item.name;
    // execCommand keeps the browser's undo history; setRangeText is the fallback
    if (!document.execCommand?.('insertText', false, text)) {
      editor.setRangeText(text, start, end, 'end');
      editor.dispatchEvent(new Event('input'));
    }
    // a function gets its brackets, and the cursor goes between them
    if (call) editor.setSelectionRange(start + text.length - 1, start + text.length - 1);
    taking = false;
  }

  editor.addEventListener('focus', prepare, { once: true });
  editor.addEventListener('input', (e) => {
    if (taking) return;
    const typed = e.inputType === 'insertText' && /[A-Za-z0-9._$:]/.test(e.data ?? '');
    if (typed || (current && e.inputType?.startsWith('delete'))) open();
    else close();
  });
  // runs before the editor's own keys (indent, run, leave the field)
  editor.addEventListener(
    'keydown',
    (e) => {
      if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault();
        open(true);
        return;
      }
      if (!current) return;
      const keys = {
        ArrowDown: () => highlight((active + 1) % current.items.length),
        ArrowUp: () => highlight((active - 1 + current.items.length) % current.items.length),
        Enter: () => take(active),
        Tab: () => take(active),
        Escape: close,
      };
      if (!keys[e.key] || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key) && !/^[A-Za-z0-9._$:]$/.test(e.key) && e.key !== 'Backspace') close();
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      keys[e.key]();
    },
    { capture: true },
  );
  editor.addEventListener('blur', close);
  editor.addEventListener('click', close);
  // the page or, in focus mode, the box scrolls; the list scrolling itself does not count
  document.addEventListener('scroll', (e) => current && e.target !== list && close(), { capture: true, passive: true });
  addEventListener('resize', () => current && close());
}
