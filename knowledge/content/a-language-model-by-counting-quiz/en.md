---
type: quiz
code: 5826
title: "Quiz: Word distributions"
summary: >-
  Ten questions on the experiment Word distributions, each answer with its
  reason. The questions come from the pool of the module and are in the format
  of its exam.
level: 2
duration: 15
topics: [language-models]
relations:
  checks: [a-language-model-by-counting]
modules: [aai]
areas: [ai]
questions: [wd-001, wd-002, wd-003, wd-004, wd-005, wd-006, wd-007, wd-008, wd-009, wd-010]
status: published
updated: 2026-11-19
---

## Why does every sentence in the experiment get a start token `<s>` and an end token `</s>`? {#wd-001}

- [x] So that the model learns how sentences begin and when they stop.
  > Correct: without `</s>` the model could never draw the end of a sentence and would write on forever.
- [ ] So that the corpus gets larger and the probabilities become more accurate.
  > The two tokens do not count towards the corpus size; they add no information about words.
- [ ] So that R can tell the sentences in the table apart.
  > That is what the column sentence_id is for; the two tokens are there for the model.
- [ ] So that punctuation such as the period is not counted as a word of its own.
  > The corpus has no punctuation; the tokens mark start and end, not characters.

## In the corpus, “eats” is followed twice by “grass” and once by “grain”, and by nothing else. What is P(grass | eats)? {#wd-002}

- [ ] 2/104, because the corpus has 104 words.
  > For a conditional probability you divide by the number of pairs that start with “eats”, not by the whole corpus.
- [ ] 1/2, because there are two different words after “eats”.
  > What counts are the occurrences, not the different words: grass comes twice as often as grain.
- [ ] 2, because “eats grass” occurs twice.
  > That is the count, not a probability; a probability lies between 0 and 1.
- [x] 2/3, that is count(eats, grass) divided by count(eats).
  > Correct: the bag “eats” holds two cards grass and one card grain.

## A model without context draws every word only by its frequency in the corpus. What does it write? {#wd-003}

- [ ] Sentences from the corpus, copied word for word.
  > Without context the model does not know which word follows which, so it cannot copy a sentence.
- [x] The words in the right proportions, but in no order and without end.
  > Correct: something like “the is the cow in the hen the”, and without context there is no end of a sentence to predict either.
- [ ] New, fluent sentences, which are sometimes false.
  > Fluent sentences need at least one word of context; without it the words do not fit together.
- [ ] Only the most frequent word, that is “the the the”.
  > It would write that only if it always took the most likely word; but it draws at random.

## Why does a language model not always take the most likely next word when writing, but draws it at random according to its probability? {#wd-004}

- [ ] Because it cannot compute the most likely word.
  > The model has all the probabilities; finding the most likely word would be easy.
- [ ] Because drawing makes the answers more true.
  > Drawing makes texts more varied, not more true; sentences that were drawn can be false too.
- [x] Otherwise it would write the same text every time and easily go round in circles.
  > Correct: at temperature 0 the model always takes the most frequent word and repeats itself, as in “the cow sleeps in the cow sleeps …”.
- [ ] Because drawing needs less computing time than finding the maximum.
  > The effort is negligible; the reason is the text that comes out.

## In the bag “the”, “cow” has a probability of 0.16 and “barn” 0.03. What happens at a temperature of 0.5? {#wd-005}

- [ ] All words become equally likely.
  > The distribution becomes flatter at a temperature above 1, and fully even only at a very high one.
- [ ] The rare words gain, and the text becomes more varied.
  > That happens at a temperature above 1, for instance at 2.
- [ ] All probabilities are halved.
  > Afterwards the sum must be 1 again; every probability is raised to the power of 1/T and normalized anew.
- [x] The frequent words gain, the rare ones lose.
  > Correct: cow rises to about 0.26 and barn falls to about 0.01; below 1 the distribution becomes peakier and the text more predictable.

## The model with one word of context writes “the milk is green”. Every pair of words in it occurs in the corpus. What does this show? {#wd-006}

- [x] The model only knows which words follow which and checks no facts.
  > Correct: this is how fluent, false sentences arise, called hallucinations in real models.
- [ ] The corpus contains a mistake that the model has taken over.
  > The corpus contains “the milk is white” and “the grass is green”, both correct; only the combination is false.
- [ ] The temperature was set too low.
  > Such a sentence can arise at a low temperature too; the cause is that the model only knows neighborhoods of words.
- [ ] The model copied the sentence word for word from the corpus.
  > The sentence is not in the corpus; it was newly put together.

## With one word of context, about one in six sentences written is in the corpus word for word, with two words about two in three. What follows? {#wd-007}

- [ ] With more context the model writes more new sentences.
  > It is the other way round: with more context most pairs of words have only one continuation, and the model copies.
- [x] More context makes the model more certain and more correct, and at the same time it copies more of its training data.
  > Correct: a real dilemma, because a model can thus reproduce texts that are protected or private.
- [ ] Two words of context are always worse than one.
  > Two words prevent many false sentences; the price is that the model copies more.
- [ ] The shares depend only on chance and change a lot with every run.
  > Measured over many sentences written, the shares are stable; they follow from the counts.

## In the corpus, “milks the” is followed only by “cow”, so P(sheep | milks the) = 0. What does this zero mean? {#wd-008}

- [ ] That sheep cannot be milked.
  > Sheep are milked; the zero says nothing about the world.
- [ ] That the word sheep is not in the vocabulary.
  > sheep is in the vocabulary; it just never follows “milks the”.
- [ ] That the model computed the probability wrongly.
  > The calculation is right: 0 of 1 continuations; the problem is the small corpus.
- [x] That this continuation was never counted in the corpus.
  > Correct: zero only means “never counted”, and what the model has not counted it cannot write.

## The table of all counted pairs of words has 34 × 34 = 1,156 cells, of which 72 are filled. Why can such a table not grow into a real language model? {#wd-009}

- [x] With every word of context the table grows by the factor of the vocabulary size, and almost all cells stay empty.
  > Correct: with 100,000 tokens there are 10¹⁰ and 10¹⁵ cells, however much text you count; that is why real models learn in a neural network which tokens are alike.
- [ ] Because computers do not have enough memory for 1,156 cells.
  > 1,156 cells are tiny; the problem starts with real vocabularies and longer context.
- [ ] Because probabilities in a table are not suitable for language.
  > For a tiny corpus they work, as the experiment shows; they just do not scale.
- [ ] Because real language models compute no probabilities for the next token at all.
  > They compute exactly these probabilities, only in a different way than by counting.

## What do the bags of word cards from the experiment and a large language model have in common, and where do they differ? {#wd-010}

- [ ] Both store a table of all pairs of words; the language model just has a larger one.
  > Such a table would stay almost empty; a language model stores learned numbers, not counts.
- [ ] They have nothing in common: the language model understands language, the bags only count.
  > Both answer the same question about the next token and write word by word.
- [x] Both give P(next | context) and draw from it; but the language model computes it with a neural network instead of by counting.
  > Correct: the question and the writing are the same, the how is completely different.
- [ ] Both always take the most likely word; the language model just knows more words.
  > Both draw at random according to the probability, with a temperature as a setting.
