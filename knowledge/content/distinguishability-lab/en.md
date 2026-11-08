---
type: demo
code: 8152
title: The distinguishability lab
summary: >-
  A noisy channel drawn like an oscilloscope: you send the symbols, choose how
  many the alphabet has and how long each measurement window is, and watch the
  error rate and the throughput pull against each other.
level: 1
duration: 15
topics: [transferring-information]
modules: [dup]
relations:
  example_of: [signal-and-noise]
status: draft
updated: 2026-11-08
---

**Goal:** You find out for yourself how the size of the alphabet, the length
of the measurement window and the noise together decide how many symbols get
through without errors, and why more symbols and faster symbols spend the same
safety margin.

**How to use it:** The horizontal lines are the levels of the symbols, and the
thin restless curve is the raw signal. At the end of every window the receiver
averages what arrived into one bar and decides for the nearest level; the
symbol it recognised stands above the band and in the record below, red when
it is wrong. Click a level or press a digit to send that symbol. Then give the
alphabet more symbols until errors appear, and lengthen the window until they
disappear again, keeping an eye on the symbol rate and the throughput. Disturb
shows what stray light or mains hum does to a link, and Measure once goes
through a single window step by step.

```distinguishability-lab
```
