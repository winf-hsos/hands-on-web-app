// The chart finder: a few questions about the variables of a question to
// survey data, each answered with one of a row of large buttons, lead to the
// chart that fits. On top, all ten charts stand as small sketches, and each
// answer dims those it rules out, so the way to the chart can be seen
// narrowing down; a click on a sketch fills in the answers that lead to it.
// The result shows the chart large, says why it fits and what to watch out
// for, and hands out the R code with ggplot2. Below, one or two columns of
// the compact milk survey can be chosen instead: the finder jumps to their
// chart, shows the answers the questions would have got, and fills the code
// with the real names so that it runs as it is: right here, in a code box
// with a Run button (client/runner-box.js), while a template with
// placeholders stays a plain block to copy.
// The logic lives in client/which-chart-model.js.
//
// Nothing jumps from one question to the next: the answers so far and the
// buttons "Back" and "Start over" sit in one row on top, and both that row
// and the question below it keep the height of the tallest of their kind,
// measured once for the current width (reserve()). Only the chart at the end
// may be taller, and when a survey column is chosen, the page scrolls by as
// much as the chart grew, so the select stays under the pointer.
//
// Colours carry meaning in the sketches: one hue for bars and points, three
// hues for the categories of a stacked bar (a category without an order), and
// one hue in growing strength for categories with an order.
//
// Written with ```which-chart in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-which-chart-labels on <body>).
import { addCopyButton } from './copy.js';
import { keys } from './demo-frame.js';
import { highlight } from './highlight.js';
import { setup as runnable } from './runner-box.js';
import { COLUMNS, RESULTS, fromSurvey, nextQuestion, pathTo, reachable, resultsFor, template } from './which-chart-model.js';

const L = JSON.parse(document.body.dataset.whichChartLabels ?? '{}');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- the sketches of the ten charts (viewBox 120 × 80, y grows downwards) ---------

const AXES = '<path class="wc-axis" d="M10 6V72H114"/>';
// a shape in the accent colour, or in the colour of category c (1 to 3)
const paint = (c) => (c ? `class="wc-c${c}"` : 'fill="currentColor"');
const bar = (x, y, w, h, c = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" ${paint(c)}/>`;
const dot = (x, y, r = 2.6, o = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" fill-opacity="${o}"/>`;
// a vertical boxplot from its lower whisker end up to its upper one
const box = (x, low, q1, med, q3, high, w = 16) => `<path d="M${x} ${low}V${q1}M${x} ${q3}V${high}M${x - 5} ${low}h10M${x - 5} ${high}h10" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="${x - w / 2}" y="${q3}" width="${w}" height="${q1 - q3}" rx="1.5" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.6"/><path d="M${x - w / 2} ${med}h${w}" stroke="currentColor" stroke-width="2.6"/>`;
// a bar of three categories, stacked from the axis upwards
const stack = (x, parts, w = 20) => {
  let y = 72;
  return parts.map((h, i) => bar(x, (y -= h), w, h - 1.2, i + 1)).join('');
};

const SKETCHES = {
  'bars-frequency': AXES + [94, 72, 50, 32, 16].map((w, i) => bar(11, 10 + i * 12, w, 9)).join(''),
  'bars-scale': AXES + [22, 40, 56, 36, 16].map((h, i) => bar(17 + i * 19, 72 - h, 14, h)).join(''),
  histogram: AXES + [6, 15, 30, 48, 58, 46, 27, 13, 5].map((h, i) => bar(13 + i * 11, 72 - h, 10.4, h)).join(''),
  boxplot: '<path class="wc-axis" d="M10 72H114"/><path d="M16 38H44M82 38H98M16 31v14M98 31v14" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="44" y="25" width="38" height="26" rx="1.5" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.6"/><path d="M59 25v26" stroke="currentColor" stroke-width="2.6"/>' + dot(108, 38),
  'stacked-counts': AXES + stack(20, [26, 18, 12]) + stack(52, [16, 10, 8]) + stack(84, [30, 16, 18]),
  'stacked-shares': AXES + stack(20, [30, 22, 14]) + stack(52, [18, 26, 22]) + stack(84, [40, 14, 12]),
  'boxplots-side': AXES + box(32, 62, 50, 42, 34, 20) + box(64, 68, 60, 54, 44, 32) + box(96, 52, 38, 30, 22, 10),
  scatter: AXES + [[20, 60], [27, 53], [33, 59], [41, 46], [47, 51], [54, 40], [61, 45], [67, 33], [75, 37], [83, 26], [90, 31], [100, 17], [58, 56], [79, 46], [36, 49], [95, 24]].map(([x, y]) => dot(x, y, 2.6, 0.85)).join(''),
  'count-points': AXES + [[0, 0, 2], [1, 0, 3.4], [2, 0, 4.6], [3, 0, 2.6], [0, 1, 3], [1, 1, 5.6], [2, 1, 7], [3, 1, 3.8], [0, 2, 1.8], [1, 2, 3.2], [2, 2, 5], [3, 2, 6.2]].map(([i, j, r]) => dot(28 + i * 24, 58 - j * 20, r, 0.85)).join(''),
  line: AXES + '<path d="M18 58L36 50L54 54L72 36L90 30L108 16" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' + [[18, 58], [36, 50], [54, 54], [72, 36], [90, 30], [108, 16]].map(([x, y]) => dot(x, y, 2.6)).join(''),
};

const sketch = (result, cls) => `<svg class="${cls}" viewBox="0 0 120 80" aria-hidden="true" focusable="false">${SKETCHES[result]}</svg>`;

// --- the symbols on the answers (viewBox 48 × 32) ----------------------------------

const line = (d, w = 1.6) => `<path d="${d}" stroke="currentColor" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const ICONS = {
  // one variable: how its answers pile up; two: a cloud between two axes
  count: {
    one: line('M4 28H44', 1.2) + [[0, 1], [1, 2], [2, 4], [3, 3], [4, 1]].flatMap(([i, n]) => Array.from({ length: n }, (_, k) => dot(12 + i * 6, 23 - k * 5, 2.1))).join(''),
    two: line('M6 3V28H45', 1.2) + [[13, 22], [18, 18], [22, 20], [26, 14], [31, 15], [35, 9], [40, 7], [29, 21]].map(([x, y]) => dot(x, y, 2)).join(''),
  },
  // without an order: three hues; with an order: one hue growing in strength
  scale: {
    nominal: '<circle cx="11" cy="17" r="6.5" class="wc-c1"/><rect x="19" y="10.5" width="13" height="13" rx="1.5" class="wc-c2"/><path d="M36 23.5L42 10.5L48 23.5Z" class="wc-c3" transform="translate(-2 0)"/>',
    ordinal: [8, 13, 18, 23].map((h, i) => `<rect x="${5 + i * 10}" y="${27 - h}" width="8" height="${h}" rx="1.2" fill="currentColor" fill-opacity="${0.3 + i * 0.23}"/>`).join(''),
    number: line('M4 20H44', 1.4) + line([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => `M${4 + i * 4} 20V${i % 5 ? 16.5 : 13}`).join(''), 1.2) + dot(15, 25.5, 1.8) + dot(23, 25.5, 1.8) + dot(36, 25.5, 1.8),
    time: line('M4 22H42M38.5 18.5L42 22L38.5 25.5', 1.4) + [9, 18, 27, 36].map((x) => line(`M${x} 19V25`, 1.2)).join('') + line('M9 13L18 10L27 12L36 6', 1.6) + [[9, 13], [18, 10], [27, 12], [36, 6]].map(([x, y]) => dot(x, y, 1.9)).join(''),
  },
  // counts: bars as tall as their groups; shares: every bar up to 100 %
  measure: {
    counts: [[8, [8, 6, 4]], [20, [5, 3, 3]], [32, [10, 7, 6]]].map(([x, parts]) => {
      let y = 28;
      return parts.map((h, i) => bar(x, (y -= h), 8, h - 0.8, i + 1)).join('');
    }).join(''),
    shares: [[8, [10, 8, 6]], [20, [6, 9, 9]], [32, [14, 5, 5]]].map(([x, parts]) => {
      let y = 28;
      return parts.map((h, i) => bar(x, (y -= h), 8, h - 0.8, i + 1)).join('');
    }).join(''),
  },
  // many equal values pile up on few spots; otherwise the points spread
  ties: {
    yes: [[0, 0, 1.6], [1, 0, 3.2], [2, 0, 2.2], [0, 1, 2.6], [1, 1, 4.6], [2, 1, 3.4]].map(([i, j, r]) => dot(14 + i * 10, 22 - j * 10, r, 0.85)).join(''),
    no: [[8, 23], [13, 19], [16, 25], [21, 15], [25, 20], [29, 11], [33, 16], [37, 8], [41, 13], [19, 9]].map(([x, y]) => dot(x, y, 1.7, 0.85)).join(''),
  },
};

const icon = (group, value) => (ICONS[group]?.[value] ? `<svg class="wc-icon" viewBox="0 0 48 32" aria-hidden="true" focusable="false">${ICONS[group][value]}</svg>` : '');

// small symbols in front of "why it fits" and "watch out"
const FACT_ICONS = {
  why: '<svg class="wc-fact-icon is-why" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 10.4L8.8 13L14 7.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  watch: '<svg class="wc-fact-icon is-watch" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 2.2L18.4 17H1.6Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 8v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="14.6" r="1" fill="currentColor"/></svg>',
};

// the question text and option labels of a question, which depend on how many variables there are
function question(id, answers) {
  const two = answers.some(([q, v]) => q === 'count' && v === 'two');
  const scaleKey = id === 'scale-2' ? 'scaleSecond' : two ? 'scaleFirst' : 'scaleOne';
  const key = id.startsWith('scale') ? scaleKey : id;
  const group = id.startsWith('scale') ? 'scale' : id;
  return { text: L.questions[key], path: L.path[key], group, option: (v) => L.options[group][v], example: (v) => L.examples[group][v] };
}

// placeholders in the code stand out (.wc-slot), so it is clear what to replace
const marked = (code) => highlight(code, 'r').replace(/&lt;([\w ]+)&gt;/g, '<span class="wc-slot">&lt;$1&gt;</span>');

function setup(root) {
  const optionList = (blank) => [`<option value="">${esc(blank)}</option>`, ...COLUMNS.map((c) => `<option value="${c.name}">${c.name} (${esc(L.kinds[c.kind])})</option>`)].join('');
  root.innerHTML = `
    <div class="wc-map">
      <div class="wc-map-head">
        <p data-out="count"></p>
        <div class="wc-nav">
          <button type="button" class="wc-link" data-act="back"><span aria-hidden="true">← </span>${L.back}</button>
          <button type="button" class="wc-link" data-act="reset">${L.reset}</button>
        </div>
      </div>
      <div class="wc-gallery">
        ${RESULTS.map((r) => `<button type="button" class="wc-tile" data-result="${r}" title="${esc(L.results[r].name)}">${sketch(r, 'wc-tile-sketch')}<span class="wc-tile-name">${esc(L.results[r].name)}</span></button>`).join('')}
      </div>
    </div>
    <div class="wc-path">
      <ol aria-label="${esc(L.pathHead)}"></ol>
    </div>
    <div class="wc-view">
      <div class="wc-stage" tabindex="-1"></div>
      <div class="wc-result" hidden>
        <div class="wc-hero"></div>
        <dl class="wc-facts"></dl>
        <p class="wc-code-head"></p>
        <div class="code-block"><pre class="code"><code class="language-r"></code></pre></div>
        <div class="wc-runner" hidden></div>
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
  const count = $('[data-out="count"]');
  const tiles = [...root.querySelectorAll('.wc-tile')];
  const codeBlock = $('.code-block');
  const runner = $('.wc-runner');
  let codeText = '';
  let runnerCode = '';
  addCopyButton(codeBlock, () => codeText);

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
    // where the answers scroll sideways, the latest one is in view, and the
    // left edge fades out to show that more lies before it
    path.scrollLeft = path.scrollWidth;
    path.classList.toggle('is-scrolled', path.scrollLeft > 0);
  }

  // the gallery: charts the answers rule out are dimmed, the one shown is marked
  function renderMap(chosen) {
    const open = reachable(answers);
    for (const tile of tiles) {
      const id = tile.dataset.result;
      tile.classList.toggle('is-out', !open.includes(id));
      tile.classList.toggle('is-chosen', id === chosen);
      if (id === chosen) tile.setAttribute('aria-current', 'true');
      else tile.removeAttribute('aria-current');
    }
    count.innerHTML = L.candidates.replace('{n}', `<strong>${open.length}</strong>`).replace('{total}', String(RESULTS.length));
  }

  function renderQuestion(q) {
    const words = question(q.id, answers);
    stage.innerHTML = `
      <p class="wc-question">${words.text}</p>
      <div class="wc-options">
        ${q.options.map((v, i) => `<button type="button" class="wc-option" data-value="${v}">${icon(words.group, v)}<span class="wc-option-words"><span class="wc-option-text">${esc(words.option(v))}</span><span class="wc-example">${esc(words.example(v))}</span></span><span class="wc-key" aria-hidden="true">${i + 1}</span></button>`).join('')}
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
    $('.wc-hero').innerHTML = `
      ${sketch(id, 'wc-sketch')}
      <div class="wc-hero-words">
        <p class="wc-eyebrow">${esc(L.yourChart)}</p>
        <p class="wc-name">${esc(words.name)}</p>
        ${others.length ? `<p class="wc-also">${L.alsoPossible} ${others.map((r) => `<button type="button" class="wc-other" data-result="${r}">${esc(L.results[r].name)}</button>`).join(' ')}</p>` : ''}
      </div>`;
    $('.wc-facts').innerHTML = ['why', 'watch'].map((k) => `<div class="wc-fact is-${k}">${FACT_ICONS[k]}<div><dt>${L[k]}</dt><dd>${esc(words[k])}</dd></div></div>`).join('');
    $('.wc-code-head').textContent = survey ? L.codeHeadSurvey : L.codeHead;
    codeText = template(id, survey?.roles);
    codeBlock.hidden = Boolean(survey);
    runner.hidden = !survey;
    if (!survey) code.innerHTML = marked(codeText);
    // the survey's code runs here; a new box only for new code, so that a
    // new width or another look at the same chart keeps what it drew
    else if (codeText !== runnerCode) {
      runnerCode = codeText;
      const box = document.createElement('div');
      box.className = 'runner';
      box.dataset.lang = 'r';
      box.innerHTML = '<pre class="code"><code class="language-r"></code></pre>';
      box.querySelector('code').textContent = codeText;
      runner.replaceChildren(box);
      runnable(box, { remember: false });
    }
    live.textContent = words.name;
    return id;
  }

  function render() {
    renderPath();
    back.disabled = answers.length === 0;
    root.dataset.done = '';
    const q = nextQuestion(answers);
    let chosen = null;
    if (q) {
      delete root.dataset.done;
      stage.hidden = false;
      live.textContent = renderQuestion(q);
    } else {
      chosen = renderResult(survey?.results ?? resultsFor(answers));
    }
    renderMap(chosen);
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

  // a sketch in the gallery: the answers that lead to its chart
  function jumpTo(id) {
    const way = pathTo(id);
    if (!way) return;
    dropSurvey();
    answers = way.answers;
    shown = way.index;
    render();
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
  $('.wc-gallery').addEventListener('click', (e) => {
    const tile = e.target.closest('.wc-tile');
    if (tile) jumpTo(tile.dataset.result);
  });
  back.addEventListener('click', goBack);
  $('[data-act="reset"]').addEventListener('click', reset);
  path.addEventListener('scroll', () => path.classList.toggle('is-scrolled', path.scrollLeft > 0), { passive: true });
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
