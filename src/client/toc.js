// The table of contents beside a long item marks the section being read: the
// last heading that has passed a line a third down the window, or the start
// while none has. At the end of the page the last section counts, even when
// it is too short to reach that line.
const nav = document.querySelector('.toc');
const links = [...nav.querySelectorAll('a')];
const list = nav.querySelector('.toc-inner');
const heads = links.map((a) => (a.hasAttribute('data-toc-start') ? null : document.getElementById(decodeURIComponent(a.hash.slice(1)))));

let current = -1;
function mark() {
  const line = innerHeight / 3;
  let index = 0;
  heads.forEach((head, i) => {
    if (head && head.getBoundingClientRect().top <= line) index = i;
  });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) index = links.length - 1;
  if (index === current) return;
  current = index;
  links.forEach((a, i) => (i === index ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
  // a long list scrolls itself, so that the marked entry stays in sight
  const a = links[index];
  if (a.offsetTop < list.scrollTop || a.offsetTop + a.offsetHeight > list.scrollTop + list.clientHeight) {
    list.scrollTop = a.offsetTop - list.clientHeight / 3;
  }
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

// the start is the top of the page, without a "#" left in the address
nav.querySelector('[data-toc-start]').addEventListener('click', (event) => {
  event.preventDefault();
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  history.replaceState(null, '', location.pathname + location.search);
});
