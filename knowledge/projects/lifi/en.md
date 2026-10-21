---
title: "LiFi: sending data with light"
summary: >-
  In pairs you build a link made of light from a coloured LED and a colour
  sensor, and in five challenges you get it to transmit a whole file without
  errors.
translation_of: de
based_on: 2026-10-22
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

## Bringing the device to life {#start}

Before you transmit anything, each device has to run on your own computer: the
LED shows a colour you choose in code, and the sensor reports what it sees.

### Challenge 0: The spark {#challenge-0}

**Goal:** On each device the LED shows a colour from your code, and the sensor
keeps printing its four readings.

**Task:** Six small programs that build on each other: light on, blink, cycle
through colours, measure, react to a threshold, and finally a human as the
receiver who reads the colours off by eye.

**It is done** when the programs run and you make a small change to them while
someone watches. Nothing is measured and there is no ranking.

**Typical pitfalls:** the Brick Daemon is not running, Python is missing from
the search path on Windows, and on a Mac the commands are `python3` and `pip3`.
If the Brick Viewer does not show the device, check cable, port and power. And
do not be surprised that the sensor never reports exactly the numbers you sent
to the LED: that is exactly where phase 2 begins.

## How many colours can the sensor tell apart? {#alphabet}

Now it is about the link itself. A sensor never measures exactly the same
thing twice, ambient light interferes, and distance changes everything. The
question of this phase is how many states your setup can reliably tell apart,
because that is your alphabet for everything that follows.

### Challenge 1: The alphabet {#challenge-1}

**Goal:** Find out how many states your link distinguishes in 50 attempts
without a single error.

**Task:** First note how many colours you can tell apart by eye. Then measure:
a human presses Enter for each symbol, so timing does not matter yet. Measure
once with the bare device and once with your own optics between the devices;
the better value counts, and both belong in your notes.

**At the acceptance test** 20 random symbols are sent at the test table. As the
live change you add one more symbol to your alphabet.

**Typical pitfalls:** fixed thresholds instead of calibrating before every run,
overlooking the unfiltered channel C although it is the most sensitive, too few
repetitions when measuring, and colours that look nice rather than colours the
sensor can tell apart well.

**For the quick ones:** try different integration times of the sensor and
measure what they change.

## Colours become letters {#word}

With an alphabet of colours you can send words as soon as two things are
settled: which sequence of colours stands for which letter, and when the
receiver looks. The first is a code table, the second a shared rhythm.

### Challenge 2: The word {#challenge-2}

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

## A protocol others understand {#protocol}

So far the receiver knew when things start and how long the message is. That
now goes away: it has to recognise by itself where a message begins and where
it ends. For that you need rules written down so precisely that another team
could build a receiver from them, and that is exactly what is tested.

### Challenge 3: The listener {#challenge-3}

**Goal:** The receiver is already running before the sender starts and finds
the beginning and end of a message of unknown length without human help.

**Task:** You design a frame around your message, such as a preamble at the
start and an end marker, and a receiver that knows which state it is in: it is
waiting, reading or done. You write your rules down as a protocol description.

**Interop test:** halfway through you swap your protocol description with
another team, and each team builds a receiver for the other's protocol. After
the swap no questions are allowed; whatever is unclear gets written down. The
phase ends with a standards meeting in which the whole group agrees on a shared
frame for phase 5.

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

## A whole file {#packet}

The final is no longer about text but about bytes: a file you have not seen
before has to arrive unchanged. The shared frame from the standards meeting
defines what a packet looks like; everything else is up to you.

### Challenge 4: The packet {#challenge-4}

**Goal:** An unknown file of at most 2 KB, such as a text or a small picture,
is transmitted byte by byte. Whether it really arrived unchanged is shown by
comparing checksums (SHA-256).

**Task:** The group's frame fixes preamble, file type, length, payload,
checksum and end marker. Alphabet, colours, sensor settings, symbol rate,
calibration, how you deal with clocks drifting apart, and your optics are up to
you. For the first time you may use the way back as well: turn one of the
devices around and the receiver can answer the sender, for example to ask for
a broken piece again. That is allowed but not required. Your link manages
roughly 10 to 50 bits per second, so work out how long 2 KB will take.

**What is measured** is the duration, but only if the checksum matches; a
transmission that breaks off at 90 percent does not count. That the receiver
opens and shows the file at the end is the show, not the proof.

**Typical pitfalls:** code that silently expects text, a preamble that can also
occur in arbitrary data, overly ambitious timing, and a setup that does not
survive the trip to the test table.

**For the quick ones:** encrypt the payload, or replace light with sound.

## What you need

Each person gets a fully assembled device, so a team has both ends of the link.
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
without you having to deal with the details of the hardware. You set up the
course folder with the command `/onboarding` in OpenCode; it installs
everything and tests your device. Your own programs belong in the folder
`my-code`, which later updates of the course material never touch.

For each challenge there is a template with fixed functions and a test script.
You test yourselves with exactly this script, and it is also used for the
acceptance test, so do not change it.

> [!NOTE]
> The course module sends your measurements to the course server
> automatically. There you see them in the team cockpit as a timeline of LED
> colour and sensor channels, which helps a lot when hunting for errors.

## How acceptance works

Every challenge from the first one on ends at a shared test table where the
same conditions apply to everyone, including the same fixed distance between
the devices. Calibrate again before every run, because the light at the test
table differs from the light at your seat, and build your optics so that it
survives the trip there.

Each acceptance test includes a live change: you change your code on the spot
according to a given task. This shows that you understand what you built with
the AI assistant. Written documentation is not required, but measurement logs
and a short list of the places where a measurement disproved a suggestion from
the AI help you most yourselves. The only exception is the protocol
description in phase 4, without which the interop test cannot work.

How the challenges are assessed in your semester and when the acceptance tests
take place is stated in your course.
