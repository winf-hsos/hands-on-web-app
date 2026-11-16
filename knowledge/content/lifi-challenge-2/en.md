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
competition. You practise encoding and decoding on their own beforehand, with
two colours, four letters and no clock, in [[lifi-codebook-warmup]].

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
| `send_text(text)` | new: splits the text into colours with the codebook and sends them in rhythm, that is the encoding |
| `receive_text(n_chars)` | new: receives that many characters and returns them as text, that is the decoding |
| `run_test(...)` | the last line; it starts both sides together, and you do not change it |

Only the argument `codebook=` in the last line turns `run_test` into the test
of challenge 2. The course module can do that from version 0.9.1 on
([[lifi-hardware]]), and you fetch an older one anew with the same
`pip install` as at the installation. This is what the template looks like;
replace `COLORS`, the settings, `calibrate` and `receive_symbol` with your
version from `alphabet.py`, and wherever else it says `TODO`, your code is
missing:

```python static file=word.py
"""
Challenge 2: The Word
=====================

How fast can you get three sentences across without a single mistake?

This is your file from Challenge 1, one level up. COLORS, the sensor
settings, calibrate, send_symbol and receive_symbol stay as they were (copy
yours over from alphabet.py). New are the CODEBOOK, which says which colours
stand for which character, SYMBOL_RATE, and the two functions you write:
send_text turns a text into colours (encoding), receive_text turns colours
back into text (decoding). run_test at the bottom hands a sentence to
send_text and only the number of characters to receive_text, and compares
what arrives.

From the start on, the timing is yours: run_test starts both functions at
the same moment and then does not help any more.

Run it with:  python word.py   (on a Mac: python3)

For a quick test with your own text and both devices on one laptop, add
text="HELLO WORLD" to the last line; such a run never counts.
"""

import time

from lifi_hardware import receiver, run_test, sender

# Your alphabet from Challenge 1, one colour per line, each with a name
# TODO: copy your own COLORS over from alphabet.py
COLORS = {
    "off":     (0, 0, 0),
    "white":   (255, 255, 255),
    # "red":     (255, 0, 0),
    # "blue":    (0, 0, 255),
}

# The two settings of the receiving sensor, as in Challenge 1
GAIN = 16
INTEGRATION_TIME = 154

# How many colours you send per second. Start slowly and go up step by step.
SYMBOL_RATE = 2

# Which colours stand for which character. Every letter from A to Z and the
# space need an entry. With two colours, five of them make 32 combinations,
# enough for 27 characters. With more colours, fewer per character will do;
# that is the point of Challenge 2.
# TODO: make the CODEBOOK fit your own alphabet: use only the colour names
# from your COLORS, give every character its own sequence, and let more
# colours make the sequences shorter.
CODEBOOK = {
    " ": ["off",   "off",   "off",   "off",   "off"],
    "A": ["off",   "off",   "off",   "off",   "white"],
    "B": ["off",   "off",   "off",   "white", "off"],
    "C": ["off",   "off",   "off",   "white", "white"],
    "D": ["off",   "off",   "white", "off",   "off"],
    "E": ["off",   "off",   "white", "off",   "white"],
    "F": ["off",   "off",   "white", "white", "off"],
    "G": ["off",   "off",   "white", "white", "white"],
    "H": ["off",   "white", "off",   "off",   "off"],
    "I": ["off",   "white", "off",   "off",   "white"],
    "J": ["off",   "white", "off",   "white", "off"],
    "K": ["off",   "white", "off",   "white", "white"],
    "L": ["off",   "white", "white", "off",   "off"],
    "M": ["off",   "white", "white", "off",   "white"],
    "N": ["off",   "white", "white", "white", "off"],
    "O": ["off",   "white", "white", "white", "white"],
    "P": ["white", "off",   "off",   "off",   "off"],
    "Q": ["white", "off",   "off",   "off",   "white"],
    "R": ["white", "off",   "off",   "white", "off"],
    "S": ["white", "off",   "off",   "white", "white"],
    "T": ["white", "off",   "white", "off",   "off"],
    "U": ["white", "off",   "white", "off",   "white"],
    "V": ["white", "off",   "white", "white", "off"],
    "W": ["white", "off",   "white", "white", "white"],
    "X": ["white", "white", "off",   "off",   "off"],
    "Y": ["white", "white", "off",   "off",   "white"],
    "Z": ["white", "white", "off",   "white", "off"],
}

# What the receiver learns during calibration, one entry per colour name
REFERENCES = {}


def calibrate(readings):
    """Your calibrate from Challenge 1: readings[name] is a list of a few
    readings, each one Reading(r, g, b, c), taken while that colour showed."""
    for name in readings:
        # TODO: copy your own version over from alphabet.py
        REFERENCES[name] = readings[name][0]


def send_symbol(name):
    """Shows the colour with this name on the LED of the sending device."""
    r, g, b = COLORS[name]
    sender.led.set_color(r, g, b)


def receive_symbol():
    """Your receive_symbol from Challenge 1: measures and returns the name of
    the colour it recognised."""
    r, g, b, c = receiver.sensor.read()
    # TODO: copy your own version over from alphabet.py
    return "off"


def send_text(text):
    """Sends the text, character by character: this is the encoding.

    For every character, look up its colours in CODEBOOK and show them one
    after the other, each one for 1 / SYMBOL_RATE seconds. As soon as this
    function returns, run_test turns the LED off and stops the clock.
    """
    # TODO: send every character of text as its colours from CODEBOOK
    pass


def receive_text(n_chars):
    """Receives n_chars characters and returns them as one text: this is the
    decoding.

    It starts at the same moment as send_text. The sender shows a new colour
    every 1 / SYMBOL_RATE seconds, so the receiver has to read each colour
    in the same rhythm, collect as many colours as one character has, and
    look up which character they stand for in CODEBOOK.
    """
    text = ""
    # TODO: receive n_chars characters and add each one to text
    return text


run_test(send_text, receive_text, calibrate, symbols=COLORS, codebook=CODEBOOK,
         gain=GAIN, integration_time=INTEGRATION_TIME)
```

## Running the test

```text
python word.py
```

On a Mac the command is `python3`. If you work with two laptops, you start the
file on both, and the course server gives both a shared start time; on one
laptop the receiver runs alongside the sender. As in challenge 1, a run begins
with the calibration, in which `run_test` shows every colour of `COLORS` once
and calls your `calibrate`. Then come three sentences of three words each,
such as `BUSY FROGS DANCE`, fresh from the course server for every run. For
each sentence `send_text(text)` and `receive_text(n_chars)` start at the same
moment, and your receiver learns only how many characters are coming, never
the sentence itself. As soon as `send_text` returns, the LED goes off.

A scored run is three sentences in a row without an error at the same symbol
rate. The result appears with every mistake in the terminal and in your
[[lifi-cockpit|team cockpit]]. For quick tries in between one sentence is
enough if you add `sentences=1` to the call of `run_test` at the end of the
file; only runs with three sentences count, though. It is even simpler to
practise with your own text: with `text="HELLO WORLD"` in the same line,
`run_test` sends this text instead of the sentences from the server, and a
list of texts it sends one after the other. That is a practice run with both
devices on one laptop, which does not ask the server and never counts, and
every character in it has to be in your `CODEBOOK`. Without the server, too,
a run with both devices on one laptop works as a practice run that does not
count.

## Task 1: The codebook

Decide which sequence of your colours stands for which character. Sender and
receiver read the same `CODEBOOK`, so it is written only once in the file.
The template gives every character five colours out of off and white; with
more colours fewer places will do, and that is what this challenge is about.

**File:** `word.py`, the codebook `CODEBOOK`; in the template it begins like
this:

```python static
CODEBOOK = {
    " ": ["off",   "off",   "off",   "off",   "off"],
    "A": ["off",   "off",   "off",   "off",   "white"],
    "B": ["off",   "off",   "off",   "white", "off"],
    "C": ["off",   "off",   "off",   "white", "white"],
    # ... and so on, up to "Z"
}
```

> [!HINT]
> With *k* colours and *n* places you can tell *k*ⁿ codewords apart ([[place-value-systems]]). For 26 letters and the space, four colours need three places, because 4³ = 64; with two colours you need five, because 2⁵ = 32.

> [!HINT]
> If all codewords have the same length, the receiver knows where a character ends without any separator.

## Task 2: Get it running slowly

You write both new functions. `send_text(text)` is the encoding: it splits
the text into colours with your codebook and shows them one after the other,
each for `1 / SYMBOL_RATE` seconds. `receive_text(n_chars)` is the decoding:
it measures in the same rhythm, turns every sequence of colours back into a
character and returns the text as soon as all characters have arrived. Start
slowly, with the two colours per second of the template, and do not stop until
three sentences in a row arrive without an error.

**File:** `word.py`, the functions `send_text(text)` and `receive_text(n_chars)`; in the template:

```python static
def send_text(text):
    """Sends the text, character by character: this is the encoding.

    For every character, look up its colours in CODEBOOK and show them one
    after the other, each one for 1 / SYMBOL_RATE seconds. As soon as this
    function returns, run_test turns the LED off and stops the clock.
    """
    # TODO: send every character of text as its colours from CODEBOOK
    pass


def receive_text(n_chars):
    """Receives n_chars characters and returns them as one text: this is the
    decoding.

    It starts at the same moment as send_text. The sender shows a new colour
    every 1 / SYMBOL_RATE seconds, so the receiver has to read each colour
    in the same rhythm, collect as many colours as one character has, and
    look up which character they stand for in CODEBOOK.
    """
    text = ""
    # TODO: receive n_chars characters and add each one to text
    return text
```

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

**File:** `word.py`, the value `SYMBOL_RATE`; in the template:

```python static
# How many colours you send per second. Start slowly and go up step by step.
SYMBOL_RATE = 2
```

> [!HINT]
> Only ever change one thing, either the rate or the size of the alphabet. If you change both at once, you will not know afterwards what caused the error.

> [!HINT]
> The pattern of errors gives away the cause: if everything slips from one point on, it is the rhythm; if single characters are wrong, the alphabet is too large for this rate.

## Acceptance and scoring

You run scored runs at your own place, with the boxes of sender and receiver
touching wall to wall. Nicolas accepts the runs live: he comes round, looks
at your setup, asks to see your code now and then, and ticks off passed runs. You pass with one scored run, that is three sentences in a row
without an error, at any symbol rate.

The [challenge board](https://lifi.hsos.uber.space/challenges) shows for every
team how many characters and how many bits per second it transmits. For every
sentence the clock runs from the shared start until `send_text` returns.
Characters per second are the characters of the three sentences divided by
this time, and bits per second are all colours sent divided by the same time,
times log2 of the number of your colours in `COLORS`. The ranking goes by
characters per second, and in a tie the team that reached the
value first comes first. In the competition the best teams show their run
live; there is no live change in challenge 2.

## Pitfalls and more

**Typical pitfalls:** what works at one colour per second falls apart at five,
because the two sides have no shared clock and every small delay adds up from
colour to colour. The receiver measures exactly during a change of colour, or
the codewords get longer than necessary.

**For the quick ones:** give frequent letters shorter codewords and make sure
they can still be read without ambiguity ([[prefix-trap]]).
