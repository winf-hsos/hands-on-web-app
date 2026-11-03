// A small highlighter for Python and R: enough for teaching code, not a full
// lexer. Used twice: by the build for code shown on the page, and by
// runner.js while someone edits code in the browser. No DOM, no dependencies.

const words = (text) => new Set(text.split(/\s+/));

const PYTHON = {
  keywords: words(
    'False None True and as assert async await break case class continue def del elif else except finally for from global if import in is lambda match nonlocal not or pass raise return try while with yield',
  ),
  builtins: words('abs all any bool dict enumerate float input int isinstance len list max min open print range reversed round set sorted str sum tuple type zip'),
  token: new RegExp(
    [
      /(?<comment>#[^\n]*)/,
      // a triple-quoted string runs over lines up to its end or, still being
      // typed, to the end of the code; `$` would stop it at the first line end
      /(?<string>[rRbBfFuU]{0,2}(?:"""[\s\S]*?(?:"""|(?![\s\S]))|'''[\s\S]*?(?:'''|(?![\s\S]))|"(?:\\.|[^"\\\n])*(?:"|$)|'(?:\\.|[^'\\\n])*(?:'|$)))/,
      /(?<number>\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/,
      /(?<name>[A-Za-z_][A-Za-z0-9_]*)/,
    ]
      .map((r) => r.source)
      .join('|'),
    'gm',
  ),
};

// R: the dplyr verbs and their helpers count as built-ins, since the lessons
// are about them; the pipe, %in% and the arrow as operators.
const R = {
  keywords: words('if else repeat while function for in next break TRUE FALSE NULL Inf NaN NA NA_integer_ NA_real_ NA_character_ return library'),
  builtins: words(
    'filter select mutate arrange summarize summarise group_by ungroup count rename relocate slice slice_head slice_tail slice_max slice_min distinct pull glimpse n n_distinct desc between if_else case_when across where starts_with ends_with contains matches everything last_col all_of any_of tibble as_tibble c mean median sum min max sd round is.na print head tail nrow ncol length unique sort paste paste0 nchar read.csv names str',
  ),
  token: new RegExp(
    [
      /(?<comment>#[^\n]*)/,
      /(?<string>"(?:\\.|[^"\\])*(?:"|$)|'(?:\\.|[^'\\])*(?:'|$))/,
      /(?<op>\|>|%[a-z]*%|<-)/,
      /(?<number>\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?L?\b)/,
      /(?<name>[A-Za-z.][A-Za-z0-9._]*)/,
    ]
      .map((r) => r.source)
      .join('|'),
    'gm',
  ),
};

const LANGS = { python: PYTHON, r: R };

/** Splits code into [{ type, text }]; type is null for plain text. */
export function tokenize(code, lang = 'python') {
  const { keywords, builtins, token } = LANGS[lang] ?? PYTHON;
  const tokens = [];
  let last = 0;
  let afterDef = false;
  for (const match of code.matchAll(token)) {
    if (match.index > last) tokens.push({ type: null, text: code.slice(last, match.index) });
    const [text] = match;
    const g = match.groups;
    let type = null;
    if (g.comment) type = 'comment';
    else if (g.string) type = 'string';
    else if (g.op) type = 'op';
    else if (g.number) type = 'number';
    else if (afterDef) type = 'function';
    else if (keywords.has(text)) type = 'keyword';
    else if (builtins.has(text)) type = 'builtin';
    afterDef = lang === 'python' && (text === 'def' || text === 'class');
    tokens.push({ type, text });
    last = match.index + text.length;
  }
  if (last < code.length) tokens.push({ type: null, text: code.slice(last) });
  return tokens;
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The code as HTML with <span class="tok-…"> around highlighted tokens. */
export const highlight = (code, lang = 'python') =>
  tokenize(code, lang)
    .map(({ type, text }) => (type ? `<span class="tok-${type}">${escape(text)}</span>` : escape(text)))
    .join('');
