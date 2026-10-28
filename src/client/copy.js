// A copy button in the corner of every code block. Static blocks get it from
// here (imported by site.js); runnable blocks from runner.js, which copies
// what is in the editor at the moment, changes included.

const L = JSON.parse(document.body.dataset.copyLabels ?? '{}');
const COPY = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg>';
const DONE = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

async function write(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // without the clipboard API (an insecure origin, an old browser)
    const area = Object.assign(document.createElement('textarea'), { value: text });
    area.style.cssText = 'position:fixed;opacity:0';
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
}

/** Puts a copy button into `box`, which copies whatever `text()` returns. */
export function addCopyButton(box, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-code';
  button.title = L.copy;
  button.setAttribute('aria-label', L.copy);
  button.innerHTML = `${COPY}<span class="copy-code-done">${L.copied}</span>`;
  let timer;
  button.addEventListener('click', () => {
    // feedback at once; some browsers take a moment to confirm the write
    write(text());
    button.dataset.copied = '';
    button.firstElementChild.outerHTML = DONE;
    clearTimeout(timer);
    timer = setTimeout(() => {
      delete button.dataset.copied;
      button.firstElementChild.outerHTML = COPY;
    }, 1600);
  });
  box.append(button);
  return button;
}

// Static blocks: the button sits in a wrapper, so that it stays in the corner
// when a long line makes the block scroll sideways.
for (const pre of document.querySelectorAll('.prose pre')) {
  if (pre.closest('.runner, .verb-demo, .monty-hall')) continue;
  const wrap = Object.assign(document.createElement('div'), { className: 'code-block' });
  pre.replaceWith(wrap);
  wrap.append(pre);
  addCopyButton(wrap, () => pre.textContent.replace(/\n$/, ''));
}
