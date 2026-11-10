// The score of a test (Nicolas, 2026-11-10): each task is checked with the
// button of its R box (runner.js), and this box at the end of the page says how
// many are right and which are not yet. The results live in the progress of
// this browser, like those of a quiz, so the score stays after a reload.
import { load } from './progress.js';

const page = document.querySelector('[data-test]');
if (page) {
  const tasks = JSON.parse(page.dataset.test);
  const L = JSON.parse(page.dataset.testLabels);
  const id = page.dataset.itemPage;
  const score = document.createElement('section');
  score.className = 'test-score';
  score.setAttribute('aria-live', 'polite');
  const prose = page.querySelectorAll('.prose');
  (prose[prose.length - 1] ?? page).after(score);

  const show = () => {
    const results = load().items[id]?.test ?? {};
    const right = tasks.filter((t) => results[t.number] === 1);
    const open = tasks.filter((t) => results[t.number] !== 1);
    const checked = tasks.some((t) => results[t.number] !== undefined);
    const line = document.createElement('p');
    line.className = 'test-score-line';
    line.textContent = L.score.replace('{n}', right.length).replace('{total}', tasks.length);
    const bar = document.createElement('progress');
    bar.max = tasks.length;
    bar.value = right.length;
    const note = document.createElement('p');
    note.className = 'test-score-note';
    if (!checked) note.textContent = L.none;
    else if (!open.length) note.textContent = L.all;
    else {
      // the chapters to review, each once, for the tasks not right yet
      const reviews = [...new Map(open.filter((t) => t.review).map((t) => [t.review.url, t.review])).values()];
      note.append(`${L.open} ${open.map((t) => t.number).join(', ')}.`);
      if (reviews.length) {
        note.append(` ${L.review} `);
        reviews.forEach((r, i) => {
          if (i) note.append(', ');
          const a = document.createElement('a');
          a.href = r.url;
          a.textContent = r.title;
          note.append(a);
        });
      }
    }
    score.classList.toggle('is-complete', !open.length);
    score.replaceChildren(line, bar, note);
  };
  show();
  document.addEventListener('progress-change', show);
}
