// The chart finder: a few questions about the variables of a question to
// survey data, each answered with one of a row of large buttons, lead to the
// chart that fits. The result names the chart, sketches it, says why it fits
// and what to watch out for, and hands out the R code with ggplot2. Below,
// one or two columns of the compact milk survey can be chosen instead: the
// finder jumps to their chart, shows the answers the questions would have
// got, and fills the code with the real names so that it runs as it is.
// The logic lives in client/which-chart-model.js.
//
// Nothing jumps from one question to the next: the answers so far and the
// buttons "Back" and "Start over" sit in one row on top, and both that row
// and the question below it keep the height of the tallest of their kind,
// measured once for the current width (reserve()). Only the chart at the end
// may be taller, and when a survey column is chosen, the page scrolls by as
// much as the chart grew, so the select stays under the pointer.
//
// Written with ```which-chart in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-which-chart-labels on <body>).
import { addCopyButton } from './copy.js';
import { keys } from './demo-frame.js';
import { highlight } from './highlight.js';
import { COLUMNS, fromSurvey, nextQuestion, resultsFor, template } from './which-chart-model.js';

const L = JSON.parse(document.body.dataset.whichChartLabels ?? '{}');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Small schematic sketches without data (y grows downwards, as in SVG), drawn in the accent colour: shapes
// filled with currentColor, the axes as a quiet line (.wc-axis in site.css).
const AXES = '<path class="wc-axis" d="M10 6V72H114"/>';
const bar = (x, y, w, h, o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="currentColor" fill-opacity="${o}"/>`;
const dot = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor"/>`;
// a vertical boxplot from its lower whisker end up to its upper one
const box = (x, low, q1, med, q3, high, w = 16) => `<path d="M${x} ${low}V${q1}M${x} ${q3}V${high}M${x - 5} ${low}h10M${x - 5} ${high}h10" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="${x - w / 2}" y="${q3}" width="${w}" height="${q1 - q3}" rx="1.5" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.6"/><path d="M${x - w / 2} ${med}h${w}" stroke="currentColor" stroke-width="2.4"/>`;
const stack = (x, parts, w = 18) => {
  let y = 72;
  return parts.map((h, i) => bar(x, (y -= h), w, h - 1, [1, 0.55, 0.25][i])).join('');
};

const SKETCHES = {
  'bars-frequency': AXES + [92, 70, 46, 28, 14].map((w, i) => bar(11, 10 + i * 12, w, 9)).join(''),
  'bars-scale': AXES + [22, 40, 54, 36, 16].map((h, i) => bar(18 + i * 19, 72 - h, 13, h)).join(''),
  histogram: AXES + [6, 16, 32, 50, 58, 44, 26, 12, 5].map((h, i) => bar(14 + i * 11, 72 - h, 10.5, h, 0.85)).join(''),
  boxplot: '<path class="wc-axis" d="M10 72H114"/><path d="M16 38H46M80 38H98M16 31v14M98 31v14" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="46" y="26" width="34" height="24" rx="1.5" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.6"/><path d="M60 26v24" stroke="currentColor" stroke-width="2.4"/>' + dot(108, 38),
  'stacked-counts': AXES + stack(22, [26, 18, 12]) + stack(52, [16, 10, 8]) + stack(82, [30, 16, 18]),
  'stacked-shares': AXES + stack(22, [30, 22, 14]) + stack(52, [18, 26, 22]) + stack(82, [40, 14, 12]),
  'boxplots-side': AXES + box(32, 62, 50, 42, 34, 20) + box(64, 68, 60, 54, 44, 32) + box(96, 52, 38, 30, 22, 10),
  scatter: AXES + [[20, 60], [28, 54], [34, 58], [42, 46], [48, 50], [54, 40], [62, 44], [68, 34], [76, 36], [84, 26], [92, 30], [100, 18], [58, 56], [80, 46]].map(([x, y]) => dot(x, y)).join(''),
  'count-points': AXES + [[0, 0, 2], [1, 0, 3.4], [2, 0, 4.6], [3, 0, 2.6], [0, 1, 3], [1, 1, 5.6], [2, 1, 6.8], [3, 1, 3.8], [0, 2, 1.8], [1, 2, 3.2], [2, 2, 5], [3, 2, 6]].map(([i, j, r]) => dot(28 + i * 24, 58 - j * 20, r)).join(''),
  line: AXES + '<path d="M18 58L36 50L54 54L72 36L90 30L108 16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' + [[18, 58], [36, 50], [54, 54], [72, 36], [90, 30], [108, 16]].map(([x, y]) => dot(x, y, 2.4)).join(''),
};

const sketch = (result) => `<svg class="wc-sketch" viewBox="0 0 120 80" aria-hidden="true" focusable="false">${SKETCHES[result]}</svg>`;

// the question text and option labels of a question, which depend on how many variables there are
function question(id, answers) {
  const two = answers.some(([q, v]) => q === 'count' && v === 'two');
  const scaleKey = id === 'scale-2' ? 'scaleSecond' : two ? 'scaleFirst' : 'scaleOne';
  const key = id.startsWith('scale') ? scaleKey : id;
  const group = id.startsWith('scale') ? 'scale' : id;
  return { text: L.questions[key], path: L.path[key], option: (v) => L.options[group][v], example: (v) => L.examples[group][v] };
}

// placeholders in the code stand out (.wc-slot), so it is clear what to replace
const marked = (code) => highlight(code, 'r').replace(/&lt;([\w ]+)&gt;/g, '<span class="wc-slot">&lt;$1&gt;</span>');

function setup(root) {
  const optionList = (blank) => [`<option value="">${esc(blank)}</option>`, ...COLUMNS.map((c) => `<option value="${c.name}">${c.name} (${esc(L.kinds[c.kind])})</option>`)].join('');
  root.innerHTML = `
    <div class="wc-top">
      <div class="wc-path">
        <p class="dg-label">${L.pathHead}</p>
        <ol></ol>
      </div>
      <div class="wc-nav">
        <button type="button" class="button button-quiet" data-act="back">${L.back}</button>
        <button type="button" class="wc-link" data-act="reset">${L.reset}</button>
      </div>
    </div>
    <div class="wc-view">
      <div class="wc-stage" tabindex="-1"></div>
      <div class="wc-result" hidden>
        <div class="wc-head"></div>
        <dl class="wc-facts"></dl>
        <p class="wc-code-head"></p>
        <div class="code-block"><pre class="code"><code class="language-r"></code></pre></div>
      </div>
    </div>
    <section class="wc-survey" aria-label="${esc(L.surveyHead)}">
      <p class="wc-survey-head">${L.surveyHead}</p>
      <p class="dg-note">${L.surveyIntro}</p>
      <div class="wc-selects">
        <label class="field"><span>${L.first}</span><select data-col="1">${optionList(L.choose)}</select></label>
        <label class="field"><span>${L.second}</span><select data-col="2">${optionList(L.none)}</select></label>
      </div>
    </section>
    <p class="visually-hidden" aria-live="polite" data-out="live"></p>`;

  const $ = (selector) => root.querySelector(selector);
  const path = $('.wc-path');
  const view = $('.wc-view');
  const stage = $('.wc-stage');
  const result = $('.wc-result');
  const code = $('code');
  const back = $('[data-act="back"]');
  const first = $('[data-col="1"]');
  const second = $('[data-col="2"]');
  const live = $('[data-out="live"]');
  let codeText = '';
  addCopyButton($('.code-block'), () => codeText);

  // the answers given, the chart shown among those they lead to, and the
  // survey columns when the answers came from there
  let answers = [];
  let shown = 0;
  let survey = null;

  function renderPath() {
    path.classList.toggle('is-empty', answers.length === 0);
    path.querySelector('ol').innerHTML = answers
      .map(([id, value], i) => {
        const q = question(id, answers.slice(0, i));
        return `<li><span class="wc-path-key">${q.path}</span> ${esc(q.option(value))}</li>`;
      })
      .join('');
    // where the answers scroll sideways (on a phone), the latest one is in view
    path.scrollLeft = path.scrollWidth;
  }

  function renderQuestion(q) {
    const words = question(q.id, answers);
    stage.innerHTML = `
      <p class="wc-question">${words.text}</p>
      <div class="wc-options">
        ${q.options.map((v, i) => `<button type="button" class="wc-option" data-value="${v}"><span class="wc-key" aria-hidden="true">${i + 1}</span><span class="wc-option-text">${esc(words.option(v))}</span><span class="wc-example">${esc(words.example(v))}</span></button>`).join('')}
      </div>`;
    result.hidden = true;
    return words.text;
  }

  function renderResult(list) {
    const id = list[shown] ?? list[0];
    const words = L.results[id];
    const others = list.filter((r) => r !== id);
    stage.innerHTML = '';
    stage.hidden = true;
    result.hidden = false;
    $('.wc-head').innerHTML = `
      ${sketch(id)}
      <div>
        <p class="wc-name">${esc(words.name)}</p>
        ${others.length ? `<p class="wc-also">${L.alsoPossible} ${others.map((r) => `<button type="button" class="wc-other" data-result="${r}">${esc(L.results[r].name)}</button>`).join(' ')}</p>` : ''}
      </div>`;
    $('.wc-facts').innerHTML = `<div><dt>${L.why}</dt><dd>${esc(words.why)}</dd></div><div><dt>${L.watch}</dt><dd>${esc(words.watch)}</dd></div>`;
    $('.wc-code-head').textContent = survey ? L.codeHeadSurvey : L.codeHead;
    codeText = template(id, survey?.roles);
    code.innerHTML = marked(codeText);
    live.textContent = words.name;
  }

  function render() {
    renderPath();
    back.disabled = answers.length === 0;
    root.dataset.done = '';
    const q = nextQuestion(answers);
    if (q) {
      delete root.dataset.done;
      stage.hidden = false;
      live.textContent = renderQuestion(q);
    } else {
      renderResult(survey?.results ?? resultsFor(answers));
    }
    // a fresh view fades in, without moving anything around it
    for (const el of [stage, result]) {
      el.classList.remove('is-new');
      void el.offsetWidth;
      el.classList.add('is-new');
    }
  }

  // Every way through the questions, rendered once without being shown: the
  // tallest row of answers, the tallest question text and the tallest
  // question with its buttons become the minimum heights, so that neither
  // the buttons nor what lies below them move.
  let measuredWidth = 0;
  function reserve() {
    measuredWidth = root.clientWidth;
    const kept = answers;
    const height = (el) => Math.ceil(el.getBoundingClientRect().height);
    let pathHeight = 0;
    let textHeight = 0;
    let questionHeight = 0;
    path.style.minHeight = '';
    view.style.minHeight = '';
    root.style.removeProperty('--wc-question-height');
    stage.hidden = false;
    result.hidden = true;
    const walk = (given) => {
      answers = given;
      renderPath();
      pathHeight = Math.max(pathHeight, height(path));
      const q = nextQuestion(given);
      if (!q) return;
      renderQuestion(q);
      textHeight = Math.max(textHeight, height(stage.querySelector('.wc-question')));
      questionHeight = Math.max(questionHeight, height(stage.querySelector('.wc-options')));
      for (const value of q.options) walk([...given, [q.id, value]]);
    };
    walk([]);
    answers = kept;
    path.style.minHeight = `${pathHeight}px`;
    root.style.setProperty('--wc-question-height', `${textHeight}px`);
    // the margin below the question text belongs to the stage as well
    const gap = parseFloat(getComputedStyle(stage.querySelector('.wc-question')).marginBottom);
    view.style.minHeight = `${textHeight + gap + questionHeight}px`;
  }

  // leaving the survey: the questions take over again
  function dropSurvey() {
    survey = null;
    first.value = '';
    second.value = '';
    syncSelects();
  }

  function answer(value) {
    const q = nextQuestion(answers);
    if (!q || !q.options.includes(value)) return;
    dropSurvey();
    answers = [...answers, [q.id, value]];
    shown = 0;
    render();
    stage.focus({ preventScroll: true });
  }

  function goBack() {
    if (!answers.length) return;
    dropSurvey();
    answers = answers.slice(0, -1);
    shown = 0;
    render();
    stage.focus({ preventScroll: true });
  }

  function reset() {
    dropSurvey();
    answers = [];
    shown = 0;
    render();
    stage.focus({ preventScroll: true });
  }

  // the same column cannot be chosen twice, and the second only after the first
  function syncSelects() {
    second.disabled = !first.value;
    for (const option of second.options) option.disabled = option.value !== '' && option.value === first.value;
    if (second.value && second.value === first.value) second.value = '';
  }

  function fromSelects(e) {
    const before = e?.target.getBoundingClientRect().top;
    syncSelects();
    if (!first.value) {
      survey = null;
      answers = [];
    } else {
      survey = fromSurvey(first.value, second.value);
      answers = survey.answers;
    }
    shown = 0;
    render();
    // the select stays where it was, however much the chart above it grew
    if (before !== undefined) window.scrollBy(0, e.target.getBoundingClientRect().top - before);
  }

  stage.addEventListener('click', (e) => {
    const option = e.target.closest('.wc-option');
    if (option) answer(option.dataset.value);
  });
  result.addEventListener('click', (e) => {
    const other = e.target.closest('.wc-other');
    if (!other) return;
    const list = survey?.results ?? resultsFor(answers);
    shown = list.indexOf(other.dataset.result);
    render();
  });
  back.addEventListener('click', goBack);
  $('[data-act="reset"]').addEventListener('click', reset);
  first.addEventListener('change', fromSelects);
  second.addEventListener('change', fromSelects);

  keys(root, [['1 – 4', L.keyAnswer], ['⌫', L.keyBack], ['R', L.keyReset]], (key) => {
    if (/^[1-4]$/.test(key)) {
      const q = nextQuestion(answers);
      if (!q || !q.options[Number(key) - 1]) return false;
      answer(q.options[Number(key) - 1]);
      return true;
    }
    if (key === 'Backspace') {
      goBack();
      return true;
    }
    if (key === 'r' || key === 'R') {
      reset();
      return true;
    }
    return false;
  });

  syncSelects();
  reserve();
  render();
  // a new width wraps the texts differently, so the heights are measured again
  new ResizeObserver(() => {
    if (root.clientWidth === measuredWidth) return;
    reserve();
    render();
  }).observe(root);
}

document.querySelectorAll('[data-which-chart]').forEach((root) => setup(root));
