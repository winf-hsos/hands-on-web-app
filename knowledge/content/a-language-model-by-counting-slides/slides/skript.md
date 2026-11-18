# Word distributions

Script for the experiment *Word distributions*, in the order of the slides.
The deck follows the steps of the experiment: each part is a short input
before the groups go on counting, drawing and running R on the experiment
page. All numbers come from the same 22 sentences as the experiment, and the
deck computes them from these sentences itself. The experiment is a
deliberately simplified picture of the basic idea behind a language model,
not a description of how ChatGPT works inside.

## Opening (frame 3)

A language model answers one question over and over: which word comes next,
given everything that came before? Real models answer it with a neural
network trained on trillions of words, but the question is simple enough to
answer with a pencil, word cards and a few bags. How far do you get with
nothing but counting which word follows which? The experiment finds out for
22 sentences about a farm.

## You first

**What comes next? (frames 5 to 7)** Before any counting, the room is the
language model. Most people complete "the hen sleeps in the" with "barn",
because they know that hens sleep in barns. A model that knows nothing but 22
sentences about the same farm says "hive": after "in the", its sentences
continued with "hive" twice and with "barn", "field" and "nest" once each.
People know something about the world, while the model only knows which word
followed which in its sentences.

**Key idea (frame 8).** A language model answers one question over and over:
how likely is each possible next word, given what came before?

## The training data

**The corpus (frame 10).** Every language model learns from a collection of
text, its corpus. Ours is small enough to read in full: 22 short sentences
about cows, sheep, hens, bees and a farmer. Everything the model writes later
comes from these sentences.

**Every sentence becomes tokens (frame 11).** The model first cuts each
sentence into tokens; here one token is one word, while real models cut text
into pieces that are often smaller than words. Every sentence also gets a
start token `<s>` and an end token `</s>`, so that the model can learn how
sentences begin and when they stop.

**How large is the corpus? (frames 12 to 14)** The corpus has 104 words,
counting every occurrence but not the start and end tokens, and 33 different
words, its vocabulary. GPT-3 was trained on about 300 billion tokens (Brown
et al., 2020), roughly three billion times our corpus, and current models on
several trillion.

## Counting pairs

**No context (frames 16 and 17).** The simplest model ignores everything that
came before and only knows how often each word occurs. Divided by 104, each
count becomes a probability: "the" occurs 31 times, so P(the) = 0.30. A model
that draws every word from this distribution alone writes the right words in
the right proportions but in no order, such as "the is the cow in the hen
the", and it never stops, because without context there is no end of a
sentence to predict.

**One word of context (frame 18).** A pair of words that follow each other is
a bigram. Counting the pairs answers a better question: which word comes
next, given the word that just came? "gives" is followed by "milk" and "wool"
once each, "eats" by "grass" twice and "grain" once, "is" by six different
words. As a formula this is a conditional probability, the count of the pair
divided by the count of all pairs that start with the same word:
P(grass | eats) = 2 / 3.

**The word cards are the model (frame 19).** Each word card is one pair of
the corpus: its small line names the word it follows, which is its bag, and
its large word is the word that followed. The bag "gives" holds one card
"milk" and one card "wool", the bag "eats" two cards "grass" and one "grain",
and the bag "the" 31 cards. Drawing blindly gives each word with exactly its
probability.

**Key idea (frame 20).** A bag of cards is a probability distribution you can
hold in your hand.

## Letting it write

**Writing is drawing, one word at a time (frames 22 to 27).** A language
model does not always take the most likely word, because then it would write
the same text every time. It samples: it draws the next word at random, each
word with its own probability, which is exactly what drawing a card from a
bag does. After the start token comes "the" in every sentence. From the bag
"the" the model draws "sheep", three of 31 cards; after "sheep" come "gives",
"eats" and "sleeps" with a third each, and it draws "gives"; after "gives" it
draws "milk"; after "milk" the sentence ends in two of three cases. The
result, "the sheep gives milk", is a new sentence: every pair in it comes
from the corpus, and it is false.

**What the bags write (frame 28).** The sentences fall into four kinds. Some
are copied from the corpus ("the hen lays eggs"), some are new and plausible
("the bee lives in the barn"), some are new, fluent and false ("the cow is
sweet"), and some run on ("the cow gives milk is green"), because after
"milk" the model no longer knows that "milk" ended a sentence.

**Temperature (frames 29 to 31).** Real language models have a setting called
temperature. Each probability is raised to the power of 1/T and the results
are divided by their sum. At 0.5 the frequent words gain and the rare ones
lose: P(cow | the) rises from 16 to 26 per cent and P(barn | the) falls from
3 to 1 per cent. At 2 the distribution flattens, rare words come up more
often, and the text becomes more varied and more often nonsense.

**Temperature 0 goes round in circles (frame 32).** At 0 the model always
takes the most frequent word: after "the" always "cow", after "in" always
"the", after "sleeps" always "in". After "cow" five words are tied, and when
the model lands on "sleeps", it goes round in a circle: "the cow sleeps in the
cow sleeps in the cow …". Real models at a low temperature show the same
tendency to repeat themselves.

## More context

**Two words of context (frame 34).** A trigram uses the two words before as
context. After "gives" come "milk" and "wool", after "cow gives" only "milk",
so the model can no longer write "the sheep gives milk". After "in the",
however, "hive", "barn", "field" and "nest" are all still possible: two words
do not say who is sleeping, and "the cow sleeps in the hive" remains possible.

**More context, more copying (frames 35 and 36).** With one word of context
about one written sentence in six is in the corpus word for word, with two
words about two in three. With 22 sentences most pairs of words have only one
continuation, so the model can hardly write anything new. The shares come
from 20,000 sentences written with the same counts.

**Key idea (frame 37).** More context makes the model more certain and more
correct, and at the same time it copies more of its training data.

## Where counting fails

**Fluent and false (frame 39).** "The sheep gives milk" consists only of
pairs that occur in the corpus: "the sheep" and "sheep gives" were counted in
"the sheep gives wool", "gives milk" in "the cow gives milk". The model finds
nothing wrong with the sentence, because it has never checked a fact; it only
knows which words follow which. When a real model writes a fluent, false
statement, this is called a hallucination.

**Zero means never counted (frame 40).** What never occurred in the corpus
has the probability 0. After "milks the" the model only knows the cow,
although sheep are milked, too: zero only means never counted. "dog" does not
occur at all, so the model cannot even begin a sentence about a dog; it would
need to know that a dog is similar to a cow and a sheep and borrow what it
knows about them.

**The table is almost empty (frames 41 and 42).** All counted pairs together
form a table with one row per word and one column per next word: 34 × 34 =
1,156 cells, with the start token as a row and the end token as a column. Only
72 cells are filled, and these 72 counts are all the model knows, its
parameters. With a vocabulary of 100,000 tokens the table would have 10¹⁰
cells for one word of context and 10¹⁵ for two, almost all of them zero,
while GPT-3 gets by with 175 billion parameters and a context of thousands of
tokens.

## Real language models

**The same question, a different answer (frame 44).** A real language model
also predicts the next token from what came before, also writes by drawing
with a temperature, and also has start and end tokens. It does not get the
distribution from a table of counts, though, but from a neural network. The
network places every token as a point in a space with hundreds of dimensions,
an embedding, in which similar tokens lie close together, so that what it
learned about cows can carry over to a dog it has rarely seen. Its context is
thousands of tokens, and its parameters are billions of numbers adjusted
during training.

**Closing (frame 45).** A table of counts stays almost empty, however much
text you put into it: more text fills more cells, but the empty ones grow much
faster, as the last step of the experiment shows with *Alice in Wonderland*.
That is why real models do not count but learn which words are alike, while
the question at the heart of them stays the one from the start: the next word,
answered as a distribution to draw from.
