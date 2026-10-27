---
type: demo
code: 5786
title: Die Verben von dplyr zum Ausprobieren
summary: >-
  Sechs Zeilen aus einer Umfrage und ein Knopf je Verb: Du siehst, wie
  select, filter, arrange, mutate und summarize eine Tabelle umformen.
level: 1
duration: 5
topics: [transforming-data]
modules: [ea]
areas: [ds]
relations:
  example_of: [data-transformation-basics]
status: draft
updated: 2026-10-27
---

Die Tabelle unten enthält sechs Personen aus der Umfrage zu Milch und
Milchalternativen mit vier ihrer Merkmale: Nummer, Alter, Ernährungsweise und
Bio-Anteil beim Einkauf. Klick auf ein Verb: Darüber erscheint die Zeile R,
die es ausführt, und die Tabelle formt sich in das Ergebnis um. Achte darauf,
was jeweils verschwindet, was sich bewegt und was neu dazukommt.

```verb-demo
```

## Was du sehen solltest

- `select()` behält alle Zeilen, aber nur die genannten **Spalten**.
- `filter()` behält alle Spalten, aber nur die **Zeilen**, für die die
  Bedingung zutrifft.
- `arrange()` ändert nichts außer der **Reihenfolge** der Zeilen.
- `mutate()` fügt eine **neue Spalte** hinzu, die aus vorhandenen berechnet
  wird; hier das Jahrzehnt des Alters.
- `summarize()` macht aus allen Zeilen **eine einzige**, die die Tabelle
  zusammenfasst.
- `group_by()` zusammen mit `summarize()` fasst **je Gruppe** zusammen und
  gibt eine Zeile je Ernährungsweise zurück.

Wie man diese Verben selbst schreibt, zeigen die Lektionen ab
[[r-in-ten-minutes]].
