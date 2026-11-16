---
type: exercise
code: 5142
title: Kodieren und Dekodieren
summary: >-
  Mit zwei Farben, vier Buchstaben und einem winzigen Codebuch die beiden
  Hälften von Challenge 2 üben: Text Buchstabe für Buchstabe in Farben
  übersetzen und gemessene Farben wieder in Text, mit einem Skript für den
  Sender und einem für den Empfänger, mit fester Symbolrate und ohne Test
  und Wertung.
objectives:
  intro: "In dieser Übung schreibst du die Funktionen, die ein Codebuch in beide Richtungen lesen, und kannst danach:"
  goals:
    - "einen Buchstaben mit einem Codebuch in eine Folge von Farben übersetzen (kodieren) und eine gemessene Folge wieder einem Buchstaben zuordnen (dekodieren)"
    - "das Senden eines ganzen Texts vom Kodieren eines einzelnen Buchstabens trennen, so wie in Challenge 2"
    - "begründen, warum zwei Farben für vier Buchstaben genau zwei Stellen brauchen"
level: 1
duration: 40
topics: [representing-information, transferring-information]
modules: [dup]
project: lifi
relations:
  see_also: [code-systems, lifi-challenge-2]
status: published
updated: 2026-11-16
---

In Challenge 2 schickt euer Sender Text als Farben, und euer Empfänger macht
aus den Farben wieder Text. Hier übt ihr die Übersetzungen in einem
langsamen, festen Takt, mit dem kleinsten Codebuch, das noch etwas taugt: zwei
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

Jede Farbe steht `1 / SYMBOL_RATE` Sekunden, in der Vorlage also eine
Sekunde. Anders als in den Challenges gibt es weder `run_test` noch eine
Wertung, denn beide Skripte steuern ihr Gerät direkt.

## Zwei Skripte, zwei Seiten

Der Sender und der Empfänger haben je ein eigenes Skript, und jedes hat sein
eigenes `CODEBOOK`, so wie auf der Folie jede Seite ihre eigene Tabelle hat.
Die Funktionen heißen wie in Challenge 2 und teilen die Arbeit genauso auf:

| Sender | Empfänger |
|---|---|
| `send_text(text)` sendet den ganzen Text, Buchstabe für Buchstabe | `receive_text(n_chars)` empfängt so viele Buchstaben und gibt den Text zurück |
| `encode_letter(letter)` gibt die Farben eines Buchstabens zurück | `decode_letter(colors)` gibt den Buchstaben zu einigen Farben zurück |
| `send_symbol(name)` zeigt eine Farbe `1 / SYMBOL_RATE` Sekunden lang (fertig) | `receive_symbol()` misst eine Farbe und gibt den Namen der ähnlichsten aus `REFERENCES` zurück (fertig) |

Ihr schreibt jeweils die oberen beiden; `send_symbol` und `receive_symbol`
sind fertig. `receive_symbol` erkennt eine Farbe wie in Challenge 1 an der
ähnlichsten Messung in `REFERENCES`, deshalb funktioniert der Empfänger auch
mit mehr Farben in `COLORS`, und eure eigene Fassung aus Challenge 1 passt
ebenso hinein.

### Der Sender

Das Skript für die sendende Seite; dort, wo `TODO` steht, fehlt euer Code:

```python static file=sender.py
import time

from lifi_hardware import led, use_device

# Both devices on this laptop: the UID of the SENDING device instead of
# XXXXXX (the error message lists both). Two laptops: comment this line out.
use_device("XXXXXX")

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


def send_symbol(name):
    """Shows one colour for 1 / SYMBOL_RATE seconds."""
    led.set_color(*COLORS[name])
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
    led.set_color(*COLORS[name])
    input(f"The LED shows {name}. Say \"now\", Enter once the receiver has measured ")
led.off()

while True:
    text = input("\nText to send: ")
    time.sleep(5 - time.time() % 5)     # start at the next full five seconds, as the receiver
    send_text(text)
    led.off()
```

### Der Empfänger

Das Skript für die empfangende Seite; `LENGTH` sagt, wie viele Farben zu
einem Buchstaben gehören:

```python static file=receiver.py
import time

from lifi_hardware import sensor, use_device

# Both devices on this laptop: the UID of the RECEIVING device instead of
# XXXXXX (the error message lists both). Two laptops: comment this line out.
use_device("XXXXXX")

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

for name in COLORS:
    input(f"Calibration: Enter when the sender says \"now\" for {name} ")
    REFERENCES[name] = sensor.read()
    print(f"  {name}: {REFERENCES[name]}")


def receive_symbol():
    """Measures one colour, returns the name of the most similar reference
    (as in Challenge 1, your own version works here too) and waits until the
    next colour."""
    reading = sensor.read()
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

## Starten

Ihr startet beide Skripte gleichzeitig, mit `python sender.py` und
`python receiver.py` (auf dem Mac `python3`):

- **Ein Rechner, beide Geräte:** Öffnet in VS Code zwei Terminals, in jedem
  läuft eines der Skripte. Damit jedes Skript sein Gerät findet, ersetzt
  ihr in `use_device("XXXXXX")` den Platzhalter durch die UID des sendenden
  bzw. empfangenden Geräts. Die UIDs zeigt der Brick Viewer, und solange
  der Platzhalter dasteht, nennt auch die Fehlermeldung beide.
- **Zwei Laptops, je ein Gerät:** Auf dem einen läuft `sender.py`, auf dem
  anderen `receiver.py`, und in beiden kommentiert ihr die Zeile mit
  `use_device` aus, denn jeder Laptop findet sein einziges Gerät von selbst.

Zuerst kalibriert der Empfänger: Der Sender zeigt nacheinander jede Farbe
aus `COLORS` und ruft „jetzt“, der Empfänger drückt Enter und speichert die
Messung in `REFERENCES`, danach geht der Sender mit Enter zur nächsten Farbe.

Dann tippt der Sender ein Wort ein und sagt, wie viele Buchstaben es hat, der
Empfänger tippt diese Zahl ein, und beide drücken Enter. Beide Skripte
beginnen beim nächsten vollen Fünf-Sekunden-Schlag der Uhr, der Sender mit
der ersten Farbe und der Empfänger eine halbe Farbe später, damit er in der
Mitte jeder Farbe misst. Drückt ihr also beide innerhalb derselben fünf
Sekunden Enter, laufen die Skripte im Gleichschritt. Mit zwei Laptops müssen
dafür die Uhren beider Rechner übereinstimmen; kommt jeder Buchstabe falsch
an, geht vermutlich eine der Uhren vor.

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

## Aufgabe 4: Schneller

Erhöht `SYMBOL_RATE` in beiden Skripten auf 2, dann auf 4 und 8, und sendet
jedes Mal dieselben Wörter. Notiert, ab welcher Rate Buchstaben falsch
ankommen.

## Zum Nachdenken

- Was zeigt der Empfänger, wenn eine Farbe falsch gemessen wird, und woran
  merkt ihr es, wenn die beiden Codebücher nicht übereinstimmen?
- In Challenge 2 braucht das Codebuch 26 Buchstaben und das Leerzeichen.
  Wie groß wird `LENGTH` mit `off` und `on`, und wie groß mit vier Farben?
- Was passiert, wenn ihr `team` klein schreibt oder ein Wort mit einem B
  sendet, und wo im Code entsteht der Fehler?
- Warum gehen ab einer bestimmten Symbolrate Buchstaben verloren, obwohl
  der Sensor jede Farbe einzeln sicher erkennt?
