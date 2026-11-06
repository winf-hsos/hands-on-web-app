// The prefix trap: the reader writes the code words for a, b, c and d and
// types a word. Only the bits go over the wire, without gaps, and the
// receiver lists every way they can be cut into code words. As long as one
// code word is the beginning of another, there are several, and the panel
// below names which one starts which; it does not say how to do it right. A
// prefix-free code, built by the reader, brings the list down to one. Taken
// over from the LiFi concept demos (prefix-trap) and drawn in the platform's
// own design.
//
// Written with ```prefix-trap in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-prefix-trap-labels on <body>).
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.prefixTrapLabels ?? '{}');
const LETTERS = ['a', 'b', 'c', 'd'];
const START = { a: '0', b: '01', c: '10', d: '11' };
const START_WORD = 'bad';
const MAX_BITS = 5; // longer code words make the list hard to read
const MAX_LETTERS = 8; // longer words make the number of readings explode
const MAX_SHOWN = 6; // readings shown, the rest only counted
const MAX_FOUND = 400; // the search stops here, so the page never hangs

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);

/** Every way to cut `bits` into code words of `book`, as lists of letters. */
export function readings(bits, book) {
  const usable = LETTERS.filter((ch) => book[ch]);
  const found = [];
  const walk = (pos, taken) => {
    if (found.length >= MAX_FOUND) return;
    if (pos === bits.length) {
      found.push(taken.slice());
      return;
    }
    for (const ch of usable) {
      if (bits.startsWith(book[ch], pos)) {
        taken.push(ch);
        walk(pos + book[ch].length, taken);
        taken.pop();
      }
    }
  };
  if (usable.length) walk(0, []);
  return found;
}

/** Which code word is the beginning of which other, or equal to it. */
export function clashes(book) {
  const out = [];
  for (const x of LETTERS) {
    for (const y of LETTERS) {
      if (x === y || !book[x] || !book[y]) continue;
      if (book[x] === book[y]) {
        if (x < y) out.push({ a: x, b: y, same: true });
      } else if (book[y].startsWith(book[x])) {
        out.push({ a: x, b: y, same: false });
      }
    }
  }
  return out;
}

function setup(box) {
  box.innerHTML = `
    <div class="pt-link">
      <section class="pt-side" aria-label="${L.sender}">
        <p class="dg-label">${L.sender}</p>
        <p class="pt-sub">${L.codeWords}</p>
        <div class="pt-book">
          ${LETTERS.map((ch) => `<label class="pt-ch" for="pt-${ch}">${ch}</label><span class="pt-eq">=</span><input class="pt-field" id="pt-${ch}" data-letter="${ch}" type="text" inputmode="numeric" spellcheck="false" autocomplete="off" aria-label="${fill(L.codeWordFor, { letter: ch })}">`).join('')}
        </div>
        <p class="pt-sub"><label for="pt-word">${L.word}</label></p>
        <input class="pt-field pt-word" id="pt-word" type="text" spellcheck="false" autocomplete="off">
      </section>
      <div class="pt-wire">
        <p class="dg-label">${L.wire}</p>
        <p class="pt-bits" data-out="sent"></p>
        <div class="pt-line" aria-hidden="true"></div>
        <p class="pt-note" data-out="note"></p>
      </div>
      <section class="pt-side" aria-label="${L.receiver}">
        <p class="dg-label">${L.receiver}</p>
        <p class="pt-verdict" data-out="verdict" aria-live="polite"></p>
        <ol class="pt-readings"></ol>
        <p class="pt-note" data-out="more"></p>
      </section>
    </div>
    <div class="pt-why" aria-live="polite"></div>
    <div class="pt-end">
      <button type="button" class="button" data-reset>${L.reset}</button>
      <p class="dg-note">${L.hint}</p>
    </div>`;

  const $ = (selector) => box.querySelector(selector);
  const fields = Object.fromEntries(LETTERS.map((ch) => [ch, $(`[data-letter="${ch}"]`)]));
  const wordField = $('.pt-word');
  const list = $('.pt-readings');
  const why = $('.pt-why');

  // the lines that change keep the size of their longest form
  const longBits = '0'.repeat(MAX_BITS * MAX_LETTERS);
  const show = {
    sent: steady($('[data-out="sent"]'), ['—', longBits]),
    note: steady($('[data-out="note"]'), [L.empty, fill(L.bits, { n: 40 }), fill(L.missingSent, { letters: 'a, b, c, d' })]),
    verdict: steady($('[data-out="verdict"]'), [L.one, L.none, fill(L.many, { n: L.moreThan.replace('{n}', MAX_FOUND) }), '']),
    more: steady($('[data-out="more"]'), ['', fill(L.more, { n: MAX_FOUND })]),
  };

  const code = {};
  let word = '';

  function render() {
    const bits = [...word].map((ch) => code[ch] || '').join('');
    show.sent(bits || '—');
    const missingSent = [...new Set(word)].filter((ch) => !code[ch]);
    show.note(missingSent.length ? fill(L.missingSent, { letters: missingSent.join(', ') }) : bits ? fill(L.bits, { n: bits.length }) : L.empty);

    const conflicts = clashes(code);
    const clashing = new Set(conflicts.flatMap((c) => [c.a, c.b]));
    LETTERS.forEach((ch) => fields[ch].setAttribute('aria-invalid', String(clashing.has(ch))));

    const found = bits ? readings(bits, code) : [];
    const n = found.length;
    box.dataset.result = !bits ? '' : n === 1 ? 'one' : 'many';
    show.verdict(!bits ? '' : n === 1 ? L.one : n === 0 ? L.none : fill(L.many, { n: n >= MAX_FOUND ? fill(L.moreThan, { n: MAX_FOUND }) : n }));

    list.replaceChildren(...found.slice(0, MAX_SHOWN).map((letters) => {
      const item = document.createElement('li');
      const cut = document.createElement('span');
      cut.className = 'pt-cut';
      letters.forEach((ch, i) => {
        const chunk = document.createElement('span');
        chunk.className = i % 2 ? 'pt-chunk is-alt' : 'pt-chunk';
        chunk.textContent = code[ch];
        cut.append(chunk);
      });
      const read = document.createElement('span');
      read.className = 'pt-read';
      read.textContent = letters.join(' ');
      item.append(cut, read);
      return item;
    }));
    const rest = n - Math.min(n, MAX_SHOWN);
    show.more(rest > 0 ? fill(L.more, { n: rest }) : '');

    const missing = LETTERS.filter((ch) => !code[ch]);
    const lines = [];
    if (conflicts.length) {
      lines.push(`<p>${n === 1 ? L.lucky : L.trouble}</p><ul>${conflicts.map((c) => `<li>${c.same ? fill(L.same, { a: c.a, b: c.b, word: code[c.a] }) : fill(L.starts, { a: c.a, b: c.b, x: code[c.a], y: code[c.b] })}</li>`).join('')}</ul>`);
    } else if (n === 1) {
      lines.push(`<p class="pt-free">${L.free}</p>`);
    }
    if (missing.length && missing.length < LETTERS.length) lines.push(`<p>${fill(L.missing, { letters: missing.join(', ') })}</p>`);
    why.innerHTML = lines.join('');
  }

  function toStart() {
    LETTERS.forEach((ch) => {
      code[ch] = START[ch];
      fields[ch].value = START[ch];
    });
    word = START_WORD;
    wordField.value = word;
    render();
  }

  LETTERS.forEach((ch) => {
    fields[ch].addEventListener('input', () => {
      const clean = fields[ch].value.replace(/[^01]/g, '').slice(0, MAX_BITS);
      if (clean !== fields[ch].value) fields[ch].value = clean;
      code[ch] = clean;
      render();
    });
  });
  wordField.addEventListener('input', () => {
    const clean = wordField.value.toLowerCase().replace(/[^a-d]/g, '').slice(0, MAX_LETTERS);
    if (clean !== wordField.value) wordField.value = clean;
    word = clean;
    render();
  });
  $('[data-reset]').addEventListener('click', toStart);

  // keys only while the focus is in the demonstrator and not in a field
  keys(box, [['R', L.keyReset]], (key) => {
    if (key !== 'r' && key !== 'R') return false;
    toStart();
    return true;
  });

  toStart();
}
document.querySelectorAll('[data-prefix-trap]').forEach((box) => setup(box));
