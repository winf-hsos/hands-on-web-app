// The data of the table demonstrator (client/data-table.js) without the page:
// what a cell means under the type of its column, the type R would infer for
// a column without one, R names, and the two exports, CSV and RDS.
//
// A table is { columns: [{ name, type }], rows: [[text, …], …] }, with one
// text per column in every row. The types are R's: character, double,
// integer, logical, factor; '' means "automatic" and is inferred from the
// cells the way read.csv() infers it. An empty cell or the text NA is missing.
//
// RDS is R's serialization format, written here byte for byte so that no R
// has to be loaded in the browser: format version 3, big-endian (XDR), the
// strings in UTF-8. readRDS() reads it as it is or gzip-compressed (gzip()).
// Tested by tests/data-table-model.test.mjs; readRDS() in R 4.5 reads what
// toRds() writes, with all five types, NA and the levels of factors.

export const TYPES = ['character', 'double', 'integer', 'logical', 'factor'];

/** The type labels of tibble printing. */
export const ABBREVIATIONS = { character: 'chr', double: 'dbl', integer: 'int', logical: 'lgl', factor: 'fct' };

const TRUE_TEXT = new Set(['TRUE', 'T', 'True', 'true']);
const FALSE_TEXT = new Set(['FALSE', 'F', 'False', 'false']);
const INTEGER = /^[+-]?\d+$/;
const DOUBLE = /^[+-]?(\d+([.,]\d*)?|[.,]\d+)([eE][+-]?\d+)?$/;
const INT_MAX = 2147483647; // -2147483648 is NA_integer_ in R

export const isMissing = (text) => text == null || text.trim() === '' || text.trim() === 'NA';

/** The value of a non-missing text under a type, or undefined when it does not fit. */
export function parse(text, type) {
  const s = text.trim();
  switch (type) {
    case 'logical':
      return TRUE_TEXT.has(s) ? true : FALSE_TEXT.has(s) ? false : undefined;
    case 'integer':
      return INTEGER.test(s) && Math.abs(Number(s)) <= INT_MAX ? Number(s) : undefined;
    case 'double':
      return DOUBLE.test(s) ? Number(s.replace(',', '.')) : undefined;
    default:
      return s;
  }
}

/** Whether a cell fits the type of its column; a missing cell always fits. */
export const fits = (text, type) => !type || isMissing(text) || parse(text, type) !== undefined;

/** The type of a column without one, as read.csv() would infer it; logical when all are missing. */
export function inferType(texts) {
  const present = texts.filter((t) => !isMissing(t));
  for (const type of ['logical', 'integer', 'double']) {
    if (present.every((t) => parse(t, type) !== undefined)) return type;
  }
  return 'character';
}

/** The type a column has in R: the chosen one, or the inferred one. */
export const columnType = (table, c) => table.columns[c].type || inferType(table.rows.map((row) => row[c] ?? ''));

/** The levels of a factor: its values in the order they first appear. */
export function levels(texts) {
  const seen = new Set();
  for (const t of texts) if (!isMissing(t)) seen.add(t.trim());
  return [...seen];
}

// --- names --------------------------------------------------------------------

const RESERVED = new Set(['if', 'else', 'repeat', 'while', 'function', 'for', 'next', 'break', 'in', 'TRUE', 'FALSE', 'NULL', 'Inf', 'NaN', 'NA', 'NA_integer_', 'NA_real_', 'NA_character_', 'NA_complex_']);

/** Whether R accepts the name without backticks (make.names() would keep it). */
export const isSyntactic = (name) => /^(?:[A-Za-z]|\.(?![0-9]))[A-Za-z0-9._]*$|^\.$/.test(name) && !RESERVED.has(name) && !/^\.\.(\.|\d+$)/.test(name);

/** Whether the name follows the usual style: lower case letters, digits and underscores. */
export const isSnakeCase = (name) => /^[a-z][a-z0-9_]*$/.test(name) && !RESERVED.has(name);

/** A name in the usual style made from any text: "Tür gewählt" becomes tuer_gewaehlt. */
export function suggestName(text) {
  const name = text
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!name) return '';
  const start = /^[0-9]/.test(name) ? `x${name}` : name;
  return RESERVED.has(start) ? `${start}_` : start;
}

/** The names of the columns as they are written; an empty one becomes V1, V2, … as in R. */
export const exportNames = (table) => table.columns.map((col, c) => col.name.trim() || `V${c + 1}`);

// --- CSV ----------------------------------------------------------------------

const quote = (field) => (/[",\r\n]|^\s|\s$/.test(field) ? `"${field.replace(/"/g, '""')}"` : field);

/** How a cell is written to CSV: numbers with a decimal point, missing cells as an empty field. */
function csvField(text, type) {
  if (isMissing(text)) return '';
  const s = text.trim();
  if ((type === 'double' || type === 'integer') && parse(s, type) !== undefined) return s.replace(',', '.').replace(/^\+/, '');
  if (type === 'logical' && parse(s, type) !== undefined) return parse(s, type) ? 'TRUE' : 'FALSE';
  return s;
}

/** The table as CSV after RFC 4180: comma, double quotes, CRLF, a header row with the names. */
export function toCsv(table) {
  const types = table.columns.map((_, c) => columnType(table, c));
  const lines = [exportNames(table).map(quote).join(',')];
  for (const row of table.rows) lines.push(types.map((type, c) => quote(csvField(row[c] ?? '', type))).join(','));
  return lines.join('\r\n') + '\r\n';
}

// --- R code -------------------------------------------------------------------

const rString = (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/**
 * The R code that reads both files into `object`: read.csv(), then factor()
 * for every factor column, since a CSV file only holds text, and readRDS().
 * Names R does not accept as they are keep them with check.names = FALSE and
 * stand in backticks.
 */
export function readCode(table, { file, object, commentCsv, commentFactor, commentRds }) {
  const names = exportNames(table);
  const plain = names.every(isSyntactic);
  const ref = (name) => `${object}$${isSyntactic(name) ? name : `\`${name.replace(/`/g, '\\`')}\``}`;
  const factors = table.columns
    .map((_, c) => c)
    .filter((c) => columnType(table, c) === 'factor')
    .map((c) => {
      const lv = levels(table.rows.map((row) => row[c] ?? ''));
      return `${ref(names[c])} <- factor(${ref(names[c])}, levels = c(${lv.map(rString).join(', ')}))`;
    });
  return [
    `# ${commentCsv}`,
    `${object} <- read.csv("${file}.csv"${plain ? '' : ', check.names = FALSE'})`,
    ...(factors.length ? [`# ${commentFactor}`, ...factors] : []),
    `str(${object})`,
    '',
    `# ${commentRds}`,
    `${object} <- readRDS("${file}.rds")`,
    `str(${object})`,
  ].join('\n');
}

// --- RDS ----------------------------------------------------------------------

// SEXP types and flag bits of serialize.c in R
const NILVALUE = 254;
const SYMSXP = 1;
const LISTSXP = 2;
const CHARSXP = 9;
const LGLSXP = 10;
const INTSXP = 13;
const REALSXP = 14;
const STRSXP = 16;
const VECSXP = 19;
const IS_OBJECT = 1 << 8;
const HAS_ATTR = 1 << 9;
const HAS_TAG = 1 << 10;
const UTF8_MASK = 1 << 3;
const ASCII_MASK = 1 << 6;
const NA_INTEGER = -2147483648;
const R_VERSION = (4 << 16) | (5 << 8) | 0; // the version said to have written the file
const MIN_READER = (3 << 16) | (5 << 8) | 0; // version 3 needs R 3.5.0 or later

class Writer {
  constructor() {
    this.bytes = new Uint8Array(1024);
    this.length = 0;
  }
  room(n) {
    if (this.length + n <= this.bytes.length) return;
    const bigger = new Uint8Array(Math.max(this.bytes.length * 2, this.length + n));
    bigger.set(this.bytes);
    this.bytes = bigger;
  }
  raw(bytes) {
    this.room(bytes.length);
    this.bytes.set(bytes, this.length);
    this.length += bytes.length;
  }
  int(n) {
    this.room(4);
    new DataView(this.bytes.buffer).setInt32(this.length, n);
    this.length += 4;
  }
  double(x) {
    this.room(8);
    const view = new DataView(this.bytes.buffer);
    if (x === null) {
      // NA_real_ is a NaN whose lower word is 1954
      view.setUint32(this.length, 0x7ff00000);
      view.setUint32(this.length + 4, 1954);
    } else view.setFloat64(this.length, x);
    this.length += 8;
  }
  done() {
    return this.bytes.slice(0, this.length);
  }
}

const utf8 = new TextEncoder();

function writeChars(w, text) {
  if (text === null) {
    w.int(CHARSXP);
    w.int(-1);
    return;
  }
  const bytes = utf8.encode(text);
  const ascii = bytes.every((b) => b < 128);
  w.int(CHARSXP | ((ascii ? ASCII_MASK : UTF8_MASK) << 12));
  w.int(bytes.length);
  w.raw(bytes);
}

function writeStrings(w, texts, flags = 0) {
  w.int(STRSXP | flags);
  w.int(texts.length);
  for (const t of texts) writeChars(w, t);
}

/** Attributes as R writes them: a pairlist of tag and value, closed by NULL. */
function writeAttributes(w, attributes) {
  for (const [name, write] of attributes) {
    w.int(LISTSXP | HAS_TAG);
    w.int(SYMSXP);
    writeChars(w, name);
    write();
  }
  w.int(NILVALUE);
}

const ints = (w, type, values, flags = 0) => {
  w.int(type | flags);
  w.int(values.length);
  for (const v of values) w.int(v);
};

/** A column as an R vector: its type, and its values with null for NA. */
export function columnVector(table, c) {
  const type = columnType(table, c);
  const texts = table.rows.map((row) => row[c] ?? '');
  const value = (t) => (isMissing(t) ? null : (parse(t, type) ?? null));
  if (type === 'factor') {
    const lv = levels(texts);
    return { type, levels: lv, values: texts.map((t) => (isMissing(t) ? null : lv.indexOf(t.trim()) + 1)) };
  }
  return { type, values: texts.map(value) };
}

function writeColumn(w, vector) {
  const { type, values } = vector;
  if (type === 'logical') ints(w, LGLSXP, values.map((v) => (v === null ? NA_INTEGER : v ? 1 : 0)));
  else if (type === 'integer') ints(w, INTSXP, values.map((v) => (v === null ? NA_INTEGER : v)));
  else if (type === 'double') {
    w.int(REALSXP);
    w.int(values.length);
    for (const v of values) w.double(v);
  } else if (type === 'factor') {
    ints(w, INTSXP, values.map((v) => (v === null ? NA_INTEGER : v)), IS_OBJECT | HAS_ATTR);
    writeAttributes(w, [
      ['levels', () => writeStrings(w, vector.levels)],
      ['class', () => writeStrings(w, ['factor'])],
    ]);
  } else writeStrings(w, values);
}

/** The table as an R data.frame in RDS format, uncompressed; cells that do not fit their type become NA. */
export function toRds(table) {
  const w = new Writer();
  w.raw(utf8.encode('X\n'));
  w.int(3);
  w.int(R_VERSION);
  w.int(MIN_READER);
  const encoding = utf8.encode('UTF-8');
  w.int(encoding.length);
  w.raw(encoding);

  const n = table.rows.length;
  w.int(VECSXP | IS_OBJECT | HAS_ATTR);
  w.int(table.columns.length);
  table.columns.forEach((_, c) => writeColumn(w, columnVector(table, c)));
  writeAttributes(w, [
    ['names', () => writeStrings(w, exportNames(table))],
    ['class', () => writeStrings(w, ['data.frame'])],
    // compact row names c(NA, -n), or none for no rows, as .set_row_names() makes them
    ['row.names', () => ints(w, INTSXP, n > 0 ? [NA_INTEGER, -n] : [])],
  ]);
  return w.done();
}

/** The bytes compressed with gzip, which readRDS() reads like saveRDS() writes it; as they are where the browser cannot compress. */
export async function gzip(bytes) {
  if (typeof CompressionStream === 'undefined') return bytes;
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
