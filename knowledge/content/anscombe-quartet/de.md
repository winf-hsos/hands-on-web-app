---
type: dataset
code: 4517
title: Anscombes Quartett
summary: >-
  Vier kleine Datensätze mit je elf Punkten, die dieselben Mittelwerte,
  Standardabweichungen und dieselbe Korrelation haben und als Streudiagramm
  trotzdem völlig verschieden aussehen.
authors: [Francis J. Anscombe]
year: 1973
file: anscombe.csv
level: 1
duration: 5
topics: [visualising-data, exploring-data]
modules: [ea]
areas: [ds]
relations:
  see_also: [why-visualise, anscombe-graphs-in-statistical-analysis, same-stats-shapes]
status: published
updated: 2026-11-16
---

Der Statistiker Francis Anscombe hat diese vier Datensätze 1973 in seinem
Aufsatz [[anscombe-graphs-in-statistical-analysis]] veröffentlicht, um zu
zeigen, dass man Daten zeichnen muss, bevor man ihren Kennzahlen glaubt. Die
Lektion [[why-visualise]] rechnet die Kennzahlen nach und zeichnet die vier
Streudiagramme.

In R ist das Quartett schon eingebaut, als Tabelle `anscombe` im Paket
datasets, das immer geladen ist; in Positron brauchst du die Datei also
nicht. Die CSV-Datei enthält genau diese Tabelle für alle anderen
Werkzeuge, etwa Python oder eine Tabellenkalkulation, und wer sie in R
einliest, bekommt dieselben Spalten unter demselben Namen.

## Die Spalten

Jede Zeile enthält einen Punkt aus jedem der vier Datensätze, die Ziffer im
Spaltennamen sagt, zu welchem Datensatz ein Wert gehört.

| Spalte | Inhalt |
|---|---|
| `x1`, `y1` | Datensatz 1: eine Wolke, die schräg nach oben läuft |
| `x2`, `y2` | Datensatz 2: ein Bogen |
| `x3`, `y3` | Datensatz 3: eine Gerade mit einem Ausreißer |
| `x4`, `y4` | Datensatz 4: zehn Punkte mit demselben x-Wert und einer weit rechts |

Die Spalten `x1`, `x2` und `x3` sind gleich. In allen vier Datensätzen ist
der Mittelwert von x 9 und der von y 7,50, die Standardabweichungen sind
3,32 und 2,03, und die Korrelation ist 0,82.

Für ggplot2 braucht die Tabelle die lange Form mit einer Spalte für den
Datensatz; wie `pivot_longer()` sie herstellt, zeigt die Lektion
[[why-visualise]].
