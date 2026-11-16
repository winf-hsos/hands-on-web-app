---
type: exercise
code: 5142
title: Kodieren und Dekodieren
summary: >-
  Mit zwei Farben, vier Buchstaben und einem winzigen Codebuch die beiden
  Hälften von Challenge 2 üben: einen Buchstaben in Farben übersetzen und
  gemessene Farben wieder in einen Buchstaben, an einem Laptop oder an zwei,
  ohne Takt und ohne Kursserver.
objectives:
  intro: "In dieser Übung schreibst du die beiden Funktionen, die ein Codebuch in beide Richtungen lesen, und kannst danach:"
  goals:
    - "einen Buchstaben mit einem Codebuch in eine Folge von Farben übersetzen (kodieren)"
    - "eine gemessene Folge von Farben im selben Codebuch wieder einem Buchstaben zuordnen (dekodieren)"
    - "begründen, warum zwei Farben für vier Buchstaben genau zwei Stellen brauchen"
level: 1
duration: 25
topics: [representing-information, transferring-information]
modules: [dup]
project: lifi
relations:
  see_also: [code-systems, lifi-challenge-2]
status: draft
updated: 2026-11-16
---

In Challenge 2 schickt euer Sender Text als Farben, und euer Empfänger macht
aus den Farben wieder Text. Bevor dazu noch der Takt kommt, übt ihr hier nur
die beiden Übersetzungen, mit dem kleinsten Codebuch, das noch etwas taugt:
zwei Farben, `off` und `on`, und die vier Buchstaben T, E, A und M von der
Folie „perfect reception, perfect nonsense“ ([[symbols-and-information-slides]]).
Weil 2 × 2 = 4, bekommt jeder Buchstabe genau zwei Farben, ein Code fester
Länge ([[code-systems]]).

| Buchstabe | Farben |
|---|---|
| T | off off |
| E | off on |
| A | on off |
| M | on on |

Es gibt keinen Takt und keinen Kursserver: Ihr drückt für jede Farbe die
Eingabetaste, und alles bleibt auf eurem Laptop.

## Die Vorlage

Ladet die Datei herunter, öffnet sie in VS Code und startet sie mit
`python codebook_warmup.py` (auf dem Mac `python3`). Ihr braucht nur das
Kursmodul `lifi_hardware`, das ihr seit Challenge 1 installiert habt. Ihr
schreibt zwei Funktionen, `encode` und `decode`; alles unterhalb der Zeile
„Nothing to change below this line“ ist fertig.

```python static file=codebook_warmup.py
"""
Warm-up for Challenge 2: encoding and decoding
==============================================

Before you send whole sentences in Challenge 2, practise the two halves of
it with a tiny codebook: two colours, "off" and "on", and the four letters
T, E, A and M from the slide "perfect reception, perfect nonsense". Each
letter becomes two colours, because 2 x 2 = 4.

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
    "T": ["off", "off"],
    "E": ["off", "on"],
    "A": ["on",  "off"],
    "M": ["on",  "on"],
}


def encode(letter):
    """Encoding: returns the list of colours that stand for this letter,
    for example ["off", "on"] for "E".

    The sender calls it for every letter it is about to send.
    """
    # TODO: look up the letter in CODEBOOK and return its colours
    return []


def decode(colors):
    """Decoding: returns the letter whose colours are exactly `colors`, for
    example "E" for ["off", "on"]. If no letter has these colours, it
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

Die Vorlage prüft beim Start zuerst ohne Gerät, ob eure beiden Funktionen
jeden Buchstaben hin und zurück richtig übersetzen. Erst wenn alle vier
stimmen, sucht sie die Geräte. Dann gibt es zwei Fälle:

- **Ein Laptop, beide Geräte:** Die Vorlage fragt, welches Gerät sendet,
  misst `off` und `on` einmal zum Kalibrieren und sendet danach jeden
  Buchstaben, den ihr eintippt. Sie misst die Farben, dekodiert sie und
  zeigt, ob derselbe Buchstabe ankam.
- **Zwei Laptops, je ein Gerät:** Ihr startet die Datei auf beiden und sagt
  jeweils, ob dieser Laptop sendet oder empfängt. Beim Kalibrieren und bei
  jeder Farbe ruft die sendende Person „jetzt“, die empfangende drückt Enter
  und misst, und erst danach geht es auf der sendenden Seite mit Enter zur
  nächsten Farbe.

## Aufgabe 1: Kodieren

Schreibt `encode(letter)`. Die Funktion bekommt einen Buchstaben, etwa `"E"`,
und gibt seine Farben aus dem `CODEBOOK` zurück, also `["off", "on"]`. Der
Sender ruft sie für jeden Buchstaben auf, bevor er ihn sendet.

```python static
def encode(letter):
    # TODO: look up the letter in CODEBOOK and return its colours
    return []
```

> [!HINT]
> Das `CODEBOOK` ist ein Dictionary: Der Buchstabe ist der Schlüssel, die
> Liste der Farben der Wert. Kodieren heißt hier, mit dem Schlüssel
> nachzuschlagen.

## Aufgabe 2: Dekodieren

Schreibt `decode(colors)`. Die Funktion bekommt die gemessenen Farben eines
Buchstabens, etwa `["off", "on"]`, und gibt den Buchstaben zurück, zu dem
genau diese Farben gehören, also `"E"`. Passt kein Buchstabe, gibt sie `"?"`
zurück. Der Empfänger ruft sie auf, sobald er zwei Farben gemessen hat.

```python static
def decode(colors):
    # TODO: find the letter in CODEBOOK whose colours are `colors`
    return "?"
```

> [!HINT]
> Dasselbe Codebuch, nur andersherum gelesen: Geht mit
> `for letter, code in CODEBOOK.items():` durch alle Einträge und vergleicht
> `code` mit den gemessenen Farben.

> [!HINT]
> Zwei Listen vergleicht Python mit `==` Stelle für Stelle:
> `["off", "on"] == ["off", "on"]` ist `True`, `["on", "off"]` ist etwas
> anderes.

## Aufgabe 3: Senden und empfangen

Sendet zuerst einzelne Buchstaben, dann Wörter aus T, E, A und M, etwa
`TEAM`, `MEAT`, `MATE` oder `TEA`. Wer mit zwei Laptops arbeitet, tauscht
danach die Rollen, so dass jede Person einmal kodiert und einmal dekodiert.

Zum Schluss stellt ihr die Folie nach: Vertauscht nur auf der empfangenden
Seite im `CODEBOOK` die Farben von T und M und sendet `TEAM`. Jede Farbe kommt
richtig an, und trotzdem steht beim Empfänger `MEAT`.

## Zum Nachdenken

- Was zeigt der Empfänger, wenn eine Farbe falsch gemessen wird, und woran
  merkt ihr das, ohne den Sender zu fragen? Und woran merkt ihr es, wenn die
  beiden Codebücher nicht übereinstimmen?
- Wie viele Stellen bräuchtet ihr mit `off` und `on` für alle 26 Buchstaben
  und das Leerzeichen, und wie viele mit vier Farben?
- In dieser Übung sagt „jetzt“, wann gemessen wird. Was muss euer Code in
  Challenge 2 stattdessen leisten?
