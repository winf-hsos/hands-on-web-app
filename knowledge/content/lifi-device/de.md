---
type: lesson
code: 2724
title: "Das LiFi-Gerät"
summary: >-
  Woraus euer Gerät besteht, was ihr selbst dazubauen dürft und wie ihr im Team oder allein damit arbeitet.
objectives:
  intro: "Hier lernst du das Gerät des LiFi-Projekts kennen und kannst danach:"
  goals:
    - "die drei Bauteile des Geräts und ihre Aufgaben nennen"
    - "sagen, was ihr an Optik selbst bauen dürft und was nicht"
    - "die Arbeit im Team nach Sender und Empfänger aufteilen"
    - "zwei Geräte an einem Laptop getrennt ansprechen"
level: 1
duration: 8
topics: [transferring-information, working-with-the-computer]
modules: [dup]
project: lifi
status: draft
updated: 2026-11-02
---

Im Gehäuse aus dem 3D-Drucker stecken drei Bauteile von Tinkerforge:

| Bauteil | Aufgabe |
|---|---|
| Master Brick | steuert alles und hängt per USB-C am Laptop |
| RGB LED Bricklet 2.0 | der Sender, jede Farbe von 0 bis 255 |
| Color Bricklet 2.0 | der Empfänger, misst Rot, Grün, Blau und ungefiltertes Licht (C) jeweils von 0 bis 65535 |

LED und Sensor sitzen nebeneinander an der Vorderseite, getrennt durch eine
Wand, damit ein Gerät nicht sein eigenes Licht sieht. Die kleine weiße Lampe
auf dem Sensor bleibt aus, sie bringt nur Streulicht. Beim Sensor lassen sich
Integrationszeit und Verstärkung einstellen; beide verändern, wie empfindlich
und wie schnell er misst.

Selbst baut ihr nur eure Optik zwischen den Geräten. Erlaubt ist alles, was
selbst kein Licht erzeugt oder misst, also Röhren, Pappe, Farbe, Folie,
Spiegel, Linsen oder Teile aus dem 3D-Drucker. Zusätzliche Sensoren, weitere
Lichtquellen, Laser oder ein Austausch von LED und Sensor sind nicht erlaubt.

Jede Person bekommt ein fertig montiertes Gerät, ein Team hat also beide Enden
der Strecke. Das ist mehr wert, als es klingt: Wer nur den Sender baut, muss
raten, was der Empfänger sieht, und ihr könnt nachsehen. Jede Person arbeitet
an ihrem eigenen Laptop mit ihrem eigenen Gerät; teilt die Arbeit nach den
beiden Enden auf und tauscht ab und zu die Rollen, damit ihr beide beide
Seiten kennt. Wenn eine Seite nicht funktioniert, liegt die Antwort meist auf
der anderen.

**Allein geht es auch.** Wer das Projekt ohne Partner angeht, schließt beide
Geräte an einen Laptop an und startet Sender und Empfänger als zwei Programme.
Jedes Programm sagt dann, welches Gerät es meint, mit der Kennung des Master
Bricks, die der Brick Viewer anzeigt:

```python static
from lifi_hardware import led, sensor, use_device

use_device("abc123")  # replace with the UID of your master brick
led.set_color(255, 0, 0)
```

Ihr verliert dabei den Partner, nicht das Projekt. Nur der Interop-Test in
Challenge 3 braucht ein anderes Team; wer allein ist, gibt seine
Protokollbeschreibung jemandem, der den Code nicht kennt, oder einem
KI-Assistenten in einer neuen Sitzung, und lässt sich den Empfänger
beschreiben, den er danach bauen würde. Die Lücken zeigen sich genauso.
