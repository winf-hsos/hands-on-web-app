---
type: lesson
code: 7565
title: Zeilen filtern mit filter()
summary: >-
  Mit filter() behältst du die Zeilen, für die eine Bedingung zutrifft:
  Vergleiche, mehrere Bedingungen, Mengen mit `%in%`, und warum fehlende Werte
  dabei eigene Regeln haben.
objectives:
  intro: "In dieser Lektion lernst du, mit `filter()` die Zeilen einer Tabelle auszuwählen, und kannst danach:"
  goals:
    - "mit `filter()` und einem Vergleich die Zeilen behalten, für die eine Bedingung zutrifft, bei Zahlen wie bei Texten in Anführungszeichen"
    - "mehrere Bedingungen mit Komma, `&` und `|` verknüpfen und mit `!` umkehren"
    - "mit `%in%` gegen eine Liste und mit `between()` gegen einen Zahlenbereich filtern"
    - "fehlende Werte mit `is.na()` finden und erklären, warum Zeilen mit `NA` in der Bedingung stillschweigend herausfallen"
    - "mit `filter()` unplausible Werte aufspüren, bevor sie eine Auswertung verzerren"
level: 1
duration: 25
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-vectors, r-pipe]
  see_also: [dplyr-select]
status: published
updated: 2026-11-09
---

`select()` wählt Spalten, `filter()` wählt Zeilen. Du gibst eine
**Bedingung** an, R prüft sie für jede Zeile, und im Ergebnis bleiben nur die
Zeilen, für die sie wahr ist. Die Spalten bleiben alle erhalten.

## Vergleiche

Eine Bedingung ist meist ein Vergleich. R kennt diese Vergleichszeichen:

| Zeichen | Bedeutung |
|---|---|
| `==` | gleich |
| `!=` | ungleich |
| `<`, `<=` | kleiner, kleiner oder gleich |
| `>`, `>=` | größer, größer oder gleich |

Mit `>=` behältst du zum Beispiel alle Befragten, die 70 Jahre oder älter
sind:

```r
survey |> filter(age >= 70)
```

Bei Text vergleichst du auf dieselbe Weise:

```r
survey |> filter(diet == "vegetarian")
```

Texte stehen in Anführungszeichen, Spaltennamen nicht. Ohne die
Anführungszeichen sucht R nach einer Spalte namens `vegetarian` und meldet,
dass es sie nicht gibt.

> [!WARNING]
> Gleichheit prüft man mit **zwei** Gleichheitszeichen. Ein einzelnes `=`
> bedeutet in R „bekommt den Wert“, und dplyr beschwert sich, wenn du
> `filter(diet = "vegan")` schreibst. Probier es aus und lies die Meldung:
> dplyr vermutet genau diesen Fehler und schlägt `==` vor.

## Mehrere Bedingungen

Trennst du Bedingungen mit Kommas, müssen alle zugleich zutreffen. Dasselbe
erreichst du mit `&` (und):

```r
survey |> filter(gender == "female", age < 40)
```

Soll mindestens eine zutreffen, verbindest du sie mit `|` (oder):

```r
survey |> filter(household_size >= 4 | town_size == "village")
```

Ein `!` kehrt eine Bedingung um: `!(diet == "omnivore")` ist dasselbe wie
`diet != "omnivore"`.

## Mengen mit `%in%`

Willst du alle Zeilen, deren Wert zu einer Liste gehört, wird eine Kette aus
`|` schnell lang. `%in%` prüft, ob ein Wert in einem Vektor vorkommt:

```r
survey |>
  filter(diet %in% c("vegan", "vegetarian", "pescetarian")) |>
  select(id, age, diet)
```

Für Zahlenbereiche gibt es `between()`, das beide Grenzen einschließt:
`filter(between(age, 30, 39))` findet alle zwischen 30 und 39.

## Fehlende Werte

Hier steckt die häufigste Falle beim Filtern: In `milk_freq` fehlen einige
Angaben, und der naheliegende Versuch, sie zu finden, liefert keine einzige
Zeile:

```r
survey |> filter(milk_freq == NA)
```

Der Grund: Ein Vergleich mit einem unbekannten Wert ist selbst unbekannt.
Ist ein Wert gleich einem Wert, den niemand kennt? Darauf kann R nur mit `NA`
antworten, und `filter()` behält ausschließlich Zeilen, für die die
Bedingung ausdrücklich `TRUE` ist. Nach fehlenden Werten fragt man deshalb
mit `is.na()`:

```r
survey |>
  filter(is.na(milk_freq)) |>
  select(id, age, milk_freq)
```

Mit `!` davor bekommst du umgekehrt alle Zeilen, in denen ein Wert steht:

```r
survey |>
  filter(!is.na(milk_freq)) |>
  nrow()
```

Dieselbe Regel wirkt auch dort, wo du gar nicht nach fehlenden Werten
fragst. Wer wissen will, wer einen Liter schon unter 2 Euro zu teuer findet,
bekommt nur Personen, die die Preisfrage überhaupt gesehen haben:

```r
survey |>
  filter(price_too_expensive < 2) |>
  select(id, milk_brand, price_too_expensive)
```

Alle anderen fallen still heraus. Meist ist das gewollt, aber du solltest es
wissen, wenn du anschließend Zeilen zählst und mit der Gesamtzahl vergleichst.

## Filtern, um Daten zu prüfen

`filter()` ist nicht nur für Auswertungen da, sondern auch zum Aufspüren von
Werten, die nicht stimmen können. Ein Liter Milch kostet ein, zwei, vielleicht
drei Euro. Was sagt dir diese Zeile?

```r
survey |>
  filter(price_too_expensive > 10) |>
  select(id, age, milk_brand, price_too_expensive)
```

Ob sich jemand vertippt hat, ob 160 Cent gemeint waren oder ob jemand die
Frage nicht ernst genommen hat, lässt sich aus den Daten allein nicht
entscheiden. Wichtig ist, dass du den Wert findest, bevor er einen Mittelwert
verzerrt, und dass du festhältst, wie du mit ihm umgehst.

## Zum Mitnehmen

- `filter()` behält die Zeilen, für die eine Bedingung `TRUE` ist; alle
  Spalten bleiben erhalten.
- Gleichheit prüft `==`, Texte stehen in Anführungszeichen.
- Kommas und `&` verlangen alle Bedingungen, `|` mindestens eine; `%in%`
  prüft gegen eine Liste.
- Nach fehlenden Werten fragt man mit `is.na()`, und Zeilen mit `NA` in der
  Bedingung fallen beim Filtern stillschweigend heraus.
