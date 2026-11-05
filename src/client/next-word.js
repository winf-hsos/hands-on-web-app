// Predicting the next word by counting: a corpus in a text field, a button
// that counts (every word, every pair and every triple, with <s> before and
// </s> after each sentence) and a sentence that grows word by word. Below it
// stands the distribution of the next word for the chosen context, none, one
// or two words, as bars with their counts, so that every probability can be
// read as a fraction. A click on a bar appends that word, "Roll" (R) draws
// one by its probability, "Most likely" (M) takes the top one and "To the
// end" (A) rolls until the model draws </s>. A context that never occurred
// says so instead of guessing, which is where counting breaks down.
//
// What the experiment a-language-model-by-counting needs on top (Nicolas,
// 2026-11-05):
// - the bag: at temperature 1 a roll is drawing a card from a bag that holds
//   one card for every time a word followed the context, shown card by card
//   while the bag is small;
// - the temperature: every probability to the power of 1/T and brought back
//   to a sum of 1, so that 0 always takes the most frequent word (and makes
//   loops visible) and 2 flattens the distribution;
// - the copy check: a finished sentence is marked as copied word for word
//   from the corpus or as new, which the model cannot tell from true, with a
//   tally per context;
// - the size of the table: possible and filled cells for each context, the
//   filled ones being all the model knows;
// - a second corpus, Lewis Carroll's Alice in Wonderland (1865, public
//   domain), about 27,000 words.
//
// Written with ```next-word in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-next-word-labels on <body>), the corpora from
// media/datasets/ (farm_corpus.csv, which the R boxes read too, and
// alice_in_wonderland.txt, both written by scripts/counting-corpus.py).
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.nextWordLabels ?? '{}');
const DATASETS = document.body.dataset.datasets ?? '/media/datasets/';
const lang = document.documentElement.lang || 'en';
const two = new Intl.NumberFormat(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const one = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat(lang);
const compact = new Intl.NumberFormat(lang, { notation: 'compact', maximumFractionDigits: 1 });
const share = new Intl.NumberFormat(lang, { style: 'percent', maximumSignificantDigits: 2 });
const amount = (n) => (n < 1e7 ? whole.format(n) : compact.format(n));
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const wait = (ms) => new Promise((done) => setTimeout(done, ms));
const still = matchMedia('(prefers-reduced-motion: reduce)');

const START = '<s>';
const END = '</s>';
const MAX = 25; // words, after which a sentence that found no end is cut off
const CARDS = 60; // the largest bag shown card by card
const BARS = 40; // the most next words shown as bars
const STEP = 160; // ms between two words when rolling to the end

const CORPORA = [
  {
    file: 'farm_corpus.csv',
    read: (csv) =>
      csv
        .trim()
        .split('\n')
        .slice(1)
        .map((line) => line.slice(line.indexOf(',') + 1).replace(/^"|"$/g, ''))
        .join('\n'),
  },
  { file: 'alice_in_wonderland.txt', read: (text) => text.trim() },
];
const loaded = new Map();
const load = (i) => {
  if (!loaded.has(i)) loaded.set(i, fetch(`${DATASETS}${CORPORA[i].file}`).then((r) => r.text()).then(CORPORA[i].read));
  return loaded.get(i);
};

/** The words of a line: lower case, without punctuation, apostrophes kept. */
const tokenize = (line) =>
  line
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

/**
 * Counts of single words, pairs and triples, each keyed by its context (''
 * for none). Every sentence starts with <s> and ends with </s>, so that the
 * model learns how sentences begin and when they end; without context it
 * knows words only, and no end.
 */
function count(text) {
  const sentences = text.split('\n').map(tokenize).filter((s) => s.length);
  const tables = [new Map(), new Map(), new Map()];
  const add = (table, context, word) => {
    if (!table.has(context)) table.set(context, new Map());
    const row = table.get(context);
    row.set(word, (row.get(word) ?? 0) + 1);
  };
  for (const words of sentences) {
    const t = [START, ...words, END];
    for (let i = 1; i < t.length; i++) {
      if (t[i] !== END) add(tables[0], '', t[i]);
      add(tables[1], t[i - 1], t[i]);
      if (i >= 2) add(tables[2], `${t[i - 2]} ${t[i - 1]}`, t[i]);
    }
  }
  const filled = tables.map((table) => [...table.values()].reduce((n, row) => n + row.size, 0));
  return {
    tables,
    filled,
    sentences: sentences.length,
    tokens: sentences.reduce((n, s) => n + s.length, 0),
    words: tables[0].get('')?.size ?? 0,
    known: new Set(sentences.map((s) => s.join(' '))),
  };
}

/**
 * The next words for a context, most frequent first, alphabetical among
 * equals, each with its count and its probability at `temperature`: the
 * share of the count to the power of 1/T, brought back to a sum of 1. At 0
 * only the most frequent words remain.
 */
function distribution(row, temperature) {
  if (!row) return { total: 0, rows: [] };
  const total = [...row.values()].reduce((a, b) => a + b, 0);
  const rows = [...row].map(([word, n]) => ({ word, n })).sort((a, b) => b.n - a.n || a.word.localeCompare(b.word));
  const top = rows[0].n;
  const weight = (n) => (temperature === 0 ? Number(n === top) : (n / total) ** (1 / temperature));
  const sum = rows.reduce((s, r) => s + weight(r.n), 0);
  for (const r of rows) r.p = weight(r.n) / sum;
  return { total, rows };
}

async function setup(box) {
  const n = box.dataset.n;
  box.innerHTML = `
    <div class="nw-corpus">
      <div class="dg-choices" role="group" aria-label="${L.corpusChoice}">
        <span class="dg-label">${L.corpusChoice}</span>
        ${L.corpora.map((c, i) => `<button type="button" class="chip-button" data-corpus="${i}" aria-pressed="false">${c}</button>`).join('')}
      </div>
      <label class="dg-label" for="nw-text-${n}">${L.corpus}</label>
      <textarea class="nw-text" id="nw-text-${n}" rows="7" spellcheck="false"></textarea>
      <div class="nw-train">
        <button type="button" class="button" data-train>${L.train}</button>
        <p class="dg-reading" data-out="stats" aria-live="polite"></p>
      </div>
    </div>
    <div class="nw-settings">
      <div class="dg-choices" role="group" aria-label="${L.context}">
        <span class="dg-label">${L.context}</span>
        ${L.contexts.map((c, i) => `<button type="button" class="chip-button" data-context="${i}" aria-pressed="false">${c}</button>`).join('')}
      </div>
      <label class="nw-temperature">
        <span class="dg-label">${L.temperature}</span>
        <input type="range" min="0" max="2" step="0.1" value="1" data-temperature>
        <output data-out="temperature"></output>
      </label>
    </div>
    <div class="nw-sentence" aria-live="polite" aria-label="${L.sentence}"></div>
    <div class="nw-actions">
      <button type="button" class="button" data-draw>${L.draw}</button>
      <button type="button" class="chip-button" data-auto aria-pressed="false">${L.auto}</button>
      <button type="button" class="chip-button" data-best>${L.best}</button>
      <button type="button" class="chip-button" data-back>${L.back}</button>
      <button type="button" class="chip-button" data-new>${L.newSentence}</button>
    </div>
    <div class="dg-calc nw-calc">
      <p class="dg-size" data-out="question"></p>
      <p data-out="basis"></p>
      <p class="dg-time" data-out="drawn"></p>
    </div>
    <div class="nw-bag">
      <p class="nw-bag-caption" data-out="bag"></p>
      <div class="nw-cards" aria-hidden="true"></div>
    </div>
    <ol class="nw-bars" aria-label="${L.bars}"></ol>
    <div class="nw-verdict">
      <p data-out="verdict"></p>
      <p class="dg-reading" data-out="tally"></p>
    </div>
    <details class="nw-size">
      <summary>${L.sizeTitle}</summary>
      <table>
        <thead><tr><th>${L.context}</th><th>${L.sizePossible}</th><th>${L.sizeFilled}</th><th>${L.sizeShare}</th></tr></thead>
        <tbody></tbody>
      </table>
      <p data-out="params"></p>
      <p>${L.projection}</p>
    </details>`;

  const $ = (selector) => box.querySelector(selector);
  const text = $('.nw-text');
  const bars = $('.nw-bars');
  const words = $('.nw-sentence');
  const cards = $('.nw-cards');
  const slider = $('[data-temperature]');
  const autoButton = $('[data-auto]');
  const corpora = [...box.querySelectorAll('[data-corpus]')];
  const contexts = [...box.querySelectorAll('[data-context]')];
  const out = (name) => $(`[data-out="${name}"]`);

  // every changing line keeps the size of its longest form from the start
  const long = '"xxxxxxxxxxx xxxxxxxxxxx"';
  const r = two.format(0.99);
  const show = {
    stats: steady(out('stats'), [L.loading, L.untrained, L.changed, fill(L.stats, { sentences: 9999, tokens: 99999, words: 9999 })]),
    temperature: steady(out('temperature'), [one.format(0), one.format(1.5)]),
    question: steady(out('question'), [L.contextNone, L.ended, fill(L.contextOne, { context: long }), fill(L.contextTwo, { context: long })]),
    basis: steady(out('basis'), [
      fill(L.basisNone, { total: 99999 }),
      fill(L.basis, { context: long, total: 9999 }),
      fill(L.unseen, { context: long }),
      fill(L.shorter, { have: 1, want: 2 }),
      L.endedBasis,
      L.untrainedBasis,
    ]),
    drawn: steady(out('drawn'), [
      L.drawnHint,
      fill(L.drawn, { r, word: 'xxxxxxxxxxx', from: r, to: r }),
      fill(L.drawnCard, { r, card: 99, total: 99, word: 'xxxxxxxxxxx' }),
      fill(L.picked, { word: 'xxxxxxxxxxx' }),
    ]),
    bag: steady(out('bag'), [
      fill(L.bag, { context: long, total: 99 }),
      fill(L.bagLarge, { context: long, total: 9999 }),
      fill(L.bagLargeNone, { total: 99999 }),
      fill(L.bagNone, { total: 99 }),
      fill(L.bagTemperature, { t: one.format(1.5) }),
      L.bagGreedy,
      L.bagNothing,
    ]),
    verdict: steady(out('verdict'), [L.verdictOpen, L.copied, L.novel, fill(L.tooLong, { max: MAX })]),
    tally: steady(out('tally'), [fill(L.tallyNone, { context: L.contexts[2] }), fill(L.tally, { context: L.contexts[2], n: 999, k: 999 })]),
  };

  let model = null;
  let choice = 0; // the corpus last chosen, -1 once the text is edited
  let sentence = [];
  let ended = false; // </s> was drawn
  let endedAt = 1; // the context with which it was drawn, for the tally
  let cut = false; // MAX words without an end
  let size = 1;
  let temperature = 1;
  let current = { total: 0, rows: [] };
  let busy = false; // a card is being drawn from the bag
  let timer = null; // rolling to the end
  let tallies = [0, 1, 2].map(() => ({ n: 0, k: 0 }));

  function train() {
    stop();
    model = count(text.value);
    tallies = tallies.map(() => ({ n: 0, k: 0 }));
    show.stats(fill(L.stats, { sentences: whole.format(model.sentences), tokens: whole.format(model.tokens), words: whole.format(model.words) }));
    drawSize();
    restart();
  }

  async function choose(i) {
    stop();
    choice = i;
    corpora.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    show.stats(L.loading);
    text.value = await load(i);
    train();
  }

  /** The context the model can use now: as many tokens as chosen, at most as many as there are, <s> included. */
  function context() {
    const tokens = [START, ...sentence];
    const k = Math.min(size, tokens.length);
    return { k, words: tokens.slice(tokens.length - k) };
  }

  const chip = (word, className) => Object.assign(document.createElement('span'), { className, textContent: word });

  function drawSentence() {
    const { k } = context();
    const tokens = [START, ...sentence];
    const chips = tokens.map((w, i) => chip(w, `nw-word${i === 0 ? ' is-mark' : ''}${model && !ended && !cut && size && i >= tokens.length - k ? ' is-context' : ''}`));
    if (ended) chips.push(chip(END, 'nw-word is-mark'));
    if (!sentence.length && !ended) chips.push(chip(L.emptySentence, 'nw-empty'));
    words.replaceChildren(...chips);
    words.scrollTop = words.scrollHeight;
  }

  function render() {
    contexts.forEach((b, i) => b.setAttribute('aria-pressed', String(i === size)));
    show.temperature(one.format(temperature));
    drawSentence();
    if (!model) {
      current = { total: 0, rows: [] };
      show.question(L.contextNone);
      show.basis(L.untrainedBasis);
      drawBag();
      drawBars();
      return;
    }
    if (ended || cut) {
      current = { total: 0, rows: [] };
      show.question(L.ended);
      show.basis(L.endedBasis);
    } else {
      const { k, words: ctx } = context();
      const key = ctx.join(' ');
      current = distribution(model.tables[k].get(k ? key : ''), temperature);
      const quoted = `"${key}"`;
      show.question(k === 0 ? L.contextNone : fill(k === 1 ? L.contextOne : L.contextTwo, { context: quoted }));
      if (k < size) show.basis(fill(L.shorter, { have: k, want: size }));
      else if (!current.total) show.basis(fill(L.unseen, { context: quoted }));
      else show.basis(k === 0 ? fill(L.basisNone, { total: whole.format(current.total) }) : fill(L.basis, { context: quoted, total: whole.format(current.total) }));
    }
    drawBag();
    drawBars();
    drawVerdict();
  }

  /** The cards of the bag, in the order of the bars, while the bag is small enough to show. */
  function bag() {
    if (temperature !== 1 || !current.total || current.total > CARDS) return null;
    return current.rows.flatMap((row) => Array(row.n).fill(row.word));
  }

  function drawBag() {
    const deck = bag();
    const { k, words: ctx } = context();
    const quoted = `"${ctx.join(' ')}"`;
    if (!current.total) show.bag(L.bagNothing);
    else if (temperature === 0) show.bag(L.bagGreedy);
    else if (temperature !== 1) show.bag(fill(L.bagTemperature, { t: one.format(temperature) }));
    else if (!deck) show.bag(k === 0 ? fill(L.bagLargeNone, { total: whole.format(current.total) }) : fill(L.bagLarge, { context: quoted, total: whole.format(current.total) }));
    else show.bag(k === 0 ? fill(L.bagNone, { total: current.total }) : fill(L.bag, { context: quoted, total: current.total }));
    cards.replaceChildren(...(deck ?? []).map((word) => chip(word, 'nw-card')));
  }

  function drawBars() {
    const top = current.rows[0]?.p || 1;
    const shown = current.rows.slice(0, BARS);
    const items = shown.map((row) => {
      const item = document.createElement('li');
      const button = Object.assign(document.createElement('button'), { type: 'button', className: 'nw-bar' });
      const name = row.word === END ? L.endLabel : row.word;
      button.setAttribute('aria-label', fill(L.barLabel, { word: name, p: two.format(row.p), n: row.n, total: current.total }));
      button.innerHTML = `<span class="nw-label"></span><span class="nw-track"><span class="nw-fill" style="width:${(row.p / top) * 100}%"></span></span><span class="nw-p">${two.format(row.p)}</span><span class="nw-n">${row.n}/${current.total}</span>`;
      button.querySelector('.nw-label').textContent = row.word;
      if (row.word === END) button.querySelector('.nw-label').title = L.endLabel;
      button.addEventListener('click', () => {
        stop();
        append(row.word, fill(L.picked, { word: row.word }));
      });
      item.append(button);
      return item;
    });
    const rest = current.rows.length - shown.length;
    if (rest > 0) items.push(Object.assign(document.createElement('li'), { className: 'nw-more', textContent: fill(L.more, { rest: whole.format(rest) }) }));
    bars.replaceChildren(...items);
  }

  function drawVerdict() {
    if (cut) show.verdict(fill(L.tooLong, { max: MAX }));
    else if (!ended) show.verdict(L.verdictOpen);
    else show.verdict(model.known.has(sentence.join(' ')) ? L.copied : L.novel);
    const t = tallies[size];
    show.tally(t.n ? fill(L.tally, { context: L.contexts[size], n: t.n, k: t.k }) : fill(L.tallyNone, { context: L.contexts[size] }));
  }

  function drawSize() {
    const v = model.words;
    const possible = [v, (v + 1) ** 2, (v + 1) ** 3];
    $('.nw-size tbody').innerHTML = possible
      .map((p, i) => `<tr><td>${L.contexts[i]}</td><td>${amount(p)}</td><td>${whole.format(model.filled[i])}</td><td>${share.format(model.filled[i] / p)}</td></tr>`)
      .join('');
    out('params').textContent = fill(L.params, { params: whole.format(model.filled.reduce((a, b) => a + b, 0)) });
  }

  function append(word, message) {
    if (!model || ended || cut) return false;
    show.drawn(message);
    if (word === END) {
      ended = true;
      endedAt = size;
      tallies[size].n += 1;
      if (model.known.has(sentence.join(' '))) tallies[size].k += 1;
    } else {
      sentence.push(word);
      cut = sentence.length >= MAX;
    }
    render();
    return !ended && !cut;
  }

  /** Draws the next word; at temperature 1 from the bag, showing the card when `slowly`. */
  async function roll(slowly) {
    if (!model || ended || cut || busy || !current.rows.length) return false;
    const r = Math.random();
    const deck = bag();
    if (deck) {
      const card = Math.floor(r * deck.length);
      if (slowly) await draw(card);
      return append(deck[card], fill(L.drawnCard, { r: two.format(r), card: card + 1, total: deck.length, word: deck[card] }));
    }
    let from = 0;
    const rows = current.rows.filter((row) => row.p > 0);
    for (const row of rows) {
      const to = from + row.p;
      if (r < to || row === rows.at(-1)) return append(row.word, fill(L.drawn, { r: two.format(r), word: row.word, from: two.format(from), to: two.format(Math.min(to, 1)) }));
      from = to;
    }
    return false;
  }

  /** A hand in the bag: a few cards light up, then the drawn one stays a moment. */
  async function draw(card) {
    busy = true;
    const all = [...cards.children];
    const mark = (i) => all.forEach((c, k) => c.classList.toggle('is-drawn', k === i));
    if (!still.matches) {
      for (let k = 0; k < 6; k++) {
        mark(Math.floor(Math.random() * all.length));
        await wait(70);
      }
    }
    mark(card);
    const drawn = all[card];
    cards.scrollTop = drawn.offsetTop - (cards.clientHeight - drawn.offsetHeight) / 2;
    await wait(380);
    busy = false;
  }

  function stop() {
    clearTimeout(timer);
    timer = null;
    autoButton.setAttribute('aria-pressed', 'false');
  }

  function auto() {
    if (timer) return stop();
    if (!model || ended || cut || busy) return;
    autoButton.setAttribute('aria-pressed', 'true');
    const step = async () => {
      if (await roll(false)) timer = setTimeout(step, STEP);
      else stop();
    };
    timer = setTimeout(step, 0);
  }

  function best() {
    stop();
    if (current.rows.length) append(current.rows[0].word, fill(L.picked, { word: current.rows[0].word }));
  }

  function back() {
    stop();
    if (busy) return;
    if (ended || cut) {
      if (ended) {
        tallies[endedAt].n -= 1;
        if (model.known.has(sentence.join(' '))) tallies[endedAt].k -= 1;
      }
      ended = false;
      if (cut) sentence.pop();
      cut = false;
    } else sentence.pop();
    show.drawn(L.drawnHint);
    render();
  }

  function restart() {
    stop();
    sentence = [];
    ended = false;
    cut = false;
    show.drawn(L.drawnHint);
    render();
  }

  function setSize(i) {
    stop();
    size = i;
    render();
  }

  function setTemperature(t) {
    temperature = Math.round(Math.min(2, Math.max(0, t)) * 10) / 10;
    slider.value = String(temperature);
    render();
  }

  text.addEventListener('input', () => {
    choice = -1;
    corpora.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    if (model) show.stats(L.changed);
  });
  $('[data-train]').addEventListener('click', train);
  corpora.forEach((b, i) => b.addEventListener('click', () => choose(i)));
  $('[data-draw]').addEventListener('click', () => {
    stop();
    roll(true);
  });
  autoButton.addEventListener('click', auto);
  $('[data-best]').addEventListener('click', best);
  $('[data-back]').addEventListener('click', back);
  $('[data-new]').addEventListener('click', restart);
  contexts.forEach((b, i) => b.addEventListener('click', () => setSize(i)));
  slider.addEventListener('input', () => setTemperature(Number(slider.value)));

  // keys only while the focus is in the demonstrator and not in a field
  keys(
    box,
    [
      ['0 1 2', L.keyContext],
      ['R', L.keyDraw],
      ['A', L.keyAuto],
      ['M', L.keyBest],
      ['− / +', L.keyTemperature],
      ['B', L.keyBack],
      ['N', L.keyNew],
    ],
    (key) => {
      if (key === '0' || key === '1' || key === '2') setSize(Number(key));
      else if (key === 'r' || key === 'R') {
        stop();
        roll(true);
      } else if (key === 'a' || key === 'A') auto();
      else if (key === 'm' || key === 'M') best();
      else if (key === '-') setTemperature(temperature - 0.1);
      else if (key === '+') setTemperature(temperature + 0.1);
      else if (key === 'b' || key === 'B' || key === 'Backspace') back();
      else if (key === 'n' || key === 'N') restart();
      else return false;
      return true;
    },
  );

  show.drawn(L.drawnHint);
  render();
  choose(choice);
}

document.querySelectorAll('[data-next-word]').forEach((box, i) => {
  box.dataset.n = String(i);
  setup(box);
});
