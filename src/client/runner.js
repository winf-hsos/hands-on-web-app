// Runnable code blocks: every `.runner` on the page becomes a small editor
// with a Run button and an output area. Python runs in a worker
// (python-worker.js), R with webR (r-engine.js); either starts on the first
// click, so a page with code costs nothing until someone wants to run it.
import { addCopyButton } from './copy.js';
import { attachCompletion } from './complete.js';
import { findR, loadR } from './r-complete.js';
import { suggest as suggestPython } from './py-context.js';
import { highlight } from './highlight.js';
import { savedOnPage, fingerprint } from './saved.js';
import { focusable } from './focus.js';

const { pythonWorker, pyodide, runnerLabels } = document.body.dataset;
const L = JSON.parse(runnerLabels);
const PLAY = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
const STOP = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>';

// What differs between the languages: indentation, when Enter indents one
// level more, how an error message names the kind of error, and for R the
// pipe that Ctrl+Shift+M inserts, as in Positron.
const LANGS = {
  python: { indent: '    ', opens: /:\s*$/, errorKind: (text) => text.match(/^(\w+Error)\b/m)?.[1] },
  r: {
    indent: '  ',
    pipe: '|> ',
    opens: /(\{|\(|\|>|,)\s*$/,
    errorKind: (text) =>
      [
        [/object '.*' not found/, 'r_object'],
        [/could not find function/, 'r_function'],
        [/non-numeric argument/, 'r_type'],
        [/unexpected|parse/, 'r_syntax'],
        [/must be|Can't|can't/, 'r_dplyr'],
      ].find(([pattern]) => pattern.test(text))?.[1] ?? null,
  },
};

// --- the worker, shared by all blocks of the page -------------------------------

let worker = null;
let ready = false;
let nextId = 0;
const waiting = new Map();

function send(code, answers, onMessage) {
  if (!worker) {
    worker = new Worker(pythonWorker, { type: 'module' });
    worker.onmessage = ({ data }) => {
      if (data.type === 'done') ready = true;
      waiting.get(data.id)?.(data);
      if (data.type === 'done') waiting.delete(data.id);
    };
  }
  const id = ++nextId;
  waiting.set(id, onMessage);
  worker.postMessage({ id, code, answers, base: pyodide });
}

/** Ends the worker, and with it any program that is still running. */
function stopAll() {
  worker?.terminate();
  worker = null;
  ready = false;
  for (const [id, onMessage] of waiting) onMessage({ id, type: 'done', status: 'stopped' });
  waiting.clear();
  rEngine?.stop();
  for (const onMessage of rWaiting) onMessage({ type: 'done', status: 'stopped' });
  rWaiting.clear();
}

// R is loaded only on pages that have R blocks, and only on the first click.
let rEngine = null;
const rWaiting = new Set();
async function sendR(code, onMessage) {
  rEngine ??= await import('./r-engine.js');
  rWaiting.add(onMessage);
  await rEngine.run(code, (message) => {
    if (!rWaiting.has(onMessage)) return; // stopped meanwhile
    if (message.type === 'done') rWaiting.delete(onMessage);
    onMessage(message);
  });
}

// --- one block -------------------------------------------------------------------

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

// What a learner changed in a box stays in this browser until "Reset"
// (Nicolas, 2026-11-01). An entry belongs to the box's original code, so a
// box the author changes starts afresh; equal boxes on a page count apart.
const savedCode = savedOnPage('hocs-code');
const seen = new Map();

function setup(box) {
  const lang = box.dataset.lang === 'r' ? 'r' : 'python';
  const spec = LANGS[lang];
  const original = box.querySelector('code').textContent;
  const print = fingerprint(original);
  seen.set(print, (seen.get(print) ?? 0) + 1);
  const id = `${print}-${seen.get(print)}`;
  const shown = el('code', { className: `language-${lang}` });
  const editor = el('textarea', { className: 'runner-input', spellcheck: false, value: savedCode.get(id) ?? original });
  editor.setAttribute('autocapitalize', 'off');
  editor.setAttribute('autocomplete', 'off');
  editor.setAttribute('aria-label', lang === 'r' ? L.editor_r : L.editor);
  const code = el('div', { className: 'runner-code' }, el('pre', { className: 'code' }, shown), editor);
  const run = el('button', { type: 'button', className: 'button runner-run' });
  const reset = el('button', { type: 'button', className: 'button button-quiet runner-reset', textContent: L.reset, hidden: true });
  const status = el('span', { className: 'runner-status', role: 'status' });
  const output = el('pre', { className: 'runner-output', hidden: true });
  output.setAttribute('aria-live', 'polite');
  const hint = el('p', { className: 'runner-hint', hidden: true });
  const bar = el('div', { className: 'runner-bar' }, run, reset, status);
  box.replaceChildren(code, bar, output, hint);
  // Larger, for working on the code together on a projector: the code, the
  // bar and a fixed room for the output fit the screen, and longer output
  // scrolls inside that room. The size follows the code when it is run or
  // left, not with every key.
  const measure = () => {
    const probe = el('div', { className: 'focus-measure' }, code.cloneNode(true), bar.cloneNode(true), el('pre', { className: 'runner-output' }));
    const room = el('p', { className: 'runner-hint' });
    room.innerHTML = '&nbsp;<br>&nbsp;'; // two lines for a hint after an error
    probe.append(room);
    box.append(probe);
    const height = probe.getBoundingClientRect().height;
    probe.remove();
    return height;
  };
  const refit = focusable(box, bar, { height: measure, widths: [800, 960] });
  // after the buttons' own handlers below, which change the code
  for (const button of [run, reset]) button.addEventListener('click', () => queueMicrotask(refit));
  editor.addEventListener('blur', refit);
  new MutationObserver(() => (output.scrollTop = output.scrollHeight)).observe(output, { childList: true, subtree: true, characterData: true });
  addCopyButton(code, () => editor.value);
  if (lang === 'r') attachCompletion(editor, L.complete, findR, loadR);
  // Python: the names of all Python editors on the page count in each of them
  else
    attachCompletion(editor, L.complete, async (ed, force) => {
      const others = [...document.querySelectorAll('.runner:not([data-lang="r"]) textarea')].filter((t) => t !== ed);
      const pageCode = others.map((t) => t.value).join('\n');
      return suggestPython(ed.value, ed.selectionStart, { force, pageCode });
    });

  let answers = [];
  let running = false;
  let escaped = false;

  const paint = () => {
    shown.innerHTML = `${highlight(editor.value, lang)}\n`;
    reset.hidden = editor.value === original;
  };
  const save = () => (editor.value === original ? savedCode.remove(id) : savedCode.set(id, editor.value));
  // Both labels are always in the button, stacked in one place, and only the
  // current one is visible: so the button keeps the width of the longer one
  // and the buttons next to it do not move while a program runs.
  run.innerHTML = `<span class="runner-label" data-label="run">${PLAY}<span>${L.run}</span></span><span class="runner-label" data-label="stop">${STOP}<span>${L.stop}</span></span>`;
  const showRun = () => {
    run.dataset.state = running ? 'stop' : 'run';
    run.setAttribute('aria-label', running ? L.stop : L.run);
  };

  function start() {
    running = true;
    showRun();
    const warm = lang === 'r' ? rEngine?.isReady() : ready;
    status.textContent = warm ? L.running : lang === 'r' ? L.loading_r : L.loading;
    let fresh = true;
    const clear = () => {
      if (!fresh) return;
      fresh = false;
      output.replaceChildren();
      output.hidden = false;
      hint.hidden = true;
    };
    const reply = (message) => {
      if (message.type === 'image') {
        // a plot from R, drawn at full size and scaled to the box by CSS
        clear();
        const { image } = message;
        const canvas = el('canvas', { className: 'runner-plot', width: image.width, height: image.height });
        canvas.getContext('2d').drawImage(image, 0, 0);
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', L.plot);
        output.append(canvas);
        return;
      }
      if (message.type === 'output') {
        clear();
        const text = document.createTextNode(message.text);
        output.append(message.kind === 'out' ? text : el('span', { className: `out-${message.kind}` }, text));
        return;
      }
      clear();
      running = false;
      showRun();
      status.textContent = '';
      finish(message);
    };
    if (lang === 'r') sendR(editor.value, reply);
    else send(editor.value, answers, reply);
  }

  function finish({ status: result, message }) {
    if (result === 'input') {
      const answer = el('input', { className: 'runner-answer', type: 'text', autocomplete: 'off', spellcheck: false });
      answer.setAttribute('aria-label', L.answer);
      answer.placeholder = L.answer;
      answer.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        answers.push(answer.value);
        start();
      });
      output.append(answer);
      answer.focus({ preventScroll: true });
    } else if (result === 'error') {
      const name = spec.errorKind(output.textContent.trim().split('\n').slice(-3).join('\n'));
      if (L.errors[name]) {
        hint.textContent = L.errors[name];
        hint.hidden = false;
      }
    } else if (result === 'stopped') {
      output.append(el('span', { className: 'out-note' }, `${output.textContent ? '\n' : ''}${L.stopped}`));
    } else if (result === 'failed') {
      output.append(el('span', { className: 'out-err' }, `${lang === 'r' ? L.failed_r : L.failed}\n${message ?? ''}`));
    } else if (!output.textContent && !output.querySelector('canvas')) {
      output.append(el('span', { className: 'out-note' }, L.no_output));
    }
  }

  run.addEventListener('click', () => {
    if (running) return stopAll();
    answers = [];
    start();
  });
  reset.addEventListener('click', () => {
    editor.value = original;
    paint();
    savedCode.remove(id);
    output.hidden = true;
    hint.hidden = true;
    editor.focus();
  });
  editor.addEventListener('input', () => {
    paint();
    save();
  });
  // completions may write into the box without an input event
  editor.addEventListener('blur', save);
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      escaped = true;
      return;
    }
    const wasEscaped = escaped;
    escaped = false;
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run.click();
    } else if (spec.pipe && e.code === 'KeyM' && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      // a space before the pipe unless there is one already
      const before = editor.value.slice(0, editor.selectionStart);
      insert(/(^|\s)$/.test(before) ? spec.pipe : ` ${spec.pipe}`);
    } else if (e.key === 'Tab' && !e.shiftKey && !wasEscaped) {
      e.preventDefault();
      insert(spec.indent);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // keep the indentation of the line, one level more where a block opens
      // (a colon in Python; a brace, bracket, pipe or comma in R)
      const before = editor.value.slice(0, editor.selectionStart);
      const line = before.slice(before.lastIndexOf('\n') + 1);
      const indent = line.match(/^ */)[0] + (spec.opens.test(line) ? spec.indent : '');
      e.preventDefault();
      insert(`\n${indent}`);
    }
  });

  function insert(text) {
    editor.focus();
    // execCommand keeps the browser's undo history; setRangeText is the fallback
    if (!document.execCommand?.('insertText', false, text)) {
      editor.setRangeText(text, editor.selectionStart, editor.selectionEnd, 'end');
      paint();
      save();
    }
  }

  paint();
  showRun();
}

for (const box of document.querySelectorAll('.runner[data-runner]')) setup(box);
