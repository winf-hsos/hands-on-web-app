// List or cards for the `.switchable` list of a page: a preference of this
// browser, set on <html> by the inline script in the head before the first
// paint, so the page does not jump.

const root = document.documentElement;
const switches = [...document.querySelectorAll('.view-switch button')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function show(view) {
  for (const b of switches) b.setAttribute('aria-pressed', String(b.dataset.view === view));
}

show(root.dataset.view === 'cards' ? 'cards' : 'list');
for (const button of switches) {
  button.addEventListener('click', () => {
    const view = button.dataset.view;
    if ((root.dataset.view ?? 'list') === view) return;
    root.dataset.view = view;
    show(view);
    try {
      localStorage.setItem('hocs-view', view);
    } catch {}
    if (reduceMotion) return;
    for (const list of document.querySelectorAll('.switchable')) {
      list.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], {
        duration: 260,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      });
    }
  });
}
