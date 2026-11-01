// The demonstrator "Ordnerbaum und Kommandozeile": a terminal below the
// folder tree it works on. "du bist hier" marks the current folder in the
// tree, every command changes the tree where it acts (cd moves the mark,
// mkdir lets a folder grow, mv carries a file to its new place, rm takes it
// away), and while a path is being typed the tree lights up the way it takes
// from the current folder, before Enter. A click on a folder writes the cd
// that leads there. In prediction mode a command waits for a second Enter
// before it shows what it did, so a room can guess first.
//
// The shell itself is client/shell-model.js. Written with ```shell-demo in
// Markdown, the block holding the scenario (remark-knowledge.mjs); the
// labels come from the page (data-shell-demo-labels on <body>).
import { createShell, PLATFORMS } from './shell-model.js';
import { keys } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.shellDemoLabels ?? '{}');
const LANG = document.body.dataset.lang ?? 'de';
const ROW = 30; // px, as .sd-row in site.css
const INDENT = 22; // px per level of the tree
const STORE = 'hocs-shell-os';
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const icon = (path) => `<svg class="sd-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const FOLDER = icon('<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>');
const FILE = icon('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function storedPlatform() {
  try {
    const os = localStorage.getItem(STORE);
    if (PLATFORMS.includes(os)) return os;
  } catch {}
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? 'mac' : 'windows';
}

function setup(box) {
  const scenario = JSON.parse(box.dataset.shellDemo || '{}');
  let os = storedPlatform();
  let shell = createShell(scenario, { platform: os, lang: LANG });

  box.innerHTML = `
    <div class="sd-top">
      <div class="sd-os" role="group" aria-label="${L.system}">${PLATFORMS.map((p) => `<button type="button" class="sd-os-button" data-os="${p}">${L[p]}</button>`).join('')}</div>
      <label class="sd-predict"><input type="checkbox"> ${L.predict}</label>
      <button type="button" class="button button-quiet sd-reset">${L.reset}</button>
    </div>
    <div class="sd-tree" role="group" aria-label="${L.tree}">
      <div class="sd-canvas">
        <svg class="sd-edges" aria-hidden="true"><g class="sd-lines"></g><g class="sd-route"></g></svg>
        <div class="sd-here" aria-hidden="true"><span>${L.here}</span></div>
      </div>
    </div>
    <div class="sd-term" aria-label="${L.terminal}">
      <div class="sd-log" role="log" aria-live="polite"></div>
      <div class="sd-line"><span class="sd-prompt"></span><input class="sd-input" type="text" aria-label="${L.input}" autocomplete="off" autocapitalize="off" spellcheck="false"></div>
    </div>
    <p class="sd-status"></p>`;

  const $ = (s) => box.querySelector(s);
  const tree = $('.sd-tree');
  const canvas = $('.sd-canvas');
  const lines = $('.sd-lines');
  const route = $('.sd-route');
  const here = $('.sd-here');
  const term = $('.sd-term');
  const log = $('.sd-log');
  const prompt = $('.sd-prompt');
  const input = $('.sd-input');
  const status = $('.sd-status');
  const predict = $('.sd-predict input');
  const elements = new Map(); // node id → row
  let order = []; // the rows as shell.rows() gave them last
  let pending = null; // a result held back in prediction mode
  const history = [];
  let back = 0; // how far up the history the arrows went
  let tab = null; // { base, turn, line } while Tab runs through matches

  // The tree keeps the height it has at the start, with room for a few more
  // rows; more than that scrolls inside it (nothing moves on the page).
  tree.style.setProperty('--sd-rows', String(Math.min(14, Math.max(8, shell.rows().length + 3))));

  // --- the terminal -----------------------------------------------------------

  function print(text, kind) {
    const line = Object.assign(document.createElement('div'), { className: `sd-out sd-${kind}`, textContent: text || ' ' });
    log.append(line);
    while (log.childElementCount > 300) log.firstElementChild.remove();
    term.scrollTop = term.scrollHeight;
  }

  function echo(text, line) {
    const row = Object.assign(document.createElement('div'), { className: 'sd-out sd-cmd' });
    row.append(Object.assign(document.createElement('span'), { className: 'sd-prompt', textContent: text }), line);
    log.append(row);
    term.scrollTop = term.scrollHeight;
  }

  const showPrompt = () => (prompt.textContent = shell.prompt());

  // --- the tree ---------------------------------------------------------------

  const key = (path) => path.join('\u0000').toLowerCase();

  function row(r) {
    let el = elements.get(r.id);
    if (!el) {
      el = Object.assign(document.createElement('button'), { type: 'button', className: 'sd-row' });
      el.innerHTML = `${r.dir ? FOLDER : FILE}<span class="sd-name"></span><span class="sd-badge"></span>`;
      el.addEventListener('click', () => choose(el.rowPath, el.classList.contains('is-dir')));
      elements.set(r.id, el);
      canvas.append(el);
    }
    el.classList.toggle('is-dir', r.dir);
    el.rowPath = r.path;
    el.querySelector('.sd-name').textContent = r.name;
    el.setAttribute('aria-label', `${r.dir ? L.folder : L.file} ${r.name}`);
    return el;
  }

  /** Draws the tree as the shell has it now; `fx` says what changed, for the motion. */
  function draw(fx = { added: [], removed: [], moved: [] }, animate = true) {
    const motion = animate && !reduced.matches;
    const rows = shell.rows();
    const ids = new Set(rows.map((r) => r.id));
    for (const [id, el] of elements) {
      if (ids.has(id)) continue;
      elements.delete(id);
      if (!motion) el.remove();
      else {
        el.classList.add('is-leaving');
        setTimeout(() => el.remove(), 350);
      }
    }
    order = rows;
    rows.forEach((r, i) => {
      const fresh = !elements.has(r.id);
      const el = row(r);
      el.style.setProperty('--i', i);
      el.style.setProperty('--depth', r.depth);
      if (fresh && motion) el.classList.add('is-entering');
      if (motion && (fx.added.includes(r.id) || fx.moved.includes(r.id))) {
        el.classList.remove('is-new');
        void el.offsetWidth;
        el.classList.add('is-new');
      }
    });
    // new rows start transparent at their place and fade in once that is laid out
    const entering = box.querySelectorAll('.is-entering');
    if (entering.length) {
      void canvas.offsetHeight;
      entering.forEach((el) => el.classList.remove('is-entering'));
    }
    canvas.style.height = `${rows.length * ROW}px`;
    const at = rows.findIndex((r) => key(r.path) === key(shell.cwd));
    here.style.setProperty('--i', at);
    // the lines between the rows follow once the rows have moved
    lines.parentNode.classList.toggle('is-moving', motion);
    setTimeout(() => {
      edges();
      lines.parentNode.classList.remove('is-moving');
    }, motion ? 320 : 0);
    const focus = rows.findIndex((r) => r.id === (fx.added[0] ?? fx.moved[0]));
    reveal(focus >= 0 ? focus : at);
  }

  // keeps a row in view inside the tree, without scrolling the page
  function reveal(i) {
    if (i < 0) return;
    const top = i * ROW;
    if (top < tree.scrollTop) tree.scrollTo({ top: top - ROW, behavior: reduced.matches ? 'auto' : 'smooth' });
    else if (top + ROW > tree.scrollTop + tree.clientHeight) tree.scrollTo({ top: top + 2 * ROW - tree.clientHeight, behavior: reduced.matches ? 'auto' : 'smooth' });
  }

  // an edge from a folder down to one of its rows: down from the folder's
  // icon, then right to the row's icon
  function edge(child) {
    const i = order.findIndex((r) => r.id === child.id);
    const p = order.findIndex((r) => key(r.path) === key(child.path.slice(0, -1)));
    const x = 8 + 8 + (child.depth - 1) * INDENT;
    return `M${x} ${p * ROW + ROW - 6}V${i * ROW + ROW / 2}H${x + INDENT - 10}`;
  }

  function edges() {
    // as large as the rows and drawn in their pixels, not stretched to the tree
    const svg = lines.parentNode;
    svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${order.length * ROW}`);
    svg.style.height = `${order.length * ROW}px`;
    lines.innerHTML = order
      .filter((r) => r.depth)
      .map((r) => `<path d="${edge(r)}"/>`)
      .join('');
    preview();
  }

  // --- the way a path takes, while it is typed ---------------------------------

  function preview() {
    const ways = pending ? [] : shell.preview(input.value);
    const byKey = new Map(order.map((r) => [key(r.path), r]));
    for (const el of elements.values()) {
      el.classList.remove('on-route', 'is-target', 'has-problem', 'gets-new');
      el.querySelector('.sd-badge').textContent = '';
    }
    const paths = [];
    for (const way of ways) {
      for (const [a, b] of way.steps.slice(1).map((s, i) => [way.steps[i], s])) {
        if (b.move !== 'up' && b.move !== 'down') continue;
        const child = byKey.get(key(b.move === 'down' ? b.path : a.path));
        if (child) paths.push(edge(child));
      }
      for (const s of way.steps) elements.get(byKey.get(key(s.path))?.id)?.classList.add('on-route');
      const end = elements.get(byKey.get(key(way.end))?.id);
      const badge = (el, text) => el && (el.querySelector('.sd-badge').textContent = text);
      if (way.problem) {
        const el = elements.get(byKey.get(key(way.problem.path))?.id);
        el?.classList.add('has-problem');
        badge(el, way.problem.kind === 'missing' ? fill(L.badgeMissing, { name: way.problem.name }) : L.badgeFile);
      } else if (way.role === 'new' && !way.exists) {
        end?.classList.add('gets-new');
        badge(end, fill(L.badgeNew, { name: way.missing }));
      } else end?.classList.add('is-target');
    }
    route.innerHTML = paths.map((d) => `<path d="${d}"/>`).join('');
    if (!pending) say(ways);
  }

  const nameOf = (path) => (path.length ? path.at(-1) : os === 'windows' ? 'C:\\' : '/');

  // the way in words, below the terminal
  function say(ways) {
    if (!ways.length) return (status.textContent = input.value.trim() ? '' : L.hint);
    status.textContent = ways
      .map((way) => {
        const parts = way.steps.map((s) => (s.move === 'start' ? null : fill(L[s.move], { name: nameOf(s.path) }))).filter(Boolean);
        let text = parts.length ? parts.join(L.then) : fill(L.stay, { name: nameOf(way.steps[0].path) });
        if (way.problem?.kind === 'missing') text += ` – ${fill(L.missing, { name: way.problem.name })}`;
        else if (way.problem) text += ` – ${fill(L.notFolder, { name: nameOf(way.problem.path) })}`;
        else if (way.role === 'new' && !way.exists) text += ` – ${fill(L.create, { name: way.missing })}`;
        const role = way.role === 'source' ? `${L.source} ` : ways.length > 1 && way.role === 'new' ? `${L.target} ` : '';
        return `${role}${way.text}: ${text}.`;
      })
      .join(' ');
  }

  // --- running a command --------------------------------------------------------

  function run() {
    if (pending) return show();
    const line = input.value;
    const before = shell.prompt();
    echo(before, line);
    if (line.trim() && history.at(-1) !== line) history.push(line);
    back = 0;
    tab = null;
    input.value = '';
    const result = shell.run(line);
    const visible = result.output.length || result.clear || result.added.length || result.removed.length || result.moved.length || result.from !== result.to;
    if (predict.checked && visible) {
      pending = result;
      prompt.textContent = before;
      input.readOnly = true;
      route.innerHTML = '';
      for (const el of elements.values()) el.classList.remove('on-route', 'is-target', 'has-problem', 'gets-new');
      status.innerHTML = `${L.ask} <button type="button" class="sd-show">${L.show}</button>`;
      status.querySelector('.sd-show').addEventListener('click', () => {
        show();
        input.focus();
      });
      return;
    }
    apply(result);
  }

  function show() {
    const result = pending;
    pending = null;
    input.readOnly = false;
    apply(result);
  }

  function apply(result) {
    if (result.clear) log.replaceChildren();
    for (const o of result.output) print(o.text, o.kind);
    showPrompt();
    draw(result);
  }

  // a click on a folder writes the cd that leads there, on a file the cat
  function choose(path, dir) {
    if (pending) return;
    input.value = `${dir ? 'cd' : 'cat'} ${shell.relative(path)}`;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    preview();
  }

  function complete() {
    const again = tab && input.value === tab.line;
    const base = again ? tab.base : input.value;
    const turn = again ? tab.turn + 1 : 0;
    const done = shell.complete(base, turn);
    if (!done) {
      tab = null;
      return;
    }
    input.value = done.line;
    tab = done.cycling ? { base, turn, line: done.line } : null;
    preview();
    if (done.list && done.matches.length > 1) status.textContent = fill(L.matches, { list: done.matches.join('  ') });
  }

  input.addEventListener('input', () => {
    tab = null;
    preview();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') run();
    else if (e.key === 'Tab' && !e.shiftKey) complete();
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (pending || !history.length) return e.preventDefault();
      back = Math.max(0, Math.min(history.length, back + (e.key === 'ArrowUp' ? 1 : -1)));
      input.value = back ? history[history.length - back] : '';
      preview();
    } else if (e.key === 'Escape' && input.value && !pending) {
      input.value = '';
      preview();
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') log.replaceChildren();
    else if (e.ctrlKey && e.key.toLowerCase() === 'c' && !getSelection().toString()) {
      echo(shell.prompt(), `${input.value}^C`);
      input.value = '';
      preview();
    } else return;
    e.preventDefault();
  });
  // a click in the terminal is a click into its input, unless text is being selected
  term.addEventListener('click', () => !getSelection().toString() && input.focus({ preventScroll: true }));

  // --- system, prediction, start over ----------------------------------------------

  function system(next, remember = true) {
    os = next;
    shell.platform = os;
    if (remember) {
      try {
        localStorage.setItem(STORE, os);
      } catch {}
    }
    for (const b of box.querySelectorAll('.sd-os-button')) b.setAttribute('aria-pressed', String(b.dataset.os === os));
    box.dataset.os = os;
    pending = null;
    input.readOnly = false;
    // a new window of the other shell, on the same tree
    log.replaceChildren();
    print(fill(L.opened, { name: L[`shell_${os}`] }), 'note');
    showPrompt();
    draw(undefined, false);
  }

  function reset() {
    shell = createShell(scenario, { platform: os, lang: LANG });
    for (const el of elements.values()) el.remove();
    elements.clear();
    history.length = 0;
    input.value = '';
    system(os, false);
  }

  for (const b of box.querySelectorAll('.sd-os-button')) b.addEventListener('click', () => b.dataset.os !== os && system(b.dataset.os));
  $('.sd-reset').addEventListener('click', reset);
  predict.addEventListener('change', () => {
    if (!predict.checked && pending) show();
    input.focus({ preventScroll: true });
  });

  // the keys of the terminal, for the list of shortcuts (they work in the input)
  keys(
    box,
    [
      ['Enter', L.keyEnter],
      ['Tab', L.keyTab],
      ['↑ / ↓', L.keyHistory],
      ['Esc', L.keyEsc],
    ],
    () => false,
  );

  addEventListener('resize', () => edges());
  system(os, false);
}

for (const box of document.querySelectorAll('[data-shell-demo]')) setup(box);
