---
type: challenge
code: 8649
title: "Challenge 0: Der Funke"
summary: >-
  Jedes Gerät läuft am eigenen Laptop: Die LED zeigt eine Farbe aus eurem Code, und der Sensor meldet fortlaufend, was er sieht.
objectives:
  intro: "Mit dieser Challenge bringst du dein Gerät zum Laufen und kannst danach:"
  goals:
    - "die LED aus eigenem Code in einer gewählten Farbe leuchten lassen"
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

Bevor ihr irgendetwas überträgt, muss jedes Gerät auf eurem eigenen Rechner
laufen: die LED leuchtet in einer Farbe, die ihr im Code wählt, und der Sensor
meldet, was er sieht.

**Ziel:** Auf jedem Gerät zeigt die LED eine Farbe aus eurem Code, und der
Sensor gibt fortlaufend seine vier Messwerte aus. Jede Person bringt dabei ihr
eigenes Gerät an ihrem eigenen Laptop zum Laufen, und am Ende schaltet ihr die
LED des einen Geräts um und seht, wie sich die Zahlen des Sensors gegenüber
ändern.

**Neu ist** hier alles: Für die meisten ist es das erste eigene Programm, und
zwei Werkzeuge kommen dazu, die euch durch das ganze Projekt begleiten, das
Terminal, in dem ihr Programme startet, und der KI-Assistent, mit dem ihr
arbeitet. Wer dafür länger braucht, ist nicht im Rückstand; die meisten vor
euch hatten auch noch nie ein Terminal gesehen.

**Aufgabe:** Sechs kleine Programme, je eine Datei, die aufeinander aufbauen.
Wo in der Vorlage `TODO` steht, fehlt euer Code.

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
Aufgabe startet ihr einzeln, etwa mit `python task_3_color_cycle.py`; Aufgabe 5
läuft, bis ihr sie mit Strg+C beendet.

**Den Schwellenwert findet ihr selbst.** In Aufgabe 4 nehmt ihr mit jeder
Eingabetaste einen Messwert auf: bei Raumlicht, mit der Hand über dem Sensor,
mit der Taschenlampe des Handys von weit weg und von nah. Der Wert `c` ist die
Helligkeit, und euer Schwellenwert für Aufgabe 5 liegt zwischen „abgedeckt“
und „Taschenlampe“. Bleibt `c` bei 65535 stehen, ist der Sensor übersteuert,
und ihr haltet die Lampe weiter weg.

**Selbst einmal Empfänger sein:** In Aufgabe 6 sendet euer Programm eine Folge
von Farben, und eine Person schreibt sie auf, ohne auf den Bildschirm zu
schauen; danach vergleicht ihr. Beim ersten Mal klappt das mühelos.
Interessant wird es, wenn ihr jedes Mal genau eine Sache ändert: schneller
senden, mehr Farben verwenden, den Start nicht ankündigen, dieselbe Farbe
zweimal hintereinander senden. Schreibt auf, woran es jedes Mal gescheitert
ist. Diese Liste ist ziemlich genau die Liste der Probleme, die euer Programm
in den nächsten Challenges lösen muss, und ihr habt sie selbst gefunden.

**Geschafft ist sie,** wenn die Programme auf beiden Geräten laufen und ihr vor
Zuschauern eine kleine Änderung daran vornehmt, etwa „lass die LED doppelt so
schnell blinken“ oder „dreh die Bedingung in Aufgabe 5 um“. Das ist keine
Falle, sondern der Anfang einer Gewohnheit, die bis zum Schluss bleibt: Euren
eigenen Code könnt ihr vor Ort ändern und wisst, was dann passiert, auch wenn
Teile davon mit dem Assistenten entstanden sind. Hier wird nichts gemessen,
keine Rangliste geführt und nichts abgegeben, aber ohne laufendes Gerät könnt
ihr Challenge 1 nicht einmal beginnen.

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

## Musterlösungen

Zu jeder der sechs Aufgaben gibt es eine Lösung, die ihr kopieren oder als Datei herunterladen könnt. Öffnet sie erst, wenn eure eigene Fassung läuft oder ihr festhängt: Eine fertige Lösung zu lesen fällt leichter, als selbst eine zu schreiben, und geübt wird nur das Schreiben.

**Aufgabe 1:** Eine Funktion mit Werten aufrufen: Die LED wird rot, und nach zwei Sekunden schaltet `led.off()` sie aus.

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

**Aufgabe 2:** Eine Schleife: an, warten, aus, warten, fünfmal hintereinander, ohne es fünfmal hinzuschreiben.

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

**Aufgabe 3:** Eine Liste von Farben, die eine Schleife durchläuft und dabei jede Farbe in ihre drei Zahlen zerlegt.

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

**Aufgabe 4:** Eine Funktion, die vier Werte auf einmal zurückgibt; sie werden in `r, g, b, c` zerlegt und bei jeder Eingabetaste ausgegeben.

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

**Aufgabe 5:** Eine Bedingung: Hell ergibt Grün, dunkel ergibt Rot. Der Schwellenwert ist nur ein Beispiel, euren nehmt ihr aus den eigenen Messungen von Aufgabe 4.

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

**Aufgabe 6:** Für diese Aufgabe gibt es keine einzig richtige Lösung. Diese Fassung zieht alles, was sich zu ändern lohnt (Leuchtdauer, Pause, Länge, Ankündigung, weitere Farben), als Konstanten nach oben, sodass jeder Versuch genau eine geänderte Zahl ist.

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
