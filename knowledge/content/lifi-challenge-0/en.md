---
title: "Challenge 0: The spark"
summary: >-
  Every device runs on its own laptop: the LED shines in a colour your program sets, and the sensor keeps reporting what it sees.
objectives:
  intro: "With this challenge you get your device running and can then:"
  goals:
    - "make the LED shine in a chosen colour from a program of your own"
    - "read and interpret the four values of the sensor"
    - "measure a brightness threshold yourself instead of guessing it"
    - "name, as a human receiver, what makes a transmission fail"
translation_of: de
based_on: 2026-11-03
---

Before you can transmit anything, each device has to run on your own computer: the
LED shines in a colour you choose in your program, and the sensor reports what it sees.

**Goal:** On each device the LED shines in a colour your program sets, and the sensor
keeps printing its four readings. Each person gets their own device running on
their own laptop, and at the end you switch the LED of one device and watch the
numbers of the sensor opposite change.

**What is new** is everything: for most of you it is the first program you
write, and two tools join you for the whole project, the terminal, where you
start programs, and the AI assistant, which you work with. If this takes you a
while, you are not behind; most people before you had never seen a terminal
either.

**Six tasks, one file each:** the programs build on each other, and the files
are ready in your template; wherever it says `TODO`, your code is missing.

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
`python task_3_color_cycle.py` (on a Mac `python3`).

Below, each task has its own section with what to do, the file as it looks in
your template, a few hints to unfold and a sample solution you can copy or download as a file. Open the
solution only once your own version runs or you are stuck: reading a finished
solution is easier than writing one yourself, and only the writing is practice.

## Task 1: Light on

The LED should shine red for two seconds and then go off again.

**File:** `task_1_light_on.py`; this is how it looks in your template:

```python static file=task_1_light_on.py
# Challenge 0, task 1: Light on
#
# You learn: calling a function and handing it values.
#
# The LED should shine red for two seconds and then go off.
#
# Run it with:  python task_1_light_on.py   (on a Mac: python3)

import time

from lifi_hardware import led

# TODO: set the LED to red
#       Hint: led.set_color(red, green, blue), each value from 0 to 255

time.sleep(2)

# TODO: switch the LED off again
```

> [!HINT]
> `led.set_color(red, green, blue)` sets a colour, and each of the three values lies between 0 and 255. Red therefore means full red, no green and no blue.

> [!HINT]
> To switch it off there is `led.off()`, which has the same effect as `led.set_color(0, 0, 0)`.

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

## Task 2: Blink

The LED should blink five times, half a second on and half a second off each
time, without you writing the same lines five times.

**File:** `task_2_blink.py`; this is how it looks in your template:

```python static file=task_2_blink.py
# Challenge 0, task 2: Blink
#
# You learn: a loop, which means doing something several times without
#            writing it several times.
#
# The LED should blink five times: half a second on, half a second off.
#
# Run it with:  python task_2_blink.py   (on a Mac: python3)

import time

from lifi_hardware import led

for i in range(5):
    # TODO: LED on, wait briefly, LED off, wait briefly
    pass
```

> [!HINT]
> The template already contains `for i in range(5):`. Everything indented below it runs five times in a row, and `pass` is only a placeholder that you replace with your code.

> [!HINT]
> One round is four lines: LED on, wait, LED off, wait. `time.sleep(0.5)` waits half a second.

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

## Task 3: Colour cycle

The LED should show all colours from the list `colors` one after the other,
each for one second. First add at least two colours of your own to the list.

**File:** `task_3_color_cycle.py`; this is how it looks in your template:

```python static file=task_3_color_cycle.py
# Challenge 0, task 3: Colour cycle
#
# You learn: a list, and how to go through it with a loop.
#
# The LED should show all colours from the list one after the other, each for
# one second. Add at least two colours of your own to the list.
#
# Run it with:  python task_3_color_cycle.py   (on a Mac: python3)

import time

from lifi_hardware import led

colors = [
    (255, 0, 0),      # red
    (0, 255, 0),      # green
    (0, 0, 255),      # blue
    # TODO: add at least two colours of your own
]

for color in colors:
    # TODO: set this colour and wait one second
    #       Hint: the three numbers are together in color
    pass
```

> [!HINT]
> A colour is three numbers in round brackets, such as `(255, 255, 0)` for yellow, which comes from red and green together. Each colour stands on its own line and ends with a comma.

> [!HINT]
> Inside the loop, `color` holds one colour with its three numbers at a time. `r, g, b = color` takes them apart into three variables, which you hand to `led.set_color`.

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

## Task 4: Measure

Every time you press Enter, the program takes one reading and prints its four
values; `q` and Enter stop it. Measure in at least four situations and change
only one thing between two readings: in room light, with your hand over the
sensor, with your phone torch from far away and close up. The value `c` is the
brightness; write it down for each situation, because you need it in task 5.

**File:** `task_4_measure.py`; this is how it looks in your template:

```python static file=task_4_measure.py
# Challenge 0, task 4: Measure
#
# You learn: a function that gives something back, and how to take several
#            returned values apart.
#
# Every time you press Enter, the program takes one reading; q and Enter
# stops it. Measure in at least four situations and change only one thing
# between two readings: room light, the sensor covered with your hand, the
# torch of your phone from far away, the torch close up. Write down the
# clear value c for each situation; you need these numbers in task 5.
#
# If a value sticks at 65535, the sensor is overloaded: hold the torch
# further away.
#
# Run it with:  python task_4_measure.py   (on a Mac: python3)

from lifi_hardware import sensor

print("Enter = take a reading, q and Enter = stop")
while True:
    answer = input()
    if answer == "q":
        break
    # TODO: read the sensor, take the result apart into r, g, b, c
    #       and print the four values
    #       Hint: sensor.read() gives back four numbers at once
```

> [!HINT]
> `sensor.read()` gives back four numbers at once, and `r, g, b, c = sensor.read()` puts them into four variables, which you print with `print`.

> [!HINT]
> If `c` sticks at 65535, the sensor is overloaded, and you hold the torch further away.

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

## Task 5: React

The program measures all the time: when it is bright, the LED shines green,
when it is dark, it shines red. It is your first program that makes a
decision, and it keeps running until you stop it with Ctrl+C.

**File:** `task_5_react.py`; this is how it looks in your template:

```python static file=task_5_react.py
# Challenge 0, task 5: React
#
# You learn: a condition, which means doing something different depending on
#            the situation.
#
# The program measures all the time. When it is bright, the LED shines green.
# When it is dark, it shines red. Find the right threshold yourself: put it
# between the clear value with the sensor covered and the one with the torch
# from your notes of task 4.
#
# This is your first program that makes a decision. It keeps running until
# you stop it with Ctrl+C.
#
# Run it with:  python task_5_react.py   (on a Mac: python3)

import time

from lifi_hardware import led, sensor

threshold = 0   # TODO: a value between "covered" and "torch" from task 4

print("Stop with Ctrl+C")
while True:
    r, g, b, c = sensor.read()

    # TODO: if c is greater than threshold, LED green, otherwise red

    time.sleep(0.2)
```

> [!HINT]
> You find the threshold yourselves, in your notes from task 4: it lies between the value `c` with the sensor covered and the one with the torch. A number from the internet or from the assistant does not fit your room.

> [!HINT]
> The decision is an `if` with an `else`: if `c` is greater than `threshold`, the LED turns green, otherwise red.

> [!SOLUTION]
> The threshold 2000 is only an example; yours comes from your own readings in task 4.
>
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

## Task 6: The human as receiver

Your program sends a random sequence of colours, and one of you writes it down
without looking at the screen; then you compare. The first time this works
without effort. It gets interesting when you change exactly one thing each
time: send faster, use more colours, do not announce the start, send the same
colour twice in a row. Write down what made it fail each time. That list is
pretty much the list of problems your program will have to solve in the coming
challenges, and you found it yourselves.

**File:** `task_6_human_receiver.py`; this is how it looks in your template:

```python static file=task_6_human_receiver.py
# Challenge 0, task 6: The human as receiver
#
# You learn: what a receiver actually has to manage.
#
# The program sends a random sequence of colours. One of you watches and
# writes it down without looking at the screen. Afterwards you compare.
#
# Try it several times and change exactly one thing each time:
#   - send faster
#   - use more colours
#   - do not announce when it starts
#   - send the same colour twice in a row
#
# Write down what made it fail each time. This list is exactly the list of
# problems your program has to solve in the coming weeks.
#
# Run it with:  python task_6_human_receiver.py   (on a Mac: python3)

import random
import time

from lifi_hardware import led

colors = {
    "red":   (255, 0, 0),
    "green": (0, 255, 0),
    "blue":  (0, 0, 255),
    "white": (255, 255, 255),
}

names = list(colors.keys())
sequence = [random.choice(names) for _ in range(10)]

input("Receiver ready? Do not look at the screen. Press Enter. ")

for name in sequence:
    led.set_color(*colors[name])
    time.sleep(1.5)          # TODO: make this shorter and see when it breaks
    led.set_color(0, 0, 0)
    time.sleep(0.5)

print()
print("What was sent:")
print("  " + ", ".join(sequence))
print()
print("Compare this with what was written down.")
```

> [!HINT]
> In the template, the time a colour stays on is in `time.sleep(1.5)`. Shorten it step by step, for example to 0.5 and then to 0.2 seconds, and watch from when on the person can no longer keep up.

> [!HINT]
> Move everything you want to change to the top of the file as variables, such as `ON_TIME = 1.5`. Then each attempt is exactly one changed number, and you keep track of what you have already tried.

> [!SOLUTION]
> This task has no single right answer. This version moves everything worth changing to the top as constants: time on, pause, length, announcement and more colours.
>
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
