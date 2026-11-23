---
title: The drift simulator
summary: >-
  Two clocks and one sequence of colors: the receiver's clock is slightly off,
  its sampling points wander out of the sender's time slots symbol by symbol,
  and markers set the error back to zero but cost rate.
translation_of: de
based_on: 2026-11-23
---

**Goal:** See how a small error of the receiver's clock adds up from symbol
to symbol until, half a slot off, the receiver reads the neighboring symbol,
and what a marker that it realigns on does against this and costs in rate.

**How to use it:** At the top the sender puts one color into every time slot,
below are the receiver's sampling points, and a red ring means that a point
lies in the wrong slot. Under the picture are the sent and the received
sequence, which slip against each other when the clock is off. Set with the
first knob how far the receiver's clock is off, then switch on a marker every
few symbols with the second until no more errors show up; "marker overhead"
shows how many slots this costs. "Sample once" goes through a single sample
step by step, and "Send a marker" sets a marker by hand.

```drift-simulator
```
