---
type: demo
code: 6093
title: Foto-Digitalisierer
summary: >-
  Ein Foto wird zu Zahlen: Du wählst, wie viele Punkte und wie viele Farben es
  behält, siehst das Bild dabei gröber werden und zahlst jeden Punkt und jede
  Farbe in Bit.
objectives:
  intro: "An diesem Demonstrator digitalisierst du ein Foto selbst und kannst danach:"
  goals:
    - "an Klötzchen erkennen, dass das Abtasten zu grob war, und an harten Flecken, dass das Quantisieren zu grob war"
    - "die Größe eines Bildes als Punkte mal Bit je Punkt ausrechnen und in eine Übertragungszeit umrechnen"
    - "zu einem Bildpunkt angeben, mit welchen Bits ihn eine gewählte Farbtiefe speichert"
    - "abwägen, wie viel Auflösung und Farbtiefe ein Bild braucht, damit es noch zeigt, was es zeigen soll"
level: 1
duration: 10
topics: [representing-information, transferring-information]
modules: [dup]
relations:
  example_of: [analog-and-digital]
  see_also: [audio-digitiser]
status: draft
updated: 2026-11-03
---

**Ziel:** Du siehst, was die zwei Schnitte des Digitalisierens aus einem Foto
machen. Die Auflösung legt fest, an wie vielen Punkten das Bild gemessen wird,
die Farbtiefe, auf wie viele Farben jeder Punkt gerundet wird, und unter den
Bildern steht, was das Ergebnis in Byte und in Übertragungszeit kostet.

**Bedienung:** Wähl oben ein Bild, stell mit dem Regler die Auflösung ein, von
256 × 256 Punkten bis zu einem einzigen, und wähl darunter die Farbtiefe.
Zeigst du auf einen Punkt des digitalen Bildes, siehst du seine Bits und die
Stelle im Original, aus der er entstanden ist.

```photo-digitiser
```
