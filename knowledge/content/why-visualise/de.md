---
type: lesson
code: 1792
title: Ein Plädoyer für die Datenvisualisierung
summary: >-
  Mittelwert, Standardabweichung und Korrelation fassen Daten zusammen und
  verlieren dabei ihre Form: Vier kleine Datensätze, neun Punktwolken und ein
  Dinosaurier mit denselben Kennzahlen zeigen, warum man Daten ansehen muss, bevor man ihren
  Zahlen glaubt.
objectives:
  intro: "In dieser Lektion siehst du, was Kennzahlen verschweigen, und kannst danach:"
  goals:
    - "erklären, welche Information Mittelwert, Standardabweichung und Korrelation behalten und welche sie verlieren"
    - "am Quartett von Anscombe zeigen, dass gleiche Kennzahlen zu völlig verschiedenen Daten gehören können"
    - "begründen, warum du Daten visualisieren solltest, bevor du ihren Kennzahlen glaubst"
level: 1
duration: 25
topics: [visualising-data, exploring-data]
modules: [ea]
datasets: [same-stats-shapes]
areas: [ds]
r_datasets: { datasaurus_dozen: datasaurus_dozen.csv }
relations:
  requires: [dplyr-summarize]
  see_also: [exploratory-data-analysis-basics, anscombe-quartet, same-stats-shapes, datasaurus-dozen]
status: published
updated: 2026-11-16
---

Eine Tabelle mit 2.809 Zeilen liest niemand Zeile für Zeile, deshalb fasst
man sie zusammen: Mit `summarize()` wird aus einer Spalte ein Mittelwert, eine
Standardabweichung oder, für zwei Spalten, eine Korrelation. Solche Kennzahlen
sind nützlich, weil sie viel in wenige Zahlen pressen, aber genau dabei geht
etwas verloren, nämlich die Form der Daten: wo sie sich häufen, ob sie in
Gruppen zerfallen, ob ein einzelner Wert alles verschiebt. Diese Lektion
zeigt an zwei berühmten Beispielen, wie viel das sein kann, und begründet
damit, warum der Rest dieses Lernpfads Daten zeigt, statt sie nur zu
beschreiben.

## Vier Datensätze, eine Zusammenfassung

Der Statistiker Francis Anscombe hat 1973 vier kleine Datensätze mit je elf
Punkten veröffentlicht, um seine Kollegen zu überzeugen, dass sie ihre Daten
zeichnen sollten. Sie liegen in R als Tabelle `anscombe` bereit, mit den
Spalten `x1` bis `x4` und `y1` bis `y4`; für andere Werkzeuge gibt es sie
als Datensatz [[anscombe-quartet]] zum Herunterladen. Die ersten Zeilen des Codes bringen
sie in die lange Form mit einer Spalte `set` für den Datensatz, wie du sie aus
der Lektion zu Tidy Data kennst; danach rechnet `summarize()` für jeden der
vier Datensätze Mittelwerte, Standardabweichungen und die Korrelation aus.

```r
anscombe |>
  pivot_longer(
    everything(),
    names_to = c(".value", "set"),
    names_pattern = "(.)(.)"
  ) |>
  group_by(set) |>
  summarize(
    mean_x = mean(x),
    mean_y = mean(y),
    sd_x = sd(x),
    sd_y = sd(y),
    r = cor(x, y)
  )
```

Alle vier haben denselben Mittelwert von x (9) und fast denselben von y
(7,50), dieselben Standardabweichungen (3,32 und 2,03) und dieselbe
Korrelation von 0,82. Wer nur diese Tabelle sieht, hält die vier Datensätze
für gleich.

### Dieselben Daten als Bild

Derselbe Anfang, aber statt `summarize()` ein Streudiagramm je Datensatz,
nebeneinander mit `facet_wrap()`, und in jedem die Gerade, die am besten zu
den Punkten passt:

```r
anscombe |>
  pivot_longer(
    everything(),
    names_to = c(".value", "set"),
    names_pattern = "(.)(.)"
  ) |>
  ggplot() +
  aes(x = x, y = y) +
  geom_point() +
  geom_smooth(method = "lm", formula = y ~ x, se = FALSE) +
  facet_wrap(vars(set))
```

Nur der erste Datensatz sieht aus, wie man es sich bei einer Korrelation von
0,82 vorstellt: eine Wolke, die schräg nach oben läuft. Im zweiten liegen die
Punkte auf einem Bogen, für den eine Gerade das falsche Modell ist. Im
dritten liegen zehn Punkte genau auf einer Geraden, und ein einziger
Ausreißer kippt sie. Im vierten haben zehn Punkte denselben x-Wert, und ein
einzelner Punkt rechts erzeugt die ganze Korrelation. Vier verschiedene
Geschichten stecken in derselben Zusammenfassung.

## Gleiche Zahlen, andere Bilder

Anscombe hat seine Datensätze von Hand gebaut. Justin Matejka und George
Fitzmaurice haben 2017 gezeigt, dass sich zu beliebigen Kennzahlen beliebig
viele Bilder finden lassen: Ein Programm verschiebt eine Punktwolke Punkt für
Punkt in Richtung einer Form und behält eine Verschiebung nur, wenn sich
Mittelwerte, Standardabweichungen und Korrelation auf zwei Nachkommastellen
nicht ändern. Der Demonstrator zeigt Formen, die nach diesem Verfahren
entstanden sind. Verbirg zuerst die Punkte und überlege anhand der
Kennzahlen, wie die Daten aussehen könnten; dann lass die Punkte von Form zu
Form wandern und achte darauf, was sich rechts an den Zahlen ändert.

![Gleiche Zahlen, andere Bilder](item:same-stats-demo)

Die Kennzahlen bleiben stehen, während aus der Wolke ein Kreis, ein Stern
oder ein Herz wird. Mit einem Mittelwert und einer Standardabweichung lässt
sich also nicht unterscheiden, ob Daten eine Wolke, zwei Linien oder eine
Zielscheibe bilden, und eine Korrelation nahe null heißt nicht, dass es
keinen Zusammenhang gibt, sondern nur, dass er keine Gerade ist. Die Punkte
aller Formen gibt es als Datensatz [[same-stats-shapes]], mit dem du die
Kennzahlen selbst nachrechnen und die Formen zeichnen kannst.

### Der Dinosaurier

Das berühmteste Beispiel für dieses Verfahren ist der Datasaurus Dozen. Der
Informationsdesigner Alberto Cairo hat 2016 einen Dinosaurier aus 142 Punkten
gezeichnet, und Matejka und Fitzmaurice haben ihn in zwölf weitere Bilder
verschoben. Die 13 Datensätze liegen als Tabelle `datasaurus_dozen` bereit,
mit einer Spalte `dataset` für das Bild und den Spalten `x` und `y`; zum
Herunterladen gibt es sie als Datensatz [[datasaurus-dozen]]. Zuerst wieder
die Kennzahlen:

```r
datasaurus_dozen |>
  group_by(dataset) |>
  summarize(
    mean_x = mean(x),
    mean_y = mean(y),
    sd_x = sd(x),
    sd_y = sd(y),
    r = cor(x, y)
  )
```

Auf eine Nachkommastelle gerundet steht in jeder der 13 Zeilen dasselbe:
54,3 und 47,8 für die Mittelwerte, 16,8 und 26,9 für die
Standardabweichungen, und die Korrelation liegt zwischen −0,06 und −0,07.
Nichts in dieser Tabelle verrät, dass in der Zeile `dino` ein Dinosaurier
steckt:

```r
datasaurus_dozen |>
  ggplot() +
  aes(x = x, y = y) +
  geom_point(size = 0.8) +
  facet_wrap(vars(dataset))
```

## Was daraus folgt

Kennzahlen sind nicht falsch, sie beantworten nur eine engere Frage, als man
ihnen oft zutraut. Daraus folgen drei Gewohnheiten für jede Auswertung:

- **Erst zeichnen, dann zusammenfassen.** Eine Grafik zeigt, ob ein
  Mittelwert die Daten überhaupt gut beschreibt oder ob Gruppen, Bögen und
  Ausreißer eine andere Zusammenfassung verlangen.
- **Nach dem Rechnen noch einmal zeichnen.** Eine Korrelation oder ein
  Gruppenvergleich ist erst glaubwürdig, wenn das Bild dazu passt.
- **Eine Kennzahl nie allein berichten.** Wer einen Mittelwert nennt, nennt
  die Streuung und die Zahl der Fälle mit oder zeigt die Verteilung gleich
  als Grafik.

Beim Erkunden wechseln sich deshalb Transformieren und Visualisieren ständig
ab, wie es die Lektion [[exploratory-data-analysis-basics]] als Kreislauf
beschreibt. Wie man zu einer Variable die passende Grafik findet und mit
ggplot2 baut, zeigt die nächste Lektion
[[data-visualisation-basics]].

## Das Wichtigste

- Mittelwert, Standardabweichung und Korrelation fassen Daten zusammen und
  verlieren dabei ihre Form.
- Die vier Datensätze von Anscombe haben dieselben Kennzahlen und sehen
  völlig verschieden aus: eine Wolke, ein Bogen, eine Gerade mit Ausreißer und
  ein einzelner Punkt, der die Korrelation erzeugt.
- Zu denselben Kennzahlen passen beliebig viele Bilder, wie der Datasaurus
  Dozen und die Formen des Demonstrators zeigen.
- Visualisiere Daten, bevor du ihren Kennzahlen glaubst, und nenne eine
  Kennzahl nie ohne Streuung und Fallzahl.

## Zum Weiterlesen

- [[anscombe-graphs-in-statistical-analysis]]: der Aufsatz mit dem Quartett,
  kurz und gut lesbar.
- [[matejka-same-stats-different-graphs]]: das Verfahren hinter den Formen
  des Demonstrators, mit dem „Datasaurus Dozen“.
