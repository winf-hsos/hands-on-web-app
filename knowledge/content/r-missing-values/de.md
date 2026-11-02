---
type: lesson
code: 8127
title: Fehlende Werte
summary: >-
  NA steht für einen Wert, den niemand kennt. Warum jede Rechnung damit
  wieder NA ergibt, wie man fehlende Werte findet und wann man sie weglässt.
objectives:
  intro: "In dieser Lektion lernst du, wie R mit fehlenden Werten umgeht, und kannst danach:"
  goals:
    - "erklären, warum jede Rechnung und jeder Vergleich mit `NA` wieder `NA` ergibt"
    - "fehlende Werte mit `na.rm = TRUE` ausdrücklich aus einer Rechnung wie `mean()` herausnehmen"
    - "fehlende Werte mit `is.na()` finden und mit `sum(is.na(x))` zählen"
    - "vor dem Weglassen fragen, warum Werte fehlen, und abschätzen, wie sich dadurch die betrachtete Gruppe verändert"
level: 1
duration: 8
topics: [programming-with-r, data-pitfalls]
modules: [ea]
areas: [ds]
relations:
  requires: [r-vectors]
status: published
updated: 2026-11-01
---

In echten Daten fehlt immer etwas: Jemand hat eine Frage übersprungen, ein
Messgerät ist ausgefallen, eine Frage wurde gar nicht erst gestellt. R
schreibt dafür `NA`, für *not available*. Wie R damit umgeht, ist auf den
ersten Blick lästig und auf den zweiten sehr vernünftig.

## NA steckt an

Mit einem unbekannten Wert ist auch jedes Ergebnis unbekannt. Was ist 5 plus
eine Zahl, die niemand kennt? Darauf kann R nur mit `NA` antworten:

```r
organic_share <- c(5, NA, 2, 4)
mean(organic_share)
```

Das gilt auch für Vergleiche. Selbst `NA == NA` ergibt `NA`, denn ob zwei
unbekannte Werte gleich sind, weiß niemand.

## Fehlende Werte weglassen

Viele Funktionen haben das Argument `na.rm` (*remove NA*). Mit
`na.rm = TRUE` rechnen sie nur mit den Werten, die da sind:

```r
organic_share <- c(5, NA, 2, 4)
mean(organic_share, na.rm = TRUE)
```

Dass du das ausdrücklich sagen musst, ist Absicht: Fehlende Werte sollen
nicht unbemerkt verschwinden. Der Mittelwert oben gilt jetzt für drei
Personen, nicht für vier.

## Fehlende Werte finden

Weil ein Vergleich mit `NA` nicht funktioniert, gibt es dafür eine eigene
Funktion. `is.na()` liefert `TRUE`, wo ein Wert fehlt:

```r
organic_share <- c(5, NA, 2, 4)
is.na(organic_share)
```

Zusammen mit dem, was du über [[r-vectors|das Zählen]] weißt, ergibt
`sum(is.na(organic_share))` die Zahl der fehlenden Werte.

## Vorher fragen, warum etwas fehlt

Bevor du fehlende Werte weglässt, lohnt sich die Frage, warum sie fehlen. In
einer Umfrage bedeutet `NA` oft „nicht gefragt“, weil eine Frage nur einem
Teil gestellt wurde. Wer solche Werte einfach entfernt, spricht danach über
eine andere Gruppe von Menschen als vorher.

## Zum Mitnehmen

- `NA` ist ein unbekannter Wert; jede Rechnung damit ergibt wieder `NA`.
- `na.rm = TRUE` lässt fehlende Werte ausdrücklich weg.
- `is.na()` findet sie, `sum(is.na(x))` zählt sie.
