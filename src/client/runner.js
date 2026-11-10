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
import { presentable } from './present.js';
import { showLed } from './led-view.js';
import { load, update, today } from './progress.js';

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
async function sendR(code, onMessage, options) {
  rEngine ??= await import('./r-engine.js');
  rWaiting.add(onMessage);
  await rEngine.run(
    code,
    (message) => {
      if (!rWaiting.has(onMessage)) return; // stopped meanwhile
      if (message.type === 'done') rWaiting.delete(onMessage);
      onMessage(message);
    },
    options,
  );
}

// The files a page means by a table name (r_datasets in its head), from the
// nearest element that says so: on the self-study pages `survey` is the full
// survey instead of the compact one.
const aliasesOf = (box) => JSON.parse(box.closest('[data-r-datasets]')?.dataset.rDatasets ?? '{}');

// --- a task of a test ------------------------------------------------------------

// What the box of task N checks (data-test on the page, pages.mjs), with the
// labels and the id of the test; the results live in the progress like those
// of a quiz, 1 for right and 0 for not yet, and the test is done when all are
// right (client/test.js shows the score). The last check of a task counts, as
// check_answer() in the course: a box that says "not yet" is not counted right.
function testTask(box) {
  const page = box.closest('[data-test]');
  const number = Number(box.dataset.check);
  const spec = JSON.parse(page?.dataset.test ?? '[]').find((t) => t.number === number);
  return spec && { ...spec, item: page.dataset.itemPage, total: JSON.parse(page.dataset.test).length, labels: JSON.parse(page.dataset.testLabels) };
}

const testResults = (item) => load().items[item]?.test ?? {};

function recordTest(task, correct) {
  update(task.item, (p) => {
    p.test ??= {};
    p.test[task.number] = correct ? 1 : 0;
    if (Object.values(p.test).filter((v) => v === 1).length === task.total) p.done ??= today();
  });
}

function showVerdict(verdict, task, result, detail = '') {
  const L = task.labels;
  const [rows, cols] = detail.split(' ');
  const fill = (s) => s.replace('{name}', task.name).replace('{rows}', rows).replace('{cols}', cols).replace('{n}', detail).replace('{detail}', detail.trim().replace(/([^.!?])$/, '$1.'));
  const correct = result === 'correct';
  verdict.hidden = false;
  verdict.className = `runner-verdict ${correct ? 'is-correct' : 'is-wrong'}`;
  const message = correct ? L.correct : result === 'wrong' ? L.wrong : fill(L[result] ?? L.wrong);
  verdict.replaceChildren(el('strong', {}, correct ? L.correct : L.wrong));
  if (!correct && message !== L.wrong) verdict.append(' ', message);
  // where to review it, when the answer is there but not right
  if (!correct && task.review && ['wrong', 'share', 'table', 'many', 'plot_wrong', 'plot_labels'].includes(result))
    verdict.append(' ', L.review, ' ', el('a', { href: task.review.url }, task.review.title));
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
  editor.setAttribute('wrap', 'off');
  const sheet = el('div', { className: 'runner-sheet' }, el('pre', { className: 'code' }, shown), editor);
  const code = el('div', { className: 'runner-code' }, el('div', { className: 'runner-scroll' }, sheet));
  const run = el('button', { type: 'button', className: 'button runner-run' });
  const reset = el('button', { type: 'button', className: 'button button-quiet runner-reset', textContent: L.reset, hidden: true });
  const status = el('span', { className: 'runner-status', role: 'status' });
  const output = el('pre', { className: 'runner-output', hidden: true });
  output.setAttribute('aria-live', 'polite');
  const hint = el('p', { className: 'runner-hint', hidden: true });
  // what the simulated LED did, for a program that uses lifi_hardware (led-view.js)
  const led = el('div', { className: 'led-view', role: 'group', hidden: true });
  // in a test, the box of a task also checks its answer (Nicolas, 2026-11-10)
  const task = lang === 'r' && box.dataset.check ? testTask(box) : null;
  const checker = task && el('button', { type: 'button', className: 'button button-quiet runner-check', textContent: task.labels.check });
  const verdict = task && el('p', { className: 'runner-verdict', role: 'status', hidden: true });
  const bar = el('div', { className: 'runner-bar' }, ...[run, checker, reset, status].filter(Boolean));
  box.replaceChildren(...[code, bar, verdict, led, output, hint].filter(Boolean));
  if (task) {
    if (testResults(task.item)[task.number] === 1) showVerdict(verdict, task, 'correct');
    checker.addEventListener('click', async () => {
      checker.disabled = true;
      verdict.hidden = false;
      verdict.className = 'runner-verdict';
      verdict.textContent = task.labels.checking;
      rEngine ??= await import('./r-engine.js');
      const { result, detail } = await rEngine.check(editor.value, task, { datasets: aliasesOf(box) });
      checker.disabled = false;
      showVerdict(verdict, task, result, detail);
      recordTest(task, result === 'correct');
    });
  }
  // Larger, for working on the code together on a projector: presented on a
  // stage with its heading and paragraph (present.js), at one size for all
  // boxes, with a fixed room for the output in which longer output scrolls.
  presentable(box, bar);
  new MutationObserver(() => (output.scrollTop = output.scrollHeight)).observe(output, { childList: true, subtree: true, characterData: true });
  addCopyButton(code, () => editor.value);
  // Long lines scroll sideways, and the caret is kept in sight: the width of
  // its line up to the caret, measured in the editor's font.
  const scroller = code.firstChild;
  const ruler = document.createElement('canvas').getContext('2d');
  const reveal = () =>
    requestAnimationFrame(() => {
      const style = getComputedStyle(editor);
      ruler.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const before = editor.value.slice(0, editor.selectionEnd);
      const line = before.slice(before.lastIndexOf('\n') + 1).replace(/\t/g, '    ');
      const x = parseFloat(style.paddingLeft) + ruler.measureText(line).width;
      const room = parseFloat(style.paddingRight) * 2;
      if (x > scroller.scrollLeft + scroller.clientWidth - room) scroller.scrollLeft = x - scroller.clientWidth + room;
      // back to the very start, when the caret fits there
      else if (x < scroller.scrollLeft + room) scroller.scrollLeft = x < scroller.clientWidth - room ? 0 : x - room;
    });
  document.addEventListener('selectionchange', () => document.activeElement === editor && reveal());
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
      led.stop?.();
      led.hidden = true;
    };
    const reply = (message) => {
      if (message.type === 'file') {
        // a file the R code wrote, to be saved like a download
        clear();
        const href = URL.createObjectURL(new Blob([message.bytes]));
        const link = el('a', { className: 'runner-file', href, download: message.name }, `${L.file} ${message.name}`);
        output.append(link, document.createTextNode('\n'));
        return;
      }
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
      if (message.type === 'led') {
        clear();
        showLed(led, message.run, L, document.documentElement.lang);
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
    if (lang === 'r') sendR(editor.value, reply, { datasets: aliasesOf(box) });
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
    } else if (!led.hidden && !output.textContent) {
      // the LED was the output
      output.hidden = true;
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
    led.stop?.();
    led.hidden = true;
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
