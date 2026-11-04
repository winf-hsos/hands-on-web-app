---
title: "Challenges in the LiFi project"
summary: >-
  Which contract every challenge fixes, how it is accepted at the test table, and which three results you take away from every challenge.
translation_of: de
based_on: 2026-11-04
---

## Templates and contracts

For each challenge there is a template with a **contract**: a handful of
functions with a fixed name, fixed arguments and a fixed return value. What you
write inside these functions is up to you, and you may add as many functions of
your own as you like. The test script calls only the contract functions, so
every team runs the same test and the results are comparable.

| Challenge | What you implement |
|---|---|
| 0 | six small tasks, one script each, from `task_1_light_on.py` to `task_6_human_receiver.py` |
| 1 | `COLORS`, `calibrate(readings)`, `send_symbol(name)` and `receive_symbol()` in one file, `alphabet.py` |
| 2 | `send_text(text)`, `receive_text(n_chars)` |
| 3 | `send_message(text)`, `receive_message()` |
| 4 | `send_bits(bits)`, `receive_bits()` |

The contracts grow along: first single symbols, then text of known length, then
text whose length the receiver does not know, and finally only bits. At each
stage you see exactly the abstraction the challenge is about. **Self-test and
acceptance test are the same script:** you test yourselves with it as often as
you like, and the acceptance test uses it too. So do not change it; the
original version runs at the acceptance test anyway.

## How acceptance works

Every challenge from the first one on ends at a shared test table where the
same conditions apply to everyone, including the same fixed distance between
the devices. Calibrate again before every run, because the light at the test
table differs from the light at your seat, and build your optics so that it
survives the trip there.

Each acceptance test includes a live change: you change your code on the spot
according to a given task. This shows that you understand what you built with
the AI assistant. Written documentation is not required; the only exception
is the protocol description from challenge 3, without which the interop test
cannot work.

How the challenges are assessed and when the acceptance tests take place is
stated in your course.

## What every challenge produces

Three results come out of every challenge, and nobody collects or grades them.
They are for you, and they are worth keeping from the first day, because each
challenge builds on the one before.

- **Measurement logs:** what did you change, what did you keep the same, and
  what came out? A good log is one your partner still understands a week later.
- **A description of your solution:** how your link works, in enough detail
  that another team could rebuild it. From challenge 3 on this grows into the
  full description of your protocol.
- **A log of mistakes:** two or three places where the AI assistant suggested
  something and a measurement proved it wrong. This is not a confession but the
  most useful document you will write, because it shows exactly where the
  assistant's knowledge ends and yours begins.

Together these three tell how you solved the problem, and they are the best
preparation if you later want to explain why your device works the way it
does.
