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
based_on: 2026-11-03
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

## Sample solutions

For each of the six tasks there is a solution you can copy or download as a file. Open it only once your own version runs or you are stuck: reading a finished solution is easier than writing one yourself, and only the writing is practice.

**Task 1:** Calling a function with values: the LED goes red, and after two seconds `led.off()` switches it off.

> [!SOLUTION]
> ```python static file=task_1_light_on.py
> # Challenge 0, task 1: Light on. A sample solution.
> #
> # The LED shines red for two seconds and then goes off.
> #
> # Run it with:  python task_1_light_on.py   (on a Mac: python3)
>
> import time
>
> from lifi_hardware import led
>
> led.set_color(255, 0, 0)    # red: full red, no green, no blue
>
> time.sleep(2)
>
> led.off()                   # the same as led.set_color(0, 0, 0)
> ```

**Task 2:** A loop: on, wait, off, wait, five times, without writing it five times.

> [!SOLUTION]
> ```python static file=task_2_blink.py
> # Challenge 0, task 2: Blink. A sample solution.
> #
> # The LED blinks five times: half a second on, half a second off.
> #
> # Run it with:  python task_2_blink.py   (on a Mac: python3)
>
> import time
>
> from lifi_hardware import led
>
> for i in range(5):
>     led.set_color(255, 255, 255)    # on, here in white
>     time.sleep(0.5)
>     led.off()
>     time.sleep(0.5)
> ```

**Task 3:** A list of colours, gone through with a loop, with each colour taken apart into its three numbers.

> [!SOLUTION]
> ```python static file=task_3_color_cycle.py
> # Challenge 0, task 3: Colour cycle. A sample solution.
> #
> # The LED shows all colours from the list one after the other, each for one
> # second.
> #
> # Run it with:  python task_3_color_cycle.py   (on a Mac: python3)
>
> import time
>
> from lifi_hardware import led
>
> colors = [
>     (255, 0, 0),      # red
>     (0, 255, 0),      # green
>     (0, 0, 255),      # blue
>     (255, 255, 0),    # yellow: red and green together
>     (255, 0, 255),    # magenta: red and blue together
> ]
>
> for color in colors:
>     r, g, b = color             # take the three numbers apart
>     led.set_color(r, g, b)
>     time.sleep(1)
>
> led.off()
> ```

**Task 4:** A function that gives four values back at once, taken apart into `r, g, b, c` and printed each time you press Enter.

> [!SOLUTION]
> ```python static file=task_4_measure.py
> # Challenge 0, task 4: Measure. A sample solution.
> #
> # Every time you press Enter, the program takes one reading; q and Enter
> # stops it.
> #
> # Run it with:  python task_4_measure.py   (on a Mac: python3)
>
> from lifi_hardware import sensor
>
> print("Enter = take a reading, q and Enter = stop")
> while True:
>     answer = input()
>     if answer == "q":
>         break
>     r, g, b, c = sensor.read()      # four numbers come back at once
>     print("r =", r, " g =", g, " b =", b, " c =", c)
> ```

**Task 5:** A condition: bright gives green, dark gives red. The threshold is only an example; yours comes from your own readings in task 4.

> [!SOLUTION]
> ```python static file=task_5_react.py
> # Challenge 0, task 5: React. A sample solution.
> #
> # The program measures all the time. When it is bright, the LED shines green.
> # When it is dark, it shines red. Stop it with Ctrl+C.
> #
> # Run it with:  python task_5_react.py   (on a Mac: python3)
>
> import time
>
> from lifi_hardware import led, sensor
>
> # Your own number goes here. Take it from your notes of task 4: somewhere
> # between the clear value with the sensor covered and the one with the torch.
> # 2000 is only an example and will not fit every room.
> threshold = 2000
>
> print("Stop with Ctrl+C")
> while True:
>     r, g, b, c = sensor.read()
>
>     if c > threshold:
>         led.set_color(0, 255, 0)    # bright: green
>     else:
>         led.set_color(255, 0, 0)    # dark: red
>
>     time.sleep(0.2)
> ```

**Task 6:** This task has no single right answer. This version moves everything worth changing (time on, pause, length, announcement, more colours) to the top as constants, so that each attempt is one changed number.

> [!SOLUTION]
> ```python static file=task_6_human_receiver.py
> # Challenge 0, task 6: The human as receiver. A sample solution.
> #
> # The program sends a random sequence of colours. One of you watches and
> # writes it down without looking at the screen. Afterwards you compare.
> #
> # The task has no single right answer: the point is to change one thing at a
> # time and see when the human receiver fails. This version puts the things
> # you can change at the top, so that each experiment is one changed number.
> #
> # Run it with:  python task_6_human_receiver.py   (on a Mac: python3)
>
> import random
> import time
>
> from lifi_hardware import led
>
> # What you change between two attempts, one thing at a time
> ON_TIME = 1.5        # seconds a colour stays on; try 0.5, then 0.2
> OFF_TIME = 0.5       # dark pause between two colours; try 0, then two equal colours meet
> LENGTH = 10          # how many colours are sent
> ANNOUNCE = True      # False: the sequence starts without warning
>
> colors = {
>     "red":   (255, 0, 0),
>     "green": (0, 255, 0),
>     "blue":  (0, 0, 255),
>     "white": (255, 255, 255),
>     # more colours make it harder, for example:
>     # "yellow":  (255, 255, 0),
>     # "magenta": (255, 0, 255),
> }
>
> names = list(colors.keys())
> sequence = [random.choice(names) for _ in range(LENGTH)]
>
> input("Receiver ready? Do not look at the screen. Press Enter. ")
>
> if ANNOUNCE:
>     print("Starting in 3 seconds ...")
> time.sleep(3)
>
> for name in sequence:
>     r, g, b = colors[name]
>     led.set_color(r, g, b)
>     time.sleep(ON_TIME)
>     led.off()
>     time.sleep(OFF_TIME)
>
> print()
> print("What was sent:")
> print("  " + ", ".join(sequence))
> print()
> print("Compare this with what was written down.")
> ```

## The demo from session 4

In session 4 a receiver that recognises red, green and blue was written live in the room. Here it is in a tidied-up version, together with the matching sender. There are two files because each script controls exactly one device; with both devices on one laptop, each file names its device with `use_device`, and the Brick Viewer shows you the UID of the master brick. Start the receiver first, while the sender's LED is still off, so that it can measure the room light.

The sender shows red, green and blue in turn, one second each, and switches the LED off again after Ctrl+C.

```python static file=demo_sender.py
# Demo from session 4: the sender.
#
# Shows red, green and blue in turn, again and again, each for one second.
# Together with demo_receiver.py, which runs at the same time on the other
# device, this is the demo written live in session 4.
#
# Both devices on one laptop: write the UID of the master brick of the
# SENDING device below. The Brick Viewer shows which UID belongs to which
# box. With only one device on this laptop, delete the use_device line.
#
# Start the receiver first, so that it can measure the room light while
# this LED is still off. Then start this file. Stop both with Ctrl+C.
#
# Run it with:  python demo_sender.py   (on a Mac: python3)

import time

from lifi_hardware import led, use_device

use_device("put the UID of the sending device here")

colors = [
    (255, 0, 0),      # red
    (0, 255, 0),      # green
    (0, 0, 255),      # blue
]

print("Sending red, green, blue. Stop with Ctrl+C")
try:
    while True:
        for color in colors:
            r, g, b = color
            led.set_color(r, g, b)
            time.sleep(1)
finally:
    led.off()        # also after Ctrl+C, so the LED does not stay on
```

The receiver measures the room light once as a baseline, subtracts it from every reading, picks the colour by the largest channel with `if` and `elif`, and prints only when the colour changes (`previous_color`).

```python static file=demo_receiver.py
# Demo from session 4: the receiver.
#
# Measures all the time and says which colour the other device shows, red,
# green or blue. It prints only when the colour changes.
#
# The idea in three steps:
#   1. Baseline: before anything is sent, measure the room light once.
#   2. Subtract the baseline from every new reading, so that what is left
#      is the light of the other LED.
#   3. Whichever of r, g and b is largest after that decides the colour.
#
# Both devices on one laptop: write the UID of the master brick of the
# RECEIVING device below. With only one device on this laptop, delete the
# use_device line.
#
# Start this file first, while the sending LED is still off, then start
# demo_sender.py. Stop with Ctrl+C.
#
# Run it with:  python demo_receiver.py   (on a Mac: python3)

import time

from lifi_hardware import sensor, use_device

use_device("put the UID of the receiving device here")

# 1. Baseline: the average of ten readings of the room light
print("Measuring the room light, keep the sending LED off ...")
total_r, total_g, total_b = 0, 0, 0
for i in range(10):
    r, g, b, c = sensor.read()
    total_r = total_r + r
    total_g = total_g + g
    total_b = total_b + b
    time.sleep(0.1)
base_r = total_r / 10
base_g = total_g / 10
base_b = total_b / 10
print("Baseline:", round(base_r), round(base_g), round(base_b))
print("Now start the sender. Stop with Ctrl+C")

previous_color = None

while True:
    r, g, b, c = sensor.read()

    # 2. Subtract the room light
    r = r - base_r
    g = g - base_g
    b = b - base_b

    # 3. The largest channel decides
    if r > g and r > b:
        color = "red"
    elif g > r and g > b:
        color = "green"
    else:
        color = "blue"

    # Print only when something changed, otherwise the screen fills up
    if color != previous_color:
        print(color)
        previous_color = color

    time.sleep(0.1)
```

The demo is a start, not a solution for challenge 1: it knows only three colours, has no "unknown", and its baseline holds only for the light at the start.
