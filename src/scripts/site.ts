// Behaviour shared by every page: theme, search box, progress marks, quizzes.
import { load, update, isDone, siteData, today, type Progress } from './progress';

const data = siteData();

// Theme: dark or light, remembered per browser; the default follows the system.
document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try {
    localStorage.setItem('hocs-theme', root.dataset.theme);
  } catch {}
});

// Search box: a known four-digit code jumps straight to its page.
const search = document.querySelector<HTMLFormElement>('.header-search');
search?.addEventListener('submit', (event) => {
  const query = (search.elements.namedItem('q') as HTMLInputElement).value.trim();
  if (!/^\d{4}$/.test(query)) return;
  const target = [...data.items, ...data.paths, ...data.courses].find((d) => String(d.code) === query);
  if (target) {
    event.preventDefault();
    location.href = target.url;
  }
});

// Item pages: record the visit and offer "mark as done".
const page = document.querySelector<HTMLElement>('[data-item-page]');
if (page) {
  const id = page.dataset.itemPage!;
  update(id, (p) => (p.seen ??= today()));
  const button = document.querySelector<HTMLButtonElement>('[data-mark-done]');
  button?.addEventListener('click', () =>
    update(id, (p) => {
      p.done = p.done ? undefined : today();
    }),
  );
}

function render(progress: Progress) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-progress-id]')) {
    el.classList.toggle('is-done', isDone(progress, el.dataset.progressId!));
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-progress-ids]')) {
    const ids = el.dataset.progressIds!.split(' ').filter(Boolean);
    const done = ids.filter((id) => isDone(progress, id)).length;
    el.style.setProperty('--progress', `${ids.length ? (done / ids.length) * 100 : 0}%`);
    const label = el.querySelector('.progress-label');
    if (label) label.textContent = `${done} ${data.labels.of} ${ids.length} ${data.labels.done}`;
  }
  const button = document.querySelector<HTMLButtonElement>('[data-mark-done]');
  if (button && page) {
    const done = isDone(progress, page.dataset.itemPage!);
    button.setAttribute('aria-pressed', String(done));
    button.textContent = done ? button.dataset.labelDone! : button.dataset.labelOpen!;
  }
}
render(load());
document.addEventListener('progress-change', (e) => render((e as CustomEvent<Progress>).detail));
// Another tab may change progress, too.
addEventListener('storage', (e) => e.key === 'hocs-progress' && render(load()));

// Quizzes: options are buttons; the explanation appears after checking.
if (page && document.querySelector('.quiz-question')) {
  const id = page.dataset.itemPage!;
  const labels = document.querySelector<HTMLElement>('[data-quiz-labels]')!.dataset;
  const questions = [...document.querySelectorAll<HTMLElement>('.quiz-question')];
  for (const question of questions) {
    const options = [...question.querySelectorAll<HTMLElement>('.quiz-option')];
    const multiple = question.querySelector('.quiz-options')?.getAttribute('data-multiple') === 'true';
    options.forEach((option) => {
      option.tabIndex = 0;
      option.setAttribute('role', multiple ? 'checkbox' : 'radio');
      option.setAttribute('aria-checked', 'false');
      const toggle = () => {
        if (question.classList.contains('is-checked')) return;
        if (!multiple) options.forEach((o) => o.setAttribute('aria-checked', 'false'));
        option.setAttribute('aria-checked', String(option.getAttribute('aria-checked') !== 'true'));
      };
      option.addEventListener('click', toggle);
      option.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      });
    });
    const actions = document.createElement('div');
    actions.className = 'quiz-actions';
    const check = Object.assign(document.createElement('button'), { type: 'button', textContent: labels.check });
    const verdict = document.createElement('p');
    verdict.className = 'quiz-verdict';
    verdict.setAttribute('aria-live', 'polite');
    actions.append(check, verdict);
    question.querySelector('.quiz-options')!.after(actions);
    check.addEventListener('click', () => {
      if (question.classList.contains('is-checked')) {
        question.classList.remove('is-checked', 'is-correct', 'is-wrong');
        options.forEach((o) => o.setAttribute('aria-checked', 'false'));
        question.querySelector<HTMLElement>('.quiz-explanation')?.setAttribute('hidden', '');
        check.textContent = labels.check!;
        verdict.textContent = '';
        return;
      }
      const ok = options.every((o) => (o.dataset.correct === 'true') === (o.getAttribute('aria-checked') === 'true'));
      question.classList.add('is-checked', ok ? 'is-correct' : 'is-wrong');
      verdict.textContent = ok ? labels.correct! : labels.wrong!;
      question.querySelector<HTMLElement>('.quiz-explanation')?.removeAttribute('hidden');
      check.textContent = labels.again!;
      update(id, (p) => {
        p.quiz ??= {};
        const key = question.dataset.question!;
        p.quiz[key] = (p.quiz[key] || (ok ? 1 : 0)) as 0 | 1;
        // A quiz counts as done once every question was answered correctly at least once.
        if (questions.every((q) => p.quiz![q.dataset.question!] === 1)) p.done ??= today();
      });
    });
  }
}
