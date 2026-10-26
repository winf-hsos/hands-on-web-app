// A small Python highlighter: enough for teaching code, not a full lexer.
// Used twice: by the build for code shown on the page, and by runner.js
// while someone edits code in the browser. No DOM, no dependencies.

const KEYWORDS = new Set(
  'False None True and as assert async await break case class continue def del elif else except finally for from global if import in is lambda match nonlocal not or pass raise return try while with yield'.split(' '),
);
const BUILTINS = new Set(
  'abs all any bool dict enumerate float input int isinstance len list max min open print range reversed round set sorted str sum tuple type zip'.split(' '),
);

const TOKEN = new RegExp(
  [
    /(?<comment>#[^\n]*)/,
    /(?<string>[rRbBfFuU]{0,2}(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*(?:"|$)|'(?:\\.|[^'\\\n])*(?:'|$)))/,
    /(?<number>\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/,
    /(?<name>[A-Za-z_][A-Za-z0-9_]*)/,
  ]
    .map((r) => r.source)
    .join('|'),
  'gm',
);

/** Splits code into [{ type, text }]; type is null for plain text. */
export function tokenize(code) {
  const tokens = [];
  let last = 0;
  let afterDef = false;
  for (const match of code.matchAll(TOKEN)) {
    if (match.index > last) tokens.push({ type: null, text: code.slice(last, match.index) });
    const [text] = match;
    const g = match.groups;
    let type = null;
    if (g.comment) type = 'comment';
    else if (g.string) type = 'string';
    else if (g.number) type = 'number';
    else if (afterDef) type = 'function';
    else if (KEYWORDS.has(text)) type = 'keyword';
    else if (BUILTINS.has(text)) type = 'builtin';
    afterDef = text === 'def' || text === 'class';
    tokens.push({ type, text });
    last = match.index + text.length;
  }
  if (last < code.length) tokens.push({ type: null, text: code.slice(last) });
  return tokens;
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The code as HTML with <span class="tok-…"> around highlighted tokens. */
export const highlight = (code) =>
  tokenize(code)
    .map(({ type, text }) => (type ? `<span class="tok-${type}">${escape(text)}</span>` : escape(text)))
    .join('');
