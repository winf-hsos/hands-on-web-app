// Project page: phases and challenges are folded, so the page starts as an
// overview. A link to #phase-or-challenge opens exactly that part.
function reveal() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id && document.getElementById(id);
  if (!target) return;
  for (let el = target; el; el = el.parentElement?.closest('details')) {
    if (el.tagName === 'DETAILS') el.open = true;
    else el.querySelector(':scope > details')?.setAttribute('open', '');
  }
  target.scrollIntoView({ block: 'start' });
}
reveal();
addEventListener('hashchange', reveal);
