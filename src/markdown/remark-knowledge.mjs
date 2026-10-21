// Remark plugin for the conventions of docs/knowledge-schema.md, section 6–7:
// [[id]] and [[id|text]] links, GitHub-style callouts, and quiz questions.
import { visit, SKIP } from 'unist-util-visit';
import { knowledgeIndex, locate } from './knowledge-index.mjs';

const CALLOUT = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/;
const WIKI = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;
const CALLOUT_TITLES = {
  de: { NOTE: 'Hinweis', TIP: 'Tipp', WARNING: 'Achtung', IMPORTANT: 'Wichtig', CAUTION: 'Vorsicht' },
  en: { NOTE: 'Note', TIP: 'Tip', WARNING: 'Warning', IMPORTANT: 'Important', CAUTION: 'Caution' },
};

export function remarkKnowledge() {
  return (tree, file) => {
    const where = locate(file.path ?? file.history?.[0]);
    if (!where) return;
    const index = knowledgeIndex();
    wikiLinks(tree, where.lang, index, file);
    callouts(tree, where.lang);
    if (index.get(where.id)?.type === 'quiz') quiz(tree);
  };
}

function wikiLinks(tree, lang, index, file) {
  visit(tree, 'text', (node, position, parent) => {
    if (!parent || position === undefined || !node.value.includes('[[')) return;
    const parts = [];
    let last = 0;
    for (const match of node.value.matchAll(WIKI)) {
      const [whole, id, text] = match;
      const target = index.get(id);
      if (!target) {
        // Reported again, with context, by src/lib/knowledge.ts; failing here
        // as well would hide the other errors of the same build.
        file.message(`Unknown link target [[${id}]]`);
        continue;
      }
      if (match.index > last) parts.push({ type: 'text', value: node.value.slice(last, match.index) });
      parts.push({
        type: 'link',
        url: `/${lang}/${target.section}/${id}/`,
        data: { hProperties: { className: ['wiki-link'], 'data-id': id } },
        children: [{ type: 'text', value: text ?? target.titles[lang] ?? target.titles.de ?? target.titles.en ?? id }],
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
  visit(tree, 'blockquote', (node) => {
    const first = node.children[0];
    const text = first?.type === 'paragraph' ? first.children[0] : undefined;
    const match = text?.type === 'text' ? text.value.match(CALLOUT) : null;
    if (!match) return;
    const kind = match[1];
    text.value = text.value.slice(match[0].length);
    if (!text.value) first.children.shift();
    if (!first.children.length) node.children.shift();
    node.data = { hName: 'aside', hProperties: { className: ['callout', `callout-${kind.toLowerCase()}`] } };
    node.children.unshift({
      type: 'paragraph',
      data: { hProperties: { className: ['callout-title'] } },
      children: [{ type: 'text', value: CALLOUT_TITLES[lang][kind] }],
    });
  });
}

// Each `##` section becomes one question: the task list holds the options
// ([x] marks correct ones), a blockquote after it the explanation.
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
        data: { hName: 'section', hProperties: { className: ['quiz-question'], 'data-question': explicit?.[1] ?? `q${number}` } },
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
      node.data = { hName: 'ul', hProperties: { className: ['quiz-options'], 'data-multiple': correct > 1 ? 'true' : 'false' } };
      for (const item of node.children) {
        item.data = { hProperties: { className: ['quiz-option'], 'data-correct': item.checked ? 'true' : 'false' } };
        item.checked = null;
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
