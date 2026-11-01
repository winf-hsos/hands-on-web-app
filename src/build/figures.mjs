// Drawings of a content item (docs/figures.md): `figures.js` in the item's
// folder registers them with figure('name', { draw, animate }), and the text
// shows one with ![description](figure:name). Here: which names a file
// registers, its hash for the address, and the rules it has to keep.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

export const FIGURE_FILE = 'figures.js';
// stagekit's sizes without 20, which is too small at the width of the text (docs/figures.md)
const SIZES = new Set([32, 48, 80]);
const cache = new Map();

/** The item's figures.js: { file, source, names, hash }, or null if it has none. */
export function figureFile(doc) {
  if (!doc.dir) return null;
  const file = join(doc.dir, FIGURE_FILE);
  if (!existsSync(file)) return null;
  // read again after every change, since the preview rebuilds in the same process
  const key = `${file}:${statSync(file).mtimeMs}`;
  if (!cache.has(key)) {
    const source = readFileSync(file, 'utf8');
    const names = [...source.matchAll(/\bfigure\(\s*['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]);
    cache.set(key, { file, source, names, hash: createHash('sha1').update(source).digest('hex').slice(0, 8) });
  }
  return cache.get(key);
}

/** The names of the drawings a Markdown text shows. */
export const figureRefs = (body) => [...body.matchAll(/!\[[^\]]*\]\(figure:([a-z0-9-]+)/g)].map((m) => m[1]);

/** Breaches of the drawing rules in a figures.js, as messages. */
export function figureRules(source) {
  const problems = [];
  const lines = source.split('\n');
  lines.forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '');
    for (const m of code.matchAll(/\bsize:\s*(\d+)/g)) {
      if (!SIZES.has(Number(m[1]))) problems.push(`line ${i + 1}: size ${m[1]}; only 32, 48 or 80`);
    }
    if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(code)) problems.push(`line ${i + 1}: a colour value; use the colours of the theme`);
  });
  return problems;
}
