---
type: challenge
code: 8005
title: "Challenge 2: Das Wort"
summary: >-
  Kurze Sätze aus drei Wörtern fehlerfrei und so schnell wie möglich übertragen, mit einem eigenen Codebuch und einem Takt, den euer Code selbst hält.
objectives:
  intro: "Mit dieser Challenge überträgst du Text und kannst danach:"
  goals:
    - "ein Codebuch von Zeichen auf Folgen eurer Farben festlegen und ausrechnen, wie lang die Codewörter sein müssen"
    - "Sender und Empfänger ohne gemeinsame Uhr über eine feste Symbolrate im Takt halten"
    - "erklären, warum eine Übertragung ab einer bestimmten Symbolrate scheitert"
level: 1
topics: [representing-information, transferring-information]
modules: [dup]
project: lifi
status: published
updated: 2026-11-13
---

Mit einem Alphabet aus Farben lassen sich Wörter übertragen, sobald zwei Dinge
geklärt sind: welche Folge von Farben für welches Zeichen steht, und wann der
Empfänger hinsieht. Das Erste ist ein Codebuch, das Zweite ein gemeinsamer
Takt.

**Ziel:** Kurze Sätze aus drei Wörtern fehlerfrei und so schnell wie möglich
übertragen. Der Kursserver schickt bei jedem Lauf einen neuen Satz aus echten
Wörtern, geschrieben mit den Großbuchstaben A bis Z und einem Leerzeichen
zwischen den Wörtern.

**Neu ist,** dass ab jetzt kein Testskript mehr vorgibt, wann die nächste Farbe
kommt. `run_test` sorgt nur dafür, dass Sender und Empfänger gemeinsam
anfangen; danach hält euer eigener Code den Takt, und wie ihr das schafft,
entscheidet ihr. Außerdem rückt der Test eine Ebene nach oben: Er übergibt dem
Sender Text und erwartet vom Empfänger Text zurück, und eure Funktionen aus
Challenge 1, die eine Farbe senden und erkennen, ruft ab jetzt nur noch euer
eigener Code auf. Genau das ist eine Abstraktionsschicht: Von oben seht ihr
Text, von innen Farben.

**Drei Aufgaben:** Zuerst legt ihr das Codebuch fest, dann bringt ihr die
Übertragung langsam zum Laufen, und zuletzt erhöht ihr das Tempo, bis sie
bricht. Zu jeder Aufgabe gibt es Tipps zum Aufklappen; eine Musterlösung gibt
es frühestens nach dem Wettbewerb.

## Eine Datei für alles

Ihr arbeitet wieder in genau einer Datei, `word.py`, ob mit einem Laptop oder
mit zwei. Sie hat dieselbe Form wie `alphabet.py` aus Challenge 1, und was ihr
dort gebaut habt, übernehmt ihr.

| Teil | Was hineinkommt |
|---|---|
| `COLORS` | euer Alphabet aus Challenge 1 |
| `GAIN`, `INTEGRATION_TIME` | die beiden Einstellungen des Sensors, wie in Challenge 1 |
| `calibrate(readings)` | eure Kalibrierung aus Challenge 1 |
| `send_symbol(name)`, `receive_symbol()` | aus Challenge 1; ab jetzt ruft nur euer eigener Code sie auf |
| `CODEBOOK` | neu: welche Folge von Farben für welches Zeichen steht |
| `SYMBOL_RATE` | neu: wie viele Farben ihr je Sekunde sendet |
| `send_text(text)` | neu: zerlegt den Text mit dem Codebuch in Farben und sendet sie im Takt; schon fertig |
| `receive_text(n_chars)` | neu: empfängt so viele Zeichen und gibt sie als Text zurück; das schreibt ihr |
| `run_test(...)` | die letzte Zeile; sie startet beide Seiten gemeinsam, und ihr ändert sie nicht |

Erst das Argument `codebook=` in der letzten Zeile macht aus `run_test` den
Test für Challenge 2. Das kann das Kursmodul ab Version 0.9.0
([[lifi-hardware]]), und ältere Fassungen holt ihr mit demselben `pip install`
wie bei der Installation neu. So sieht die Vorlage aus; `COLORS`, die
Einstellungen, `calibrate` und `receive_symbol` ersetzt ihr durch eure
Fassung aus `alphabet.py`, und wo sonst `TODO` steht, fehlt euer Code:

```python static file=word.py
"""
Challenge 2: The Word
=====================

How fast can you get three sentences across without a single mistake?

This is your file from Challenge 1, one level up. COLORS, the sensor
settings, calibrate, send_symbol and receive_symbol stay as they were (copy
yours over from alphabet.py). New are the CODEBOOK, which says which colours
stand for which character, SYMBOL_RATE, and the two functions send_text and
receive_text. run_test at the bottom hands a sentence to send_text and only
the number of characters to receive_text, and compares what arrives.

From the start on, the timing is yours: run_test starts both functions at
the same moment and then does not help any more.

Run it with:  python word.py   (on a Mac: python3)
"""

import time

from lifi_hardware import receiver, run_test, sender

# Your alphabet from Challenge 1, one colour per line, each with a name
COLORS = {
    "off":     (0, 0, 0),
    "white":   (255, 255, 255),
    # "red":     (255, 0, 0),
    # "blue":    (0, 0, 255),
}

# The two settings of the receiving sensor, as in Challenge 1
GAIN = 16
INTEGRATION_TIME = 154

# How many colours you send per second. Start slowly and go up step by step.
SYMBOL_RATE = 2

# Which colours stand for which character. Every letter from A to Z and the
# space need an entry. With two colours, five of them make 32 combinations,
# enough for 27 characters. With more colours, fewer per character will do;
# that is the point of Challenge 2.
CODEBOOK = {
    " ": ["off",   "off",   "off",   "off",   "off"],
    "A": ["off",   "off",   "off",   "off",   "white"],
    "B": ["off",   "off",   "off",   "white", "off"],
    "C": ["off",   "off",   "off",   "white", "white"],
    "D": ["off",   "off",   "white", "off",   "off"],
    "E": ["off",   "off",   "white", "off",   "white"],
    "F": ["off",   "off",   "white", "white", "off"],
    "G": ["off",   "off",   "white", "white", "white"],
    "H": ["off",   "white", "off",   "off",   "off"],
    "I": ["off",   "white", "off",   "off",   "white"],
    "J": ["off",   "white", "off",   "white", "off"],
    "K": ["off",   "white", "off",   "white", "white"],
    "L": ["off",   "white", "white", "off",   "off"],
    "M": ["off",   "white", "white", "off",   "white"],
    "N": ["off",   "white", "white", "white", "off"],
    "O": ["off",   "white", "white", "white", "white"],
    "P": ["white", "off",   "off",   "off",   "off"],
    "Q": ["white", "off",   "off",   "off",   "white"],
    "R": ["white", "off",   "off",   "white", "off"],
    "S": ["white", "off",   "off",   "white", "white"],
    "T": ["white", "off",   "white", "off",   "off"],
    "U": ["white", "off",   "white", "off",   "white"],
    "V": ["white", "off",   "white", "white", "off"],
    "W": ["white", "off",   "white", "white", "white"],
    "X": ["white", "white", "off",   "off",   "off"],
    "Y": ["white", "white", "off",   "off",   "white"],
    "Z": ["white", "white", "off",   "white", "off"],
}

# What the receiver learns during calibration, one entry per colour name
REFERENCES = {}


def calibrate(readings):
    """Your calibrate from Challenge 1: readings[name] is a list of a few
    readings, each one Reading(r, g, b, c), taken while that colour showed."""
    for name in readings:
        # TODO: copy your own version over from alphabet.py
        REFERENCES[name] = readings[name][0]


def send_symbol(name):
    """Shows the colour with this name on the LED of the sending device."""
    r, g, b = COLORS[name]
    sender.led.set_color(r, g, b)


def receive_symbol():
    """Your receive_symbol from Challenge 1: measures and returns the name of
    the colour it recognised."""
    r, g, b, c = receiver.sensor.read()
    # TODO: copy your own version over from alphabet.py
    return "off"


def send_text(text):
    """Sends the text, character by character, in the rhythm of SYMBOL_RATE."""
    for char in text:
        for name in CODEBOOK[char]:
            send_symbol(name)
            time.sleep(1 / SYMBOL_RATE)


def receive_text(n_chars):
    """Receives n_chars characters and returns them as one text.

    It starts at the same moment as send_text. The sender shows a new colour
    every 1 / SYMBOL_RATE seconds, so the receiver has to read each colour
    in the same rhythm, collect as many colours as one character has, and
    look up which character they stand for in CODEBOOK.
    """
    text = ""
    # TODO: receive n_chars characters and add each one to text
    return text


run_test(send_text, receive_text, calibrate, symbols=COLORS, codebook=CODEBOOK,
         gain=GAIN, integration_time=INTEGRATION_TIME)
```

## Den Test starten

```text
python word.py
```

Auf dem Mac heißt der Befehl `python3`. Arbeitet ihr mit zwei Laptops,
startet ihr die Datei auf beiden, und der Kursserver gibt beiden eine
gemeinsame Startzeit; an einem Laptop läuft der Empfänger neben dem Sender
mit. Ein Lauf beginnt wie in Challenge 1 mit der Kalibrierung, bei der
`run_test` jede Farbe aus `COLORS` einmal zeigt und euer `calibrate` aufruft.
Danach kommen drei Sätze aus je drei Wörtern, etwa `BUSY FROGS DANCE`, bei
jedem Lauf neu vom Kursserver. Für jeden Satz starten `send_text(text)` und
`receive_text(n_chars)` im selben Moment, und euer Empfänger erfährt dabei nur,
wie viele Zeichen kommen, nie den Satz selbst. Sobald `send_text` zurückkehrt,
geht die LED aus.

Ein gewerteter Lauf sind drei Sätze hintereinander ohne Fehler bei derselben
Symbolrate. Das Ergebnis erscheint mit jedem Fehler im Terminal und in eurem
[[lifi-cockpit|Team-Cockpit]]. Für schnelle Versuche zwischendurch genügt ein
Satz, wenn ihr im Aufruf von `run_test` am Ende der Datei `sentences=1`
dazusetzt; gewertet werden aber nur Läufe mit drei Sätzen. Ohne Server läuft
mit beiden Geräten an einem Laptop ein Übungslauf, der nicht zählt.

## Aufgabe 1: Das Codebuch

Legt fest, welche Folge eurer Farben für welches Zeichen steht. Sender und
Empfänger lesen dasselbe `CODEBOOK`, deshalb steht es nur einmal in der Datei.
Die Vorlage gibt jedem Zeichen fünf Farben aus Aus und Weiß; mit mehr Farben
reichen weniger Stellen, und genau darum geht es in dieser Challenge.

**Datei:** `word.py`, das Codebuch `CODEBOOK`; in der Vorlage beginnt es so:

```python static
CODEBOOK = {
    " ": ["off",   "off",   "off",   "off",   "off"],
    "A": ["off",   "off",   "off",   "off",   "white"],
    "B": ["off",   "off",   "off",   "white", "off"],
    "C": ["off",   "off",   "off",   "white", "white"],
    # ... and so on, up to "Z"
}
```

> [!HINT]
> Mit *k* Farben und *n* Stellen unterscheidet ihr *k*ⁿ Codewörter ([[place-value-systems]]). Für 26 Buchstaben und das Leerzeichen reichen bei vier Farben drei Stellen, denn 4³ = 64; mit zwei Farben braucht ihr fünf, denn 2⁵ = 32.

> [!HINT]
> Sind alle Codewörter gleich lang, weiß der Empfänger ohne Trennzeichen, wo ein Zeichen endet.

## Aufgabe 2: Langsam zum Laufen bringen

`send_text(text)` steht in der Vorlage schon fertig: Es zerlegt den Text mit
eurem Codebuch in Farben und zeigt sie nacheinander, jede für
`1 / SYMBOL_RATE` Sekunden. Eure Aufgabe ist `receive_text(n_chars)`, das im
selben Takt misst, aus jeder Folge von Farben wieder ein Zeichen macht und den
Text zurückgibt, sobald alle Zeichen da sind. Fangt langsam an, mit den zwei
Farben pro Sekunde der Vorlage, und hört erst auf, wenn drei Sätze
hintereinander ohne Fehler ankommen.

**Datei:** `word.py`, die Funktion `receive_text(n_chars)`; in der Vorlage:

```python static
def receive_text(n_chars):
    """Receives n_chars characters and returns them as one text.

    It starts at the same moment as send_text. The sender shows a new colour
    every 1 / SYMBOL_RATE seconds, so the receiver has to read each colour
    in the same rhythm, collect as many colours as one character has, and
    look up which character they stand for in CODEBOOK.
    """
    text = ""
    # TODO: receive n_chars characters and add each one to text
    return text
```

> [!HINT]
> Eure Funktionen aus Challenge 1, die eine Farbe senden und eine erkennen, nehmt ihr mit. Neu ist nur, was darüber liegt: Text in Farben zerlegen und aus Farben wieder Text machen.

> [!HINT]
> Rechnet aus, wie lange eine Farbe bei eurer Rate leuchtet, und überlegt, zu welchem Zeitpunkt innerhalb dieser Zeit der Empfänger am besten misst.

> [!HINT]
> Beide Seiten fangen gemeinsam an, aber jede hat ihre eigene Uhr, und `time.sleep()` wartet nie ganz genau so lange wie verlangt. Die Vorlage reiht in `send_text` kurze Pausen aneinander, deren kleine Fehler sich aufaddieren. Spätestens wenn es schneller werden soll, rechnet ihr deshalb auf beiden Seiten für jede Farbe aus, wann sie beginnt, gemessen vom Start an.

## Aufgabe 3: Das Tempo erhöhen

Erhöht `SYMBOL_RATE` Schritt für Schritt und notiert bei jeder Stufe, ob drei
Sätze noch fehlerfrei ankommen. Diese Messreihe hebt ihr auf, denn in
Challenge 3 braucht ihr sie wieder.

**Datei:** `word.py`, der Wert `SYMBOL_RATE`; in der Vorlage:

```python static
# How many colours you send per second. Start slowly and go up step by step.
SYMBOL_RATE = 2
```

> [!HINT]
> Ändert immer nur eine Sache, also entweder die Rate oder die Größe des Alphabets. Wer beides zugleich verstellt, weiß danach nicht, was den Fehler verursacht hat.

> [!HINT]
> Das Fehlerbild verrät die Ursache: Verrutscht ab einer Stelle alles, liegt es am Takt, sind einzelne Zeichen falsch, ist das Alphabet für diese Rate zu groß.

## Abnahme und Wertung

Ihr lasst gewertete Läufe am eigenen Platz laufen, die Gehäuse von Sender und
Empfänger Wand an Wand. Nicolas geht durch die Reihen, sieht sich euren Aufbau
an und hakt bestandene Läufe ab. Bestanden habt ihr mit einem gewerteten Lauf,
also drei Sätzen hintereinander ohne Fehler, bei beliebiger Symbolrate.

Auf der [Challenge-Tafel](https://lifi.hsos.uber.space/challenges) steht zu
jedem Team, wie viele Zeichen und wie viele Bit pro Sekunde es überträgt. Die
Uhr läuft bei jedem Satz vom gemeinsamen Start, bis `send_text` zurückkehrt.
Zeichen pro Sekunde sind die Zeichen der drei Sätze geteilt durch diese Zeit,
und Bit pro Sekunde sind alle gesendeten Farben geteilt durch dieselbe Zeit,
mal log2 der Zahl eurer Farben in `COLORS`. Die Rangfolge richtet sich nach
den Zeichen pro Sekunde, und bei Gleichstand liegt
das Team vorn, das den Wert früher erreicht hat. Im Wettbewerb zeigen die
besten Teams ihren Lauf live; eine Live-Änderung gibt es in Challenge 2 nicht.

## Stolpersteine und mehr

**Typische Stolpersteine:** Was bei einer Farbe pro Sekunde klappt, zerfällt
bei fünf, weil die beiden Seiten keine gemeinsame Uhr haben und sich jede
kleine Verspätung von Farbe zu Farbe aufaddiert. Der Empfänger misst genau
während eines Farbwechsels, oder die Codewörter werden länger als nötig.

**Für Schnelle:** Gebt häufigen Buchstaben kürzere Codewörter und achtet
darauf, dass sie trotzdem eindeutig lesbar bleiben ([[prefix-trap]]).
