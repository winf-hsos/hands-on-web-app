// Predicting the next word by counting: the corpus of the experiment
// a-language-model-by-counting in a text field, a button that trains (counts
// every word, every pair and every triple) and a sentence that grows word by
// word. Below it stands the distribution of the next word for the chosen
// context, none, one or two words, as bars with their counts, so that every
// probability can be read as a fraction. A click on a bar appends that word,
// "Würfeln" (R) draws one by its probability and says which random number chose
// it, "Wahrscheinlichstes" takes the top one. A context that never occurred
// says so instead of guessing, which is where counting breaks down. Taken
// over from the web app of the experiment in Problem Solving with AI and
// drawn in the platform's own design.
//
// Written with ```next-word in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-next-word-labels on <body>), the corpus from
// media/datasets/tiny_corpus.csv, the file the R boxes of the experiment read.
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.nextWordLabels ?? '{}');
const DATASETS = document.body.dataset.datasets ?? '/media/datasets/';
const lang = document.documentElement.lang || 'en';
const two = new Intl.NumberFormat(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);

/** The words of a line: lower case, without punctuation, apostrophes kept. */
const tokenize = (line) =>
  line
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

/** Counts of single words, pairs and triples, each keyed by its context ('' for none). */
function count(text) {
  const sentences = text.split('\n').map(tokenize).filter((s) => s.length);
  const tables = [new Map(), new Map(), new Map()];
  const add = (table, context, word) => {
    if (!table.has(context)) table.set(context, new Map());
    const row = table.get(context);
    row.set(word, (row.get(word) ?? 0) + 1);
  };
  for (const words of sentences) {
    words.forEach((word, i) => {
      add(tables[0], '', word);
      if (i >= 1) add(tables[1], words[i - 1], word);
      if (i >= 2) add(tables[2], `${words[i - 2]} ${words[i - 1]}`, word);
    });
  }
  const tokens = sentences.reduce((n, s) => n + s.length, 0);
  return { tables, sentences: sentences.length, tokens, words: tables[0].get('')?.size ?? 0 };
}

/** The next words for a context, most frequent first, alphabetical among equals. */
function distribution(row) {
  if (!row) return { total: 0, rows: [] };
  const total = [...row.values()].reduce((a, b) => a + b, 0);
  const rows = [...row]
    .map(([word, n]) => ({ word, n, p: n / total }))
    .sort((a, b) => b.n - a.n || a.word.localeCompare(b.word));
  return { total, rows };
}

async function setup(box) {
  const csv = await fetch(`${DATASETS}tiny_corpus.csv`).then((r) => r.text());
  const corpus = csv
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => line.slice(line.indexOf(',') + 1).replace(/^"|"$/g, ''))
    .join('\n');

  box.innerHTML = `
    <div class="nw-corpus">
      <label class="dg-label" for="nw-text-${box.dataset.n}">${L.corpus}</label>
      <textarea class="nw-text" id="nw-text-${box.dataset.n}" rows="7" spellcheck="false"></textarea>
      <div class="nw-train">
        <button type="button" class="button" data-train>${L.train}</button>
        <button type="button" class="chip-button" data-original>${L.original}</button>
        <p class="dg-reading" data-out="stats" aria-live="polite"></p>
      </div>
    </div>
    <div class="dg-choices nw-context" role="group" aria-label="${L.context}">
      <span class="dg-label">${L.context}</span>
      ${L.contexts.map((c, i) => `<button type="button" class="chip-button" data-context="${i}" aria-pressed="false">${c}</button>`).join('')}
    </div>
    <div class="nw-sentence" aria-live="polite" aria-label="${L.sentence}"></div>
    <div class="nw-actions">
      <button type="button" class="button" data-draw>${L.draw}</button>
      <button type="button" class="chip-button" data-best>${L.best}</button>
      <button type="button" class="chip-button" data-back>${L.back}</button>
      <button type="button" class="chip-button" data-new>${L.newSentence}</button>
    </div>
    <div class="dg-calc nw-calc">
      <p class="dg-size" data-out="question"></p>
      <p data-out="basis"></p>
      <p class="dg-time" data-out="drawn"></p>
    </div>
    <ol class="nw-bars" aria-label="${L.bars}"></ol>`;

  const $ = (selector) => box.querySelector(selector);
  const text = $('.nw-text');
  const bars = $('.nw-bars');
  const words = $('.nw-sentence');
  const contexts = [...box.querySelectorAll('[data-context]')];
  const out = (name) => $(`[data-out="${name}"]`);
  text.value = corpus;

  // every changing line keeps the size of its longest form from the start
  const long = 'sleeps sleeps';
  const show = {
    stats: steady(out('stats'), [L.untrained, L.changed, fill(L.stats, { sentences: 999, tokens: 9999, words: 999 })]),
    question: steady(out('question'), [L.contextNone, fill(L.contextOne, { context: long }), fill(L.contextTwo, { context: long })]),
    basis: steady(out('basis'), [
      fill(L.basisNone, { total: 9999 }),
      fill(L.basis, { context: long, total: 999 }),
      fill(L.unseen, { context: long }),
      fill(L.shorter, { have: 1, want: 2 }),
      fill(L.noneYet, { total: 9999 }),
      L.untrainedBasis,
    ]),
    drawn: steady(out('drawn'), [L.drawnHint, fill(L.drawn, { r: two.format(0.99), word: 'chases', from: two.format(0.99), to: two.format(1) }), fill(L.picked, { word: 'chases' })]),
  };

  let model = null;
  let sentence = [];
  let size = 1;
  let current = { total: 0, rows: [] };

  function train() {
    model = count(text.value);
    show.stats(fill(L.stats, model));
    render();
  }

  /** The context the model can use now: as many words as chosen, at most as many as written. */
  function context() {
    const n = Math.min(size, sentence.length);
    return { n, words: sentence.slice(sentence.length - n) };
  }

  function render() {
    contexts.forEach((b, i) => b.setAttribute('aria-pressed', String(i === size)));
    words.replaceChildren(
      ...(sentence.length
        ? sentence.map((w, i) => {
            const chip = Object.assign(document.createElement('span'), { className: 'nw-word', textContent: w });
            if (model && i >= sentence.length - context().n) chip.classList.add('is-context');
            return chip;
          })
        : [Object.assign(document.createElement('span'), { className: 'nw-empty', textContent: L.emptySentence })]),
    );
    if (!model) {
      current = { total: 0, rows: [] };
      show.question(L.contextNone);
      show.basis(L.untrainedBasis);
      drawBars();
      return;
    }
    const { n, words: ctx } = context();
    const key = ctx.join(' ');
    current = distribution(model.tables[n].get(key));
    const quoted = `"${key}"`;
    show.question(n === 0 ? L.contextNone : fill(n === 1 ? L.contextOne : L.contextTwo, { context: quoted }));
    if (n < size) show.basis(n === 0 ? fill(L.noneYet, { total: current.total }) : fill(L.shorter, { have: n, want: size }));
    else if (!current.total) show.basis(fill(L.unseen, { context: quoted }));
    else show.basis(n === 0 ? fill(L.basisNone, { total: current.total }) : fill(L.basis, { context: quoted, total: current.total }));
    drawBars();
  }

  function drawBars() {
    const top = current.rows[0]?.p ?? 1;
    bars.replaceChildren(
      ...current.rows.map((row) => {
        const item = document.createElement('li');
        const button = Object.assign(document.createElement('button'), { type: 'button', className: 'nw-bar' });
        button.setAttribute('aria-label', fill(L.barLabel, { word: row.word, p: two.format(row.p), n: row.n, total: current.total }));
        button.innerHTML = `<span class="nw-label"></span><span class="nw-track"><span class="nw-fill" style="width:${(row.p / top) * 100}%"></span></span><span class="nw-p">${two.format(row.p)}</span><span class="nw-n">${row.n}/${current.total}</span>`;
        button.querySelector('.nw-label').textContent = row.word;
        button.addEventListener('click', () => append(row.word, fill(L.picked, { word: row.word })));
        item.append(button);
        return item;
      }),
    );
  }

  function append(word, message) {
    if (!model) return;
    sentence.push(word);
    show.drawn(message);
    render();
  }

  function draw() {
    if (!model || !current.rows.length) return;
    const r = Math.random();
    let from = 0;
    for (const row of current.rows) {
      const to = from + row.p;
      if (r < to || row === current.rows.at(-1)) {
        const message = fill(L.drawn, { r: two.format(r), word: row.word, from: two.format(from), to: two.format(to) });
        append(row.word, message);
        return;
      }
      from = to;
    }
  }

  function best() {
    if (current.rows.length) append(current.rows[0].word, fill(L.picked, { word: current.rows[0].word }));
  }

  function back() {
    sentence.pop();
    show.drawn(L.drawnHint);
    render();
  }

  function restart() {
    sentence = [];
    show.drawn(L.drawnHint);
    render();
  }

  function setSize(i) {
    size = i;
    render();
  }

  text.addEventListener('input', () => model && show.stats(L.changed));
  $('[data-train]').addEventListener('click', train);
  $('[data-original]').addEventListener('click', () => {
    text.value = corpus;
    train();
  });
  $('[data-draw]').addEventListener('click', draw);
  $('[data-best]').addEventListener('click', best);
  $('[data-back]').addEventListener('click', back);
  $('[data-new]').addEventListener('click', restart);
  contexts.forEach((b, i) => b.addEventListener('click', () => setSize(i)));

  // keys only while the focus is in the demonstrator and not in the text field
  keys(
    box,
    [
      ['0 1 2', L.keyContext],
      ['R', L.keyDraw],
      ['M', L.keyBest],
      ['B', L.keyBack],
      ['N', L.keyNew],
    ],
    (key) => {
      if (document.activeElement === text) return false;
      if (key === '0' || key === '1' || key === '2') setSize(Number(key));
      else if (key === 'r' || key === 'R') draw();
      else if (key === 'm' || key === 'M') best();
      else if (key === 'b' || key === 'B' || key === 'Backspace') back();
      else if (key === 'n' || key === 'N') restart();
      else return false;
      return true;
    },
  );

  show.stats(L.untrained);
  show.drawn(L.drawnHint);
  train();
}

document.querySelectorAll('[data-next-word]').forEach((box, i) => {
  box.dataset.n = String(i);
  setup(box);
});
