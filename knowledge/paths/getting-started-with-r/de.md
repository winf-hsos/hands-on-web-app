---
kind: path
code: 6184
areas: [ds]
title: Einstieg in R
summary: >-
  R von Grund auf, in kleinen Schritten und direkt im Browser: rechnen, Werte
  benennen, Vektoren, Typen, fehlende Werte, Tabellen und die Pipe.
goal: >-
  Du liest und schreibst einfachen R-Code, rechnest mit Vektoren und den
  Spalten einer Tabelle, gehst mit fehlenden Werten um und verkettest
  Schritte mit der Pipe.
audience: Alle, die mit R Daten auswerten wollen, ohne Programmiererfahrung
level: 1
sections:
  - title: { de: "Teil 1: Rechnen und Namen", en: "Part 1: Calculating and names" }
    steps:
      - r-as-calculator
      - r-names
      - r-functions
      - r-exercise-milk-budget
  - title: { de: "Teil 2: Vektoren und Datentypen", en: "Part 2: Vectors and data types" }
    steps:
      - data-representation-slides
      - r-vectors
      - r-data-types
      - r-missing-values
      - r-exercise-shopping
  - title: { de: "Teil 3: Tabellen und Pakete", en: "Part 3: Tables and packages" }
    steps:
      - r-data-frames
      - r-packages
      - r-pipe
      - r-basics-quiz
      - item: positron
        optional: true
status: published
updated: 2026-11-02
---

Dieser Pfad führt dich in kleinen Lektionen von der ersten Rechnung bis zu
einer Tabelle, die du mit der Pipe befragst. Jede Lektion behandelt eine
Sache und dauert etwa zehn Minuten. Jeder Codekasten ist ein kleiner
Editor, in dem R direkt in deinem Browser läuft; installieren musst du
nichts.

Der erste Teil zeigt R als Taschenrechner, mit Namen für Werte und mit
Funktionen. Der zweite führt Vektoren ein, die Grundform aller Daten in R,
mit ihren Typen, mit Vergleichen und mit fehlenden Werten; zu Beginn zeigen
[[data-representation-slides|die Folien]] am Drei-Türen-Spiel in einem
Durchgang den Weg vom Vektor bis zum Data Frame. Der dritte bringt
alles in einer Tabelle zusammen und endet mit der Pipe, auf der die
Datentransformation mit dplyr aufbaut. Auf die beiden ersten Teile folgt je
eine Übung, auf den dritten ein Quiz. Wer danach auf dem eigenen Rechner
weitermachen will, findet in Positron die passende Umgebung.
