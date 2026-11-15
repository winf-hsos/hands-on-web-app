# Entwurf: Input „data visualisation with R and ggplot2“

**Status:** freigegeben von Nicolas am 2026-11-15 („Ja, so bauen“). Das Deck ist danach die Quelle; Abweichungen beim Bau: die ordinale Folie zeigt `milk_freq` statt `town_size`, weil deren alphabetische Reihenfolge fast der Skala entspricht, und die Schichtenfolie hat vier Schritte ohne `theme_minimal()`.

**Verortung:** Empirisches Arbeiten, Teil 3; Lektion `data-visualisation-basics` auf hands-on-computer-science.de.

# Die Folien

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code |
| 🪜 | Aufbau in Schritten |
| 🕹️ | eingebetteter Demonstrator |
| 🗳️ | Live-Abfrage |
| 🎞️ | Animation |

## Teil 0: Eröffnung (3 Folien)

### Folie 1
**Titel:** `data visualisation with R and ggplot2`, Untertitel
`hands-on data science · Prof. Dr. Nicolas Meseth`

### Folie 2
**Agenda:** entsteht aus den Teilen.

### Folie 3 📷
**Bild:** nach Entscheidung 2. **Text:** `2,809 people answered 21
questions. what do they eat?`
**Dazu sagen.** Die Tabelle beantwortet die Frage, aber niemand liest 2.809
Zeilen. Fünf Balken beantworten sie auf einen Blick.

## Teil 1: which chart? (14 Folien)

### Folie 4 🎬
`which chart?`, Untertitel `it depends on the scale`

### Folie 5 🖼️ 💬
**Zeichnung:** die vier Skalen aus dem Nutshell-Deck (nominal, ordinal,
interval, ratio) mit Beispiel aus der Umfrage, Typ in R und passender
Kennzahl, als Auffrischung. **Punchline:** `the scale decides the chart, not
taste.`

### Folie 6 🖼️
**Zeichnung:** die Landkarte des Teils als Raster: Zeilen „one variable“ und
„two variables“, Spalten „categories“, „numbers“, „categories and numbers“.
In jeder Zelle ein kleines Symbol des Diagramms (Balken, Histogramm,
Boxplot, gestapelte Balken, Streudiagramm). Kehrt als Wegweiser wieder, die
aktuelle Zelle hervorgehoben.

### Folie 7 ⌨️ 📊
`nominal: bars, sorted by frequency`, mit Grafik `diet` als liegende Balken,
nach Häufigkeit sortiert, Code über den Kopierknopf.
**Dazu sagen.** Eine nominale Variable hat keine Reihenfolge, also bestimmt
die Häufigkeit die Ordnung. `fct_infreq()` stellt die häufigste vorn hin.
Liegende Balken, weil die Namen lang sind.

### Folie 8 ⌨️ 📊
`ordinal: bars, in the order of the scale`, mit `town_size` zuerst
alphabetisch, dann als Faktor (zwei Schritte 🪜, wie im Nutshell-Deck).
**Dazu sagen.** Hier wäre die Sortierung nach Häufigkeit falsch, denn sie
zerreißt die Skala von der Großstadt bis zum Dorf.

### Folie 9 ⌨️
`a rating scale is ordinal, too`, mit `eco_conscious` von −2 bis +2 als
Balken.
**Dazu sagen.** Ratings sehen aus wie Zahlen, aber fünf Balken zeigen mehr
als ein Mittelwert von 0,6. Der Verweis auf „is a rating scale ordinal or
interval?“ aus dem Deck zu den Variablentypen gehört hierher.

### Folie 10 ⌨️ 📊
`one number: a histogram`, mit `age` in Klassen zu 5 Jahren.
**Dazu sagen.** Die Form der Verteilung: wo die meisten liegen, wie breit es
streut. `binwidth` probiert man aus.

### Folie 11 📊 🪜
`one outlier can hide everything`, mit `price_too_expensive` zuerst bis
999 €: ein einziger Balken links, sonst nichts. Im zweiten Schritt nur Preise
bis 10 € mit `filter()`, dazu der Satz `20 of 611 answers above 10 € left
out`.
**Dazu sagen.** Was man weglässt, sagt man dazu, in der Grafik oder
darunter.

### Folie 12 ⌨️
`one number, in short: a boxplot`, mit einem liegenden Boxplot desselben
Preises, die Teile beschriftet (Median, mittlere Hälfte, Whisker, Punkte).

### Folie 13 🖼️
Wegweiser auf „two variables“.

### Folie 14 ⌨️ 📊
`two categories: stacked bars to 100 %`, mit `diet` × `shops_organic` und
`position = "fill"`.
**Dazu sagen.** 56 % der Veganer kaufen im Bioladen ein, aber nur 8 % der
Allesesser. Auf 100 % gestapelt, weil die Gruppen unterschiedlich groß sind
(1.826 zu 36); in Anzahlen sähe man die Veganer kaum.

### Folie 15 ⌨️ 📊
`a number by group: boxplots side by side`, mit `price_too_expensive`
(bis 10 €) × `milk_brand`.
**Dazu sagen.** Die Mediane liegen fast gleich, 1,99 € und 2,00 €. Weil die
Marke zufällig zugeteilt wurde, ist das ein echtes Experiment: Die Marke
macht kaum einen Unterschied für die Preisgrenze.

### Folie 16 ⌨️ 📊
`two numbers: a scatter plot`, mit `age` × `price_too_expensive` (bis
10 €).
**Dazu sagen.** Jeder Punkt ist eine Person. Ein leichter Trend nach unten,
r = −0,25; wer älter ist, nennt etwas niedrigere Preise.

### Folie 17 ⌨️ 📊 🪜
`when points pile up: count them`, mit `eco_conscious` × `prefers_organic`,
zuerst als `geom_point()` (25 Punkte, mehr nicht), dann als `geom_count()`.
**Dazu sagen.** 385 Personen liegen auf demselben Punkt (0, 0). Punkte
verdecken das, Kreise nach Anzahl zeigen es.

### Folie 18 📊
`what to avoid` (nach Entscheidung 6): Kreis gegen Balken mit denselben
Zahlen zu `diet`, dazu 3D und eine abgeschnittene y-Achse.

### Folie 19 🕹️
`which chart for my question?`, darin der Demonstrator `which-chart`.
**Dazu sagen.** Drei Fragen, dann das Diagramm und der Code dazu. Mit „mit
der Umfrage ausprobieren“ kommen die echten Spaltennamen in die Vorlage.

## Teil 2: a chart in layers (11 Folien)

### Folie 20 🎬
`a chart in layers`, Untertitel `the grammar of graphics`

### Folie 21 🖼️
**Zeichnung:** drei übereinanderliegende Ebenen wie Folien auf einem
Projektor: `data` (die Tabelle), `aesthetics` (welche Spalte auf welche Achse
oder Farbe), `geom` (die Form: Balken, Punkte, Boxen). Daneben die
Zusatzschichten `labs`, `scales`, `theme` in Grau.
**Dazu sagen.** Leland Wilkinson nannte das 1999 die Grammatik der Grafik,
und Hadley Wickham hat sie mit ggplot2 in R gebracht.

### Folie 22 ⌨️ 🪜 🎞️
`one layer at a time`: links der Code, rechts die Grafik. Fünf Schritte,
in denen jeweils eine Zeile hinzukommt und blau hervorgehoben ist:
1. `survey |>` / `ggplot()`: eine leere graue Fläche
2. `+ aes(x = age)`: die x-Achse mit 20 bis 80 erscheint
3. `+ geom_histogram(binwidth = 5)`: die Balken wachsen von unten
   (die eine Animation des Decks, weil hier wirklich etwas entsteht)
4. `+ labs(x = "Age in years", y = "Number of respondents")`
5. `+ theme_minimal()`
**Dazu sagen.** Jede Zeile ist eine Schicht, und die Grafik ist nach jeder
Zeile eine gültige Grafik.

### Folie 23 💬
`|> passes the data on, + adds a layer`, mit beiden Zeichen groß.
**Dazu sagen.** Der häufigste Fehler: `|>` statt `+` nach `ggplot()`. R
meldet dann, dass es mit einem ggplot-Objekt nichts anfangen kann.

### Folie 24 ⌨️ 📊
`geom_bar() counts, geom_col() shows values`, links `geom_bar()` an
`diet`, rechts `count(diet)` und dann `geom_col()`. Dasselbe Bild auf zwei
Wegen.

### Folie 25 ⌨️
`aesthetics: more than x and y`, mit `fill = shops_organic` an den Balken
von Folie 14. `colour`, `fill`, `size`, `shape` als Liste.
**Dazu sagen.** Was in `aes()` steht, hängt an einer Spalte; was außerhalb
steht, gilt für alle (`fill = "steelblue"`). Dieser Unterschied verwirrt
anfangs fast alle.

### Folie 26 ⌨️
`order is a factor`, mit `fct_infreq()`, `fct_rev()` und `factor(…,
levels = …)` an einem Beispiel, zurückverweisend auf Folien 7 und 8.

### Folie 27 ⌨️
`small multiples: facet_wrap()`, mit dem Histogramm des Alters getrennt
nach `gender`.

### Folie 28 ⌨️
`labels are for people`, mit `labs()` (Titel, Achsen, Legende, Quelle) und
`scale_y_continuous(labels = scales::percent)` an den gestapelten Balken.

### Folie 29 ⌨️
`saving a chart`, mit `ggsave("diet.png", width = 16, height = 10, units =
"cm")`; im Quarto-Bericht dagegen der Chunk mit `fig-cap`.

### Folie 30 💬
**Punchline:** `the scale decides the chart, and three layers build it:
data, aesthetics and a geom.`
**Dazu sagen.** In der Lektion laufen alle Beispiele im Browser, dazu das
Quiz.

