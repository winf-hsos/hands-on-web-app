---
title: "LiFi: sending data with light"
summary: >-
  In pairs you build a link made of light from a coloured LED and a colour
  sensor, and in five challenges you get it to transmit a whole file without
  errors.
translation_of: de
based_on: 2026-11-02
---

Each person in the team gets a small device with an RGB LED and a colour
sensor. Put two devices face to face and the LED of one shines into the sensor
of the other; data is to flow across this short stretch of air. At the start
you tell a few colours apart, at the end your link transmits an unknown file
byte by byte.

The device is only the occasion. What this is really about is how information
is represented digitally, how to break a big problem into pieces that can be
tested one by one, and how to program with an AI assistant without believing
it blindly. Light suits this because it is slow and visible: what otherwise
happens invisibly inside a computer can be watched here. And because no
language model knows your setup, you have to measure what matters instead of
asking for it.

## Phase 0: Bringing the device to life {#start}

## Phase 1: How many colours can the sensor tell apart? {#alphabet}

## Phase 2: Colours become letters {#word}

## Phase 3: A protocol others understand {#protocol}

## Phase 4: A whole file {#packet}

## What you need

Each person gets a fully assembled device, so a team has both ends of the link.
That matters more than it sounds: whoever builds only the sender has to guess
what the receiver sees, and you can look. Each person works on their own
laptop with their own device; split the work by the two ends and swap roles
now and then, so that both of you know both sides. When one side does not
work, the answer is usually on the other.

**On your own works too.** If you take on the project without a partner,
connect both devices to one laptop and run the sender and the receiver as two
programs. Each program then says which device it means, by the UID of the
master brick, which the Brick Viewer shows:

```python static
from lifi_hardware import led, sensor, use_device

use_device("abc123")  # replace with the UID of your master brick
led.set_color(255, 0, 0)
```

You lose the partner, not the project. Only the interop test in challenge 3
needs another team; on your own, you hand your protocol description to someone
who does not know your code, or to an AI assistant in a fresh session, and ask
them to describe the receiver they would build. The gaps show up just the same.

Inside the 3D-printed case are three parts from Tinkerforge:

| Part | Job |
|---|---|
| Master Brick | controls everything and connects to the laptop via USB-C |
| RGB LED Bricklet 2.0 | the sender, each colour from 0 to 255 |
| Color Bricklet 2.0 | the receiver, measures red, green, blue and unfiltered light (C), each from 0 to 65535 |

LED and sensor sit side by side at the front, separated by a wall so that a
device does not see its own light. The small white lamp on the sensor stays
off; it only adds stray light. The sensor's integration time and gain can be
set; both change how sensitive and how fast it measures.

The only thing you build yourselves is your optics between the devices.
Anything that does not itself produce or measure light is allowed, such as
tubes, cardboard, paint, foil, mirrors, lenses or 3D-printed parts. Extra
sensors, further light sources, lasers or swapping the LED or sensor are not
allowed.

## Software and AI assistant

You program in Python with Visual Studio Code, and OpenCode is set up as the
AI assistant. Your program runs on the laptop and controls the device over
USB; nothing is flashed onto it. For the laptop to find the device, the Brick
Daemon has to run in the background; the Brick Viewer shows whether everything
is recognised.

For access to LED and sensor there is the course module `lifi_hardware`. With
it, commands like `led.set_color(r, g, b)` and `sensor.read()` are enough,
without you having to deal with the details of the hardware. How you get the
course module and the templates onto your computer is stated in your course.

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
