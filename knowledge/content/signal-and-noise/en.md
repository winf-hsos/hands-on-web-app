---
type: lesson
code: 5380
formerly: [measurement-and-experiments, sent-is-not-measured]
title: Signal and noise
summary: >-
  Two links with the same hardware carry sixteen symbols in one case and four
  in the other. This lesson shows what a sensor really returns, why the ratio
  of the distance between two symbols to the spread of the readings decides the
  size of an alphabet, and how a clean measurement series shows whether an
  improvement worked.
objectives:
  intro: "Using a colour sensor that reads the light of an LED, this lesson shows you why the spread of the readings decides how many symbols a link can carry, and afterwards you can:"
  goals:
    - "explain why the sensor returns four numbers `r`, `g`, `b` and `c` instead of a colour, why they differ from what was sent, and why every series starts with a control reading in the dark"
    - "describe a series of readings by its mean and its spread with `statistics.mean()` and `statistics.stdev()`"
    - "explain why averaging over longer windows or a longer integration time calms the values and what that costs in readings per second"
    - "argue why two symbols are only safely distinguishable when their clouds do not overlap, and calculate from the usable range and the spread how many symbols fit"
    - "calibrate with reference readings of known colours and assign a new reading to the nearest cloud"
    - "rank the ways of improving the ratio of distance to spread by what they cost in bits per symbol or symbols per second"
    - "plan a measurement series with a prediction written down beforehand, exactly one changed quantity and enough repetitions, and explain why five hits in a row can be luck while fifty cannot"
level: 1
duration: 40
topics: [transferring-information]
modules: [dup]
relations:
  requires: [symbols-and-information]
  see_also: [analog-and-digital, measuring-your-noise]
status: published
updated: 2026-11-08
---

![Slides: Signal and noise](item:signal-and-noise-slides)

Two groups with the same LED, the same colour sensor and the same room can end
up with alphabets of sixteen and of four colours, and the quality of their
programs does not explain the gap. What explains it is how much the readings
scatter. This lesson starts with what a sensor really returns, works out from
the scatter how many symbols a link can carry, and ends with the question of
how you find out whether an improvement really helped. The examples use a
colour sensor that reads the light of an LED, and any other sensor behaves the
same way in principle.

## What a sensor returns

A colour sensor does not return a colour but four numbers: the shares of red,
green and blue, measured behind colour filters and written `r`, `g` and `b`,
and a fourth value `c` for *clear*, measured without a filter. Because clear
sees all the incoming light, it is the most sensitive channel and the most
useful one when you only need to tell bright from dark. In the pattern of
input, processing and output, these four numbers are the input of the
receiving program, and only the processing turns them into a name such as
`"red"`.

None of these numbers matches what the LED was given. Set the LED to pure red,
`(255, 0, 0)`, and the sensor measures something like `r=203, g=41, b=57` and
`c=310`, because the colour filters overlap, distance and angle swallow light,
and the room light is always measured as well. That is not a defect but the
normal case, and it has a consequence: you do not calculate backwards from the
readings to what was sent, since a formula that fits today fails at the next
table or on the next day. Instead you work with the readings of your own
setup, and the section on calibrating shows how a program decides from them
which colour arrived.

## Measure the dark first

Before you measure a colour, you measure the dark, because a sensor never
reads zero: some room light always arrives. Every measurement series therefore
starts with a **control reading** with the LED switched off. Every reading
carries ambient light, the light of the LED and noise at the same time, and
what the LED adds is the difference between a reading and this ambient level.
The control reading also tells you when the surroundings change, through
afternoon sun or the LED of a neighbouring team, because then the dark reading
moves as well.

## Ten readings of one colour

Point the sensor at one colour and read it ten times without changing
anything, and you get ten different numbers, say 214, 211, 218, 209, 216, 213,
220, 207, 215 and 212. That surprises people, because a computer is the one
machine that reliably gives the same output for the same input, but the sensor
never gets the same input twice: the light flickers, the electronics hiss,
someone walks past. This variation is called **noise**, and every measuring
instrument has it, so ten identical values would be more suspicious than ten
different ones.

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
neighbouring one having a bad moment. Two series can also share their mean and
scatter very differently, so a record that holds only the mean hides exactly
the fluctuation that later leads to wrongly recognised symbols, and the spread
belongs in it as well.

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

The sensor can do the same averaging itself. Its **integration time** is the
reading window over which a single value collects light, and a longer one
gives calmer values but fewer of them per second, exactly like averaging in
the program. The **gain** is the second knob: it scales the values and the
noise along with them, and too much of it drives the sensor into saturation.

Whether averaging pays off depends on how noisy the sensor is. In the
demonstrator below the same readings decide three times, alone, over five and
over ten, and you can turn the noise up and down yourself.

![The noisy sensor](item:noisy-sensor)

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
negative, which means the clouds overlap.

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
that could never have worked. More symbols narrow the bands, and faster
symbols widen the clouds, because a shorter window averages over less light,
so both spend the same safety margin, as [[analog-and-digital]] shows from
the other side. The exercise [[measuring-your-noise]] takes these steps on a
real link, from ten readings of one colour to the number of symbols that fit.

In the distinguishability lab below you can turn all of these knobs at once,
the number of symbols, the length of the window and a disturbance, and watch
the error rate and the throughput pull against each other.

![The distinguishability lab](item:distinguishability-lab)

## Calibrate, then classify

The clouds also tell the receiver which colour arrived. Instead of calculating
backwards from the four numbers, you **calibrate**, by reading every colour
you intend to send several times under the conditions of your own setup and
keeping these readings as references, and then you **classify**, by assigning
each new reading to the nearest cloud of references:

![A coordinate system with the red share r to the right and the blue share b upwards. Six red reference readings form a cloud at the bottom right, six blue ones a cloud at the top left. A new reading at r 170, b 80 is joined to both clouds by dashed lines; the shorter line, to the red cloud, is highlighted, and the new reading takes the colour red.](figure:calibration "Calibrate, then classify: a new reading belongs to the nearest cloud of references. The green share stays roughly the same here and is left out.")

The program keeps the references from the drawing as pairs `(r, b)`, computes
the centre of each cloud and compares the distance of the new reading to both
centres with `math.dist()`:

```python
import math
import statistics

# reference readings (r, b) of colours you know, measured beforehand
red = [(188, 50), (195, 62), (198, 58), (200, 55), (205, 70), (210, 48)]
blue = [(30, 195), (35, 210), (40, 215), (45, 220), (50, 205), (55, 198)]

def centre(points):
    r = statistics.mean(p[0] for p in points)
    b = statistics.mean(p[1] for p in points)
    return (r, b)

new = (170, 80)
to_red = math.dist(new, centre(red))
to_blue = math.dist(new, centre(blue))
print("distance to red:", round(to_red))
print("distance to blue:", round(to_blue))
print("red" if to_red < to_blue else "blue")
```

The new reading lies 37 units from the centre of the red references and 180
from that of the blue ones, so it counts as red. Try `new = (120, 130)`, a
reading almost exactly between the two clouds: the distances then differ by a
single unit, and a little noise decides which colour comes out. The decision
rests on your own references, and that is how a colour can be recognised from
numbers that never match it.

## The knobs have price tags

There are several ways to improve the ratio *d*/*s*, and hardly any of them
is free:

| Way | Effect | Cost |
|---|---|---|
| pick colours further apart | *d* gets bigger | fewer symbols fit into the range |
| use fewer symbols | *d* gets bigger | fewer bits per symbol |
| aim the light better | *d* gets bigger | only craft |
| longer integration time | *s* gets smaller | fewer symbols per second |
| average several readings | *s* gets smaller | fewer symbols per second |
| block ambient light | *s* gets smaller | only craft |
| fix the geometry | *s* gets smaller | only craft |

The three ways that cost only craft are the exception: aiming the light,
shutting out ambient light and fixing the distance with a tube or a stand
improve the ratio without giving up bits or speed. Everything else is a trade,
and whether it pays off on your link is a question for a measurement.

## Did it really help?

Take the question whether a longer integration time improves recognition. A
plausible explanation says why it might: longer readings collect more light.
An AI assistant goes further and attaches an instruction: double the
integration time, and recognition improves. Both remain claims, however well
they are argued, and only a measurement on your own setup shows whether the
effect occurs and how strong it is. An experiment turns such a claim into a
test in four steps:

1. a **question**: does a longer window improve recognition?
2. a **prediction**, written down before measuring: with twice the window,
   more symbols are recognised correctly
3. a **measurement** under controlled conditions: 50 symbols with the short
   window and 50 with the long one
4. a **comparison** of the result with the prediction: 41 against 47 correct
   supports the hypothesis, and the opposite result would refute it

The order matters, because if you measure first and decide only afterwards
which result counts as a success, almost any outcome can be read as a fit.

## Measuring on purpose

A **measurement series** is several readings under equal, recorded
conditions, in which exactly one quantity is changed on purpose. If one team
changes the distance and the integration time at once while another changes
only the distance, both may see their recognition improve, but only the
second knows what caused it. A series follows a few rules before, during and
after measuring:

| When | What you do | Why |
|---|---|---|
| before | write down the conditions and the result you expect | without a written expectation, almost any outcome can be read as a success afterwards |
| during | change exactly one quantity, take a control reading, repeat often enough | only then can a difference be put down to its cause |
| after | keep every value, compare with the expectation, record the outcome | outliers are often the most interesting information |

Repetitions also protect you against a lucky hit. A receiver that only has to
tell red from blue is right every second time by pure guessing, so five hits
in a row happen by chance in one attempt of 32, and in a room full of teams
such a streak happens somewhere all the time. Fifty hits in a row have a
chance of one in 2⁵⁰, about one in a million billion, which is why a receiver
is tested with long series and a repeatable result is worth more than an
impressive one.

## When the assistant and the measurement disagree

Suppose an AI assistant suggests raising the gain because that would improve
recognition, and your measurement series shows the recognition rate falling
from 94 to 82 per cent. Before you treat the suggestion as refuted, check your
own series: was only one quantity changed, were there enough repetitions, was
there a control reading? If the series was clean, it wins, because the
assistant knows sensors of this kind but not your setup. The case then goes
into a log of mistakes with the suggestion, the measurement and the outcome,
so that what was learned is not lost.

Everything in this lesson is a property of one particular link, with its room,
its distance and its ambient light, so a link calibrated by the window in
daylight has to be measured again in a darkened room. No language model has
access to that, and in the end not the most beautiful explanation wins but
the cleanest measurement series.

## Takeaways

- A sensor returns numbers, not a colour, and they never match what was sent,
  so you read them against a control reading in the dark and calibrate with
  known colours.
- Every reading scatters, so a series is described by its mean and its
  spread, and a single reading says almost nothing.
- Averaging over longer windows or a longer integration time calms the
  values, but the spread falls only with the square root of the window, and
  every averaged value costs readings.
- Two symbols are safely distinguishable when their clouds do not overlap,
  and what counts is the ratio of distance to spread, not the means alone.
- The number of symbols that fit is the usable range divided by the width of
  one band, which is twice the spread.
- A new reading belongs to the nearest cloud of references.
- Nearly every improvement costs bits per symbol or symbols per second, except
  aiming the light, blocking ambient light and fixing the geometry.
- Whether an improvement helped shows a series with a prediction written down
  beforehand, exactly one changed quantity and enough repetitions, because
  five hits in a row can be luck while fifty cannot.

![Quiz: Signal and noise](item:signal-and-noise-quiz)
