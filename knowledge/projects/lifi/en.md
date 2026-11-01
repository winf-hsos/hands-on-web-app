---
title: "LiFi: sending data with light"
summary: >-
  In pairs you build a link made of light from a coloured LED and a colour
  sensor, and in five challenges you get it to transmit a whole file without
  errors.
translation_of: de
based_on: 2026-11-01
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
keeps printing its four readings. Each person gets their own device running on
their own laptop, and at the end you switch the LED of one device and watch the
numbers of the sensor opposite change.

**What is new** is everything: for most of you it is the first program you
write, and two tools join you for the whole project, the terminal, where you
start programs, and the AI assistant, which you work with. If this takes you a
while, you are not behind; most people before you had never seen a terminal
either.

**Task:** Six small programs, one file each, that build on each other. Wherever
the template says `TODO`, your code is missing.

| | File | What you learn |
|---|---|---|
| 1 | `task_1_light_on.py` | calling a function and handing it values |
| 2 | `task_2_blink.py` | a loop, which means doing something several times |
| 3 | `task_3_color_cycle.py` | a list and how to go through it |
| 4 | `task_4_measure.py` | a function that gives values back, and measuring one situation at a time |
| 5 | `task_5_react.py` | a condition, which means acting differently depending on the situation |
| 6 | `task_6_human_receiver.py` | what a receiver actually has to manage |

There are no more building blocks than these: everything you program in the
project is made of instructions one after the other, repeated, and under a
condition. You run each task on its own, for example with
`python task_3_color_cycle.py`; task 5 keeps running until you stop it with
Ctrl+C.

**You find the threshold yourselves.** In task 4 you take one reading per
Enter: in room light, with your hand over the sensor, with your phone torch
from far away and close up. The value `c` is the brightness, and your threshold
for task 5 goes between "covered" and "torch". If `c` sticks at 65535, the
sensor is overloaded and you hold the torch further away.

**Be the receiver yourself, once:** in task 6 your program sends a sequence of
colours, and one of you writes it down without looking at the screen; then you
compare. The first time this works without effort. It gets interesting when you
change exactly one thing each time: send faster, use more colours, do not
announce the start, send the same colour twice in a row. Write down what made
it fail each time. That list is pretty much the list of problems your program
will have to solve in the coming challenges, and you found it yourselves.

**It is done** when the programs run on both devices and you make a small
change to them while someone watches, such as "make the LED blink twice as
fast" or "turn the condition in task 5 around". This is not a trap but the
start of a habit that stays until the end: you can change your own code on the
spot and know what will happen, even where parts of it were written with the
assistant. Nothing is measured, there is no ranking and nothing to hand in, but
without a running device you cannot even begin challenge 1.

**Typical pitfalls:** the Brick Daemon is not running; without it your program
cannot find the hardware, however correct the code is, so check it first, every
time. On Windows Python is missing from the search path, almost always because
of the missing tick at "Add python.exe to PATH" during installation, and on a
Mac the commands are `python3` and `pip3`. If the Brick Viewer does not show
the device, the problem lies before your code, not in it: cable, port, power.

**The numbers do not match:** you send `(255, 0, 60)` to the LED, and the
sensor reports completely different values. That is correct, not a bug. Why it
is so and what follows from it is the subject of the next phase; leave the
question open until then.

**For the quick ones:** try different colours and note what the sensor reports
for each, then change the distance and watch what happens to the numbers. You
will need these notes in challenge 1 straight away.

## How many colours can the sensor tell apart? {#alphabet}

Now it is about the link itself. A sensor never measures exactly the same
thing twice, ambient light interferes, and distance changes everything. The
question of this phase is how many states your setup can reliably tell apart,
because that is your alphabet for everything that follows.

Such an alphabet is a place value system, and the number of your colours is
its base: if you can reliably tell four colours apart, you work in base 4, and
a sequence of colours is a number ([[place-value-systems]]). Two things follow
for everything after this: the order is part of the message, because
red-yellow-green and green-yellow-red are different code words, and the
arithmetic runs both ways. With *k* colours and *n* positions you can tell
*k*ⁿ code words apart, so if you know how many characters you need, you can
work out how many positions that costs.

### Challenge 1: The alphabet {#challenge-1}

**Goal:** Find out how many states your link distinguishes in 50 attempts
without a single error. This decides the whole project: whoever reliably tells
four states apart later sends two bits per symbol, whoever manages sixteen
sends four and transmits twice as much at the same speed.

**What is new** is that for the first time you have to find something out about
your setup instead of thinking it up. Nobody knows in advance how many states
can be told apart, the AI assistant included, because it depends on your
sensor, your distance, your room and whatever you build in between.

**Task:** The sender shows a colour from a set you define yourselves, and the
receiver says which one it was. Timing does not matter yet: a human presses
Enter, the program measures, and the name of the recognised state appears on
the receiver's screen.

**You count three times,** and all three numbers belong in your notes:

1. **By eye:** before you write a line of code, you count how many colours you
   can reliably tell apart yourselves when you see them one at a time, not side
   by side. In some respects your eye beats the sensor by far, in others it
   clearly loses, and one reason matters for the rest of the challenge: your
   vision recalibrates itself all the time when the light in the room changes,
   while the sensor simply reports different numbers.
2. **Without aids:** bare LED, bare sensor, fixed distance.
3. **With your setup:** you build your light channel, a tube, a shade or
   whatever you come up with, and measure again.

The third, better result counts. Without the second, though, you cannot know
whether your setup made any difference at all, which is exactly why this
control measurement is required. What you may build is described under "What
you need".

**The three results of this challenge** (see "What every challenge produces")
are therefore the measurement logs without and with aids, a photo of your
setup with a sentence on why you built it that way as the description of your
solution, and your log of mistakes. For the last one this challenge is the
richest source: ask the assistant why the tube does not help, and it suggests
matt black inner walls, shades and narrower openings, all plausible and none of
it tested until you have measured it.

**What you fill in in the template:** everything goes into `device.py`, and the
test script asks for exactly five things, nothing more. How you build them
inside is up to you, and you may add as many functions of your own as you like.

| | What |
|---|---|
| `ALPHABET_SIZE` | how many symbols you use, numbered from 0 to `ALPHABET_SIZE - 1` |
| `calibrate_sender()` | plays through your alphabet once |
| `calibrate_receiver()` | measures along and remembers a reference value for each symbol |
| `send_symbol(index)` | shows one symbol and returns only when the receiver has had enough time to measure |
| `receive_symbol()` | measures and returns which symbol it was |

The receiver cannot calculate which symbol has arrived; it first has to learn
what your symbols look like in this setup and then compares every new reading
with the references. Two things follow: during calibration both sides have to
run in the same rhythm, otherwise the receiver assigns its readings to the
wrong symbols, and you calibrate again before every run, at the test table too.

**Self-test and acceptance test are the same script.** You start it on both
computers, each in its role, with `python run_test.py sender` and
`python run_test.py receiver`. Both sides write a log (`sent.txt` and
`received.txt`); put both into one folder and compare them with
`python compare.py`. For quick tries in between, fewer runs are enough
(`--runs 10`). Because exactly this script runs at the acceptance test, you can
rehearse the scored run as often as you like, and nothing new happens at the
test table. A good approach is to start with `ALPHABET_SIZE = 2`, just off and
white, and after 50 runs without a mistake go up to 4 and then to 8; the last
size without mistakes is your result. If `compare.py` shows the same two
symbols mixed up every time, they are too close together; if it looks random,
timing or calibration is the more likely culprit.

**At the acceptance test** you set up your optics at the test table, calibrate,
and 20 random symbols are sent. A single mistake counts as a fail for that
alphabet size, so eight states recognised reliably are worth more than sixteen
with an occasional mix-up. As the live change you extend your alphabet, for
example to up to twelve symbols, and run the test again; for that you have to
find the places in your code that depend on the size of the alphabet.

**Typical pitfalls:** fixed thresholds instead of calibrating before every run
("above 500 in the red channel means red" works on Tuesday and fails on
Thursday, because the light in the room is different; whoever notices this
arrives at calibration, the strongest result this challenge has to offer),
overlooking the unfiltered channel C although it is the most sensitive, too few
repetitions when measuring (seeing each state three times without a mistake
tells you nothing yet), and colours that look nice rather than colours the
sensor can tell apart well.

**For the quick ones:** try different integration times of the sensor and
measure what they change. Longer measurements are calmer but allow fewer
measurements per second, and exactly this trade-off decides your throughput in
challenge 4.

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

## A whole file {#packet}

The final is no longer about text but about bytes: a file you have not seen
before has to arrive unchanged. The shared frame from the standards meeting
defines what a packet looks like; everything else is up to you.

### Challenge 4: The packet {#challenge-4}

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
