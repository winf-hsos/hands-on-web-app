// Runnable Python blocks: every `.runner` on the page becomes a small editor
// with a Run button and an output area. Python itself runs in a worker
// (python-worker.js) that is started on the first click, so a page with code
// costs nothing until someone wants to run it.
import { highlight } from './highlight.js';

const { pythonWorker, pyodide, runnerLabels } = document.body.dataset;
const L = JSON.parse(runnerLabels);
const PLAY = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
const STOP = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>';
const INDENT = '    ';

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
}

// --- one block -------------------------------------------------------------------

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function setup(box) {
  const original = box.querySelector('code').textContent;
  const shown = el('code', { className: 'language-python' });
  const editor = el('textarea', { className: 'runner-input', spellcheck: false, value: original });
  editor.setAttribute('autocapitalize', 'off');
  editor.setAttribute('autocomplete', 'off');
  editor.setAttribute('aria-label', L.editor);
  const code = el('div', { className: 'runner-code' }, el('pre', { className: 'code' }, shown), editor);
  const run = el('button', { type: 'button', className: 'button runner-run' });
  const reset = el('button', { type: 'button', className: 'button button-quiet runner-reset', textContent: L.reset, hidden: true });
  const status = el('span', { className: 'runner-status', role: 'status' });
  const output = el('pre', { className: 'runner-output', hidden: true });
  output.setAttribute('aria-live', 'polite');
  const hint = el('p', { className: 'runner-hint', hidden: true });
  box.replaceChildren(code, el('div', { className: 'runner-bar' }, run, reset, status), output, hint);

  let answers = [];
  let running = false;
  let escaped = false;

  const paint = () => {
    shown.innerHTML = `${highlight(editor.value)}\n`;
    reset.hidden = editor.value === original;
  };
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
    status.textContent = ready ? L.running : L.loading;
    let fresh = true;
    const clear = () => {
      if (!fresh) return;
      fresh = false;
      output.replaceChildren();
      output.hidden = false;
      hint.hidden = true;
    };
    send(editor.value, answers, (message) => {
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
    });
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
      const last = output.textContent.trim().split('\n').pop() ?? '';
      const name = last.match(/^(\w+Error)\b/)?.[1];
      if (L.errors[name]) {
        hint.textContent = L.errors[name];
        hint.hidden = false;
      }
    } else if (result === 'stopped') {
      output.append(el('span', { className: 'out-note' }, `${output.textContent ? '\n' : ''}${L.stopped}`));
    } else if (result === 'failed') {
      output.append(el('span', { className: 'out-err' }, `${L.failed}\n${message ?? ''}`));
    } else if (!output.textContent) {
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
    output.hidden = true;
    hint.hidden = true;
    editor.focus();
  });
  editor.addEventListener('input', paint);
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
    } else if (e.key === 'Tab' && !e.shiftKey && !wasEscaped) {
      e.preventDefault();
      insert(INDENT);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // keep the indentation of the line, one level more after a colon
      const before = editor.value.slice(0, editor.selectionStart);
      const line = before.slice(before.lastIndexOf('\n') + 1);
      const indent = line.match(/^ */)[0] + (/:\s*$/.test(line) ? INDENT : '');
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
    }
  }

  paint();
  showRun();
}

for (const box of document.querySelectorAll('.runner[data-runner]')) setup(box);
