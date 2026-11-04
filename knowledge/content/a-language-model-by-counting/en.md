---
type: experiment
code: 4417
title: A language model by counting
summary: >-
  Build a tiny language model from twenty sentences with nothing but counting
  and dividing, let it predict the next word with no context, one word or two
  words of context, and let it write sentences of its own by rolling a
  weighted die.
objectives:
  intro: "In this experiment you train a language model by hand and in R, and afterwards you can:"
  goals:
    - "explain what a corpus, a token and a vocabulary are and determine corpus size and vocabulary of a small corpus"
    - "compute the probability of a word without context and the conditional probability of the next word after one or two words of context"
    - "explain why more context narrows the distribution of the next word and makes the model more confident"
    - "generate text by sampling from a distribution and explain why the same model writes different sentences"
    - "say where counting breaks down and why real language models use neural networks instead of tables"
level: 1
duration: 90
topics: [language-models]
relations:
  see_also: [next-token-prediction, the-bitter-lesson]
modules: [aai]
areas: [ai]
status: draft
updated: 2026-11-04
---

A language model answers one question over and over: given what came before,
how likely is each possible next word? Real models answer it with a neural
network trained on trillions of words, but the question itself is simple
enough to answer with a pencil. In this experiment you build a language model
from twenty short sentences by counting how often words and pairs of words
occur, and then you let it write. The model you build is not how ChatGPT
works inside, while the question it answers and the way it writes, one word
at a time drawn from a distribution, are exactly the same.

## What you need

- Paper and a pencil, and a calculator or the calculator app of your phone.
- This page: all R code runs here in the browser, so nothing needs to be
  installed. The training data can also be downloaded as
  [tiny_corpus.csv](/media/datasets/tiny_corpus.csv), one sentence per row.

Work in pairs. Do each step by hand first and check it with R afterwards,
because the point is to see that a computer does nothing more than you did.

## The training data

Every language model starts with training data, a collection of text it
learns from, called the **corpus**. Ours has twenty sentences, so that you can
read all of it:

```r
corpus
```

1. Write down every different word that occurs in the corpus. This set is the
   **vocabulary** of the model. How many words does it have?
2. Count all words in the corpus, counting every occurrence. This is the
   **corpus size**, measured in **tokens**. Real language models split text
   into pieces smaller than words, but here one token is one word.
3. Look up how many tokens GPT-3 was trained on and compare it with our
   corpus.

| | Your result |
|---|---|
| Vocabulary (different words) | |
| Corpus size (tokens) | |
| Tokens of GPT-3 | |

The first thing a model does with its corpus is to cut each sentence into
tokens. R splits at the spaces:

```r
strsplit("the cat sits on the mat", " ")
```

For the whole corpus this is done already: the table `tokens` holds one row
per token, with the number of its sentence and its position in it.

```r
tokens
```

R counts the tokens and the different words in one line:

```r
tokens |>
  summarize(tokens = n(), vocabulary = n_distinct(word))
```

> [!SOLUTION]
> The vocabulary has 24 words and the corpus 96 tokens. GPT-3 was trained on
> about 300 billion tokens (Brown et al., 2020), which is roughly three
> billion times our corpus, and current models are trained on several
> trillion.

## Step 1: no context

The simplest model ignores everything that came before and only knows how
often each word occurs. Such a single word is called a **unigram**.

4. Count how often each word occurs in the corpus.
5. Divide each count by the corpus size. What do these numbers mean, and what
   must they add up to?

| Word | Count | Count ÷ 96 |
|---|---|---|
| the | | |
| cat | | |
| dog | | |
| is | | |
| on | | |
| mat | | |
| fish | | |
| bone | | |
| sits | | |
| eats | | |
| drinks | | |
| sleeps | | |
| likes | | |
| milk | | |
| water | | |
| floor | | |
| hard | | |
| cold | | |
| hates | | |
| chases | | |
| soft | | |
| fresh | | |
| small | | |
| big | | |

R counts the words with `count()`:

```r
tokens |>
  count(word, sort = TRUE)
```

Dividing every count by the sum of all counts turns it into a probability:

```r
tokens |>
  count(word, sort = TRUE) |>
  mutate(p = n / sum(n))
```

The same distribution as a bar chart:

```r
tokens |>
  count(word) |>
  mutate(p = n / sum(n)) |>
  ggplot() +
  aes(x = p, y = reorder(word, p)) +
  geom_col()
```

6. Which word has by far the highest probability? What text would a model
   write that draws every word from this distribution alone?

> [!SOLUTION]
> "the" occurs 32 times, so P(the) = 32/96 = 0.33; "cat", "dog" and "is" each
> occur 8 times, P = 0.08. Each value is the probability of picking that word
> when you point at a random place in the corpus, and all of them add up to 1.
> A model without context writes something like "the is the cat on the dog
> the", with the right words in the right proportions, but in no order at
> all.

## Step 2: one word of context

A **bigram** is a pair of words that follow each other, such as (the, cat)
or (cat, sits). Counting the pairs answers a better question: which word
comes next, given the word that just came?

7. Write down all pairs of the first ten sentences, such as (the, cat),
   (cat, sits), (sits, on).
8. Count how often each pair occurs among them.
9. For the word "the", compute the probability of each next word: the count
   of the pair divided by the number of all pairs that start with "the".
   Do the probabilities add up to 1?

| Next word after "the" | Count | Probability |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |

Written as a formula, this is a **conditional probability**:

P(next word | the) = count(the, next word) ÷ count(the, any word)

In R, `lead()` puts the next word of the same sentence beside each word, and
the pairs are counted for the whole corpus:

```r
tokens |>
  group_by(sentence_id) |>
  mutate(next_word = lead(word)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  count(word, next_word, sort = TRUE)
```

Dividing each count by the number of pairs with the same first word gives the
distribution of the next word for every word. The last line shows the one
for "the":

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
  filter(word == "the")
```

10. Change "the" to "cat" in the last line. How many next words does "cat"
    have, and how is the probability spread across them? Why are there fewer
    pairs starting with "cat" than there are cats in the corpus?

All distributions together form a table with one row per word and one column
per next word. The chart shows only the pairs that occur:

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

11. Most of the table is empty. What does that tell you about language, and
    how large would the table be for a vocabulary of 50,000 words?

> [!SOLUTION]
> In the first ten sentences, 20 pairs start with "the": cat 5 (0.25),
> dog 5 (0.25), mat 3 (0.15), fish 2 (0.10), bone 2 (0.10), and milk, water
> and floor 1 each (0.05); together they make 1. In the whole corpus, "cat"
> has seven next words, each with 1/7 = 0.14: it occurs eight times, but in
> "the dog chases the cat" nothing follows it. Of the 18 × 24 = 432 cells of
> the table only 42 are filled, because most words never follow each other.
> For 50,000 words the table would have 2.5 billion cells, almost all of them
> zero.

## Step 3: two words of context

A **trigram** uses the two words before as context: P(next | word₁, word₂).
The code is the same, with a second `lead()` for the word after next:

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
  filter(word == "cat", word2 == "eats")
```

12. What is the probability that "the" follows "cat eats"? Is that
    surprising?
13. Change the last line to the context "eats the". Which words can follow,
    and why is there still uncertainty with two words of context?

The demonstrator below has learned the same corpus. Build the sentence "the
cat eats the" by tapping the words, then switch the context between no word,
one word and two words and watch the distribution of the next word.

```next-word
```

14. Compare P(? | the), P(? | cat), P(? | cat eats) and P(? | eats the).
    How does the shape of the distribution change as the context grows?
    Write one sentence that captures the general principle.

> [!SOLUTION]
> After "cat eats" the next word is "the" with probability 1, which is no
> surprise, because in this corpus every verb except "is" is followed by "the"
> or "on".
> After "eats the" come "fish" and "bone" with 0.5 each: the two words of
> context no longer say whether a cat or a dog is eating, and only three
> words would. The more context the model sees, the fewer next words remain
> possible, so the distribution becomes narrower and the model more certain.

## Step 4: let it write

A language model does not always take the most likely word, because then it
would write the same text every time. It **samples**: it draws the next word
at random, but each word with its own probability, like a loaded die.

15. Write a sentence by hand with your bigram model. Start with "the", take a
    random number between 0 and 1 and go through the next words in order,
    adding up their probabilities until the sum exceeds your number. With
    P(cat | the) = 0.25 and P(dog | the) = 0.25, a number below 0.25 gives
    "cat" and one from 0.25 to 0.50 gives "dog". Repeat for five or six words.

R draws with `sample()`, which takes the probabilities as weights:

```r
sample(c("cat", "dog", "mat", "fish", "bone", "milk", "water", "floor"),
       size = 1,
       prob = c(8, 8, 4, 3, 3, 2, 2, 2) / 32)
```

The model writes a whole sentence by drawing the next word for the word it
just wrote, again and again, until a word has no next word or the sentence
has seven words:

```r
bigrams <- tokens |>
  group_by(sentence_id) |>
  mutate(next_word = lead(word)) |>
  ungroup() |>
  filter(!is.na(next_word)) |>
  count(word, next_word) |>
  group_by(word) |>
  mutate(p = n / sum(n)) |>
  ungroup()

current <- "the"
sentence <- current
for (i in 1:6) {
  candidates <- bigrams |> filter(word == current)
  if (nrow(candidates) == 0) break
  current <- sample(candidates$next_word, size = 1, prob = candidates$p)
  sentence <- c(sentence, current)
}
paste(sentence, collapse = " ")
```

16. Run the box several times. Do some sentences run in circles, such as
    "the cat sits on the mat is cold"? Why does that happen?
17. In the demonstrator, start a new sentence and press "Roll" again and
    again, once with one word and once with two words of context. Which
    sentences are more coherent, and why?

> [!SOLUTION]
> The bigram model sees only the last word, so after "the mat" it does not
> know that the sentence was about a cat sitting on it, and "mat is cold" is
> as likely as the end of any other sentence. With two words of context the
> sentences stick closer to the corpus, because each step must fit two words
> instead of one. The price is that the model can hardly write anything new:
> with twenty sentences, most pairs of words have only one continuation.

## Extensions

1. **Your own corpus:** replace the sentences in the demonstrator with twenty
   sentences of your own, for example about a farm with "the cow stands in
   the barn", press "Train" and let it write.
2. **An unseen combination:** add a word the corpus does not know, such as
   "the horse", and try to continue it. What does the model say, and what
   would it need to say something sensible?
3. **The size of a real table:** a current language model has a vocabulary
   of about 100,000 tokens. How many entries would a table of all trigrams
   have, and how much memory would it take at four bytes per entry?
4. **More context in R:** extend the trigram code to three words of context
   with `lead(word, 3)` and check whether "cat eats the" now leads only to
   "fish".

## Discussion

Write down your own answers first, then discuss them in your group.

1. You built a language model from nothing but counting and dividing. What
   does it have in common with the model behind ChatGPT, and where do the two
   differ?
2. Where does counting break down? Think of a combination of words that never
   occurred in the corpus, and of what a model would need in order to handle
   it anyway.
3. The model has never understood a single sentence, yet its sentences have
   some order. Where does that order come from?
4. Someone says that ChatGPT understands language, knows things and has
   opinions. How would you answer, based on this experiment?

How a real model writes token by token, what its context is and what the
transformer adds to counting is explained in [[next-token-prediction]].
