---
type: exercise
code: 6731
title: "Selbsttest: Explorative Datenanalyse mit R"
summary: >-
  Dreizehn Aufgaben an echten Produktdaten: einen Überblick verschaffen,
  transformieren, visualisieren und genau hinsehen. So prüfst du, ob du für
  die explorative Datenanalyse bereit bist.
objectives:
  intro: "Mit diesem Selbsttest prüfst du an echten Produktdaten aus dem REWE-Onlineshop, ob du für die explorative Datenanalyse bereit bist, also ob du Folgendes kannst:"
  goals:
    - "dir mit `glimpse()` einen Überblick über Spalten, Typen und Werte verschaffen und mit `distinct()` Dubletten aufdecken"
    - "gezielte Fragen an eine Tabelle mit `arrange()`, `select()`, `filter()`, `count()` und `mutate()` beantworten"
    - "Spalten mit `where()` nach ihrem Typ auswählen und mit `as.character()` oder `across()` umwandeln"
    - "mit `ggplot2` Balkendiagramm, Histogramm, Boxplot und gestapelte Anteilsbalken mit `position = \"fill\"` zeichnen"
    - "an der Verteilung unplausible Werte erkennen, etwa Kilojoule, die als Kilokalorien eingetragen wurden"
level: 2
duration: 60
topics: [exploring-data, transforming-data, visualising-data]
modules: [ea]
areas: [ds]
relations:
  see_also: [r-for-data-science, fundamentals-of-data-visualization]
status: published
updated: 2026-11-01
---

Mit diesem Selbsttest prüfst du, ob du die Grundlagen beherrschst, mit denen
die explorative Datenanalyse beginnt. Wenn du den Teil *Whole game* aus
[[r-for-data-science]] durchgearbeitet hast oder die Lernpfade
[[getting-started-with-r]] und [[data-transformation-with-r]], sollten dir
die meisten Aufgaben leichtfallen. Versuch jede zuerst allein; die Lösung
kannst du aufklappen, wenn du nicht weiterkommst oder vergleichen willst.

In jedem Kasten liegt die Tabelle `rewe` bereit, mit gut 9.400 Produkten aus
dem [[rewe-products|REWE-Onlineshop]]: Name, Kategorie, Herkunft, Preis,
Bio-Kennzeichnung und Nährwerte je 100 g. dplyr und ggplot2 sind geladen.
Beim ersten Klick dauert das Laden einige Sekunden, bei der ersten Grafik
noch einmal.

## Teil 1: Überblick

**Aufgabe 1.** Verschaff dir einen Überblick über `rewe`: Welche Spalten gibt
es, welchen Typ haben sie, und wie sehen die Werte aus?

```r
rewe
```

> [!SOLUTION]
> ```r
> glimpse(rewe)
> ```
>
> `glimpse()` zeigt alle 22 Spalten untereinander, mit Typ und den ersten
> Werten. Die Nährwerte sind Kommazahlen, `bio` ist ein Wahrheitswert, und
> `product_id` und `gtin` sind Zahlen, obwohl man mit ihnen nicht rechnet.

**Aufgabe 2.** Die Tabelle hat 9.438 Zeilen. Wie viele verschiedene Produkte
stecken darin? Jedes Produkt hat eine eigene `product_id`.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   distinct(product_id) |>
>   nrow()
> ```
>
> Es sind 7.959 Produkte; knapp 1.500 Zeilen sind Dubletten. Für jede Zählung
> in den folgenden Aufgaben heißt das: Manche Produkte zählen doppelt. Für
> einen Selbsttest ist das in Ordnung, in einer echten Auswertung würdest du
> die Dubletten zuerst mit `distinct()` entfernen.

## Teil 2: Transformieren

**Aufgabe 3.** Zeige die zehn teuersten Produkte, nur mit Name und Preis.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   arrange(desc(price)) |>
>   select(product_name, price) |>
>   head(10)
> ```
>
> Ganz oben stehen ein gusseiserner Bräter und Zigaretten, kein
> Lebensmittel. Einige Produkte erscheinen zweimal; das sind die Dubletten
> aus Aufgabe 2.

**Aufgabe 4.** Aus welchen Ländern stammen die Produkte? Zeige jedes Land mit
der Zahl seiner Produkte, das häufigste zuerst.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   count(country_of_origin, sort = TRUE)
> ```
>
> Die meisten Produkte kommen aus Deutschland, mit großem Abstand. Auf Platz
> zwei steht `NA`: Bei rund einem Fünftel fehlt die Herkunft.

**Aufgabe 5.** Berechne eine neue Spalte `fat_unsat_in_gram`, den Fettgehalt
ohne die gesättigten Fettsäuren, und zeige sie mit Name, Fett und
gesättigten Fettsäuren.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   mutate(fat_unsat_in_gram = fat_in_gram - fat_sat_in_gram) |>
>   select(product_name, fat_in_gram, fat_sat_in_gram, fat_unsat_in_gram)
> ```
>
> Wo einer der beiden Werte fehlt, ist auch die neue Spalte `NA`.

**Aufgabe 6.** Welche Produkte haben mehr als 99 g Fett je 100 g? Zeige nur
Name und Fett.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(fat_in_gram > 99) |>
>   select(product_name, fat_in_gram)
> ```
>
> Es sind sieben Zeilen: Öl, Schmalz und Pflanzenfett.

**Aufgabe 7.** Behalte nur die Spalten, in denen Zahlen stehen.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   select(where(is.numeric))
> ```
>
> `where()` wählt Spalten nach einer Eigenschaft ihres Inhalts aus, hier nach
> dem Typ. Auch `product_id` und `gtin` sind dabei, denn R hält sie für
> Zahlen.

**Aufgabe 8.** `product_id` und `gtin` sind Nummern, mit denen man nicht
rechnet. Wandle beide in Text um.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   mutate(
>     product_id = as.character(product_id),
>     gtin = as.character(gtin)
>   ) |>
>   select(product_id, gtin, product_name)
> ```
>
> Kürzer geht es mit `mutate(across(c(product_id, gtin), as.character))`;
> `across()` wendet eine Funktion auf mehrere Spalten an.

## Teil 3: Visualisieren

**Aufgabe 9.** Zeige in einem Balkendiagramm, wie viele Produkte es in jeder
Kategorie gibt.

```r
rewe |>
  ggplot() +
  aes()
```

> [!SOLUTION]
> ```r
> rewe |>
>   ggplot() +
>   aes(y = product_category) +
>   geom_bar()
> ```
>
> Mit den Kategorien auf der y-Achse bleiben lange Namen lesbar.

**Aufgabe 10.** Zeige in einem Histogramm, wie sich der Energiegehalt in kcal
über alle Produkte verteilt.

```r
rewe |>
  ggplot() +
  aes()
```

> [!SOLUTION]
> ```r
> rewe |>
>   ggplot() +
>   aes(x = energy_in_kcal) +
>   geom_histogram(binwidth = 50)
> ```
>
> Die Warnung über entfernte Zeilen meint die Produkte ohne Nährwerte. Achte
> auf die x-Achse: Sie reicht weit über das hinaus, was ein Lebensmittel
> haben kann. Darum geht es in Aufgabe 13.

**Aufgabe 11.** Vergleiche mit Boxplots den Fettgehalt der Kategorien.

```r
rewe |>
  ggplot() +
  aes()
```

> [!SOLUTION]
> ```r
> rewe |>
>   ggplot() +
>   aes(x = fat_in_gram, y = product_category) +
>   geom_boxplot()
> ```

**Aufgabe 12.** Zeige mit gestapelten Balken, welcher Anteil der Produkte in
jeder Kategorie bio ist.

```r
rewe |>
  ggplot() +
  aes()
```

> [!SOLUTION]
> ```r
> rewe |>
>   ggplot() +
>   aes(y = product_category, fill = bio) +
>   geom_bar(position = "fill")
> ```
>
> `position = "fill"` streckt jeden Balken auf die volle Länge, so dass die
> Anteile vergleichbar werden, auch wenn die Kategorien verschieden groß
> sind.

## Teil 4: Genau hinsehen

**Aufgabe 13.** Ein Lebensmittel hat höchstens etwa 900 kcal je 100 g; mehr
hat nicht einmal reines Fett. Finde die Produkte, die mehr haben, und zeige
Name, Energie und Fett. Was ist da wohl passiert?

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(energy_in_kcal > 900) |>
>   select(product_name, energy_in_kcal, fat_in_gram)
> ```
>
> Fünf Produkte, darunter Nudeln mit 1.521 kcal bei 2 g Fett. Das kann nicht
> stimmen, aber 1.521 Kilojoule wären für Nudeln genau richtig, umgerechnet
> rund 360 kcal. Hier wurde vermutlich der Wert in Kilojoule als Kilokalorien
> eingetragen. Solche Fehler findet man nur, wenn man sich die Verteilung
> ansieht und fragt, was überhaupt möglich ist; genau darum geht es in der
> explorativen Datenanalyse.

## Wie es weitergeht

Hast du fast alles ohne die Lösungen geschafft, bist du gut vorbereitet. Wo
es gehakt hat, helfen diese Inhalte weiter:

- **Aufgaben 1 bis 8:** der Lernpfad [[data-transformation-with-r]] und der
  Teil *Transform* in [[r-for-data-science]].
- **Aufgaben 9 bis 12:** der Teil *Visualize* in [[r-for-data-science]] und,
  für die Frage, welche Grafik passt, [[fundamentals-of-data-visualization]].
- **Aufgabe 13:** Hier gibt es kein Rezept, nur die Gewohnheit, jedem
  Ergebnis erst einmal zu misstrauen.
