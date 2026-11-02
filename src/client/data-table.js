// A table to record observations in, which starts empty: buttons add a column
// for each variable and a row for each observation, every column has a name
// and, if wanted, an R data type, and every cell can be edited. A cell that
// does not fit the type of its column is marked but kept. The table can be
// saved as CSV or as RDS, an R data.frame written in the browser
// (client/data-table-model.js), and below the buttons stands the R code that
// reads both files. The table is kept in this browser until "Start over".
//
// Written with ```data-table in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-data-table-labels on <body>).
import { addCopyButton } from './copy.js';
import { keys } from './demo-frame.js';
import { highlight } from './highlight.js';
import { ABBREVIATIONS, TYPES, columnType, exportNames, fits, gzip, isSnakeCase, isSyntactic, levels, readCode, suggestName, toCsv, toRds } from './data-table-model.js';

const L = JSON.parse(document.body.dataset.dataTableLabels ?? '{}');
const KEY = 'hocs-data-table';

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const icon = (path) => `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const PLUS = icon('<path d="M12 5v14M5 12h14"/>');
const CROSS = icon('<path d="M6 6l12 12M18 6 6 18"/>');
const SAVE = icon('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>');

const empty = () => ({ columns: [], rows: [] });

function stored() {
  try {
    const table = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    const ok = table && Array.isArray(table.columns) && Array.isArray(table.rows);
    return ok ? { columns: table.columns.map((c) => ({ name: String(c.name ?? ''), type: TYPES.includes(c.type) ? c.type : '' })), rows: table.rows.map((r) => table.columns.map((_, i) => String(r?.[i] ?? ''))) } : empty();
  } catch {
    return empty();
  }
}

function store(table) {
  try {
    localStorage.setItem(KEY, JSON.stringify(table));
  } catch {
    // private window or storage switched off: the table lasts until reload
  }
}

function download(bytes, name, type) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function setup(box) {
  let table = stored();

  box.innerHTML = `
    <div class="dt-tools">
      <button type="button" class="button" data-act="column">${PLUS}${L.addColumn}</button>
      <button type="button" class="button button-quiet" data-act="row">${PLUS}${L.addRow}</button>
      <span class="dt-size" aria-live="polite"></span>
      <button type="button" class="dt-link" data-act="reset">${L.reset}</button>
    </div>
    <p class="dt-empty"></p>
    <div class="dt-scroll"><table class="dt-table"><thead></thead><tbody></tbody></table></div>
    <p class="dt-misfits" aria-live="polite"></p>
    <div class="dt-export">
      <button type="button" class="button" data-act="csv">${SAVE}${L.saveCsv}</button>
      <button type="button" class="button" data-act="rds">${SAVE}${L.saveRds}</button>
    </div>
    <p class="dt-code-head">${L.codeHead}</p>
    <div class="code-block"><pre class="code"><code class="language-r"></code></pre></div>`;
  const act = (name) => box.querySelector(`[data-act="${name}"]`);
  const head = box.querySelector('thead');
  const body = box.querySelector('tbody');
  const scroll = box.querySelector('.dt-scroll');
  const code = box.querySelector('code');
  let codeText = '';
  addCopyButton(box.querySelector('.code-block'), () => codeText);

  const label = (c) => table.columns[c].name.trim() || exportNames(table)[c];
  const cell = (r, c) => body.querySelector(`[data-row="${r}"][data-col="${c}"]`);
  const nameInput = (c) => head.querySelector(`.dt-name[data-col="${c}"]`);

  function save() {
    store(table);
    update();
  }

  // --- building the table (after a column or row comes or goes) ---------------

  function render() {
    const typeOptions = (type) =>
      [`<option value=""${type ? '' : ' selected'}>${L.auto}</option>`, ...TYPES.map((t) => `<option value="${t}"${t === type ? ' selected' : ''}>${t} · ${L.types[t]}</option>`)].join('');
    head.innerHTML = table.columns.length
      ? `<tr><th scope="col" class="dt-corner"><span class="visually-hidden">${L.rowHead}</span>#</th>${table.columns
          .map(
            (col, c) => `<th scope="col" class="dt-col">
              <div class="dt-head">
                <input type="text" class="dt-name" data-col="${c}" value="${esc(col.name)}" placeholder="${esc(L.namePlaceholder)}" aria-label="${esc(fill(L.nameLabel, { c: c + 1 }))}" autocomplete="off" spellcheck="false">
                <button type="button" class="dt-delete" data-delete-col="${c}">${CROSS}</button>
              </div>
              <div class="dt-type-line">
                <select class="dt-type" data-col="${c}" aria-label="${esc(fill(L.typeLabel, { c: c + 1 }))}">${typeOptions(col.type)}</select>
                <span class="dt-abbr" data-col="${c}"></span>
              </div>
              <div class="dt-note" data-col="${c}" hidden></div>
              <div class="dt-levels" data-col="${c}" hidden></div>
            </th>`,
          )
          .join('')}</tr>`
      : '';
    body.innerHTML = table.rows
      .map(
        (row, r) => `<tr><th scope="row" class="dt-rowhead"><span class="dt-index">${r + 1}</span><button type="button" class="dt-delete" data-delete-row="${r}" aria-label="${esc(fill(L.deleteRow, { r: r + 1 }))}" title="${esc(fill(L.deleteRow, { r: r + 1 }))}">${CROSS}</button></th>${table.columns
          .map((_, c) => `<td><input type="text" class="dt-cell" data-row="${r}" data-col="${c}" value="${esc(row[c] ?? '')}" autocomplete="off" spellcheck="false"></td>`)
          .join('')}</tr>`,
      )
      .join('');
    scroll.hidden = table.columns.length === 0;
    update();
  }

  // --- what follows from the values (on every keystroke) -----------------------

  function update() {
    const names = table.columns.map((col) => col.name.trim());
    const types = table.columns.map((_, c) => columnType(table, c));
    let misfits = 0;
    table.columns.forEach((col, c) => {
      const name = label(c);
      const del = head.querySelector(`[data-delete-col="${c}"]`);
      del.setAttribute('aria-label', fill(L.deleteColumn, { name }));
      del.title = fill(L.deleteColumn, { name });
      const abbr = head.querySelector(`.dt-abbr[data-col="${c}"]`);
      abbr.textContent = `<${ABBREVIATIONS[types[c]]}>`;
      abbr.classList.toggle('is-inferred', !col.type);
      abbr.title = col.type ? L.chosen : L.inferred;

      // the name: missing, twice, not an R name, or not in the usual style
      const own = names[c];
      const suggestion = suggestName(own);
      const note = head.querySelector(`.dt-note[data-col="${c}"]`);
      let text = '';
      let warn = false;
      let offer = '';
      if (!own) text = fill(L.noName, { name });
      else if (names.some((n, i) => i !== c && n === own)) [text, warn] = [L.duplicate, true];
      else if (!isSyntactic(own)) [text, warn, offer] = [fill(L.invalidName, { name: suggestion || '…' }), true, suggestion];
      else if (!isSnakeCase(own) && suggestion && suggestion !== own) [text, offer] = [fill(L.styleName, { name: suggestion }), suggestion];
      note.hidden = !text;
      note.classList.toggle('is-warn', warn);
      note.innerHTML = text && `<span>${esc(text)}</span>${offer ? ` <button type="button" class="dt-link" data-suggest="${c}" data-name="${esc(offer)}">${L.useSuggestion}</button>` : ''}`;
      nameInput(c).classList.toggle('is-warn', warn);

      const lv = types[c] === 'factor' ? levels(table.rows.map((row) => row[c] ?? '')) : [];
      const levelsBox = head.querySelector(`.dt-levels[data-col="${c}"]`);
      levelsBox.hidden = lv.length === 0;
      levelsBox.textContent = lv.length ? fill(L.levels, { levels: lv.join(', ') }) : '';

      table.rows.forEach((row, r) => {
        const input = cell(r, c);
        const ok = fits(row[c] ?? '', col.type);
        if (!ok) misfits++;
        input.classList.toggle('is-misfit', !ok);
        input.setAttribute('aria-invalid', String(!ok));
        input.title = ok ? '' : fill(L.misfit, { type: col.type });
        input.setAttribute('aria-label', fill(L.cellLabel, { r: r + 1, name }));
      });
    });

    const nc = table.columns.length;
    const nr = table.rows.length;
    box.querySelector('.dt-size').textContent = `${nc === 1 ? L.variable : fill(L.variables, { n: nc })} · ${nr === 1 ? L.observation : fill(L.observations, { n: nr })}`;
    const hint = box.querySelector('.dt-empty');
    hint.textContent = nc === 0 ? L.noColumns : nr === 0 ? L.noRows : '';
    hint.hidden = !hint.textContent;
    const summary = box.querySelector('.dt-misfits');
    summary.textContent = misfits === 0 ? '' : misfits === 1 ? L.misfitCount : fill(L.misfitCounts, { n: misfits });
    summary.hidden = misfits === 0;
    act('row').disabled = nc === 0;
    act('csv').disabled = nc === 0;
    act('rds').disabled = nc === 0;
    codeText = readCode(table, L);
    code.innerHTML = highlight(codeText, 'r');
  }

  // --- changes -----------------------------------------------------------------

  function addColumn() {
    table.columns.push({ name: '', type: '' });
    for (const row of table.rows) row.push('');
    store(table);
    render();
    nameInput(table.columns.length - 1).focus();
  }

  function addRow() {
    if (!table.columns.length) return;
    table.rows.push(table.columns.map(() => ''));
    store(table);
    render();
    cell(table.rows.length - 1, 0).focus();
  }

  box.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('.dt-name')) table.columns[Number(t.dataset.col)].name = t.value;
    else if (t.matches('.dt-cell')) table.rows[Number(t.dataset.row)][Number(t.dataset.col)] = t.value;
    else return;
    save();
  });

  box.addEventListener('change', (e) => {
    if (!e.target.matches('.dt-type')) return;
    table.columns[Number(e.target.dataset.col)].type = e.target.value;
    save();
  });

  box.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t || !box.contains(t)) return;
    if (t.dataset.deleteCol !== undefined) {
      const c = Number(t.dataset.deleteCol);
      table.columns.splice(c, 1);
      for (const row of table.rows) row.splice(c, 1);
      store(table);
      render();
      (nameInput(Math.min(c, table.columns.length - 1)) ?? act('column')).focus();
    } else if (t.dataset.deleteRow !== undefined) {
      const r = Number(t.dataset.deleteRow);
      table.rows.splice(r, 1);
      store(table);
      render();
      (body.querySelector(`[data-delete-row="${Math.min(r, table.rows.length - 1)}"]`) ?? act('row')).focus();
    } else if (t.dataset.suggest !== undefined) {
      const c = Number(t.dataset.suggest);
      table.columns[c].name = t.dataset.name;
      nameInput(c).value = t.dataset.name;
      save();
      nameInput(c).focus();
    }
  });

  // Enter and the arrows move between rows like in a spreadsheet; Enter in the
  // last row adds one, so that a game after the other can be typed in.
  box.addEventListener('keydown', (e) => {
    const t = e.target;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (t.matches('.dt-name') && (e.key === 'Enter' || e.key === 'ArrowDown')) {
      const below = cell(0, Number(t.dataset.col));
      if (below) below.focus();
      e.preventDefault();
      return;
    }
    if (!t.matches('.dt-cell')) return;
    const r = Number(t.dataset.row);
    const c = Number(t.dataset.col);
    let target = null;
    if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'ArrowDown') {
      if (r === table.rows.length - 1 && e.key === 'Enter') {
        addRow();
        cell(r + 1, c).focus();
      } else target = cell(r + 1, c);
    } else if ((e.key === 'Enter' && e.shiftKey) || e.key === 'ArrowUp') target = cell(r - 1, c) ?? nameInput(c);
    else return;
    e.preventDefault();
    target?.focus();
  });

  act('column').addEventListener('click', addColumn);
  act('row').addEventListener('click', addRow);
  act('reset').addEventListener('click', () => {
    const filled = table.columns.length > 0;
    if (filled && !window.confirm(L.confirmReset)) return;
    table = empty();
    store(table);
    render();
    act('column').focus();
  });
  act('csv').addEventListener('click', () => download(toCsv(table), `${L.file}.csv`, 'text/csv;charset=utf-8'));
  act('rds').addEventListener('click', async () => download(await gzip(toRds(table)), `${L.file}.rds`, 'application/octet-stream'));

  keys(
    box,
    [
      [L.columnKey, L.keyColumn],
      [L.rowKey, L.keyRow],
      ['Enter', L.keyEnter],
      ['↑ / ↓', L.keyUpDown],
    ],
    (key) => {
      if (key.toUpperCase() === L.columnKey) addColumn();
      else if (key.toUpperCase() === L.rowKey && table.columns.length) addRow();
      else return false;
      return true;
    },
  );

  render();
}

for (const box of document.querySelectorAll('[data-data-table]')) setup(box);
