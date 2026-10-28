// The data behind the suggestions in R editors (client/r-complete.js): the
// functions of r-functions.json, made by scripts/r-functions.R, and the
// columns of every data set an R block can use, with their type as R would
// read it. Written once per build as /assets/r-completions.json.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATASETS } from '../client/r-datasets.js';

const FUNCTIONS = new URL('./r-functions.json', import.meta.url);

/** Splits CSV text into rows of fields; quoted fields may hold commas, quotes and line breaks. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

/** The type R's read.csv() gives a column: lgl, int, dbl or chr; empty fields are missing values. */
function columnType(values) {
  const present = values.filter((v) => v !== '' && v !== 'NA');
  if (present.length && present.every((v) => v === 'TRUE' || v === 'FALSE')) return 'lgl';
  if (present.every((v) => /^-?\d+$/.test(v) && Math.abs(Number(v)) <= 2147483647)) return 'int';
  if (present.every((v) => v !== '' && !Number.isNaN(Number(v)))) return 'dbl';
  return 'chr';
}

/** { functions: { base: [[name, signature], …], … }, tables: { survey: [[column, type], …], … } } */
export function rCompletions(knowledgeRoot) {
  const tables = {};
  for (const [name, file] of Object.entries(DATASETS)) {
    const [header, ...rows] = parseCsv(readFileSync(join(knowledgeRoot, 'media', 'datasets', file), 'utf8'));
    tables[name] = header.map((column, i) => [column, columnType(rows.map((r) => r[i] ?? ''))]);
  }
  return { functions: JSON.parse(readFileSync(FUNCTIONS, 'utf8')), tables };
}
