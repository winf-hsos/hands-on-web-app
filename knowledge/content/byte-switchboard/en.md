---
type: demo
code: 5470
title: Byte switchboard
summary: >-
  Eight switches, one byte: flip the bits and watch the number appear as a
  sum of place values, in binary, decimal and hexadecimal, and as a character.
level: 1
duration: 10
topics: [representing-information]
modules: [dup]
relations:
  example_of: [byte]
  see_also: [binary-numbers, hexadecimal]
status: published
updated: 2026-10-30
---

Each switch below is one bit of a byte, with its place value above it. Click a
switch, or press it and drag across its neighbours, and watch how the number
is built from the switches that are on. The byte starts at 65, the capital A.

```byte-switchboard
```

## Questions to try

- Which switch changes the number the most, and which the least?
- How do you set 255, and how do you set 1?
- Count up with +1 from 0 to 16 and watch which switches flip at each step.
  Where does a carry run through several places at once?
- What happens when you count one step past 255?
- Set the switches to 01000001 and then to 01100001. What changes in the text,
  and by how much does the number change?

## What you should see

The number is always the sum of the place values of the switches that are on,
which is the [[place-value-systems|place value recipe]] in base 2. The
leftmost switch is worth 128, more than all the others together (127). The
hex reading changes one digit per packet of four switches, and the character
is the byte read through the ASCII table, which is explained in
[[code-as-agreement]]. Past 255 the byte overflows: the ninth place it would
need does not exist, so it starts again at 0.
