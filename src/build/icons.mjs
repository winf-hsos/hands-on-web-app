// Icons of the content types, taken from Lucide (lucide-static, ISC license)
// by the name given in knowledge/vocabulary.yaml.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '../../node_modules/lucide-static/icons');
const cache = new Map();

export const iconExists = (name) => typeof name === 'string' && /^[a-z0-9-]+$/.test(name) && existsSync(join(DIR, `${name}.svg`));

/** The inner shapes of a 24×24 icon, without the surrounding <svg>. */
export function iconShapes(name) {
  if (!cache.has(name)) {
    const svg = readFileSync(join(DIR, `${name}.svg`), 'utf8');
    cache.set(name, svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>')).replace(/\s+/g, ' ').trim());
  }
  return cache.get(name);
}

/** A complete inline icon that takes its colour from the text around it. */
export const iconSvg = (name, className = 'type-icon') =>
  `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconShapes(name)}</svg>`;
