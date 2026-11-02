---
type: lesson
code: 7942
title: How a measurement becomes evidence
summary: >-
  A single reading is a draw, not a fact. What a sensor really returns, why
  readings scatter, what averaging and the integration time cost, and how a
  measurement series with one changed quantity turns into evidence.
objectives:
  intro: "Using a colour sensor that reads the light of an LED, this lesson shows you why a single reading is not yet evidence, and afterwards you can:"
  goals:
    - "explain why a sensor returns four numbers instead of a colour, and why you calibrate and classify instead of calculating back to what was sent"
    - "show with a simulation in Python how averaging five or ten readings removes wrong decisions and what it costs in symbols per second"
    - "explain what a control reading with the LED switched off is for and how the integration time trades calm readings for speed"
    - "plan a measurement series with a written expectation, exactly one changed quantity, enough repetitions and a complete record"
    - "work out why five hits in a row can be luck while fifty cannot"
level: 1
duration: 25
topics: [transferring-information]
modules: [dup]
relations:
  see_also: [measuring-and-experimenting, sent-is-not-measured, believed-and-measured]
status: published
updated: 2026-11-01
---

Whether a real setup behaves the way you expect can only be decided by
measuring it, not by thinking, by a gut feeling or by an AI assistant. For two
thousand years people believed Aristotle that heavy bodies fall faster than
light ones, and as the story goes, two balls dropped from the Leaning Tower of
Pisa were enough to end the error. Every setup on a table is such a tower: an
assistant knows sensors of this kind, but only a measurement knows this one.
The examples in this lesson use a colour sensor that reads the light of an
LED, as in a link that transmits data with light, and any other sensor behaves
the same way in principle.

## What a sensor returns

A colour sensor does not return a colour but four numbers: the shares of red,
green and blue, measured behind colour filters and written `r`, `g` and `b`,
and a fourth value `c` for *clear*, measured without a filter. Because clear
sees all the incoming light, it is more sensitive than the colour channels and
the most useful value when you only need to tell bright from dark.

None of these numbers matches what the LED was given. Set the LED to pure red,
`(255, 0, 0)`, and the sensor measures something like `r=203, g=41, b=57`,
because the colour filters overlap, distance and angle swallow light, and the
room light is always measured as well. That is not a defect but the normal
case, and it has a consequence: you do not calculate backwards from the
readings to what was sent, since a formula that fits today fails at the next
table or on the next day. Instead you **calibrate**, by reading every colour
you intend to send several times and keeping these readings as references,
and then you **classify**, by assigning each new reading to the nearest group
of references.

![A coordinate system with the red share r to the right and the blue share b upwards. Six red reference readings form a cloud at the bottom right, six blue ones a cloud at the top left. A new reading at r 170, b 80 is joined to both clouds by dashed lines; the shorter line, to the red cloud, is highlighted, and the new reading takes the colour red.](figure:calibration "Calibrate, then classify: a new reading belongs to the nearest cloud of references. The green share stays roughly the same here and is left out.")

Python can make this decision. The program keeps the references from the
drawing as pairs `(r, b)`, computes the centre of each group and compares the
distance of the new reading to both centres with `math.dist()`:

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
reading almost exactly between the two groups: the distances then differ by a
single unit, and a little noise decides which colour comes out. The experiment
[[sent-is-not-measured]] lets you see the gap between what is sent and what is
measured on a real device.

## One reading is a draw

Read the same red LED five times without changing anything, and you get five
different values, say 198, 205, 201, 195 and 206. None of them is the true one,
and yet each is a real measurement, because every real measurement scatters:
the light flickers, the electronics hiss, someone walks past the window. Five
identical values would be more suspicious than five different ones. A single
reading jumps around while the average of several sits still, so if you need a
stable value, you read several times and take the mean.

How much that matters shows as soon as a receiver has to decide. A sender
switches its LED off and on in turn, and the receiver reads the sensor and
decides at a threshold which of the two arrived. The drawing lets the same
readings decide three times: from a single reading, from the mean of five and
from the mean of ten.

![Three horizontal tracks with a dashed threshold through the middle and thirty dots each, alternately below and above it. In the top track, one reading per decision, three dots lie on the wrong side and are red. In the tracks for the mean of five and the mean of ten, every dot is on its own side. On the right stand the costs: 30 readings and 20 symbols per second, 150 readings and 4 symbols per second, 300 readings and 2 symbols per second.](figure:decisions "Thirty decisions from the same readings. A dot on the wrong side of the dashed threshold is a wrong decision.")

Three of the thirty single readings land on the wrong side of the threshold,
while none of the averages does. The price stands on the right: the same
thirty decisions need five or ten times as many readings, and a sensor that
delivers twenty readings per second then carries four or two symbols per
second instead of twenty. The program below simulates such a receiver.
`random.gauss()` draws a reading that scatters around a level with a given
spread, here 300 for off and 700 for on, and everything below 500 counts as
off:

```python
import random
import statistics

random.seed(1)
noise = 130       # how much a single reading wobbles
threshold = 500   # below means off, above means on
wrong = {1: 0, 5: 0, 10: 0}

for i in range(30):
    level = 700 if i % 2 else 300      # off and on, one after the other
    readings = [random.gauss(level, noise) for _ in range(10)]
    for n in wrong:
        value = statistics.mean(readings[:n])
        if (value > threshold) != (level > threshold):
            wrong[n] += 1

for n, count in wrong.items():
    print(f"{n} reading(s) per decision: {count} of 30 wrong, {30 * n} readings")
```

With a spread of 130, the single readings get 3 of the 30 symbols wrong and
both averages get every one right. Set `noise` to 250, as in a noisier room,
and the single readings get 8 wrong while even the mean of five slips once.
Then delete the line with `random.seed(1)`, so that every run draws new
readings and the counts change from run to run, exactly as they would in a
real measurement. Which case applies depends on the setup: with little noise a
single reading already decides correctly and averaging only costs time, so
only a measurement on your own setup tells you how many readings a decision
needs.

## Measure the dark first

There is a second reason to measure more than once. A sensor never reads zero,
because some room light always arrives, and so every measurement series starts
with a **control reading** with the LED switched off. It is the zero point
every colour is read against: what the LED adds is the difference between a
reading and this ambient level, and every reading carries ambient light, the
light of the LED and noise at the same time. The control reading also tells
you when the surroundings change, through afternoon sun or a lamp nearby,
because then the dark reading moves as well.

## The knob: integration time

The **integration time** is the sensor's reading window and decides over how
much light a single value is averaged. A long window gives calm values but few
of them per second, a short one gives many readings that scatter more, until
single ones slide into the range of another colour.

![Three rows show the same second. Every reading is a bar whose width is its time window: four wide bars in the top row, eight in the middle and twelve narrow ones at the bottom. The wider the bars, the closer they stay to the middle of a gray band; in the bottom row two bars leave the band and are red.](figure:integration "The same second, read with long, medium and short windows. The shorter the window, the more readings, and the more they scatter.")

Longer is calmer and shorter is faster, and that trade-off returns in every
transmission with a sensor, since the symbol rate depends on it. The **gain**
is the second knob: it scales the values and the noise along with them, and
too much of it drives the sensor into saturation. Where the best setting lies
is answered by no table and no assistant, only by a measurement series on the
setup itself, and [[signal-and-noise]] works out what the setting means for
the number of symbols a link can carry.

## Measuring on purpose

A **measurement series** is several readings under equal, recorded
conditions, in which at most one quantity is changed on purpose. If one group
changes the distance and the integration time at once while another changes
only the distance, both may see their recognition improve, but only the
second knows what caused it. A series follows a few rules before, during and
after measuring:

| When | What you do | Why |
|---|---|---|
| before | write down the conditions and the result you expect | without a written expectation, almost any outcome can be read as a success afterwards |
| during | change exactly one quantity, take a control reading, repeat often enough | only then can a difference be put down to its cause |
| after | keep every value, compare with the expectation, record the outcome | outliers are often the most interesting information |

The record therefore holds the conditions, the changed quantity, the number of
repetitions and all the values, including the uncomfortable ones. A repeatable
result is worth more than an impressive one.

## Luck or skill

Repetitions protect you against a lucky hit. A receiver that only has to tell
red from blue is right every second time by pure guessing, so five hits in a
row prove little. The program lets a guesser make a thousand attempts of five
decisions each and counts the attempts without a single miss:

```python
import random

random.seed(4)
lucky = 0
for attempt in range(1000):
    hits = 0
    for trial in range(5):
        guess = random.choice(["red", "blue"])
        sent = random.choice(["red", "blue"])
        if guess == sent:
            hits += 1
    if hits == 5:
        lucky += 1
print(lucky, "of 1000 attempts hit 5 of 5 by guessing")
```

About one attempt in 32 succeeds by chance, here 32 of 1000, because the
chance of five hits in a row is 0.5⁵ = 1/32, and in a room full of groups such
a lucky streak happens somewhere all the time. Fifty hits in a row have a
chance of one in 2⁵⁰, which is one in 1,125,899,906,842,624, so they
practically never happen by luck. That is why a receiver is tested with long
series.

## When the assistant and the measurement disagree

Suppose an AI assistant suggests raising the gain because that would improve
recognition, and your measurement series shows the recognition rate falling
from 94 to 82 per cent. Before you treat the suggestion as refuted, check your
own series: was only one quantity changed, were there enough repetitions, was
there a control reading? If the series was clean, it wins, because the
assistant knows sensors of this kind but not your setup. The case then goes
into a log of mistakes with the suggestion, the measurement and the outcome,
so that what was learned is not lost. The experiment [[believed-and-measured]]
runs through such a check on a real device. Put shortly, what you did not
measure, you do not know.

## Takeaways

- A sensor returns numbers, not a colour, and they never match what was sent,
  so you calibrate with known colours and assign each new reading to the
  nearest references.
- A single reading is a draw, and averaging several removes wrong decisions at
  the price of more readings and therefore fewer symbols per second.
- A control reading with the LED switched off gives the ambient level that
  every other reading is read against.
- A longer integration time gives calmer but fewer readings, a shorter one
  more readings that scatter more.
- A measurement series has a written expectation, exactly one changed
  quantity, enough repetitions and a record of every value.
- Five hits in a row can be luck while fifty cannot, and a clean series
  outweighs any suggestion, however well it is argued.
