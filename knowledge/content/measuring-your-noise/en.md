---
title: Measuring your own noise
summary: >-
  Read one colour ten times, average over growing windows and work out the
  spread, then set the distance to the neighbouring colour against it and
  calculate how many symbols fit between the floor and the ceiling of your
  link.
objectives:
  intro: "In this experiment you measure the spread of your own link, and afterwards you can:"
  goals:
    - "determine the mean and the spread `s` from ten readings of one colour"
    - "show with your own numbers how averaging over windows of 1, 3, 5 and 10 readings reduces the spread and what it costs in time"
    - "calculate the distance `d` and the ratio `d/s` for two neighbouring colours and decide whether their bands touch"
    - "work out from the floor, the ceiling and the width of one band how many symbols fit into your link, and compare that with the alphabet you actually reached"
translation_of: de
based_on: 2026-11-08
---

You measure a single colour again and again without changing anything and see
how far the numbers wander all the same. From this spread, the distance to the
neighbouring colour and the range between the darkest and the brightest value
you finally work out how many symbols your link can carry, and compare that
with the alphabet you reached in Challenge 1. The experiment assumes that your
link already works: the LED of one device shines into the sensor of the other,
and you can address both from Python.

## What you need

- two devices with an RGB LED and a colour sensor, on two laptops or both on
  one
- the sending program and the receiving program below
- your setup from Challenge 1 as you last used it, with the position of both
  devices marked
- two colours from your alphabet that lie close together, for example the pair
  that was confused most often
- paper and pen

## Setup

- Place the two devices as you used them in Challenge 1.
- Change nothing about them for the whole experiment: not the distance, not
  the optics and not the light in the room.
- Write down the distance and whether the ceiling light is on.

With two laptops, the sending program runs on one and the receiving program on
the other. If both devices hang on one laptop, start the two programs in two
terminals, remove the `#` in front of the line with `use_device` in each and
enter the UID of the respective master brick from the Brick Viewer.

## Before: your expectation

Write down your answers before you measure; after the first step you compare
them with your numbers.

1. How far apart will ten readings of the same colour lie in the clear channel
   `c`, from the smallest to the largest value?
2. How much calmer will the mean become if you combine ten readings each time:
   ten times calmer or less?

## The programs

The sending program shows your two colours one after the other, then black and
white, each until you press Enter. Enter your own colours at the top.

```python static
from lifi_hardware import led, use_device

# only with both devices on one laptop: the UID of the sending master brick
# use_device("6qzRzc")

COLOURS = [
    ("Colour A", 255, 0, 0),     # replace with the first colour of your pair
    ("Colour B", 255, 60, 0),    # replace with its neighbour
    ("Floor", 0, 0, 0),
    ("Ceiling", 255, 255, 255),
]

for name, r, g, b in COLOURS:
    led.set_color(r, g, b)
    input(f"{name} is on, Enter for the next ")

led.set_color(0, 0, 0)
```

The receiving program asks what is shining and then measures ten values for
each window: for window 1 ten single readings, for window 3 ten means of three
readings each, and so on. For each window it prints the ten values, their mean
and their spread `s`, and how long the measurement took. One run takes a
good half minute, and an empty input ends the program.

```python static
import statistics
import time

from lifi_hardware import sensor, use_device

# only with both devices on one laptop: the UID of the receiving master brick
# use_device("Xy12Ab")

WINDOWS = [1, 3, 5, 10]
PAUSE = 0.2  # seconds between two readings, so that every reading is a new one


def mean_of(n):
    values = []
    for _ in range(n):
        r, g, b, c = sensor.read()
        values.append(c)
        time.sleep(PAUSE)
    return sum(values) / n


while True:
    name = input("What is shining? (empty = end) ")
    if name == "":
        break
    for n in WINDOWS:
        start = time.time()
        means = [mean_of(n) for _ in range(10)]
        seconds = (time.time() - start) / 10
        print(f"{name}, window {n}: {[round(m) for m in means]}")
        print(f"   mean {statistics.mean(means):.1f}, spread s {statistics.stdev(means):.1f}, "
              f"{seconds:.1f} s per value")
```

## Step 1: ten readings of one colour

- Let colour A shine and start the receiving program.
- Enter for each window the ten values, their mean, the spread `s` and the
  seconds per value in the table.

The row for window 1 holds your ten readings of the same colour, in which
nothing changed except the numbers.

| Window | ten values | mean | spread s | seconds per value |
|---|---|---|---|---|
| 1 | | | | |
| 3 | | | | |
| 5 | | | | |
| 10 | | | | |

If you would rather work out the spread yourselves, put the ten values of one
row into the program in the browser:

```python
import statistics

# replace the placeholders with the ten values of one row of your table
values = [214, 211, 218, 209, 216, 213, 220, 207, 215, 212]

mean = statistics.mean(values)
s = statistics.stdev(values)
print(f"mean {mean:.1f}, spread s {s:.1f}")
```

> [!TIP]
> The spread `s` is the standard deviation: about two thirds of the values lie
> less than `s` away from the mean, and almost all of them, 997 in 1000, less
> than `3 · s`. A colour therefore takes up a band about `6 · s` wide, `3 · s`
> downwards and `3 · s` upwards.

3. How far apart are your ten readings in window 1, and how large is their
   spread `s`? How close was your expectation from task 1?
4. To what fraction did the spread shrink from window 1 to window 10, and
   what did that cost in seconds per value?

> [!SOLUTION]
> Averaging several readings reduces the spread roughly by the square root of
> their number: to just under 0.6 for window 3, just under 0.45 for window 5
> and about 0.32 for window 10, so to a third and not to a tenth. The answer to
> task 2 is therefore "less". In return every value takes as much longer as it
> contains readings: with a pause of 0.2 seconds, a value in window 10 takes
> about two seconds instead of a fifth of a second. If your spread shrinks
> clearly less, something probably drifts slowly along, such as the light in
> the room, and averaging cannot remove such a drift.

## Step 2: the neighbouring colour and the ratio d/s

- Now let colour B shine and measure in the same way.
- Work out for each window the distance `d` between the two means.
- Take the larger of the two spreads as `s` and divide `d` by `s`.

The two bands do not touch as long as `d` is larger than `6 · s`, that is as
long as `d/s` stays above 6.

| Window | mean A | mean B | distance d | larger s | d/s | bands apart? |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 3 | | | | | | |
| 5 | | | | | | |
| 10 | | | | | | |

5. From which window on are the bands of your two colours apart?
6. What would it mean for your speed to use this window all the time?

> [!SOLUTION]
> Averaging hardly moves the means, so the distance `d` stays roughly the same
> across all windows and only `s` shrinks. That is why `d/s` grows with the
> square root of the window: a pair with `d/s` = 3 in window 1 reaches about
> 6.7 in window 5 and is apart there. Every symbol then needs five readings
> instead of one, however, and your link carries only a fifth as many symbols
> per second. If `d/s` is below 2 already in window 1, even window 10 is barely
> enough, and it pays more to choose two colours that lie further apart.

## Step 3: how many symbols fit?

- Measure the floor: the LED off.
- Measure the ceiling: the LED white.
- Use for both the window you would use for your transmission.

The range is the ceiling minus the floor, a band is `6 · s` wide, and the range
divided by the width of one band tells you how many symbols fit if you spread
them evenly.

```python
# replace the placeholders with your own values
floor = 40      # c with the LED off
ceiling = 840   # c with the LED white
s = 8.3         # the larger spread of your two colours, in the window you use

band = 6 * s
symbols = int((ceiling - floor) // band)
print(f"range {ceiling - floor}, band {band:.0f} wide, room for {symbols} symbols")
```

| | Value |
|---|---|
| Window | |
| Floor (LED off) | |
| Ceiling (LED white) | |
| Range | |
| Width of one band (6 · s) | |
| Symbols that fit | |
| Your alphabet from Challenge 1 | |

7. How many symbols fit according to your calculation, and how many did you
   actually reach in Challenge 1?
8. If the calculation is higher than your alphabet, look for the reason: what
   does the calculation assume that is not true of your link?
9. The calculation only knows the channel `c`, that is only the brightness.
   What does that mean for the number of symbols your link can carry?

> [!SOLUTION]
> The calculation assumes that your colours are spread evenly between floor
> and ceiling, that they all scatter equally and that the light stays the same
> between calibrating and measuring. Usually at least one of these is not
> true: colours crowd together in `c`, bright colours scatter more than dark
> ones, or the light has changed. Conversely, two colours that lie almost at
> the same place in `c` can differ clearly in `r`, `g` or `b`. If your receiver
> compares all three colour channels, the link can therefore carry more symbols
> than the calculation with `c` alone gives.

## Evaluation

- Which measure would you try next to increase `d/s`: a shorter distance, a
  shield against the room light, colours that lie further apart or a longer
  window? What does each of them cost?
- Would you rather send many symbols with a long window or few with a short
  one if you want to transmit as much as possible in the same time? In the
  [[distinguishability-lab]] you can try both before you decide for your own
  link.

Why nothing but the ratio `d/s` decides the size of the alphabet, and what
every measure against noise costs, is explained in the lesson
[[signal-and-noise]] with its slides, which also shows how to set up a
measurement series properly, with a control reading and exactly one changed
quantity.

> [!NOTE]
> With a whole group, every team measures its own spread and enters three
> numbers in a shared table on the board: the alphabet it reached, `d/s` for
> window 1 and the number of symbols that fit according to the calculation.
> Sorted by the alphabet reached, the group then sees whether the ranking of
> the teams follows the ranking of `d/s` and which teams depart from it.
