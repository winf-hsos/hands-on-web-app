// What to suggest at the cursor of an R editor; complete.js shows it. No
// DOM, so that the tests run it in Node.
//
// The text before the cursor is read once from the start, as R would: names,
// strings, comments, brackets and the calls they belong to, assignments with
// <- and new columns made by mutate(). From that it follows whether the
// cursor sits after `table$` or `package::`, inside a call of a pipe that starts with a
// table (then its columns come first), or anywhere else.

const NAME_START = /[A-Za-z.]/;
const NAME_CHAR = /[A-Za-z0-9._]/;
// a line that ends like this goes on in the next one
const CONTINUES = /(\|>|%[^%\s]*%|[-+*/,&|!=([{]|<-)\s*$/;
// calls whose `name = value` arguments make new columns
const NEW_COLUMNS = new Set(['mutate', 'summarise', 'summarize', 'transmute', 'rename']);
const KIND_ORDER = { column: 0, variable: 1, table: 2, constant: 3, function: 4 };

/**
 * Reads R code from the start. `tables` are the names of known data sets.
 * Returns where the last statement begins, the open brackets, the table that
 * statement works on and the columns it adds, every name assigned with <-,
 * which tables the assigned names hold, and whether the text ends inside a
 * string or a comment.
 */
export function scan(code, tables) {
  const stack = [];
  const assigned = new Set();
  const tableOf = new Map();
  let table = null;
  let created = [];
  let pending = [];
  let lineStart = 0;
  let lastName = null;
  let i = 0;

  const endStatement = () => {
    for (const name of pending) if (table) tableOf.set(name, { table, extra: created });
    table = null;
    created = [];
    pending = [];
  };

  while (i < code.length) {
    const c = code[i];
    if (c === '#') {
      const end = code.indexOf('\n', i);
      if (end < 0) return { stack, table, created, assigned, tableOf, inText: true };
      i = end;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < code.length && code[j] !== c) j += code[j] === '\\' ? 2 : 1;
      if (j >= code.length) return { stack, table, created, assigned, tableOf, inText: true };
      i = j + 1;
      lastName = null;
      continue;
    }
    if (NAME_START.test(c) && !(c === '.' && /[0-9]/.test(code[i + 1] ?? ''))) {
      let j = i + 1;
      while (j < code.length && NAME_CHAR.test(code[j])) j++;
      const name = code.slice(i, j);
      // a name after `$` is a column, not a table or a variable
      if (code[i - 1] !== '$') {
        if (tables.includes(name)) table ??= name;
        else if (tableOf.has(name) && !table) {
          table = tableOf.get(name).table;
          created = [...tableOf.get(name).extra];
        }
      }
      lastName = { name, end: j };
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      while (i < code.length && /[0-9.eE]/.test(code[i])) i++;
      lastName = null;
      continue;
    }
    if (c === '(' || c === '[' || c === '{') {
      stack.push({ bracket: c, call: c === '(' && lastName?.end === i ? lastName.name : null });
      lastName = null;
      i++;
      continue;
    }
    if (c === ')' || c === ']' || c === '}') {
      stack.pop();
      lastName = null;
      i++;
      continue;
    }
    if (c === '<' && code[i + 1] === '-') {
      if (stack.length === 0 && lastName) {
        assigned.add(lastName.name);
        pending.push(lastName.name);
      }
      lastName = null;
      i += 2;
      continue;
    }
    if (c === '=' && code[i + 1] !== '=' && !'=<>!'.includes(code[i - 1])) {
      const call = stack.at(-1)?.call;
      if (lastName && call && NEW_COLUMNS.has(call)) created.push(lastName.name);
      else if (lastName && stack.length === 0) {
        assigned.add(lastName.name);
        pending.push(lastName.name);
      }
      lastName = null;
      i++;
      continue;
    }
    if (c === '\n') {
      const line = code.slice(lineStart, i).replace(/#.*$/, '');
      if (stack.length === 0 && !CONTINUES.test(line)) endStatement();
      lineStart = i + 1;
      i++;
      continue;
    }
    if (c === ';' && stack.length === 0) endStatement();
    if (!/\s/.test(c)) lastName = null;
    i++;
  }
  return { stack, table, created, assigned, tableOf, inText: false };
}

/** The name the cursor is in: where it starts and what has been typed of it. */
export function currentWord(text, cursor) {
  let start = cursor;
  while (start > 0 && NAME_CHAR.test(text[start - 1])) start--;
  return { start, word: text.slice(start, cursor) };
}

/**
 * Suggestions at `cursor`, or null when there is nothing to suggest.
 * `tables` maps a data set to its columns as [name, type]; `functions` are
 * [name, signature, package] of the packages that count here, `known` all
 * functions there are, for `package::`; `constants` are [name, type and
 * value, package or null]; `offered` are the tables whose names are suggested
 * (all of them unless given). `force` asks even without two typed letters
 * (Ctrl+Space); inside a call of a pipe one letter is enough.
 */
export function suggest(text, cursor, { tables, functions, known = functions, constants = [], offered = Object.keys(tables), force = false }) {
  const { start, word } = currentWord(text, cursor);
  if (/^[0-9]/.test(word)) return null;
  const names = Object.keys(tables);
  const before = scan(text.slice(0, cursor), names);
  if (before.inText) return null;
  const dollar = text[start - 1] === '$';
  const namespace = text.slice(start - 2, start) === '::';
  // inside a call of a pipe one letter is enough, since its columns come first
  // and a table such as the full survey has too many to remember
  const columnsHere = before.stack.length > 0 && Boolean(before.table);
  if (!force && !dollar && !namespace && word.length < (columnsHere ? 1 : 2)) return null;

  const columnsOf = (table, extra = []) => [
    ...(tables[table] ?? []).map(([name, type]) => ({ name, kind: 'column', detail: `<${type}>` })),
    ...extra.map((name) => ({ name, kind: 'column', detail: '' })),
  ];
  const asFunction = ([name, signature, pkg]) => ({ name, kind: 'function', detail: signature, pkg });
  const asConstant = ([name, value, pkg]) => ({ name, kind: 'constant', detail: value, pkg });
  let items = [];
  if (namespace) {
    // package::function: every function of that package, used on the page or not
    const pkg = currentWord(text, start - 2).word;
    items = [...known.filter((f) => f[2] === pkg).map(asFunction), ...constants.filter((k) => k[2] === pkg).map(asConstant)];
  } else if (dollar) {
    // table$column: the name before $ says which table
    const owner = currentWord(text, start - 1).word;
    const known = before.tableOf.get(owner);
    if (names.includes(owner)) items = columnsOf(owner);
    else if (known) items = columnsOf(known.table, known.extra);
  } else {
    if (columnsHere) items.push(...columnsOf(before.table, before.created));
    const everywhere = scan(text, names);
    items.push(...[...everywhere.assigned].map((name) => ({ name, kind: 'variable', detail: '' })));
    items.push(...offered.map((name) => ({ name, kind: 'table', detail: '' })));
    items.push(...constants.map(asConstant), ...functions.map(asFunction));
  }

  const prefix = word.toLowerCase();
  const seen = new Set();
  const matches = items.filter((item) => {
    if (seen.has(item.name) || item.name === word || !item.name.toLowerCase().startsWith(prefix)) return false;
    seen.add(item.name);
    return true;
  });
  // what is written as typed before what only matches in another case (D04
  // finds D044stadtf before d040luxus), then columns in the order of their
  // table and everything else alphabetically
  const exact = (item) => (item.name.startsWith(word) ? 0 : 1);
  matches.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || exact(a) - exact(b) || (a.kind === 'column' ? 0 : a.name.localeCompare(b.name)));
  return matches.length ? { start, end: cursor, items: matches } : null;
}

// --- indentation after Enter ------------------------------------------------------

// a line that ends like this goes on with the next step of a pipe or a plot
const CHAIN = /(\|>|%[^%\s]*%|\+)$/;
// a line without its strings and its comment, so that a bracket or # in a
// string does not count
const codeOf = (line) =>
  line
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""')
    .replace(/#.*$/, '')
    .trimEnd();
const indentOf = (line) => line.match(/^ */)[0];
// opening brackets minus closing ones
const balance = (line) => {
  const bare = codeOf(line);
  return (bare.match(/[([{]/g) ?? []).length - (bare.match(/[)\]}]/g) ?? []).length;
};

/**
 * The indentation of the line after `before` (the text up to the cursor), as
 * Positron does it: one level more after an opening bracket, and for the steps
 * of a pipe or a plot one level more than the line the statement started on,
 * however many steps came before (Nicolas, 2026-11-11: from the second step
 * on, Enter added a level each time). Where the statement ends, the next line
 * goes back to where it started.
 */
export function nextIndent(before, unit = '  ') {
  const lines = before.split('\n');
  const line = codeOf(lines.at(-1));
  const own = indentOf(lines.at(-1));
  if (/[([{]$/.test(line)) return own + unit;
  // an argument list going on: one level more only after the bracket opened here
  if (/,$/.test(line)) return balance(line) > 0 ? own + unit : own;
  // the line the statement started on: up past brackets closed in this line
  // and past the steps of a pipe or a plot before it
  let i = lines.length - 1;
  let depth = balance(lines[i]);
  while (i > 0 && (depth < 0 || CHAIN.test(codeOf(lines[i - 1])))) {
    i--;
    depth += balance(lines[i]);
  }
  return indentOf(lines[i]) + (CHAIN.test(line) ? unit : '');
}
