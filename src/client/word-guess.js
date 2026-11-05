// Guessing the next word, people against the counting model: a sentence that
// is not in the corpus is revealed word by word. Before each word the group
// types its guess; only then does the counting model show its own, the most
// frequent next word after the last two words of the farm corpus (after the
// last word where the two never occurred, and nothing where even that one
// never occurred), and the word itself is revealed. Both get a point for
// every word they guessed, and at the end it says who predicted better. This is
// Shannon's guessing game (1951), in which people predict text letter by
// letter (Nicolas, 2026-11-05).
//
// Written with ```word-guess in Markdown, one sentence per line in the block
// (remark-knowledge.mjs passes them as data-word-guess); the labels come from
// the page (data-word-guess-labels on <body>), the corpus from
// media/datasets/farm_corpus.csv, the same as for the next-word demonstrator.
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.wordGuessLabels ?? '{}');
const DATASETS = document.body.dataset.datasets ?? '/media/datasets/';
const START = '<s>';
const END = '</s>';
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const tokenize = (line) =>
  line
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

/** Pairs and triples of the corpus, each keyed by its context. */
function count(sentences) {
  const tables = [null, new Map(), new Map()];
  const add = (table, context, word) => {
    if (!table.has(context)) table.set(context, new Map());
    const row = table.get(context);
    row.set(word, (row.get(word) ?? 0) + 1);
  };
  for (const words of sentences) {
    const t = [START, ...words, END];
    for (let i = 1; i < t.length; i++) {
      add(tables[1], t[i - 1], t[i]);
      if (i >= 2) add(tables[2], `${t[i - 2]} ${t[i - 1]}`, t[i]);
    }
  }
  return tables;
}

/** The model's guess after `tokens`: the most frequent next word for the longest context it has seen. */
function predict(tables, tokens) {
  for (const k of [2, 1]) {
    if (tokens.length < k) continue;
    const context = tokens.slice(-k).join(' ');
    const row = tables[k].get(context);
    if (!row) continue;
    const total = [...row.values()].reduce((a, b) => a + b, 0);
    const [word, n] = [...row].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    return { word, n, total, context };
  }
  return null;
}

async function setup(box) {
  const sentences = JSON.parse(box.dataset.wordGuess || '[]').map(tokenize).filter((s) => s.length);
  const csv = await fetch(`${DATASETS}farm_corpus.csv`).then((r) => r.text());
  const corpus = csv
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => tokenize(line.slice(line.indexOf(',') + 1)));
  const tables = count(corpus);

  box.innerHTML = `
    <div class="wg-head">
      <p class="dg-reading" data-out="position"></p>
      <p class="wg-score" data-out="score" aria-live="polite"></p>
    </div>
    <div class="wg-sentence" aria-label="${L.sentence}"></div>
    <form class="wg-form">
      <label class="dg-label" for="wg-input-${box.dataset.n}">${L.yourGuess}</label>
      <input class="wg-input" id="wg-input-${box.dataset.n}" type="text" autocomplete="off" spellcheck="false" autocapitalize="off">
      <button type="submit" class="button">${L.reveal}</button>
      <button type="button" class="chip-button" data-next>${L.next}</button>
      <button type="button" class="chip-button" data-again>${L.again}</button>
    </form>
    <div class="dg-calc wg-calc" aria-live="polite">
      <p class="dg-size" data-out="word"></p>
      <p data-out="you"></p>
      <p data-out="model"></p>
    </div>`;

  const $ = (selector) => box.querySelector(selector);
  const out = (name) => $(`[data-out="${name}"]`);
  const input = $('.wg-input');
  const words = $('.wg-sentence');
  const long = 'xxxxxxxxxxx';
  const show = {
    position: steady(out('position'), [fill(L.position, { n: 99, total: 99 }), L.finished]),
    score: steady(out('score'), [fill(L.score, { you: 99, model: 99 })]),
    word: steady(out('word'), [L.waiting, fill(L.word, { word: long }), fill(L.sentenceDone, { n: 99 }), ...[L.finalYou, L.finalModel, L.finalTie].map((t) => fill(t, { you: 99, model: 99 }))]),
    you: steady(out('you'), [L.youHint, fill(L.youRight, { guess: long }), fill(L.youWrong, { guess: long }), L.youNone]),
    model: steady(out('model'), [
      L.modelHint,
      fill(L.modelRight, { guess: long, context: `"${long} ${long}"`, n: 9, total: 99 }),
      fill(L.modelWrong, { guess: long, context: `"${long} ${long}"`, n: 9, total: 99 }),
      fill(L.modelNone, { context: `"${long}"` }),
      L.modelEnd,
    ]),
  };

  let index = 0; // the sentence
  let shown = 0; // how many of its words are revealed
  let marks = []; // [you right, model right] per revealed word
  let score = { you: 0, model: 0 };

  const done = () => shown >= sentences[index].length;

  function render() {
    show.position(fill(L.position, { n: index + 1, total: sentences.length }));
    show.score(fill(L.score, score));
    const sentence = sentences[index];
    const cell = (word, mark) => {
      const item = Object.assign(document.createElement('span'), { className: 'wg-word' });
      item.append(Object.assign(document.createElement('span'), { className: 'nw-word', textContent: word }));
      if (mark) {
        const line = Object.assign(document.createElement('span'), { className: 'wg-marks' });
        line.append(
          Object.assign(document.createElement('span'), { className: `wg-mark${mark[0] ? ' is-hit' : ''}`, textContent: L.you, title: mark[0] ? L.hit : L.miss }),
          Object.assign(document.createElement('span'), { className: `wg-mark${mark[1] ? ' is-hit' : ''}`, textContent: L.model, title: mark[1] ? L.hit : L.miss }),
        );
        item.append(line);
      }
      return item;
    };
    const items = [cell(START), ...sentence.slice(0, shown).map((w, i) => cell(w, marks[i]))];
    if (!done()) items.push(cell('?'));
    words.replaceChildren(...items);
    items.at(-1).querySelector('.nw-word').classList.toggle('is-context', !done());
    items[0].querySelector('.nw-word').classList.add('is-mark');
    input.disabled = done();
    $('.wg-form [type="submit"]').disabled = done();
    $('[data-next]').disabled = !done() || index === sentences.length - 1;
  }

  function reveal(guess) {
    if (done()) return;
    const sentence = sentences[index];
    const word = sentence[shown];
    const typed = tokenize(guess)[0] ?? '';
    const prediction = predict(tables, [START, ...sentence.slice(0, shown)]);
    const you = typed === word;
    const model = prediction?.word === word;
    score.you += Number(you);
    score.model += Number(model);
    marks.push([you, model]);
    shown += 1;
    show.word(fill(L.word, { word }));
    show.you(!typed ? L.youNone : fill(you ? L.youRight : L.youWrong, { guess: typed }));
    if (!prediction) show.model(fill(L.modelNone, { context: `"${sentence[shown - 2] ?? START}"` }));
    else if (prediction.word === END) show.model(L.modelEnd);
    else show.model(fill(model ? L.modelRight : L.modelWrong, { guess: prediction.word, context: `"${prediction.context}"`, n: prediction.n, total: prediction.total }));
    input.value = '';
    render();
    if (done()) finish();
    else input.focus();
  }

  function finish() {
    if (index < sentences.length - 1) {
      const hits = marks.filter((m) => m[0]).length;
      show.word(fill(L.sentenceDone, { n: hits }));
      $('[data-next]').focus();
      return;
    }
    show.position(L.finished);
    show.word(fill(score.you > score.model ? L.finalYou : score.you < score.model ? L.finalModel : L.finalTie, score));
  }

  function next() {
    if (!done() || index >= sentences.length - 1) return;
    index += 1;
    shown = 0;
    marks = [];
    clearLines();
    render();
    input.focus();
  }

  function again() {
    index = 0;
    shown = 0;
    marks = [];
    score = { you: 0, model: 0 };
    clearLines();
    render();
    input.focus();
  }

  function clearLines() {
    show.word(L.waiting);
    show.you(L.youHint);
    show.model(L.modelHint);
  }

  $('.wg-form').addEventListener('submit', (e) => {
    e.preventDefault();
    reveal(input.value);
  });
  $('[data-next]').addEventListener('click', next);
  $('[data-again]').addEventListener('click', again);

  // Enter in the field reveals; outside it N goes on and 0 starts again
  keys(
    box,
    [
      ['Enter', L.keyReveal],
      ['N', L.keyNext],
      ['0', L.keyAgain],
    ],
    (key) => {
      if (key === 'n' || key === 'N') next();
      else if (key === '0') again();
      else return false;
      return true;
    },
  );

  clearLines();
  render();
}

document.querySelectorAll('[data-word-guess]').forEach((box, i) => {
  box.dataset.n = String(i);
  setup(box);
});
