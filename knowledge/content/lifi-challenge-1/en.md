---
title: "Challenge 1: The alphabet"
summary: >-
  How many colours does your link tell apart in 20 attempts without a single error? The answer is your alphabet for everything that follows.
objectives:
  intro: "With this challenge you find your alphabet and can then:"
  goals:
    - "calibrate sender and receiver before every run"
    - "show with a control measurement whether a setup helps"
    - "work out from the number of colours how many bits a symbol carries"
    - "trace confusions in the result back to their cause"
translation_of: de
based_on: 2026-11-04
---

In this challenge you find out how many colours your link tells apart in 20
attempts without a single error. These colours are your alphabet for
everything that follows, and its size sets the pace: with four colours you
later send two bits per symbol, with sixteen four.

The sender shows a colour from your alphabet, the receiver says which one it
was, and the test script sets the pace. There is no sample solution; the end of
the page shows an example together with the reasons why it is not a good
solution.

## One file for everything

You work in exactly one file, `alphabet.py`, with one laptop or with two. The
test script calls three of your functions; how you build them is up to you.

| Part | What goes in |
|---|---|
| `COLORS` | your alphabet, one colour per line, each with a name such as `"white"` |
| `calibrate(readings)` | learns what each colour looks like at the receiver, from the readings the test hands over |
| `send_symbol(name)` | shows the colour with this name on the sending LED; already done |
| `receive_symbol()` | measures and returns the name of the colour it recognised |
| `run_test(...)` | the last line; it runs the test, and you do not change it |

`run_test`, `sender` and `receiver` come from the course module from version
0.6.0 on ([[lifi-hardware]]). This is the template; wherever it says `TODO`,
your code is missing:

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

# Your alphabet: one colour per line, each with a name. The names are what
# your functions work with and what the result shows. Start with two. When
# 20 runs get through without a mistake, remove the # in front of the next
# two colours.
COLORS = {
    "off":     (0, 0, 0),
    "white":   (255, 255, 255),
    # "red":     (255, 0, 0),
    # "blue":    (0, 0, 255),
    # "green":   (0, 255, 0),
    # "yellow":  (255, 255, 0),
    # "cyan":    (0, 255, 255),
    # "magenta": (255, 0, 255),
}

# What the receiver learns during calibration, one entry per colour name
REFERENCES = {}


def calibrate(readings):
    """Called once before the test, after every colour has been shown.

    readings[name] is a list of a few readings, each one Reading(r, g, b, c),
    taken while the colour with that name was showing, so readings["white"].
    """
    for name in readings:
        # TODO: store something better than the first reading, for example
        #       the average of all readings of this colour
        REFERENCES[name] = readings[name][0]


def send_symbol(name):
    """Shows the colour with this name on the LED of the sending device."""
    r, g, b = COLORS[name]
    sender.led.set_color(r, g, b)


def receive_symbol():
    """Measures and returns the name of the colour it recognised."""
    r, g, b, c = receiver.sensor.read()
    # TODO: compare this reading with REFERENCES and return the name of
    #       the colour that is most similar
    return "off"


run_test(send_symbol, receive_symbol, calibrate, symbols=COLORS)
```

## Running the test

A run has two parts, and `run_test` carries out both, one after the other:

![Two rows. At the top calibrating, once before every run: every colour once in order, through send_symbol(name) and light to calibrate(readings). An arrow labelled REFERENCES leads from calibrate down to receive_symbol(). At the bottom testing with 20 tries: the course server hands the random sequence to send_symbol(name), light goes to receive_symbol(), and the recognised name goes back to the course server, which compares; the result appears in the team cockpit. calibrate and receive_symbol have a bright frame, everything else a grey one.](figure:run-test "First calibrate learns your colours, then receive_symbol recognises every colour of the random sequence. The two functions with a bright frame are the ones you write.")

```text
python alphabet.py
```

On a Mac the command is `python3`. At the start the module asks which device
sends. If you work with two laptops, you start the file on both; the course
server brings them together through your team, and both need WLAN for this.

Every run gets a fresh random sequence from the course server, and the result
with every mistake, named after your colours, appears in the terminal and in your
[[lifi-cockpit|team cockpit]]. Only runs with 20 attempts count; for quick
tries in between, add `runs=5` to the last line.

Without the server, a run with both devices on one laptop is a practice run
that does not count. To practise like this even though the server is
reachable, switch it off for the terminal; with two laptops this does not
work. In PowerShell this holds until you close the terminal:

```powershell
$env:LIFI_SERVER="off"
python alphabet.py
```

On a Mac it holds for this one call only:

```bash
LIFI_SERVER=off python3 alphabet.py
```

## Task 1: Calibrate

The same colour never gives exactly the same readings twice, and what the
sensor sees depends on distance, room light and the particular part. Before
every run, `run_test` therefore shows each colour once and hands the readings
to `calibrate(readings)`: `readings["white"]` is the list of readings taken while white
was showing, and so on for every name; every reading has the channels `r`, `g`,
`b` and `c`. What you keep from them in `REFERENCES` is your decision.

**File:** `alphabet.py`, the function `calibrate(readings)`; in the template:

```python static
# What the receiver learns during calibration, one entry per colour name
REFERENCES = {}


def calibrate(readings):
    """Called once before the test, after every colour has been shown.

    readings[name] is a list of a few readings, each one Reading(r, g, b, c),
    taken while the colour with that name was showing, so readings["white"].
    """
    for name in readings:
        # TODO: store something better than the first reading, for example
        #       the average of all readings of this colour
        REFERENCES[name] = readings[name][0]
```

> [!HINT]
> The template keeps only the first reading of each colour. An average over all readings of a colour is calmer, because the small fluctuations of the sensor even out.

> [!HINT]
> `sum(reading.r for reading in readings[name]) / len(readings[name])` is the average of the red channel for this colour. The same goes for `g`, `b` and `c`, and you store all four together in `REFERENCES[name]`.

## Task 2: Recognise

`receive_symbol()` measures once and returns the name of the colour whose
reference is most similar to the reading. So far the template always returns
`"off"`.

**File:** `alphabet.py`, the function `receive_symbol()`; in the template:

```python static
def receive_symbol():
    """Measures and returns the name of the colour it recognised."""
    r, g, b, c = receiver.sensor.read()
    # TODO: compare this reading with REFERENCES and return the name of
    #       the colour that is most similar
    return "off"
```

> [!HINT]
> What "similar" means is up to you. An obvious choice is how far the reading lies from the reference of a colour on all four channels together; the colour with the smallest distance wins.

> [!HINT]
> Do not decide by which channel is largest. That works for red, green and blue in a quiet room and fails for everything else; why is explained below with the example.

## Task 3: Grow the alphabet

Now you measure how many colours get through 20 attempts without a mistake,
and you do it twice: first without aids, with the boxes touching wall to wall,
then with your setup, such as a tube or a shade ([[lifi-device]]). The result
with your setup counts; the measurement without it shows whether it helps.

**File:** `alphabet.py`, the list `COLORS`; in the template:

```python static
# Your alphabet: one colour per line, each with a name. The names are what
# your functions work with and what the result shows. Start with two. When
# 20 runs get through without a mistake, remove the # in front of the next
# two colours.
COLORS = {
    "off":     (0, 0, 0),
    "white":   (255, 255, 255),
    # "red":     (255, 0, 0),
    # "blue":    (0, 0, 255),
    # "green":   (0, 255, 0),
    # "yellow":  (255, 255, 0),
    # "cyan":    (0, 255, 255),
    # "magenta": (255, 0, 255),
}
```

> [!HINT]
> Start with off and white. When 20 attempts get through without a mistake, remove the `#` in front of the next two colours, and so on. The last size without mistakes is your result; eight colours recognised reliably are worth more than sixteen with an occasional mix-up.

> [!HINT]
> If the same two colours are mixed up every time, they are too close together, and you replace one of them. If the mistakes look random, the calibration is the more likely culprit.

## The acceptance test

You run the test at your own place, with the boxes of sender and receiver
touching wall to wall. Nicolas comes round, looks at your setup and checks the
result. The largest alphabet that gets through 20 attempts without a single
mistake counts; there is no live change in Challenge 1.

## An example, not a solution

Here is the receiver from session 4 in the form of `alphabet.py`: it takes the
room light as a baseline, subtracts it from every reading and decides between
red, green and blue by the largest of the three colour channels.

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

COLORS = {
    "off":   (0, 0, 0),
    "red":   (255, 0, 0),
    "green": (0, 255, 0),
    "blue":  (0, 0, 255),
}

# The room light, measured during calibration while off showed
BASELINE = {"r": 0, "g": 0, "b": 0}


def calibrate(readings):
    """Keeps only the baseline: the average of the readings with the LED off."""
    off = readings["off"]
    BASELINE["r"] = sum(reading.r for reading in off) / len(off)
    BASELINE["g"] = sum(reading.g for reading in off) / len(off)
    BASELINE["b"] = sum(reading.b for reading in off) / len(off)


def send_symbol(name):
    r, g, b = COLORS[name]
    sender.led.set_color(r, g, b)


def receive_symbol():
    r, g, b, c = receiver.sensor.read()

    # Subtract the room light
    r = r - BASELINE["r"]
    g = g - BASELINE["g"]
    b = b - BASELINE["b"]

    # The largest channel decides
    if r > g and r > b:
        return "red"
    elif g > r and g > b:
        return "green"
    else:
        return "blue"
    # Note what is missing: there is no way to answer "off".


run_test(send_symbol, receive_symbol, calibrate, symbols=COLORS)
```

### Why this is not a good solution

For red, green and blue in a quiet room the example works, and that is exactly
what makes it dangerous:

- **Off has no answer.** There is always a largest channel, so even the noise
  with the LED off becomes a colour; in session 4 it was green.
- **There is no "I don't know".** A hand in the light path or a flash from the
  neighbouring team comes out as a colour with full confidence.
- **Mixed colours look like their strongest part.** Yellow comes out as red or
  green, white as whatever channel happens to lead.
- **The baseline is a photo of one moment.** When the ceiling light goes on,
  every reading after that is off.
- **Your device is not the one of the team next to you.** If the green channel
  of a sensor is weaker, green light may make blue the largest channel there.

All five have the same cause: the program decides with a rule someone thought
up instead of with the readings of the calibration. A better receiver compares
every reading with all references and recognises a reading that fits none of
them as a mistake.

## Pitfalls

- fixed thresholds instead of calibrating before every run: "above 500 in the
  red channel means red" works on Tuesday and fails on Thursday
- overlooking the unfiltered channel `c` although it is the most sensitive
- choosing colours that look nice rather than colours the sensor tells apart
  well

**For the quick ones:** try different integration times of the sensor. Longer
measurements are calmer but allow fewer measurements per second, and exactly
this trade-off decides your throughput in challenge 4.
