// A dataset item points with `file:` to a CSV in knowledge/media/datasets/,
// which the site serves under /media/datasets/. The page offers it for
// download with its size, rows and columns, measured here at build time,
// and with the lines that load it in R and in Python.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Where the file of a dataset item lies; items live in knowledge/content/<id>. */
export const datasetPath = (itemDir, file) => join(itemDir, '..', '..', 'media', 'datasets', file);

const measured = new Map();

/** { bytes, rows, columns } of a CSV, or { error }. Quoted fields may hold commas and line breaks. */
export function datasetInfo(itemDir, file) {
  const path = datasetPath(itemDir, file);
  if (measured.has(path)) return measured.get(path);
  let info;
  if (!/^[\w.-]+\.csv$/.test(file)) info = { error: 'expected the name of a .csv file in media/datasets/' };
  else if (!existsSync(path)) info = { error: `media/datasets/${file} does not exist` };
  else {
    const text = readFileSync(path, 'utf8');
    let rows = 0;
    let columns = 1;
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') quoted = !quoted;
      else if (!quoted && c === ',' && rows === 0) columns++;
      else if (!quoted && c === '\n') rows++;
    }
    if (!text.endsWith('\n')) rows++;
    info = { bytes: statSync(path).size, rows: rows - 1, columns };
  }
  measured.set(path, info);
  return info;
}

/** The RDS file next to a dataset's CSV, with the same name, or null. RDS is
    R's own format and keeps the types of the columns, factors with the order
    of their levels included, which a CSV loses (Nicolas, 2026-11-09). */
export function rdsFile(itemDir, file) {
  const rds = file.replace(/\.csv$/, '.rds');
  return rds !== file && existsSync(datasetPath(itemDir, rds)) ? rds : null;
}

/** Size of a file in media/datasets/ in bytes. */
export const datasetBytes = (itemDir, file) => statSync(datasetPath(itemDir, file)).size;

/** The lines that load the file, by language; the name of the table is the
    file's name. With an RDS file, R also gets the line that reads it, after
    the comment `rdsComment`. */
export function loadingCode(file, rds = null, rdsComment = '') {
  const name = tableName(file);
  return {
    r: `library(readr)\n\n${name} <- read_csv("${file}")${rds ? `\n\n# ${rdsComment}\n${name} <- readRDS("${rds}")` : ''}`,
    python: `import pandas as pd\n\n${name} = pd.read_csv("${file}", low_memory=False)`,
  };
}

/** The name a table goes by when it is read from `file`: the file's name as an R name. */
export function tableName(file) {
  return file.replace(/\.csv$/, '').replace(/[^\w]/g, '_').replace(/^(\d)/, 'd_$1');
}

/**
 * The data sets a page works with, as ids in the order they first come up in
 * its text, so that the page can offer them at its top (Nicolas, 2026-11-16).
 * A data set counts when the page lists it (`listed`, its `datasets:`) or when
 * an R box of the page, runnable or not, uses its table. A table goes by its
 * own name, as `anscombe` for anscombe.csv, and by the names in `names`, which
 * map a table name to a file (client/r-datasets.js and the page's r_datasets;
 * the page's own win). `files` maps the file of every data set to its id.
 */
export function datasetsUsed(body, { files, names = {}, listed = [] }) {
  const known = { ...Object.fromEntries([...files.keys()].map((file) => [tableName(file), file])), ...names };
  const boxes = [...body.matchAll(/^```[ \t]*r\b[^\n]*\n([\s\S]*?)^```/gm)].map((m) => ({ at: m.index, code: m[1] }));
  const found = new Map();
  const note = (id, at) => {
    if (id && !(found.get(id) <= at)) found.set(id, at);
  };
  for (const [name, file] of Object.entries(known)) {
    const word = new RegExp(`(?<![\\w.])${name.replace(/\./g, '\\.')}(?![\\w.])`);
    const box = boxes.find((b) => word.test(b.code));
    if (box) note(files.get(file), box.at);
  }
  for (const id of listed) {
    const at = [`[[${id}`, `item:${id}`].map((s) => body.indexOf(s)).filter((i) => i >= 0);
    note(id, at.length ? Math.min(...at) : Infinity);
  }
  return [...found].sort((a, b) => a[1] - b[1]).map(([id]) => id);
}
