// Folded parts of a path and sections of a module: this browser remembers
// which ones were opened or closed. A key names the path, part or section, not
// the page, so a part opened on the path page is open in every module showing
// that path as well. The page decides how a fold starts (closed, or open when
// a path has a single part); only what the learner changed is stored.
const CLOSED = 'hocs-folded';
const OPENED = 'hocs-opened';
const folds = [...document.querySelectorAll('details[data-fold]')];

function load(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? '[]'));
  } catch {
    return new Set();
  }
}

function store(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {}
}

// Restored without the folding animation, so the page does not move.
const closed = load(CLOSED);
const opened = load(OPENED);
const root = document.documentElement;
root.classList.add('fold-restoring');
for (const fold of folds) {
  if (closed.has(fold.dataset.fold)) fold.open = false;
  else if (opened.has(fold.dataset.fold)) fold.open = true;
}
setTimeout(() => root.classList.remove('fold-restoring'), 100);

for (const fold of folds) {
  fold.addEventListener('toggle', () => {
    const key = fold.dataset.fold;
    const nowClosed = load(CLOSED);
    const nowOpened = load(OPENED);
    if (fold.open) {
      nowClosed.delete(key);
      nowOpened.add(key);
    } else {
      nowOpened.delete(key);
      nowClosed.add(key);
    }
    store(CLOSED, nowClosed);
    store(OPENED, nowOpened);
  });
}
