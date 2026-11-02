---
type: lesson
code: 3134
title: Symbols and information
summary: >-
  A symbol is a state that can be told apart and has been agreed on, and how
  much information it carries can be counted in halvings: with N equally
  likely possibilities it is log₂(N) bits.
objectives:
  intro: "This lesson shows where meaning comes from and how information can be measured, and afterwards you can:"
  goals:
    - "define a symbol as an agreed, distinguishable state and explain why a perfect transmission can still give nonsense"
    - "explain information as uncertainty removed and work out with `math.log2()` how many bits one of N equally likely possibilities carries"
    - "argue why a question that halves the field is worth one bit and a lopsided question on average much less"
    - "work out how much faster the same file travels with eight symbols instead of two, and why two symbols in groups are still enough for any message"
    - "explain why Morse code gives the frequent letter e the shortest code"
level: 1
duration: 25
topics: [representing-information, transferring-information]
modules: [dup]
relations:
  requires: [analog-and-digital]
  see_also: [symbols-and-information-slides, perfect-reception-perfect-nonsense, card-guessing, claude-shannon]
status: draft
updated: 2026-11-01
---

North Atlantic, 1942: radio traffic would give the convoy away, so the ships
keep radio silence and talk to each other anyway, with a lamp and a shutter in
front of it, short, short, short, long. The light itself knows nothing about
letters, and it means something only because both ships carry the same table.
This lesson is about the two halves of that situation: what turns a state into
a symbol, and how much a symbol can tell you.

## Distinguishable and agreed

A **symbol** is an agreed, distinguishable state, and both words carry weight.
Distinguishable is a question of physics and of the receiver: can it tell this
state apart from all the others, even with noise on the way? That question was
the subject of [[analog-and-digital]]. Agreed is a question of a different
kind, which no measurement can answer, since it asks what the state stands
for, and only the people on both ends can settle that.

The set of all symbols that sender and receiver have agreed on is their
**alphabet**. The 26 letters from A to Z are one alphabet, but four colours of
a lamp, two tones or a flag that is either raised or lowered are alphabets just
as well.

## Perfect reception, perfect nonsense

What happens when the agreement is missing is easy to show. Sender and
receiver each have a table that maps four colours to four letters, but they
did not write the tables together. Four colours arrive, every one of them
correctly:

![At the top: received blue green red yellow. Below, two tables side by side. The sender's table maps red, green, blue and yellow to A, E, S and T; the receiver's table maps them to T, A, E and S, drawn in red. At the bottom: meant SEAT, read EATS.](figure:two-tables "Both tables map colours to letters, but not the same way: four colours arrive without a single error, and the receiver reads a different word.")

The program decodes the same four colours with both tables:

```python
received = ["blue", "green", "red", "yellow"]   # every colour arrived correctly

sender_table = {"red": "A", "green": "E", "blue": "S", "yellow": "T"}
receiver_table = {"red": "T", "green": "A", "blue": "E", "yellow": "S"}

meant = ""
read = ""
for colour in received:
    meant += sender_table[colour]
    read += receiver_table[colour]

print("Meant:", meant)
print("Read: ", read)
```

There was no transmission error, no interference and no bad measurement, and
the message is still worthless. Worse, *SEAT* turned into *EATS*, another real
word, so nobody notices that anything went wrong. Change one entry in
`receiver_table` and run the program again: as long as the two tables differ,
the signal can be perfect and the meaning still wrong.

In code, the agreement is a dictionary like `sender_table`. It is never
transmitted; it has to sit on both sides beforehand, which makes it not data
but a promise. The experiment
[[perfect-reception-perfect-nonsense]] lets you run into the broken promise
yourself.

## Information is uncertainty removed

What a message is worth does not depend on its length but on how much
uncertainty it removes. Someone draws one card from a deck of 32, and you may
only ask questions that can be answered with yes or no. Ask well, for example
"is it red?", then "is it a heart?", and you are done after five questions:

![Six boxes in a row: 32, 16, 8, 4, 2 and 1, joined by arrows with a question mark above each. Above the row it says possibilities left, below it five questions, and each halves what is left. The last box, 1, has a yellow frame.](figure:halving "Every question halves what is left, so five questions are enough, and not by luck.")

That number of halvings is the measure, and its unit is the **[[bit]]**. With
*N* equally likely possibilities, the uncertainty is

    H = log₂(N) bits

The 32 cards are not the uncertainty but the space of possibilities; the
uncertainty is the 5. **Information** is then a difference, the uncertainty
before minus the uncertainty after, I = H₁ − H₂. A question that halves the
field lowers *H* by exactly 1, so its answer is worth one bit. Python
calculates the logarithm with `math.log2()`:

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

You can watch the halving at work. Think of a number from 1 to 32 and let the
program find it; answer each question with `y` or `n`:

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

## Not every answer is worth a bit

A lopsided question buys less. Ask "is it the ace of spades?" and you almost
always hear no, and that no removes almost nothing. A rare answer tells you a
lot, an expected answer tells you little, and since you cannot choose which one
you get, what counts is the average. The **expected value** of a question adds
up, over all its possible answers, how likely each answer is times what it
would be worth:

    E = Σ pᵢ · log₂(1 / pᵢ)

For a yes/no question that is two terms:

| Question | Chance of yes | Yes is worth | No is worth | On average |
|---|---|---|---|---|
| "is it red?" | 1/2 | 1 bit | 1 bit | 1 bit |
| "is it the ace of spades?" | 1/32 | 5 bits | 0.05 bits | 0.2 bits |

The function `worth()` puts the numbers in:

```python
import math

def worth(p_yes):
    p_no = 1 - p_yes
    return p_yes * math.log2(1 / p_yes) + p_no * math.log2(1 / p_no)

print(round(worth(1 / 2), 2))
print(round(worth(1 / 32), 2))
```

A whole bit goes only to the question that really splits the field in half,
which is why halving wins on average: it takes the largest guaranteed gain out
of every answer. The second row shows something else worth keeping: a question
whose outcome is nearly certain carries almost no information, however long
its answer, and compression rests on exactly that observation.

## What it means for an alphabet

The same calculation tells you what a symbol is worth. Each symbol from an
alphabet of *N* equally likely symbols carries log₂(N) bits, so two colours
carry one bit per symbol, four carry two and eight carry three. At the same
number of symbols per second, the same file is therefore through in a third of
the time with eight colours instead of two.

So why not use 256 colours? Because physics has a say: more symbols means
smaller distances between them, and beyond some point the noise eats the gain
again, as [[analog-and-digital]] and [[signal-and-noise]] show. That makes the size of an alphabet a
question for measurement rather than taste.

At the other end, two symbols are enough for any message at all; they only
need more room. Five flashes with two possibilities each give 2⁵ = 32
combinations, enough for a whole alphabet. What a large alphabet achieves per
symbol, two symbols achieve in a group, and that is why every computer gets
by with 0 and 1 ([[why-two-states]]): a small alphabet is not a dead end but
merely slower.

## When symbols are not equally likely

Everything above assumed that all symbols are equally likely. In real text they
are not, and [[morse-code]] makes use of that: the most frequent letter in
English, e, gets the shortest code, a single dot, t gets a single dash, and a
rare letter such as q takes four signals, `− − · −`.

The unequal treatment pays off because it shortens the average message: what
occurs often should cost little. A rare symbol carries more information than a
common one, so it may also take up more room. Codes of unequal length have a
price of their own, though, since the receiver has to find out where one code
word ends; Morse code uses pauses for that, and a prefix-free code gets by
without them.

## Takeaways

- A symbol is an agreed, distinguishable state: physics decides whether it can
  be told apart, and only an agreement decides what it means.
- The agreement, such as a dictionary of colours and letters, has to exist on
  both sides beforehand; if it differs, perfect reception gives perfect
  nonsense.
- Information is uncertainty removed, and with *N* equally likely
  possibilities the uncertainty is log₂(N) bits.
- A question that halves the field is worth one bit; a lopsided question is
  worth much less on average, even if it might settle everything.
- A symbol from *N* equally likely symbols carries log₂(N) bits, so larger
  alphabets are faster until noise sets the limit, and two symbols in groups
  are enough for any message.
- Frequent symbols deserve short codes, which is why Morse code gives the e a
  single dot.
