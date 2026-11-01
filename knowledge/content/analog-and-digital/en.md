---
type: lesson
code: 9684
title: Analog and digital
summary: >-
  Digital does not mean electronic but finitely many clearly separated
  states. Getting there takes two cuts whose price you can count in bytes,
  and the precision they throw away buys a decision that small disturbances
  cannot change.
objectives:
  intro: "This lesson explains what digital really means and what it costs to get there, and afterwards you can:"
  goals:
    - "define digital as finitely many clearly separated states and sort everyday things such as a dimmer, a die or a split-flap display into analog and digital"
    - "show where a link that sends data with light is analog and where it is digital"
    - "explain why the same wobble that two levels absorb easily pushes readings into the neighbouring region when there are eight"
    - "tell sampling from quantising and recognise from blocks or hard patches which of the two cuts was too coarse"
    - "estimate the size of a file as points times bits per point and turn it into a transmission time"
level: 1
duration: 20
topics: [representing-information, transferring-information]
modules: [dup]
relations:
  see_also: [analog-and-digital-slides, why-two-states, colours-on-a-number-line, sent-is-not-measured, measuring-your-noise]
status: draft
updated: 2026-11-01
---

Picture the departures board of a railway station before the age of chips:
the split-flap display clatters until every letter has fallen into place.
There is no computer anywhere near it, and yet the board is perfectly
digital, because every flap rests in exactly one of its positions and while
it turns there is no valid state in between. That is also why you can read it
from twenty metres away, and it shows the point of this lesson from the
start: digital is a question of states, not of electronics.

## Finitely many states, and nothing in between

An **analog** quantity can take any value at all: between any two values lies
another one, and there is no smallest step. The brightness of a lamp, the
needle of a dial thermometer and the sand in an hourglass are analog in this
sense. A **digital** system works the other way round, and its definition
mentions no electricity at all: **digital means finitely many states, and
nothing in between counts.**

Both halves of that sentence carry weight. The first one is harmless, since
it only says that the states can be counted. The second one is where all the
engineering hangs, because if nothing between the states counts, then nothing
between the states can go wrong either. A light switch snaps into on or off, a
die on its edge tips over onto one face, and an abacus bead sits on one side
of its rod or the other, so all three are digital without a chip. The reverse
holds as well: an amplifier is electronic and still stepless, so electronics
is only today's usual carrier of digital states and not what makes them
digital.

## Where analog ends

Take a link that sends data with light. A program sets the brightness of an
LED with numbers, for example `(255, 0, 0)` for full red, the light crosses the
room, and a colour sensor at the other end turns it back into numbers. The
link therefore runs through three zones, digital, analog and digital again.

![On the left a sender box with the numbers 255, 0, 0 above it, on the right a sensor box with three readings r = 203, g = 41, b = 57. Between them the light is drawn as a restless curve under the words ambient light, distance and noise. Dashed lines divide the picture into digital, analog and digital.](figure:three-zones "The middle is physics: stepless, disturbed by ambient light, distance and noise, and controlled by no program in the world.")

The light itself is analog, since between any two brightnesses lies another.
What the program at the receiving end needs is the opposite, finitely many
states that are clearly apart, and it gets them in two steps: the sensor
measures and delivers a number, and the program decides which state that
number belongs to. That is all the word **digitising** means: representing a
signal by a finite sequence of numbers.

## The threshold is a decision

The simplest decision has two states. A program that reads brightness values
compares each of them with a threshold, and everything above it counts as
bright, everything else as dark:

```python
readings = [412, 398, 87, 405, 92, 79, 401, 388, 95, 410]
threshold = 250

symbols = []
for value in readings:
    if value > threshold:
        symbols.append("bright")
    else:
        symbols.append("dark")

print(symbols)
```

At this one comparison, hundreds of possible readings turn into two symbols.
The threshold is not a constant of nature but a decision, and from here on
the decision counts, not the physics. Set it to 400 and run the program
again: the readings 398 and 388, which clearly belong to bright, suddenly
count as dark. Where a threshold belongs is therefore not a matter of feel but
of a measurement series: first measure what bright and dark really deliver,
then put the threshold between them ([[measurement-and-experiments]]).

## How many states can you afford?

Two states are safe, but they carry little per reading. Four or eight states
would carry more, and how many you can afford has a picture, the one to
remember from this lesson.

![Three tall columns of the same height, divided into 2, 4 and 8 regions. In each, a measurement with the same wobble band sits in the second region from the bottom. With 2 and 4 regions the band stays inside its region and gets a green check; with 8 it reaches across both boundaries, is drawn in red and gets a red cross.](figure:decision-levels "The same measurement with the same wobble, three times, and only the number of regions grows.")

The noise did not grow from left to right; the margin shrank. The distance
from a measurement to the next boundary is your safety reserve, and more
regions spread the same reserve over more boundaries. With two regions the
band sits comfortably inside its own one, with four it gets tight, and with
eight the same band crosses the boundary. This is the same argument that
explains [[why-two-states|why computers work with two states]], here applied
to a sensor instead of a wire. The other half of the problem is in [[signal-and-noise]]: there the
number of symbols stays put and the spread of the readings is measured
instead, and both roads end at the same wall.

You can try it with numbers. The program below cuts a range of readings from
100 to 400 into a number of regions, numbered from 0 at the bottom. The sender
aims at the middle of the second region, region 1, and the light reaches the
sensor ten times with the wobble given in the list, so every reading is the
value that was sent plus its wobble:

```python
low, high = 100, 400       # the range of readings
levels = 2                 # try 4 and 8

# how far ten readings of the same light lay from the value that was sent
wobble = [9, -19, 23, -6, 29, -25, 3, 17, -13, -28]

width = (high - low) / levels
sent = low + 1.5 * width   # the middle of region 1

regions = []
for w in wobble:
    value = sent + w
    regions.append(int((value - low) // width))

print("Each region is", width, "wide")
print("From the middle to the boundary:", width / 2, "- largest wobble:", max(abs(w) for w in wobble))
print("Regions read:", regions)
print("In the wrong region:", len(regions) - regions.count(1), "of", len(regions))
```

With two levels the boundary lies 75 away from the middle and the largest
wobble is 29, so all ten readings land in region 1. With four levels the
distance shrinks to 37.5, which is still enough but no longer generous. With
eight it is only 18.75, and five of the ten readings land in a neighbouring
region. The wobble was the same each time; only the boundaries came closer.

Eight levels would be worth having, because each reading would then carry
three [[bit|bits]] instead of one, as [[symbols-and-information]] explains. How
many levels are safe is therefore not a matter of taste but of the wobble of
your own readings, and the width of a region has to match it.

## What the thrown-away precision buys

Digitising is a one-way street. Once a reading has been assigned to a region,
nobody can tell any more which of the infinitely many values inside that
region it really was. That loss is not an accident but the price, and what it
buys is robustness: every disturbance smaller than the distance between the
states disappears completely when the state is read.

A music cassette shows the difference. When you dub it, the tape copies the
stepless wave together with all its noise and adds noise of its own, so every
generation sounds a little worse than the one before. A file is read as a
sequence of states and set afresh at every copy, so the small disturbances of
each step vanish, and the thousandth copy is still identical to the original.
Digital technology is reliable not although it throws information away but
**because** it does.

## Two cuts

Digitising a signal always takes two cuts, and the drawing shows both on the
same curve, which could be a sound over time or the brightness along a line
of a photo.

![Three panels side by side. On the left a smooth curve, labelled the signal, continuous. In the middle the same curve, faint, with dashed vertical lines and twelve dots on the curve, labelled cut 1: sampling, 12 points. On the right four horizontal level lines with the twelve dots moved onto the nearest level, labelled cut 2: quantising, 4 levels.](figure:two-cuts "The first cut goes through the axis, the second through the value.")

The **first cut** measures the signal at finitely many points, in time for a
sound or across the area for a picture. That is **sampling**, and how fine it
is, is the **resolution**: 16 × 16 points for a tiny picture, 44,100 samples
per second for a CD. The **second cut** rounds each measured value to one of
the agreed levels. That is **quantising**, and the number of levels is the
**colour depth** of a picture or the **bit depth** of a sound, four grey
levels in the drawing and 16 bits per sample on a CD. Those levels are exactly
the regions from the section above.

Both cuts leave their own traces, which is how you tell which knob to turn. A
picture made of visible blocks had too few points, so the sampling was too
coarse. A picture whose soft shading breaks into hard patches or stripes had
too few levels, so the quantising was too coarse.

## What a picture costs

One piece of arithmetic carries every file size: **points × bits per point**.
A level needs as many bits as it takes to tell all levels apart, so four grey
levels need two bits and 256 levels need eight, the same *k*ⁿ as in
[[place-value-systems]]. The program works out what a picture of 64 × 64
points costs over a slow link that carries 30 bits per second:

```python
points = 64 * 64
rate = 30   # bits per second

for bits_per_point in [24, 8, 2, 1]:
    size = points * bits_per_point
    minutes = size / rate / 60
    print(bits_per_point, "bit per point:", size // 8, "bytes,", round(minutes, 1), "minutes")
```

In full colour, with 24 bits per point, the picture takes 12,288 bytes and
almost 55 minutes; in black and white, with one bit per point, it takes 512
[[byte|bytes]] and little more than two minutes. The same picture and one
decision make more than fifty minutes of difference.

That is why digitising is not a matter of "as fine as possible" but a
trade-off about which detail is worth its transmission time. Make a photo
ever coarser and somewhere it stops showing what it showed, and where exactly
that happens, people will disagree. There is no correct amount, only a
trade-off that someone has to make on purpose.

## Takeaways

- Digital means finitely many clearly separated states with nothing valid in
  between; electronics is only the usual carrier.
- Between sender and sensor, every link is analog; only a measurement and a
  decision make it digital again.
- A threshold or a set of regions is a decision, and it belongs where a
  measurement series puts it.
- More levels carry more per reading but bring the boundaries closer to the
  same wobble, so two levels are safe and eight may already be too many.
- Precision thrown away is the price of robustness: disturbances smaller than
  the distance between states vanish at every reading, and digital copies stay
  identical.
- Digitising takes two cuts, sampling (resolution) and quantising (colour or
  bit depth), and a file costs points × bits per point.
