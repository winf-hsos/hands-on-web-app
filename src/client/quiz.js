// Quizzes. A single-choice question is answered with one click: it shows at
// once whether that was right, and the explanation. A multiple-choice
// question has a Check button, ready as soon as an option is chosen, so that
// the feedback appears right there. A quiz counts as done once
// every question was answered correctly at least once. With more than one
// question, the quiz shows one question at a time, with Back and Next, a bar
// with one segment per question, and a short result at the end. The
// options are lettered A, B, C … (site.css), and pressing a letter chooses
// that option of the question on show, as a click does. The arrow keys move
// like Back and Next, and Enter moves on as well, unless a multiple-choice
// question waits to be checked.
//
// A lesson may hold quizzes (build/embed.mjs): each is set up on its own,
// counts for the quiz it is (data-quiz-id), and takes the keys only while it
// has the focus or is on screen. Only the quiz on its own page keeps its
// question in the address.
import { load, update, today } from './progress.js';
import { focusable } from './focus.js';

const page = document.querySelector('[data-item-page]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fill = (text, n, m) => text.replace('{n}', n).replace('{m}', m);
const letter = (i) => String.fromCharCode(65 + i);
const changed = (question) => question.dispatchEvent(new CustomEvent('quiz-changed', { bubbles: true }));

/** Every quiz on the page: { prose, embedded, questions, control, move() }. */
const quizzes = [];

// the text of a quiz, not the goals above it, which are prose as well
for (const prose of document.querySelectorAll('.prose[data-labels]')) setup(prose);

function setup(prose) {
  const labels = prose.dataset;
  const L = JSON.parse(labels.labels);
  const embedded = !!prose.dataset.quizId;
  const id = prose.dataset.quizId ?? page.dataset.itemPage;
  const questions = [...prose.querySelectorAll('.quiz-question')];
  const stepper = questions.length > 1;

  /** Per question: { evaluate(), reset() }. */
  const control = new Map();
  const quiz = { prose, embedded, questions, control, move: () => false };
  quizzes.push(quiz);

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
    const reasons = (show) =>
      options.forEach((o) => o.querySelector('.quiz-reason')?.toggleAttribute('hidden', !show(o)));

    function evaluate() {
      const ok = options.every((o) => (o.dataset.correct === 'true') === (o.getAttribute('aria-checked') === 'true'));
      question.classList.add('is-checked', ok ? 'is-correct' : 'is-wrong');
      verdict.textContent = ok ? labels.correct : labels.wrong;
      explanation?.removeAttribute('hidden');
      // the reasons of what was chosen and of what would have been right
      reasons((o) => o.getAttribute('aria-checked') === 'true' || o.dataset.correct === 'true');
      check.textContent = labels.again;
      check.hidden = false;
      check.disabled = false;
      changed(question);
      update(id, (p) => {
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
      reasons(() => false);
      check.textContent = labels.check;
      check.hidden = !multiple;
      check.disabled = true;
      verdict.textContent = '';
      changed(question);
    }

    options.forEach((option, i) => {
      option.tabIndex = 0;
      option.setAttribute('role', multiple ? 'checkbox' : 'radio');
      option.setAttribute('aria-keyshortcuts', letter(i));
      option.setAttribute('aria-checked', 'false');
      const toggle = () => {
        if (checked()) return;
        if (!multiple) options.forEach((o) => o !== option && o.setAttribute('aria-checked', 'false'));
        option.setAttribute('aria-checked', String(option.getAttribute('aria-checked') !== 'true'));
        if (multiple) check.disabled = !selected();
        else evaluate();
      };
      option.addEventListener('click', toggle);
      // Space, as for any radio button or checkbox; Enter moves on (below)
      option.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });

    check.addEventListener('click', () => (checked() ? reset() : evaluate()));
    const waiting = () => multiple && !checked() && selected();
    control.set(question, { evaluate, reset, waiting });
  }

  // --- focus ---------------------------------------------------------------------

  // The questions, with the bar and the result, sit in one stage, which a
  // button shows alone and enlarged, to discuss the quiz in class. It is as
  // large as the screen allows for the question on show once it is answered,
  // with every reason and the explanation open, so that nothing has to scroll
  // and nothing changes size when the answer is checked.
  let refit;
  let tools;
  if (questions.length) {
    const stage = Object.assign(document.createElement('div'), { className: 'quiz-stage' });
    tools = Object.assign(document.createElement('div'), { className: 'quiz-tools' });
    const last = questions.at(-1);
    questions[0].before(stage);
    let node = stage.nextSibling;
    while (node) {
      const following = node.nextSibling;
      stage.append(node);
      if (node === last) break;
      node = following;
    }
    stage.prepend(tools);

    // What is on show, copied as it looks at most after the answer, measured
    // at page size: the explanation, and the reasons of what was chosen and of
    // what is right, so for one answer the right one's and the longest other.
    function measure() {
      const probe = document.createElement('div');
      probe.className = 'focus-measure';
      for (const part of stage.children) if (part !== tools && !part.hidden) probe.append(part.cloneNode(true));
      probe.querySelectorAll('.quiz-explanation, .quiz-actions button').forEach((el) => el.removeAttribute('hidden'));
      for (const options of probe.querySelectorAll('.quiz-options')) {
        const all = [...options.querySelectorAll('.quiz-option')];
        const wrong = all.filter((o) => o.dataset.correct !== 'true');
        const longest = (list) => list.sort((x, y) => y.textContent.length - x.textContent.length).slice(0, 1);
        const open = options.dataset.multiple === 'true' ? all : [...all.filter((o) => o.dataset.correct === 'true'), ...longest(wrong)];
        for (const option of open) option.querySelector('.quiz-reason')?.removeAttribute('hidden');
      }
      const longest = [labels.correct, labels.wrong].sort((a, b) => b.length - a.length)[0];
      probe.querySelectorAll('.quiz-verdict').forEach((el) => (el.textContent = longest));
      stage.append(probe);
      const height = probe.getBoundingClientRect().height;
      probe.remove();
      return height;
    }
    // on a wide screen, longer lines leave fewer of them and so larger text
    refit = focusable(stage, tools, { height: measure, widths: [800, 960] });
  }

  // --- one question at a time ----------------------------------------------------

  function el(tag, props = {}, ...children) {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children);
    return node;
  }

  if (stepper) {
    const n = questions.length;
    const stored = load().items[id]?.quiz ?? {};
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
    // Back and Next sit in the header with the position and the bar, so they
    // stay in one place however long a question and its answers are.
    const back = el('button', { type: 'button', className: 'button button-quiet quiz-back', textContent: `← ${L.back}` });
    const next = el('button', { type: 'button', className: 'button quiz-next' });
    // the focus symbol joins them at the end of the row
    const bar = el('div', { className: 'quiz-bar' }, back, position, next, tools, el('div', { className: 'quiz-steps' }, ...steps));
    const score = el('p', { className: 'quiz-score' });
    const restart = el('button', { type: 'button', className: 'button quiz-restart', textContent: L.restart });
    const result = el('section', { className: 'quiz-result', hidden: true }, el('h2', { textContent: L.result, tabIndex: -1 }), score, restart);
    questions[0].before(bar);
    questions[n - 1].after(result);
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
      refit?.();
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
    back.setAttribute('aria-keyshortcuts', 'ArrowLeft');
    next.setAttribute('aria-keyshortcuts', 'ArrowRight Enter');
    quiz.move = (by) => {
      const to = current + by;
      if (to < 0 || to > n) return false;
      show(to);
      return true;
    };
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
      if (embedded) return;
      const params = new URLSearchParams(location.search);
      if (index === 0) params.delete('question');
      else params.set('question', index === n ? 'result' : String(index + 1));
      history.replaceState(history.state, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
    }
    const asked = embedded ? null : new URLSearchParams(location.search).get('question');
    const start = asked === 'result' ? n : Math.min(Math.max(Number.parseInt(asked, 10) || 1, 1), n) - 1;
    show(start, { focus: false });
  }
}

// --- keys ----------------------------------------------------------------------

/**
 * The quiz the keys are for: the one with the focus, else the quiz of a quiz's
 * own page, else an embedded quiz on screen. A lesson's quiz out of sight
 * leaves the letters and arrows to the rest of the page.
 */
function active() {
  const focused = quizzes.find((q) => q.prose.contains(document.activeElement));
  if (focused) return focused;
  const own = quizzes.find((q) => !q.embedded);
  if (own) return own;
  return quizzes.find((q) => {
    const box = q.prose.getBoundingClientRect();
    return box.bottom > 0 && box.top < innerHeight;
  });
}

// Listened for before focus mode's F (focus.js), so that a sixth option F
// still answers; a letter without an option is left to the rest of the page.
document.addEventListener(
  'keydown',
  (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || !/^[a-z]$/i.test(e.key)) return;
    if (e.target.closest?.('input, textarea, select, [contenteditable], dialog')) return;
    const question = active()?.questions.find((q) => !q.hidden);
    const option = question?.querySelectorAll('.quiz-option')[e.key.toUpperCase().charCodeAt(0) - 65];
    if (!option) return;
    e.preventDefault();
    e.stopPropagation();
    option.click();
    option.focus({ preventScroll: true });
  },
  true,
);

// A focused button or link keeps its own Enter, and a multiple-choice question
// with something chosen is checked first, so that Enter never skips an answer.
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.repeat) return;
  if (!['Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  if (e.target.closest?.('input, textarea, select, [contenteditable], dialog')) return;
  if (e.key === 'Enter' && e.target.closest?.('button, a, summary')) return;
  const quiz = active();
  if (!quiz) return;
  const question = quiz.questions.find((q) => !q.hidden);
  let acted;
  if (e.key === 'Enter' && question && quiz.control.get(question).waiting()) {
    quiz.control.get(question).evaluate();
    acted = true;
  } else acted = quiz.move(e.key === 'ArrowLeft' ? -1 : 1);
  if (acted) e.preventDefault();
});
