// Writes what the experiment "A map of meaning" needs besides its text:
//   knowledge/media/datasets/meaning_cards.csv     the 24 cards: card, text
//   knowledge/media/datasets/meaning_vectors.csv   their 384 numbers: card, dim, value
//   knowledge/media/datasets/word_vectors.csv      single words for the arithmetic: word, dim, value
//   knowledge/content/a-map-of-meaning/media/meaning-cards.pdf   the cards to print and cut
//   knowledge/content/a-map-of-meaning/media/arithmetic-words.json   the words the
//       word-arithmetic demonstrator searches, with their numbers in 8 bits
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

// The words the word-arithmetic demonstrator (client/word-arithmetic.js)
// searches for the result of a calculation: everyday English in groups that
// make calculations work, people and their counterparts, countries with
// their capitals, languages and people, animals with their young, adjectives
// with their comparatives, verbs with their past, and enough else that a
// failed calculation lands somewhere sensible. The numbers are stored as
// 8-bit integers with one scale per word, which changes a similarity by less
// than 0.01 and keeps the file small.
const VOCABULARY = `
man woman boy girl king queen prince princess father mother son daughter brother sister uncle aunt
husband wife grandfather grandmother nephew niece actor actress waiter waitress hero heroine emperor
empress duke duchess lord lady gentleman monk nun male female boyfriend girlfriend bride groom
france paris french germany berlin german italy rome italian spain madrid spanish england london english
japan tokyo japanese china beijing chinese russia moscow russian greece athens greek portugal lisbon
portuguese egypt cairo egyptian canada ottawa canadian austria vienna austrian poland warsaw polish
sweden stockholm swedish norway oslo norwegian netherlands amsterdam dutch ireland dublin irish turkey
ankara turkish india delhi indian brazil brazilian mexico mexican australia canberra australian
dog puppy cat kitten cow calf horse foal sheep lamb pig piglet goat duck duckling chicken chick hen
rooster bear cub lion lioness tiger wolf fox deer frog tadpole butterfly caterpillar fish bird eagle owl
mouse rat rabbit snake whale dolphin shark bee ant spider elephant monkey
big bigger biggest small smaller smallest good better best bad worse worst tall taller tallest short
shorter long longer fast faster fastest slow slower strong stronger weak weaker old older young younger
high higher low lower hot hotter cold colder warm warmer easy easier hard harder happy happier rich
richer poor poorer
walk walked walking swim swam swimming run ran running go went going eat ate eating drink drank sing
sang see saw write wrote read speak spoke take took give gave come came fly flew sleep slept think
thought buy bought teach taught drive drove fall fell
car cars house houses child children mice foot feet tooth teeth city cities
doctor hospital nurse teacher school student university pilot plane airport chef kitchen restaurant
farmer farm baker bakery judge court lawyer police soldier army painter brush writer book pen
programmer computer musician guitar piano
bread butter cheese milk coffee tea beer wine water juice pizza pasta rice soup salad apple banana
orange grape lemon sugar salt pepper cake chocolate
sad angry calm love hate fear joy beautiful ugly clever stupid kind cruel
sun moon star rain snow wind cloud storm summer winter spring autumn day night morning evening sea
river lake mountain forest desert island
phone laptop internet email keyboard screen software app
red blue green yellow black white
football tennis golf ball goal team
monday sunday january december week month year
`.trim().split(/\s+/);

// Single words for arithmetic with meaning in R (king − man + woman).
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
const vocabulary = [];
for (const word of VOCABULARY) vocabulary.push(await embed(word));

writeFileSync(join(DATASETS, 'meaning_cards.csv'), ['card,text', ...CARDS.map((t, i) => `${i + 1},${quote(t)}`)].join('\n') + '\n');
writeFileSync(join(DATASETS, 'meaning_vectors.csv'), ['card,dim,value', ...cards.flatMap((v, i) => v.map((x, d) => `${i + 1},${d + 1},${round(x)}`))].join('\n') + '\n');
writeFileSync(join(DATASETS, 'word_vectors.csv'), ['word,dim,value', ...words.flatMap((v, i) => v.map((x, d) => `${WORDS[i]},${d + 1},${round(x)}`))].join('\n') + '\n');

// the vocabulary of the demonstrator: per word a scale and 384 integers
const scales = vocabulary.map((v) => Math.max(...v.map(Math.abs)) / 127);
const packed = Int8Array.from(vocabulary.flatMap((v, i) => v.map((x) => Math.round(x / scales[i]))));
writeFileSync(
  join(MEDIA, 'arithmetic-words.json'),
  JSON.stringify({
    model: MODEL,
    dims: vocabulary[0].length,
    words: VOCABULARY,
    scales: scales.map((x) => Number(x.toPrecision(6))),
    vectors: Buffer.from(packed.buffer).toString('base64'),
  }) + '\n',
);

// a check of the analogies the experiment asks for, printed for the author
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
console.log(`${CARDS.length} cards, ${WORDS.length} words, ${VOCABULARY.length} words for the demonstrator, ${cards[0].length} numbers each`);
