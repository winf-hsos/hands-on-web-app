// The folder tree and the command line of the demonstrator "Ordnerbaum und
// Kommandozeile" (client/shell-demo.js), without anything on the screen, so
// that tests can run it (tests/shell-model.test.mjs).
//
// A small file system lives in memory: C:\Users\anna on Windows, /Users/anna
// on a Mac, with the scenario's tree inside. The shell knows the commands of
// the learning path "Die Kommandozeile" in PowerShell and in zsh, answers
// with the messages the real shells print (PowerShell in the language of the
// page, zsh always in English), and for what is being typed it works out
// which way through the tree a path takes, so the tree can light it up
// before Enter.

export const PLATFORMS = ['windows', 'mac'];
const HOME = ['Users', 'anna'];

// PowerShell answers in the language of Windows; the first line of each
// message, as Windows PowerShell 5.1 writes it.
const PS = {
  de: {
    notFound: (cmd, p) => `${cmd} : Der Pfad "${p}" kann nicht gefunden werden, da er nicht vorhanden ist.`,
    unknown: (c) => `${c} : Die Benennung "${c}" wurde nicht als Name eines Cmdlet, einer Funktion, einer Skriptdatei oder eines ausführbaren Programms erkannt.`,
    extra: (cmd, a) => `${cmd} : Es wurde kein Positionsparameter gefunden, der das Argument "${a}" akzeptiert.`,
    exists: (p) => `New-Item : Es ist bereits ein Element mit dem angegebenen Namen "${p}" vorhanden.`,
    fileExists: (p) => `New-Item : Die Datei "${p}" ist bereits vorhanden.`,
    moveExists: () => 'Move-Item : Eine Datei kann nicht erstellt werden, wenn sie bereits vorhanden ist.',
    denied: (p) => `Get-Content : Der Zugriff auf den Pfad "${p}" wurde verweigert.`,
    directory: 'Verzeichnis:',
  },
  en: {
    notFound: (cmd, p) => `${cmd} : Cannot find path '${p}' because it does not exist.`,
    unknown: (c) => `${c} : The term '${c}' is not recognized as the name of a cmdlet, function, script file, or operable program.`,
    extra: (cmd, a) => `${cmd} : A positional parameter cannot be found that accepts argument '${a}'.`,
    exists: (p) => `New-Item : An item with the specified name ${p} already exists.`,
    fileExists: (p) => `New-Item : The file '${p}' already exists.`,
    moveExists: () => 'Move-Item : Cannot create a file when that file already exists.',
    denied: (p) => `Get-Content : Access to the path '${p}' is denied.`,
    directory: 'Directory:',
  },
};

// What the demonstrator adds in its own words, in grey, where a real shell
// would ask back or do something the demonstrator cannot.
const NOTES = {
  de: {
    notEmpty: 'PowerShell fragt hier nach, weil der Ordner nicht leer ist; der Demonstrator antwortet mit Nein. Mit rm -Recurse löschst du ihn samt Inhalt.',
    emptyCopy: 'Ohne -Recurse kopiert PowerShell nur den leeren Ordner, ohne seinen Inhalt.',
    inUse: 'Du stehst in diesem Ordner oder darunter; geh erst hinaus, dann lässt er sich löschen.',
    needsName: (c) => `${c} braucht einen Namen oder Pfad.`,
    noOptions: (o) => `Die Option ${o} kennt dieser Demonstrator nicht.`,
    repl: 'Ohne Datei startet Python seine eigene Eingabe (>>>); das probierst du besser in deinem Terminal.',
    noRun: 'Dieses Programm liest Eingaben oder rechnet; im Demonstrator läuft nur print mit festem Text. Starte es in deinem Terminal.',
    into: 'Dateien verschieben und kopieren lässt sich nur in einen Ordner, der nicht in der Quelle liegt.',
  },
  en: {
    notEmpty: 'PowerShell asks here because the folder is not empty; the demo answers no. With rm -Recurse you delete it with everything in it.',
    emptyCopy: 'Without -Recurse PowerShell copies only the empty folder, not what is in it.',
    inUse: 'You are standing in this folder or below it; step out first, then it can be deleted.',
    needsName: (c) => `${c} needs a name or a path.`,
    noOptions: (o) => `This demo does not know the option ${o}.`,
    repl: 'Without a file Python starts its own prompt (>>>); try that in your own terminal.',
    noRun: 'This program reads input or calculates; the demo only runs print with fixed text. Run it in your own terminal.',
    into: 'A folder cannot be moved or copied into itself.',
  },
};

// The commands, by every name they go by; Windows PowerShell has no touch
// and no python3, a Mac has no python, and both say so.
const COMMANDS = {
  windows: {
    cd: 'cd', 'set-location': 'cd', sl: 'cd', chdir: 'cd',
    ls: 'ls', dir: 'ls', gci: 'ls', 'get-childitem': 'ls',
    pwd: 'pwd', 'get-location': 'pwd', gl: 'pwd',
    mkdir: 'mkdir', md: 'mkdir',
    'new-item': 'newitem', ni: 'newitem',
    cp: 'cp', copy: 'cp', cpi: 'cp', 'copy-item': 'cp',
    mv: 'mv', move: 'mv', mi: 'mv', 'move-item': 'mv',
    rm: 'rm', del: 'rm', erase: 'rm', ri: 'rm', rmdir: 'rm', rd: 'rm', 'remove-item': 'rm',
    cat: 'cat', type: 'cat', gc: 'cat', 'get-content': 'cat',
    echo: 'echo', write: 'echo', 'write-output': 'echo',
    clear: 'clear', cls: 'clear', 'clear-host': 'clear',
    python: 'python', py: 'python',
  },
  mac: {
    cd: 'cd', ls: 'ls', pwd: 'pwd', mkdir: 'mkdir', touch: 'touch', cp: 'cp', mv: 'mv',
    rm: 'rm', rmdir: 'rmdir', cat: 'cat', echo: 'echo', clear: 'clear', python3: 'python',
  },
};
// the cmdlet a PowerShell alias stands for, as its messages name it
const CMDLET = { cd: 'Set-Location', ls: 'Get-ChildItem', cat: 'Get-Content', rm: 'Remove-Item', cp: 'Copy-Item', mv: 'Move-Item', mkdir: 'New-Item', newitem: 'New-Item' };
// commands whose arguments are folders only (Tab and the preview)
export const FOLDER_COMMANDS = new Set(['cd', 'rmdir']);

const lower = (s) => s.toLowerCase();
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const within = (inner, outer) => inner.length >= outer.length && outer.every((x, i) => lower(x) === lower(inner[i]));
const bytes = (text) => new TextEncoder().encode(text).length;

let ids = 0;
const folder = (name, children = []) => ({ id: ++ids, name, dir: true, children });
const file = (name, text = '') => ({ id: ++ids, name, dir: false, text });

/** The scenario's tree ({ name: {...} } is a folder, { name: "text" } a file) as nodes. */
function build(tree) {
  return Object.entries(tree ?? {}).map(([name, value]) =>
    value !== null && typeof value === 'object' ? folder(name, build(value)) : file(name, value == null ? '' : String(value)),
  );
}

/** Words of a command line: blanks separate, quotes keep together, and in zsh a backslash too. */
export function words(line, platform) {
  const out = [];
  let word = null;
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) quote = null;
      else word.text += c;
    } else if (c === '"' || c === "'") {
      word ??= { text: '', start: i, quoted: true };
      word.quoted = true;
      quote = c;
    } else if (c === '\\' && platform === 'mac' && i + 1 < line.length) {
      word ??= { text: '', start: i };
      word.text += line[++i];
    } else if (/\s/.test(c)) {
      if (word) out.push({ ...word, end: i });
      word = null;
    } else {
      word ??= { text: '', start: i };
      word.text += c;
    }
  }
  if (word) out.push({ ...word, end: line.length, open: Boolean(quote) });
  return out;
}

export function createShell({ tree, start = '~' } = {}, { platform = 'windows', lang = 'de', now = new Date() } = {}) {
  const root = folder('', [folder('Users', [folder('anna', build(tree))])]);
  let cwd = HOME;
  let os = platform;
  const ps = () => PS[lang] ?? PS.en;
  const notes = NOTES[lang] ?? NOTES.en;

  const node = (path) => path.reduce((n, name) => (n?.dir ? n.children.find((c) => lower(c.name) === lower(name)) : undefined), root);
  const sep = () => (os === 'windows' ? '\\' : '/');
  const absolute = (path) => (os === 'windows' ? `C:\\${path.join('\\')}` : `/${path.join('/')}`);

  /**
   * Where a path leads from the current folder, step by step: every step is
   * the folder or file reached, so the tree can draw the way. `missing` is
   * the name that is not there, `throughFile` a file the path tries to pass.
   */
  function resolve(text, from = cwd) {
    let rest = text;
    let at = from;
    const jumps = [];
    if (os === 'windows' && /^[a-z]:([\\/]|$)/i.test(rest)) {
      at = [];
      jumps.push('root');
      rest = rest.slice(2);
    } else if (rest.startsWith(os === 'windows' ? '\\' : '/') || (os === 'windows' && rest.startsWith('/'))) {
      at = [];
      jumps.push('root');
    } else if (rest === '~' || /^~[\\/]/.test(rest)) {
      at = HOME;
      jumps.push('home');
      rest = rest.slice(1);
    }
    const parts = rest.split(os === 'windows' ? /[\\/]/ : /\//).filter((p) => p && p !== '.');
    const steps = [{ path: at, move: jumps[0] ?? 'start' }];
    for (const [i, part] of parts.entries()) {
      const here = node(at);
      if (!here.dir) return { steps, path: at, throughFile: at, rest: parts.slice(i) };
      if (part === '..') {
        if (!at.length) continue;
        at = at.slice(0, -1);
        steps.push({ path: at, move: 'up' });
        continue;
      }
      const child = here.children.find((c) => lower(c.name) === lower(part));
      if (!child) return { steps, path: at, missing: part, last: i === parts.length - 1, rest: parts.slice(i) };
      at = [...at, child.name];
      steps.push({ path: at, move: 'down' });
    }
    return { steps, path: at, node: node(at) };
  }

  /** The path from the current folder to `path`, as someone would type it. */
  function relative(path) {
    let common = 0;
    while (common < cwd.length && common < path.length && lower(cwd[common]) === lower(path[common])) common++;
    const parts = [...Array(cwd.length - common).fill('..'), ...path.slice(common)];
    const text = parts.length ? parts.join(sep()) : '.';
    return /\s/.test(text) ? `"${text}"` : text;
  }

  /** The tree as rows, folders before files, each with its depth. */
  function rows() {
    const out = [];
    const sorted = (children) => [...children].sort((a, b) => b.dir - a.dir || a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    const walk = (n, path) => {
      out.push({ id: n.id, name: path.length ? n.name : os === 'windows' ? 'C:\\' : '/', dir: n.dir, path, depth: path.length });
      if (n.dir) for (const c of sorted(n.children)) walk(c, [...path, c.name]);
    };
    walk(root, []);
    return out;
  }

  // --- what the commands print ------------------------------------------------

  const stamp = () => {
    const d = now;
    const two = (n) => String(n).padStart(2, '0');
    if (lang === 'de') return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}     ${two(d.getHours())}:${two(d.getMinutes())}`;
    const h = d.getHours() % 12 || 12;
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}  ${String(h).padStart(2)}:${two(d.getMinutes())} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
  };

  // PowerShell's table of items, as ls, mkdir and New-Item print it
  function table(where, items) {
    if (!items.length) return [];
    const sorted = [...items].sort((a, b) => b.dir - a.dir || a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    return [
      '',
      `    ${ps().directory} ${absolute(where)}`,
      '',
      '',
      'Mode                 LastWriteTime         Length Name',
      '----                 -------------         ------ ----',
      ...sorted.map((n) => `${n.dir ? 'd-----' : '-a----'}${stamp().padStart(28)}${(n.dir ? '' : String(bytes(n.text))).padStart(15)} ${n.name}`),
      '',
    ];
  }

  // zsh's ls: the names side by side, in columns as wide as the longest
  function columns(items) {
    const names = items.map((n) => n.name).sort();
    if (!names.length) return [];
    const width = Math.max(...names.map((n) => n.length)) + 2;
    const perLine = Math.max(1, Math.floor(64 / width));
    const lines = [];
    for (let i = 0; i < names.length; i += perLine) lines.push(names.slice(i, i + perLine).map((n) => n.padEnd(width)).join('').trimEnd());
    return lines;
  }

  // --- changing the tree ------------------------------------------------------

  const effects = () => ({ added: [], removed: [], moved: [] });

  function makeFolder(path, parents, fx) {
    let at = [];
    for (const name of path) {
      const here = node(at);
      let next = here.children.find((c) => lower(c.name) === lower(name));
      if (!next) {
        if (!parents && at.length < path.length - 1) return null;
        next = folder(name);
        here.children.push(next);
        fx.added.push(next.id);
      }
      at = [...at, next.name];
    }
    return node(at);
  }

  function copy(n) {
    return n.dir ? folder(n.name, n.children.map(copy)) : file(n.name, n.text);
  }

  function detach(path) {
    const parent = node(path.slice(0, -1));
    const i = parent.children.findIndex((c) => lower(c.name) === lower(path.at(-1)));
    return parent.children.splice(i, 1)[0];
  }

  const allIds = (n) => [n.id, ...(n.dir ? n.children.flatMap(allIds) : [])];

  // --- the commands ---------------------------------------------------------

  const ok = (lines = [], fx = effects()) => ({ output: lines.map((text) => ({ kind: 'out', text })), ...fx });
  const err = (text, fx = effects()) => ({ output: [{ kind: 'err', text }], ...fx });
  const note = (text, fx = effects()) => ({ output: [{ kind: 'note', text }], ...fx });

  // a path a command needs to exist, or the shell's message that it does not
  function existing(cmd, arg, name) {
    const r = resolve(arg);
    if (r.node) return { r };
    if (os === 'windows') return { error: err(ps().notFound(CMDLET[cmd] ?? cmd, absolute([...r.path, ...r.rest]))) };
    const what = r.throughFile ? 'Not a directory' : 'No such file or directory';
    return { error: err(`${name}: ${arg}: ${what}`) };
  }

  // where a new item goes: the folder it goes into and its name
  function place(arg) {
    const r = resolve(arg);
    if (r.node) return { r, exists: true, parent: r.path.slice(0, -1), name: r.path.at(-1) };
    if (r.missing && r.last) return { r, parent: r.path, name: r.missing };
    return { r, broken: true };
  }

  const RUN = {
    cd(args) {
      if (args.length > 1) return os === 'windows' ? err(ps().extra('Set-Location', args[1].text)) : err(`cd: string not in pwd: ${args[0].text}`);
      const target = args[0]?.text ?? '~';
      const r = resolve(target);
      if (!r.node) {
        if (os === 'windows') return err(ps().notFound('Set-Location', absolute([...r.path, ...r.rest])));
        return err(r.throughFile ? `cd: not a directory: ${target}` : `cd: no such file or directory: ${target}`);
      }
      if (!r.node.dir) return os === 'windows' ? err(ps().notFound('Set-Location', absolute(r.path))) : err(`cd: not a directory: ${target}`);
      const from = cwd;
      cwd = r.path;
      return { ...ok(), from, to: cwd };
    },
    pwd() {
      return os === 'windows' ? ok(['', 'Path', '----', absolute(cwd), '']) : ok([absolute(cwd)]);
    },
    ls(args) {
      if (args.length > 1 && os === 'windows') return err(ps().extra('Get-ChildItem', args[1].text));
      const targets = args.length ? args : [{ text: '.' }];
      const lines = [];
      for (const [i, a] of targets.entries()) {
        const { r, error } = existing('ls', a.text, 'ls');
        if (error) return error;
        if (os === 'windows') lines.push(...(r.node.dir ? table(r.path, r.node.children) : table(r.path.slice(0, -1), [r.node])));
        else {
          if (targets.length > 1) lines.push(...(i ? [''] : []), `${a.text}:`);
          lines.push(...(r.node.dir ? columns(r.node.children) : [a.text]));
        }
      }
      return ok(lines);
    },
    mkdir(args, flags) {
      if (!args.length) return os === 'windows' ? note(notes.needsName('mkdir')) : err('usage: mkdir [-p] directory_name ...');
      const fx = effects();
      const lines = [];
      for (const a of args) {
        const p = place(a.text);
        if (p.exists) {
          if (os === 'windows') return err(ps().exists(absolute(p.r.path)), fx);
          if (!flags.has('p')) return err(`mkdir: ${a.text}: File exists`, fx);
          continue;
        }
        // PowerShell and mkdir -p make the folders on the way as well
        const parents = os === 'windows' || flags.has('p');
        const r = resolve(a.text);
        if (r.throughFile) return err(os === 'windows' ? ps().notFound('New-Item', absolute(r.path)) : `mkdir: ${a.text}: Not a directory`, fx);
        const made = makeFolder([...r.path, ...r.rest], parents, fx);
        if (!made) return err(`mkdir: ${a.text}: No such file or directory`, fx);
        if (os === 'windows') lines.push(...table([...r.path, ...r.rest].slice(0, -1), [made]));
      }
      return ok(lines, fx);
    },
    newitem(args, flags, options) {
      if (!args.length) return note(notes.needsName('New-Item'));
      const type = lower(options.itemtype ?? 'file');
      if (type.startsWith('d')) return RUN.mkdir(args, flags);
      const fx = effects();
      const lines = [];
      for (const a of args) {
        const p = place(a.text);
        if (p.exists) return err(p.r.node.dir ? ps().exists(absolute(p.r.path)) : ps().fileExists(absolute(p.r.path)), fx);
        if (p.broken) return err(ps().notFound('New-Item', absolute([...p.r.path, ...p.r.rest].slice(0, -1))), fx);
        const n = file(p.name);
        node(p.parent).children.push(n);
        fx.added.push(n.id);
        lines.push(...table(p.parent, [n]));
      }
      return ok(lines, fx);
    },
    touch(args) {
      if (!args.length) return err('usage: touch file ...');
      const fx = effects();
      for (const a of args) {
        const p = place(a.text);
        if (p.exists) continue; // touch only renews the time of an existing file
        if (p.broken) return err(`touch: ${a.text}: No such file or directory`, fx);
        const n = file(p.name);
        node(p.parent).children.push(n);
        fx.added.push(n.id);
      }
      return ok([], fx);
    },
    cp(args, flags) {
      return transfer('cp', args, flags);
    },
    mv(args, flags) {
      return transfer('mv', args, flags);
    },
    rm(args, flags) {
      if (!args.length) return os === 'windows' ? note(notes.needsName('rm')) : err('usage: rm [-r] file ...');
      const fx = effects();
      const recurse = flags.has('r') || flags.has('recurse') || flags.has('R');
      for (const a of args) {
        const { r, error } = existing('rm', a.text, 'rm');
        if (error) return { ...error, ...fx };
        if (!r.path.length || within(cwd, r.path)) return note(notes.inUse, fx);
        if (r.node.dir && !recurse) {
          if (os === 'mac') return err(`rm: ${a.text}: is a directory`, fx);
          if (r.node.children.length) return note(notes.notEmpty, fx);
        }
        fx.removed.push(...allIds(detach(r.path)));
      }
      return ok([], fx);
    },
    rmdir(args) {
      if (!args.length) return err('usage: rmdir directory ...');
      const fx = effects();
      for (const a of args) {
        const { r, error } = existing('rmdir', a.text, 'rmdir');
        if (error) return error;
        if (!r.node.dir) return err(`rmdir: ${a.text}: Not a directory`, fx);
        if (r.node.children.length) return err(`rmdir: ${a.text}: Directory not empty`, fx);
        if (within(cwd, r.path)) return note(notes.inUse, fx);
        fx.removed.push(...allIds(detach(r.path)));
      }
      return ok([], fx);
    },
    cat(args) {
      if (!args.length) return note(notes.needsName('cat'));
      const lines = [];
      for (const a of args) {
        const { r, error } = existing('cat', a.text, 'cat');
        if (error) return error;
        if (r.node.dir) return err(os === 'windows' ? ps().denied(absolute(r.path)) : `cat: ${a.text}: Is a directory`);
        if (r.node.text) lines.push(...r.node.text.replace(/\n$/, '').split('\n'));
      }
      return ok(lines);
    },
    echo(args, flags, options, redirect) {
      const text = args.map((a) => a.text).join(' ');
      if (!redirect) return ok([text]);
      const fx = effects();
      const p = place(redirect.target);
      if (p.broken || (p.exists && p.r.node.dir)) {
        if (os === 'windows') return err(ps().notFound('Out-File', absolute([...p.r.path, ...(p.r.rest ?? [])])));
        return err(`zsh: ${p.exists ? 'is a directory' : 'no such file or directory'}: ${redirect.target}`);
      }
      const content = `${text}\n`;
      if (p.exists) p.r.node.text = redirect.append ? p.r.node.text + content : content;
      else {
        const n = file(p.name, content);
        node(p.parent).children.push(n);
        fx.added.push(n.id);
      }
      return ok([], fx);
    },
    python(args, flags, options, redirect, word) {
      if (flags.has('version') || flags.has('V')) return ok(['Python 3.13.1']);
      if (!args.length) return note(notes.repl);
      const r = resolve(args[0].text);
      if (!r.node || r.node.dir) {
        const where = absolute(r.node ? r.path : [...r.path, ...(r.rest ?? [])]);
        const shown = os === 'windows' ? where.replaceAll('\\', '\\\\') : where;
        return err(`${word}: can't open file '${shown}': [Errno ${r.node ? 13 : 2}] ${r.node ? 'Permission denied' : 'No such file or directory'}`);
      }
      // print with fixed text runs; anything else belongs in a real terminal
      const lines = r.node.text.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
      const printed = lines.map((l) => l.trim().match(/^print\((["'])(.*)\1\)$/)?.[2]);
      return printed.every((p) => p !== undefined) ? ok(printed) : note(notes.noRun);
    },
  };

  function transfer(cmd, args, flags) {
    const recurse = flags.has('r') || flags.has('recurse') || flags.has('R');
    const name = os === 'windows' ? CMDLET[cmd] : cmd;
    if (args.length < 2) return os === 'windows' ? note(notes.needsName(cmd)) : err(`usage: ${cmd} source target`);
    if (args.length > 2 && os === 'windows') return err(ps().extra(name, args[2].text));
    const [src, dst] = [args[0], args.at(-1)];
    const fx = effects();
    const s = resolve(src.text);
    if (!s.node) {
      if (os === 'windows') return err(ps().notFound(name, absolute([...s.path, ...(s.rest ?? [])])));
      return err(cmd === 'mv' ? `mv: rename ${src.text} to ${dst.text}: No such file or directory` : `cp: ${src.text}: No such file or directory`);
    }
    if (!s.path.length || (cmd === 'mv' && within(cwd, s.path))) return note(notes.inUse);
    if (cmd === 'cp' && s.node.dir && !recurse && os === 'mac') return err(`cp: ${src.text} is a directory (not copied).`);
    const d = resolve(dst.text);
    let parent;
    let newName;
    if (d.node?.dir) [parent, newName] = [d.path, s.node.name];
    else if (d.node) [parent, newName] = [d.path.slice(0, -1), d.node.name];
    else if (d.missing && d.last) [parent, newName] = [d.path, d.missing];
    else {
      if (os === 'windows') return err(ps().notFound(name, absolute([...d.path, ...(d.rest ?? [])])));
      return err(`${cmd}: ${dst.text}: No such file or directory`);
    }
    if (s.node.dir && within(parent, s.path)) return note(notes.into);
    const target = node(parent);
    const there = target.children.find((c) => lower(c.name) === lower(newName));
    if (there === s.node) return ok([], fx);
    if (there) {
      if (there.dir) return err(os === 'windows' ? ps().exists(absolute([...parent, there.name])) : `${cmd}: ${dst.text}: File exists`);
      if (cmd === 'mv' && os === 'windows') return err(ps().moveExists());
      fx.removed.push(...allIds(detach([...parent, there.name])));
    }
    if (cmd === 'mv') {
      const n = detach(s.path);
      n.name = newName;
      target.children.push(n);
      fx.moved.push(n.id);
      return ok([], fx);
    }
    const n = copy(s.node);
    n.name = newName;
    // Copy-Item without -Recurse takes the folder but nothing in it
    const empty = s.node.dir && !recurse && os === 'windows' && s.node.children.length;
    if (empty) n.children = [];
    target.children.push(n);
    fx.added.push(...allIds(n));
    return empty ? note(notes.emptyCopy, fx) : ok([], fx);
  }

  /** Splits a line into the command, its flags, -Name value options, a redirect, and the arguments. */
  function parse(line) {
    const all = words(line, os);
    const at = all.findIndex((w) => !w.quoted && (w.text === '>' || w.text === '>>'));
    const redirect = at > 0 && all[at + 1] ? { target: all[at + 1].text, append: all[at].text === '>>' } : null;
    const list = at > 0 ? all.slice(0, at) : all;
    const [first, ...rest] = list;
    const flags = new Set();
    const options = {};
    const args = [];
    for (let i = 0; i < rest.length; i++) {
      const w = rest[i];
      if (!w.quoted && /^--?[A-Za-z]/.test(w.text)) {
        const name = w.text.replace(/^--?/, '');
        if (os === 'windows' && lower(name) === 'itemtype' && rest[i + 1]) options.itemtype = rest[++i].text;
        else if (os === 'windows') flags.add(lower(name) === 'r' ? 'recurse' : lower(name));
        else if (w.text.startsWith('--')) flags.add(name);
        else for (const c of name) flags.add(c);
      } else args.push(w);
    }
    return { first, command: first && COMMANDS[os][lower(first.text)], args, flags, options, redirect };
  }

  const KNOWN_FLAGS = { mkdir: ['p'], rm: ['r', 'R', 'f', 'recurse', 'force'], cp: ['r', 'R', 'recurse'], python: ['version', 'V'], newitem: [], ls: [], cd: [], mv: ['f'], cat: [], touch: [], rmdir: [], echo: [], pwd: [], clear: [] };

  /** Runs a line and says what it printed and what changed in the tree. */
  function run(line) {
    const { first, command, args, flags, options, redirect } = parse(line);
    if (!first) return ok();
    if (!command) return err(os === 'windows' ? ps().unknown(first.text) : `zsh: command not found: ${first.text}`);
    if (command === 'clear') return { ...ok(), clear: true };
    const unknown = [...flags].find((f) => !(KNOWN_FLAGS[command] ?? []).includes(f));
    if (unknown) return note(notes.noOptions(os === 'mac' && unknown.length > 1 ? `--${unknown}` : `-${unknown}`));
    const result = RUN[command](args, flags, options, redirect, first.text);
    return { from: cwd, to: cwd, ...result };
  }

  /**
   * What the line being typed would touch: for each path in it the way
   * through the tree, and whether it ends where the command needs it.
   */
  function preview(line) {
    const { command, args, redirect } = parse(line);
    if (!command) return [];
    const ways = [];
    const target = (text, role) => {
      const r = resolve(text);
      const need = role === 'new' ? 'new' : FOLDER_COMMANDS.has(command) && role !== 'source' ? 'folder' : 'any';
      let problem = null;
      if (r.throughFile) problem = { kind: 'file', path: r.throughFile };
      else if (r.missing && !(need === 'new' && r.last)) problem = { kind: 'missing', name: r.missing, path: r.path };
      else if (r.node && need === 'folder' && !r.node.dir) problem = { kind: 'notFolder', path: r.path };
      ways.push({ text, role, steps: r.steps, end: r.path, missing: r.missing, exists: Boolean(r.node), problem });
    };
    if (command === 'cd') target(args[0]?.text ?? '~', 'go');
    else if (['ls', 'cat', 'rm', 'rmdir', 'python'].includes(command)) for (const a of args) target(a.text, command === 'ls' ? 'look' : 'use');
    else if (['mkdir', 'newitem', 'touch'].includes(command)) for (const a of args) target(a.text, 'new');
    else if (command === 'cp' || command === 'mv') {
      if (args[0]) target(args[0].text, 'source');
      if (args[1]) target(args.at(-1).text, 'new');
    } else if (command === 'echo' && redirect) target(redirect.target, 'new');
    return ways;
  }

  /**
   * Tab: the word at the end of the line completed with a name from the
   * tree, as the shell would do it. PowerShell runs through the matches one
   * by one; zsh completes as far as all matches agree and lists them.
   */
  function complete(line, turn = 0) {
    const all = words(line, os);
    let last = all.at(-1);
    if (!last) return null;
    // after a blank the word to complete is still empty: every name fits
    if (/\s$/.test(line) && !last.open) last = { text: '', start: line.length };
    else if (last === all[0]) return null;
    const command = COMMANDS[os][lower(all[0].text)];
    const text = last.text;
    const cut = Math.max(text.lastIndexOf('/'), os === 'windows' ? text.lastIndexOf('\\') : -1);
    const dirPart = text.slice(0, cut + 1);
    const partial = text.slice(cut + 1);
    const r = dirPart ? resolve(dirPart) : { node: node(cwd), path: cwd };
    if (!r.node?.dir) return null;
    const matches = r.node.children
      .filter((c) => lower(c.name).startsWith(lower(partial)) && (!FOLDER_COMMANDS.has(command) || c.dir))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    if (!matches.length) return null;
    const before = line.slice(0, last.start);
    if (os === 'windows') {
      const m = matches[turn % matches.length];
      const relativeStart = !/^([a-z]:|[\\/~.])/i.test(dirPart);
      let word = `${relativeStart ? '.\\' : ''}${dirPart}${m.name}${m.dir ? '\\' : ''}`;
      if (/\s/.test(word)) word = `'${word}'`;
      return { line: before + word, matches: matches.map((c) => c.name), cycling: matches.length > 1 };
    }
    const escape = (s) => s.replace(/([\s"'\\])/g, '\\$1');
    if (matches.length === 1) {
      const m = matches[0];
      return { line: `${before}${escape(dirPart)}${escape(m.name)}${m.dir ? '/' : ' '}`, matches: [m.name] };
    }
    let common = matches[0].name;
    for (const m of matches) while (!lower(m.name).startsWith(lower(common))) common = common.slice(0, -1);
    const grown = common.length > partial.length ? `${before}${escape(dirPart)}${escape(common)}` : line;
    return { line: grown, matches: matches.map((c) => c.name), list: true };
  }

  function prompt() {
    if (os === 'windows') return `PS ${absolute(cwd)}> `;
    const here = same(cwd, HOME) ? '~' : cwd.length ? cwd.at(-1) : '/';
    return `anna@MacBook ${here} % `;
  }

  // the scenario starts in its folder, given from home (~/Documents) or absolute
  const begin = resolve(String(start).replace(/\\/g, '/'), HOME);
  if (begin.node?.dir) cwd = begin.path;

  return {
    run,
    preview,
    complete,
    prompt,
    rows,
    relative,
    resolve,
    absolute,
    get cwd() {
      return [...cwd];
    },
    get platform() {
      return os;
    },
    set platform(value) {
      os = value;
    },
    home: HOME,
  };
}

/** Problems with a scenario, for the build: the tree's names and where it starts. */
export function scenarioProblems(scenario) {
  const problems = [];
  if (!scenario || typeof scenario !== 'object' || Array.isArray(scenario)) return ['the block holds no scenario (tree: and optionally start:)'];
  for (const key of Object.keys(scenario)) if (!['tree', 'start'].includes(key)) problems.push(`unknown field ${key} (tree, start)`);
  const check = (tree, where) => {
    if (tree === null || typeof tree !== 'object' || Array.isArray(tree)) return problems.push(`${where || 'tree'} must be a mapping of names`);
    const seen = new Set();
    for (const [name, value] of Object.entries(tree)) {
      if (/[\\/:*?"<>|]/.test(name) || !name.trim() || name === '.' || name === '..') problems.push(`${where}${name}: not a valid file or folder name`);
      if (seen.has(lower(name))) problems.push(`${where}${name}: twice (names do not depend on case)`);
      seen.add(lower(name));
      if (value !== null && typeof value === 'object') check(value, `${where}${name}/`);
    }
  };
  check(scenario.tree ?? {}, '');
  if (scenario.start !== undefined) {
    const shell = createShell(scenario, { platform: 'mac' });
    const r = shell.resolve(String(scenario.start).replace(/\\/g, '/'), HOME);
    if (!r.node?.dir) problems.push(`start: ${scenario.start} is not a folder of the tree`);
  }
  return problems;
}
