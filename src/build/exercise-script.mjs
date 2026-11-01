// An exercise as a script to download (Nicolas, 2026-11-01), to run in VS Code
// or Positron: the task, the expected output and the hints become comments,
// the code of its boxes becomes code, and the solution stays on the page. An R
// script loads the packages and data sets the boxes get in the browser.
import { DATASETS, PLAIN } from '../client/r-datasets.js';

export const SITE_ORIGIN = 'https://hands-on-computer-science.de';

const LANGUAGES = { python: 'py', r: 'R' };
const WIDTH = 79;
const DPLYR = /\|>|%>%|\b(filter|select|mutate|arrange|summari[sz]e|group_by|count|slice\w*|rename|distinct|pull|across|tibble|as_tibble)\s*\(/;
const DRAWS = /\b(ggplot|geom_\w+|qplot)\s*\(/;

const LABELS = {
  de: {
    intro: 'Die Aufgabe und die Tipps stehen hier als Kommentare, die Lösung findest du auf der Seite.',
    setup: 'Pakete und Daten laden',
    install: 'Einmal vorher in der Konsole, falls noch nicht installiert:',
    hint: 'Tipp',
    note: 'Hinweis',
  },
  en: {
    intro: 'The task and the hints are comments here; the solution is on the page.',
    setup: 'Load packages and data',
    install: 'Once beforehand in the console, if not installed yet:',
    hint: 'Hint',
    note: 'Note',
  },
};

/** The language of an exercise's own code boxes (python or r), or null. */
export function scriptLanguage(body) {
  let quoted = false;
  for (const line of body.split('\n')) {
    quoted = line.startsWith('>');
    const fence = !quoted && line.match(/^```(\w+)/);
    if (fence && LANGUAGES[fence[1]]) return fence[1];
  }
  return null;
}

/** Plain text of a line of Markdown: links as their text, no bold, no heading ids. */
function plain(text, titleOf) {
  return text
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, (_, id) => titleOf(id) ?? id)
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '$1 ($2)')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s*\{#[\w-]+\}\s*$/, '');
}

/** Words wrapped into comment lines, the first after `first`, the rest after `rest`. */
function wrap(text, first = '# ', rest = first) {
  const lines = [];
  let line = first;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const fresh = line === first || line === rest;
    if (!fresh && line.length + 1 + word.length > WIDTH) {
      lines.push(line);
      line = rest + word;
    } else line += (fresh ? '' : ' ') + word;
  }
  lines.push(line);
  return lines;
}

const comment = (line) => (line.trim() ? `# ${line}` : '#');

/**
 * The lines of a Markdown body as script lines. Code in `language` outside of
 * a callout is code, everything else a comment; solutions are left out.
 */
function convert(lines, { language, labels, titleOf, inCallout = false }) {
  const out = [];
  const code = [];
  let i = 0;
  const last = () => (typeof out.at(-1) === 'string' ? out.at(-1) : null);
  const blank = () => out.length && last() !== '' && out.push('');
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    // a fenced block
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const body = [];
      for (i += 1; i < lines.length && !lines[i].startsWith('```'); i += 1) body.push(lines[i]);
      i += 1;
      if (fence[1] === language && !inCallout) {
        blank();
        out.push({ code: body });
        code.push(body.join('\n'));
      } else {
        if (last() === null) out.push('');
        else if (out.length && !['#', ''].includes(last())) out.push('#');
        out.push(...body.map((l) => comment(`  ${l}`)));
      }
      continue;
    }
    // a callout or quote
    if (line.startsWith('>')) {
      const body = [];
      for (; i < lines.length && lines[i].startsWith('>'); i += 1) body.push(lines[i].replace(/^> ?/, ''));
      const kind = body[0].match(/^\[!(\w+)\]\s*(.*)$/);
      if (kind?.[1] === 'SOLUTION') continue;
      if (kind) body[0] = kind[2];
      const inner = convert(body, { language, labels, titleOf, inCallout: true }).lines;
      blank();
      if (kind) out.push(`# ${kind[1] === 'HINT' ? labels.hint : labels.note}:`);
      out.push(...inner.filter((l) => typeof l === 'string'));
      continue;
    }
    // a heading
    const heading = line.match(/^#+\s+(.*)$/);
    if (heading) {
      blank();
      const title = plain(heading[1], titleOf);
      out.push(language === 'r' ? `# ${title} ----` : `# --- ${title} ---`);
      out.push('#');
      i += 1;
      continue;
    }
    // a block of prose up to the next blank line, fence, quote or heading
    const block = [];
    for (; i < lines.length && lines[i].trim() && !/^(```|>|#+\s)/.test(lines[i]); i += 1) block.push(lines[i]);
    if (block.every((l) => /^!\[[^\]]*\]\([^)]*\)\s*$/.test(l))) continue;
    if (out.length && last() === null) out.push('');
    else if (out.length && !['#', ''].includes(last()) && !last().endsWith(':')) out.push('#');
    if (block[0].startsWith('|')) out.push(...block.map((l) => comment(plain(l, titleOf))));
    else if (/^(\s*[-*]|\s*\d+\.)\s/.test(block[0])) {
      // one entry per list item, continued lines indented under its text
      const entries = [];
      for (const l of block) {
        if (/^(\s*[-*]|\s*\d+\.)\s/.test(l)) entries.push(l.trim());
        else entries[entries.length - 1] += ` ${l.trim()}`;
      }
      for (const entry of entries) {
        const [, marker, text] = entry.match(/^([-*]|\d+\.)\s+(.*)$/);
        out.push(...wrap(plain(text, titleOf), `# ${marker} `, `# ${' '.repeat(marker.length + 1)}`));
      }
    } else out.push(...wrap(plain(block.join(' '), titleOf)));
  }
  return { lines: out, code };
}

/** What an R script needs before its code: packages and the data sets it names. */
function rSetup(code, labels) {
  const packages = [];
  if (DPLYR.test(code) || Object.keys(DATASETS).some((name) => new RegExp(`\\b${name}\\b`).test(code))) packages.push('dplyr');
  if (DRAWS.test(code)) packages.push('ggplot2');
  const data = Object.entries(DATASETS).filter(([name]) => new RegExp(`\\b${name}\\b`).test(code));
  if (!packages.length && !data.length) return [];
  const lines = [`# ${labels.setup} ----`, '#'];
  if (packages.length) {
    lines.push(`# ${labels.install}`, `# install.packages(${packages.length > 1 ? `c(${packages.map((p) => `"${p}"`).join(', ')})` : `"${packages[0]}"`})`, '');
    lines.push(...packages.map((p) => `library(${p})`));
  }
  for (const [name, file] of data) {
    const table = `read.csv("${SITE_ORIGIN}/media/datasets/${file}", na.strings = "", stringsAsFactors = FALSE)`;
    lines.push(`${name} <- ${PLAIN.has(name) ? table : `as_tibble(${table})`}`);
  }
  return [...lines, ''];
}

/**
 * The script of an exercise, or null when its boxes are not Python or R:
 * { name, text }, where name is the file next to the page.
 */
export function exerciseScript({ id, title, body, lang, url, titleOf = () => null }) {
  const language = scriptLanguage(body);
  if (!language) return null;
  const labels = LABELS[lang];
  const { lines, code } = convert(body.split(/\r?\n/), { language, labels, titleOf });
  // the boxes on the page run each on their own and often begin with the
  // same lines of setup, up to a blank line; one script needs them only once
  let setupLines = null;
  const text = [];
  for (const line of lines) {
    if (typeof line === 'string') {
      text.push(line);
      continue;
    }
    let body = line.code;
    if (!setupLines) {
      const end = body.findIndex((l) => !l.trim());
      setupLines = end > 0 ? body.slice(0, end) : [];
    } else if (setupLines.length && setupLines.every((l, k) => body[k] === l)) {
      body = body.slice(setupLines.length);
      while (body.length && !body[0].trim()) body.shift();
    }
    if (body.length) text.push(...body);
  }
  while (text.at(-1) === '' || text.at(-1) === '#') text.pop();
  const head = [`# ${title}`, `# ${SITE_ORIGIN}${url}`, '#', ...wrap(labels.intro), ''];
  const setup = language === 'r' ? rSetup(code.join('\n'), labels) : [];
  return { name: `${id}.${LANGUAGES[language]}`, language, text: `${[...head, ...setup, ...text].join('\n')}\n` };
}
