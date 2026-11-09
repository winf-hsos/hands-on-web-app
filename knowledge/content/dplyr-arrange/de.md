---
type: lesson
code: 6844
title: Zeilen sortieren mit arrange()
summary: >-
  Mit `arrange()` bringst du die Zeilen einer Tabelle in eine Reihenfolge,
  aufsteigend, absteigend oder nach mehreren Spalten, und behältst mit
  `slice_head()` und `slice_max()` nur die ersten oder größten Zeilen.
objectives:
  intro: "In dieser Lektion lernst du, Zeilen mit `arrange()` zu sortieren, und kannst danach:"
  goals:
    - "Zeilen mit `arrange()` aufsteigend, mit `desc()` absteigend und nach mehreren Spalten sortieren und sagen, wo fehlende Werte dabei landen"
    - "durch absteigendes Sortieren die Ausreißer einer Spalte finden"
    - "mit `slice_head()` und `slice_max()` nur die ersten oder die größten Zeilen einer Tabelle behalten"
level: 1
duration: 10
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-filter]
status: published
updated: 2026-11-09
---

`select()` und `filter()` machen eine Tabelle kleiner, weil sie nur einen Teil
der Spalten oder der Zeilen behalten. `arrange()` lässt dagegen alle Zeilen
und Spalten stehen und ändert nur die Reihenfolge der Zeilen.

## Zeilen sortieren

`arrange()` sortiert die Zeilen nach den Werten einer Spalte, und zwar
aufsteigend, also die kleinste Zahl zuerst. Damit die Ausgabe übersichtlich
bleibt, behält ein `select()` danach nur vier Spalten:

```r
survey |>
  arrange(age) |>
  select(id, age, gender, diet)
```

Oben stehen jetzt die jüngsten Befragten. Texte sortiert `arrange()`
alphabetisch, sodass `arrange(diet)` die Zeilen mit `flexitarian` vor die mit
`omnivore` stellt.

## Absteigend mit `desc()`

Für die umgekehrte Reihenfolge legst du `desc()` um den Spaltennamen, kurz
für *descending*, absteigend. Dann stehen die ältesten Befragten oben:

```r
survey |>
  arrange(desc(age)) |>
  select(id, age, gender, diet)
```

## Nach mehreren Spalten

Nennst du mehrere Spalten, sortiert `arrange()` zuerst nach der ersten und
zieht die nächste nur heran, wo die erste gleich ist. Hier stehen die
Ernährungsweisen alphabetisch und innerhalb jeder Ernährungsweise die
Ältesten vorn:

```r
survey |>
  arrange(diet, desc(age)) |>
  select(id, diet, age, gender)
```

## Wohin die fehlenden Werte kommen

Bei der Preisfrage fehlt für die meisten Befragten ein Wert, weil sie die
Frage nie gesehen haben. `arrange()` stellt Zeilen mit `NA` immer ans Ende,
ob du aufsteigend oder absteigend sortierst:

```r
survey |>
  arrange(desc(price_too_expensive)) |>
  select(id, milk_brand, price_too_expensive)
```

Absteigend sortiert ist das zugleich ein schneller Weg zu Ausreißern: Die
Preise von mehreren hundert Euro für einen Liter Milch, die du aus der
Lektion [[dplyr-filter]] kennst, stehen ganz oben, angeführt von 999 Euro.

## Die ersten oder größten Zeilen

Oft interessieren nach dem Sortieren nur die ersten Zeilen. `slice_head()`
behält so viele, wie du mit `n` angibst, in der Reihenfolge, in der die
Tabelle gerade steht:

```r
survey |>
  arrange(desc(age)) |>
  slice_head(n = 3) |>
  select(id, age, gender, diet)
```

`slice_max()` erledigt Sortieren und Abschneiden in einem Schritt und
behält die Zeilen mit den größten Werten einer Spalte; `slice_min()` behält
die mit den kleinsten. Teilen sich mehrere Zeilen den letzten Platz, liefert
es alle davon, auch wenn es dann mehr als `n` werden:

```r
survey |>
  slice_max(price_too_expensive, n = 3) |>
  select(id, milk_brand, price_too_expensive)
```

## Zum Mitnehmen

- `arrange()` sortiert Zeilen aufsteigend, `desc()` dreht die Reihenfolge
  um, und weitere Spalten entscheiden bei Gleichstand; fehlende Werte landen
  immer am Ende.
- Absteigend sortiert zeigt `arrange()` die größten Werte einer Spalte und
  damit oft die Ausreißer zuerst.
- `slice_head()` behält die ersten Zeilen, `slice_max()` und `slice_min()`
  die mit den größten oder kleinsten Werten einer Spalte.
