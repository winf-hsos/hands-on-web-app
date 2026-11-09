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
    - "prüfen, ob sich die beiden Gruppen eines Experiments außer in der Marke auch in der Ernährungsweise unterscheiden, und begründen, warum der Zufall sie erst bei vielen Antworten vergleichbar macht"
level: 1
duration: 25
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-arrange, dplyr-mutate, dplyr-summarize]
status: published
updated: 2026-11-09
---

## Aufgabe

In der Umfrage steckt ein Experiment. Einem Teil der Befragten wurde
eine Milchmarke gezeigt, und der Zufall entschied, ob es Weihenstephan oder
alpro war; welche Marke jemand sah, steht in `milk_brand`. Danach sollten sie
sagen, ab welchem Preis ihnen ein Liter dieser Milch zu teuer wäre, und diese
Antwort steht in `price_too_expensive`. Weil die Marke zufällig zugeteilt
wurde, sollten sich die beiden Gruppen nur in der Marke unterscheiden, die
sie gesehen haben. Darf alpro also mehr kosten als Weihenstephan?

Gehe der Frage in fünf Schritten nach, jeder mit einer eigenen Pipe in
einer eigenen Box.

## Dein Code

1. Zähle, wie viele Personen die Preisfrage für jede der beiden Marken
   beantwortet haben.

```r
survey |>
  filter() |>
  count()
```

2. Berechne je Marke die Zahl der Antworten, den mittleren Preis und den
   Median, ohne die Angaben, die als Literpreis nicht ernst gemeint sein
   können.

```r
survey |>
  filter() |>
  group_by() |>
  summarize()
```

3. Lege für die plausiblen Antworten mit `mutate()` eine Spalte
   `price_class` an, die jeden Preis einer von drei Klassen zuordnet:
   `"under 2"` für weniger als 2 Euro, `"2 to 2.49"` und `"2.50 or more"`.
   Zeige `id`, `milk_brand`, `price_too_expensive` und `price_class`, vom
   höchsten Preis zum niedrigsten sortiert.

```r
survey |>
  filter() |>
  mutate() |>
  select() |>
  arrange()
```

4. Zähle, wie oft jede Preisklasse bei jeder Marke vorkommt.

```r
survey |>
  filter() |>
  mutate() |>
  count()
```

5. Berechne für jede Ernährungsweise die Zahl der plausiblen Antworten und
   den mittleren Preis, und sortiere die Gruppen so, dass der höchste
   Mittelwert oben steht.

```r
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
> Zur Kontrolle: Es sind 611 Antworten, 293 für alpro und 318 für
> Weihenstephan.

> [!HINT]
> Eine Grenze von 10 Euro trennt die ernst gemeinten Literpreise von den 20
> Ausreißern. Weil `filter()` mit diesem Vergleich auch alle Zeilen ohne
> Preis verwirft, brauchst du danach kein `na.rm = TRUE`. Zur Kontrolle:
> Es bleiben 284 Antworten für alpro und 307 für Weihenstephan.

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
> Ohne die Ausreißer liegt die Grenze bei alpro im Mittel bei 2,19 Euro und
> im Median bei 2 Euro, bei Weihenstephan bei 1,99 und 1,99 Euro. Wer alpro
> sah, würde also im Mittel rund 20 Cent mehr zahlen. Die Preisklassen
> zeigen, dass das nicht an wenigen Personen hängt: Bei Weihenstephan liegen
> 182 der 307 Antworten unter 2 Euro, bei alpro nur 129 von 284, und in der
> obersten Klasse ist alpro mit 86 Antworten gegen 57 vorn. Die ganze
> Verteilung ist also nach oben verschoben.
>
> Die fünfte Aufgabe zeigt, ob die Ernährungsweise dahinterstecken könnte.
> Vegan und vegetarisch lebende Personen nennen im Mittel höhere Preise, 2,60
> und 2,40 Euro, als die Omnivoren und Flexitarier mit je rund 2,05 Euro.
> Zählst du mit `count(milk_brand, diet)` nach, siehst du, dass der Zufall die
> großen Gruppen fast gleich verteilt hat, 177 zu 187 Omnivoren und 84 zu 83
> Flexitarier. Nur unter den Veganern hat Weihenstephan mit 14 zu 3 mehr
> abbekommen, was den Mittelwert von Weihenstephan eher hebt und den
> Unterschied zu alpro also nicht erklärt. Bei rund 300 Antworten je Marke
> gleicht der Zufall solche Unterschiede weitgehend aus; ob der Unterschied
> von 20 Cent mehr ist als Zufall, beantwortet erst ein Test. Mit den
> Ausreißern läge der Mittelwert bei alpro übrigens bei 9,07 Euro und bei
> Weihenstephan bei 7,25 Euro, und der Median bliebe bei 2 und 1,99 Euro.

## Für Schnelle

Welcher Anteil der plausiblen Antworten liegt bei jeder Marke unter 2 Euro?
Lege dafür mit `mutate()` eine Spalte an, die `TRUE` oder `FALSE` enthält,
und berechne ihren Mittelwert je Marke: Der Mittelwert von `TRUE` und
`FALSE` ist der Anteil der `TRUE`, wie du aus der Lektion [[r-vectors]]
weißt.

Hält das Ergebnis, wenn du die Grenze anders ziehst? Auch ein Liter für 0
Euro ist kaum ernst gemeint, und zwei Personen haben genau das angegeben.
Wiederhole die zweite Aufgabe nur mit Preisen über 50 Cent und höchstens 5
Euro und vergleiche Mittelwert und Median mit deinem ersten Ergebnis.
