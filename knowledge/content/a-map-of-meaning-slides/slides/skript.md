# A map of meaning

Script for the experiment *A map of meaning*, in the order of the slides. The
deck follows the steps of the experiment: each part is a short input before
the groups go on working with the model on the experiment page. All values
were measured with the model of the experiment, all-MiniLM-L6-v2.

## Opening

Type "cheap flights to Lisbon" into a search engine, and it finds a page about
low-cost air travel to Portugal, although the two share hardly a word. Behind
this lies a map of meaning, and before a computer can search for meaning, it
has to know where each text belongs. The groups lay exactly such a map
themselves, with 24 paper cards on a large sheet.

## A map by hand

**Close in meaning, close on the map.** On most sheets every card lies where
it fits, and clumps emerge from that: some tight, some loose, with single
cards in between, such as the declined card at the checkout between travel
and money. There are no fixed groups on the sheet, only closeness. The two cards with "bank"
(3 and 20) and the two with "python" (8 and 12) lie far apart, because people
read the rest of the sentence: for us, close means close in meaning, not in
letters. These four cards come back later.

**A place is a list of numbers.** Laying two axes over the same sheet turns
every place into two numbers: card 24, the password, lies at (2, 1), and
card 18, the Wi-Fi in the cafeteria, at (6, 3). Two
numbers are not enough to keep apart everything that differs, since on a
sheet cards often have to move closer than they deserve, and every further
number is a further direction in which texts can differ, so card 24 might
lie at (2, 1, −3).

**Key idea.** An embedding is a list of numbers that says where something
lies on a map of meaning. The sheet has two numbers per card, the model of
the experiment 384 per token and per text.

## Tokens get numbers

**A table with one row per token.** The first thing a language model does is
replace every token by a row of a large table. The small model of the
experiment knows 30,522 tokens with 384 numbers each. The rows of "dog" and
"puppy" look alike, the row of "car" does not. Nobody wrote these numbers by
hand; where they come from follows in the next part but one.

**Similarity is the angle between two arrows.** The 384 numbers can be read
as an arrow from the centre of the map. Two arrows in the same direction have
a similarity of 1, two at a right angle 0 and two opposite ones −1. With this
model, values below 0 hardly occur, even for opposites: among 1.3 million
pairs of words the lowest lies at −0.09.

**Measured with the model.** Dog and puppy reach 0.81, dog and cat 0.66, dog
and car 0.48. The surprise are the opposites: warm and cold reach 0.72, hot
and cold 0.53, because they stand in the same places in texts, about the
weather, drinks or ovens. The map knows what a word is about, but hardly in
which direction. Even words with nothing in common, such as puppy and invoice,
still reach 0.22.

## Computing with meaning

**King − man + woman.** Because the numbers are directions, one can compute
with them. The difference king − man is an arrow that takes out "being a man"
and leaves "royal". The same arrow, attached to woman, ends close to queen
(0.85). Because the same arrow appears twice, the sketch is a parallelogram;
it is a sketch and not to scale.

**The same works elsewhere.** Paris − France + Germany gives Berlin (0.79),
puppy − dog + cat gives kitten (0.87) and doctor − hospital + school gives
teacher (0.82). Nobody taught the model these directions; they formed because
such words are used in similar ways. Walked − walk + swim gives swimming
(0.91) just before swam (0.88): the model has caught "swim" well, the past
only weakly.

**Not always perfect.** The directions are there, but blurred, and not
every calculation works: queen − woman + man gives lord (0.79) and brother
(0.75) before king (0.74). When a calculation fails, several words lie almost equally close to the
result.

## From tokens to a text

**What the model reads.** The model writes everything in lower case and cuts
the text into tokens. `[CLS]` and `[SEP]` are not words but markers for the
start and the end, with numbers of their own. A rare word is cut into pieces
that mean little on their own: "unbelievably" becomes `un ##bel ##ie ##va
##bly`, which is why it reaches only 0.35 with "incredibly", and an English
model understands hardly any German. The two hashes mark a piece that
continues the one before it without a space, so that every word can be put
together again from its pieces.

**Four steps from tokens to one list.** Cutting turns the sentence into
tokens. Looking up gives every token its row of the table, together with a
few numbers that mark its position. Adjusting is the attention of a
transformer: in each of its six layers, every token looks at all the others,
in both directions, and takes in something of those that matter to it, and
the next layer goes on from the result.
Averaging over all tokens, scaled to length 1, finally gives the 384 numbers
of the text.

**The same token, two meanings.** The token "bank" in "the bank raised its
interest rates", in "we watched the ducks from the bank of the river" and in
"my salary goes straight to the bank" starts from the same row of the table,
that is, from the same 384 numbers. After the six layers, every "bank" has a
list of 384 numbers of its own, and each value compares two such lists: the
bank by the river reaches only 0.76 with the bank of the interest rates,
while the bank of the salary reaches 0.88. The values compare this one
token, not the sentences. This is why these
embeddings are more than a dictionary.

**Where the numbers come from.** In a first stage, a model learns to guess
hidden words from their neighbours, and to do so it has to give similar
numbers to words that can stand in the same gaps, such as dog and puppy in
"the ___ barked at the postman". In a second stage, more than a billion pairs
of texts that belong together, such as a question and its answer, were pushed
closer together and unrelated texts further apart.

**The idea behind it.** "You shall know a word by the company it keeps"
(John Rupert Firth, 1957). It is not about words that stand next to each
other, since dog and cat rarely do, but about words with the same neighbours.

## The model's map

**384 directions, drawn on two.** Nobody can draw 384 directions. The map of
the experiment shows their shadow on the two directions in which the cards
differ most, found by principal component analysis. What lies close in the
shadow usually lies close in the 384 numbers too, but not always, and when in
doubt the values count. The analysis serves only the picture: the model, the
search and every similarity go on computing with all 384 numbers.

**Search by meaning.** The query "I can't get home tonight" puts card 1, "My
train was cancelled and I missed the last connection.", at the top with 0.31,
followed by the late landing in Lisbon with 0.26, while a search by keywords
finds nothing, because no card shares a word with the question.

**One word as the question.** Single words keep the bank and python cards
apart: "river" finds "We watched the ducks from the bank of the river." with
0.49 and "The bank raised its interest rates." only with 0.20, "snake" finds
"A python swallowed a whole rabbit." with 0.46 and "Python is a popular
language for data analysis." with 0.24, because in their sentences "bank" and
"python" have adjusted their numbers.

**Key idea.** A search by meaning finds texts that share no word with the
question. This is the core of what search engines, shops and chatbots do with
embeddings today.

## What the map does not know

**About the same, or the same?** "I love this film." and "I do not love this
film." reach 0.74, more than the same opinion in other words, "What a
wonderful movie!", with 0.59. "The dog bit the man." and "The man bit the
dog." reach 0.97, and "Vaccines cause autism." and "Vaccines do not cause
autism." 0.86. The map answers the question of what a text is about; a "not"
does not change the topic, and an average knows no order.

**Key idea.** A map of meaning knows what a text is about, but not whether it
is true. A chatbot that looks things up this way finds texts on the right
topic, including those that claim the opposite.

## Inside the numbers

**Similarity is one sum.** The first six of the 384 numbers of card 1 and
card 7 are multiplied place by place, and the products are added up. The
measure is the cosine similarity, the cosine of the angle between the two
arrows, and because every arrow has length 1, it is simply this sum of 384
products, 0.32 for these two cards. A search by meaning computes exactly
this, only for millions of texts.

**How a language model picks the next token.** This is the real reason to
understand embeddings. A language model such as GPT reads the tokens so far,
"the dog barked at the", and passes them through all its layers. At the last
position it ends with a list of numbers that says where on its map the next
token should lie. This list is compared with every row of a token table, with
the same sum of products: in GPT-2 it is even the very table the tokens came
from at the start, newer models have a second table of the same kind. The
similarities become probabilities, and the model takes one of the closest
tokens, usually the most similar, with a little chance sometimes another one,
here "postman". It appends it and starts again.

**Key idea.** A language model predicts where the next token should lie on
its map and takes a token that lies close to that place.

**What else real systems do with it.** Chatbots that answer from your
documents first turn the question into numbers, search for the most similar
paragraphs and hand them to the language model together with the question.
This is called retrieval-augmented generation. Embeddings also serve search,
recommendations and the detection of duplicate questions.
