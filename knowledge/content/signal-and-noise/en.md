---
type: lesson
code: 5380
title: Signal, noise and the size of an alphabet
summary: >-
  Two links with the same hardware carry sixteen symbols in one case and four
  in the other. The difference lies not in the program but in the ratio of the
  distance between two symbols to the spread of the readings around each.
objectives:
  intro: "This lesson shows you why the spread of the readings decides how many symbols a link can carry, and afterwards you can:"
  goals:
    - "describe a series of readings by its mean and its spread with `statistics.mean()` and `statistics.stdev()`"
    - "explain why averaging over longer windows calms the values and what that costs in readings per second"
    - "explain why two symbols are only safely distinguishable when their clouds do not overlap, and why the ratio of distance to spread is what counts"
    - "calculate from the usable range and the spread how many symbols fit into a link"
    - "rank the ways of improving the ratio by what they cost in bits per symbol or symbols per second"
level: 1
duration: 25
topics: [transferring-information]
modules: [dup]
relations:
  requires: [measurement-and-experiments]
  see_also: [place-value-systems, measuring-your-noise]
status: draft
updated: 2026-11-04
---

![Slides: Signal and noise](item:signal-and-noise-slides)

A lighthouse in fog is a strange sight. The lamp burns exactly as brightly as
on a clear night, and yet the beam dies after a few metres, because nothing
has happened to the signal but a great deal has happened to everything around
it.

The same holds for a link that carries data as light from an LED to a colour
sensor. Two groups with the same LED, the same sensor and the same room can
end up with alphabets of sixteen and of four colours, and the quality of their
programs does not explain the gap. What explains it is how much the readings
scatter, and this lesson shows how to measure that and how to calculate with
it.

## Ten readings of one colour

Point a sensor at one colour and read it ten times without changing anything,
and you get ten different numbers, say 214, 211, 218, 209, 216, 213, 220, 207,
215 and 212. That surprises people, because a computer is the one machine that
reliably gives the same output for the same input, but the sensor never gets
the same input twice: the light flickers, the electronics hiss, someone walks
past. This variation is called **noise**, and every measuring instrument has
it.

Two numbers describe such a series, the **mean**, which says where the colour
sits, and the **spread**, which says how far it wanders. Python's module
`statistics` provides both:

```python
import statistics

readings = [214, 211, 218, 209, 216, 213, 220, 207, 215, 212]

print("mean:", statistics.mean(readings))
print("spread:", round(statistics.stdev(readings), 1))
print("from", min(readings), "to", max(readings))
```

The colour sits at 213.5 and wanders between 207 and 220. `statistics.stdev()`
gives the standard deviation, the usual measure of spread, which is roughly
the typical distance of a reading from the mean, here 4.0. A single reading
tells you almost nothing on its own, since 220 could be this colour or a
neighbouring one having a bad moment, and only the whole series shows where
the colour sits and how far it strays.

## Measuring longer makes it calmer

There is a way to make the numbers calmer: measure for longer and average what
arrives. The drawing shows a raw signal at the top and below it the same
signal averaged over windows of 4, 12 and 32 readings, where every thick bar
is one averaged value.

![Four strips one above the other. At the top a restless line of 288 raw readings around a dashed level. Below it the same signal as averaged bars: 72 short bars for windows of 4, 24 for windows of 12 and 9 long bars for windows of 32. The longer the window, the closer the bars lie to the dashed level.](figure:windows "The same raw signal, averaged over windows of growing length. Longer windows give calmer values, and fewer of them.")

The longer the window, the closer the bars settle to the true level, but the
same stretch of time now holds only 72, 24 and finally 9 values instead of
288. Calm is paid for in readings per second, and readings per second are what
the speed of a transmission is made of. The program draws 288 noisy readings
of a constant light with `random.gauss()` and averages them in the same
windows:

```python
import random
import statistics

random.seed(6)
# 288 raw readings of one constant light: level 500, noise 20
raw = [random.gauss(500, 20) for _ in range(288)]

for window in [1, 4, 12, 32]:
    means = [statistics.mean(raw[i:i + window]) for i in range(0, len(raw), window)]
    spread = statistics.stdev(means)
    print(f"window of {window}: {len(means)} values, spread {spread:.1f}")
```

The spread falls from 20.3 to 10.3, 5.8 and 3.9, but not in step with the
window: four times the window only halves it, because the spread of a mean
shrinks with the square root of the number of readings it averages. Ten times
calmer values would therefore cost a hundred times as many readings.

## Two symbols, two clouds

Now put two symbols on the same scale. Each of them is not a single value but
a cloud of values, and the width of the cloud is the noise you just measured.

![Two panels with two bell-shaped clouds each, symbol a and symbol b, at the same distance d and with a dashed boundary between them. On the left the clouds are narrow and the boundary lies in empty space. On the right the clouds are wide, and the parts that reach across the boundary are red.](figure:two-clouds "The same distance d, twice. With narrow clouds every reading lands on its own side, with wide ones the red parts are the readings the receiver gets wrong.")

Neither number decides on its own: the distance between two symbols means
nothing without the width of the clouds, and the width means nothing without
the distance. What counts is the ratio *d*/*s* of the distance *d* between
the means of two symbols to the spread *s* of the readings around each.
**Safely distinguishable** therefore does not mean that the means differ, but
that the clouds do not overlap, not even at their outermost readings, because
a single reading that strays across the boundary is a wrong symbol. The
program compares two colours with ten readings each:

```python
import statistics

a = [214, 211, 218, 209, 216, 213, 220, 207, 215, 212]
b = [251, 247, 255, 244, 252, 249, 258, 246, 250, 253]

d = statistics.mean(b) - statistics.mean(a)
s = max(statistics.stdev(a), statistics.stdev(b))
print("d =", d)
print("s =", round(s, 1))
print("d / s =", round(d / s, 1))
print("gap between the clouds:", min(b) - max(a))
```

The means lie 37 apart, almost nine times the spread, and between the highest
reading of `a` and the lowest of `b` there are still 24 units of empty space,
so these two colours are safely distinguishable. Move `b` closer by adding the
line `b = [value - 25 for value in b]` below the two lists: the gap becomes
negative, which means the clouds overlap. Notes on a colour that hold only its
mean therefore cannot say whether the colour is usable.

## How many symbols fit?

Once you think in bands rather than in points, the question of how many
colours a link can use becomes arithmetic. You measure the usable range, from
the darkest to the brightest value the link produces reliably, and the width
of one cloud, and then you divide.

![A scale from 40 at the bottom to 840 at the top, filled twice. On the left four bands, each 200 wide, with 800 / 200 = 4 below them; on the right sixteen narrow bands, each 50 wide, with 800 / 50 = 16 below them.](figure:how-many "The same range, filled with wide and with narrow bands. The narrower each band, the more of them fit.")

An example: the range runs from 40 to 840, so it is 800 units wide, and every
colour scatters around its mean by up to 25 in either direction. Its band is
therefore 50 wide and not 25, because the cloud reaches out on both sides, and
800 divided by 50 gives 16:

```python
floor = 40      # darkest value the link produces reliably
ceiling = 840   # brightest value
spread = 25     # every symbol wanders up to 25 either side of its mean

band = 2 * spread
print((ceiling - floor) // band, "symbols fit")
```

Set `spread` to 100, and only 4 symbols fit. The two groups from the beginning
of this lesson may differ in nothing but this number, and doing the
calculation before trying out colours saves an afternoon spent on alphabets
that could never have worked. The experiment [[measuring-your-noise]] takes
these steps on a real link, from ten readings of one colour to the number of
symbols that fit.

## The knobs have price tags

There are several ways to improve the ratio, and hardly any of them is free:

| Way | Effect | Cost |
|---|---|---|
| pick colours further apart | *d* gets bigger | fewer symbols fit into the range |
| use fewer symbols | *d* gets bigger | fewer bits per symbol |
| aim the light better | *d* gets bigger | only craft |
| longer integration time | *s* gets smaller | fewer symbols per second |
| average several readings | *s* gets smaller | fewer symbols per second |
| block ambient light | *s* gets smaller | only craft |
| fix the geometry | *s* gets smaller | only craft |

Averaging in software is the same bargain as a longer integration time in the
sensor, only made at a different place. The function `read_stable()` reads
ten times and returns the mean, and here `read_clear()` stands in for the
sensor and returns one reading with noise:

```python
import random
import statistics

def read_clear():
    # stands in for the sensor: one reading of a constant light, with noise
    return random.gauss(500, 20)

def read_stable(n=10):
    values = [read_clear() for _ in range(n)]
    return sum(values) / n

random.seed(2)
single = [read_clear() for _ in range(100)]
stable = [read_stable() for _ in range(100)]
print("spread of single readings:", round(statistics.stdev(single), 1))
print("spread of read_stable():", round(statistics.stdev(stable), 1))
```

The averaged values scatter about a third as much as single ones, 6.3 instead
of 21.5, and each of them costs ten readings. That is no argument against
averaging, but an argument for measuring what it costs instead of assuming it
is free. The three ways that cost only craft are the exception: aiming the
light, shutting out ambient light and fixing the distance with a tube or a
stand improve the ratio without giving up bits or speed.

## Both roads lead to the same wall

There are two ways to get more out of a link, and people usually want both at
once: more symbols narrow the bands, and faster symbols widen the clouds,
since a shorter window averages over less light. Both spend the same safety
margin, of which there is only one. It is the same trade-off between more
information per symbol and more errors that makes computers work with
[[place-value-systems|two states]].

Everything in this lesson is a property of one particular link, with its room,
its distance and its ambient light. A link calibrated by the window in
daylight will not match in a darkened room, because the means and the spread
change there, so the boundaries have to be measured again where the link is
used. No amount of reading and no language model has access to that, since
the channel itself is the only authority.

## Takeaways

- Every measurement scatters, so a series is described by its mean and its
  spread, and a single reading says almost nothing.
- Averaging over longer windows calms the values, but the spread falls only
  with the square root of the window, and every averaged value costs readings.
- Two symbols are safely distinguishable when their clouds do not overlap,
  and what counts is the ratio of distance to spread, not the means alone.
- The number of symbols that fit is the usable range divided by the width of
  one band, which is twice the spread.
- Nearly every improvement costs bits per symbol or symbols per second, except
  aiming the light, blocking ambient light and fixing the geometry.

![Quiz: Signal and noise](item:signal-and-noise-quiz)
