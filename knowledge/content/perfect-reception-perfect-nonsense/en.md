---
title: Perfect reception, perfect nonsense
summary: >-
  Transmit four colours without a single error and still read the wrong word,
  because sender and receiver secretly use different tables, and see from it
  that meaning comes from an agreement and not from the signal.
objectives:
  intro: "In this experiment you transmit a word with four colours that all arrive correctly, and afterwards you can:"
  goals:
    - "show that an error-free transmission can produce the wrong word when the two mapping tables differ"
    - "argue why no measurement of the signal can uncover such an error"
    - "work out how many different tables there are for four colours and four letters, and how likely it is that two tables written independently agree"
    - "explain why a word that turns into another real word is more dangerous than obvious nonsense"
    - "write the agreement down as a dictionary in Python that sender and receiver must both have beforehand"
translation_of: de
based_on: 2026-11-01
---

You transmit a word made of four colours, and every colour arrives correctly.
Even so, the receiving side reads something other than what was sent, and the
question of why leads to one half of what makes a symbol: it has to be not
only distinguishable but also agreed.

## What you need

- two people, or one person on their own with four small slips of paper
- a device with an RGB LED and the sending program below, or instead four
  coloured cards or a screen that shows one colour large
- paper and pen for each person

## Setup

You work with four colours, **red, green, blue and yellow**, and with four
letters, **A, E, S and T**. They make short words such as *EAST*, *SEAT*,
*EATS*, *TEAS*, *SET* or *TEA*. A mapping table fixes which colour stands for
which letter.

With two people, sit so that the receiving person can see the LED or the
cards but cannot look at the sending person's paper.

## Before: your expectation

Write down how many different mapping tables there are for four colours and
four letters if each letter occurs exactly once, and how likely it is that two
people write the same table without talking to each other.

## Round 1: two tables without agreeing

Each person writes a table on their own that assigns one of the four letters
to each of the four colours, without talking to the other person and without
showing the table. The sending person chooses a word, translates it into
colours with **their** table and sends them one after another. The receiving
person writes down every colour they see and only afterwards translates the
sequence into letters with **their** table.

On your own, write the four letters on slips, shuffle them face down and put
one next to each colour: that is the receiving side's table, which you do not
know yet. Write your own table down openly, translate a word into colours,
note the colour sequence and only then turn the slips over to translate the
sequence back with them.

First compare only the colours: did all of them arrive the way they were
sent? Only then compare the words and reveal the two tables. Repeat the round
with a second word.

## The sending program

With the device, this program shows one colour after another, each until you
press Enter. Put the colour sequence of your word into `word`.

```python static
from lifi_hardware import led

COLOURS = {
    "red": (255, 0, 0),
    "green": (0, 255, 0),
    "blue": (0, 0, 255),
    "yellow": (255, 255, 0),
}

word = ["blue", "red", "green", "blue"]  # replace with the colours of your word

for name in word:
    led.set_color(*COLOURS[name])
    input(f"{name} is on, Enter for the next colour ")

led.set_color(0, 0, 0)
```

## Round 2: the agreement

Now agree openly on a common table and copy it twice so that each person has
a copy in front of them. Transmit a third word in the same way as in round 1.

> [!TIP]
> In round 1, also try a word that could turn into another real word. With
> the right two tables, *SEAT* becomes *EATS*, for example, and then nobody
> notices the error.

## Tables

| Colour | Sending side's table | Receiving side's table |
|---|---|---|
| Red | | |
| Green | | |
| Blue | | |
| Yellow | | |

## Measurement table

| Run | Word sent | Colours sent | Colours seen | Word read |
|---|---|---|---|---|
| Round 1, first word | | | | |
| Round 1, second word | | | | |
| Round 2, common table | | | | |

## The same colours, two tables

You can also replay the translation in the browser. The two dictionaries are
two tables that agree in no row, because every letter has moved on by one
colour on the receiving side. Run the program first with *EAST*, then with
*SEAT*, and afterwards change the tables to see what else arrives.

```python
sender_table = {"red": "A", "green": "E", "blue": "S", "yellow": "T"}
receiver_table = {"red": "T", "green": "A", "blue": "E", "yellow": "S"}

word = "EAST"
colour_of = {letter: colour for colour, letter in sender_table.items()}
colours = [colour_of[letter] for letter in word]
received = "".join(receiver_table[colour] for colour in colours)

print("sent:", word, colours)
print("read:", received)
```

## Evaluation

- How many colours arrived wrongly in round 1, and what went wrong then?
- Which measurement at the LED or the sensor could have found the error? How
  would you have noticed it at all without comparing the tables?
- How many tables are there for four colours and four letters, and how often
  could you expect two people to write the same one without agreeing? Does
  that match your expectation from before?
- Why is a word that turns into another real word worse than a word that
  obviously makes no sense?
- In the LiFi project this agreement is a dictionary in both of your programs
  and is never transmitted. What happens when one person changes it and does
  not tell the other?

That a
symbol is an agreed and distinguishable state is shown in the lesson
[[symbols-and-information]].

> [!NOTE]
> With a whole group, the lecturer prepares two tables that secretly differ
> and gives them to two volunteers, while everyone else only sees the four
> colour cards. Before the second table is revealed, the group guesses what
> caused the error. Online, the two hold their cards up to the camera.
