// Remark plugin for the conventions of docs/knowledge-schema.md, sections 6–7:
// [[id]] and [[id|text]] links, GitHub-style callouts (HINT and SOLUTION
// fold away), Python and R code that runs in the browser, result tables to
// fill in, and quiz questions.
// Options: lang, quiz (boolean), resolve(id) -> { url, title } | null; a url of null keeps only the text;
// sourceMap (boolean) marks where each block stands in the source.
import { visit, SKIP } from 'unist-util-visit';
import yaml from 'js-yaml';
import { tokenize } from '../client/highlight.js';
import { iconShapes } from './icons.mjs';

const CALLOUT = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|HINT|SOLUTION)\]\s*/;
const FOLDED = new Set(['HINT', 'SOLUTION']);
const WIKI = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/** A title as Markdown nodes: text, and `code` in backticks as inline code. */
const titleNodes = (title) =>
  title
    .split(/`([^`]+)`/)
    .map((part, i) => (i % 2 ? { type: 'inlineCode', value: part } : { type: 'text', value: part }))
    .filter((node) => node.value);
// Every callout title stands in capitals after an icon of its kind (Nicolas,
// 2026-11-02), as warnings did first; warnings are not red (2026-10-30).
const CALLOUT_TITLES = {
  de: { NOTE: 'HINWEIS', TIP: 'TIPP', WARNING: 'ACHTUNG', IMPORTANT: 'WICHTIG', CAUTION: 'VORSICHT', HINT: 'TIPP ANZEIGEN', SOLUTION: 'LÖSUNG ANZEIGEN' },
  en: { NOTE: 'NOTE', TIP: 'TIP', WARNING: 'WARNING', IMPORTANT: 'IMPORTANT', CAUTION: 'CAUTION', HINT: 'SHOW A HINT', SOLUTION: 'SHOW THE SOLUTION' },
};
// Lucide icons (ISC license) by kind.
const CALLOUT_ICONS = {
  NOTE: 'info',
  TIP: 'lightbulb',
  WARNING: 'triangle-alert',
  IMPORTANT: 'circle-alert',
  CAUTION: 'octagon-alert',
  HINT: 'lightbulb',
  SOLUTION: 'circle-check-big',
};
// With several hints in one section they are numbered, since each builds on the one before.
const NUMBERED_HINT = { de: (n) => `TIPP ${n} ANZEIGEN`, en: (n) => `SHOW HINT ${n}` };

/** An icon as an element of the HTML tree, since the Markdown here may hold no raw HTML. */
function iconNode(name) {
  const shapes = [...iconShapes(name).matchAll(/<(\w+)([^>]*?)\/?>/g)].map(([, tagName, attributes]) => ({
    type: 'element',
    tagName,
    properties: Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
    children: [],
  }));
  return {
    type: 'calloutIcon',
    data: {
      hName: 'svg',
      hProperties: { className: ['callout-icon'], viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', ariaHidden: 'true' },
      hChildren: shapes,
    },
  };
}
const TABLE_LABELS = {
  de: { clear: 'Eingaben löschen', confirm: 'Alle Eingaben in dieser Tabelle löschen?' },
  en: { clear: 'Clear entries', confirm: 'Clear all entries in this table?' },
};

export function remarkKnowledge({ lang, quiz: isQuiz = false, resolve, sourceMap = false, sourceOffset = 0 }) {
  return (tree) => {
    wikiLinks(tree, resolve);
    callouts(tree, lang);
    runnable(tree);
    fillableTables(tree, lang);
    demos(tree);
    figures(tree);
    models(tree);
    photos(tree);
    if (isQuiz) quiz(tree);
    else headingIds(tree);
    if (sourceMap) markSources(tree, sourceOffset);
  };
}

// Where each top-level block stands in the source, as data-src="start-end"
// (character offsets), so that the editor can open exactly that passage when
// it is clicked on the page (src/editor/ui/inline.js). Only on the site with
// drafts. A block without a position of its own, a quiz question, spans its
// children. A part of a lesson between two embedded items is rendered on its
// own (build/embed.mjs); `offset` is where it starts in the whole body.
function markSources(tree, offset = 0) {
  for (const node of tree.children) {
    const start = node.position?.start.offset ?? node.children?.[0]?.position?.start.offset;
    const end = node.position?.end.offset ?? node.children?.at(-1)?.position?.end.offset;
    if (start === undefined || end === undefined) continue;
    node.data = { ...node.data, hProperties: { ...node.data?.hProperties, dataSrc: `${start + offset}-${end + offset}` } };
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
      const label = text ? [{ type: 'text', value: text }] : titleNodes(target.title);
      if (!target.url) parts.push(...label);
      else parts.push({
        type: 'link',
        url: target.url,
        data: { hProperties: { className: ['wiki-link'] } },
        children: label,
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
  // hints are counted per section, so that each task of a challenge starts at 1
  const sections = [[]];
  visit(tree, ['heading', 'blockquote'], (node) => {
    if (node.type === 'heading') {
      if (node.depth <= 2) sections.push([]);
      return;
    }
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
    if (kind === 'HINT') sections.at(-1).push(title);
    node.children.unshift({
      type: 'paragraph',
      data: { hName: folded ? 'summary' : 'p', hProperties: { className: ['callout-title'] } },
      children: [iconNode(CALLOUT_ICONS[kind]), title],
    });
  });
  for (const hints of sections) {
    if (hints.length > 1) hints.forEach((title, i) => (title.value = NUMBERED_HINT[lang](i + 1)));
  }
}

// ```python and ```r blocks are highlighted and become runnable
// (client/runner.js); ```python static (or ```r static) only shows the code,
// for fragments that cannot run. Any other block, such as ```text for a
// sample run, is shown as it is, in the same frame. A block that is not run
// and names a file, as in ```python static file=task_1_light_on.py, shows the
// name above it with a button that saves the code under it (client/copy.js).
function runnable(tree) {
  visit(tree, 'code', (node) => {
    if (DEMOS[node.lang]) return;
    const file = node.meta?.match(/\bfile=([\w.-]+)/)?.[1];
    const shown = { className: ['code'], ...(file && { dataFile: file }) };
    if (node.lang !== 'python' && node.lang !== 'r') {
      node.type = 'plainCode';
      const code = { type: 'element', tagName: 'code', properties: { className: node.lang ? [`language-${node.lang}`] : [] }, children: [{ type: 'text', value: node.value }] };
      node.data = { hName: 'pre', hProperties: shown, hChildren: [code] };
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
      : { hName: 'pre', hProperties: shown, hChildren: [code] };
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
// ```byte-switchboard eight switches for one byte (client/byte-switchboard.js),
// ```photo-digitiser a photo cut by resolution and colour depth (client/photo-digitiser.js),
// ```audio-digitiser a sound cut by sampling rate and bit depth (client/audio-digitiser.js),
// ```question-game sixteen faces and yes-or-no questions measured in bits (client/question-game.js),
// ```data-table an empty table to record observations in (client/data-table.js),
// ```shell-demo the folder tree and command line (client/shell-demo.js), whose
// block holds its scenario in YAML (tree:, start:), checked by validate.mjs.
// Each sits in a frame with buttons for its shortcuts and for full screen
// (client/demo-frame.js), so that it can be shown on a projector in class.
const DEMOS = {
  'verb-demo': { className: 'verb-demo', dataVerbDemo: '' },
  'monty-hall': { className: 'monty-hall', dataMontyHall: '' },
  'byte-switchboard': { className: 'byte-switchboard', dataByteSwitchboard: '' },
  'photo-digitiser': { className: 'photo-digitiser', dataPhotoDigitiser: '' },
  'audio-digitiser': { className: 'audio-digitiser', dataAudioDigitiser: '' },
  'question-game': { className: 'question-game', dataQuestionGame: '' },
  'shell-demo': { className: 'shell-demo', dataShellDemo: '' },
  'data-table': { className: 'data-table', dataDataTable: '' },
};

/** The scenario in a ```shell-demo block, or null when it is not YAML. */
export function shellScenario(text) {
  try {
    return yaml.load(text) ?? {};
  } catch {
    return null;
  }
}

function demos(tree) {
  visit(tree, 'code', (node) => {
    const demo = DEMOS[node.lang];
    if (!demo) return;
    node.type = 'demo';
    const data = node.lang === 'shell-demo' ? { dataShellDemo: JSON.stringify(shellScenario(node.value) ?? {}) } : {};
    const place = { type: 'element', tagName: 'div', properties: { ...demo, ...data, className: [demo.className] }, children: [] };
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

// ![description](model:media/part.stl "caption") is a 3D model that can be
// turned and zoomed (client/model.js); several in one paragraph stand side by
// side. The description is what a screen reader says.
function models(tree) {
  visit(tree, 'paragraph', (node, index, parent) => {
    const images = node.children.filter((c) => c.type === 'image' && c.url.startsWith('model:'));
    if (!images.length || node.children.some((c) => !images.includes(c) && (c.type !== 'text' || c.value.trim()))) return;
    const figure = (image) => ({
      type: 'element',
      tagName: 'figure',
      properties: { className: ['model'], dataModel: image.url.slice('model:'.length) },
      children: [
        { type: 'element', tagName: 'div', properties: { className: ['model-canvas'], role: 'img', ariaLabel: image.alt }, children: [] },
        image.title && { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: image.title }] },
      ].filter(Boolean),
    });
    parent.children[index] = {
      type: 'modelRow',
      position: node.position,
      data: { hName: 'div', hProperties: { className: ['model-row'] }, hChildren: images.map(figure) },
    };
    return SKIP;
  });
}

// Images alone in their paragraph, one of them with a "caption", become
// figures with their caption below; several stand side by side.
function photos(tree) {
  visit(tree, 'paragraph', (node, index, parent) => {
    const images = node.children.filter((c) => c.type === 'image' && !/^(figure|model):/.test(c.url));
    if (!images.some((i) => i.title) || node.children.some((c) => !images.includes(c) && (c.type !== 'text' || c.value.trim()))) return;
    const figure = (image) => ({
      type: 'element',
      tagName: 'figure',
      properties: { className: ['photo'] },
      children: [
        { type: 'element', tagName: 'img', properties: { src: image.url, alt: image.alt, loading: 'lazy' }, children: [] },
        image.title && { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: image.title }] },
      ].filter(Boolean),
    });
    parent.children[index] = {
      type: 'photoRow',
      position: node.position,
      data: { hName: 'div', hProperties: { className: ['photo-row'] }, hChildren: images.map(figure) },
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

// Top-level ## and ### headings get an id from their text, so that the table
// of contents beside a long item can point to them and a section can be
// linked: "Das Messprotokoll und das Cockpit" becomes
// #das-messprotokoll-und-das-cockpit. Headings with their own {#id} keep it.
function headingIds(tree) {
  const used = new Set();
  const text = (node) => node.value ?? (node.children ?? []).map(text).join('');
  for (const node of tree.children) {
    if (node.type !== 'heading' || node.depth < 2 || node.depth > 3 || /\{#[\w-]+\}\s*$/.test(lastText(node)?.value ?? '')) continue;
    const base =
      text(node)
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'section';
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
  }
}

function lastText(node) {
  const last = node.children[node.children.length - 1];
  return last?.type === 'text' ? last : undefined;
}
