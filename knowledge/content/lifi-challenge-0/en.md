---
title: "Challenge 0: The spark"
summary: >-
  Every device runs on its own laptop: the LED shows a colour from your code, and the sensor keeps reporting what it sees.
objectives:
  intro: "With this challenge you get your device running and can then:"
  goals:
    - "make the LED shine in a chosen colour from your own code"
    - "read and interpret the four values of the sensor"
    - "measure a brightness threshold yourself instead of guessing it"
    - "name, as a human receiver, what makes a transmission fail"
    - "change your program on purpose in front of an audience"
translation_of: de
based_on: 2026-11-02
---

Before you transmit anything, each device has to run on your own computer: the
LED shows a colour you choose in code, and the sensor reports what it sees.

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
