// Writes what the experiment "A map of meaning" needs besides its text:
//   knowledge/media/datasets/meaning_cards.csv     the 24 cards: card, text
//   knowledge/media/datasets/meaning_vectors.csv   their 384 numbers: card, dim, value
//   knowledge/media/datasets/word_vectors.csv      single words for the extension: word, dim, value
//   knowledge/content/a-map-of-meaning/media/meaning-cards.pdf   the cards to print and cut
// The numbers come from the same model the meaning-map demonstrator runs in
// the browser (scripts/fetch-embedding-model.mjs), so that R and the map agree.
// Needs the model in vendor/models/ and Typst on the path.
// Usage: node scripts/meaning-data.mjs
import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pipeline, env } from '@huggingface/transformers';
const MODEL = 'Xenova/all-MiniLM-L6-v2'; // the model of scripts/fetch-embedding-model.mjs

const ROOT = join(import.meta.dirname, '..');
const DATASETS = join(ROOT, 'knowledge/media/datasets');
const MEDIA = join(ROOT, 'knowledge/content/a-map-of-meaning/media');

// Six everyday topics of four cards each, mixed on the printed sheet. Two
// pairs share a word with different meanings (bank, python), so that the
// experiment can ask whether the model keeps them apart.
export const CARDS = [
  'My train was cancelled and I missed the last connection.',
  'The cat sleeps on the windowsill all afternoon.',
  'The bank raised its interest rates.',
  'I have had a sore throat since Monday.',
  'Fry the onions until they turn golden brown.',
  'My laptop restarts every time I open the browser.',
  'We landed in Lisbon three hours late.',
  'A python swallowed a whole rabbit.',
  'My card was declined at the checkout.',
  'The doctor told me to stay in bed for two days.',
  'We ordered two pizzas and a large salad.',
  'Python is a popular language for data analysis.',
  "Don't forget your passport at the security check.",
  'Our dog barks whenever the postman comes.',
  'Prices in the supermarket have gone up again.',
  'She broke her wrist when she fell off her bike.',
  'Fresh bread from the bakery is still warm.',
  'The Wi-Fi in the cafeteria keeps dropping.',
  'The night bus to Berlin was completely full.',
  'We watched the ducks from the bank of the river.',
  'She puts a little aside every month for later.',
  'You should drink more water when you have a fever.',
  'This soup needs a little more salt.',
  'He forgot his password and was locked out of his account.',
];

// Single words for arithmetic with meaning (king − man + woman).
const WORDS = 'king queen man woman boy girl prince princess father mother son daughter brother sister uncle aunt husband wife paris france berlin germany rome italy madrid spain london england tokyo japan big bigger small smaller good better bad worse walk walked swim swam dog puppy cat kitten cow calf'.split(' ');

env.localModelPath = join(ROOT, 'vendor/models/');
env.allowRemoteModels = false;
const extract = await pipeline('feature-extraction', MODEL, { dtype: 'q8' });
const embed = async (text) => Array.from((await extract(text, { pooling: 'mean', normalize: true })).data);
const round = (x) => Number(x.toFixed(4));
const quote = (text) => `"${text.replaceAll('"', '""')}"`;

const cards = [];
for (const text of CARDS) cards.push(await embed(text));
const words = [];
for (const word of WORDS) words.push(await embed(word));

writeFileSync(join(DATASETS, 'meaning_cards.csv'), ['card,text', ...CARDS.map((t, i) => `${i + 1},${quote(t)}`)].join('\n') + '\n');
writeFileSync(join(DATASETS, 'meaning_vectors.csv'), ['card,dim,value', ...cards.flatMap((v, i) => v.map((x, d) => `${i + 1},${d + 1},${round(x)}`))].join('\n') + '\n');
writeFileSync(join(DATASETS, 'word_vectors.csv'), ['word,dim,value', ...words.flatMap((v, i) => v.map((x, d) => `${WORDS[i]},${d + 1},${round(x)}`))].join('\n') + '\n');

// a check of the analogies the extension asks for, printed for the author
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const vec = (w) => words[WORDS.indexOf(w)];
for (const [a, b, c] of [['king', 'man', 'woman'], ['paris', 'france', 'germany'], ['father', 'man', 'woman'], ['bigger', 'big', 'small'], ['puppy', 'dog', 'cat'], ['walked', 'walk', 'swim']]) {
  const target = vec(a).map((x, i) => x - vec(b)[i] + vec(c)[i]);
  const ranked = WORDS.filter((w) => ![a, b, c].includes(w)).map((w) => [w, dot(target, vec(w))]).sort((x, y) => y[1] - x[1]);
  console.log(`${a} - ${b} + ${c} =`, ranked.slice(0, 3).map(([w, s]) => `${w} ${s.toFixed(2)}`).join(', '));
}

// the cards to print: one A4 sheet, 4 × 6, each with its number
mkdirSync(MEDIA, { recursive: true });
const typ = join(MEDIA, 'meaning-cards.typ');
const entries = CARDS.map((t, i) => `  (${i + 1}, "${t.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"),`).join('\n');
writeFileSync(
  typ,
  `#set page(paper: "a4", margin: 8mm)
#set text(font: ("Segoe UI", "Arial"), size: 11.5pt, lang: "en")
#let cards = (
${entries}
)
#let card((n, t)) = box(
  width: 100%, height: 100%, stroke: 0.4pt + luma(170), inset: 7pt,
  {
    place(top + left, box(width: 7mm, height: 7mm, radius: 50%, stroke: 0.6pt + luma(90), align(center + horizon, text(font: "Consolas", size: 10pt, weight: "bold", str(n)))))
    place(center + horizon, box(width: 92%, align(center, text(weight: "medium", t))))
  },
)
#grid(columns: (1fr,) * 4, rows: (1fr,) * 6, ..cards.map(card))
`,
);
execFileSync('typst', ['compile', typ, join(MEDIA, 'meaning-cards.pdf')], { stdio: 'inherit' });
unlinkSync(typ);
console.log(`${CARDS.length} cards, ${WORDS.length} words, ${cards[0].length} numbers each`);
