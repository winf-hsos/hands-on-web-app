// Course page: opening it adds the course to "My learning".
import { load, save } from './progress.js';

const id = document.querySelector('[data-course]').dataset.course;
const progress = load();
if (!progress.courses.includes(id)) {
  progress.courses.push(id);
  save(progress);
}
