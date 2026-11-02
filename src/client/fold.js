// Folded parts of a path and sections of a module: this browser remembers
// which ones were closed. A key names the path, part or section, not the page,
// so a part closed on the path page is closed in every module showing that
// path as well. Only closed ones are stored; everything starts open.
const STORE = 'hocs-folded';
const folds = [...document.querySelectorAll('details[data-fold]')];

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORE) ?? '[]'));
  } catch {
    return new Set();
  }
}

// Restored without the folding animation, so the page does not move.
const closed = load();
const root = document.documentElement;
root.classList.add('fold-restoring');
for (const fold of folds) if (closed.has(fold.dataset.fold)) fold.open = false;
setTimeout(() => root.classList.remove('fold-restoring'), 100);

for (const fold of folds) {
  fold.addEventListener('toggle', () => {
    const now = load();
    if (fold.open) now.delete(fold.dataset.fold);
    else now.add(fold.dataset.fold);
    try {
      localStorage.setItem(STORE, JSON.stringify([...now]));
    } catch {}
  });
}
