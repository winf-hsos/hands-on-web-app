---
title: Morse code
summary: >-
  A code of short and long signals separated by pauses. It works with current,
  sound and light, and gives frequent letters short signs.
objectives:
  intro: "Once you know Morse code, you can:"
  goals:
    - "describe how Morse code builds characters from dots, dashes and pauses"
    - "give the lengths of the dot, the dash and the three pauses as multiples of the basic unit"
    - "explain why Morse code is not prefix-free and why the pauses are therefore part of the code"
translation_of: de
based_on: 2026-11-01
---

## Definition

**Morse code** assigns to every letter, every digit and some punctuation marks
a sequence of two signals: a short one, the dot, and a long one, the dash.
Pauses separate the signs. Because it needs only "on" and "off" in two lengths,
Morse code can be sent over almost anything: a telegraph wire, a tone on the
radio, or light from a flashlight.

## An excerpt from the table

| Character | Morse code | | Character | Morse code |
|---|---|---|---|---|
| E | `·` | | T | `−` |
| I | `··` | | M | `−−` |
| S | `···` | | O | `−−−` |
| A | `·−` | | N | `−·` |

Frequent letters such as E and T consist of a single signal, rare ones such as
Q or Y of four. Where this distribution comes from is told in
[[morse-and-the-type-case]].

## The timing

In international Morse code everything is a multiple of one basic unit, the
length of a dot:

| What | Duration |
|---|---|
| Dot | 1 unit |
| Dash | 3 units |
| Pause within a sign | 1 unit |
| Pause between two letters | 3 units |
| Pause between two words | 7 units |

The pauses are not decoration but part of the code. Morse code is **not**
[[prefix-free-code|prefix-free]]: E (`·`) is the beginning of I (`··`) and of
S (`···`). Only the longer pause tells the receiver that a letter has ended.

## Where it is used

From the 1840s on, Morse code carried the messages of electric telegraphy and
later of radio. At sea it was the means for distress calls until the late
1990s; the well-known SOS (`···−−−···`) is sent without pauses between the
letters, as a single sign. Today it is used mainly in amateur radio, and it is
a good way into the question of how characters are turned into signals.

> [!TIP]
> Try it out: send someone a short word with your phone's flashlight and
> notice how hard it is to keep the pauses even.
