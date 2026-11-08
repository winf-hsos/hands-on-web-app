---
title: Der verrauschte Sensor
summary: >-
  Dieselben verrauschten Ablesungen entscheiden dreimal, ob die LED an oder
  aus war: aus einer einzelnen Ablesung, aus dem Mittel von fünf und aus dem
  Mittel von zehn. Je länger gemittelt wird, desto weniger falsche
  Entscheidungen, und desto weniger Zeichen je Sekunde.
translation_of: en
based_on: 2026-11-08
---

**Ziel:** Du siehst, warum eine einzelne Ablesung für eine verlässliche
Entscheidung nicht reicht, und was das Mitteln über mehrere Ablesungen bringt
und kostet.

**Bedienung:** Sende Zeichen einzeln oder 25 auf einmal. Die LED ist entweder
an oder aus, und der Empfänger entscheidet an der Schwelle in der Mitte. Alle
drei Spuren lesen denselben Sensor im selben Moment: Die oberste entscheidet
aus einer einzelnen Ablesung, die beiden darunter aus dem Mittel von fünf und
von zehn. Jeder Punkt ist eine Entscheidung, ein roter eine falsche. Vergleiche
die Zahlen rechts, dann stell das Rauschen stärker und schwächer und achte
darauf, welche Spur zuerst in Schwierigkeiten kommt. Die Zahl unter den
Fehlern ist der Preis: Zehn Ablesungen je Zeichen lassen nur zwei Zeichen je
Sekunde übrig.

```noisy-sensor
```
