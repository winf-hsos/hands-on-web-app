// Course page: units before their release date are folded and greyed out
// (a display rule, not a lock), and opening the page adds the course to
// "My learning".
import { load, save } from './progress.js';

const today = new Date().toISOString().slice(0, 10);
for (const unit of document.querySelectorAll('.unit[data-from]')) {
  const later = unit.dataset.from > today;
  unit.classList.toggle('is-later', later);
  unit.open = !later;
  unit.querySelector('.unit-date').hidden = !later;
}

const id = document.querySelector('[data-course]').dataset.course;
const progress = load();
if (!progress.courses.includes(id)) {
  progress.courses.push(id);
  save(progress);
}
