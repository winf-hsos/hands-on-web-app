// What to suggest at the cursor of a Python editor; complete.js shows it. No
// DOM, so that the tests run it in Node.
//
// The editors teach beginners, so the list is small and fixed: the keywords,
// the built-in functions, the methods of text, lists and dictionaries, the
// modules math and random, and the names the code itself defines. After a
// dot it offers the methods of what stands before it, as far as the code
// shows its type, or the contents of an imported module.

const KEYWORDS = ['and', 'as', 'break', 'class', 'continue', 'def', 'elif', 'else', 'False', 'for', 'from', 'if', 'import', 'in', 'is', 'None', 'not', 'or', 'pass', 'return', 'True', 'while', 'with'];

// [name, signature]
const BUILTINS = [
  ['abs', 'abs(x)'], ['bool', 'bool(x)'], ['dict', 'dict()'], ['enumerate', 'enumerate(iterable)'], ['float', 'float(x)'],
  ['input', 'input(prompt)'], ['int', 'int(x)'], ['len', 'len(s)'], ['list', 'list(iterable)'], ['max', 'max(iterable)'],
  ['min', 'min(iterable)'], ['print', 'print(*values, sep=" ", end="\\n")'], ['range', 'range(start, stop, step)'],
  ['round', 'round(number, ndigits)'], ['sorted', 'sorted(iterable)'], ['str', 'str(x)'], ['sum', 'sum(iterable)'],
  ['type', 'type(x)'], ['zip', 'zip(*iterables)'],
];

// [name, signature] by type
const METHODS = {
  str: [
    ['capitalize', 'capitalize()'], ['count', 'count(sub)'], ['endswith', 'endswith(suffix)'], ['find', 'find(sub)'],
    ['format', 'format(*args)'], ['isdigit', 'isdigit()'], ['join', 'join(iterable)'], ['lower', 'lower()'],
    ['replace', 'replace(old, new)'], ['split', 'split(sep)'], ['startswith', 'startswith(prefix)'], ['strip', 'strip()'],
    ['title', 'title()'], ['upper', 'upper()'],
  ],
  list: [
    ['append', 'append(x)'], ['clear', 'clear()'], ['copy', 'copy()'], ['count', 'count(x)'], ['extend', 'extend(iterable)'],
    ['index', 'index(x)'], ['insert', 'insert(i, x)'], ['pop', 'pop(i)'], ['remove', 'remove(x)'], ['reverse', 'reverse()'],
    ['sort', 'sort()'],
  ],
  dict: [['get', 'get(key, default)'], ['items', 'items()'], ['keys', 'keys()'], ['pop', 'pop(key)'], ['update', 'update(other)'], ['values', 'values()']],
  int: [],
  float: [['is_integer', 'is_integer()']],
};

// [name, signature or value]; a value marks a constant
const MODULES = {
  math: [['ceil', 'ceil(x)'], ['floor', 'floor(x)'], ['sqrt', 'sqrt(x)'], ['pow', 'pow(x, y)'], ['log', 'log(x, base)'], ['pi', '3.14159…', true], ['e', '2.71828…', true]],
  random: [['choice', 'choice(seq)'], ['randint', 'randint(a, b)'], ['random', 'random()'], ['shuffle', 'shuffle(list)'], ['seed', 'seed(a)']],
};

const NAME_CHAR = /[A-Za-z0-9_]/;
const KIND_ORDER = { variable: 0, function: 1, module: 2, method: 3, constant: 4, keyword: 5 };

/** The type a right-hand side shows at its start, or null. */
function typeOf(value, types) {
  const v = value.trim();
  if (/^[rbf]?["']/i.test(v)) return 'str';
  if (/^\[/.test(v)) return 'list';
  if (/^\{/.test(v)) return 'dict';
  if (/^-?\d+\.\d*/.test(v)) return 'float';
  if (/^-?\d+\s*$/.test(v)) return 'int';
  const call = v.match(/^(\w+)\(/)?.[1];
  if (['str', 'input'].includes(call)) return 'str';
  if (['int', 'len', 'round'].includes(call)) return 'int';
  if (call === 'float') return 'float';
  if (['list', 'sorted'].includes(call)) return 'list';
  if (call === 'dict') return 'dict';
  // the method of a text that gives text again, as in name = name.strip()
  const method = v.match(/^\w+\.(\w+)\(/)?.[1];
  if (method && ['strip', 'upper', 'lower', 'title', 'replace', 'capitalize'].includes(method)) return 'str';
  if (method === 'split') return 'list';
  return types.get(v.match(/^(\w+)\s*$/)?.[1]) ?? null;
}

/**
 * Reads Python code: the names it assigns (with their type where it shows),
 * the functions it defines, their parameters, the names of for loops and the
 * imported modules. Strings and comments are skipped line by line.
 */
export function scan(code) {
  const variables = new Set();
  const functions = new Set();
  const modules = new Set();
  const types = new Map();
  for (const raw of code.split('\n')) {
    const line = raw.replace(/#.*$/, '');
    let m;
    if ((m = line.match(/^\s*def\s+(\w+)\s*\(([^)]*)/))) {
      functions.add(m[1]);
      for (const p of m[2].split(',')) if (p.trim()) variables.add(p.trim().split(/[=:\s]/)[0]);
    }
    if ((m = line.match(/^\s*for\s+([\w\s,]+?)\s+in\b/))) for (const n of m[1].split(',')) variables.add(n.trim());
    if ((m = line.match(/^\s*import\s+([\w\s,]+)/))) for (const n of m[1].split(',')) modules.add(n.trim().split(/\s+as\s+/).pop());
    if ((m = line.match(/^\s*from\s+(\w+)\s+import\s+([\w\s,]+)/))) for (const n of m[2].split(',')) variables.add(n.trim());
    if ((m = line.match(/^\s*([\w\s,]+?)\s*(?:[-+*/]?=)(?!=)\s*(.*)$/)) && !/^\s*(if|elif|while|return|def|for)\b/.test(line)) {
      const names = m[1].split(',').map((n) => n.trim()).filter((n) => /^[A-Za-z_]\w*$/.test(n));
      for (const n of names) variables.add(n);
      if (names.length === 1) {
        const type = typeOf(m[2], types);
        if (type) types.set(names[0], type);
      }
    }
  }
  for (const f of functions) variables.delete(f);
  return { variables, functions, modules, types };
}

/** Whether the cursor sits inside a string or a comment of its line. */
function inText(line) {
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
    } else if (c === '#') return true;
    else if (c === '"' || c === "'") quote = c;
  }
  return quote !== null;
}

/** The name the cursor is in: where it starts and what has been typed of it. */
export function currentWord(text, cursor) {
  let start = cursor;
  while (start > 0 && NAME_CHAR.test(text[start - 1])) start--;
  return { start, word: text.slice(start, cursor) };
}

/**
 * Suggestions at `cursor`, or null when there is nothing to suggest. `force`
 * asks even without two typed letters (Ctrl+Space). `pageCode` is the code
 * of the other editors on the page, whose names count here as well.
 */
export function suggest(text, cursor, { force = false, pageCode = '' } = {}) {
  const { start, word } = currentWord(text, cursor);
  if (/^[0-9]/.test(word)) return null;
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  if (inText(text.slice(lineStart, start))) return null;
  const dot = text[start - 1] === '.';
  if (!force && !dot && word.length < 2) return null;

  const known = scan(`${pageCode}\n${text}`);
  const asFunction = (kind) => ([name, detail, constant]) => ({ name, kind: constant ? 'constant' : kind, detail });
  let items = [];
  if (dot) {
    const before = text.slice(lineStart, start - 1);
    const owner = before.match(/(\w+)$/)?.[1];
    if (owner && (known.modules.has(owner) || (MODULES[owner] && !known.variables.has(owner)))) {
      items = MODULES[owner]?.map(asFunction('function')) ?? [];
    } else {
      // the type of the name, or of a text or list written right there
      const type = /["']$/.test(before) ? 'str' : /\]$/.test(before) ? 'list' : known.types.get(owner);
      const types = type ? [type] : ['str', 'list', 'dict'];
      items = types.flatMap((t) => METHODS[t].map(([name, detail]) => ({ name, kind: 'method', detail: type ? detail : `${t}.${detail}` })));
    }
  } else {
    items.push(...[...known.variables].map((name) => ({ name, kind: 'variable', detail: known.types.get(name) ?? '' })));
    items.push(...[...known.functions].map((name) => ({ name, kind: 'function', detail: '' })));
    items.push(...[...known.modules].map((name) => ({ name, kind: 'module', detail: '' })));
    items.push(...BUILTINS.map(asFunction('function')));
    items.push(...KEYWORDS.map((name) => ({ name, kind: 'keyword', detail: '' })));
  }

  const prefix = word.toLowerCase();
  const seen = new Set();
  const matches = items.filter((item) => {
    if (seen.has(item.name) || item.name === word || !item.name.toLowerCase().startsWith(prefix)) return false;
    seen.add(item.name);
    return true;
  });
  matches.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.name.localeCompare(b.name));
  return matches.length ? { start, end: cursor, items: matches } : null;
}
