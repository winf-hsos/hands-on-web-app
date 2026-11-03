---
type: challenge
code: 8649
title: "Challenge 0: Der Funke"
summary: >-
  Jedes Gerät läuft am eigenen Laptop: Die LED leuchtet in einer Farbe, die euer Programm festlegt, und der Sensor meldet fortlaufend, was er sieht.
objectives:
  intro: "Mit dieser Challenge bringst du dein Gerät zum Laufen und kannst danach:"
  goals:
    - "die LED aus einem eigenen Programm in einer gewählten Farbe leuchten lassen"
    - "die vier Messwerte des Sensors auslesen und deuten"
    - "einen Schwellenwert für die Helligkeit selbst messen statt raten"
    - "als menschlicher Empfänger benennen, woran eine Übertragung scheitert"
    - "dein Programm vor Zuschauern gezielt ändern"
level: 1
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
project: lifi
status: published
updated: 2026-11-03
---

Bevor ihr etwas übertragen könnt, muss jedes Gerät an eurem eigenen Rechner
laufen: Die LED leuchtet in einer Farbe, die ihr in eurem Programm wählt, und
der Sensor meldet, was er sieht.

**Ziel:** Auf jedem Gerät leuchtet die LED in einer Farbe, die euer Programm
festlegt, und der Sensor gibt fortlaufend seine vier Messwerte aus. Jede Person bringt dabei ihr
eigenes Gerät an ihrem eigenen Laptop zum Laufen, und am Ende schaltet ihr die
LED des einen Geräts um und seht, wie sich die Zahlen des Sensors gegenüber
ändern.

**Neu ist** hier alles: Für die meisten ist es das erste eigene Programm, und
zwei Werkzeuge kommen dazu, die euch durch das ganze Projekt begleiten, das
Terminal, in dem ihr Programme startet, und der KI-Assistent, mit dem ihr
arbeitet. Wer dafür länger braucht, ist nicht im Rückstand; die meisten vor
euch hatten auch noch nie ein Terminal gesehen.

**Sechs Aufgaben, je eine Datei:** Die Programme bauen aufeinander auf, und
die Dateien liegen fertig in eurer Vorlage; wo darin `TODO` steht, fehlt euer
Code.

| | Datei | Was ihr dabei lernt |
|---|---|---|
| 1 | `task_1_light_on.py` | eine Funktion aufrufen und ihr Werte übergeben |
| 2 | `task_2_blink.py` | eine Schleife, also etwas mehrmals ausführen |
| 3 | `task_3_color_cycle.py` | eine Liste und wie man sie durchläuft |
| 4 | `task_4_measure.py` | eine Funktion, die Werte zurückgibt, und Messen in einer Situation nach der anderen |
| 5 | `task_5_react.py` | eine Bedingung, also je nach Lage etwas anderes ausführen |
| 6 | `task_6_human_receiver.py` | was ein Empfänger eigentlich leisten muss |

Mehr Bausteine gibt es nicht: Alles, was ihr im Projekt programmiert, besteht
aus Anweisungen nacheinander, wiederholt und unter einer Bedingung. Jede
Aufgabe startet ihr einzeln, etwa mit `python task_3_color_cycle.py` (auf dem
Mac `python3`).

Unten hat jede Aufgabe ihren eigenen Abschnitt mit der Aufgabenstellung, der
Datei, wie sie in eurer Vorlage aussieht, ein paar Tipps zum Aufklappen und einer Musterlösung, die ihr kopieren
oder als Datei herunterladen könnt. Öffnet die Lösung erst, wenn eure eigene
Fassung läuft oder ihr festhängt: Eine fertige Lösung zu lesen fällt leichter,
als selbst eine zu schreiben, und geübt wird nur das Schreiben.

## Aufgabe 1: Licht an

Die LED soll zwei Sekunden lang rot leuchten und dann wieder ausgehen.

**Datei:** `task_1_light_on.py`; so sieht sie in eurer Vorlage aus:

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
> `led.set_color(rot, grün, blau)` setzt eine Farbe, und jeder der drei Werte liegt zwischen 0 und 255. Rot heißt also voller Rotanteil, kein Grün und kein Blau.

> [!HINT]
> Zum Ausschalten gibt es `led.off()`, das dasselbe bewirkt wie `led.set_color(0, 0, 0)`.

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

## Aufgabe 2: Blinken

Die LED soll fünfmal blinken, jeweils eine halbe Sekunde an und eine halbe
Sekunde aus, ohne dass ihr dieselben Zeilen fünfmal hinschreibt.

**Datei:** `task_2_blink.py`; so sieht sie in eurer Vorlage aus:

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
> In der Vorlage steht schon `for i in range(5):`. Alles, was darunter eingerückt steht, läuft fünfmal hintereinander, und `pass` ist nur ein Platzhalter, den ihr durch euren Code ersetzt.

> [!HINT]
> Ein Durchgang besteht aus vier Zeilen: LED an, warten, LED aus, warten. `time.sleep(0.5)` wartet eine halbe Sekunde.

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

## Aufgabe 3: Farbwechsel

Die LED soll alle Farben aus der Liste `colors` nacheinander zeigen, jede eine
Sekunde lang. Ergänzt die Liste vorher um mindestens zwei eigene Farben.

**Datei:** `task_3_color_cycle.py`; so sieht sie in eurer Vorlage aus:

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
> Eine Farbe sind drei Zahlen in runden Klammern, etwa `(255, 255, 0)` für Gelb, das aus Rot und Grün zusammen entsteht. Jede Farbe steht in einer eigenen Zeile und endet mit einem Komma.

> [!HINT]
> In der Schleife steht in `color` jeweils eine Farbe mit ihren drei Zahlen. `r, g, b = color` zerlegt sie in drei Variablen, die ihr an `led.set_color` übergebt.

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

## Aufgabe 4: Messen

Mit jedem Druck auf die Eingabetaste nimmt das Programm einen Messwert auf und
gibt seine vier Werte aus; `q` und die Eingabetaste beenden es. Messt in
mindestens vier Lagen und ändert zwischen zwei Messungen nur eine Sache: bei
Raumlicht, mit der Hand über dem Sensor, mit der Taschenlampe des Handys von
weit weg und von nah. Der Wert `c` ist die Helligkeit; schreibt ihn für jede
Lage auf, denn in Aufgabe 5 braucht ihr ihn.

**Datei:** `task_4_measure.py`; so sieht sie in eurer Vorlage aus:

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
> `sensor.read()` gibt vier Zahlen auf einmal zurück, und `r, g, b, c = sensor.read()` legt sie in vier Variablen ab, die ihr mit `print` ausgebt.

> [!HINT]
> Bleibt `c` bei 65535 stehen, ist der Sensor übersteuert, und ihr haltet die Lampe weiter weg.

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

## Aufgabe 5: Reagieren

Das Programm misst fortlaufend: Ist es hell, leuchtet die LED grün, ist es
dunkel, leuchtet sie rot. Es ist euer erstes Programm, das eine Entscheidung
trifft, und es läuft, bis ihr es mit Strg+C beendet.

**Datei:** `task_5_react.py`; so sieht sie in eurer Vorlage aus:

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
> Den Schwellenwert findet ihr selbst, und zwar in euren Notizen aus Aufgabe 4: Er liegt zwischen dem Wert `c` mit abgedecktem Sensor und dem mit der Taschenlampe. Eine Zahl aus dem Internet oder vom Assistenten passt nicht zu eurem Raum.

> [!HINT]
> Die Entscheidung ist ein `if` mit einem `else`: Ist `c` größer als `threshold`, wird die LED grün, sonst rot.

> [!SOLUTION]
> Der Schwellenwert 2000 ist nur ein Beispiel; euren nehmt ihr aus den eigenen Messungen von Aufgabe 4.
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

## Aufgabe 6: Der Mensch als Empfänger

Euer Programm sendet eine zufällige Folge von Farben, und eine Person schreibt
sie auf, ohne auf den Bildschirm zu schauen; danach vergleicht ihr. Beim
ersten Mal klappt das mühelos. Interessant wird es, wenn ihr jedes Mal genau
eine Sache ändert: schneller senden, mehr Farben verwenden, den Start nicht
ankündigen, dieselbe Farbe zweimal hintereinander senden. Schreibt auf, woran
es jedes Mal gescheitert ist. Diese Liste ist ziemlich genau die Liste der
Probleme, die euer Programm in den nächsten Challenges lösen muss, und ihr habt
sie selbst gefunden.

**Datei:** `task_6_human_receiver.py`; so sieht sie in eurer Vorlage aus:

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
> Die Leuchtdauer steht in der Vorlage in `time.sleep(1.5)`. Verkürzt sie schrittweise, etwa auf 0,5 und dann auf 0,2 Sekunden, und achtet darauf, ab wann die Person nicht mehr mitkommt.

> [!HINT]
> Zieht alles, was ihr ändern wollt, als Variablen an den Anfang der Datei, etwa `ON_TIME = 1.5`. Dann ist jeder Versuch genau eine geänderte Zahl, und ihr behaltet den Überblick, was ihr schon probiert habt.

> [!SOLUTION]
> Für diese Aufgabe gibt es keine einzig richtige Lösung. Diese Fassung zieht alles, was sich zu ändern lohnt, als Konstanten an den Anfang: Leuchtdauer, Pause, Länge, Ankündigung und weitere Farben.
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

## Abnahme

**Geschafft ist sie,** wenn die Programme auf beiden Geräten laufen und ihr vor
Zuschauern eine kleine Änderung daran vornehmt, etwa „lass die LED doppelt so
schnell blinken“ oder „dreh die Bedingung in Aufgabe 5 um“. Das ist keine
Falle, sondern der Anfang einer Gewohnheit, die bis zum Schluss bleibt: Euren
eigenen Code könnt ihr vor Ort ändern und wisst, was dann passiert, auch wenn
Teile davon mit dem Assistenten entstanden sind. Hier wird nichts gemessen,
keine Rangliste geführt und nichts abgegeben, aber ohne laufendes Gerät könnt
ihr Challenge 1 nicht einmal beginnen.

## Stolpersteine und mehr

**Typische Stolpersteine:** Der Brick Daemon läuft nicht; ohne ihn findet euer
Programm die Hardware nicht, so richtig der Code auch ist, also prüft ihn
jedes Mal zuerst. Unter Windows fehlt Python im Suchpfad, fast immer wegen des
fehlenden Häkchens bei „Add python.exe to PATH“ während der Installation, und
auf dem Mac heißen die Befehle `python3` und `pip3`. Zeigt der Brick Viewer das
Gerät nicht an, liegt das Problem vor eurem Code und nicht darin: Kabel,
Anschluss, Stromversorgung.

**Die Zahlen passen nicht:** Ihr schickt der LED `(255, 0, 60)`, und der Sensor
meldet ganz andere Werte. Das ist richtig und kein Fehler. Warum das so ist und
was daraus folgt, ist Thema der nächsten Phase; lasst die Frage bis dahin offen.

**Für Schnelle:** Probiert verschiedene Farben aus und notiert, was der Sensor
jeweils meldet, dann verändert den Abstand und beobachtet, was mit den Zahlen
passiert. Diese Notizen braucht ihr in Challenge 1 sofort.

## Die Demo aus Sitzung 4

In Sitzung 4 entstand im Saal ein Empfänger, der Rot, Grün und Blau erkennt. Hier steht er in einer aufgeräumten Fassung, zusammen mit dem passenden Sender. Es sind zwei Dateien, weil jedes Skript genau ein Gerät steuert; hängen beide Geräte an einem Laptop, nennt jede Datei ihr Gerät mit `use_device`, und die UID des Master Bricks zeigt euch der Brick Viewer. Startet zuerst den Empfänger, solange die LED des Senders noch aus ist, damit er das Raumlicht messen kann.

Der Sender zeigt nacheinander Rot, Grün und Blau, je eine Sekunde lang, und schaltet die LED nach Strg+C wieder aus.

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

Der Empfänger misst das Raumlicht einmal als Grundwert (Baseline), zieht es von jeder Messung ab, entscheidet mit `if` und `elif` nach dem größten Kanal und gibt nur dann etwas aus, wenn sich die Farbe ändert (`previous_color`).

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

Die Demo ist ein Anfang und keine Lösung für Challenge 1: Sie kennt nur drei Farben, kennt kein „unbekannt“, und ihr Grundwert gilt nur für das Licht beim Start.
