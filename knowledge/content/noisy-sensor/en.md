---
type: demo
code: 3571
title: The noisy sensor
summary: >-
  The same noisy readings decide three times whether the LED was on or off:
  from a single reading, from the mean of five and from the mean of ten. The
  longer the average, the fewer wrong decisions, and the fewer symbols per
  second.
level: 1
duration: 10
topics: [transferring-information]
modules: [dup]
relations:
  example_of: [signal-and-noise]
status: draft
updated: 2026-11-08
---

**Goal:** You see why a single reading is not enough for a reliable decision,
and what averaging over several readings gains and costs.

**How to use it:** Send symbols one at a time or 25 at once. The LED is either
on or off, and the receiver decides at the threshold in the middle. All three
lanes read the same sensor at the same moment: the top one decides from a
single reading, the two below from the mean of five and of ten. Every dot is
one decision, and a red dot is a wrong one. Compare the counts on the right,
then turn the noise up and down and watch which lane gets into trouble first.
The figure below the counts is the price: ten readings per symbol leave only
two symbols per second.

```noisy-sensor
```
