---
type: quiz
code: 2189
title: "Quiz: Einstieg in R"
summary: Sieben Fragen zu Namen, Funktionen, Vektoren, Typen, Vergleichen, fehlenden Werten und der Pipe.
objectives:
  intro: "Mit diesem Quiz prüfst du, ob du Folgendes kannst:"
  goals:
    - "verfolgen, welchen Wert ein Name nach mehreren Zuweisungen mit `<-` trägt"
    - "verschachtelte Aufrufe wie `round(sqrt(10), digits = 1)` von innen nach außen auswerten"
    - "vorhersagen, wie R mit einem ganzen Vektor rechnet und welchen Typ ein Vektor mit gemischten Werten bekommt"
    - "mit `mean()` über einen Vergleich einen Anteil berechnen und mit `na.rm = TRUE` trotz fehlender Werte einen Mittelwert erhalten"
    - "erklären, was die Pipe `|>` an eine Funktion weiterreicht und dass sie dabei nichts speichert"
level: 1
duration: 8
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  checks: [r-names, r-functions, r-vectors, r-data-types, r-missing-values, r-pipe]
status: draft
updated: 2026-11-01
---

## Was steht nach diesen drei Zeilen in `litres`?

```r static
litres <- 2
litres <- litres * 3
litres <- litres + 1
```

- [ ] `2`
- [ ] `6`
- [x] `7`

> Jede Zeile überschreibt den Wert: erst 2, dann 2 mal 3, also 6, dann 6
> plus 1.

## Was ergibt `round(sqrt(10), digits = 1)`?

- [ ] `3`
- [x] `3.2`
- [ ] `3.16`

> R liest von innen nach außen: Die Wurzel aus 10 ist 3,162…, und `round()`
> rundet sie auf eine Nachkommastelle.

## Was ergibt `c(1, 2, 3) * 2`?

- [ ] `12`
- [x] `2 4 6`
- [ ] Eine Fehlermeldung, weil man einen Vektor nicht multiplizieren kann

> Rechnungen mit einem Vektor gelten für jeden einzelnen Wert.

## Welchen Typ hat der Vektor `c(5, 3, "keine Angabe")`?

- [ ] `numeric`
- [x] `character`
- [ ] Er hat zwei Typen, für jeden Wert den passenden.

> Ein Vektor hat nur einen Typ. Weil sich nicht jeder Text als Zahl lesen
> lässt, macht R aus allem Text.

## `ages` enthält fünf Alter. Was gibt `mean(ages > 50)` an?

- [ ] das Durchschnittsalter derer, die älter als 50 sind
- [x] den Anteil derer, die älter als 50 sind
- [ ] wie viele älter als 50 sind

> Der Vergleich liefert `TRUE` oder `FALSE` für jede Person. `TRUE` zählt als
> 1, `FALSE` als 0, und der Mittelwert davon ist der Anteil. Die Anzahl gäbe
> `sum()`.

## Was ergibt `mean(c(4, NA, 2))`?

- [ ] `3`
- [x] `NA`
- [ ] `2`

> Mit einem unbekannten Wert ist auch der Mittelwert unbekannt. Erst mit
> `na.rm = TRUE` rechnet `mean()` mit den beiden bekannten Werten und ergibt
> 3.

## Was bewirkt `survey |> nrow()`? (mehrere richtig)

- [x] dasselbe wie `nrow(survey)`
- [x] es zählt die Zeilen von `survey`
- [ ] es zählt die Zeilen und speichert die Zahl in `survey`

> Die Pipe reicht `survey` als erstes Argument an `nrow()` weiter. Gespeichert
> wird dabei nichts; dafür bräuchte es eine Zuweisung mit `<-`.
