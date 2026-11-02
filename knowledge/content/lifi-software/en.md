---
title: "Software for the LiFi project"
summary: >-
  Python, Visual Studio Code, OpenCode and the course module lifi_hardware, and why every challenge has a fixed contract.
objectives:
  intro: "Here you get to know the software of the LiFi project and can then:"
  goals:
    - "say which program in the project is there for what"
    - "explain what the Brick Daemon and the Brick Viewer are for"
    - "address LED and sensor through the course module lifi_hardware"
    - "explain what the contract of a challenge fixes and what it leaves to you"
translation_of: de
based_on: 2026-11-02
---

You program in Python with Visual Studio Code, and OpenCode is set up as the
AI assistant. Your program runs on the laptop and controls the device over
USB; nothing is flashed onto it. For the laptop to find the device, the Brick
Daemon has to run in the background; the Brick Viewer shows whether everything
is recognised.

For access to LED and sensor there is the course module `lifi_hardware`. With
it, commands like `led.set_color(r, g, b)` and `sensor.read()` are enough,
without you having to deal with the details of the hardware; what it can do
and why it exists is in [[lifi-hardware]]. How to set everything up is shown in the slides [[first-light]]; how you get the course module and the templates onto your computer is stated in your course.

For each challenge there is a template with a **contract**: a handful of
functions with a fixed name, fixed arguments and a fixed return value. What you
write inside these functions is up to you, and you may add as many functions of
your own as you like. The test script calls only the contract functions, so
every team runs the same test and the results are comparable.

| Challenge | What you implement |
|---|---|
| 0 | six small tasks, one script each, from `task_1_light_on.py` to `task_6_human_receiver.py` |
| 1 | `ALPHABET_SIZE`, `calibrate_sender()`, `calibrate_receiver()`, `send_symbol(index)`, `receive_symbol()` |
| 2 | `send_text(text)`, `receive_text(n_chars)` |
| 3 | `send_message(text)`, `receive_message()` |
| 4 | `send_bits(bits)`, `receive_bits()` |

The contracts grow along: first single symbols, then text of known length, then
text whose length the receiver does not know, and finally only bits. At each
stage you see exactly the abstraction the challenge is about. **Self-test and
acceptance test are the same script:** you test yourselves with it as often as
you like, and the acceptance test uses it too. So do not change it; the
original version runs at the acceptance test anyway.
