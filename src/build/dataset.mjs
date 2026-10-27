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

/** The lines that load the file, by language; the name of the table is the file's name. */
export function loadingCode(file) {
  const name = file.replace(/\.csv$/, '').replace(/[^\w]/g, '_').replace(/^(\d)/, 'd_$1');
  return {
    r: `library(readr)\n\n${name} <- read_csv("${file}")`,
    python: `import pandas as pd\n\n${name} = pd.read_csv("${file}", low_memory=False)`,
  };
}
