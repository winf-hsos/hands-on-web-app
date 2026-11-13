---
type: demo
code: 2237
title: The prefix trap
summary: >-
  You write the code words for four letters and send a word, and the receiver
  shows every reading it could cut from the bits: as long as one code word is
  the beginning of another, there is more than one.
level: 1
duration: 10
topics: [representing-information]
modules: [dup]
relations:
  example_of: [code-systems]
status: published
updated: 2026-11-06
---

**Goal:** You see why a receiver cannot find the boundaries between
characters when one code word is the beginning of another, and you build a
code that can be read in one way only.

**How to use it:** Type a code word of zeros and ones for each of a, b, c and
d, and below it a word made of these four letters. In the middle stands what
goes over the wire, the bits without gaps; on the right stand all the ways
the receiver could cut them into code words. Code words that start another
one turn red, and below the demonstrator it says which one starts which.
Bring the list down to one reading without giving every code word the same
length, and then build a code with as many readings as you can.

```prefix-trap
```
