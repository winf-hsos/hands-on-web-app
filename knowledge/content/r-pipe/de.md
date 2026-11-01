---
type: lesson
code: 1352
title: Die Pipe
summary: >-
  Das Zeichen |> reicht ein Ergebnis an die nächste Funktion weiter und macht
  aus geschachtelten Klammern eine Kette, die man von oben nach unten liest.
objectives:
  intro: "In dieser Lektion lernst du die Pipe `|>` kennen, die mehrere Schritte zu einer lesbaren Kette verbindet, und kannst danach:"
  goals:
    - "erklären, wie `|>` das Ergebnis links als erstes Argument an die Funktion rechts weiterreicht"
    - "einen Aufruf wie `nrow(survey)` als `survey |> nrow()` schreiben und als „und dann“ lesen"
    - "geschachtelte Aufrufe in eine Kette übersetzen, in der jeder Schritt eine eigene Zeile hat"
    - "`%>%` aus älteren Beispielen als Pipe aus dem Paket `magrittr` erkennen, die sich für den Anfang genauso verhält"
level: 1
duration: 8
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-data-frames, r-packages]
status: draft
updated: 2026-11-01
---

Eine Auswertung besteht aus mehreren Schritten: Zeilen auswählen, Spalten
auswählen, sortieren, zusammenfassen. Schachtelt man die Funktionen dafür
ineinander, muss man den Code von innen nach außen lesen, und die Argumente
stehen weit weg von ihrer Funktion. Die **Pipe** löst das.

## Und dann

Das Zeichen `|>` reicht das Ergebnis links als erstes Argument an die
Funktion rechts weiter. Am besten liest man es als „und dann“:

```r
survey |> nrow()
```

Das heißt dasselbe wie `nrow(survey)`: Nimm `survey` und dann zähle die
Zeilen. Ein Verb von dplyr hängst du genauso an:

```r
survey |> filter(diet == "vegan")
```

Das liest sich: Nimm `survey` und dann behalte die Zeilen, in denen `diet`
gleich `"vegan"` ist. Wie `filter()` genau arbeitet, zeigt die Lektion
[[dplyr-filter]].

## Ketten

Ihre Stärke zeigt die Pipe bei mehreren Schritten. Üblich ist, nach jedem
`|>` eine neue Zeile zu beginnen, so dass jeder Schritt eine Zeile hat:

```r
survey |>
  filter(diet == "vegan") |>
  nrow()
```

Ohne Pipe hieße das `nrow(filter(survey, diet == "vegan"))`. Bei zwei
Schritten geht das noch, bei fünf wird daraus ein Knäuel von Klammern, das
niemand mehr gern liest.

> [!TIP]
> Die Pipe tippst du schneller mit **Strg+Umschalt+M** (am Mac
> **Cmd+Umschalt+M**). Das Kürzel funktioniert in jedem R-Kasten dieser
> Plattform genauso wie in [[positron|Positron]].

> [!NOTE]
> In älteren Beispielen steht statt `|>` oft `%>%`. Das ist die Pipe aus dem
> Paket magrittr, die es gab, bevor R 2021 eine eigene bekam. Für alles, was
> du hier lernst, verhalten sich beide gleich.

## Zum Mitnehmen

- `|>` liest man „und dann“; es reicht das Ergebnis links an die Funktion
  rechts weiter.
- Nach jedem `|>` eine neue Zeile, so steht jeder Schritt für sich.
- `%>%` aus älteren Beispielen verhält sich für den Anfang genauso.
