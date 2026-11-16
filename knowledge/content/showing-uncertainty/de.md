---
type: lesson
code: 6918
title: Unsicherheit zeigen
summary: >-
  Ein Mittelwert aus einer Stichprobe ist eine Schätzung, deren Genauigkeit an
  Streuung und Fallzahl hängt. Mit `summarize()` berechnest du den
  Standardfehler je Gruppe und zeigst ihn mit `geom_pointrange()` als Punkt mit
  Fehlerbalken, am Markenexperiment und an den Ernährungsweisen der kompakten
  Milchbefragung.
objectives:
  intro: "In dieser Lektion lernst du, die Unsicherheit eines Mittelwerts zu berechnen und zu zeigen, und kannst danach:"
  goals:
    - "mit `group_by()` und `summarize()` je Gruppe Mittelwert, Standardabweichung, Fallzahl und Standardfehler berechnen"
    - "erklären, warum der Standardfehler mit der Streuung wächst und mit der Fallzahl schrumpft, und aus Mittelwert ± 2 Standardfehlern ein ungefähres 95-%-Intervall bilden"
    - "Mittelwerte mit `geom_pointrange()` als Punkte mit Fehlerbalken zeigen und die Fallzahl jeder Gruppe in die Beschriftung schreiben"
    - "Standardabweichung und Standardfehler auseinanderhalten und dazusagen, was die Linien eines Diagramms zeigen"
    - "begründen, warum überlappende Intervalle keine Gleichheit beweisen und getrennte Intervalle keinen Test ersetzen"
level: 1
duration: 30
topics: [visualising-data, data-pitfalls]
modules: [ea]
areas: [ds]
relations:
  requires: [data-visualisation-basics, dplyr-summarize]
status: draft
updated: 2026-11-16
---

Jeder Mittelwert aus einer Befragung ist eine Schätzung, denn hätten andere
Menschen geantwortet, käme eine etwas andere Zahl heraus. Ein Diagramm, das
nur den Mittelwert zeigt, verschweigt, wie genau diese Schätzung ist. Diese
Lektion zeigt dir, wie du die Unsicherheit mit den Werkzeugen aus
[[dplyr-summarize]] berechnest und mit ggplot2 sichtbar machst, ohne ein
zusätzliches Paket.

## Ein Mittelwert allein reicht nicht

Im Markenexperiment der Umfrage bekamen die Befragten eine von sieben
Milchmarken zu sehen, die der Zufall auswählte, und bewerteten deren Qualität
in `brand_quality` von −2 (gering) bis +2 (hoch). Der Code berechnet den
Mittelwert je Marke und zeichnet ihn als Balken:

```r
survey |>
  filter(!is.na(brand_quality)) |>
  group_by(rated_brand) |>
  summarize(mean_rating = mean(brand_quality)) |>
  ggplot() +
  aes(x = mean_rating, y = fct_reorder(rated_brand, mean_rating)) +
  geom_col() +
  labs(x = "Mean quality rating (-2 to +2)", y = NULL)
```

Oatly liegt mit 0,48 unten, Bärenmarke mit 0,99 oben, und dazwischen stehen
fünf Balken, die sich kaum unterscheiden. Jeder Balken beruht auf 315 bis 339
Bewertungen, und eine zweite Befragung mit anderen Menschen ergäbe etwas
andere Mittelwerte. Ob Bärenmarke wirklich vor Fockenbrock liegt oder nur in
dieser Stichprobe, können die Balken nicht sagen, weil sie keine Unsicherheit
zeigen.

## Wie genau ist ein Mittelwert?

Wie stark ein Mittelwert von Stichprobe zu Stichprobe schwanken würde, hängt
an zwei Dingen: wie weit die einzelnen Antworten streuen, gemessen mit der
Standardabweichung, und wie viele Antworten es sind. Beides steckt im
**Standardfehler**, der Standardabweichung geteilt durch die Wurzel der
Fallzahl, in R `sd / sqrt(n)`. Ein Mittelwert aus vielen ähnlichen Antworten
ist deshalb genauer als einer aus wenigen, weit verstreuten, und weil die
Fallzahl unter der Wurzel steht, halbiert erst die vierfache Zahl an Antworten
den Standardfehler.

### Alles in einer Tabelle

Mit `group_by()` und `summarize()` berechnest du je Marke Mittelwert,
Standardabweichung, Fallzahl und Standardfehler, und aus dem Standardfehler
die untere und obere Grenze eines Intervalls:

```r
survey |>
  filter(!is.na(brand_quality)) |>
  group_by(rated_brand) |>
  summarize(
    mean_rating = mean(brand_quality),
    sd_rating = sd(brand_quality),
    n = n(),
    se = sd_rating / sqrt(n),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  arrange(desc(mean_rating))
```

`summarize()` berechnet die Spalten der Reihe nach, deshalb kann `se` schon
auf `sd_rating` und `n` zugreifen und `lower` und `upper` auf `se`. Alle
sieben Marken haben ähnlich viele Bewertungen und eine ähnliche Streuung, und
so liegt der Standardfehler überall bei etwa 0,05. Die Grenzen reichen zwei
Standardfehler unter und über den Mittelwert, bei Bärenmarke von 0,89 bis
1,10 und bei Oatly von 0,38 bis 0,59.

### Die Faustregel: Mittelwert ± 2 Standardfehler

Das Intervall von zwei Standardfehlern unter bis zwei Standardfehlern über
dem Mittelwert ist ein ungefähres 95-%-Intervall: In etwa 95 von 100
Stichproben würde ein so gebautes Intervall den Mittelwert einschließen, den
man bekäme, wenn man alle Menschen befragen könnte, für die die Stichprobe
steht. Es beschreibt, wie genau der Mittelwert geschätzt ist, und nicht, wo
die einzelnen Antworten liegen; bei Oatly liegt keine einzige Bewertung
zwischen 0,38 und 0,59, weil die Skala nur ganze Stufen kennt.

> [!NOTE]
> Mittelwert ± 2 Standardfehler ist eine vereinfachte Faustregel und kein
> exakter Test. Sie beruht auf der Näherung durch die Normalverteilung, deren
> genauer Faktor 1,96 ist; bei kleinen Gruppen wäre er etwas größer, bei 36
> Personen 2,03. Außerdem setzt sie eine Zufallsstichprobe voraus, die
> Milchbefragung ist aber quotiert, und auch deshalb gibt das Intervall nur
> ein ungefähres Bild.

## Punkte mit Fehlerbalken

`geom_pointrange()` zeichnet für jede Gruppe einen Punkt beim Mittelwert und
eine Linie von `xmin` bis `xmax`. Die Tabelle von eben geht direkt in
`ggplot()`, und die Bildunterschrift sagt, was die Linien zeigen:

```r
survey |>
  filter(!is.na(brand_quality)) |>
  group_by(rated_brand) |>
  summarize(
    mean_rating = mean(brand_quality),
    se = sd(brand_quality) / sqrt(n()),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  ggplot() +
  aes(
    x = mean_rating,
    xmin = lower,
    xmax = upper,
    y = fct_reorder(rated_brand, mean_rating)
  ) +
  geom_pointrange() +
  labs(
    x = "Mean quality rating (-2 to +2)",
    y = NULL,
    caption = "Points: mean; lines: mean ± 2 standard errors"
  )
```

Jetzt sieht man, was die Balken verschwiegen haben: Die Intervalle der oberen
fünf Marken überlappen sich stark, sodass ihre Reihenfolge in einer anderen
Stichprobe gut anders ausfallen könnte, während Gut&Günstig und Oatly mit
Abstand darunter liegen. Anders als Balken müssen Punkte nicht bei null
beginnen, denn sie zeigen ihren Wert über die Lage und nicht über eine Länge.
Wenn du Querstriche an den Enden lieber magst, ersetze `geom_pointrange()`
durch die zwei Schichten `geom_errorbar(width = 0.2)` und `geom_point()`.

> [!IMPORTANT]
> Fehlerbalken können eine Standardabweichung, einen Standardfehler oder zwei
> Standardfehler zeigen, und ohne Angabe lässt sich ein solches Diagramm nicht
> lesen. Was die Linien bedeuten, gehört deshalb in die Beschriftung.

## Kleine Gruppen, breite Intervalle

Wie sehr die Fallzahl zählt, zeigen die Ernährungsweisen, deren Gruppen sehr
verschieden groß sind. Die Tabelle berechnet für die Aussage „Beim
Lebensmitteleinkauf bevorzuge ich Bio-Produkte“ (`prefers_organic`, −2 bis +2)
dieselben Kennzahlen je Ernährungsweise:

```r
survey |>
  filter(!is.na(diet), !is.na(prefers_organic)) |>
  group_by(diet) |>
  summarize(
    mean_rating = mean(prefers_organic),
    sd_rating = sd(prefers_organic),
    n = n(),
    se = sd_rating / sqrt(n),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  arrange(desc(n))
```

Die Standardabweichung ist bei Allesessern und Veganern fast gleich, 1,20 in
beiden Gruppen, und trotzdem ist der Standardfehler der Veganer rund siebenmal
so groß, 0,20 statt 0,028. Das liegt allein an der Fallzahl, denn 36 Veganern
stehen 1.819 Allesesser gegenüber, und die Wurzel aus dem Verhältnis der
beiden ist 7,1.

### Das Bild dazu

Derselbe Code wie bei den Marken, mit `diet` statt `rated_brand` und
`prefers_organic` statt `brand_quality`, zeichnet die Ernährungsweisen als
Punkte mit Fehlerbalken:

```r
survey |>
  filter(!is.na(diet), !is.na(prefers_organic)) |>
  group_by(diet) |>
  summarize(
    mean_rating = mean(prefers_organic),
    se = sd(prefers_organic) / sqrt(n()),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  ggplot() +
  aes(
    x = mean_rating,
    xmin = lower,
    xmax = upper,
    y = fct_reorder(diet, mean_rating)
  ) +
  geom_pointrange() +
  labs(
    x = "\"I prefer organic products\" (-2 to +2)",
    y = NULL,
    caption = "Points: mean; lines: mean ± 2 standard errors"
  )
```

Das Intervall der Veganer reicht von 0,60 bis 1,40 und ist damit 0,80 breit,
das der Allesesser nur 0,11. Der Mittelwert der Veganer ist der höchste, aber
wie hoch er unter allen Veganern läge, für die die Stichprobe steht, lässt
sich aus 36 Antworten nur grob sagen. Ersetze `prefers_organic` an allen
Stellen durch `eco_conscious`: Die Reihenfolge der mittleren Gruppen ändert
sich, die breiten Intervalle der kleinen Gruppen bleiben.

## Die Fallzahl gehört ins Bild

Ein Punkt mit schmalem und einer mit breitem Intervall wirken gleich
gewichtig, solange niemand weiß, auf wie vielen Antworten sie beruhen. Der
Code schreibt die Fallzahl deshalb in die Beschriftung jeder Gruppe, und
`paste0()` klebt dafür Name und Zahl zu einem Text zusammen:

```r
survey |>
  filter(!is.na(diet), !is.na(prefers_organic)) |>
  group_by(diet) |>
  summarize(
    mean_rating = mean(prefers_organic),
    n = n(),
    se = sd(prefers_organic) / sqrt(n),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  mutate(label = paste0(diet, " (n = ", n, ")")) |>
  ggplot() +
  aes(
    x = mean_rating,
    xmin = lower,
    xmax = upper,
    y = fct_reorder(label, mean_rating)
  ) +
  geom_pointrange() +
  labs(
    x = "\"I prefer organic products\" (-2 to +2)",
    y = NULL,
    caption = "Points: mean; lines: mean ± 2 standard errors"
  )
```

Jetzt liest man mit, dass der höchste Punkt auf 36 Menschen beruht, und das
breite Intervall hat seine Erklärung gleich daneben. Die Fallzahl in die
Beschriftung zu schreiben kostet eine Zeile und schützt davor, eine kleine
Gruppe wie eine große zu lesen.

## Was Überlappung bedeutet und was nicht

Es liegt nahe, zwei Intervalle wie einen Test zu lesen, als hieße Überlappen
„kein Unterschied“ und Getrenntsein „ein Unterschied“. Beides stimmt so nicht:

- **Überlappung beweist keine Gleichheit.** Die Intervalle von Bärenmarke
  (0,89 bis 1,10) und Milchhof Müller regional (0,74 bis 0,94) überlappen
  sich, und trotzdem würde ein statistischer Test den Unterschied von 0,15
  zwischen beiden als kaum zufällig einstufen, weil der Unterschied zweier
  Mittelwerte weniger unsicher ist, als die beiden Intervalle zusammen
  vermuten lassen. Bei Pescetariern und Veganern sagt die Überlappung vor
  allem, dass 36 Antworten je Gruppe zu wenige sind, um einen Unterschied zu
  erkennen oder auszuschließen.
- **Getrennte Intervalle sind noch kein Test.** Die Faustregel ist eine
  Näherung, und wer sieben Marken vergleicht, vergleicht 21 Paare, unter
  denen manches schon zufällig verschieden aussieht.

Ob ein Unterschied über den Zufall hinausgeht, beantwortet ein statistischer
Test, etwa der t-Test für zwei Mittelwerte. Das ist ein eigenes Thema der
statistischen Verfahren, die auf diese Lektion folgen; hier genügt es, dass
du Fehlerbalken als ehrliches Bild der Unsicherheit liest und nicht als
Urteil.

## Das Wichtigste

- Ein Mittelwert aus einer Stichprobe ist eine Schätzung, und ein Diagramm,
  das nur ihn zeigt, verschweigt, wie genau sie ist.
- Der Standardfehler ist die Standardabweichung geteilt durch die Wurzel der
  Fallzahl, sodass er mit der Streuung wächst und mit der Zahl der Antworten
  schrumpft, bei viermal so vielen Antworten auf die Hälfte.
- Mittelwert ± 2 Standardfehler ergibt als vereinfachte Faustregel ein
  ungefähres 95-%-Intervall für den Mittelwert, nicht für die einzelnen
  Antworten.
- `geom_pointrange()` zeigt Mittelwert und Intervall als Punkt mit Linie, und
  die Beschriftung sagt, was die Linie zeigt und auf wie vielen Antworten
  jeder Punkt beruht.
- Überlappende Intervalle beweisen keine Gleichheit und getrennte ersetzen
  keinen Test, denn ob ein Unterschied über den Zufall hinausgeht, entscheidet
  erst ein statistischer Test.

![Quiz: Unsicherheit zeigen](item:showing-uncertainty-quiz)

## Zum Weiterlesen

Claus O. Wilke: [[fundamentals-of-data-visualization]], darin Kapitel 16
„Visualizing uncertainty“, frei lesbar unter
<https://clauswilke.com/dataviz/visualizing-uncertainty.html>. Das Kapitel
zeigt neben Fehlerbalken weitere Formen, Unsicherheit darzustellen, und ist
wie das ganze Buch mit ggplot2 gebaut.
