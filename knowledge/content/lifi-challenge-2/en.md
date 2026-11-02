---
title: "Challenge 2: The word"
summary: >-
  Transmit ten characters without errors and as fast as possible, with your own code table and a shared clock.
objectives:
  intro: "With this challenge you transmit words and can then:"
  goals:
    - "define a code table from letters to sequences of your symbols"
    - "keep sender and receiver in step with a fixed symbol rate"
    - "explain why a higher symbol rate fails without a shared clock"
translation_of: de
based_on: 2026-11-02
---

With an alphabet of colours you can send words as soon as two things are
settled: which sequence of colours stands for which letter, and when the
receiver looks. The first is a code table, the second a shared rhythm.

**Goal:** Send ten characters without errors and as fast as possible.

**Task:** You define a code table that maps every letter to a sequence of your
symbols, and agree on a fixed symbol rate, for example one symbol per second. A
human starts both programs, and the receiver only learns how many characters
will come.

**What is measured** is first whether all ten characters are right, and only
then the duration. At the acceptance test you send a word you have not seen
before. As the live change you double your symbol rate.

**Typical pitfalls:** what works at one symbol per second falls apart at five,
because the two sides share no clock. The receiver measures right during a
colour change or starts too late, or the code words get longer than necessary.

**For the quick ones:** give frequent letters shorter code words and make sure
they can still be read unambiguously.
