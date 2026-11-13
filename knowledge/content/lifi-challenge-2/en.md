---
title: "Challenge 2: The word"
summary: >-
  Transmit short sentences of three words without errors and as fast as possible, with your own codebook and a rhythm that your code keeps by itself.
objectives:
  intro: "With this challenge you transmit text and can then:"
  goals:
    - "define a codebook from characters to sequences of your colours and work out how long the codewords have to be"
    - "keep sender and receiver in step with a fixed symbol rate, without a shared clock"
    - "explain why a transmission fails beyond a certain symbol rate"
translation_of: de
based_on: 2026-11-13
---

With an alphabet of colours you can send words as soon as two things are
settled: which sequence of colours stands for which character, and when the
receiver looks. The first is a codebook, the second a shared rhythm.

**Goal:** Transmit short sentences of three words without errors and as fast
as possible. In every run the course server sends a new sentence of real
words, written in the capital letters A to Z with a space between the words.

**What is new** is that from now on no test script says when the next colour
comes. `run_test` only makes sender and receiver start together; after that
your own code keeps the rhythm, and how you manage that is your decision. The
test also moves up one level: it hands text to the sender and expects text
back from the receiver, and your functions from challenge 1 that send and
recognise one colour are from now on called only by your own code. That is
exactly what an abstraction layer is: from above you see text, from inside you
see colours.

**Three tasks:** first you define the codebook, then you get the transmission
running slowly, and finally you raise the speed until it breaks. Each task has
hints to unfold; a sample solution comes at the earliest after the
competition.

## One file for everything

You work in exactly one file again, `word.py`, whether with one laptop or with
two. It has the same form as `alphabet.py` from challenge 1, and you bring
along what you built there.

| Part | What goes in |
|---|---|
| `COLORS` | your alphabet from challenge 1 |
| `GAIN`, `INTEGRATION_TIME` | the two settings of the sensor, as in challenge 1 |
| `calibrate(readings)` | your calibration from challenge 1 |
| `send_symbol(name)`, `receive_symbol()` | from challenge 1; from now on only your own code calls them |
| `CODEBOOK` | new: which sequence of colours stands for which character |
| `SYMBOL_RATE` | new: how many colours you send per second |
| `send_text(text)` | new: splits the text into colours with the codebook and sends them in rhythm |
| `receive_text(n_chars)` | new: receives that many characters and returns them as text |
| `run_test(...)` | the last line; it starts both sides together, and you do not change it |

<!-- The template word.py follows as soon as the LiFi agent has built it. -->

## Running the test

```text
python word.py
```

On a Mac the command is `python3`. If you work with two laptops, you start the
file on both, and the course server gives both a shared start time; on one
laptop the receiver runs alongside the sender. From the start your sender gets
the sentence through `send_text(text)`, and your receiver learns through
`receive_text(n_chars)` only how many characters are coming, never the
sentence itself.

A scored run is three sentences in a row without an error at the same symbol
rate. The result appears with every mistake in the terminal and in your
[[lifi-cockpit|team cockpit]].

## Task 1: The codebook

Decide which sequence of your colours stands for which character. Sender and
receiver read the same `CODEBOOK`, so it is written only once in the file.

**File:** `word.py`, the codebook `CODEBOOK`

> [!HINT]
> With *k* colours and *n* places you can tell *k*ⁿ codewords apart ([[place-value-systems]]). For 26 letters and the space, four colours need three places, because 4³ = 64; with two colours you need five, because 2⁵ = 32.

> [!HINT]
> If all codewords have the same length, the receiver knows where a character ends without any separator.

## Task 2: Get it running slowly

`send_text(text)` splits the text into colours with your codebook and shows
them one after the other, each for `1 / SYMBOL_RATE` seconds.
`receive_text(n_chars)` measures in the same rhythm, turns every sequence of
colours back into a character and returns the text as soon as all characters
have arrived. Start slowly, with one colour per second, and do not stop until
three sentences in a row arrive without an error.

**File:** `word.py`, the functions `send_text` and `receive_text`, together
with `SYMBOL_RATE`

> [!HINT]
> You bring along your functions from challenge 1 that send one colour and recognise one. Only what lies above them is new: splitting text into colours and turning colours back into text.

> [!HINT]
> Work out how long one colour shines at your rate, and think about the moment within that time at which the receiver measures best.

> [!HINT]
> Both sides start together, but each has its own clock, and `time.sleep()` never waits exactly as long as asked. So work out for every colour when it begins, counted from the start, instead of stringing short pauses together whose small errors add up.

## Task 3: Raise the speed

Raise `SYMBOL_RATE` step by step and note at every step whether three
sentences still arrive without an error. Keep this series of measurements,
because you will need it again in challenge 3.

**File:** `word.py`, the value `SYMBOL_RATE`

> [!HINT]
> Only ever change one thing, either the rate or the size of the alphabet. If you change both at once, you will not know afterwards what caused the error.

> [!HINT]
> The pattern of errors gives away the cause: if everything slips from one point on, it is the rhythm; if single characters are wrong, the alphabet is too large for this rate.

## Acceptance and scoring

You run scored runs at your own place, with the boxes of sender and receiver
touching wall to wall. Nicolas comes round, looks at your setup and ticks off
passed runs. You pass with one scored run, that is three sentences in a row
without an error, at any symbol rate.

The [challenge board](https://lifi.hsos.uber.space/challenges) shows for every
team how many characters and how many bits per second it transmits. The
ranking goes by characters per second, and in a tie the team that reached the
value first comes first. In the competition the best teams show their run
live; there is no live change in challenge 2.

## Pitfalls and more

**Typical pitfalls:** what works at one colour per second falls apart at five,
because the two sides have no shared clock and every small delay adds up from
colour to colour. The receiver measures exactly during a change of colour, or
the codewords get longer than necessary.

**For the quick ones:** give frequent letters shorter codewords and make sure
they can still be read without ambiguity ([[prefix-trap]]).
