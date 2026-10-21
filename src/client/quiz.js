// Quizzes: options are toggles, "Check" reveals the verdict and the
// explanation. A quiz counts as done once every question was answered
// correctly at least once.
import { update, today } from './progress.js';

const page = document.querySelector('[data-item-page]');
const labels = document.querySelector('.prose').dataset;
const questions = [...document.querySelectorAll('.quiz-question')];

for (const question of questions) {
  const options = [...question.querySelectorAll('.quiz-option')];
  const multiple = question.querySelector('.quiz-options')?.dataset.multiple === 'true';
  for (const option of options) {
    option.tabIndex = 0;
    option.setAttribute('role', multiple ? 'checkbox' : 'radio');
    option.setAttribute('aria-checked', 'false');
    const toggle = () => {
      if (question.classList.contains('is-checked')) return;
      if (!multiple) options.forEach((o) => o !== option && o.setAttribute('aria-checked', 'false'));
      option.setAttribute('aria-checked', String(option.getAttribute('aria-checked') !== 'true'));
    };
    option.addEventListener('click', toggle);
    option.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    });
  }

  const actions = document.createElement('div');
  actions.className = 'quiz-actions';
  const check = Object.assign(document.createElement('button'), { type: 'button', textContent: labels.check });
  const verdict = Object.assign(document.createElement('p'), { className: 'quiz-verdict' });
  verdict.setAttribute('aria-live', 'polite');
  actions.append(check, verdict);
  question.querySelector('.quiz-options').after(actions);
  const explanation = question.querySelector('.quiz-explanation');

  check.addEventListener('click', () => {
    if (question.classList.contains('is-checked')) {
      question.classList.remove('is-checked', 'is-correct', 'is-wrong');
      options.forEach((o) => o.setAttribute('aria-checked', 'false'));
      explanation?.setAttribute('hidden', '');
      check.textContent = labels.check;
      verdict.textContent = '';
      return;
    }
    const ok = options.every((o) => (o.dataset.correct === 'true') === (o.getAttribute('aria-checked') === 'true'));
    question.classList.add('is-checked', ok ? 'is-correct' : 'is-wrong');
    verdict.textContent = ok ? labels.correct : labels.wrong;
    explanation?.removeAttribute('hidden');
    check.textContent = labels.again;
    update(page.dataset.itemPage, (p) => {
      p.quiz ??= {};
      const key = question.dataset.question;
      p.quiz[key] = p.quiz[key] || (ok ? 1 : 0);
      if (questions.every((q) => p.quiz[q.dataset.question] === 1)) p.done ??= today();
    });
  });
}
