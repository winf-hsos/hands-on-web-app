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
based_on: 2026-11-09
---

You measure a single colour again and again without changing anything and see
how far the numbers wander all the same. From this spread, the distance to the
neighbouring colour and the range between the darkest and the brightest value
you finally work out how many symbols your link can carry, and compare that
with the alphabet you reached in Challenge 1. The experiment assumes that your
link already works: the LED of one device shines into the sensor of the other,
and you can address both from Python. The twelve tasks are numbered through
the whole page.

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

1. Place the two devices as you used them in Challenge 1 and write down the
   distance and whether the ceiling light is on. After that, change nothing
   about them until the end of the experiment: not the distance, not the optics
   and not the light in the room.

With two laptops, the sending program runs on one and the receiving program on
the other. If both devices hang on one laptop, start the two programs in two
terminals, remove the `#` in front of the line with `use_device` in each and
enter the UID of the respective master brick from the Brick Viewer.

## Before: your expectation

2. Write down, before you measure, how far apart ten readings of the same
   colour will lie in the clear channel `c`, from the smallest to the largest
   value, and how much calmer the mean will become if you combine ten readings
   each time: ten times calmer or less?

In task 5 you compare your expectation with your numbers.

## The programs

The sending program shows your two colours one after the other, then black and
white, each until you press Enter.

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
and their spread `s`, and how long the measurement took. At the top of the
program you set the gain and the integration time of the sensor, exactly as in
your `alphabet.py` from Challenge 1, so that the spread fits your alphabet. The
sensor measures at its own pace, one measurement per integration time, and
`sensor.read()` fetches the newest finished measurement without waiting. Read
faster and you get the same value several times and take it for a calm link;
that is why the program waits a little longer than one integration time between
two readings. With 154 ms one run takes a good half minute, with 700 ms more
than two minutes, and an empty input ends the program.

```python static
import statistics
import time

from lifi_hardware import sensor, use_device

# only with both devices on one laptop: the UID of the receiving master brick
# use_device("Xy12Ab")

GAIN = 16                # the same two settings as at the top of your alphabet.py
INTEGRATION_TIME = 154   # in ms: 2.4, 24, 101, 154 or 700
WINDOWS = [1, 3, 5, 10]

sensor.set_gain(GAIN)
sensor.set_integration_time(INTEGRATION_TIME)
# the sensor measures once per integration time, and read() returns the newest
# finished measurement without waiting: so wait a little longer than one
# integration time between two readings, and two before the first
PAUSE = INTEGRATION_TIME / 1000 + 0.02
time.sleep(2 * INTEGRATION_TIME / 1000)


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

3. Enter your two colours at the top of the sending program and `GAIN` and
   `INTEGRATION_TIME` from your `alphabet.py` in the receiving program, write
   down both values, and start the sending program on the sending device and
   the receiving program on the receiving one.

## Ten readings of one colour

4. Let colour A shine, type its name into the receiving program and enter for
   each window the ten values, their mean, the spread `s` and the seconds per
   value in the table.

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

5. Read off in the row for window 1 how far apart your ten readings lie and
   how large their spread `s` is, and compare both with your expectation from
   task 2.
6. Work out to what fraction the spread shrank from window 1 to window 10 and
   what that cost in seconds per value.

> [!SOLUTION]
> Averaging several readings reduces the spread roughly by the square root of
> their number: to just under 0.6 for window 3, just under 0.45 for window 5
> and about 0.32 for window 10, so to a third and not to a tenth. The answer to
> task 2 is therefore "less". In return every value takes as much longer as it
> contains readings: with an integration time of 154 ms, a value in window 10
> takes about 1.7 seconds instead of just under a fifth of a second. Averaging
> in the program is the same bargain as a longer integration time in the
> sensor. If your spread shrinks
> clearly less, something probably drifts slowly along, such as the light in
> the room, and averaging cannot remove such a drift.

## The neighbouring colour and the ratio d/s

7. Now let colour B shine and measure in the same way as in task 4.
8. Work out for each window the distance `d` between the two means, take the
   larger of the two spreads as `s`, divide `d` by `s` and enter everything in
   the table.

The two bands do not touch as long as `d` is larger than `6 · s`, that is as
long as `d/s` stays above 6.

| Window | mean A | mean B | distance d | larger s | d/s | bands apart? |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 3 | | | | | | |
| 5 | | | | | | |
| 10 | | | | | | |

9. Read off from which window on the bands of your two colours are apart, and
   write down what it would mean for your speed to use this window all the
   time.

> [!SOLUTION]
> Averaging hardly moves the means, so the distance `d` stays roughly the same
> across all windows and only `s` shrinks. That is why `d/s` grows with the
> square root of the window: a pair with `d/s` = 3 in window 1 reaches about
> 6.7 in window 5 and is apart there. Every symbol then needs five readings
> instead of one, however, and your link carries only a fifth as many symbols
> per second. If `d/s` is below 2 already in window 1, even window 10 is barely
> enough, and it pays more to choose two colours that lie further apart.

## How many symbols fit?

10. Measure the floor with the LED off and the ceiling with the LED white, both
    in the window you would use for your transmission.

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

11. Put the floor, the ceiling and the larger spread into the program and enter
    the result in the table, together with the alphabet you actually reached
    in Challenge 1.

| | Value |
|---|---|
| Window | |
| Floor (LED off) | |
| Ceiling (LED white) | |
| Range | |
| Width of one band (6 · s) | |
| Symbols that fit | |
| Your alphabet from Challenge 1 | |

12. Compare the calculation with your alphabet. If it promises more symbols
    than you reached, write down what the calculation assumes that is not true
    of your link.

> [!SOLUTION]
> The calculation assumes that your colours are spread evenly between floor
> and ceiling, that they all scatter equally and that the light stays the same
> between calibrating and measuring. Usually at least one of these is not
> true: colours crowd together in `c`, bright colours scatter more than dark
> ones, or the light has changed.

## Evaluation

- The calculation only knows the channel `c`, that is only the brightness.
  What does that mean for the number of symbols your link can carry?

- Which measure would you try next to increase `d/s`: a shorter distance, a
  shield against the room light, colours that lie further apart or a longer
  window? What does each of them cost?
- Would you rather send many symbols with a long window or few with a short
  one if you want to transmit as much as possible in the same time? In the
  [[distinguishability-lab]] you can try both before you decide for your own
  link.

> [!SOLUTION]
> Two colours that lie almost at the same place in `c` can differ clearly in
> `r`, `g` or `b`. If your receiver compares all three colour channels, the
> link can therefore carry more symbols than the calculation with `c` alone
> gives.

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
