---
title: Guess one card out of 32
summary: >-
  Guess a card from a 32-card Skat deck with yes/no questions only, count the
  questions and find out along the way why halving questions win on average
  and why one card out of 32 is worth exactly five bits.
objectives:
  intro: "In this experiment you guess one card out of 32 with yes/no questions only, count the questions, and afterwards you can:"
  goals:
    - "phrase a yes/no question that halves the remaining possibilities"
    - "show from your own counts that halving questions always reach the goal after five questions with 32 cards, while guessing takes much longer on average"
    - "explain why the number of halvings needed, `log₂(32) = 5`, measures the uncertainty in bits"
    - "use the expected value to argue why a question that can settle everything at once brings less information on average than a halving one"
    - "describe with a loaded game why frequent cases deserve short codes, like the \"e\" in Morse code"
translation_of: de
based_on: 2026-11-01
---

One person secretly draws a card, the other may only ask questions that can
be answered with yes or no. You count how many questions you need, and from
these counts comes a unit of measurement for information, the bit.

## What you need

- two people and a Skat deck of 32 cards: four suits (clubs, spades, hearts,
  diamonds) with eight ranks each (7, 8, 9, 10, jack, queen, king, ace)
- on your own or without cards, the program below, which draws a number from
  1 to 32 and answers your questions
- paper and pen, and a die for the optional round 3

## Setup

The drawing person shuffles, draws a card and keeps it hidden. The guessing
person asks questions, and the drawing person answers only with yes or no and
never says more. A round ends as soon as the guessing person knows the card
for certain; the question that confirms it does not count if the card was
already settled before. Swap roles after every round.

## Before: your expectation

Write down how many questions you think you need on average if you simply
guess cards, and how many at most if you ask cleverly.

## Round 1: guessing cards

For three rounds, ask only about single cards, so "Is it the queen of
hearts?", "Is it the seven of spades?" and so on, until you have the card.
Count the questions in each round.

## Round 2: halving

Now, for three rounds, ask only questions to which half of the remaining
possible cards give a yes and the other half a no. After every answer, note
how many cards are left, and count the questions.

> [!TIP]
> A good first question is "Is the card red?", because hearts and diamonds
> are exactly 16 of the 32 cards. For every further question, consider before
> asking it whether it really hits half of the remaining cards.

## Round 3 (optional): a loaded game

The drawing person rolls the die out of sight. On 1, 2 or 3 they take the
jack of clubs, otherwise they draw a card from the other 31. The guessing
person knows this rule. Play three rounds and think beforehand about which
first question pays off now.

## Playing on your own

This program draws a number from 1 to 32 that stands for a card and answers
two kinds of question: `> 16` means "Is it greater than 16?", `= 7` means "Is
it exactly 7?". After every answer it shows how many numbers are still
possible, and it stops as soon as only one is left.

```python
import random

secret = random.randint(1, 32)
possible = list(range(1, 33))
questions = 0

print("Find a number from 1 to 32.")
print("Ask with > 16 (greater than 16?) or = 7 (exactly 7?).")

while len(possible) > 1:
    question = input("Question: ").replace(" ", "")
    number = int(question[1:])
    if question[0] == ">":
        answer = secret > number
        possible = [n for n in possible if (n > number) == answer]
    else:
        answer = secret == number
        possible = [n for n in possible if (n == number) == answer]
    questions += 1
    print(question, "yes" if answer else "no", "· still", len(possible), "possible")

print("It is", possible[0], "after", questions, "questions.")
```

## Measurement table

| Round | Card | Questions | Cards left after each answer |
|---|---|---|---|
| guessing, 1 | | | |
| guessing, 2 | | | |
| guessing, 3 | | | |
| halving, 1 | | | |
| halving, 2 | | | |
| halving, 3 | | | |
| loaded, 1 | | | |
| loaded, 2 | | | |
| loaded, 3 | | | |

## What a question is worth on average

An answer that rules out one of two equally likely possibilities is worth one
**bit**. In general, an answer with probability `p` is worth `log₂(1/p)`
bits: the rarer it is, the more it carries. You get the average of a question
by multiplying, for every possible answer, its probability by its worth and
adding everything up. The program works this out for a halving question and
for "Is it the ace of spades?".

```python
from math import log2

def worth(p):
    return p * log2(1 / p)

print("halving:       ", round(worth(1/2) + worth(1/2), 2), "bits")
print("ace of spades?:", round(worth(1/32) + worth(31/32), 2), "bits")
```

## Evaluation

- How many questions did you need on average when guessing cards, and how
  many when halving? How far off were your expectations?
- Did halving manage with five questions every time? Why five, and what does
  this number have to do with 32, 16, 8, 4, 2, 1?
- Was there a round in which guessing was faster? Why does halving win all
  the same, although you cannot choose which answer you get?
- What does the question "Is it the ace of spades?" bring on average, compared
  with a halving question, and when at the end of a round is it the right one
  anyway?
- Which first question pays off in the loaded game, and how many questions
  did you need there on average? What follows from this for a code in which
  some characters are much more frequent than others?

Morse code uses exactly what the loaded game shows: the "e", the most frequent
letter, gets the shortest sign, a single dot, while rare letters like the "q"
get long ones ([[morse-code]]). What a bit is exactly is described under the
term [[bit]], and how many bits a symbol from your own colour alphabet carries
is shown in the slides [[symbols-and-information-slides]].

> [!NOTE]
> With a whole group, the lecturer secretly draws a card and the group may
> only ask yes/no questions. The group guesses freely at first, and only once
> the first counts are on the board does the halving question come in.
