---
type: quiz
code: 3285
title: "Quiz: A map of meaning"
summary: >-
  Ten questions on the experiment A map of meaning, each answer with its
  reason. The questions come from the pool of the module and are in the format
  of its exam.
level: 2
duration: 15
topics: [language-models]
relations:
  checks: [a-map-of-meaning]
modules: [aai]
areas: [ai]
questions: [mm-001, mm-002, mm-003, mm-004, mm-005, mm-006, mm-007, mm-008, mm-009, mm-010]
status: published
updated: 2026-11-19
---

## What is an embedding? {#mm-001}

- [x] A list of numbers for the place of a text on a map on which things of similar meaning lie close together.
  > Correct: similar meaning means close places, with 384 numbers per text for the model in the experiment.
- [ ] A compressed copy of the text from which the text can be restored.
  > The text cannot be recovered from the numbers; they only say where it lies on the map.
- [ ] The list of the keywords that occur in a text.
  > A keyword search compares letters; an embedding also finds texts that share no word with the query.
- [ ] An ID number under which a text is stored in a database.
  > An ID number says nothing about meaning, while the numbers of an embedding can be compared.

## The model in the experiment gives dog and puppy a similarity of 0.81, dog and cat 0.66 and dog and car 0.48. What does this show? {#mm-002}

- [ ] Words with similar letters get similar numbers.
  > Then car would have to lie closer to cat than puppy does; the letters play no part on the map.
- [ ] The model has stored a dictionary of synonyms and looks words up in it.
  > Nobody gave the model synonyms; the closeness arose in training because the words are used in similar ways.
- [ ] A similarity below 0.5 means that two words are opposites.
  > Opposites such as hot and cold even lie fairly close together; below 0.5 only means less related.
- [x] The more similar the meaning, the closer the words lie on the map.
  > Correct: puppy and dog lie closest and a car furthest away, although car looks almost like cat.

## Why do hot and cold lie close together on the model's map (0.53), almost as close as hot and warm (0.68)? {#mm-003}

- [ ] The model made a mistake with these two words that will disappear with the next training.
  > It is no accident: almost all opposites lie close together on such maps, because they appear in the same contexts.
- [x] Opposites are used in the same places, such as for the weather, a drink or an oven, and the map captures what a word is about, hardly which way it points.
  > Correct: words with the same neighbors get similar numbers, and that is exactly true of opposites.
- [ ] Opposites always get a similarity close to −1, and 0.53 is only scaled differently in this model.
  > Negative values hardly ever occur with this model; opposite meaning does not mean opposite direction.
- [ ] Both words have three or four letters and are therefore cut into the same tokens.
  > hot and cold are two different tokens; the length of a word does not determine its numbers.

## The calculation king − man + woman gives queen with the model in the experiment. Why does this work? {#mm-004}

- [ ] The developers taught the model the rule that male words can be turned into female ones.
  > Nobody put these directions in; they formed by themselves during training.
- [ ] The model looks up in a table of word pairs which word goes with king and woman.
  > There is no such table; the result is the word whose numbers lie closest to the result of the calculation.
- [x] The subtraction removes one direction, here being a man, the addition puts another in its place, and the rest, being royal, stays.
  > Correct: because the numbers are directions, one can compute with them, position by position.
- [ ] The letters of man are removed from king and those of woman are appended.
  > The calculation uses the 384 numbers of the words, not their letters.

## The token bank gets different numbers in “The bank raised its interest rates.” than in “We watched the ducks from the bank of the river.” Why? {#mm-005}

- [ ] The model has an entry of its own in its table for every meaning of bank and picks the right one.
  > Both sentences start from the same entry in the table; only the processing in the sentence changes the numbers.
- [ ] The position in the sentence alone determines the numbers, and bank stands in different places in the two sentences.
  > The position plays a part, but what decides it are the neighbors: river or interest rates.
- [ ] The model draws slightly different numbers at random every time it is called.
  > An embedding model computes without chance; the same sentence always gets the same numbers.
- [x] In several rounds, every token looks at all the other tokens of the sentence and shifts its numbers towards those that matter for it.
  > Correct: this is attention, and so bank ends up somewhere else after river than after interest rates.

## How does the model in the experiment get from the numbers of its tokens to a single list for the whole text? {#mm-006}

- [x] After the adjusting, it takes the average of all lists, position by position, and scales the result to the length 1.
  > Correct: this one list of 384 numbers is the embedding of the text.
- [ ] It takes the numbers of the first token, because that one stands for the whole text.
  > This model takes all tokens; the start marker [CLS] only counts like every other token.
- [ ] It joins the lists of all tokens one after another, so that longer texts get longer lists.
  > Every text gets the same number of values, 384, otherwise texts of different lengths could not be compared.
- [ ] It counts how often each word occurs in the text and writes the counts into the list.
  > Word counts would be a keyword search; the embedding comes from the learned numbers of the tokens.

## The search for “I can't get home tonight” finds the card “My train was cancelled and I missed the last connection.” first, although the two share no word. How? {#mm-007}

- [ ] The search adds synonyms to the query and then looks for shared words.
  > No synonyms are added; a search for words would have found nothing at all for this query.
- [x] The query is also turned into 384 numbers, and the search lists the cards whose numbers are most similar to those of the query.
  > Correct: the search looks for closeness on the map, that is for meaning, not for letters.
- [ ] The model understands the situation and knows that a cancelled train does not get you home.
  > The model only compares numbers; that it checks no knowledge of the world shows, for instance, in negation, which it hardly notices.
- [ ] The card was added last and is therefore at the top.
  > The order comes from the similarity to the query alone, not from the order of the cards.

## What does the map of an embedding model like the one in the experiment hardly capture? (Several answers may be correct.) {#mm-008}

- [x] A negation: “I do not love this film.” lies close to “I love this film.”
  > Correct: both sentences are about loving this film, and one small word does not change the topic (0.74).
- [x] The word order: “The dog bit the man.” and “The man bit the dog.” are almost the same.
  > Correct: both sentences have the same tokens, and the average does not care about their order (0.97).
- [x] Whether a claim is true: “Vaccines cause autism.” and “Vaccines do not cause autism.” lie close together.
  > Correct: the map answers what a text is about, not whether it is true (0.86).
- [ ] The topic of a text, such as whether it is about travel or about cooking.
  > The topic is exactly what the map captures well: the travel cards lie together, the recipe far away.

## A chatbot is to answer questions from the documents of a university (retrieval-augmented generation). What part do embeddings play in this? {#mm-009}

- [x] They find the paragraphs most similar to the question, and these go into the context of the language model.
  > Correct: the question is turned into numbers, the search by meaning finds the paragraphs, and the language model writes the answer from them.
- [ ] The language model is retrained on the embeddings of the documents before it answers.
  > Nothing is retrained; the matching paragraphs are looked up for every question.
- [ ] The embeddings check whether the language model's answer is true.
  > The map hardly captures whether something is true; it also finds paragraphs that claim the opposite.
- [ ] The embeddings translate the answer into the language of the question at the end.
  > Translating is not their job; an embedding is a list of numbers, not a text.

## Where do the numbers of an embedding model come from? {#mm-010}

- [ ] Experts decided for each of the 384 directions what it means, such as animal, money or travel.
  > Nobody chose the directions; most of them mean nothing a person could name.
- [ ] They are computed from the letters of a word, each letter giving a fixed number.
  > Then car and cat would lie close together; in fact puppy lies much closer to cat.
- [x] They were learned: words in the same contexts get similar numbers, and texts that belong together move closer.
  > Correct: “you shall know a word by the company it keeps”, followed by training on more than a billion pairs of texts.
- [ ] They are assigned anew at random with every query.
  > Then similarities would be meaningless; the numbers are fixed after training.
