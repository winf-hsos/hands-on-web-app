// The data behind the suggestions in R editors (client/complete.js): the
// functions and constants of r-functions.json, made by scripts/r-functions.R, and the
// columns of every data set an R block can use, with their type as R would
// read it, and those of the files pages mean by a table name (r_datasets), so
// that `survey` on the self-study pages offers the columns of the full survey.
// Written once per build as /assets/r-completions.json.
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

/** The columns of a CSV in media/datasets/ as [[column, type], …]. */
function columnsOf(knowledgeRoot, file) {
  const [header, ...rows] = parseCsv(readFileSync(join(knowledgeRoot, 'media', 'datasets', file), 'utf8'));
  return header.map((column, i) => [column, columnType(rows.map((r) => r[i] ?? ''))]);
}

/**
 * { functions: { base: [[name, signature, package], …], … }, constants: [[name, type and value, package or null], …],
 *   tables: { survey: [[column, type], …], … }, files: { 'mds12_schoko_milch.csv': [[column, type], …], … } }
 * `pageFiles` are the files named in r_datasets anywhere.
 */
export function rCompletions(knowledgeRoot, pageFiles = []) {
  const tables = Object.fromEntries(Object.entries(DATASETS).map(([name, file]) => [name, columnsOf(knowledgeRoot, file)]));
  const files = Object.fromEntries([...new Set(pageFiles)].map((file) => [file, columnsOf(knowledgeRoot, file)]));
  return { ...JSON.parse(readFileSync(FUNCTIONS, 'utf8')), tables, files };
}
