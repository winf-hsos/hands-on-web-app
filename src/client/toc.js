// The table of contents beside a long item marks the section being read: the
// last heading that has passed a line near the top of the window, or the
// start while none has. At the end of the page the last section counts, even
// when it is too short to reach that line. A section reached through the
// list, or through the address, stays marked until the reader scrolls on,
// even when the next heading follows close below it or the page cannot
// scroll that far.
//
// Only the top-level sections are listed; the subsections of the section
// being read unfold below it and fold away again once the reader moves on to
// the next section (Nicolas, 2026-11-05). Without this script all of them
// stay visible.
const nav = document.querySelector('.toc');
const links = [...nav.querySelectorAll('a')];
const list = nav.querySelector('.toc-inner');
const heads = links.map((a) => (a.hasAttribute('data-toc-start') ? null : document.getElementById(decodeURIComponent(a.hash.slice(1)))));
// the top-level section each entry belongs to: its own index for a section,
// the index of the section above it for a subsection
const items = links.map((a) => a.parentElement);
let parent = 0;
const sectionOf = items.map((li, i) => (li.classList.contains('toc-3') ? parent : (parent = i)));
nav.classList.add('is-folding');

let current = -1;
let pinned = links.findIndex((a) => !a.hasAttribute('data-toc-start') && a.hash === location.hash);

function show(index) {
  if (index === current) return;
  current = index;
  links.forEach((a, i) => (i === index ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
  items.forEach((li, i) => li.classList.toggle('is-open', li.classList.contains('toc-3') && sectionOf[i] === sectionOf[index]));
  // a long list scrolls itself, so that the marked entry stays in sight
  const a = links[index];
  if (a.offsetTop < list.scrollTop || a.offsetTop + a.offsetHeight > list.scrollTop + list.clientHeight) {
    list.scrollTop = a.offsetTop - list.clientHeight / 3;
  }
}

function mark() {
  if (pinned >= 0) return show(pinned);
  const line = Math.min(innerHeight / 4, 160);
  let index = 0;
  heads.forEach((head, i) => {
    if (head && head.getBoundingClientRect().top <= line) index = i;
  });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) index = links.length - 1;
  show(index);
}

let pending = false;
const schedule = () => {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    mark();
  });
};
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule);
mark();

// The jump itself scrolls the page; only the reader's own scrolling, by
// wheel, touch or keys, lets the marker follow the page again.
const release = () => {
  if (pinned < 0) return;
  pinned = -1;
  schedule();
};
addEventListener('wheel', release, { passive: true });
addEventListener('touchmove', release, { passive: true });
addEventListener('keydown', (e) => ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key) && release());

links.forEach((a, i) =>
  a.addEventListener('click', () => {
    pinned = i;
    show(i);
  }),
);

// the start is the top of the page, without a "#" left in the address
nav.querySelector('[data-toc-start]').addEventListener('click', (event) => {
  event.preventDefault();
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  history.replaceState(null, '', location.pathname + location.search);
});
