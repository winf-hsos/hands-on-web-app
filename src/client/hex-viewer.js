// The hex viewer: a text the reader types or any file from their own
// computer, shown byte by byte as a hex dump, with the offset on the left,
// the bytes in hex in the middle and the same bytes as characters on the
// right. The first bytes are compared with the signatures of common file
// types, and a click on a byte shows it in hex, decimal and binary and, for
// a typed text, the character it belongs to. A file is read in the browser
// one page at a time and never leaves it.
//
// Written with ```hex-viewer in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-hex-viewer-labels on <body>).
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.hexViewerLabels ?? '{}');
const ROWS = 16; // rows per page, so the dump keeps its height
const NARROW = 620; // below this width a row holds 8 bytes instead of 16
const MAX_TEXT = 2000;

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const hex = (n, width = 2) => n.toString(16).toUpperCase().padStart(width, '0');
const grouped = (n) => n.toLocaleString(document.documentElement.lang || 'en');
const printable = (b) => b >= 0x20 && b < 0x7f;
const longest = (texts) => texts.reduce((a, b) => (b.length > a.length ? b : a), '');

// the beginnings of common file types; `at` is the offset where the
// signature starts, which is 0 for all but the MP4 family
const SIGNATURES = [
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], kind: 'png' },
  { bytes: [0xff, 0xd8, 0xff], kind: 'jpeg' },
  { bytes: [0x47, 0x49, 0x46, 0x38], kind: 'gif' },
  { bytes: [0x25, 0x50, 0x44, 0x46], kind: 'pdf' },
  { bytes: [0x50, 0x4b, 0x03, 0x04], kind: 'zip' },
  { bytes: [0xd0, 0xcf, 0x11, 0xe0], kind: 'ole' },
  { bytes: [0x52, 0x49, 0x46, 0x46], kind: 'riff' },
  { bytes: [0x49, 0x44, 0x33], kind: 'mp3' },
  { bytes: [0x66, 0x74, 0x79, 0x70], kind: 'mp4', at: 4 },
  { bytes: [0x1f, 0x8b], kind: 'gzip' },
  { bytes: [0x4d, 0x5a], kind: 'exe' },
  { bytes: [0x7f, 0x45, 0x4c, 0x46], kind: 'elf' },
  { bytes: [0xef, 0xbb, 0xbf], kind: 'bom' },
];

/** The signature the bytes begin with, as { kind, from, to }, or null. */
export function signature(head) {
  for (const { bytes, kind, at = 0 } of SIGNATURES) {
    if (bytes.every((b, i) => head[at + i] === b)) return { kind, from: at, to: at + bytes.length };
  }
  return null;
}

/** Whether the bytes read as UTF-8 text without control characters other
 *  than tab and line breaks; a cut through the last character is allowed. */
export function looksLikeText(head) {
  if (!head.length) return false;
  for (const b of head) {
    if (b < 0x20 && b !== 0x09 && b !== 0x0a && b !== 0x0d) return false;
  }
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(head.subarray(0, Math.max(0, head.length - 3)));
    return true;
  } catch {
    return false;
  }
}

/** For a text: the character every byte of its UTF-8 form belongs to. */
export function characters(text) {
  const owner = [];
  const encoder = new TextEncoder();
  for (const ch of text) {
    const size = encoder.encode(ch).length;
    const char = { ch, size }; // one object per character, shared by its bytes
    for (let i = 0; i < size; i += 1) owner.push(char);
  }
  return owner;
}

function setup(box) {
  box.innerHTML = `
    <div class="hx-source">
      <div class="dg-choices" role="group" aria-label="${L.source}">
        <span class="dg-label">${L.source}</span>
        <button type="button" class="chip-button" data-mode="text" aria-pressed="true">${L.modeText}</button>
        <button type="button" class="chip-button" data-mode="file" aria-pressed="false">${L.modeFile}</button>
      </div>
      <textarea class="hx-text" rows="2" maxlength="${MAX_TEXT}" spellcheck="false" aria-label="${L.textLabel}"></textarea>
      <label class="hx-drop" hidden>
        <input type="file" class="hx-file">
        <span class="hx-drop-text">${L.drop}</span>
      </label>
    </div>
    <p class="hx-summary" aria-live="polite"></p>
    <div class="hx-dump" tabindex="0" aria-label="${L.dump}"></div>
    <p class="hx-info" aria-live="polite"></p>
    <div class="hx-pager">
      <button type="button" class="chip-button" data-page="-1">${L.prev}</button>
      <span class="hx-range"></span>
      <button type="button" class="chip-button" data-page="1">${L.next}</button>
    </div>
    <p class="dg-note hx-legend">
      <span class="hx-key is-magic">${L.legendMagic}</span>
      <span class="hx-key is-high">${L.legendHigh}</span>
      <span class="hx-key is-ctrl">${L.legendCtrl}</span>
    </p>`;

  const $ = (selector) => box.querySelector(selector);
  const textField = $('.hx-text');
  const drop = $('.hx-drop');
  const fileField = $('.hx-file');
  const dump = $('.hx-dump');
  const modeButtons = [...box.querySelectorAll('[data-mode]')];
  const show = {
    summary: steady($('.hx-summary'), [
      L.summaryEmpty,
      fill(L.summaryText, { chars: '0,000', bytes: '0,000' }),
      `${fill(L.summaryFile, { name: 'a-rather-long-file-name.docx', bytes: '000,000,000' })} ${longest(Object.values(L.kinds))}`,
    ]),
    info: steady($('.hx-info'), [L.infoHint, fill(L.info, { at: '000,000,000', hex: 'FF', dec: '255', bin: '1111 1111', ch: L.notPrintable }) + fill(L.infoChar, { ch: 'W', n: 4 })]),
    range: steady($('.hx-range'), [fill(L.range, { from: '000 000 000', to: '000 000 000', total: '000 000 000' }), L.rangeEmpty]),
  };

  const state = {
    mode: 'text',
    blob: new Blob([]),
    name: '',
    owner: [], // per byte, the character it belongs to (typed text only)
    sig: null,
    page: 0,
    bytes: new Uint8Array(0), // the bytes of the current page
    selected: -1,
    perRow: 16,
  };
  let reading = 0; // guards against a slow page arriving after a newer one

  const pageSize = () => ROWS * state.perRow;
  const pages = () => Math.max(1, Math.ceil(state.blob.size / pageSize()));

  function describe(head) {
    state.sig = signature(head);
    const what = state.sig ? L.kinds[state.sig.kind] : looksLikeText(head) ? L.kinds.text : L.kinds.unknown;
    if (state.mode === 'text') {
      const chars = [...textField.value].length;
      show.summary(state.blob.size ? fill(L.summaryText, { chars: grouped(chars), bytes: grouped(state.blob.size) }) : L.summaryEmpty);
    } else {
      show.summary(state.name ? `${fill(L.summaryFile, { name: state.name, bytes: grouped(state.blob.size) })} ${what}` : L.summaryEmpty);
    }
  }

  async function load(page) {
    const ticket = ++reading;
    state.page = Math.min(Math.max(0, page), pages() - 1);
    const start = state.page * pageSize();
    const buffer = await state.blob.slice(start, start + pageSize()).arrayBuffer();
    if (ticket !== reading) return;
    state.bytes = new Uint8Array(buffer);
    if (state.selected < start || state.selected >= start + state.bytes.length) state.selected = -1;
    render();
  }

  function render() {
    const start = state.page * pageSize();
    // a file always shows sixteen rows, so paging moves nothing; a typed
    // text shows the rows it fills, at least four, and grows while typing
    const digits = state.blob.size > 0xffff ? 8 : 4; // the offset, as short as the file allows
    const count = state.mode === 'text' ? Math.min(ROWS, Math.max(4, Math.ceil(state.blob.size / state.perRow))) : ROWS;
    const rows = [];
    for (let r = 0; r < count; r += 1) {
      const from = r * state.perRow;
      const offset = start + from;
      const cells = [];
      const chars = [];
      for (let c = 0; c < state.perRow; c += 1) {
        const i = from + c;
        if (i >= state.bytes.length) {
          cells.push('<span class="hx-byte is-empty">  </span>');
          chars.push('<span class="hx-char is-empty"> </span>');
          continue;
        }
        const b = state.bytes[i];
        const at = start + i;
        const classes = [
          state.sig && at >= state.sig.from && at < state.sig.to ? 'is-magic' : '',
          b >= 0x80 ? 'is-high' : !printable(b) ? 'is-ctrl' : '',
          at === state.selected ? 'is-sel' : '',
          state.owner.length && state.selected >= 0 && state.owner[at] && sameChar(at, state.selected) && at !== state.selected ? 'is-mate' : '',
        ].filter(Boolean).join(' ');
        cells.push(`<span class="hx-byte ${classes}" data-at="${at}">${hex(b)}</span>`);
        chars.push(`<span class="hx-char ${classes}" data-at="${at}">${printable(b) ? escape(String.fromCharCode(b)) : '·'}</span>`);
      }
      const shown = offset < state.blob.size || r === 0;
      rows.push(`<div class="hx-row"><span class="hx-off">${shown ? hex(offset, digits) : ' '.repeat(digits)}</span><span class="hx-bytes">${cells.join('')}</span><span class="hx-chars">${chars.join('')}</span></div>`);
    }
    dump.innerHTML = rows.join('');
    dump.style.setProperty('--per-row', state.perRow);

    const end = Math.min(start + pageSize(), state.blob.size);
    show.range(state.blob.size ? fill(L.range, { from: grouped(start), to: grouped(end - 1), total: grouped(state.blob.size) }) : L.rangeEmpty);
    box.querySelector('[data-page="-1"]').disabled = state.page === 0;
    box.querySelector('[data-page="1"]').disabled = state.page >= pages() - 1;
    renderInfo();
  }

  // in a typed text, whether two bytes belong to the same character
  function sameChar(a, b) {
    return state.owner[a] === state.owner[b];
  }

  function renderInfo() {
    if (state.selected < 0) {
      show.info(state.blob.size ? L.infoHint : '');
      return;
    }
    const b = state.bytes[state.selected - state.page * pageSize()];
    const bits = b.toString(2).padStart(8, '0');
    let text = fill(L.info, {
      at: grouped(state.selected),
      hex: hex(b),
      dec: String(b),
      bin: `${bits.slice(0, 4)} ${bits.slice(4)}`,
      ch: printable(b) ? fill(L.quote, { ch: String.fromCharCode(b) }) : L.notPrintable,
    });
    const owner = state.owner[state.selected];
    if (owner) text += fill(owner.size === 1 ? L.infoCharOne : L.infoChar, { ch: owner.ch === '\n' ? '↵' : owner.ch, n: owner.size });
    show.info(text);
  }

  function select(at) {
    if (at < 0 || at >= state.blob.size) return;
    state.selected = at;
    const page = Math.floor(at / pageSize());
    if (page !== state.page) load(page);
    else render();
  }

  // --- sources -------------------------------------------------------------

  function fromText() {
    const bytes = new TextEncoder().encode(textField.value);
    state.blob = new Blob([bytes]);
    state.name = '';
    state.owner = characters(textField.value);
    state.selected = -1;
    describe(bytes.subarray(0, 16));
    load(0);
  }

  async function fromFile(file) {
    if (!file) return;
    state.blob = file;
    state.name = file.name;
    state.owner = [];
    state.selected = -1;
    describe(new Uint8Array(await file.slice(0, 16).arrayBuffer()));
    load(0);
  }

  function setMode(mode) {
    state.mode = mode;
    modeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    textField.hidden = mode !== 'text';
    drop.hidden = mode !== 'file';
    if (mode === 'text') fromText();
    else if (fileField.files[0]) fromFile(fileField.files[0]);
    else {
      state.blob = new Blob([]);
      state.name = '';
      state.owner = [];
      state.sig = null;
      state.selected = -1;
      show.summary(L.summaryEmpty);
      load(0);
    }
  }

  modeButtons.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  textField.addEventListener('input', fromText);
  fileField.addEventListener('change', () => {
    const file = fileField.files[0];
    if (!file) return;
    $('.hx-drop-text').textContent = file.name;
    fromFile(file);
  });
  // a file may also be dropped anywhere on the demonstrator
  box.addEventListener('dragover', (e) => {
    e.preventDefault();
    box.classList.add('is-dragging');
  });
  box.addEventListener('dragleave', (e) => {
    if (!box.contains(e.relatedTarget)) box.classList.remove('is-dragging');
  });
  box.addEventListener('drop', (e) => {
    e.preventDefault();
    box.classList.remove('is-dragging');
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (state.mode !== 'file') {
      state.mode = 'file';
      modeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === 'file')));
      textField.hidden = true;
      drop.hidden = false;
    }
    $('.hx-drop-text').textContent = file.name;
    fromFile(file);
  });
  dump.addEventListener('click', (e) => {
    const cell = e.target.closest('[data-at]');
    if (cell) select(Number(cell.dataset.at));
  });
  box.querySelectorAll('[data-page]').forEach((b) => b.addEventListener('click', () => {
    state.selected = -1;
    load(state.page + Number(b.dataset.page));
  }));

  keys(box, [['← / →', L.keyByte], ['↑ / ↓', L.keyRow], ['N / P', L.keyPage]], (key) => {
    const at = state.selected < 0 ? state.page * pageSize() : state.selected;
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -state.perRow, ArrowDown: state.perRow };
    if (key in moves) {
      select(state.selected < 0 ? at : at + moves[key]);
      return true;
    }
    if (key === 'n' || key === 'N' || key === 'p' || key === 'P') {
      state.selected = -1;
      load(state.page + (key.toLowerCase() === 'n' ? 1 : -1));
      return true;
    }
    return false;
  });

  // 16 bytes a row where there is room, 8 on a phone
  const measure = () => {
    const narrow = box.clientWidth < NARROW;
    box.classList.toggle('is-narrow', narrow);
    return narrow ? 8 : 16;
  };
  new ResizeObserver(() => {
    const perRow = measure();
    if (perRow === state.perRow) return;
    const first = state.page * pageSize();
    state.perRow = perRow;
    load(Math.floor((state.selected >= 0 ? state.selected : first) / pageSize()));
  }).observe(box);

  textField.value = L.sample;
  state.perRow = measure();
  setMode('text');
}

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

document.querySelectorAll('[data-hex-viewer]').forEach((box) => setup(box));
