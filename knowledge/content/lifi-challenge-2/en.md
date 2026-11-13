---
title: "Challenge 2: The word"
summary: >-
  Transmit ten characters without errors and as fast as possible, with your own code table and a shared clock.
objectives:
  intro: "With this challenge you transmit words and can then:"
  goals:
    - "define a code table from letters to sequences of your symbols"
    - "keep sender and receiver in step with a fixed symbol rate"
    - "explain why a higher symbol rate fails without a shared clock"
translation_of: de
based_on: 2026-11-03
---

With an alphabet of colours you can send words as soon as two things are
settled: which sequence of colours stands for which letter, and when the
receiver looks. The first is a code table, the second a shared rhythm.

**Goal:** Send ten characters without errors and as fast as possible.

**What is new** is that from now on no test script says when the next symbol
comes: sender and receiver have to work in the same rhythm, and how they
manage that is your decision. The test also moves up one level. It hands you
text and expects text back, and your functions from challenge 1 that send and
recognise one symbol are from now on called only by your own code. That is
exactly what an abstraction layer is: from above you see text, from inside you
see symbols.

**Three tasks:** first you define the code table, then you get the
transmission running slowly, and finally you raise the speed until it breaks.
Each task has hints to unfold.

## Three files

Each side has its own file, and a third holds what both have to agree on:

| File | What goes in |
|---|---|
| `agreement.py` | your alphabet, `SYMBOL_RATE` (how many symbols you send per second) and the mapping from letters to symbols |
| `sender.py` | `calibrate()` shows your alphabet once, `send_text(text)` transmits a string |
| `receiver.py` | `calibrate()` learns what each symbol looks like, `receive_text(n_chars)` receives that many characters and returns them |

You start the test with `run_test.py` from the template; how exactly is
described there. The receiver only learns how many characters will come,
never the word itself.

## Task 1: The code table

Define which sequence of your symbols stands for which letter. Both sides have
to use the same table, which is why it stands in one place only.

**File:** `agreement.py`, the mapping from letters to symbols

> [!HINT]
> With *k* colours and *n* positions you tell *k*ⁿ code words apart ([[place-value-systems]]). Work out how many positions your alphabet size needs for 26 letters: with four colours three are enough, because 4³ = 64.

> [!HINT]
> If all code words have the same length, the receiver knows where a letter ends without a separator.

## Task 2: Get it running slowly

`send_text(text)` breaks the text into symbols with your code table and sends
them one after the other, and `receive_text(n_chars)` receives that many
characters and returns them as text. Start slowly, with one symbol per second,
and do not stop before a word arrives without an error.

**File:** `sender.py` and `receiver.py`, plus `SYMBOL_RATE` in `agreement.py`

> [!HINT]
> You take your functions from challenge 1 that send one symbol and recognise one along. Only what lies above them is new: breaking text into symbols and turning symbols back into text.

> [!HINT]
> Work out how long one symbol is on at your rate, and think about at which moment within that time the receiver had best measure.

## Task 3: Raise the speed

Raise the symbol rate step by step and note at each step whether the word
still arrives without errors. Keep this measurement series, because you will
need it again in challenge 3.

**File:** `agreement.py`, the value `SYMBOL_RATE`

> [!HINT]
> Only ever change one thing, either the rate or the size of the alphabet. Whoever adjusts both at once does not know afterwards which one caused the error.

> [!HINT]
> The pattern of errors gives away the cause: if too few characters arrive, it is the timing; if single characters are wrong, the alphabet is too large for this rate.

## The acceptance test

The acceptance test runs live in the session: your run appears on the
projector through the course server, and as in every run the word only comes
from the server at that moment, so you have not seen it before. What is
measured is first whether all ten characters are right, and only then the
duration. The ranking is on the
[challenge board](https://lifi.hsos.uber.space/challenges).

## Pitfalls and more

**Typical pitfalls:** what works at one symbol per second falls apart at five,
because the two sides share no clock. The receiver measures right during a
colour change or starts too late, or the code words get longer than necessary.

**For the quick ones:** give frequent letters shorter code words and make sure
they can still be read unambiguously.
