---
title: "Challenge 3: The listener"
summary: >-
  The receiver finds the start and end of a message of unknown length on its own, following a protocol that another team understands as well.
objectives:
  intro: "With this challenge you design a protocol and can then:"
  goals:
    - "frame a message with a preamble and an end mark"
    - "build a receiver that knows whether it waits, reads or is done"
    - "describe a protocol so that another team can build a receiver from it"
    - "test the protocol with a file instead of the hardware"
translation_of: de
based_on: 2026-11-03
---

So far the receiver knew when things start and how long the message is. That
now goes away: it has to recognise by itself where a message begins and where
it ends. For that you need rules written down so precisely that another team
could build a receiver from them, and that is exactly what is tested.

**Goal:** The receiver is already running before the sender starts and finds
the beginning and end of a message of unknown length without human help.

**Five tasks:** you mark the beginning and end of a message, build a receiver
that waits and recognises by itself, let it read two messages in a row,
describe your protocol for another team, and finally agree on a shared frame
with the whole group. Most tasks have hints to unfold.

## The files

You keep working with the same three files as in challenge 2 and start from
your own; the template for the protocol description comes on top.

| File | What goes in |
|---|---|
| `agreement.py` | as before, plus whatever both sides need to know about the beginning and end of a message |
| `sender.py` | `calibrate()` as before, `send_message(text)` sends a complete message |
| `receiver.py` | `calibrate()` as before, `receive_message()` waits, recognises, reads and returns the message |
| `protocol-template.md` | your protocol description for the interop test |

You start the test with `run_test.py` from the template, first the receiver
and at some point later the sender; how exactly is described there.

## Task 1: Mark the beginning and end

Design a frame around your message, such as a preamble at the start and an
end marker, so that the receiver recognises from the symbols themselves where
a message begins and where it stops. `send_message(text)` sends the message
together with this frame.

**File:** `agreement.py` for what both sides need to know, and `sender.py`, the function `send_message(text)`

> [!HINT]
> Ask yourselves what happens if your starting pattern happens to appear in the middle of the message, and which characters are allowed in a message at all.

> [!HINT]
> In your code, keep the question of which symbols you send apart from the question of how a symbol becomes light. Then you can swap the lower half for a file while testing: the sender writes its symbols into it, the receiver reads them from there. That way you try out your frame without hardware and without waiting minutes, and when something does not work you know at once whether it is the logic or the optics. In challenge 4 this separation becomes a requirement.

## Task 2: The receiver waits by itself

`receive_message()` is called before the sender starts, and it no longer gets
a length. So the receiver has to know at any moment which state it is in: it
is waiting, reading or done.

**File:** `receiver.py`, the function `receive_message()`

> [!HINT]
> Keep the state in a variable of its own and decide for each state what a new symbol does. Then the receiver does not jump at noise while it is waiting.

> [!HINT]
> The pattern of errors gives away the cause: if the beginning is missing, the receiver kicked in too late; if there is rubbish at the end, the end was not recognised; and if the middle is wrong, the beat got lost along the way.

## Task 3: Two messages without a restart

Your receiver reads two messages in a row without you restarting it. This is
also the live change at the acceptance test.

**File:** `receiver.py`

> [!HINT]
> After the end marker the receiver has to wait again as if it had never read anything. Check whether something from the first message is left behind.

## Task 4: Protocol description and interop test

Halfway through you fill in the template for the protocol description and swap
it with another team, and each team builds a receiver for the other's
protocol. After the swap no questions are allowed; whatever is unclear gets
written down.

**File:** `protocol-template.md`

> [!HINT]
> The most important part of the template is section 8, the complete example: whoever does not understand your text usually understands the example.

> [!HINT]
> Write down what another team needs to know to build a receiver, not what you built.

## Task 5: The standards meeting

The phase ends with a standards meeting in which the whole group agrees, from
your proposals, on a shared frame for the final. What lies below the bits,
that is how bits become light, stays your own business.

**File:** none; you can bring your protocol description and the report on the
interop test.

## The acceptance test

**What is measured** is whether the receiver reads correctly without help and
how many teams managed with your description. At the acceptance test someone
else decides when to send. As the live change you receive two messages without
restarting the receiver.

## Pitfalls and more

**Typical pitfalls:** the receiver jumps at noise, the preamble happens to
appear in the middle of the data, the end is not recognised, or the
description only tells what you built instead of what another team needs to
know.
