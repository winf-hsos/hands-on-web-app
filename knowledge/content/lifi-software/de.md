---
type: lesson
code: 2165
title: "Software für das LiFi-Projekt"
summary: >-
  Python, Visual Studio Code, OpenCode und das Kursmodul lifi_hardware, und warum jede Challenge einen festen Vertrag hat.
objectives:
  intro: "Hier lernst du die Software des LiFi-Projekts kennen und kannst danach:"
  goals:
    - "sagen, welches Programm im Projekt wofür da ist"
    - "erklären, wozu Brick Daemon und Brick Viewer dienen"
    - "LED und Sensor über das Kursmodul lifi_hardware ansprechen"
    - "erklären, was der Vertrag einer Challenge festlegt und was er dir freilässt"
level: 1
duration: 8
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
project: lifi
status: draft
updated: 2026-11-02
---

Ihr programmiert in Python mit Visual Studio Code, und als KI-Assistent ist
OpenCode eingerichtet. Euer Programm läuft auf dem Laptop und steuert das Gerät
über USB, aufgespielt wird nichts. Damit der Laptop das Gerät findet, muss im
Hintergrund der Brick Daemon laufen; der Brick Viewer zeigt euch, ob alles
erkannt wird.

Für den Zugriff auf LED und Sensor gibt es das Kursmodul `lifi_hardware`. Damit
reichen Befehle wie `led.set_color(r, g, b)` und `sensor.read()`, ohne dass ihr
euch um die Details der Hardware kümmern müsst; was es kann und warum es das
gibt, steht in [[lifi-hardware]]. Wie ihr alles einrichtet, zeigen die Folien [[first-light]]; wie ihr das Kursmodul und die Vorlagen auf euren Rechner bekommt, steht in eurem Kurs.

Für jede Challenge gibt es eine Vorlage mit einem **Vertrag**: eine Handvoll
Funktionen mit festem Namen, festen Argumenten und festem Rückgabewert. Was ihr
innerhalb dieser Funktionen schreibt, ist eure Sache, und eigene Funktionen
dürft ihr beliebig ergänzen. Das Testskript ruft ausschließlich die
Vertragsfunktionen auf, deshalb läuft bei jedem Team derselbe Test, und die
Ergebnisse sind vergleichbar.

| Challenge | Was ihr umsetzt |
|---|---|
| 0 | sechs kleine Aufgaben, je ein Skript, von `task_1_light_on.py` bis `task_6_human_receiver.py` |
| 1 | `ALPHABET_SIZE`, `calibrate_sender()`, `calibrate_receiver()`, `send_symbol(index)`, `receive_symbol()` |
| 2 | `send_text(text)`, `receive_text(n_chars)` |
| 3 | `send_message(text)`, `receive_message()` |
| 4 | `send_bits(bits)`, `receive_bits()` |

Die Verträge wachsen mit: erst einzelne Symbole, dann Text bekannter Länge,
dann Text, dessen Länge der Empfänger nicht kennt, und zuletzt nur noch Bits.
Auf jeder Stufe sieht man genau die Abstraktion, um die es in der Challenge
geht. **Selbsttest und Abnahme sind dasselbe Skript:** Mit ihm testet ihr
selbst, so oft ihr wollt, und mit ihm wird auch abgenommen. Ändert es deshalb
nicht; bei der Abnahme läuft ohnehin die Originalfassung.
