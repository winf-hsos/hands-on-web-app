---
title: "Challenge 1: The alphabet"
summary: >-
  How many colours does your link tell apart in 20 attempts without a single error? The answer is your alphabet for everything that follows.
objectives:
  intro: "With this challenge you find your alphabet and can then:"
  goals:
    - "calibrate sender and receiver before every run"
    - "show with a control measurement whether a setup helps"
    - "calculate the number of codewords from the number of colours and places"
    - "trace confusions in the result back to their cause"
translation_of: de
based_on: 2026-11-03
---

Now it is about the link itself. A sensor never measures exactly the same
thing twice, ambient light interferes, and distance changes everything. The
question of this phase is how many states your setup can reliably tell apart,
because that is your alphabet for everything that follows.

Such an alphabet is a place value system, and the number of your colours is
its base: if you can reliably tell four colours apart, you work in base 4, and
a sequence of colours is a number ([[place-value-systems]]). Two things follow
for everything after this: the order is part of the message, because
red-yellow-green and green-yellow-red are different code words, and the
arithmetic runs both ways. With *k* colours and *n* positions you can tell
*k*ⁿ code words apart, so if you know how many characters you need, you can
work out how many positions that costs.

**Goal:** Find out how many states your link distinguishes in 20 attempts
without a single error. This decides the whole project: whoever reliably tells
four states apart later sends two bits per symbol, whoever manages sixteen
sends four and transmits twice as much at the same speed.

**What is new** is that for the first time you have to find something out about
your setup instead of thinking it up. Nobody knows in advance how many states
can be told apart, the AI assistant included, because it depends on your
sensor, your distance, your room and whatever you build in between.

**Task:** The sender shows a colour from a set you define yourselves, and the
receiver says which one it was. Timing does not matter yet, because in this
challenge the test script sets the pace: it shows a colour, waits until the
receiver has measured, and then takes the next one.

**Four tasks:** first you count by eye, then you teach your receiver in
`alphabet.py` to learn your colours and recognise them, and finally you grow
the alphabet, first without and then with your setup. This gives the three
numbers that belong in your notes. Each task has hints to unfold. There is no
sample solution for this challenge; instead, the end of the page shows an
example together with the reasons why it is not a good solution.

**The three results of this challenge** (see [[lifi-challenges]])
are therefore the measurement logs without and with aids, a photo of your
setup with a sentence on why you built it that way as the description of your
solution, and your log of mistakes. For the last one this challenge is the
richest source: ask the assistant why the tube does not help, and it suggests
matt black inner walls, shades and narrower openings, all plausible and none of
it tested until you have measured it.

## One file for everything

For this challenge you have exactly one file, `alphabet.py`, no matter whether
you work with one laptop or two. The test script calls three of your
functions, nothing more; how you build them inside is up to you, and you may
add as many functions of your own as you like.

| Part | What goes in |
|---|---|
| `COLORS` | your alphabet, one colour per line; the first line is colour 0 |
| `calibrate(readings)` | learns what each colour looks like at the receiver, from the readings the test hands over |
| `send_symbol(index)` | shows colour number `index` on the sending LED; this one is already done |
| `receive_symbol()` | measures and returns the number of the colour it recognised |
| `run_test(...)` | the last line; it runs the test, and you do not change it |

`sender.led` is the LED of the sending device, `receiver.sensor` the sensor of
the receiving one. Both, and `run_test`, come from the course module from
version 0.5.0 on ([[lifi-hardware]]).

This is how `alphabet.py` looks in your template; wherever it says `TODO`, your code is missing:

```python static file=alphabet.py
"""
Challenge 1: The Alphabet
=========================

How many different colours can you tell apart, without a single mistake?

Everything for this challenge is in this one file. You fill in the
functions below, and run_test at the bottom does the rest. The file works
the same with both devices on one laptop and with one device on each of
two laptops: at the start, the module asks which device sends.

Run it with:  python alphabet.py   (on a Mac: python3)
"""

from lifi_hardware import receiver, run_test, sender

# Your alphabet: one colour per line. Colour number 0 is the first line,
# number 1 the second, and so on. Start with two. When 20 runs get through
# without a mistake, remove the # in front of the next two colours.
COLORS = [
    (0, 0, 0),          # off
    (255, 255, 255),    # white
    # (255, 0, 0),      # red
    # (0, 0, 255),      # blue
    # (0, 255, 0),      # green
    # (255, 255, 0),    # yellow
    # (0, 255, 255),    # cyan
    # (255, 0, 255),    # magenta
]

# What the receiver learns during calibration, one entry per colour
REFERENCES = {}


def calibrate(readings):
    """Called once before the test, after every colour has been shown.

    readings[index] is a list of a few readings, each one Reading(r, g, b, c),
    taken while colour number index was showing.
    """
    for index in readings:
        # TODO: store something better than the first reading, for example
        #       the average of all readings of this colour
        REFERENCES[index] = readings[index][0]


def send_symbol(index):
    """Shows colour number index on the LED of the sending device."""
    r, g, b = COLORS[index]
    sender.led.set_color(r, g, b)


def receive_symbol():
    """Measures and returns the number of the colour it recognised."""
    r, g, b, c = receiver.sensor.read()
    # TODO: compare this reading with REFERENCES and return the number of
    #       the colour that is most similar
    return 0


run_test(send_symbol, receive_symbol, calibrate, symbols=len(COLORS))
```

## Running the test

A run has two parts, and `run_test` carries out both, one after the other:

![Two rows. At the top calibrating, once before every run: every colour once in order, through send_symbol(index) and light to calibrate(readings). An arrow labelled REFERENCES leads from calibrate down to receive_symbol(). At the bottom testing with 20 tries: the course server hands the random sequence to send_symbol(index), light goes to receive_symbol(), and the recognised number goes back to the course server, which compares; the result appears in the team cockpit. calibrate and receive_symbol have a bright frame, everything else a grey one.](figure:run-test "First calibrate learns your colours, then receive_symbol recognises every colour of the random sequence. The two functions with a bright frame are the ones you write.")

```text
python alphabet.py
```

On a Mac the command is `python3` if `python` is not found.

**Both devices on one laptop:** the module finds both, lights up the LED of
one of them and asks whether that device sends or receives. Then the test runs
on its own: show a colour, measure, note, next colour.

**One device on each of two laptops:** you start the same file on both
laptops, and each one asks whether it sends or receives. The course server
brings the two together through your team and says when the next colour
comes, so you do not need to start them at the same moment. Both laptops need
WLAN for this.

Every run gets a fresh random sequence from the course server, so nobody knows
it in advance. At the end both sides show the result and every mistake, and
the run appears in your [[lifi-cockpit|team cockpit]]. Without the server, a
run with both devices on one laptop still works as a practice run that does
not count. For quick tries in between, fewer attempts are enough; change the
last line to
`run_test(send_symbol, receive_symbol, calibrate, symbols=len(COLORS), runs=5)`.
Only runs with 20 attempts count.

## Task 1: Count by eye

Before you write a line of code, you count how many colours you can reliably
tell apart yourselves when you see them one at a time, not side by side. In
some respects your eye beats the sensor by far, in others it clearly loses,
and one reason matters for the rest of the challenge: your vision recalibrates
itself all the time when the light in the room changes, while the sensor
simply reports different numbers.

**File:** none; the number goes into your notes.

> [!HINT]
> One of you lets the LED show colours one at a time and in random order, for example with `task_3_color_cycle.py` from challenge 0, and the other names each colour without being able to compare it with another. Start with a few clearly different colours and add more similar ones step by step.

## Task 2: Calibrate

The receiver cannot calculate which symbol has arrived.
Its readings depend on distance, room light and the particular part, and the
same colour never gives exactly the same numbers twice. So it first has to
learn what your symbols look like in this setup. Before every run, `run_test`
therefore shows your whole alphabet once, takes a few readings of each colour
and hands them to your `calibrate(readings)`: `readings[0]` is the list of
readings taken while colour 0 was showing, `readings[1]` those of colour 1,
and so on, and every reading has the four channels `r`, `g`, `b` and `c`. What
you keep from them, an average, a range or a rule, is your decision. During
the test, `receive_symbol()` then compares every new reading with what you
kept and picks the most similar colour. Calibration happens again before every
run, at the acceptance test too, because after being carried around and under
different light old values no longer fit.

**File:** `alphabet.py`, the function `calibrate(readings)`; in the template:

```python static
# What the receiver learns during calibration, one entry per colour
REFERENCES = {}


def calibrate(readings):
    """Called once before the test, after every colour has been shown.

    readings[index] is a list of a few readings, each one Reading(r, g, b, c),
    taken while colour number index was showing.
    """
    for index in readings:
        # TODO: store something better than the first reading, for example
        #       the average of all readings of this colour
        REFERENCES[index] = readings[index][0]
```

> [!HINT]
> The template keeps only the first reading of each colour. An average over all readings of a colour is calmer, because the small fluctuations of the sensor even out.

> [!HINT]
> `readings[index]` is a list of readings, and `sum(reading.r for reading in readings[index]) / len(readings[index])` is the average of the red channel for this colour. The same goes for `g`, `b` and `c`, and you store all four together in `REFERENCES[index]`.

## Task 3: Recognise

`receive_symbol()` measures once and returns the number of the colour whose
reference from the calibration is most similar to the reading. So far the
template always returns 0, so it only passes as long as every colour sent
happens to be colour 0.

**File:** `alphabet.py`, the function `receive_symbol()`; in the template:

```python static
def receive_symbol():
    """Measures and returns the number of the colour it recognised."""
    r, g, b, c = receiver.sensor.read()
    # TODO: compare this reading with REFERENCES and return the number of
    #       the colour that is most similar
    return 0
```

> [!HINT]
> What "similar" means is up to you. An obvious choice is how far the reading lies from the reference of a colour on all four channels together; the colour with the smallest distance wins.

> [!HINT]
> Do not decide by which channel is largest. That works for red, green and blue in a quiet room and fails for everything else; why is explained below in the section on the example.

## Task 4: Grow the alphabet

Now you measure how many colours your link tells apart in 20 attempts without
a single mistake, and you do it twice: first without aids, with a bare LED, a
bare sensor and the boxes touching wall to wall, and then with your setup, a
tube, a shade or whatever you come up with.

The result with your setup counts. Without the measurement without aids,
though, you cannot know whether your setup made any difference at all, which is exactly why this
control measurement belongs to it. What you may build is described in [[lifi-device]].

**File:** `alphabet.py`, the list `COLORS`; in the template:

```python static
# Your alphabet: one colour per line. Colour number 0 is the first line,
# number 1 the second, and so on. Start with two. When 20 runs get through
# without a mistake, remove the # in front of the next two colours.
COLORS = [
    (0, 0, 0),          # off
    (255, 255, 255),    # white
    # (255, 0, 0),      # red
    # (0, 0, 255),      # blue
    # (0, 255, 0),      # green
    # (255, 255, 0),    # yellow
    # (0, 255, 255),    # cyan
    # (255, 0, 255),    # magenta
]
```

> [!HINT]
> Start with the two colours already in `COLORS`, just off and white. When 20 attempts get through without a mistake, go up to 4 by removing the `#` in front of the next two colours, then to 8. The last size without mistakes is your result, and it does not pay to gamble high, because eight states recognised reliably are worth more than sixteen with an occasional mix-up.

> [!HINT]
> When there are mistakes, the result shows you what they look like. If the same two colours are mixed up every time, they are too close together, and you replace one of them; if it looks random, the calibration is the more likely culprit.

## The acceptance test

**At the acceptance test** you run the test at your own place, with the boxes
of sender and receiver touching wall to wall. Nicolas comes round, looks at
your setup and checks your result. A single mistake counts as a fail for that
alphabet size. There is no live change in Challenge 1: the run with 20 random
colours is the whole acceptance, and the largest alphabet that runs without a
mistake counts.

## An example, not a solution

There is no sample solution for this challenge. Instead, here is the receiver
from session 4 in the form of `alphabet.py`: it takes the room light as a
baseline, subtracts it from every reading and decides between red, green and
blue by the largest of the three colour channels.

```python static file=example.py
"""
Challenge 1: an example, not a solution
=======================================

This is the receiver written live in session 4, brought into the form of
alphabet.py. It works for red, green and blue in a quiet room, and it shows
nicely where a first idea breaks. Read the page "Why this is not a good
solution" before you build on it.

The idea in three steps:
  1. Baseline: what the sensor measures while the LED is off.
  2. Subtract the baseline from every new reading, so that what is left
     is the light of the sending LED.
  3. Whichever of r, g and b is largest after that decides the colour.

Run it with:  python example.py   (on a Mac: python3)
"""

from lifi_hardware import receiver, run_test, sender

COLORS = [
    (0, 0, 0),          # 0: off
    (255, 0, 0),        # 1: red
    (0, 255, 0),        # 2: green
    (0, 0, 255),        # 3: blue
]

# The room light, measured during calibration while colour 0 (off) showed
BASELINE = {"r": 0, "g": 0, "b": 0}


def calibrate(readings):
    """Keeps only the baseline: the average of the readings with the LED off."""
    off = readings[0]
    BASELINE["r"] = sum(reading.r for reading in off) / len(off)
    BASELINE["g"] = sum(reading.g for reading in off) / len(off)
    BASELINE["b"] = sum(reading.b for reading in off) / len(off)


def send_symbol(index):
    r, g, b = COLORS[index]
    sender.led.set_color(r, g, b)


def receive_symbol():
    r, g, b, c = receiver.sensor.read()

    # Subtract the room light
    r = r - BASELINE["r"]
    g = g - BASELINE["g"]
    b = b - BASELINE["b"]

    # The largest channel decides
    if r > g and r > b:
        return 1        # red
    elif g > r and g > b:
        return 2        # green
    else:
        return 3        # blue
    # Note what is missing: there is no way to answer 0 (off).


run_test(send_symbol, receive_symbol, calibrate, symbols=len(COLORS))
```

### Why this is not a good solution

The example works, and that is exactly what makes it dangerous. Send red,
green and blue in a quiet room, and it recognises all three. In session 4 it
did just that in front of everyone, and then, a few seconds later, the LED went
off and the program said "green". Here is why, and what else is waiting.

**Off has no answer.** The program can only return red, green or blue, because
the rule picks the largest of three channels and there is always a largest
one. When the LED is off, what is left after subtracting the baseline is
noise, a few counts up or down on each channel. One of them happens to be the
largest, and that one wins; in session 4 it was green. Your receiver needs a
way to say "nothing is there", which means a rule that looks at how much light
arrived before it asks which colour it was.

**There is no "I don't know".** This is the same problem in general form:
whatever the reading, the program names a colour with full confidence. A
reading halfway between two colours, a hand in the light path, a flash from
the neighbouring team, all of it comes out as red, green or blue. A receiver
that can say "this does not look like any of my colours" can at least notice
that something went wrong.

**Mixed colours look like their strongest part.** Yellow is red and green at
the same time, and white is all three. The rule looks only at which channel is
largest, so yellow comes out as red or green, depending on which part of the
sensor reacts more strongly, and white comes out as whatever channel happens
to be strongest. The moment your alphabet grows beyond three colours, "largest
channel" no longer describes it. You then need to compare the whole reading,
all channels together, with what each colour looked like during calibration.

**The baseline is a photo of one moment.** The room light is measured once, at
the start. If someone switches on the ceiling light, opens the blinds or leans
over the table, the baseline is wrong for everything that follows, and every
reading is off by the difference. That is why the test calibrates again before
every run, and why it is worth asking how much your own receiver suffers when
the light changes in the middle of a run.

**Your device is not the device of the team next to you.** The rule assumes
that red light makes the red channel largest. That holds only if the filters
of your sensor and the colours of your LED play along. If the green channel of
a sensor is weaker, green light may make the blue channel largest, and the
rule fails for that device while it works for the one next to it. Calibration
exists precisely so that you do not have to assume anything about your parts:
you measure what each colour really looks like on your device and decide from
that.

**What to take from it:** all five problems have the same cause, because the
program decides with a fixed rule that someone thought up instead of with the
readings of the calibration. A better receiver keeps what each colour looked
like during calibration, compares a new reading with all of them, and treats a
reading that fits none of them as a mistake to notice rather than as a colour.

## Pitfalls and more

**Typical pitfalls:** fixed thresholds instead of calibrating before every run
("above 500 in the red channel means red" works on Tuesday and fails on
Thursday, because the light in the room is different; whoever notices this
arrives at calibration, the strongest result this challenge has to offer),
overlooking the unfiltered channel C although it is the most sensitive, too few
repetitions when measuring (seeing each state three times without a mistake
tells you nothing yet), and colours that look nice rather than colours the
sensor can tell apart well.

**For the quick ones:** try different integration times of the sensor and
measure what they change. Longer measurements are calmer but allow fewer
measurements per second, and exactly this trade-off decides your throughput in
challenge 4.
