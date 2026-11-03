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
based_on: 2026-11-03
---

The final is no longer about text but about bytes: a file you have not seen
before has to arrive unchanged. The shared frame from the standards meeting
defines what a packet looks like; everything else is up to you.

**Goal:** An unknown file of at most 2 KiB (2048 bytes), such as a text or a
small picture, is transmitted byte by byte. Whether it really arrived unchanged is shown by
comparing checksums (SHA-256).

**What is fixed and what is free:** the group's frame fixes preamble, file
type, length, payload, checksum and end marker. Alphabet, colours, sensor
settings, symbol rate, calibration, how you deal with clocks drifting apart,
and your optics are up to you. For the first time you may use the way back as
well: turn one of the devices around and the receiver can answer the sender,
for example to ask for a broken piece again. That is allowed but not required.

**Three tasks:** you build your lowest layer, which sends and receives bits,
measure how far your devices drift apart over many symbols, and transmit a
whole file with it. Each task has hints to unfold.

## The files

You now write only two functions in `device.py`. The frame is handled by
`frame.py`, and that file is the same for all teams: it knows nothing about
light, only how a file becomes a bit stream, and it calls your two functions
to do that.

| File | What goes in |
|---|---|
| `device.py` | `send_bits(bits)` transmits a list of zeros and ones, `receive_bits()` returns such a list |
| `frame.py` | preamble, file type, length, checksum and end marker; you do not change it |

## Task 1: Send and receive bits

Write `send_bits(bits)` and `receive_bits()` so that a list of zeros and ones
arrives unchanged on the other side. How bits become symbols and symbols
become light is your decision alone.

**File:** `device.py`

> [!HINT]
> The frame says nothing about time. How fast you send and how the receiver learns your rate belongs in your own layer, because a transmission by sound would have completely different rules for it.

> [!HINT]
> A symbol from an alphabet of four colours carries two bits, one from eight colours three. Use your alphabet size from challenge 1 to work out how many symbols a file needs.

## Task 2: Measure the drift

Measure how far your two devices drift apart over a thousand symbols. Then you
know how big your problem with the clocks is before you build a solution for
it.

**File:** none given; the measurement series goes into your notes.

> [!HINT]
> Send a pattern the receiver knows and watch from which symbol on it falls out of step. Repeat the measurement a few times, because a single series says little about how much your clocks really differ.

## Task 3: Transmit the file

Transmit a file of up to 2 KiB with `run_test.py` from the template. The
receiver writes the file, checks the checksum and prints the SHA-256, and the
run only counts if it matches on both sides.

**File:** `device.py`; `frame.py` and `run_test.py` stay as they are.

> [!HINT]
> Your link manages roughly 10 to 50 bits per second. Work out how long 2048 bytes, that is 16,384 bits, take at your rate, and plan the speed accordingly.

> [!HINT]
> Practise first with a small text file you can read, and only then with a small picture.

## The acceptance test

**What is measured** is the duration, but only if the checksum matches; a
transmission that breaks off at 90 percent does not count. That the receiver
opens and shows the file at the end is the show, not the proof.

## Pitfalls and more

**Typical pitfalls:** code that silently expects text, a preamble that can also
occur in arbitrary data, overly ambitious timing, and a setup that does not
survive the trip to the test table.

**For the quick ones:** encrypt the payload, because light is public and any
neighbouring team can put its sensor next to yours. Or replace light with
sound, with a second version of `device.py` that uses the loudspeaker and the
microphone instead of the LED and the sensor, while `frame.py` and
`run_test.py` stay as they are.
