---
type: challenge
code: 9618
title: "Challenge 1: Das Alphabet"
summary: >-
  Wie viele Farben unterscheidet eure Strecke in 20 Versuchen ohne einen Fehler? Die Antwort ist euer Alphabet für alles Weitere.
objectives:
  intro: "Mit dieser Challenge findest du mit deinem Team das Alphabet eurer Strecke und kannst danach:"
  goals:
    - "Sender und Empfänger vor jedem Durchgang kalibrieren"
    - "mit einer Kontrollmessung zeigen, ob ein Aufbau etwas bringt"
    - "aus der Zahl der Farben ausrechnen, wie viele Bit ein Symbol trägt"
    - "Verwechslungen im Ergebnis auf ihre Ursache zurückführen"
level: 1
topics: [transferring-information, representing-information]
modules: [dup]
project: lifi
status: published
updated: 2026-11-08
---

In dieser Challenge findet ihr heraus, wie viele Farben eure Strecke in 20
Versuchen ohne einen einzigen Fehler unterscheidet. Diese Farben sind euer
Alphabet für alles Weitere, und seine Größe bestimmt das Tempo: Mit vier Farben
sendet ihr später zwei Bit je Symbol, mit sechzehn vier.

Der Sender zeigt eine Farbe aus eurem Alphabet, der Empfänger sagt, welche es
war, und den Takt gibt das Testskript vor. Eine Musterlösung gibt es nicht; am
Ende der Seite steht ein Beispiel mit der Erklärung, warum es keine gute Lösung
ist.

## Eine Datei für alles

Ihr arbeitet in genau einer Datei, `alphabet.py`, ob mit einem Laptop oder mit
zwei. Das Testskript ruft drei eurer Funktionen auf; wie ihr sie baut, ist eure
Sache.

| Teil | Was hineinkommt |
|---|---|
| `COLORS` | euer Alphabet, eine Farbe je Zeile, jede mit einem Namen wie `"white"` |
| `calibrate(readings)` | lernt aus den Messwerten, die der Test übergibt, wie jede Farbe beim Empfänger aussieht |
| `send_symbol(name)` | zeigt die Farbe mit diesem Namen auf der LED des Senders; schon fertig |
| `receive_symbol()` | misst und gibt den Namen der erkannten Farbe zurück |
| `GAIN`, `INTEGRATION_TIME` | die beiden Einstellungen des Sensors am Empfänger, oben in der Datei |
| `run_test(...)` | die letzte Zeile; sie stellt den Sensor ein, führt den Test aus, und ihr ändert sie nicht |

`run_test`, `sender` und `receiver` kommen aus dem Kursmodul, die beiden Einstellungen an
`run_test` ab Version 0.7.0 ([[lifi-hardware]]); ältere Fassungen holt ihr mit
demselben `pip install` wie bei der Installation neu. So sieht die Vorlage aus; wo `TODO` steht, fehlt euer Code:

```python static file=alphabet.py
"""
Challenge 1: The Alphabet
=========================

How many different colours can you tell apart, without a single mistake?

Everything for this challenge is in this one file. You fill in the
functions below, and run_test at the bottom does the rest. The file works
the same with both devices on one laptop and with one device on each of
two laptops: at the start, the module asks which device sends.

Run it with:  python alphabet.py   (on a Mac: python3)
"""

from lifi_hardware import receiver, run_test, sender

# Your alphabet: one colour per line, each with a name. The names are what
# your functions work with and what the result shows. Start with two. When
# 20 runs get through without a mistake, remove the # in front of the next
# two colours.
COLORS = {
    "off":     (0, 0, 0),
    "white":   (255, 255, 255),
    # "red":     (255, 0, 0),
    # "blue":    (0, 0, 255),
    # "green":   (0, 255, 0),
    # "yellow":  (255, 255, 0),
    # "cyan":    (0, 255, 255),
    # "magenta": (255, 0, 255),
}

# The two settings of the receiving sensor. These are the values it starts
# with; run_test sets them before the calibration, so change them here and
# not inside your functions. Gain: 1, 4, 16 or 60. Integration time in
# milliseconds: 2.4, 24, 101, 154 or 700.
GAIN = 16
INTEGRATION_TIME = 154

# What the receiver learns during calibration, one entry per colour name
REFERENCES = {}


def calibrate(readings):
    """Called once before the test, after every colour has been shown.

    readings[name] is a list of a few readings, each one Reading(r, g, b, c),
    taken while the colour with that name was showing, so readings["white"].
    """
    for name in readings:
        # TODO: store something better than the first reading, for example
        #       the average of all readings of this colour
        REFERENCES[name] = readings[name][0]


def send_symbol(name):
    """Shows the colour with this name on the LED of the sending device."""
    r, g, b = COLORS[name]
    sender.led.set_color(r, g, b)


def receive_symbol():
    """Measures and returns the name of the colour it recognised."""
    r, g, b, c = receiver.sensor.read()
    # TODO: compare this reading with REFERENCES and return the name of
    #       the colour that is most similar
    return "off"


run_test(send_symbol, receive_symbol, calibrate, symbols=COLORS,
         gain=GAIN, integration_time=INTEGRATION_TIME)
```

## Den Test starten

Ein Durchgang hat zwei Teile, und `run_test` führt beide nacheinander aus:

![Zwei Reihen. Oben Kalibrieren, einmal vor jedem Durchgang: jede Farbe einmal der Reihe nach, über send_symbol(name) und Licht zu calibrate(readings). Ein Pfeil mit REFERENCES führt von calibrate hinunter zu receive_symbol(). Unten Testen mit 20 Versuchen: Der Kursserver liefert die Zufallsfolge an send_symbol(name), Licht geht zu receive_symbol(), und der erkannte Name geht zurück zum Kursserver, der vergleicht; das Ergebnis erscheint im Team-Cockpit. calibrate und receive_symbol sind hell umrandet, alles andere grau.](figure:run-test "Erst lernt calibrate eure Farben, dann erkennt receive_symbol jede Farbe der Zufallsfolge. Hell umrandet sind die beiden Funktionen, die ihr schreibt.")

```text
python alphabet.py
```

Auf dem Mac heißt der Befehl `python3`. Beim Start fragt das Modul, welches
Gerät sendet. Arbeitet ihr mit zwei Laptops, startet ihr die Datei auf beiden;
der Kursserver bringt sie über euer Team zusammen, und beide brauchen dafür
WLAN.

Jeder Durchgang bekommt eine neue Zufallsfolge vom Kursserver, und das Ergebnis
erscheint mit jedem Fehler, benannt nach euren Farben, im Terminal und in eurem
[[lifi-cockpit|Team-Cockpit]]. Gewertet werden nur Durchgänge mit 20 Versuchen;
für schnelle Versuche zwischendurch setzt ihr im Aufruf von `run_test` am Ende
der Datei `runs=5` dazu.

Ohne Server läuft mit beiden Geräten an einem Laptop ein Übungsdurchgang, der
nicht zählt. Wollt ihr so üben, obwohl der Server erreichbar ist, schaltet ihr
ihn für das Terminal ab; mit zwei Laptops geht das nicht. In der PowerShell
gilt das, bis ihr das Terminal schließt:

```powershell
$env:LIFI_SERVER="off"
python alphabet.py
```

Auf dem Mac gilt es nur für den einen Aufruf:

```bash
LIFI_SERVER=off python3 alphabet.py
```

## Die Einstellungen des Sensors

Der Sensor hat zwei Einstellungen, und beide verändern, wie eure Messwerte
aussehen. Die Verstärkung (`GAIN`: 1, 4, 16 oder 60) macht schwaches Licht
sichtbar, das Rauschen aber auch, und bei hoher Verstärkung stoßen helle Farben
an den oberen Rand der Skala, wo sie alle gleich aussehen. Die Integrationszeit
(`INTEGRATION_TIME`: 2.4, 24, 101, 154 oder 700 Millisekunden) legt fest, wie
lange der Sensor für eine Messung Licht sammelt; länger gibt ruhigere Werte,
aber weniger Messungen pro Sekunde.

Die Vorlage beginnt mit 16 und 154, den Werten, die der Sensor bei jedem
Programmstart bekommt. Welche Einstellungen zu eurer Strecke passen, zeigen nur
eure eigenen Durchgänge, also ändert ihr die beiden Zeilen oben in der Datei und
vergleicht die Ergebnisse. `run_test` stellt sie am empfangenden Gerät vor der
Kalibrierung ein, damit Kalibrierung und Test gleich messen. In `calibrate` oder
`receive_symbol` wäre es zu spät, weil die Messwerte für die Kalibrierung schon
genommen sind, bevor `calibrate` aufgerufen wird. Jeder Durchgang zeigt die
Einstellungen zu Beginn an, und das Team-Cockpit nennt sie neben dem Ergebnis.
Bei zwei Laptops zählen die Werte in der Datei des empfangenden Laptops, und was
ihr im Brick Viewer einstellt, geht beim nächsten Programmstart verloren.

## Aufgabe 1: Kalibrieren

Dieselbe Farbe ergibt nie zweimal genau dieselben Messwerte, und was der Sensor
sieht, hängt von Abstand, Raumlicht und Bauteil ab. Vor jedem Durchgang zeigt
`run_test` deshalb jede Farbe einmal und übergibt die Messwerte an
`calibrate(readings)`: `readings["white"]` ist die Liste der Messwerte, während Weiß
leuchtete, und so für jeden Namen; jeder Messwert hat die Kanäle `r`, `g`, `b`
und `c`. Was ihr davon in `REFERENCES` behaltet, entscheidet ihr.

**Datei:** `alphabet.py`, die Funktion `calibrate(readings)`; in der Vorlage:

```python static
# What the receiver learns during calibration, one entry per colour name
REFERENCES = {}


def calibrate(readings):
    """Called once before the test, after every colour has been shown.

    readings[name] is a list of a few readings, each one Reading(r, g, b, c),
    taken while the colour with that name was showing, so readings["white"].
    """
    for name in readings:
        # TODO: store something better than the first reading, for example
        #       the average of all readings of this colour
        REFERENCES[name] = readings[name][0]
```

> [!HINT]
> Die Vorlage behält von jeder Farbe nur den ersten Messwert. Ein Mittelwert über alle Messwerte einer Farbe ist ruhiger, weil sich die kleinen Schwankungen des Sensors dabei ausgleichen.

> [!HINT]
> `sum(reading.r for reading in readings[name]) / len(readings[name])` ist der Mittelwert des Rotkanals für diese Farbe. Dasselbe gilt für `g`, `b` und `c`, und alle vier zusammen legt ihr in `REFERENCES[name]` ab.

## Aufgabe 2: Erkennen

`receive_symbol()` misst einmal und gibt den Namen der Farbe zurück, deren
Referenz dem Messwert am ähnlichsten ist. Die Vorlage gibt bisher immer
`"off"` zurück.

**Datei:** `alphabet.py`, die Funktion `receive_symbol()`; in der Vorlage:

```python static
def receive_symbol():
    """Measures and returns the name of the colour it recognised."""
    r, g, b, c = receiver.sensor.read()
    # TODO: compare this reading with REFERENCES and return the name of
    #       the colour that is most similar
    return "off"
```

> [!HINT]
> Was „ähnlich“ heißt, legt ihr selbst fest. Naheliegend ist, wie weit der Messwert auf allen vier Kanälen zusammen von der Referenz einer Farbe entfernt liegt; die Farbe mit dem kleinsten Abstand gewinnt.

> [!HINT]
> Entscheidet nicht danach, welcher Kanal am größten ist. Das klappt für Rot, Grün und Blau in einem ruhigen Raum und versagt bei allem anderen; warum, steht unten beim Beispiel.

## Aufgabe 3: Das Alphabet vergrößern

Jetzt messt ihr, wie viele Farben in 20 Versuchen ohne Fehler durchgehen, und
zwar zweimal: erst ohne Hilfsmittel, mit den Gehäusen Wand an Wand, dann mit
eurem Aufbau, etwa einer Röhre oder Blende ([[lifi-device]]). Es zählt das
Ergebnis mit Aufbau; die Messung ohne zeigt, ob er etwas bringt.

**Datei:** `alphabet.py`, die Liste `COLORS`; in der Vorlage:

```python static
# Your alphabet: one colour per line, each with a name. The names are what
# your functions work with and what the result shows. Start with two. When
# 20 runs get through without a mistake, remove the # in front of the next
# two colours.
COLORS = {
    "off":     (0, 0, 0),
    "white":   (255, 255, 255),
    # "red":     (255, 0, 0),
    # "blue":    (0, 0, 255),
    # "green":   (0, 255, 0),
    # "yellow":  (255, 255, 0),
    # "cyan":    (0, 255, 255),
    # "magenta": (255, 0, 255),
}
```

> [!HINT]
> Fangt mit aus und weiß an. Klappen 20 Versuche ohne Fehler, entfernt ihr das `#` vor den nächsten beiden Farben, und so weiter. Die letzte Größe ohne Fehler ist euer Ergebnis; acht sicher erkannte Farben sind mehr wert als sechzehn mit gelegentlicher Verwechslung.

> [!HINT]
> Werden immer dieselben zwei Farben verwechselt, liegen sie zu dicht beieinander, und ihr ersetzt eine davon. Sehen die Fehler zufällig aus, ist eher die Kalibrierung schuld.

## Abnahme

Ihr lasst den Test am eigenen Platz laufen, die Gehäuse von Sender und
Empfänger Wand an Wand. Nicolas geht durch die Reihen, sieht sich euren Aufbau
an und prüft das Ergebnis. Es zählt das größte Alphabet, das 20 Versuche ohne
einen Fehler schafft; eine Live-Änderung gibt es in Challenge 1 nicht.

## Ein Beispiel, keine Lösung

Hier steht der Empfänger aus Sitzung 4 in der Form von `alphabet.py`: Er nimmt
das Raumlicht als Grundwert, zieht es von jedem Messwert ab und entscheidet
nach dem größten der drei Farbkanäle zwischen Rot, Grün und Blau.

```python static file=example.py
"""
Challenge 1: an example, not a solution
=======================================

This is the receiver written live in session 4, brought into the form of
alphabet.py. It works for red, green and blue in a quiet room, and it shows
nicely where a first idea breaks. Read the page "Why this is not a good
solution" before you build on it.

The idea in three steps:
  1. Baseline: what the sensor measures while the LED is off.
  2. Subtract the baseline from every new reading, so that what is left
     is the light of the sending LED.
  3. Whichever of r, g and b is largest after that decides the colour.

Run it with:  python example.py   (on a Mac: python3)
"""

from lifi_hardware import receiver, run_test, sender

COLORS = {
    "off":   (0, 0, 0),
    "red":   (255, 0, 0),
    "green": (0, 255, 0),
    "blue":  (0, 0, 255),
}

# The room light, measured during calibration while off showed
BASELINE = {"r": 0, "g": 0, "b": 0}


def calibrate(readings):
    """Keeps only the baseline: the average of the readings with the LED off."""
    off = readings["off"]
    BASELINE["r"] = sum(reading.r for reading in off) / len(off)
    BASELINE["g"] = sum(reading.g for reading in off) / len(off)
    BASELINE["b"] = sum(reading.b for reading in off) / len(off)


def send_symbol(name):
    r, g, b = COLORS[name]
    sender.led.set_color(r, g, b)


def receive_symbol():
    r, g, b, c = receiver.sensor.read()

    # Subtract the room light
    r = r - BASELINE["r"]
    g = g - BASELINE["g"]
    b = b - BASELINE["b"]

    # The largest channel decides
    if r > g and r > b:
        return "red"
    elif g > r and g > b:
        return "green"
    else:
        return "blue"
    # Note what is missing: there is no way to answer "off".


run_test(send_symbol, receive_symbol, calibrate, symbols=COLORS)
```

### Warum das keine gute Lösung ist

Für Rot, Grün und Blau in einem ruhigen Raum funktioniert das Beispiel, und
genau das macht es gefährlich:

- **Aus hat keine Antwort.** Einen größten Kanal gibt es immer, also wird auch
  das Rauschen bei ausgeschalteter LED zu einer Farbe; in Sitzung 4 war es
  Grün.
- **Es gibt kein „weiß ich nicht“.** Eine Hand im Lichtweg oder ein Blitz vom
  Nachbarteam kommt mit voller Überzeugung als Farbe heraus.
- **Mischfarben sehen aus wie ihr stärkster Teil.** Gelb kommt als Rot oder
  Grün heraus, Weiß als der Kanal, der gerade vorn liegt.
- **Der Grundwert ist ein Foto eines Augenblicks.** Geht das Deckenlicht an,
  liegt jeder folgende Messwert daneben.
- **Euer Gerät ist nicht das des Nachbarteams.** Ist der Grünkanal eines
  Sensors schwächer, macht grünes Licht dort vielleicht Blau zum größten Kanal.

Alle fünf haben dieselbe Ursache: Das Programm entscheidet nach einer
ausgedachten Regel statt nach den Messwerten der Kalibrierung. Ein besserer
Empfänger vergleicht jeden Messwert mit allen Referenzen und erkennt einen
Messwert, der zu keiner passt, als Fehler.

## Stolpersteine

- feste Schwellenwerte statt einer Kalibrierung vor jedem Durchgang: „über 500
  im Rotkanal heißt Rot“ klappt am Dienstag und versagt am Donnerstag
- den ungefilterten Kanal `c` übersehen, obwohl er der empfindlichste ist
- Farben wählen, die schön aussehen, statt solche, die der Sensor gut
  unterscheidet

**Für Schnelle:** Probiert über `INTEGRATION_TIME` verschiedene
Integrationszeiten des Sensors aus.
Längere Messungen sind ruhiger, erlauben aber weniger Messungen pro Sekunde,
und genau dieser Tausch entscheidet in Challenge 4 über euren Durchsatz.
