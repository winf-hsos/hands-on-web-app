---
type: experiment
code: 4665
title: A map of meaning
summary: >-
  A model turns every text into a list of numbers, an embedding, which marks
  its place on a map where texts of similar meaning lie close together, and
  this lets a computer search for meaning instead of words.
objectives:
  intro: "In this experiment you draw a map of meaning by hand, compare it with the one a real model draws from the same cards and search it, and afterwards you can:"
  goals:
    - "explain what an embedding is: a text turned into a list of numbers that marks its place on a map of meaning"
    - "read the similarity of two texts as closeness on that map and as one number"
    - "search a collection by meaning and explain why it finds texts that share no word with the query"
    - "show with examples what such a map captures, the topic of a text, and what it misses, such as negation, word order and truth"
    - "name where embeddings are used: in search, in chatbots that look things up, in recommendations and inside every language model"
level: 1
duration: 90
topics: [language-models]
relations:
  see_also: [next-token-prediction, a-language-model-by-counting]
modules: [aai]
areas: [ai]
status: draft
updated: 2026-11-05
---

Type "cheap flights to Lisbon" into a search engine, and it shows you a page
about low-cost air travel to Portugal, although the two share hardly a word. A
shop suggests a book because it is "similar" to the last one you bought, and
a chatbot finds the right paragraph in a manual of three hundred pages. Behind
all three lies the same idea: a model turns every text into a list of numbers,
called an **embedding**, and these numbers mark the place of the text on a map
on which texts of similar meaning lie close together. In this experiment you
first draw such a map yourselves with paper cards, then you look at the map a
real model draws from the same cards, and finally you search it and find out
what it knows and what it does not.

## What you need

- The [24 cards](media/meaning-cards.pdf), printed on one A4 sheet and cut
  apart, one set per group.
- A large sheet of paper, A3 or a page of a flip chart, and a pen.
- This page: the model runs in your browser, so nothing needs to be
  installed. It loads about 50 MB the first time, so it is best loaded once at
  the start, for instance on the projector.

Work in groups of three or four.

## You first: a map by hand

Lay the 24 cards on the sheet so that cards with a similar meaning lie close
together and cards that have nothing in common lie far apart. There are no
rules and there is no right answer, but the group has to agree on every card.
When you are done, draw a line around each group of cards and give it a name.

1. Which cards were easy to place, and which did you argue about? Look in
   particular at cards 3 and 20, and at cards 8 and 12.
2. What made two cards close for you: the same words, the same topic, the same
   situation or something else?

Keep the sheet and take a photo of it, because you will compare it with the
model's map later.

> [!SOLUTION]
> Most groups end up with six groups: travel, health, food, animals, money and
> computers. Cards 3 and 20 share the word "bank", and cards 8 and 12 the word
> "python", but you put them into different groups, because the rest of the
> sentence tells you which bank and which python is meant. For you, close
> means close in meaning, not in letters.

## Step 1: from a place to numbers

Draw two lines across the middle of your sheet, one from left to right and
one from bottom to top, as on a chart, and mark both from −10 to 10. Now every
card has a place that you can write down as two numbers: how far to the right
it lies and how far up.

3. Write down the two numbers for four cards of your choice.

| | Card | Right | Up |
|---|---|---|---|
| First | | | |
| Second | | | |
| Third | | | |
| Fourth | | | |

4. Give another group only the two numbers of one card, not the card itself.
   Can they find the card on your sheet? Can they find it on their own?
5. Find two cards that you had to put close together although they differ in
   something important. What would you need to keep them apart?

> [!SOLUTION]
> On your sheet the other group finds the card at once, but on their own sheet
> they find at best something nearby, because their directions mean something
> else: numbers mean something only together with the map they come from. The
> same holds for models, whose numbers mean nothing to another model. To keep
> two close cards apart you need a third direction in which they differ, and
> for the next pair a fourth. Every further number is another direction in
> which texts can differ.

This is all an embedding is: a list of numbers that says where a text lies on
a map of meaning. Your map has two numbers per card because a sheet of paper
has two directions. The model you meet next uses 384 numbers for every text,
so its map has 384 directions, which nobody can draw, but the idea is the
same: similar meaning, close places.

## Step 2: the model's map

Load the model below. It reads the same 24 cards and turns each of them into
384 numbers, which takes a few seconds. Because 384 directions cannot be drawn,
the map shows their shadow on two: the two directions in which the cards
differ most, a method called principal component analysis. Point at a dot to
read its card.

```meaning-map
My train was cancelled and I missed the last connection.
The cat sleeps on the windowsill all afternoon.
The bank raised its interest rates.
I have had a sore throat since Monday.
Fry the onions until they turn golden brown.
My laptop restarts every time I open the browser.
We landed in Lisbon three hours late.
A python swallowed a whole rabbit.
My card was declined at the checkout.
The doctor told me to stay in bed for two days.
We ordered two pizzas and a large salad.
Python is a popular language for data analysis.
Don't forget your passport at the security check.
Our dog barks whenever the postman comes.
Prices in the supermarket have gone up again.
She broke her wrist when she fell off her bike.
Fresh bread from the bakery is still warm.
The Wi-Fi in the cafeteria keeps dropping.
The night bus to Berlin was completely full.
We watched the ducks from the bank of the river.
She puts a little aside every month for later.
You should drink more water when you have a fever.
This soup needs a little more salt.
He forgot his password and was locked out of his account.
```

6. Compare the model's map with your sheet. Which of your groups did the
   model form as well, and where does it disagree with you?

> [!SOLUTION]
> The four travel cards (1, 7, 13, 19) lie together on the model's map as on
> most sheets, joined by the declined card at the checkout (card 9). The two
> bank cards and the two python cards lie close to each other, unlike on your
> sheet, because the shared word pulls them together. Elsewhere the shadow
> mixes cards that are apart in the 384 numbers, which is the price of drawing
> 384 directions on two. Where the map and the similarity values in the search below disagree,
> believe the values: they are computed from all 384 numbers.

## Step 3: search by meaning

Type a query into the search next to the map. The model turns the query into
384 numbers as well, and the search lists the cards whose numbers are most
similar to those of the query; on the map the query appears as a star. Below
the list you see what a classic search for the same words would have found.

The **similarity** of two texts is one number between −1 and 1. Think of the
384 numbers of a text as an arrow from the centre of the map: 1 means that two
arrows point in exactly the same direction, and 0 that they have nothing to do
with each other. For this model, values from about 0.3 already mean that two
texts are clearly related; what counts is the order of the cards, not the
value itself.

7. Search for `I can't get home tonight`. Which card comes first, and what
   would a keyword search have found?
8. For three groups on your sheet, find a query that brings one of their cards
   to the top without using any word of that card. Then compete with another
   group: who finds the query for which a keyword search and the search by
   meaning disagree most?
9. Search for `money`, `river` and `snake`. Does the model keep the two bank
   cards and the two python cards apart?
10. Search for `a pet that purrs` and for `Ich bin krank`. What did you expect,
    and what happened?

> [!SOLUTION]
> `I can't get home tonight` brings card 1 to the top (0.31), followed by the
> late landing in Lisbon (card 7), while a keyword search finds nothing,
> because no card contains one of its words. The bank and python cards lie
> close together on the map, because the shared word pulls them towards each
> other, yet the search keeps them apart: `river` finds card 20 with 0.49 and
> card 3 only with 0.20, `snake` card 8 with 0.46 and card 12 with 0.24. The
> numbers of a word depend on the sentence around it, and this is what makes
> these embeddings of whole texts more than a dictionary. `a pet that purrs`
> finds the python (0.44) and the dog (0.40) but not the cat, so the model
> knows that pets are animals but apparently not which animal purrs. `Ich bin
> krank` finds nothing at all, with every value below 0.1: this model has
> learned from English texts only, and it knows only what it has read.

### Where the numbers come from

Nobody chose the 384 directions of this model. It was trained on more than a
billion pairs of texts that belong together, such as a question and its
answer, two questions that ask the same thing, or the title and the abstract
of a paper. Training moved the numbers of texts that belong together closer
and the numbers of texts picked at random further apart, again and again,
until the map emerged. What a single direction means is written nowhere, and
most of them mean nothing a person could name. The idea behind it is old: in
1957 the linguist John Rupert Firth wrote that "you shall know a word by the
company it keeps", and in [[a-language-model-by-counting]] cow and sheep had
similar rows in the tables of counts for the same reason, because they stand
in similar places.

11. Look at the two directions of your own sheet. Would the model have chosen
    them, and could you name two of its directions on its map?

## Step 4: what the map does not know

In the demonstrator of Step 2, below the map and the search, you can compare
two texts of your own and get their similarity.

12. Compare `I love this film.` with `I do not love this film.`, and then with
    `What a wonderful movie!`. Which pair is more similar, and does it surprise
    you?
13. Compare `The dog bit the man.` with `The man bit the dog.`, and
    `Vaccines cause autism.` with `Vaccines do not cause autism.`.
14. Find two texts that mean the same and stay below 0.3, and two texts that
    mean the opposite and get above 0.8.

> [!SOLUTION]
> The sentence with "not" is closer (0.74) than the one with the same opinion
> in other words (0.59). The map answers the question "what is this text
> about?", and both of the first sentences are about loving this film, which
> one small word does not change. The dog and the man reach 0.97, and the two
> sentences about vaccines 0.86: who did what to whom, and whether a claim is
> true, hardly moves a text on the map. A search by meaning therefore finds
> texts on the right topic, including those that claim the opposite, and a
> chatbot that looks up its answers this way needs more than the map to tell
> true from false.

## Step 5: inside the numbers

In R you can look at the 384 numbers of every card yourself, computed by the
same model as on the map, and see that the search is nothing but one sum.

### The cards

The table `cards` holds the 24 cards with the numbers printed on them:

```r
cards
```

### A card as numbers

The table `vectors` holds the 384 numbers of every card, one row per number,
with the card in `card`, the position in `dim` and the number in `value`.
These are the first ten numbers of card 1:

```r
vectors |>
  filter(card == 1) |>
  head(10)
```

15. Can you see from these numbers that card 1 is about a train?

> [!SOLUTION]
> No, and nobody can. A single number means nothing on its own; the numbers
> mean something only in comparison with the numbers of other texts, just as
> the two numbers on your sheet meant something only on your own map.

### Similarity is one sum

To get the similarity of two cards, multiply their numbers position by
position and add up the 384 products. This model scales the numbers of every
text so that its arrow has the length 1, and then this sum is exactly the
similarity from the search. Here for cards 1 and 7:

```r
one <- vectors |> filter(card == 1)
seven <- vectors |> filter(card == 7)
sum(one$value * seven$value)
```

16. Compute the similarity of card 1 with card 19 and with card 5. What do
    the three values tell you?

> [!SOLUTION]
> Card 1 and the late landing (card 7) reach 0.32, card 1 and the night bus
> (card 19) 0.33, and
> card 1 and the onions (card 5) 0.04: two journeys are related, a journey and
> a recipe are not.

### The nearest cards

The same sum for all cards at once is a search engine by meaning. This box
puts the numbers of card 3 next to those of every card, adds up the products
for each card and sorts the result:

```r
three <- vectors |>
  filter(card == 3) |>
  select(dim, value_3 = value)

vectors |>
  left_join(three, by = "dim") |>
  group_by(card) |>
  summarize(similarity = sum(value * value_3)) |>
  arrange(desc(similarity)) |>
  left_join(cards, by = "card")
```

17. Which cards are nearest to card 3, and which are nearest to card 20?
    Change the box to find out.

> [!SOLUTION]
> Card 3 comes first with 1, because every card is most similar to itself.
> After it come the rising prices (card 15, 0.30) and, almost as close, the
> river bank (card 20, 0.30), then the declined card (card 9, 0.16). Nearest
> to card 20 are the python with the rabbit (0.31), which shares the animals,
> and card 3 (0.30), which shares the word. Compared card by card, the shared
> word still counts for a lot in such a small model.

## What real systems do with it

A search engine, a shop or the help desk of a university does the same as the
last box, with millions of texts instead of 24 and with special databases
that find the nearest numbers without adding up every sum. Chatbots that
answer from your documents turn your question into numbers first, look up the
most similar paragraphs and put them into the context of the language model,
which then writes its answer from them; this is called retrieval-augmented
generation. Recommendations, the detection of duplicate questions and the
sorting of feedback into topics all work with the same maps. And inside every
language model, the first thing that happens to each token is that it is
replaced by a list of numbers like these, with everything after that working
on numbers, as [[next-token-prediction]] describes.

## Extensions

### Arithmetic with meaning

The table `word_vectors` holds the numbers of 48 single words from the same
model, among them king, queen, man, woman, cities, countries and a few verbs.
Because the numbers are directions, you can compute with them: take king,
subtract man, add woman, and look for the word whose numbers are most similar
to the result, leaving out the three words you started with.

```r
word <- function(w) word_vectors |> filter(word == w) |> pull(value)
target <- word("king") - word("man") + word("woman")

word_vectors |>
  filter(!word %in% c("king", "man", "woman")) |>
  group_by(word) |>
  summarize(similarity = sum(value * target)) |>
  arrange(desc(similarity))
```

Then try `paris - france + germany`, `puppy - dog + cat` and
`walked - walk + swim`, and find one that fails. Which direction did the
subtraction remove in each case, and what did the addition put in?

### More to try

1. **Your sheet against the model:** measure with a ruler which three cards
   lie nearest to card 1 on your sheet, and compare them with the three
   nearest cards in R.
2. **Make the model fail:** find a query for which the first card is clearly
   wrong, and explain what the model latched onto instead.
3. **A question for a chatbot:** ask a chatbot something about a long
   document you give it, and ask it afterwards which paragraphs it used.
   Would a search by meaning have found the same paragraphs?

## Discussion

Write down your own answers first, then discuss them in your group.

1. Your map and the model's map differ. Which of the two is right, and what
   would it even mean for a map of meaning to be right?
2. A university builds a chatbot that answers questions by searching its
   regulations by meaning. After Step 4, what could go wrong, and how could
   you notice it?
3. A student says: "The model understands the cards, otherwise it would never
   have found card 1 for `I can't get home tonight`." How would you answer,
   based on what you saw in this experiment?
