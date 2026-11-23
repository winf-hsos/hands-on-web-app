---
type: lesson
code: 6142
title: Sampling and synchronization
summary: >-
  A receiver only sees light and has to find out by itself when the next
  symbol begins. This lesson shows why a link breaks sooner the faster it
  runs, and compares the two answers to it: a shared beat that markers set
  again and again, and a change of color that serves as the beat. Both have a
  price, and it shows up in the minutes a file needs.
objectives:
  intro: "Using a link that sends colors with an LED and reads them with a sensor, this lesson shows you how sender and receiver agree on when a symbol begins, and afterwards you can:"
  goals:
    - "explain why a receiver sees no borders between symbols and why two equal symbols in a row merge into one"
    - "calculate from the difference between two clocks and the symbol rate after how many seconds the receiver reads the neighboring symbol, and explain why half a symbol of error is enough"
    - "explain why symbols shorter than the sensor's integration time produce readings that match no symbol"
    - "describe how markers limit the clock error and what they cost in rate"
    - "encode and decode bits as changes between three colors so that there is always a change to see"
    - "name real links for both ways, such as the start bit of a serial port, the Manchester code of ethernet and the bit stuffing of USB"
    - "compare with `math.log2()` how many bits k colors carry as states and as changes, and explain why two bits per change need five colors"
    - "calculate with t = n / (r · b) how long a file takes with and without a shared beat"
level: 1
duration: 35
topics: [transferring-information]
modules: [dup]
relations:
  requires: [signal-and-noise]
status: draft
updated: 2026-11-23
---

![Slides: Keeping time](item:sampling-and-synchronization-slides)

Eighty musicians in an orchestra can all keep time, and yet without someone
giving the beat they would drift apart within a minute, because small
differences in tempo add up and nobody notices their own error. Two computers
that send each other light have the same problem. The sender knows when each
symbol begins, since it switches the light itself, while the receiver only
sees light and has to find out. This lesson shows why that becomes harder the
faster a link runs, and it compares the two basic answers: a shared beat, or
a change in the light that serves as the beat. The examples use an LED and a
color sensor, and the same questions arise with any link that sends symbols
one after another.

## What the receiver sees

The sender switches symbols of equal length with clear borders between them,
say red for 100 ms, then blue, then blue again. What reaches the receiver is
one continuous stream of light without any borders. Where two different
colors meet, the receiver sees a change, but where the same color follows
itself, the two symbols merge into one long stretch, and nothing in the light
says whether it was one symbol or two.

The receiver also does not read a symbol once. It measures many times within
a symbol and averages, because single readings scatter, as
[[signal-and-noise]] showed. When this lesson speaks of the reading the
receiver takes in a symbol, it means this average. The question is when to
take it: the receiver has to know where a symbol begins and ends, and the
light alone does not tell it.

## No two clocks run alike

The obvious answer is to agree on a rate. Sender and receiver both use 100 ms
per symbol, start together, and the receiver reads in the middle of each
slot, at 50 ms, 150 ms, 250 ms and so on. That works as long as both clocks
run at exactly the same speed, and no two clocks do. Every clock in a laptop
or a microcontroller is slightly off, by a fraction of a per cent, and the
error of each symbol adds to that of the previous one.

![Two rows. At the top twelve numbered boxes, the time slots of the sender. Below them ten dots, the readings of the receiver, each joined to the row above by a dashed line. The first dots sit under the middle of their slot, then they move further right with every symbol; from the seventh on they lie in the next slot and are red.](figure:drift "The receiver’s clock runs 8 % slow, greatly exaggerated so that the effect shows after a few symbols. From the seventh reading on, the receiver reads the neighboring slot.")

The program computes when the receiver takes each reading and in which slot
of the sender it lands:

```python
slot = 100       # ms per symbol, agreed by both sides
slow = 1.08      # the receiver's clock runs 8 % slow, greatly exaggerated

for i in range(10):
    t = (i + 0.5) * slot * slow    # the receiver means the middle of slot i + 1
    print(f"reading {i + 1} at {t:.0f} ms lands in slot {int(t // slot) + 1}")
```

The first six readings land in the right slot, although each one sits a
little later than the last. Reading 7 is taken at 702 ms, inside slot 8, so
slot 7 is never read at all and every symbol from there on is shifted by one.
The error per symbol is small and harmless, while its sum is not.

## The sensor needs time to look

There is a second cause, and it lies in the sensor. A sensor does not deliver
an instantaneous value but collects light over a measuring window and reports
the average, its **integration time**, which [[signal-and-noise]] introduced
as a way of calming the readings. That works as long as the window fits
inside one symbol.

![Two panels on the same time scale. On the left symbols of 100 ms alternate between bright and dark, and a yellow window of 50 ms lies entirely inside a bright symbol; on the scale below, the reading sits at bright and the verdict says reads bright. On the right symbols of 40 ms, and the same window covers part of a bright and part of a dark symbol; the reading sits at a mixed value, and the verdict says matches neither symbol.](figure:window "The same measuring window of 50 ms with symbols of 100 ms and of 40 ms. Once the symbols are shorter than the window, every reading contains a change.")

With symbols of 100 ms and a window of 50 ms, every reading can lie entirely
inside one symbol and the value fits. With symbols of 40 ms, every window
contains a change, and the sensor reports a mixture of two colors that
matches neither of them. There is no error message, only a number that leads
to the wrong symbol. A shorter window helps against the mixing but makes the
readings scatter more, which is the same trade as with noise, so the
integration time puts a lower limit on the length of a symbol.

Both causes come down to the same question, namely when the next symbol
begins. A clock can tell the receiver, or a change in the light can, and the
rest of this lesson looks at both answers and their price.

## When does it tip?

Take two clocks that differ by half a per cent, a realistic value for two
ordinary devices. After one second they are 5 ms apart, after ten seconds
50 ms, and the error keeps growing in a straight line. The receiver does not
need a whole symbol of error to fail, since half a symbol is enough: its
reading sits in the middle of the slot and has only half the width to spare
on either side. At ten symbols per second a symbol lasts 100 ms, so after
ten seconds the error reaches 50 ms and the receiver reads the neighbor.

The faster the link, the shorter the symbols, while the error grows at the
same pace:

```python
drift = 0.005    # the two clocks differ by 0.5 %

for rate in [1, 2, 5, 10, 20]:
    half = 1 / rate / 2          # half a symbol, in seconds
    print(f"{rate:2} symbols per second: wrong after {half / drift:.0f} s")
```

The same two clocks last 100 seconds at one symbol per second and only 5 at
twenty. That explains why a link that runs stably at a slow rate suddenly
breaks when it is sped up, although nothing about the clocks has changed.

## Markers reset the error

Starting together once is not enough, but starting together again and again
is. The sender inserts a **marker** at fixed intervals, a reserved symbol that
the receiver cannot confuse with data, such as a color that does not occur in
the alphabet or a short dark pause. At each marker the receiver realigns its
grid, so the error drops back to zero and grows again only until the next
marker. With clocks that differ by half a per cent and a marker every four
seconds, the error never exceeds 4 s · 0.005 = 20 ms.

To realign, the receiver has to know not only that a marker came but when it
began. It therefore measures faster than symbols arrive, say five times per
symbol, and notes the first reading that falls into the marker. The next
symbol border is that moment plus one symbol length, and the remaining error
is at most one measuring step. Here the way with a beat borrows the idea of
the other way, reacting to a change, but only once per block instead of at
every symbol.

Markers carry no data, and that is their price: a marker every eight symbols
costs an eighth of the rate. Starting together once costs nothing but lets
the error grow without limit, and how often a marker is needed depends on how
far your own clocks drift apart, which is a question for a measurement.

Many real links work this way. A serial port (UART, as in RS-232) rests at 1
between characters, and every character begins with a start bit 0: at its
falling edge the receiver restarts its clock and then reads each bit in its
middle. Since this marker comes before every character, the clocks only have
to stay together for about ten bits, and a deviation of a few per cent does
no harm. The German time signal DCF77, which radio clocks receive, lowers its
amplitude at the start of every second, for 100 ms for a 0 and 200 ms for a 1,
and leaves out the pulse in second 59, so the gap marks the start of the next
minute. A VGA monitor gets a sync pulse after every row of the picture and
another after every frame.

## The change as the beat

The second way needs no clock. Every color is a symbol, and every change of
color means "next". The receiver measures as often as it can and reacts only
to changes, so there is nothing that could drift. The naive version has one
flaw, the one from the beginning of this lesson: two equal symbols in a row
produce no change, so the receiver cannot tell one from two.

The fix is to let the change carry the information instead of the color.
From every color two successors are allowed, one meaning 1 and one meaning 0,
and the color itself is forbidden as its own successor, so there is always a
change to see.

![Three colored circles on the corners of a triangle, red at the top, green at the bottom right and blue at the bottom left, with an arrow running clockwise inside. Next to it: clockwise step = 1, anticlockwise step = 0, a color never follows itself. Below that four squares red, green, red, blue, and between them the bits 1, 0, 0.](figure:triangle "Three colors on a triangle: a clockwise step means 1, an anticlockwise one 0. Red, green, red, blue therefore carries the bits 1, 0, 0.")

The program goes around the triangle one way for a 1 and the other way for a
0, and decodes by looking at the direction of each change:

```python
order = ["red", "green", "blue"]    # clockwise around the triangle

def encode(bits, start="red"):
    colors = [start]
    for bit in bits:
        step = 1 if bit == "1" else -1
        colors.append(order[(order.index(colors[-1]) + step) % 3])
    return colors

def decode(colors):
    bits = ""
    for a, b in zip(colors, colors[1:]):
        step = (order.index(b) - order.index(a)) % 3
        bits += "1" if step == 1 else "0"
    return bits

sent = encode("100")
print(sent)
print(decode(sent))
```

The bits `100` become red, green, red, blue, and the decoder returns `100`.
Note that `encode` needs a starting color that carries no bit, so four colors
are sent for three bits.

Real links use the same idea with two levels instead of three colors. The
**Manchester code** puts a change in the middle of every bit, from low to high
for a 1 and from high to low for a 0, as in 10BASE-T ethernet and in infrared
remote controls following RC-5, which send light just like an LED. The
receiver takes its beat from these changes, and the price is that the line
has to manage two changes per bit. USB 1.x and 2.0 use **NRZI**, where a 0 is a
change and a 1 none, so a long run of ones would leave the line without a
change; after six ones the sender therefore inserts an extra 0, which the
receiver removes again. This **bit stuffing** costs at most a seventh of the
rate, much like a marker.

## Without a clock is not without time

The receiver does not know how long a symbol lasts, and it does not need to.
It reads as often as it likes and only keeps the colors in the order they
appear. During a change, however, the sensor measures mixed values, as the
drawing of the measuring window showed, and a receiver that took every
reading at face value would invent symbols from them. It therefore needs a
threshold for how long a color has to hold still before it counts. Append
these lines to the program above:

```python
from itertools import groupby

# the receiver reads about four times per symbol; "mix" is a reading
# taken during a change that matches no color
readings = ["red", "red", "red", "mix", "green", "green", "green", "green",
            "mix", "red", "red", "red", "mix", "blue", "blue", "blue"]

colors = []
for color, run in groupby(readings):
    if len(list(run)) >= 2:      # a color has to hold still before it counts
        colors.append(color)

print(colors)
print(decode(colors))
```

`groupby()` collects runs of equal readings, and only runs of at least two
readings count as a color, so the three mixed values disappear and the result
is again `100`. Set the threshold to 1, and the decoder stumbles over the
mixed values. Time still matters in a second way, because how many changes
per second the link manages decides how fast it is, with the same limits from
the measuring window as before.

## What the change costs in bits

The freedom from the clock is paid for in capacity. As states, k colors carry
log₂ k bits per symbol, but as changes only log₂(k − 1), because the current
color drops out as a successor:

```python
import math

for k in range(3, 10):
    print(f"{k} colors: {math.log2(k):.2f} bits as states, "
          f"{math.log2(k - 1):.2f} as changes")
```

Three colors carry 1 bit per change instead of 1.58, four carry 1.58 instead
of 2. Whoever thinks in powers of two falls into a trap here: for a clean two
bits per change you need five colors, not four, and for three bits nine. An
alphabet for changes has the size 2ⁿ + 1.

## Choosing a way

Neither way is right or wrong, and the table compares what each of them costs:

| | with a shared beat | with the change as the beat |
|---|---|---|
| the receiver knows the next symbol from | its clock | a change in the light |
| what can go wrong | the clocks drift apart | mixed values count as symbols |
| what helps | markers at fixed intervals | a color must hold still before it counts |
| price | every marker is a symbol without data | k colors carry only log₂(k − 1) bits |

Whatever the strategy, in the end one calculation counts: the time *t* for a
file is the number of bits *n* divided by the product of symbols per second
*r* and bits per symbol *b*, so t = n / (r · b). It has exactly two levers,
and everything in this lesson decides about both. The program compares the
two ways for a file of 2 KiB with four colors at five symbols per second:

```python
import math

n = 2 * 1024 * 8    # 2 KiB in bits
r = 5               # symbols per second

for name, b in [("with a beat", 2), ("without a beat", math.log2(3))]:
    t = n / (r * b)
    print(f"{name}: {t / 60:.1f} minutes")
```

With a beat the file takes 27.3 minutes, without one 34.5, so the freedom
from the clock costs about seven minutes on this file. The comparison leaves
out the markers, though: with a marker every eight symbols only seven in
eight symbols carry data, and the time with a beat grows to 31.2 minutes.
Which way pays off depends on how far your clocks drift and how cleanly your
sensor sees a change, and both are questions for a measurement on your own
link. How far the two levers *r* and *b* can be turned at all is a question
of its own, that of throughput and its limits.

## Takeaways

- The receiver sees a stream of light without borders, and two equal symbols
  in a row merge into one.
- No two clocks run alike, and their error adds up from symbol to symbol;
  half a symbol of error is enough for the receiver to read the neighbor, so
  a faster link breaks sooner.
- Symbols shorter than the sensor's integration time produce mixed readings
  that match no symbol.
- Markers at fixed intervals reset the clock error, and each marker costs a
  symbol without data.
- When the change carries the bit and no color may follow itself, there is
  always a change to see and the receiver needs no clock.
- Serial ports, DCF77 and VGA work with markers, while 10BASE-T ethernet,
  RC-5 and USB work with changes.
- As changes, k colors carry only log₂(k − 1) bits, so two bits per change
  need five colors.
- A color has to hold still before it counts, so time still matters without
  a clock.
- The time for a file is t = n / (r · b), and the choice of a way decides
  about both levers.

