// The question game: one of sixteen faces is the secret, so there are
// log2(16) = 4 bits of uncertainty in it. Every answered question shrinks the
// crowd, and the shrinking is the information, I = H1 - H2 with
// H = log2(faces left). After each answer the panel below the faces writes
// out what the answer gained and what the question was worth in advance
// (its expected value, the entropy of its split among the faces left), so a
// well planned question can be told from a lucky one. How many faces would
// say yes is deliberately not shown: counting them is the strategy. A click
// on a face is a guess and counts as a question, mostly the worst one, one
// against the rest. Mia is the only one with red hair, so she answers no to
// all three questions about hair colour. Taken over from the LiFi concept
// demos (question-game) and drawn in the platform's own design.
//
// Written with ```question-game in Markdown (remark-knowledge.mjs); the
// labels come from the page (data-question-game-labels on <body>). The faces
// lie in knowledge/media/faces/ and are AI-generated.
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.questionGameLabels ?? '{}');
const FACES = '/media/faces/';

// [glasses, hat, beard, curly, earrings, bow tie], hair red/blonde/grey/dark,
// and woman, which eight of the sixteen are: the one perfect halving
const PEOPLE = [
  { name: 'Mia', a: [1, 1, 0, 1, 0, 0], woman: 1, hair: 'r' },
  { name: 'Omar', a: [1, 0, 1, 0, 0, 0], woman: 0, hair: 'd' },
  { name: 'Lena', a: [1, 0, 0, 1, 1, 0], woman: 1, hair: 'b' },
  { name: 'Ravi', a: [1, 1, 0, 0, 0, 0], woman: 0, hair: 'd' },
  { name: 'Finn', a: [1, 0, 1, 1, 0, 0], woman: 0, hair: 'b' },
  { name: 'Aisha', a: [1, 1, 0, 0, 1, 0], woman: 1, hair: 'd' },
  { name: 'Jonas', a: [1, 0, 0, 1, 0, 1], woman: 0, hair: 'g' },
  { name: 'Zoe', a: [1, 0, 0, 0, 0, 0], woman: 1, hair: 'd' },
  { name: 'Ines', a: [0, 1, 0, 1, 1, 0], woman: 1, hair: 'g' },
  { name: 'Malik', a: [0, 0, 1, 0, 0, 0], woman: 0, hair: 'd' },
  { name: 'Sofia', a: [0, 0, 0, 1, 0, 0], woman: 1, hair: 'd' },
  { name: 'Ben', a: [0, 1, 0, 0, 0, 1], woman: 0, hair: 'd' },
  { name: 'Karim', a: [0, 0, 1, 1, 0, 0], woman: 0, hair: 'd' },
  { name: 'Yuki', a: [0, 0, 0, 0, 1, 0], woman: 1, hair: 'd' },
  { name: 'Elif', a: [0, 1, 0, 1, 0, 0], woman: 1, hair: 'd' },
  { name: 'Noah', a: [0, 0, 0, 0, 1, 1], woman: 0, hair: 'd' },
];

// in the order of the labels in i18n.mjs, keys 1 to 9 and 0
const TESTS = [
  (p) => p.a[0] === 1,
  (p) => p.a[1] === 1,
  (p) => p.a[2] === 1,
  (p) => p.a[3] === 1,
  (p) => p.a[4] === 1,
  (p) => p.a[5] === 1,
  (p) => p.hair === 'g',
  (p) => p.hair === 'b',
  (p) => p.hair === 'd',
  (p) => p.woman === 1,
];

const N = PEOPLE.length;
const TOTAL = Math.log2(N);
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const lang = document.documentElement.lang || 'en';
const two = new Intl.NumberFormat(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** What a yes-or-no question is worth on average: the entropy of its split. */
function expected(yes, total) {
  const p = yes / total;
  if (p <= 0 || p >= 1) return 0;
  return p * Math.log2(1 / p) + (1 - p) * Math.log2(1 / (1 - p));
}

// The lines of the answer panel, one function each, so that every form a
// line can take is known from the start and its place keeps its size.
const line = {
  question: (sentence, answer) => `${sentence} ${answer ? L.yes : L.no}`,
  gained: (before, after) =>
    fill(L.gained, { before, after, bits: two.format(Math.log2(before / after)) }),
  worth: (before, yes) =>
    yes === 0 || yes === before
      ? fill(L.worthNothing, { before })
      : fill(L.worth, { before, yes, no: before - yes, bits: two.format(expected(yes, before)) }),
  found: (name, asked) =>
    fill(asked <= TOTAL ? L.foundHalving : L.foundMore, { name, asked, bits: two.format(TOTAL), per: two.format(TOTAL / asked) }),
};

function setup(box) {
  box.innerHTML = `
    <div class="qg-faces" role="group" aria-label="${L.faces}">
      ${PEOPLE.map((p, i) => `<button type="button" class="qg-face" data-face="${i}" aria-label="${fill(L.guess, { name: p.name })}"><img src="${FACES}${p.name.toLowerCase()}.jpg" alt="" width="240" height="240" loading="lazy"><span>${p.name}</span></button>`).join('')}
    </div>
    <p class="dg-label qg-hint">${L.hint}</p>
    <div class="dg-chips qg-questions">
      ${L.questions.map((q, i) => `<button type="button" class="chip-button" data-question="${i}">${q.label}</button>`).join('')}
    </div>
    <div class="dg-calc qg-answer" aria-live="polite">
      <p class="dg-size" data-out="question"></p>
      <p data-out="gained"></p>
      <p data-out="worth"></p>
      <p class="dg-time" data-out="found"></p>
    </div>
    <div class="qg-meter">
      <p class="dg-label" data-out="meter"></p>
      <div class="qg-track"><div class="qg-fill"></div></div>
    </div>
    <dl class="qg-stats">
      <div><dt>${L.left}</dt><dd data-out="left"></dd><dd class="qg-note">${L.leftNote}</dd></div>
      <div><dt>${L.asked}</dt><dd data-out="asked"></dd><dd class="qg-note">${L.askedNote}</dd></div>
      <div><dt>${L.perQuestion}</dt><dd data-out="per"></dd><dd class="qg-note">${L.perNote}</dd></div>
      <div><dt>${L.needed}</dt><dd>${two.format(TOTAL)}</dd><dd class="qg-note">${L.neededNote}</dd></div>
    </dl>
    <ol class="qg-log" aria-label="${L.logLabel}"></ol>
    <div class="qg-end">
      <button type="button" class="button" data-new>${L.newGame}</button>
      <p class="dg-note">${L.credit}</p>
    </div>`;

  const $ = (selector) => box.querySelector(selector);
  const faces = [...box.querySelectorAll('[data-face]')];
  const questions = [...box.querySelectorAll('[data-question]')];
  const log = $('.qg-log');
  const bar = $('.qg-fill');
  const out = (name) => $(`[data-out="${name}"]`);

  // Every changing line keeps the size of its longest form from the start.
  // The panel is set in the code font, so the longest form is the one with
  // the most characters: two-digit counts and a five-letter name.
  const sentences = [...L.questions.map((q) => q.sentence), ...PEOPLE.map((p) => fill(L.isIt, { name: p.name }))];
  const show = {
    question: steady(out('question'), [L.start, ...sentences.flatMap((s) => [line.question(s, true), line.question(s, false)])]),
    gained: steady(out('gained'), [L.startGained, line.gained(16, 10)]),
    worth: steady(out('worth'), [line.worth(16, 0), line.worth(16, 10)]),
    found: steady(out('found'), [line.found('Aisha', 4), line.found('Aisha', 26)]),
  };

  let secret, alive, asked, count, bits, over;

  const left = () => alive.filter(Boolean).length;

  function newGame() {
    secret = Math.floor(Math.random() * N);
    alive = Array(N).fill(true);
    asked = questions.map(() => false);
    count = 0;
    bits = 0;
    over = false;
    log.replaceChildren();
    show.question(L.start);
    show.gained(L.startGained);
    show.worth('');
    show.found('');
    render();
  }

  // one step of the game: the question, how many of the faces left would say
  // yes, the answer for the secret, and which faces stay
  function answer(sentence, short, yes, said, stays) {
    const before = left();
    alive = alive.map((a, i) => a && stays(i));
    const after = left();
    count += 1;
    bits += Math.log2(before / after);
    show.question(line.question(sentence, said));
    show.gained(line.gained(before, after));
    show.worth(line.worth(before, yes));
    const entry = document.createElement('li');
    entry.textContent = fill(L.logLine, { question: short, answer: said ? L.yes : L.no, before, after, bits: two.format(Math.log2(before / after)) });
    log.prepend(entry);
    if (after === 1) {
      over = true;
      show.found(line.found(PEOPLE[alive.indexOf(true)].name, count));
    }
    render();
  }

  function ask(q) {
    if (over || asked[q]) return;
    asked[q] = true;
    const test = TESTS[q];
    const yes = PEOPLE.filter((p, i) => alive[i] && test(p)).length;
    const said = test(PEOPLE[secret]);
    answer(L.questions[q].sentence, L.questions[q].label, yes, said, (i) => test(PEOPLE[i]) === said);
  }

  function guess(i) {
    if (over || !alive[i]) return;
    const said = i === secret;
    const question = fill(L.isIt, { name: PEOPLE[i].name });
    answer(question, question, 1, said, (j) => (said ? j === i : j !== i));
  }

  function render() {
    faces.forEach((b, i) => {
      b.classList.toggle('is-out', !alive[i]);
      b.classList.toggle('is-found', over && alive[i]);
      b.disabled = !alive[i];
    });
    questions.forEach((b, q) => (b.disabled = over || asked[q]));
    out('left').textContent = left();
    out('asked').textContent = count;
    out('per').textContent = count ? two.format(bits / count) : '–';
    out('meter').textContent = fill(L.meter, { bits: two.format(bits), total: two.format(TOTAL) });
    bar.style.width = `${Math.min(100, (bits / TOTAL) * 100)}%`;
  }

  faces.forEach((b, i) => b.addEventListener('click', () => guess(i)));
  questions.forEach((b, q) => b.addEventListener('click', () => ask(q)));
  $('[data-new]').addEventListener('click', newGame);

  // keys only while the focus is in the demonstrator, so the page still scrolls
  keys(
    box,
    [
      ['1 – 9 0', L.keyAsk],
      ['N', L.keyNew],
    ],
    (key) => {
      if (key >= '1' && key <= '9') ask(Number(key) - 1);
      else if (key === '0') ask(9);
      else if (key === 'n' || key === 'N') newGame();
      else return false;
      return true;
    },
  );

  newGame();
}
document.querySelectorAll('[data-question-game]').forEach((box) => setup(box));
