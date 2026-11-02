---
title: "Challenge 1: The alphabet"
summary: >-
  How many colours does your link tell apart in 50 attempts without a single error? The answer is your alphabet for everything that follows.
objectives:
  intro: "With this challenge you find your alphabet and can then:"
  goals:
    - "calibrate sender and receiver before every run"
    - "show with a control measurement whether a setup helps"
    - "calculate the number of codewords from the number of colours and places"
    - "trace confusions in the log back to their cause"
translation_of: de
based_on: 2026-11-02
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

**Goal:** Find out how many states your link distinguishes in 50 attempts
without a single error. This decides the whole project: whoever reliably tells
four states apart later sends two bits per symbol, whoever manages sixteen
sends four and transmits twice as much at the same speed.

**What is new** is that for the first time you have to find something out about
your setup instead of thinking it up. Nobody knows in advance how many states
can be told apart, the AI assistant included, because it depends on your
sensor, your distance, your room and whatever you build in between.

**Task:** The sender shows a colour from a set you define yourselves, and the
receiver says which one it was. Timing does not matter yet: a human presses
Enter, the program measures, and the name of the recognised state appears on
the receiver's screen.

**You count three times,** and all three numbers belong in your notes:

1. **By eye:** before you write a line of code, you count how many colours you
   can reliably tell apart yourselves when you see them one at a time, not side
   by side. In some respects your eye beats the sensor by far, in others it
   clearly loses, and one reason matters for the rest of the challenge: your
   vision recalibrates itself all the time when the light in the room changes,
   while the sensor simply reports different numbers.
2. **Without aids:** bare LED, bare sensor, fixed distance.
3. **With your setup:** you build your light channel, a tube, a shade or
   whatever you come up with, and measure again.

The third, better result counts. Without the second, though, you cannot know
whether your setup made any difference at all, which is exactly why this
control measurement is required. What you may build is described in [[lifi-device]].

**The three results of this challenge** (see [[lifi-challenges]])
are therefore the measurement logs without and with aids, a photo of your
setup with a sentence on why you built it that way as the description of your
solution, and your log of mistakes. For the last one this challenge is the
richest source: ask the assistant why the tube does not help, and it suggests
matt black inner walls, shades and narrower openings, all plausible and none of
it tested until you have measured it.

**What you fill in in the template:** in this challenge one device only sends
and the other only receives, so each side has its own file, and a third one
holds what both sides have to agree on. The test script calls exactly four
functions, nothing more. How you build them inside is up to you, and you may
add as many functions of your own as you like.

| File | What goes in |
|---|---|
| `agreement.py` | `SYMBOL_COLORS`, your alphabet, one colour per line; the first line is symbol 0. `ALPHABET_SIZE` counts the lines by itself and is never changed by hand |
| `sender.py` | `calibrate()` plays through your alphabet once, `send_symbol(index)` shows one symbol and returns only when the receiver has had enough time to measure |
| `receiver.py` | `calibrate()` measures along and stores a reference value for each symbol in `REFERENCES`, `receive_symbol()` measures and returns which symbol it was |

Anything that has to be the same on both sides belongs in `agreement.py`, not
twice in the two other files, so that sender and receiver can never disagree
about it. The LED and the sensor do not appear in this file, which only holds
agreements.

The receiver cannot calculate which symbol has arrived; it first has to learn
what your symbols look like in this setup and then compares every new reading
with the references. Two things follow: during calibration both sides have to
run in the same rhythm, otherwise the receiver assigns its readings to the
wrong symbols, and you calibrate again before every run, at the test table too.

**Self-test and acceptance test are the same script.** You start it twice,
each in its role, with `python run_test.py sender` and
`python run_test.py receiver`, and it loads only the file of its role. Both sides write a log (`sent.txt` and
`received.txt`); put both into one folder and compare them with
`python compare.py`. For quick tries in between, fewer runs are enough
(`--runs 10`). Because exactly this script runs at the acceptance test, you can
rehearse the scored run as often as you like, and nothing new happens at the
test table. A good approach is to start with the two colours already in
`SYMBOL_COLORS`, just off and white, and after 50 runs without a mistake go up
to 4 by removing the `#` in front of the next two colours, then to 8; the last
size without mistakes is your result. If `compare.py` shows the same two
symbols mixed up every time, they are too close together; if it looks random,
timing or calibration is the more likely culprit.

**Both devices on one laptop:** you can also plug both devices of your team
into the same laptop and start sender and receiver in two terminals next to
each other; then both logs end up in the same folder, and `compare.py` runs
straight away. For that the module has to know which device is which: at the
top of `sender.py` and `receiver.py` there is the line
`# use_device("put the UID here")`. Remove the `#` in both files and write in
the UID of the master brick of that device, the sending one in `sender.py` and
the receiving one in `receiver.py`. If you do not know the UIDs, start without
them first; the error message lists both, and the Brick Viewer shows which one
belongs to which box. With only one device plugged in, leave the line as it is.
One thing gets harder: you cannot press Enter in both terminals at the same
moment, there is easily a second between the first and the second press, and
your calibration has to cope with that.

**At the acceptance test** you set up your optics at the test table, calibrate,
and 20 random symbols are sent. A single mistake counts as a fail for that
alphabet size, so eight states recognised reliably are worth more than sixteen
with an occasional mix-up. As the live change you extend your alphabet, for
example to up to twelve symbols with more colours in `SYMBOL_COLORS`, and run
the test again; for that you have to find the places in your code that depend
on the size of the alphabet.

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
