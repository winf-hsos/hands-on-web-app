---
type: exercise
code: 2300
title: "Übung: Ein neuer Datensatz"
summary: >-
  Vierzehn Fragen an gut 9.400 Produkte aus dem REWE-Onlineshop: den Datensatz
  laden, kennenlernen und mit einem, zwei, drei oder mehr Verben von dplyr
  Antworten finden, so wie es auch in einer Prüfung verlangt wird.
objectives:
  intro: "In dieser Übung wendest du alle Verben von dplyr auf einen Datensatz an, den du noch nicht kennst, und kannst danach:"
  goals:
    - "einen Datensatz mit `read_csv()` laden und dir mit `glimpse()` einen Überblick über Spalten, Typen und Werte verschaffen"
    - "eine Frage mit einem einzigen Verb wie `count()` oder `summarize()` beantworten"
    - "eine Frage in zwei, drei oder mehr Schritte zerlegen und sie mit `filter()`, `select()`, `arrange()`, `mutate()`, `group_by()` und `summarize()` zu einer Pipe verbinden"
    - "mit `distinct()` und `n_distinct()` Dubletten erkennen und dafür sorgen, dass jedes Produkt nur einmal zählt"
    - "ein Ergebnis auf Plausibilität prüfen und erklären, woher auffällige Werte kommen"
level: 2
duration: 60
topics: [transforming-data, exploring-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-summarize]
  see_also: [rewe-products, eda-self-assessment]
status: published
updated: 2026-11-09
---

Bisher kanntest du die Umfrage, bevor du sie transformiert hast. In dieser
Übung bekommst du einen Datensatz, den du noch nie gesehen hast, und musst
ihn zuerst laden und kennenlernen, bevor du Fragen an ihn stellen kannst.
Genau das wird auch in einer Prüfung verlangt: ein neuer Datensatz, ein paar
Fragen, und du entscheidest selbst, welche Verben du brauchst.

Der Datensatz enthält gut 9.400 Produkte aus dem
[[rewe-products|REWE-Onlineshop]] mit Name, Marke, Kategorie, Herkunft,
Preis, Bio-Kennzeichnung und Nährwerten je 100 g. Die Fragen sind danach
geordnet, wie viele Verben ihre Lösung braucht, von einem bis zu vier und
mehr. Versuch jede zuerst allein; die Lösung kannst du aufklappen, wenn du
nicht weiterkommst oder vergleichen willst.

## Teil 1: Laden und kennenlernen

1. Lade den Datensatz auf deinem Rechner in Positron in eine Tabelle namens
   `rewe`. Die Datei liegt unter
   `https://hands-on-computer-science.de/media/datasets/rewe_products.csv`.

> [!SOLUTION]
> ```r static
> library(tidyverse)
> rewe <- read_csv("https://hands-on-computer-science.de/media/datasets/rewe_products.csv")
> ```
>
> `read_csv()` liest eine CSV-Datei auch direkt aus dem Netz. Leere Felder
> werden dabei zu `NA`, und die Spalten `bio`, `vegan` und `vegetarian`
> erkennt es als Wahrheitswerte. In den Kästen auf dieser Seite liegt die
> Tabelle `rewe` schon bereit, und dplyr ist geladen.

2. Wie viele Zeilen und Spalten hat `rewe`? Welche Spalten enthalten Text,
   welche Zahlen und welche Wahrheitswerte?

```r
rewe
```

> [!SOLUTION]
> ```r
> glimpse(rewe)
> ```
>
> Die Tabelle hat 9.438 Zeilen und 22 Spalten. Name, Marke, Kategorien und
> Herkunft sind Text (`<chr>`), Preis und Nährwerte Kommazahlen (`<dbl>`),
> und `bio`, `vegan` und `vegetarian` Wahrheitswerte (`<lgl>`). Schon in den
> ersten Zeilen fällt auf, dass bei manchen Produkten Nährwerte fehlen.

## Teil 2: Ein Verb

3. Welche Produktkategorien gibt es, und wie viele Zeilen gehören zu jeder?
   Die größte Kategorie soll oben stehen.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   count(product_category, sort = TRUE)
> ```
>
> Es gibt zwölf Kategorien, dazu 8 Zeilen ohne Kategorie. Am größten sind
> `Nahrungsmittel` mit 2.480 und `Frische und Kühlung` mit 2.096 Zeilen, am
> kleinsten `Tier` mit 231.

4. Wie viele Zeilen sind als Bio-Produkt gekennzeichnet?

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   count(bio)
> ```
>
> 770 der 9.438 Zeilen tragen die Bio-Kennzeichnung, also gut 8 Prozent.

5. Wie viele verschiedene Produkte und wie viele verschiedene Marken stecken
   in der Tabelle? Jedes Produkt hat eine eigene `product_id`.

```r
rewe
```

> [!HINT]
> Beides beantwortet ein einziges `summarize()` mit zwei Aufrufen von
> `n_distinct()`. Denk daran, dass `n_distinct()` ein `NA` als eigenen Wert
> mitzählt.

> [!SOLUTION]
> ```r
> rewe |>
>   summarize(
>     n = n(),
>     n_products = n_distinct(product_id),
>     n_brands = n_distinct(brand, na.rm = TRUE)
>   )
> ```
>
> Die 9.438 Zeilen sind nur 7.959 verschiedene Produkte; knapp 1.500 Zeilen
> sind Dubletten, die genau so schon einmal in der Tabelle stehen. Dazu
> kommen 1.208 Marken, ohne `na.rm = TRUE` wären es 1.209, weil das `NA` der
> Produkte ohne Marke mitzählt. Die Dubletten spielen in den Teilen 4 und 5
> noch eine Rolle.

## Teil 3: Zwei Verben

6. Welche Produkte der Marke `ja!` gehören zur Kategorie `Obst und Gemüse`?
   Zeige nur Name und Preis.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(brand == "ja!", product_category == "Obst und Gemüse") |>
>   select(product_name, price)
> ```
>
> Es sind sieben Zeilen, und alle sind Trockenobst und Nüsse wie
> Pinienkerne, Sultaninen und Soft-Datteln, aber kein frisches Obst. Die
> Cranberries stehen zweimal da, eine der
> Dubletten aus Aufgabe 5.

7. Welche Marken gibt es in der Unterkategorie `Milch und Milchersatz`, und
   welche hat dort die meisten Zeilen?

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(product_sub_category == "Milch und Milchersatz") |>
>   count(brand, sort = TRUE)
> ```
>
> Es sind 21 Marken. Vorn liegt Alpro mit 22 Zeilen vor Weihenstephan mit 9,
> also genau die beiden Marken aus dem Preisexperiment der Umfrage. Willst
> du nur wissen, welche Marken es gibt, genügt statt `count()` auch
> `distinct(brand)`.

8. Welche Produkte enthalten am meisten Eiweiß je 100 g? Zeige Name,
   Kategorie und Eiweißgehalt, den höchsten Wert oben.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   arrange(desc(protein_in_gram)) |>
>   select(product_name, product_category, protein_in_gram)
> ```
>
> Vorn liegen Lowcarb-Nudeln mit 65,1 g, zweimal, weil sie doppelt in der
> Tabelle stehen, danach Soja-Granulat mit 52 g und Soja-Fettuccine mit
> 44,9 g. Die Reihenfolge von `arrange()` und `select()` ist hier egal; nur
> darf `select()` die Spalte nicht entfernen, nach der `arrange()` danach
> noch sortieren soll.

## Teil 4: Drei Verben

9. Wie teuer ist ein Produkt in jeder Kategorie im Mittel? Berechne je
   Kategorie die Zahl der Zeilen, den Mittelwert und den Median des Preises,
   und sortiere die teuerste Kategorie nach oben.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   group_by(product_category) |>
>   summarize(
>     n = n(),
>     mean_price = mean(price),
>     median_price = median(price)
>   ) |>
>   arrange(desc(median_price))
> ```
>
> Am teuersten ist `Wein, Spirituosen und Tabak` mit einem Median von
> 4,85 Euro, am günstigsten `Tier` mit 0,89 Euro. Auffällig ist `Baby und
> Kind`: Der Mittelwert liegt bei 3,18 Euro, der Median nur bei 1,29 Euro.
> Viele günstige Gläschen und wenige teure Großpackungen Windeln und
> Säuglingsmilch für bis zu 20 Euro ziehen den Mittelwert nach oben, während
> der Median davon unberührt bleibt.

10. Welche Marken haben die meisten verschiedenen Produkte? Sortiere die
    Marke mit den meisten nach oben.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   group_by(brand) |>
>   summarize(n_products = n_distinct(product_id)) |>
>   arrange(desc(n_products))
> ```
>
> Die Eigenmarken von REWE führen deutlich: REWE Beste Wahl mit 697
> Produkten, ja! mit 468 und REWE Bio mit 285. Danach kommt keine Marke,
> sondern `NA` mit 189 Produkten ohne Markenangabe, die du mit
> `filter(!is.na(brand))` vor dem Gruppieren ausschließen kannst. Mit `n()`
> statt `n_distinct(product_id)` würden die Dubletten doppelt zählen.

## Teil 5: Vier Verben und mehr

11. Wie viel Zucker steckt in den Unterkategorien von `Süßes und Salziges`?
    Berechne je Unterkategorie die Zahl der Produkte mit Zuckerangabe und den
    Median des Zuckergehalts, die süßeste Unterkategorie oben.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(product_category == "Süßes und Salziges", !is.na(sugar_in_gram)) |>
>   group_by(product_sub_category) |>
>   summarize(
>     n = n(),
>     median_sugar = median(sugar_in_gram)
>   ) |>
>   arrange(desc(median_sugar))
> ```
>
> Süßwaren und Schokolade bestehen im Median zu rund der Hälfte aus Zucker,
> mit 52 und 49 g je 100 g, Süßgebäck zu gut einem Drittel. Nüsse kommen auf
> 6 g und Chips auf 2,6 g. Statt die Zeilen ohne Angabe mit `filter()`
> auszuschließen, könntest du `median(sugar_in_gram, na.rm = TRUE)`
> schreiben; dann zählt `n` aber auch die Produkte ohne Angabe mit.

12. Welcher Anteil der Produkte ist in jeder Kategorie Bio? Zähle jedes
    Produkt nur einmal und sortiere die Kategorie mit dem höchsten Anteil
    nach oben.

```r
rewe
```

> [!HINT]
> `distinct()` ohne Spalten entfernt Zeilen, die vollständig gleich sind.
> Und der Mittelwert einer Spalte mit `TRUE` und `FALSE` ist der Anteil der
> `TRUE`, denn R rechnet `TRUE` als 1 und `FALSE` als 0.

> [!SOLUTION]
> ```r
> rewe |>
>   distinct() |>
>   group_by(product_category) |>
>   summarize(
>     n = n(),
>     share_bio = mean(bio)
>   ) |>
>   arrange(desc(share_bio))
> ```
>
> In `Baby und Kind` ist gut die Hälfte der 225 Produkte Bio, 53 Prozent,
> mit weitem Abstand vor `Obst und Gemüse` mit 17,5 Prozent. In `Küche und
> Haushalt` und `Tier` gibt es kein einziges Bio-Produkt. Ohne `distinct()`
> verschieben sich die Anteile leicht, weil manche Produkte doppelt zählen.

13. In welcher Kategorie gibt es anteilig die meisten Dubletten? Berechne je
    Kategorie die Zahl der Zeilen, die Zahl der verschiedenen Produkte, die
    Zahl der Dubletten als Differenz und ihren Anteil an den Zeilen.

```r
rewe
```

> [!HINT]
> Nach `summarize()` hast du eine Zeile je Kategorie mit den beiden
> Zählungen; die Differenz und den Anteil berechnest du danach mit
> `mutate()`.

> [!SOLUTION]
> ```r
> rewe |>
>   group_by(product_category) |>
>   summarize(
>     n = n(),
>     n_products = n_distinct(product_id)
>   ) |>
>   mutate(
>     duplicates = n - n_products,
>     share_duplicates = duplicates / n
>   ) |>
>   arrange(desc(share_duplicates))
> ```
>
> Bei `Tier` ist fast jede vierte Zeile eine Dublette, 54 von 231, bei `Obst
> und Gemüse` nur 21 von 312. Die meisten Dubletten in absoluten Zahlen hat
> mit 401 die größte Kategorie `Nahrungsmittel`. Die Dubletten sind also über
> alle Kategorien verteilt, und jede Auswertung, die Produkte zählt, sollte
> sie vorher entfernen.

14. Ein Gramm Fett liefert rund 9 kcal, ein Gramm Eiweiß und ein Gramm
    Kohlenhydrate je rund 4 kcal. Berechne daraus für jedes Produkt den
    Energiegehalt und die Abweichung von `energy_in_kcal`. Zeige die
    Produkte, bei denen beide Werte um mehr als 100 kcal auseinanderliegen,
    mit Name, beiden Werten und der Abweichung, die größte oben.

```r
rewe
```

> [!HINT]
> `abs()` macht aus einer negativen Zahl eine positive, sodass ein einziger
> Vergleich in `filter()` beide Richtungen erfasst.

> [!SOLUTION]
> ```r
> rewe |>
>   mutate(
>     kcal_calc = 9 * fat_in_gram + 4 * protein_in_gram + 4 * carbs_in_gram,
>     gap = energy_in_kcal - kcal_calc
>   ) |>
>   filter(abs(gap) > 100) |>
>   select(product_name, energy_in_kcal, kcal_calc, gap) |>
>   arrange(desc(gap))
> ```
>
> Es bleiben 42 Zeilen, und hinter den Abweichungen stecken drei
> verschiedene Ursachen. Ganz oben stehen Pistazien mit 2.546 kcal und
> Nudeln mit 1.521 kcal, obwohl die Nährwerte nur rund 600 und 350 kcal
> ergeben; hier wurden offenbar Kilojoule als Kilokalorien eingetragen.
> Danach folgen Spirituosen mit gut 200 kcal, aber fast ohne Fett, Eiweiß
> und Kohlenhydrate, denn ihre Energie steckt im Alkohol, den die Formel
> nicht kennt. Am unteren Ende liegen zuckerfreie Bonbons und Kaugummis, die
> weniger Energie haben als berechnet, weil ihre Zuckeraustauschstoffe als
> Kohlenhydrate zählen, aber nur gut halb so viel Energie liefern. Nur die
> erste Ursache ist ein Fehler in den Daten; die beiden anderen zeigen, dass
> die Formel eine Vereinfachung ist.

## Wie es weitergeht

Wenn dir die meisten Aufgaben ohne Lösung gelungen sind, bist du bereit für
das [[data-transformation-quiz|Quiz]] am Ende des Pfads. Weitere Aufgaben an
denselben Daten, auch mit Grafiken, stehen im
[[eda-self-assessment|Selbsttest zur explorativen Datenanalyse]].
