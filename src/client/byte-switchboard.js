// The byte switchboard: one byte as eight switches. Every switch shows its
// place value, and the byte appears at once as the sum of the switches that
// are on, in binary, decimal and hexadecimal, and as the ASCII character with
// that number. Counting past 255 or below 0 wraps around, with a sentence on
// why. Decimal, hex and text can also be typed in: a click on one of them
// edits it, and the switches and the other readings follow every keystroke
// that gives a valid value. Taken over from the LiFi concept demos (byte-switchboard) and drawn in
// the platform's own design.
//
// Written with ```byte-switchboard in Markdown (remark-knowledge.mjs); the
// labels come from the page (data-byte-switchboard-labels on <body>).
import { keys } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.byteSwitchboardLabels ?? '{}');
const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1]; // the leftmost switch first
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const printable = (n) => n >= 32 && n <= 126;

// What a typed reading means: the byte it sets, or a sentence on why it
// cannot be one. The text field keeps only the character typed last.
const READ = {
  dec: (s) => (/^\d+$/.test(s) ? (Number(s) <= 255 ? Number(s) : fill(L.tooBig, { v: s })) : L.notDecimal),
  hex: (s) => (/^[0-9a-f]+$/i.test(s) ? parseInt(s, 16) : L.notHex),
  text: (s) => {
    const c = [...s].at(-1);
    const n = c.codePointAt(0);
    return printable(n) ? n : fill(L.notAscii, { c, n });
  },
};
// the readings as they are shown when nobody is typing in them
const SHOW = {
  dec: (v) => String(v),
  hex: (v) => v.toString(16).toUpperCase().padStart(2, '0'),
  text: (v) => (printable(v) ? String.fromCharCode(v) : '–'),
};

function setup(box) {
  let value = 0b01000001; // 65, the capital A
  const field = (name, label, attrs) =>
    `<input class="bs-value bs-field" data-out="${name}" aria-label="${label}" title="${L.editHint}" autocomplete="off" spellcheck="false" ${attrs}>`;

  box.innerHTML = `
    <div class="bs-bits">${WEIGHTS.map(
      (w, i) => `<div class="bs-col">
        <span class="bs-power">2<sup>${7 - i}</sup></span>
        <span class="bs-weight">${w}</span>
        <button type="button" class="bs-bit" data-exp="${7 - i}" aria-label="${fill(L.bit, { n: 7 - i, w })}"></button>
      </div>`,
    ).join('')}</div>
    <p class="bs-sum"></p>
    <div class="bs-outputs">
      <div class="bs-out"><span class="bs-label">${L.binary}</span><span class="bs-value" data-out="bin"></span><span class="bs-note">${L.binaryNote}</span></div>
      <div class="bs-out"><span class="bs-label">${L.decimal}</span>${field('dec', L.decimal, 'inputmode="numeric" maxlength="3"')}<span class="bs-note">${L.decimalNote}</span></div>
      <div class="bs-out"><span class="bs-label">${L.hex}</span>${field('hex', L.hex, 'maxlength="2" autocapitalize="characters"')}<span class="bs-note">${L.hexNote}</span></div>
      <div class="bs-out"><span class="bs-label">${L.text}</span>${field('text', L.text, '')}<span class="bs-note" data-out="text-note"></span></div>
    </div>
    <p class="bs-message" aria-live="polite"></p>
    <div class="bs-controls">
      <button type="button" class="button button-quiet" data-act="down" aria-label="−1">−1</button>
      <button type="button" class="button button-quiet" data-act="up" aria-label="+1">+1</button>
      <button type="button" class="button button-quiet" data-act="random">${L.random}</button>
      <button type="button" class="button button-quiet" data-act="all"></button>
    </div>`;

  const bits = [...box.querySelectorAll('.bs-bit')];
  const out = (name) => box.querySelector(`[data-out="${name}"]`);
  const message = box.querySelector('.bs-message');
  const all = box.querySelector('[data-act="all"]');
  const fields = [...box.querySelectorAll('.bs-field')];
  const show = (f) => {
    f.value = SHOW[f.dataset.out](value);
    f.removeAttribute('aria-invalid');
  };

  function set(next, note = '') {
    const changed = value ^ (next & 0xff);
    value = next & 0xff;
    message.textContent = note;
    for (const bit of bits) {
      if (changed & (1 << Number(bit.dataset.exp))) flash(bit);
    }
    render();
  }

  // a short highlight on every switch that changed, so that counting shows
  // how a carry runs through the places
  function flash(bit) {
    bit.classList.remove('is-flipped');
    void bit.offsetWidth;
    bit.classList.add('is-flipped');
  }

  function render() {
    const binary = value.toString(2).padStart(8, '0');
    for (const bit of bits) {
      const on = (value >> Number(bit.dataset.exp)) & 1;
      bit.textContent = String(on);
      bit.setAttribute('aria-pressed', String(Boolean(on)));
      bit.closest('.bs-col').classList.toggle('is-on', Boolean(on));
    }
    const parts = WEIGHTS.filter((w) => value & w);
    box.querySelector('.bs-sum').textContent = parts.length > 1 ? `= ${parts.join(' + ')} = ${value}` : `= ${value}`;
    out('bin').textContent = `${binary.slice(0, 4)} ${binary.slice(4)}`;
    // the field someone is typing in keeps what they typed
    for (const f of fields) if (f !== document.activeElement) show(f);
    out('text-note').textContent = printable(value) ? fill(L.textNote, { v: value }) : L.noText;
    // with every switch off the button turns them all on, otherwise all off
    all.textContent = value === 0 ? L.allOn : L.reset;
  }

  const up = () => set(value + 1, value === 255 ? L.overflow : '');
  const down = () => set(value - 1, value === 0 ? L.underflow : '');
  const flip = (exp) => set(value ^ (1 << exp));

  // Pressing a switch and dragging across others flips each of them once.
  let dragging = false;
  const dragged = new Set();
  for (const bit of bits) {
    const exp = Number(bit.dataset.exp);
    bit.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      bit.focus();
      flip(exp);
      dragging = true;
      dragged.clear();
      dragged.add(exp);
    });
    bit.addEventListener('pointerenter', () => {
      if (dragging && !dragged.has(exp)) {
        dragged.add(exp);
        flip(exp);
      }
    });
    // a click from the keyboard (Enter or Space) has no pointer before it
    bit.addEventListener('click', (e) => {
      if (e.detail === 0) flip(exp);
    });
  }
  addEventListener('pointerup', () => (dragging = false));

  // Typing a reading: Enter keeps it, Escape goes back to the byte from
  // before, and the arrow keys count as on the page.
  for (const f of fields) {
    let before = value;
    f.addEventListener('focus', () => {
      before = value;
      if (f.value === '–') f.value = '';
      f.select();
    });
    f.addEventListener('input', () => {
      const typed = f.dataset.out === 'text' ? f.value : f.value.trim();
      if (!typed) return;
      const read = READ[f.dataset.out](typed);
      if (typeof read === 'string') {
        f.setAttribute('aria-invalid', 'true');
        message.textContent = read;
        return;
      }
      f.removeAttribute('aria-invalid');
      set(read);
      if (f.dataset.out === 'text') f.value = SHOW.text(read);
      if (f.dataset.out === 'hex') f.value = typed.toUpperCase();
    });
    f.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        if (e.key === 'Escape') set(before);
        show(f);
        // back to the frame, so that its shortcuts work again
        (box.closest('[data-demo]') ?? f).focus({ preventScroll: true });
        if (document.activeElement === f) f.blur();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.key === 'ArrowUp' ? up() : down();
        show(f);
        f.select();
      } else return;
      e.preventDefault();
    });
    f.addEventListener('blur', () => show(f));
  }

  const act = { up, down, random: () => set(Math.floor(Math.random() * 256)), all: () => set(value === 0 ? 255 : 0) };
  for (const button of box.querySelectorAll('[data-act]')) button.addEventListener('click', act[button.dataset.act]);

  // keys only while the focus is in the demonstrator, so the page still scrolls
  keys(
    box,
    [
      ['1 – 8', L.keyFlip],
      ['↑ / ↓', L.keyCount],
      [L.randomKey, L.keyRandom],
      ['0', L.keyAll],
    ],
    (key) => {
      if (key >= '1' && key <= '8') flip(8 - Number(key));
      else if (key === 'ArrowUp' || key === 'ArrowRight') up();
      else if (key === 'ArrowDown' || key === 'ArrowLeft') down();
      else if (key.toUpperCase() === L.randomKey) act.random();
      else if (key === '0') act.all();
      else return false;
      return true;
    },
  );

  render();
}

for (const box of document.querySelectorAll('[data-byte-switchboard]')) setup(box);
