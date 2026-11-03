---
type: [lesson, slides]
code: 3134
formerly: [symbols-and-information-slides]
title: Symbols and information
summary: >-
  How distinguishable states become symbols through an agreement, how halving
  yes-or-no questions count information in bits, and what a bigger alphabet
  gains in bits per symbol and costs in safety.
objectives:
  intro: "Using a light link with several colours, this lesson shows you how light becomes a symbol and how much information it carries, and afterwards you can:"
  goals:
    - "explain why a symbol is an agreed and distinguishable state, and why an error-free transmission without a shared table still delivers nonsense"
    - "argue why halving yes-or-no questions always find one of 32 cards in five questions and on average deliver more information than a lopsided question"
    - "calculate the uncertainty with `H = log₂(N)` and the information of an answer with `I = H₁ − H₂`, both in bits, and check them with `math.log2()`"
    - "work out how many bits a symbol from N equally likely colours carries, how this changes the transmission time of a file, and why two symbols in groups are still enough for any message"
    - "explain why Morse code gives the frequent letter e the shortest code"
    - "weigh why more colours bring more bits per symbol but move closer together, so that only a measurement series can settle the size of your own alphabet"
deck_lang: en
level: 1
duration: 25
topics: [representing-information, transferring-information]
modules: [dup]
relations:
  requires: [analog-and-digital]
  see_also: [perfect-reception-perfect-nonsense, card-guessing, claude-shannon]
status: draft
updated: 2026-11-03
---

North Atlantic, 1942: radio traffic would give the convoy away, so the ships
keep radio silence and talk to each other anyway, with a lamp and a shutter in
front of it, short, short, short, long. The light itself knows nothing about
letters, and it means something only because both ships carry the same table.
This lesson is about the two halves of that situation: what turns a state into
a symbol, and how much a symbol can tell you. The running example is a link
that transmits data with light, where an LED sends colours and a sensor tells
them apart.

## Distinguishable and agreed

A **symbol** is an agreed, distinguishable state, and both words carry weight.
Distinguishable is a question of physics and of the receiver: can it tell this
state apart from all the others, even with noise on the way? That question was
the subject of [[analog-and-digital]]. Agreed is a question of a different
kind, which no measurement can answer, since it asks what the state stands
for, and only the people on both ends can settle that.

A raised thumb shows both halves. Nobody mistakes it for a fist or an open
hand, so it is easy to distinguish, but the thumb itself holds no meaning: in
much of Europe it says "good", in parts of West Africa and the Middle East it
is an insult, and someone from Germany who counts on their fingers raises the
thumb for "one", where someone from the United States raises the index finger.

The set of all symbols that sender and receiver have agreed on is their
**alphabet**. The 26 letters from A to Z are one alphabet, but four colours of
a lamp, two tones or a flag that is either raised or lowered are alphabets just
as well.

## Perfect reception, perfect nonsense

What happens when the agreement is missing is easy to show. The sender spells
*team* with four colours, red for t, green for e, blue for a and yellow for m,
and all four colours arrive without a single error. The receiver's table,
however, swaps red and yellow:

![At the top: received red green blue yellow. Below, two tables side by side. The sender's table maps red, green, blue and yellow to t, e, a and m; the receiver's table maps them to m, e, a and t, with the swapped m and t drawn in red. At the bottom: meant team, read meat.](figure:two-tables "Both tables map colours to letters, but not the same way: four colours arrive without a single error, and the receiver reads a different word.")

The program decodes the same four colours with both tables:

```python
received = ["red", "green", "blue", "yellow"]   # every colour arrived correctly

sender_table = {"red": "t", "green": "e", "blue": "a", "yellow": "m"}
receiver_table = {"red": "m", "green": "e", "blue": "a", "yellow": "t"}

meant = ""
read = ""
for colour in received:
    meant += sender_table[colour]
    read += receiver_table[colour]

print("Meant:", meant)
print("Read: ", read)
```

There was no transmission error, no interference and no bad measurement, and
the message is still wrong. Worse, *team* turned into *meat*, another real
word, so nobody notices that anything went wrong. Change one entry in
`receiver_table` and run the program again: as long as the two tables differ,
the signal can be perfect and the meaning still wrong.

In code, the agreement is a dictionary like `sender_table`. It is never
transmitted; it has to sit on both sides beforehand, which makes it not data
but a promise, and whoever changes it without telling the partner builds the
nonsense above. The same dictionary can just as well map colours to bit
strings, `{"red": "00", "green": "01", "blue": "10", "yellow": "11"}`, and how
many digits such a string needs is the subject of the next part. The
experiment [[perfect-reception-perfect-nonsense]] lets you run into the broken
promise yourself.

## The guessing game, measured

What a message is worth does not depend on its length but on how much
uncertainty it removes. Someone draws one card from a deck of 32, and you may
only ask questions that can be answered with yes or no. Ask well, for example
"is it red?", then "is it a heart?", and you are done after five questions:

![Six boxes in a row: 32, 16, 8, 4, 2 and 1, joined by arrows with a question mark above each. Above the row it says possibilities left, below it five questions, and each halves what is left. The last box, 1, has a yellow frame.](figure:halving "Every question halves what is left, so five questions are enough, and not by luck.")

That number of necessary halvings is the measure this part is about, and its
unit is the **[[bit]]**: a question that halves the field is worth one bit.
You can watch the halving at work: think of a number from 1 to 32 and let the program find it,
answering each question with `y` or `n`:

```python
low, high = 1, 32
questions = 0

while low < high:
    middle = (low + high) // 2
    answer = input(f"Is your number greater than {middle}? (y/n) ")
    questions += 1
    if answer == "y":
        low = middle + 1
    else:
        high = middle

print(f"Your number is {low}, found with {questions} questions.")
```

Whatever number you choose, the program needs exactly five questions, because
every answer removes half of what is left. The experiment [[card-guessing]]
plays the same game with real cards and compares it with guessing.

## Not every answer is worth the same

A lopsided question buys less. "Is it the ace of spades?" can settle
everything at once, but it does so in only one of 32 cases, and in the other
31 almost everything is still left. The halving question, on the other hand,
always delivers exactly one bit, whatever the answer. A rare answer tells
you a lot, an expected answer tells you little, and since you cannot choose
which one you get, what counts is the average:

| Question | Chance of yes | Yes is worth | No is worth | On average |
|---|---|---|---|---|
| "is it red?" | 1/2 | 1 bit | 1 bit | 1 bit |
| "is it the ace of spades?" | 1/32 | 5 bits | 0.05 bits | 0.2 bits |

In general, every possible answer contributes how likely it is, multiplied by
what it would be worth, and added up over all answers that is the **expected
value** of a question:

    E = Σ pᵢ · log₂(1 / pᵢ)

Here pᵢ is the probability of an answer and log₂(1 / pᵢ) is what that answer
is worth in bits: the less likely it is, the more it carries. For a yes-or-no question
that is two terms, and the function `worth()` puts the numbers in:

```python
import math

def worth(p_yes):
    p_no = 1 - p_yes
    return p_yes * math.log2(1 / p_yes) + p_no * math.log2(1 / p_no)

print(round(worth(1 / 2), 2))
print(round(worth(1 / 32), 2))
```

A whole bit goes only to the question that really splits the field in
half, which is why halving wins on average: it takes the largest guaranteed
gain out of every answer, and the lopsided question pays off only at the very
end, when just two possibilities are left. The second row also shows that a
question whose outcome is nearly certain carries almost no information,
however long its answer, and compression rests on exactly that observation.

## One bit, and two formulas

Put generally, a bit is the amount of information in a decision between two
equally likely possibilities. A light switch holds one
bit, and it needs no computer for that. With it, both quantities can be
written down. The **uncertainty** of *N* equally likely possibilities is

    H = log₂(N) bits

and measures how many halvings are still missing. **Information** is a
difference, the uncertainty before minus the uncertainty after,

    I = H₁ − H₂

and measures what an answer has actually removed. 32 cards mean an
uncertainty of 5 bits, and each halving question removes 1 bit; the 32 is the
space of possibilities, while the uncertainty is the 5. Python calculates the
logarithm with `math.log2()`:

```python
import math

for n in [2, 4, 32, 26]:
    print(n, "possibilities:", round(math.log2(n), 2), "bits")
```

Two possibilities give one bit, four give two and 32 give five. For 26 letters
the result is 4.7 bits, which is not a whole number of questions: a code made
of yes/no symbols needs five of them per letter, since four give only
2⁴ = 16 combinations and five give 32, the same *k*ⁿ as in
[[place-value-systems]].

## What a bigger alphabet buys

The same tool tells you what a symbol is worth. Each symbol from an alphabet
of *N* equally likely colours carries log₂(N) bits, so two colours carry one
bit per symbol, four carry two, eight carry three and sixteen carry four.
Because the same file then needs fewer symbols, it gets through sooner:

![A table with four rows for 2, 4, 8 and 16 colours. The second column gives the bits per symbol as log₂(2) = 1 up to log₂(16) = 4. The third column shows the time for the same file as a bar: 100 % for two colours, 50 % for four, 33 % for eight and 25 % for sixteen.](figure:alphabet-bits "The same file at the same symbol rate: only the alphabet changes, and with it the time the file needs.")

With four colours the file needs half the time it needs with two, with eight
a third and with sixteen a quarter, while the file and the symbol rate stay
the same.

At the other end, two symbols are enough for any message at all; they only
need more room. Five flashes with two possibilities each give 2⁵ = 32
combinations, enough for a whole alphabet. What a large alphabet achieves per
symbol, two symbols achieve in a group, and that is why every computer gets
by with 0 and 1 ([[why-two-states]]): a small alphabet is not a dead end but
merely slower.

## When symbols are not equally likely

Everything so far assumed that all symbols are equally likely. In real text
they are not, and [[morse-code]] makes use of that: the most frequent letter
in English, e, gets the shortest code, a single dot, t gets a single dash, and
a rare letter such as q takes four signals, `− − · −`.

The unequal treatment pays off because it shortens the average message: what
occurs often should cost little. A rare symbol carries more information than a
common one, so it may also take up more room. Codes of unequal length have a
price of their own, though, since the receiver has to find out where one code
word ends; Morse code uses pauses for that, and a prefix-free code gets by
without them.

## Your alphabet

So why not use 256 colours? More colours bring more bits per symbol, so the
same file needs fewer symbols and arrives sooner, but the colours also move
closer together, the noise reaches across the gap, and symbols are read
wrong, as [[analog-and-digital]] and [[signal-and-noise]] show. No formula
tells you where the limit lies, so the size of your alphabet is not a matter
of taste but the result of a measurement. [[lifi-challenge-1]] asks exactly
this, and four steps lead to the answer:

1. agree on your alphabet and write it down
2. measure a profile for every symbol
3. teach the receiver to recognise every symbol
4. send 20 random symbols and count the errors

The first step is the one everyone wants to skip, and whoever keeps the
agreement only in their head builds the nonsense from the first part as soon
as two people work in parallel. Light means nothing until you agree what it
means, and how much it means, you can count.

## Takeaways

- A symbol is an agreed, distinguishable state: physics decides whether it can
  be told apart, and only an agreement decides what it means.
- The agreement, such as a dictionary of colours and letters, has to exist on
  both sides beforehand; if it differs, perfect reception gives perfect
  nonsense.
- A question that halves the field is worth one bit; a lopsided question is
  worth much less on average, even if it might settle everything.
- With *N* equally likely possibilities the uncertainty is H = log₂(N) bits,
  and the information of an answer is I = H₁ − H₂.
- A symbol from *N* equally likely symbols carries log₂(N) bits, so larger
  alphabets are faster, and two symbols in groups are enough for any message.
- Frequent symbols deserve short codes, which is why Morse code gives the e a
  single dot.
- More colours move closer together, so only a measurement series settles the
  size of your own alphabet.
