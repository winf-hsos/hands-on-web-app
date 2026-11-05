---
type: experiment
code: 4417
title: Word distributions
summary: >-
  Counting which word follows which in 22 sentences gives a probability
  distribution of the next word, and drawing from it one word at a time
  writes new text.
objectives:
  intro: "In this experiment you work out the basic idea behind a language model in a very simplified form, with word cards, by hand and in R, and afterwards you can:"
  goals:
    - "explain what a corpus, a token and a vocabulary are, and why every sentence gets a start and an end token"
    - "compute the probability of the next word after one or two words of context as a count divided by a count"
    - "generate text by sampling from a distribution, and explain what the temperature changes"
    - "show with examples why such a model writes false sentences that sound right, copies its training data and cannot handle what it never counted"
    - "estimate why a table of counts cannot grow into a real language model, and name what neural networks do instead"
level: 1
duration: 90
topics: [language-models]
relations:
  see_also: [next-token-prediction, the-bitter-lesson]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-05
---

A language model answers one question over and over: given what came before,
how likely is each possible next word? Real models answer it with a neural
network trained on trillions of words, but the question itself is simple
enough to answer with a pencil. In this experiment you answer it for 22 short
sentences about a farm by counting which words follow which, and then you let
these counts write. This is a deliberately simplified picture and not how
ChatGPT works inside, but the question it answers and the way it writes, one
word at a time drawn from a distribution, are the same, and so are several of
its problems.

## What you need

- The [word cards](media/word-cards.pdf), printed and cut, and an envelope or
  small bag for each of the larger piles. One set per group is enough.
- Paper, a pencil and a calculator or the calculator app of your phone.
- This page: all R code runs here in the browser, so nothing needs to be
  installed. The training data can also be downloaded as
  [farm_corpus.csv](/media/datasets/farm_corpus.csv), one sentence per row.

Work in groups of three or four. Do each step by hand first and check it with
R afterwards, because the point is to see that a computer does nothing more
than you did.

## You first: guess the next word

Before any counting, you are the language model. The sentences below are
about a farm, and you see them one word at a time. Before each word, agree
on a guess, type it and reveal. Only then does a counting model show its
guess, one that knows nothing but 22 sentences about the same farm and takes
the word that most often followed the last two words there, or the last word
alone where the two never occurred together.

```word-guess
the hen sleeps in the barn
the farmer sells the honey
the sheep is white
the cow gives milk in the barn
the farmer feeds the sheep
the dog sleeps in the barn
the bee makes honey in the garden
the farmer is tired
```

1. Where were you better than the counting model, and where was it better
   than you? What did you know that it could not know?
2. Which words were easy for both of you, and why?

> [!SOLUTION]
> Both guess "the" at the start and "the" after "in" or "sells", because
> these continuations are almost fixed in language. You win where knowledge
> of the world helps: hens sleep in barns, dogs exist, farmers get tired. The
> model guesses "hive" after "in the" because that is the most frequent
> continuation in its sentences, it has never seen "dog" and so has nothing
> to say, and it cannot guess "garden" or "tired", which are not in its
> corpus at all. Claude Shannon played this game letter by letter in 1951 to
> measure how predictable English is, and found that people guess far more
> letters right than chance would allow.

## The training data

Every language model starts with training data, a collection of text it
learns from, called the **corpus**. Ours has 22 sentences about a farm, so
that you can read all of it. In R they are the table `corpus`, and the same
sentences can be downloaded as [farm_corpus.csv](/media/datasets/farm_corpus.csv):

```r
corpus
```

The first thing the model does with its corpus is to cut each sentence into
**tokens**. Here one token is one word; real models split text into pieces
that are often smaller than words. Every sentence also gets two extra
tokens, `<s>` for its start and `</s>` for its end, so that the model can
learn how sentences begin and when they stop. The table `tokens` holds one
row per token:

```r
tokens
```

3. Count the words of the corpus, counting every occurrence but not `<s>` and
   `</s>`. This is the **corpus size**. How many different words are there?
   This set is the **vocabulary**.
4. Look up how many tokens GPT-3 was trained on and compare it with our
   corpus.

| | Your result |
|---|---|
| Corpus size (words) | |
| Vocabulary (different words) | |
| Tokens of GPT-3 | |

R counts both in one line, after leaving out the start and end tokens:

```r
tokens |>
  filter(word != "<s>", word != "</s>") |>
  summarize(words = n(), vocabulary = n_distinct(word))
```

> [!SOLUTION]
> The corpus has 104 words and a vocabulary of 33. GPT-3 was trained on about
> 300 billion tokens (Brown et al., 2020), roughly three billion times our
> corpus, and current models are trained on several trillion.

## Step 1: no context

The simplest model ignores everything that came before and only knows how
often each word occurs. Dividing each count by the corpus size turns it into
a probability:

```r
tokens |>
  filter(word != "<s>", word != "</s>") |>
  count(word, sort = TRUE) |>
  mutate(p = n / sum(n))
```

5. Which word has by far the highest probability? What would a model write
   that draws every word from this distribution alone, and how would it know
   when to stop?

> [!SOLUTION]
> "the" occurs 31 times, P(the) = 31/104 = 0.30, followed by "is" with 6.
> A model without context writes something like "the is the cow in the hen
> the", with the right words in the right proportions but in no order at
> all, and it never stops, because without context there is no end of a
> sentence to predict.

## Step 2: one word of context

A pair of words that follow each other, such as (cow, gives), is called a
**bigram**. Counting the pairs answers a better question: which word comes
next, given the word that just came?

6. Find every word that follows "gives", "eats" and "is" in the corpus, count
   each, and divide by the number of all pairs that start with that word.

| Pair | Count | Probability |
|---|---|---|
| gives → | | |
| gives → | | |
| eats → | | |
| eats → | | |
| is → (each word) | | |

Written as a formula, this is a **conditional probability**:

P(next word | gives) = count(gives, next word) ÷ count(gives, any word)

### The word cards are the model

The word cards hold exactly these counts. Each card is one pair of the
corpus: the small line names the word it follows, which is its bag, and the
large word is the word that followed. Sort the cards into their bags.

7. How many cards are in the bags "gives", "eats" and "the"? Compare with
   your table: what does drawing a card blindly from a bag give you?

> [!SOLUTION]
> "gives" is followed by milk and wool, once each, P = 1/2; "eats" by grass
> twice and grain once, P(grass | eats) = 2/3; "is" by six different words,
> 1/6 each. The bag "gives" holds one card "milk" and one card "wool", the bag
> "eats" two cards "grass" and one "grain", and the bag "the" 31 cards.
> Drawing blindly gives each word with exactly its probability: a bag of
> cards is a probability distribution you can hold in your hand.

### The pairs in R

In R, `lead()` puts the next token of the same sentence beside each token.
Dividing each count by the number of pairs with the same first word gives the
distribution of the next word for every word, and the last line picks the
one for "is":

```r
tokens |>
  group_by(sentence_id) |>
  mutate(next_word = lead(word)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  count(word, next_word) |>
  group_by(word) |>
  mutate(p = n / sum(n)) |>
  ungroup() |>
  filter(word == "is")
```

8. Change "is" to "cow" and then to "<s>". What follows "cow", and why can a
   sentence end after it?

> [!SOLUTION]
> "cow" is followed by gives, eats, sleeps, is and `</s>`, each with 1/5. The
> end token is there because "the farmer milks the cow" ends with "cow". After
> `<s>` comes "the" with probability 1, because every sentence of the corpus
> starts with it.

### The same model as a demonstrator

The demonstrator has counted the same corpus. Tap words to build a sentence
and watch the distribution of the next word change with the last word; the
bag above the bars holds the cards you sorted.

```next-word
```

## Step 3: let it write

A language model does not always take the most likely word, because then it
would write the same text every time. It **samples**: it draws the next word
at random, but each word with its own probability, which is exactly what
drawing a card from a bag does.

9. Write three sentences with your bags. Start with the bag "the", write down
   the word you draw, put the card back and draw from the bag of that word,
   until you draw "end of sentence". Which of your sentences are in the
   corpus, and which are new?

R draws with `sample()`, which takes the counts as weights, so a word with
two cards in the bag comes twice as often as one with one card:

```r
sample(c("grass", "grain"), size = 1, prob = c(2, 1))
```

The model writes a whole sentence by drawing the next word for the word it
just wrote, starting from `<s>`, until it draws `</s>`:

```r
pairs <- tokens |>
  group_by(sentence_id) |>
  mutate(next_word = lead(word)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  count(word, next_word)

current <- "<s>"
sentence <- c()
while (length(sentence) < 15) {
  bag <- pairs |> filter(word == current)
  current <- sample(bag$next_word, size = 1, prob = bag$n)
  if (current == "</s>") break
  sentence <- c(sentence, current)
}
paste(sentence, collapse = " ")
```

10. Run the box ten times and write down the sentences. Mark each one: copied
    from the corpus, new and true about a farm, or new and false.

In the demonstrator, "Roll" draws a card from the bag and shows which one,
and "To the end" keeps rolling until the model draws the end of the sentence.

> [!SOLUTION]
> Typical sentences are "the hen lays eggs" (copied), "the bee lives in the
> barn" (new, and plausible) and "the sheep gives milk", "the cow is sweet"
> or "the farmer milks the hen" (new, fluent and false). Some run on, such as
> "the farmer milks the cow eats grass", because after "cow" the model no
> longer knows that the cow was the object of the sentence.

## Step 4: turning the temperature

Real language models have a setting called **temperature** that changes how
adventurous they are. Each probability is raised to the power of 1/T and the
results are brought back to a sum of 1. The box shows it for the bag "the"
at a temperature of 0.5:

```r
temperature <- 0.5

tokens |>
  group_by(sentence_id) |>
  mutate(next_word = lead(word)) |>
  ungroup() |>
  filter(word == "the") |>
  count(next_word) |>
  mutate(
    p = n / sum(n),
    p_t = p^(1 / temperature) / sum(p^(1 / temperature))
  )
```

11. Compare `p` and `p_t`, then try a temperature of 2. What happens to
    frequent and to rare words?
12. In the demonstrator, set the temperature to 0 and press "To the end"
    several times with one word of context. What do you observe, and why can
    a model at temperature 0 get stuck?

> [!SOLUTION]
> Below 1 the frequent words gain and the rare ones lose: at 0.5,
> P(cow | the) rises from 0.16 to 0.26 and P(barn | the) falls from 0.03 to
> 0.01. Above 1 the distribution flattens and rare words come up more
> often, which makes the text more varied and more often nonsense. At 0 the
> model always takes the most frequent word: after "the" always "cow", after
> "in" always "the", so "the cow sleeps in the cow sleeps in the cow …" can
> go round in a circle until the demonstrator cuts it off. Real models at low
> temperature show the same tendency to repeat themselves.

## Step 5: two words of context

A **trigram** uses the two words before as context, P(next | word₁, word₂).
The code is the same, with a second `lead()` for the word after next, and the
last line asks what follows "cow gives":

```r
tokens |>
  group_by(sentence_id) |>
  mutate(word2 = lead(word), next_word = lead(word, 2)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  count(word, word2, next_word) |>
  group_by(word, word2) |>
  mutate(p = n / sum(n)) |>
  ungroup() |>
  filter(word == "cow", word2 == "gives")
```

13. Compare P(? | gives) with P(? | cow gives), and then P(? | the) with
    P(? | in the). Which false sentences from Step 3 can the model no longer
    write, and which can it still write?
14. In the demonstrator, switch to two words and roll ten sentences to the
    end. The line under the bars counts how many of them are copied word for
    word from the corpus. Compare it with one word of context.

> [!SOLUTION]
> After "cow gives" only "milk" remains, so "the sheep gives milk" is gone,
> and after "milks the" only "cow". But after "in the" come barn, field, nest
> and hive (twice), so "the cow sleeps in the hive" is still possible: two
> words do not say who is sleeping. With one word of context about one
> sentence in six is copied from the corpus, with two words about two in
> three. More context makes the model more certain and more correct, and at
> the same time it can hardly write anything new: with 22 sentences, most
> pairs of words have only one continuation.

## Step 6: where counting fails

The model has shown three weaknesses, and a fourth lies in the size of its
table. Real language models have all of them in a weaker form.

### It writes false sentences that sound right

"The sheep gives milk" consists of pairs that all occur in the corpus, so
the model finds nothing wrong with it. It has never checked a fact, it only
knows which words follow which. When a real model writes a fluent, false
statement, this is called a **hallucination**.

15. Find one sentence each that the model with one word of context writes and
    that is grammatical but false about a farm, and one that is
    ungrammatical.

### It copies its training data

The more context the model uses, the more of its sentences come straight out
of the corpus. The box writes 100 sentences with one word of context and
counts the share that is in the corpus word for word:

```r
pairs <- tokens |>
  group_by(sentence_id) |>
  mutate(next_word = lead(word)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  count(word, next_word)

write_sentence <- function() {
  current <- "<s>"
  sentence <- c()
  while (length(sentence) < 15) {
    bag <- pairs |> filter(word == current)
    current <- sample(bag$next_word, size = 1, prob = bag$n)
    if (current == "</s>") break
    sentence <- c(sentence, current)
  }
  paste(sentence, collapse = " ")
}

sentences <- replicate(100, write_sentence())
mean(sentences %in% corpus$sentence)
```

16. Why is copying a problem for a model that was trained on books, news and
    private texts?

### It knows nothing it has not counted

What never occurred in the corpus has the probability 0. After "milks the"
the model only knows the cow:

```r
tokens |>
  group_by(sentence_id) |>
  mutate(word2 = lead(word), next_word = lead(word, 2)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  count(word, word2, next_word) |>
  group_by(word, word2) |>
  mutate(p = n / sum(n)) |>
  ungroup() |>
  filter(word == "milks", word2 == "the")
```

17. Is it impossible to milk a sheep? What does the model say about "the
    dog", and what would it need in order to guess that a dog sleeps
    somewhere, as cows and sheep do?

### The table is almost empty

All counted pairs together form a table with one row per word and one column
per next word. The box counts how many of its cells are filled:

```r
tokens |>
  group_by(sentence_id) |>
  mutate(next_word = lead(word)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  summarize(
    filled = n_distinct(word, next_word),
    possible = n_distinct(word) * n_distinct(next_word)
  )
```

The chart shows the filled cells, each coloured by its probability:

```r
tokens |>
  group_by(sentence_id) |>
  mutate(next_word = lead(word)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  count(word, next_word) |>
  group_by(word) |>
  mutate(p = n / sum(n)) |>
  ungroup() |>
  ggplot() +
  aes(x = next_word, y = word, fill = p) +
  geom_tile() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
```

18. The counted numbers are all the model knows, its **parameters**. How many
    does our model have with one word of context? How many cells would the
    table have for a vocabulary of 100,000 tokens, with one and with two
    words of context? The demonstrator shows the numbers for both corpora
    under "How large is the table of the model?".

> [!SOLUTION]
> Grammatical and false: "the sheep gives milk", "the farmer milks the hen",
> "the cow is green". Ungrammatical: "the farmer milks the cow eats grass".
> The copy rate with one word of context is about 0.16, with two words about
> 0.66. Copying matters because a model can reproduce training text word for
> word, including what is protected by copyright or was meant to stay
> private. P(sheep | milks the) = 0, although sheep are milked: zero only
> means "never counted". "dog" does not occur at all, so the model cannot
> even start; it would need to know that a dog is similar to a cow and a
> sheep and borrow what it knows about them. Of the 34 × 34 = 1,156 cells
> only 72 are filled, and these 72 counts are the parameters. With 100,000
> tokens the table has 10 billion cells for one word of context and 10¹⁵ for
> two, almost all of them zero, while GPT-3 gets by with 175 billion
> parameters for a context of thousands of tokens.

## Step 7: a real book

The farm is tiny. In the demonstrator, choose "Alice in Wonderland", Lewis
Carroll's book from 1865 with about 27,000 words, and let the model write
with one and with two words of context.

19. How do the sentences compare with those about the farm? How large is the
    table now, and how many of its cells are filled?
20. With two words of context, take a few words of a generated sentence and
    search for them in the corpus field (Ctrl+F). How long are the stretches
    that come straight from the book?

> [!SOLUTION]
> With one word of context the sentences sound like Alice, with "said the
> king" and "the queen", but they make no sense beyond a few words. With two
> words they read better, and long stretches come word for word from the
> book. The vocabulary has about 2,600 words, so the table for one word of
> context has almost seven million cells, of which about 14,000 are filled,
> and the one for two words almost 18 billion, of which about 22,000 are
> filled: more text fills more cells, but the empty ones grow much faster.

## What real language models do differently

A real language model also predicts the next token from what came before, it
also writes by sampling with a temperature, and it also has start and end
tokens. Instead of a table of counts, it computes the distribution with a
neural network. The network places every token as a point in a space with
hundreds of dimensions, an **embedding**, in which similar tokens lie close
together, so that what it learned about cows can carry over to a dog it has
rarely seen. Its context is not two words but thousands of tokens, and its
parameters are not counts but numbers adjusted during training until its
predictions on trillions of tokens are as good as possible, as
[[next-token-prediction]] describes.

## Extensions

1. **Your own corpus:** replace the sentences in the demonstrator with twenty
   sentences of your own about a topic you choose, press "Train" and let it
   write. How many sentences do you need before it writes anything new?
2. **A false fact on purpose:** add "the cow gives wool" to the corpus. How
   often does the model now write it, and what does that say about training
   data with errors?
3. **Temperature in R:** add the temperature to the box that writes a
   sentence, with `prob = bag$n^(1 / temperature)`, and compare the sentences
   at 0.3, 1 and 2.
4. **Three words of context:** extend the trigram code with `lead(word, 3)`
   and compute the copy rate. What do you expect?

## Discussion

Write down your own answers first, then discuss them in your group.

1. Your bags predict the next word with nothing but counting and drawing.
   What do they have in common with the model behind ChatGPT, and where do
   the two differ?
2. The model never understood a single sentence, yet many of its sentences
   are correct. Where does that come from, and why are the false ones just as
   fluent?
3. More context made the model more correct and made it copy more. Is there a
   way out of this, and what would it need?
4. Someone says that ChatGPT understands language, knows things and has
   opinions. How would you answer, based on this experiment?
