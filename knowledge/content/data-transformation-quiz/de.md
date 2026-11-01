---
type: quiz
code: 6400
title: "Quiz: Daten transformieren"
summary: Sechs Fragen zu den Grundoperationen, Tidy Data, select(), filter() und fehlenden Werten.
objectives:
  intro: "Mit diesem Quiz prüfst du, ob du Folgendes kannst:"
  goals:
    - "zu einer Frage die passende Grundoperation wählen, etwa Zeilen filtern statt Spalten auswählen"
    - "unterscheiden, wann `summarize()` eine einzige Zeile und wann es mit `group_by()` davor eine Zeile je Gruppe liefert"
    - "erkennen, dass eine Tabelle nicht tidy ist, wenn eine Variable wie das Jahr in den Spaltennamen steckt"
    - "vorhersagen, welche Zeilen und Spalten `select()` mit `starts_with()` und `filter()` mit `%in%` und mehreren Bedingungen liefern"
    - "erklären, warum `== NA` keine Zeile findet und man fehlende Werte mit `is.na()` sucht"
level: 1
duration: 8
topics: [transforming-data]
modules: [ea]
areas: [ds]
relations:
  checks: [data-transformation-basics, tidy-data, dplyr-select, dplyr-filter]
status: draft
updated: 2026-11-01
---

## Du willst nur die Befragten aus Bayern betrachten. Welche Operation brauchst du?

- [ ] Spalten auswählen
- [x] Zeilen filtern
- [ ] Zusammenfassen

> Es geht um eine Teilmenge der Personen, also der Zeilen. Welche Spalten du
> danach brauchst, ist eine zweite Frage.

## Welche Operation macht aus 30 Zeilen genau eine?

- [ ] `filter()`
- [ ] `arrange()`
- [x] `summarize()` ohne `group_by()`

> `summarize()` fasst alle Zeilen zu einer zusammen, etwa zu einem Mittelwert
> und einer Anzahl. Mit `group_by()` davor entsteht eine Zeile je Gruppe.

## Eine Tabelle hat die Spalten `id`, `price_2024` und `price_2025`. Was daran ist nicht tidy?

- [ ] In einer Zelle stehen mehrere Werte.
- [x] Das Jahr ist eine Variable, steckt aber in den Spaltennamen.
- [ ] Die Tabelle hat zu wenige Zeilen.

> Tidy wären die Spalten `id`, `year` und `price`, mit zwei Zeilen je
> `id`. Dann lässt sich nach dem Jahr filtern und gruppieren wie nach jeder
> anderen Variable.

## Was liefert `survey |> select(id, starts_with("milk"))`? (mehrere richtig)

- [x] alle 30 Zeilen
- [x] die Spalte `id`
- [x] die Spalten `milk_freq` und `milk_brand`
- [ ] nur Zeilen, in denen eine Milchsorte angegeben ist

> `select()` ändert nie die Zahl der Zeilen. `starts_with("milk")` wählt die
> Spalten, deren Name mit `milk` beginnt.

## Warum liefert `survey |> filter(milk_freq == NA)` keine einzige Zeile?

- [ ] Weil in `milk_freq` keine Werte fehlen
- [x] Weil ein Vergleich mit `NA` wieder `NA` ergibt, und `filter()` nur Zeilen mit `TRUE` behält
- [ ] Weil man `NA` in Anführungszeichen schreiben muss

> Nach fehlenden Werten fragt man mit `is.na(milk_freq)`. `"NA"` in
> Anführungszeichen wäre ein Text aus zwei Buchstaben und kein fehlender Wert.

## Welche Zeilen behält `filter(diet %in% c("vegan", "vegetarian"), age < 50)`?

- [ ] alle, die vegan oder vegetarisch sind, und zusätzlich alle unter 50
- [x] nur die, die vegan oder vegetarisch sind und zugleich jünger als 50
- [ ] nur die, die vegan und vegetarisch zugleich sind

> Das Komma verbindet Bedingungen mit „und“. `%in%` prüft, ob der Wert zu der
> Liste gehört, also eine der beiden Ernährungsweisen ist.
