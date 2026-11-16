---
type: exercise
code: 5142
title: Kodieren und Dekodieren
summary: >-
  Mit zwei Farben, vier Buchstaben und einem winzigen Codebuch die beiden
  Hälften von Challenge 2 üben: Text Buchstabe für Buchstabe in Farben
  übersetzen und gemessene Farben wieder in Text, mit einem Skript für den
  Sender und einem für den Empfänger, ohne Takt und ohne Kursserver.
objectives:
  intro: "In dieser Übung schreibst du die Funktionen, die ein Codebuch in beide Richtungen lesen, und kannst danach:"
  goals:
    - "einen Buchstaben mit einem Codebuch in eine Folge von Farben übersetzen (kodieren) und eine gemessene Folge wieder einem Buchstaben zuordnen (dekodieren)"
    - "das Senden eines ganzen Texts vom Kodieren eines einzelnen Buchstabens trennen, so wie in Challenge 2"
    - "begründen, warum zwei Farben für vier Buchstaben genau zwei Stellen brauchen"
level: 1
duration: 30
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
die Übersetzungen, mit dem kleinsten Codebuch, das noch etwas taugt: zwei
Farben, `off` und `on`, und die vier Buchstaben T, E, A und M von der Folie
„perfect reception, perfect nonsense“ ([[symbols-and-information-slides]]).
Weil 2 × 2 = 4, bekommt jeder Buchstabe genau zwei Farben, ein Code fester
Länge ([[code-systems]]).

| Buchstabe | Farben |
|---|---|
| T | off off |
| E | off on |
| A | on off |
| M | on on |

Es gibt keinen Takt und keinen Kursserver: Für jede Farbe drückt ihr die
Eingabetaste, und alles bleibt auf euren Laptops.

## Zwei Skripte, zwei Seiten

Der Sender und der Empfänger haben je ein eigenes Skript, und jedes hat sein
eigenes `CODEBOOK`, so wie auf der Folie jede Seite ihre eigene Tabelle hat.
Die Funktionen heißen wie in Challenge 2 und teilen die Arbeit genauso auf:

| Sender | Empfänger |
|---|---|
| `send_text(text)` sendet den ganzen Text, Buchstabe für Buchstabe | `receive_text(n_chars)` empfängt so viele Buchstaben und gibt den Text zurück |
| `encode_letter(letter)` gibt die Farben eines Buchstabens zurück | `decode_letter(colors)` gibt den Buchstaben zu einigen Farben zurück |
| `send_symbol(name)` zeigt eine Farbe (fertig) | `receive_symbol()` misst eine Farbe und gibt sie zurück (fertig) |

Ihr schreibt jeweils die oberen beiden. `send_symbol` und `receive_symbol`
sind fertig und warten hier auf die Eingabetaste; in Challenge 2 entscheidet
stattdessen euer eigener Takt.

### Der Sender

Das Skript für die sendende Seite; dort, wo `TODO` steht, fehlt euer Code:

```python static file=sender.py
"""
Encoding and decoding: the sender
=================================

Sends words made of the letters T, E, A and M, two colours per letter and
one colour per Enter. Its partner is receiver.py, started at the same time:
on this computer in a second terminal, or on a second laptop.

You write two functions, as in Challenge 2:

  encode_letter(letter)   which colours stand for one letter (encoding)
  send_text(text)         sends a whole text, letter by letter

Run it with:  python sender.py   (on a Mac: python3)
"""

from lifi_hardware import LifiDevice

# Both devices on this computer: the UID of the SENDING device, for example
# "6Dccqf" (the error message without it lists both). Two laptops: None.
DEVICE = None

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
    """Shows one colour and waits until the receiver has measured it.
    In Challenge 2 your own clock decides when the next colour comes."""
    lifi.led.set_color(*COLORS[name])
    input(f"    {name:3}  say \"now\", Enter once the receiver has measured ")


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
    send_symbol(name)

while text := input("\nText to send (Enter alone to stop): ").strip().upper():
    if any(letter not in CODEBOOK for letter in text):
        print(f"Only these letters are in the CODEBOOK: {', '.join(CODEBOOK)}")
        continue
    print(f"Tell the receiver: {len(text)} letters")
    send_text(text)
    lifi.led.off()
lifi.close()
```

### Der Empfänger

Das Skript für die empfangende Seite; `LENGTH` sagt, wie viele Farben zu
einem Buchstaben gehören:

```python static file=receiver.py
"""
Encoding and decoding: the receiver
===================================

Receives words made of the letters T, E, A and M, two colours per letter
and one colour per Enter. Its partner is sender.py, started at the same
time: on this computer in a second terminal, or on a second laptop.

You write two functions, as in Challenge 2:

  decode_letter(colors)   which letter some colours stand for (decoding)
  receive_text(n_chars)   receives a whole text, letter by letter

Run it with:  python receiver.py   (on a Mac: python3)
"""

import time

from lifi_hardware import LifiDevice

# Both devices on this computer: the UID of the RECEIVING device, for example
# "6QkrXy" (the error message without it lists both). Two laptops: None.
DEVICE = None

# Which colours stand for which letter: a copy of the one in sender.py
CODEBOOK = {
    "T": ["off", "off"],
    "E": ["off", "on"],
    "A": ["on",  "off"],
    "M": ["on",  "on"],
}

# Colours per letter: two colours and two positions give 2 x 2 = 4 letters
LENGTH = 2

lifi = LifiDevice.connect(master=DEVICE, server=None, log_file=None)
BORDER = None   # brightness between off and on, set by calibrate()


def brightness():
    """The clear channel (all light) of a fresh reading."""
    time.sleep(2 * lifi.sensor.integration_time / 1000 + 0.05)
    return lifi.sensor.read().c


def calibrate():
    """Measures off and on once and puts the border halfway between."""
    global BORDER
    input("Calibration: Enter when the sender says \"now\" for off ")
    off = brightness()
    input("Enter when the sender says \"now\" for on ")
    on = brightness()
    BORDER = (off + on) / 2
    print(f"off is about {off}, on about {on}: above {BORDER:.0f} counts as on")


def receive_symbol():
    """Waits for Enter, measures and returns "on" or "off".
    In Challenge 2 your own clock decides when to measure."""
    input("    Enter to measure ")
    name = "on" if brightness() > BORDER else "off"
    print(f"    {name}")
    return name


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


calibrate()
while (n := input("\nHow many letters? (Enter alone to stop): ").strip()).isdigit():
    print(f"Received: {receive_text(int(n))}")
lifi.close()
```

## Starten

Ihr startet beide Skripte gleichzeitig, mit `python sender.py` und
`python receiver.py` (auf dem Mac `python3`):

- **Ein Rechner, beide Geräte:** Öffnet in VS Code zwei Terminals, in jedem
  läuft eines der Skripte. Damit jedes Skript sein Gerät findet, tragt ihr
  bei `DEVICE` die UID des sendenden bzw. empfangenden Geräts ein; startet
  ihr ein Skript ohne, nennt die Fehlermeldung beide UIDs.
- **Zwei Laptops, je ein Gerät:** Auf dem einen läuft `sender.py`, auf dem
  anderen `receiver.py`, und `DEVICE` bleibt `None`.

Zuerst kalibriert der Empfänger: Der Sender zeigt `off` und ruft „jetzt“,
der Empfänger drückt Enter und misst, dann dasselbe für `on`. Danach tippt
der Sender ein Wort ein und sagt, wie viele Buchstaben es hat, und der
Empfänger tippt diese Zahl ein. Bei jeder Farbe ruft der Sender „jetzt“, der
Empfänger drückt Enter, und erst dann geht der Sender mit Enter zur nächsten
Farbe.

## Aufgabe 1: Kodieren

Schreibt in `sender.py` zuerst `encode_letter(letter)`: Die Funktion bekommt
einen Buchstaben, etwa `"E"`, und gibt seine Farben aus dem `CODEBOOK`
zurück, also `["off", "on"]`. Danach `send_text(text)`: Sie geht den Text
Buchstabe für Buchstabe durch, kodiert jeden mit `encode_letter` und sendet
jede seiner Farben mit `send_symbol`.

> [!HINT]
> Das `CODEBOOK` ist ein Dictionary: Der Buchstabe ist der Schlüssel, die
> Liste der Farben der Wert. Kodieren heißt hier, mit dem Schlüssel
> nachzuschlagen.

> [!HINT]
> `send_text` braucht zwei Schleifen ineinander, außen über die Buchstaben
> des Texts und innen über die Farben eines Buchstabens.

## Aufgabe 2: Dekodieren

Schreibt in `receiver.py` zuerst `decode_letter(colors)`: Die Funktion
bekommt die gemessenen Farben eines Buchstabens, etwa `["off", "on"]`, und
gibt den Buchstaben zurück, zu dem genau diese Farben gehören, also `"E"`.
Passt kein Buchstabe, gibt sie `"?"` zurück. Danach `receive_text(n_chars)`:
Für jeden der `n_chars` Buchstaben sammelt sie `LENGTH` Farben mit
`receive_symbol`, dekodiert sie mit `decode_letter` und hängt den Buchstaben
an den Text an.

> [!HINT]
> Dasselbe Codebuch, nur andersherum gelesen: Geht mit
> `for letter, code in CODEBOOK.items():` durch alle Einträge und vergleicht
> `code` mit den gemessenen Farben. Zwei Listen vergleicht Python mit `==`
> Stelle für Stelle.

> [!HINT]
> Eine Liste wächst mit `colors.append(receive_symbol())`, ein Text mit
> `text += letter`.

## Aufgabe 3: Senden und empfangen

Sendet zuerst einzelne Buchstaben, dann Wörter wie `TEAM`, `MEAT`, `MATE`
oder `TEA`. Danach tauscht ihr die Rollen, so dass jede Person einmal
kodiert und einmal dekodiert.

Zum Schluss stellt ihr die Folie nach: Vertauscht nur in `receiver.py` im
`CODEBOOK` die Farben von T und M und sendet `TEAM`. Jede Farbe kommt
richtig an, und trotzdem steht beim Empfänger `MEAT`.

## Zum Nachdenken

- Was zeigt der Empfänger, wenn eine Farbe falsch gemessen wird, und woran
  merkt ihr es, wenn die beiden Codebücher nicht übereinstimmen?
- In Challenge 2 braucht das Codebuch 26 Buchstaben und das Leerzeichen.
  Wie groß wird `LENGTH` mit `off` und `on`, und wie groß mit vier Farben?
- Hier sagt „jetzt“, wann gemessen wird. Was müssen `send_text` und
  `receive_text` in Challenge 2 stattdessen leisten?
