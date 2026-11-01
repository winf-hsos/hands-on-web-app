// Remark plugin for the conventions of docs/knowledge-schema.md, sections 6–7:
// [[id]] and [[id|text]] links, GitHub-style callouts (HINT and SOLUTION
// fold away), Python and R code that runs in the browser, result tables to
// fill in, and quiz questions.
// Options: lang, quiz (boolean), resolve(id) -> { url, title } | null; a url of null keeps only the text;
// sourceMap (boolean) marks where each block stands in the source.
import { visit, SKIP } from 'unist-util-visit';
import { tokenize } from '../client/highlight.js';

const CALLOUT = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|HINT|SOLUTION)\]\s*/;
const FOLDED = new Set(['HINT', 'SOLUTION']);
const WIKI = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
// Warnings stand in capitals with a warning sign (site.css), not in red (Nicolas, 2026-10-30).
const CALLOUT_TITLES = {
  de: { NOTE: 'Hinweis', TIP: 'Tipp', WARNING: 'ACHTUNG', IMPORTANT: 'Wichtig', CAUTION: 'VORSICHT', HINT: 'Tipp anzeigen', SOLUTION: 'Lösung anzeigen' },
  en: { NOTE: 'Note', TIP: 'Tip', WARNING: 'WARNING', IMPORTANT: 'Important', CAUTION: 'CAUTION', HINT: 'Show a hint', SOLUTION: 'Show the solution' },
};
// With several hints in one text they are numbered, since each builds on the one before.
const NUMBERED_HINT = { de: (n) => `Tipp ${n} anzeigen`, en: (n) => `Show hint ${n}` };
const TABLE_LABELS = {
  de: { clear: 'Eingaben löschen', confirm: 'Alle Eingaben in dieser Tabelle löschen?' },
  en: { clear: 'Clear entries', confirm: 'Clear all entries in this table?' },
};

export function remarkKnowledge({ lang, quiz: isQuiz = false, resolve, sourceMap = false }) {
  return (tree) => {
    wikiLinks(tree, resolve);
    callouts(tree, lang);
    runnable(tree);
    fillableTables(tree, lang);
    demos(tree);
    figures(tree);
    if (isQuiz) quiz(tree);
    if (sourceMap) markSources(tree);
  };
}

// Where each top-level block stands in the source, as data-src="start-end"
// (character offsets), so that the editor can open exactly that passage when
// it is clicked on the page (src/editor/ui/inline.js). Only on the site with
// drafts. A block without a position of its own, a quiz question, spans its
// children.
function markSources(tree) {
  for (const node of tree.children) {
    const start = node.position?.start.offset ?? node.children?.[0]?.position?.start.offset;
    const end = node.position?.end.offset ?? node.children?.at(-1)?.position?.end.offset;
    if (start === undefined || end === undefined) continue;
    node.data = { ...node.data, hProperties: { ...node.data?.hProperties, dataSrc: `${start}-${end}` } };
  }
}

function wikiLinks(tree, resolve) {
  visit(tree, 'text', (node, position, parent) => {
    if (!parent || position === undefined || !node.value.includes('[[')) return;
    const parts = [];
    let last = 0;
    for (const match of node.value.matchAll(WIKI)) {
      const [whole, id, text] = match;
      // Unknown ids are reported by validate.mjs before rendering starts.
      const target = resolve(id);
      if (!target) continue;
      if (match.index > last) parts.push({ type: 'text', value: node.value.slice(last, match.index) });
      if (!target.url) parts.push({ type: 'text', value: text ?? target.title });
      else parts.push({
        type: 'link',
        url: target.url,
        data: { hProperties: { className: ['wiki-link'] } },
        children: [{ type: 'text', value: text ?? target.title }],
      });
      last = match.index + whole.length;
    }
    if (!parts.length) return;
    if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
    parent.children.splice(position, 1, ...parts);
    return [SKIP, position + parts.length];
  });
}

function callouts(tree, lang) {
  const hints = [];
  visit(tree, 'blockquote', (node) => {
    const first = node.children[0];
    const text = first?.type === 'paragraph' ? first.children[0] : undefined;
    const match = text?.type === 'text' ? text.value.match(CALLOUT) : null;
    if (!match) return;
    const kind = match[1];
    text.value = text.value.slice(match[0].length);
    if (!text.value) first.children.shift();
    if (!first.children.length) node.children.shift();
    const folded = FOLDED.has(kind);
    node.data = { hName: folded ? 'details' : 'aside', hProperties: { className: ['callout', `callout-${kind.toLowerCase()}`] } };
    const title = { type: 'text', value: CALLOUT_TITLES[lang][kind] };
    if (kind === 'HINT') hints.push(title);
    node.children.unshift({
      type: 'paragraph',
      data: { hName: folded ? 'summary' : 'p', hProperties: { className: ['callout-title'] } },
      children: [title],
    });
  });
  if (hints.length > 1) hints.forEach((title, i) => (title.value = NUMBERED_HINT[lang](i + 1)));
}

// ```python and ```r blocks are highlighted and become runnable
// (client/runner.js); ```python static (or ```r static) only shows the code,
// for fragments that cannot run. Any other block, such as ```text for a
// sample run, is shown as it is, in the same frame.
function runnable(tree) {
  visit(tree, 'code', (node) => {
    if (DEMOS[node.lang]) return;
    if (node.lang !== 'python' && node.lang !== 'r') {
      node.type = 'plainCode';
      const code = { type: 'element', tagName: 'code', properties: { className: node.lang ? [`language-${node.lang}`] : [] }, children: [{ type: 'text', value: node.value }] };
      node.data = { hName: 'pre', hProperties: { className: ['code'] }, hChildren: [code] };
      return;
    }
    const lang = node.lang;
    const runs = !/\bstatic\b/.test(node.meta ?? '');
    const code = {
      type: 'element',
      tagName: 'code',
      properties: { className: [`language-${lang}`] },
      children: tokenize(node.value, lang).map(({ type, text }) =>
        type ? { type: 'element', tagName: 'span', properties: { className: [`tok-${type}`] }, children: [{ type: 'text', value: text }] } : { type: 'text', value: text },
      ),
    };
    const pre = { type: 'element', tagName: 'pre', properties: { className: ['code'] }, children: [code] };
    // An unknown node type, so that remark-rehype builds exactly these
    // elements instead of wrapping them in its own <pre>.
    node.type = 'runnableCode';
    node.data = runs
      ? { hName: 'div', hProperties: { className: ['runner'], dataRunner: '', dataLang: lang }, hChildren: [pre] }
      : { hName: 'pre', hProperties: { className: ['code'] }, hChildren: [code] };
  });
}

// A table with empty cells is a result table to fill in on the page (Nicolas,
// 2026-11-01), as in an experiment: each empty cell below the head becomes a
// field, named for screen readers by the first cell of its row and the head
// of its column. client/tables.js keeps what is typed in this browser.
function fillableTables(tree, lang) {
  const text = (node) => (node.value ?? '') + (node.children ?? []).map(text).join('');
  const empty = (cell) => !text(cell).trim();
  let count = 0;
  visit(tree, 'table', (node) => {
    const [head, ...rows] = node.children;
    if (!rows.some((row) => row.children.some(empty))) return;
    count += 1;
    rows.forEach((row, r) =>
      row.children.forEach((cell, c) => {
        if (!empty(cell)) return;
        const label = [text(row.children[0]), head.children[c] && text(head.children[c])].filter((s) => s?.trim()).join(', ');
        const input = { type: 'element', tagName: 'input', properties: { type: 'text', className: ['table-input'], dataCell: `${r}-${c}`, ariaLabel: label, autocomplete: 'off', spellCheck: 'false' }, children: [] };
        cell.data = { ...cell.data, hChildren: [input] };
      }),
    );
    const labels = TABLE_LABELS[lang] ?? TABLE_LABELS.en;
    node.data = { ...node.data, hProperties: { ...node.data?.hProperties, dataFillable: String(count), dataClear: labels.clear, dataConfirm: labels.confirm } };
  });
}

// ```verb-demo becomes the place of the dplyr demonstrator (client/verb-demo.js),
// ```monty-hall the game with three doors (client/monty-hall.js),
// ```byte-switchboard eight switches for one byte (client/byte-switchboard.js).
// Each sits in a frame with buttons for its shortcuts and for full screen
// (client/demo-frame.js), so that it can be shown on a projector in class.
const DEMOS = {
  'verb-demo': { className: 'verb-demo', dataVerbDemo: '' },
  'monty-hall': { className: 'monty-hall', dataMontyHall: '' },
  'byte-switchboard': { className: 'byte-switchboard', dataByteSwitchboard: '' },
};

function demos(tree) {
  visit(tree, 'code', (node) => {
    const demo = DEMOS[node.lang];
    if (!demo) return;
    node.type = 'demo';
    const place = { type: 'element', tagName: 'div', properties: { ...demo, className: [demo.className] }, children: [] };
    node.data = { hName: 'div', hProperties: { className: ['demo'], dataDemo: '' }, hChildren: [place] };
  });
}

// ![description](figure:name "caption"), alone in its paragraph, is the place
// of a drawing from the item's figures.js (docs/figures.md), which
// client/figures.js draws there. The description is what a screen reader
// says, the caption stands below the drawing.
function figures(tree) {
  visit(tree, 'paragraph', (node, index, parent) => {
    const [image, ...rest] = node.children;
    if (image?.type !== 'image' || !image.url.startsWith('figure:') || rest.some((c) => c.type !== 'text' || c.value.trim())) return;
    const name = image.url.slice('figure:'.length);
    const canvas = { type: 'element', tagName: 'div', properties: { className: ['drawing-canvas'], id: `figure-${name}`, role: 'img', ariaLabel: image.alt }, children: [] };
    const caption = image.title && { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: image.title }] };
    parent.children[index] = {
      type: 'figureDrawing',
      position: node.position,
      data: { hName: 'figure', hProperties: { className: ['drawing'], dataFigure: name }, hChildren: [canvas, caption].filter(Boolean) },
    };
    return SKIP;
  });
}

// Each `##` section becomes one question: the task list holds the options
// ([x] marks correct ones), a blockquote after it the explanation. A
// blockquote inside an option is the reason for that option, shown once the
// question is answered.
function quiz(tree) {
  const out = [];
  let current = null;
  let number = 0;
  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 2) {
      number += 1;
      const tail = lastText(node);
      const explicit = tail?.value.match(/\s*\{#([a-z0-9-]+)\}\s*$/);
      if (explicit) tail.value = tail.value.slice(0, explicit.index);
      current = {
        type: 'quizQuestion',
        data: { hName: 'section', hProperties: { className: ['quiz-question'], dataQuestion: explicit?.[1] ?? `q${number}` } },
        children: [node],
      };
      out.push(current);
      continue;
    }
    if (!current) {
      out.push(node);
      continue;
    }
    if (node.type === 'list' && node.children.some((item) => typeof item.checked === 'boolean')) {
      const correct = node.children.filter((item) => item.checked).length;
      node.data = { hName: 'ul', hProperties: { className: ['quiz-options'], dataMultiple: correct > 1 ? 'true' : 'false' } };
      for (const item of node.children) {
        item.data = { hProperties: { className: ['quiz-option'], dataCorrect: item.checked ? 'true' : 'false' } };
        item.checked = null;
        for (const part of item.children) {
          if (part.type === 'blockquote') part.data = { hName: 'div', hProperties: { className: ['quiz-reason'], hidden: true } };
        }
      }
    } else if (node.type === 'blockquote') {
      node.data = { hName: 'div', hProperties: { className: ['quiz-explanation'], hidden: true } };
    }
    current.children.push(node);
  }
  tree.children = out;
}

function lastText(node) {
  const last = node.children[node.children.length - 1];
  return last?.type === 'text' ? last : undefined;
}
