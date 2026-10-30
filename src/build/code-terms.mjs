// Every page the build writes passes through codeInHtml(): in its text,
// names of functions and packages become <code> (client/code-terms.js says
// which). Only text between tags changes; attributes, scripts, styles and
// elements that are code already or cannot hold <code> stay as they are.
import { codeParts } from '../client/code-terms.js';

// <code> inside these would be wrong or is not allowed
const SKIP = new Set(['code', 'pre', 'kbd', 'samp', 'script', 'style', 'title', 'textarea', 'option', 'svg', 'math']);
const TAG = /<(\/?)([a-zA-Z][\w-]*)[^>]*?(\/?)>/g;

// The text is still escaped HTML; names and backticks are not touched by
// escaping, so the pieces can be wrapped as they are.
function codeInText(text) {
  const parts = codeParts(text);
  if (!parts.some((p) => p.code)) return text;
  return parts.map((p) => (p.code ? `<code>${p.text}</code>` : p.text)).join('');
}

export function codeInHtml(html) {
  let out = '';
  let last = 0;
  const open = []; // skipped elements we are inside
  for (const match of html.matchAll(TAG)) {
    const [whole, closing, rawName, selfClosing] = match;
    const name = rawName.toLowerCase();
    const text = html.slice(last, match.index);
    out += open.length ? text : codeInText(text);
    out += whole;
    last = match.index + whole.length;
    if (!SKIP.has(name) || selfClosing) continue;
    if (closing) {
      const at = open.lastIndexOf(name);
      if (at >= 0) open.splice(at);
    } else {
      open.push(name);
    }
  }
  const rest = html.slice(last);
  return out + (open.length ? rest : codeInText(rest));
}
