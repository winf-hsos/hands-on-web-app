---
title: Colours on a number line
summary: >-
  Measure eight colours across a fixed distance, enter their values in the
  clear channel on a number line and decide which colour you would drop to be
  safe, first without and then with your own optics.
objectives:
  intro: "In this experiment you measure eight colours across a fixed distance, and afterwards you can:"
  goals:
    - "determine the smallest and the largest value of the clear channel for each colour from several readings and enter it as a band on a number line"
    - "find the pair of colours with the smallest gap and argue which of the two you would drop to be safe"
    - "explain why what decides is not the distance between the means but whether the bands touch"
    - "carry out a control measurement without aids and with your own optics, and compare the two results"
    - "pose the question of Challenge 1, how many states your link tells apart without error, from your own measurements"
translation_of: de
based_on: 2026-11-01
---

You send eight colours across your link and record where each one lands on a
number line. Two of them almost certainly lie close together, and with them
you decide how large your alphabet may be. That way you pose the question of
Challenge 1 yourselves: how many colours can the sensor tell apart reliably?

## What you need

- two devices with an RGB LED and a colour sensor, on two laptops or both on
  one
- the sending program and the receiving program below
- a ruler, tape, paper and pen
- for the control measurement, material for your own optics, such as
  cardboard, a tube, black paper or foil

## Setup

Place the two devices facing each other so that the LED of one shines into
the sensor of the other, about eight centimetres apart as in
[[sent-is-not-measured]]. Mark the position of both devices with tape, since
the distance stays the same for the whole experiment. Write down the distance
and whether the ceiling light is on.

With two laptops, the sending program runs on one and the receiving program
on the other. If both devices hang on one laptop, start the two programs in
two terminals, remove the `#` in front of the line with `use_device` in each
and enter the UID of the respective master brick from the Brick Viewer.

## Before: your expectation

Look at the eight colours once with your bare eyes, one after the other.
Write down how many of them you can tell apart reliably and which two colours
you think will lie closest together in the clear channel `c`.

## The programs

The sending program shows the eight colours one after another, each until you
press Enter.

```python static
from lifi_hardware import led, use_device

# only with both devices on one laptop: the UID of the sending master brick
# use_device("6qzRzc")

COLOURS = [
    ("red", 255, 0, 0),
    ("orange", 255, 100, 0),
    ("yellow", 255, 255, 0),
    ("green", 0, 255, 0),
    ("cyan", 0, 255, 255),
    ("blue", 0, 0, 255),
    ("magenta", 255, 0, 255),
    ("white", 255, 255, 255),
]

for name, r, g, b in COLOURS:
    led.set_color(r, g, b)
    input(f"{name} is on, Enter for the next colour ")

led.set_color(0, 0, 0)
```

The receiving program asks which colour is on, reads the sensor five times
and prints the five values of `c` with the smallest and the largest. An empty
input ends it.

```python static
import time

from lifi_hardware import sensor, use_device

# only with both devices on one laptop: the UID of the receiving master brick
# use_device("Xy12Ab")

while True:
    name = input("Which colour is on? (empty = end) ")
    if name == "":
        break
    readings = []
    for _ in range(5):
        r, g, b, c = sensor.read()
        readings.append(c)
        time.sleep(0.2)
    print(name, readings, "smallest:", min(readings), "largest:", max(readings))
```

## Round 1: without aids

Measure all eight colours with the bare devices and enter the five readings,
the smallest and the largest value in the first measurement table.

## Round 2: the number line

On paper, draw a long horizontal line from zero to a little above your
largest value and enter each colour as a short band from its smallest to its
largest value, with its name above it. Then look for the two colours whose
bands lie closest together or even overlap, and decide which of the two you
would drop to be safe.

The program in the browser sorts your bands and works out the gap between
neighbouring colours; a negative gap means that the two bands overlap.
Replace the placeholders with your own values.

```python
# replace the placeholders with your own smallest and largest values of c
bands = {
    "red": (1000, 1050),
    "orange": (1400, 1450),
    "yellow": (2600, 2650),
    "green": (1800, 1850),
    "cyan": (2400, 2450),
    "blue": (900, 950),
    "magenta": (2000, 2050),
    "white": (3800, 3850),
}

ordered = sorted(bands, key=lambda name: bands[name][0])
for lower, upper in zip(ordered, ordered[1:]):
    gap = bands[upper][0] - bands[lower][1]
    print(f"{lower} to {upper}: gap {gap}")
```

> [!TIP]
> A gap smaller than the width of the two bands is tight. Five readings show
> the band only roughly, and over 50 attempts a single outlier will find
> exactly this gap.

## Round 3: with your own optics

Now build your optics between the two devices, such as a tube, a shield
against the ceiling light or a fixed holder, without changing the marked
positions. Anything that does not itself produce or measure light is allowed.
Measure the same eight colours again, enter them in the second measurement
table and draw a second number line below the first.

## Measurement table without optics

| Colour | five readings of c | smallest value | largest value |
|---|---|---|---|
| Red | | | |
| Orange | | | |
| Yellow | | | |
| Green | | | |
| Cyan | | | |
| Blue | | | |
| Magenta | | | |
| White | | | |

## Measurement table with optics

| Colour | five readings of c | smallest value | largest value |
|---|---|---|---|
| Red | | | |
| Orange | | | |
| Yellow | | | |
| Green | | | |
| Cyan | | | |
| Blue | | | |
| Magenta | | | |
| White | | | |

## Your decision

| | without optics | with optics |
|---|---|---|
| closest pair | | |
| gap of this pair | | |
| colour dropped | | |
| colours that stay safe | | |

## Evaluation

- Which two colours lay closest together? Does that match your expectation,
  and how many colours could your eye tell apart that the sensor cannot, or
  the other way round?
- Why is it not enough for two colours to have different means?
- Which colour did you drop, and why this one rather than its neighbour? How
  many colours are left whose bands do not touch?
- What did your optics change: the position of the bands, their width or
  both? How would you have noticed without the first measurement whether it
  made any difference at all?
- Two colours that lie almost on top of each other in `c` can differ clearly
  in `r`, `g` or `b`. What would that mean for the number of your colours?
- And the question that remains is the one of Challenge 1: how many colours
  do you keep if, over 50 attempts, not a single value may fall into the band
  of another colour?

Why more regions get narrower with the same noise is shown in the lesson
[[analog-and-digital]], and how to set up such a measurement series properly
in the lesson [[measurement-and-experiments]]. That computers work with only
two states for the same reason is explained in [[why-two-states]].

> [!NOTE]
> With a whole group, one team sets up at the front, the lecturer names the
> eight colours, and the group enters the values together on a number line on
> the board before deciding which two colours to drop. Online, every team
> brings its own measurement table, and the clear values of all teams for red
> and blue go onto a common number line; that way the group also sees how
> differently the same colours land in different setups.
