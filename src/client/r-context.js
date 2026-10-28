// What to suggest at the cursor of an R editor; r-complete.js shows it. No
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
const KIND_ORDER = { column: 0, variable: 1, table: 2, function: 3 };

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
 * functions there are, for `package::`; `offered` are the tables whose names
 * are suggested (all of them unless given). `force` asks even without two
 * typed letters (Ctrl+Space).
 */
export function suggest(text, cursor, { tables, functions, known = functions, offered = Object.keys(tables), force = false }) {
  const { start, word } = currentWord(text, cursor);
  if (/^[0-9]/.test(word)) return null;
  const names = Object.keys(tables);
  const before = scan(text.slice(0, cursor), names);
  if (before.inText) return null;
  const dollar = text[start - 1] === '$';
  const namespace = text.slice(start - 2, start) === '::';
  if (!force && !dollar && !namespace && word.length < 2) return null;

  const columnsOf = (table, extra = []) => [
    ...(tables[table] ?? []).map(([name, type]) => ({ name, kind: 'column', detail: `<${type}>` })),
    ...extra.map((name) => ({ name, kind: 'column', detail: '' })),
  ];
  const asFunction = ([name, signature, pkg]) => ({ name, kind: 'function', detail: signature, pkg });
  let items = [];
  if (namespace) {
    // package::function: every function of that package, used on the page or not
    const pkg = currentWord(text, start - 2).word;
    items = known.filter((f) => f[2] === pkg).map(asFunction);
  } else if (dollar) {
    // table$column: the name before $ says which table
    const owner = currentWord(text, start - 1).word;
    const known = before.tableOf.get(owner);
    if (names.includes(owner)) items = columnsOf(owner);
    else if (known) items = columnsOf(known.table, known.extra);
  } else {
    if (before.stack.length > 0 && before.table) items.push(...columnsOf(before.table, before.created));
    const everywhere = scan(text, names);
    items.push(...[...everywhere.assigned].map((name) => ({ name, kind: 'variable', detail: '' })));
    items.push(...offered.map((name) => ({ name, kind: 'table', detail: '' })));
    items.push(...functions.map(asFunction));
  }

  const prefix = word.toLowerCase();
  const seen = new Set();
  const matches = items.filter((item) => {
    if (seen.has(item.name) || item.name === word || !item.name.toLowerCase().startsWith(prefix)) return false;
    seen.add(item.name);
    return true;
  });
  // columns in the order of their table, everything else alphabetically
  matches.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || (a.kind === 'column' ? 0 : a.name.localeCompare(b.name)));
  return matches.length ? { start, end: cursor, items: matches } : null;
}
