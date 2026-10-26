// Quizzes. A single-choice question is answered with one click: it shows at
// once whether that was right, and the explanation. A multiple-choice
// question has a Check button, ready as soon as an option is chosen, so that
// the feedback appears right there. A quiz counts as done once
// every question was answered correctly at least once. With more than one
// question, the quiz shows one question at a time, with Back and Next, a bar
// with one segment per question, and a short result at the end.
import { load, update, today } from './progress.js';

const page = document.querySelector('[data-item-page]');
const prose = document.querySelector('.prose');
const labels = prose.dataset;
const L = JSON.parse(labels.labels);
const questions = [...document.querySelectorAll('.quiz-question')];
const stepper = questions.length > 1;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fill = (text, n, m) => text.replace('{n}', n).replace('{m}', m);

/** Per question: { evaluate(), reset() }. */
const control = new Map();
const changed = (question) => question.dispatchEvent(new CustomEvent('quiz-changed', { bubbles: true }));

for (const question of questions) {
  const options = [...question.querySelectorAll('.quiz-option')];
  const multiple = question.querySelector('.quiz-options')?.dataset.multiple === 'true';
  const checked = () => question.classList.contains('is-checked');
  const selected = () => options.some((o) => o.getAttribute('aria-checked') === 'true');

  const actions = document.createElement('div');
  actions.className = 'quiz-actions';
  // Before the answer, only a multiple-choice question needs the button;
  // after it, every question offers to try again.
  const check = Object.assign(document.createElement('button'), { type: 'button', textContent: labels.check });
  check.hidden = !multiple;
  check.disabled = true;
  const verdict = Object.assign(document.createElement('p'), { className: 'quiz-verdict' });
  verdict.setAttribute('aria-live', 'polite');
  actions.append(check, verdict);
  question.querySelector('.quiz-options').after(actions);
  const explanation = question.querySelector('.quiz-explanation');

  function evaluate() {
    const ok = options.every((o) => (o.dataset.correct === 'true') === (o.getAttribute('aria-checked') === 'true'));
    question.classList.add('is-checked', ok ? 'is-correct' : 'is-wrong');
    verdict.textContent = ok ? labels.correct : labels.wrong;
    explanation?.removeAttribute('hidden');
    check.textContent = labels.again;
    check.hidden = false;
    check.disabled = false;
    changed(question);
    update(page.dataset.itemPage, (p) => {
      p.quiz ??= {};
      const key = question.dataset.question;
      p.quiz[key] = p.quiz[key] || (ok ? 1 : 0);
      if (questions.every((q) => p.quiz[q.dataset.question] === 1)) p.done ??= today();
    });
  }

  function reset() {
    question.classList.remove('is-checked', 'is-correct', 'is-wrong');
    options.forEach((o) => o.setAttribute('aria-checked', 'false'));
    explanation?.setAttribute('hidden', '');
    check.textContent = labels.check;
    check.hidden = !multiple;
    check.disabled = true;
    verdict.textContent = '';
    changed(question);
  }

  for (const option of options) {
    option.tabIndex = 0;
    option.setAttribute('role', multiple ? 'checkbox' : 'radio');
    option.setAttribute('aria-checked', 'false');
    const toggle = () => {
      if (checked()) return;
      if (!multiple) options.forEach((o) => o !== option && o.setAttribute('aria-checked', 'false'));
      option.setAttribute('aria-checked', String(option.getAttribute('aria-checked') !== 'true'));
      if (multiple) check.disabled = !selected();
      else evaluate();
    };
    option.addEventListener('click', toggle);
    option.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    });
  }

  check.addEventListener('click', () => (checked() ? reset() : evaluate()));
  control.set(question, { evaluate, reset });
}

// --- one question at a time ----------------------------------------------------

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

if (stepper) {
  const n = questions.length;
  const stored = load().items[page.dataset.itemPage]?.quiz ?? {};
  const position = el('span', { className: 'quiz-position' });
  position.setAttribute('aria-live', 'polite');
  const steps = questions.map((q, i) => {
    const step = el('button', { type: 'button', className: 'quiz-step', title: fill(L.position, i + 1, n) });
    step.setAttribute('aria-label', fill(L.position, i + 1, n));
    // answered correctly on an earlier visit: shown faintly until answered now
    if (stored[q.dataset.question] === 1) step.classList.add('was-correct');
    step.addEventListener('click', () => show(i));
    return step;
  });
  const bar = el('div', { className: 'quiz-bar' }, position, el('div', { className: 'quiz-steps' }, ...steps));
  const back = el('button', { type: 'button', className: 'button button-quiet quiz-back', textContent: `← ${L.back}` });
  const next = el('button', { type: 'button', className: 'button quiz-next' });
  const nav = el('div', { className: 'quiz-nav' }, back, next);
  const score = el('p', { className: 'quiz-score' });
  const restart = el('button', { type: 'button', className: 'button quiz-restart', textContent: L.restart });
  const result = el('section', { className: 'quiz-result', hidden: true }, el('h2', { textContent: L.result, tabIndex: -1 }), score, restart);
  questions[0].before(bar);
  questions[n - 1].after(nav);
  nav.before(result);
  prose.classList.add('quiz-stepper');

  let current = 0;
  const state = (q) => (q.classList.contains('is-correct') ? 'correct' : q.classList.contains('is-wrong') ? 'wrong' : null);

  function paint() {
    steps.forEach((step, i) => {
      const s = state(questions[i]);
      step.classList.toggle('is-correct', s === 'correct');
      step.classList.toggle('is-wrong', s === 'wrong');
      if (i === current) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    // the result has its own heading, so the line above the bar stays empty there
    position.textContent = current < n ? fill(L.position, current + 1, n) : '\u00a0';
    back.disabled = current === 0;
    next.hidden = current === n;
    next.textContent = current === n - 1 ? L.finish : `${L.next} →`;
  }

  function show(index, { focus = true } = {}) {
    const from = current;
    current = index;
    questions.forEach((q, i) => (q.hidden = i !== index));
    result.hidden = index !== n;
    if (index === n) {
      const right = questions.filter((q) => state(q) === 'correct').length;
      const open = questions.filter((q) => !state(q)).length;
      score.textContent = fill(L.score, right, n) + (open ? ` · ${fill(L.open, open, n)}` : '');
    }
    paint();
    remember(index);
    const shown = index === n ? result : questions[index];
    if (!reduceMotion && from !== index) {
      const dx = index > from ? 24 : -24;
      shown.animate([{ opacity: 0, transform: `translateX(${dx}px)` }, { opacity: 1, transform: 'none' }], {
        duration: 260,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      });
    }
    if (!focus) return;
    if (bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    (shown.querySelector('h2') ?? shown).focus({ preventScroll: true });
  }

  for (const q of questions) q.querySelector('h2').tabIndex = -1;
  back.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  restart.addEventListener('click', () => {
    for (const q of questions) control.get(q).reset();
    show(0);
  });
  prose.addEventListener('quiz-changed', paint);

  // The active question lives in the address (?question=3, or =result), so
  // that a reload, "back" or a shared link opens the quiz at the same place.
  function remember(index) {
    const params = new URLSearchParams(location.search);
    if (index === 0) params.delete('question');
    else params.set('question', index === n ? 'result' : String(index + 1));
    history.replaceState(history.state, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  }
  const asked = new URLSearchParams(location.search).get('question');
  const start = asked === 'result' ? n : Math.min(Math.max(Number.parseInt(asked, 10) || 1, 1), n) - 1;
  show(start, { focus: false });
}
