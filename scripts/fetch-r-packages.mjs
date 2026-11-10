// Fetches the R packages the lessons use, built for webR, into
// vendor/webr-repo/, so that the site serves them itself and the learner's
// browser never asks Posit's server (docs/architecture.md, "R"). Like
// `npm install`, this runs once after a fresh checkout; the folder is not in
// git. The build copies it under /assets/vendor/webr-repo/.
// Usage: npm run fetch-r-packages
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const R_VERSION = '4.6'; // the R inside webR 0.6
// the core of the tidyverse, the nine packages library(tidyverse) attaches
const WANTED = ['dplyr', 'tibble', 'ggplot2', 'tidyr', 'readr', 'purrr', 'stringr', 'forcats', 'lubridate'];
const SOURCE = `https://repo.r-wasm.org/bin/emscripten/contrib/${R_VERSION}`;
const TARGET = join(import.meta.dirname, '..', 'vendor/webr-repo/bin/emscripten/contrib', R_VERSION);

// packages that come with webR itself
const BUILT_IN = new Set(['R', 'base', 'compiler', 'datasets', 'grDevices', 'graphics', 'grid', 'methods', 'parallel', 'splines', 'stats', 'stats4', 'tcltk', 'tools', 'utils', 'webr']);

const index = await (await fetch(`${SOURCE}/PACKAGES`)).text();
const entries = new Map(
  index
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const fields = Object.fromEntries(
        block
          .replace(/\n\s+/g, ' ')
          .split('\n')
          .map((line) => [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1).trim()]),
      );
      return [fields.Package, { fields, block }];
    }),
);

const names = (field = '') =>
  field
    .split(',')
    .map((s) => s.trim().split(/[\s(]/)[0])
    .filter(Boolean);

// everything the wanted packages need to run, in no particular order
const needed = new Set();
const todo = [...WANTED];
while (todo.length) {
  const name = todo.pop();
  if (needed.has(name) || BUILT_IN.has(name)) continue;
  const entry = entries.get(name);
  if (!entry) throw new Error(`${name} is not in the webR repository`);
  needed.add(name);
  todo.push(...names(entry.fields.Depends), ...names(entry.fields.Imports));
}

mkdirSync(TARGET, { recursive: true });
let bytes = 0;
for (const name of [...needed].sort()) {
  const { Version } = entries.get(name).fields;
  const file = `${name}_${Version}.tgz`;
  const path = join(TARGET, file);
  if (!existsSync(path)) {
    const response = await fetch(`${SOURCE}/${file}`);
    if (!response.ok) throw new Error(`${file}: ${response.status}`);
    writeFileSync(path, Buffer.from(await response.arrayBuffer()));
  }
  bytes += readFileSync(path).length;
  console.log(`${name} ${Version}`);
}
writeFileSync(join(TARGET, 'PACKAGES'), `${[...needed].sort().map((n) => entries.get(n).block.trim()).join('\n\n')}\n`);
console.log(`${needed.size} packages, ${(bytes / 1e6).toFixed(1)} MB in ${TARGET}`);
