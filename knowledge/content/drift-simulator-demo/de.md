---
type: demo
code: 7726
title: Der Drift-Simulator
summary: >-
  Zwei Uhren und eine Folge von Farben: Die Uhr des Empfängers geht ein wenig
  falsch, seine Abtastpunkte wandern Symbol für Symbol aus den Zeitschlitzen
  des Senders, und Marken setzen den Fehler wieder auf null, kosten aber
  Rate.
level: 1
duration: 10
topics: [transferring-information]
modules: [dup]
relations:
  example_of: [sampling-and-synchronization]
status: published
updated: 2026-11-23
---

**Ziel:** Du siehst, wie sich ein kleiner Fehler der Empfängeruhr von Symbol
zu Symbol aufsummiert, bis der Empfänger nach einem halben Schlitz Versatz
das Nachbarsymbol liest, und was eine Marke, an der er sich neu ausrichtet,
dagegen bringt und an Rate kostet.

**Bedienung:** Oben legt der Sender in jeden Zeitschlitz eine Farbe, darunter
stehen die Abtastpunkte des Empfängers, und ein roter Ring heißt, dass ein
Punkt im falschen Schlitz liegt. Unter dem Bild stehen die gesendete und die
empfangene Folge, die bei einer falsch gehenden Uhr gegeneinander verrutschen.
Stell mit dem ersten Regler ein, um wie viel die Uhr des Empfängers falsch
geht, und schalte dann mit dem zweiten eine Marke alle paar Symbole zu, bis
keine Fehler mehr auftauchen; „Anteil der Marken“ zeigt, wie viele Schlitze
das kostet. „Einmal abtasten“ geht eine einzelne Abtastung Schritt für
Schritt durch, und „Marke senden“ setzt eine Marke von Hand.

```drift-simulator
```
