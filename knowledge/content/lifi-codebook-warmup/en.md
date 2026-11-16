---
title: "Warm-up for Challenge 2: encoding and decoding"
summary: >-
  With two colours, four letters and a tiny codebook, practise the two halves
  of Challenge 2: turn a letter into colours and measured colours back into a
  letter, on one laptop or on two, with no clock and no course server.
objectives:
  intro: "In this exercise you write the two functions that read a codebook in both directions, and afterwards you can:"
  goals:
    - "turn a letter into a sequence of colours with a codebook (encoding)"
    - "match a measured sequence of colours to its letter in the same codebook (decoding)"
    - "explain why two colours need exactly two positions for four letters"
translation_of: de
based_on: 2026-11-16
---

In Challenge 2 your sender sends text as colours, and your receiver turns
the colours back into text. Before the clock comes in as well, you practise
only the two translations here, with the smallest codebook that is still of
any use: two colours, `off` and `on`, and the four letters A to D. Because
2 × 2 = 4, every letter gets exactly two colours, as on the slide with the
codes of fixed length ([[code-systems]]).

| Letter | Colours |
|---|---|
| A | off off |
| B | off on |
| C | on off |
| D | on on |

There is no clock and no course server: you press Enter for every colour,
and everything stays on your laptop.

## The template

Download the file, open it in VS Code and start it with
`python codebook_warmup.py` (on a Mac `python3`). All you need is the course
module `lifi_hardware`, which you have installed since Challenge 1. You
write two functions, `encode` and `decode`; everything below the line
"Nothing to change below this line" is done.

```python static file=codebook_warmup.py
"""
Warm-up for Challenge 2: encoding and decoding
==============================================

Before you send whole sentences in Challenge 2, practise the two halves of
it with a tiny codebook: two colours, "off" and "on", and four letters,
A to D. Each letter becomes two colours, because 2 x 2 = 4.

You write two functions:

  encode(letter)   the sender's half: looks up the colours of a letter
  decode(colors)   the receiver's half: finds the letter for some colours

Everything below the line "Nothing to change below this line" is done for
you. It sends one colour after the other and measures them, with no clock
yet: you press Enter for every colour. The timing comes in Challenge 2.

It works in both set-ups:

  one laptop, both devices   the program sends, measures and decodes by itself
  two laptops, one device    run this file on both; the sender types a
                             letter, and both of you press Enter colour by
                             colour, when the sender says "now"

No course server is used: everything stays on your laptop.

Run it with:  python codebook_warmup.py   (on a Mac: python3)
"""

import os
import time

# This exercise stays on your laptop and never talks to the course server.
os.environ["LIFI_SERVER"] = "off"

from lifi_hardware import receiver, sender  # noqa: E402

# The two colours of this warm-up
COLORS = {
    "off": (0, 0, 0),
    "on":  (255, 255, 255),
}

# Which colours stand for which letter: two positions, two colours each
CODEBOOK = {
    "A": ["off", "off"],
    "B": ["off", "on"],
    "C": ["on",  "off"],
    "D": ["on",  "on"],
}


def encode(letter):
    """Encoding: returns the list of colours that stand for this letter,
    for example ["off", "on"] for "B".

    The sender calls it for every letter it is about to send.
    """
    # TODO: look up the letter in CODEBOOK and return its colours
    return []


def decode(colors):
    """Decoding: returns the letter whose colours are exactly `colors`, for
    example "B" for ["off", "on"]. If no letter has these colours, it
    returns "?".

    The receiver calls it as soon as it has measured the colours of one
    letter.
    """
    # TODO: find the letter in CODEBOOK whose colours are `colors`
    return "?"


# =============================================================================
# Nothing to change below this line
# =============================================================================

LENGTH = len(next(iter(CODEBOOK.values())))   # colours per letter
READINGS = 5                                  # readings per colour in the calibration
THRESHOLD = None                              # set by calibrate()


def send_symbol(name):
    """Shows the colour with this name on the LED of the sending device."""
    sender.led.set_color(*COLORS[name])


def read_clear():
    """The clear channel (all light) of a fresh reading of the receiver."""
    time.sleep(2 * receiver.sensor.integration_time / 1000 + 0.05)
    return receiver.sensor.read().c


def receive_symbol():
    """Measures and returns "on" or "off"."""
    return "on" if read_clear() > THRESHOLD else "off"


def calibrate(off_values, on_values):
    """The receiver learns where "off" ends and "on" begins: halfway between
    the mean brightness of both."""
    global THRESHOLD
    off = sum(off_values) / len(off_values)
    on = sum(on_values) / len(on_values)
    THRESHOLD = (off + on) / 2
    print(f"Calibrated: off is about {off:.0f}, on about {on:.0f}, "
          f"the border lies at {THRESHOLD:.0f}.")
    if on - off < 50:
        print("Careful: off and on hardly differ. Do LED and sensor face each other?")


def has(role):
    """Whether the sending or receiving device is on this laptop; the
    first call finds the devices and asks which one sends."""
    try:
        role.led
        return True
    except Exception as error:      # the other laptop's role, or no device at all
        has.reason = error
        return False


def check_without_device():
    """Encodes and decodes every letter once, without any device."""
    print("Check without device: encode, then decode")
    ok = True
    for letter in CODEBOOK:
        colors = encode(letter)
        back = decode(colors)
        good = colors == CODEBOOK[letter] and back == letter
        ok = ok and good
        print(f"  {letter} -> {' '.join(colors) or '(nothing)':8} -> {back}"
              f"   {'ok' if good else 'wrong'}")
    if not ok:
        print("Not yet: write encode and decode first (see TODO above).")
    print()
    return ok


def letters_to_send():
    """Asks for letters until an empty line; keeps only those in CODEBOOK."""
    while True:
        text = input(f"Letters to send ({', '.join(CODEBOOK)}), Enter alone to stop: ")
        text = text.strip().upper()
        if not text:
            return None
        unknown = sorted({c for c in text if c not in CODEBOOK})
        if unknown:
            print(f"Not in the codebook: {', '.join(unknown)}")
            continue
        return text


def one_laptop():
    """Both devices here: send, measure and decode in one go."""
    values = {}
    for name in COLORS:
        send_symbol(name)
        values[name] = [read_clear() for _ in range(READINGS)]
    sender.led.off()
    calibrate(values["off"], values["on"])
    while (text := letters_to_send()) is not None:
        received_text = ""
        for letter in text:
            colors = encode(letter)
            measured = []
            for name in colors:
                send_symbol(name)
                measured.append(receive_symbol())
            sender.led.off()
            got = decode(measured)
            received_text += got
            print(f"  {letter}: sent {' '.join(colors):8}  measured "
                  f"{' '.join(measured):8}  decoded {got}"
                  f"   {'ok' if got == letter else 'wrong'}")
        print(f"Sent {text}, received {received_text}\n")


def sending_laptop():
    """Only the sender here: show one colour per Enter."""
    print("\nCalibration: the receiver measures off and on once.")
    for name in COLORS:
        send_symbol(name)
        input(f"  The LED shows {name}. Say \"now\", and press Enter when "
              f"the receiver has measured it. ")
    sender.led.off()
    while (text := letters_to_send()) is not None:
        for letter in text:
            colors = encode(letter)
            print(f"  {letter} is {' '.join(colors)}")
            for i, name in enumerate(colors, start=1):
                send_symbol(name)
                input(f"    colour {i} of {len(colors)}: {name}. Say \"now\", "
                      f"press Enter once the receiver has measured it. ")
        sender.led.off()
        print()


def receiving_laptop():
    """Only the receiver here: measure one colour per Enter."""
    print("\nCalibration: the sender shows off and on once.")
    values = {}
    for name in COLORS:
        input(f"  Press Enter when the sender says the LED shows {name}. ")
        values[name] = [read_clear() for _ in range(READINGS)]
    calibrate(values["off"], values["on"])
    print(f"\nEach letter has {LENGTH} colours. Press Enter on every \"now\", "
          f"Ctrl+C to stop.")
    text = ""
    try:
        while True:
            measured = []
            for i in range(1, LENGTH + 1):
                input(f"  colour {i} of {LENGTH}: Enter to measure ")
                measured.append(receive_symbol())
                print(f"    measured {measured[-1]}")
            text += decode(measured)
            print(f"  {' '.join(measured)} is {text[-1]}, received so far: {text}")
    except (KeyboardInterrupt, EOFError):
        print(f"\nReceived: {text}")


if __name__ == "__main__":
    if check_without_device():
        here_sender, here_receiver = has(sender), has(receiver)
        if here_sender and here_receiver:
            one_laptop()
        elif here_sender:
            sending_laptop()
        elif here_receiver:
            receiving_laptop()
        else:
            print(f"No device to work with: {has.reason}")
```

When it starts, the template first checks without any device whether your
two functions translate every letter there and back correctly. Only when all
four are right does it look for the devices. Then there are two cases:

- **One laptop, both devices:** The template asks which device sends,
  measures `off` and `on` once to calibrate, and then sends every letter you
  type. It measures the colours, decodes them and shows whether the same
  letter arrived.
- **Two laptops, one device each:** You start the file on both and say on
  each whether this laptop sends or receives. During the calibration and for
  every colour, the sender calls "now", the receiver presses Enter and
  measures, and only then does the sender press Enter for the next colour.

## Task 1: Encoding

Write `encode(letter)`. The function gets a letter, such as `"B"`, and
returns its colours from the `CODEBOOK`, here `["off", "on"]`. The sender
calls it for every letter before sending it.

```python static
def encode(letter):
    # TODO: look up the letter in CODEBOOK and return its colours
    return []
```

> [!HINT]
> The `CODEBOOK` is a dictionary: the letter is the key, the list of colours
> the value. Encoding here means looking up by the key.

## Task 2: Decoding

Write `decode(colors)`. The function gets the measured colours of one
letter, such as `["off", "on"]`, and returns the letter that has exactly
these colours, here `"B"`. If no letter fits, it returns `"?"`. The receiver
calls it as soon as it has measured two colours.

```python static
def decode(colors):
    # TODO: find the letter in CODEBOOK whose colours are `colors`
    return "?"
```

> [!HINT]
> The same codebook, only read the other way round: go through all entries
> with `for letter, code in CODEBOOK.items():` and compare `code` with the
> measured colours.

> [!HINT]
> Python compares two lists with `==` position by position:
> `["off", "on"] == ["off", "on"]` is `True`, and `["on", "off"]` is
> something else.

## Task 3: Send and receive

First send single letters, then words made of A to D, such as `BAD`, `CAB`
or `DAD`. If you work with two laptops, swap roles afterwards, so that
everyone encodes once and decodes once.

## To think about

- What does the receiver show when a colour is measured wrongly, and how do
  you notice without asking the sender?
- How many positions would you need with `off` and `on` for all 26 letters
  and the space, and how many with four colours?
- In this exercise, "now" says when to measure. What does your code have to
  do instead in Challenge 2?
