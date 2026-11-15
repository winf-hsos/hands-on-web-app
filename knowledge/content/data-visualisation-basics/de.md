---
type: lesson
code: 8921
title: Daten zeigen mit ggplot2
summary: >-
  Welches Diagramm zu welcher Variable passt, hängt an ihrer Skala, für eine
  Variable wie für zwei. Mit ggplot2 entsteht jedes davon aus denselben drei
  Schichten: Daten, Ästhetik und Geom, hier an der kompakten Milchbefragung
  und direkt im Browser.
objectives:
  intro: "In dieser Lektion lernst du, Daten mit ggplot2 zu zeigen, und kannst danach:"
  goals:
    - "für eine Variable aus ihrer Skala das passende Diagramm wählen: Balken nach Häufigkeit, Balken in der Reihenfolge der Skala, Histogramm oder Boxplot"
    - "für zwei Variablen zwischen gestapelten Balken auf 100 %, Boxplots nebeneinander, Streudiagramm und `geom_count()` wählen und die Wahl begründen"
    - "erkennen, wann ein Ausreißer, eine abgeschnittene Achse oder ein Kreisdiagramm ein Bild verzerrt, und sagen, was du weglässt"
    - "ein Diagramm in ggplot2 Schicht für Schicht aus Daten, `aes()` und einem Geom aufbauen und `|>` von `+` unterscheiden"
    - "die Reihenfolge der Balken über einen Faktor festlegen, mit `facet_wrap()` Gruppen nebeneinander zeigen, mit `labs()` beschriften und mit `ggsave()` speichern"
level: 1
duration: 50
topics: [visualising-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-select, dplyr-filter, dplyr-arrange, dplyr-mutate, dplyr-summarize]
status: draft
updated: 2026-11-15
---

![Folien: Datenvisualisierung mit R und ggplot2](item:data-visualisation-slides)

In der kompakten Milchbefragung haben 2.809 Menschen 21 Fragen beantwortet,
darunter, wie sie sich ernähren. Die Antwort auf die Frage, wie viele
vegetarisch leben, steckt in der Tabelle, und `count()` holt sie heraus:

```r
survey |>
  count(diet, sort = TRUE)
```

Fünf Zahlen lassen sich noch lesen, aber schon hier muss man rechnen, um zu
sehen, dass die Allesesser mehr als doppelt so viele sind wie die
Flexitarier. Ein Balkendiagramm zeigt dasselbe auf einen Blick:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = fct_rev(fct_infreq(diet))) +
  geom_bar() +
  labs(x = "Number of respondents", y = NULL)
```

Diese Lektion beantwortet zwei Fragen: welches Diagramm zu welcher Variable
passt, und wie man es mit dem Paket ggplot2 baut. Alle Codekästen laufen im
Browser mit der Tabelle `survey`, und du kannst jeden ändern und neu
ausführen.

## Die Skala entscheidet

Welches Diagramm passt, hängt fast immer an einer einzigen Frage: Welche
Skala hat die Variable? Die vier Skalenniveaus kennst du aus den Folien
[[types-of-variables-slides]]; hier zählt, was aus ihnen für das Bild folgt.

| Skala | Beispiel | in R | passendes Diagramm |
|---|---|---|---|
| nominal | `diet` | `<chr>` oder `<fct>` | Balken, nach Häufigkeit sortiert |
| ordinal | `milk_freq`, `eco_conscious` | `<fct>` mit Stufen | Balken in der Reihenfolge der Skala |
| Intervall | Geburtsjahr | `<dbl>` | Histogramm, Boxplot |
| Verhältnis | `age`, `price_too_expensive` | `<dbl>` | Histogramm, Boxplot |

Nominal und ordinal sind Kategorien, die man zählt; Intervall und
Verhältnis sind Zahlen, deren Verteilung man zeigt. Für das Diagramm macht
der Unterschied zwischen Intervall und Verhältnis nichts aus, wohl aber der
zwischen nominal und ordinal.

## Eine Variable

### Nominal: Balken nach Häufigkeit

Die Ernährung hat keine natürliche Reihenfolge. Also bestimmt die
Häufigkeit die Ordnung, denn dann liest man die Rangfolge direkt ab. Das
Diagramm vom Anfang tut genau das: `fct_infreq()` aus dem Paket forcats
stellt die häufigste Kategorie an den Anfang, `fct_rev()` dreht die
Reihenfolge um, damit sie oben steht. Liegende Balken (`y` statt `x`) halten
lange Namen lesbar.

### Ordinal: Balken in der Reihenfolge der Skala

Wie oft wird zu Hause Milch getrunken? Die Spalte `milk_freq` kommt als Text
aus der Datei, und Text sortiert R alphabetisch:

```r
survey |>
  filter(!is.na(milk_freq)) |>
  ggplot() +
  aes(x = milk_freq) +
  geom_bar() +
  labs(x = "How often milk is drunk at home", y = "Number of respondents")
```

Die Reihenfolge daily, monthly, rarely, weekly zerreißt die Skala. Nach
Häufigkeit zu sortieren wäre genauso falsch, denn eine ordinale Variable hat
ihre eigene Reihenfolge. Die gibst du mit `factor()` und `levels` vor:

```r
survey |>
  filter(!is.na(milk_freq)) |>
  mutate(milk_freq = factor(milk_freq, levels = c(
    "daily", "weekly", "monthly", "rarely"
  ))) |>
  ggplot() +
  aes(x = milk_freq) +
  geom_bar() +
  labs(x = "How often milk is drunk at home", y = "Number of respondents")
```

Jetzt sieht man, dass die Balken mit der Skala abnehmen. Die Werte in
`levels` müssen genau so geschrieben sein wie in den Daten, sonst wird aus
einem Wert still ein `NA`. `filter(!is.na())` lässt die 424 Personen ohne
Angabe weg, und das gehört zur Beschreibung des Diagramms dazu.

### Ratingskalen

Eine Bewertung von −2 bis +2 steht als Zahl in der Tabelle, ist aber eine
Abfolge von fünf Stufen. Fünf Balken zeigen, wie sich die Antworten
verteilen, und sagen mehr als ein Mittelwert von 0,6:

```r
survey |>
  filter(!is.na(eco_conscious)) |>
  ggplot() +
  aes(x = eco_conscious) +
  geom_bar() +
  labs(x = "\"I would call myself eco-conscious\" (-2 to +2)", y = "Number of respondents")
```

### Eine Zahl: das Histogramm

Das Alter ist eine Zahl. Das Histogramm teilt die Zahlen in Klassen, hier je
fünf Jahre, und zählt, wie viele Personen in jede fallen. So wird die Form der
Verteilung sichtbar: wo die meisten liegen, wie breit sie streut, wo sie
endet.

```r
survey |>
  ggplot() +
  aes(x = age) +
  geom_histogram(binwidth = 5) +
  labs(x = "Age in years", y = "Number of respondents")
```

Probiere `binwidth = 1` und `binwidth = 10`. Zu schmale Klassen zeigen
Rauschen, zu breite verwischen die Form; eine richtige Breite gibt es nicht,
nur eine, die die Frage gut beantwortet.

### Ein Ausreißer kann alles verdecken

Ab welchem Preis ist ein Liter Milch zu teuer? 611 Personen haben das
beantwortet, eine davon mit 999 €:

```r
survey |>
  filter(!is.na(price_too_expensive)) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(bins = 30) +
  labs(x = "Too expensive from (€)", y = "Number of respondents")
```

Die Achse reicht bis zum größten Wert, und alles Interessante drängt sich in
den ersten Balken. Mit `filter()` beschränkst du das Diagramm auf
Literpreise, die ernst gemeint sein können:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(binwidth = 0.25) +
  labs(x = "Too expensive from (€)", y = "Number of respondents")
```

> [!IMPORTANT]
> Was du weglässt, sagst du dazu, im Diagramm oder im Text darunter. Hier
> sind es 20 von 611 Antworten über 10 €.

### Eine Zahl in Kürze: der Boxplot

Dieselben Preise als Boxplot:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_boxplot() +
  labs(x = "Too expensive from (€)", y = NULL)
```

Der Strich in der Box ist der Median, hier 1,99 €. Die Box umfasst die
mittlere Hälfte der Antworten, vom ersten bis zum dritten Quartil. Die
Linien reichen bis zum letzten Wert, der höchstens anderthalb Boxbreiten von
der Box entfernt liegt, und was darüber hinausgeht, erscheint als einzelner
Punkt. Der Boxplot verliert die Form, die das Histogramm zeigt, braucht aber
wenig Platz, und das macht ihn stark, sobald du Gruppen vergleichst.

## Zwei Variablen

Bei zwei Variablen entscheiden beide Skalen gemeinsam.

| zwei … | Diagramm | Geom |
|---|---|---|
| Kategorien | gestapelte Balken auf 100 % | `geom_bar(position = "fill")` |
| eine Zahl je Gruppe | Boxplots nebeneinander | `geom_boxplot()` |
| Zahlen | Streudiagramm | `geom_point()` |
| Zahlen mit wenigen Werten | Kreise nach Anzahl | `geom_count()` |

### Zwei Kategorien: gestapelte Balken auf 100 %

Kaufen Menschen, die vegan leben, häufiger im Bioladen ein? Je
Ernährungsform ein Balken, und die Füllfarbe (`fill`) zeigt, wer im Bioladen
einkauft:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = fct_infreq(diet), fill = shops_organic) +
  geom_bar(position = "fill") +
  labs(x = "Share of respondents", y = NULL, fill = "Shops in an\norganic store")
```

56 % der Veganer kaufen im Bioladen ein, aber nur 8 % der Allesesser.
`position = "fill"` stapelt jeden Balken auf 100 %, weil die Gruppen sehr
unterschiedlich groß sind, 1.826 Allesesser gegenüber 36 Veganern; in
Anzahlen sähe man die Veganer kaum. Der Preis dafür ist, dass das Diagramm
die Größe der Gruppen nicht mehr zeigt, und die gehört deshalb in die
Beschriftung.

### Eine Zahl je Gruppe: Boxplots nebeneinander

Im Preisexperiment der Umfrage sah ein Teil der Befragten Weihenstephan, ein
anderer Alpro, und der Zufall entschied, wer welche Marke sah:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = milk_brand, y = price_too_expensive) +
  geom_boxplot() +
  labs(x = "Brand shown", y = "Too expensive from (€)")
```

Die Mediane liegen fast gleich, 1,99 € und 2,00 €. Weil die Marke zufällig
zugeteilt wurde, ist das ein Experiment, und die Marke macht für die
Preisgrenze kaum einen Unterschied.

### Zwei Zahlen: das Streudiagramm

Jeder Punkt ist eine Person, mit ihrem Alter auf der x-Achse und ihrer
Preisgrenze auf der y-Achse:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = age, y = price_too_expensive) +
  geom_point(alpha = 0.6) +
  labs(x = "Age in years", y = "Too expensive from (€)")
```

Die Wolke fällt leicht nach rechts ab, die Korrelation liegt bei −0,25: Wer
älter ist, nennt etwas niedrigere Preise. `alpha = 0.6` macht die Punkte
durchscheinend, damit man sieht, wo sie sich überlagern.

### Wenn Punkte sich stapeln

Zwei Ratingskalen von −2 bis +2 ergeben nur 25 mögliche Punkte. Ein
Streudiagramm zeigt diese 25 und sonst nichts, auch nicht, dass auf dem
Punkt in der Mitte 385 Personen liegen. `geom_count()` zählt und zeichnet
die Kreise nach Anzahl:

```r
survey |>
  ggplot() +
  aes(x = eco_conscious, y = prefers_organic) +
  geom_count() +
  labs(x = "Eco-conscious (-2 to +2)", y = "Prefers organic (-2 to +2)", size = "Respondents")
```

Jetzt sieht man den Zusammenhang (r = 0,41): Wer sich als umweltbewusst
bezeichnet, kauft eher Bio. Ersetze `geom_count()` durch `geom_point()` und
vergleiche.

### Was man vermeidet

- **Kreisdiagramme:** Sie verlangen, Winkel zu vergleichen, und das können
  Menschen schlecht. Sind Pescetarier und Veganer gleich viele? Im
  Kreisdiagramm ist das kaum zu sagen, im Balkendiagramm sofort. Ein Kreis
  in 3D ist noch schlechter, weil die Perspektive vorn liegende Stücke größer
  macht.
- **Abgeschnittene Achsen unter Balken:** 64,7 % der Frauen und 56,3 % der
  Männer trinken täglich Milch. Beginnt die Achse bei 55 %, sieht der
  Unterschied aus wie das Dreifache. Ein Balken zeigt seine Größe über seine
  Länge, deshalb beginnen Balken bei null; ggplot2 tut das von selbst.
- **Ausreißer ohne Hinweis:** Wer Werte weglässt, sagt, welche und wie
  viele.

## Welches Diagramm passt?

Der Demonstrator fragt, wie viele Variablen du zeigen willst und welche
Werte sie haben, und gibt das passende Diagramm mit einer R-Vorlage aus. Mit
den Spalten der Umfrage setzt er echte Namen ein, sodass du den Code in einen
Codekasten dieser Lektion kopieren und ausführen kannst.

![Welches Diagramm passt?](item:which-chart)

## Ein Diagramm in Schichten

Jedes Diagramm in ggplot2 entsteht aus denselben drei Schichten:

- den **Daten**, einer Tabelle mit einer Zeile je Beobachtung,
- der **Ästhetik** (`aes()`), die sagt, welche Spalte auf welche Achse oder
  in welche Farbe geht,
- dem **Geom**, der Form, in der die Werte erscheinen: Balken, Punkte,
  Boxen.

Alles Weitere, also Beschriftungen, Skalen und das Aussehen, verfeinert nur.
Leland Wilkinson hat diese Zerlegung als *Grammar of Graphics* beschrieben,
und Hadley Wickham hat sie mit ggplot2 nach R gebracht.

### Schicht für Schicht

Führe den Code aus und nimm dann die Zeilen von unten nach oben weg. Nach
jeder Zeile ist das Ergebnis ein gültiges Diagramm: `ggplot()` allein ergibt
eine leere Fläche, `aes()` bringt die Achse, `geom_histogram()` die Balken
und `labs()` die Beschriftung.

```r
survey |>
  ggplot() +
  aes(x = age) +
  geom_histogram(binwidth = 5) +
  labs(
    x = "Age in years",
    y = "Number of respondents"
  )
```

### Pipe und Plus

Bis `ggplot()` fließen die Daten durch die Pipe `|>`, danach kommen
Schichten mit `+` dazu. Wer nach `ggplot()` mit der Pipe weiterschreibt,
übergibt das Diagramm als Argument an `aes()`. R zeichnet dann nichts,
sondern gibt nur eine Zuordnung aus, in der das Diagramm selbst als `y`
gelandet ist:

```r
survey |>
  ggplot() |>
  aes(x = age)
```

Ersetze das zweite `|>` durch `+`, dann läuft es.

### `geom_bar()` zählt, `geom_col()` zeigt Werte

`geom_bar()` bekommt die Rohdaten, eine Zeile je Person, und zählt selbst.
`geom_col()` bekommt eine Tabelle, in der die Werte schon stehen, und
zeichnet sie nur. Beide Kästen ergeben dasselbe Bild:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(x = diet) +
  geom_bar()
```

```r
survey |>
  filter(!is.na(diet)) |>
  count(diet) |>
  ggplot() +
  aes(x = diet, y = n) +
  geom_col()
```

Den zweiten Weg brauchst du, sobald du vorher etwas ausrechnest, etwa
Anteile oder Mittelwerte je Gruppe.

### Ästhetik: in `aes()` oder außerhalb

Eine Ästhetik verbindet eine Spalte mit einer Eigenschaft des Bildes: `x`
und `y`, aber auch `fill` (Füllfarbe), `colour` (Linienfarbe), `size`,
`shape` und `alpha`. Was in `aes()` steht, hängt an einer Spalte und ändert
sich von Balken zu Balken:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = diet, fill = shops_organic) +
  geom_bar()
```

Was außerhalb im Geom steht, gilt für alle gleich:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = diet) +
  geom_bar(fill = "steelblue")
```

> [!WARNING]
> Schreibst du `fill = "steelblue"` in `aes()`, behandelt ggplot2 den Text
> wie eine Spalte mit einem einzigen Wert: Die Balken bekommen die erste
> Farbe der Standardpalette, und eine Legende mit dem Eintrag „steelblue“
> erscheint. Probiere es aus.

### Die Reihenfolge ist ein Faktor

Die Reihenfolge der Balken bestimmt nicht ggplot2, sondern der Faktor
dahinter. Drei Werkzeuge aus dem Paket forcats und aus R selbst genügen:

| Ausdruck | Reihenfolge |
|---|---|
| `fct_infreq(diet)` | häufigste zuerst |
| `fct_rev(fct_infreq(diet))` | umgedreht, häufigste oben in liegenden Balken |
| `factor(milk_freq, levels = c(…))` | die Reihenfolge, die du vorgibst |

Nominale Variablen sortierst du nach Häufigkeit, ordinale nach der Skala.

### Kleine Vielfache mit `facet_wrap()`

`facet_wrap()` zeichnet dasselbe Diagramm einmal je Gruppe, nebeneinander
und mit denselben Achsen. Die Tilde vor `gender` heißt: je Wert dieser
Spalte ein Feld.

```r
survey |>
  ggplot() +
  aes(x = age) +
  geom_histogram(binwidth = 5) +
  facet_wrap(~ gender) +
  labs(x = "Age in years", y = "Number of respondents")
```

### Beschriftungen sind für Menschen

Spaltennamen sind für R, Beschriftungen für die Menschen, die das Diagramm
lesen. `labs()` setzt Titel, Achsen, Legende und Quelle, und der Titel nennt
die Aussage statt nur des Themas. `scale_x_continuous(labels =
scales::percent)` schreibt Anteile als Prozent:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = fct_infreq(diet), fill = shops_organic) +
  geom_bar(position = "fill") +
  scale_x_continuous(labels = scales::percent) +
  labs(
    title = "Vegans shop in organic stores most often",
    x = "Share of respondents", y = NULL, fill = "Organic store",
    caption = "Source: milk survey, compact (n = 2,781 with a diet)"
  )
```

### Speichern

`ggsave()` schreibt ein Diagramm als Datei. Die Größe gibst du in
Zentimetern an, damit die Schrift im Bericht passt:

```r
diet_plot <- survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = fct_rev(fct_infreq(diet))) +
  geom_bar()

ggsave("diet.png", diet_plot, width = 16, height = 10, units = "cm")
```

In einem Quarto-Bericht brauchst du das nicht: Der Code-Chunk zeichnet das
Diagramm selbst, und die Bildunterschrift steht in der Chunk-Option
`#| fig-cap`.

## Ausprobieren

Drei Aufgaben, jede mit einem Codekasten, in dem die Pipe schon steht. Die
Tipps und die Lösung klappst du auf, wenn du sie brauchst.

1. Zeige, wie oft zu Hause Milch getrunken wird (`milk_freq`), als Balken in
   der Reihenfolge der Skala, ohne die fehlenden Angaben.

```r
survey |>
  filter() |>
  mutate() |>
  ggplot() +
  aes() +
  geom_bar()
```

2. Zeige für jede Ernährungsweise, wie sich der Bio-Anteil am Einkauf
   (`organic_share`, 1 bis 5) verteilt, als gestapelte Balken auf 100 %.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  geom_bar()
```

3. Vergleiche die Preisgrenze (`price_too_expensive`) von Frauen und
   Männern als Boxplots nebeneinander, nur mit Preisen bis 10 €.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  geom_boxplot()
```

> [!HINT]
> Aufgabe 1 braucht `factor()` mit `levels` in der Reihenfolge daily,
> weekly, monthly, rarely. Zur Kontrolle: Der erste Balken steht für 1.451
> Personen.

> [!HINT]
> In Aufgabe 2 ist `organic_share` eine Zahl. Damit `fill` fünf getrennte
> Farben statt eines Farbverlaufs zeigt, machst du sie in `aes()` mit
> `factor(organic_share)` zur Kategorie. Zur Kontrolle: Bei den Veganern
> liegen 61 % auf Stufe 4 oder 5, bei den Allesessern 11 %.

> [!HINT]
> In Aufgabe 3 kommt `gender` auf die x-Achse und der Preis auf die y-Achse.
> Zur Kontrolle: Der Median liegt bei den Frauen bei 2,00 €, bei den Männern
> bei 1,89 €.

> [!SOLUTION]
> Aufgabe 1:
>
> ```r
> survey |>
>   filter(!is.na(milk_freq)) |>
>   mutate(milk_freq = factor(milk_freq, levels = c(
>     "daily", "weekly", "monthly", "rarely"
>   ))) |>
>   ggplot() +
>   aes(x = milk_freq) +
>   geom_bar() +
>   labs(x = "How often milk is drunk at home", y = "Number of respondents")
> ```
>
> Aufgabe 2:
>
> ```r
> survey |>
>   filter(!is.na(diet), !is.na(organic_share)) |>
>   ggplot() +
>   aes(y = fct_infreq(diet), fill = factor(organic_share)) +
>   geom_bar(position = "fill") +
>   labs(x = "Share of respondents", y = NULL, fill = "Organic share\n(1 to 5)")
> ```
>
> Aufgabe 3:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   ggplot() +
>   aes(x = gender, y = price_too_expensive) +
>   geom_boxplot() +
>   labs(x = NULL, y = "Too expensive from (€)")
> ```

## Das Wichtigste

- Die Skala entscheidet das Diagramm: nominale Variablen als Balken nach
  Häufigkeit, ordinale als Balken in der Reihenfolge der Skala, Zahlen als
  Histogramm oder Boxplot.
- Für zwei Variablen: zwei Kategorien als gestapelte Balken auf 100 %, eine
  Zahl je Gruppe als Boxplots nebeneinander, zwei Zahlen als Streudiagramm
  und bei wenigen Werten mit `geom_count()`.
- Was du weglässt, sagst du dazu; Balken beginnen bei null, und Längen sind
  leichter zu vergleichen als Winkel.
- ggplot2 baut jedes Diagramm aus Daten, `aes()` und einem Geom; bis
  `ggplot()` verbindet die Pipe, danach das Plus.
- Die Reihenfolge der Balken legt der Faktor fest, `facet_wrap()` zeigt
  Gruppen nebeneinander, `labs()` beschriftet für Menschen.

![Quiz: Diagramme und ggplot2](item:data-visualisation-quiz)

## Zum Weiterlesen

Claus O. Wilke: *Fundamentals of Data Visualization*. O'Reilly, 2019,
frei lesbar unter <https://clauswilke.com/dataviz/>. Das Buch ordnet
Diagramme danach, was sie zeigen sollen, und ist mit ggplot2 gebaut.

Hadley Wickham, Mine Çetinkaya-Rundel und Garrett Grolemund: *R for Data
Science*. 2. Auflage, O'Reilly, 2023, frei lesbar unter
<https://r4ds.hadley.nz/>, besonders die Kapitel „Data visualization“ und
„Layers“.

Leland Wilkinson: *The Grammar of Graphics*. 2. Auflage, Springer, 2005.
Die Theorie hinter ggplot2, für alle, die wissen wollen, warum die Schichten
so heißen, wie sie heißen.
