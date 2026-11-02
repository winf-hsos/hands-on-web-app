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
based_on: 2026-11-02
---

So far the receiver knew when things start and how long the message is. That
now goes away: it has to recognise by itself where a message begins and where
it ends. For that you need rules written down so precisely that another team
could build a receiver from them, and that is exactly what is tested.

**Goal:** The receiver is already running before the sender starts and finds
the beginning and end of a message of unknown length without human help.

**Task:** You design a frame around your message, such as a preamble at the
start and an end marker, and a receiver that knows which state it is in: it is
waiting, reading or done. You write your rules down as a protocol description.

**Interop test:** halfway through you swap your protocol description with
another team, and each team builds a receiver for the other's protocol. After
the swap no questions are allowed; whatever is unclear gets written down. The
phase ends with a standards meeting in which the whole group agrees on a shared
frame for the final.

**What is measured** is whether the receiver reads correctly without help and
how many teams managed with your description. At the acceptance test someone
else decides when to send. As the live change you receive two messages without
restarting the receiver.

**Tip:** in your code, keep the question of which bits are sent apart from the
question of how bits become light. Then you can test the protocol with a file
instead of the hardware.

**Typical pitfalls:** the receiver jumps at noise, the preamble happens to
appear in the middle of the data, the end is not recognised, or the
description only tells what you built instead of what another team needs to
know.
