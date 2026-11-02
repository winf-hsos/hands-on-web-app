---
type: demo
code: 5786
title: Die Verben von dplyr zum Ausprobieren
summary: >-
  Sechs Zeilen aus einer Umfrage und ein Knopf je Verb: Du siehst, wie
  select, filter, arrange, mutate und summarize eine Tabelle umformen.
objectives:
  intro: "Mit diesem Demonstrator siehst du an sechs Zeilen der Umfrage, wie die Verben von `dplyr` eine Tabelle umformen, und kannst danach:"
  goals:
    - "für `select()`, `filter()` und `arrange()` angeben, ob Spalten verschwinden, Zeilen wegfallen oder sich nur die Reihenfolge ändert"
    - "beschreiben, wie `mutate()` aus dem Alter eine neue Spalte berechnet und die Zahl der Zeilen dabei gleich bleibt"
    - "erklären, warum `summarize()` aus sechs Zeilen eine macht und `group_by()` davor eine Zeile je Ernährungsweise ergibt"
    - "jede Umformung der Zeile R mit der Pipe `|>` zuordnen, die sie ausführt"
level: 1
duration: 5
topics: [transforming-data]
modules: [ea]
areas: [ds]
relations:
  example_of: [data-transformation-basics]
status: published
updated: 2026-11-01
---

**Ziel:** Du siehst, wie die Verben von dplyr eine Tabelle umformen: was
verschwindet, was sich bewegt und was neu dazukommt.

**Bedienung:** Klick auf ein Verb. Über der Tabelle erscheint die Zeile R, die
es ausführt, und die Tabelle formt sich in das Ergebnis um; „Original“ zeigt
wieder die sechs Personen aus der Umfrage zu Milch und Milchalternativen.

```verb-demo
```
