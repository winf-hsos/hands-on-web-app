// The byte switchboard: one byte as eight switches. Every switch shows its
// place value, and the byte appears at once as the sum of the switches that
// are on, in binary, decimal and hexadecimal, and as the ASCII character with
// that number. Counting past 255 or below 0 wraps around, with a sentence on
// why. Taken over from the LiFi concept demos (byte-switchboard) and drawn in
// the platform's own design.
//
// Written with ```byte-switchboard in Markdown (remark-knowledge.mjs); the
// labels come from the page (data-byte-switchboard-labels on <body>).

const L = JSON.parse(document.body.dataset.byteSwitchboardLabels ?? '{}');
const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1]; // the leftmost switch first
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);

function setup(box) {
  let value = 0b01000001; // 65, the capital A

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
      <div class="bs-out"><span class="bs-label">${L.decimal}</span><span class="bs-value" data-out="dec"></span><span class="bs-note">${L.decimalNote}</span></div>
      <div class="bs-out"><span class="bs-label">${L.hex}</span><span class="bs-value" data-out="hex"></span><span class="bs-note">${L.hexNote}</span></div>
      <div class="bs-out"><span class="bs-label">${L.text}</span><span class="bs-value" data-out="text"></span><span class="bs-note" data-out="text-note"></span></div>
    </div>
    <p class="bs-message" aria-live="polite"></p>
    <div class="bs-controls">
      <button type="button" class="button button-quiet" data-act="down" aria-label="−1">−1</button>
      <button type="button" class="button button-quiet" data-act="up" aria-label="+1">+1</button>
      <button type="button" class="button button-quiet" data-act="random">${L.random}</button>
      <button type="button" class="button button-quiet" data-act="reset">${L.reset}</button>
      <span class="bs-keys">${L.keys}</span>
    </div>`;

  const bits = [...box.querySelectorAll('.bs-bit')];
  const out = (name) => box.querySelector(`[data-out="${name}"]`);
  const message = box.querySelector('.bs-message');

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
    out('dec').textContent = String(value);
    out('hex').textContent = value.toString(16).toUpperCase().padStart(2, '0');
    const printable = value >= 32 && value <= 126;
    out('text').textContent = printable ? String.fromCharCode(value) : '–';
    out('text-note').textContent = printable ? fill(L.textNote, { v: value }) : L.noText;
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

  const act = { up, down, random: () => set(Math.floor(Math.random() * 256)), reset: () => set(0) };
  for (const button of box.querySelectorAll('[data-act]')) button.addEventListener('click', act[button.dataset.act]);

  // keys only while the switchboard has the focus, so the page still scrolls
  box.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '8') flip(8 - Number(e.key));
    else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') up();
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') down();
    else return;
    e.preventDefault();
  });

  render();
}

for (const box of document.querySelectorAll('[data-byte-switchboard]')) setup(box);
