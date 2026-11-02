---
title: "Challenge 4: The packet"
summary: >-
  An unknown file of at most 2 KiB arrives unchanged byte by byte, and a checksum proves it.
objectives:
  intro: "With this challenge you transmit a whole file and can then:"
  goals:
    - "send bytes instead of text across your link"
    - "show with a checksum that a file arrived unchanged"
    - "calculate how long a transmission takes at your bit rate"
    - "combine a shared packet frame with decisions of your own"
translation_of: de
based_on: 2026-11-02
---

The final is no longer about text but about bytes: a file you have not seen
before has to arrive unchanged. The shared frame from the standards meeting
defines what a packet looks like; everything else is up to you.

**Goal:** An unknown file of at most 2 KiB (2048 bytes), such as a text or a
small picture, is transmitted byte by byte. Whether it really arrived unchanged is shown by
comparing checksums (SHA-256).

**Task:** The group's frame fixes preamble, file type, length, payload,
checksum and end marker. Alphabet, colours, sensor settings, symbol rate,
calibration, how you deal with clocks drifting apart, and your optics are up to
you. For the first time you may use the way back as well: turn one of the
devices around and the receiver can answer the sender, for example to ask for
a broken piece again. That is allowed but not required. Your link manages
roughly 10 to 50 bits per second, so work out how long 16,384 bits will take.

**What is measured** is the duration, but only if the checksum matches; a
transmission that breaks off at 90 percent does not count. That the receiver
opens and shows the file at the end is the show, not the proof.

**Typical pitfalls:** code that silently expects text, a preamble that can also
occur in arbitrary data, overly ambitious timing, and a setup that does not
survive the trip to the test table.

**For the quick ones:** encrypt the payload, or replace light with sound.
