---
title: Encoding and decoding
summary: >-
  With two colours, four letters and a tiny codebook, practise the two halves
  of Challenge 2: turn text into colours letter by letter and measured
  colours back into text, with one script for the sender and one for the
  receiver, at a fixed symbol rate and with no course server.
objectives:
  intro: "In this exercise you write the functions that read a codebook in both directions, and afterwards you can:"
  goals:
    - "turn a letter into a sequence of colours with a codebook (encoding) and match a measured sequence to its letter again (decoding)"
    - "keep sending a whole text apart from encoding a single letter, as in Challenge 2"
    - "explain why two colours need exactly two positions for four letters"
translation_of: de
based_on: 2026-11-16
---

In Challenge 2 your sender sends text as colours, and your receiver turns
the colours back into text. Here you practise the translations at a slow,
fixed pace, with the smallest codebook that is still of any
use: two colours, `off` and `on`, and the four letters T, E, A and M from
the slide "perfect reception, perfect nonsense"
([[symbols-and-information-slides]]). Because 2 × 2 = 4, every letter gets
exactly two colours, a code of fixed length ([[code-systems]]).

| Letter | Colours |
|---|---|
| T | off off |
| E | off on |
| A | on off |
| M | on on |

Every colour shows for `1 / SYMBOL_RATE` seconds, one second in the
template, and there is no course server: everything stays on your laptops.

## Two scripts, two sides

The sender and the receiver each have a script of their own, and each has
its own `CODEBOOK`, just as each side has its own table on the slide. The
functions have the names of Challenge 2 and split the work the same way:

| Sender | Receiver |
|---|---|
| `send_text(text)` sends the whole text, letter by letter | `receive_text(n_chars)` receives that many letters and returns the text |
| `encode_letter(letter)` returns the colours of one letter | `decode_letter(colors)` returns the letter for some colours |
| `send_symbol(name)` shows one colour for `1 / SYMBOL_RATE` seconds (done) | `receive_symbol()` measures one colour and returns the name of the most similar one in `REFERENCES` (done) |

On each side you write the top two; `send_symbol` and `receive_symbol` are
done. `receive_symbol` recognises a colour as in Challenge 1, by the most
similar reading in `REFERENCES`, so the receiver also works with more
colours in `COLORS`, and your own version from Challenge 1 fits in as
well.

### The sender

The script for the sending side; wherever it says `TODO`, your code is
missing:

```python static file=sender.py
import time

from lifi_hardware import LifiDevice

# Both devices on this computer: the UID of the SENDING device, for example
# "6Dccqf" (the error message without it lists both). Two laptops: None.
DEVICE = None

# Colours per second: each colour shows for 1 / SYMBOL_RATE seconds.
# receiver.py needs the same value.
SYMBOL_RATE = 1

COLORS = {
    "off": (0, 0, 0),
    "on":  (255, 255, 255),
}

# Which colours stand for which letter. receiver.py has its own copy.
CODEBOOK = {
    "T": ["off", "off"],
    "E": ["off", "on"],
    "A": ["on",  "off"],
    "M": ["on",  "on"],
}

lifi = LifiDevice.connect(master=DEVICE, server=None, log_file=None)


def send_symbol(name):
    """Shows one colour for 1 / SYMBOL_RATE seconds."""
    lifi.led.set_color(*COLORS[name])
    time.sleep(1 / SYMBOL_RATE)


def encode_letter(letter):
    """Encoding: returns the colours of one letter, for example
    ["off", "on"] for "E"."""
    # TODO: look up the letter in CODEBOOK and return its colours
    return []


def send_text(text):
    """Sends the text letter by letter: encode each letter with
    encode_letter, then send each of its colours with send_symbol."""
    # TODO: a loop over the letters of text
    pass


print("Calibration: the receiver measures off, then on.")
for name in COLORS:
    lifi.led.set_color(*COLORS[name])
    input(f"The LED shows {name}. Say \"now\", Enter once the receiver has measured ")
lifi.led.off()

while True:
    text = input("\nText to send: ")
    time.sleep(5 - time.time() % 5)     # start at the next full five seconds, as the receiver
    send_text(text)
    lifi.led.off()
```

### The receiver

The script for the receiving side; `LENGTH` says how many colours belong to
one letter:

```python static file=receiver.py
import time

from lifi_hardware import LifiDevice

# Both devices on this computer: the UID of the RECEIVING device, for example
# "6QkrXy" (the error message without it lists both). Two laptops: None.
DEVICE = None

# Colours per second, the same value as in sender.py
SYMBOL_RATE = 1

# The colours, the same names as in sender.py
COLORS = {
    "off": (0, 0, 0),
    "on":  (255, 255, 255),
}

# Which colours stand for which letter: a copy of the one in sender.py
CODEBOOK = {
    "T": ["off", "off"],
    "E": ["off", "on"],
    "A": ["on",  "off"],
    "M": ["on",  "on"],
}

# Colours per letter: two colours and two positions give 2 x 2 = 4 letters
LENGTH = 2

# What each colour looks like to the sensor, learnt in the calibration
REFERENCES = {}

lifi = LifiDevice.connect(master=DEVICE, server=None, log_file=None)

for name in COLORS:
    input(f"Calibration: Enter when the sender says \"now\" for {name} ")
    REFERENCES[name] = lifi.sensor.read()
    print(f"  {name}: {REFERENCES[name]}")


def receive_symbol():
    """Measures one colour, returns the name of the most similar reference
    (as in Challenge 1, your own version works here too) and waits until the
    next colour."""
    reading = lifi.sensor.read()
    best, best_distance = None, None
    for name, reference in REFERENCES.items():
        distance = sum((a - b) ** 2 for a, b in zip(reading, reference))
        if best is None or distance < best_distance:
            best, best_distance = name, distance
    print(f"  {best}")
    time.sleep(1 / SYMBOL_RATE)
    return best


def decode_letter(colors):
    """Decoding: returns the letter whose colours are exactly `colors`, for
    example "E" for ["off", "on"], and "?" if no letter has these colours."""
    # TODO: find the letter in CODEBOOK whose colours are colors
    return "?"


def receive_text(n_chars):
    """Receives n_chars letters: for each one, collect LENGTH colours with
    receive_symbol, decode them with decode_letter and add the letter to
    the text. Returns the text."""
    text = ""
    # TODO: a loop over the letters to come
    return text


while True:
    n_chars = int(input("\nHow many letters? "))
    time.sleep(5 - time.time() % 5)     # start at the next full five seconds, as the sender
    time.sleep(0.5 / SYMBOL_RATE)       # measure in the middle of each colour
    print(f"Received: {receive_text(n_chars)}")
```

## Starting

You start both scripts at the same time, with `python sender.py` and
`python receiver.py` (on a Mac `python3`):

- **One computer, both devices:** Open two terminals in VS Code, one script
  in each. So that each script finds its device, put the UID of the sending
  or receiving device into `DEVICE`; if you start a script without it, the
  error message names both UIDs.
- **Two laptops, one device each:** `sender.py` runs on one, `receiver.py`
  on the other, and `DEVICE` stays `None`.

The receiver calibrates first: the sender shows every colour of `COLORS`
in turn and calls "now", the receiver presses Enter and stores the reading
in `REFERENCES`, and then the sender presses Enter for the next colour.

Then the sender types a word and says how many letters it has, the receiver
types that number, and both press Enter. Both scripts begin at the next full
five-second tick of the clock, the sender with the first colour and the
receiver half a colour later, so that it measures in the middle of each
colour. As long as you both press Enter within the same five seconds, the
scripts run in step. With two laptops, the clocks of both computers have to
agree for this; if every letter arrives wrong, one of the clocks is probably
ahead.

## Task 1: Encoding

In `sender.py`, first write `encode_letter(letter)`: the function gets a
letter, such as `"E"`, and returns its colours from the `CODEBOOK`, here
`["off", "on"]`. Then `send_text(text)`: it goes through the text letter by
letter, encodes each one with `encode_letter` and sends each of its colours
with `send_symbol`.

> [!HINT]
> The `CODEBOOK` is a dictionary: the letter is the key, the list of colours
> the value. Encoding here means looking up by the key.

> [!HINT]
> `send_text` needs two loops, one inside the other: the outer one over the
> letters of the text, the inner one over the colours of a letter.

## Task 2: Decoding

In `receiver.py`, first write `decode_letter(colors)`: the function gets the
measured colours of one letter, such as `["off", "on"]`, and returns the
letter that has exactly these colours, here `"E"`. If no letter fits, it
returns `"?"`. Then `receive_text(n_chars)`: for each of the `n_chars`
letters it collects `LENGTH` colours with `receive_symbol`, decodes them
with `decode_letter` and adds the letter to the text.

> [!HINT]
> The same codebook, only read the other way round: go through all entries
> with `for letter, code in CODEBOOK.items():` and compare `code` with the
> measured colours. Python compares two lists with `==` position by
> position.

> [!HINT]
> A list grows with `colors.append(receive_symbol())`, a text with
> `text += letter`.

## Task 3: Send and receive

First send single letters, then words such as `TEAM`, `MEAT`, `MATE` or
`TEA`. Then swap roles, so that everyone encodes once and decodes once.

Finally, rebuild the slide: in `receiver.py` only, swap the colours of T and
M in the `CODEBOOK` and send `TEAM`. Every colour arrives correctly, and
still the receiver shows `MEAT`.

## Task 4: Faster

Raise `SYMBOL_RATE` in both scripts to 2, then to 4 and 8, and send the same
words each time. Note from which rate on letters arrive wrong.

## To think about

- What does the receiver show when a colour is measured wrongly, and how do
  you notice when the two codebooks do not match?
- In Challenge 2 the codebook needs 26 letters and the space. How large does
  `LENGTH` get with `off` and `on`, and how large with four colours?
- What happens if you type `team` in small letters or send a word with a
  B, and where in the code does the error arise?
- Why do letters get lost from a certain symbol rate on, although the
  sensor recognises every single colour reliably?
