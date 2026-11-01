// Result tables to fill in (build/remark-knowledge.mjs): what a learner types
// stays in this browser, per page and table, until the table is cleared.
// Enter moves to the field below, as in a spreadsheet. A focus button shows
// the table alone and enlarged, to fill it in together on a projector.
import { savedOnPage } from './saved.js';
import { focusable } from './focus.js';

const saved = savedOnPage('hocs-tables');

for (const table of document.querySelectorAll('table[data-fillable]')) {
  const id = table.dataset.fillable;
  const inputs = [...table.querySelectorAll('input[data-cell]')];
  const stored = saved.get(id) ?? {};
  for (const input of inputs) input.value = stored[input.dataset.cell] ?? '';

  const clear = Object.assign(document.createElement('button'), { type: 'button', className: 'button button-quiet table-clear', textContent: table.dataset.clear });
  const update = () => {
    const values = Object.fromEntries(inputs.filter((i) => i.value.trim()).map((i) => [i.dataset.cell, i.value]));
    if (Object.keys(values).length) saved.set(id, values);
    else saved.remove(id);
    clear.hidden = !Object.keys(values).length;
  };
  clear.hidden = !Object.keys(stored).length;
  const tools = Object.assign(document.createElement('div'), { className: 'table-tools' });
  const box = Object.assign(document.createElement('div'), { className: 'table-box' });
  table.replaceWith(box);
  box.append(table, tools);
  tools.append(clear);
  // the columns fill the screen, not the empty width of the text beside them
  focusable(box, tools, { width: () => table.querySelector('tr').getBoundingClientRect().width });

  table.addEventListener('input', update);
  table.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !e.target.matches('input[data-cell]')) return;
    e.preventDefault();
    const [row, col] = e.target.dataset.cell.split('-').map(Number);
    const below = inputs.find((i) => { const [r, c] = i.dataset.cell.split('-').map(Number); return c === col && r > row; });
    (below ?? inputs[inputs.indexOf(e.target) + 1])?.focus();
  });
  clear.addEventListener('click', () => {
    if (!confirm(table.dataset.confirm)) return;
    for (const input of inputs) input.value = '';
    update();
    inputs[0]?.focus();
  });
}
