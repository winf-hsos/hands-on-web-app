---
type: lesson
code: 9918
title: Zusammenfassen nach Gruppen mit summarize(), group_by() und count()
summary: >-
  Mit `summarize()` fasst du viele Zeilen zu Kennzahlen wie Mittelwert und
  Median zusammen, mit `group_by()` für jede Gruppe einzeln, und `count()`
  zählt in einem Schritt, wie oft jeder Wert vorkommt.
objectives:
  intro: "In dieser Lektion lernst du, eine Tabelle mit `summarize()`, `group_by()` und `count()` zu Kennzahlen zu verdichten, und kannst danach:"
  goals:
    - "mit `summarize()` viele Zeilen zu einer Zeile mit Kennzahlen wie `n()`, `mean()`, `median()`, `min()`, `max()` und `sd()` zusammenfassen"
    - "erklären, warum eine Kennzahl über eine Spalte mit `NA` selbst `NA` ergibt, fehlende Werte mit `na.rm = TRUE` ausdrücklich weglassen und dazusagen, für wen das Ergebnis dann gilt"
    - "an einem Ausreißer zeigen, warum der Median oft robuster ist als der Mittelwert, und unplausible Werte vor dem Zusammenfassen herausfiltern"
    - "mit `group_by()` und `summarize()` eine Zeile je Gruppe berechnen, auch für die Kombinationen zweier Spalten"
    - "mit `count()` Häufigkeiten zählen und daraus mit `mutate()` Anteile berechnen, insgesamt oder innerhalb einer Gruppe"
level: 1
duration: 30
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-arrange-mutate, r-missing-values]
status: published
updated: 2026-11-09
---

Bisher war jede Zeile im Ergebnis einer Pipe noch eine befragte Person, auch
wenn es weniger Zeilen oder Spalten waren als in `survey`. `summarize()`
verdichtet dagegen viele Zeilen zu einer einzigen, die Kennzahlen wie einen
Mittelwert enthält. Zusammen mit `group_by()` entsteht daraus eine Zeile je
Gruppe, und damit lassen sich Gruppen vergleichen, was die meisten Fragen an
Daten verlangen.

## Viele Zeilen, eine Zeile

In `summarize()` steht wie in `mutate()` links der Name einer neuen Spalte
und rechts die Rechnung, nur muss die Rechnung aus einer ganzen Spalte einen
einzigen Wert machen. So berechnest du das Durchschnittsalter der 30
Befragten:

```r
survey |>
  summarize(mean_age = mean(age))
```

Das Ergebnis ist wieder eine Tabelle, mit einer Zeile und einer Spalte. Alle
anderen Spalten sind verschwunden, denn für eine Kennzahl über alle Personen
gibt es kein einzelnes Bundesland und keine einzelne Ernährungsweise mehr.
Die britische Schreibweise `summarise()` funktioniert übrigens genauso.

## Mehrere Kennzahlen auf einmal

Wie in `mutate()` trennst du mehrere Kennzahlen durch Kommas. Diese
Funktionen machen aus einer Spalte einen einzigen Wert:

| Funktion | liefert |
|---|---|
| `n()` | die Zahl der Zeilen; braucht keine Spalte |
| `mean()` | den Mittelwert |
| `median()` | den Median, den Wert in der Mitte, wenn man alle Werte sortiert |
| `min()`, `max()` | den kleinsten und den größten Wert |
| `sd()` | die Standardabweichung, die typische Abweichung vom Mittelwert |

Zusammen ergeben sie einen kleinen Steckbrief des Alters in einer einzigen
Zeile:

```r
survey |>
  summarize(
    n = n(),
    mean_age = mean(age),
    median_age = median(age),
    min_age = min(age),
    max_age = max(age),
    sd_age = sd(age)
  )
```

Die 30 Befragten sind zwischen 24 und 74 Jahre alt, im Mittel 51,4 Jahre.
Dass der Median mit 55,5 Jahren darüber liegt, zeigt, dass einige deutlich
Jüngere den Mittelwert nach unten ziehen.

## Fehlende Werte und `na.rm = TRUE`

Bei der Preisfrage geht derselbe Versuch schief, und das Ergebnis ist `NA`:

```r
survey |>
  summarize(mean_price = mean(price_too_expensive))
```

21 der 30 Befragten haben die Frage nie gesehen, und wie die Lektion
[[r-missing-values]] zeigt, ist jede Rechnung mit einem unbekannten Wert
selbst unbekannt. Mit `na.rm = TRUE` lässt du die fehlenden Werte
ausdrücklich weg. `n()` zählt allerdings weiter alle Zeilen; wie viele
Antworten tatsächlich in die Rechnung eingehen, zählt `sum(!is.na(…))`:

```r
survey |>
  summarize(
    n = n(),
    answers = sum(!is.na(price_too_expensive)),
    mean_price = mean(price_too_expensive, na.rm = TRUE),
    median_price = median(price_too_expensive, na.rm = TRUE)
  )
```

> [!IMPORTANT]
> `na.rm = TRUE` ist eine Entscheidung darüber, für wen die Kennzahl gilt,
> und kein Schalter, der eine Fehlermeldung wegmacht. Hier gilt sie für die
> neun Personen, die das Preisexperiment gesehen haben, und genau das gehört
> in jeden Satz, mit dem du das Ergebnis berichtest.

## Mittelwert oder Median

Fast 20 Euro als mittlere Schmerzgrenze für einen Liter Milch, bei einem
Median von 2 Euro? Den Unterschied macht eine einzige Person, die 160 Euro
angegeben hat. Der Mittelwert verteilt diesen einen Wert auf alle neun
Antworten, während der Median nur auf die Mitte der sortierten Werte schaut
und sich von einem Ausreißer kaum bewegen lässt.

Weil `summarize()` am Ende der Pipe steht, legst du davor mit `filter()`
fest, welche Zeilen eingehen. Ohne den unplausiblen Wert sieht es so aus:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  summarize(
    n = n(),
    mean_price = mean(price_too_expensive),
    median_price = median(price_too_expensive)
  )
```

Jetzt liegen Mittelwert und Median mit 2,01 und 2 Euro fast gleichauf.
`na.rm = TRUE` ist hier nicht mehr nötig, weil `filter()` die Zeilen ohne
Preis schon beim Vergleich verworfen hat.

## Eine Zeile je Gruppe

Seine eigentliche Stärke zeigt `summarize()` zusammen mit `group_by()`.
`group_by()` ändert an den Daten nichts Sichtbares, merkt sich aber, welche
Zeilen zusammengehören, und das folgende `summarize()` rechnet dann für jede
Gruppe einzeln. Wie alt sind die Befragten je Ernährungsweise, und wie viel
Bio kaufen sie?

```r
survey |>
  group_by(diet) |>
  summarize(
    n = n(),
    mean_age = mean(age),
    mean_organic = mean(organic_share)
  )
```

Die Spalte, nach der du gruppierst, bleibt im Ergebnis, sodass jede Zeile
sagt, für welche Gruppe sie steht. Schau dabei immer auch auf `n`: Der
Mittelwert der Gruppe `vegan` ist die Angabe einer einzigen Person und sagt
über Menschen, die vegan leben, so gut wie nichts.

## Gruppen sortieren

Das Ergebnis von `summarize()` ist eine gewöhnliche Tabelle, und `arrange()`
sortiert ihre Zeilen wie jede andere. Hier stehen die Gruppen mit dem
höchsten Bio-Anteil oben:

```r
survey |>
  group_by(diet) |>
  summarize(
    n = n(),
    mean_organic = mean(organic_share)
  ) |>
  arrange(desc(mean_organic))
```

## Nach zwei Spalten gruppieren

`group_by()` nimmt auch mehrere Spalten, und dann bildet jede Kombination,
die in den Daten vorkommt, eine eigene Gruppe:

```r
survey |>
  group_by(gender, diet) |>
  summarize(
    n = n(),
    mean_organic = mean(organic_share),
    .groups = "drop"
  )
```

`summarize()` löst nur die letzte Ebene der Gruppierung auf, und ohne
`.groups = "drop"` bliebe das Ergebnis nach `gender` gruppiert. Darauf weist
dplyr mit einer Meldung hin, denn ein `mutate()` danach würde dann je
Geschlecht rechnen. Mit `.groups = "drop"` ist das Ergebnis wieder eine
gewöhnliche Tabelle, und dasselbe erreichst du mit `ungroup()` am Ende der
Pipe. Lösch die Zeile einmal und lies die Meldung.

> [!TIP]
> Statt `group_by()` vor das `summarize()` zu schreiben, kannst du die
> Gruppen auch nur für diesen einen Schritt angeben, mit
> `summarize(n = n(), .by = c(gender, diet))`. Das Ergebnis ist dann nie
> gruppiert, die Gruppen stehen aber in der Reihenfolge, in der sie in den
> Daten zuerst vorkommen.

## Zählen mit `count()`

Wie viele Personen gibt es je Ernährungsweise? Mit `group_by()` und
`summarize(n = n())` ließe sich das berechnen, aber Zählen ist so häufig,
dass dplyr dafür eine Abkürzung hat:

```r
survey |>
  count(diet)
```

Mit `sort = TRUE` stehen die häufigsten Werte oben:

```r
survey |>
  count(diet, sort = TRUE)
```

Mit zwei Spalten zählt `count()` jede Kombination, so wie `group_by()` mit
zwei Spalten:

```r
survey |>
  count(gender, diet)
```

Fehlende Werte bilden beim Zählen eine eigene Gruppe. Das ist nützlich, denn
so siehst du auf einen Blick, wie viele Personen das Preisexperiment
überhaupt gesehen haben und wie viele nicht:

```r
survey |>
  count(milk_brand)
```

## Anteile berechnen

`count()` liefert eine Tabelle mit der Spalte `n`, und mit ihr kannst du
weiterrechnen. Teilst du jede Anzahl durch die Summe aller, erhältst du den
Anteil jeder Gruppe:

```r
survey |>
  count(diet) |>
  mutate(share = n / sum(n))
```

17 der 30 Befragten essen alles, ein Anteil von 0,567, und 9 leben
flexitarisch, genau 0,3. Die Anteile ergeben zusammen 1; wer Prozent lieber
mag, rechnet mal 100.

Sollen sich die Anteile innerhalb jeder Gruppe zu 1 summieren, etwa je
Geschlecht, gruppierst du vor dem `mutate()`. `sum(n)` ist dann die Summe
innerhalb der Gruppe, und du liest ab, welcher Anteil der Frauen und welcher
der Männer sich wie ernährt:

```r
survey |>
  count(gender, diet) |>
  group_by(gender) |>
  mutate(share = n / sum(n))
```

## Zum Mitnehmen

- `summarize()` macht aus vielen Zeilen eine, mit Kennzahlen wie `n()`,
  `mean()`, `median()`, `min()`, `max()` und `sd()`.
- Ein einziges `NA` macht eine Kennzahl zu `NA`; `na.rm = TRUE` lässt
  fehlende Werte weg, während `n()` weiter alle Zeilen zählt.
- Ein Ausreißer verschiebt den Mittelwert, aber kaum den Median, und
  unplausible Werte filterst du vor dem `summarize()` heraus.
- `group_by()` und `summarize()` liefern eine Zeile je Gruppe; nach zwei
  Spalten gruppiert, löst `.groups = "drop"` die Gruppierung danach auf.
- `count()` zählt Werte und Kombinationen, und `mutate(share = n / sum(n))`
  macht daraus Anteile.
