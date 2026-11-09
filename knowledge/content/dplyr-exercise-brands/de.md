---
type: exercise
code: 2619
title: "Übung: Darf alpro mehr kosten?"
summary: >-
  Im Preisexperiment der Umfrage sah ein Teil der Befragten Weihenstephan, ein
  anderer alpro. Mit `count()`, `group_by()`, `summarize()`, `mutate()` und
  `arrange()` vergleichst du, ab welchem Preis den beiden Gruppen ein Liter zu
  teuer ist.
objectives:
  intro: "In dieser Übung vergleichst du die beiden Gruppen des Preisexperiments mit den Verben von dplyr und kannst danach:"
  goals:
    - "mit `count()` zählen, wie viele Antworten jede Gruppe eines Experiments hat"
    - "einen unplausiblen Wert mit `filter()` ausschließen und danach mit `group_by()` und `summarize()` Mittelwert und Median je Gruppe berechnen"
    - "mit `mutate()` und `case_when()` aus einem Preis eine Preisklasse machen und das Ergebnis mit `arrange()` sortieren"
    - "eine Auswertung nach einer zweiten Spalte wie der Ernährungsweise aufteilen"
    - "begründen, warum ein Unterschied zwischen zwei Gruppen mit je vier Antworten noch nichts über die Marken aussagt"
level: 1
duration: 25
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-arrange-mutate, dplyr-summarize-group-by]
status: draft
updated: 2026-11-09
---

## Aufgabe

In der Umfrage steckt ein kleines Experiment. Einem Teil der Befragten wurde
eine Milchmarke gezeigt, und der Zufall entschied, ob es Weihenstephan oder
alpro war; welche Marke jemand sah, steht in `milk_brand`. Danach sollten sie
sagen, ab welchem Preis ihnen ein Liter dieser Milch zu teuer wäre, und diese
Antwort steht in `price_too_expensive`. Weil die Marke zufällig zugeteilt
wurde, sollten sich die beiden Gruppen nur in der Marke unterscheiden, die
sie gesehen haben. Darf alpro also mehr kosten als Weihenstephan?

Gehe der Frage in fünf Schritten nach, jeder mit einer eigenen Pipe:

1. Zähle, wie viele Personen die Preisfrage für jede der beiden Marken
   beantwortet haben.
2. Berechne je Marke die Zahl der Antworten, den mittleren Preis und den
   Median, ohne die eine Angabe, die als Literpreis nicht ernst gemeint sein
   kann.
3. Lege für die plausiblen Antworten mit `mutate()` eine Spalte
   `price_class` an, die jeden Preis einer von drei Klassen zuordnet:
   `"under 2"` für weniger als 2 Euro, `"2 to 2.49"` und `"2.50 or more"`.
   Zeige `id`, `milk_brand`, `price_too_expensive` und `price_class`, vom
   höchsten Preis zum niedrigsten sortiert.
4. Zähle, wie oft jede Preisklasse bei jeder Marke vorkommt.
5. Berechne für jede Ernährungsweise die Zahl der plausiblen Antworten und
   den mittleren Preis, und sortiere die Gruppen so, dass der höchste
   Mittelwert oben steht.

## Dein Code

Für jede Aufgabe gibt es eine eigene Box. In der ersten zählst du die
Antworten je Marke:

```r
# 1. Antworten je Marke
survey |>
  filter() |>
  count()
```

In der zweiten berechnest du die drei Kennzahlen je Marke:

```r
# 2. Anzahl, Mittelwert und Median je Marke
survey |>
  filter() |>
  group_by() |>
  summarize()
```

In der dritten legst du die Preisklasse an und sortierst:

```r
# 3. Preisklasse je Antwort
survey |>
  filter() |>
  mutate() |>
  select() |>
  arrange()
```

In der vierten zählst du Marke und Preisklasse zusammen:

```r
# 4. Preisklassen je Marke
survey |>
  filter() |>
  mutate() |>
  count()
```

In der fünften teilst du nach der Ernährungsweise auf:

```r
# 5. Mittlerer Preis je Ernährungsweise
survey |>
  filter() |>
  group_by() |>
  summarize() |>
  arrange()
```

> [!HINT]
> Wer die Preisfrage beantwortet hat, erkennst du an einem Wert in
> `price_too_expensive`, wie in der Übung [[dplyr-exercise-price]].
> `count()` bekommt die Spalte, deren Werte es zählen soll.
> Zur Kontrolle: Es sind neun Antworten, fünf für alpro und vier für
> Weihenstephan.

> [!HINT]
> Eine Grenze von 10 Euro trennt die ernst gemeinten Literpreise von dem
> einen Ausreißer. Weil `filter()` mit diesem Vergleich auch alle Zeilen ohne
> Preis verwirft, brauchst du danach kein `na.rm = TRUE`. Zur Kontrolle:
> Jede Marke hat dann vier Antworten.

> [!HINT]
> `case_when()` prüft die Fälle von oben nach unten, deshalb genügt für die
> mittlere Klasse die Bedingung `price_too_expensive < 2.5`, und die oberste
> Klasse übernimmt `.default`. Für die vierte Aufgabe kopierst du `filter()`
> und `mutate()` aus der dritten und zählst mit `count()` zwei Spalten.

> [!SOLUTION]
> Aufgabe 1:
>
> ```r
> survey |>
>   filter(!is.na(price_too_expensive)) |>
>   count(milk_brand)
> ```
>
> Aufgabe 2:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   group_by(milk_brand) |>
>   summarize(
>     n = n(),
>     mean_price = mean(price_too_expensive),
>     median_price = median(price_too_expensive)
>   )
> ```
>
> Aufgabe 3:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   mutate(
>     price_class = case_when(
>       price_too_expensive < 2 ~ "under 2",
>       price_too_expensive < 2.5 ~ "2 to 2.49",
>       .default = "2.50 or more"
>     )
>   ) |>
>   select(id, milk_brand, price_too_expensive, price_class) |>
>   arrange(desc(price_too_expensive))
> ```
>
> Aufgabe 4:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   mutate(
>     price_class = case_when(
>       price_too_expensive < 2 ~ "under 2",
>       price_too_expensive < 2.5 ~ "2 to 2.49",
>       .default = "2.50 or more"
>     )
>   ) |>
>   count(milk_brand, price_class)
> ```
>
> Aufgabe 5:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   group_by(diet) |>
>   summarize(
>     n = n(),
>     mean_price = mean(price_too_expensive)
>   ) |>
>   arrange(desc(mean_price))
> ```
>
> Ohne den Ausreißer liegt die Grenze bei alpro im Mittel bei 2,12 Euro und
> im Median bei 2,09 Euro, bei Weihenstephan bei 1,90 und 2 Euro. Wer alpro
> sah, würde also im Mittel gut 20 Cent mehr zahlen. Bei den Preisklassen
> fällt alpro dagegen zweimal unter 2 Euro und Weihenstephan nur einmal; der
> höhere Mittelwert geht vor allem auf die 2,79 Euro einer einzigen Person
> zurück.
>
> Die fünfte Aufgabe zeigt, warum das wenig heißt. Unter den plausiblen
> Antworten sind nur flexitarisch und omnivor lebende Personen, und die
> Flexitarier nennen im Mittel 2,29 Euro, die Omnivoren nur 1,53 Euro. Von
> den vier Antworten zu alpro stammen drei von Flexitariern, von denen zu
> Weihenstephan nur zwei, sodass ein Teil des Unterschieds auf die
> Ernährungsweise zurückgehen kann statt auf die Marke. Der Zufall gleicht
> solche Unterschiede zwischen den Gruppen erst bei vielen Befragten aus, und
> mit vier Antworten je Marke könnte schon eine Person mehr das Ergebnis
> umdrehen; mit dem Ausreißer läge alpro im Mittel sogar bei 33,70 Euro.

## Für Schnelle

Welcher Anteil der plausiblen Antworten liegt bei jeder Marke unter 2 Euro?
Lege dafür mit `mutate()` eine Spalte an, die `TRUE` oder `FALSE` enthält,
und berechne ihren Mittelwert je Marke: Der Mittelwert von `TRUE` und
`FALSE` ist der Anteil der `TRUE`, wie du aus der Lektion [[r-vectors]]
weißt.

Ob alpro wirklich mehr kosten darf, lässt sich erst mit mehr Antworten
sagen. Der vollständige Datensatz [[milk-survey-compact]] enthält dasselbe
Experiment mit über 600 Antworten. Lade ihn von seiner Seite herunter, lies
ihn in Positron ein und wiederhole die zweite Aufgabe. Schau dir
vorher die Ausreißer an, denn dort sind es zwanzig Preise über 10 Euro, und
auch ein Liter für 0 Euro ist kaum ernst gemeint.
